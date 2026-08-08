from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.global_optimization import (
    ArchitectureAlternativeComparisonModel,
    EngineeringScorecardModel,
    ExecutiveOptimizationSummaryModel,
    GlobalOptimizationScorecardModel,
    OptimizationExperimentModel,
    OptimizationOpportunityModel,
)
from app.services.global_optimization_service import GlobalOptimizationService

router = APIRouter(prefix="/global-optimization", tags=["Global Engineering Optimization"])


# ----------------------------------------------------
# Scorecards, Opportunities & Pareto Frontiers (Phases 1-15)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=GlobalOptimizationScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_global_optimization_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalOptimizationService(db=db)
    return service.get_global_optimization_scorecard(organization_id)


@router.get(
    "/engineering-scorecard/{organization_id}",
    response_model=EngineeringScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_engineering_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalOptimizationService(db=db)
    return service.get_engineering_scorecard(organization_id)


@router.get(
    "/opportunities/{organization_id}",
    response_model=List[OptimizationOpportunityModel],
    status_code=status.HTTP_200_OK,
)
def get_opportunities(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalOptimizationService(db=db)
    return service.get_opportunities(organization_id)


@router.get(
    "/architecture-comparison/{service_name}",
    response_model=ArchitectureAlternativeComparisonModel,
    status_code=status.HTTP_200_OK,
)
def get_architecture_comparison(
    service_name: str,
    db: Session = Depends(get_db),
):
    service = GlobalOptimizationService(db=db)
    return service.get_architecture_comparison(service_name)


# ----------------------------------------------------
# Experiments & Executive Summary (Phases 49-60)
# ----------------------------------------------------
@router.get(
    "/experiments/{organization_id}",
    response_model=List[OptimizationExperimentModel],
    status_code=status.HTTP_200_OK,
)
def get_experiments(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalOptimizationService(db=db)
    return service.get_experiments(organization_id)


@router.get(
    "/executive-summary/{organization_id}",
    response_model=ExecutiveOptimizationSummaryModel,
    status_code=status.HTTP_200_OK,
)
def get_executive_summary(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = GlobalOptimizationService(db=db)
    return service.get_executive_summary(organization_id)
