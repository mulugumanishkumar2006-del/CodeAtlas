import logging
from collections import defaultdict, deque
from typing import Dict, Any, List, Set, Tuple, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.schemas.repository import (
    ImpactTargetItem,
    ImpactEvidenceItem,
    ImpactNodeItem,
    ImpactEdgeItem,
    ImpactMetrics,
    ImpactAnalysisResponse,
    TargetDependencyItem,
    TargetDependencyResponse,
)

logger = logging.getLogger("codeatlas.impact_service")


class ImpactAnalysisService:
    """
    Production-quality Dependency and Impact Intelligence Engine for CodeAtlas.
    Provides deterministic upstream/downstream graph traversal, cycle detection,
    blast radius calculation, deterministic risk scoring, and line-level evidence tracing.
    """

    def __init__(self):
        self._cache: Dict[Tuple[str, str, str, int, str], ImpactAnalysisResponse] = {}

    def invalidate_cache(self, repository_id: Optional[str] = None):
        """Invalidate cached impact results for a repository or globally."""
        if repository_id:
            keys_to_del = [k for k in self._cache.keys() if k[0] == repository_id]
            for k in keys_to_del:
                self._cache.pop(k, None)
        else:
            self._cache.clear()

    async def resolve_target(
        self,
        db: AsyncSession,
        repository_id: str,
        target_id: str,
    ) -> Optional[ImpactTargetItem]:
        """
        Resolves target by UUID (File, Symbol, GraphNode) or by path/name string.
        Strictly repository-scoped.
        """
        clean_target = target_id.strip()

        # 1. Check if target_id is a File UUID or path
        stmt_file = select(File).where(File.repository_id == repository_id)
        if len(clean_target) == 36 and "-" in clean_target:
            stmt_file = stmt_file.where(File.id == clean_target)
        else:
            stmt_file = stmt_file.where(
                (File.path == clean_target) | (File.path.endswith("/" + clean_target))
            )
        
        file_res = await db.execute(stmt_file)
        target_file = file_res.scalars().first()
        if target_file:
            # Count symbols in file
            sym_stmt = select(Symbol).where(
                Symbol.repository_id == repository_id,
                Symbol.file_id == target_file.id,
            )
            sym_res = await db.execute(sym_stmt)
            symbols_count = len(sym_res.scalars().all())

            # Count direct dependencies and dependents
            dep_out_stmt = select(Dependency).where(
                Dependency.repository_id == repository_id,
                Dependency.source_file_id == target_file.id,
            )
            dep_in_stmt = select(Dependency).where(
                Dependency.repository_id == repository_id,
                Dependency.target_file_id == target_file.id,
            )
            out_deps = (await db.execute(dep_out_stmt)).scalars().all()
            in_deps = (await db.execute(dep_in_stmt)).scalars().all()

            return ImpactTargetItem(
                id=target_file.id,
                name=target_file.path,
                target_type="file",
                file_id=target_file.id,
                file_path=target_file.path,
                start_line=1,
                end_line=target_file.line_count or 1,
                symbol_count=symbols_count,
                direct_dependencies_count=len(out_deps),
                direct_dependents_count=len(in_deps),
            )

        # 2. Check if target_id is a Symbol UUID or qualified name / name
        stmt_sym = select(Symbol).where(Symbol.repository_id == repository_id)
        if len(clean_target) == 36 and "-" in clean_target:
            stmt_sym = stmt_sym.where(Symbol.id == clean_target)
        else:
            stmt_sym = stmt_sym.where(
                (Symbol.name == clean_target) | (Symbol.qualified_name == clean_target)
            )
        
        sym_res = await db.execute(stmt_sym)
        target_sym = sym_res.scalars().first()
        if target_sym:
            # Fetch containing file
            file_stmt = select(File).where(
                File.repository_id == repository_id,
                File.id == target_sym.file_id,
            )
            f_res = await db.execute(file_stmt)
            containing_file = f_res.scalars().first()
            f_path = containing_file.path if containing_file else "Unknown"

            # Direct callers / dependents via dependencies
            dep_in_stmt = select(Dependency).where(
                Dependency.repository_id == repository_id,
                Dependency.target_file_id == target_sym.file_id,
            )
            in_deps = (await db.execute(dep_in_stmt)).scalars().all()
            # Direct dependencies from containing file
            dep_out_stmt = select(Dependency).where(
                Dependency.repository_id == repository_id,
                Dependency.source_file_id == target_sym.file_id,
            )
            out_deps = (await db.execute(dep_out_stmt)).scalars().all()

            return ImpactTargetItem(
                id=target_sym.id,
                name=target_sym.name,
                target_type=target_sym.symbol_type.lower() if target_sym.symbol_type else "symbol",
                file_id=target_sym.file_id,
                file_path=f_path,
                qualified_name=target_sym.qualified_name,
                start_line=target_sym.start_line,
                end_line=target_sym.end_line,
                symbol_count=1,
                direct_dependencies_count=len(out_deps),
                direct_dependents_count=len(in_deps),
            )

        # 3. Check if target_id is a GraphNode
        stmt_node = select(GraphNode).where(GraphNode.repository_id == repository_id)
        if len(clean_target) == 36 and "-" in clean_target:
            stmt_node = stmt_node.where(GraphNode.id == clean_target)
        else:
            stmt_node = stmt_node.where(
                (GraphNode.node_key == clean_target) | (GraphNode.label == clean_target)
            )
        
        node_res = await db.execute(stmt_node)
        target_node = node_res.scalars().first()
        if target_node:
            if target_node.file_id:
                return await self.resolve_target(db, repository_id, target_node.file_id)
            if target_node.symbol_id:
                return await self.resolve_target(db, repository_id, target_node.symbol_id)

            return ImpactTargetItem(
                id=target_node.id,
                name=target_node.label,
                target_type=target_node.node_type.lower(),
                symbol_count=0,
                direct_dependencies_count=0,
                direct_dependents_count=0,
            )

        return None

    async def analyze_impact(
        self,
        db: AsyncSession,
        repository_id: str,
        target_id: str,
        direction: str = "both",
        max_depth: int = 3,
        limit: int = 500,
        index_version: str = "v1",
    ) -> ImpactAnalysisResponse:
        """
        Calculates real impact, dependencies, dependents, cycles, blast radius,
        and deterministic risk scores for a selected target.
        """
        # Validate inputs
        max_depth = max(1, min(max_depth, 10))
        limit = max(1, min(limit, 1000))
        direction = direction.lower() if direction in ["upstream", "downstream", "both"] else "both"

        # Check cache
        cache_key = (repository_id, target_id, direction, max_depth, index_version)
        if cache_key in self._cache:
            return self._cache[cache_key]

        # 1. Resolve target
        target = await self.resolve_target(db, repository_id, target_id)
        if not target:
            raise ValueError(f"Target '{target_id}' not found in repository '{repository_id}'.")

        # 2. Fetch all repository files and dependencies
        files_stmt = select(File).where(File.repository_id == repository_id)
        files_res = await db.execute(files_stmt)
        repo_files = files_res.scalars().all()
        file_by_id: Dict[str, File] = {f.id: f for f in repo_files}
        file_by_path: Dict[str, File] = {f.path: f for f in repo_files}

        symbols_stmt = select(Symbol).where(Symbol.repository_id == repository_id)
        symbols_res = await db.execute(symbols_stmt)
        repo_symbols = symbols_res.scalars().all()
        symbols_by_file_id: Dict[str, List[Symbol]] = defaultdict(list)
        for s in repo_symbols:
            symbols_by_file_id[s.file_id].append(s)

        deps_stmt = select(Dependency).where(Dependency.repository_id == repository_id)
        deps_res = await db.execute(deps_stmt)
        repo_deps = deps_res.scalars().all()

        # 3. Build Adjacency Graphs
        # outgoing: A -> B (A imports B; A depends on B)
        # incoming: B -> A (A imports B; changes to B affect A)
        outgoing: Dict[str, List[Tuple[str, Dependency]]] = defaultdict(list)
        incoming: Dict[str, List[Tuple[str, Dependency]]] = defaultdict(list)

        for dep in repo_deps:
            src_file = file_by_id.get(dep.source_file_id) if dep.source_file_id else None
            tgt_file = file_by_id.get(dep.target_file_id) if dep.target_file_id else None

            meta = dep.metadata_json or {}
            src_path = src_file.path if src_file else meta.get("source_path")
            tgt_path = tgt_file.path if tgt_file else meta.get("target_path") or dep.name

            if src_path and tgt_path and src_path != tgt_path:
                outgoing[src_path].append((tgt_path, dep))
                incoming[tgt_path].append((src_path, dep))

        # 4. Traversal Setup
        target_path = target.file_path or target.name
        visited_downstream: Dict[str, int] = {}
        visited_upstream: Dict[str, int] = {}
        detected_cycles: List[List[str]] = []
        seen_cycle_tuples: Set[Tuple[str, ...]] = set()

        direct_dependents: List[ImpactNodeItem] = []
        transitive_dependents: List[ImpactNodeItem] = []
        direct_dependencies: List[ImpactNodeItem] = []
        transitive_dependencies: List[ImpactNodeItem] = []

        all_nodes_dict: Dict[str, ImpactNodeItem] = {}
        all_edges: List[ImpactEdgeItem] = []
        edge_set: Set[Tuple[str, str, str]] = set()

        # Add target node
        target_node = ImpactNodeItem(
            id=target.id,
            label=target.name,
            node_type=target.target_type,
            depth=0,
            direction="target",
            file_path=target.file_path,
            file_id=target.file_id,
            start_line=target.start_line,
            end_line=target.end_line,
            properties={"symbol_count": target.symbol_count},
        )
        all_nodes_dict[target_path] = target_node

        # 5. DOWNSTREAM TRAVERSAL (Impact Analysis / Who depends on target)
        if direction in ["downstream", "both"]:
            queue: deque = deque([(target_path, 0, [target_path])])
            visited_downstream[target_path] = 0

            while queue:
                current_path, curr_depth, path_history = queue.popleft()
                if curr_depth >= max_depth:
                    continue

                for neighbor_path, dep in incoming.get(current_path, []):
                    # Cycle check along current branch
                    if neighbor_path in path_history:
                        cycle_path = path_history[path_history.index(neighbor_path):] + [neighbor_path]
                        cycle_tuple = tuple(cycle_path)
                        if cycle_tuple not in seen_cycle_tuples and len(cycle_path) > 2:
                            seen_cycle_tuples.add(cycle_tuple)
                            detected_cycles.append(cycle_path)
                        continue

                    next_depth = curr_depth + 1
                    is_new = neighbor_path not in visited_downstream
                    if is_new or next_depth < visited_downstream[neighbor_path]:
                        visited_downstream[neighbor_path] = next_depth

                        meta = dep.metadata_json or {}
                        neighbor_file = file_by_path.get(neighbor_path)
                        n_file_id = neighbor_file.id if neighbor_file else None
                        n_syms = symbols_by_file_id.get(n_file_id, []) if n_file_id else []

                        node_item = ImpactNodeItem(
                            id=n_file_id or neighbor_path,
                            label=neighbor_path,
                            node_type="file",
                            depth=next_depth,
                            direction="downstream",
                            file_path=neighbor_path,
                            file_id=n_file_id,
                            start_line=meta.get("start_line", 1),
                            end_line=meta.get("end_line", 1),
                            properties={"symbol_count": len(n_syms)},
                        )

                        if next_depth == 1:
                            direct_dependents.append(node_item)
                        else:
                            transitive_dependents.append(node_item)

                        if neighbor_path not in all_nodes_dict:
                            all_nodes_dict[neighbor_path] = node_item
                        else:
                            all_nodes_dict[neighbor_path].direction = "both"

                        # Edge: neighbor -> current (neighbor imports current)
                        edge_key = (neighbor_path, current_path, "IMPORTS")
                        if edge_key not in edge_set:
                            edge_set.add(edge_key)
                            evidence = ImpactEvidenceItem(
                                source=neighbor_path,
                                target=current_path,
                                relationship=dep.dependency_type or "IMPORTS",
                                file_path=neighbor_path,
                                file_id=n_file_id,
                                start_line=meta.get("start_line", 1),
                                end_line=meta.get("end_line", 1),
                                import_name=meta.get("import_name"),
                                confidence="HIGH" if next_depth == 1 else "MEDIUM",
                            )
                            all_edges.append(ImpactEdgeItem(
                                source=neighbor_path,
                                target=current_path,
                                relationship="IMPORTS",
                                depth=next_depth,
                                evidence=evidence,
                            ))

                        if len(all_nodes_dict) < limit:
                            queue.append((neighbor_path, next_depth, path_history + [neighbor_path]))

        # 6. UPSTREAM TRAVERSAL (Dependencies / What does target depend on)
        if direction in ["upstream", "both"]:
            queue_up: deque = deque([(target_path, 0, [target_path])])
            visited_upstream[target_path] = 0

            while queue_up:
                current_path, curr_depth, path_history = queue_up.popleft()
                if curr_depth >= max_depth:
                    continue

                for neighbor_path, dep in outgoing.get(current_path, []):
                    # Cycle check
                    if neighbor_path in path_history:
                        cycle_path = path_history[path_history.index(neighbor_path):] + [neighbor_path]
                        cycle_tuple = tuple(cycle_path)
                        if cycle_tuple not in seen_cycle_tuples and len(cycle_path) > 2:
                            seen_cycle_tuples.add(cycle_tuple)
                            detected_cycles.append(cycle_path)
                        continue

                    next_depth = curr_depth + 1
                    is_new = neighbor_path not in visited_upstream
                    if is_new or next_depth < visited_upstream[neighbor_path]:
                        visited_upstream[neighbor_path] = next_depth

                        meta = dep.metadata_json or {}
                        neighbor_file = file_by_path.get(neighbor_path)
                        n_file_id = neighbor_file.id if neighbor_file else None
                        n_syms = symbols_by_file_id.get(n_file_id, []) if n_file_id else []

                        node_item = ImpactNodeItem(
                            id=n_file_id or neighbor_path,
                            label=neighbor_path,
                            node_type="file",
                            depth=next_depth,
                            direction="upstream",
                            file_path=neighbor_path,
                            file_id=n_file_id,
                            start_line=meta.get("start_line", 1),
                            end_line=meta.get("end_line", 1),
                            properties={"symbol_count": len(n_syms)},
                        )

                        if next_depth == 1:
                            direct_dependencies.append(node_item)
                        else:
                            transitive_dependencies.append(node_item)

                        if neighbor_path not in all_nodes_dict:
                            all_nodes_dict[neighbor_path] = node_item
                        elif all_nodes_dict[neighbor_path].direction != "upstream":
                            all_nodes_dict[neighbor_path].direction = "both"

                        # Edge: current -> neighbor (current imports neighbor)
                        edge_key = (current_path, neighbor_path, "IMPORTS")
                        if edge_key not in edge_set:
                            edge_set.add(edge_key)
                            curr_file = file_by_path.get(current_path)
                            evidence = ImpactEvidenceItem(
                                source=current_path,
                                target=neighbor_path,
                                relationship=dep.dependency_type or "IMPORTS",
                                file_path=current_path,
                                file_id=curr_file.id if curr_file else None,
                                start_line=meta.get("start_line", 1),
                                end_line=meta.get("end_line", 1),
                                import_name=meta.get("import_name"),
                                confidence="HIGH" if next_depth == 1 else "MEDIUM",
                            )
                            all_edges.append(ImpactEdgeItem(
                                source=current_path,
                                target=neighbor_path,
                                relationship="IMPORTS",
                                depth=next_depth,
                                evidence=evidence,
                            ))

                        if len(all_nodes_dict) < limit:
                            queue_up.append((neighbor_path, next_depth, path_history + [neighbor_path]))

        # 7. Calculate Blast Radius & Deterministic Risk Scoring
        downstream_paths = {p for p, d in visited_downstream.items() if d > 0}
        affected_files_count = len(downstream_paths)
        if target.target_type == "file":
            affected_files_count += 1  # include self

        affected_symbols_count = sum(
            len(symbols_by_file_id.get(file_by_path[p].id, []))
            for p in downstream_paths if p in file_by_path
        )
        if target.target_type in ["symbol", "function", "class", "method"]:
            affected_symbols_count += 1

        actual_max_depth = max(visited_downstream.values()) if visited_downstream else 0
        direct_dep_count = len(direct_dependents)
        indirect_dep_count = len(transitive_dependents)

        # Deterministic formula
        risk_score = (
            (direct_dep_count * 2.5) +
            (indirect_dep_count * 1.2) +
            (len(downstream_paths) * 2.0) +
            (actual_max_depth * 1.5) +
            (len(detected_cycles) * 2.0)
        )

        risk_reasons: List[str] = []
        if direct_dep_count >= 4 or len(downstream_paths) >= 5 or risk_score >= 12.0 or (actual_max_depth >= 3 and len(downstream_paths) >= 3):
            risk = "HIGH"
        elif direct_dep_count >= 1 or len(downstream_paths) >= 2 or risk_score >= 4.0:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        if direct_dep_count > 0:
            dep_examples = [d.label for d in direct_dependents[:3]]
            risk_reasons.append(f"{direct_dep_count} direct dependents ({', '.join(dep_examples)}{'...' if direct_dep_count > 3 else ''})")
        else:
            risk_reasons.append("No direct incoming dependents (isolated entity)")

        if indirect_dep_count > 0:
            risk_reasons.append(f"{indirect_dep_count} indirect dependents across downstream components")

        if len(downstream_paths) > 0:
            risk_reasons.append(f"Blast radius spans {len(downstream_paths)} affected files and ~{affected_symbols_count} AST symbols")

        if actual_max_depth > 1:
            risk_reasons.append(f"Maximum downstream propagation depth of {actual_max_depth}")

        if detected_cycles:
            risk_reasons.append(f"{len(detected_cycles)} dependency cycle(s) detected in component tree")

        confidence = "HIGH" if actual_max_depth <= 2 else "MEDIUM"

        impact_metrics = ImpactMetrics(
            affected_files=affected_files_count,
            affected_symbols=affected_symbols_count,
            max_depth=actual_max_depth,
            direct_dependents=direct_dep_count,
            indirect_dependents=indirect_dep_count,
            direct_dependencies=len(direct_dependencies),
            indirect_dependencies=len(transitive_dependencies),
            risk=risk,
            risk_score=round(risk_score, 1),
            risk_reasons=risk_reasons,
            confidence=confidence,
        )

        # 8. Check Truncation
        total_nodes_found = len(all_nodes_dict)
        is_truncated = total_nodes_found >= limit
        nodes_list = list(all_nodes_dict.values())[:limit]

        response = ImpactAnalysisResponse(
            repository_id=repository_id,
            target=target,
            direction=direction,
            max_depth=max_depth,
            nodes=nodes_list,
            edges=all_edges[:limit * 2],
            direct_dependencies=direct_dependencies,
            direct_dependents=direct_dependents,
            transitive_dependencies=transitive_dependencies,
            transitive_dependents=transitive_dependents,
            impact=impact_metrics,
            cycles=detected_cycles,
            is_truncated=is_truncated,
            total_nodes_found=total_nodes_found,
        )

        # Cache response
        self._cache[cache_key] = response
        return response

    async def get_target_dependencies(
        self,
        db: AsyncSession,
        repository_id: str,
        target_id: str,
    ) -> TargetDependencyResponse:
        """
        Returns structured direct and transitive dependencies and dependents for a target.
        """
        impact_data = await self.analyze_impact(
            db=db,
            repository_id=repository_id,
            target_id=target_id,
            direction="both",
            max_depth=3,
        )

        direct_deps = [
            TargetDependencyItem(
                id=n.id,
                name=n.label,
                target_type=n.node_type,
                file_path=n.file_path,
                depth=n.depth,
                relationship_type="IMPORTS",
            ) for n in impact_data.direct_dependencies
        ]
        direct_dependents = [
            TargetDependencyItem(
                id=n.id,
                name=n.label,
                target_type=n.node_type,
                file_path=n.file_path,
                depth=n.depth,
                relationship_type="IMPORTS",
            ) for n in impact_data.direct_dependents
        ]
        transitive_deps = [
            TargetDependencyItem(
                id=n.id,
                name=n.label,
                target_type=n.node_type,
                file_path=n.file_path,
                depth=n.depth,
                relationship_type="IMPORTS",
            ) for n in impact_data.transitive_dependencies
        ]
        transitive_dependents = [
            TargetDependencyItem(
                id=n.id,
                name=n.label,
                target_type=n.node_type,
                file_path=n.file_path,
                depth=n.depth,
                relationship_type="IMPORTS",
            ) for n in impact_data.transitive_dependents
        ]

        return TargetDependencyResponse(
            repository_id=repository_id,
            target=impact_data.target,
            direct_dependencies=direct_deps,
            direct_dependents=direct_dependents,
            transitive_dependencies=transitive_deps,
            transitive_dependents=transitive_dependents,
        )


# Singleton
impact_service = ImpactAnalysisService()
