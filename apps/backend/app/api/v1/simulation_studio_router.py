from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.simulation_studio import (
    ScenarioComparisonRequest,
    ScenarioComparisonResponse,
    SimulationEvalMetrics,
    SimulationExportReport,
    SimulationRunRequest,
    SimulationRunResponse,
)
from app.services.simulation_studio_service import SimulationStudioService

router = APIRouter(prefix="/simulation", tags=["Engineering Simulation Studio"])


@router.post(
    "/run",
    response_model=SimulationRunResponse,
    status_code=status.HTTP_200_OK,
)
def run_engineering_simulation(
    req: SimulationRunRequest,
    tenant_id: str = Query("default"),
    db: Session = Depends(get_db),
):
    """
    ⭐ CodeAtlas v1.2 Engineering Simulation Studio Endpoint.
    Executes virtual graph construction, graph diffing, simulated impact & risk calculation,
    and grounded AI simulation reasoning without modifying the real repository.
    """
    service = SimulationStudioService(db=db)
    return service.run_simulation(req, tenant_id=tenant_id)


@router.post(
    "/compare",
    response_model=ScenarioComparisonResponse,
    status_code=status.HTTP_200_OK,
)
def compare_scenarios(
    req: ScenarioComparisonRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Compares multiple engineering simulation options (Option A vs Option B vs Option C).
    """
    service = SimulationStudioService(db=db)
    return service.compare_scenarios(req)


@router.get(
    "/export/{simulation_id}",
    response_model=SimulationExportReport,
    status_code=status.HTTP_200_OK,
)
def export_simulation_report(
    simulation_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Exports structured simulation decision report with impact, risk, assumptions, and validation plan.
    """
    service = SimulationStudioService(db=db)
    return service.export_simulation_report(simulation_id)


@router.post(
    "/evaluate",
    response_model=SimulationEvalMetrics,
    status_code=status.HTTP_200_OK,
)
def evaluate_simulation_engine(
    repository_id: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Runs evaluation benchmark on simulation grounding, prediction accuracy, and assumption handling.
    """
    service = SimulationStudioService(db=db)
    return service.evaluate_simulation_engine(repository_id)
