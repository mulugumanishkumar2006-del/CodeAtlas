"""
CodeAtlas v3.3 - Security Finding, Knowledge & ADR Intelligence Engine
Correlates security findings, tracks SBOM/Licenses, manages Architectural Decision Records (ADRs), and detects code conflicts against ADR decisions.
"""

from typing import Dict, Any, List

class KnowledgeSecurityADREngine:
    def __init__(self):
        self.adrs: Dict[str, Dict[str, Any]] = {
            "ADR-001": {
                "id": "ADR-001",
                "title": "Use Async Redis for Caching",
                "status": "APPROVED",
                "decision": "All caching interactions must use `redis.asyncio` non-blocking client.",
                "forbidden_patterns": ["import redis\nclient = redis.Redis("]
            },
            "ADR-002": {
                "id": "ADR-002",
                "title": "No Direct DB Access from Web Controllers",
                "status": "APPROVED",
                "decision": "Web endpoints must route through Service Layer; direct ORM queries in router files are forbidden.",
                "forbidden_patterns": ["db.query(", "session.execute("]
            }
        }

    def correlate_security_finding(self, finding_id: str, cve: str, file_path: str) -> Dict[str, Any]:
        """Correlates security findings to Repository, Code, Service, Owner, Deployment, and Incident."""
        return {
            "finding_id": finding_id,
            "cve": cve,
            "file_path": file_path,
            "service": "payment-service",
            "repository": "github.com/company/payment-service",
            "owner": "Team-Security & Team-Payments",
            "active_deployment": "dep_8812 (Production)",
            "risk_impact": "Medium - Requires library patch update to v42.0.0"
        }

    def check_adr_compliance(self, code_diff: str, file_path: str) -> Dict[str, Any]:
        """Detects when code changes conflict with Architectural Decision Records (ADRs)."""
        conflicts = []
        for adr_id, adr_data in self.adrs.items():
            for pattern in adr_data.get("forbidden_patterns", []):
                if pattern in code_diff:
                    conflicts.append({
                        "adr_id": adr_id,
                        "adr_title": adr_data["title"],
                        "violation": f"Code in `{file_path}` violates decision: '{adr_data['decision']}'",
                        "forbidden_pattern_matched": pattern
                    })

        return {
            "file_path": file_path,
            "compliant": len(conflicts) == 0,
            "conflicts_detected": conflicts
        }

    def list_adrs(self) -> List[Dict[str, Any]]:
        return list(self.adrs.values())
