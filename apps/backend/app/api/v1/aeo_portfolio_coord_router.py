# apps/backend/app/api/v1/aeo_portfolio_coord_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.aeo_portfolio_coord import (
    AIProgramManagerResponse,
    CrossRepoCoordinationResponse,
    MacroBusinessGoalRequest,
    MacroBusinessGoalResponse,
    PortfolioOptimizerRequest,
    PortfolioOptimizerResponse,
)
from app.services.aeo_portfolio_coord_service import AEOPortfolioCoordService

router = APIRouter(
    prefix="/aeo-portfolio",
    tags=["aeo_portfolio"],
)

portfolio_service = AEOPortfolioCoordService()


@router.get("/cross-repo-coordination", response_model=CrossRepoCoordinationResponse)
def get_cross_repo_coordination(
    db: Session = Depends(get_db),
) -> CrossRepoCoordinationResponse:
    """Feature 4: Cross-Repository Coordination Engine"""
    return portfolio_service.get_cross_repo_coordination(db)


@router.post("/translate-macro-goal", response_model=MacroBusinessGoalResponse)
def translate_macro_goal(
    payload: MacroBusinessGoalRequest,
    db: Session = Depends(get_db),
) -> MacroBusinessGoalResponse:
    """Feature 5: Macro Business Goal Translator ("Expand to Europe.")"""
    return portfolio_service.translate_macro_goal(payload, db)


@router.post("/optimize-portfolio", response_model=PortfolioOptimizerResponse)
def optimize_portfolio(
    payload: PortfolioOptimizerRequest,
    db: Session = Depends(get_db),
) -> PortfolioOptimizerResponse:
    """Feature 6: Engineering Portfolio Optimizer (4-Pillar Balancer)"""
    return portfolio_service.optimize_portfolio(payload, db)


@router.get("/program-manager", response_model=AIProgramManagerResponse)
def manage_program(
    db: Session = Depends(get_db),
) -> AIProgramManagerResponse:
    """Feature 7: AI Program Manager"""
    return portfolio_service.manage_program(db)
