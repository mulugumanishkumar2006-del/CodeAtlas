# apps/backend/app/api/v1/cross_org_risk_router.py

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.enterprise.cross_org_risk_engine import cross_org_risk_engine

router = APIRouter(prefix="/cross-org-risk", tags=["Cross-Organization Risk Intelligence"])


# Pydantic Schemas
class RiskSimulateRequest(BaseModel):
    scenario: str = "UPGRADE_SEC_VAULT"
    target: str = "@acme/sec-vault@1.2.0"

    model_config = ConfigDict(from_attributes=True)


class RiskGovernanceRequest(BaseModel):
    risk_id: str = "risk-cross-1"
    new_status: str = "IN_PROGRESS"
    reason: str = "Assigned to Platform Security lead for Dependabot lockfile PR review."
    actor: str = "alex.dev@corp.com"

    model_config = ConfigDict(from_attributes=True)


class AIRiskAnalystRequest(BaseModel):
    prompt: str

    model_config = ConfigDict(from_attributes=True)


# Router Endpoints
@router.get("/register")
def get_cross_org_risk_register(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns unified cross-organization risk register payload."""
    return cross_org_risk_engine.get_risk_register()


@router.get("/propagation/{risk_id}")
def get_risk_propagation(risk_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Calculates step-by-step propagation path and blast radius."""
    return cross_org_risk_engine.get_propagation_path(risk_id=risk_id)


@router.get("/concentration")
def get_risk_concentration(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Identifies convergent risk hotspots where independent risks converge."""
    return cross_org_risk_engine.get_risk_concentration()


@router.get("/risk-story/{risk_id}")
def get_risk_story(risk_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Generates executive narrative explaining risk origin, evidence, and remediation."""
    return cross_org_risk_engine.get_risk_story(risk_id=risk_id)


@router.get("/compound")
def get_compound_risks(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Detects combinations of contributing risks."""
    return cross_org_risk_engine.get_compound_risks()


@router.post("/simulate")
def simulate_risk_scenario(
    req: RiskSimulateRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Risk scenario simulator connected to Simulation Studio."""
    return cross_org_risk_engine.simulate_risk_scenario(scenario=req.scenario, target=req.target)


@router.post("/remediate")
def generate_safe_remediation(
    risk_id: str = Query("risk-cross-1"), db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Generates evidence-based mitigation plan for Autonomous Optimization."""
    return cross_org_risk_engine.generate_safe_remediation(risk_id=risk_id)


@router.post("/governance")
def update_risk_governance(
    req: RiskGovernanceRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Updates risk governance state with audit logging."""
    return cross_org_risk_engine.update_risk_governance(
        risk_id=req.risk_id, new_status=req.new_status, reason=req.reason, actor=req.actor
    )


@router.post("/ai-analyst")
def query_ai_risk_analyst(
    req: AIRiskAnalystRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Grounded AI Risk Analyst Assistant."""
    return cross_org_risk_engine.query_ai_risk_analyst(prompt=req.prompt)


@router.get("/digest")
def get_risk_alerts_digest(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Prioritized risk alert digest."""
    return cross_org_risk_engine.get_alerts_digest()
