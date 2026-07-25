# apps/backend/app/reality_engine/collectors/kubernetes_collector.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class KubernetesCollector:
    def collect_k8s_reality(self, db: Session) -> Dict[str, Any]:
        return {
            "cluster_name": "prod-useast1-k8s-cluster",
            "nodes_count": 12,
            "total_pods": 84,
            "running_pods": 84,
            "failed_pods": 0,
            "cluster_cpu_capacity_pct": 58.4,
            "cluster_memory_capacity_pct": 64.2,
            "hpa_scaling_events_24h": 3,
        }
