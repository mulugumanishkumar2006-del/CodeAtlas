# apps/backend/app/os_kernel/engineering_memory_os.py

from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.codeatlas_os import EngineeringMemoryItem


class EngineeringMemoryOS:
    """
    Feature 3: Engineering Memory OS
    Persistent memory store for architectural decisions, incident postmortems,
    code reviews, architectural evolution blueprints, and lessons learned.
    """

    def record_memory_item(
        self,
        db: Session,
        memory_type: str,
        title: str,
        content: str,
        author_role: str = "Architect",
        repository_id: str = None,
    ) -> Dict[str, Any]:
        item = EngineeringMemoryItem(
            memory_type=memory_type,
            title=title,
            content=content,
            author_role=author_role,
            repository_id=repository_id,
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return {
            "memory_id": item.id,
            "memory_type": item.memory_type,
            "title": item.title,
            "recorded_at": item.created_at.isoformat(),
        }

    def get_memory_records(
        self, db: Session, memory_type: str = None
    ) -> Dict[str, Any]:
        query = db.query(EngineeringMemoryItem)
        if memory_type and memory_type != "All":
            query = query.filter(EngineeringMemoryItem.memory_type == memory_type)

        items = query.all()

        records = [
            {
                "id": i.id,
                "memory_type": i.memory_type,
                "title": i.title,
                "content": i.content,
                "author_role": i.author_role,
                "repository_id": i.repository_id or "org-global",
                "recorded_at": i.created_at.isoformat(),
            }
            for i in items
        ]

        # Demonstration fallback if empty
        if not records:
            records = [
                {
                    "id": "mem-1",
                    "memory_type": "Decision",
                    "title": "Adopt Event-Driven Architecture via Kafka for Order Processing",
                    "content": "Decided in Q1 to decouple checkout payments from inventory using Kafka topics. Reduced p99 latency by 140ms.",
                    "author_role": "Principal Architect",
                    "repository_id": "checkout-service",
                    "recorded_at": "2026-03-15T10:00:00Z",
                },
                {
                    "id": "mem-2",
                    "memory_type": "Incident",
                    "title": "Postmortem: Unindexed Event Log Table IOPS Bottleneck",
                    "content": "Root cause identified as missing compound index on events_raw. Mitigation: added migration script and Redis cache.",
                    "author_role": "Lead SRE",
                    "repository_id": "analytics-ingestion-worker",
                    "recorded_at": "2026-03-18T14:30:00Z",
                },
                {
                    "id": "mem-3",
                    "memory_type": "Review",
                    "title": "Pre-PR Automated Security Gate Review #481",
                    "content": "AI CTO Council flagged synchronous HTTP call without timeout configuration. Remediated before PR approval.",
                    "author_role": "AI CTO Gatekeeper",
                    "repository_id": "auth-service-v1",
                    "recorded_at": "2026-03-20T09:15:00Z",
                },
                {
                    "id": "mem-4",
                    "memory_type": "Architecture",
                    "title": "Target Blueprint: Zero-Trust Microservices Mesh",
                    "content": "Mandated mTLS via Istio sidecar proxies for all inter-service communications across 100+ repositories.",
                    "author_role": "VP Engineering",
                    "repository_id": "org-global",
                    "recorded_at": "2026-03-22T16:45:00Z",
                },
                {
                    "id": "mem-5",
                    "memory_type": "Lesson",
                    "title": "Lesson Learned: Database Read Replica Connection Pool Sizing",
                    "content": "Discovered max_connections default was exhausting worker threads during peak traffic events.",
                    "author_role": "Database Architect",
                    "repository_id": "primary-db-cluster",
                    "recorded_at": "2026-03-24T11:20:00Z",
                },
            ]
            if memory_type and memory_type != "All":
                records = [r for r in records if r["memory_type"] == memory_type]

        return {
            "total_memories": len(records),
            "memory_types": [
                "Decision",
                "Incident",
                "Review",
                "Architecture",
                "Lesson",
            ],
            "memories": records,
        }
