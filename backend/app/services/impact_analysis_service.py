import logging
import re
from pathlib import Path
from collections import defaultdict, deque
from typing import Dict, Any, List, Set, Tuple, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.schemas.repository import (
    ImpactTargetItem,
    ImpactEvidenceItem,
    ImpactNodeItem,
    ImpactEdgeItem,
    CallItem,
    AffectedApiItem,
    AffectedTestItem,
    BoundaryCrossingItem,
    UncertaintyItem,
    ImpactMetrics,
    ImpactAnalysisResponse,
    TargetDependencyItem,
    TargetDependencyResponse,
)
from backend.app.services.architecture_intelligence_service import architecture_intelligence_service

logger = logging.getLogger("codeatlas.impact_service")


class ImpactAnalysisService:
    """
    Phase 19: Comprehensive Dependency and Impact Intelligence Engine for CodeAtlas.
    
    Determines the likely impact of changing a real repository element across
    12 distinct impact dimensions:
    1. Direct Dependents
    2. Indirect / Transitive Dependents
    3. Callers (What calls it?)
    4. Callees (What does it call?)
    5. Affected Files
    6. Affected Modules
    7. Affected APIs
    8. Affected Tests
    9. Affected Dependencies
    10. Architecture Boundaries Crossed
    11. Evidence Tracing (Line-level & Confidence)
    12. Uncertainty Analysis (Dynamic dispatch, wildcard imports, untested elements)
    """

    SUPPORTED_TARGET_TYPES = {
        "FILE",
        "SYMBOL",
        "CLASS",
        "FUNCTION",
        "METHOD",
        "MODULE",
        "API",
        "DEPENDENCY",
        "COMPONENT",
    }

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

    # =========================================================================
    # 1. NORMALIZED IMPACT TARGET RESOLUTION
    # =========================================================================

    async def resolve_target(
        self,
        db: AsyncSession,
        repository_id: str,
        target_id: str,
        target_type: Optional[str] = None,
    ) -> Optional[ImpactTargetItem]:
        """
        Resolves a normalized impact target with strict repository isolation and database identity.
        Possible targets:
        FILE, SYMBOL, CLASS, FUNCTION, METHOD, MODULE, API, DEPENDENCY, COMPONENT.
        Target contains: repository_id, target_type, target_id, name, file_path, symbol_id (where applicable).
        """
        clean_target = target_id.strip()

        # Check for type prefix like "file:foo.py", "function:bar", "class:Baz"
        inferred_type = target_type.upper() if target_type else None
        for pfx in ["file:", "symbol:", "class:", "function:", "method:", "module:", "api:", "dependency:", "component:"]:
            if clean_target.lower().startswith(pfx):
                inferred_type = pfx[:-1].upper()
                clean_target = clean_target[len(pfx):].strip()
                break

        # Fetch Repository model for profile / metadata
        repo_stmt = select(Repository).where(Repository.id == repository_id)
        repo_res = await db.execute(repo_stmt)
        repo = repo_res.scalars().first()
        repo_meta = (repo.metadata_json or {}) if repo else {}
        profile = repo_meta.get("universal_profile") or repo_meta.get("profile") or {}

        # ---------------------------------------------------------------------
        # 1.1 Resolution by File
        # ---------------------------------------------------------------------
        if not inferred_type or inferred_type == "FILE":
            norm_tgt = clean_target.replace("\\", "/")
            stmt_file = select(File).where(
                File.repository_id == repository_id,
                (File.id == clean_target) |
                (File.path == norm_tgt) |
                (File.path.endswith("/" + norm_tgt)) |
                (File.path == norm_tgt.lstrip("/"))
            )
            
            file_res = await db.execute(stmt_file)
            target_file = file_res.scalars().first()
            if target_file:
                sym_stmt = select(Symbol).where(
                    Symbol.repository_id == repository_id,
                    Symbol.file_id == target_file.id,
                )
                sym_res = await db.execute(sym_stmt)
                symbols_count = len(sym_res.scalars().all())

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
                    repository_id=repository_id,
                    target_type="FILE",
                    target_id=target_file.id,
                    name=target_file.path,
                    file_id=target_file.id,
                    file_path=target_file.path,
                    start_line=1,
                    end_line=target_file.line_count or 1,
                    symbol_count=symbols_count,
                    direct_dependencies_count=len(out_deps),
                    direct_dependents_count=len(in_deps),
                    metadata={"language": target_file.language, "size_bytes": target_file.size_bytes},
                )

        # ---------------------------------------------------------------------
        # 1.2 Resolution by Symbol / Class / Function / Method
        # ---------------------------------------------------------------------
        if not inferred_type or inferred_type in ["SYMBOL", "CLASS", "FUNCTION", "METHOD"]:
            stmt_sym = select(Symbol).where(
                Symbol.repository_id == repository_id,
                (Symbol.id == clean_target) |
                (Symbol.name == clean_target) |
                (Symbol.qualified_name == clean_target)
            )

            if inferred_type in ["CLASS", "FUNCTION", "METHOD"]:
                if inferred_type == "FUNCTION":
                    stmt_sym = stmt_sym.where(Symbol.symbol_type.in_(["function", "async_function"]))
                else:
                    stmt_sym = stmt_sym.where(Symbol.symbol_type == inferred_type.lower())

            sym_res = await db.execute(stmt_sym)
            target_sym = sym_res.scalars().first()
            if target_sym:
                f_stmt = select(File).where(
                    File.repository_id == repository_id,
                    File.id == target_sym.file_id,
                )
                f_res = await db.execute(f_stmt)
                containing_file = f_res.scalars().first()
                f_path = containing_file.path if containing_file else "Unknown"

                dep_in_stmt = select(Dependency).where(
                    Dependency.repository_id == repository_id,
                    Dependency.target_file_id == target_sym.file_id,
                )
                in_deps = (await db.execute(dep_in_stmt)).scalars().all()

                dep_out_stmt = select(Dependency).where(
                    Dependency.repository_id == repository_id,
                    Dependency.source_file_id == target_sym.file_id,
                )
                out_deps = (await db.execute(dep_out_stmt)).scalars().all()

                norm_sym_type = (target_sym.symbol_type or "SYMBOL").upper()
                if norm_sym_type == "ASYNC_FUNCTION":
                    norm_sym_type = "FUNCTION"

                return ImpactTargetItem(
                    id=target_sym.id,
                    repository_id=repository_id,
                    target_type=norm_sym_type,
                    target_id=target_sym.id,
                    name=target_sym.name,
                    file_id=target_sym.file_id,
                    file_path=f_path,
                    symbol_id=target_sym.id,
                    qualified_name=target_sym.qualified_name,
                    start_line=target_sym.start_line,
                    end_line=target_sym.end_line,
                    symbol_count=1,
                    direct_dependencies_count=len(out_deps),
                    direct_dependents_count=len(in_deps),
                    metadata=target_sym.ast_metadata or {},
                )

        # ---------------------------------------------------------------------
        # 1.3 Resolution by API Endpoint
        # ---------------------------------------------------------------------
        if not inferred_type or inferred_type == "API":
            api_endpoints = profile.get("api_endpoints", [])
            matched_ep = None
            for ep in api_endpoints:
                route = ep.get("route") or ep.get("path") or ""
                method = (ep.get("method") or ep.get("http_method") or "GET").upper()
                ep_key = f"{method} {route}".strip()
                if clean_target.lower() in [ep_key.lower(), route.lower()] or \
                   clean_target.replace("/", "_").lower() in ep_key.replace("/", "_").lower():
                    matched_ep = ep
                    break

            if matched_ep:
                ep_file = matched_ep.get("file_path", "")
                f_res = await db.execute(select(File).where(File.repository_id == repository_id, File.path == ep_file))
                f_obj = f_res.scalars().first()
                api_id = f"api:{repository_id}:{matched_ep.get('method', 'GET')}_{matched_ep.get('route', '')}"

                return ImpactTargetItem(
                    id=api_id,
                    repository_id=repository_id,
                    target_type="API",
                    target_id=api_id,
                    name=f"{matched_ep.get('method', 'GET')} {matched_ep.get('route') or matched_ep.get('path')}",
                    file_id=f_obj.id if f_obj else None,
                    file_path=ep_file,
                    start_line=matched_ep.get("line", 1),
                    end_line=matched_ep.get("line", 1),
                    metadata=matched_ep,
                )

        # ---------------------------------------------------------------------
        # 1.4 Resolution by Module
        # ---------------------------------------------------------------------
        if not inferred_type or inferred_type == "MODULE":
            # Check GraphNode
            node_stmt = select(GraphNode).where(
                GraphNode.repository_id == repository_id,
                GraphNode.node_type == "module",
                (GraphNode.label == clean_target) | (GraphNode.node_key.endswith(clean_target))
            )
            node_res = await db.execute(node_stmt)
            mod_node = node_res.scalars().first()
            if mod_node:
                return ImpactTargetItem(
                    id=mod_node.id,
                    repository_id=repository_id,
                    target_type="MODULE",
                    target_id=mod_node.id,
                    name=mod_node.label,
                    file_path=mod_node.properties.get("module_path") if mod_node.properties else mod_node.label,
                    metadata=mod_node.properties or {},
                )

            # Check if directory path in files
            dir_prefix = clean_target.rstrip("/\\") + "/"
            file_in_dir_stmt = select(File).where(
                File.repository_id == repository_id,
                File.path.startswith(dir_prefix)
            )
            mod_files = (await db.execute(file_in_dir_stmt)).scalars().all()
            if mod_files:
                first_f = mod_files[0]
                mod_id = f"mod:{repository_id}:{clean_target.replace('/', '_').lower()}"
                return ImpactTargetItem(
                    id=mod_id,
                    repository_id=repository_id,
                    target_type="MODULE",
                    target_id=mod_id,
                    name=clean_target,
                    file_path=first_f.path,
                    symbol_count=len(mod_files),
                    metadata={"file_count": len(mod_files), "directory": clean_target},
                )

        # ---------------------------------------------------------------------
        # 1.5 Resolution by Dependency
        # ---------------------------------------------------------------------
        if not inferred_type or inferred_type == "DEPENDENCY":
            dep_stmt = select(Dependency).where(Dependency.repository_id == repository_id)
            if len(clean_target) == 36 and "-" in clean_target:
                dep_stmt = dep_stmt.where(Dependency.id == clean_target)
            else:
                dep_stmt = dep_stmt.where(Dependency.name == clean_target)
            dep_res = await db.execute(dep_stmt)
            target_dep = dep_res.scalars().first()
            if target_dep:
                src_f = None
                if target_dep.source_file_id:
                    f_res = await db.execute(select(File).where(File.id == target_dep.source_file_id))
                    src_f = f_res.scalars().first()

                return ImpactTargetItem(
                    id=target_dep.id,
                    repository_id=repository_id,
                    target_type="DEPENDENCY",
                    target_id=target_dep.id,
                    name=target_dep.name,
                    file_id=target_dep.source_file_id,
                    file_path=src_f.path if src_f else "Unknown",
                    metadata={"dependency_type": target_dep.dependency_type, "version": getattr(target_dep, "version_spec", None)},
                )

        # ---------------------------------------------------------------------
        # 1.6 Resolution by Architecture Component
        # ---------------------------------------------------------------------
        if not inferred_type or inferred_type == "COMPONENT":
            node_stmt = select(GraphNode).where(
                GraphNode.repository_id == repository_id,
                GraphNode.node_type.in_(["component", "service"]),
                (GraphNode.id == clean_target) | (GraphNode.label == clean_target) | (GraphNode.node_key.endswith(clean_target))
            )
            node_res = await db.execute(node_stmt)
            comp_node = node_res.scalars().first()
            if comp_node:
                f_path = None
                if comp_node.file_id:
                    f_res = await db.execute(select(File).where(File.id == comp_node.file_id))
                    f_obj = f_res.scalars().first()
                    f_path = f_obj.path if f_obj else None

                return ImpactTargetItem(
                    id=comp_node.id,
                    repository_id=repository_id,
                    target_type="COMPONENT",
                    target_id=comp_node.id,
                    name=comp_node.label,
                    file_id=comp_node.file_id,
                    file_path=f_path,
                    metadata=comp_node.properties or {},
                )

        # ---------------------------------------------------------------------
        # 1.7 Fallback GraphNode Match
        # ---------------------------------------------------------------------
        node_stmt = select(GraphNode).where(
            GraphNode.repository_id == repository_id,
            (GraphNode.id == clean_target) | (GraphNode.node_key == clean_target) | (GraphNode.label == clean_target)
        )
        node_res = await db.execute(node_stmt)
        generic_node = node_res.scalars().first()
        if generic_node:
            if generic_node.file_id:
                return await self.resolve_target(db, repository_id, generic_node.file_id, "FILE")
            if generic_node.symbol_id:
                return await self.resolve_target(db, repository_id, generic_node.symbol_id, "SYMBOL")

            return ImpactTargetItem(
                id=generic_node.id,
                repository_id=repository_id,
                target_type="COMPONENT",
                target_id=generic_node.id,
                name=generic_node.label,
                metadata=generic_node.properties or {},
            )

        return None

    # =========================================================================
    # 2. CORE IMPACT ANALYSIS (12 DIMENSIONS)
    async def calculate_impact(
        self,
        db: AsyncSession,
        repository_id: str,
        target_identifier: Optional[str] = None,
        target_id: Optional[str] = None,
        target_type: Optional[str] = None,
        direction: str = "both",
        max_depth: int = 3,
        limit: int = 500,
        index_version: str = "v1",
    ) -> ImpactAnalysisResponse:
        """Alias method for analyze_impact supporting target_identifier."""
        tid = target_identifier or target_id or ""
        return await self.analyze_impact(
            db=db,
            repository_id=repository_id,
            target_id=tid,
            target_type=target_type,
            direction=direction,
            max_depth=max_depth,
            limit=limit,
            index_version=index_version,
        )

    async def analyze_impact(
        self,
        db: AsyncSession,
        repository_id: str,
        target_id: str,
        target_type: Optional[str] = None,
        direction: str = "both",
        max_depth: int = 3,
        limit: int = 500,
        index_version: str = "v1",
    ) -> ImpactAnalysisResponse:
        """
        Calculates and explains the 12 impact dimensions for any normalized repository element:
        1. Direct Dependents
        2. Indirect Dependents
        3. Callers (What calls it?)
        4. Callees (What does it call?)
        5. Affected Files
        6. Affected Modules
        7. Affected APIs
        8. Affected Tests
        9. Affected Dependencies
        10. Architecture Boundaries Crossed
        11. Evidence Tracing
        12. Uncertainty Analysis
        """
        max_depth = max(1, min(max_depth, 10))
        limit = max(1, min(limit, 1000))
        direction = direction.lower() if direction in ["upstream", "downstream", "both"] else "both"

        cache_key = (repository_id, f"{target_type}:{target_id}", direction, max_depth, index_version)
        if cache_key in self._cache:
            return self._cache[cache_key]

        # 1. Resolve target
        target = await self.resolve_target(db, repository_id, target_id, target_type)
        if not target:
            raise ValueError(f"Target '{target_id}' not found in repository '{repository_id}'.")

        # 2. Fetch repository context
        repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
        repo = repo_res.scalars().first()
        clone_path = repo.clone_path if repo else None
        repo_meta = (repo.metadata_json or {}) if repo else {}
        profile = repo_meta.get("universal_profile") or repo_meta.get("profile") or {}
        api_endpoints = profile.get("api_endpoints", [])

        files_res = await db.execute(select(File).where(File.repository_id == repository_id))
        repo_files = files_res.scalars().all()
        file_by_id: Dict[str, File] = {f.id: f for f in repo_files}
        file_by_path: Dict[str, File] = {f.path: f for f in repo_files}

        symbols_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id))
        repo_symbols = symbols_res.scalars().all()
        symbols_by_file_id: Dict[str, List[Symbol]] = defaultdict(list)
        for s in repo_symbols:
            symbols_by_file_id[s.file_id].append(s)

        deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
        repo_deps = deps_res.scalars().all()

        # 3. Build Adjacency Graphs
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

        target_node = ImpactNodeItem(
            id=target.id,
            label=target.name,
            node_type=target.target_type.lower(),
            depth=0,
            direction="target",
            file_path=target.file_path,
            file_id=target.file_id,
            start_line=target.start_line,
            end_line=target.end_line,
            properties={"symbol_count": target.symbol_count, "symbol_id": target.symbol_id},
        )
        all_nodes_dict[target_path] = target_node

        # ---------------------------------------------------------------------
        # 5. Downstream Traversal (Who depends on target)
        # ---------------------------------------------------------------------
        if direction in ["downstream", "both"]:
            queue: deque = deque([(target_path, 0, [target_path])])
            visited_downstream[target_path] = 0

            while queue:
                current_path, curr_depth, path_history = queue.popleft()
                if curr_depth >= max_depth:
                    continue

                for neighbor_path, dep in incoming.get(current_path, []):
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

                        edge_key = (neighbor_path, current_path, "IMPORTS")
                        if edge_key not in edge_set:
                            edge_set.add(edge_key)
                            evidence = ImpactEvidenceItem(
                                source=neighbor_path,
                                target=current_path,
                                relationship="IMPORTS" if (dep.dependency_type or "").upper() in ["IMPORT", "IMPORTS"] else (dep.dependency_type or "IMPORTS"),
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

        # ---------------------------------------------------------------------
        # 6. Upstream Traversal (What does target depend on)
        # ---------------------------------------------------------------------
        if direction in ["upstream", "both"]:
            queue_up: deque = deque([(target_path, 0, [target_path])])
            visited_upstream[target_path] = 0

            while queue_up:
                current_path, curr_depth, path_history = queue_up.popleft()
                if curr_depth >= max_depth:
                    continue

                for neighbor_path, dep in outgoing.get(current_path, []):
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

                        edge_key = (current_path, neighbor_path, "IMPORTS")
                        if edge_key not in edge_set:
                            edge_set.add(edge_key)
                            curr_file = file_by_path.get(current_path)
                            evidence = ImpactEvidenceItem(
                                source=current_path,
                                target=neighbor_path,
                                relationship="IMPORTS" if (dep.dependency_type or "").upper() in ["IMPORT", "IMPORTS"] else (dep.dependency_type or "IMPORTS"),
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

        # ---------------------------------------------------------------------
        # 7. Callers & Callees Discovery (Dimensions 3 & 4)
        # ---------------------------------------------------------------------
        callers, callees = await self._find_callers_and_callees(
            db=db,
            repository_id=repository_id,
            target=target,
            repo_files=repo_files,
            repo_symbols=repo_symbols,
            file_by_path=file_by_path,
            clone_path=clone_path,
        )

        # ---------------------------------------------------------------------
        # 8. Affected Files & Modules (Dimensions 5 & 6)
        # ---------------------------------------------------------------------
        affected_files_set = {p for p, d in visited_downstream.items() if d > 0}
        if target.file_path:
            affected_files_set.add(target.file_path)
        for c in callers:
            if c.file_path:
                affected_files_set.add(c.file_path)

        affected_files_list = sorted(list(affected_files_set))

        affected_modules_set = set()
        for fp in affected_files_list:
            parts = fp.replace("\\", "/").split("/")
            if len(parts) > 1:
                affected_modules_set.add("/".join(parts[:-1]))
            else:
                affected_modules_set.add("root")
        affected_modules_list = sorted(list(affected_modules_set))

        # ---------------------------------------------------------------------
        # 9. Affected APIs & Tests (Dimensions 7 & 8)
        # ---------------------------------------------------------------------
        affected_apis = self._find_affected_apis(
            target=target,
            affected_file_paths=affected_files_set,
            callers=callers,
            api_endpoints=api_endpoints,
        )

        affected_tests = self._find_affected_tests(
            target=target,
            affected_file_paths=affected_files_set,
            repo_files=repo_files,
            file_by_path=file_by_path,
        )

        # ---------------------------------------------------------------------
        # 10. Affected Dependencies (Dimension 9)
        # ---------------------------------------------------------------------
        affected_deps_set = set()
        for dep in repo_deps:
            src_f = file_by_id.get(dep.source_file_id)
            tgt_f = file_by_id.get(dep.target_file_id)
            if (src_f and src_f.path in affected_files_set) or (tgt_f and tgt_f.path in affected_files_set):
                affected_deps_set.add(dep.name)
        affected_dependencies_list = sorted(list(affected_deps_set))

        # ---------------------------------------------------------------------
        # 11. Architecture Boundaries Crossed (Dimension 10)
        # ---------------------------------------------------------------------
        boundaries_crossed = self._find_boundary_crossings(
            target=target,
            all_edges=all_edges,
            file_by_path=file_by_path,
        )

        # ---------------------------------------------------------------------
        # 12. Evidence & Uncertainty (Dimensions 11 & 12)
        # ---------------------------------------------------------------------
        all_evidence = [e.evidence for e in all_edges if e.evidence]

        # Call evidence
        for c in callers:
            if c.file_path and target.file_path:
                all_evidence.append(ImpactEvidenceItem(
                    source=c.file_path,
                    target=target.file_path,
                    relationship="CALLS",
                    file_path=c.file_path,
                    start_line=c.line_number or 1,
                    end_line=c.line_number or 1,
                    import_name=c.name,
                    confidence="HIGH",
                ))

        uncertainties = self._analyze_uncertainty(
            target=target,
            affected_files=affected_files_list,
            affected_tests=affected_tests,
            repo_files=repo_files,
            clone_path=clone_path,
        )

        # ---------------------------------------------------------------------
        # 13. Metrics & Deterministic Risk Scoring
        # ---------------------------------------------------------------------
        actual_max_depth = max(visited_downstream.values()) if visited_downstream else 0
        direct_dep_count = len(direct_dependents)
        indirect_dep_count = len(transitive_dependents)

        affected_symbols_count = sum(
            len(symbols_by_file_id.get(file_by_path[p].id, []))
            for p in affected_files_set if p in file_by_path
        )
        if target.target_type in ["SYMBOL", "FUNCTION", "CLASS", "METHOD"]:
            affected_symbols_count += 1

        risk_score = (
            (direct_dep_count * 2.5) +
            (indirect_dep_count * 1.2) +
            (len(affected_files_set) * 2.0) +
            (actual_max_depth * 1.5) +
            (len(detected_cycles) * 2.0) +
            (len(affected_apis) * 3.0) +
            (len(boundaries_crossed) * 1.5)
        )

        risk_reasons: List[str] = []
        if direct_dep_count >= 4 or len(affected_files_set) >= 5 or risk_score >= 12.0 or len(affected_apis) >= 2:
            risk = "HIGH"
        elif direct_dep_count >= 1 or len(affected_files_set) >= 2 or risk_score >= 4.0:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        if direct_dep_count > 0:
            dep_examples = [d.label for d in direct_dependents[:3]]
            risk_reasons.append(f"{direct_dep_count} direct dependents ({', '.join(dep_examples)}{'...' if direct_dep_count > 3 else ''})")
        else:
            risk_reasons.append("No direct incoming dependents")

        if indirect_dep_count > 0:
            risk_reasons.append(f"{indirect_dep_count} indirect dependents across propagation tree")

        if len(affected_files_set) > 0:
            risk_reasons.append(f"Blast radius spans {len(affected_files_set)} affected files (~{affected_symbols_count} symbols)")

        if callers:
            risk_reasons.append(f"{len(callers)} incoming call site(s) invoking target")

        if affected_apis:
            api_names = [f"{a.method} {a.path}" for a in affected_apis[:2]]
            risk_reasons.append(f"{len(affected_apis)} exposed API endpoint(s) impacted ({', '.join(api_names)})")

        if boundaries_crossed:
            risk_reasons.append(f"{len(boundaries_crossed)} architectural layer boundary crossing(s)")

        if detected_cycles:
            risk_reasons.append(f"{len(detected_cycles)} circular dependency cycle(s) detected")

        if not affected_tests:
            risk_reasons.append("0 automated tests cover this element (high regression uncertainty)")

        confidence = "HIGH" if actual_max_depth <= 2 and len(uncertainties) <= 1 else "MEDIUM"

        impact_metrics = ImpactMetrics(
            affected_files=len(affected_files_set),
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
            callers=callers,
            callees=callees,
            affected_files=affected_files_list,
            affected_modules=affected_modules_list,
            affected_apis=affected_apis,
            affected_tests=affected_tests,
            affected_dependencies=affected_dependencies_list,
            boundaries_crossed=boundaries_crossed,
            evidence=all_evidence[:limit * 2],
            uncertainty=uncertainties,
        )

        # Generate structured explanation
        response.explanation = self.generate_explanation(response)

        self._cache[cache_key] = response
        return response

    # =========================================================================
    # 3. CALL HIERARCHY (CALLERS & CALLEES)
    # =========================================================================

    async def _find_callers_and_callees(
        self,
        db: AsyncSession,
        repository_id: str,
        target: ImpactTargetItem,
        repo_files: List[File],
        repo_symbols: List[Symbol],
        file_by_path: Dict[str, File],
        clone_path: Optional[str] = None,
    ) -> Tuple[List[CallItem], List[CallItem]]:
        """
        Calculates incoming callers and outgoing callees using AST symbols and source inspection.
        """
        callers: List[CallItem] = []
        callees: List[CallItem] = []

        target_name = target.name
        clean_target_name = target_name.split(".")[-1]

        # 1. Incoming Callers
        if target.target_type in ["SYMBOL", "FUNCTION", "METHOD", "CLASS", "FILE", "API"]:
            # Check GraphRelationships with relationship_type == 'CALLS'
            node_stmt = select(GraphRelationship).where(
                GraphRelationship.repository_id == repository_id,
                GraphRelationship.relationship_type == "CALLS",
            )
            rel_res = await db.execute(node_stmt)
            rels = rel_res.scalars().all()
            for r in rels:
                if (r.target_node and r.target_node.label == target_name) or (r.target_node and r.target_node.symbol_id == target.symbol_id):
                    caller_node = r.source_node
                    callers.append(CallItem(
                        name=caller_node.label if caller_node else "caller",
                        file_path=caller_node.file.path if caller_node and caller_node.file else None,
                        line_number=r.properties.get("line", 1) if r.properties else 1,
                        call_expression=f"{clean_target_name}()",
                    ))

            # Source scan for calls if clone_path is available or files on disk
            for f in repo_files:
                if target.target_type != "FILE" and f.path == target.file_path:
                    # Look inside same file outside target definition
                    pass
                disk_path = Path(clone_path) / f.path if clone_path else Path(f.path)
                if disk_path.exists() and disk_path.is_file():
                    try:
                        content = disk_path.read_text(encoding="utf-8", errors="replace")
                        call_pattern = re.compile(rf"\b{re.escape(clean_target_name)}\s*\(")
                        for idx, line in enumerate(content.splitlines(), 1):
                            if target.file_path == f.path and target.start_line and target.end_line:
                                if target.start_line <= idx <= target.end_line:
                                    continue  # Skip self-definition
                            if call_pattern.search(line):
                                callers.append(CallItem(
                                    name=f.path,
                                    file_path=f.path,
                                    line_number=idx,
                                    call_expression=line.strip()[:120],
                                    caller_context=f.path,
                                ))
                    except Exception as e:
                        logger.debug(f"Could not scan {disk_path} for callers: {e}")

        # Deduplicate callers
        seen_callers = set()
        dedup_callers = []
        for c in callers:
            key = (c.file_path, c.line_number, c.name)
            if key not in seen_callers:
                seen_callers.add(key)
                dedup_callers.append(c)

        # 2. Outgoing Callees
        if target.file_path:
            disk_path = Path(clone_path) / target.file_path if clone_path else Path(target.file_path)
            if disk_path.exists() and disk_path.is_file():
                try:
                    content = disk_path.read_text(encoding="utf-8", errors="replace")
                    lines = content.splitlines()
                    start_l = (target.start_line or 1) - 1
                    end_l = target.end_line or len(lines)
                    target_lines = lines[start_l:end_l]

                    callee_pat = re.compile(r"\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(")
                    for idx, line in enumerate(target_lines, start=start_l + 1):
                        for m in callee_pat.finditer(line):
                            cname = m.group(1)
                            if cname not in ["if", "while", "for", "def", "class", "return", "print", clean_target_name]:
                                callees.append(CallItem(
                                    name=cname,
                                    file_path=target.file_path,
                                    line_number=idx,
                                    call_expression=line.strip()[:120],
                                ))
                except Exception as e:
                    logger.debug(f"Could not scan {disk_path} for callees: {e}")

        seen_callees = set()
        dedup_callees = []
        for c in callees:
            key = (c.name, c.line_number)
            if key not in seen_callees:
                seen_callees.add(key)
                dedup_callees.append(c)

        return dedup_callers[:100], dedup_callees[:100]

    # =========================================================================
    # 4. AFFECTED APIS, TESTS & BOUNDARY CROSSINGS
    # =========================================================================

    def _find_affected_apis(
        self,
        target: ImpactTargetItem,
        affected_file_paths: Set[str],
        callers: List[CallItem],
        api_endpoints: List[Dict[str, Any]],
    ) -> List[AffectedApiItem]:
        affected_apis: List[AffectedApiItem] = []
        seen = set()

        for ep in api_endpoints:
            ep_file = (ep.get("file_path") or "").replace("\\", "/")
            method = (ep.get("method") or ep.get("http_method") or "GET").upper()
            route = ep.get("route") or ep.get("path") or ""
            key = (method, route)

            is_direct = target.target_type == "API" and (target.name == f"{method} {route}" or route in target.name)
            is_file_affected = ep_file in affected_file_paths
            is_caller = any(c.file_path == ep_file for c in callers)

            if (is_direct or is_file_affected or is_caller) and key not in seen:
                seen.add(key)
                dist = 0 if is_direct else (1 if ep_file == target.file_path else 2)
                affected_apis.append(AffectedApiItem(
                    method=method,
                    path=route,
                    file_path=ep_file,
                    line_number=ep.get("line", 1),
                    framework=ep.get("framework", "REST API"),
                    distance=dist,
                    handler_symbol=ep.get("handler") or ep.get("function"),
                ))

        return affected_apis

    def _find_affected_tests(
        self,
        target: ImpactTargetItem,
        affected_file_paths: Set[str],
        repo_files: List[File],
        file_by_path: Dict[str, File],
    ) -> List[AffectedTestItem]:
        affected_tests: List[AffectedTestItem] = []
        seen = set()

        for f in repo_files:
            p = f.path.replace("\\", "/")
            fname = Path(p).name.lower()
            _, cat, _ = architecture_intelligence_service.classify_file_layer(p)
            is_test_file = cat == "testing" or \
                fname.startswith("test_") or fname.endswith(("_test.py", ".test.js", ".test.ts", ".test.tsx", ".spec.ts", ".spec.js")) or \
                any(seg in p.lower().split("/") for seg in ["test", "tests", "__tests__", "spec", "specs"])

            if is_test_file:
                # Check if test file is in affected paths or imports affected paths
                if p in affected_file_paths or p == target.file_path:
                    if p not in seen:
                        seen.add(p)
                        dist = 1 if p == target.file_path else 2
                        affected_tests.append(AffectedTestItem(
                            test_file=p,
                            test_type="unit" if "unit" in p.lower() else "integration",
                            framework="pytest" if p.endswith(".py") else "jest",
                            distance=dist,
                        ))

        return affected_tests

    def _find_boundary_crossings(
        self,
        target: ImpactTargetItem,
        all_edges: List[ImpactEdgeItem],
        file_by_path: Dict[str, File],
    ) -> List[BoundaryCrossingItem]:
        crossings: List[BoundaryCrossingItem] = []
        seen_crossings = set()

        for edge in all_edges:
            src_f = edge.source
            tgt_f = edge.target
            src_layer, src_cat, _ = architecture_intelligence_service.classify_file_layer(src_f)
            tgt_layer, tgt_cat, _ = architecture_intelligence_service.classify_file_layer(tgt_f)

            if src_layer != tgt_layer:
                key = (src_layer, tgt_layer, src_f, tgt_f)
                if key not in seen_crossings:
                    seen_crossings.add(key)
                    
                    # Detect architectural layer inversions
                    violation = None
                    if src_cat in ["domain_models", "data_access"] and tgt_cat == "presentation_api":
                        violation = "LAYER_INVERSION"

                    crossings.append(BoundaryCrossingItem(
                        source_layer=src_layer,
                        target_layer=tgt_layer,
                        source_component=Path(src_f).parts[0] if Path(src_f).parts else "root",
                        target_component=Path(tgt_f).parts[0] if Path(tgt_f).parts else "root",
                        violation_type=violation,
                        description=f"Propagation from '{src_layer}' ({src_f}) to '{tgt_layer}' ({tgt_f})",
                    ))

        return crossings

    # =========================================================================
    # 5. UNCERTAINTY ANALYSIS
    # =========================================================================

    def _analyze_uncertainty(
        self,
        target: ImpactTargetItem,
        affected_files: List[str],
        affected_tests: List[AffectedTestItem],
        repo_files: List[File],
        clone_path: Optional[str] = None,
    ) -> List[UncertaintyItem]:
        uncertainties: List[UncertaintyItem] = []

        # 1. Lack of Automated Tests
        if len(affected_tests) == 0:
            uncertainties.append(UncertaintyItem(
                category="UNTESTED",
                severity="HIGH",
                description=f"Target '{target.name}' has 0 automated test suites exercising its direct or transitive dependency tree.",
                file_path=target.file_path,
                line_number=target.start_line,
            ))

        # 2. Dynamic Features in affected files
        for fpath in affected_files[:20]:
            disk_path = Path(clone_path) / fpath if clone_path else Path(fpath)
            if disk_path.exists() and disk_path.is_file():
                try:
                    content = disk_path.read_text(encoding="utf-8", errors="replace")
                    for idx, line in enumerate(content.splitlines(), 1):
                        # Wildcard imports
                        if re.search(r"(from\s+[\w.]+\s+import\s+\*|import\s+\*|require\s*\(\s*[^'\"`\)]+\s*\))", line):
                            uncertainties.append(UncertaintyItem(
                                category="WILDCARD_IMPORT",
                                severity="MEDIUM",
                                description="Wildcard import suppresses static symbol resolution precision.",
                                file_path=fpath,
                                line_number=idx,
                            ))
                            break

                        # Dynamic dispatch / getattr
                        if "getattr(" in line or "setattr(" in line:
                            uncertainties.append(UncertaintyItem(
                                category="DYNAMIC_DISPATCH",
                                severity="MEDIUM",
                                description="Dynamic attribute access (getattr/setattr) cannot be proven by static AST.",
                                file_path=fpath,
                                line_number=idx,
                            ))
                            break

                        # Reflection
                        if "import_module(" in line or "Class.forName" in line:
                            uncertainties.append(UncertaintyItem(
                                category="REFLECTION",
                                severity="HIGH",
                                description="Runtime reflection module loader bypasses static call graph.",
                                file_path=fpath,
                                line_number=idx,
                            ))
                            break
                except Exception:
                    pass

        return uncertainties

    # =========================================================================
    # 6. STRUCTURED EXPLANATION GENERATOR
    # =========================================================================

    def generate_explanation(self, response: ImpactAnalysisResponse) -> str:
        """
        Synthesizes a clear, evidence-backed narrative explanation of the impact analysis.
        """
        t = response.target
        m = response.impact

        sections = [
            f"### Impact Analysis: {t.target_type} `{t.name}`",
            f"- **Repository**: `{response.repository_id}`",
            f"- **Primary File**: `{t.file_path or 'N/A'}`" + (f" (Lines {t.start_line}–{t.end_line})" if t.start_line else ""),
            f"- **Risk Assessment**: **{m.risk}** (Score: {m.risk_score})",
            "",
            "#### 1. Blast Radius & Dependents",
            f"- **Direct Dependents ({len(response.direct_dependents)})**: {', '.join(d.label for d in response.direct_dependents[:5]) or 'None'}",
            f"- **Indirect Dependents ({len(response.transitive_dependents)})**: {', '.join(d.label for d in response.transitive_dependents[:5]) or 'None'}",
            f"- **Affected Files ({len(response.affected_files)})**: {', '.join(response.affected_files[:5]) or 'None'}",
            f"- **Affected Modules ({len(response.affected_modules)})**: {', '.join(response.affected_modules[:5]) or 'None'}",
            "",
            "#### 2. Call Hierarchy",
            f"- **Callers ({len(response.callers)})**: {', '.join(f'`{c.name}` ({c.file_path}:{c.line_number})' for c in response.callers[:4]) or 'No static callers detected'}",
            f"- **Callees ({len(response.callees)})**: {', '.join(f'`{c.name}`' for c in response.callees[:4]) or 'No external calls detected'}",
            "",
            "#### 3. High-Value Affected Targets",
            f"- **Affected APIs ({len(response.affected_apis)})**: {', '.join(f'{a.method} {a.path}' for a in response.affected_apis) or 'No public API routes impacted'}",
            f"- **Affected Tests ({len(response.affected_tests)})**: {', '.join(f'{t.test_file}' for t in response.affected_tests[:4]) or 'No automated test files exercise this path'}",
            f"- **Affected Dependencies ({len(response.affected_dependencies)})**: {', '.join(response.affected_dependencies[:5]) or 'None'}",
            "",
            "#### 4. Architecture Boundary Crossings",
            f"- **Boundaries Crossed ({len(response.boundaries_crossed)})**: " + (
                "; ".join(f"{b.source_layer} ➔ {b.target_layer}" + (f" [⚠️ {b.violation_type}]" if b.violation_type else "") for b in response.boundaries_crossed[:3])
                if response.boundaries_crossed else "None (contained within layer)"
            ),
            "",
            "#### 5. Uncertainty & Risks",
            "- " + ("\n- ".join(f"[{u.severity}] {u.description} ({u.file_path}:{u.line_number})" for u in response.uncertainty[:3]) if response.uncertainty else "Static analysis complete with high certainty."),
        ]

        return "\n".join(sections)

    # =========================================================================
    # 7. BACKWARDS COMPATIBILITY
    # =========================================================================

    async def get_target_dependencies(
        self,
        db: AsyncSession,
        repository_id: str,
        target_id: str,
    ) -> TargetDependencyResponse:
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
