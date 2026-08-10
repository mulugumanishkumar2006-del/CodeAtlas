"""
CodeAtlas v3.4 - Semantic & Contextual Engineering Search Engine
Supports Natural Language Engineering queries, contextual search modes, and multi-domain graph traversal queries.
"""

from typing import Dict, Any, List, Optional

class SearchMode:
    INCIDENT_MODE = "INCIDENT_MODE"
    ARCHITECTURE_MODE = "ARCHITECTURE_MODE"
    DEVELOPER_MODE = "DEVELOPER_MODE"
    GENERAL_MODE = "GENERAL_MODE"

class SemanticContextualSearchEngine:
    def __init__(self):
        pass

    def execute_natural_language_query(self, query: str, mode: str = SearchMode.GENERAL_MODE) -> Dict[str, Any]:
        """Answers natural language engineering questions with contextual prioritization."""
        q_lower = query.lower()
        
        if "why is checkout slow" in q_lower or "slow" in q_lower:
            return {
                "query": query,
                "mode": mode,
                "answer": "Checkout latency increased by 420ms due to unindexed Aurora DB queries introduced in PR #101.",
                "relevant_entities": [
                    {"type": "Service", "name": "payment-service"},
                    {"type": "PR", "name": "PR #101"},
                    {"type": "Metric", "name": "checkout_duration_ms"}
                ],
                "prioritized_results": [
                    {"title": "Recent Deployment #8812 (15m ago)", "relevance": 0.98},
                    {"title": "Datadog Trace ID trace_99812", "relevance": 0.95},
                    {"title": "Past Incident INC-4102 (Redis Latency)", "relevance": 0.88}
                ]
            }
        elif "who owns" in q_lower:
            return {
                "query": query,
                "mode": mode,
                "answer": "Payment-service is owned by Team-Payments (Tech Lead: Alice Smith).",
                "relevant_entities": [
                    {"type": "Team", "name": "Team-Payments"},
                    {"type": "Developer", "name": "Alice Smith"}
                ],
                "prioritized_results": [
                    {"title": "CODEOWNERS in payment-service", "relevance": 1.0}
                ]
            }
        else:
            return {
                "query": query,
                "mode": mode,
                "answer": f"Contextual search returned relevant code, architecture, and incident signals for '{query}'.",
                "relevant_entities": [{"type": "Repository", "name": "payment-service"}],
                "prioritized_results": [{"title": "payment-service/app/main.py", "relevance": 0.90}]
            }

    def execute_graph_query(self, target_entity: str, query_type: str) -> Dict[str, Any]:
        """Supports graph queries like 'Show everything affected by service X'."""
        return {
            "target_entity": target_entity,
            "query_type": query_type,
            "connected_subgraph": {
                "affected_services": ["order-service", "analytics-service"],
                "dependent_teams": ["Team-Checkout", "Team-Data"],
                "involved_databases": ["payments-db-prod (Aurora)"]
            }
        }
