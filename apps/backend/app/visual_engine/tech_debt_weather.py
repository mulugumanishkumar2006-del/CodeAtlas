# apps/backend/app/visual_engine/tech_debt_weather.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class TechDebtWeatherEngine:
    """
    Feature 3: Technical Debt Weather
    Feature 6: Live Heartbeat
    Feature 15: NASA Mission Control
    """

    WEATHER_STATES = {
        "HEALTHY": {"icon": "☀", "condition": "Sunny & Clear Code", "color": "emerald"},
        "MODERATE": {
            "icon": "⛅",
            "condition": "Partly Cloudy (Moderate Debt)",
            "color": "amber",
        },
        "DEBT": {
            "icon": "🌧",
            "condition": "Rainy (Increasing Technical Debt)",
            "color": "orange",
        },
        "CRITICAL": {
            "icon": "🌩",
            "condition": "Thunderstorm (Critical Debt)",
            "color": "red",
        },
        "INCIDENT_RISK": {
            "icon": "🔥",
            "condition": "Fire Hazard (Incident Risk)",
            "color": "rose",
        },
    }

    def get_weather_forecast(self, db: Session) -> Dict[str, Any]:
        return {
            "overall_weather": self.WEATHER_STATES["MODERATE"],
            "repository_forecasts": [
                {
                    "repo": "auth-service-v1",
                    "state": "HEALTHY",
                    "weather": self.WEATHER_STATES["HEALTHY"],
                },
                {
                    "repo": "checkout-service",
                    "state": "MODERATE",
                    "weather": self.WEATHER_STATES["MODERATE"],
                },
                {
                    "repo": "analytics-ingestion-worker",
                    "state": "DEBT",
                    "weather": self.WEATHER_STATES["DEBT"],
                },
                {
                    "repo": "legacy-payment-gateway",
                    "state": "CRITICAL",
                    "weather": self.WEATHER_STATES["CRITICAL"],
                },
            ],
            "atmospheric_pressure": "1013.25 hPa (Stable)",
            "humidity": "64% Tech Debt Density",
        }

    def get_service_heartbeats(self, db: Session) -> Dict[str, Any]:
        return {
            "total_services": 4,
            "all_healthy": True,
            "services": [
                {
                    "name": "Auth Vault",
                    "status": "HEALTHY",
                    "pulse": "❤️ ❤️ ❤️ ❤️",
                    "latency_ms": 18,
                    "rpm": 45000,
                },
                {
                    "name": "Checkout API",
                    "status": "HEALTHY",
                    "pulse": "❤️ ❤️ ❤️",
                    "latency_ms": 42,
                    "rpm": 18500,
                },
                {
                    "name": "Orders Router",
                    "status": "SLOW",
                    "pulse": "❤️ ❤️",
                    "latency_ms": 140,
                    "rpm": 12000,
                },
                {
                    "name": "Payment Gateway",
                    "status": "FAILURE_RISK",
                    "pulse": "💔",
                    "latency_ms": 480,
                    "rpm": 2400,
                },
            ],
        }

    def get_mission_control_data(self, db: Session) -> Dict[str, Any]:
        return {
            "system_status": "MISSION CONTROL OPERATIONAL",
            "repository_health_pct": "93.0%",
            "active_incidents_count": 0,
            "technical_debt_pct": "12.0%",
            "deployments_today": 5,
            "architecture_drift_pct": "2.0%",
            "scaling_risk": "LOW",
            "ai_recommendations_count": 7,
            "nasa_widget_gauges": {
                "core_temperature": "Optimal (38°C)",
                "telemetry_link": "CONNECTED 100%",
                "fuel_reserves": "94.5% Sprint Capacity",
            },
        }
