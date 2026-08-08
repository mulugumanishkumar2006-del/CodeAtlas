# apps/backend/app/api/v1/enterprise_simulation_router.py

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.enterprise.enterprise_simulation_engine import enterprise_simulation_engine

router = APIRouter(prefix="/enterprise-simulation", tags=["Enterprise Simulation Studio"])


# Pydantic Schemas
class CreateScenarioSchema(BaseModel):
    name: str = "Upgrade @acme/sec-vault Dependency"
    scope: str = "DEPENDENCY_UPGRADE"
    operation: str = "UPGRADE"
    target_entity: str = "@acme/sec-vault@1.2.0"
    params: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class CompareScenariosSchema(BaseModel):
    scenario_ids: List[str] = ["scen-101", "scen-102"]

    model_config = ConfigDict(from_attributes=True)


class BranchScenarioSchema(BaseModel):
    parent_scenario_id: str = "scen-101"
    branch_name: str = "Hypothesis B: Auth0 Integration"

    model_config = ConfigDict(from_attributes=True)


class AISimulationAssistantRequest(BaseModel):
    prompt: str

    model_config = ConfigDict(from_attributes=True)


# Router Endpoints
@router.get("/scenarios")
def list_scenarios(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns list of active hypothetical simulation scenarios."""
    return enterprise_simulation_engine.list_scenarios()


@router.post("/create-scenario")
def create_scenario(
    req: CreateScenarioSchema, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Creates a new hypothetical scenario without modifying baseline production state."""
    return enterprise_simulation_engine.create_scenario(
        name=req.name,
        scope=req.scope,
        operation=req.operation,
        target_entity=req.target_entity,
        params=req.params,
    )


@router.post("/run")
def run_simulation(
    scenario_id: str = Query("scen-101"), db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Calculates impact propagation, blast radius, graph diff, and risk reduction."""
    return enterprise_simulation_engine.run_simulation(scenario_id=scenario_id)


@router.get("/graph-diff/{scenario_id}")
def get_graph_diff(scenario_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Returns visual graph diff between baseline and hypothetical state."""
    return enterprise_simulation_engine.get_graph_diff(scenario_id=scenario_id)


@router.post("/compare-scenarios")
def compare_scenarios(
    req: CompareScenariosSchema, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Presents side-by-side comparison matrix for multiple scenarios."""
    return enterprise_simulation_engine.compare_scenarios(scenario_ids=req.scenario_ids)


@router.post("/branch")
def branch_scenario(
    req: BranchScenarioSchema, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Branches scenario into a sub-hypothesis without mutating baseline."""
    return enterprise_simulation_engine.branch_scenario(
        parent_scenario_id=req.parent_scenario_id, branch_name=req.branch_name
    )


@router.post("/migration-plan")
def generate_migration_plan(
    scenario_id: str = Query("scen-101"), db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Generates safe dependency-aware migration order, validation, and rollback strategy."""
    return enterprise_simulation_engine.generate_migration_plan(scenario_id=scenario_id)


@router.post("/ai-assistant")
def query_ai_simulation_assistant(
    req: AISimulationAssistantRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Grounded AI Simulation Assistant query processor."""
    return enterprise_simulation_engine.query_ai_simulation_assistant(prompt=req.prompt)
