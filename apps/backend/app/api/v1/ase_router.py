from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.autonomous.ase_engine import ase_engine
from app.core.database import get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.ase import (
    ContinuousEvolutionTriggerResponse,
    DependencyGraphResponse,
    DomainPlannerResponse,
    EngineeringEvolutionTimelineResponse,
    EvolutionItemApprovalRequest,
    EvolutionItemValidationResponse,
    EvolutionPlanItemResponse,
    EvolutionRoadmapResponse,
    InvestmentOptimizerRequest,
    InvestmentOptimizerResponse,
    SmartRefactoringQueueResponse,
    TechDebtScheduleResponse,
)

router = APIRouter()


@router.post(
    "/repositories/{repo_id}/ase/continuous-evolution",
    response_model=ContinuousEvolutionTriggerResponse,
    status_code=status.HTTP_200_OK,
)
def run_continuous_evolution(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    ⭐ Feature 1: Trigger Continuous Evolution Engine cycle for a repository.
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    res = ase_engine.run_continuous_evolution(repository_id=repo_id, db=db)
    return res


@router.get(
    "/repositories/{repo_id}/ase/evolution-timeline",
    response_model=EngineeringEvolutionTimelineResponse,
)
def get_engineering_evolution_timeline(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    🌟 Signature Feature: Engineering Evolution Timeline
    Today -> Next Sprint -> Next Quarter -> Next Year -> Ideal Architecture
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    timeline = ase_engine.get_engineering_evolution_timeline(
        repository_id=repo_id, db=db
    )
    return timeline


@router.post(
    "/repositories/{repo_id}/ase/investment-optimizer",
    response_model=InvestmentOptimizerResponse,
)
def optimize_engineering_investment(
    repo_id: str,
    body: Optional[InvestmentOptimizerRequest] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    ⭐ Feature 15: Engineering Investment Optimizer
    Answers: "If we spend N weeks improving the platform, where should we invest that time?"
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    weeks = body.timeframe_weeks if body else 2
    res = ase_engine.optimize_engineering_investment(
        repository_id=repo_id, timeframe_weeks=weeks, db=db
    )
    return res


@router.get(
    "/repositories/{repo_id}/ase/dependency-graph",
    response_model=DependencyGraphResponse,
)
def get_improvement_dependency_graph(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    ⭐ Feature 14: Improvement Dependency Graph (DAG)
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    graph = ase_engine.get_improvement_dependency_graph(repository_id=repo_id, db=db)
    return graph


@router.get(
    "/repositories/{repo_id}/ase/roadmap",
    response_model=EvolutionRoadmapResponse,
)
def get_evolution_roadmap(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    ⭐ Feature 2: AI Evolution Planner roadmap.
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    roadmap = ase_engine.generate_evolution_roadmap(
        repository_id=repo_id, timeframe_weeks=4, db=db
    )
    return roadmap


@router.post(
    "/repositories/{repo_id}/ase/roadmap/generate",
    response_model=EvolutionRoadmapResponse,
)
def generate_evolution_roadmap(
    repo_id: str,
    timeframe_weeks: int = Query(default=4, ge=1, le=12),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    ⭐ Feature 2: Regenerate multi-week evolution roadmap.
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    roadmap = ase_engine.generate_evolution_roadmap(
        repository_id=repo_id, timeframe_weeks=timeframe_weeks, db=db
    )
    return roadmap


@router.get(
    "/repositories/{repo_id}/ase/debt-schedule",
    response_model=TechDebtScheduleResponse,
)
def get_tech_debt_schedule(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    ⭐ Feature 3: Technical Debt Scheduler.
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    schedule = ase_engine.schedule_tech_debt(repository_id=repo_id, db=db)
    return schedule


@router.get(
    "/repositories/{repo_id}/ase/refactoring-queue",
    response_model=SmartRefactoringQueueResponse,
)
def get_refactoring_queue(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    ⭐ Feature 4: Smart Refactoring Queue.
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    queue = ase_engine.get_refactoring_queue(repository_id=repo_id, db=db)
    return queue


@router.get(
    "/repositories/{repo_id}/ase/planners/{planner_type}",
    response_model=DomainPlannerResponse,
)
def get_domain_planner(
    repo_id: str,
    planner_type: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    ⭐ Features 5-30: Domain Evolution Planners.
    """
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    planner_res = ase_engine.get_domain_planner(
        repository_id=repo_id, planner_type=planner_type, db=db
    )
    return planner_res


@router.post(
    "/ase/items/{item_id}/approve",
    response_model=EvolutionPlanItemResponse,
)
def approve_evolution_item(
    item_id: str,
    body: Optional[EvolutionItemApprovalRequest] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    approver_name = body.approver if body and body.approver else user.email
    try:
        item = ase_engine.approve_item(item_id=item_id, approver=approver_name, db=db)
        return item
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post(
    "/ase/items/{item_id}/reject",
    response_model=EvolutionPlanItemResponse,
)
def reject_evolution_item(
    item_id: str,
    body: Optional[EvolutionItemApprovalRequest] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    approver_name = body.approver if body and body.approver else user.email
    try:
        item = ase_engine.reject_item(item_id=item_id, approver=approver_name, db=db)
        return item
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post(
    "/ase/items/{item_id}/validate",
    response_model=EvolutionItemValidationResponse,
)
def validate_evolution_item(
    item_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        val_res = ase_engine.validate_item(item_id=item_id, db=db)
        return val_res
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
