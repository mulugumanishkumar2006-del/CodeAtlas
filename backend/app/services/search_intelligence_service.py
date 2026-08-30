import re
import logging
from typing import Optional, List, Dict, Any, Tuple
from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.repository import Repository
from backend.app.services.source_code_service import source_code_service

logger = logging.getLogger("codeatlas.search")


class SearchIntelligenceService:
    """
    Search & Code Intelligence Service for repository-scoped search and query understanding.
    Grounded in real indexed AST symbols, files, dependencies, architecture, and source checkouts.
    """

    INTENTS = {
        "KEYWORD_SEARCH": "Keyword or identifier search across files, symbols, and code",
        "FILE_SEARCH": "Locating specific files by path or name",
        "SYMBOL_SEARCH": "Locating functions, classes, methods, or interfaces",
        "SOURCE_SEARCH": "Searching for code terms, strings, or definitions across files",
        "DEPENDENCY_INCOMING": "Finding files and modules that depend on or import a given module",
        "DEPENDENCY_OUTGOING": "Finding modules and files that a given file depends on or imports",
        "CALLER_SEARCH": "Finding callers of a specific function or method",
        "CALLEE_SEARCH": "Finding functions or methods called by a specific function",
        "ARCHITECTURE_SEARCH": "Finding architecture modules, layers, patterns, and components",
        "DIRECTORY_SEARCH": "Finding and inspecting directory structures and metrics",
        "UNKNOWN": "Unknown query intent",
    }

    def sanitize_sql_pattern(self, text: str) -> str:
        """Escape special SQL LIKE pattern characters to prevent wildcards and injection."""
        return text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")

    def parse_query_intent(self, raw_query: str) -> Tuple[str, str, Optional[str]]:
        """
        Classify user query into a structured search intent.
        Returns: (intent, cleaned_target_term, explanation)
        """
        q = raw_query.strip()
        lower_q = q.lower()

        # 1. Incoming Dependencies ("What depends on auth.py?", "Who imports auth?")
        m = re.search(r"^(?:what|which files?|who)\s+(?:depends?\s+on|imports?)\s+([a-zA-Z0-9_\-\.\/\\]+)\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            return ("DEPENDENCY_INCOMING", target, f"Finding files that depend on '{target}'")

        # 2. Outgoing Dependencies ("What does auth.py depend on?", "What does auth.py import?")
        m = re.search(r"^(?:what\s+does|what)\s+([a-zA-Z0-9_\-\.\/\\]+)\s+(?:depend\s+on|imports?)\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            return ("DEPENDENCY_OUTGOING", target, f"Finding dependencies imported by '{target}'")

        m = re.search(r"^(?:dependencies|imports)\s+(?:of|for)\s+([a-zA-Z0-9_\-\.\/\\]+)\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            return ("DEPENDENCY_OUTGOING", target, f"Finding dependencies imported by '{target}'")

        # 3. Caller queries ("Who calls authenticate_user?", "What calls login?")
        m = re.search(r"^(?:who|what|which\s+functions?)\s+calls?\s+([a-zA-Z0-9_]+)(?:\(\))?\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            return ("CALLER_SEARCH", target, f"Finding callers of function '{target}'")

        # 4. Callee queries ("What does authenticate_user call?")
        m = re.search(r"^(?:what\s+does)\s+([a-zA-Z0-9_]+)\s+calls?\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            return ("CALLEE_SEARCH", target, f"Finding calls made by function '{target}'")

        # 5. Architecture queries ("What are the components?", "architecture of auth", "layers in project")
        if re.search(r"\b(architecture|layer|layers|module|modules|component|components|entry point|entry points|pattern|patterns)\b", lower_q):
            target = re.sub(r"\b(show|find|list|what are|the|in|of|for|project|repository|architecture|layers?|modules?|components?)\b", "", lower_q).strip(" ?'\"`")
            return ("ARCHITECTURE_SEARCH", target or q, f"Searching architecture components matching '{target or q}'")

        # 6. File search queries ("Where is auth.py", "Find file auth.py")
        m = re.search(r"^(?:where\s+is|find|show|locate)\s+(?:file\s+)?([a-zA-Z0-9_\-\.\/\\]+\.[a-zA-Z0-9]+)\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            return ("FILE_SEARCH", target, f"Locating file '{target}'")

        # 7. General location/symbol queries ("Where is authentication implemented?", "Where is AuthService?")
        m = re.search(r"^(?:where\s+is|find|show|locate)\s+(?:the\s+)?([a-zA-Z0-9_\-\.\/\s]+?)(?:\s+implemented|\s+defined|\s+handled|\s+created)?\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            if target:
                return ("SYMBOL_SEARCH", target, f"Searching for symbol or implementation of '{target}'")

        # 8. Directory queries ("directory services", "folder src")
        m = re.search(r"^(?:dir|directory|folder)\s+([a-zA-Z0-9_\-\.\/\\]+)\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            return ("DIRECTORY_SEARCH", target, f"Inspecting directory structure for '{target}'")

        # 9. "Which files contain X"
        m = re.search(r"^(?:which\s+files?\s+contains?)\s+([a-zA-Z0-9_\-\.\/\s]+)\??$", lower_q)
        if m:
            target = m.group(1).strip("'\"` ")
            return ("SOURCE_SEARCH", target, f"Searching for files containing '{target}'")

        # Default: Keyword search
        return ("KEYWORD_SEARCH", q, f"Keyword search for '{q}'")

    async def search_repository(
        self,
        repository_id: str,
        query_str: str,
        search_type: str = "all",
        path_filter: Optional[str] = None,
        language_filter: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
        db: AsyncSession = None,
    ) -> Dict[str, Any]:
        """
        Execute ranked, repository-scoped search and intelligence query across all indexed entities.
        Strictly bounded by repository_id.
        """
        if not query_str or not query_str.strip():
            return {
                "repository_id": repository_id,
                "query": "",
                "intent": "KEYWORD_SEARCH",
                "explanation": "Search query was empty.",
                "total_matches": 0,
                "symbols": [],
                "symbol_matches": [],
                "files": [],
                "code_matches": [],
                "dependencies": [],
                "directories": [],
                "architecture": [],
                "architecture_matches": [],
                "limit": limit,
                "offset": offset,
                "has_more": False,
            }

        intent, clean_target, explanation = self.parse_query_intent(query_str)
        escaped_target = self.sanitize_sql_pattern(clean_target)

        symbols_list: List[Dict[str, Any]] = []
        files_list: List[Dict[str, Any]] = []
        code_matches_list: List[Dict[str, Any]] = []
        deps_list: List[Dict[str, Any]] = []
        dirs_list: List[Dict[str, Any]] = []
        arch_list: List[Dict[str, Any]] = []

        # Map files in repo
        file_query = select(File).where(File.repository_id == repository_id)
        if path_filter:
            file_query = file_query.where(File.path.ilike(f"%{self.sanitize_sql_pattern(path_filter)}%"))
        if language_filter:
            file_query = file_query.where(File.language.ilike(f"%{self.sanitize_sql_pattern(language_filter)}%"))

        files_res = await db.execute(file_query)
        repo_files = files_res.scalars().all()
        file_map = {f.path: f.id for f in repo_files}
        file_id_to_obj = {f.id: f for f in repo_files}

        # -------------------------------------------------------------
        # 1. SYMBOL SEARCH (Ranked with Deterministic Signals)
        # -------------------------------------------------------------
        if search_type in ["all", "symbol", "query"] and intent in ["KEYWORD_SEARCH", "SYMBOL_SEARCH", "CALLER_SEARCH", "CALLEE_SEARCH", "ARCHITECTURE_SEARCH"]:
            sym_q = (
                select(Symbol, File)
                .join(File, Symbol.file_id == File.id)
                .where(
                    Symbol.repository_id == repository_id,
                    or_(
                        Symbol.name.ilike(f"%{escaped_target}%"),
                        Symbol.qualified_name.ilike(f"%{escaped_target}%"),
                    ),
                )
            )
            if path_filter:
                sym_q = sym_q.where(File.path.ilike(f"%{self.sanitize_sql_pattern(path_filter)}%"))
            if language_filter:
                sym_q = sym_q.where(File.language.ilike(f"%{self.sanitize_sql_pattern(language_filter)}%"))

            sym_rows = (await db.execute(sym_q)).all()

            for sym, f in sym_rows:
                # Deterministic ranking score:
                # 100: Exact symbol name match
                # 80: Starts-with symbol name match
                # 60: Substring symbol name match
                # 45: Qualified name substring match
                score = 30
                if sym.name.lower() == clean_target.lower():
                    score = 100
                elif sym.name.lower().startswith(clean_target.lower()):
                    score = 80
                elif clean_target.lower() in sym.name.lower():
                    score = 60
                elif sym.qualified_name and clean_target.lower() in sym.qualified_name.lower():
                    score = 45

                symbols_list.append({
                    "id": sym.id,
                    "name": sym.name,
                    "symbol_type": sym.symbol_type,
                    "qualified_name": sym.qualified_name or sym.name,
                    "file_id": sym.file_id,
                    "file_path": f.path,
                    "start_line": sym.start_line,
                    "end_line": sym.end_line,
                    "language": f.language,
                    "docstring": sym.docstring,
                    "score": score,
                    "match_reason": f"Matches symbol name '{sym.name}' ({sym.symbol_type})",
                })

            symbols_list.sort(key=lambda x: (-x["score"], x["name"]))

        # -------------------------------------------------------------
        # 2. FILE SEARCH (Ranked with Deterministic Signals)
        # -------------------------------------------------------------
        if search_type in ["all", "file", "query"] and intent in ["KEYWORD_SEARCH", "FILE_SEARCH", "SYMBOL_SEARCH", "ARCHITECTURE_SEARCH"]:
            for f in repo_files:
                f_basename = f.path.split("/")[-1]
                score = 0
                # Deterministic ranking:
                # 95: Exact filename match
                # 75: Starts-with filename match
                # 55: Substring filename match
                # 35: Path substring match
                if f_basename.lower() == clean_target.lower():
                    score = 95
                elif f_basename.lower().startswith(clean_target.lower()):
                    score = 75
                elif clean_target.lower() in f_basename.lower():
                    score = 55
                elif clean_target.lower() in f.path.lower():
                    score = 35

                if score > 0:
                    files_list.append({
                        "id": f.id,
                        "path": f.path,
                        "language": f.language,
                        "line_count": f.line_count,
                        "size_bytes": f.size_bytes,
                        "score": score,
                        "match_reason": f"File path matches '{clean_target}'",
                    })

            files_list.sort(key=lambda x: (-x["score"], x["path"]))

        # -------------------------------------------------------------
        # 3. DIRECTORY SEARCH & AGGREGATIONS
        # -------------------------------------------------------------
        if search_type in ["all", "directory", "query"] and (intent in ["DIRECTORY_SEARCH", "KEYWORD_SEARCH", "ARCHITECTURE_SEARCH"] or "/" in clean_target or not "." in clean_target):
            dir_stats: Dict[str, Dict[str, Any]] = {}
            for f in repo_files:
                parts = f.path.split("/")
                if len(parts) > 1:
                    dir_path = "/".join(parts[:-1])
                    if clean_target.lower() in dir_path.lower():
                        if dir_path not in dir_stats:
                            dir_stats[dir_path] = {
                                "directory": dir_path,
                                "file_count": 0,
                                "line_count": 0,
                                "symbol_count": 0,
                            }
                        dir_stats[dir_path]["file_count"] += 1
                        dir_stats[dir_path]["line_count"] += (f.line_count or 0)

            for d_path, stats in dir_stats.items():
                dirs_list.append({
                    "directory": d_path,
                    "file_count": stats["file_count"],
                    "line_count": stats["line_count"],
                    "symbol_count": stats["symbol_count"],
                    "match_reason": f"Directory matching '{clean_target}'",
                })
            dirs_list.sort(key=lambda d: (-d["file_count"], d["directory"]))

        # -------------------------------------------------------------
        # 4. DEPENDENCY SEARCH (Ranked)
        # -------------------------------------------------------------
        if search_type in ["all", "dependency", "query"] or intent in ["DEPENDENCY_INCOMING", "DEPENDENCY_OUTGOING", "CALLER_SEARCH", "CALLEE_SEARCH"]:
            all_repo_deps_q = select(Dependency).where(Dependency.repository_id == repository_id)
            all_repo_deps = (await db.execute(all_repo_deps_q)).scalars().all()

            for dep in all_repo_deps:
                meta = dep.metadata_json or {}
                target_path = meta.get("target_path") or ""
                src_path = meta.get("source_path")
                if not src_path and dep.source_file_id and dep.source_file_id in file_id_to_obj:
                    src_path = file_id_to_obj[dep.source_file_id].path

                target_stem = clean_target.split('.')[0].lower()
                is_match = (
                    clean_target.lower() in dep.name.lower()
                    or target_stem in dep.name.lower()
                    or (target_path and (clean_target.lower() in target_path.lower() or target_stem in target_path.lower()))
                    or (src_path and clean_target.lower() in src_path.lower())
                )

                if is_match:
                    score = 60
                    if dep.name.lower() == clean_target.lower():
                        score = 85
                    elif dep.name.lower().startswith(clean_target.lower()):
                        score = 75

                    rel_type = "outgoing" if (src_path and clean_target.lower() in src_path.lower()) else "incoming"
                    deps_list.append({
                        "id": dep.id,
                        "dependency_type": dep.dependency_type,
                        "name": dep.name,
                        "source_file_id": dep.source_file_id,
                        "source_path": src_path or "Unknown",
                        "target_file_id": dep.target_file_id,
                        "target_path": target_path or dep.name,
                        "line": meta.get("line") or meta.get("start_line"),
                        "resolved": meta.get("resolved", dep.target_file_id is not None),
                        "relationship_type": rel_type,
                        "score": score,
                        "match_reason": f"'{src_path or 'Module'}' imports '{dep.name}'",
                    })

            deps_list.sort(key=lambda d: (-d.get("score", 0), d["name"]))

        # -------------------------------------------------------------
        # 5. ARCHITECTURE SEARCH (Modules, Layers, Patterns, Entry Points)
        # -------------------------------------------------------------
        if search_type in ["all", "architecture", "query"] or intent == "ARCHITECTURE_SEARCH":
            try:
                from backend.app.services.architecture_service import architecture_service
                files_data = [
                    {"id": f.id, "path": f.path, "language": f.language, "line_count": f.line_count, "source_metadata": f.source_metadata or {}}
                    for f in repo_files
                ]
                syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id).limit(300))
                syms_data = [
                    {"id": s.id, "file_id": s.file_id, "name": s.name, "symbol_type": s.symbol_type, "start_line": s.start_line, "end_line": s.end_line}
                    for s in syms_res.scalars().all()
                ]
                deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id).limit(300))
                deps_data = [
                    {"id": d.id, "name": d.name, "source_path": file_map.get(d.source_file_id), "target_path": file_map.get(d.target_file_id) or d.name, "resolved": d.target_file_id is not None}
                    for d in deps_res.scalars().all()
                ]
                arch_model = architecture_service.build_architecture_model(
                    repository_id=repository_id,
                    files=files_data,
                    dependencies=deps_data,
                    symbols=syms_data,
                )

                # Search Modules
                for m in arch_model.get("modules", []):
                    if clean_target.lower() in m.get("name", "").lower() or clean_target.lower() in m.get("layer", "").lower():
                        score = 90 if m.get("name", "").lower() == clean_target.lower() else 70
                        arch_list.append({
                            "id": m.get("id"),
                            "name": m.get("name"),
                            "node_type": "module",
                            "description": m.get("description"),
                            "file_count": m.get("file_count", 0),
                            "score": score,
                            "match_reason": f"Architecture module in '{m.get('layer')}' layer",
                        })

                # Search Layers
                for lyr in arch_model.get("layers", []):
                    if clean_target.lower() in lyr.get("name", "").lower() or clean_target.lower() in lyr.get("category", "").lower():
                        score = 85 if lyr.get("name", "").lower() == clean_target.lower() else 65
                        arch_list.append({
                            "id": f"layer_{lyr.get('name')}",
                            "name": lyr.get("name"),
                            "node_type": "layer",
                            "description": lyr.get("description"),
                            "file_count": lyr.get("file_count", 0),
                            "score": score,
                            "match_reason": f"Architecture layer ({lyr.get('category')})",
                        })

                # Search Entry Points
                for ep in arch_model.get("entry_points", []):
                    if clean_target.lower() in ep.get("file_path", "").lower() or (ep.get("symbol") and clean_target.lower() in ep.get("symbol", "").lower()):
                        arch_list.append({
                            "id": f"entry_{ep.get('file_path')}",
                            "name": ep.get("symbol") or ep.get("file_path"),
                            "node_type": "entry_point",
                            "description": f"Entry point: {ep.get('reason')} ({ep.get('framework') or 'Application'})",
                            "file_count": 1,
                            "score": 80,
                            "match_reason": f"Application entry point at {ep.get('file_path')}:{ep.get('line', 1)}",
                        })

                # Search Patterns
                for pat in arch_model.get("patterns", []):
                    if clean_target.lower() in pat.get("pattern", "").lower():
                        arch_list.append({
                            "id": f"pattern_{pat.get('pattern')}",
                            "name": pat.get("pattern"),
                            "node_type": "pattern",
                            "description": pat.get("description"),
                            "file_count": len(pat.get("evidence", [])),
                            "score": 75,
                            "match_reason": f"Detected architectural pattern ({pat.get('confidence')} confidence)",
                        })

                arch_list.sort(key=lambda a: (-a.get("score", 0), a["name"]))
            except Exception as e:
                logger.warning(f"Error during architecture search in repo '{repository_id}': {e}")

        # -------------------------------------------------------------
        # 6. SOURCE CODE TEXT SEARCH (With 3-Line Context Snippet)
        # -------------------------------------------------------------
        if search_type in ["all", "code", "query"] and intent in ["KEYWORD_SEARCH", "SOURCE_SEARCH", "SYMBOL_SEARCH"]:
            raw_code = source_code_service.search_repository_code(
                repository_id=repository_id,
                query=clean_target,
                file_map=file_map,
                limit=limit * 2,
            )

            for m in raw_code:
                # Build safe 3-line context snippet
                file_src_info = source_code_service.get_file_source(repository_id, m["file_path"])
                full_src = file_src_info.get("source", "")
                src_lines = full_src.splitlines() if full_src else []
                line_idx = m["line_number"] - 1

                context_lines = []
                start_l = max(0, line_idx - 1)
                end_l = min(len(src_lines), line_idx + 2)

                for i in range(start_l, end_l):
                    context_lines.append({
                        "line_number": i + 1,
                        "content": src_lines[i] if i < len(src_lines) else "",
                        "is_target": (i == line_idx),
                    })

                code_matches_list.append({
                    "file_id": m["file_id"],
                    "file_path": m["file_path"],
                    "line_number": m["line_number"],
                    "line_content": m["line_content"],
                    "match_start": m["match_start"],
                    "match_end": m["match_end"],
                    "context_snippet": context_lines,
                    "match_reason": f"Code match at line {m['line_number']}",
                })

        total_matches = (
            len(symbols_list)
            + len(files_list)
            + len(code_matches_list)
            + len(deps_list)
            + len(dirs_list)
            + len(arch_list)
        )

        # Apply pagination across groups
        paged_symbols = symbols_list[offset : offset + limit]
        paged_files = files_list[offset : offset + limit]
        paged_code = code_matches_list[offset : offset + limit]
        paged_deps = deps_list[offset : offset + limit]
        paged_dirs = dirs_list[offset : offset + limit]
        paged_arch = arch_list[offset : offset + limit]

        has_more = (
            len(symbols_list) > offset + limit
            or len(files_list) > offset + limit
            or len(code_matches_list) > offset + limit
            or len(deps_list) > offset + limit
            or len(dirs_list) > offset + limit
            or len(arch_list) > offset + limit
        )

        return {
            "repository_id": repository_id,
            "query": query_str,
            "intent": intent,
            "explanation": explanation or f"Found {total_matches} matching results",
            "total_matches": total_matches,
            "symbols": paged_symbols,
            "symbol_matches": paged_symbols,
            "files": paged_files,
            "code_matches": paged_code,
            "dependencies": paged_deps,
            "directories": paged_dirs,
            "architecture": paged_arch,
            "architecture_matches": paged_arch,
            "limit": limit,
            "offset": offset,
            "has_more": has_more,
        }


search_intelligence_service = SearchIntelligenceService()

