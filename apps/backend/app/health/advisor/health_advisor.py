"""Rule-based recommendations engine and impact aggregator."""

from sqlalchemy.orm import Session

from app.health.models.health import Recommendation


class HealthAdvisor:
    """Generates remediation tasks with expected health impact deltas."""

    @staticmethod
    def generate_recommendations(db: Session, repo_id: str, scores: dict) -> list:
        """Evaluate scores and save prioritized suggestions in the DB."""
        # Delete existing recommendations for this repo
        db.query(Recommendation).filter(Recommendation.repo_id == repo_id).delete()

        recommendations_list = []

        # Rule 1: Architecture coupling is high / score is warning
        arch_score = scores.get("Architecture", 80.0)
        if arch_score < 90:
            recommendations_list.append(
                {
                    "recommendation": "Reduce Coupling",
                    "improvement": 3.0,
                    "priority": "HIGH",
                    "estimated_effort": "Medium",
                }
            )

        # Rule 2: Low testing score
        testing_score = scores.get("Testing", 60.0)
        if testing_score < 75:
            recommendations_list.append(
                {
                    "recommendation": "Improve Testing",
                    "improvement": 2.0,
                    "priority": "HIGH",
                    "estimated_effort": "Medium",
                }
            )

        # Rule 3: Low documentation
        doc_score = scores.get("Documentation", 65.0)
        if doc_score < 75:
            recommendations_list.append(
                {
                    "recommendation": "Document APIs",
                    "improvement": 2.0,
                    "priority": "MEDIUM",
                    "estimated_effort": "Low",
                }
            )

        # Rule 4: Technical debt is warnings / Payment refactoring opportunity
        debt_score = scores.get("Technical Debt", 70.0)
        if debt_score < 90:
            recommendations_list.append(
                {
                    "recommendation": "Split Payment",
                    "improvement": 4.0,
                    "priority": "CRITICAL",
                    "estimated_effort": "High",
                }
            )

        # Map to SQLAlchemy models and save
        db_recs = []
        for r in recommendations_list:
            rec = Recommendation(
                repo_id=repo_id,
                recommendation=r["recommendation"],
                improvement=r["improvement"],
                priority=r["priority"],
                estimated_effort=r["estimated_effort"],
            )
            db.add(rec)
            db_recs.append(rec)

        db.commit()

        # Sort recommendations by priority order: CRITICAL -> HIGH -> MEDIUM -> LOW
        priority_map = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
        recommendations_list.sort(key=lambda x: priority_map.get(x["priority"], 9))

        return recommendations_list
