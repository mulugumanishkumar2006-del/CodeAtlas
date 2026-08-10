"""
CodeAtlas v3.3 - Issue Tracking & Finding-to-Issue Converter
Supports Jira, Linear, GitHub Issues, GitLab Issues, Azure Boards.
Converts CodeAtlas architecture/security/debt findings into structured tickets with rich context.
"""

import uuid
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone

class IssueTrackingConnector:
    def __init__(self, provider: str = "jira"):
        self.provider = provider
        self.created_issues: Dict[str, Dict[str, Any]] = {}

    def convert_finding_to_issue(
        self,
        finding_id: str,
        title: str,
        finding_type: str,
        repository: str,
        file_path: str,
        function_name: str,
        architecture_context: str,
        risk_score: float,
        evidence: str,
        ai_explanation: str,
        project_key: str = "ENG"
    ) -> Dict[str, Any]:
        """Converts CodeAtlas findings into issues attached with full engineering context."""
        ticket_id = f"{project_key}-{uuid.uuid4().hex[:4].upper()}"
        
        issue_record = {
            "ticket_id": ticket_id,
            "provider": self.provider,
            "title": f"[{finding_type.upper()}] {title}",
            "finding_id": finding_id,
            "status": "OPEN",
            "priority": "HIGH" if risk_score > 7.0 else "MEDIUM",
            "context": {
                "repository": repository,
                "file_path": file_path,
                "function_name": function_name,
                "architecture_context": architecture_context,
                "risk_score": risk_score,
                "evidence": evidence,
                "ai_explanation": ai_explanation
            },
            "external_url": f"https://{self.provider}.company.com/browse/{ticket_id}",
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        self.created_issues[ticket_id] = issue_record
        return issue_record

    def list_issues(self) -> List[Dict[str, Any]]:
        return list(self.created_issues.values())
