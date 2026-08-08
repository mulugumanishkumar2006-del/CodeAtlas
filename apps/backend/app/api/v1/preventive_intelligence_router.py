from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.preventive_intelligence import (
    PreventionOutcomeRequest,
    PreventionPipelineRequest,
    PreventionPipelineResponse,
    PreventionPlanModel,
    RecurrencePatternModel,
)
from app.services.preventive_intelligence_service import PreventiveIntelligenceService

router = APIRouter(prefix="/preventive", tags=["Preventive Engineering Intelligence"])


@router.post(
    "/pipeline",
    response_model=PreventionPipelineResponse,
    status_code=status.HTTP_200_OK,
)
def run_prevention_pipeline(
    req: PreventionPipelineRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ CodeAtlas v1.3 Preventive Engineering Intelligence Pipeline Endpoint.
    Connects Prediction -> Risk -> Investigation -> Candidate Interventions -> Virtual Graph Simulation -> Before/After Comparison -> Safest Option Classifier.
    """
    service = PreventiveIntelligenceService(db=db)
    return service.run_prevention_pipeline(req)


@router.post(
    "/create-plan",
    response_model=PreventionPlanModel,
    status_code=status.HTTP_201_CREATED,
)
def create_prevention_plan(
    prediction_id: str = Query(...),
    repository_id: str = Query(...),
    chosen_option_id: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Generates a non-destructive prevention plan with 9-step implementation breakdown, change boundaries, validation suite, and success criteria.
    """
    service = PreventiveIntelligenceService(db=db)
    return service.create_prevention_plan(prediction_id, repository_id, chosen_option_id)


@router.post(
    "/record-outcome",
    response_model=PreventionOutcomeRequest,
    status_code=status.HTTP_201_CREATED,
)
def record_prevention_outcome(
    req: PreventionOutcomeRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Records prevention outcome (SUCCESSFULLY_PREVENTED, PARTIALLY_IMPROVED, NOT_RESOLVED, REGRESSED) and feeds calibration back into prediction model.
    """
    service = PreventiveIntelligenceService(db=db)
    return service.record_prevention_outcome(req)


@router.get(
    "/history/{repository_id}",
    response_model=List[PreventionPlanModel],
    status_code=status.HTTP_200_OK,
)
def get_prevention_history(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns immutable history of prevention plans, interventions, and measured outcomes.
    """
    service = PreventiveIntelligenceService(db=db)
    return service.get_prevention_history(repository_id)


@router.get(
    "/recurrence/{repository_id}",
    response_model=List[RecurrencePatternModel],
    status_code=status.HTTP_200_OK,
)
def get_recurrence_patterns(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns recurrence patterns identifying repeated coupling or architectural drift on target components.
    """
    service = PreventiveIntelligenceService(db=db)
    return service.get_recurrence_patterns(repository_id)
