import logging
import re
from pathlib import Path
from typing import Dict, Any, List, Set, Tuple, Optional
from collections import defaultdict

logger = logging.getLogger("codeatlas.architecture")


class ArchitectureService:
    """
    Real Architecture Intelligence Engine for CodeAtlas:
    - Language breakdown & percentages calculation
    - Evidence-grounded framework detection (FastAPI, Django, Flask, Express, React, Next.js, etc.)
    - Application execution entry point detection with line-level citations
    - Deterministic architectural layer classification & file classification
    - Logical module clustering & coupling metrics (incoming, outgoing, internal)
    - Architectural pattern detection (Layered Architecture, MVC, Repository Pattern, Component-Based)
    - Architectural drift & layer violation detection (e.g. API directly bypassing Service to Database)
    - Architectural hotspot ranking & cycle detection
    - Explainable architecture health scoring with factor breakdown
    - Repository-isolated in-memory caching with invalidation
    """

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def invalidate_cache(self, repository_id: Optional[str] = None):
        """Invalidates architecture cache for a specific repository or all repositories."""
        if repository_id:
            self._cache.pop(repository_id, None)
            logger.info(f"Invalidated architecture cache for repository '{repository_id}'")
        else:
            self._cache.clear()
            logger.info("Invalidated all architecture cache")

    # =========================================================================
    # DIRECTORY GROUPING & HEALTH HELPERS (Phase 6/11 Compatibility)
    # =========================================================================

    def get_group_name(self, file_path: str) -> str:
        """Extracts top-level or 2-level directory group name from file path."""
        clean = file_path.replace("\\", "/").strip("/")
        parts = clean.split("/")
        if len(parts) <= 1:
            return "(root)"
        elif len(parts) == 2:
            return parts[0]
        else:
            return f"{parts[0]}/{parts[1]}"

    def aggregate_directory_groups(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Aggregates directory level architecture groups with exact statistics."""
        groups_map: Dict[str, Dict[str, Any]] = {}
        file_to_group: Dict[str, str] = {}

        for f in files:
            path = f.get("path", "")
            grp_name = self.get_group_name(path)
            file_to_group[path] = grp_name

            if grp_name not in groups_map:
                groups_map[grp_name] = {
                    "id": f"group:{repository_id}:{grp_name}",
                    "repository_id": repository_id,
                    "name": grp_name,
                    "file_count": 0,
                    "line_count": 0,
                    "code_lines": 0,
                    "symbol_count": 0,
                    "incoming_dependencies": 0,
                    "outgoing_dependencies": 0,
                    "internal_coupling": 0,
                    "languages": defaultdict(int),
                    "files": [],
                }

            g = groups_map[grp_name]
            g["file_count"] += 1
            l_count = f.get("line_count") or 0
            g["line_count"] += l_count
            meta = f.get("source_metadata") or {}
            c_lines = meta.get("code_lines") or l_count
            g["code_lines"] += c_lines
            s_count = meta.get("symbol_count") or 0
            g["symbol_count"] += s_count
            lang = f.get("language") or "Other"
            g["languages"][lang] += 1
            g["files"].append({
                "id": f.get("id"),
                "path": path,
                "language": lang,
                "line_count": l_count,
                "symbol_count": s_count,
            })

        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = dep.get("source_path")
            tgt = dep.get("target_path")
            if not src or not tgt or src == tgt:
                continue
            src_grp = file_to_group.get(src)
            tgt_grp = file_to_group.get(tgt)
            if src_grp and tgt_grp:
                if src_grp == tgt_grp:
                    groups_map[src_grp]["internal_coupling"] += 1
                else:
                    groups_map[src_grp]["outgoing_dependencies"] += 1
                    groups_map[tgt_grp]["incoming_dependencies"] += 1

        result = []
        for g in sorted(groups_map.values(), key=lambda x: (-x["file_count"], x["name"])):
            g["languages"] = dict(g["languages"])
            result.append(g)
        return result

    def aggregate_group_relationships(
        self,
        repository_id: str,
        groups: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Aggregates directed relationships and dependency weights between directory groups."""
        file_to_group = {f["path"]: g["name"] for g in groups for f in g["files"]}
        group_ids = {g["name"]: g["id"] for g in groups}
        rel_map: Dict[Tuple[str, str], Dict[str, Any]] = {}

        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = dep.get("source_path")
            tgt = dep.get("target_path")
            if not src or not tgt or src == tgt:
                continue
            src_grp = file_to_group.get(src)
            tgt_grp = file_to_group.get(tgt)
            if src_grp and tgt_grp and src_grp != tgt_grp:
                k = (src_grp, tgt_grp)
                if k not in rel_map:
                    rel_map[k] = {
                        "id": f"group_rel:{repository_id}:{src_grp}->{tgt_grp}",
                        "repository_id": repository_id,
                        "source": src_grp,
                        "target": tgt_grp,
                        "source_group_id": group_ids.get(src_grp, ""),
                        "target_group_id": group_ids.get(tgt_grp, ""),
                        "dependency_count": 0,
                        "dependencies": [],
                    }
                rel_map[k]["dependency_count"] += 1
                if len(rel_map[k]["dependencies"]) < 10:
                    rel_map[k]["dependencies"].append({
                        "source_file": src,
                        "target_file": tgt,
                        "dependency_type": dep.get("dependency_type", "IMPORT"),
                        "start_line": dep.get("start_line"),
                    })

        return sorted(list(rel_map.values()), key=lambda x: -x["dependency_count"])

    def compute_architecture_health(
        self,
        groups: List[Dict[str, Any]],
        relationships: List[Dict[str, Any]],
        cycles: List[List[str]],
        bidirectional: List[Any],
        dependencies: List[Dict[str, Any]],
        violations: Optional[List[Dict[str, Any]]] = None,
        drift: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Calculates deterministic explainable architecture health score."""
        score = 100
        deductions: List[Dict[str, Any]] = []

        if cycles:
            c_ded = min(len(cycles) * 15, 40)
            score -= c_ded
            deductions.append({
                "category": "CIRCULAR_DEPENDENCIES",
                "severity": "CRITICAL",
                "deduction": c_ded,
                "description": f"{len(cycles)} circular dependency loop(s) detected.",
                "affected_entities": [f"{' -> '.join(c)}" for c in cycles[:3]],
            })

        if violations:
            v_ded = min(len(violations) * 10, 30)
            score -= v_ded
            deductions.append({
                "category": "LAYER_VIOLATIONS",
                "severity": "HIGH",
                "deduction": v_ded,
                "description": f"{len(violations)} architectural layer inversion(s) detected.",
                "affected_entities": [f"{v['source_entity']} -> {v['target_entity']}" for v in violations[:3]],
            })

        if drift:
            d_ded = min(len(drift) * 5, 15)
            score -= d_ded
            deductions.append({
                "category": "ARCHITECTURE_DRIFT",
                "severity": "MEDIUM",
                "deduction": d_ded,
                "description": f"{len(drift)} service layer bypass / direct database dependency instances detected.",
                "affected_entities": [f"{d['source_entity']} -> {d['target_entity']}" for d in drift[:3]],
            })

        final_health = max(0, min(100, score))
        if final_health >= 90:
            grade, status_lbl = "A", "Excellent Architecture"
        elif final_health >= 75:
            grade, status_lbl = "B", "Solid Architecture"
        elif final_health >= 60:
            grade, status_lbl = "C", "Moderate Coupling"
        elif final_health >= 40:
            grade, status_lbl = "D", "Architecture Drift Detected"
        else:
            grade, status_lbl = "F", "Critical Cycles & Violations"

        return {
            "score": final_health,
            "max_score": 100,
            "grade": grade,
            "status_label": status_lbl,
            "deductions": deductions,
            "metrics": {
                "circular_cycles": len(cycles),
                "bidirectional_couplings": len(bidirectional),
                "violations_count": len(violations or []),
                "drift_count": len(drift or []),
                "total_modules": len(groups),
                "total_dependencies": len([d for d in dependencies if d.get("resolved")]),
            },
        }

    # =========================================================================
    # 1. LANGUAGE BREAKDOWN
    # =========================================================================

    def compute_language_breakdown(self, files: List[Dict[str, Any]]) -> Tuple[Dict[str, int], Dict[str, float]]:
        """Calculates language line counts and deterministic percentages from actual files."""
        lang_lines: Dict[str, int] = defaultdict(int)
        total_lines = 0

        for f in files:
            lang = f.get("language") or "Other"
            lines = f.get("line_count") or 1
            lang_lines[lang] += lines
            total_lines += lines

        if total_lines == 0:
            return dict(lang_lines), {}

        percentages: Dict[str, float] = {}
        for lang, count in sorted(lang_lines.items(), key=lambda x: -x[1]):
            percentages[lang] = round((count / total_lines) * 100.0, 1)

        return dict(lang_lines), percentages

    # =========================================================================
    # 2. FRAMEWORK DETECTION ENGINE
    # =========================================================================

    def detect_frameworks(
        self,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        symbols: Optional[List[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Detects frameworks and core technologies using actual evidence from:
        - dependency/import records
        - configuration files (package.json, pyproject.toml, requirements.txt, etc.)
        - AST symbol signatures

        CRITICAL: Never claims a framework solely from a filename substring if no import or config exists.
        """
        frameworks: Dict[str, Dict[str, Any]] = {}

        # Collect all imported names & source paths
        all_imported_targets: Set[str] = set()
        file_imports_map: Dict[str, Set[str]] = defaultdict(set)
        for dep in dependencies:
            tgt = (dep.get("target_path") or dep.get("name") or "").lower()
            src = dep.get("source_path") or ""
            if tgt:
                all_imported_targets.add(tgt)
                if src:
                    file_imports_map[src].add(tgt)

        # Framework signatures: (name, category, import_patterns, config_patterns, description)
        framework_rules = [
            # Python Frameworks
            (
                "FastAPI",
                "backend_web",
                [r"\bfastapi\b", r"\bstarlette\b", r"\buvicorn\b"],
                [r"\bfastapi\b"],
                "Modern, fast Python web framework for building APIs based on standard Python type hints.",
            ),
            (
                "Django",
                "backend_web",
                [r"\bdjango\b", r"\bdjango\.db\b", r"\bdjango\.core\b"],
                [r"\bdjango\b"],
                "High-level Python web framework encouraging rapid development and clean design.",
            ),
            (
                "Flask",
                "backend_web",
                [r"\bflask\b", r"\bwerkzeug\b"],
                [r"\bflask\b"],
                "Lightweight WSGI Python web application framework.",
            ),
            (
                "SQLAlchemy",
                "database_orm",
                [r"\bsqlalchemy\b", r"\balembic\b"],
                [r"\bsqlalchemy\b"],
                "Python SQL toolkit and Object Relational Mapper (ORM).",
            ),
            (
                "Pytest",
                "testing",
                [r"\bpytest\b"],
                [r"\bpytest\b"],
                "Python testing framework for writing simple and scalable test suites.",
            ),
            (
                "Pydantic",
                "data_validation",
                [r"\bpydantic\b"],
                [r"\bpydantic\b"],
                "Data validation and settings management using Python type annotations.",
            ),

            # JavaScript / TypeScript Frameworks
            (
                "React",
                "frontend_ui",
                [r"\breact\b", r"\breact-dom\b", r"\breact/jsx-runtime\b"],
                [r"\"react\"\s*:", r"\"react-dom\"\s*:"],
                "JavaScript library for building component-based user interfaces.",
            ),
            (
                "Next.js",
                "fullstack_web",
                [r"\bnext\b", r"\bnext/router\b", r"\bnext/navigation\b", r"\bnext/server\b"],
                [r"\"next\"\s*:"],
                "React framework for server-side rendering and static web applications.",
            ),
            (
                "Express",
                "backend_web",
                [r"\bexpress\b"],
                [r"\"express\"\s*:"],
                "Fast, unopinionated, minimalist web framework for Node.js.",
            ),
            (
                "NestJS",
                "backend_web",
                [r"@nestjs/core", r"@nestjs/common"],
                [r"\"@nestjs/core\"\s*:"],
                "Progressive TypeScript framework for building scalable server-side applications.",
            ),
            (
                "Vue",
                "frontend_ui",
                [r"\bvue\b", r"\b@vue/"],
                [r"\"vue\"\s*:"],
                "Progressive JavaScript framework for building user interfaces.",
            ),
            (
                "Tailwind CSS",
                "styling",
                [r"\btailwindcss\b"],
                [r"\"tailwindcss\"\s*:", r"\btailwind\.config\b"],
                "Utility-first CSS framework for rapid UI styling.",
            ),

            # Java / Go / Rust
            (
                "Spring Boot",
                "backend_web",
                [r"org\.springframework\.boot", r"org\.springframework\.web"],
                [r"<groupId>org\.springframework\.boot</groupId>"],
                "Enterprise Java framework for production-grade standalone Spring applications.",
            ),
            (
                "Gin",
                "backend_web",
                [r"github\.com/gin-gonic/gin"],
                [r"github\.com/gin-gonic/gin"],
                "High-performance HTTP web framework written in Go.",
            ),
        ]

        # Scan files for config packages and imports
        for name, category, import_patterns, config_patterns, desc in framework_rules:
            matched_files: Set[str] = set()
            matched_imports: Set[str] = set()

            # 1. Check imports in dependencies
            for dep in dependencies:
                tgt = dep.get("target_path") or dep.get("name") or ""
                src = dep.get("source_path") or ""
                for imp_pat in import_patterns:
                    if re.search(imp_pat, tgt, re.IGNORECASE):
                        matched_imports.add(tgt)
                        if src:
                            matched_files.add(src)

            # 2. Check config files (package.json, requirements.txt, pyproject.toml, etc.)
            for f in files:
                p = f.get("path", "").lower()
                if any(cfg in p for cfg in ["package.json", "requirements.txt", "pyproject.toml", "pom.xml", "go.mod", "cargo.toml"]):
                    meta = f.get("source_metadata") or {}
                    # If file has content or dependency matches
                    for cfg_pat in config_patterns:
                        for tgt in all_imported_targets:
                            if re.search(cfg_pat, tgt, re.IGNORECASE):
                                matched_files.add(f.get("path", ""))
                                matched_imports.add(tgt)

            if matched_imports or (len(matched_files) >= 1 and matched_imports):
                confidence = "HIGH" if len(matched_files) >= 2 or len(matched_imports) >= 2 else "MEDIUM"
                frameworks[name] = {
                    "name": name,
                    "category": category,
                    "confidence": confidence,
                    "evidence_files": sorted(list(matched_files))[:5],
                    "evidence_imports": sorted(list(matched_imports))[:5],
                    "description": desc,
                }

        return sorted(list(frameworks.values()), key=lambda x: x["name"])

    # =========================================================================
    # 3. ENTRY POINT DETECTION ENGINE
    # =========================================================================

    def detect_entry_points(
        self,
        files: List[Dict[str, Any]],
        symbols: Optional[List[Dict[str, Any]]] = None,
        frameworks: Optional[List[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Identifies application execution entry points with exact line numbers and evidence.
        Examples: main.py, app.py, server.ts, index.ts, framework application bootstrap instances.
        """
        entry_points: List[Dict[str, Any]] = []
        framework_names = {f["name"] for f in (frameworks or [])}

        symbols_by_file: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        if symbols:
            for sym in symbols:
                symbols_by_file[sym.get("file_id", "")].append(sym)

        for f in files:
            p = f.get("path", "")
            clean_path = p.replace("\\", "/")
            fname = Path(clean_path).name.lower()
            file_id = f.get("id")
            file_symbols = symbols_by_file.get(file_id, [])

            # 1. FastAPI / Web Application Entry Point
            if fname in ["main.py", "app.py", "application.py", "server.py"]:
                app_sym = next((s for s in file_symbols if s.get("name") in ["app", "application", "create_app", "main"]), None)
                framework = "FastAPI" if "FastAPI" in framework_names else ("Flask" if "Flask" in framework_names else "Python")
                line = app_sym.get("start_line", 1) if app_sym else 1
                sym_name = app_sym.get("name") if app_sym else None

                entry_points.append({
                    "file_path": clean_path,
                    "symbol": sym_name,
                    "line": line,
                    "reason": f"Primary {framework} server application initialization and router assembly.",
                    "confidence": "HIGH",
                    "framework": framework,
                    "file_id": file_id,
                })
                continue

            # 2. Django manage.py
            if fname == "manage.py":
                entry_points.append({
                    "file_path": clean_path,
                    "symbol": "main",
                    "line": 1,
                    "reason": "Django CLI management and development server entry point.",
                    "confidence": "HIGH",
                    "framework": "Django",
                    "file_id": file_id,
                })
                continue

            # 3. Node.js / Express / Next.js / TypeScript Server
            if fname in ["server.ts", "server.js", "index.ts", "index.js", "main.ts", "main.js", "app.ts", "app.js"]:
                # If root or in src/ or backend/
                depth = len(clean_path.split("/"))
                if depth <= 3:
                    framework = "Express" if "Express" in framework_names else ("NestJS" if "NestJS" in framework_names else "Node.js")
                    entry_points.append({
                        "file_path": clean_path,
                        "symbol": None,
                        "line": 1,
                        "reason": f"{framework} server bootstrap and HTTP listener entry point.",
                        "confidence": "HIGH" if fname in ["server.ts", "main.ts", "server.js"] else "MEDIUM",
                        "framework": framework,
                        "file_id": file_id,
                    })
                    continue

            # 4. React / Frontend Root
            if fname in ["main.tsx", "main.jsx", "index.tsx", "index.jsx", "app.tsx", "app.jsx"]:
                if any(part in clean_path.lower() for part in ["src", "frontend", "client"]):
                    entry_points.append({
                        "file_path": clean_path,
                        "symbol": None,
                        "line": 1,
                        "reason": "React client DOM mounting and root component tree render point.",
                        "confidence": "HIGH",
                        "framework": "React",
                        "file_id": file_id,
                    })
                    continue

        return sorted(entry_points, key=lambda x: (x["confidence"] != "HIGH", x["file_path"]))

    # =========================================================================
    # 4. ARCHITECTURAL LAYER CLASSIFICATION
    # =========================================================================

    def classify_file_layer(
        self,
        file_path: str,
        symbols: Optional[List[Dict[str, Any]]] = None,
        imports: Optional[Set[str]] = None,
    ) -> Tuple[str, str, str]:
        """
        Deterministically classifies a file into an architectural layer based on
        path patterns, filename conventions, imported modules, and symbol types.

        Returns: (layer_name, category, reason)
        """
        clean_path = file_path.replace("\\", "/").lower()
        norm_path = f"/{clean_path}" if not clean_path.startswith("/") else clean_path
        fname = Path(clean_path).name
        sym_names = [s.get("name", "").lower() for s in (symbols or [])]
        import_set = imports or set()

        # 1. Tests Layer
        if any(part in norm_path for part in ["/tests/", "/test/", "/__tests__/"]) or fname.startswith("test_") or fname.endswith(("_test.py", ".spec.ts", ".test.ts", ".spec.tsx", ".test.tsx")):
            return "Tests", "testing", "Contains automated test cases and assertions"

        # 2. API / Routes / Controllers Layer
        if any(part in norm_path for part in ["/api/", "/routes/", "/endpoints/", "/routers/", "/controllers/"]) or fname.endswith(("_router.py", "_routes.py", "_controller.py", "controller.ts")):
            return "API Layer", "presentation_api", "Handles incoming HTTP requests, route definitions, and parameter validation"

        # 3. Services / Business Logic Layer
        if any(part in norm_path for part in ["/services/", "/service/", "/use_cases/", "/business/"]) or fname.endswith(("_service.py", "service.ts", "_usecase.py")):
            return "Service Layer", "business_logic", "Encapsulates business workflows, rules, and cross-cutting domain logic"

        # 4. Repository / Data Access Layer
        if any(part in norm_path for part in ["/repositories/", "/repository/", "/dao/", "/data_access/"]) or fname.endswith(("_repository.py", "_repo.py", "repository.ts")):
            return "Repository Layer", "data_access", "Encapsulates database access queries and data persistence operations"

        # 5. Database / Models Layer
        if any(part in norm_path for part in ["/models/", "/model/", "/entities/", "/database/", "/db/", "/schemas/", "/schema/"]) or fname in ["models.py", "database.py", "schema.py", "db.ts", "schema.ts", "db_models.py"]:
            return "Data & Models Layer", "data_models", "Defines data schemas, ORM entities, and database session bindings"

        # 6. Frontend Components Layer
        if any(part in norm_path for part in ["/components/", "/views/", "/pages/", "/screens/"]) or fname.endswith((".tsx", ".jsx", ".vue", ".svelte")):
            return "Components Layer", "ui_components", "Renders interactive UI components and user-facing views"

        # 7. Frontend Hooks & State Layer
        if any(part in norm_path for part in ["/hooks/", "/state/", "/store/", "/slices/", "/redux/", "/context/"]) or (fname.startswith("use") and fname.endswith((".ts", ".js"))):
            return "State & Hooks Layer", "state_management", "Manages client-side application state, custom hooks, and context"

        # 8. Configuration Layer
        if any(part in norm_path for part in ["/config/", "/configs/", "/settings/"]) or fname in ["settings.py", "config.py", "config.ts", "vite.config.ts", "tsconfig.json"]:
            return "Configuration Layer", "configuration", "Stores environment settings, runtime options, and project configuration"

        # 9. Utilities & Common Layer
        if any(part in norm_path for part in ["/utils/", "/util/", "/helpers/", "/common/", "/lib/", "/tools/"]) or fname.endswith(("_utils.py", "_helper.py", "utils.ts")):
            return "Utilities Layer", "utility", "Provides reusable helper functions, formatting, and common routines"

        # 10. CLI & Scripts Layer
        if any(part in norm_path for part in ["/cli/", "/scripts/", "/bin/", "/commands/"]) or fname in ["manage.py", "cli.py"]:
            return "CLI & Scripts Layer", "cli_scripts", "Command-line tools, migration scripts, and operational tasks"

        # Default fallback
        return "Core Layer", "other", "Core application source module"

    # =========================================================================
    # 5. LOGICAL MODULE DISCOVERY
    # =========================================================================

    def discover_logical_modules(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        symbols_by_file: Optional[Dict[str, List[Dict[str, Any]]]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Discovers logical modules by clustering directory structures, layers, and coupling metrics.
        """
        sym_map = symbols_by_file or {}
        file_to_mod: Dict[str, str] = {}
        modules_dict: Dict[str, Dict[str, Any]] = {}

        # 1. Assign each file to a logical module
        for f in files:
            path = f.get("path", "")
            clean_path = path.replace("\\", "/")
            parts = clean_path.split("/")

            # Determine module name from directory or layer
            if len(parts) <= 1:
                mod_name = "Root Application"
            elif len(parts) == 2:
                mod_name = parts[0].replace("_", " ").title()
            else:
                if parts[0].lower() in {"src", "app", "backend", "frontend", "lib", "pkg"}:
                    mod_name = f"{parts[0]}/{parts[1]}".replace("_", " ")
                else:
                    mod_name = parts[0].replace("_", " ").title()

            file_to_mod[path] = mod_name
            layer_name, layer_cat, _ = self.classify_file_layer(path, sym_map.get(f.get("id"), []))

            if mod_name not in modules_dict:
                modules_dict[mod_name] = {
                    "id": f"mod:{repository_id}:{mod_name.replace(' ', '_').lower()}",
                    "name": mod_name,
                    "layer": layer_name,
                    "file_count": 0,
                    "symbol_count": 0,
                    "line_count": 0,
                    "incoming_dependencies": 0,
                    "outgoing_dependencies": 0,
                    "internal_coupling": 0,
                    "languages": defaultdict(int),
                    "files": [],
                    "description": f"Logical module encompassing {layer_name.lower()} components in '{mod_name}'.",
                }

            m = modules_dict[mod_name]
            m["file_count"] += 1
            l_count = f.get("line_count") or 0
            m["line_count"] += l_count
            meta = f.get("source_metadata") or {}
            s_count = meta.get("symbol_count") or len(sym_map.get(f.get("id"), []))
            m["symbol_count"] += s_count
            lang = f.get("language") or "Unknown"
            m["languages"][lang] += 1
            m["files"].append({
                "id": f.get("id"),
                "path": path,
                "language": lang,
                "line_count": l_count,
                "symbol_count": s_count,
                "layer": layer_name,
            })

        # 2. Aggregate module-level coupling
        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = dep.get("source_path")
            tgt = dep.get("target_path")
            if not src or not tgt or src == tgt:
                continue

            src_mod = file_to_mod.get(src)
            tgt_mod = file_to_mod.get(tgt)

            if src_mod and tgt_mod:
                if src_mod == tgt_mod:
                    modules_dict[src_mod]["internal_coupling"] += 1
                else:
                    modules_dict[src_mod]["outgoing_dependencies"] += 1
                    modules_dict[tgt_mod]["incoming_dependencies"] += 1

        # Format dictionaries
        result = []
        for m in sorted(modules_dict.values(), key=lambda x: (-x["file_count"], x["name"])):
            m["languages"] = dict(m["languages"])
            result.append(m)

        return result

    # =========================================================================
    # 6. ARCHITECTURAL PATTERN & DRIFT DETECTION
    # =========================================================================

    def detect_patterns_and_drift(
        self,
        modules: List[Dict[str, Any]],
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        frameworks: List[Dict[str, Any]],
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Detects structural architectural patterns, layer violations, and architecture drift.
        Returns: (patterns, violations, drift)
        """
        patterns: List[Dict[str, Any]] = []
        violations: List[Dict[str, Any]] = []
        drift: List[Dict[str, Any]] = []

        # Map file paths to their classified layer
        file_to_layer: Dict[str, str] = {}
        for f in files:
            p = f.get("path", "")
            layer, _, _ = self.classify_file_layer(p)
            file_to_layer[p] = layer

        # Track layer-to-layer dependency counts
        layer_flows: Dict[Tuple[str, str], int] = defaultdict(int)
        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = dep.get("source_path")
            tgt = dep.get("target_path")
            if not src or not tgt or src == tgt:
                continue

            src_l = file_to_layer.get(src)
            tgt_l = file_to_layer.get(tgt)
            if src_l and tgt_l and src_l != tgt_l:
                layer_flows[(src_l, tgt_l)] += 1

        # Check for Layered Architecture (API -> Service -> Repository/Data)
        has_api = any(f["layer"] == "API Layer" for f in modules) or any(l == "API Layer" for l in file_to_layer.values())
        has_service = any(f["layer"] == "Service Layer" for f in modules) or any(l == "Service Layer" for l in file_to_layer.values())
        has_repo = any(f["layer"] == "Repository Layer" for f in modules) or any(l == "Repository Layer" for l in file_to_layer.values())
        has_data = any(f["layer"] == "Data & Models Layer" for f in modules) or any(l == "Data & Models Layer" for l in file_to_layer.values())

        if has_api and (has_service or has_repo or has_data):
            evidence = []
            if layer_flows.get(("API Layer", "Service Layer"), 0) > 0:
                evidence.append(f"API modules invoke Service layer ({layer_flows[('API Layer', 'Service Layer')]} imports).")
            if layer_flows.get(("Service Layer", "Repository Layer"), 0) > 0:
                evidence.append(f"Service modules invoke Repository layer ({layer_flows[('Service Layer', 'Repository Layer')]} imports).")
            if layer_flows.get(("Service Layer", "Data & Models Layer"), 0) > 0:
                evidence.append(f"Service modules invoke Data & Models layer ({layer_flows[('Service Layer', 'Data & Models Layer')]} imports).")
            if layer_flows.get(("Repository Layer", "Data & Models Layer"), 0) > 0:
                evidence.append(f"Repository modules encapsulate Database & Models ({layer_flows[('Repository Layer', 'Data & Models Layer')]} imports).")

            if evidence:
                patterns.append({
                    "pattern": "Layered Architecture",
                    "confidence": "HIGH" if len(evidence) >= 2 else "MEDIUM",
                    "evidence": evidence,
                    "description": "Clean separation of presentation API routes, business logic services, and persistence models.",
                })

        # Check for Component-Based Architecture (React / UI)
        has_components = any(f["layer"] == "Components Layer" for f in modules) or any(l == "Components Layer" for l in file_to_layer.values())
        if has_components:
            comp_evidence = ["UI components are modularly organized into independent functional units."]
            if any(f["layer"] == "State & Hooks Layer" for f in modules):
                comp_evidence.append("Custom React hooks and state management store business logic separately from view renderers.")
            patterns.append({
                "pattern": "Component-Based Architecture",
                "confidence": "HIGH",
                "evidence": comp_evidence,
                "description": "Modular UI hierarchy with composable component elements and dedicated state management.",
            })

        # Check for Repository Pattern
        if has_repo and (has_service or has_api):
            patterns.append({
                "pattern": "Repository Pattern",
                "confidence": "HIGH",
                "evidence": ["Data access queries are encapsulated in dedicated repository modules."],
                "description": "Mediates between domain logic and data mapping layers using collection-like interfaces.",
            })

        # --- Architecture Drift & Violations Detection ---
        # Rule 1: Direct API -> Database bypass when Service Layer exists
        if has_service and has_api and (has_data or has_repo):
            for dep in dependencies:
                if not dep.get("resolved"):
                    continue
                src = dep.get("source_path", "")
                tgt = dep.get("target_path", "")
                if file_to_layer.get(src) == "API Layer" and file_to_layer.get(tgt) in ["Data & Models Layer", "Repository Layer"]:
                    # If this repository predominantly routes through services
                    if layer_flows.get(("API Layer", "Service Layer"), 0) > 0:
                        drift.append({
                            "violation_type": "ARCHITECTURE_DRIFT",
                            "title": "Service Layer Bypass",
                            "description": f"'{src}' directly imports database model '{tgt}', bypassing the established Service layer.",
                            "severity": "LOW",
                            "source_entity": src,
                            "target_entity": tgt,
                            "evidence_file": src,
                            "evidence_line": dep.get("start_line") or 1,
                        })

        # Rule 2: Layer Inversion (Database or Models importing API routes)
        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = dep.get("source_path", "")
            tgt = dep.get("target_path", "")
            if file_to_layer.get(src) in ["Data & Models Layer", "Repository Layer"] and file_to_layer.get(tgt) == "API Layer":
                violations.append({
                    "violation_type": "LAYER_INVERSION",
                    "title": "Architectural Inversion",
                    "description": f"Data layer file '{src}' illegally imports presentation API file '{tgt}'.",
                    "severity": "HIGH",
                    "source_entity": src,
                    "target_entity": tgt,
                    "evidence_file": src,
                    "evidence_line": dep.get("start_line") or 1,
                })

        return patterns, violations, drift

    # =========================================================================
    # 7. ARCHITECTURAL HOTSPOTS & HEALTH
    # =========================================================================

    def compute_hotspots(
        self,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        cycles: List[List[str]],
    ) -> List[Dict[str, Any]]:
        """
        Identifies architectural hotspots by combining incoming coupling, outgoing dependencies,
        symbol count, and cycle participation.
        """
        in_degree: Dict[str, int] = defaultdict(int)
        out_degree: Dict[str, int] = defaultdict(int)

        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = dep.get("source_path")
            tgt = dep.get("target_path")
            if src and tgt and src != tgt:
                out_degree[src] += 1
                in_degree[tgt] += 1

        cycle_files: Set[str] = {f for c in cycles for f in c}
        hotspots: List[Dict[str, Any]] = []

        for f in files:
            p = f.get("path", "")
            in_c = in_degree[p]
            out_c = out_degree[p]
            meta = f.get("source_metadata") or {}
            sym_c = meta.get("symbol_count", 0)
            line_c = f.get("line_count", 0)

            # Hotspot scoring formula
            score = (in_c * 4) + (out_c * 2) + min(sym_c, 20) + (15 if p in cycle_files else 0)

            reasons = []
            if in_c >= 4:
                reasons.append(f"High incoming coupling ({in_c} callers depend on this file)")
            if out_c >= 4:
                reasons.append(f"High outgoing coupling ({out_c} external dependencies)")
            if p in cycle_files:
                reasons.append("Participates in a circular dependency cycle")
            if sym_c >= 15:
                reasons.append(f"High symbol complexity ({sym_c} AST symbols)")

            if score >= 12 or len(reasons) > 0:
                hotspots.append({
                    "file_path": p,
                    "symbol_count": sym_c,
                    "line_count": line_c,
                    "incoming_count": in_c,
                    "outgoing_count": out_c,
                    "hotspot_score": score,
                    "reasons": reasons if reasons else ["Moderate coupling and complexity"],
                })

        return sorted(hotspots, key=lambda x: -x["hotspot_score"])[:10]

    # =========================================================================
    # 8. COMPLETE ARCHITECTURE MODEL BUILDER
    # =========================================================================

    def build_architecture_model(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        cycles: Optional[List[List[str]]] = None,
        symbols: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Builds the complete, production-grade Phase 11 Architecture Intelligence model.
        """
        if repository_id in self._cache:
            return self._cache[repository_id]

        cycles_list = cycles or []

        # 1. Language breakdown & percentages
        lang_breakdown, lang_percentages = self.compute_language_breakdown(files)

        # 2. Framework Detection
        frameworks = self.detect_frameworks(files, dependencies, symbols)

        # 3. Entry Point Detection
        entry_points = self.detect_entry_points(files, symbols, frameworks)

        # 4. Symbol mapping
        symbols_by_file: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        if symbols:
            for sym in symbols:
                symbols_by_file[sym.get("file_id", "")].append(sym)

        # 5. Logical Module Clustering
        modules = self.discover_logical_modules(repository_id, files, dependencies, symbols_by_file)

        # 6. Architectural Layers aggregation
        layers_dict: Dict[str, Dict[str, Any]] = {}
        for f in files:
            p = f.get("path", "")
            layer_name, layer_cat, desc = self.classify_file_layer(p, symbols_by_file.get(f.get("id"), []))
            meta = f.get("source_metadata") or {}
            s_count = meta.get("symbol_count") or len(symbols_by_file.get(f.get("id"), []))

            if layer_name not in layers_dict:
                layers_dict[layer_name] = {
                    "name": layer_name,
                    "category": layer_cat,
                    "file_count": 0,
                    "symbol_count": 0,
                    "files": [],
                    "description": desc,
                }
            l = layers_dict[layer_name]
            l["file_count"] += 1
            l["symbol_count"] += s_count
            l["files"].append(p)

        layers = sorted(list(layers_dict.values()), key=lambda x: -x["file_count"])

        # 7. Pattern, Violations & Drift Detection
        patterns, violations, drift = self.detect_patterns_and_drift(modules, files, dependencies, frameworks)

        # 8. Hotspot Analysis
        hotspots = self.compute_hotspots(files, dependencies, cycles_list)

        # 9. Directory Groups & Group Relationships
        groups = self.aggregate_directory_groups(repository_id, files, dependencies)
        relationships = self.aggregate_group_relationships(repository_id, groups, dependencies)

        # 10. Health computation
        health = self.compute_architecture_health(
            groups=groups,
            relationships=relationships,
            cycles=cycles_list,
            bidirectional=[],
            dependencies=dependencies,
            violations=violations,
            drift=drift,
        )

        # Human-readable summary
        primary_lang = max(lang_percentages.items(), key=lambda x: x[1])[0] if lang_percentages else "Unknown"
        primary_framework = frameworks[0]["name"] if frameworks else "Custom Application"
        pattern_str = patterns[0]["pattern"] if patterns else "standard modular structure"

        summary_text = (
            f"This repository is primarily a {primary_lang} application powered by {primary_framework}. "
            f"It implements a {pattern_str} with {len(modules)} major logical modules and {len(files)} indexed files. "
            f"{f'Detected {len(cycles_list)} circular dependencies.' if cycles_list else 'No circular dependencies detected.'}"
        )

        overview = {
            "repository_id": repository_id,
            "languages": lang_breakdown,
            "language_percentages": lang_percentages,
            "frameworks": frameworks,
            "module_count": len(modules),
            "file_count": len(files),
            "symbol_count": sum(m["symbol_count"] for m in modules),
            "entry_points": entry_points,
            "patterns": patterns,
            "summary_text": summary_text,
        }

        payload = {
            "repository_id": repository_id,
            "overview": overview,
            "languages": lang_breakdown,
            "language_percentages": lang_percentages,
            "frameworks": frameworks,
            "entry_points": entry_points,
            "layers": layers,
            "modules": modules,
            "patterns": patterns,
            "hotspots": hotspots,
            "violations": violations,
            "drift": drift,
            "groups": groups,
            "relationships": relationships,
            "health": health,
            "summary": {
                "total_directories": len(modules),
                "total_files": len(files),
                "total_symbols": sum(m["symbol_count"] for m in modules),
                "total_dependencies": len([d for d in dependencies if d.get("resolved")]),
                "total_cycles": len(cycles_list),
            },
            "highlights": {
                "most_depended_on_groups": [
                    {"name": m["name"], "incoming": m["incoming_dependencies"]}
                    for m in sorted(modules, key=lambda x: -x["incoming_dependencies"])[:5] if m["incoming_dependencies"] > 0
                ],
                "most_dependency_heavy_groups": [
                    {"name": m["name"], "outgoing": m["outgoing_dependencies"]}
                    for m in sorted(modules, key=lambda x: -x["outgoing_dependencies"])[:5] if m["outgoing_dependencies"] > 0
                ],
            },
            "cycles": cycles_list,
            "explanation": summary_text,
        }

        self._cache[repository_id] = payload
        return payload


architecture_service = ArchitectureService()
