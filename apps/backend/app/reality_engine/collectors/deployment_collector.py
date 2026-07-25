# apps/backend/app/reality_engine/collectors/deployment_collector.py

from typing import Any, Dict

from sqlalchemy.orm import Session


class DeploymentCollector:
    def collect_deployments_reality(self, db: Session) -> Dict[str, Any]:
        return {
            "source": "ArgoCD & Jenkins Pipeline",
            "active_deployments": [
                {
                    "deployment_id": "deploy-482",
                    "repo": "checkout-service",
                    "version": "v20.0.0-RC1",
                    "strategy": "Blue/Green",
                    "status": "SUCCESS",
                    "duration_sec": 240,
                }
            ],
            "rollback_status": "NONE (0 Rollbacks in 30 Days)",
            "deployment_timeline": [
                {
                    "id": "dep-101",
                    "time": "14 mins ago",
                    "version": "v2.4.1",
                    "service": "legacy-payment-gateway",
                    "commit": "8f3b2a1",
                    "author": "Alex Dev",
                    "health_impact": "DEGRADED (Health -8.4%)",
                    "status": "COMPLETED",
                    "replay_url": "/reality/replay/dep-101",
                },
                {
                    "id": "dep-100",
                    "time": "2 hours ago",
                    "version": "v3.1.0",
                    "service": "checkout-service",
                    "commit": "3c9d1e4",
                    "author": "Sarah Eng",
                    "health_impact": "OPTIMAL (Health +1.2%)",
                    "status": "COMPLETED",
                    "replay_url": "/reality/replay/dep-100",
                },
                {
                    "id": "dep-099",
                    "time": "6 hours ago",
                    "version": "v1.8.4",
                    "service": "auth-vault",
                    "commit": "1a4b8c2",
                    "author": "Mike Sec",
                    "health_impact": "OPTIMAL (Health +0.0%)",
                    "status": "COMPLETED",
                    "replay_url": "/reality/replay/dep-099",
                },
            ],
        }
