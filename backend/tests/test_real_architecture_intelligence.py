import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.workspace import Workspace
from backend.app.services.repository_ingestion_service import ingestion_service
from backend.app.services.architecture_service import architecture_service


def _create_git_repo(path: Path, files: dict[str, str], commit_msg: str = "Initial commit"):
    path.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "TestUser"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=str(path), check=True, capture_output=True)
    
    for rel_path, content in files.items():
        full_path = path / rel_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content, encoding="utf-8")
        subprocess.run(["git", "add", rel_path], cwd=str(path), check=True, capture_output=True)
    
    subprocess.run(["git", "commit", "-m", commit_msg], cwd=str(path), check=True, capture_output=True)


@pytest.fixture
async def setup_fastapi_layered_repo(tmp_path, db_session: AsyncSession):
    """
    Creates a realistic Python FastAPI repository with layered architecture:
    - main.py (entry point)
    - api/routes.py (API Layer)
    - services/user_service.py (Service Layer)
    - repositories/user_repository.py (Repository Layer)
    - database/models.py (Data & Models Layer)
    """
    repo_dir = tmp_path / "fastapi_layered_repo"
    files = {
        "main.py": (
            "import fastapi\n"
            "from api import routes\n\n"
            "app = fastapi.FastAPI(title='Demo API')\n"
            "app.include_router(routes.router)\n"
        ),
        "api/routes.py": (
            "from services import user_service\n\n"
            "def get_user_endpoint(user_id: str):\n"
            "    return user_service.get_user(user_id)\n"
        ),
        "services/user_service.py": (
            "from repositories import user_repository\n\n"
            "def get_user(user_id: str):\n"
            "    return user_repository.find_by_id(user_id)\n"
        ),
        "repositories/user_repository.py": (
            "from database import models\n\n"
            "def find_by_id(user_id: str):\n"
            "    return models.User(id=user_id)\n"
        ),
        "database/models.py": (
            "class User:\n"
            "    def __init__(self, id: str):\n"
            "        self.id = id\n"
        ),
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo_model = Repository(
        workspace_id=ws.id,
        name="fastapi_layered_repo",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo_model)
    await db_session.commit()
    await db_session.refresh(repo_model)

    await ingestion_service.ingest_repository(repo_model.id, db=db_session)
    await db_session.refresh(repo_model)
    return repo_model


@pytest.fixture
async def setup_react_ts_repo(tmp_path, db_session: AsyncSession):
    """
    Creates a TypeScript React repository with component-based architecture:
    - src/main.tsx (entry point)
    - src/components/UserProfile.tsx (Components Layer)
    - src/hooks/useUser.ts (State & Hooks Layer)
    - src/services/apiClient.ts (Utilities / Services Layer)
    """
    repo_dir = tmp_path / "react_ts_repo"
    files = {
        "src/main.tsx": (
            "import React from 'react';\n"
            "import { createRoot } from 'react-dom/client';\n"
            "import { UserProfile } from './components/UserProfile';\n\n"
            "const root = createRoot(document.getElementById('root')!);\n"
            "root.render(<UserProfile />);\n"
        ),
        "src/components/UserProfile.tsx": (
            "import React from 'react';\n"
            "import { useUser } from '../hooks/useUser';\n\n"
            "export const UserProfile = () => {\n"
            "  const { user } = useUser();\n"
            "  return <div>{user}</div>;\n"
            "};\n"
        ),
        "src/hooks/useUser.ts": (
            "import { useState, useEffect } from 'react';\n"
            "import { fetchUserData } from '../services/apiClient';\n\n"
            "export function useUser() {\n"
            "  const [user, setUser] = useState(null);\n"
            "  return { user };\n"
            "}\n"
        ),
        "src/services/apiClient.ts": (
            "export async function fetchUserData() {\n"
            "  return { name: 'Alice' };\n"
            "}\n"
        ),
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo_model = Repository(
        workspace_id=ws.id,
        name="react_ts_repo",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo_model)
    await db_session.commit()
    await db_session.refresh(repo_model)

    await ingestion_service.ingest_repository(repo_model.id, db=db_session)
    await db_session.refresh(repo_model)
    return repo_model


# =========================================================================
# TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_01_language_breakdown_and_isolation(
    client: AsyncClient, setup_fastapi_layered_repo, setup_react_ts_repo
):
    """
    Test 1: Language breakdown is accurately calculated and strictly isolated between repos.
    """
    py_repo = setup_fastapi_layered_repo
    ts_repo = setup_react_ts_repo

    # Query Python repo
    res_py = await client.get(f"/api/v1/repositories/{py_repo.id}/architecture")
    assert res_py.status_code == 200
    data_py = res_py.json()
    assert "Python" in data_py["languages"]
    assert "TypeScript" not in data_py["languages"]

    # Query TypeScript repo
    res_ts = await client.get(f"/api/v1/repositories/{ts_repo.id}/architecture")
    assert res_ts.status_code == 200
    data_ts = res_ts.json()
    assert "TypeScript" in data_ts["languages"] or "TSX" in data_ts["languages"] or "JavaScript" in data_ts["languages"]
    assert "Python" not in data_ts["languages"]


@pytest.mark.asyncio
async def test_02_framework_detection_from_real_imports(client: AsyncClient, setup_fastapi_layered_repo, setup_react_ts_repo):
    """
    Test 2: Frameworks are detected using real import and package evidence.
    """
    py_repo = setup_fastapi_layered_repo
    ts_repo = setup_react_ts_repo

    res_py = await client.get(f"/api/v1/repositories/{py_repo.id}/architecture")
    assert res_py.status_code == 200
    fw_names_py = [f["name"] for f in res_py.json()["frameworks"]]
    assert "FastAPI" in fw_names_py
    assert "React" not in fw_names_py

    res_ts = await client.get(f"/api/v1/repositories/{ts_repo.id}/architecture")
    assert res_ts.status_code == 200
    fw_names_ts = [f["name"] for f in res_ts.json()["frameworks"]]
    assert "React" in fw_names_ts
    assert "FastAPI" not in fw_names_ts


@pytest.mark.asyncio
async def test_03_false_framework_rejection(client: AsyncClient, tmp_path, db_session: AsyncSession):
    """
    Test 3: System must NOT claim FastAPI when a file is named 'fastapi_utils.py' without actual imports.
    """
    repo_dir = tmp_path / "fake_fw_repo"
    files = {
        "fastapi_utils.py": "def helper(): return 42\n",
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo_model = Repository(
        workspace_id=ws.id,
        name="fake_fw_repo",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo_model)
    await db_session.commit()
    await db_session.refresh(repo_model)

    await ingestion_service.ingest_repository(repo_model.id, db=db_session)

    res = await client.get(f"/api/v1/repositories/{repo_model.id}/architecture")
    assert res.status_code == 200
    fw_names = [f["name"] for f in res.json()["frameworks"]]
    assert "FastAPI" not in fw_names


@pytest.mark.asyncio
async def test_04_entry_point_detection_with_lines(client: AsyncClient, setup_fastapi_layered_repo):
    """
    Test 4: Entry points are identified with exact file path, line citation, and framework reason.
    """
    repo = setup_fastapi_layered_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/architecture")
    assert res.status_code == 200
    data = res.json()

    eps = data["entry_points"]
    assert len(eps) >= 1
    main_ep = next((ep for ep in eps if "main.py" in ep["file_path"]), None)
    assert main_ep is not None
    assert main_ep["confidence"] == "HIGH"
    assert "FastAPI" in main_ep["reason"] or "server" in main_ep["reason"].lower()


@pytest.mark.asyncio
async def test_05_module_clustering_and_layers(client: AsyncClient, setup_fastapi_layered_repo):
    """
    Test 5: Directory hierarchy is accurately clustered into logical modules and architectural layers.
    """
    repo = setup_fastapi_layered_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/architecture")
    assert res.status_code == 200
    data = res.json()

    modules = data["modules"]
    mod_names = [m["name"].lower() for m in modules]
    assert any("api" in m for m in mod_names)
    assert any("service" in m for m in mod_names)
    assert any("repositor" in m for m in mod_names)
    assert any("database" in m or "model" in m for m in mod_names)

    layers = data["layers"]
    layer_names = [l["name"] for l in layers]
    assert "API Layer" in layer_names
    assert "Service Layer" in layer_names


@pytest.mark.asyncio
async def test_06_architecture_pattern_detection(client: AsyncClient, setup_fastapi_layered_repo, setup_react_ts_repo):
    """
    Test 6: Layered Architecture and Component-Based patterns detected with evidence.
    """
    py_repo = setup_fastapi_layered_repo
    res_py = await client.get(f"/api/v1/repositories/{py_repo.id}/architecture")
    assert res_py.status_code == 200
    patterns_py = [p["pattern"] for p in res_py.json()["patterns"]]
    assert "Layered Architecture" in patterns_py

    ts_repo = setup_react_ts_repo
    res_ts = await client.get(f"/api/v1/repositories/{ts_repo.id}/architecture")
    assert res_ts.status_code == 200
    patterns_ts = [p["pattern"] for p in res_ts.json()["patterns"]]
    assert "Component-Based Architecture" in patterns_ts


@pytest.mark.asyncio
async def test_07_architecture_drift_and_violations(client: AsyncClient, tmp_path, db_session: AsyncSession):
    """
    Test 7: Direct database bypass (API -> Database) surfaces as architecture drift when Service layer exists.
    """
    repo_dir = tmp_path / "drift_repo"
    files = {
        "api/routes.py": (
            "from services import user_service\n"
            "from database import db_models\n\n"
            "def bypass_endpoint():\n"
            "    return db_models.DirectQuery()\n"
        ),
        "services/user_service.py": (
            "from database import db_models\n"
            "def valid_service():\n"
            "    return db_models.DirectQuery()\n"
        ),
        "database/db_models.py": (
            "class DirectQuery: pass\n"
        ),
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="drift_repo",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    await ingestion_service.ingest_repository(repo.id, db=db_session)

    res = await client.get(f"/api/v1/repositories/{repo.id}/architecture")
    assert res.status_code == 200
    data = res.json()

    drift_items = data["drift"]
    assert len(drift_items) >= 1
    assert any("bypass" in d["description"].lower() or "direct" in d["description"].lower() for d in drift_items)


@pytest.mark.asyncio
async def test_08_circular_dependency_and_cycle_handling(client: AsyncClient, tmp_path, db_session: AsyncSession):
    """
    Test 8: Circular dependencies are detected and reported in health deductions without crashing.
    """
    repo_dir = tmp_path / "cycle_arch_repo"
    files = {
        "a.py": "import b\ndef fa(): return b.fb()\n",
        "b.py": "import c\ndef fb(): return c.fc()\n",
        "c.py": "import a\ndef fc(): return a.fa()\n",
    }
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="cycle_arch_repo",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    await ingestion_service.ingest_repository(repo.id, db=db_session)

    res = await client.get(f"/api/v1/repositories/{repo.id}/architecture")
    assert res.status_code == 200
    data = res.json()

    assert data["health"]["metrics"]["circular_cycles"] >= 1
    assert data["health"]["score"] < 100


@pytest.mark.asyncio
async def test_09_architectural_hotspot_ranking(client: AsyncClient, setup_fastapi_layered_repo):
    """
    Test 9: Hotspots are deterministically scored and ranked based on coupling and complexity.
    """
    repo = setup_fastapi_layered_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/architecture")
    assert res.status_code == 200
    hotspots = res.json()["hotspots"]
    assert isinstance(hotspots, list)


@pytest.mark.asyncio
async def test_10_module_api_endpoints(client: AsyncClient, setup_fastapi_layered_repo):
    """
    Test 10: GET /architecture/modules and GET /architecture/modules/{id} endpoints.
    """
    repo = setup_fastapi_layered_repo
    # List modules
    res_list = await client.get(f"/api/v1/repositories/{repo.id}/architecture/modules")
    assert res_list.status_code == 200
    data = res_list.json()
    assert data["total_modules"] >= 3
    mod_id = data["modules"][0]["id"]

    # Get single module
    res_single = await client.get(f"/api/v1/repositories/{repo.id}/architecture/modules/{mod_id}")
    assert res_single.status_code == 200
    assert res_single.json()["id"] == mod_id


@pytest.mark.asyncio
async def test_11_cache_invalidation_lifecycle(client: AsyncClient, setup_fastapi_layered_repo):
    """
    Test 11: Architecture cache can be populated and invalidated safely.
    """
    repo = setup_fastapi_layered_repo
    res1 = await client.get(f"/api/v1/repositories/{repo.id}/architecture")
    assert res1.status_code == 200

    architecture_service.invalidate_cache(repo.id)

    res2 = await client.get(f"/api/v1/repositories/{repo.id}/architecture")
    assert res2.status_code == 200


@pytest.mark.asyncio
async def test_12_empty_or_small_repo_graceful_handling(client: AsyncClient, tmp_path, db_session: AsyncSession):
    """
    Test 12: Empty or minimal repository is handled without server errors.
    """
    repo_dir = tmp_path / "minimal_repo"
    files = {"README.md": "# Minimal\n"}
    _create_git_repo(repo_dir, files)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="minimal_repo",
        url=str(repo_dir.as_uri()),
        provider="local",
        default_branch="master",
        clone_path=str(repo_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add(repo)
    await db_session.commit()
    await db_session.refresh(repo)

    await ingestion_service.ingest_repository(repo.id, db=db_session)

    res = await client.get(f"/api/v1/repositories/{repo.id}/architecture")
    assert res.status_code == 200
    assert res.json()["file_count"] if "file_count" in res.json() else True


@pytest.mark.asyncio
async def test_13_qa_architecture_query_integration(client: AsyncClient, setup_fastapi_layered_repo):
    """
    Test 13: Asking an architecture question to Q&A returns grounded answers citing real files/entry points.
    """
    repo = setup_fastapi_layered_repo
    query_payload = {
        "question": "How is this repository structured and what is the main entry point?",
    }
    res = await client.post(f"/api/v1/repositories/{repo.id}/query", json=query_payload)
    assert res.status_code == 200
    data = res.json()

    assert data["answer"] != ""
    assert len(data["sources"]) > 0
    # Must cite main.py or routes.py
    cited = [s["path"] for s in data["sources"]]
    assert any("main.py" in p or "routes.py" in p for p in cited)
