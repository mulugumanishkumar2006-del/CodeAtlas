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
from backend.app.models.engineering_plan import EngineeringPlan
from backend.app.services.engineering_planning_service import engineering_planning_service
from backend.app.services.rag_service import rag_service


async def create_test_workspace(db_session: AsyncSession) -> Workspace:
    ws = Workspace(
        id=f"ws-{uuid.uuid4().hex[:8]}",
        name=f"Workspace-{uuid.uuid4().hex[:4]}",
        slug=f"ws-slug-{uuid.uuid4().hex[:6]}",
    )
    db_session.add(ws)
    await db_session.flush()
    return ws


def setup_git_repo_for_planning(repo_dir: Path) -> Dict[str, str]:
    """Sets up a realistic git repository with code, architectural violations, and tests."""
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
    run_git("config", "user.name", "CodeAtlas AI CTO Tester")
    run_git("config", "user.email", "tester@codeatlas.dev")

    src_dir = repo_dir / "src"
    tests_dir = repo_dir / "tests"
    src_dir.mkdir(parents=True, exist_ok=True)
    tests_dir.mkdir(parents=True, exist_ok=True)

    # 1. Monolithic Core Service (Oversized, complex, high churn candidate)
    core_file = src_dir / "core_service.py"
    core_content = [
        "'''Core business service processing transactions.'''",
        "import os",
        "import sys",
        "class CoreTransactionService:",
    ]
    for i in range(1, 15):
        core_content.append(f"    def process_step_{i}(self, data, flag=True):")
        core_content.append("        if flag:")
        core_content.append("            for item in range(10):")
        core_content.append("                if item % 2 == 0:")
        core_content.append("                    return item * 2")
        core_content.append("        return None")
    core_file.write_text("\n".join(core_content))

    # 2. Consuming Controller
    ctrl_file = src_dir / "controller.py"
    ctrl_file.write_text(
        "from src.core_service import CoreTransactionService\n"
        "class AppController:\n"
        "    def __init__(self):\n"
        "        self.srv = CoreTransactionService()\n"
        "    def run(self):\n"
        "        return self.srv.process_step_1({'test': 1})\n"
    )

    # 3. Test File
    test_file = tests_dir / "test_controller.py"
    test_file.write_text(
        "def test_controller_dummy():\n"
        "    assert True\n"
    )

    run_git("add", ".")
    run_git("commit", "-m", "Initial commit of core services and tests")

    # Add second commit modifying core_service to create churn history
    core_file.write_text(core_file.read_text() + "\n# Churn modification\n")
    run_git("add", ".")
    run_git("commit", "-m", "Update core service logic")

    return {
        "core_file": str(core_file),
        "ctrl_file": str(ctrl_file),
        "test_file": str(test_file),
    }


async def seed_planning_repository(
    db_session: AsyncSession, tmp_path: Path, repo_name: str = "PlanningRepo"
) -> Repository:
    ws = await create_test_workspace(db_session)
    repo_dir = tmp_path / f"repo_{uuid.uuid4().hex[:6]}"
    setup_git_repo_for_planning(repo_dir)

    repo = Repository(
        id=f"repo-{uuid.uuid4().hex[:8]}",
        workspace_id=ws.id,
        name=repo_name,
        url=f"https://github.com/test/{repo_name.lower()}",
        clone_path=str(repo_dir),
        default_branch="master",
        acquisition_status="READY",
        analysis_status="completed",
        metadata_json={
            "analyzed_at": subprocess.check_output(["git", "-C", str(repo_dir), "log", "-1", "--format=%cI"]).decode().strip()
        },
    )
    db_session.add(repo)
    await db_session.flush()

    # Create files
    f_core = File(
        id=f"f-core-{uuid.uuid4().hex[:6]}",
        repository_id=repo.id,
        path="src/core_service.py",
        language="python",
        line_count=350,
        size_bytes=2500,
    )
    f_ctrl = File(
        id=f"f-ctrl-{uuid.uuid4().hex[:6]}",
        repository_id=repo.id,
        path="src/controller.py",
        language="python",
        line_count=50,
        size_bytes=400,
    )
    f_test = File(
        id=f"f-test-{uuid.uuid4().hex[:6]}",
        repository_id=repo.id,
        path="tests/test_controller.py",
        language="python",
        line_count=20,
        size_bytes=150,
    )
    db_session.add_all([f_core, f_ctrl, f_test])
    await db_session.flush()

    # Create symbols
    sym_core = Symbol(
        id=f"sym-core-{uuid.uuid4().hex[:6]}",
        repository_id=repo.id,
        file_id=f_core.id,
        name="CoreTransactionService",
        symbol_type="class",
        start_line=4,
        end_line=120,
        qualified_name="src.core_service.CoreTransactionService",
    )
    sym_ctrl = Symbol(
        id=f"sym-ctrl-{uuid.uuid4().hex[:6]}",
        repository_id=repo.id,
        file_id=f_ctrl.id,
        name="AppController",
        symbol_type="class",
        start_line=2,
        end_line=25,
        qualified_name="src.controller.AppController",
    )
    db_session.add_all([sym_core, sym_ctrl])
    await db_session.flush()

    # Create dependencies
    dep1 = Dependency(
        id=f"dep-{uuid.uuid4().hex[:6]}",
        repository_id=repo.id,
        name="core_service",
        version_spec="1.0.0",
        dependency_type="internal",
        metadata_json={
            "source_path": "src/controller.py",
            "target_path": "src/core_service.py",
        },
    )
    db_session.add(dep1)
    await db_session.commit()

    return repo


# =========================================================================
# 1. UNIT & SERVICE TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_multi_dimensional_engineering_health(db_session: AsyncSession, tmp_path: Path):
    """
    Tests assessing repository engineering health across all 7 dimensions.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "HealthRepo")

    health = await engineering_planning_service.get_engineering_health(db_session, repo.id)

    assert health["repository_id"] == repo.id
    assert 0.0 <= health["overall_score"] <= 100.0
    assert health["overall_grade"] in ("A", "B", "C", "D", "F")
    assert health["overall_status"] in ("HEALTHY", "MODERATE", "DEGRADED", "CRITICAL")
    assert len(health["dimensions"]) == 7

    dim_keys = {d["key"] for d in health["dimensions"]}
    assert dim_keys == {
        "architecture",
        "quality",
        "technical_debt",
        "security_reliability",
        "dependencies",
        "testing",
        "change_risk",
    }

    for d in health["dimensions"]:
        assert 0.0 <= d["score"] <= 100.0
        assert d["status"] in ("HEALTHY", "MODERATE", "DEGRADED", "CRITICAL")
        assert len(d["summary"]) > 0


@pytest.mark.asyncio
async def test_engineering_priorities_generation(db_session: AsyncSession, tmp_path: Path):
    """
    Tests evidence-backed engineering priorities generation with action plans and validation plans.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "PrioritiesRepo")

    data = await engineering_planning_service.get_engineering_priorities(db_session, repo.id)

    assert data["repository_id"] == repo.id
    assert data["total_priorities"] > 0
    assert len(data["priorities"]) == data["total_priorities"]

    for item in data["priorities"]:
        assert item["id"].startswith("item-")
        assert len(item["title"]) > 0
        assert len(item["problem_statement"]) > 0
        assert item["primary_category"] in (
            "ARCHITECTURE",
            "TECHNICAL_DEBT",
            "CHANGE_RISK",
            "TESTING",
            "SECURITY",
            "DEPENDENCY",
        )
        assert item["priority_tier"] in ("CRITICAL", "HIGH", "MEDIUM", "LOW")
        assert 0.0 <= item["priority_score"] <= 100.0
        assert len(item["recommended_action"]) > 0
        assert len(item["validation_plan"]) > 0
        assert "unavailable from repository evidence" in item["effort_estimate"]
        assert len(item["impact_summary"]) > 0
        assert len(item["risk_if_ignored"]) > 0


@pytest.mark.asyncio
async def test_roadmap_generation_now_next_later(db_session: AsyncSession, tmp_path: Path):
    """
    Tests organizing priorities into Now, Next, Later roadmap horizons.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "RoadmapRepo")

    roadmap_1m = await engineering_planning_service.generate_roadmap(db_session, repo.id, time_frame="1_month")

    assert roadmap_1m["repository_id"] == repo.id
    assert roadmap_1m["time_frame"] == "1_month"
    assert isinstance(roadmap_1m["now"], list)
    assert isinstance(roadmap_1m["next"], list)
    assert isinstance(roadmap_1m["later"], list)
    assert roadmap_1m["total_items"] > 0

    # Ensure NOW items have priority
    for item in roadmap_1m["now"]:
        assert item["time_horizon"] == "NOW"


@pytest.mark.asyncio
async def test_strategic_inquiry_what_should_we_do_next(db_session: AsyncSession, tmp_path: Path):
    """
    Tests 'what should we do next' inquiry returns a concrete top action justified by evidence.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "WhatNextRepo")

    result = await engineering_planning_service.what_should_we_do_next(db_session, repo.id)

    assert result["repository_id"] == repo.id
    assert result["top_action"] is not None
    assert "Recommended Next Action" in result["headline"]
    assert len(result["justification"]) > 0
    assert result["confidence"] == "HIGH"


@pytest.mark.asyncio
async def test_strategy_comparison_four_options(db_session: AsyncSession, tmp_path: Path):
    """
    Tests comparing 4 engineering strategies (Minimal Change, Structural Refactor,
    Incremental Migration, Containment).
    """
    repo = await seed_planning_repository(db_session, tmp_path, "StrategyRepo")

    comparison = await engineering_planning_service.compare_strategies(db_session, repo.id)

    assert comparison["repository_id"] == repo.id
    assert len(comparison["options"]) == 4

    strategy_types = {opt["strategy_type"] for opt in comparison["options"]}
    assert strategy_types == {
        "MINIMAL_CHANGE",
        "STRUCTURAL_REFACTOR",
        "INCREMENTAL_MIGRATION",
        "CONTAINMENT",
    }

    has_rec = any(opt["is_recommended"] for opt in comparison["options"])
    assert has_rec is True
    assert len(comparison["synthesis"]) > 0


@pytest.mark.asyncio
async def test_simulate_ignore_work_item(db_session: AsyncSession, tmp_path: Path):
    """
    Tests simulating what happens if a specific engineering priority is ignored.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "SimIgnoreRepo")

    priorities = await engineering_planning_service.get_engineering_priorities(db_session, repo.id)
    first_item = priorities["priorities"][0]

    sim_res = await engineering_planning_service.simulate_ignore(
        db_session, repo.id, work_item_id=first_item["id"]
    )

    assert sim_res["repository_id"] == repo.id
    assert sim_res["work_item_id"] == first_item["id"]
    assert sim_res["accumulated_risk_score"] >= first_item["priority_score"]
    assert len(sim_res["consequence_summary"]) > 0
    assert len(sim_res["historical_precedents"]) > 0


@pytest.mark.asyncio
async def test_plan_persistence_and_auto_versioning(db_session: AsyncSession, tmp_path: Path):
    """
    Tests creating and autonomously generating engineering plans with version incrementing (v1 -> v2).
    """
    repo = await seed_planning_repository(db_session, tmp_path, "PlanVersionRepo")

    # Generate Plan v1
    plan_v1 = await engineering_planning_service.generate_plan(
        db=db_session,
        repository_id=repo.id,
        title="Engineering Roadmap Q1",
        time_horizon="1_month",
    )
    assert plan_v1.version == 1
    assert plan_v1.status == "active"
    assert plan_v1.time_horizon == "1_month"
    assert len(plan_v1.work_items) > 0

    # Generate Plan v2
    plan_v2 = await engineering_planning_service.generate_plan(
        db=db_session,
        repository_id=repo.id,
        title="Engineering Roadmap Q2",
        time_horizon="3_months",
    )
    assert plan_v2.version == 2
    assert plan_v2.time_horizon == "3_months"

    # List plans
    plans = await engineering_planning_service.list_plans(db_session, repo.id)
    assert len(plans) == 2
    assert plans[0].version == 2  # ordered by version desc
    assert plans[1].version == 1

    # Update plan status
    updated = await engineering_planning_service.update_plan_status(
        db_session, repo.id, plan_v1.id, status="archived"
    )
    assert updated.status == "archived"


@pytest.mark.asyncio
async def test_strict_repository_isolation(db_session: AsyncSession, tmp_path: Path):
    """
    Ensures engineering plans from Repo A cannot be accessed from Repo B.
    """
    repo_a = await seed_planning_repository(db_session, tmp_path, "RepoIsolationA")
    repo_b = await seed_planning_repository(db_session, tmp_path, "RepoIsolationB")

    plan_a = await engineering_planning_service.generate_plan(
        db=db_session,
        repository_id=repo_a.id,
        title="Plan for Repo A",
    )

    # Attempting to fetch plan_a under repo_b should fail
    with pytest.raises(ValueError, match="not found in repository"):
        await engineering_planning_service.get_plan(db_session, repository_id=repo_b.id, plan_id=plan_a.id)


@pytest.mark.asyncio
async def test_rag_ai_cto_query_classification_and_evidence(db_session: AsyncSession, tmp_path: Path):
    """
    Tests that AI CTO questions classify to PLANNING and retrieve structured health & priorities.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "RAGPlanningRepo")

    query = "What should the engineering team work on next?"
    intent, _ = rag_service.classify_query(query)
    assert intent == "PLANNING"

    sources = await rag_service.retrieve_evidence(
        repository_id=repo.id,
        query=query,
        intent=intent,
        keywords=["engineering", "team", "work"],
        db=db_session,
    )

    # Verify that Phase 23 evidence candidate was retrieved
    planning_sources = [s for s in sources if s.get("symbol") == "AI_CTO_Planning"]
    assert len(planning_sources) > 0
    assert "PHASE 23 AI CTO & ENGINEERING PLANNING INTELLIGENCE" in planning_sources[0]["content"]


# =========================================================================
# 2. REST API ENDPOINT TESTS
# =========================================================================

@pytest.mark.asyncio
async def test_api_engineering_health_and_priorities(
    client: AsyncClient, db_session: AsyncSession, tmp_path: Path
):
    """
    Tests GET /{repo_id}/engineering/health and GET /{repo_id}/engineering/priorities endpoints.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "APIHealthRepo")

    # 1. Health
    res_health = await client.get(f"/api/v1/repositories/{repo.id}/engineering/health")
    assert res_health.status_code == 200
    h_json = res_health.json()
    assert h_json["repository_id"] == repo.id
    assert len(h_json["dimensions"]) == 7

    # 2. Priorities
    res_priorities = await client.get(f"/api/v1/repositories/{repo.id}/engineering/priorities")
    assert res_priorities.status_code == 200
    p_json = res_priorities.json()
    assert p_json["total_priorities"] > 0
    assert len(p_json["priorities"]) == p_json["total_priorities"]


@pytest.mark.asyncio
async def test_api_engineering_roadmap_and_next(
    client: AsyncClient, db_session: AsyncSession, tmp_path: Path
):
    """
    Tests GET /{repo_id}/engineering/roadmap and GET /{repo_id}/engineering/next endpoints.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "APIRoadmapRepo")

    # Roadmap
    res_roadmap = await client.get(f"/api/v1/repositories/{repo.id}/engineering/roadmap?time_frame=1_month")
    assert res_roadmap.status_code == 200
    r_json = res_roadmap.json()
    assert r_json["time_frame"] == "1_month"
    assert "now" in r_json
    assert "next" in r_json
    assert "later" in r_json

    # What should we do next
    res_next = await client.get(f"/api/v1/repositories/{repo.id}/engineering/next")
    assert res_next.status_code == 200
    n_json = res_next.json()
    assert "headline" in n_json
    assert n_json["top_action"] is not None


@pytest.mark.asyncio
async def test_api_engineering_strategies_and_simulate_ignore(
    client: AsyncClient, db_session: AsyncSession, tmp_path: Path
):
    """
    Tests strategy comparisons and simulate-ignore endpoints.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "APIStrategiesRepo")

    # Strategies
    res_strat = await client.get(f"/api/v1/repositories/{repo.id}/engineering/strategies")
    assert res_strat.status_code == 200
    s_json = res_strat.json()
    assert len(s_json["options"]) == 4

    # Simulate Ignore
    res_ign = await client.post(f"/api/v1/repositories/{repo.id}/engineering/simulate-ignore?work_item_id=item-1")
    assert res_ign.status_code == 200
    ign_json = res_ign.json()
    assert "accumulated_risk_score" in ign_json
    assert len(ign_json["consequence_summary"]) > 0


@pytest.mark.asyncio
async def test_api_plans_crud_and_generate(
    client: AsyncClient, db_session: AsyncSession, tmp_path: Path
):
    """
    Tests plan generation, listing, retrieving, and updating status via REST API.
    """
    repo = await seed_planning_repository(db_session, tmp_path, "APIPlansRepo")

    # 1. Generate Plan
    res_gen = await client.post(
        f"/api/v1/repositories/{repo.id}/engineering/plans/generate",
        json={"title": "Q3 Core Stabilization", "time_horizon": "1_month"},
    )
    assert res_gen.status_code == 201
    plan_json = res_gen.json()
    plan_id = plan_json["id"]
    assert plan_json["version"] == 1
    assert plan_json["status"] == "active"

    # 2. List Plans
    res_list = await client.get(f"/api/v1/repositories/{repo.id}/engineering/plans")
    assert res_list.status_code == 200
    l_json = res_list.json()
    assert l_json["total_plans"] == 1
    assert l_json["plans"][0]["id"] == plan_id

    # 3. Get Plan by ID
    res_get = await client.get(f"/api/v1/repositories/{repo.id}/engineering/plans/{plan_id}")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == plan_id

    # 4. Update Status
    res_patch = await client.patch(
        f"/api/v1/repositories/{repo.id}/engineering/plans/{plan_id}?new_status=completed"
    )
    assert res_patch.status_code == 200
    assert res_patch.json()["status"] == "completed"
