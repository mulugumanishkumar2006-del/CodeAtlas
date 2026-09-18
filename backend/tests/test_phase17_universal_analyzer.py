import pytest
from datetime import datetime, timezone
import uuid
import tempfile
import os
from pathlib import Path
from unittest.mock import patch
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.workspace import Workspace
from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.services.parsers import java_parser, go_parser, rust_parser, cpp_parser
from backend.app.services.ast_parser_service import ast_parser_service
from backend.app.services.universal_analyzer_service import universal_analyzer_service
from backend.app.services.repository_ingestion_service import repository_ingestion_service
from backend.app.services.search_intelligence_service import search_intelligence_service
from backend.app.services.rag_service import rag_service
from backend.app.services.git_repository_service import git_service


async def create_test_workspace(db: AsyncSession) -> Workspace:
    ws = Workspace(
        id=f"ws-{uuid.uuid4().hex[:8]}",
        name=f"Workspace-{uuid.uuid4().hex[:4]}",
        slug=f"ws-slug-{uuid.uuid4().hex[:6]}",
    )
    db.add(ws)
    await db.flush()
    return ws


# =========================================================================
# 1. Multi-Language AST Parsers (Java, Go, Rust, C++)
# =========================================================================

def test_java_parser():
    java_code = """
    package com.example.service;

    import org.springframework.web.bind.annotation.RestController;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.boot.SpringApplication;

    @RestController
    public class OrderController {
        @GetMapping("/orders")
        public String getOrders() {
            return "orders";
        }

        public static void main(String[] args) {
            SpringApplication.run(OrderController.class, args);
        }
    }
    """
    res = java_parser.parse(java_code, "src/main/java/OrderController.java")
    symbols = res.get("symbols", [])
    
    symbol_names = [s["name"] for s in symbols]
    assert "OrderController" in symbol_names
    assert "getOrders" in symbol_names
    assert "main" in symbol_names
    
    main_sym = next(s for s in symbols if s["name"] == "main" and s["symbol_type"] == "method")
    assert main_sym["ast_metadata"].get("is_main") is True

    get_orders_sym = next(s for s in symbols if s["name"] == "getOrders")
    assert get_orders_sym["ast_metadata"].get("is_endpoint") is True


def test_go_parser():
    go_code = """
    package main

    import (
        "fmt"
        "net/http"
    )

    type ServerConfig struct {
        Port int
        Host string
    }

    type Greeter interface {
        Greet() string
    }

    func (s *ServerConfig) Start() error {
        return nil
    }

    func main() {
        fmt.Println("Server running")
    }
    """
    res = go_parser.parse(go_code, "cmd/server/main.go")
    symbols = res.get("symbols", [])

    types = {s["symbol_type"] for s in symbols}
    names = {s["name"] for s in symbols}

    assert "struct" in types
    assert "ServerConfig" in names
    assert "Greeter" in names
    assert "Start" in names
    assert "main" in names

    # The func main symbol has symbol_type == "function" and is_main == True
    main_fn = next(s for s in symbols if s["name"] == "main" and s["symbol_type"] == "function")
    assert main_fn["ast_metadata"].get("is_main") is True


def test_rust_parser():
    rust_code = """
    use std::collections::HashMap;

    pub struct Config {
        pub workers: usize,
    }

    pub enum Status {
        Active,
        Inactive,
    }

    pub trait Worker {
        fn execute(&self);
    }

    fn init_system() -> bool {
        true
    }

    fn main() {
        println!("Initializing Rust service...");
    }
    """
    res = rust_parser.parse(rust_code, "src/main.rs")
    symbols = res.get("symbols", [])

    names = {s["name"] for s in symbols}
    assert "Config" in names
    assert "Status" in names
    assert "Worker" in names
    assert "init_system" in names
    assert "main" in names

    main_sym = next(s for s in symbols if s["name"] == "main")
    assert main_sym["ast_metadata"].get("is_main") is True


def test_cpp_parser():
    cpp_code = """
    #include <iostream>
    #include <vector>

    namespace core {
        class Engine {
        public:
            void start();
        };
    }

    int main(int argc, char* argv[]) {
        std::cout << "Engine ready\\n";
        return 0;
    }
    """
    res = cpp_parser.parse(cpp_code, "src/main.cpp")
    symbols = res.get("symbols", [])

    names = {s["name"] for s in symbols}
    assert "Engine" in names
    assert "main" in names

    main_sym = next(s for s in symbols if s["name"] == "main")
    assert main_sym["ast_metadata"].get("is_main") is True


def test_ast_parser_service_polyglot():
    """Verify ast_parser_service detects and parses multiple languages."""
    java_res = ast_parser_service.parse_content("public class App { public static void main(String[] a) {} }", "App.java", "Java")
    assert any(s["name"] == "App" for s in java_res.get("symbols", []))

    go_res = ast_parser_service.parse_content("package main\nfunc main() {}", "main.go", "Go")
    assert any(s["name"] == "main" for s in go_res.get("symbols", []))

    rust_res = ast_parser_service.parse_content("struct Store;\nfn main() {}", "main.rs", "Rust")
    assert any(s["name"] == "Store" for s in rust_res.get("symbols", []))

    cpp_res = ast_parser_service.parse_content("class Widget {}; int main() {}", "main.cpp", "C++")
    assert any(s["name"] == "Widget" for s in cpp_res.get("symbols", []))


# =========================================================================
# 2. Framework Detection with Evidence & False Positive Prevention
# =========================================================================

def test_framework_detection_with_evidence():
    files = [
        {"path": "backend/main.py", "language": "Python"},
        {"path": "backend/requirements.txt", "language": "Text"},
        {"path": "frontend/package.json", "language": "JSON"},
        {"path": "frontend/src/App.tsx", "language": "TypeScript"},
    ]
    dependencies = [
        {"name": "fastapi", "target_path": "fastapi", "source_path": "backend/main.py", "dependency_type": "external"},
        {"name": "react", "target_path": "react", "source_path": "frontend/src/App.tsx", "dependency_type": "external"},
    ]

    frameworks = universal_analyzer_service.detect_frameworks(files, dependencies)
    framework_names = {f["name"] for f in frameworks}

    assert "FastAPI" in framework_names
    assert "React" in framework_names
    # Verify no false positive detection of Django or Angular
    assert "Django" not in framework_names
    assert "Angular" not in framework_names

    # Check evidence structure
    fastapi_fw = next(f for f in frameworks if f["name"] == "FastAPI")
    assert fastapi_fw["confidence"] in ("HIGH", "MEDIUM")
    assert len(fastapi_fw.get("evidence", fastapi_fw.get("evidence_files", []))) > 0


# =========================================================================
# 3. Package Managers & Monorepo Detection
# =========================================================================

def test_package_manager_and_monorepo_detection():
    # Monorepo with pnpm
    files = [
        {"path": "pnpm-workspace.yaml", "language": "YAML"},
        {"path": "packages/ui/package.json", "language": "JSON"},
        {"path": "packages/backend/pyproject.toml", "language": "TOML"},
        {"path": "packages/backend/poetry.lock", "language": "TOML"},
    ]

    pkg_managers = universal_analyzer_service.detect_package_managers(files)
    pkg_names = {p["id"] for p in pkg_managers}
    assert "pnpm" in pkg_names
    assert "poetry" in pkg_names

    monorepo_info = universal_analyzer_service.detect_monorepo(files)
    assert monorepo_info["is_monorepo"] is True
    assert "pnpm" in monorepo_info["workspace_type"].lower()
    assert len(monorepo_info["packages"]) >= 1


def test_single_repo_not_monorepo():
    files = [
        {"path": "package.json", "language": "JSON"},
        {"path": "src/index.ts", "language": "TypeScript"},
    ]
    monorepo_info = universal_analyzer_service.detect_monorepo(files)
    assert monorepo_info["is_monorepo"] is False
    assert len(monorepo_info["packages"]) == 0


# =========================================================================
# 4. Entry Point & API Discovery
# =========================================================================

def test_entry_point_and_api_discovery():
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        (root / "app").mkdir(parents=True, exist_ok=True)
        (root / "src").mkdir(parents=True, exist_ok=True)

        py_content = """from fastapi import FastAPI
app = FastAPI()

@app.get("/api/v1/health")
def health():
    return {"status": "ok"}

@app.post("/api/v1/items")
def create_item():
    return {}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)
"""
        go_content = """package main

import "github.com/gin-gonic/gin"

func main() {
    r := gin.Default()
    r.GET("/ping", func(c *gin.Context) {})
}
"""
        (root / "app" / "main.py").write_text(py_content, encoding="utf-8")
        (root / "src" / "server.go").write_text(go_content, encoding="utf-8")

        files = [
            {"path": "app/main.py", "language": "Python"},
            {"path": "src/server.go", "language": "Go"},
        ]
        symbols = [
            {"name": "main", "symbol_type": "function", "file_path": "src/server.go", "start_line": 5},
            {"name": "main", "symbol_type": "function", "file_path": "app/main.py", "start_line": 12},
        ]

        entry_points = universal_analyzer_service.detect_entry_points(files, symbols)
        ep_paths = [e["file_path"] for e in entry_points]
        assert "app/main.py" in ep_paths
        assert "src/server.go" in ep_paths

        api_endpoints = universal_analyzer_service.detect_api_endpoints(files, symbols, source_dir=root)
        paths = {ep["route"] for ep in api_endpoints}
        assert "/api/v1/health" in paths
        assert "/api/v1/items" in paths
        assert "/ping" in paths


# =========================================================================
# 5. Database, Environment Secrets & Configuration Redaction
# =========================================================================

def test_database_and_configuration_redaction():
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        (root / "config").mkdir(parents=True, exist_ok=True)
        (root / "src").mkdir(parents=True, exist_ok=True)

        env_content = "DATABASE_URL=postgresql://user:secretpassword@localhost:5432/mydb\nJWT_SECRET=supersecret123\nPORT=8080\n"
        yaml_content = "database:\n  host: localhost\n"

        (root / ".env.example").write_text(env_content, encoding="utf-8")
        (root / "config" / "database.yaml").write_text(yaml_content, encoding="utf-8")

        files = [
            {"path": ".env.example", "language": "Configuration"},
            {"path": "config/database.yaml", "language": "YAML"},
            {"path": "src/models.py", "language": "Python"},
        ]
        dependencies = [
            {"name": "sqlalchemy", "target_path": "sqlalchemy", "source_path": "src/models.py"},
            {"name": "psycopg2", "target_path": "psycopg2", "source_path": "src/models.py"},
        ]

        databases = universal_analyzer_service.detect_databases(files, dependencies)
        db_names = {d["name"] for d in databases}
        assert "SQLAlchemy" in db_names
        assert "PostgreSQL" in db_names

        configs = universal_analyzer_service.detect_configurations(files, source_dir=root)
        env_vars = configs.get("environment_variables", [])
        env_names = {e["name"] for e in env_vars}
        assert "DATABASE_URL" in env_names
        assert "JWT_SECRET" in env_names
        assert "PORT" in env_names

        # CRITICAL: Confirm all values are redacted and never raw credentials
        for ev in env_vars:
            assert ev["value"] == "[REDACTED]"
            assert "secretpassword" not in str(ev)
            assert "supersecret123" not in str(ev)


# =========================================================================
# 6. Tests and Documentation Discovery
# =========================================================================

def test_tests_and_documentation_discovery():
    files = [
        {"path": "tests/test_api.py", "language": "Python"},
        {"path": "src/api.py", "language": "Python"},
        {"path": "README.md", "language": "Markdown", "line_count": 50},
        {"path": "docs/architecture.md", "language": "Markdown", "line_count": 80},
    ]

    test_info = universal_analyzer_service.detect_tests(files)
    assert test_info["test_file_count"] == 1
    assert "Pytest" in test_info["test_frameworks"]
    assert test_info["test_ratio_percent"] == 25.0

    docs = universal_analyzer_service.detect_documentation(files)
    doc_paths = {d["file_path"] for d in docs}
    assert "README.md" in doc_paths
    assert "docs/architecture.md" in doc_paths


# =========================================================================
# 7. End-to-End Tolerant Ingestion & Partial Analysis
# =========================================================================

@pytest.mark.asyncio
async def test_tolerant_ingestion_partial_analysis(db_session: AsyncSession):
    """Verify an individual AST parse failure results in PARTIAL status with captured errors."""
    ws = await create_test_workspace(db_session)

    with tempfile.TemporaryDirectory() as temp_dir:
        repo_dir = Path(temp_dir)
        (repo_dir / "valid.py").write_text("def add(a, b):\n    return a + b\n", encoding="utf-8")
        # Intentionally invalid python syntax that will fail python AST parsing
        (repo_dir / "broken.py").write_text("def broken_syntax(:\n  return ?!\n", encoding="utf-8")

        repo = Repository(
            id=f"repo-{uuid.uuid4().hex[:8]}",
            workspace_id=ws.id,
            name="partial-tolerance-repo",
            url="https://github.com/test/partial-tolerance-repo",
            acquisition_status="READY",
            analysis_status="pending",
        )
        db_session.add(repo)
        await db_session.commit()

        # Intercept git_service storage path and verification to point to our test directory
        with patch.object(git_service, "get_storage_path", return_value=repo_dir), \
             patch.object(git_service, "verify_repository_source", return_value=(True, None)):
            result = await repository_ingestion_service.run_analysis(repo.id, db_session)

        # Status must be 'partial' because broken.py failed AST parsing
        assert result["status"] == "partial"
        assert len(result.get("partial_errors", [])) >= 1
        assert any("broken.py" in err["file"] for err in result["partial_errors"])

        # Valid file's symbols are still indexed!
        symbols_stmt = select(Symbol).where(Symbol.repository_id == repo.id)
        symbols_res = await db_session.execute(symbols_stmt)
        symbols = symbols_res.scalars().all()
        assert any(s.name == "add" for s in symbols)


# =========================================================================
# 8. Unsupported Language Clean Reporting
# =========================================================================

@pytest.mark.asyncio
async def test_unsupported_language_clean_reporting(db_session: AsyncSession):
    """Verify files in unsupported or config formats don't crash ingestion and report cleanly."""
    ws = await create_test_workspace(db_session)

    with tempfile.TemporaryDirectory() as temp_dir:
        repo_dir = Path(temp_dir)
        (repo_dir / "main.py").write_text("print('hello')", encoding="utf-8")
        (repo_dir / "script.xyz").write_text("custom_dsl_command", encoding="utf-8")

        repo = Repository(
            id=f"repo-{uuid.uuid4().hex[:8]}",
            workspace_id=ws.id,
            name="unsupported-lang-repo",
            url="https://github.com/test/unsupported-lang-repo",
            acquisition_status="READY",
            analysis_status="pending",
        )
        db_session.add(repo)
        await db_session.commit()

        with patch.object(git_service, "get_storage_path", return_value=repo_dir), \
             patch.object(git_service, "verify_repository_source", return_value=(True, None)):
            result = await repository_ingestion_service.run_analysis(repo.id, db_session)

        assert result["status"] in ("completed", "partial")

        profile = await universal_analyzer_service.generate_universal_profile(repo.id, db_session)
        languages_meta = profile.get("languages", {})
        unsupported = languages_meta.get("unsupported_languages", [])
        # Unsupported format cleanly reported without crashing
        assert isinstance(unsupported, list)


# =========================================================================
# 9. Cross-Repository Isolation
# =========================================================================

@pytest.mark.asyncio
async def test_cross_repository_profile_isolation(db_session: AsyncSession):
    """Verify Repo A profile never bleeds into Repo B profile."""
    ws = await create_test_workspace(db_session)

    # Repo A: Python + FastAPI
    repo_a = Repository(
        id=f"repo-a-{uuid.uuid4().hex[:6]}",
        workspace_id=ws.id,
        name="repo-a-python",
        url="https://github.com/test/repo-a",
        acquisition_status="READY",
        analysis_status="completed",
        metadata_json={
            "profile": {
                "repository_id": "repo-a",
                "languages": {"primary_language": "Python"},
                "frameworks": [{"name": "FastAPI", "category": "Web Framework"}],
                "api_endpoints": [{"path": "/repo-a-endpoint", "http_method": "GET"}],
            }
        }
    )

    # Repo B: Go + Gin
    repo_b = Repository(
        id=f"repo-b-{uuid.uuid4().hex[:6]}",
        workspace_id=ws.id,
        name="repo-b-go",
        url="https://github.com/test/repo-b",
        acquisition_status="READY",
        analysis_status="completed",
        metadata_json={
            "profile": {
                "repository_id": "repo-b",
                "languages": {"primary_language": "Go"},
                "frameworks": [{"name": "Gin", "category": "Web Framework"}],
                "api_endpoints": [{"path": "/repo-b-endpoint", "http_method": "GET"}],
            }
        }
    )
    db_session.add_all([repo_a, repo_b])
    await db_session.commit()

    profile_a = await universal_analyzer_service.generate_universal_profile(repo_a.id, db_session)
    profile_b = await universal_analyzer_service.generate_universal_profile(repo_b.id, db_session)

    # Validate absolute isolation
    fw_a = {f["name"] for f in profile_a.get("frameworks", [])}
    fw_b = {f["name"] for f in profile_b.get("frameworks", [])}
    assert "FastAPI" in fw_a
    assert "Gin" not in fw_a
    assert "Gin" in fw_b
    assert "FastAPI" not in fw_b


# =========================================================================
# 10. Phase 16 Regression Test: Search & AI Q&A Grounding
# =========================================================================

@pytest.mark.asyncio
async def test_phase16_search_and_qa_regression(db_session: AsyncSession):
    """Verify Phase 16 repository search and grounded Q&A continue to operate flawlessly."""
    ws = await create_test_workspace(db_session)

    repo = Repository(
        id=f"repo-qa-{uuid.uuid4().hex[:6]}",
        workspace_id=ws.id,
        name="regression-qa-repo",
        url="https://github.com/test/regression-qa-repo",
        acquisition_status="READY",
        analysis_status="completed",
    )
    db_session.add(repo)
    await db_session.flush()

    file_item = File(
        id=f"file-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        path="src/payment_gateway.py",
        language="Python",
        size_bytes=350,
        line_count=20,
        source_metadata={
            "code_lines": 15,
            "blank_lines": 3,
            "comment_lines": 2,
        },
    )
    db_session.add(file_item)
    await db_session.flush()

    symbol_item = Symbol(
        id=f"sym-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        file_id=file_item.id,
        name="process_stripe_payment",
        qualified_name="payment_gateway.process_stripe_payment",
        symbol_type="function",
        start_line=5,
        end_line=15,
    )
    db_session.add(symbol_item)
    await db_session.commit()

    # Test Search Intelligence
    search_res = await search_intelligence_service.search_repository(
        repository_id=repo.id,
        query_str="process_stripe_payment",
        search_type="symbol",
        db=db_session,
    )
    assert search_res["total_matches"] >= 1
    found_symbols = [s["name"] for s in search_res["symbols"]]
    assert "process_stripe_payment" in found_symbols

    # Test RAG Grounded Answer
    answer_res = await rag_service.answer_repository_query(
        repository_id=repo.id,
        question="How are Stripe payments handled in this codebase?",
        db=db_session,
    )
    assert answer_res["answer"] is not None
    assert len(answer_res.get("sources", [])) >= 1
    source_paths = [s["file_path"] for s in answer_res["sources"]]
    assert any("payment_gateway.py" in p for p in source_paths)
