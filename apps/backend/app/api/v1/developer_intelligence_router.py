from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.developer_intelligence import (
    AIReviewRequest,
    AIReviewResponse,
    DecisionRecordModel,
    ImplementationPlanModel,
    InvestigationRequest,
    InvestigationResponse,
    OptionModel,
    PlanVsActualDiff,
)
from app.services.developer_intelligence_service import DeveloperIntelligenceService

router = APIRouter(prefix="/developer-intelligence", tags=["Core Developer Intelligence"])


@router.post(
    "/investigate",
    response_model=InvestigationResponse,
    status_code=status.HTTP_200_OK,
)
def start_developer_investigation(
    req: InvestigationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ CodeAtlas v1.3 Core Developer Intelligence Investigation Endpoint.
    Answers 'What is happening? Why? What is affected? What should I do next?'
    with multi-hypothesis management, structured findings, candidate options, and grounded recommendations.
    """
    service = DeveloperIntelligenceService(db=db)
    return service.start_investigation(req)


@router.post(
    "/generate-options",
    response_model=List[OptionModel],
    status_code=status.HTTP_200_OK,
)
def generate_and_simulate_options(
    repository_id: str = Query(...),
    question: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Generates multiple engineering options (Option A, B, C), simulates virtual graph diffs via v1.2 Simulation Engine, and computes explainable option scores.
    """
    service = DeveloperIntelligenceService(db=db)
    return service.generate_and_simulate_options(repository_id, question)


@router.post(
    "/record-decision",
    response_model=DecisionRecordModel,
    status_code=status.HTTP_201_CREATED,
)
def record_engineering_decision(
    dec: DecisionRecordModel,
    db: Session = Depends(get_db),
):
    """
    ⭐ Records an engineering decision record with chosen option, rationale, tradeoffs, and validation plan.
    """
    service = DeveloperIntelligenceService(db=db)
    return service.record_decision(dec)


@router.get(
    "/decision-history/{repository_id}",
    response_model=List[DecisionRecordModel],
    status_code=status.HTTP_200_OK,
)
def get_decision_history(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns immutable engineering decision history for a repository.
    """
    service = DeveloperIntelligenceService(db=db)
    return service.get_decision_history(repository_id)


@router.post(
    "/create-implementation-plan",
    response_model=ImplementationPlanModel,
    status_code=status.HTTP_201_CREATED,
)
def create_implementation_plan(
    decision_id: str = Query(...),
    repository_id: str = Query(...),
    title: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Generates a non-destructive implementation plan and checklist from a recorded decision.
    """
    service = DeveloperIntelligenceService(db=db)
    return service.create_implementation_plan(decision_id, repository_id, title)


@router.post(
    "/validate-plan-vs-actual",
    response_model=PlanVsActualDiff,
    status_code=status.HTTP_200_OK,
)
def validate_plan_vs_actual(
    plan_id: str = Query(...),
    git_diff_text: str = Query(""),
    db: Session = Depends(get_db),
):
    """
    ⭐ Compares planned impact vs actual impact via Git diff analysis.
    """
    service = DeveloperIntelligenceService(db=db)
    return service.validate_plan_vs_actual(plan_id, git_diff_text)


@router.post(
    "/ai-review",
    response_model=AIReviewResponse,
    status_code=status.HTTP_200_OK,
)
def run_ai_review(
    req: AIReviewRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Runs AI engineering review checking matched plan fidelity, assumption validity, and unexpected dependencies.
    """
    service = DeveloperIntelligenceService(db=db)
    return service.run_ai_review(req)
