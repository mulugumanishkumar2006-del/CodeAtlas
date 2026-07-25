# apps/backend/app/reality_engine/events/event_stream.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class EngineeringEventStream:
    def get_event_stream(self, db: Session) -> Dict[str, Any]:
        return {
            "stream_status": "LIVE_REALTIME_STREAM",
            "total_events_24h": 1420,
            "events": [
                {
                    "id": "evt-101",
                    "timestamp": "2 mins ago",
                    "type": "INCIDENT_ALERT",
                    "service": "legacy-payment-gateway",
                    "title": "Incident #402: Latency spike to 1800ms",
                    "author": "Datadog Monitor",
                    "severity": "HIGH",
                },
                {
                    "id": "evt-100",
                    "timestamp": "14 mins ago",
                    "type": "DEPLOYMENT",
                    "service": "legacy-payment-gateway",
                    "title": "Deployed version v2.4.1 (commit 8f3b2a1)",
                    "author": "Alex Dev",
                    "severity": "INFO",
                },
                {
                    "id": "evt-099",
                    "timestamp": "28 mins ago",
                    "type": "CODE_REVIEW",
                    "service": "checkout-service",
                    "title": "PR #142 Approved: Optimize DB query indexing",
                    "author": "Sarah Lead",
                    "severity": "INFO",
                },
                {
                    "id": "evt-098",
                    "timestamp": "45 mins ago",
                    "type": "COMMIT",
                    "service": "auth-vault",
                    "title": "Commit 1a4b8c2: Patch mTLS token rotation",
                    "author": "Mike Sec",
                    "severity": "INFO",
                },
                {
                    "id": "evt-097",
                    "timestamp": "1 hour ago",
                    "type": "MONITORING_ALERT",
                    "service": "redis-l2-cache-cluster",
                    "title": "Memory threshold warning (88.1%)",
                    "author": "Prometheus Alertmanager",
                    "severity": "WARNING",
                },
            ],
        }
