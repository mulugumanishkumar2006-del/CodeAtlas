from typing import Any, Dict, List, Set

from sqlalchemy.orm import Session

from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship


class DomainDetector:
    """
    Groups code and infrastructure nodes into logical business domains
    using a hybrid approach:
    1. Keyword-based matching on folder/file/class names.
    2. Transitive graph propagation to cluster connected nodes (e.g. mapping a Repository
       or Cache to the Domain layer of the service calling it).
    """

    def detect_domains(self, db: Session, repo_id: str) -> List[Dict[str, Any]]:
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
        relationships = (
            db.query(GraphRelationship)
            .filter(GraphRelationship.repository_id == repo_id)
            .all()
        )

        domain_rules = {
            "Authentication & Security": {
                "keywords": [
                    "auth",
                    "login",
                    "jwt",
                    "token",
                    "session",
                    "register",
                    "user",
                    "credential",
                    "identity",
                    "permission",
                    "role",
                    "secure",
                    "hash",
                ],
                "description": "Handles identity verification, secure access tokens, user registration, credentials, and session access control.",
            },
            "Billing & Payment": {
                "keywords": [
                    "bill",
                    "pay",
                    "stripe",
                    "invoice",
                    "price",
                    "checkout",
                    "card",
                    "subscription",
                    "transaction",
                    "payment",
                ],
                "description": "Orchestrates customer subscriptions, billing plans, invoices, and payment gateway interactions.",
            },
            "Database & Storage": {
                "keywords": [
                    "database",
                    "db",
                    "postgres",
                    "mysql",
                    "sqlite",
                    "mongo",
                    "table",
                    "model",
                    "sql",
                    "repository",
                    "dao",
                ],
                "description": "Manages persistent schemas, database connections, class entities, and low-level ORM transactions.",
            },
            "Analytics & Monitoring": {
                "keywords": [
                    "metric",
                    "log",
                    "analytics",
                    "monitor",
                    "prometheus",
                    "grafana",
                    "telemetry",
                    "tracing",
                    "datadog",
                    "stats",
                ],
                "description": "Tracks service health metrics, user engagement analytics, diagnostic audit trails, and telemetry dashboards.",
            },
            "Notifications & Messaging": {
                "keywords": [
                    "email",
                    "mail",
                    "sms",
                    "notify",
                    "notification",
                    "slack",
                    "message",
                    "send",
                    "alert",
                ],
                "description": "Dispatches external transactional emails, SMS triggers, Slack alerts, and push notifications.",
            },
            "Background Tasks & Queues": {
                "keywords": [
                    "celery",
                    "task",
                    "worker",
                    "job",
                    "queue",
                    "consumer",
                    "cron",
                    "schedule",
                    "async",
                ],
                "description": "Processes scheduled cron jobs, queue triggers, and background asynchronous task workers.",
            },
        }

        # 1. Primary classification by keywords
        node_domains: Dict[str, str] = {}

        for n in nodes:
            name_lower = n.name.lower()
            path_lower = (n.properties or {}).get("path", "").lower() or (
                n.properties or {}
            ).get("file_path", "").lower()

            best_domain = None
            max_matches = 0

            for dom, config in domain_rules.items():
                matches = sum(
                    1
                    for kw in config["keywords"]
                    if kw in name_lower or kw in path_lower
                )
                if matches > max_matches:
                    max_matches = matches
                    best_domain = dom

            if best_domain and max_matches > 0:
                node_domains[n.id] = best_domain

        # 2. Graph propagation (transitive clustering for unclassified nodes)
        # Build bidirected adjacency map
        neighbors: Dict[str, Set[str]] = {}
        for r in relationships:
            if r.source_id not in neighbors:
                neighbors[r.source_id] = set()
            if r.target_id not in neighbors:
                neighbors[r.target_id] = set()
            neighbors[r.source_id].add(r.target_id)
            neighbors[r.target_id].add(r.source_id)

        unclassified_nodes = [n for n in nodes if n.id not in node_domains]

        # 2 iterations of transitive propagation
        for _ in range(2):
            for n in unclassified_nodes:
                adjacent_domains = []
                for neighbor_id in neighbors.get(n.id, []):
                    if neighbor_id in node_domains:
                        adjacent_domains.append(node_domains[neighbor_id])
                if adjacent_domains:
                    most_common = max(set(adjacent_domains), key=adjacent_domains.count)
                    node_domains[n.id] = most_common

        # Group node IDs by domain name
        domain_groups: Dict[str, List[str]] = {dom: [] for dom in domain_rules.keys()}
        domain_groups["Core System"] = []

        for n in nodes:
            dom = node_domains.get(n.id, "Core System")
            if dom not in domain_groups:
                domain_groups[dom] = []
            domain_groups[dom].append(n.id)

        # Build final response payload
        clusters = []
        for dom, config in domain_rules.items():
            if domain_groups[dom]:
                clusters.append(
                    {
                        "name": dom,
                        "description": config["description"],
                        "node_ids": domain_groups[dom],
                    }
                )

        if domain_groups["Core System"]:
            clusters.append(
                {
                    "name": "Core System",
                    "description": "Houses central configuration variables, runtime routers, and common application infrastructure.",
                    "node_ids": domain_groups["Core System"],
                }
            )

        return clusters
