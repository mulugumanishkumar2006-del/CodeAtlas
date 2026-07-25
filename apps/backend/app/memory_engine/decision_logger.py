# apps/backend/app/memory_engine/decision_logger.py

from typing import Any, Dict, List

from sqlalchemy.orm import Session


class ADRManager:
    def list_architecture_decisions(self, db: Session) -> List[Dict[str, Any]]:
        return [
            {
                "id": "ADR-001",
                "title": "Adoption of FastAPI & Next.js Stack",
                "status": "ACCEPTED",
                "date": "2025-08-01",
                "rationale": "High productivity, native async Python performance, and React Server Components.",
            },
            {
                "id": "ADR-004",
                "title": "Kafka Event Bus over RabbitMQ",
                "status": "ACCEPTED",
                "date": "2025-11-14",
                "rationale": "Log replayability, 100K+ QPS throughput capability, and offset tracking.",
            },
            {
                "id": "ADR-009",
                "title": "Modular Monolith to Microservices Transition Strategy",
                "status": "ACCEPTED",
                "date": "2026-03-02",
                "rationale": "Isolate high-frequency payment write IOPS into autonomous services.",
            },
        ]
