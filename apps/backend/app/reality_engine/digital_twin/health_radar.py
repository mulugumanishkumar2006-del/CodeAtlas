# apps/backend/app/reality_engine/digital_twin/health_radar.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class ServiceHealthRadar:
    def get_health_radar(self, db: Session) -> Dict[str, Any]:
        return {
            "radar_dimensions": [
                "Availability",
                "Latency",
                "Error Rate",
                "Security",
                "Saturation",
            ],
            "service_radars": [
                {
                    "service": "auth-vault-service",
                    "overall_radar_score": 98.2,
                    "scores": {
                        "Availability": 100.0,
                        "Latency": 98.0,
                        "Error Rate": 99.9,
                        "Security": 98.5,
                        "Saturation": 94.6,
                    },
                    "rating": "EXCELLENT",
                },
                {
                    "service": "checkout-api",
                    "overall_radar_score": 88.4,
                    "scores": {
                        "Availability": 99.2,
                        "Latency": 82.0,
                        "Error Rate": 97.6,
                        "Security": 94.0,
                        "Saturation": 69.2,
                    },
                    "rating": "GOOD",
                },
                {
                    "service": "legacy-payment-gateway",
                    "overall_radar_score": 64.8,
                    "scores": {
                        "Availability": 88.0,
                        "Latency": 42.0,
                        "Error Rate": 68.4,
                        "Security": 54.0,
                        "Saturation": 71.6,
                    },
                    "rating": "DEGRADED_CRITICAL",
                },
            ],
        }
