# apps/backend/app/api/v1/enterprise_ai_cto_router.py

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.ai_cto.enterprise_ai_cto_engine import enterprise_ai_cto_engine
from app.core.database import get_db

router = APIRouter(prefix="/enterprise-ai-cto", tags=["Enterprise AI CTO Advisor"])


# Pydantic Schemas
class AICTOQueryRequest(BaseModel):
    prompt: str
    current_context: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class CompareOptionsRequest(BaseModel):
    decision_topic: str = "Decouple Analytics DB Replica"

    model_config = ConfigDict(from_attributes=True)


class ActionProposalRequest(BaseModel):
    action_type: str = "AUTONOMOUS_LOCKFILE_UPGRADE"
    target_system: str = "user-profile-repo"

    model_config = ConfigDict(from_attributes=True)


class AuthorizeActionRequest(BaseModel):
    action_id: str = "act-101"
    decision: str = "APPROVE"  # APPROVE, REJECT, MODIFY
    actor: str = "cto@acme.com"
    notes: Optional[str] = "Approved after reviewing automated vitest validation plan."

    model_config = ConfigDict(from_attributes=True)


# Router Endpoints
@router.get("/command-center")
def get_ai_cto_command_center(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Returns immediate contextual intelligence for AI CTO Command Center."""
    return enterprise_ai_cto_engine.get_command_center()


@router.get("/briefings/{cadence}")
def get_ai_cto_briefing(cadence: str = "daily", db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Generates Daily, Weekly, or Monthly Engineering Briefings."""
    return enterprise_ai_cto_engine.get_briefing(cadence=cadence)


@router.post("/query")
def query_ai_cto(
    req: AICTOQueryRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Grounded NL Query Processor with evidence citations and context retention."""
    return enterprise_ai_cto_engine.query_ai_cto(prompt=req.prompt, current_context=req.current_context)


@router.post("/compare-options")
def compare_options(
    req: CompareOptionsRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Presents structured Option A vs Option B vs Option C comparison matrix."""
    return enterprise_ai_cto_engine.compare_options(decision_topic=req.decision_topic)


@router.get("/decision-brief")
def get_decision_brief(
    decision_id: str = Query("dec-1"), db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Generates structured engineering decision brief."""
    return enterprise_ai_cto_engine.generate_decision_brief(decision_id=decision_id)


@router.post("/action-proposal")
def prepare_action_proposal(
    req: ActionProposalRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Prepares high-impact action requiring explicit human authorization."""
    return enterprise_ai_cto_engine.prepare_action_proposal(action_type=req.action_type, target=req.target_system)


@router.post("/authorize-action")
def authorize_action(
    req: AuthorizeActionRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Executes human approval / rejection / modification decision."""
    return enterprise_ai_cto_engine.authorize_action(
        action_id=req.action_id, decision=req.decision, actor=req.actor, notes=req.notes
    )
