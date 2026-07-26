# apps/backend/app/api/v1/aeo_boardroom_router.py


from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.aeo_boardroom_command import (
    AIEngineeringBoardroomResponse,
    AutonomousImprovementEngineResponse,
    BoardroomProposalRequest,
    ExecutiveDashboardMetrics,
    StrategicDecisionSimulatorResponse,
)
from app.services.aeo_boardroom_service import AEOBoardroomService

router = APIRouter(
    prefix="/aeo-boardroom",
    tags=["aeo_boardroom"],
)

boardroom_service = AEOBoardroomService()


@router.post("/convene-boardroom", response_model=AIEngineeringBoardroomResponse)
def convene_boardroom(
    payload: BoardroomProposalRequest,
    db: Session = Depends(get_db),
) -> AIEngineeringBoardroomResponse:
    """🌟 Ultimate Feature: Simulates structured AI Engineering Boardroom dialogue (CTO, Architect, SRE, Security, PM -> Consensus: Migration in Q2)."""
    return boardroom_service.convene_boardroom(payload, db)


@router.post(
    "/simulate-strategic-decision", response_model=StrategicDecisionSimulatorResponse
)
def simulate_strategic_decision(
    query: str = Query(
        "Compare Option A vs Option B", description="Strategic proposal query"
    ),
    db: Session = Depends(get_db),
) -> StrategicDecisionSimulatorResponse:
    """Feature 8: Strategic Decision Simulator Engine"""
    return boardroom_service.simulate_strategic_decision(query, db)


@router.get("/executive-dashboard", response_model=ExecutiveDashboardMetrics)
def get_executive_dashboard(
    db: Session = Depends(get_db),
) -> ExecutiveDashboardMetrics:
    """Feature 9: Executive Dashboard Metrics"""
    return boardroom_service.get_executive_dashboard(db)


@router.get(
    "/autonomous-improvement", response_model=AutonomousImprovementEngineResponse
)
def run_autonomous_improvement_engine(
    db: Session = Depends(get_db),
) -> AutonomousImprovementEngineResponse:
    """Feature 10: Autonomous Improvement Engine"""
    return boardroom_service.run_autonomous_improvement_engine(db)
