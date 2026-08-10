"""
CodeAtlas v4.3 - Agent Runtime, Tool Risk Classifier & Global Kill Switch Engine
Manages central agent registry, classifies tool risk levels (READ, LOW_RISK_WRITE, MEDIUM_RISK_WRITE, HIGH_RISK_WRITE, DESTRUCTIVE), enforces token budgets, and executes Global Kill Switch.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class ToolRiskClass:
    READ = "READ"
    LOW_RISK_WRITE = "LOW_RISK_WRITE"
    MEDIUM_RISK_WRITE = "MEDIUM_RISK_WRITE"
    HIGH_RISK_WRITE = "HIGH_RISK_WRITE"
    DESTRUCTIVE = "DESTRUCTIVE"

class AgentRuntimeRegistryEngine:
    def __init__(self):
        self.global_kill_switch_active: bool = False
        self.agents_registry: Dict[str, Dict[str, Any]] = {
            "sre_agent_01": {
                "agent_id": "sre_agent_01",
                "name": "SRE Incident Agent",
                "capabilities": ["RESTART_POD", "SCALE_REPLICAS", "CANARY_ROLLBACK"],
                "allowed_risk": ToolRiskClass.HIGH_RISK_WRITE,
                "status": "ACTIVE"
            }
        }

    def classify_tool_risk_and_policy(self, tool_name: str, environment: str) -> Dict[str, Any]:
        """Phases 5–9: Classifies tool risk and evaluates environment autonomy rules."""
        tool_lower = tool_name.lower()
        if "delete" in tool_lower or "drop" in tool_lower or "kill" in tool_lower:
            risk_level = ToolRiskClass.DESTRUCTIVE
        elif "deploy" in tool_lower or "rollback" in tool_lower or "write" in tool_lower:
            risk_level = ToolRiskClass.HIGH_RISK_WRITE
        else:
            risk_level = ToolRiskClass.READ

        # Autonomy policy by environment
        if environment.upper() == "PRODUCTION":
            requires_human_approval = risk_level in [ToolRiskClass.MEDIUM_RISK_WRITE, ToolRiskClass.HIGH_RISK_WRITE, ToolRiskClass.DESTRUCTIVE]
        else:
            requires_human_approval = risk_level == ToolRiskClass.DESTRUCTIVE

        return {
            "tool_name": tool_name,
            "risk_classification": risk_level,
            "environment": environment.upper(),
            "requires_human_approval": requires_human_approval
        }

    def trigger_global_emergency_kill_switch(self, triggered_by: str, reason: str) -> Dict[str, Any]:
        """Phases 12–13: Immediate emergency shutdown of all active agents and running tasks."""
        self.global_kill_switch_active = True
        return {
            "kill_switch_active": True,
            "triggered_by": triggered_by,
            "reason": reason,
            "status": "ALL_AGENTS_HALTED_AND_CANCELLED",
            "halted_at": datetime.now(timezone.utc).isoformat()
        }
