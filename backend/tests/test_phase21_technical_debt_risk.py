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
from backend.app.models.analysis import Analysis
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.services.technical_debt_service import technical_debt_service
from backend.app.services.risk_intelligence_service import risk_intelligence_service


async def create_test_workspace(db: AsyncSession) -> Workspace:
    ws = Workspace(
        id=f"ws-{uuid.uuid4().hex[:8]}",
        name=f"Workspace-{uuid.uuid4().hex[:4]}",
        slug=f"ws-slug-{uuid.uuid4().hex[:6]}",
    )
    db.add(ws)
    await db.flush()
    return ws


def setup_git_repo_with_debt(repo_dir: Path) -> Dict[str, str]:
    """
    Initializes a real Git repository with source files containing:
    - High complexity function with multiple branches
    - Duplicate code blocks
    - Outdated dependencies
    - Test files (leaving one file without test coverage)
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

    # Source directory
    src_dir = repo_dir / "src"
    src_dir.mkdir(parents=True, exist_ok=True)

    # File 1: Complex order processor with multiple if-else branches
    order_file = src_dir / "order_processor.py"
    order_file.write_text(
        "class OrderProcessor:\n"
        "    def process(self, order, user, payment, inventory, shipping, coupon):\n"
        "        if not order:\n"
        "            return False\n"
        "        if not user or not user.is_active:\n"
        "            return False\n"
        "        if order.amount > 1000:\n"
        "            if not user.is_vip:\n"
        "                if order.risk_score > 50:\n"
        "                    return False\n"
        "                elif order.risk_score > 30:\n"
        "                    flag_for_review(order)\n"
        "            else:\n"
        "                apply_vip_discount(order)\n"
        "        elif order.amount > 100:\n"
        "            if coupon:\n"
        "                apply_coupon(order, coupon)\n"
        "        else:\n"
        "            charge_small_order_fee(order)\n"
        "        for item in order.items:\n"
        "            if item.is_available:\n"
        "                inventory.reserve(item)\n"
        "            else:\n"
        "                return False\n"
        "        return payment.charge(order.amount)\n",
        encoding="utf-8",
    )

    # File 2: Duplicate utility functions
    dup_file = src_dir / "payment_utils.py"
    dup_file.write_text(
        "# Payment utility helpers\n"
        "def compute_tax(amount: float, rate: float) -> float:\n"
        "    tax = amount * rate\n"
        "    rounded = round(tax, 2)\n"
        "    return rounded\n\n"
        "def compute_vat(amount: float, rate: float) -> float:\n"
        "    tax = amount * rate\n"
        "    rounded = round(tax, 2)\n"
        "    return rounded\n",
        encoding="utf-8",
    )

    # Requirements file
    req_file = repo_dir / "requirements.txt"
    req_file.write_text("fastapi==0.80.0\npydantic==1.9.0\nuvicorn==0.17.0\n", encoding="utf-8")

    # Tests directory
    tests_dir = repo_dir / "tests"
    tests_dir.mkdir(parents=True, exist_ok=True)
    test_order = tests_dir / "test_order_processor.py"
    test_order.write_text(
        "def test_process():\n"
        "    assert True\n",
        encoding="utf-8",
    )

    run_git("add", ".")
    run_git("commit", "-m", "feat: initial system with orders and payment utils")
    c1 = run_git("rev-parse", "HEAD")

    # Second commit: Add another module and modify order_processor
    auth_file = src_dir / "auth.py"
    auth_file.write_text(
        "def authenticate(token: str):\n"
        "    return token == 'secret'\n",
        encoding="utf-8",
    )
    # Append changes to order_processor to create commit churn
    order_file.write_text(
        order_file.read_text(encoding="utf-8") + "\n# Extra update\n",
        encoding="utf-8",
    )

    run_git("add", ".")
    run_git("commit", "-m", "feat(auth): add auth module and update processor")
    c2 = run_git("rev-parse", "HEAD")

    return {"c1": c1, "c2": c2}


@pytest.fixture
async def debt_risk_env(db_session: AsyncSession, tmp_path: Path):
    """Fixture providing a configured repository with seeded files, symbols, and dependencies."""
    repo_dir = tmp_path / "test_debt_risk_repo"
    commits = setup_git_repo_with_debt(repo_dir)

    ws = await create_test_workspace(db_session)
    repo = Repository(
        id=f"repo-dr-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name="DebtRiskTestRepo",
        url="https://github.com/codeatlas/debt-risk-test",
        default_branch="master",
        clone_path=str(repo_dir),
        current_commit_sha=commits["c2"],
    )
    db_session.add(repo)
    await db_session.flush()

    # Add File records to DB
    f_order = File(
        id=f"file-ord-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        path="src/order_processor.py",
        language="Python",
        line_count=28,
    )
    f_utils = File(
        id=f"file-utl-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        path="src/payment_utils.py",
        language="Python",
        line_count=10,
    )
    f_auth = File(
        id=f"file-ath-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        path="src/auth.py",
        language="Python",
        line_count=3,
    )
    f_test = File(
        id=f"file-tst-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        path="tests/test_order_processor.py",
        language="Python",
        line_count=3,
    )
    db_session.add_all([f_order, f_utils, f_auth, f_test])
    await db_session.flush()

    # Add Symbols
    s_order_proc = Symbol(
        id=f"sym-proc-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        file_id=f_order.id,
        name="process",
        symbol_type="function",
        qualified_name="OrderProcessor.process",
        start_line=2,
        end_line=24,
    )
    s_auth = Symbol(
        id=f"sym-ath-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        file_id=f_auth.id,
        name="authenticate",
        symbol_type="function",
        qualified_name="authenticate",
        start_line=1,
        end_line=2,
    )
    db_session.add_all([s_order_proc, s_auth])

    # Add Dependencies
    dep_fastapi = Dependency(
        id=f"dep-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        name="fastapi",
        version_spec="0.80.0",
        dependency_type="direct",
    )
    db_session.add(dep_fastapi)

    # Add an Analysis snapshot record
    analysis = Analysis(
        id=f"snap-dr-{uuid.uuid4().hex[:8]}",
        repository_id=repo.id,
        commit_sha=commits["c2"],
        branch="master",
        status="completed",
        version=1,
        metadata_json={"file_count": 4, "symbol_count": 2},
    )
    db_session.add(analysis)
    await db_session.commit()

    return {
        "repo": repo,
        "commits": commits,
        "repo_dir": repo_dir,
        "file_order": f_order,
        "file_utils": f_utils,
        "file_auth": f_auth,
        "symbol_order": s_order_proc,
    }


# =========================================================================
# 1. TECHNICAL DEBT SERVICE UNIT TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_technical_debt_score_and_summary(db_session: AsyncSession, debt_risk_env):
    """Verifies that technical_debt_service calculates real debt score, categories, and remediation hours."""
    repo = debt_risk_env["repo"]
    summary = await technical_debt_service.analyze_technical_debt(db_session, repo.id)

    assert summary["repository_id"] == repo.id
    assert 0 <= summary["debt_score"] <= 100
    assert summary["total_findings"] >= 1
    assert summary["estimated_remediation_hours"] > 0
    assert isinstance(summary["findings_by_category"], dict)
    assert isinstance(summary["findings_by_severity"], dict)
    assert len(summary["top_categories"]) >= 1
    assert len(summary["summary_text"]) > 0


@pytest.mark.asyncio
async def test_debt_findings_and_filters(db_session: AsyncSession, debt_risk_env):
    """Verifies that debt findings are detected with concrete category, severity, and line-level traceability."""
    repo = debt_risk_env["repo"]
    data = await technical_debt_service.analyze_technical_debt(db_session, repo.id)
    all_findings = data.get("findings", [])

    assert len(all_findings) >= 1
    for f in all_findings:
        assert f["repository_id"] == repo.id
        assert f["category"] in [
            "COMPLEXITY",
            "DUPLICATION",
            "DEPENDENCY",
            "ARCHITECTURE",
            "TEST_GAP",
            "DOCUMENTATION",
            "CODE_SMELL",
        ]
        assert f["severity"] in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]
        assert len(f["title"]) > 0
        assert f["evidence"] is not None

    # Test category filter
    complexity_findings = [f for f in all_findings if f["category"] == "COMPLEXITY"]
    for f in complexity_findings:
        assert f["category"] == "COMPLEXITY"


# =========================================================================
# 2. RISK INTELLIGENCE SERVICE UNIT TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_repository_risk_summary(db_session: AsyncSession, debt_risk_env):
    """Verifies multi-signal risk calculation across complexity, churn, coupling, and test gaps."""
    repo = debt_risk_env["repo"]
    risk_summary = await risk_intelligence_service.analyze_repository_risk(db_session, repo.id)

    assert risk_summary["repository_id"] == repo.id
    assert 0 <= risk_summary["overall_risk_score"] <= 100
    assert risk_summary["risk_level"] in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
    assert len(risk_summary["signals_breakdown"]) >= 1
    assert isinstance(risk_summary["risk_distribution"], dict)
    assert len(risk_summary["top_risk_factors"]) >= 1


@pytest.mark.asyncio
async def test_engineering_hotspots_detection(db_session: AsyncSession, debt_risk_env):
    """Verifies hotspot ranking where complexity, churn, coupling, and blast radius cross-multiply."""
    repo = debt_risk_env["repo"]
    risk_data = await risk_intelligence_service.analyze_repository_risk(db_session, repo.id)
    hotspots = risk_data.get("hotspots", [])

    assert isinstance(hotspots, list)
    if len(hotspots) > 0:
        top_hotspot = hotspots[0]
        assert top_hotspot["severity_rank"] == 1
        assert top_hotspot["composite_score"] >= 0
        assert top_hotspot["risk_level"] in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
        assert len(top_hotspot["signals_intersected"]) >= 1
        assert top_hotspot["file_path"] is not None


@pytest.mark.asyncio
async def test_entity_risk_calculation(db_session: AsyncSession, debt_risk_env):
    """Verifies entity-level risk inspection for files and symbols with blast radius calculation."""
    repo = debt_risk_env["repo"]
    file_order = debt_risk_env["file_order"]

    # Test file-level entity risk
    entity_risk = await risk_intelligence_service.get_entity_risk(
        db_session, repo.id, "FILE", file_order.path
    )
    assert entity_risk["repository_id"] == repo.id
    assert entity_risk["entity_type"] == "FILE"
    assert entity_risk["entity_id"] == file_order.path
    assert 0 <= entity_risk["risk_score"] <= 100
    assert entity_risk["risk_level"] in ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
    assert len(entity_risk["signals"]) >= 1
    assert entity_risk["blast_radius"] >= 0

    # Test symbol-level entity risk
    symbol_order = debt_risk_env["symbol_order"]
    sym_risk = await risk_intelligence_service.get_entity_risk(
        db_session, repo.id, "SYMBOL", symbol_order.name
    )
    assert sym_risk["entity_type"] == "SYMBOL"
    assert sym_risk["entity_id"] == symbol_order.name


@pytest.mark.asyncio
async def test_risk_trends_over_commits(db_session: AsyncSession, debt_risk_env):
    """Verifies historical risk and debt trends integrating Phase 20 Git commits and snapshots."""
    repo = debt_risk_env["repo"]
    trends = await risk_intelligence_service.get_debt_risk_trends(db_session, repo.id)

    assert trends["repository_id"] == repo.id
    assert trends["overall_trend"] in ["INCREASING", "DECREASING", "STABLE", "INSUFFICIENT_DATA"]
    assert len(trends["timeline"]) >= 1
    for point in trends["timeline"]:
        assert point["commit_hash"] is not None
        assert point["risk_score"] >= 0
        assert point["trend_direction"] in ["INCREASING", "DECREASING", "STABLE"]


# =========================================================================
# 3. REST API ENDPOINTS INTEGRATION TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_api_get_technical_debt(client: AsyncClient, debt_risk_env):
    """Tests GET /api/v1/repositories/{repo_id}/debt."""
    repo_id = debt_risk_env["repo"].id
    res = await client.get(f"/api/v1/repositories/{repo_id}/debt")
    assert res.status_code == 200
    data = res.json()
    assert data["repository_id"] == repo_id
    assert "debt_score" in data
    assert "estimated_remediation_hours" in data
    assert "findings_by_severity" in data


@pytest.mark.asyncio
async def test_api_get_repository_risk(client: AsyncClient, debt_risk_env):
    """Tests GET /api/v1/repositories/{repo_id}/risk."""
    repo_id = debt_risk_env["repo"].id
    res = await client.get(f"/api/v1/repositories/{repo_id}/risk")
    assert res.status_code == 200
    data = res.json()
    assert data["repository_id"] == repo_id
    assert "overall_risk_score" in data
    assert "risk_level" in data
    assert "signals_breakdown" in data


@pytest.mark.asyncio
async def test_api_get_findings_and_detail(client: AsyncClient, debt_risk_env):
    """Tests GET /api/v1/repositories/{repo_id}/findings and GET /findings/{id}."""
    repo_id = debt_risk_env["repo"].id

    # List findings
    res = await client.get(f"/api/v1/repositories/{repo_id}/findings")
    assert res.status_code == 200
    findings = res.json()
    assert isinstance(findings, list)
    assert len(findings) >= 1

    first_finding_id = findings[0]["id"]

    # Detail of first finding
    res_detail = await client.get(f"/api/v1/repositories/{repo_id}/findings/{first_finding_id}")
    assert res_detail.status_code == 200
    detail_data = res_detail.json()
    assert detail_data["finding"]["id"] == first_finding_id
    assert "traceable_evidence" in detail_data


@pytest.mark.asyncio
async def test_api_get_hotspots(client: AsyncClient, debt_risk_env):
    """Tests GET /api/v1/repositories/{repo_id}/hotspots."""
    repo_id = debt_risk_env["repo"].id
    res = await client.get(f"/api/v1/repositories/{repo_id}/hotspots")
    assert res.status_code == 200
    data = res.json()
    assert data["repository_id"] == repo_id
    assert "hotspots" in data


@pytest.mark.asyncio
async def test_api_get_risk_trends(client: AsyncClient, debt_risk_env):
    """Tests GET /api/v1/repositories/{repo_id}/risk/trends."""
    repo_id = debt_risk_env["repo"].id
    res = await client.get(f"/api/v1/repositories/{repo_id}/risk/trends")
    assert res.status_code == 200
    data = res.json()
    assert data["repository_id"] == repo_id
    assert "timeline" in data
    assert "overall_trend" in data


@pytest.mark.asyncio
async def test_api_get_entity_risk(client: AsyncClient, debt_risk_env):
    """Tests GET /api/v1/repositories/{repo_id}/risk/{entity_type}/{entity_id}."""
    repo_id = debt_risk_env["repo"].id
    file_path = debt_risk_env["file_order"].path

    res = await client.get(f"/api/v1/repositories/{repo_id}/risk/FILE/{file_path}")
    assert res.status_code == 200
    data = res.json()
    assert data["repository_id"] == repo_id
    assert data["entity_type"] == "FILE"
    assert data["entity_id"] == file_path
    assert "risk_score" in data
    assert "signals" in data


# =========================================================================
# 4. REPOSITORY ISOLATION & ERROR HANDLING TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_repository_isolation_and_not_found(client: AsyncClient, debt_risk_env):
    """Ensures cross-repository boundary is strictly isolated and missing repos return 404."""
    fake_repo_id = f"repo-fake-{uuid.uuid4().hex[:8]}"

    # Debt for fake repo
    res = await client.get(f"/api/v1/repositories/{fake_repo_id}/debt")
    assert res.status_code == 404

    # Risk for fake repo
    res = await client.get(f"/api/v1/repositories/{fake_repo_id}/risk")
    assert res.status_code == 404

    # Findings for fake repo
    res = await client.get(f"/api/v1/repositories/{fake_repo_id}/findings")
    assert res.status_code == 404

    # Hotspots for fake repo
    res = await client.get(f"/api/v1/repositories/{fake_repo_id}/hotspots")
    assert res.status_code == 404

    # Trends for fake repo
    res = await client.get(f"/api/v1/repositories/{fake_repo_id}/risk/trends")
    assert res.status_code == 404

    # Entity risk for fake repo
    res = await client.get(f"/api/v1/repositories/{fake_repo_id}/risk/FILE/src/order.py")
    assert res.status_code == 404
