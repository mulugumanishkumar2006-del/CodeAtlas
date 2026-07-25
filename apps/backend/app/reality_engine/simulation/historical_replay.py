# apps/backend/app/reality_engine/simulation/historical_replay.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class HistoricalReplayEngine:
    def replay_incident(
        self, db: Session, incident_id: str = "inc-402"
    ) -> Dict[str, Any]:
        return {
            "incident_id": incident_id,
            "title": "Incident #402: Latency Spike & DB Connection Pool Exhaustion",
            "duration_minutes": 14,
            "minute_snapshots": [
                {
                    "min": 0,
                    "event": "Deployment v2.4.1 synced by ArgoCD",
                    "latency_p95": "45ms",
                    "errors": "0.01%",
                    "status": "RUNNING",
                },
                {
                    "min": 3,
                    "event": "Unindexed SQL query execution begins",
                    "latency_p95": "180ms",
                    "errors": "0.10%",
                    "status": "SCALING",
                },
                {
                    "min": 6,
                    "event": "Postgres DB Connection Pool reaches 100% saturation",
                    "latency_p95": "940ms",
                    "errors": "4.20%",
                    "status": "DEGRADED",
                },
                {
                    "min": 10,
                    "event": "Prometheus & Datadog trigger High Severity Incident #402",
                    "latency_p95": "1800ms",
                    "errors": "14.2%",
                    "status": "FAILED",
                },
                {
                    "min": 14,
                    "event": "Auto-remediation applies DB index and expands pool limit",
                    "latency_p95": "48ms",
                    "errors": "0.01%",
                    "status": "RECOVERED",
                },
            ],
        }
