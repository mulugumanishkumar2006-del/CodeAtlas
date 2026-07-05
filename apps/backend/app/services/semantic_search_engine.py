from sqlalchemy.orm import Session
from app.models.graph_node import GraphNode
from typing import List, Dict, Any

class SemanticSearchEngine:
    """
    Concept-driven Semantic Search Engine.
    Expands search queries into conceptual namespaces to return related code components,
    services, models, APIs, and tests beyond simple keyword matches.
    """
    CONCEPT_MAPS = {
        "auth": {
            "name": "Authentication & Security",
            "keywords": ["auth", "login", "jwt", "token", "session", "credential", "user", "password", "register", "signup", "sign_in", "permission", "role", "keycloak", "oauth"]
        },
        "payment": {
            "name": "Billing & Payment",
            "keywords": ["billing", "payment", "checkout", "stripe", "paypal", "invoice", "transaction", "price", "charge", "subscription"]
        },
        "database": {
            "name": "Database & Storage",
            "keywords": ["db", "database", "table", "model", "repository", "postgres", "mysql", "sqlite", "mongo", "query", "schema", "entity", "connection", "migration"]
        },
        "queue": {
            "name": "Background Tasks & Queues",
            "keywords": ["celery", "kafka", "rabbitmq", "queue", "job", "worker", "event", "task", "cron", "pipeline", "broker", "topic", "message"]
        },
        "test": {
            "name": "Testing & Verification",
            "keywords": ["test", "mock", "assert", "check", "spec", "fixture", "pytest"]
        }
    }

    def search_nodes(self, db: Session, repo_id: str, query: str) -> List[Dict[str, Any]]:
        q_clean = query.strip().lower()
        if not q_clean:
            return []

        # Find matching concepts and expand keywords
        matched_keywords = {q_clean}
        matched_concepts = []

        for key, concept in self.CONCEPT_MAPS.items():
            # If query is in keywords, matches concept name, or matches key
            if (q_clean in concept["keywords"] or 
                q_clean in concept["name"].lower() or 
                any(kw in q_clean for kw in concept["keywords"]) or
                q_clean == key):
                matched_concepts.append(concept["name"])
                matched_keywords.update(concept["keywords"])

        # Fetch nodes matching ANY of the expanded keywords
        from sqlalchemy import or_
        filters = []
        for kw in matched_keywords:
            filters.append(GraphNode.name.ilike(f"%{kw}%"))
            filters.append(GraphNode.type.ilike(f"%{kw}%"))

        nodes = db.query(GraphNode).filter(
            GraphNode.repository_id == repo_id,
            or_(*filters)
        ).limit(100).all()

        results = []
        for n in nodes:
            score = 0.5
            n_name_lower = n.name.lower()
            if q_clean in n_name_lower:
                score += 0.4
            if n.name.lower() == q_clean:
                score += 0.1

            # Determine matched concepts for this specific node
            node_concepts = []
            for concept_key, concept_val in self.CONCEPT_MAPS.items():
                if any(kw in n_name_lower or kw in n.type.lower() for kw in concept_val["keywords"]):
                    node_concepts.append(concept_val["name"])
                
            results.append({
                "id": n.id,
                "name": n.name,
                "type": n.type,
                "properties": n.properties,
                "score": round(score, 2),
                "matched_concepts": node_concepts
            })

        # Sort by score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results
