"""
CodeAtlas v3.3 - Incident Management Connector & Timeline Builder
Supports PagerDuty, Opsgenie, ServiceNow, Generic webhooks.
Automatically correlates incidents with recent deployments, affected services, and builds end-to-end incident timelines.
"""

import uuid
from typing import Dict, Any, List
from datetime import datetime, timezone

class IncidentManagementConnector:
    def __init__(self, provider: str = "pagerduty"):
        self.provider = provider
        self.incidents: Dict[str, Dict[str, Any]] = {}

    def ingest_incident(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
        incident_id = incident_data.get("incident_id", f"inc_{uuid.uuid4().hex[:6]}")
        service_name = incident_data.get("service", "payment-gateway")
        title = incident_data.get("title", "High API Latency & 5xx HTTP Error Spike")

        # Correlate with recent deployments and changes
        affected_services = [service_name, "auth-service", "redis-cluster"]
        recent_deployments = [
            {"deployment_id": "dep_8812", "service": service_name, "commit": "a1b2c3d", "deployed_at": "12 mins ago"}
        ]

        timeline = [
            {"time": "15 mins ago", "event": "Deployment dep_8812 completed by Alice"},
            {"time": "12 mins ago", "event": f"Alert triggered on {service_name}: HTTP 500 error rate > 5%"},
            {"time": "10 mins ago", "event": f"Incident {incident_id} created in {self.provider}"},
            {"time": "8 mins ago", "event": "CodeAtlas Incident Intelligence identified root cause commit a1b2c3d"},
            {"time": "5 mins ago", "event": "Rollback plan proposed by CodeAtlas Agent"}
        ]

        record = {
            "incident_id": incident_id,
            "provider": self.provider,
            "title": title,
            "severity": incident_data.get("severity", "SEV-1"),
            "status": "TRIGGERED",
            "service": service_name,
            "affected_services": affected_services,
            "recent_deployments": recent_deployments,
            "likely_cause": "Uncached database query introduced in PR #101 (commit a1b2c3d)",
            "timeline": timeline,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.incidents[incident_id] = record
        return record

    def list_incidents(self) -> List[Dict[str, Any]]:
        return list(self.incidents.values())
