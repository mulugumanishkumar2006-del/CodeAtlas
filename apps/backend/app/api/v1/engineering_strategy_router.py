from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.engineering_strategy import (
    AIStrategistRequest,
    AIStrategistResponse,
    DoNothingAnalysisModel,
    LeadershipBriefModel,
    ScenarioComparisonModel,
    StrategicInitiativeItemModel,
    StrategicOptionModel,
)
from app.services.engineering_strategy_service import EngineeringStrategyService

router = APIRouter(prefix="/strategy", tags=["Engineering Strategy & Optimization"])


@router.get(
    "/options/{organization_id}",
    response_model=List[StrategicOptionModel],
    status_code=status.HTTP_200_OK,
)
def get_strategic_options(
    organization_id: str,
    target: str = Query("auth_service"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Generates candidate strategic options (Option A, B, C, D) with trade-offs and confidence scores.
    """
    service = EngineeringStrategyService(db=db)
    return service.get_strategic_options(organization_id, target)


@router.post(
    "/compare-scenarios",
    response_model=ScenarioComparisonModel,
    status_code=status.HTTP_200_OK,
)
def compare_scenarios(
    organization_id: str = Query(...),
    scenario_a: str = Query("Option B (Interface Abstraction)"),
    scenario_b: str = Query("Option A (In-Place Refactor)"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Compares Scenario A vs Scenario B using virtual graph simulations and trade-off analysis.
    """
    service = EngineeringStrategyService(db=db)
    return service.compare_scenarios(organization_id, scenario_a, scenario_b)


@router.post(
    "/do-nothing-analysis",
    response_model=DoNothingAnalysisModel,
    status_code=status.HTTP_200_OK,
)
def get_do_nothing_analysis(
    target_entity: str = Query("auth_service"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Evaluates projected risk, debt, and drift trajectory if no strategic action is taken.
    """
    service = EngineeringStrategyService(db=db)
    return service.get_do_nothing_analysis(target_entity)


@router.get(
    "/portfolio/{organization_id}",
    response_model=List[StrategicInitiativeItemModel],
    status_code=status.HTTP_200_OK,
)
def get_strategic_portfolio(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns prioritized strategic portfolio initiatives sequenced into relative roadmap phases (NOW, NEXT, LATER, OPTIONAL).
    """
    service = EngineeringStrategyService(db=db)
    return service.get_strategic_portfolio(organization_id)


@router.get(
    "/leadership-brief/{organization_id}",
    response_model=LeadershipBriefModel,
    status_code=status.HTTP_200_OK,
)
def get_leadership_brief(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Generates evidence-backed leadership brief answering: What matters most? Why? What to invest? What to defer?
    """
    service = EngineeringStrategyService(db=db)
    return service.get_leadership_brief(organization_id)


@router.post(
    "/ai-strategist/query",
    response_model=AIStrategistResponse,
    status_code=status.HTTP_200_OK,
)
def query_ai_strategist(
    req: AIStrategistRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Organizational AI Strategist RAG Assistant Endpoint with evidence citations, options, and trade-offs.
    """
    service = EngineeringStrategyService(db=db)
    return service.query_ai_strategist(req)
