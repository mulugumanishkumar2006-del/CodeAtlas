# apps/backend/app/reality_engine/digital_twin/topology.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class RealityTopologyEngine:
    def get_realtime_topology(self, db: Session) -> Dict[str, Any]:
        return {
            "topology_name": "Digital Twin 2.0 Production Mesh Graph",
            "entity_categories": [
                "Services",
                "Databases",
                "Queues",
                "APIs",
                "Load Balancers",
                "Kubernetes Pods",
            ],
            "nodes": [
                {
                    "id": "ingress-alb",
                    "label": "AWS ALB Ingress",
                    "type": "Load Balancer",
                    "health": "RUNNING",
                    "throughput_rpm": 18500,
                },
                {
                    "id": "api-gateway",
                    "label": "API Gateway Route v1",
                    "type": "API",
                    "health": "RUNNING",
                    "throughput_rpm": 18500,
                },
                {
                    "id": "auth-service",
                    "label": "Auth Vault Service",
                    "type": "Service",
                    "health": "RUNNING",
                    "throughput_rpm": 12000,
                },
                {
                    "id": "auth-pod-1",
                    "label": "auth-vault-pod-1",
                    "type": "Kubernetes Pod",
                    "health": "RUNNING",
                    "throughput_rpm": 6000,
                },
                {
                    "id": "checkout-service",
                    "label": "Checkout API",
                    "type": "Service",
                    "health": "SCALING",
                    "throughput_rpm": 6500,
                },
                {
                    "id": "checkout-pod-1",
                    "label": "checkout-api-pod-1",
                    "type": "Kubernetes Pod",
                    "health": "SCALING",
                    "throughput_rpm": 6500,
                },
                {
                    "id": "postgres-db",
                    "label": "Postgres Primary DB",
                    "type": "Database",
                    "health": "RUNNING",
                    "throughput_rpm": 4200,
                },
                {
                    "id": "redis-cache",
                    "label": "Redis L2 Cache",
                    "type": "Cache",
                    "health": "RECOVERING",
                    "throughput_rpm": 14200,
                },
                {
                    "id": "kafka-bus",
                    "label": "Kafka Event Bus",
                    "type": "Queue",
                    "health": "RUNNING",
                    "throughput_rpm": 8500,
                },
                {
                    "id": "legacy-payment",
                    "label": "Legacy Payment Gateway",
                    "type": "Service",
                    "health": "DEGRADED",
                    "throughput_rpm": 1200,
                },
            ],
            "edges": [
                {
                    "source": "ingress-alb",
                    "target": "api-gateway",
                    "protocol": "HTTPS TLS 1.3",
                    "p95_ms": 4,
                    "active_traffic_rpm": 18500,
                    "animated_flow": True,
                },
                {
                    "source": "api-gateway",
                    "target": "checkout-service",
                    "protocol": "HTTP/2 REST",
                    "p95_ms": 14,
                    "active_traffic_rpm": 6500,
                    "animated_flow": True,
                },
                {
                    "source": "api-gateway",
                    "target": "auth-service",
                    "protocol": "gRPC mTLS",
                    "p95_ms": 8,
                    "active_traffic_rpm": 12000,
                    "animated_flow": True,
                },
                {
                    "source": "auth-service",
                    "target": "auth-pod-1",
                    "protocol": "K8s ClusterIP",
                    "p95_ms": 1,
                    "active_traffic_rpm": 6000,
                    "animated_flow": True,
                },
                {
                    "source": "checkout-service",
                    "target": "checkout-pod-1",
                    "protocol": "K8s ClusterIP",
                    "p95_ms": 2,
                    "active_traffic_rpm": 6500,
                    "animated_flow": True,
                },
                {
                    "source": "checkout-service",
                    "target": "kafka-bus",
                    "protocol": "Kafka Producer",
                    "p95_ms": 5,
                    "active_traffic_rpm": 3200,
                    "animated_flow": True,
                },
                {
                    "source": "checkout-service",
                    "target": "postgres-db",
                    "protocol": "PostgreSQL SQL",
                    "p95_ms": 28,
                    "active_traffic_rpm": 4200,
                    "animated_flow": True,
                },
                {
                    "source": "auth-service",
                    "target": "redis-cache",
                    "protocol": "Redis RESP",
                    "p95_ms": 2,
                    "active_traffic_rpm": 14200,
                    "animated_flow": True,
                },
                {
                    "source": "checkout-service",
                    "target": "legacy-payment",
                    "protocol": "REST HTTP",
                    "p95_ms": 180,
                    "active_traffic_rpm": 1200,
                    "animated_flow": True,
                },
            ],
        }
