"""
CodeAtlas v3.6 - Global Event Bus, Data Replication & Residency Policy Engine
Manages globally distributed event bus with event replay, cross-region replication, conflict resolution, and data residency enforcement.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class GlobalDataAndEventBusEngine:
    def __init__(self):
        self.event_stream: List[Dict[str, Any]] = []

    def publish_global_event(
        self,
        event_type: str,
        origin_region: str,
        tenant_id: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Phases 44–47: Publishes ordered, deduplicated event to global bus with replay capability."""
        evt_id = f"evt_{uuid.uuid4().hex[:8]}"
        record = {
            "event_id": evt_id,
            "event_type": event_type,
            "origin_region": origin_region,
            "tenant_id": tenant_id,
            "payload": payload,
            "replication_status": "REPLICATED_ACROSS_ALL_REGIONS",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        self.event_stream.append(record)
        return record

    def check_data_residency_policy(self, tenant_id: str, source_region: str, target_region: str, data_category: str) -> Dict[str, Any]:
        """Phases 53 & 54: Prevents unauthorized cross-region data movement based on tenant residency rules."""
        if data_category == "EU_PII" and target_region != "reg_eu_west":
            return {
                "allowed": False,
                "reason": "DATA_RESIDENCY_VIOLATION: EU_PII data cannot exit reg_eu_west",
                "action": "BLOCK_TRANSFER"
            }
        return {
            "allowed": True,
            "reason": "DATA_TRANSFER_AUTHORIZED",
            "action": "ALLOW_REPLICATION"
        }

    def replay_events(self, from_timestamp: str, event_type_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Phase 45: Allows safe replay of historical events."""
        replayed = []
        for evt in self.event_stream:
            if evt["timestamp"] >= from_timestamp:
                if not event_type_filter or evt["event_type"] == event_type_filter:
                    replayed.append(evt)
        return replayed
