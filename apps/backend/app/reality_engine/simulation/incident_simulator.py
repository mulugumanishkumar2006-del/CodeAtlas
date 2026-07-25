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

    def get_incident_timeline(self, db: Session) -> Dict[str, Any]:
        return {
            "active_incidents_count": 1,
            "resolved_incidents_24h": 2,
            "timeline": [
                {
                    "id": "inc-402",
                    "status": "ACTIVE",
                    "severity": "HIGH",
                    "target_service": "legacy-payment-gateway",
                    "title": "p95 Latency Spike to 1800ms",
                    "started_at": "12 mins ago",
                    "root_cause_summary": "DB Connection Pool Exhaustion due to missing index.",
                    "recovery_status": "RECOVERING (Mitigation applied)",
                    "estimated_recovery_mins": 4,
                },
                {
                    "id": "inc-401",
                    "status": "RESOLVED",
                    "severity": "MEDIUM",
                    "target_service": "redis-l2-cache-cluster",
                    "title": "Cache Node Memory Pressure (88%)",
                    "started_at": "4 hours ago",
                    "resolved_at": "3 hours ago",
                    "root_cause_summary": "Unbounded key TTL in analytics queue.",
                    "recovery_status": "RESOLVED",
                    "estimated_recovery_mins": 15,
                },
                {
                    "id": "inc-400",
                    "status": "RESOLVED",
                    "severity": "LOW",
                    "target_service": "orders-router",
                    "title": "Transient gRPC Connection Drop",
                    "started_at": "18 hours ago",
                    "resolved_at": "18 hours ago",
                    "root_cause_summary": "Kubernetes node rolling restart.",
                    "recovery_status": "RESOLVED",
                    "estimated_recovery_mins": 2,
                },
            ],
        }
