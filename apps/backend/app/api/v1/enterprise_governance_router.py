from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.enterprise_governance import (
    EnterpriseGraphRequest,
    EnterpriseGraphResponse,
    EnterpriseRiskScorecardModel,
    OrgArchitectureRuleModel,
    PolicyEvaluationRequest,
    PolicyEvaluationResponse,
    SharedDecisionRecordModel,
)
from app.services.enterprise_governance_service import EnterpriseGovernanceService

router = APIRouter(prefix="/enterprise", tags=["Enterprise Governance & Multi-Repo Intelligence"])


@router.post(
    "/cross-repo-graph",
    response_model=EnterpriseGraphResponse,
    status_code=status.HTTP_200_OK,
)
def build_cross_repo_graph(
    req: EnterpriseGraphRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ CodeAtlas v1.4 Multi-Repository WSKG Cross-Repo Dependency Graph Endpoint.
    """
    service = EnterpriseGovernanceService(db=db)
    return service.build_cross_repo_graph(req)


@router.post(
    "/evaluate-policies",
    response_model=PolicyEvaluationResponse,
    status_code=status.HTTP_200_OK,
)
def evaluate_policies(
    req: PolicyEvaluationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Evaluates organization architectural rules and compliance policies across repositories.
    """
    service = EnterpriseGovernanceService(db=db)
    return service.evaluate_policies(req)


@router.post(
    "/shared-decisions",
    response_model=SharedDecisionRecordModel,
    status_code=status.HTTP_201_CREATED,
)
def create_shared_decision(
    organization_id: str = Query(...),
    title: str = Query(...),
    adr_number: str = Query(...),
    summary: str = Query(...),
    affected_repositories: List[str] = Query(default_factory=list),
    db: Session = Depends(get_db),
):
    """
    ⭐ Creates a Shared Decision Record (ADR) linked across team repositories.
    """
    service = EnterpriseGovernanceService(db=db)
    return service.create_shared_decision(organization_id, title, adr_number, summary, affected_repositories)


@router.get(
    "/shared-decisions/{organization_id}",
    response_model=List[SharedDecisionRecordModel],
    status_code=status.HTTP_200_OK,
)
def get_shared_decisions(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns all Architecture Decision Records (ADRs) for the organization.
    """
    service = EnterpriseGovernanceService(db=db)
    return service.get_shared_decisions(organization_id)


@router.get(
    "/scorecard/{organization_id}",
    response_model=EnterpriseRiskScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_enterprise_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns organization-wide risk scorecard (health score, coupling metrics, drift scores).
    """
    service = EnterpriseGovernanceService(db=db)
    return service.get_enterprise_scorecard(organization_id)


@router.get(
    "/architecture-rules/{organization_id}",
    response_model=List[OrgArchitectureRuleModel],
    status_code=status.HTTP_200_OK,
)
def get_org_architecture_rules(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns organization architecture standards and drift enforcement rules.
    """
    service = EnterpriseGovernanceService(db=db)
    return service.get_org_architecture_rules(organization_id)
