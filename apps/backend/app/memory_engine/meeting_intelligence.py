# apps/backend/app/memory_engine/meeting_intelligence.py

from typing import Any, Dict, List

from sqlalchemy.orm import Session


class MeetingIntelligenceEngine:
    def get_meeting_intelligence(self, db: Session) -> List[Dict[str, Any]]:
        return [
            {
                "meeting_title": "Architecture Guild Q4 Strategic Review",
                "date": "2025-11-12",
                "attendees": ["Alex Dev", "Staff Architect", "VP of Engineering"],
                "key_decisions": [
                    "Approved Kafka over RabbitMQ for event bus log replayability.",
                    "Set 100K QPS as minimum target capacity for 2026 sales event.",
                ],
                "action_items": [
                    "Draft ADR 004",
                    "Provision 3-node Kafka cluster on AWS MSK",
                ],
            },
            {
                "meeting_title": "Post-Mortem Review: INC-882 DB Lock Outage",
                "date": "2026-02-06",
                "attendees": ["Lead SRE", "Database Administrator", "Backend Lead"],
                "key_decisions": [
                    "Mandate async event-driven architecture for order fulfillment.",
                    "Split monolithic orders schema into independent fulfillment microservice.",
                ],
                "action_items": [
                    "Create PR #182",
                    "Add DB transaction duration alarms",
                ],
            },
        ]
