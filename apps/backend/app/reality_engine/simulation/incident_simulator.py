# apps/backend/app/reality_engine/simulation/incident_simulator.py

from typing import Any, Dict

from app.models.reality_twin import IncidentSimulationRecord
from sqlalchemy.orm import Session


class IncidentSimulator:
    def simulate_incident(
        self, db: Session, target_service: str = "auth-service-v1"
    ) -> Dict[str, Any]:
        record = IncidentSimulationRecord(
            simulation_type="ServiceOutage",
            target_service=target_service,
            blast_radius_summary=f"Disruption to {target_service} affects Checkout & Payment API.",
            predicted_downtime_mins=12,
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "simulation_id": record.id,
            "target_service": target_service,
            "simulated_scenario": "Primary Node Outage",
            "blast_radius": [
                "checkout-service (DEGRADED)",
                "orders-router (DEGRADED)",
            ],
            "estimated_recovery_time_mins": 12,
            "recommended_mitigation": "Enable automated multi-region Failover to Auth Replica Vault.",
        }
