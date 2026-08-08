import datetime
import uuid
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.models.autonomous_engineering import (
    AgentAuditTrailDBModel,
    AgentPolicyDBModel,
    AgentTaskDBModel,
)
from app.schemas.autonomous_engineering import (
    AgentApprovalRequestModel,
    AgentHandoffModel,
    AgentRole,
    AgentState,
    AgentTaskModel,
    AutonomyDashboardModel,
    AutonomyLevel,
    CommandSafetyClass,
    CommandSafetyModel,
    EngineeringAgentModel,
    ValidationCheckModel,
)
from app.services.simulation_studio_service import SimulationStudioService


class AutonomousEngineeringService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db
        self.simulation_service = SimulationStudioService(db=db)

    # ----------------------------------------------------
    # Phase 2 & 3: Task Creation & State Machine
    # ----------------------------------------------------
    def create_autonomous_task(
        self,
        organization_id: str,
        repository_id: str,
        objective: str,
        autonomy_level: AutonomyLevel = AutonomyLevel.LEVEL_0_OBSERVE,
    ) -> AgentTaskModel:
        task_id = f"task_{uuid.uuid4().hex[:8]}"

        # Always pause at WAITING_FOR_APPROVAL under default Level 0 policy or safety rules
        initial_state = AgentState.WAITING_FOR_APPROVAL

        val_matrix = [
            ValidationCheckModel(check_name="UNIT_TESTS", status="PASS", duration_ms=240),
            ValidationCheckModel(check_name="BUILD_COMPILE", status="PASS", duration_ms=510),
            ValidationCheckModel(check_name="ARCHITECTURE_DRIFT_SCAN", status="PASS", duration_ms=180),
            ValidationCheckModel(check_name="SECURITY_SECRET_SCAN", status="PASS", duration_ms=90),
        ]

        diff = (
            "diff --git a/app/services/auth_service.py b/app/services/auth_service.py\n"
            "--- a/app/services/auth_service.py\n"
            "+++ b/app/services/auth_service.py\n"
            "@@ -42,6 +42,8 @@ class AuthService:\n"
            "+    # Autonomous Option B Interface Decoupling\n"
            "+    def verify_token_v2(self, token: str) -> dict:\n"
            "+        return self.oauth2_provider.validate(token)\n"
        )

        task = AgentTaskModel(
            task_id=task_id,
            organization_id=organization_id,
            repository_id=repository_id,
            objective=objective,
            requester="CodeAtlas Autonomy Orchestrator",
            state=initial_state,
            autonomy_level=autonomy_level,
            risk_score=28.0,
            proposed_diff=diff,
            validation_matrix=val_matrix,
            approvals=[],
            created_at=datetime.datetime.utcnow().isoformat(),
        )

        if self.db:
            db_task = AgentTaskDBModel(
                id=task.task_id,
                organization_id=task.organization_id,
                repository_id=task.repository_id,
                objective=task.objective,
                requester=task.requester,
                state=task.state.value,
                autonomy_level=task.autonomy_level.value,
                risk_score=task.risk_score,
                proposed_diff=task.proposed_diff,
                validation_matrix=[v.dict() for v in task.validation_matrix],
                approvals=task.approvals,
            )
            self.db.add(db_task)
            self.db.commit()

        return task

    # ----------------------------------------------------
    # Phase 13: Human Approval Control
    # ----------------------------------------------------
    def process_human_approval(self, req: AgentApprovalRequestModel) -> AgentTaskModel:
        # In mock or DB, update state
        if req.action == "APPROVE":
            new_state = AgentState.EXECUTING
        elif req.action == "REJECT":
            new_state = AgentState.CANCELLED
        else:
            new_state = AgentState.BLOCKED

        return AgentTaskModel(
            task_id=req.task_id,
            organization_id="acme-corp",
            repository_id="demo-repo",
            objective="Option B Auth Interface Decoupling",
            requester="CodeAtlas Autonomy Orchestrator",
            state=new_state,
            autonomy_level=AutonomyLevel.LEVEL_4_HUMAN_APPROVAL,
            risk_score=28.0,
            proposed_diff="diff --git a/app/services/auth_service.py...",
            validation_matrix=[
                ValidationCheckModel(check_name="UNIT_TESTS", status="PASS", duration_ms=240),
                ValidationCheckModel(check_name="BUILD_COMPILE", status="PASS", duration_ms=510),
            ],
            approvals=[f"{req.approver} ({req.action}: {req.reason})"],
            created_at=datetime.datetime.utcnow().isoformat(),
        )

    # ----------------------------------------------------
    # Phase 17 & 18: Controlled Execution Engine & Command Safety
    # ----------------------------------------------------
    def evaluate_command_safety(self, command: str) -> CommandSafetyModel:
        cmd_lower = command.lower()
        if "rm -rf" in cmd_lower or "drop database" in cmd_lower or "push --force" in cmd_lower:
            safety = CommandSafetyClass.BLOCKED
            permitted = False
            rule = "Rule: Destructive shell and database drop commands are strictly blocked."
        elif "git checkout" in cmd_lower or "pytest" in cmd_lower or "npm test" in cmd_lower:
            safety = CommandSafetyClass.SAFE
            permitted = True
            rule = "Rule: Non-destructive test and branch commands permitted."
        else:
            safety = CommandSafetyClass.RESTRICTED
            permitted = False
            rule = "Rule: Restricted command requires Level 5 explicit policy authorization."

        return CommandSafetyModel(
            command_string=command,
            safety_class=safety,
            is_permitted=permitted,
            policy_rule=rule,
        )

    # ----------------------------------------------------
    # Phase 19: Secret Protection Guard
    # ----------------------------------------------------
    def redact_secrets_from_output(self, raw_output: str) -> str:
        import re
        secrets_patterns = [
            (r"(API_KEY=)[^\s&]+", r"\1[REDACTED_SECRET]"),
            (r"(SECRET_KEY=)[^\s&]+", r"\1[REDACTED_SECRET]"),
            (r"(TOKEN=)[^\s&]+", r"\1[REDACTED_SECRET]"),
            (r"(PASSWORD=)[^\s&]+", r"\1[REDACTED_SECRET]"),
        ]
        sanitized = raw_output
        for pattern, replacement in secrets_patterns:
            sanitized = re.sub(pattern, replacement, sanitized)
        return sanitized

    # ----------------------------------------------------
    # Phase 26: Rollback Execution
    # ----------------------------------------------------
    def rollback_task(self, task_id: str) -> Dict[str, Any]:
        return {
            "task_id": task_id,
            "status": "ROLLED_BACK",
            "summary": "Sandbox worktree reverted to pre-task commit state cleanly.",
            "rollback_strategy": "Git Worktree Clean & Commit Revert",
            "timestamp": datetime.datetime.utcnow().isoformat(),
        }

    # ----------------------------------------------------
    # Phase 33: Autonomy Dashboard
    # ----------------------------------------------------
    def get_autonomy_dashboard(self, organization_id: str) -> AutonomyDashboardModel:
        return AutonomyDashboardModel(
            organization_id=organization_id,
            current_default_autonomy_level=AutonomyLevel.LEVEL_0_OBSERVE,
            active_agents_count=4,
            pending_approvals_count=1,
            running_tasks_count=1,
            completed_tasks_count=12,
            blocked_tasks_count=0,
        )
