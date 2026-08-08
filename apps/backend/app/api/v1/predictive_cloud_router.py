from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.predictive_cloud import (
    AIPredictiveCopilotResponseModel,
    CapacityForecastModel,
    CostAnomalyPredictionModel,
    DeploymentRiskPredictionModel,
    FailurePredictionModel,
    IncidentPatternPredictionModel,
    ModelMonitoringHealthModel,
    PredictiveCloudScorecardModel,
    RiskRegisterItemModel,
    WhatIfScenarioEvaluationModel,
)
from app.services.predictive_cloud_service import PredictiveCloudService

router = APIRouter(prefix="/predictive-cloud", tags=["Predictive Engineering Cloud"])


# ----------------------------------------------------
# Failure & Incident Predictions (Phases 1-10)
# ----------------------------------------------------
@router.get(
    "/predictions/failures/{target_service}",
    response_model=FailurePredictionModel,
    status_code=status.HTTP_200_OK,
)
def predict_failure_risk(
    target_service: str,
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.predict_failure_risk(target_service)


@router.get(
    "/predictions/incidents/{organization_id}",
    response_model=List[IncidentPatternPredictionModel],
    status_code=status.HTTP_200_OK,
)
def predict_incident_patterns(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.predict_incident_patterns(organization_id)


@router.get(
    "/predictions/deployment/{target_service}",
    response_model=DeploymentRiskPredictionModel,
    status_code=status.HTTP_200_OK,
)
def predict_deployment_risk(
    target_service: str,
    commit_sha: str = Query("a9b3c4d"),
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.predict_deployment_risk(target_service, commit_sha)


# ----------------------------------------------------
# Capacity & Cost Forecasting (Phases 15-20)
# ----------------------------------------------------
@router.get(
    "/predictions/capacity/{service_id}",
    response_model=CapacityForecastModel,
    status_code=status.HTTP_200_OK,
)
def forecast_capacity(
    service_id: str,
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.forecast_capacity(service_id)


@router.get(
    "/predictions/cost/{organization_id}",
    response_model=CostAnomalyPredictionModel,
    status_code=status.HTTP_200_OK,
)
def forecast_cost_anomalies(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.forecast_cost_anomalies(organization_id)


# ----------------------------------------------------
# Scenario Engine, Copilot & Risk Register (Phases 31-50)
# ----------------------------------------------------
@router.get(
    "/scenarios/evaluate",
    response_model=WhatIfScenarioEvaluationModel,
    status_code=status.HTTP_200_OK,
)
def evaluate_what_if_scenario(
    scenario_title: str = Query("What if DB latency doubles?"),
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.evaluate_what_if_scenario(scenario_title)


@router.get(
    "/risk-register/{organization_id}",
    response_model=List[RiskRegisterItemModel],
    status_code=status.HTTP_200_OK,
)
def get_risk_register(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.get_risk_register(organization_id)


@router.get(
    "/copilot",
    response_model=AIPredictiveCopilotResponseModel,
    status_code=status.HTTP_200_OK,
)
def ask_predictive_copilot(
    query: str = Query("What is likely to fail next?"),
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.ask_predictive_copilot(query)


@router.get(
    "/model-monitoring",
    response_model=List[ModelMonitoringHealthModel],
    status_code=status.HTTP_200_OK,
)
def get_model_monitoring(db: Session = Depends(get_db)):
    service = PredictiveCloudService(db=db)
    return service.get_model_monitoring()


# ----------------------------------------------------
# Scorecard (Phase 65)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=PredictiveCloudScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_predictive_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = PredictiveCloudService(db=db)
    return service.get_predictive_scorecard(organization_id)
