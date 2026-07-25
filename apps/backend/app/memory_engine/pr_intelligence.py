# apps/backend/app/memory_engine/pr_intelligence.py

from typing import Any, Dict, List

from sqlalchemy.orm import Session


class PRIntelligenceEngine:
    def get_pr_intelligence(self, db: Session) -> List[Dict[str, Any]]:
        return [
            {
                "pr_id": "PR #182",
                "title": "Split Orders monolith into Orders-Router and Orders-Fulfillment",
                "author": "Lead Developer",
                "merged_date": "2026-02-10",
                "architectural_impact": "HIGH - Microservice extraction",
                "knowledge_extracted": "Eliminated database row lock contention on primary Postgres cluster.",
                "linked_issue": "INC-882",
            },
            {
                "pr_id": "PR #145",
                "title": "feat(cache): Redis L2 Permission Cache",
                "author": "Senior SRE",
                "merged_date": "2026-01-18",
                "architectural_impact": "MEDIUM - Caching layer addition",
                "knowledge_extracted": "Reduced DB query load by 14,000 req/sec, improving p95 latency by 65%.",
                "linked_issue": "PERF-402",
            },
        ]
