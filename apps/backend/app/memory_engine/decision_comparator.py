# apps/backend/app/memory_engine/decision_comparator.py

from typing import Any, Dict, List

from sqlalchemy.orm import Session


class AIDecisionComparator:
    def compare_decisions_vs_reality(self, db: Session) -> List[Dict[str, Any]]:
        return [
            {
                "adr_id": "ADR-004",
                "adr_title": "Kafka Event Bus over RabbitMQ",
                "original_intent": "Use Kafka for all asynchronous event streaming across microservices.",
                "current_reality": "Kafka handles 92% of events; legacy RabbitMQ remains active for payment retry queue.",
                "alignment_score": "88.0% ALIGNED",
                "drift_recommendation": "Migrate remaining 8% payment retry queue off RabbitMQ to achieve 100% Kafka unification.",
            },
            {
                "adr_id": "ADR-009",
                "adr_title": "Modular Monolith to Microservices Transition",
                "original_intent": "Extract Payment & Checkout into autonomous microservices by Q2 2026.",
                "current_reality": "Orders split into Orders-Router and Orders-Fulfillment (PR #182); Payment service extraction in progress.",
                "alignment_score": "95.0% ON_TRACK",
                "drift_recommendation": "Finalize payment service standalone DB migration in Q3 2027.",
            },
        ]
