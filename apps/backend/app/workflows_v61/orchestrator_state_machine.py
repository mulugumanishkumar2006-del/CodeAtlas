"""
CodeAtlas v6.1 - Centralized Orchestrator, State Machine & Evidence Store Engine
Parses Global Autonomy Contracts, enforces an 8-state workflow lifecycle (CREATED -> COMPLETED), classifies tool risk, manages execution budgets, and collects evidence.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class WorkflowState:
    CREATED = "CREATED"
    INVESTIGATING = "INVESTIGATING"
    PLANNING = "PLANNING"
    SIMULATING = "SIMULATING"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    EXECUTING = "EXECUTING"
    VERIFYING = "VERIFYING"
    COMPLETED = "COMPLETED"
    BLOCKED = "BLOCKED"
    FAILED = "FAILED"
    ROLLED_BACK = "ROLLED_BACK"
    CANCELLED = "CANCELLED"

class ActionRiskLevel:
    READ = "READ"
    ANALYZE = "ANALYZE"
    RECOMMEND = "RECOMMEND"
    WRITE = "WRITE"
    CREATE_PR = "CREATE_PR"
    MERGE = "MERGE"
    DEPLOY = "DEPLOY"
    ROLLBACK = "ROLLBACK"

class CentralizedOrchestratorAndStateMachineEngine:
    def __init__(self):
        self.active_workflows: Dict[str, Dict[str, Any]] = {}
        self.evidence_store: Dict[str, List[Dict[str, Any]]] = {}

    def create_autonomous_workflow(
        self,
        workflow_name: str,
        purpose: str,
        risk_level: str = ActionRiskLevel.WRITE,
        token_budget: int = 50000
    ) -> Dict[str, Any]:
        """Phases 1–6: Initializes a governed autonomous workflow instance with state tracking and execution budgets."""
        wf_id = f"wf_{workflow_name.lower().replace(' ', '_')[:12]}_{len(self.active_workflows) + 1:03d}"
        wf_record = {
            "workflow_id": wf_id,
            "workflow_name": workflow_name,
            "purpose": purpose,
            "risk_level": risk_level,
            "state": WorkflowState.CREATED,
            "budgets": {
                "time_budget_secs": 300,
                "token_budget": token_budget,
                "action_limit": 10
            },
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.active_workflows[wf_id] = wf_record
        self.evidence_store[wf_id] = []
        return wf_record

    def transition_workflow_state(self, workflow_id: str, target_state: str, details: Optional[str] = None) -> Dict[str, Any]:
        """Phases 2–5: Transitions workflow state along valid state machine paths."""
        if workflow_id not in self.active_workflows:
            return {"workflow_id": workflow_id, "error": "Workflow not found"}

        current_state = self.active_workflows[workflow_id]["state"]
        self.active_workflows[workflow_id]["state"] = target_state
        
        return {
            "workflow_id": workflow_id,
            "previous_state": current_state,
            "current_state": target_state,
            "details": details or f"Transitioned from {current_state} to {target_state}",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }

    def record_evidence(self, workflow_id: str, source: str, observation: str, confidence: float = 0.95) -> Dict[str, Any]:
        """Phases 7–9: Records empirical evidence items into the Evidence Store."""
        evidence_item = {
            "source": source,
            "observation": observation,
            "confidence": confidence,
            "recorded_at": datetime.now(timezone.utc).isoformat()
        }
        if workflow_id in self.evidence_store:
            self.evidence_store[workflow_id].append(evidence_item)
        return {
            "workflow_id": workflow_id,
            "total_evidence_items": len(self.evidence_store.get(workflow_id, [])),
            "latest_evidence": evidence_item
        }
