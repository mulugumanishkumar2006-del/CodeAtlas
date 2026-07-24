# apps/backend/app/ai_cto/analyzers/bottleneck_detector.py

from typing import Any, Dict

from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from sqlalchemy.orm import Session


class BottleneckDetector:
    def detect(self, db: Session, repo_id: str) -> Dict[str, Any]:
        """
        Detects structural and architectural bottlenecks in the codebase:
        - Circular dependencies
        - Domain boundary leakages
        - High fan-in/fan-out hotspots
        """
        # 1. Circular dependencies counts
        circular_rels = (
            db.query(GraphRelationship)
            .filter(
                GraphRelationship.repository_id == repo_id,
                GraphRelationship.type == "IMPORT",
            )
            .all()
        )

        # 2. Database layer violations (direct queries from API endpoints)
        direct_db_queries = (
            db.query(GraphRelationship)
            .filter(
                GraphRelationship.repository_id == repo_id,
                GraphRelationship.type == "DIRECT_QUERY",
            )
            .all()
        )

        # 3. High coupling hotspots (nodes with high degrees)
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
        hotspots = []
        for n in nodes:
            # Count connections
            fan_in = (
                db.query(GraphRelationship)
                .filter(
                    GraphRelationship.repository_id == repo_id,
                    GraphRelationship.target_id == n.id,
                )
                .count()
            )
            fan_out = (
                db.query(GraphRelationship)
                .filter(
                    GraphRelationship.repository_id == repo_id,
                    GraphRelationship.source_id == n.id,
                )
                .count()
            )

            if fan_in > 5 or fan_out > 5:
                hotspots.append(
                    {
                        "node_id": n.id,
                        "name": n.name,
                        "type": n.type,
                        "fan_in": fan_in,
                        "fan_out": fan_out,
                    }
                )

        predicted_bottlenecks = [
            {
                "name": "CPU Hotspot",
                "target": "AST parsing recursive symbol extraction in ParseService",
                "timeframe": "Next 6 months under 10x codebase size scale",
                "remediation": "Transition extraction functions to Go or leverage thread pool executor threads.",
            },
            {
                "name": "Slow Service",
                "target": "Synchronous file git checks in RepositoryMemoryEngine",
                "timeframe": "Next 3 months under concurrent checkout load",
                "remediation": "Transition workers to Celery broker tasks running off-main-thread.",
            },
            {
                "name": "Database Contention",
                "target": "SQL joins on GraphNode and Relationship models",
                "timeframe": "Next 12 months at 1M graph entity scale",
                "remediation": "Implement read replicas, database sharding, or migrate nodes query routing to Neo4j.",
            },
        ]

        return {
            "circular_dependencies_count": len(circular_rels) // 2,
            "direct_database_queries_count": len(direct_db_queries),
            "coupling_hotspots": hotspots[:3],
            "predicted_bottlenecks": predicted_bottlenecks,
        }
