import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional, Set, Tuple

logger = logging.getLogger("codeatlas.dependency_resolution")


class DependencyResolutionService:
    """
    Resolves real imports from parsed source files into repository-internal dependencies.
    Maps Python, JavaScript, and TypeScript import statements to target repository files.
    """

    def __init__(self):
        pass

    def load_tsconfig_aliases(self, repo_dir: Path) -> Dict[str, str]:
        """
        Discover path aliases in tsconfig.json or jsconfig.json (e.g., '@/*' -> 'src/*').
        """
        aliases: Dict[str, str] = {}
        for config_name in ("tsconfig.json", "jsconfig.json"):
            cfg_path = repo_dir / config_name
            if cfg_path.exists() and cfg_path.is_file():
                try:
                    with open(cfg_path, "r", encoding="utf-8", errors="replace") as f:
                        data = json.load(f)
                    paths = data.get("compilerOptions", {}).get("paths", {})
                    for alias_key, target_list in paths.items():
                        if target_list and isinstance(target_list, list):
                            target = target_list[0]
                            # Clean up wildcard markers
                            key_prefix = alias_key.rstrip("*").rstrip("/")
                            target_prefix = target.rstrip("*").rstrip("/").lstrip("./").lstrip("/")
                            aliases[key_prefix] = target_prefix
                except Exception as e:
                    logger.debug(f"Could not parse {config_name} for aliases in {repo_dir}: {e}")
        return aliases

    def resolve_dependencies(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        repo_dir: Optional[Path] = None,
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Resolves all internal dependencies from scanned files with extracted imports.
        
        Returns:
            (resolved_dependencies, unresolved_dependencies)
        """
        resolved_deps: List[Dict[str, Any]] = []
        unresolved_deps: List[Dict[str, Any]] = []

        # 1. Build fast indexed lookup structures
        # Map path -> file dict (exact relative POSIX path e.g. 'src/services/auth.py')
        path_to_file: Dict[str, Dict[str, Any]] = {f["path"]: f for f in files}

        # Map without extension -> file dict (e.g. 'src/services/auth' -> file)
        stem_to_file: Dict[str, Dict[str, Any]] = {}
        for f in files:
            p = f["path"]
            # Strip known code extensions
            for ext in (".py", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"):
                if p.endswith(ext):
                    stem = p[:-len(ext)]
                    stem_to_file[stem] = f
                    break

        # Map module notation to file (e.g. 'src.services.auth' -> file, 'services.auth' -> file)
        module_to_file: Dict[str, Dict[str, Any]] = {}
        for f in files:
            p = f["path"]
            if p.endswith(".py"):
                mod_clean = p[:-3].replace("/", ".")
                module_to_file[mod_clean] = f
                # If path starts with src/, also map without src. prefix (common python root)
                if mod_clean.startswith("src."):
                    module_to_file[mod_clean[4:]] = f
                if mod_clean.startswith("app."):
                    module_to_file[mod_clean[4:]] = f
                # Map __init__.py as package
                if mod_clean.endswith(".__init__"):
                    pkg = mod_clean[:-9]
                    module_to_file[pkg] = f

        # Discover tsconfig aliases if directory exists
        aliases = self.load_tsconfig_aliases(repo_dir) if repo_dir else {}

        # Set to prevent duplicate dependency edges for the same (source_id, target_id)
        seen_edges: Set[Tuple[str, str]] = set()

        for source_file in files:
            source_id = source_file.get("id")
            source_path = source_file["path"]
            source_lang = source_file.get("language") or "Unknown"
            source_dir = Path(source_path).parent.as_posix()
            if source_dir == ".":
                source_dir = ""

            source_meta = source_file.get("source_metadata") or {}
            imports = source_meta.get("imports", [])

            for imp in imports:
                module_name = imp.get("module") or ""
                import_name = imp.get("name") or module_name
                start_line = imp.get("start_line", 1)
                end_line = imp.get("end_line", 1)
                imp_type = imp.get("import_type", "IMPORT")

                target_file: Optional[Dict[str, Any]] = None
                resolved_type = "IMPORT"

                # -------------------------------------------------------------
                # Python Import Resolution
                # -------------------------------------------------------------
                if source_lang == "Python":
                    target_file, resolved_type = self._resolve_python_import(
                        module_name,
                        import_name,
                        source_path,
                        source_dir,
                        path_to_file,
                        module_to_file,
                    )

                # -------------------------------------------------------------
                # JavaScript / TypeScript Import Resolution
                # -------------------------------------------------------------
                elif source_lang in ("TypeScript", "TSX", "JavaScript"):
                    target_file, resolved_type = self._resolve_ts_js_import(
                        module_name,
                        source_path,
                        source_dir,
                        aliases,
                        path_to_file,
                        stem_to_file,
                    )

                # -------------------------------------------------------------
                # Process Resolution Result
                # -------------------------------------------------------------
                if target_file:
                    target_id = target_file.get("id")
                    target_path = target_file["path"]

                    # STRICT ISOLATION & INTEGRITY CHECKS:
                    # 1. No self-loops (source == target)
                    # 2. Source & target must be in the same repository
                    is_same_file = (source_id and target_id and source_id == target_id) or (source_path == target_path)
                    
                    if not is_same_file:
                        edge_key = (source_path, target_path)
                        if edge_key not in seen_edges:
                            seen_edges.add(edge_key)
                            resolved_deps.append({
                                "repository_id": repository_id,
                                "source_file_id": source_id,
                                "target_file_id": target_id,
                                "source_path": source_path,
                                "target_path": target_path,
                                "name": target_path,
                                "import_name": module_name or import_name,
                                "dependency_type": resolved_type,
                                "resolved": True,
                                "start_line": start_line,
                                "end_line": end_line,
                            })
                else:
                    # External / Unresolved import
                    unresolved_deps.append({
                        "repository_id": repository_id,
                        "source_file_id": source_id,
                        "target_file_id": None,
                        "source_path": source_path,
                        "target_path": None,
                        "name": module_name or import_name,
                        "import_name": module_name or import_name,
                        "dependency_type": "PACKAGE_IMPORT",
                        "resolved": False,
                        "start_line": start_line,
                        "end_line": end_line,
                    })

        return resolved_deps, unresolved_deps

    def _resolve_python_import(
        self,
        module_name: str,
        import_name: str,
        source_path: str,
        source_dir: str,
        path_to_file: Dict[str, Dict[str, Any]],
        module_to_file: Dict[str, Dict[str, Any]],
    ) -> Tuple[Optional[Dict[str, Any]], str]:
        """
        Resolves Python module import (absolute, relative, from-import).
        """
        # 1. Relative import (e.g., .auth or ..models.user)
        if module_name.startswith("."):
            dots = 0
            while dots < len(module_name) and module_name[dots] == ".":
                dots += 1
            rel_submod = module_name[dots:]

            # Base directory according to dot count
            current_parts = [p for p in source_dir.split("/") if p]
            levels_up = dots - 1
            if levels_up <= len(current_parts):
                target_base_parts = current_parts[: len(current_parts) - levels_up]
                target_base = "/".join(target_base_parts)

                # Candidate paths
                candidates = []
                if rel_submod:
                    rel_path = rel_submod.replace(".", "/")
                    full_rel = f"{target_base}/{rel_path}".lstrip("/")
                    candidates.append(f"{full_rel}.py")
                    candidates.append(f"{full_rel}/__init__.py")
                else:
                    # from . import auth -> import_name is 'auth'
                    if import_name:
                        full_rel = f"{target_base}/{import_name}".lstrip("/")
                        candidates.append(f"{full_rel}.py")
                        candidates.append(f"{full_rel}/__init__.py")

                for cand in candidates:
                    if cand in path_to_file:
                        return path_to_file[cand], "RELATIVE_IMPORT"

        # 2. Module direct match in module_to_file (e.g., services.auth -> src/services/auth.py)
        if module_name in module_to_file:
            return module_to_file[module_name], "IMPORT"

        # 3. Check combined module_name + import_name (e.g. from services import auth -> services.auth)
        if module_name and import_name:
            combined = f"{module_name}.{import_name}"
            if combined in module_to_file:
                return module_to_file[combined], "IMPORT"

        # 4. Check relative to source directory as fallback
        if source_dir and module_name:
            local_cand = f"{source_dir}/{module_name.replace('.', '/')}.py"
            if local_cand in path_to_file:
                return path_to_file[local_cand], "RELATIVE_IMPORT"

        return None, "PACKAGE_IMPORT"

    def _resolve_ts_js_import(
        self,
        module_path: str,
        source_path: str,
        source_dir: str,
        aliases: Dict[str, str],
        path_to_file: Dict[str, Dict[str, Any]],
        stem_to_file: Dict[str, Dict[str, Any]],
    ) -> Tuple[Optional[Dict[str, Any]], str]:
        """
        Resolves JavaScript and TypeScript imports (relative, extensions, index, aliases).
        """
        if not module_path:
            return None, "PACKAGE_IMPORT"

        resolved_raw_path: Optional[str] = None
        dep_type = "IMPORT"

        # 1. Path alias resolution (e.g. @/components/Dashboard -> src/components/Dashboard)
        for alias_key, target_prefix in aliases.items():
            if module_path == alias_key or module_path.startswith(f"{alias_key}/"):
                sub_path = module_path[len(alias_key):].lstrip("/")
                resolved_raw_path = f"{target_prefix}/{sub_path}".lstrip("/")
                dep_type = "ALIAS_IMPORT"
                break

        # 2. Relative import resolution (e.g. ./services/AuthService or ../auth/login)
        if not resolved_raw_path and (module_path.startswith("./") or module_path.startswith("../")):
            dep_type = "RELATIVE_IMPORT"
            # Normalize path relative to source directory
            combined = f"{source_dir}/{module_path}" if source_dir else module_path
            # Normalize ../ and ./
            parts = []
            for part in combined.split("/"):
                if part == "." or not part:
                    continue
                elif part == "..":
                    if parts:
                        parts.pop()
                else:
                    parts.append(part)
            resolved_raw_path = "/".join(parts)

        # 3. If relative or alias path identified, test all valid candidate extensions
        if resolved_raw_path:
            # Exact path match
            if resolved_raw_path in path_to_file:
                return path_to_file[resolved_raw_path], dep_type

            # Stem match
            if resolved_raw_path in stem_to_file:
                return stem_to_file[resolved_raw_path], dep_type

            # Candidate extensions
            for ext in (".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js", "/index.jsx", ".d.ts"):
                cand = f"{resolved_raw_path}{ext}"
                if cand in path_to_file:
                    return path_to_file[cand], dep_type

        return None, "PACKAGE_IMPORT"


dependency_resolver = DependencyResolutionService()
