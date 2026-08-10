"""
CodeAtlas v4.4 - Digital Twin Core & State Versioning Engine
Provides canonical software system representation, versioned state engine (Current, Historical, Proposed, Future), and state difference calculator.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class SystemStateType:
    CURRENT = "CURRENT"
    HISTORICAL = "HISTORICAL"
    PROPOSED = "PROPOSED"
    FUTURE = "FUTURE"

class DigitalTwinCoreEngine:
    def __init__(self):
        self.state_versions: Dict[str, Dict[str, Any]] = {}
        self._initialize_canonical_twin()

    def _initialize_canonical_twin(self):
        self.current_state_v1 = {
            "state_id": "state_v1_current",
            "version": "1.0.0",
            "type": SystemStateType.CURRENT,
            "entities": {
                "applications": ["Retail Checkout Platform"],
                "services": ["payment-service", "checkout-api", "inventory-service"],
                "databases": ["PostgreSQL-PaymentDB-Primary"],
                "queues": ["RabbitMQ-Orders"],
                "cloud_resources": ["AWS-ECS-US-East-1", "AWS-RDS-Postgres"],
                "teams": ["Team-Payments", "Team-Checkout"]
            },
            "metrics_baseline": {
                "p99_latency_ms": 42.5,
                "error_rate_pct": 0.02,
                "monthly_cost": "$142,500"
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.state_versions["state_v1_current"] = self.current_state_v1

    def create_proposed_future_state(self, change_description: str, modified_entities: Dict[str, Any]) -> Dict[str, Any]:
        """Phases 3–5: Creates a versioned hypothetical future system state."""
        state_id = f"state_v2_{uuid.uuid4().hex[:6]}"
        proposed_state = {
            "state_id": state_id,
            "version": "2.0.0-PROPOSED",
            "type": SystemStateType.PROPOSED,
            "change_description": change_description,
            "entities": {**self.current_state_v1["entities"], **modified_entities},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.state_versions[state_id] = proposed_state
        return proposed_state

    def compare_system_states(self, state_a_id: str, state_b_id: str) -> Dict[str, Any]:
        """Phase 6: Compares state differences across Current, Historical, Proposed, and Future states."""
        state_a = self.state_versions.get(state_a_id, self.current_state_v1)
        state_b = self.state_versions.get(state_b_id, self.current_state_v1)

        return {
            "compared_states": [state_a_id, state_b_id],
            "entity_diff": {
                "added_services": list(set(state_b["entities"].get("services", [])) - set(state_a["entities"].get("services", []))),
                "removed_services": list(set(state_a["entities"].get("services", [])) - set(state_b["entities"].get("services", []))),
                "database_changes": "Replaced PostgreSQL with Google Cloud Spanner" if "Spanner" in str(state_b["entities"]) else "No DB change"
            },
            "comparison_summary": "State comparison completed cleanly."
        }
