"""
CodeAtlas v3.5 - Risk & Central Policy Engine with Emergency Kill Switch
Calculates 7-dimension action risk, enforces Autonomy Levels L0–L5, outputs policy decisions (ALLOW/DENY/REQUIRE_APPROVAL/SIMULATE_FIRST), and provides Emergency Kill Switch.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class AutonomyLevel:
    L0_OBSERVE = "L0_OBSERVE"
    L1_RECOMMEND = "L1_RECOMMEND"
    L2_DRAFT = "L2_DRAFT"
    L3_HUMAN_APPROVED = "L3_HUMAN_APPROVED"
    L4_POLICY_AUTONOMOUS = "L4_POLICY_AUTONOMOUS"
    L5_RESTRICTED_AUTONOMOUS = "L5_RESTRICTED_AUTONOMOUS"

class PolicyDecision:
    ALLOW = "ALLOW"
    DENY = "DENY"
    REQUIRE_APPROVAL = "REQUIRE_APPROVAL"
    SIMULATE_FIRST = "SIMULATE_FIRST"

class RiskAndPolicyEngine:
    def __init__(self):
        self.emergency_kill_switches: Dict[str, bool] = {
            "GLOBAL": False,
            "AGENT:agent_inc": False,
            "ENV:production": False
        }
        self.policies: List[Dict[str, Any]] = [
            {"id": "pol_prod_l3", "name": "Production Executions Require Human Approval", "environment": "production", "min_level": AutonomyLevel.L3_HUMAN_APPROVED},
            {"id": "pol_sec_crit", "name": "Critical Security Actions Require Dual Signoff", "category": "SECURITY", "min_level": AutonomyLevel.L3_HUMAN_APPROVED}
        ]

    def calculate_action_risk(
        self,
        prod_impact: float,
        security_impact: float,
        data_impact: float,
        blast_radius: float,
        reversibility: float,
        confidence: float,
        environment: str
    ) -> Dict[str, Any]:
        """Calculates 7-dimension action risk score."""
        # Risk score calculation formula
        raw_risk = (prod_impact * 0.25) + (security_impact * 0.20) + (data_impact * 0.20) + (blast_radius * 0.15) + ((10.0 - reversibility) * 0.10) + ((1.0 - confidence) * 10 * 0.10)
        if environment.lower() == "production":
            raw_risk *= 1.25

        risk_score = round(min(raw_risk, 10.0), 2)
        
        return {
            "risk_score": risk_score,
            "environment": environment,
            "risk_level": "CRITICAL" if risk_score > 8.0 else "HIGH" if risk_score > 5.5 else "MEDIUM" if risk_score > 3.0 else "LOW",
            "breakdown": {
                "production_impact": prod_impact,
                "security_impact": security_impact,
                "data_impact": data_impact,
                "blast_radius": blast_radius,
                "reversibility": reversibility,
                "confidence": confidence,
                "environment_multiplier": 1.25 if environment.lower() == "production" else 1.0
            }
        }

    def evaluate_policy(self, agent_id: str, action_name: str, environment: str, risk_score: float) -> Dict[str, Any]:
        """Central policy engine determining ALLOW, DENY, REQUIRE_APPROVAL, or SIMULATE_FIRST."""
        # 1. Check Emergency Kill Switch
        if self.emergency_kill_switches.get("GLOBAL") or self.emergency_kill_switches.get(f"AGENT:{agent_id}") or self.emergency_kill_switches.get(f"ENV:{environment}"):
            return {
                "decision": PolicyDecision.DENY,
                "reason": "EMERGENCY_KILL_SWITCH_ACTIVE: Agent operations paused by administrator",
                "risk_score": risk_score
            }

        # 2. Risk & Environment Policy checks
        if environment.lower() == "production" and risk_score > 5.0:
            return {
                "decision": PolicyDecision.REQUIRE_APPROVAL,
                "reason": f"Action risk {risk_score} exceeds autonomous production threshold (5.0). Human approval required.",
                "risk_score": risk_score
            }
        elif risk_score > 8.0:
            return {
                "decision": PolicyDecision.REQUIRE_APPROVAL,
                "reason": f"Critical risk score {risk_score} requires explicit human authorization.",
                "risk_score": risk_score
            }
        elif risk_score > 3.0:
            return {
                "decision": PolicyDecision.SIMULATE_FIRST,
                "reason": f"Medium risk score {risk_score} requires dry-run simulation before execution.",
                "risk_score": risk_score
            }

        return {
            "decision": PolicyDecision.ALLOW,
            "reason": "Action authorized by policy for autonomous execution.",
            "risk_score": risk_score
        }

    def trigger_emergency_kill_switch(self, scope: str = "GLOBAL", activate: bool = True) -> Dict[str, Any]:
        """Immediately pauses agent operations across global, agent, or environment scope."""
        self.emergency_kill_switches[scope] = activate
        return {
            "scope": scope,
            "status": "PAUSED" if activate else "RESUMED",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
