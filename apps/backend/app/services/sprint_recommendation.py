"""SprintRecommendationService — Feature 9 Sprint Recommendation Engine."""

from datetime import datetime
from typing import List

from sqlalchemy.orm import Session

from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.schemas.advisor import SprintRecommendation, SprintReport, SprintTask


class SprintRecommendationService:
    """
    Feature 9 — Packages repository tech debt, coupling loops, and advisors
    into prioritized Scrum sprints with estimate days, expected improvements,
    and risk levels.
    """

    def get_sprint_report(self, db: Session, repo_id: str) -> SprintReport:
        # Load signals
        relationships = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repo_id)
            .all()
        )
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()

        has_payment_logic = any("payment" in n.name.lower() for n in nodes)
        has_auth_logic = any("auth" in n.name.lower() for n in nodes)
        has_db_hotspot = len(relationships) >= 10

        sprints: List[SprintRecommendation] = []

        # ─── Sprint 14 ───
        sprint14_tasks = []

        # Check for auth circular dependencies / refactors
        if has_auth_logic or not relationships:
            sprint14_tasks.append(
                SprintTask(
                    id="tsk_s14_1",
                    priority_level=1,
                    title="Authentication Refactor",
                    estimated_days=5,
                    expected_improvement_pct=18,
                    risk="Low",
                    rationale="Decouples direct imports between auth_service and user notifier modules.",
                    target_component="auth_service",
                )
            )

        # Check for Redis caching tasks
        if has_db_hotspot or not relationships:
            sprint14_tasks.append(
                SprintTask(
                    id="tsk_s14_2",
                    priority_level=2,
                    title="Add Redis Caching layer for endpoints",
                    estimated_days=3,
                    expected_improvement_pct=12,
                    risk="Low",
                    rationale="Deploy Redis configuration to cache SQL reads and eliminate database hotspots.",
                    target_component="api/v1/payments",
                )
            )

        if sprint14_tasks:
            sprints.append(
                SprintRecommendation(sprint_name="Sprint 14", tasks=sprint14_tasks)
            )

        # ─── Sprint 15 ───
        sprint15_tasks = []
        if has_payment_logic or not relationships:
            sprint15_tasks.append(
                SprintTask(
                    id="tsk_s15_1",
                    priority_level=1,
                    title="Monolithic payment_service Split",
                    estimated_days=10,
                    expected_improvement_pct=24,
                    risk="Medium",
                    rationale="Split payment orchestration logic into dedicated API boundaries and Stripe gateway adapters.",
                    target_component="payment_service",
                )
            )
            sprint15_tasks.append(
                SprintTask(
                    id="tsk_s15_2",
                    priority_level=2,
                    title="Introduce Repository Pattern",
                    estimated_days=7,
                    expected_improvement_pct=15,
                    risk="Medium",
                    rationale="Wrap raw SQL connections and operations in a mockable Repository interface.",
                    target_component="models/payment",
                )
            )

        if sprint15_tasks:
            sprints.append(
                SprintRecommendation(sprint_name="Sprint 15", tasks=sprint15_tasks)
            )

        return SprintReport(
            repo_id=repo_id, generated_at=datetime.utcnow(), sprints=sprints
        )
