# tests/test_autonomous.py

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.api.v1.auth import get_current_user
from app.autonomous.dependency_engine import DependencyEngine
from app.autonomous.docs_engine import DocsEngine
from app.autonomous.pr_generator import PullRequestGenerator
from app.autonomous.refactor_engine import RefactorEngine
from app.autonomous.task_planner import AutonomousTaskPlanner
from app.autonomous.test_engine import TestEngine
from app.autonomous.validation_pipeline import ValidationPipeline
from app.core.database import Base, SessionLocal, engine
from app.main import app
from app.models.autonomous_task import AutonomousTask
from app.models.repository import Repository
from app.models.repository_statistics import RepositoryStatistics
from app.models.user import User
from fastapi.testclient import TestClient


def setup_mock_data():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        user_id = "test_autonomous_user_id"
        repo_id = "test_autonomous_repo_id"

        user = User(
            id=user_id,
            email="autonomous@example.com",
            username="autonomous_tester",
            name="Autonomous Tester",
        )
        db.add(user)

        repo = Repository(
            id=repo_id,
            name="test-autonomous-repo",
            full_name="example/test-autonomous-repo",
            user_id=user_id,
            clone_url="https://github.com/example/test-autonomous-repo",
        )
        db.add(repo)

        stats = RepositoryStatistics(
            id="test_autonomous_stats_id",
            repository_id=repo_id,
            total_files=42,
            total_lines=3500,
            average_complexity=6.4,
            documentation_coverage=78.0,
        )
        db.add(stats)

        db.commit()
        return repo_id
    finally:
        db.close()


def mock_get_current_user():
    return {"id": "test_autonomous_user_id", "username": "autonomous_tester"}


app.dependency_overrides[get_current_user] = mock_get_current_user
client = TestClient(app)


def test_task_planner_from_request():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        planner = AutonomousTaskPlanner()
        tasks = planner.plan_from_request(
            db=db,
            repo_id=repo_id,
            request_text="Refactor analysis service, write missing tests, and update README documentation",
            pipeline_run_id="run-123",
        )
        assert len(tasks) >= 3
        task_types = [t.task_type for t in tasks]
        assert "refactor" in task_types
        assert "test" in task_types
        assert "docs" in task_types
    finally:
        db.close()


def test_task_planner_from_council():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        planner = AutonomousTaskPlanner()
        council_result = {
            "explainable_recommendations": [
                {
                    "id": "rec-1",
                    "title": "Migrate Monolithic Handlers",
                    "why": "High cyclomatic complexity",
                    "confidence_score": 90.0,
                    "trade_offs": ["Initial effort"],
                }
            ]
        }
        tasks = planner.plan_from_council(
            db=db,
            repo_id=repo_id,
            council_result=council_result,
            pipeline_run_id="run-456",
        )
        assert len(tasks) == 4  # refactor, test, docs, dependency
        task_types = [t.task_type for t in tasks]
        assert "refactor" in task_types
        assert "dependency" in task_types
    finally:
        db.close()


def test_refactor_engine():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        task = AutonomousTask(
            id="t-refactor",
            repository_id=repo_id,
            pipeline_run_id="p-1",
            task_type="refactor",
            title="Refactor analysis service",
            priority=1,
        )
        db.add(task)
        db.commit()

        engine_inst = RefactorEngine()
        res = engine_inst.execute(db, repo_id, task)

        assert res["task_type"] == "refactor"
        assert len(res["diff_hunks"]) > 0
        assert task.status == "validated"
        assert task.generated_diff is not None
    finally:
        db.close()


def test_test_engine():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        task = AutonomousTask(
            id="t-test",
            repository_id=repo_id,
            pipeline_run_id="p-1",
            task_type="test",
            title="Add edge case unit tests",
            priority=2,
        )
        db.add(task)
        db.commit()

        engine_inst = TestEngine()
        res = engine_inst.execute(db, repo_id, task)

        assert res["task_type"] == "test"
        assert "test_plan" in res
        assert len(res["generated_test_files"]) > 0
        assert task.status == "validated"
    finally:
        db.close()


def test_docs_engine():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        task = AutonomousTask(
            id="t-docs",
            repository_id=repo_id,
            pipeline_run_id="p-1",
            task_type="docs",
            title="Update docstrings and README",
            priority=3,
        )
        db.add(task)
        db.commit()

        engine_inst = DocsEngine()
        res = engine_inst.execute(db, repo_id, task)

        assert res["task_type"] == "docs"
        assert "architecture_decision_record" in res
        assert len(res["documentation_diffs"]) > 0
        assert task.status == "validated"
    finally:
        db.close()


def test_dependency_engine():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        task = AutonomousTask(
            id="t-dep",
            repository_id=repo_id,
            pipeline_run_id="p-1",
            task_type="dependency",
            title="Audit dependencies for CVEs",
            priority=2,
        )
        db.add(task)
        db.commit()

        engine_inst = DependencyEngine()
        res = engine_inst.execute(db, repo_id, task)

        assert res["task_type"] == "dependency"
        assert len(res["vulnerabilities"]) > 0
        assert len(res["upgrade_plan"]) > 0
        assert task.status == "validated"
    finally:
        db.close()


def test_all_twelve_pillars_engines():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        from app.autonomous.api_evolution_engine import APIEvolutionEngine
        from app.autonomous.architecture_engine import ArchitectureEngine
        from app.autonomous.database_migration_engine import DatabaseMigrationEngine
        from app.autonomous.infrastructure_engine import InfrastructureEngine
        from app.autonomous.performance_engine import PerformanceEngine
        from app.autonomous.security_engine import SecurityEngine

        # Security Patch Generator (Pillar 7)
        task_sec = AutonomousTask(
            id="t-sec",
            repository_id=repo_id,
            pipeline_run_id="p-12",
            task_type="security",
            title="Fix CVEs",
        )
        db.add(task_sec)
        db.commit()
        res_sec = SecurityEngine().execute(db, repo_id, task_sec)
        assert res_sec["task_type"] == "security"

        # Performance Engine (Pillar 8)
        task_perf = AutonomousTask(
            id="t-perf",
            repository_id=repo_id,
            pipeline_run_id="p-12",
            task_type="performance",
            title="Redis caching",
        )
        db.add(task_perf)
        db.commit()
        res_perf = PerformanceEngine().execute(db, repo_id, task_perf)
        assert res_perf["task_type"] == "performance"

        # Architecture Planner (Pillar 9)
        task_arch = AutonomousTask(
            id="t-arch",
            repository_id=repo_id,
            pipeline_run_id="p-12",
            task_type="architecture",
            title="Microservices blueprint",
        )
        db.add(task_arch)
        db.commit()
        res_arch = ArchitectureEngine().execute(db, repo_id, task_arch)
        assert res_arch["task_type"] == "architecture"

        # API Evolution Assistant (Pillar 10)
        task_api = AutonomousTask(
            id="t-api",
            repository_id=repo_id,
            pipeline_run_id="p-12",
            task_type="api_evolution",
            title="Deprecation strategy",
        )
        db.add(task_api)
        db.commit()
        res_api = APIEvolutionEngine().execute(db, repo_id, task_api)
        assert res_api["task_type"] == "api_evolution"

        # Database Migration Planner (Pillar 11)
        task_db = AutonomousTask(
            id="t-db",
            repository_id=repo_id,
            pipeline_run_id="p-12",
            task_type="database",
            title="Alembic script",
        )
        db.add(task_db)
        db.commit()
        res_db = DatabaseMigrationEngine().execute(db, repo_id, task_db)
        assert res_db["task_type"] == "database"

        # Infrastructure Optimizer (Pillar 12)
        task_infra = AutonomousTask(
            id="t-infra",
            repository_id=repo_id,
            pipeline_run_id="p-12",
            task_type="infrastructure",
            title="Docker optimization",
        )
        db.add(task_infra)
        db.commit()
        res_infra = InfrastructureEngine().execute(db, repo_id, task_infra)
        assert res_infra["task_type"] == "infrastructure"
    finally:
        db.close()


def test_validation_pipeline():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        task = AutonomousTask(
            id="t-val",
            repository_id=repo_id,
            pipeline_run_id="p-1",
            task_type="refactor",
            title="Refactor validation test",
        )
        db.add(task)
        db.commit()

        pipeline = ValidationPipeline()
        report = pipeline.validate_changes(db, [task])

        assert report["overall_status"] in ("PASS", "PASS_WITH_WARNINGS")
        assert "sandbox" in report
        assert report["sandbox"]["status"] == "PASS"
    finally:
        db.close()


def test_pillars_17_to_21_engines():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        from app.autonomous.feature_planner import FeatureImplementationPlanner
        from app.autonomous.issue_resolution_planner import IssueResolutionPlanner
        from app.autonomous.knowledge_update_engine import KnowledgeUpdateEngine
        from app.autonomous.tech_debt_sprint_generator import TechDebtSprintGenerator
        from app.autonomous.workflow_automation_engine import WorkflowAutomationEngine

        # Pillar 17: Engineering Workflow Automation
        wf_res = WorkflowAutomationEngine().execute_workflow(
            db, repo_id, "dependency_and_test_sync"
        )
        assert wf_res["review_gate_enforced"] is True

        # Pillar 18: Issue Resolution Planner
        issue_res = IssueResolutionPlanner().plan_issue_resolution(
            db,
            repo_id,
            "Fix null dereference in analysis handler",
            "App crashes when repo stats empty",
        )
        assert len(issue_res["tasks"]) == 3

        # Pillar 19: Technical Debt Sprint Generator
        sprint_res = TechDebtSprintGenerator().generate_sprint_plan(db, repo_id, 40)
        assert len(sprint_res["backlog_items"]) == 4

        # Pillar 20: Feature Implementation Planner
        feat_res = FeatureImplementationPlanner().plan_feature(
            db, repo_id, "Autonomous Task Orchestrator", "Multi-stage pipeline specs"
        )
        assert feat_res["total_milestones"] == 4

        # Pillar 21: Engineering Knowledge Updates
        task = AutonomousTask(
            id="t-sync",
            repository_id=repo_id,
            pipeline_run_id="p-sync",
            task_type="refactor",
            title="Refactor sync",
        )
        db.add(task)
        db.commit()
        know_res = KnowledgeUpdateEngine().sync_knowledge_after_approval(
            db, repo_id, [task]
        )
        assert know_res["architecture_memory_synced"] is True
    finally:
        db.close()


def test_pillars_22_to_24_engines():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        from app.autonomous.impact_report_engine import ChangeImpactReportEngine
        from app.autonomous.multi_agent_validation_engine import (
            MultiAgentValidationEngine,
        )
        from app.autonomous.release_preparation_engine import ReleasePreparationEngine

        task = AutonomousTask(
            id="t-22",
            repository_id=repo_id,
            pipeline_run_id="p-22",
            task_type="refactor",
            title="Core refactor",
        )
        db.add(task)
        db.commit()

        # Pillar 22: Change Impact Report
        impact_res = ChangeImpactReportEngine().generate_impact_report(db, [task])
        assert impact_res["estimated_risk"]["level"] == "LOW"
        assert len(impact_res["files_changed"]) > 0

        # Pillar 23: Release Preparation Assistant
        release_res = ReleasePreparationEngine().prepare_release(db, repo_id, [task])
        assert release_res["readiness_status"] == "PRODUCTION_READY"
        assert "release_notes" in release_res

        # Pillar 24: Multi-Agent Validation
        multi_agent_res = MultiAgentValidationEngine().validate_with_agents(
            db, repo_id, [task]
        )
        assert multi_agent_res["consensus_verdict"] == "UNANIMOUS_APPROVAL"
        assert multi_agent_res["agents_reviewed_count"] == 6
    finally:
        db.close()


def test_pillars_25_to_27_engines():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        from app.autonomous.backlog_prioritizer_engine import (
            AutonomousBacklogPrioritizer,
        )
        from app.autonomous.continuous_improvement_loop import ContinuousImprovementLoop
        from app.autonomous.metrics_dashboard_engine import (
            EngineeringMetricsDashboardEngine,
        )

        task = AutonomousTask(
            id="t-25",
            repository_id=repo_id,
            pipeline_run_id="p-25",
            task_type="refactor",
            title="Core refactor",
        )
        db.add(task)
        db.commit()

        # Pillar 25: Engineering Metrics Dashboard
        metrics_res = EngineeringMetricsDashboardEngine().get_dashboard_metrics(
            db, repo_id
        )
        assert metrics_res["pr_success_rate_pct"] == 94.2
        assert metrics_res["automation_success_rate_pct"] == 98.5

        # Pillar 26: Autonomous Backlog Prioritizer
        prio_res = AutonomousBacklogPrioritizer().prioritize_tasks(db, [task])
        assert len(prio_res) == 1
        assert prio_res[0]["rank"] == 1

        # Pillar 27: Continuous Improvement Loop
        loop_res = ContinuousImprovementLoop().scan_for_opportunities(db, repo_id)
        assert loop_res["scan_status"] == "COMPLETED"
        assert len(loop_res["opportunities"]) == 4
    finally:
        db.close()


def test_pillars_28_to_30_engines():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        from app.autonomous.explainable_automation_engine import (
            ExplainableAutomationEngine,
        )
        from app.autonomous.human_approval_gateway import HumanApprovalGateway
        from app.autonomous.sandbox_execution_engine import SafeExecutionSandboxEngine

        task = AutonomousTask(
            id="t-28",
            repository_id=repo_id,
            pipeline_run_id="p-28",
            task_type="refactor",
            title="Core refactor",
        )
        db.add(task)
        db.commit()

        # Pillar 28: Safe Execution Sandbox
        sandbox_res = SafeExecutionSandboxEngine().execute_in_sandbox(db, [task])
        assert sandbox_res["sandbox_status"] == "VERIFIED_PASS"
        assert len(sandbox_res["steps"]) == 5

        # Pillar 29: Explainable Automation
        exp_res = ExplainableAutomationEngine().generate_explanation(db, task)
        assert "why_this_change" in exp_res
        assert "expected_impact" in exp_res
        assert "rollback_plan" in exp_res

        # Pillar 30: Human Approval Gateway
        gate_res = HumanApprovalGateway().enforce_approval_gate(db, "p-28", [task])
        assert gate_res["auto_merge_allowed"] is False
        assert gate_res["current_gate_state"] == "AWAITING_HUMAN_APPROVAL"
    finally:
        db.close()


def test_pr_generator():
    repo_id = setup_mock_data()
    db = SessionLocal()
    try:
        task1 = AutonomousTask(
            id="t-pr-1",
            repository_id=repo_id,
            pipeline_run_id="p-pr",
            task_type="refactor",
            title="Refactor core service",
            generated_diff=[
                {"file": "app/services/core.py", "before": "a", "after": "b"}
            ],
        )
        task2 = AutonomousTask(
            id="t-pr-2",
            repository_id=repo_id,
            pipeline_run_id="p-pr",
            task_type="test",
            title="Add core unit tests",
            generated_diff=[
                {
                    "file": "tests/test_core.py",
                    "before": "",
                    "after": "def test_a(): pass",
                }
            ],
        )
        db.add_all([task1, task2])
        db.commit()

        pr_gen = PullRequestGenerator()
        pr_data = pr_gen.generate_pr(
            db=db,
            repo_id=repo_id,
            pipeline_run_id="p-pr",
            tasks=[task1, task2],
            council_question="Improve core modularity",
        )

        assert pr_data["status"] == "awaiting_approval"
        assert len(pr_data["files_changed"]) == 2
        assert "autonomous-engineering" in pr_data["labels"]
        assert task1.status == "pr_ready"
    finally:
        db.close()


def test_autonomous_pipeline_api():
    repo_id = setup_mock_data()

    # 1. Run pipeline without council (direct developer request)
    payload = {
        "request": "Refactor technical debt, update outdated dependencies, and write unit tests",
        "priority_focus": "quality",
        "use_council": False,
    }
    res = client.post(
        f"/api/v1/repositories/{repo_id}/autonomous/pipeline",
        json=payload,
    )
    assert res.status_code == 200
    data = res.json()

    assert data["repository_id"] == repo_id
    assert data["current_stage"] == "AWAITING_APPROVAL"
    assert len(data["tasks"]) > 0
    assert "pull_request" in data
    assert (
        data["principle"]
        == "AI never pushes directly to production. Human approval required."
    )

    pipeline_run_id = data["pipeline_run_id"]
    task_id = data["tasks"][0]["id"]

    # 2. Get list of tasks
    tasks_res = client.get(
        f"/api/v1/repositories/{repo_id}/autonomous/tasks?pipeline_run_id={pipeline_run_id}"
    )
    assert tasks_res.status_code == 200
    tasks_data = tasks_res.json()
    assert tasks_data["total_tasks"] == len(data["tasks"])

    # 3. Get single task detail
    detail_res = client.get(
        f"/api/v1/repositories/{repo_id}/autonomous/tasks/{task_id}"
    )
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["id"] == task_id
    assert "generated_diff" in detail

    # 4. Human approves single task
    approve_res = client.post(
        f"/api/v1/repositories/{repo_id}/autonomous/tasks/{task_id}/approve"
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["status"] == "approved"

    # 5. Get PR details
    pr_res = client.get(
        f"/api/v1/repositories/{repo_id}/autonomous/pr/{pipeline_run_id}"
    )
    assert pr_res.status_code == 200
    assert "pr_data" in pr_res.json()

    # 6. Human merges pipeline run
    merge_res = client.post(
        f"/api/v1/repositories/{repo_id}/autonomous/pr/{pipeline_run_id}/merge"
    )
    assert merge_res.status_code == 200
    assert merge_res.json()["status"] == "merged"
    assert merge_res.json()["tasks_merged"] >= 1


def test_autonomous_pipeline_reject_task():
    repo_id = setup_mock_data()

    # Run pipeline
    res = client.post(
        f"/api/v1/repositories/{repo_id}/autonomous/pipeline",
        json={"request": "Audit dependencies for CVEs", "use_council": False},
    )
    assert res.status_code == 200
    data = res.json()
    task_id = data["tasks"][0]["id"]

    # Human rejects task
    reject_res = client.post(
        f"/api/v1/repositories/{repo_id}/autonomous/tasks/{task_id}/reject",
        json={"reason": "Requires security team review first"},
    )
    assert reject_res.status_code == 200
    assert reject_res.json()["status"] == "rejected"
