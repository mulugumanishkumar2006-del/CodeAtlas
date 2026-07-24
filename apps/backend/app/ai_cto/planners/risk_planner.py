# apps/backend/app/ai_cto/planners/risk_planner.py

from typing import List

from app.ai_cto.schemas.recommendation import RiskProfile


class RiskPlanner:
    def plan(
        self, circular_dependencies_count: int, direct_database_queries_count: int
    ) -> List[RiskProfile]:
        """
        Synthesizes technical debt, reliability, and organizational/bus factor risks.
        """
        risks = [
            RiskProfile(
                category="Technical",
                risk_type="Circular Dependency Loops",
                severity="HIGH" if circular_dependencies_count > 0 else "LOW",
                description=(
                    f"Detected {circular_dependencies_count} circular modules importing each other, complicating upgrades."
                    if circular_dependencies_count > 0
                    else "No high complexity circular loops detected."
                ),
                mitigation_action="Extract common interfaces and shared utilities out into a shared infrastructure module.",
            ),
            RiskProfile(
                category="Reliability",
                risk_type="Direct DB Queries in Routing layer",
                severity="HIGH" if direct_database_queries_count > 2 else "MEDIUM",
                description="FastAPI handlers query SQLite database directly, introducing scaling bottlenecks.",
                mitigation_action="Refactor logic behind service APIs and repository models.",
            ),
            RiskProfile(
                category="Security",
                risk_type="Local Credentials Exposure",
                severity="HIGH",
                description="Database secrets and token signing keys are currently parsed directly from environment variables.",
                mitigation_action="Transition secret variables lookup to a centralized vaults store like AWS Secret Manager.",
            ),
            RiskProfile(
                category="Delivery",
                risk_type="Delayed Migrations",
                severity="MEDIUM",
                description="Splitting coupling hotspots requires architectural adjustments that might extend milestones timeline.",
                mitigation_action="Run automated lint checks and import checks in CI pipelines to prevent new violations.",
            ),
            RiskProfile(
                category="Knowledge",
                risk_type="Single Committer Bus Factor",
                severity="MEDIUM",
                description="Core database schemas and Neo4j initialization logic has a single primary owner (>90% commits).",
                mitigation_action="Introduce mandatory PR reviews and distribute architectural ownership documents.",
            ),
        ]

        return risks
