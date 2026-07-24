# apps/backend/app/ai_cto/planners/roadmap_generator.py

from typing import Any, Dict, List

from app.ai_cto.schemas.roadmap import EngineeringRoadmap, Milestone


class RoadmapGenerator:
    def generate(
        self, repo_id: str, coupling_hotspots: List[Dict[str, Any]]
    ) -> EngineeringRoadmap:
        """
        Synthesizes milestones, durations, sprint timelines, and allocations.
        """
        milestones = [
            Milestone(
                id="mile_001",
                sprint=1,
                title="Initialize Repository Patterns",
                description="Refactor API endpoints to use database interface repositories instead of direct queries.",
                dependencies=[],
                estimated_duration_days=5,
                allocated_resources=["Senior Full-Stack Engineer"],
            )
        ]

        for i, hotspot in enumerate(coupling_hotspots):
            milestones.append(
                Milestone(
                    id=f"mile_00{i+2}",
                    sprint=2 + (i // 2),
                    title=f"Decouple {hotspot['name'].split('/')[-1]}",
                    description=f"Refactor imports and resolve circular dependency hotspots in {hotspot['name']}.",
                    dependencies=["mile_001"],
                    estimated_duration_days=7,
                    allocated_resources=[
                        "Senior Full-Stack Engineer",
                        "Principal Software Architect",
                    ],
                )
            )

        sprints = max(2, len(milestones) // 2 + 1)

        quarterly_goals = {
            "Q1": [
                "Reduce Technical Debt",
                "Decouple circular coupling import hotspots",
                "Introduce Repository patterns",
            ],
            "Q2": [
                "Improve Testing",
                "Establish database transaction rollback validations",
                "Mock Neo4j graph connectors",
            ],
            "Q3": [
                "Caching",
                "Deploy Redis Cache cluster topologies",
                "Implement Strawberry data loaders",
            ],
            "Q4": [
                "Scale Infrastructure",
                "Transition Docker to Kubernetes",
                "Configure Horizontal Pod Autoscalers (HPA)",
            ],
        }

        return EngineeringRoadmap(
            repository_id=repo_id,
            sprints=sprints,
            milestones=milestones,
            estimated_completion_date=f"Within {sprints * 2} weeks",
            resource_allocation_summary="Engineers will work in parallel on decoupling hotspots once initial interface layers are complete.",
            quarterly_goals=quarterly_goals,
        )
