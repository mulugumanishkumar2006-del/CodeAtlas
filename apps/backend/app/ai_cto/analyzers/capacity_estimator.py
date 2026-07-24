# apps/backend/app/ai_cto/analyzers/capacity_estimator.py

from typing import Any, Dict


class CapacityEstimator:
    def estimate(
        self, target_users: int = 10000, target_requests_per_sec: int = 100
    ) -> Dict[str, Any]:
        """
        Estimates compute/network/storage constraints based on target users and RPS.
        """
        # Linear scalability heuristics
        target_db_connections = max(20, int(target_requests_per_sec * 0.1))
        estimated_cache_size_gb = max(1.0, round(target_users * 0.0001, 2))
        proposed_concurrency_workers = max(4, int(target_requests_per_sec / 50))
        network_bandwidth_mbps = max(10.0, round(target_requests_per_sec * 0.5, 1))

        # Scalability predictions (Feature 4)
        cpu_bottleneck_probability = min(
            0.99, round(target_requests_per_sec / 10000.0, 2)
        )
        memory_limit_gb = max(2, int(target_users / 500000.0) * 4)
        database_contention_index = min(
            0.99, round((target_requests_per_sec * 0.1) / target_db_connections, 2)
        )
        queue_saturation_rate = min(0.99, round(target_requests_per_sec / 5000.0, 2))
        predicted_api_latency_ms = max(5, int(target_requests_per_sec * 0.05 + 15))

        # Capacity growth forecasting (Feature 16)
        storage_growth_gb_monthly = max(10.0, round(target_users * 0.002, 1))
        compute_growth_cpu_cores = max(2, int(target_requests_per_sec / 200))
        database_size_projection_gb = max(5.0, round(target_users * 0.005 + 10.0, 1))
        network_usage_gb_monthly = max(
            100.0, round(target_requests_per_sec * 5.0 * 30.0, 1)
        )

        return {
            "target_db_connections": target_db_connections,
            "estimated_cache_size_gb": estimated_cache_size_gb,
            "proposed_concurrency_workers": proposed_concurrency_workers,
            "network_bandwidth_mbps": network_bandwidth_mbps,
            "cpu_bottleneck_probability": cpu_bottleneck_probability,
            "memory_limit_gb": memory_limit_gb,
            "database_contention_index": database_contention_index,
            "queue_saturation_rate": queue_saturation_rate,
            "predicted_api_latency_ms": predicted_api_latency_ms,
            "storage_growth_gb_monthly": storage_growth_gb_monthly,
            "compute_growth_cpu_cores": compute_growth_cpu_cores,
            "database_size_projection_gb": database_size_projection_gb,
            "network_usage_gb_monthly": network_usage_gb_monthly,
        }
