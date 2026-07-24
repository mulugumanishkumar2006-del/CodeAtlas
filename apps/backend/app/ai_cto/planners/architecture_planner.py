# apps/backend/app/ai_cto/planners/architecture_planner.py

from typing import Any, Dict, List


class ArchitecturePlanner:
    def plan(
        self, direct_database_queries_count: int, coupling_hotspots: List[Dict]
    ) -> Dict[str, Any]:
        """
        Plans modular/decoupled boundary guidelines and standard architectures.
        """
        standards = [
            "Strictly isolate database models from API routing and serialization logic.",
            "Use the Repository Pattern or Service Layer to isolate CRUD transactions from routing handler functions.",
        ]

        layout = {}
        for hotspot in coupling_hotspots:
            layout[hotspot["name"]] = (
                f"apps/backend/app/domain/{hotspot['type'].lower()}/{hotspot['name'].split('/')[-1]}"
            )

        if direct_database_queries_count > 0:
            standards.append(
                "Fix direct queries by introducing intermediate service mapping interfaces."
            )

        evolution = [
            {
                "phase": "Monolith",
                "description": "Single unified codebase running routing, databases, and dependencies.",
                "status": "Current Architecture",
            },
            {
                "phase": "Modular Monolith",
                "description": "Package logical domain boundary splits into self-contained scopes.",
                "status": "Planned (Sprint 1-2)",
            },
            {
                "phase": "Microservices",
                "description": "Deconstruct decoupled domains into independent stateless microservices.",
                "status": "Planned (Sprint 3-4)",
            },
            {
                "phase": "Event Driven",
                "description": "Introduce messaging brokers (Celery/RabbitMQ) for asynchronous pub/sub processing.",
                "status": "Planned (Sprint 5)",
            },
            {
                "phase": "Global Platform",
                "description": "Multi-region active-active deployments with distributed storage clusters.",
                "status": "Future Goal",
            },
        ]

        return {
            "architectural_standards": standards,
            "target_module_layout": layout,
            "architecture_evolution": evolution,
        }
