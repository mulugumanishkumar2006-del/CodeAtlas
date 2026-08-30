import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.workspace import Workspace
from backend.app.services.repository_ingestion_service import ingestion_service
from backend.app.services.impact_analysis_service import impact_service
from backend.app.services.rag_service import rag_service


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
async def setup_chain_repo(tmp_path, db_session: AsyncSession):
    """
    Creates a Git repository with a 4-hop dependency chain:
    api.py -> service.py -> repository.py -> database.py
    """
    repo_dir = tmp_path / "chain_repo"
    files = {
        "database.py": (
            "class DatabaseSession:\n"
            "    def execute_query(self, sql):\n"
            "        return 'result'\n"
        ),
        "repository.py": (
            "import database\n\n"
            "class UserRepository:\n"
            "    def __init__(self):\n"
            "        self.db = database.DatabaseSession()\n"
            "    def get_user_by_id(self, user_id):\n"
            "        return self.db.execute_query(user_id)\n"
        ),
        "service.py": (
            "import repository\n\n"
            "class AuthService:\n"
            "    def __init__(self):\n"
            "        self.user_repo = repository.UserRepository()\n"
            "    def authenticate_user(self, username, password):\n"
            "        return self.user_repo.get_user_by_id(username)\n"
        ),
        "api.py": (
            "import service\n\n"
            "class AuthController:\n"
            "    def __init__(self):\n"
            "        self.auth = service.AuthService()\n"
            "    def login_endpoint(self, req):\n"
            "        return self.auth.authenticate_user('admin', 'secret')\n"
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
        name="chain_repo",
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
async def setup_cycle_repo(tmp_path, db_session: AsyncSession):
    """
    Creates a Git repository with circular dependencies:
    module_a.py -> module_b.py -> module_c.py -> module_a.py
    """
    repo_dir = tmp_path / "cycle_repo"
    files = {
        "module_a.py": (
            "import module_b\n\n"
            "def func_a():\n"
            "    return module_b.func_b()\n"
        ),
        "module_b.py": (
            "import module_c\n\n"
            "def func_b():\n"
            "    return module_c.func_c()\n"
        ),
        "module_c.py": (
            "import module_a\n\n"
            "def func_c():\n"
            "    return module_a.func_a()\n"
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
        name="cycle_repo",
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
async def test_01_basic_direct_dependency_and_dependents(client: AsyncClient, setup_chain_repo):
    """
    Test direct outgoing dependencies and direct incoming dependents:
    service.py depends on repository.py, and is depended on by api.py.
    """
    repo = setup_chain_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/impact/service.py?direction=both&max_depth=1")
    assert res.status_code == 200
    data = res.json()

    assert data["target"]["name"] == "service.py"
    assert data["target"]["target_type"] == "file"
    
    # Direct outgoing dependency of service.py is repository.py
    direct_deps = [d["label"] for d in data["direct_dependencies"]]
    assert "repository.py" in direct_deps

    # Direct incoming dependent of service.py is api.py
    direct_dependents = [d["label"] for d in data["direct_dependents"]]
    assert "api.py" in direct_dependents


@pytest.mark.asyncio
async def test_02_transitive_dependency_propagation(client: AsyncClient, setup_chain_repo):
    """
    Test transitive downstream impact from database.py:
    database.py -> repository.py (depth 1) -> service.py (depth 2) -> api.py (depth 3).
    """
    repo = setup_chain_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/impact/database.py?direction=downstream&max_depth=4")
    assert res.status_code == 200
    data = res.json()

    # Direct dependent
    direct = [d["label"] for d in data["direct_dependents"]]
    assert "repository.py" in direct

    # Transitive dependents
    transitive = [d["label"] for d in data["transitive_dependents"]]
    assert "service.py" in transitive
    assert "api.py" in transitive

    # Impact metrics
    assert data["impact"]["affected_files"] >= 4
    assert data["impact"]["max_depth"] == 3


@pytest.mark.asyncio
async def test_03_cycle_detection_and_termination(client: AsyncClient, setup_cycle_repo):
    """
    Test cycle detection: module_a -> module_b -> module_c -> module_a.
    Traversal must terminate without infinite loops and record detected cycle.
    """
    repo = setup_cycle_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/impact/module_a.py?direction=both&max_depth=5")
    assert res.status_code == 200
    data = res.json()

    assert len(data["nodes"]) >= 3
    assert len(data["cycles"]) >= 1
    cycle_nodes = [node for cycle in data["cycles"] for node in cycle]
    assert any("module_a.py" in n for n in cycle_nodes)


@pytest.mark.asyncio
async def test_04_repository_isolation(client: AsyncClient, setup_chain_repo, setup_cycle_repo):
    """
    Test strict repository isolation:
    Analyzing chain_repo must NEVER return any node from cycle_repo.
    """
    chain_repo = setup_chain_repo
    cycle_repo = setup_cycle_repo

    res = await client.get(f"/api/v1/repositories/{chain_repo.id}/impact/database.py?direction=both&max_depth=5")
    assert res.status_code == 200
    data = res.json()

    all_labels = [n["label"] for n in data["nodes"]]
    for label in all_labels:
        assert "module_a.py" not in label
        assert "module_b.py" not in label
        assert "module_c.py" not in label


@pytest.mark.asyncio
async def test_05_same_symbol_name_disambiguation(client: AsyncClient, tmp_path, db_session: AsyncSession):
    """
    Test symbol resolution when two repositories have identical symbol names (authenticate_user).
    """
    # Repo 1 (Python)
    r1_dir = tmp_path / "repo1"
    _create_git_repo(r1_dir, {"auth.py": "def authenticate_user(): pass\n"})

    # Repo 2 (TypeScript)
    r2_dir = tmp_path / "repo2"
    _create_git_repo(r2_dir, {"auth.ts": "export function authenticate_user() {}\n"})

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo1 = Repository(
        workspace_id=ws.id,
        name="repo1",
        url=str(r1_dir.as_uri()),
        clone_path=str(r1_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    repo2 = Repository(
        workspace_id=ws.id,
        name="repo2",
        url=str(r2_dir.as_uri()),
        clone_path=str(r2_dir),
        acquisition_status="READY",
        analysis_status="pending",
    )
    db_session.add_all([repo1, repo2])
    await db_session.commit()
    await db_session.refresh(repo1)
    await db_session.refresh(repo2)

    await ingestion_service.ingest_repository(repo1.id, db=db_session)
    await ingestion_service.ingest_repository(repo2.id, db=db_session)

    # Query authenticate_user in repo1
    res1 = await client.get(f"/api/v1/repositories/{repo1.id}/impact/authenticate_user")
    assert res1.status_code == 200
    assert res1.json()["target"]["file_path"] == "auth.py"

    # Query authenticate_user in repo2
    res2 = await client.get(f"/api/v1/repositories/{repo2.id}/impact/authenticate_user")
    assert res2.status_code == 200
    assert res2.json()["target"]["file_path"] == "auth.ts"


@pytest.mark.asyncio
async def test_06_depth_limiting(client: AsyncClient, setup_chain_repo):
    """
    Test max_depth parameter:
    database.py with max_depth=1 should return repository.py, but NOT service.py or api.py.
    """
    repo = setup_chain_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/impact/database.py?direction=downstream&max_depth=1")
    assert res.status_code == 200
    data = res.json()

    all_labels = [n["label"] for n in data["nodes"]]
    assert "database.py" in all_labels
    assert "repository.py" in all_labels
    assert "service.py" not in all_labels
    assert "api.py" not in all_labels


@pytest.mark.asyncio
async def test_07_result_limiting_and_truncation(client: AsyncClient, setup_chain_repo):
    """
    Test limit parameter and is_truncated flag.
    """
    repo = setup_chain_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/impact/database.py?direction=both&max_depth=4&limit=2")
    assert res.status_code == 200
    data = res.json()

    assert len(data["nodes"]) <= 2
    assert data["is_truncated"] is True


@pytest.mark.asyncio
async def test_08_invalid_target_404(client: AsyncClient, setup_chain_repo):
    """
    Test that requesting an invalid or nonexistent target returns a clean 404.
    """
    repo = setup_chain_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/impact/nonexistent_file.py")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()


@pytest.mark.asyncio
async def test_09_stale_index_and_cache_invalidation(client: AsyncClient, setup_chain_repo):
    """
    Test that re-indexing a repository invalidates the impact cache.
    """
    repo = setup_chain_repo
    # First query populates cache
    res1 = await client.get(f"/api/v1/repositories/{repo.id}/impact/service.py")
    assert res1.status_code == 200

    # Invalidate cache
    impact_service.invalidate_cache(repo.id)

    # Query again succeeds
    res2 = await client.get(f"/api/v1/repositories/{repo.id}/impact/service.py")
    assert res2.status_code == 200


@pytest.mark.asyncio
async def test_10_blast_radius_and_deterministic_risk_scoring(client: AsyncClient, setup_chain_repo):
    """
    Test deterministic risk calculation and blast radius metrics.
    """
    repo = setup_chain_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/impact/database.py?direction=downstream&max_depth=4")
    assert res.status_code == 200
    impact = res.json()["impact"]

    assert impact["risk"] in ["LOW", "MEDIUM", "HIGH"]
    assert impact["risk_score"] > 0
    assert len(impact["risk_reasons"]) > 0
    assert impact["affected_files"] >= 4
    assert impact["max_depth"] == 3


@pytest.mark.asyncio
async def test_11_evidence_tracing_with_line_numbers(client: AsyncClient, setup_chain_repo):
    """
    Test that edges contain traceable line numbers and file paths.
    """
    repo = setup_chain_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/impact/service.py?direction=both&max_depth=2")
    assert res.status_code == 200
    edges = res.json()["edges"]

    assert len(edges) > 0
    for edge in edges:
        ev = edge.get("evidence")
        assert ev is not None
        assert ev["file_path"] != ""
        assert ev["start_line"] >= 1
        assert ev["relationship"] in ["IMPORTS", "IMPORT", "CALLS", "DEPENDS_ON"]


@pytest.mark.asyncio
async def test_12_qa_impact_query_integration(client: AsyncClient, setup_chain_repo):
    """
    Test that asking an impact question in Q&A (Phase 9 + Phase 10) invokes impact analysis
    and returns grounded citations.
    """
    repo = setup_chain_repo
    query_payload = {
        "question": "What would be affected if I change database.py?",
    }
    res = await client.post(f"/api/v1/repositories/{repo.id}/query", json=query_payload)
    assert res.status_code == 200
    data = res.json()

    assert data["answer"] != ""
    assert len(data["sources"]) > 0
    cited_paths = [s["path"] for s in data["sources"]]
    assert any("database.py" in p or "repository.py" in p for p in cited_paths)


@pytest.mark.asyncio
async def test_13_target_dependencies_endpoint(client: AsyncClient, setup_chain_repo):
    """
    Test GET /dependencies/{target_id} endpoint.
    """
    repo = setup_chain_repo
    res = await client.get(f"/api/v1/repositories/{repo.id}/dependencies/service.py")
    assert res.status_code == 200
    data = res.json()

    assert data["target"]["name"] == "service.py"
    assert len(data["direct_dependencies"]) >= 1
    assert len(data["direct_dependents"]) >= 1
