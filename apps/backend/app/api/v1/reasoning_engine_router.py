from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.reasoning_engine import (
    AdversarialTestResult,
    EvaluationMetrics,
    InvestigationState,
    ReasoningQueryRequest,
    ReasoningQueryResponse,
)
from app.services.reasoning_service import ReasoningEngineService

router = APIRouter(prefix="/reasoning", tags=["Engineering Reasoning"])


@router.post(
    "/query",
    response_model=ReasoningQueryResponse,
    status_code=status.HTTP_200_OK,
)
def process_reasoning_query(
    req: ReasoningQueryRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ CodeAtlas v1.2 AI Engineering Reasoning Query Engine Endpoint.
    Executes intent classification, selective context planning, evidence packing,
    structured reasoning sequence, claim validation, and citation assembly.
    """
    service = ReasoningEngineService(db=db)
    return service.process_query(req)


@router.post(
    "/investigations",
    response_model=InvestigationState,
    status_code=status.HTTP_201_CREATED,
)
def create_investigation(
    repository_id: str = Query(...),
    tenant_id: str = Query("default"),
    question: str = Query(...),
    hypothesis: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    ⭐ Persists engineering investigation state for reproducible investigations.
    """
    service = ReasoningEngineService(db=db)
    return service.create_investigation(
        repository_id=repository_id,
        tenant_id=tenant_id,
        question=question,
        hypothesis=hypothesis,
    )


@router.get(
    "/investigations/{investigation_id}",
    response_model=InvestigationState,
    status_code=status.HTTP_200_OK,
)
def get_investigation(
    investigation_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Retrieves an existing investigation state by ID.
    """
    service = ReasoningEngineService(db=db)
    inv = service.get_investigation(investigation_id)
    if not inv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation state '{investigation_id}' not found.",
        )
    return inv


@router.post(
    "/evaluate",
    response_model=EvaluationMetrics,
    status_code=status.HTTP_200_OK,
)
def run_evaluation(
    repository_id: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Runs AI reasoning evaluation benchmark measuring grounding, accuracy, latency, and cost.
    """
    service = ReasoningEngineService(db=db)
    sample_queries = [
        "What is the root cause of high latency in service A?",
        "How to migrate auth service to OAuth2 without breaking API?",
        "What is the impact of changing user schema?",
    ]
    return service.evaluate_reasoning(repository_id, sample_queries)


@router.post(
    "/adversarial-test",
    response_model=List[AdversarialTestResult],
    status_code=status.HTTP_200_OK,
)
def run_adversarial_tests(
    repository_id: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Runs security adversarial test suite (prompt injection, tenant isolation, missing evidence).
    """
    service = ReasoningEngineService(db=db)
    return service.run_adversarial_tests(repository_id)
