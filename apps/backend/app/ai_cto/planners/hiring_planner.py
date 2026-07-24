# apps/backend/app/ai_cto/planners/hiring_planner.py

from typing import List

from app.ai_cto.schemas.recommendation import HiringRecommendation


class HiringPlanner:
    def plan(
        self, target_requests_per_sec: int, bottleneck_count: int
    ) -> List[HiringRecommendation]:
        """
        Recommends hiring plans based on architectural complexity and scaling challenges.
        """
        hiring_plan = [
            HiringRecommendation(
                role="Backend Engineer",
                count=2,
                priority="HIGH",
                justification="Required to execute modular boundary refactoring, decouple circular hotspots, and implement repository pattern interfaces.",
            ),
            HiringRecommendation(
                role="Platform Engineer",
                count=1,
                priority="HIGH" if target_requests_per_sec > 1000 else "MEDIUM",
                justification="Required to construct Kubernetes deployment manifolds, configure Redis Cluster, and establish global CDN nodes.",
            ),
            HiringRecommendation(
                role="Site Reliability Engineer (SRE)",
                count=1,
                priority="HIGH" if target_requests_per_sec > 5000 else "MEDIUM",
                justification="Required to deploy autoscaling metrics trackers, analyze CPU limits, and reduce database connection lock contention.",
            ),
            HiringRecommendation(
                role="QA Engineer",
                count=1,
                priority="MEDIUM",
                justification="Required to implement end-to-end integration workflows, validate transaction rollback behaviors, and verify scale limits.",
            ),
            HiringRecommendation(
                role="Security Engineer",
                count=1,
                priority="HIGH" if bottleneck_count > 3 else "MEDIUM",
                justification="Required to audit module separation policies, configure vault credentials secrets, and resolve import boundary leaks.",
            ),
        ]

        return hiring_plan
