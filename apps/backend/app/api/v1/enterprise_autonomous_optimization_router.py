# apps/backend/app/api/v1/enterprise_autonomous_optimization_router.py

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.autonomous.enterprise_autonomous_optimization_engine import enterprise_autonomous_optimization_engine
from app.core.database import get_db

router = APIRouter(prefix="/enterprise-autonomous-optimization", tags=["Enterprise Autonomous Optimization"])


# Pydantic Schemas
class ConfigureAutonomySchema(BaseModel):
    new_level: int = 4  # Level 0 to 6

    model_config = ConfigDict(from_attributes=True)


class AuthorizeExecutionSchema(BaseModel):
    opp_id: str = "opp-101"
    decision: str = "APPROVE"  # APPROVE, REJECT, MODIFY
    actor: str = "cto@acme.com"
    notes: Optional[str] = "Authorized for execution after vitest verification."

    model_config = ConfigDict(from_attributes=True)


class AIAutonomousAgentRequest(BaseModel):
    prompt: str

    model_config = ConfigDict(from_attributes=True)


# Router Endpoints
@router.get("/control-center")
def get_control_center(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Returns active control center state, autonomy level, and active optimization metrics."""
    return enterprise_autonomous_optimization_engine.get_control_center()


@router.get("/opportunities")
def get_opportunities(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns prioritized queue of optimization opportunities."""
    return enterprise_autonomous_optimization_engine.get_opportunities()


@router.post("/configure-autonomy")
def configure_autonomy(
    req: ConfigureAutonomySchema, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Updates organizational autonomy level setting within strict boundaries."""
    return enterprise_autonomous_optimization_engine.configure_autonomy(new_level=req.new_level)


@router.post("/prepare-diff")
def prepare_diff(
    opp_id: str = Query("opp-101"), db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Generates code diff preview and change artifacts without modifying production."""
    return enterprise_autonomous_optimization_engine.prepare_diff(opp_id=opp_id)


@router.post("/authorize-execution")
def authorize_execution(
    req: AuthorizeExecutionSchema, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Executes human approval decision (APPROVE / REJECT / MODIFY)."""
    return enterprise_autonomous_optimization_engine.authorize_execution(
        opp_id=req.opp_id, decision=req.decision, actor=req.actor, notes=req.notes
    )


@router.get("/timeline/{opp_id}")
def get_timeline(opp_id: str, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns 15-step execution timeline for an opportunity."""
    return enterprise_autonomous_optimization_engine.get_timeline(opp_id=opp_id)


@router.get("/learning-outcomes")
def get_learning_outcomes(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns learning loop outcomes comparing predicted vs actual impact."""
    return enterprise_autonomous_optimization_engine.get_learning_outcomes()


@router.post("/ai-agent")
def query_ai_autonomous_agent(
    req: AIAutonomousAgentRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Grounded AI Autonomous Agent query processor."""
    return enterprise_autonomous_optimization_engine.query_ai_autonomous_agent(prompt=req.prompt)
