import asyncio
import os
import shutil
import subprocess
import tempfile
from pathlib import Path
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode
from backend.app.services.git_repository_service import (
    git_service,
    GitValidationError,
)
from backend.app.services.repository_ingestion_service import ingestion_service
from backend.app.services.rag_service import rag_service, is_secret_file
from backend.app.services.llm_provider import GroundedDeterministicProvider


def create_git_commit(repo_path: Path, message: str = "commit"):
    subprocess.run(["git", "add", "."], cwd=repo_path, check=True, capture_output=True)
    subprocess.run(
        ["git", "-c", "user.name=Tester", "-c", "user.email=test@codeatlas.dev", "commit", "-m", message],
        cwd=repo_path,
        check=True,
        capture_output=True,
    )


@pytest.fixture
def polyglot_repositories(tmp_path):
    """
    Creates 5 distinct, real Git repositories on disk representing different ecosystems:
    - Repo A: Python / FastAPI
    - Repo B: React / TypeScript
    - Repo C: Java / Spring Boot
    - Repo D: Go & Rust
    - Repo E: Monorepo
    """
    base_dir = tmp_path / "repos"
    base_dir.mkdir(parents=True, exist_ok=True)

    # 1. Repository A: Python / FastAPI
    repo_a = base_dir / "repo_a_python"
    repo_a.mkdir()
    subprocess.run(["git", "init", "-b", "main", str(repo_a)], check=True, capture_output=True)
    
    (repo_a / "requirements.txt").write_text("fastapi>=0.110.0\npydantic>=2.6.0\nuvicorn>=0.28.0\n")
    src_a = repo_a / "src"
    src_a.mkdir()
    (src_a / "__init__.py").write_text("")
    (src_a / "main.py").write_text(
        'from fastapi import FastAPI\n'
        'from src.services.auth import AuthService\n\n'
        'app = FastAPI(title="PaymentAPI")\n'
        'auth_svc = AuthService()\n\n'
        '@app.get("/health")\n'
        'def health_check():\n'
        '    return {"status": "ok"}\n\n'
        '@app.post("/login")\n'
        'async def login_endpoint(token: str):\n'
        '    return {"valid": await auth_svc.verify_password(token)}\n'
    )
    svc_a = src_a / "services"
    svc_a.mkdir()
    (svc_a / "__init__.py").write_text("")
    (svc_a / "auth.py").write_text(
        'class AuthService:\n'
        '    """Handles user credential validation."""\n'
        '    def __init__(self):\n'
        '        self.active = True\n\n'
        '    async def verify_password(self, secret: str) -> bool:\n'
        '        """Verify token length."""\n'
        '        return len(secret) >= 8\n'
    )
    create_git_commit(repo_a, "Initial commit Python FastAPI")

    # 2. Repository B: React / TypeScript
    repo_b = base_dir / "repo_b_typescript"
    repo_b.mkdir()
    subprocess.run(["git", "init", "-b", "main", str(repo_b)], check=True, capture_output=True)
    
    (repo_b / "package.json").write_text('{"name": "frontend-app", "dependencies": {"react": "^18.3.1"}}\n')
    src_b = repo_b / "src"
    src_b.mkdir()
    (src_b / "App.tsx").write_text(
        'import React from "react";\n'
        'import { Header } from "./components/Header";\n'
        'import { ApiClient } from "./services/apiClient";\n\n'
        'export const App: React.FC = () => {\n'
        '  return <Header title="CodeAtlas Frontend" />;\n'
        '};\n'
    )
    comp_b = src_b / "components"
    comp_b.mkdir()
    (comp_b / "Header.tsx").write_text(
        'import React from "react";\n\n'
        'export interface HeaderProps {\n'
        '  title: string;\n'
        '}\n\n'
        'export const Header: React.FC<HeaderProps> = ({ title }) => {\n'
        '  return <header><h1>{title}</h1></header>;\n'
        '};\n'
    )
    svc_b = src_b / "services"
    svc_b.mkdir()
    (svc_b / "apiClient.ts").write_text(
        'export class ApiClient {\n'
        '  private endpoint: string = "/api";\n\n'
        '  async fetchData(): Promise<string[]> {\n'
        '    return ["item1", "item2"];\n'
        '  }\n'
        '}\n'
    )
    create_git_commit(repo_b, "Initial commit TypeScript React")

    # 3. Repository C: Java / Spring Boot
    repo_c = base_dir / "repo_c_java"
    repo_c.mkdir()
    subprocess.run(["git", "init", "-b", "main", str(repo_c)], check=True, capture_output=True)
    
    (repo_c / "pom.xml").write_text('<project><groupId>com.codeatlas</groupId><artifactId>orders</artifactId></project>\n')
    java_dir = repo_c / "src" / "main" / "java" / "com" / "example"
    java_dir.mkdir(parents=True)
    (java_dir / "OrderService.java").write_text(
        'package com.example;\n\n'
        'public class OrderService {\n'
        '    public String processOrder(String orderId) {\n'
        '        return "PROCESSED-" + orderId;\n'
        '    }\n\n'
        '    public static void main(String[] args) {\n'
        '        System.out.println("Starting OrderService");\n'
        '    }\n'
        '}\n'
    )
    create_git_commit(repo_c, "Initial commit Java Spring")

    # 4. Repository D: Go & Rust
    repo_d = base_dir / "repo_d_go_rust"
    repo_d.mkdir()
    subprocess.run(["git", "init", "-b", "main", str(repo_d)], check=True, capture_output=True)
    
    (repo_d / "go.mod").write_text("module github.com/codeatlas/gateway\n\ngo 1.22\n")
    (repo_d / "main.go").write_text(
        'package main\n\n'
        'import "net/http"\n\n'
        'type GatewayServer struct {\n'
        '    Port int\n'
        '}\n\n'
        'func handleHealth(w http.ResponseWriter, r *http.Request) {\n'
        '    w.Write([]byte("ok"))\n'
        '}\n\n'
        'func main() {\n'
        '    http.HandleFunc("/health", handleHealth)\n'
        '}\n'
    )
    rust_dir = repo_d / "engine"
    rust_dir.mkdir()
    (rust_dir / "Cargo.toml").write_text('[package]\nname = "engine"\nversion = "0.1.0"\n')
    (rust_dir / "lib.rs").write_text(
        'pub struct FastHasher {\n'
        '    pub seed: u64,\n'
        '}\n\n'
        'impl FastHasher {\n'
        '    pub fn compute(&self, val: u64) -> u64 {\n'
        '        self.seed ^ val\n'
        '    }\n'
        '}\n'
    )
    create_git_commit(repo_d, "Initial commit Go and Rust")

    # 5. Repository E: Monorepo Structure
    repo_e = base_dir / "repo_e_monorepo"
    repo_e.mkdir()
    subprocess.run(["git", "init", "-b", "main", str(repo_e)], check=True, capture_output=True)
    
    pkg_back = repo_e / "packages" / "backend"
    pkg_back.mkdir(parents=True)
    (pkg_back / "server.py").write_text('def start_server():\n    return "server_running"\n')
    
    pkg_front = repo_e / "packages" / "frontend"
    pkg_front.mkdir(parents=True)
    (pkg_front / "index.js").write_text('function render() { return "<h1>UI</h1>"; }\n')
    
    create_git_commit(repo_e, "Initial commit Monorepo")

    return {
        "repo_a": repo_a,
        "repo_b": repo_b,
        "repo_c": repo_c,
        "repo_d": repo_d,
        "repo_e": repo_e,
    }


# =========================================================================
# REAL MULTI-REPOSITORY VALIDATION SUITE
# =========================================================================

@pytest.mark.asyncio
async def test_01_real_polyglot_repository_ingestion(client: AsyncClient, db_session: AsyncSession, polyglot_repositories):
    """
    Test 1: Full ingestion of 5 distinct real repositories across Python, TypeScript, Java, Go, Rust, and Monorepo.
    Verifies that every symbol and file is derived from actual repository source code (zero hardcoded intelligence).
    """
    repo_ids = {}

    # Ingest all 5 repositories
    for key, path in polyglot_repositories.items():
        res = await client.post(
            "/api/v1/repositories",
            json={"name": key, "url": str(path.as_uri()), "default_branch": "main"},
        )
        assert res.status_code == 201, f"Failed to register {key}: {res.text}"
        r_id = res.json()["id"]
        repo_ids[key] = r_id
        
        # Execute ingestion pipeline
        ingest_res = await ingestion_service.ingest_repository(r_id, db=db_session)
        assert ingest_res["status"] == "completed", f"Ingestion failed for {key}: {ingest_res}"

    # Verify Repository A (Python / FastAPI)
    syms_a = (await db_session.execute(select(Symbol).where(Symbol.repository_id == repo_ids["repo_a"]))).scalars().all()
    sym_names_a = [s.name for s in syms_a]
    assert "AuthService" in sym_names_a
    assert "verify_password" in sym_names_a
    assert "health_check" in sym_names_a
    assert "login_endpoint" in sym_names_a

    # Verify Repository B (React / TypeScript)
    syms_b = (await db_session.execute(select(Symbol).where(Symbol.repository_id == repo_ids["repo_b"]))).scalars().all()
    sym_names_b = [s.name for s in syms_b]
    assert "App" in sym_names_b
    assert "Header" in sym_names_b
    assert "HeaderProps" in sym_names_b
    assert "ApiClient" in sym_names_b
    assert "fetchData" in sym_names_b

    # Verify Repository C (Java / Spring Boot)
    syms_c = (await db_session.execute(select(Symbol).where(Symbol.repository_id == repo_ids["repo_c"]))).scalars().all()
    sym_names_c = [s.name for s in syms_c]
    assert "OrderService" in sym_names_c
    assert "processOrder" in sym_names_c
    assert "main" in sym_names_c

    # Verify Repository D (Go & Rust)
    syms_d = (await db_session.execute(select(Symbol).where(Symbol.repository_id == repo_ids["repo_d"]))).scalars().all()
    sym_names_d = [s.name for s in syms_d]
    assert "GatewayServer" in sym_names_d
    assert "handleHealth" in sym_names_d
    assert "FastHasher" in sym_names_d
    assert "compute" in sym_names_d

    # Verify Repository E (Monorepo)
    files_e = (await db_session.execute(select(File).where(File.repository_id == repo_ids["repo_e"]))).scalars().all()
    file_paths_e = [f.path for f in files_e]
    assert any("server.py" in p for p in file_paths_e)
    assert any("index.js" in p for p in file_paths_e)


@pytest.mark.asyncio
async def test_02_strict_repository_isolation_alternating(client: AsyncClient, db_session: AsyncSession, polyglot_repositories):
    """
    Test 2: Alternating A -> B -> A -> B queries to verify zero cross-repository data contamination.
    """
    # Register Repo A and Repo B
    res_a = await client.post(
        "/api/v1/repositories",
        json={"name": "iso-repo-a", "url": str(polyglot_repositories["repo_a"].as_uri()), "default_branch": "main"},
    )
    id_a = res_a.json()["id"]
    await ingestion_service.ingest_repository(id_a, db=db_session)

    res_b = await client.post(
        "/api/v1/repositories",
        json={"name": "iso-repo-b", "url": str(polyglot_repositories["repo_b"].as_uri()), "default_branch": "main"},
    )
    id_b = res_b.json()["id"]
    await ingestion_service.ingest_repository(id_b, db=db_session)

    for cycle in range(2):
        # Inspect Repository A
        files_a = (await client.get(f"/api/v1/repositories/{id_a}/files")).json()
        assert any("src/main.py" in f["path"] for f in files_a)
        assert any("auth.py" in f["path"] for f in files_a)
        assert not any("Header.tsx" in f["path"] or "apiClient.ts" in f["path"] or "package.json" in f["path"] for f in files_a)

        syms_a = (await client.get(f"/api/v1/repositories/{id_a}/symbols")).json()
        assert any(s["name"] == "AuthService" for s in syms_a)
        assert not any(s["name"] == "ApiClient" or s["name"] == "Header" for s in syms_a)

        # Inspect Repository B
        files_b = (await client.get(f"/api/v1/repositories/{id_b}/files")).json()
        assert any("Header.tsx" in f["path"] for f in files_b)
        assert any("apiClient.ts" in f["path"] for f in files_b)
        assert not any("auth.py" in f["path"] or "main.py" in f["path"] or "requirements.txt" in f["path"] for f in files_b)

        syms_b = (await client.get(f"/api/v1/repositories/{id_b}/symbols")).json()
        assert any(s["name"] == "ApiClient" for s in syms_b)
        assert not any(s["name"] == "AuthService" for s in syms_b)


@pytest.mark.asyncio
async def test_03_security_boundaries_validation(client: AsyncClient):
    """
    Test 3: Security boundaries - Path traversal, Flag injection, and Secret masking.
    """
    # 1. Path traversal in repository ID
    with pytest.raises(GitValidationError):
        git_service.validate_repository_id("../../etc/passwd")

    with pytest.raises(GitValidationError):
        git_service.validate_repository_id("repo/nested/bad")

    # 2. Command / Flag injection in Git URL
    with pytest.raises(GitValidationError):
        git_service.validate_git_url("--upload-pack=touch /tmp/pwned")

    with pytest.raises(GitValidationError):
        git_service.validate_git_url("https://github.com/org/repo.git; rm -rf /")

    with pytest.raises(GitValidationError):
        git_service.validate_git_url("ftp://malicious.org/repo.git")

    # 3. Secret file masking
    assert is_secret_file(".env") is True
    assert is_secret_file(".env.production") is True
    assert is_secret_file("secrets.json") is True
    assert is_secret_file("id_rsa") is True
    assert is_secret_file("server.key") is True
    assert is_secret_file("src/services/auth.py") is False


@pytest.mark.asyncio
async def test_04_ai_rag_evidence_grounding(client: AsyncClient, db_session: AsyncSession, polyglot_repositories):
    """
    Test 4: AI/RAG query grounding - verify citations are grounded in real files and hallucinated sources are stripped.
    """
    res_a = await client.post(
        "/api/v1/repositories",
        json={"name": "rag-repo-test", "url": str(polyglot_repositories["repo_a"].as_uri()), "default_branch": "main"},
    )
    repo_id = res_a.json()["id"]
    await ingestion_service.ingest_repository(repo_id, db=db_session)

    # Query with question
    query_res = await client.post(
        f"/api/v1/repositories/{repo_id}/query",
        json={"question": "Where is the AuthService class defined?"},
    )
    assert query_res.status_code == 200
    data = query_res.json()
    assert data["repository_id"] == repo_id
    assert len(data["sources"]) > 0
    # Every cited source must exist in repository A
    for s in data["sources"]:
        assert "auth.py" in s["path"] or "main.py" in s["path"]


@pytest.mark.asyncio
async def test_05_reindexing_idempotency(client: AsyncClient, db_session: AsyncSession, polyglot_repositories):
    """
    Test 5: Re-indexing idempotency - repeated analysis of the same repository does not duplicate entities.
    """
    res = await client.post(
        "/api/v1/repositories",
        json={"name": "reindex-test", "url": str(polyglot_repositories["repo_c"].as_uri()), "default_branch": "main"},
    )
    repo_id = res.json()["id"]

    # Ingestion 1
    await ingestion_service.ingest_repository(repo_id, db=db_session)
    files_count_1 = len((await db_session.execute(select(File).where(File.repository_id == repo_id))).scalars().all())
    syms_count_1 = len((await db_session.execute(select(Symbol).where(Symbol.repository_id == repo_id))).scalars().all())

    # Ingestion 2 (Re-index)
    await ingestion_service.ingest_repository(repo_id, db=db_session)
    files_count_2 = len((await db_session.execute(select(File).where(File.repository_id == repo_id))).scalars().all())
    syms_count_2 = len((await db_session.execute(select(Symbol).where(Symbol.repository_id == repo_id))).scalars().all())

    # Entity counts must remain exact (no duplicate proliferation)
    assert files_count_1 == files_count_2
    assert syms_count_1 == syms_count_2


@pytest.mark.asyncio
async def test_06_repository_deletion_and_storage_cleanup(client: AsyncClient, db_session: AsyncSession, polyglot_repositories):
    """
    Test 6: Deleting a repository completely removes local storage from disk and cleans DB records.
    """
    res = await client.post(
        "/api/v1/repositories",
        json={"name": "cleanup-test", "url": str(polyglot_repositories["repo_e"].as_uri()), "default_branch": "main"},
    )
    repo_id = res.json()["id"]
    await ingestion_service.ingest_repository(repo_id, db=db_session)

    storage_path = git_service.get_storage_path(repo_id)
    assert storage_path.exists(), f"Storage path {storage_path} should exist after clone"

    # Delete repository via API
    del_res = await client.delete(f"/api/v1/repositories/{repo_id}")
    assert del_res.status_code == 204

    # Verify storage path is removed
    assert not storage_path.exists(), f"Storage path {storage_path} must be cleaned up after deletion"

    # Verify DB record is removed
    db_repo = (await db_session.execute(select(Repository).where(Repository.id == repo_id))).scalar_one_or_none()
    assert db_repo is None
