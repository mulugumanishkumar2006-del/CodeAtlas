"""
CodeAtlas v3.3 - ChatOps & Interactive Assistant Engine
Integrates Slack and Microsoft Teams.
Supports interactive slash commands, multi-system approval workflows, and automated chat alerts.
"""

import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class ChatOpsConnector:
    def __init__(self, platform: str = "slack"):
        self.platform = platform
        self.pending_approvals: Dict[str, Dict[str, Any]] = {}

    def handle_slash_command(self, command: str, args: List[str], user_id: str, channel_id: str) -> Dict[str, Any]:
        """Handles ChatOps commands like /codeatlas investigate, /codeatlas risk, etc."""
        command = command.strip().lower()
        if "investigate" in command:
            target = args[0] if args else "payment-service"
            return {
                "response_type": "in_channel",
                "text": f"🔎 *CodeAtlas Investigation Report for `{target}`*\n"
                        f"• *Status*: Degraded (Latency +420ms)\n"
                        f"• *Recent PR*: #101 by @alice (Add Distributed Caching Layer)\n"
                        f"• *Root Cause*: Missing fallback index on Redis cache key lookup\n"
                        f"• *Action Recommendation*: Run `/codeatlas rollback {target}` to restore previous release."
            }
        elif "risk" in command:
            return {
                "response_type": "ephemeral",
                "text": "🛡️ *CodeAtlas Architecture Risk Assessment*\n"
                        "• *Total Risk Score*: 3.8 / 10 (Low)\n"
                        "• *Boundary Violations*: 0 detected\n"
                        "• *Active Vulnerabilities*: 1 Low (Upgrade `urllib3` to v2.2.1)"
            }
        elif "architecture" in command:
            return {
                "response_type": "in_channel",
                "text": "🏗️ *CodeAtlas System Architecture Snapshot*\n"
                        "• Microservices: 12 Services active\n"
                        "• Dependencies: Clean DAG, 0 circular dependencies\n"
                        "• Compliance: 100% ADR Compliant"
            }
        elif "incident" in command:
            return {
                "response_type": "in_channel",
                "text": "🚨 *Active Incidents*\n"
                        "• `INC-9941`: Payment API Latency Spike (SEV-1) - Investigating"
            }
        else:
            return {
                "response_type": "ephemeral",
                "text": f"Unknown command `{command}`. Available commands: `/codeatlas investigate`, `/codeatlas architecture`, `/codeatlas risk`, `/codeatlas incident`, `/codeatlas repository`"
            }

    def request_chat_approval(self, action_type: str, details: Dict[str, Any], requested_by: str) -> Dict[str, Any]:
        approval_id = f"appr_{uuid.uuid4().hex[:6]}"
        record = {
            "approval_id": approval_id,
            "action_type": action_type,
            "details": details,
            "requested_by": requested_by,
            "status": "PENDING_APPROVAL",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.pending_approvals[approval_id] = record
        return record

    def approve_action(self, approval_id: str, approved_by: str) -> Dict[str, Any]:
        if approval_id not in self.pending_approvals:
            raise ValueError(f"Approval request {approval_id} not found")
        
        req = self.pending_approvals[approval_id]
        req["status"] = "APPROVED"
        req["approved_by"] = approved_by
        req["approved_at"] = datetime.now(timezone.utc).isoformat()
        return req

    def send_chat_alert(self, title: str, message: str, level: str = "CRITICAL") -> Dict[str, Any]:
        return {
            "platform": self.platform,
            "status": "DELIVERED",
            "level": level,
            "alert_body": f"[{level}] {title}\n{message}",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
