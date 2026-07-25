# apps/backend/app/reality_engine/prediction/anomaly_detector.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class AnomalyDetector:
    def detect_anomalies(self, db: Session) -> Dict[str, Any]:
        return {
            "anomalies_detected_count": 1,
            "anomalies": [
                {
                    "id": "anom-1",
                    "metric": "p95 Latency Spike",
                    "service": "analytics-ingestion-worker",
                    "baseline": "42ms",
                    "current": "140ms",
                    "severity": "WARNING",
                    "root_cause_hypothesis": "Unindexed database query on events_raw table.",
                }
            ],
        }
