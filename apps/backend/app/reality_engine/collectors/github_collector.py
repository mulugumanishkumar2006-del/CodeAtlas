# apps/backend/app/reality_engine/collectors/github_collector.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class GitHubCollector:
    def collect_github_reality(self, db: Session) -> Dict[str, Any]:
        return {
            "source": "GitHub Enterprise SCM",
            "active_prs": 14,
            "open_issues": 28,
            "recent_commits_24h": 42,
            "workflow_runs": [
                {
                    "workflow": "CI / Pytest & Linter",
                    "status": "SUCCESS",
                    "duration_sec": 42,
                },
                {
                    "workflow": "CD / Staging Deploy",
                    "status": "SUCCESS",
                    "duration_sec": 180,
                },
            ],
            "last_collected_at": "Just now",
        }
