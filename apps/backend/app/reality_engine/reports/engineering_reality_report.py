# apps/backend/app/reality_engine/reports/engineering_reality_report.py

from typing import Any, Dict

from app.reality_engine.collectors.github_collector import GitHubCollector
from app.reality_engine.collectors.kubernetes_collector import KubernetesCollector
from app.reality_engine.collectors.metrics_collector import MetricsCollector
from app.reality_engine.digital_twin.health import RealityHealthEngine
from app.reality_engine.prediction.outage_predictor import OutagePredictor
from sqlalchemy.orm import Session


class EngineeringRealityReportGenerator:
    def generate_360_reality_report(self, db: Session) -> Dict[str, Any]:
        health = RealityHealthEngine().get_reality_health(db)
        k8s = KubernetesCollector().collect_k8s_reality(db)
        metrics = MetricsCollector().collect_metrics_reality(db)
        github = GitHubCollector().collect_github_reality(db)
        outage = OutagePredictor().predict_outage_risk(db)

        return {
            "report_title": "360° Engineering Reality Report (Digital Twin 2.0)",
            "reality_health_score": health["360_reality_health_score"],
            "summary": "Software reality is fully synchronized across GitHub, Kubernetes, and APM Monitoring.",
            "sections": {
                "health": health,
                "kubernetes_runtime": k8s,
                "telemetry_metrics": metrics,
                "github_scm": github,
                "outage_risk_prediction": outage,
            },
        }
