import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.models.finding import Finding
from backend.app.services.dependency_resolution_service import DependencyResolutionService
from backend.app.services.graph_builder_service import GraphBuilderService
from backend.app.services.repository_ingestion_service import ingestion_service


# =========================================================================
# Unit Tests for Dependency Resolution (Tests 1 to 13)
# =========================================================================

def test_1_python_absolute_import_resolution():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "file-1",
            "path": "src/api/routes.py",
            "language": "Python",
            "source_metadata": {
                "imports": [{"module": "services.auth", "name": "AuthService", "start_line": 3, "end_line": 3}]
            },
        },
        {
            "id": "file-2",
            "path": "src/services/auth.py",
            "language": "Python",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, unresolved = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 1
    assert len(unresolved) == 0
    assert resolved[0]["source_path"] == "src/api/routes.py"
    assert resolved[0]["target_path"] == "src/services/auth.py"
    assert resolved[0]["resolved"] is True
    assert resolved[0]["dependency_type"] == "IMPORT"


def test_2_python_relative_import_resolution():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "file-1",
            "path": "src/services/user.py",
            "language": "Python",
            "source_metadata": {
                "imports": [{"module": ".auth", "name": "AuthService", "start_line": 2, "end_line": 2}]
            },
        },
        {
            "id": "file-2",
            "path": "src/services/auth.py",
            "language": "Python",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, unresolved = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 1
    assert resolved[0]["source_path"] == "src/services/user.py"
    assert resolved[0]["target_path"] == "src/services/auth.py"
    assert resolved[0]["dependency_type"] == "RELATIVE_IMPORT"


def test_3_python_package_import_resolution():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "file-1",
            "path": "src/api/v1/routes.py",
            "language": "Python",
            "source_metadata": {
                "imports": [{"module": "...services.auth", "name": "AuthService", "start_line": 5, "end_line": 5}]
            },
        },
        {
            "id": "file-2",
            "path": "src/services/auth.py",
            "language": "Python",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, unresolved = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 1
    assert resolved[0]["target_path"] == "src/services/auth.py"


def test_4_javascript_relative_import_resolution():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "file-1",
            "path": "src/controllers/auth.js",
            "language": "JavaScript",
            "source_metadata": {
                "imports": [{"module": "../services/AuthService", "name": "AuthService", "start_line": 1, "end_line": 1}]
            },
        },
        {
            "id": "file-2",
            "path": "src/services/AuthService.js",
            "language": "JavaScript",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, unresolved = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 1
    assert resolved[0]["target_path"] == "src/services/AuthService.js"


def test_5_typescript_relative_import_resolution():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "file-1",
            "path": "src/components/LoginCard.tsx",
            "language": "TSX",
            "source_metadata": {
                "imports": [{"module": "../services/AuthService", "name": "AuthService", "start_line": 2, "end_line": 2}]
            },
        },
        {
            "id": "file-2",
            "path": "src/services/AuthService.ts",
            "language": "TypeScript",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, _ = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 1
    assert resolved[0]["target_path"] == "src/services/AuthService.ts"


def test_6_typescript_extension_resolution():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "file-1",
            "path": "src/app.ts",
            "language": "TypeScript",
            "source_metadata": {
                "imports": [{"module": "./components/Header", "name": "Header", "start_line": 1, "end_line": 1}]
            },
        },
        {
            "id": "file-2",
            "path": "src/components/Header.tsx",
            "language": "TSX",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, _ = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 1
    assert resolved[0]["target_path"] == "src/components/Header.tsx"


def test_7_typescript_index_file_resolution():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "file-1",
            "path": "src/index.ts",
            "language": "TypeScript",
            "source_metadata": {
                "imports": [{"module": "./services", "name": "*", "start_line": 1, "end_line": 1}]
            },
        },
        {
            "id": "file-2",
            "path": "src/services/index.ts",
            "language": "TypeScript",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, _ = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 1
    assert resolved[0]["target_path"] == "src/services/index.ts"


def test_8_typescript_path_alias_resolution(tmp_path):
    resolver = DependencyResolutionService()
    # Create tsconfig.json with alias @/* -> src/*
    tsconfig = tmp_path / "tsconfig.json"
    tsconfig.write_text('{"compilerOptions": {"paths": {"@/*": ["./src/*"]}}}')

    files = [
        {
            "id": "file-1",
            "path": "src/views/Dashboard.tsx",
            "language": "TSX",
            "source_metadata": {
                "imports": [{"module": "@/models/User", "name": "User", "start_line": 3, "end_line": 3}]
            },
        },
        {
            "id": "file-2",
            "path": "src/models/User.ts",
            "language": "TypeScript",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, _ = resolver.resolve_dependencies("repo-1", files, repo_dir=tmp_path)
    assert len(resolved) == 1
    assert resolved[0]["target_path"] == "src/models/User.ts"
    assert resolved[0]["dependency_type"] == "ALIAS_IMPORT"


def test_9_external_dependency_remains_unresolved():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "file-1",
            "path": "src/main.py",
            "language": "Python",
            "source_metadata": {
                "imports": [
                    {"module": "fastapi", "name": "FastAPI", "start_line": 1, "end_line": 1},
                    {"module": "pydantic", "name": "BaseModel", "start_line": 2, "end_line": 2},
                ]
            },
        }
    ]
    resolved, unresolved = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 0
    assert len(unresolved) == 2
    assert unresolved[0]["resolved"] is False
    assert unresolved[0]["target_file_id"] is None
    assert unresolved[0]["name"] == "fastapi"


def test_10_internal_dependency_marked_resolved():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "f-1",
            "path": "src/app.py",
            "language": "Python",
            "source_metadata": {
                "imports": [{"module": "services.auth", "name": "auth", "start_line": 4, "end_line": 4}]
            },
        },
        {
            "id": "f-2",
            "path": "src/services/auth.py",
            "language": "Python",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, unresolved = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 1
    assert resolved[0]["resolved"] is True
    assert resolved[0]["source_file_id"] == "f-1"
    assert resolved[0]["target_file_id"] == "f-2"


def test_11_dependency_source_line_accuracy():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "f-1",
            "path": "src/routes.py",
            "language": "Python",
            "source_metadata": {
                "imports": [{"module": "services.auth", "name": "AuthService", "start_line": 17, "end_line": 17}]
            },
        },
        {
            "id": "f-2",
            "path": "src/services/auth.py",
            "language": "Python",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, _ = resolver.resolve_dependencies("repo-1", files)
    assert resolved[0]["start_line"] == 17
    assert resolved[0]["end_line"] == 17


def test_12_duplicate_dependency_prevention():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "f-1",
            "path": "src/routes.py",
            "language": "Python",
            "source_metadata": {
                "imports": [
                    {"module": "services.auth", "name": "AuthService", "start_line": 2, "end_line": 2},
                    {"module": "services.auth", "name": "verify_token", "start_line": 3, "end_line": 3},
                ]
            },
        },
        {
            "id": "f-2",
            "path": "src/services/auth.py",
            "language": "Python",
            "source_metadata": {"imports": []},
        },
    ]
    resolved, _ = resolver.resolve_dependencies("repo-1", files)
    # Should only create 1 dependency edge from routes.py to auth.py
    assert len(resolved) == 1


def test_13_self_loop_prevention():
    resolver = DependencyResolutionService()
    files = [
        {
            "id": "f-1",
            "path": "src/auth.py",
            "language": "Python",
            "source_metadata": {
                # Accidental circular reference to itself
                "imports": [{"module": ".auth", "name": "AuthService", "start_line": 1, "end_line": 1}]
            },
        }
    ]
    resolved, _ = resolver.resolve_dependencies("repo-1", files)
    assert len(resolved) == 0


# =========================================================================
# Unit Tests for Graph Generation & Cycle Detection (Tests 16 to 18)
# =========================================================================

def test_16_circular_dependency_detection():
    builder = GraphBuilderService()
    files = [
        {"id": "1", "path": "A.py", "language": "Python"},
        {"id": "2", "path": "B.py", "language": "Python"},
        {"id": "3", "path": "C.py", "language": "Python"},
    ]
    dependencies = [
        {"source_path": "A.py", "target_path": "B.py", "resolved": True, "source_file_id": "1", "target_file_id": "2"},
        {"source_path": "B.py", "target_path": "C.py", "resolved": True, "source_file_id": "2", "target_file_id": "3"},
        {"source_path": "C.py", "target_path": "A.py", "resolved": True, "source_file_id": "3", "target_file_id": "1"},
    ]
    graph = builder.build_graph_structure("repo-1", files, dependencies)
    assert graph["metrics"]["has_cycles"] is True
    assert graph["metrics"]["cycle_count"] == 1
    assert len(graph["cycles"]) == 1
    cycle = graph["cycles"][0]
    assert cycle[0] == cycle[-1]  # Complete loop


def test_17_and_18_graph_node_and_relationship_generation():
    builder = GraphBuilderService()
    files = [
        {"id": "1", "path": "src/api/routes.py", "language": "Python", "line_count": 100, "size_bytes": 2048},
        {"id": "2", "path": "src/services/auth.py", "language": "Python", "line_count": 50, "size_bytes": 1024},
    ]
    dependencies = [
        {"source_path": "src/api/routes.py", "target_path": "src/services/auth.py", "resolved": True, "source_file_id": "1", "target_file_id": "2", "dependency_type": "IMPORT"}
    ]
    graph = builder.build_graph_structure("repo-1", files, dependencies)
    assert len(graph["nodes"]) == 2
    assert len(graph["edges"]) == 1
    assert graph["edges"][0]["source_path"] == "src/api/routes.py"
    assert graph["edges"][0]["target_path"] == "src/services/auth.py"
    assert graph["metrics"]["total_nodes"] == 2
    assert graph["metrics"]["total_edges"] == 1
    assert graph["metrics"]["connected_components"] == 1


# =========================================================================
# Integration & Strict Isolation Tests (Tests 14, 15, 19, 20, 21, 22)
# =========================================================================

@pytest.mark.asyncio
async def test_14_to_22_end_to_end_dependency_graph_and_strict_isolation(
    client: AsyncClient,
    db_session: AsyncSession,
    repo_a_python_origin,
    repo_b_typescript_origin,
    monkeypatch,
    tmp_path,
):
    storage_root = tmp_path / "dep_test_workspace"
    monkeypatch.setattr("backend.app.config.settings.CODEATLAS_REPOSITORY_ROOT", str(storage_root))

    # --- Setup Repo A: routes.py -> auth_service.py (Python) ---
    (repo_a_python_origin / "src" / "api" / "routes.py").write_text(
        '"""API routes."""\n\n'
        'from src.services.auth_service import AuthService\n\n'
        'def login_route():\n'
        '    auth = AuthService()\n'
        '    return auth.login("admin", "hash")\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_a_python_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Add routes -> auth_service dependency in Repo A"], cwd=repo_a_python_origin, check=True)

    # --- Setup Repo B: LoginCard.tsx -> auth.ts (TypeScript) ---
    (repo_b_typescript_origin / "src" / "components" / "LoginCard.tsx").write_text(
        'import React from "react";\n'
        'import { login } from "../lib/auth";\n\n'
        'export const LoginCard = () => {\n'
        '  return <button onClick={() => login({ user: "admin" })}>Login</button>;\n'
        '};\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_b_typescript_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Add LoginCard -> auth dependency in Repo B"], cwd=repo_b_typescript_origin, check=True)

    # 1. Register & Ingest Repo A
    res_a = await client.post(
        "/api/v1/repositories",
        json={"name": "org/backend-service", "url": str(repo_a_python_origin.as_uri()), "default_branch": "main"},
    )
    repo_a_id = res_a.json()["id"]
    ingest_a = await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    assert ingest_a["status"] == "completed"

    # 2. Register & Ingest Repo B
    res_b = await client.post(
        "/api/v1/repositories",
        json={"name": "org/frontend-app", "url": str(repo_b_typescript_origin.as_uri()), "default_branch": "main"},
    )
    repo_b_id = res_b.json()["id"]
    ingest_b = await ingestion_service.ingest_repository(repo_b_id, db=db_session)
    assert ingest_b["status"] == "completed"

    # --- Test 21 & 19: Strict Repository A/B Graph Isolation ---
    graph_a_res = await client.get(f"/api/v1/repositories/{repo_a_id}/graph")
    assert graph_a_res.status_code == 200
    graph_a = graph_a_res.json()

    graph_b_res = await client.get(f"/api/v1/repositories/{repo_b_id}/graph")
    assert graph_b_res.status_code == 200
    graph_b = graph_b_res.json()

    # Graph A must only contain Repo A files and relationships
    assert any(n["label"] == "src/api/routes.py" for n in graph_a["nodes"])
    assert any(n["label"] == "src/services/auth_service.py" for n in graph_a["nodes"])
    assert not any("LoginCard.tsx" in n["label"] for n in graph_a["nodes"])
    assert len(graph_a["edges"]) >= 1
    edge_a = graph_a["edges"][0]
    assert edge_a["source_label"] == "src/api/routes.py"
    assert edge_a["target_label"] == "src/services/auth_service.py"

    # Graph B must only contain Repo B files and relationships
    assert any(n["label"] == "src/components/LoginCard.tsx" for n in graph_b["nodes"])
    assert any(n["label"] == "src/lib/auth.ts" for n in graph_b["nodes"])
    assert not any("routes.py" in n["label"] for n in graph_b["nodes"])
    assert len(graph_b["edges"]) >= 1
    edge_b = graph_b["edges"][0]
    assert edge_b["source_label"] == "src/components/LoginCard.tsx"
    assert edge_b["target_label"] == "src/lib/auth.ts"

    # --- Test 20: Same filename across repositories isolation ---
    # Both repos have config files (config.py vs config.ts)
    deps_a = (await client.get(f"/api/v1/repositories/{repo_a_id}/dependencies")).json()
    deps_b = (await client.get(f"/api/v1/repositories/{repo_b_id}/dependencies")).json()
    for d in deps_a:
        assert d["repository_id"] == repo_a_id
    for d in deps_b:
        assert d["repository_id"] == repo_b_id

    # --- Test 14: Dependency Re-indexing (Updates cleanly without duplication) ---
    dep_count_before = len(deps_a)
    await ingestion_service.ingest_repository(repo_a_id, db=db_session)
    deps_a_after = (await client.get(f"/api/v1/repositories/{repo_a_id}/dependencies")).json()
    assert len(deps_a_after) == dep_count_before

    # --- Test 15: Deleted dependency cleanup ---
    # Remove import from routes.py in Repo A
    (repo_a_python_origin / "src" / "api" / "routes.py").write_text(
        '"""API routes without auth dependency."""\n\n'
        'def login_route():\n'
        '    return {"status": "ok"}\n'
    )
    subprocess.run(["git", "add", "."], cwd=repo_a_python_origin, check=True)
    subprocess.run(["git", "commit", "-m", "Remove auth dependency"], cwd=repo_a_python_origin, check=True)

    await client.post(f"/api/v1/repositories/{repo_a_id}/sync")
    await ingestion_service.ingest_repository(repo_a_id, db=db_session)

    graph_a_updated = (await client.get(f"/api/v1/repositories/{repo_a_id}/graph")).json()
    # Edges should now be 0 for routes.py -> auth_service.py
    assert not any(
        e["source_label"] == "src/api/routes.py" and e["target_label"] == "src/services/auth_service.py"
        for e in graph_a_updated["edges"]
    )

    # --- Test 22: Switching A -> B -> A restores Repo B and Repo A state ---
    graph_b_check = (await client.get(f"/api/v1/repositories/{repo_b_id}/graph")).json()
    assert len(graph_b_check["edges"]) == len(graph_b["edges"])
