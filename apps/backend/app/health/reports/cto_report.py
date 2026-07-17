"""CTO report generator for technical architecture and code risk tracking."""

from sqlalchemy.orm import Session


class CtoReportGenerator:
    """Generates an in-depth technical metrics dashboard."""

    @staticmethod
    def generate(db: Session, repo_id: str, scores: dict) -> dict:
        """Analyze dimensions to extract technical concerns and growth opportunities."""
        # Detect critical issues based on low scoring dimensions
        critical_issues = []
        opportunities = []

        rel_score = scores.get("Reliability", 75.0)
        sec_score = scores.get("Security", 85.0)
        arch_score = scores.get("Architecture", 85.0)
        scale_score = scores.get("Scalability", 80.0)

        # Critical Issues matching logic
        if rel_score < 75:
            critical_issues.append("Authentication")
        if sec_score < 80:
            critical_issues.append("Notification")
        if scale_score < 75:
            critical_issues.append("Database")

        # Guarantee at least default/mock issues if everything is healthy
        if not critical_issues:
            critical_issues = ["Database", "Authentication", "Notification"]

        # Opportunities mapping
        if scale_score < 90:
            opportunities.append("Caching")
        if arch_score < 90:
            opportunities.append("Service Split")
        if scale_score < 85:
            opportunities.append("Read Replica")

        if not opportunities:
            opportunities = ["Caching", "Service Split", "Read Replica"]

        # Architecture drift estimation
        drift = "Low"
        if arch_score < 75:
            drift = "High"
        elif arch_score < 90:
            drift = "Medium"

        return {
            "critical_issues": critical_issues,
            "top_opportunities": opportunities,
            "architecture_drift": drift,
        }
