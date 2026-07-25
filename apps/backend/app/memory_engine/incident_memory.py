# apps/backend/app/memory_engine/incident_memory.py

from typing import Any, Dict, List

from sqlalchemy.orm import Session


class IncidentMemoryEngine:
    def get_incident_memory(self, db: Session) -> List[Dict[str, Any]]:
        return [
            {
                "incident_id": "INC-882",
                "title": "Order Database Connection Pool Exhaustion",
                "date": "2026-02-04",
                "severity": "CRITICAL (SEV-1)",
                "root_cause": "Fulfillment status updates locked order rows during 2.5x traffic surge.",
                "resolution": "Applied query timeout limits and split fulfillment domain into autonomous worker service (PR #182).",
                "lessons_learned": "Never run long-running batch updates inside HTTP request handler transactions.",
            },
            {
                "incident_id": "INC-741",
                "title": "Auth Token Verification Latency Spike",
                "date": "2026-01-12",
                "severity": "HIGH (SEV-2)",
                "root_cause": "Permission verification re-fetched user profiles from DB on every single request.",
                "resolution": "Introduced Redis L2 write-through permission cache (PR #145).",
                "lessons_learned": "Stateless API tokens must leverage in-memory cache for user permission lookups.",
            },
        ]
