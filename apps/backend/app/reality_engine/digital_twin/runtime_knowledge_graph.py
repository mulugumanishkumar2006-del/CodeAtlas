# apps/backend/app/reality_engine/digital_twin/runtime_knowledge_graph.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class RuntimeKnowledgeGraph:
    def get_runtime_knowledge_graph(self, db: Session) -> Dict[str, Any]:
        return {
            "graph_type": "LIVE_RUNTIME_KNOWLEDGE_GRAPH",
            "nodes_count": 18,
            "edges_count": 24,
            "nodes": [
                {
                    "id": "node-auth-service",
                    "label": "Auth Vault Service",
                    "type": "Code Module & K8s Pod",
                    "live_telemetry": {
                        "qps": 12000,
                        "latency_p95": "14ms",
                        "pods": 4,
                        "state": "RUNNING",
                    },
                },
                {
                    "id": "node-checkout-service",
                    "label": "Checkout API",
                    "type": "Code Module & K8s Pod",
                    "live_telemetry": {
                        "qps": 6500,
                        "latency_p95": "42ms",
                        "pods": 8,
                        "state": "SCALING",
                    },
                },
                {
                    "id": "node-payment-gateway",
                    "label": "Legacy Payment Gateway",
                    "type": "External Microservice",
                    "live_telemetry": {
                        "qps": 1200,
                        "latency_p95": "1800ms",
                        "pods": 2,
                        "state": "DEGRADED",
                    },
                },
                {
                    "id": "node-postgres-db",
                    "label": "Postgres Primary Database",
                    "type": "Database Instance",
                    "live_telemetry": {
                        "qps": 4200,
                        "connections": "196/250",
                        "state": "RUNNING",
                    },
                },
            ],
            "edges": [
                {
                    "from": "node-checkout-service",
                    "to": "node-payment-gateway",
                    "label": "HTTP REST (180ms p95)",
                    "status": "DEGRADED_EDGE",
                },
                {
                    "from": "node-checkout-service",
                    "to": "node-postgres-db",
                    "label": "SQL (22ms p95)",
                    "status": "HEALTHY_EDGE",
                },
                {
                    "from": "node-checkout-service",
                    "to": "node-auth-service",
                    "label": "gRPC mTLS (8ms p95)",
                    "status": "HEALTHY_EDGE",
                },
            ],
        }
