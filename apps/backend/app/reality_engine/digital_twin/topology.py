# apps/backend/app/reality_engine/digital_twin/topology.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class RealityTopologyEngine:
    def get_realtime_topology(self, db: Session) -> Dict[str, Any]:
        return {
            "topology_name": "Digital Twin 2.0 Production Mesh Graph",
            "nodes": [
                {
                    "id": "auth-service",
                    "label": "Auth Vault Service",
                    "type": "Microservice",
                    "health": "HEALTHY",
                },
                {
                    "id": "checkout-service",
                    "label": "Checkout API",
                    "type": "Microservice",
                    "health": "HEALTHY",
                },
                {
                    "id": "orders-service",
                    "label": "Orders Router",
                    "type": "Microservice",
                    "health": "HEALTHY",
                },
                {
                    "id": "postgres-db",
                    "label": "Postgres Primary DB",
                    "type": "Database",
                    "health": "HEALTHY",
                },
                {
                    "id": "redis-cache",
                    "label": "Redis L2 Cache",
                    "type": "Cache",
                    "health": "HEALTHY",
                },
                {
                    "id": "kafka-bus",
                    "label": "Kafka Event Bus",
                    "type": "Queue",
                    "health": "HEALTHY",
                },
            ],
            "edges": [
                {
                    "source": "checkout-service",
                    "target": "auth-service",
                    "protocol": "gRPC mTLS",
                    "p95_ms": 12,
                },
                {
                    "source": "checkout-service",
                    "target": "kafka-bus",
                    "protocol": "Kafka Producer",
                    "p95_ms": 5,
                },
                {
                    "source": "checkout-service",
                    "target": "postgres-db",
                    "protocol": "PostgreSQL SQL",
                    "p95_ms": 28,
                },
                {
                    "source": "auth-service",
                    "target": "redis-cache",
                    "protocol": "Redis RESP",
                    "p95_ms": 2,
                },
            ],
        }
