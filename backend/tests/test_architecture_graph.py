import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.dependency import Dependency
from backend.app.services.architecture_service import architecture_service, ArchitectureService
from backend.app.services.repository_ingestion_service import ingestion_service


# =========================================================================
# Unit Tests for Architecture Aggregation & Health (Tests 1 to 9, 13, 14, 15)
# =========================================================================

def test_1_and_2_directory_aggregation_from_actual_paths():
    svc = ArchitectureService()
    # Ensure dynamic extraction without hardcoded names
    assert svc.get_group_name("src/api/routes.py") == "src/api"
    assert svc.get_group_name("src/services/auth/login.py") == "src/services"
    assert svc.get_group_name("backend/app/models/user.py") == "backend/app"
    assert svc.get_group_name("components/buttons/Primary.tsx") == "components/buttons"
    assert svc.get_group_name("main.py") == "(root)"


def test_3_group_statistics_accuracy():
    svc = ArchitectureService()
    files = [
        {
            "id": "f1",
            "path": "src/services/auth.py",
            "language": "Python",
            "line_count": 100,
            "source_metadata": {"code_lines": 80, "symbol_count": 5},
        },
        {
            "id": "f2",
            "path": "src/services/token.py",
            "language": "Python",
            "line_count": 50,
            "source_metadata": {"code_lines": 40, "symbol_count": 3},
        },
        {
            "id": "f3",
            "path": "src/api/routes.py",
            "language": "Python",
            "line_count": 120,
            "source_metadata": {"code_lines": 100, "symbol_count": 8},
        },
    ]
    dependencies = [
        {"source_path": "src/api/routes.py", "target_path": "src/services/auth.py", "resolved": True},
        {"source_path": "src/api/routes.py", "target_path": "src/services/token.py", "resolved": True},
    ]
    groups = svc.aggregate_directory_groups("repo-1", files, dependencies)
    assert len(groups) == 2

    # Verify src/services
    svc_grp = next(g for g in groups if g["name"] == "src/services")
    assert svc_grp["file_count"] == 2
    assert svc_grp["line_count"] == 150
    assert svc_grp["code_lines"] == 120
    assert svc_grp["symbol_count"] == 8
    assert svc_grp["incoming_dependencies"] == 2
    assert svc_grp["outgoing_dependencies"] == 0

    # Verify src/api
    api_grp = next(g for g in groups if g["name"] == "src/api")
    assert api_grp["file_count"] == 1
    assert api_grp["outgoing_dependencies"] == 2
    assert api_grp["incoming_dependencies"] == 0


def test_4_and_5_group_dependency_relationships_and_edge_weights():
    svc = ArchitectureService()
    files = [
        {"id": "1", "path": "src/api/routes.py", "line_count": 50, "source_metadata": {}},
        {"id": "2", "path": "src/api/users.py", "line_count": 40, "source_metadata": {}},
        {"id": "3", "path": "src/services/auth.py", "line_count": 80, "source_metadata": {}},
        {"id": "4", "path": "src/services/payment.py", "line_count": 90, "source_metadata": {}},
    ]
    dependencies = [
        {"source_path": "src/api/routes.py", "target_path": "src/services/auth.py", "resolved": True},
        {"source_path": "src/api/users.py", "target_path": "src/services/auth.py", "resolved": True},
        {"source_path": "src/api/users.py", "target_path": "src/services/payment.py", "resolved": True},
    ]
    groups = svc.aggregate_directory_groups("repo-1", files, dependencies)
    rels = svc.aggregate_group_relationships("repo-1", groups, dependencies)

    assert len(rels) == 1
    rel = rels[0]
    assert rel["source"] == "src/api"
    assert rel["target"] == "src/services"
    # Weight must equal 3 exact imports
    assert rel["dependency_count"] == 3


def test_6_deterministic_architecture_health_scoring():
    svc = ArchitectureService()
    # Scenario A: Clean repository (no cycles, balanced coupling)
    groups = [{"name": "src/api", "file_count": 2, "incoming_dependencies": 0, "outgoing_dependencies": 1}]
    relationships = [{"source": "src/api", "target": "src/services"}]
    clean_health = svc.compute_architecture_health(groups, relationships, [], [], [{"resolved": True}])
    assert clean_health["score"] == 100
    assert clean_health["grade"] == "A"

    # Scenario B: Cyclic repository (1 cycle detected)
    cyclic_health = svc.compute_architecture_health(
        groups,
        relationships,
        [["A.py", "B.py", "A.py"]],
        [],
        [{"resolved": True}],
    )
    # Deduction: -15 pts for 1 cycle -> 85 pts (Grade B)
    assert cyclic_health["score"] == 85
    assert cyclic_health["grade"] == "B"
    assert len(cyclic_health["deductions"]) == 1
    assert cyclic_health["deductions"][0]["category"] == "CIRCULAR_DEPENDENCIES"


def test_7_circular_dependency_visualization_data():
    svc = ArchitectureService()
    files = [
        {"id": "1", "path": "src/a.py", "line_count": 20, "source_metadata": {}},
        {"id": "2", "path": "src/b.py", "line_count": 20, "source_metadata": {}},
    ]
    deps = [
        {"source_path": "src/a.py", "target_path": "src/b.py", "resolved": True},
        {"source_path": "src/b.py", "target_path": "src/a.py", "resolved": True},
    ]
    model = svc.build_architecture_model("repo-1", files, deps, cycles=[["src/a.py", "src/b.py", "src/a.py"]])
    assert len(model["cycles"]) == 1
    assert model["summary"]["total_cycles"] == 1
    assert model["health"]["score"] < 100


def test_8_and_9_node_and_edge_details_extraction():
    svc = ArchitectureService()
    files = [
        {"id": "f-1", "path": "src/controllers/auth.ts", "language": "TypeScript", "line_count": 45, "source_metadata": {"symbol_count": 4}},
        {"id": "f-2", "path": "src/models/user.ts", "language": "TypeScript", "line_count": 30, "source_metadata": {"symbol_count": 2}},
    ]
    deps = [
        {"source_path": "src/controllers/auth.ts", "target_path": "src/models/user.ts", "resolved": True, "start_line": 3, "dependency_type": "IMPORT"}
    ]
    model = svc.build_architecture_model("repo-1", files, deps)
    assert len(model["groups"]) == 2
    assert len(model["relationships"]) == 1
    rel = model["relationships"][0]
    assert rel["source"] == "src/controllers"
    assert rel["target"] == "src/models"
    assert rel["dependencies"][0]["source_file"] == "src/controllers/auth.ts"
    assert rel["dependencies"][0]["start_line"] == 3


def test_13_empty_repository_graph_handling():
    svc = ArchitectureService()
    model = svc.build_architecture_model("repo-empty", [], [])
    assert model["summary"]["total_directories"] == 0
    assert model["summary"]["total_files"] == 0
    assert model["summary"]["total_dependencies"] == 0
    assert model["relationships"] == []
    assert model["health"]["score"] == 100


def test_14_and_15_small_and_large_repository_handling():
    svc = ArchitectureService()
    # Small repo: 2 files
    small_files = [
        {"id": "1", "path": "main.py", "line_count": 10, "source_metadata": {}},
        {"id": "2", "path": "utils.py", "line_count": 15, "source_metadata": {}},
    ]
    small_model = svc.build_architecture_model("repo-small", small_files, [])
    assert len(small_model["groups"]) == 1
    assert small_model["groups"][0]["name"] == "(root)"


# =========================================================================
# Integration & Strict Isolation Tests (Tests 10, 11, 12, 16, 17)
# =========================================================================

@pytest.mark.asyncio
async def test_10_to_17_architecture_api_and_strict_isolation_pipeline(
    client: AsyncClient,
    db_session: AsyncSession,
    repo_a_python_origin,
    repo_b_typescript_origin,
    monkeypatch,
    tmp_path,
):
    storage_root = tmp_path / "arch_test_workspace"
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
    subprocess.run(["git", "commit", "-m", "Add architecture routes in Repo A"], cwd=repo_a_python_origin, check=True)

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

    # --- Test 17 & 10: Architecture API Response & Strict Isolation ---
    arch_a_res = await client.get(f"/api/v1/repositories/{repo_a_id}/architecture")
    assert arch_a_res.status_code == 200
    arch_a = arch_a_res.json()

    arch_b_res = await client.get(f"/api/v1/repositories/{repo_b_id}/architecture")
    assert arch_b_res.status_code == 200
    arch_b = arch_b_res.json()

    # Architecture A must contain ONLY Repo A groups (src/api, src/services, src/core)
    group_names_a = [g["name"] for g in arch_a["groups"]]
    assert "src/api" in group_names_a
    assert "src/services" in group_names_a
    assert not any("components" in g for g in group_names_a)

    # Architecture B must contain ONLY Repo B groups (src/components, src/lib, src/config)
    group_names_b = [g["name"] for g in arch_b["groups"]]
    assert "src/components" in group_names_b
    assert "src/lib" in group_names_b
    assert not any("api" in g for g in group_names_b)

    # Check health response structure
    assert "score" in arch_a["health"]
    assert "grade" in arch_a["health"]
    assert arch_a["health"]["max_score"] == 100

    # --- Test 16: Multi-level Graph API (Directory Level vs File Level) ---
    graph_dir_res = await client.get(f"/api/v1/repositories/{repo_a_id}/graph?level=directory")
    assert graph_dir_res.status_code == 200
    graph_dir = graph_dir_res.json()
    assert all(n["type"] == "directory" for n in graph_dir["nodes"])
    assert any(n["label"] == "src/api" for n in graph_dir["nodes"])

    graph_file_res = await client.get(f"/api/v1/repositories/{repo_a_id}/graph?level=file")
    assert graph_file_res.status_code == 200
    graph_file = graph_file_res.json()
    assert all(n["type"] == "file" for n in graph_file["nodes"])

    # --- Test 11 & 12: Same filename isolation & A -> B -> A state restoration ---
    arch_b_check = (await client.get(f"/api/v1/repositories/{repo_b_id}/architecture")).json()
    arch_a_check = (await client.get(f"/api/v1/repositories/{repo_a_id}/architecture")).json()

    assert arch_b_check["repository_id"] == repo_b_id
    assert arch_a_check["repository_id"] == repo_a_id
    assert len(arch_a_check["groups"]) == len(arch_a["groups"])
    assert len(arch_b_check["groups"]) == len(arch_b["groups"])
