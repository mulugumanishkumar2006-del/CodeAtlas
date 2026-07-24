# apps/backend/app/ai_cto/analyzers/roi_engine.py

from typing import Any, Dict

from app.models.repository_statistics import RepositoryStatistics
from sqlalchemy.orm import Session


class ROIEngine:
    def calculate(
        self, db: Session, repo_id: str, budget_reduction_pct: float = 0.0
    ) -> Dict[str, Any]:
        """
        Calculates ROI metrics for code refactoring and migration projects.
        """
        stats = (
            db.query(RepositoryStatistics)
            .filter(RepositoryStatistics.repository_id == repo_id)
            .first()
        )
        complexity = stats.total_complexity if stats else 50.0

        # High complexity implies higher maintenance savings if refactored
        base_payback = 18.0  # months
        complexity_discount = min(6.0, complexity / 100.0)
        payback_months = max(6.0, base_payback - complexity_discount)

        maintenance_savings = 5000.0 * (1 + (budget_reduction_pct / 100.0))
        implementation_cost_hours = int(complexity * 1.5 + 40)

        projects_roi = [
            {
                "project": "Caching Strategy",
                "cost_duration": "2 weeks",
                "benefit_description": "40% latency reduction by caching active sessions",
                "roi_score": "High",
            },
            {
                "project": "Technical Debt Refactor",
                "cost_duration": "3 weeks",
                "benefit_description": "70% lower circular import warnings and boundary leaks",
                "roi_score": "Medium",
            },
            {
                "project": "Kubernetes Scale Transition",
                "cost_duration": "4 weeks",
                "benefit_description": "Zero downtime autoscaling up to 10M concurrent users",
                "roi_score": "High",
            },
            {
                "project": "GraphQL Schema Conversion",
                "cost_duration": "2 weeks",
                "benefit_description": "Consolidated query structures eliminating N+1 API latency",
                "roi_score": "High",
            },
        ]

        return {
            "refactoring_payback_months": round(payback_months, 1),
            "maintenance_savings_usd": round(maintenance_savings, 2),
            "implementation_cost_hours": implementation_cost_hours,
            "projects_roi": projects_roi,
        }
