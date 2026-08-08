# apps/backend/app/api/v1/enterprise_architecture_router.py

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.enterprise.enterprise_architecture_engine import enterprise_architecture_engine

router = APIRouter(prefix="/enterprise-architecture", tags=["Enterprise Architecture Intelligence"])


# Pydantic Schemas
class ArchSimulateRequest(BaseModel):
    scenario: str = "DECOUPLE_ANALYTICS_DB"
    target: str = "PaymentProcessingEngine"

    model_config = ConfigDict(from_attributes=True)


class AIArchitectRequest(BaseModel):
    prompt: str

    model_config = ConfigDict(from_attributes=True)


# Router Endpoints
@router.get("/topology")
def get_progressive_topology(
    level: int = Query(4, ge=1, le=7), db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Returns 7-Level progressive architecture disclosure topology."""
    return enterprise_architecture_engine.get_progressive_topology(level=level)


@router.get("/boundaries")
def get_architecture_boundaries(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Detects Clear, Weak, Shared, and Violation architecture boundaries."""
    return enterprise_architecture_engine.get_boundaries()


@router.get("/drift")
def get_architecture_drift(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Detects Expected vs Observed architecture mismatches."""
    return enterprise_architecture_engine.get_drift_report()


@router.get("/coupling-hotspots")
def get_coupling_hotspots(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Multi-factor coupling metrics & high-complexity hotspots."""
    return enterprise_architecture_engine.get_coupling_hotspots()


@router.get("/spof-bottlenecks")
def get_spof_and_bottlenecks(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """SPOF and bottleneck radar."""
    return enterprise_architecture_engine.get_spof_and_bottlenecks()


@router.get("/scorecard")
def get_architecture_scorecard(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """10-Dimensional explainable architecture scorecard."""
    return enterprise_architecture_engine.get_scorecard()


@router.get("/data-flows")
def get_data_flows(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """End-to-end data flow tracing."""
    return enterprise_architecture_engine.get_data_flows()


@router.get("/diff")
def get_architecture_diff(
    snapshot_a: str = Query("2026-01-01"), snapshot_b: str = Query("CURRENT"), db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Compares architecture states across time."""
    return enterprise_architecture_engine.get_architecture_diff(snapshot_a=snapshot_a, snapshot_b=snapshot_b)


@router.post("/simulate")
def simulate_architecture(
    req: ArchSimulateRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Refactoring & failure impact simulator."""
    return enterprise_architecture_engine.simulate_architecture(scenario=req.scenario, target=req.target)


@router.post("/ai-architect")
def query_ai_architect(
    req: AIArchitectRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Grounded AI Architect Assistant."""
    return enterprise_architecture_engine.query_ai_architect(prompt=req.prompt)
