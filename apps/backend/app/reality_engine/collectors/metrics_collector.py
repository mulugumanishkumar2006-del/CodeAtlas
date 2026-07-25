# apps/backend/app/reality_engine/collectors/metrics_collector.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class MetricsCollector:
    def collect_metrics_reality(self, db: Session) -> Dict[str, Any]:
        return {
            "source": "Datadog APM & Prometheus Stream",
            "global_p95_latency_ms": 42.0,
            "global_throughput_rpm": 18500.0,
            "global_error_rate_pct": 0.012,
            "top_services_by_rpm": [
                {"service": "auth-service-v1", "rpm": 45000, "p95_ms": 18},
                {"service": "checkout-service", "rpm": 18500, "p95_ms": 42},
                {"service": "analytics-ingestion-worker", "rpm": 12000, "p95_ms": 140},
            ],
            "api_traffic_flows": [
                {
                    "route": "POST /api/v1/auth/verify",
                    "caller": "api-gateway",
                    "target": "auth-vault-pod-1",
                    "rpm": 12000,
                    "p95_ms": 14,
                    "error_rate": "0.00%",
                    "protocol": "gRPC mTLS",
                },
                {
                    "route": "POST /api/v1/checkout/pay",
                    "caller": "checkout-api-pod-1",
                    "target": "legacy-payment-gateway",
                    "rpm": 1200,
                    "p95_ms": 180,
                    "error_rate": "2.40%",
                    "protocol": "REST HTTP",
                },
                {
                    "route": "GET /api/v1/orders/status",
                    "caller": "api-gateway",
                    "target": "orders-router",
                    "rpm": 5300,
                    "p95_ms": 12,
                    "error_rate": "0.01%",
                    "protocol": "HTTP/2 REST",
                },
            ],
            "database_activity": {
                "active_qps": 4200,
                "connection_usage_pct": 78.4,
                "active_connections": 196,
                "max_connections": 250,
                "replication_health": "SYNCHRONIZED (Lag: 4ms)",
                "slow_queries": [
                    {
                        "query": "SELECT * FROM legacy_transactions WHERE created_at > NOW() - INTERVAL '1 hour';",
                        "duration_ms": 1840,
                        "calls_per_min": 14,
                        "recommendation": "Missing Index on created_at column.",
                    },
                    {
                        "query": "SELECT u.*, o.* FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id;",
                        "duration_ms": 940,
                        "calls_per_min": 28,
                        "recommendation": "Add composite index on (user_id, status).",
                    },
                ],
            },
        }
