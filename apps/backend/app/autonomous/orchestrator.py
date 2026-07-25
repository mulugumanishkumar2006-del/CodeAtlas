# apps/backend/app/autonomous/orchestrator.py

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy.orm import Session

from app.autonomous.api_evolution_engine import APIEvolutionEngine
from app.autonomous.architecture_engine import ArchitectureEngine
from app.autonomous.backlog_prioritizer_engine import AutonomousBacklogPrioritizer
from app.autonomous.code_review_assistant import CodeReviewAssistant
from app.autonomous.continuous_improvement_loop import ContinuousImprovementLoop
from app.autonomous.database_migration_engine import DatabaseMigrationEngine
from app.autonomous.dependency_engine import DependencyEngine
from app.autonomous.docs_engine import DocsEngine
from app.autonomous.explainable_automation_engine import ExplainableAutomationEngine
from app.autonomous.feature_planner import FeatureImplementationPlanner
from app.autonomous.human_approval_gateway import HumanApprovalGateway
from app.autonomous.impact_report_engine import ChangeImpactReportEngine
from app.autonomous.infrastructure_engine import InfrastructureEngine
from app.autonomous.issue_resolution_planner import IssueResolutionPlanner
from app.autonomous.knowledge_update_engine import KnowledgeUpdateEngine
from app.autonomous.metrics_dashboard_engine import EngineeringMetricsDashboardEngine
from app.autonomous.multi_agent_validation_engine import MultiAgentValidationEngine
from app.autonomous.performance_engine import PerformanceEngine
from app.autonomous.pr_generator import PullRequestGenerator
from app.autonomous.refactor_engine import RefactorEngine
from app.autonomous.regression_risk_analyzer import RegressionRiskAnalyzer
from app.autonomous.release_preparation_engine import ReleasePreparationEngine
from app.autonomous.rollback_planner import RollbackPlanner
from app.autonomous.sandbox_execution_engine import SafeExecutionSandboxEngine
from app.autonomous.security_engine import SecurityEngine
from app.autonomous.task_planner import AutonomousTaskPlanner
from app.autonomous.tech_debt_sprint_generator import TechDebtSprintGenerator
from app.autonomous.test_engine import TestEngine
from app.autonomous.validation_pipeline import ValidationPipeline
from app.autonomous.workflow_automation_engine import WorkflowAutomationEngine
from app.council.consensus_engine import EngineeringCouncilEngine
from app.models.autonomous_task import AutonomousTask


class AutonomousOrchestrator:
    """
    Top-level coordinator for the Autonomous Engineering Platform across all 30 Pillars.
    """

    PIPELINE_STAGES = [
        "PLANNING",
        "EXECUTING",
        "VALIDATING",
        "PR_READY",
        "AWAITING_APPROVAL",
        "MERGED",
    ]

    def __init__(self) -> None:
        self.council_engine = EngineeringCouncilEngine()
        self.task_planner = AutonomousTaskPlanner()
        self.refactor_engine = RefactorEngine()
        self.test_engine = TestEngine()
        self.docs_engine = DocsEngine()
        self.dependency_engine = DependencyEngine()
        self.security_engine = SecurityEngine()
        self.performance_engine = PerformanceEngine()
        self.architecture_engine = ArchitectureEngine()
        self.api_evolution_engine = APIEvolutionEngine()
        self.database_migration_engine = DatabaseMigrationEngine()
        self.infrastructure_engine = InfrastructureEngine()
        self.validation_pipeline = ValidationPipeline()
        self.regression_risk_analyzer = RegressionRiskAnalyzer()
        self.rollback_planner = RollbackPlanner()
        self.code_review_assistant = CodeReviewAssistant()
        self.workflow_automation_engine = WorkflowAutomationEngine()
        self.issue_resolution_planner = IssueResolutionPlanner()
        self.tech_debt_sprint_generator = TechDebtSprintGenerator()
        self.feature_planner = FeatureImplementationPlanner()
        self.knowledge_update_engine = KnowledgeUpdateEngine()
        self.impact_report_engine = ChangeImpactReportEngine()
        self.release_preparation_engine = ReleasePreparationEngine()
        self.multi_agent_validation_engine = MultiAgentValidationEngine()
        self.metrics_dashboard_engine = EngineeringMetricsDashboardEngine()
        self.backlog_prioritizer_engine = AutonomousBacklogPrioritizer()
        self.continuous_improvement_loop = ContinuousImprovementLoop()
        self.sandbox_engine = SafeExecutionSandboxEngine()
        self.explainable_automation_engine = ExplainableAutomationEngine()
        self.human_approval_gateway = HumanApprovalGateway()
        self.pr_generator = PullRequestGenerator()

    def execute_autonomous_pipeline(
        self,
        db: Session,
        repo_id: str,
        request_text: str,
        priority_focus: str = "balanced",
        use_council: bool = True,
    ) -> Dict[str, Any]:
        """
        Execute the full autonomous engineering pipeline:
        Council → Task Plan → Execute Engines → Validate → Generate PR
        """
        pipeline_run_id = str(uuid.uuid4())
        started_at = datetime.now(timezone.utc)
        stages_log = []

        # ─── Stage 1: PLANNING ─────────────────────────────────────
        stages_log.append(
            {
                "stage": "PLANNING",
                "status": "running",
                "started_at": datetime.now(timezone.utc).isoformat(),
            }
        )

        council_result: Optional[Dict] = None
        if use_council:
            council_result = self.council_engine.deliberate(
                db=db,
                repo_id=repo_id,
                question=request_text,
                priority_focus=priority_focus,
            )
            tasks = self.task_planner.plan_from_council(
                db=db,
                repo_id=repo_id,
                council_result=council_result,
                pipeline_run_id=pipeline_run_id,
            )
        else:
            tasks = self.task_planner.plan_from_request(
                db=db,
                repo_id=repo_id,
                request_text=request_text,
                pipeline_run_id=pipeline_run_id,
            )

        stages_log[-1]["status"] = "completed"
        stages_log[-1]["tasks_created"] = len(tasks)

        # ─── Stage 2: EXECUTING ────────────────────────────────────
        stages_log.append(
            {
                "stage": "EXECUTING",
                "status": "running",
                "started_at": datetime.now(timezone.utc).isoformat(),
            }
        )

        execution_results = []
        for task in tasks:
            task.status = "executing"
            db.commit()

            engine_result = self._execute_engine(db, repo_id, task)
            execution_results.append(engine_result)

        stages_log[-1]["status"] = "completed"
        stages_log[-1]["tasks_executed"] = len(execution_results)

        # ─── Stage 3: VALIDATING ───────────────────────────────────
        stages_log.append(
            {
                "stage": "VALIDATING",
                "status": "running",
                "started_at": datetime.now(timezone.utc).isoformat(),
            }
        )

        validation_report = self.validation_pipeline.validate_changes(db, tasks)
        regression_risk = self.regression_risk_analyzer.analyze_risk(db, tasks)
        rollback_plan = self.rollback_planner.generate_rollback_plan(db, tasks)
        code_review = self.code_review_assistant.review_changes(db, tasks)
        impact_report = self.impact_report_engine.generate_impact_report(db, tasks)
        release_prep = self.release_preparation_engine.prepare_release(
            db, repo_id, tasks
        )
        multi_agent_val = self.multi_agent_validation_engine.validate_with_agents(
            db, repo_id, tasks
        )
        metrics_dashboard = self.metrics_dashboard_engine.get_dashboard_metrics(
            db, repo_id
        )
        prioritized_backlog = self.backlog_prioritizer_engine.prioritize_tasks(
            db, tasks
        )
        continuous_improvement = (
            self.continuous_improvement_loop.scan_for_opportunities(db, repo_id)
        )
        sandbox_execution = self.sandbox_engine.execute_in_sandbox(db, tasks)
        explainable_automation = [
            self.explainable_automation_engine.generate_explanation(db, t)
            for t in tasks
        ]
        approval_gateway = self.human_approval_gateway.enforce_approval_gate(
            db, pipeline_run_id, tasks
        )

        stages_log[-1]["status"] = "completed"
        stages_log[-1]["validation_result"] = validation_report["overall_status"]

        # ─── Stage 4: PR_READY ─────────────────────────────────────
        stages_log.append(
            {
                "stage": "PR_READY",
                "status": "running",
                "started_at": datetime.now(timezone.utc).isoformat(),
            }
        )

        pr_data = self.pr_generator.generate_pr(
            db=db,
            repo_id=repo_id,
            pipeline_run_id=pipeline_run_id,
            tasks=tasks,
            council_question=request_text,
        )

        stages_log[-1]["status"] = "completed"
        stages_log[-1]["pr_title"] = pr_data["title"]

        # ─── Stage 5: AWAITING_APPROVAL ────────────────────────────
        stages_log.append(
            {
                "stage": "AWAITING_APPROVAL",
                "status": "active",
                "started_at": datetime.now(timezone.utc).isoformat(),
            }
        )

        completed_at = datetime.now(timezone.utc)
        elapsed_seconds = (completed_at - started_at).total_seconds()

        return {
            "pipeline_run_id": pipeline_run_id,
            "repository_id": repo_id,
            "request": request_text,
            "current_stage": "AWAITING_APPROVAL",
            "stages": stages_log,
            "council_summary": (
                {
                    "consensus_score": council_result.get("consensus_score"),
                    "verdict": council_result.get("final_decision", {}).get(
                        "verdict_title"
                    ),
                    "top_recommendation": council_result.get("final_decision", {})
                    .get("top_decision", {})
                    .get("title"),
                }
                if council_result
                else None
            ),
            "tasks": [
                {
                    "id": t.id,
                    "type": t.task_type,
                    "title": t.title,
                    "description": t.description,
                    "priority": t.priority,
                    "status": t.status,
                    "estimated_effort": t.estimated_effort,
                    "confidence_score": t.confidence_score,
                    "files_affected": t.files_affected,
                }
                for t in tasks
            ],
            "execution_results": execution_results,
            "validation_report": validation_report,
            "regression_risk": regression_risk,
            "rollback_plan": rollback_plan,
            "code_review": code_review,
            "impact_report": impact_report,
            "release_preparation": release_prep,
            "multi_agent_validation": multi_agent_val,
            "engineering_metrics": metrics_dashboard,
            "prioritized_backlog": prioritized_backlog,
            "continuous_improvement": continuous_improvement,
            "sandbox_execution": sandbox_execution,
            "explainable_automation": explainable_automation,
            "human_approval_gateway": approval_gateway,
            "pull_request": pr_data,
            "elapsed_seconds": round(elapsed_seconds, 2),
            "principle": "AI never pushes directly to production. Human approval required.",
        }

    def _execute_engine(
        self, db: Session, repo_id: str, task: AutonomousTask
    ) -> Dict[str, Any]:
        """Route task to the appropriate execution engine."""
        engine_map = {
            "refactor": self.refactor_engine,
            "test": self.test_engine,
            "docs": self.docs_engine,
            "dependency": self.dependency_engine,
            "security": self.security_engine,
            "performance": self.performance_engine,
            "architecture": self.architecture_engine,
            "api_evolution": self.api_evolution_engine,
            "database": self.database_migration_engine,
            "infrastructure": self.infrastructure_engine,
        }

        engine = engine_map.get(task.task_type)
        if engine:
            return engine.execute(db, repo_id, task)

        # Fallback for unknown task types
        task.status = "validated"
        db.commit()
        return {
            "task_id": task.id,
            "task_type": task.task_type,
            "engine": "GenericEngine",
            "summary": f"Processed task: {task.title}",
        }

    def get_pipeline_tasks(
        self, db: Session, repo_id: str, pipeline_run_id: Optional[str] = None
    ) -> list:
        """Retrieve all autonomous tasks for a repository, optionally filtered by pipeline."""
        query = db.query(AutonomousTask).filter(AutonomousTask.repository_id == repo_id)
        if pipeline_run_id:
            query = query.filter(AutonomousTask.pipeline_run_id == pipeline_run_id)

        tasks = query.order_by(AutonomousTask.priority, AutonomousTask.created_at).all()

        return [
            {
                "id": t.id,
                "pipeline_run_id": t.pipeline_run_id,
                "type": t.task_type,
                "title": t.title,
                "description": t.description,
                "priority": t.priority,
                "status": t.status,
                "estimated_effort": t.estimated_effort,
                "confidence_score": t.confidence_score,
                "files_affected": t.files_affected,
                "generated_diff": t.generated_diff,
                "validation_result": t.validation_result,
                "pr_data": t.pr_data,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in tasks
        ]

    def approve_task(self, db: Session, task_id: str) -> Dict[str, Any]:
        """Human approves a task."""
        task = db.query(AutonomousTask).filter(AutonomousTask.id == task_id).first()
        if not task:
            return {"error": "Task not found"}

        task.status = "approved"
        db.commit()
        return {
            "task_id": task.id,
            "title": task.title,
            "status": "approved",
            "message": "Task approved by human reviewer. Ready for merge.",
        }

    def reject_task(
        self, db: Session, task_id: str, reason: str = ""
    ) -> Dict[str, Any]:
        """Human rejects a task."""
        task = db.query(AutonomousTask).filter(AutonomousTask.id == task_id).first()
        if not task:
            return {"error": "Task not found"}

        task.status = "rejected"
        db.commit()
        return {
            "task_id": task.id,
            "title": task.title,
            "status": "rejected",
            "reason": reason or "Rejected by human reviewer.",
        }

    def merge_pipeline(self, db: Session, pipeline_run_id: str) -> Dict[str, Any]:
        """Merge all approved tasks in a pipeline run."""
        tasks = (
            db.query(AutonomousTask)
            .filter(
                AutonomousTask.pipeline_run_id == pipeline_run_id,
                AutonomousTask.status == "approved",
            )
            .all()
        )

        if not tasks:
            return {
                "pipeline_run_id": pipeline_run_id,
                "status": "no_approved_tasks",
                "message": "No approved tasks found. Approve tasks before merging.",
            }

        for task in tasks:
            task.status = "merged"
        db.commit()

        return {
            "pipeline_run_id": pipeline_run_id,
            "status": "merged",
            "tasks_merged": len(tasks),
            "merged_tasks": [
                {"id": t.id, "title": t.title, "type": t.task_type} for t in tasks
            ],
            "message": (
                f"Successfully merged {len(tasks)} approved tasks. "
                f"Changes are now part of the main branch."
            ),
        }
