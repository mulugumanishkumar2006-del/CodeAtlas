import os
import re
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Set, Tuple
from collections import defaultdict

from backend.app.services.ast_parser_service import ast_parser_service
from backend.app.services.language_detection_service import language_service

logger = logging.getLogger("codeatlas.universal_analyzer")


class UniversalAnalyzerService:
    """
    Universal Repository Analyzer Engine for CodeAtlas.
    Automatically discovers languages, frameworks, package managers, monorepos,
    project structure, entry points, APIs, persistence/databases, configurations,
    secret-safe environment variables, tests, documentation, infrastructure,
    modules, services, and normalized architecture across any arbitrary supported repository.
    """

    SUPPORTED_LANGUAGES = ast_parser_service.SUPPORTED_LANGUAGES

    # -------------------------------------------------------------------------
    # 1. LANGUAGE DETECTION & DISTRIBUTION
    # -------------------------------------------------------------------------

    def analyze_languages(self, files: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculates exact language distribution and identifies unsupported languages."""
        dist = language_service.calculate_language_distribution(files)
        languages_list = dist.get("languages", [])

        supported: List[Dict[str, Any]] = []
        unsupported: List[Dict[str, Any]] = []

        for lang_item in languages_list:
            lang_name = lang_item.get("language")
            is_supp = lang_name in self.SUPPORTED_LANGUAGES
            lang_item["is_supported"] = is_supp
            if is_supp:
                supported.append(lang_item)
            else:
                unsupported.append(lang_item)

        return {
            "primary_language": dist.get("primary_language", "Unknown"),
            "total_files": len(files),
            "total_lines": dist.get("total_lines", 0),
            "total_code_lines": dist.get("total_code_lines", 0),
            "total_blank_lines": dist.get("total_blank_lines", 0),
            "total_comment_lines": dist.get("total_comment_lines", 0),
            "distribution": languages_list,
            "supported_languages": supported,
            "unsupported_languages": unsupported,
        }

    # -------------------------------------------------------------------------
    # 2. PACKAGE MANAGERS & BUILD SYSTEMS
    # -------------------------------------------------------------------------

    def detect_package_managers(self, files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detects actual package managers and build systems with file evidence."""
        managers: Dict[str, Dict[str, Any]] = {}
        paths = {f.get("path", "").lower(): f.get("path", "") for f in files}

        rules = [
            ("npm", "Node.js / npm", ["package-lock.json"], ["package.json"]),
            ("yarn", "Node.js / Yarn", ["yarn.lock"], ["package.json"]),
            ("pnpm", "Node.js / pnpm", ["pnpm-lock.yaml"], ["pnpm-workspace.yaml"]),
            ("bun", "Node.js / Bun", ["bun.lockb"], ["bun.lock"]),
            ("pip", "Python / pip", ["requirements.txt"], []),
            ("poetry", "Python / Poetry", ["poetry.lock"], ["pyproject.toml"]),
            ("pipenv", "Python / Pipenv", ["pipfile.lock"], ["pipfile"]),
            ("maven", "Java / Maven", ["pom.xml"], []),
            ("gradle", "Java / Gradle", ["build.gradle", "build.gradle.kts"], ["settings.gradle", "settings.gradle.kts"]),
            ("go_modules", "Go / Go Modules", ["go.mod"], ["go.sum", "go.work"]),
            ("cargo", "Rust / Cargo", ["cargo.toml"], ["cargo.lock"]),
            ("nuget", ".NET / NuGet", [".csproj", "packages.config"], []),
            ("cmake", "C/C++ / CMake", ["cmakelists.txt"], []),
            ("make", "Build / Make", ["makefile", "gnumakefile"], []),
        ]

        for pm_id, name, primary_files, secondary_files in rules:
            evidence: List[str] = []
            for pf in primary_files:
                for p_lower, orig in paths.items():
                    if p_lower.endswith(pf) or Path(p_lower).name == pf:
                        evidence.append(orig)
            for sf in secondary_files:
                for p_lower, orig in paths.items():
                    if p_lower.endswith(sf) or Path(p_lower).name == sf:
                        if orig not in evidence:
                            evidence.append(orig)

            if evidence:
                managers[pm_id] = {
                    "id": pm_id,
                    "name": name,
                    "evidence_files": evidence[:5],
                    "confidence": "HIGH" if len(evidence) >= 1 else "MEDIUM",
                }

        return sorted(list(managers.values()), key=lambda x: x["name"])

    # -------------------------------------------------------------------------
    # 3. MONOREPO DETECTION
    # -------------------------------------------------------------------------

    def detect_monorepo(self, files: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Detects whether repository is a monorepo workspace from configuration and multiple manifests."""
        paths = [f.get("path", "").replace("\\", "/") for f in files]
        paths_lower = [p.lower() for p in paths]

        evidence: List[str] = []
        workspace_type: Optional[str] = None

        # Config files
        if any("pnpm-workspace.yaml" in p for p in paths_lower):
            workspace_type = "pnpm Workspaces"
            evidence.append("pnpm-workspace.yaml")
        elif any("turbo.json" in p for p in paths_lower):
            workspace_type = "Turborepo"
            evidence.append("turbo.json")
        elif any("nx.json" in p for p in paths_lower):
            workspace_type = "Nx Workspace"
            evidence.append("nx.json")
        elif any("lerna.json" in p for p in paths_lower):
            workspace_type = "Lerna"
            evidence.append("lerna.json")
        elif any("go.work" in p for p in paths_lower):
            workspace_type = "Go Workspaces"
            evidence.append("go.work")

        # Multi-package manifests count
        pkg_json_count = sum(1 for p in paths_lower if Path(p).name == "package.json")
        pom_count = sum(1 for p in paths_lower if Path(p).name == "pom.xml")
        go_mod_count = sum(1 for p in paths_lower if Path(p).name == "go.mod")
        cargo_count = sum(1 for p in paths_lower if Path(p).name == "cargo.toml")

        packages: List[str] = []
        if workspace_type or pkg_json_count > 1:
            if pkg_json_count > 1:
                evidence.append(f"{pkg_json_count} package.json manifests")
            for p in paths:
                if Path(p.lower()).name in ["package.json", "pyproject.toml", "cargo.toml", "go.mod"] and "/" in p:
                    packages.append(str(Path(p).parent))
        if pom_count > 1:
            evidence.append(f"{pom_count} pom.xml manifests")
            if not workspace_type:
                workspace_type = "Maven Multi-Module"
            for p in paths:
                if Path(p.lower()).name == "pom.xml" and "/" in p:
                    packages.append(str(Path(p).parent))
        if go_mod_count > 1:
            evidence.append(f"{go_mod_count} go.mod modules")
            if not workspace_type:
                workspace_type = "Go Multi-Module"
            for p in paths:
                if Path(p.lower()).name == "go.mod" and "/" in p:
                    packages.append(str(Path(p).parent))

        is_monorepo = bool(workspace_type or len(packages) > 1 or pkg_json_count > 1)

        return {
            "is_monorepo": is_monorepo,
            "workspace_type": workspace_type if is_monorepo else None,
            "evidence": evidence,
            "packages": sorted(list(set(packages)))[:20],
        }

    # -------------------------------------------------------------------------
    # 4. FRAMEWORK DETECTION ENGINE
    # -------------------------------------------------------------------------

    def detect_frameworks(
        self,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        symbols: Optional[List[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        """Evidence-grounded framework detection across Python, JS/TS, Java, Go, Rust, C/C++."""
        frameworks: Dict[str, Dict[str, Any]] = {}

        # Collect all imported targets and source files
        all_imported_targets: Set[str] = set()
        file_to_imports: Dict[str, Set[str]] = defaultdict(set)
        for dep in dependencies:
            tgt = (dep.get("target_path") or dep.get("name") or "").lower()
            src = dep.get("source_path") or ""
            if tgt:
                all_imported_targets.add(tgt)
                if src:
                    file_to_imports[src].add(tgt)

        # Framework rules: (name, category, import_regexes, config_regexes, description)
        rules = [
            # Python Web & ORM
            ("FastAPI", "backend_web", [r"\bfastapi\b", r"\bstarlette\b", r"\buvicorn\b"], [r"\bfastapi\b"], "FastAPI Python web framework for APIs"),
            ("Django", "backend_web", [r"\bdjango\b", r"\bdjango\.db\b"], [r"\bdjango\b"], "Django high-level Python web framework"),
            ("Flask", "backend_web", [r"\bflask\b", r"\bwerkzeug\b"], [r"\bflask\b"], "Flask lightweight WSGI web framework"),
            ("SQLAlchemy", "database_orm", [r"\bsqlalchemy\b", r"\balembic\b"], [r"\bsqlalchemy\b"], "SQLAlchemy Python Object Relational Mapper"),
            ("Pytest", "testing", [r"\bpytest\b"], [r"\bpytest\b"], "Pytest Python test framework"),
            ("Pydantic", "data_validation", [r"\bpydantic\b"], [r"\bpydantic\b"], "Pydantic data validation using type hints"),
            ("Celery", "background_jobs", [r"\bcelery\b"], [r"\bcelery\b"], "Celery distributed task queue for Python"),

            # JS / TS
            ("React", "frontend_ui", [r"\breact\b", r"\breact-dom\b", r"\breact/jsx-runtime\b"], [r"\"react\"\s*:"], "React component library"),
            ("Next.js", "fullstack_web", [r"\bnext\b", r"\bnext/router\b", r"\bnext/navigation\b"], [r"\"next\"\s*:"], "Next.js React server rendering framework"),
            ("Express", "backend_web", [r"\bexpress\b"], [r"\"express\"\s*:"], "Express Node.js web server framework"),
            ("NestJS", "backend_web", [r"@nestjs/core", r"@nestjs/common"], [r"\"@nestjs/core\"\s*:"], "NestJS TypeScript enterprise server framework"),
            ("Vue", "frontend_ui", [r"\bvue\b", r"\b@vue/"], [r"\"vue\"\s*:"], "Vue.js reactive UI framework"),
            ("Tailwind CSS", "styling", [r"\btailwindcss\b"], [r"\"tailwindcss\"\s*:", r"\btailwind\.config\b"], "Tailwind utility CSS framework"),
            ("Vite", "build_tool", [r"\bvite\b"], [r"\"vite\"\s*:", r"\bvite\.config\b"], "Vite frontend build tool and dev server"),
            ("Jest", "testing", [r"\bjest\b"], [r"\"jest\"\s*:", r"\bjest\.config\b"], "Jest JavaScript testing framework"),
            ("Vitest", "testing", [r"\bvitest\b"], [r"\"vitest\"\s*:", r"\bvitest\.config\b"], "Vitest Vite-native testing framework"),

            # Java
            ("Spring Boot", "backend_web", [r"org\.springframework\.boot", r"org\.springframework\.web"], [r"org\.springframework\.boot"], "Spring Boot enterprise Java framework"),
            ("Hibernate", "database_orm", [r"org\.hibernate", r"javax\.persistence"], [r"org\.hibernate"], "Hibernate Java ORM / JPA persistence"),
            ("JUnit", "testing", [r"org\.junit", r"org\.junit\.jupiter"], [r"junit"], "JUnit Java testing framework"),

            # Go
            ("Gin", "backend_web", [r"github\.com/gin-gonic/gin"], [r"github\.com/gin-gonic/gin"], "Gin HTTP web framework in Go"),
            ("Fiber", "backend_web", [r"github\.com/gofiber/fiber"], [r"github\.com/gofiber/fiber"], "Fiber Express-inspired Go web framework"),
            ("GORM", "database_orm", [r"gorm\.io/gorm"], [r"gorm\.io/gorm"], "GORM developer friendly ORM library for Go"),

            # Rust
            ("Actix-web", "backend_web", [r"\bactix_web\b", r"\bactix-web\b"], [r"actix-web"], "Actix-web high-performance Rust web framework"),
            ("Axum", "backend_web", [r"\baxum\b"], [r"axum"], "Axum modular web framework for Rust and Tokio"),
            ("Tokio", "async_runtime", [r"\btokio\b"], [r"tokio"], "Tokio asynchronous runtime for Rust"),
        ]

        for name, category, imp_pats, cfg_pats, desc in rules:
            matched_imports: Set[str] = set()
            matched_files: Set[str] = set()

            for dep in dependencies:
                tgt = (dep.get("target_path") or dep.get("name") or "").lower()
                src = dep.get("source_path") or ""
                for pat in imp_pats:
                    if re.search(pat, tgt, re.IGNORECASE):
                        matched_imports.add(tgt)
                        if src:
                            matched_files.add(src)

            # Check config files
            for f in files:
                p = f.get("path", "").lower()
                if any(cfg in p for cfg in ["package.json", "requirements.txt", "pyproject.toml", "pom.xml", "go.mod", "cargo.toml"]):
                    for pat in cfg_pats:
                        for tgt in all_imported_targets:
                            if re.search(pat, tgt, re.IGNORECASE):
                                matched_files.add(f.get("path", ""))
                                matched_imports.add(tgt)

            if matched_imports:
                confidence = "HIGH" if len(matched_files) >= 2 or len(matched_imports) >= 2 else "MEDIUM"
                evidence_list = sorted(list(matched_files.union(matched_imports)))[:5]
                frameworks[name] = {
                    "name": name,
                    "category": category,
                    "confidence": confidence,
                    "evidence": evidence_list,
                    "evidence_files": sorted(list(matched_files))[:5],
                    "evidence_imports": sorted(list(matched_imports))[:5],
                    "description": desc,
                }

        return sorted(list(frameworks.values()), key=lambda x: x["name"])

    # -------------------------------------------------------------------------
    # 5. ENTRY POINT DETECTION
    # -------------------------------------------------------------------------

    def detect_entry_points(
        self,
        files: List[Dict[str, Any]],
        symbols: Optional[List[Dict[str, Any]]] = None,
        frameworks: Optional[List[Dict[str, Any]]] = None,
        source_dir: Optional[Path] = None,
    ) -> List[Dict[str, Any]]:
        """Identifies application execution entry points across languages with AST lines and reasons."""
        entry_points: List[Dict[str, Any]] = []
        framework_names = {f["name"] for f in (frameworks or [])}

        sym_by_file: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        if symbols:
            for s in symbols:
                if s.get("file_id"):
                    sym_by_file[s["file_id"]].append(s)
                if s.get("file_path"):
                    sym_by_file[s["file_path"]].append(s)

        for f in files:
            path = f.get("path", "").replace("\\", "/")
            fname = Path(path).name.lower()
            file_id = f.get("id")
            f_syms = (sym_by_file.get(file_id, []) if file_id else []) + sym_by_file.get(path, [])

            # Python
            if fname in ["main.py", "app.py", "server.py", "__main__.py"]:
                app_sym = next((s for s in f_syms if s.get("name") in ["app", "application", "create_app", "main"]), None)
                framework = "FastAPI" if "FastAPI" in framework_names else ("Flask" if "Flask" in framework_names else "Python")
                line = app_sym.get("start_line", 1) if app_sym else 1
                entry_points.append({
                    "file_path": path,
                    "symbol": app_sym.get("name") if app_sym else "main",
                    "line": line,
                    "reason": f"Primary {framework} server application initialization and router assembly.",
                    "framework": framework,
                    "file_id": file_id,
                })
                continue

            # Node / TypeScript
            if fname in ["server.ts", "server.js", "main.ts", "main.js", "index.ts", "index.js", "app.ts", "app.js"]:
                depth = len(path.split("/"))
                if depth <= 3:
                    framework = "Express" if "Express" in framework_names else ("NestJS" if "NestJS" in framework_names else "Node.js")
                    entry_points.append({
                        "file_path": path,
                        "symbol": None,
                        "line": 1,
                        "reason": f"{framework} server bootstrap and HTTP listener entry point.",
                        "framework": framework,
                        "file_id": file_id,
                    })
                    continue

            # Java
            if fname.endswith(".java"):
                main_method = next((s for s in f_syms if s.get("name") == "main" and s.get("ast_metadata", {}).get("is_main")), None)
                spring_app = next((s for s in f_syms if s.get("ast_metadata", {}).get("is_spring_boot_app")), None)
                if main_method or spring_app:
                    line = main_method.get("start_line", 1) if main_method else (spring_app.get("start_line", 1) if spring_app else 1)
                    sym_name = main_method.get("name") if main_method else (spring_app.get("name") if spring_app else "main")
                    entry_points.append({
                        "file_path": path,
                        "symbol": sym_name,
                        "line": line,
                        "reason": "Spring Boot / Java application entry point (public static void main).",
                        "framework": "Spring Boot" if spring_app or "Spring Boot" in framework_names else "Java",
                        "file_id": file_id,
                    })
                    continue

            # Go
            if fname.endswith(".go"):
                go_main = next((s for s in f_syms if s.get("name") == "main"), None)
                if go_main or "cmd/" in path or fname == "main.go":
                    line = go_main.get("start_line", 1) if go_main else 1
                    entry_points.append({
                        "file_path": path,
                        "symbol": "main",
                        "line": line,
                        "reason": "Go executable entry point in main package.",
                        "framework": "Go",
                        "file_id": file_id,
                    })
                    continue

            # Rust
            if fname == "main.rs" or (fname.endswith(".rs") and "src/bin" in path):
                rust_main = next((s for s in f_syms if s.get("name") == "main"), None)
                line = rust_main.get("start_line", 1) if rust_main else 1
                entry_points.append({
                    "file_path": path,
                    "symbol": "main",
                    "line": line,
                    "reason": "Rust binary application entry point (fn main).",
                    "framework": "Rust",
                    "file_id": file_id,
                })
                continue

            # C / C++
            if fname in ["main.c", "main.cpp", "main.cc"]:
                cpp_main = next((s for s in f_syms if s.get("name") == "main"), None)
                line = cpp_main.get("start_line", 1) if cpp_main else 1
                entry_points.append({
                    "file_path": path,
                    "symbol": "main",
                    "line": line,
                    "reason": "C/C++ executable entry point (int main).",
                    "framework": "C/C++",
                    "file_id": file_id,
                })
                continue

        return entry_points[:15]

    # -------------------------------------------------------------------------
    # 6. API ENDPOINT DISCOVERY
    # -------------------------------------------------------------------------

    def detect_api_endpoints(
        self,
        files: List[Dict[str, Any]],
        symbols: Optional[List[Dict[str, Any]]] = None,
        source_dir: Optional[Path] = None,
    ) -> List[Dict[str, Any]]:
        """Discovers HTTP API routes across FastAPI, Flask, Express, NestJS, Spring, Gin."""
        endpoints: List[Dict[str, Any]] = []

        for f in files:
            p = f.get("path", "").replace("\\", "/")
            lang = f.get("language") or ""
            file_id = f.get("id")

            # Read source content safely if local directory is available
            source_content = ""
            if source_dir:
                abs_f = source_dir / p
                if abs_f.exists() and abs_f.is_file():
                    try:
                        with open(abs_f, "r", encoding="utf-8", errors="replace") as fh:
                            source_content = fh.read()
                    except Exception:
                        pass

            if not source_content:
                continue

            lines = source_content.splitlines()

            # Python (FastAPI / Flask)
            if lang == "Python":
                for idx, line in enumerate(lines):
                    # @app.get("/users"), @router.post("/items")
                    m = re.search(r"@(?:app|router|api)\.(get|post|put|delete|patch|options)\s*\(\s*['\"]([^'\"]+)['\"]", line, re.IGNORECASE)
                    if m:
                        method = m.group(1).upper()
                        route = m.group(2)
                        endpoints.append({
                            "method": method,
                            "route": route,
                            "file_path": p,
                            "line": idx + 1,
                            "framework": "FastAPI",
                            "file_id": file_id,
                        })
                    # Flask @app.route("/users", methods=["GET"])
                    m_flask = re.search(r"@app\.route\s*\(\s*['\"]([^'\"]+)['\"](?:.*methods\s*=\s*\[([^\]]+)\])?", line, re.IGNORECASE)
                    if m_flask:
                        route = m_flask.group(1)
                        methods_str = m_flask.group(2) or "GET"
                        for m_part in re.findall(r"['\"]([A-Z]+)['\"]", methods_str):
                            endpoints.append({
                                "method": m_part,
                                "route": route,
                                "file_path": p,
                                "line": idx + 1,
                                "framework": "Flask",
                                "file_id": file_id,
                            })

            # JavaScript / TypeScript (Express / NestJS)
            elif lang in ["JavaScript", "TypeScript", "TSX"]:
                for idx, line in enumerate(lines):
                    # Express: app.get('/users', ...), router.post('/items', ...)
                    m = re.search(r"(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['\"]([^'\"]+)['\"]", line)
                    if m:
                        endpoints.append({
                            "method": m.group(1).upper(),
                            "route": m.group(2),
                            "file_path": p,
                            "line": idx + 1,
                            "framework": "Express",
                            "file_id": file_id,
                        })
                    # NestJS: @Get('/users'), @Post('/items')
                    m_nest = re.search(r"@(Get|Post|Put|Delete|Patch)\s*\(\s*['\"]([^'\"]*)['\"]", line)
                    if m_nest:
                        endpoints.append({
                            "method": m_nest.group(1).upper(),
                            "route": m_nest.group(2) or "/",
                            "file_path": p,
                            "line": idx + 1,
                            "framework": "NestJS",
                            "file_id": file_id,
                        })

            # Java (Spring)
            elif lang == "Java":
                for idx, line in enumerate(lines):
                    m = re.search(r"@(Get|Post|Put|Delete|Patch|Request)Mapping\s*\(\s*(?:value\s*=\s*)?['\"]([^'\"]+)['\"]", line)
                    if m:
                        verb = m.group(1).upper()
                        method = "GET" if verb in ["GET", "REQUEST"] else verb
                        endpoints.append({
                            "method": method,
                            "route": m.group(2),
                            "file_path": p,
                            "line": idx + 1,
                            "framework": "Spring",
                            "file_id": file_id,
                        })

            # Go (Gin / Fiber)
            elif lang == "Go":
                for idx, line in enumerate(lines):
                    m = re.search(r"(?:r|router|api|app|group)\.(GET|POST|PUT|DELETE|PATCH)\s*\(\s*\"([^\"]+)\"", line)
                    if m:
                        endpoints.append({
                            "method": m.group(1),
                            "route": m.group(2),
                            "file_path": p,
                            "line": idx + 1,
                            "framework": "Gin/Fiber",
                            "file_id": file_id,
                        })

        return endpoints[:50]

    # -------------------------------------------------------------------------
    # 7. DATABASE & PERSISTENCE DISCOVERY
    # -------------------------------------------------------------------------

    def detect_databases(
        self,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Detects actual database technology, ORMs, and drivers with evidence."""
        databases: Dict[str, Dict[str, Any]] = {}
        all_targets = { (d.get("target_path") or d.get("name") or "").lower(): d.get("source_path") for d in dependencies }

        db_rules = [
            ("PostgreSQL", "Relational Database", [r"psycopg2", r"asyncpg", r"\bpg\b", r"postgresql"], "PostgreSQL client driver"),
            ("MySQL", "Relational Database", [r"mysql", r"pymysql", r"mysql2"], "MySQL client driver"),
            ("SQLite", "Embedded Database", [r"sqlite3", r"aiosqlite"], "SQLite embedded database driver"),
            ("MongoDB", "Document Database", [r"mongodb", r"pymongo", r"mongoose"], "MongoDB driver/ODM"),
            ("Redis", "In-Memory Datastore", [r"\bredis\b", r"ioredis", r"aioredis"], "Redis cache and key-value datastore"),
            ("SQLAlchemy", "ORM", [r"sqlalchemy", r"alembic"], "Python SQL toolkit and ORM"),
            ("Prisma", "ORM", [r"@prisma/client", r"\bprisma\b"], "Prisma next-generation Node.js/TS ORM"),
            ("Hibernate/JPA", "ORM", [r"org\.hibernate", r"javax\.persistence"], "Java Hibernate / JPA persistence provider"),
            ("GORM", "ORM", [r"gorm\.io/gorm"], "Go Object Relational Mapping library"),
        ]

        for name, category, patterns, desc in db_rules:
            evidence_imports: List[str] = []
            evidence_files: List[str] = []

            for pat in patterns:
                for tgt, src in all_targets.items():
                    if re.search(pat, tgt, re.IGNORECASE):
                        evidence_imports.append(tgt)
                        if src:
                            evidence_files.append(src)

            if evidence_imports:
                databases[name] = {
                    "name": name,
                    "category": category,
                    "description": desc,
                    "evidence_imports": list(set(evidence_imports))[:5],
                    "evidence_files": list(set(evidence_files))[:5],
                    "confidence": "HIGH",
                }

        return sorted(list(databases.values()), key=lambda x: x["name"])

    # -------------------------------------------------------------------------
    # 8. CONFIGURATION & SECRET-SAFE ENVIRONMENT DISCOVERY
    # -------------------------------------------------------------------------

    def detect_configurations(
        self,
        files: List[Dict[str, Any]],
        source_dir: Optional[Path] = None,
    ) -> Dict[str, Any]:
        """Categorizes configuration files and redacts environment variable secrets."""
        configs_list: List[Dict[str, Any]] = []
        env_vars: List[Dict[str, Any]] = []

        categories = {
            "database": [r"database", r"db", r"postgres", r"mysql", r"sqlite", r"redis", r"orm"],
            "authentication": [r"auth", r"jwt", r"oauth", r"security", r"session"],
            "logging": [r"log", r"logger", r"logging", r"sentry"],
            "server": [r"server", r"app", r"port", r"host", r"cors"],
            "deployment": [r"docker", r"k8s", r"kubernetes", r"deploy", r"ci", r"cd"],
        }

        for f in files:
            path = f.get("path", "").replace("\\", "/")
            fname = Path(path).name.lower()

            is_config = (
                fname.startswith(".env")
                or fname.endswith((".yml", ".yaml", ".toml", ".ini", ".properties", ".conf"))
                or "config" in path.lower()
                or fname in ["settings.py", "application.yml", "application.properties"]
            )

            if is_config:
                cat = "general"
                for c_name, pats in categories.items():
                    if any(re.search(p, path.lower()) for p in pats):
                        cat = c_name
                        break

                configs_list.append({
                    "file_path": path,
                    "filename": fname,
                    "category": cat,
                    "is_env_file": fname.startswith(".env"),
                })

            # Read .env or .env.example for secret-safe variables
            if (fname == ".env.example" or fname == ".env") and source_dir:
                abs_p = source_dir / path
                if abs_p.exists() and abs_p.is_file():
                    try:
                        with open(abs_p, "r", encoding="utf-8", errors="replace") as fh:
                            for line in fh:
                                line = line.strip()
                                if line and not line.startswith("#") and "=" in line:
                                    var_name = line.split("=", 1)[0].strip()
                                    if var_name:
                                        env_vars.append({
                                            "name": var_name,
                                            "value": "[REDACTED]",
                                            "source_file": path,
                                        })
                    except Exception:
                        pass

        # Deduplicate env vars by name
        unique_vars: Dict[str, Dict[str, Any]] = {}
        for ev in env_vars:
            unique_vars[ev["name"]] = ev

        return {
            "config_files": configs_list[:30],
            "environment_variables": sorted(list(unique_vars.values()), key=lambda x: x["name"]),
        }

    # -------------------------------------------------------------------------
    # 9. TEST DISCOVERY
    # -------------------------------------------------------------------------

    def detect_tests(self, files: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Identifies test files, frameworks, and metrics."""
        test_files: List[str] = []
        frameworks: Set[str] = set()

        for f in files:
            path = f.get("path", "").replace("\\", "/")
            fname = Path(path).name.lower()

            is_test = (
                fname.startswith("test_")
                or fname.endswith(("_test.py", ".test.ts", ".test.js", ".test.tsx", ".spec.ts", ".spec.js", "_test.go"))
                or "/tests/" in path.lower()
                or "/test/" in path.lower()
                or "src/test/" in path.lower()
            )

            if is_test:
                test_files.append(path)
                if fname.endswith((".test.ts", ".test.js", ".test.tsx", ".spec.ts", ".spec.js")):
                    frameworks.add("Jest/Vitest")
                elif fname.endswith((".py", "_test.py", "test_*.py")):
                    frameworks.add("Pytest")
                elif fname.endswith("_test.go"):
                    frameworks.add("Go Testing")
                elif "src/test/" in path.lower():
                    frameworks.add("JUnit")

        return {
            "test_file_count": len(test_files),
            "test_files": test_files[:20],
            "test_frameworks": sorted(list(frameworks)),
            "test_ratio_percent": round((len(test_files) / max(len(files), 1)) * 100, 1),
        }

    # -------------------------------------------------------------------------
    # 10. DOCUMENTATION DISCOVERY
    # -------------------------------------------------------------------------

    def detect_documentation(self, files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identifies documentation files (README, docs/, guidelines, API specs)."""
        docs: List[Dict[str, Any]] = []

        for f in files:
            path = f.get("path", "").replace("\\", "/")
            fname = Path(path).name.lower()

            is_doc = (
                fname.endswith((".md", ".rst", ".adoc", ".txt"))
                or "/docs/" in path.lower()
                or fname in ["readme.md", "contributing.md", "changelog.md", "architecture.md", "license"]
            )

            if is_doc:
                doc_type = "README" if "readme" in fname else ("Guides" if "/docs/" in path.lower() else "Documentation")
                docs.append({
                    "file_path": path,
                    "title": fname,
                    "type": doc_type,
                    "line_count": f.get("line_count", 0),
                })

        return sorted(docs, key=lambda x: (x["type"] != "README", x["file_path"]))[:20]

    # -------------------------------------------------------------------------
    # 11. BUILD & DEPLOYMENT INFRASTRUCTURE DISCOVERY
    # -------------------------------------------------------------------------

    def detect_infrastructure(self, files: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identifies Docker, Kubernetes, CI/CD pipelines, and cloud infra configs."""
        infra: List[Dict[str, Any]] = []

        for f in files:
            path = f.get("path", "").replace("\\", "/")
            fname = Path(path).name.lower()

            if fname == "dockerfile" or fname.startswith("dockerfile."):
                infra.append({"type": "Docker", "file_path": path, "description": "Container image build specification"})
            elif "docker-compose" in fname:
                infra.append({"type": "Docker Compose", "file_path": path, "description": "Multi-container local deployment compose definition"})
            elif ".github/workflows" in path.lower() and fname.endswith((".yml", ".yaml")):
                infra.append({"type": "GitHub Actions", "file_path": path, "description": "Continuous integration / delivery workflow"})
            elif ".gitlab-ci.yml" in fname:
                infra.append({"type": "GitLab CI", "file_path": path, "description": "GitLab CI pipeline configuration"})
            elif "jenkinsfile" in fname:
                infra.append({"type": "Jenkins", "file_path": path, "description": "Jenkins declarative pipeline"})
            elif fname.endswith(".tf"):
                infra.append({"type": "Terraform", "file_path": path, "description": "Infrastructure as Code definition"})
            elif fname == "chart.yaml":
                infra.append({"type": "Helm", "file_path": path, "description": "Kubernetes Helm package chart"})
            elif ("/k8s/" in path.lower() or "/kubernetes/" in path.lower()) and fname.endswith((".yml", ".yaml")):
                infra.append({"type": "Kubernetes", "file_path": path, "description": "Kubernetes cluster resource manifest"})

        return infra[:20]

    # -------------------------------------------------------------------------
    # 12. LOGICAL MODULES & SERVICES
    # -------------------------------------------------------------------------

    def detect_modules_and_services(
        self,
        files: List[Dict[str, Any]],
        monorepo_info: Dict[str, Any],
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        """Discovers logical domain modules and independent application services."""
        module_counts: Dict[str, int] = defaultdict(int)
        services: List[Dict[str, Any]] = []

        # Directory classification
        for f in files:
            p = f.get("path", "").replace("\\", "/").strip("/")
            parts = p.split("/")
            if len(parts) > 1:
                top = parts[0].lower()
                if top in ["src", "app", "lib", "backend", "frontend", "packages"] and len(parts) > 2:
                    mod_name = parts[1]
                else:
                    mod_name = parts[0]
                module_counts[mod_name] += 1

        modules = [
            {"name": name, "file_count": count}
            for name, count in sorted(module_counts.items(), key=lambda x: -x[1])
            if count >= 1 and name not in [".git", "node_modules", "dist", "build"]
        ][:15]

        # Services
        if monorepo_info.get("is_monorepo"):
            for pkg in monorepo_info.get("packages", []):
                services.append({
                    "name": Path(pkg).name or pkg,
                    "service_path": pkg,
                    "type": "Monorepo Package/Service",
                })
        else:
            # Single service
            services.append({
                "name": "Main Application",
                "service_path": ".",
                "type": "Standalone Service",
            })

        return modules, services

    # -------------------------------------------------------------------------
    # 13. MASTER UNIVERSAL PROFILE BUILDER
    # -------------------------------------------------------------------------

    def build_universal_profile(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        symbols: Optional[List[Dict[str, Any]]] = None,
        source_dir: Optional[Path] = None,
        commit_sha: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Builds the normalized, universal repository profile and architecture contract.
        Zero hardcoding — 100% evidence-grounded across all dimensions.
        """
        lang_info = self.analyze_languages(files)
        pkg_managers = self.detect_package_managers(files)
        monorepo_info = self.detect_monorepo(files)
        frameworks = self.detect_frameworks(files, dependencies, symbols)
        entry_points = self.detect_entry_points(files, symbols, frameworks)
        api_endpoints = self.detect_api_endpoints(files, symbols, source_dir)
        databases = self.detect_databases(files, dependencies)
        configs = self.detect_configurations(files, source_dir)
        tests = self.detect_tests(files)
        documentation = self.detect_documentation(files)
        infrastructure = self.detect_infrastructure(files)
        modules, services = self.detect_modules_and_services(files, monorepo_info)

        # Build normalized architecture hierarchy
        architecture_tree = {
            "applications": entry_points,
            "services": services,
            "modules": modules,
            "apis": api_endpoints,
            "datastores": databases,
            "tests": tests,
            "infrastructure": infrastructure,
            "external_dependencies": [d for d in dependencies if not d.get("resolved")][:25],
        }

        profile = {
            "repository_id": repository_id,
            "commit_sha": commit_sha,
            "analyzed_at": datetime.now(timezone.utc).isoformat(),
            "languages": lang_info,
            "frameworks": frameworks,
            "package_managers": pkg_managers,
            "monorepo": monorepo_info,
            "entry_points": entry_points,
            "api_endpoints": api_endpoints,
            "databases": databases,
            "configurations": configs,
            "tests": tests,
            "documentation": documentation,
            "infrastructure": infrastructure,
            "modules": modules,
            "services": services,
            "architecture_tree": architecture_tree,
        }

        return profile

    async def generate_universal_profile(
        self,
        repository_id: str,
        db: Any,
    ) -> Dict[str, Any]:
        """Loads repository metadata/records and returns universal profile."""
        from backend.app.models.repository import Repository
        from backend.app.models.file import File
        from backend.app.models.symbol import Symbol
        from backend.app.models.dependency import Dependency
        from sqlalchemy import select

        repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
        repo = repo_res.scalars().first()
        if not repo:
            raise ValueError(f"Repository {repository_id} not found")

        meta = repo.metadata_json or {}
        if "profile" in meta and meta["profile"]:
            return meta["profile"]

        files_res = await db.execute(select(File).where(File.repository_id == repository_id))
        files_data = [
            {"id": f.id, "path": f.path, "language": f.language, "line_count": f.line_count or 0, "size_bytes": f.size_bytes or 0, "source_metadata": f.source_metadata or {}}
            for f in files_res.scalars().all()
        ]

        syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id).limit(500))
        syms_data = [
            {"id": s.id, "file_id": s.file_id, "name": s.name, "symbol_type": s.symbol_type, "start_line": s.start_line, "end_line": s.end_line, "ast_metadata": s.ast_metadata or {}}
            for s in syms_res.scalars().all()
        ]

        deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id).limit(500))
        deps_data = [
            {"id": d.id, "name": d.name, "source_path": (d.metadata_json or {}).get("source_path") if d.metadata_json else None, "target_path": (d.metadata_json or {}).get("target_path") if d.metadata_json else d.name, "resolved": (d.metadata_json or {}).get("resolved", d.target_file_id is not None)}
            for d in deps_res.scalars().all()
        ]

        return self.build_universal_profile(
            repository_id=repository_id,
            files=files_data,
            dependencies=deps_data,
            symbols=syms_data,
            commit_sha=repo.current_commit_sha,
        )

    def create_analysis_snapshot(
        self,
        repository_id: str,
        commit_sha: Optional[str],
        profile: Dict[str, Any],
        stats: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Creates a versioned, point-in-time snapshot representing repository state."""
        return {
            "repository_id": repository_id,
            "commit_sha": commit_sha or "HEAD",
            "snapshot_timestamp": datetime.now(timezone.utc).isoformat(),
            "profile": profile,
            "statistics": stats,
        }


universal_analyzer = UniversalAnalyzerService()
universal_analyzer_service = universal_analyzer
