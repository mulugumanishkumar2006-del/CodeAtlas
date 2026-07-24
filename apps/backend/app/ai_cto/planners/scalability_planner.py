# apps/backend/app/ai_cto/planners/scalability_planner.py

from typing import Any, Dict


class ScalabilityPlanner:
    def plan(self, capacity: Dict[str, Any]) -> Dict[str, Any]:
        """
        Suggests scalability optimizations based on predicted throughput bounds.
        """
        db_conn = capacity.get("target_db_connections", 20)
        cache_size = capacity.get("estimated_cache_size_gb", 1.0)
        rps = capacity.get("proposed_concurrency_workers", 4) * 50  # approximate rps

        recommendations = [
            {
                "component": "Redis",
                "verdict": "Recommended",
                "details": f"Provision a Redis Cluster with at least {cache_size} GB cache sizing to store active user sessions.",
            },
            {
                "component": "Kafka",
                "verdict": "Recommended" if rps > 1000 else "Optional",
                "details": (
                    "Use Kafka as the event broker backbone for high-throughput audit logs and distributed state updates."
                    if rps > 1000
                    else "Optional event stream broker for multi-service messaging."
                ),
            },
            {
                "component": "RabbitMQ",
                "verdict": "Recommended" if rps <= 1000 else "Optional",
                "details": (
                    "Deploy RabbitMQ as a reliable task queuing broker for asynchronous transaction execution."
                    if rps <= 1000
                    else "Use as task-scheduling backend alongside primary message stream."
                ),
            },
            {
                "component": "CDN",
                "verdict": "Recommended",
                "details": "Provision a global CDN (e.g. Cloudflare) to cache static files and reduce load on API gateways.",
            },
            {
                "component": "Object Storage",
                "verdict": "Recommended",
                "details": "Leverage AWS S3 or compatible object storage for repository binary documents and static assets.",
            },
            {
                "component": "Read Replicas",
                "verdict": "Recommended",
                "details": f"Increase pool connections to {db_conn} and provision at least 2 database read replicas.",
            },
            {
                "component": "Autoscaling",
                "verdict": "Recommended",
                "details": "Configure Horizontal Pod Autoscaler (HPA) to scale pods dynamically between 2 and 10 container replicas.",
            },
        ]

        return {
            "cache_recommendation": f"Provision a Redis Cluster with at least {cache_size} GB cache sizing to handle active session storage.",
            "database_recommendation": f"Increase pool connections limit to {db_conn} and configure read replicas for write-heavy services.",
            "queue_recommendation": "Leverage Celery with Redis broker, scaling workers to prevent queue congestion under load spikes.",
            "infrastructure_recommendations": recommendations,
        }
