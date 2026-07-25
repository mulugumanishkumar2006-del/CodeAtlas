# apps/backend/app/intelligence_network/network_graph.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class ArchitectureKnowledgeGraph:
    def get_network_graph(self, db: Session) -> Dict[str, Any]:
        return {
            "graph_version": "1.0-SOFTWARE-INTERNET",
            "total_pattern_nodes": 12450,
            "total_relationship_edges": 48200,
            "top_global_patterns": [
                {"name": "Microservice Decoupling", "adoption_pct": 78.4},
                {"name": "Async Message Queues", "adoption_pct": 82.1},
                {"name": "Circuit Breaker Resilience", "adoption_pct": 69.5},
            ],
        }
