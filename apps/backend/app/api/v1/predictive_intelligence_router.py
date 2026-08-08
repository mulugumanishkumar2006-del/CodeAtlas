from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.predictive_intelligence import (
    OutcomeTrackingModel,
    PredictionEvaluationMetrics,
    PredictionFeedbackModel,
    PredictionItemModel,
    PredictionRunRequest,
    PredictionRunResponse,
    PredictionWindow,
)
from app.services.predictive_intelligence_service import PredictiveIntelligenceService

router = APIRouter(prefix="/predictive", tags=["Predictive Engineering Intelligence"])


@router.get(
    "/explorer/{repository_id}",
    response_model=PredictionRunResponse,
    status_code=status.HTTP_200_OK,
)
def get_prediction_explorer(
    repository_id: str,
    time_window: str = Query("30_DAYS"),
    db: Session = Depends(get_db),
):
    """
    ⭐ CodeAtlas v1.3 Predictive Engineering Intelligence Explorer Endpoint.
    Returns evidence-grounded risk predictions (Hotspot, Change Risk, Drift, Tech Debt, Dependency, Perf, Sec) with explainability reasons.
    """
    service = PredictiveIntelligenceService(db=db)
    window_enum = PredictionWindow.DAYS_30
    if time_window == "7_DAYS":
        window_enum = PredictionWindow.DAYS_7
    elif time_window == "90_DAYS":
        window_enum = PredictionWindow.DAYS_90

    req = PredictionRunRequest(repository_id=repository_id, time_window=window_enum)
    return service.generate_predictions(req)


@router.post(
    "/predict",
    response_model=PredictionRunResponse,
    status_code=status.HTTP_200_OK,
)
def run_predictions(
    req: PredictionRunRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Generates predictive risk signals for target repository using deterministic feature baseline.
    """
    service = PredictiveIntelligenceService(db=db)
    return service.generate_predictions(req)


@router.post(
    "/feedback",
    response_model=PredictionFeedbackModel,
    status_code=status.HTTP_201_CREATED,
)
def submit_prediction_feedback(
    fb: PredictionFeedbackModel,
    db: Session = Depends(get_db),
):
    """
    ⭐ Submits developer feedback on prediction accuracy (USEFUL, NOT_USEFUL, CONFIRMED, RESOLVED).
    """
    service = PredictiveIntelligenceService(db=db)
    return service.submit_feedback(fb)


@router.post(
    "/outcome",
    response_model=OutcomeTrackingModel,
    status_code=status.HTTP_201_CREATED,
)
def record_prediction_outcome(
    oc: OutcomeTrackingModel,
    db: Session = Depends(get_db),
):
    """
    ⭐ Tracks actual outcome of predictions (CONFIRMED, FALSE_POSITIVE, FALSE_NEGATIVE, NO_EVENT).
    """
    service = PredictiveIntelligenceService(db=db)
    return service.record_outcome(oc)


@router.get(
    "/metrics/{repository_id}",
    response_model=PredictionEvaluationMetrics,
    status_code=status.HTTP_200_OK,
)
def get_prediction_metrics(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns model evaluation metrics (precision, recall, false positive rate, calibration score).
    """
    service = PredictiveIntelligenceService(db=db)
    return service.get_evaluation_metrics(repository_id)
