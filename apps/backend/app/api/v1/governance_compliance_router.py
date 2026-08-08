# apps/backend/app/api/v1/governance_compliance_router.py

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.enterprise.governance_compliance_engine import governance_compliance_engine

router = APIRouter(prefix="/governance-compliance", tags=["Governance & Compliance Intelligence"])


# Pydantic Schemas
class ExceptionRequestSchema(BaseModel):
    policy_id: str = "pol-sec-1"
    scope: str = "user-profile-repo"
    reason: str = "C++ wrapper test suite run in progress."
    owner: str = "alex.dev@corp.com"

    model_config = ConfigDict(from_attributes=True)


class ExceptionApproveSchema(BaseModel):
    exception_id: str = "exc-1"
    decision: str = "APPROVED"  # APPROVED or REJECTED
    approver: str = "cto@acme.com"

    model_config = ConfigDict(from_attributes=True)


class PreviewPolicyChangeSchema(BaseModel):
    policy_id: str = "pol-arch-1"
    proposed_rule: str = "Require TLS 1.3 encryption on all internal microservice gRPC channels"

    model_config = ConfigDict(from_attributes=True)


class AIGovernanceAdvisorRequest(BaseModel):
    prompt: str

    model_config = ConfigDict(from_attributes=True)


# Router Endpoints
@router.get("/policies")
def get_policies(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns catalog of active engineering policies and definitions."""
    return governance_compliance_engine.get_policies()


@router.get("/controls")
def get_controls(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns reusable control library and evaluation status."""
    return governance_compliance_engine.get_controls()


@router.get("/violations")
def get_violations(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns active policy violations with evidence citations."""
    return governance_compliance_engine.get_violations()


@router.get("/evidence-gaps")
def get_evidence_gaps(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Identifies missing evidence (e.g. unassigned ownership, missing test reports)."""
    return governance_compliance_engine.get_evidence_gaps()


@router.get("/exceptions")
def get_exceptions(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns exceptions log & expiring exception warnings."""
    return governance_compliance_engine.get_exceptions()


@router.post("/exceptions/request")
def request_exception(
    req: ExceptionRequestSchema, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Submits formal policy exception request."""
    return governance_compliance_engine.request_exception(
        policy_id=req.policy_id, scope=req.scope, reason=req.reason, owner=req.owner
    )


@router.post("/exceptions/approve")
def approve_exception(
    req: ExceptionApproveSchema, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Approves or rejects policy exception request."""
    return governance_compliance_engine.approve_exception(
        exception_id=req.exception_id, decision=req.decision, approver=req.approver
    )


@router.post("/preview-change")
def preview_policy_change(
    req: PreviewPolicyChangeSchema, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Previews impact and potential new violations before activating policy changes."""
    return governance_compliance_engine.preview_policy_change(
        policy_id=req.policy_id, proposed_rule=req.proposed_rule
    )


@router.get("/audit-timeline")
def get_audit_timeline(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Generates auditor-ready evidence timeline exports."""
    return governance_compliance_engine.get_audit_timeline()


@router.post("/ai-advisor")
def query_ai_governance_advisor(
    req: AIGovernanceAdvisorRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Grounded AI Governance Advisor."""
    return governance_compliance_engine.query_ai_governance_advisor(prompt=req.prompt)
