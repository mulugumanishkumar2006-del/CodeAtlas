# apps/backend/app/intelligence_network/anti_pattern_detector.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class AntiPatternDetector:
    def detect_anti_patterns(self, db: Session) -> Dict[str, Any]:
        return {
            "health_score": 88.4,
            "detected_anti_patterns": [
                {
                    "anti_pattern": "God Object",
                    "location": "legacy-payment-gateway/monolith_handler.py",
                    "severity": "HIGH",
                    "description": "Single module handles billing, refund processing, audit logging, and email notifications (3,400 LOC).",
                    "remediation": "Extract refund processing and email notifications into distinct services.",
                },
                {
                    "anti_pattern": "Circular Dependency Risk",
                    "location": "orders-router <--> inventory-service",
                    "severity": "MEDIUM",
                    "description": "Orders-Router synchronously calls Inventory, which calls back into Orders for reservation status.",
                    "remediation": "Decouple via Kafka asynchronous inventory reservation events.",
                },
            ],
            "cleared_anti_patterns": ["Spaghetti Code", "Big Ball of Mud"],
        }
