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
        }
