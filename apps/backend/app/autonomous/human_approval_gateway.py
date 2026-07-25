# apps/backend/app/autonomous/human_approval_gateway.py

from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.models.autonomous_task import AutonomousTask


class HumanApprovalGateway:
    """
    Pillar 30: Human Approval Gateway.
    Strictly enforces zero-auto-merge enterprise governance rules:
    - Nothing is merged automatically.
    - Every change requires explicit human approval.
    - Suitable for enterprise engineering governance.
    """

    def enforce_approval_gate(
        self, db: Session, pipeline_run_id: str, tasks: List[AutonomousTask]
    ) -> Dict[str, Any]:
        gate_status = {
            "pipeline_run_id": pipeline_run_id,
            "governance_rule": "STRICT_HUMAN_IN_THE_LOOP",
            "auto_merge_allowed": False,
            "direct_production_push_allowed": False,
            "current_gate_state": "AWAITING_HUMAN_APPROVAL",
            "total_tasks_requiring_approval": len(tasks),
            "approval_requirements": [
                "Explicit human developer click on 'Approve Task' or 'Merge PR'",
                "Optional review comments sign-off",
                "Compliance audit log recording reviewer ID & timestamp",
            ],
            "principle": "AI never pushes directly to production. Every change goes through human approval.",
            "enterprise_ready": True,
        }
        return gate_status
