import asyncio
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, Optional, List, Set

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from backend.app.models.repository import Repository
from backend.app.models.analysis import Analysis
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.models.finding import Finding
from backend.app.services.git_repository_service import git_service
from backend.app.services.repository_scanner_service import scanner_service
from backend.app.services.language_detection_service import language_service
from backend.app.services.ast_parser_service import ast_parser_service
from backend.app.services.dependency_resolution_service import dependency_resolver
from backend.app.services.graph_builder_service import graph_builder
from backend.app.services.universal_analyzer_service import universal_analyzer
from backend.app.db.session import get_session_factory
from backend.app.schemas.collaboration import CollaborationEventType
from backend.app.services.collaboration_manager import collaboration_manager

logger = logging.getLogger("codeatlas.ingestion")


class RepositoryIngestionService:
    """
    Coordinates real repository source code ingestion:
    cloning/accessing, discovering files, storing file metadata,
    detecting languages, parsing ASTs, and storing code symbols with strict repository isolation.
    """

    def __init__(self):
        self._active_progress: Dict[str, Dict[str, Any]] = {}
        self._locks: Dict[str, asyncio.Lock] = {}
        self._global_lock = asyncio.Lock()

    async def _get_repo_lock(self, repo_id: str) -> asyncio.Lock:
        async with self._global_lock:
            if repo_id not in self._locks:
                self._locks[repo_id] = asyncio.Lock()
            return self._locks[repo_id]

    def get_progress(self, repo_id: str) -> Optional[Dict[str, Any]]:
        return self._active_progress.get(repo_id)

    def _set_progress(
        self,
        repo_id: str,
        status: str,
        stage: str,
        files_discovered: int = 0,
        files_processed: int = 0,
        symbols_extracted: int = 0,
        progress_percent: int = 0,
        error: Optional[str] = None,
        partial_errors: Optional[List[Dict[str, Any]]] = None,
        unsupported_languages: Optional[List[Dict[str, Any]]] = None,
    ):
        self._active_progress[repo_id] = {
            "repository_id": repo_id,
            "status": status,
            "stage": stage,
            "current_stage": stage,
            "progress": progress_percent,
            "progress_percent": progress_percent,
            "files_discovered": files_discovered,
            "files_processed": files_processed,
            "files_indexed": files_processed,
            "symbols_extracted": symbols_extracted,
            "error": error,
            "partial_errors": partial_errors or [],
            "unsupported_languages": unsupported_languages or [],
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

        # Real-time event broadcasting to repository room
        ev_type = CollaborationEventType.ANALYSIS_PROGRESS.value
        if status == "running" and stage in ["cloning", "scanning"] and progress_percent <= 10:
            ev_type = CollaborationEventType.ANALYSIS_STARTED.value
        elif status == "completed":
            ev_type = CollaborationEventType.ANALYSIS_COMPLETED.value
        elif status == "failed":
            ev_type = CollaborationEventType.ANALYSIS_FAILED.value

        try:
            loop = asyncio.get_running_loop()
            loop.create_task(
                collaboration_manager.broadcast_to_repository(
                    repository_id=repo_id,
                    event_type=ev_type,
                    payload=self._active_progress[repo_id],
                )
            )
        except RuntimeError:
            pass

    async def ingest_repository(
        self,
        repository_id: str,
        db: Optional[AsyncSession] = None,
    ) -> Dict[str, Any]:
        """
        Execute full repository ingestion and analysis pipeline.
        Can run within an existing session or open a dedicated session for background execution.
        """
        lock = await self._get_repo_lock(repository_id)

        async with lock:
            if db is not None:
                return await self._execute_ingestion(repository_id, db)
            else:
                async with get_session_factory()() as session:
                    return await self._execute_ingestion(repository_id, session)

    async def _execute_ingestion(self, repository_id: str, session: AsyncSession) -> Dict[str, Any]:
        start_time = time.time()
        logger.info(f"Starting repository ingestion pipeline for repository {repository_id}")

        # 1. DISCOVER / VERIFY REPOSITORY
        partial_errors: List[Dict[str, Any]] = []
        self._set_progress(repository_id, "QUEUED", "Validating repository", progress_percent=5)
        repo_res = await session.execute(select(Repository).where(Repository.id == repository_id))
        repo = repo_res.scalars().first()
        if not repo:
            err = f"Repository with id '{repository_id}' not found."
            self._set_progress(repository_id, "FAILED", "Error", error=err)
            raise ValueError(err)

        repo.analysis_status = "running"
        await session.commit()

        # 2. CREATE ANALYSIS RECORD
        analysis = Analysis(
            repository_id=repository_id,
            branch=repo.default_branch,
            commit_sha=repo.current_commit_sha,
            status="running",
            started_at=datetime.now(timezone.utc),
            metadata_json={"stage": "QUEUED"},
        )
        session.add(analysis)
        await session.commit()
        await session.refresh(analysis)

        try:
            # 3. ACCESS / CLONE REPOSITORY (CLONING stage)
            self._set_progress(repository_id, "CLONING", "Cloning or accessing repository", progress_percent=15)
            source_dir = git_service.get_storage_path(repository_id)
            is_valid, _ = git_service.verify_repository_source(repository_id)

            if not is_valid:
                logger.info(f"Repository {repository_id} source not ready locally. Initiating clone...")
                clone_res = await git_service.clone_repository(
                    repo_id=repo.id,
                    url=repo.url,
                    default_branch=repo.default_branch,
                )
                if clone_res.get("commit_sha"):
                    repo.current_commit_sha = clone_res["commit_sha"]
                    analysis.commit_sha = clone_res["commit_sha"]
                if clone_res.get("branch"):
                    repo.default_branch = clone_res["branch"]
                    analysis.branch = clone_res["branch"]
                repo.acquisition_status = "READY"
                repo.last_synced_at = datetime.now(timezone.utc)
                await session.commit()

            if not source_dir.exists():
                raise FileNotFoundError(f"Source directory for repository {repository_id} does not exist at {source_dir}")

            # 4. SCAN AND DISCOVER FILES (DISCOVERING stage)
            self._set_progress(repository_id, "DISCOVERING", "Discovering repository source files", progress_percent=30)
            loop = asyncio.get_running_loop()
            discovered_files = await loop.run_in_executor(None, scanner_service.scan_directory, source_dir)
            total_discovered = len(discovered_files)
            logger.info(f"Discovered {total_discovered} source files for repository {repository_id}")

            # 5. PARSING METADATA & INCREMENTAL SYNC (PARSING stage)
            self._set_progress(
                repository_id,
                "PARSING",
                "Parsing file metadata and calculating metrics",
                files_discovered=total_discovered,
                files_processed=0,
                progress_percent=45,
            )

            # Retrieve existing files for this repository for true incremental diffing
            existing_files_res = await session.execute(
                select(File).where(File.repository_id == repository_id)
            )
            existing_files = {f.path: f for f in existing_files_res.scalars().all()}
            discovered_paths: Set[str] = {f["path"] for f in discovered_files}

            # Delete removed files from database
            obsolete_paths = set(existing_files.keys()) - discovered_paths
            if obsolete_paths:
                logger.info(f"Removing {len(obsolete_paths)} deleted files for repository {repository_id}")
                for p in obsolete_paths:
                    del_file = existing_files[p]
                    await session.delete(del_file)
                await session.commit()

            # Store / Update File records
            self._set_progress(
                repository_id,
                "PARSING",
                "Storing source files in database",
                files_discovered=total_discovered,
                files_processed=0,
                progress_percent=55,
            )

            active_file_map: Dict[str, File] = {}
            files_needing_symbol_reparse: List[Dict[str, Any]] = []

            for f_data in discovered_files:
                path = f_data["path"]
                source_meta = {
                    "filename": f_data["filename"],
                    "extension": f_data["extension"],
                    "code_lines": f_data.get("code_lines", f_data["line_count"]),
                    "blank_lines": f_data.get("blank_lines", 0),
                    "comment_lines": f_data.get("comment_lines", 0),
                    "is_binary": False,
                }

                if path in existing_files:
                    db_file = existing_files[path]
                    # Check if modified
                    if db_file.content_hash != f_data["content_hash"]:
                        db_file.size_bytes = f_data["size_bytes"]
                        db_file.line_count = f_data["line_count"]
                        db_file.content_hash = f_data["content_hash"]
                        db_file.language = f_data["language"]
                        db_file.source_metadata = source_meta
                        db_file.analysis_id = analysis.id
                        # Clear old symbols for this changed file
                        await session.execute(delete(Symbol).where(Symbol.file_id == db_file.id))
                        files_needing_symbol_reparse.append(f_data)
                    else:
                        # Unchanged file: retain existing file & symbols, just update analysis_id
                        db_file.analysis_id = analysis.id
                    active_file_map[path] = db_file
                else:
                    # New file
                    new_file = File(
                        repository_id=repository_id,
                        analysis_id=analysis.id,
                        path=f_data["path"],
                        language=f_data["language"],
                        size_bytes=f_data["size_bytes"],
                        line_count=f_data["line_count"],
                        content_hash=f_data["content_hash"],
                        source_metadata=source_meta,
                    )
                    session.add(new_file)
                    active_file_map[path] = new_file
                    files_needing_symbol_reparse.append(f_data)

            await session.commit()

            # Refresh all active files to ensure primary IDs are loaded
            for db_file in active_file_map.values():
                await session.refresh(db_file)

            # 6. PARSE AST AND EXTRACT SYMBOLS
            total_symbols_extracted = 0
            symbols_to_add: List[Symbol] = []
            all_repo_symbols: List[Dict[str, Any]] = []

            for idx, file_data in enumerate(files_needing_symbol_reparse):
                rel_path = file_data["path"]
                abs_path = file_data["absolute_path"]
                lang = file_data["language"]
                db_file = active_file_map.get(rel_path)

                if db_file:
                    try:
                        parsed_result = await loop.run_in_executor(
                            None,
                            ast_parser_service.parse_file_full,
                            abs_path,
                            lang,
                        )

                        extracted_symbols = parsed_result.get("symbols", [])
                        extracted_imports = parsed_result.get("imports", [])
                        extracted_exports = parsed_result.get("exports", [])
                        parse_status = parsed_result.get("parse_status", "parsed")
                        parse_error = parsed_result.get("error")

                        if parse_status == "error":
                            partial_errors.append({
                                "file": rel_path,
                                "language": lang,
                                "error": parse_error or "Parse error encountered",
                                "stage": "PARSING",
                            })

                        # Update File metadata with AST parse details
                        current_meta = dict(db_file.source_metadata or {})
                        current_meta.update({
                            "parse_status": parse_status,
                            "parse_error": parse_error,
                            "imports": extracted_imports,
                            "exports": extracted_exports,
                            "symbol_count": len(extracted_symbols),
                        })
                        db_file.source_metadata = current_meta

                        for sym in extracted_symbols:
                            symbol_record = Symbol(
                                repository_id=repository_id,  # Strict repository ownership
                                file_id=db_file.id,
                                name=sym["name"],
                                symbol_type=sym["symbol_type"],
                                qualified_name=sym.get("qualified_name") or sym["name"],
                                start_line=sym["start_line"],
                                end_line=sym["end_line"],
                                start_column=sym.get("start_column", 0),
                                end_column=sym.get("end_column"),
                                docstring=sym.get("docstring"),
                                ast_metadata=sym.get("ast_metadata"),
                            )
                            symbols_to_add.append(symbol_record)
                            total_symbols_extracted += 1
                            all_repo_symbols.append(sym)
                    except Exception as parse_exc:
                        logger.warning(f"Error parsing file {rel_path} in repository {repository_id}: {parse_exc}")
                        partial_errors.append({
                            "file": rel_path,
                            "language": lang,
                            "error": str(parse_exc),
                            "stage": "PARSING",
                        })

                # Update progress periodically
                if (idx + 1) % 5 == 0 or idx == len(files_needing_symbol_reparse) - 1:
                    percent = 60 + int(((idx + 1) / max(len(files_needing_symbol_reparse), 1)) * 25)
                    self._set_progress(
                        repository_id,
                        "PARSING",
                        "Extracting code symbols and AST structures",
                        files_discovered=total_discovered,
                        files_processed=idx + 1,
                        symbols_extracted=total_symbols_extracted,
                        progress_percent=min(percent, 85),
                        partial_errors=partial_errors,
                    )

            # Batch persist all extracted symbols
            if symbols_to_add:
                session.add_all(symbols_to_add)
                await session.commit()

            # If all files were unchanged, query existing symbols for metrics
            if not files_needing_symbol_reparse:
                existing_syms = await session.execute(
                    select(Symbol).where(Symbol.repository_id == repository_id)
                )
                loaded_syms = existing_syms.scalars().all()
                total_symbols_extracted = len(loaded_syms)
                all_repo_symbols = [{"name": s.name, "symbol_type": s.symbol_type} for s in loaded_syms]

            # 7. DEPENDENCY RESOLUTION & GRAPH BUILDING (BUILDING_GRAPH stage)
            self._set_progress(
                repository_id,
                "BUILDING_GRAPH",
                "Resolving repository imports and building architecture graph",
                files_discovered=total_discovered,
                files_processed=total_discovered,
                symbols_extracted=total_symbols_extracted,
                progress_percent=88,
                partial_errors=partial_errors,
            )

            # Ensure all discovered_files have database IDs and latest source_metadata
            for f in discovered_files:
                if f["path"] in active_file_map:
                    db_f = active_file_map[f["path"]]
                    f["id"] = db_f.id
                    if db_f.source_metadata:
                        f["source_metadata"] = db_f.source_metadata


            # Clean previous dependencies and graph entities for this repository
            await session.execute(delete(GraphRelationship).where(GraphRelationship.repository_id == repository_id))
            await session.execute(delete(GraphNode).where(GraphNode.repository_id == repository_id))
            await session.execute(delete(Dependency).where(Dependency.repository_id == repository_id))
            await session.execute(
                delete(Finding).where(
                    Finding.repository_id == repository_id,
                    Finding.rule_id == "ARCH_CIRCULAR_DEPENDENCY",
                )
            )
            await session.commit()

            # Resolve internal & external imports
            resolved_deps, unresolved_deps = dependency_resolver.resolve_dependencies(
                repository_id=repository_id,
                files=discovered_files,
                repo_dir=source_dir,
            )


            # Persist Dependency records
            deps_to_add: List[Dependency] = []
            for dep in resolved_deps:
                deps_to_add.append(
                    Dependency(
                        repository_id=repository_id,
                        analysis_id=analysis.id,
                        name=dep["name"],
                        dependency_type=dep.get("dependency_type", "IMPORT"),
                        source_file_id=dep.get("source_file_id"),
                        target_file_id=dep.get("target_file_id"),
                        metadata_json={
                            "resolved": True,
                            "source_path": dep["source_path"],
                            "target_path": dep["target_path"],
                            "import_name": dep.get("import_name"),
                            "start_line": dep.get("start_line", 1),
                            "end_line": dep.get("end_line", 1),
                        },
                    )
                )

            for dep in unresolved_deps:
                deps_to_add.append(
                    Dependency(
                        repository_id=repository_id,
                        analysis_id=analysis.id,
                        name=dep["name"],
                        dependency_type=dep.get("dependency_type", "PACKAGE_IMPORT"),
                        source_file_id=dep.get("source_file_id"),
                        target_file_id=None,
                        metadata_json={
                            "resolved": False,
                            "source_path": dep["source_path"],
                            "target_path": None,
                            "import_name": dep.get("import_name"),
                            "start_line": dep.get("start_line", 1),
                            "end_line": dep.get("end_line", 1),
                        },
                    )
                )

            if deps_to_add:
                session.add_all(deps_to_add)
                await session.commit()

            # Build Graph Nodes & Relationships
            graph_data = graph_builder.build_graph_structure(
                repository_id=repository_id,
                files=discovered_files,
                dependencies=resolved_deps,
            )

            # Persist Graph Nodes
            node_key_to_id: Dict[str, str] = {}
            nodes_to_add: List[GraphNode] = []
            for n in graph_data["nodes"]:
                gn = GraphNode(
                    repository_id=repository_id,
                    analysis_id=analysis.id,
                    node_key=n["node_key"],
                    node_type=n["node_type"],
                    label=n["label"],
                    file_id=n.get("file_id"),
                    properties=n.get("properties"),
                )
                nodes_to_add.append(gn)

            if nodes_to_add:
                session.add_all(nodes_to_add)
                await session.commit()
                for gn in nodes_to_add:
                    node_key_to_id[gn.node_key] = gn.id

            # Persist Graph Relationships
            edges_to_add: List[GraphRelationship] = []
            for e in graph_data["edges"]:
                src_key = f"file:{e['source_path']}"
                tgt_key = f"file:{e['target_path']}"
                if src_key in node_key_to_id and tgt_key in node_key_to_id:
                    edges_to_add.append(
                        GraphRelationship(
                            repository_id=repository_id,
                            analysis_id=analysis.id,
                            source_node_id=node_key_to_id[src_key],
                            target_node_id=node_key_to_id[tgt_key],
                            relationship_type=e.get("relationship_type", "IMPORTS"),
                            weight=1.0,
                            properties=e.get("properties"),
                        )
                    )

            if edges_to_add:
                session.add_all(edges_to_add)
                await session.commit()

            # Check for circular dependency findings
            if graph_data["cycles"]:
                for cycle in graph_data["cycles"]:
                    cycle_str = " → ".join(cycle)
                    finding = Finding(
                        repository_id=repository_id,
                        analysis_id=analysis.id,
                        rule_id="ARCH_CIRCULAR_DEPENDENCY",
                        category="architecture",
                        severity="medium",
                        title="Circular Dependency Detected",
                        description=f"Circular dependency cycle identified in repository: {cycle_str}",
                        evidence={"cycle": cycle},
                        remediation="Refactor shared dependencies or extract shared interfaces to break circular coupling.",
                    )
                    session.add(finding)
                await session.commit()

            # 8. COMPUTE METRICS, UNIVERSAL PROFILE & LANGUAGE DISTRIBUTION (ANALYZING stage)
            self._set_progress(
                repository_id,
                "ANALYZING",
                "Synthesizing universal repository profile and architecture",
                files_discovered=total_discovered,
                files_processed=total_discovered,
                symbols_extracted=total_symbols_extracted,
                progress_percent=95,
                partial_errors=partial_errors,
            )

            symbol_metrics = ast_parser_service.calculate_symbol_metrics(all_repo_symbols)
            lang_dist = language_service.calculate_language_distribution(discovered_files)
            duration_sec = round(time.time() - start_time, 2)

            universal_profile = universal_analyzer.build_universal_profile(
                repository_id=repository_id,
                files=discovered_files,
                dependencies=resolved_deps + unresolved_deps,
                symbols=all_repo_symbols,
                source_dir=source_dir,
                commit_sha=repo.current_commit_sha,
            )
            analysis_snapshot = universal_analyzer.create_analysis_snapshot(
                repository_id=repository_id,
                commit_sha=repo.current_commit_sha,
                profile=universal_profile,
                stats={
                    "total_files": total_discovered,
                    "total_symbols": total_symbols_extracted,
                    "total_lines": lang_dist.get("total_lines", 0),
                    "duration_seconds": duration_sec,
                },
            )

            # Largest files for overview dashboard
            largest_files = sorted(
                discovered_files,
                key=lambda x: x.get("size_bytes", 0),
                reverse=True,
            )[:10]

            analysis_summary = {
                "total_files": total_discovered,
                "total_lines": lang_dist.get("total_lines", 0),
                "total_code_lines": lang_dist.get("total_code_lines", 0),
                "total_blank_lines": lang_dist.get("total_blank_lines", 0),
                "total_comment_lines": lang_dist.get("total_comment_lines", 0),
                "total_symbols": total_symbols_extracted,
                "total_dependencies": len(resolved_deps),
                "unresolved_imports": len(unresolved_deps),
                "symbol_metrics": symbol_metrics,
                "graph_metrics": graph_data["metrics"],
                "primary_language": lang_dist.get("primary_language", "Unknown"),
                "languages": lang_dist.get("languages", []),
                "largest_files": [
                    {
                        "path": f["path"],
                        "size_bytes": f["size_bytes"],
                        "line_count": f["line_count"],
                        "language": f["language"],
                    }
                    for f in largest_files
                ],
                "profile": universal_profile,
                "snapshot": analysis_snapshot,
                "partial_errors": partial_errors,
                "unsupported_languages": universal_profile.get("languages", {}).get("unsupported_languages", []),
                "duration_seconds": duration_sec,
            }

            # 9. COMPLETE ANALYSIS AND UPDATE REPOSITORY
            final_status = "partial" if partial_errors else "completed"
            analysis.status = final_status
            analysis.summary = (
                f"Indexed {total_discovered} files, {total_symbols_extracted} symbols, "
                f"{len(resolved_deps)} internal dependencies in {duration_sec}s."
                + (f" ({len(partial_errors)} file(s) had parse errors)" if partial_errors else "")
            )
            analysis.completed_at = datetime.now(timezone.utc)
            analysis.metadata_json = analysis_summary

            repo.analysis_status = final_status
            repo.metadata_json = {
                **(repo.metadata_json or {}),
                "analysis_summary": analysis_summary,
                "symbol_metrics": symbol_metrics,
                "graph_metrics": graph_data["metrics"],
                "dependency_count": len(resolved_deps),
                "languages": lang_dist.get("languages", []),
                "file_count": total_discovered,
                "line_count": lang_dist.get("total_lines", 0),
                "code_lines": lang_dist.get("total_code_lines", 0),
                "blank_lines": lang_dist.get("total_blank_lines", 0),
                "comment_lines": lang_dist.get("total_comment_lines", 0),
                "symbol_count": total_symbols_extracted,
                "primary_language": lang_dist.get("primary_language", "Unknown"),
                "largest_files": analysis_summary["largest_files"],
                "profile": universal_profile,
                "snapshot": analysis_snapshot,
                "partial_errors": partial_errors,
            }

            await session.commit()
            await session.refresh(analysis)
            await session.refresh(repo)

            prog_status = "PARTIAL" if partial_errors else "COMPLETED"
            prog_stage = f"Repository partially analyzed ({len(partial_errors)} error(s))" if partial_errors else "Repository ready"
            self._set_progress(
                repository_id,
                prog_status,
                prog_stage,
                files_discovered=total_discovered,
                files_processed=total_discovered,
                symbols_extracted=total_symbols_extracted,
                progress_percent=100,
                partial_errors=partial_errors,
                unsupported_languages=universal_profile.get("languages", {}).get("unsupported_languages", []),
            )

            logger.info(
                f"Repository ingestion completed ({final_status}) for {repository_id}: "
                f"{total_discovered} files, {total_symbols_extracted} symbols in {duration_sec}s"
            )

            return {
                "repository_id": repository_id,
                "analysis_id": analysis.id,
                "status": final_status,
                "files_discovered": total_discovered,
                "symbols_extracted": total_symbols_extracted,
                "language_distribution": lang_dist,
                "partial_errors": partial_errors,
                "profile": universal_profile,
                "duration_seconds": duration_sec,
            }

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Repository ingestion failed for {repository_id}: {error_msg}", exc_info=True)
            duration_sec = round(time.time() - start_time, 2)

            analysis.status = "failed"
            analysis.error_message = error_msg
            analysis.completed_at = datetime.now(timezone.utc)
            repo.analysis_status = "failed"

            await session.commit()

            self._set_progress(
                repository_id,
                "FAILED",
                "Repository could not be indexed",
                progress_percent=100,
                error=error_msg,
            )

            return {
                "repository_id": repository_id,
                "analysis_id": analysis.id,
                "status": "failed",
                "error": error_msg,
                "duration_seconds": duration_sec,
            }

    run_analysis = ingest_repository


ingestion_service = RepositoryIngestionService()
repository_ingestion_service = ingestion_service
