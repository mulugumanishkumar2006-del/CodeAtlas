# apps/backend/app/os_kernel/live_timeline_engine.py

from typing import Any, Dict

from sqlalchemy.orm import Session

from app.models.codeatlas_os import EngineeringTimelineEvent


class LiveEngineeringTimelineEngine:
    """
    Feature 5: Live Engineering Timeline
    Provides a chronological event replay stream tracking deployments,
    releases, incidents, architectural evolution, and health score changes.
    """

    EVENT_TYPES = ["Deployment", "Release", "Incident", "ArchEvolution", "HealthChange"]

    def record_timeline_event(
        self,
        db: Session,
        event_type: str,
        title: str,
        details: str,
        severity: str = "INFO",
        repository_name: str = None,
    ) -> Dict[str, Any]:
        event = EngineeringTimelineEvent(
            event_type=event_type,
            title=title,
            details=details,
            severity=severity,
            repository_name=repository_name,
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return {
            "event_id": event.id,
            "event_type": event.event_type,
            "title": event.title,
            "timestamp": event.timestamp.isoformat(),
        }

    def get_timeline_replay_stream(
        self, db: Session, event_type: str = None
    ) -> Dict[str, Any]:
        query = db.query(EngineeringTimelineEvent).order_by(
            EngineeringTimelineEvent.timestamp.desc()
        )
        if event_type and event_type != "All":
            query = query.filter(EngineeringTimelineEvent.event_type == event_type)

        events = query.all()

        stream = [
            {
                "id": e.id,
                "event_type": e.event_type,
                "title": e.title,
                "details": e.details,
                "severity": e.severity,
                "repository": e.repository_name or "org-wide",
                "timestamp": e.timestamp.isoformat(),
            }
            for e in events
        ]

        # Demonstration fallback if empty
        if not stream:
            stream = [
                {
                    "id": "evt-1",
                    "event_type": "Deployment",
                    "title": "Release v20.0.0-RC1 Deployed to Staging",
                    "details": "Automated deployment via Jenkins Pipeline #482. 14 microservices updated.",
                    "severity": "INFO",
                    "repository": "enterprise-k8s-cluster",
                    "timestamp": "2026-03-25T08:30:00Z",
                },
                {
                    "id": "evt-2",
                    "event_type": "HealthChange",
                    "title": "Organization Health Score Increased to 93.0 / 100",
                    "details": "Tech debt reduction sprint remediated 14 critical CVEs across 5 repositories.",
                    "severity": "INFO",
                    "repository": "org-wide",
                    "timestamp": "2026-03-24T18:00:00Z",
                },
                {
                    "id": "evt-3",
                    "event_type": "Release",
                    "title": "Production Release v3.2 Successful",
                    "details": "Zero-downtime blue/green deployment completed in 4.2 minutes.",
                    "severity": "INFO",
                    "repository": "checkout-service",
                    "timestamp": "2026-03-23T14:15:00Z",
                },
                {
                    "id": "evt-4",
                    "event_type": "Incident",
                    "title": "INC-819: Redis Session Memory Pressure Warning",
                    "details": "Memory usage spiked to 88%. Auto-scaling group triggered node expansion.",
                    "severity": "WARNING",
                    "repository": "auth-service-v1",
                    "timestamp": "2026-03-22T09:40:00Z",
                },
                {
                    "id": "evt-5",
                    "event_type": "ArchEvolution",
                    "title": "Architecture Shift: Monolith to Event-Driven Mesh",
                    "content": "Phase 18 Autonomous Refactoring Engine migrated 3 modules to independent Go microservices.",
                    "details": "Phase 18 Autonomous Refactoring Engine migrated 3 modules to independent Go microservices.",
                    "severity": "INFO",
                    "repository": "legacy-monolith",
                    "timestamp": "2026-03-20T11:00:00Z",
                },
            ]
            if event_type and event_type != "All":
                stream = [s for s in stream if s["event_type"] == event_type]

        return {
            "total_events": len(stream),
            "event_types": self.EVENT_TYPES,
            "timeline": stream,
        }
