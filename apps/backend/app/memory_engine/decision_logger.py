# apps/backend/app/memory_engine/decision_logger.py

from typing import Any, Dict, List

from sqlalchemy.orm import Session


class ADRManager:
    def list_architecture_decisions(self, db: Session) -> List[Dict[str, Any]]:
        return [
            {
                "id": "ADR-001",
                "title": "PostgreSQL as Primary Relational Database",
                "status": "ACCEPTED",
                "date": "2025-08-01",
                "rationale": "ACID compliance, JSONB document query capabilities, and mature ecosystem.",
            },
            {
                "id": "ADR-002",
                "title": "Redis for L2 Distributed Caching & Rate Limiting",
                "status": "ACCEPTED",
                "date": "2025-09-15",
                "rationale": "Sub-millisecond latency for token verification and distributed locks.",
            },
            {
                "id": "ADR-004",
                "title": "Kafka Event Bus over RabbitMQ",
                "status": "ACCEPTED",
                "date": "2025-11-14",
                "rationale": "Log replayability, 100K+ QPS throughput capability, and partition ordering.",
            },
            {
                "id": "ADR-006",
                "title": "Kubernetes (EKS) for Container Orchestration",
                "status": "ACCEPTED",
                "date": "2026-01-10",
                "rationale": "Horizontal pod autoscaling, zero-downtime rolling updates, and self-healing.",
            },
            {
                "id": "ADR-009",
                "title": "Modular Monolith to Microservices Transition Strategy",
                "status": "ACCEPTED",
                "date": "2026-03-02",
                "rationale": "Isolate high-frequency payment write IOPS into autonomous services.",
            },
        ]
