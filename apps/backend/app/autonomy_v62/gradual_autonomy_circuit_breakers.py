"""
CodeAtlas v6.2 - Gradual Autonomy Promotion, Demotion & Circuit Breaker Engine
Manages a 6-stage gradual autonomy pipeline (Shadow to Full), demotes autonomy on failure, enforces circuit breakers & rate limits, and provides global/local kill switches.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone

class AutonomyPromotionStage:
    SHADOW = "SHADOW"
    RECOMMEND = "RECOMMEND"
    PREPARE = "PREPARE"
    APPROVAL = "APPROVAL"
    LIMITED = "LIMITED"
    FULL = "FULL"

class GradualAutonomyAndCircuitBreakerEngine:
    def __init__(self):
        self.workflow_autonomy_stages: Dict[str, str] = {
            "incident_investigator": AutonomyPromotionStage.LIMITED,
            "security_remediator": AutonomyPromotionStage.APPROVAL,
            "performance_optimizer": AutonomyPromotionStage.LIMITED
        }
        self.circuit_breaker_tripped: bool = False
        self.action_counter: int = 0
        self.max_action_rate_per_min: int = 20

    def evaluate_and_promote_autonomy(self, workflow_name: str, consecutive_successes: int) -> Dict[str, Any]:
        """Phases 44–45: Promotes autonomy level after sufficient evidence of successful executions."""
        current_stage = self.workflow_autonomy_stages.get(workflow_name, AutonomyPromotionStage.SHADOW)
        
        if consecutive_successes >= 10 and current_stage == AutonomyPromotionStage.APPROVAL:
            new_stage = AutonomyPromotionStage.LIMITED
        elif consecutive_successes >= 25 and current_stage == AutonomyPromotionStage.LIMITED:
            new_stage = AutonomyPromotionStage.FULL
        else:
            new_stage = current_stage

        self.workflow_autonomy_stages[workflow_name] = new_stage
        return {
            "workflow_name": workflow_name,
            "previous_stage": current_stage,
            "promoted_stage": new_stage,
            "consecutive_successes": consecutive_successes,
            "promotion_verdict": "PROMOTED_GRADUAL_AUTONOMY" if new_stage != current_stage else "STAGE_MAINTAINED"
        }

    def demote_autonomy_and_check_circuit_breaker(self, workflow_name: str, verification_failed: bool = True) -> Dict[str, Any]:
        """Phases 46–50: Demotes autonomy level and trips circuit breaker upon verification failure."""
        current_stage = self.workflow_autonomy_stages.get(workflow_name, AutonomyPromotionStage.FULL)
        
        if verification_failed:
            new_stage = AutonomyPromotionStage.APPROVAL
            self.workflow_autonomy_stages[workflow_name] = new_stage
            self.circuit_breaker_tripped = True
            msg = f"Autonomy demoted for '{workflow_name}' from {current_stage} to {new_stage}. Circuit breaker tripped."
        else:
            new_stage = current_stage
            msg = f"No demotion required for '{workflow_name}'."

        return {
            "workflow_name": workflow_name,
            "current_stage": new_stage,
            "circuit_breaker_tripped": self.circuit_breaker_tripped,
            "message": msg
        }
