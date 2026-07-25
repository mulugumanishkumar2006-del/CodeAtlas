# apps/backend/app/api/v1/reality_router.py

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.reality_engine.collectors.deployment_collector import DeploymentCollector
from app.reality_engine.collectors.github_collector import GitHubCollector
from app.reality_engine.collectors.kubernetes_collector import KubernetesCollector
from app.reality_engine.collectors.logs_collector import LogsCollector
from app.reality_engine.collectors.metrics_collector import MetricsCollector
from app.reality_engine.digital_twin.health import RealityHealthEngine
from app.reality_engine.digital_twin.runtime_state import RuntimeStateEngine
from app.reality_engine.digital_twin.topology import RealityTopologyEngine
from app.reality_engine.prediction.anomaly_detector import AnomalyDetector
from app.reality_engine.prediction.outage_predictor import OutagePredictor
from app.reality_engine.reports.engineering_reality_report import (
    EngineeringRealityReportGenerator,
)
from app.reality_engine.simulation.incident_simulator import IncidentSimulator
from app.reality_engine.simulation.traffic_simulator import TrafficSimulator

router = APIRouter(
    prefix="/reality", tags=["Engineering Reality Engine (Digital Twin 2.0)"]
)


class IncidentSimulateRequest(BaseModel):
    target_service: Optional[str] = "auth-service-v1"

    model_config = ConfigDict(from_attributes=True)


class TrafficSimulateRequest(BaseModel):
    multiplier: Optional[int] = 10

    model_config = ConfigDict(from_attributes=True)


@router.get("/status")
def get_reality_engine_status(db: Session = Depends(get_db)) -> Dict[str, Any]:
    health = RealityHealthEngine().get_reality_health(db)
    return {
        "reality_engine_status": "SYNCHRONIZED_REALITY_RUNNING",
        "version": "2.0-REALITY",
        "health_score": health["360_reality_health_score"],
        "collectors_active": 5,
    }


@router.get("/topology")
def get_realtime_topology(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return RealityTopologyEngine().get_realtime_topology(db)


@router.get("/runtime-state")
def get_runtime_state(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return RuntimeStateEngine().get_runtime_state(db)


@router.get("/telemetry")
def get_telemetry_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return MetricsCollector().collect_metrics_reality(db)


@router.get("/kubernetes")
def get_kubernetes_reality(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return KubernetesCollector().collect_k8s_reality(db)


@router.get("/github")
def get_github_reality(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GitHubCollector().collect_github_reality(db)


@router.get("/logs")
def get_logs_reality(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return LogsCollector().collect_logs_reality(db)


@router.get("/deployments")
def get_deployments_reality(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return DeploymentCollector().collect_deployments_reality(db)


@router.post("/simulate-incident", status_code=status.HTTP_200_OK)
def simulate_incident(
    req: IncidentSimulateRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return IncidentSimulator().simulate_incident(db, req.target_service)


@router.post("/simulate-traffic", status_code=status.HTTP_200_OK)
def simulate_traffic(
    req: TrafficSimulateRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return TrafficSimulator().simulate_traffic_spike(db, req.multiplier)


@router.get("/predictions")
def get_predictions(db: Session = Depends(get_db)) -> Dict[str, Any]:
    anomalies = AnomalyDetector().detect_anomalies(db)
    outage = OutagePredictor().predict_outage_risk(db)
    return {
        "anomalies": anomalies,
        "outage_prediction": outage,
    }


@router.get("/report")
def get_engineering_reality_report(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return EngineeringRealityReportGenerator().generate_360_reality_report(db)
