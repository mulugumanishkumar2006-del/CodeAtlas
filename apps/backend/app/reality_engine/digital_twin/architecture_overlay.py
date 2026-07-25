# apps/backend/app/reality_engine/digital_twin/architecture_overlay.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class LiveArchitectureOverlay:
    def get_architecture_overlay(self, db: Session) -> Dict[str, Any]:
        return {
            "overlay_status": "REALTIME_METRICS_OVERLAY_ACTIVE",
            "nodes_with_overlay": [
                {
                    "id": "node-auth",
                    "name": "Auth Vault Service",
                    "type": "Microservice",
                    "metrics_overlay": {
                        "cpu": "24.5%",
                        "mem": "42.0%",
                        "qps": 12000,
                        "p95": "14ms",
                        "status": "RUNNING",
                    },
                },
                {
                    "id": "node-checkout",
                    "name": "Checkout API",
                    "type": "Microservice",
                    "metrics_overlay": {
                        "cpu": "78.0%",
                        "mem": "64.2%",
                        "qps": 6500,
                        "p95": "42ms",
                        "status": "SCALING",
                    },
                },
                {
                    "id": "node-payment",
                    "name": "Legacy Payment Gateway",
                    "type": "Microservice",
                    "metrics_overlay": {
                        "cpu": "91.2%",
                        "mem": "82.5%",
                        "qps": 1200,
                        "p95": "1800ms",
                        "status": "DEGRADED",
                    },
                },
                {
                    "id": "node-db",
                    "name": "Postgres Primary DB",
                    "type": "Database",
                    "metrics_overlay": {
                        "cpu": "62.0%",
                        "mem": "78.4%",
                        "qps": 4200,
                        "p95": "4ms",
                        "status": "RUNNING",
                    },
                },
            ],
        }
