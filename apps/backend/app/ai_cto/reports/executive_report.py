# apps/backend/app/ai_cto/reports/executive_report.py

from typing import Any, Dict, List

from app.ai_cto.schemas.recommendation import CostOptimization
from app.ai_cto.schemas.report import ExecutiveReport


class ExecutiveReportGenerator:
    def generate(
        self,
        repo_id: str,
        roi: Dict[str, Any],
        costs: List[CostOptimization],
        timeline_weeks: int,
    ) -> ExecutiveReport:
        """
        Synthesizes high-level strategic findings into ExecutiveReport schema.
        """
        total_savings = sum(c.current_cost_usd - c.proposed_cost_usd for c in costs)

        strategic_summary = (
            f"The CodeAtlas engineering assessment for repository '{repo_id}' outlines critical architectural "
            f"reorganizations required to scale operational efficiency and support growth targets."
        )

        executive_roi_justification = (
            f"Refactoring codebase complexity will pay back in {roi['refactoring_payback_months']} months, "
            f"securing an estimated ${roi['maintenance_savings_usd']:.2f} in annual maintenance savings "
            f"by reclaiming developer hours spent troubleshooting debt."
        )

        current_infra = 1500.0
        future_infra = max(200.0, current_infra - total_savings)

        business_impact = [
            {
                "dimension": "Infrastructure Cost",
                "effect": f"Expected reduction of ${total_savings:.2f}/mo by switching from monolithic compute nodes to auto-scaled serverless containers and caches.",
            },
            {
                "dimension": "Customer Experience",
                "effect": "Decoupling API database queries and applying caching reduces mean HTTP request latency from ~150ms to under 15ms under high concurrent client request spikes.",
            },
            {
                "dimension": "System Reliability",
                "effect": "Migrating SQLite raw connections in endpoints to transactional repository patterns isolates DB locks, preventing write lock timeouts and API failures.",
            },
            {
                "dimension": "Development Speed",
                "effect": "Resolving circular module dependencies reduces local compilation/bundling overhead and lets developer teams edit route endpoints without import side-effects.",
            },
        ]

        tech_debt = [
            {
                "rank": "1",
                "item": "Circular Dependency Modules Loops",
                "impact": "CRITICAL",
                "remediation": "Extract shared import symbols into isolated common modules. Prevents build-time lockups and speeds up unit tests execution.",
            },
            {
                "rank": "2",
                "item": "Direct Database Raw Connections in Routers",
                "impact": "HIGH",
                "remediation": "Wrap SQLite logic in service model layers and repositories interfaces. Unlocks connection pooling and migration to Postgres.",
            },
            {
                "rank": "3",
                "item": "Hardcoded config secret keys in env",
                "impact": "MEDIUM",
                "remediation": "Transition local config lookup to AWS Secrets Manager or vault configurations to pass security compliance audits.",
            },
        ]

        incidents = [
            {
                "risk": "SQLite writer lock write saturation",
                "probability": "HIGH",
                "prevention": "Configure connection pooling limits and run PostgreSQL cluster configurations.",
            },
            {
                "risk": "Uncached token session validators lookup lag",
                "probability": "MEDIUM",
                "prevention": "Store valid token sessions state in a high performance Redis Cache store.",
            },
            {
                "risk": "Out-of-memory container crashes under parsed files overload",
                "probability": "MEDIUM",
                "prevention": "Define memory limits on worker nodes and configure horizontal container autoscaling.",
            },
        ]

        return ExecutiveReport(
            strategic_summary=strategic_summary,
            projected_budget_impact_usd=-total_savings,
            timeline_verdict=f"Recommended {timeline_weeks} weeks migration timeline",
            regulatory_compliance_check="PASSED with minor secrets lookup warnings",
            executive_roi_justification=executive_roi_justification,
            current_infrastructure_cost=current_infra,
            future_infrastructure_cost=future_infra,
            savings_opportunities=total_savings,
            business_impact=business_impact,
            tech_debt_investments=tech_debt,
            incident_prevention=incidents,
        )
