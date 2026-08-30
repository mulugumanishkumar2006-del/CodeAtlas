import pytest
import subprocess
from pathlib import Path
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.repository import Repository
from backend.app.models.workspace import Workspace
from backend.app.services.repository_ingestion_service import ingestion_service
from backend.app.services.git_history_service import git_history_service, GitHistoryService


def _create_git_repo_with_history(path: Path):
    path.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "Alice Dev"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "alice@example.com"], cwd=str(path), check=True, capture_output=True)

    # Commit 1: Initial feature by Alice
    f_auth = path / "services" / "auth.py"
    f_auth.parent.mkdir(parents=True, exist_ok=True)
    f_auth.write_text("def authenticate():\n    return True\n", encoding="utf-8")
    subprocess.run(["git", "add", "."], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "commit", "-m", "feat: initial authentication implementation"], cwd=str(path), check=True, capture_output=True)

    # Commit 2: Refactor by Bob
    subprocess.run(["git", "config", "user.name", "Bob Contributor"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "bob@example.com"], cwd=str(path), check=True, capture_output=True)

    f_auth.write_text("def authenticate(token):\n    if not token:\n        return False\n    return True\n", encoding="utf-8")
    f_pay = path / "services" / "payment.py"
    f_pay.write_text("def process_payment(amount):\n    return amount > 0\n", encoding="utf-8")
    subprocess.run(["git", "add", "."], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "commit", "-m", "refactor: add token check to auth and create payment service"], cwd=str(path), check=True, capture_output=True)

    # Commit 3: Fix by Alice
    subprocess.run(["git", "config", "user.name", "Alice Dev"], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "alice@example.com"], cwd=str(path), check=True, capture_output=True)

    f_auth.write_text("def authenticate(token):\n    # Fix auth bug\n    if not token or len(token) < 5:\n        return False\n    return True\n", encoding="utf-8")
    subprocess.run(["git", "add", "."], cwd=str(path), check=True, capture_output=True)
    subprocess.run(["git", "commit", "-m", "fix: resolve token length validation bug"], cwd=str(path), check=True, capture_output=True)


# =========================================================================
# UNIT TESTS
# =========================================================================

def test_01_commit_message_classification():
    """
    Test 1: Commit messages are deterministically classified.
    """
    svc = GitHistoryService()
    assert svc.classify_commit_message("fix: resolve database connection timeout") == "FIX"
    assert svc.classify_commit_message("feat: implement stripe payment webhook") == "FEATURE"
    assert svc.classify_commit_message("refactor: clean up AST parser modules") == "REFACTOR"
    assert svc.classify_commit_message("docs: update README with setup instructions") == "DOCS"
    assert svc.classify_commit_message("test: add unit tests for user service") == "TEST"
    assert svc.classify_commit_message("perf: cache graph traversal metrics") == "PERFORMANCE"
    assert svc.classify_commit_message("sec: sanitize SQL query parameters") == "SECURITY"
    assert svc.classify_commit_message("chore: bump vite version to 5.4") == "CHORE"
    assert svc.classify_commit_message("random commit text") == "UNKNOWN"


def test_02_raw_git_commits_extraction(tmp_path):
    """
    Test 2: Commits and file diff stats are extracted from real Git repository.
    """
    repo_dir = tmp_path / "test_git_repo"
    _create_git_repo_with_history(repo_dir)

    svc = GitHistoryService()
    commits, is_shallow = svc.extract_git_commits(str(repo_dir))
    assert len(commits) == 3
    assert not is_shallow

    # Verify latest commit is at index 0 (git log order)
    latest = commits[0]
    assert "fix: resolve token length validation bug" in latest["message"]
    assert latest["category"] == "FIX"
    assert latest["author_name"] == "Alice Dev"
    assert latest["files_changed_count"] == 1


def test_03_file_churn_and_ownership_calculation(tmp_path):
    """
    Test 3: File churn (additions + deletions) and author ownership are accurately calculated.
    """
    repo_dir = tmp_path / "test_git_repo"
    _create_git_repo_with_history(repo_dir)

    svc = GitHistoryService()
    files = [
        {"id": "f_auth", "path": "services/auth.py", "language": "Python"},
        {"id": "f_pay", "path": "services/payment.py", "language": "Python"},
    ]

    analysis = svc.analyze_repository_history(
        repository_id="test_repo_1",
        clone_path=str(repo_dir),
        files=files,
    )

    assert analysis["total_commits"] == 3
    assert analysis["total_contributors"] == 2

    # Check services/auth.py metric
    auth_metric = next((fm for fm in analysis["files_metrics"] if fm["file_path"] == "services/auth.py"), None)
    assert auth_metric is not None
    assert auth_metric["total_commits"] == 3
    assert auth_metric["total_churn"] > 0
    assert auth_metric["primary_author"] == "Alice Dev"
    assert auth_metric["primary_author_ownership"] > 50.0
    assert auth_metric["unique_authors_count"] == 2


# =========================================================================
# INTEGRATION TESTS
# =========================================================================

@pytest.fixture
async def setup_history_repo_a(tmp_path, db_session: AsyncSession):
    repo_dir = tmp_path / "hist_repo_a"
    _create_git_repo_with_history(repo_dir)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="hist_repo_a",
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
    await db_session.refresh(repo)
    return repo


@pytest.fixture
async def setup_history_repo_b(tmp_path, db_session: AsyncSession):
    repo_dir = tmp_path / "hist_repo_b"
    repo_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init"], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "Single Author"], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "config", "user.email", "single@example.com"], cwd=str(repo_dir), check=True, capture_output=True)

    f_main = repo_dir / "index.ts"
    f_main.write_text("console.log('Repo B');\n", encoding="utf-8")
    subprocess.run(["git", "add", "."], cwd=str(repo_dir), check=True, capture_output=True)
    subprocess.run(["git", "commit", "-m", "feat: initial commit in repo b"], cwd=str(repo_dir), check=True, capture_output=True)

    ws_res = await db_session.execute(select(Workspace).limit(1))
    ws = ws_res.scalars().first()
    if not ws:
        ws = Workspace(name="Default Workspace", slug="default-ws")
        db_session.add(ws)
        await db_session.commit()
        await db_session.refresh(ws)

    repo = Repository(
        workspace_id=ws.id,
        name="hist_repo_b",
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
    await db_session.refresh(repo)
    return repo


@pytest.mark.asyncio
async def test_04_history_summary_endpoint(client: AsyncClient, setup_history_repo_a):
    """
    Test 4: GET /history/summary returns real Git metrics and velocity.
    """
    repo = setup_history_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/history/summary")
    assert res.status_code == 200
    data = res.json()

    assert data["repository_id"] == repo.id
    assert data["total_commits"] == 3
    assert data["total_contributors"] == 2
    assert data["total_churn"] > 0
    assert len(data["top_contributors"]) == 2
    assert any(c["author_name"] == "Alice Dev" for c in data["top_contributors"])


@pytest.mark.asyncio
async def test_05_file_evolution_list_endpoint(client: AsyncClient, setup_history_repo_a):
    """
    Test 5: GET /history/files returns sorted file churn and ownership metrics.
    """
    repo = setup_history_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/history/files?sort_by=churn")
    assert res.status_code == 200
    data = res.json()

    assert data["total"] >= 2
    top_file = data["files"][0]
    assert "services/auth.py" in top_file["file_path"]
    assert top_file["total_commits"] == 3
    assert top_file["primary_author"] == "Alice Dev"


@pytest.mark.asyncio
async def test_06_commits_list_and_detail(client: AsyncClient, setup_history_repo_a):
    """
    Test 6: GET /commits and GET /commits/{sha} return real commit information.
    """
    repo = setup_history_repo_a
    res = await client.get(f"/api/v1/repositories/{repo.id}/commits")
    assert res.status_code == 200
    data = res.json()

    assert data["total"] == 3
    first_sha = data["commits"][0]["commit_sha"]

    res_detail = await client.get(f"/api/v1/repositories/{repo.id}/commits/{first_sha}")
    assert res_detail.status_code == 200
    detail = res_detail.json()["commit"]
    assert detail["commit_sha"] == first_sha
    assert len(detail["file_changes"]) > 0


@pytest.mark.asyncio
async def test_07_repository_isolation_and_switching(
    client: AsyncClient, setup_history_repo_a, setup_history_repo_b
):
    """
    Test 7: Repository isolation: Repo A commits never leak into Repo B.
    """
    repo_a = setup_history_repo_a
    repo_b = setup_history_repo_b

    # Query A
    res_a = await client.get(f"/api/v1/repositories/{repo_a.id}/history/summary")
    assert res_a.status_code == 200
    assert res_a.json()["total_commits"] == 3
    assert res_a.json()["total_contributors"] == 2

    # Query B
    res_b = await client.get(f"/api/v1/repositories/{repo_b.id}/history/summary")
    assert res_b.status_code == 200
    assert res_b.json()["total_commits"] == 1
    assert res_b.json()["total_contributors"] == 1
    assert res_b.json()["top_contributors"][0]["author_name"] == "Single Author"

    # Query A again
    res_a2 = await client.get(f"/api/v1/repositories/{repo_a.id}/history/summary")
    assert res_a2.status_code == 200
    assert res_a2.json()["total_commits"] == 3


@pytest.mark.asyncio
async def test_08_qa_history_query_integration(client: AsyncClient, setup_history_repo_a):
    """
    Test 8: Asking evolution and contributor questions in Q&A returns grounded historical evidence.
    """
    repo = setup_history_repo_a
    query_payload = {
        "question": "Who has contributed to the authentication service and how has it changed?",
    }
    res = await client.post(f"/api/v1/repositories/{repo.id}/query", json=query_payload)
    assert res.status_code == 200
    data = res.json()

    assert data["answer"] != ""
    assert len(data["sources"]) > 0
    # Must cite auth.py
    cited = [s["path"] for s in data["sources"]]
    assert any("auth.py" in p for p in cited)
