import pytest
import uuid
import subprocess
from pathlib import Path
from typing import Tuple, Dict, Any

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.models.workspace import Workspace
from backend.app.models.repository import Repository
from backend.app.models.analysis import Analysis
from backend.app.models.file import File
from backend.app.services.time_machine_service import time_machine_service


async def create_test_workspace(db: AsyncSession) -> Workspace:
    ws = Workspace(
        id=f"ws-{uuid.uuid4().hex[:8]}",
        name=f"Workspace-{uuid.uuid4().hex[:4]}",
        slug=f"ws-slug-{uuid.uuid4().hex[:6]}",
    )
    db.add(ws)
    await db.flush()
    return ws


def setup_real_git_repo(repo_dir: Path) -> Dict[str, str]:
    """
    Initializes a real Git repository with multiple commits:
    - Commit 1 (init): creates src/payment.py with process_payment() and requirements.txt
    - Commit 2 (feature): modifies process_payment(), adds refund_payment(), updates requirements.txt
    - Commit 3 (rename): renames src/payment.py to src/billing.py and adds API route
    """
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

    # Commit 1
    src_dir = repo_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    p1 = src_dir / "payment.py"
    p1.write_text(
        "class PaymentService:\n"
        "    def process_payment(self, amount: float):\n"
        "        print('Processing payment')\n"
        "        return True\n",
        encoding="utf-8",
    )

    req = repo_dir / "requirements.txt"
    req.write_text("fastapi==0.100.0\nuvicorn==0.22.0\n", encoding="utf-8")

    run_git("add", ".")
    run_git("commit", "-m", "feat: initial payment service setup")
    c1 = run_git("rev-parse", "HEAD")

    # Commit 2: Modify process_payment and add refund_payment
    p1.write_text(
        "class PaymentService:\n"
        "    def process_payment(self, amount: float):\n"
        "        print('Processing payment with fee')\n"
        "        fee = amount * 0.02\n"
        "        return amount + fee\n\n"
        "    def refund_payment(self, tx_id: str):\n"
        "        return 'refunded'\n",
        encoding="utf-8",
    )
    req.write_text("fastapi==0.100.0\nuvicorn==0.22.0\nrequests==2.31.0\n", encoding="utf-8")

    run_git("add", ".")
    run_git("commit", "-m", "feat(payment): add fee calculation and refund support")
    c2 = run_git("rev-parse", "HEAD")

    # Commit 3: Rename payment.py to billing.py and add api route
    run_git("mv", "src/payment.py", "src/billing.py")
    api_dir = repo_dir / "src" / "api"
    api_dir.mkdir(parents=True, exist_ok=True)
    api_file = api_dir / "billing_routes.py"
    api_file.write_text(
        "from src.billing import PaymentService\n\n"
        "def post_billing_charge(amount: float):\n"
        "    service = PaymentService()\n"
        "    return service.process_payment(amount)\n",
        encoding="utf-8",
    )

    run_git("add", ".")
    run_git("commit", "-m", "refactor: rename payment to billing and add billing API route")
    c3 = run_git("rev-parse", "HEAD")

    return {"c1": c1, "c2": c2, "c3": c3}


@pytest.fixture
async def git_history_env(db_session: AsyncSession, tmp_path: Path):
    """Fixture providing a configured repository with real git history."""
    repo_dir = tmp_path / "test_git_time_machine"
    commits = setup_real_git_repo(repo_dir)

    ws = await create_test_workspace(db_session)
    repo = Repository(
        id=f"repo-tm-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="TimeMachineTestRepo",
        url="https://github.com/codeatlas/time-machine-test",
        default_branch="master",
        clone_path=str(repo_dir),
        current_commit_sha=commits["c3"],
    )
    db_session.add(repo)
    await db_session.flush()

    # Add File records to DB
    f_billing = File(
        id=f"file-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        path="src/billing.py",
        language="Python",
        line_count=8,
    )
    db_session.add(f_billing)

    # Add an Analysis snapshot record
    analysis = Analysis(
        id=f"snap-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        commit_sha=commits["c2"],
        branch="master",
        status="completed",
        version=1,
        metadata_json={"file_count": 2, "symbol_count": 2},
    )
    db_session.add(analysis)
    await db_session.commit()

    return {
        "repo": repo,
        "commits": commits,
        "repo_dir": repo_dir,
        "file": f_billing,
        "analysis": analysis,
    }


# =========================================================================
# 1. HISTORICAL SNAPSHOTS TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_get_historical_snapshots(db_session: AsyncSession, git_history_env):
    """Verifies that historical snapshots combine stored analyses and git commit points."""
    repo = git_history_env["repo"]
    snapshots_data = await time_machine_service.get_historical_snapshots(db_session, repo.id)

    assert snapshots_data["repository_id"] == repo.id
    assert snapshots_data["total_snapshots"] >= 3

    hashes = [s["commit_hash"] for s in snapshots_data["snapshots"]]
    assert git_history_env["commits"]["c1"] in hashes
    assert git_history_env["commits"]["c2"] in hashes
    assert git_history_env["commits"]["c3"] in hashes

    # Verify snapshot model fields
    for s in snapshots_data["snapshots"]:
        assert "snapshot_id" in s
        assert "analysis_version" in s
        assert "status" in s
        assert "created_at" in s


# =========================================================================
# 2. FILE EVOLUTION & RENAME DETECTION TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_file_evolution_and_renames(db_session: AsyncSession, git_history_env):
    """Verifies that file evolution correctly tracks churn, authors, and detects file rename."""
    repo = git_history_env["repo"]
    commits = git_history_env["commits"]

    # Inquire about src/billing.py (which was renamed from src/payment.py)
    evolution = await time_machine_service.get_file_evolution(db_session, repo.id, "src/billing.py")

    assert evolution["file_path"] == "src/billing.py"
    assert evolution["commit_count"] >= 2
    assert "CodeAtlas Tester" in evolution["authors"]
    assert evolution["churn"] > 0
    assert evolution["total_additions"] > 0

    # First commit should be c1 (where it was created as payment.py)
    assert evolution["first_commit_hash"] == commits["c1"]
    assert evolution["last_commit_hash"] == commits["c3"]

    # Verify rename detection
    assert len(evolution["rename_history"]) >= 1
    rename = evolution["rename_history"][0]
    assert rename["from_path"] == "src/payment.py"
    assert rename["to_path"] == "src/billing.py"
    assert rename["commit_hash"] == commits["c3"]
    assert rename["similarity_score"] is not None


# =========================================================================
# 3. COMMIT DETAILS & AST SYMBOL DIFF TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_commit_details_ast_diff(db_session: AsyncSession, git_history_env):
    """Verifies commit details endpoint returns diff hunks, symbol changes, and arch changes."""
    repo = git_history_env["repo"]
    c2 = git_history_env["commits"]["c2"]

    details = await time_machine_service.get_commit_details(db_session, repo.id, c2)

    assert details["commit_hash"] == c2
    assert details["author"] == "CodeAtlas Tester"
    assert "refund" in details["message"]
    assert details["files_changed_count"] >= 1
    assert details["insertions"] > 0

    # Verify diff hunks exist
    changed_files = details["changed_files"]
    payment_file = next((f for f in changed_files if "payment.py" in (f["new_path"] or "")), None)
    assert payment_file is not None
    assert len(payment_file["hunks"]) > 0

    # Verify AST symbol mapping detected refund_payment as CREATED and process_payment as MODIFIED
    symbol_changes = details["symbol_changes"]
    sym_names = [sc["symbol_name"] for sc in symbol_changes]
    assert "refund_payment" in sym_names

    refund_sc = next(sc for sc in symbol_changes if sc["symbol_name"] == "refund_payment")
    assert refund_sc["change_type"] == "CREATED"
    assert refund_sc["is_uncertain"] is False
    assert "evidence" in refund_sc


# =========================================================================
# 4. COMMIT COMPARISON TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_commit_comparison(db_session: AsyncSession, git_history_env):
    """Verifies two-commit comparison derives file deltas, symbol deltas, deps, and APIs."""
    repo = git_history_env["repo"]
    c1 = git_history_env["commits"]["c1"]
    c3 = git_history_env["commits"]["c3"]

    comparison = await time_machine_service.compare_commits(
        db_session, repository_id=repo.id, from_commit=c1, to_commit=c3
    )

    assert comparison["from_commit"] == c1
    assert comparison["to_commit"] == c3

    # File deltas: billing_routes was added, payment was renamed to billing
    assert any("billing_routes.py" in f for f in comparison["added_files"])
    assert any(rf["from"] == "src/payment.py" and rf["to"] == "src/billing.py" for rf in comparison["renamed_files"])

    # AST symbol changes
    added_sym_names = [s["symbol_name"] for s in comparison["added_symbols"]]
    assert "refund_payment" in added_sym_names
    assert "post_billing_charge" in added_sym_names

    # Dependency changes in requirements.txt (requests added)
    assert len(comparison["dependency_changes"]) >= 1
    req_dep = comparison["dependency_changes"][0]
    assert "requirements.txt" in req_dep["manifest_file"]
    assert any("requests" in entry for entry in req_dep["added_entries"])

    # API changes
    assert len(comparison["api_changes"]) >= 1
    api_ch = comparison["api_changes"][0]
    assert "billing_routes.py" in api_ch["file_path"]

    # Architecture layer changes
    assert len(comparison["architecture_changes"]) >= 1

    # Quantitative metrics delta
    metrics = comparison["metrics_changes"]
    assert metrics["total_lines_added"] > 0
    assert metrics["symbols_added_count"] >= 2


# =========================================================================
# 5. REST API ENDPOINTS TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_api_historical_snapshots(client: AsyncClient, git_history_env):
    """Tests GET /api/v1/repositories/{repo_id}/history/snapshots."""
    repo_id = git_history_env["repo"].id
    res = await client.get(f"/api/v1/repositories/{repo_id}/history/snapshots")
    assert res.status_code == 200
    data = res.json()
    assert data["repository_id"] == repo_id
    assert len(data["snapshots"]) >= 3


@pytest.mark.asyncio
async def test_api_file_history(client: AsyncClient, git_history_env):
    """Tests GET /api/v1/repositories/{repo_id}/history/files/{file_id:path}."""
    repo_id = git_history_env["repo"].id
    file_path = "src/billing.py"

    res = await client.get(f"/api/v1/repositories/{repo_id}/history/files/{file_path}")
    assert res.status_code == 200
    data = res.json()
    assert data["file_path"] == file_path
    assert data["commit_count"] >= 2
    assert len(data["rename_history"]) >= 1


@pytest.mark.asyncio
async def test_api_commit_details(client: AsyncClient, git_history_env):
    """Tests GET /api/v1/repositories/{repo_id}/history/commits/{commit_hash}."""
    repo_id = git_history_env["repo"].id
    c2 = git_history_env["commits"]["c2"]

    res = await client.get(f"/api/v1/repositories/{repo_id}/history/commits/{c2}")
    assert res.status_code == 200
    data = res.json()
    assert data["commit_hash"] == c2
    assert data["author"] == "CodeAtlas Tester"
    assert len(data["changed_files"]) >= 1


@pytest.mark.asyncio
async def test_api_compare_commits(client: AsyncClient, git_history_env):
    """Tests POST /api/v1/repositories/{repo_id}/history/compare."""
    repo_id = git_history_env["repo"].id
    c1 = git_history_env["commits"]["c1"]
    c2 = git_history_env["commits"]["c2"]

    res = await client.post(
        f"/api/v1/repositories/{repo_id}/history/compare",
        json={"from_commit": c1, "to_commit": c2},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["from_commit"] == c1
    assert data["to_commit"] == c2
    assert len(data["added_symbols"]) >= 1


# =========================================================================
# 6. REPOSITORY ISOLATION & ERROR HANDLING TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_repository_isolation(client: AsyncClient, git_history_env):
    """Ensures cross-repository boundary and nonexistent repository access is rejected."""
    fake_repo_id = f"repo-fake-{uuid.uuid4().hex[:8]}"

    # Snapshots for fake repo
    res_snap = await client.get(f"/api/v1/repositories/{fake_repo_id}/history/snapshots")
    assert res_snap.status_code == 404

    # File evolution for fake repo
    res_file = await client.get(f"/api/v1/repositories/{fake_repo_id}/history/files/src/app.py")
    assert res_file.status_code == 404

    # Commit details for fake repo
    res_com = await client.get(f"/api/v1/repositories/{fake_repo_id}/history/commits/abcdef12")
    assert res_com.status_code == 404

    # Compare for fake repo
    res_comp = await client.post(
        f"/api/v1/repositories/{fake_repo_id}/history/compare",
        json={"from_commit": "c1", "to_commit": "c2"},
    )
    assert res_comp.status_code == 400
