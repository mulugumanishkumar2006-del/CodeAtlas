import pytest
import uuid
import subprocess
from pathlib import Path
from typing import Dict, Any

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.workspace import Workspace
from backend.app.models.repository import Repository
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.simulation import Simulation
from backend.app.services.future_impact_simulator_service import future_impact_simulator_service


async def create_test_workspace(db: AsyncSession) -> Workspace:
    ws = Workspace(
        id=f"ws-{uuid.uuid4().hex[:8]}",
        name=f"Workspace-{uuid.uuid4().hex[:4]}",
        slug=f"ws-slug-{uuid.uuid4().hex[:6]}",
    )
    db.add(ws)
    await db.flush()
    return ws


def setup_git_repo_for_simulation(repo_dir: Path) -> Dict[str, str]:
    """Sets up a real git repo with callers, services, and tests for simulation tests."""
    repo_dir.mkdir(parents=True, exist_ok=True)

    def run_git(*args):
        res = subprocess.run(
            ["git"] + list(args),
            cwd=str(repo_dir),
            capture_output=True,
            text=True,
            check=True,
        )
        return res.stdout.strip()

    run_git("init")
    run_git("config", "user.name", "CodeAtlas Tester")
    run_git("config", "user.email", "tester@codeatlas.dev")

    src_dir = repo_dir / "src"
    tests_dir = repo_dir / "tests"
    src_dir.mkdir(parents=True, exist_ok=True)
    tests_dir.mkdir(parents=True, exist_ok=True)

    # 1. Database service (Target for remove/change)
    db_file = src_dir / "database.py"
    db_file.write_text(
        "class DatabaseService:\n"
        "    def query(self, sql: str):\n"
        "        return []\n"
        "    def connect(self):\n"
        "        return True\n"
    )

    # 2. User service calling DatabaseService
    user_file = src_dir / "user_service.py"
    user_file.write_text(
        "from src.database import DatabaseService\n\n"
        "class UserService:\n"
        "    def __init__(self):\n"
        "        self.db = DatabaseService()\n"
        "    def get_user(self, user_id: str):\n"
        "        return self.db.query(f'SELECT * FROM users WHERE id={user_id}')\n"
    )

    # 3. Test file verifying UserService and DatabaseService
    test_file = tests_dir / "test_user_service.py"
    test_file.write_text(
        "from src.user_service import UserService\n\n"
        "def test_get_user():\n"
        "    svc = UserService()\n"
        "    assert svc.get_user('1') == []\n"
    )

    run_git("add", ".")
    run_git("commit", "-m", "Initial commit: services and tests")
    c1 = run_git("rev-parse", "HEAD")

    # Second commit to generate churn history on database.py
    db_file.write_text(
        "class DatabaseService:\n"
        "    def query(self, sql: str):\n"
        "        # Added connection pooling check\n"
        "        return []\n"
        "    def connect(self):\n"
        "        return True\n"
        "    def close(self):\n"
        "        pass\n"
    )
    run_git("add", ".")
    run_git("commit", "-m", "Enhance DatabaseService with close method")
    c2 = run_git("rev-parse", "HEAD")

    return {"c1": c1, "c2": c2}


async def seed_simulation_db(db: AsyncSession, repo_id: str, ws_id: str):
    """Populates File, Symbol, and Dependency records for repository testing."""
    f_db = File(
        id=f"file-db-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        path="src/database.py",
        language="python",
        line_count=10,
        size_bytes=200,
        content_hash="hash-db",
    )
    f_user = File(
        id=f"file-user-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        path="src/user_service.py",
        language="python",
        line_count=12,
        size_bytes=240,
        content_hash="hash-user",
    )
    f_test = File(
        id=f"file-test-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        path="tests/test_user_service.py",
        language="python",
        line_count=10,
        size_bytes=180,
        content_hash="hash-test",
    )
    db.add_all([f_db, f_user, f_test])
    await db.flush()

    s_db = Symbol(
        id=f"sym-db-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        file_id=f_db.id,
        name="DatabaseService",
        symbol_type="class",
        start_line=1,
        end_line=9,
        qualified_name="src.database.DatabaseService",
    )
    s_query = Symbol(
        id=f"sym-query-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        file_id=f_db.id,
        name="query",
        symbol_type="method",
        start_line=2,
        end_line=4,
        qualified_name="src.database.DatabaseService.query",
    )
    s_user = Symbol(
        id=f"sym-user-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        file_id=f_user.id,
        name="UserService",
        symbol_type="class",
        start_line=3,
        end_line=8,
        qualified_name="src.user_service.UserService",
    )
    s_get = Symbol(
        id=f"sym-get-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        file_id=f_user.id,
        name="get_user",
        symbol_type="method",
        start_line=6,
        end_line=8,
        qualified_name="src.user_service.UserService.get_user",
    )
    db.add_all([s_db, s_query, s_user, s_get])
    await db.flush()

    d_user_db = Dependency(
        id=f"dep-u-db-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        source_file_id=f_user.id,
        target_file_id=f_db.id,
        name="src.database",
        dependency_type="internal",
        metadata_json={"line": 1, "symbol": "DatabaseService"},
    )
    d_test_user = Dependency(
        id=f"dep-t-u-{uuid.uuid4().hex[:6]}",
        repository_id=repo_id,
        source_file_id=f_test.id,
        target_file_id=f_user.id,
        name="src.user_service",
        dependency_type="internal",
        metadata_json={"line": 1, "symbol": "UserService"},
    )
    db.add_all([d_user_db, d_test_user])
    await db.commit()

    return {"f_db": f_db, "f_user": f_user, "f_test": f_test, "s_db": s_db}


# =========================================================================
# Unit & Service Tests: Phase 22 Future Impact Simulator
# =========================================================================

@pytest.mark.asyncio
async def test_intent_parser_operations():
    """Validates that natural language proposals are accurately parsed into canonical operations."""
    # 1. Remove operation
    intent1 = future_impact_simulator_service.parse_simulation_intent("What happens if I remove src/database.py?")
    assert intent1.operation == "REMOVE"
    assert "database.py" in intent1.target_identifier
    assert not intent1.requires_clarification

    # 2. Rename operation
    intent2 = future_impact_simulator_service.parse_simulation_intent("Rename DatabaseService to StorageEngine")
    assert intent2.operation == "RENAME"
    assert "DatabaseService" in intent2.target_identifier
    assert intent2.parameters.get("new_name") == "StorageEngine"

    # 3. Signature change
    intent3 = future_impact_simulator_service.parse_simulation_intent("Change signature of DatabaseService.query to accept timeout")
    assert intent3.operation == "SIGNATURE_CHANGE"

    # 4. Dependency replace
    intent4 = future_impact_simulator_service.parse_simulation_intent("Replace package requests with httpx")
    assert intent4.operation == "DEPENDENCY_REPLACE"
    assert intent4.target_identifier == "requests"
    assert intent4.parameters.get("replacement") == "httpx"

    # 5. Ambiguous query requires clarification
    intent5 = future_impact_simulator_service.parse_simulation_intent("What happens if I modify it?")
    assert intent5.requires_clarification
    assert intent5.clarification_prompt is not None


@pytest.mark.asyncio
async def test_run_simulation_remove_file(db_session: AsyncSession, tmp_path: Path):
    """Validates full static simulation of removing a core service file."""
    ws = await create_test_workspace(db_session)
    repo_dir = tmp_path / "repo_sim_1"
    commits = setup_git_repo_for_simulation(repo_dir)

    repo = Repository(
        id=f"repo-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="RepoSim1",
        url="https://github.com/test/reposim1",
        clone_path=str(repo_dir),
        analysis_status="completed",
        current_commit_sha=commits["c2"],
        metadata_json={"head_commit_hash": commits["c2"]},
    )
    db_session.add(repo)
    await db_session.commit()

    await seed_simulation_db(db_session, repo.id, ws.id)

    # Run simulation: Remove database.py
    sim_result = await future_impact_simulator_service.run_simulation(
        db=db_session,
        repository_id=repo.id,
        proposed_change="What happens if I remove src/database.py?",
    )

    assert sim_result["repository_id"] == repo.id
    assert sim_result["operation"] == "REMOVE"
    assert sim_result["confidence"] in ["HIGH", "MEDIUM"]
    assert sim_result["target"] is not None
    assert "database.py" in sim_result["target"]["name"]

    # Check Epistemic Triad
    consequences = sim_result["consequences"]
    assert len(consequences["known"]) > 0, "Known consequences must be populated"
    # Expected known consequence: user_service.py imports or calls database.py
    assert any("user_service" in k.lower() or "broken" in k.lower() for k in consequences["known"])

    assert len(consequences["predicted"]) > 0, "Predicted consequences must be populated"
    assert len(consequences["unknown"]) > 0, "Unknown consequences must be populated"

    # Check Before/After Model
    b_after = sim_result["before_after"]
    assert b_after is not None
    assert len(b_after["current_nodes"]) > 0
    assert len(b_after["simulated_nodes"]) > 0
    # The target node should be marked REMOVED in simulated nodes
    sim_target_node = next((n for n in b_after["simulated_nodes"] if "database" in n["label"].lower()), None)
    assert sim_target_node is not None
    assert sim_target_node["status"] == "REMOVED"

    # Check Recommended Validation Checklist
    validations = sim_result["recommended_validation"]
    assert len(validations) >= 2
    assert any("test" in v.lower() or "caller" in v.lower() for v in validations)


@pytest.mark.asyncio
async def test_simulation_persistence_lifecycle(db_session: AsyncSession, tmp_path: Path):
    """Validates persisting, listing, retrieving, and deleting simulation records."""
    ws = await create_test_workspace(db_session)
    repo_dir = tmp_path / "repo_sim_2"
    commits = setup_git_repo_for_simulation(repo_dir)

    repo = Repository(
        id=f"repo-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="RepoSim2",
        url="https://github.com/test/reposim2",
        clone_path=str(repo_dir),
        analysis_status="completed",
        current_commit_sha=commits["c2"],
    )
    db_session.add(repo)
    await db_session.commit()
    await seed_simulation_db(db_session, repo.id, ws.id)

    # 1. Create and Save Simulation
    created = await future_impact_simulator_service.create_and_save_simulation(
        db=db_session,
        repository_id=repo.id,
        proposed_change="Rename DatabaseService to StorageEngine",
    )
    sim_id = created["id"]
    assert sim_id is not None
    assert created["operation"] == "RENAME"

    # 2. List simulations for this repo
    items = await future_impact_simulator_service.list_simulations(
        db=db_session, repository_id=repo.id
    )
    assert len(items) == 1
    assert items[0].id == sim_id
    assert items[0].simulation_type == "RENAME"

    # 3. Retrieve single simulation
    fetched = await future_impact_simulator_service.get_simulation(
        db=db_session, repository_id=repo.id, simulation_id=sim_id
    )
    assert fetched is not None
    assert fetched["id"] == sim_id
    assert fetched["operation"] == "RENAME"

    # 4. Delete simulation
    deleted = await future_impact_simulator_service.delete_simulation(
        db=db_session, repository_id=repo.id, simulation_id=sim_id
    )
    assert deleted is True

    # Verify deleted
    fetched_after = await future_impact_simulator_service.get_simulation(
        db=db_session, repository_id=repo.id, simulation_id=sim_id
    )
    assert fetched_after is None


@pytest.mark.asyncio
async def test_strict_repository_isolation(db_session: AsyncSession, tmp_path: Path):
    """Ensures that simulations in Repository A cannot be accessed or listed in Repository B."""
    ws = await create_test_workspace(db_session)

    # Repo A
    dir_a = tmp_path / "repo_a"
    setup_git_repo_for_simulation(dir_a)
    repo_a = Repository(
        id=f"repo-a-{uuid.uuid4().hex[:6]}",
        workspace_id=ws.id,
        name="RepoA",
        url="https://github.com/test/repoa",
        clone_path=str(dir_a),
        analysis_status="completed",
    )
    # Repo B
    dir_b = tmp_path / "repo_b"
    setup_git_repo_for_simulation(dir_b)
    repo_b = Repository(
        id=f"repo-b-{uuid.uuid4().hex[:6]}",
        workspace_id=ws.id,
        name="RepoB",
        url="https://github.com/test/repob",
        clone_path=str(dir_b),
        analysis_status="completed",
    )
    db_session.add_all([repo_a, repo_b])
    await db_session.commit()
    await seed_simulation_db(db_session, repo_a.id, ws.id)
    await seed_simulation_db(db_session, repo_b.id, ws.id)

    # Create simulation in Repo A
    sim_a = await future_impact_simulator_service.create_and_save_simulation(
        db=db_session,
        repository_id=repo_a.id,
        proposed_change="Remove src/database.py in Repo A",
    )

    # Repo B listing should be empty
    list_b = await future_impact_simulator_service.list_simulations(
        db=db_session, repository_id=repo_b.id
    )
    assert len(list_b) == 0

    # Getting Repo A's simulation with Repo B's ID should return None
    cross_fetched = await future_impact_simulator_service.get_simulation(
        db=db_session, repository_id=repo_b.id, simulation_id=sim_a["id"]
    )
    assert cross_fetched is None

    # Deleting Repo A's simulation using Repo B's ID should fail
    cross_delete = await future_impact_simulator_service.delete_simulation(
        db=db_session, repository_id=repo_b.id, simulation_id=sim_a["id"]
    )
    assert cross_delete is False


# =========================================================================
# Integration Tests: Phase 22 REST API Endpoints
# =========================================================================

@pytest.mark.asyncio
async def test_rest_api_create_and_list_simulations(
    client: AsyncClient, db_session: AsyncSession, tmp_path: Path
):
    """Tests POST /api/v1/repositories/{id}/simulations and GET list."""
    ws = await create_test_workspace(db_session)
    repo_dir = tmp_path / "repo_api_sim"
    commits = setup_git_repo_for_simulation(repo_dir)

    repo = Repository(
        id=f"repo-api-{uuid.uuid4().hex[:6]}",
        workspace_id=ws.id,
        name="RepoApiSim",
        url="https://github.com/test/repoapisim",
        clone_path=str(repo_dir),
        analysis_status="completed",
        current_commit_sha=commits["c2"],
    )
    db_session.add(repo)
    await db_session.commit()
    await seed_simulation_db(db_session, repo.id, ws.id)

    # 1. Create Simulation via REST
    payload = {
        "proposed_change": "What happens if I remove src/database.py?",
        "operation": "REMOVE",
    }
    resp = await client.post(f"/api/v1/repositories/{repo.id}/simulations", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["operation"] == "REMOVE"
    assert data["confidence"] in ["HIGH", "MEDIUM"]
    assert "consequences" in data
    assert "known" in data["consequences"]
    assert "predicted" in data["consequences"]
    assert "unknown" in data["consequences"]
    assert "recommended_validation" in data
    sim_id = data["id"]

    # 2. List simulations via REST
    list_resp = await client.get(f"/api/v1/repositories/{repo.id}/simulations")
    assert list_resp.status_code == 200
    list_data = list_resp.json()
    assert list_data["total_simulations"] >= 1
    assert any(s["id"] == sim_id for s in list_data["simulations"])

    # 3. Get single simulation detail via REST
    get_resp = await client.get(f"/api/v1/repositories/{repo.id}/simulations/{sim_id}")
    assert get_resp.status_code == 200
    detail = get_resp.json()
    assert detail["id"] == sim_id
    assert detail["proposed_change"] == payload["proposed_change"]

    # 4. Preview simulation via POST target (without saving)
    prev_resp = await client.post(f"/api/v1/repositories/{repo.id}/simulations/target", json={
        "proposed_change": "Rename UserService to CustomerService",
        "operation": "RENAME",
    })
    assert prev_resp.status_code == 200
    prev_data = prev_resp.json()
    assert prev_data["operation"] == "RENAME"

    # 5. Delete simulation via REST
    del_resp = await client.delete(f"/api/v1/repositories/{repo.id}/simulations/{sim_id}")
    assert del_resp.status_code == 204

    # 6. Verify 404 after deletion
    get_deleted = await client.get(f"/api/v1/repositories/{repo.id}/simulations/{sim_id}")
    assert get_deleted.status_code == 404

    # 7. Verify 404 for nonexistent repository
    nonexistent_resp = await client.get("/api/v1/repositories/nonexistent-repo/simulations")
    assert nonexistent_resp.status_code == 404
