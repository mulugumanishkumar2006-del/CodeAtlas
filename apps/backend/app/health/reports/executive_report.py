"""Executive report generator (CEO View) for repository metrics."""

from sqlalchemy.orm import Session


class ExecutiveReportGenerator:
    """Generates a business-focused executive dashboard snapshot."""

    @staticmethod
    def generate(db: Session, repo_id: str, overall_score: float) -> dict:
        """Create overall health summary indices."""
        # Derive values based on health score tier
        if overall_score >= 85:
            velocity = "High"
            risk = "Low"
            readiness = "Excellent"
            knowledge_risk = "Low"
            tech_debt = "Moderate"
            future = "Improving"
        elif overall_score >= 70:
            velocity = "Moderate"
            risk = "Medium"
            readiness = "Good"
            knowledge_risk = "Moderate"
            tech_debt = "Moderate"
            future = "Stable"
        else:
            velocity = "Low"
            risk = "High"
            readiness = "Poor"
            knowledge_risk = "High"
            tech_debt = "Severe"
            future = "Degrading"

        return {
            "repository_health": round(overall_score, 1),
            "engineering_velocity": velocity,
            "risk": risk,
            "deployment_readiness": readiness,
            "knowledge_risk": knowledge_risk,
            "technical_debt": tech_debt,
            "future_health": future,
        }
