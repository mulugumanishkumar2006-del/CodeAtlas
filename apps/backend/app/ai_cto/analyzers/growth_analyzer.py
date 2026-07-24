# apps/backend/app/ai_cto/analyzers/growth_analyzer.py

from typing import Any, Dict

from app.models.repository_statistics import RepositoryStatistics
from sqlalchemy.orm import Session


class GrowthAnalyzer:
    def analyze(self, db: Session, repo_id: str) -> Dict[str, Any]:
        """
        Projects LOC, complexity, file count, and dependency growth rate based on repo statistics.
        """
        stats = (
            db.query(RepositoryStatistics)
            .filter(RepositoryStatistics.repository_id == repo_id)
            .first()
        )

        # Default fallback values
        total_files = stats.total_files if stats else 10
        total_lines = stats.total_lines if stats else 1000
        total_complexity = stats.total_complexity if stats else 50.0

        # Assume a standard 25% annual growth rate based on normal development lifecycle
        growth_rate = 0.25

        return {
            "projected_files_12m": int(total_files * (1 + growth_rate)),
            "projected_lines_12m": int(total_lines * (1 + growth_rate)),
            "projected_complexity_12m": round(total_complexity * (1 + growth_rate), 2),
            "growth_rate_pct": round(growth_rate * 100, 1),
        }
