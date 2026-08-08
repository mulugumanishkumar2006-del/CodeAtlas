from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.enterprise_scale import (
    AgentEvaluationMetricModel,
    AIGovernancePolicyModel,
    BusinessUnitModel,
    ChaosTestReportModel,
    ComplianceControlModel,
    CostAnomalyReportModel,
    CrossRepoImpactRadiusModel,
    DepartmentModel,
    EnterpriseScaleScorecardModel,
    EnterpriseSearchResultModel,
    EnterpriseSSOConfigModel,
    GovernanceDashboardModel,
    KnowledgeFreshnessModel,
    OwnershipMapModel,
    PolicyAsCodeRuleModel,
    PolicyExceptionModel,
    ReleaseTrainModel,
    RepositoryCatalogItem,
    SCIMProvisioningStatusModel,
    SecurityCenterOverviewModel,
    ServiceCatalogItem,
)
from app.services.enterprise_scale_service import EnterpriseScaleService

router = APIRouter(prefix="/enterprise-scale", tags=["Production Growth & Enterprise Scale"])


# ----------------------------------------------------
# Workspace Hierarchy & Catalogs (Phases 1-5)
# ----------------------------------------------------
@router.get(
    "/business-units/{organization_id}",
    response_model=List[BusinessUnitModel],
    status_code=status.HTTP_200_OK,
)
def get_business_units(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_business_units(organization_id)


@router.get(
    "/departments/{business_unit_id}",
    response_model=List[DepartmentModel],
    status_code=status.HTTP_200_OK,
)
def get_departments(
    business_unit_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_departments(business_unit_id)


@router.get(
    "/repository-catalog/{organization_id}",
    response_model=List[RepositoryCatalogItem],
    status_code=status.HTTP_200_OK,
)
def get_repository_catalog(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_repository_catalog(organization_id)


@router.get(
    "/service-catalog/{organization_id}",
    response_model=List[ServiceCatalogItem],
    status_code=status.HTTP_200_OK,
)
def get_service_catalog(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_service_catalog(organization_id)


@router.get(
    "/ownership/{repository_id}",
    response_model=OwnershipMapModel,
    status_code=status.HTTP_200_OK,
)
def get_ownership_map(
    repository_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_ownership_map(repository_id)


# ----------------------------------------------------
# Global Impact, Knowledge & Search (Phases 8-14)
# ----------------------------------------------------
@router.get(
    "/impact/{shared_component}",
    response_model=CrossRepoImpactRadiusModel,
    status_code=status.HTTP_200_OK,
)
def get_cross_repo_impact(
    shared_component: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_cross_repo_impact(shared_component)


@router.get(
    "/knowledge-freshness/{organization_id}",
    response_model=List[KnowledgeFreshnessModel],
    status_code=status.HTTP_200_OK,
)
def get_knowledge_freshness(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_knowledge_freshness(organization_id)


@router.get(
    "/search/{organization_id}",
    response_model=EnterpriseSearchResultModel,
    status_code=status.HTTP_200_OK,
)
def execute_enterprise_search(
    organization_id: str,
    query: str = Query("OAuth2"),
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.execute_enterprise_search(organization_id, query)


# ----------------------------------------------------
# Policy-as-Code & Governance (Phases 15-20)
# ----------------------------------------------------
@router.get(
    "/executive-dashboard/{organization_id}",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
def get_executive_dashboard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_executive_dashboard(organization_id)


@router.get(
    "/policy-as-code/{repository_id}",
    response_model=List[PolicyAsCodeRuleModel],
    status_code=status.HTTP_200_OK,
)
def evaluate_policy_as_code(
    repository_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.evaluate_policy_as_code(repository_id)


@router.post(
    "/policy-exception",
    response_model=PolicyExceptionModel,
    status_code=status.HTTP_201_CREATED,
)
def create_policy_exception(
    policy_id: str = Query(...),
    reason: str = Query(...),
    owner: str = Query("lead_architect@acme.com"),
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.create_policy_exception(policy_id, reason, owner)


@router.get(
    "/governance/{organization_id}",
    response_model=GovernanceDashboardModel,
    status_code=status.HTTP_200_OK,
)
def get_governance_dashboard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_governance_dashboard(organization_id)


# ----------------------------------------------------
# SSO, SCIM, Security & Release Train (Phases 21-33)
# ----------------------------------------------------
@router.get(
    "/sso-config/{organization_id}",
    response_model=EnterpriseSSOConfigModel,
    status_code=status.HTTP_200_OK,
)
def get_sso_config(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_sso_config(organization_id)


@router.get(
    "/scim-status/{organization_id}",
    response_model=SCIMProvisioningStatusModel,
    status_code=status.HTTP_200_OK,
)
def get_scim_status(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_scim_status(organization_id)


@router.get(
    "/compliance/{organization_id}",
    response_model=List[ComplianceControlModel],
    status_code=status.HTTP_200_OK,
)
def get_compliance_controls(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_compliance_controls(organization_id)


@router.get(
    "/security-center/{organization_id}",
    response_model=SecurityCenterOverviewModel,
    status_code=status.HTTP_200_OK,
)
def get_security_center(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_security_center(organization_id)


@router.get(
    "/release-train/{organization_id}",
    response_model=ReleaseTrainModel,
    status_code=status.HTTP_200_OK,
)
def get_release_train(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_release_train(organization_id)


# ----------------------------------------------------
# AI & Agent Governance (Phases 38-42)
# ----------------------------------------------------
@router.get(
    "/ai-governance/{organization_id}",
    response_model=AIGovernancePolicyModel,
    status_code=status.HTTP_200_OK,
)
def get_ai_governance(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_ai_governance(organization_id)


@router.get(
    "/agent-evaluation/{agent_id}",
    response_model=AgentEvaluationMetricModel,
    status_code=status.HTTP_200_OK,
)
def get_agent_evaluation(
    agent_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_agent_evaluation(agent_id)


# ----------------------------------------------------
# Chaos & FinOps (Phases 48-51)
# ----------------------------------------------------
@router.post(
    "/chaos-test",
    response_model=ChaosTestReportModel,
    status_code=status.HTTP_200_OK,
)
def run_chaos_test(
    scenario: str = Query("WORKER_FAILURE"),
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.run_chaos_test(scenario)


@router.get(
    "/cost-anomalies/{organization_id}",
    response_model=CostAnomalyReportModel,
    status_code=status.HTTP_200_OK,
)
def detect_cost_anomalies(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.detect_cost_anomalies(organization_id)


# ----------------------------------------------------
# Scorecard (Phase 66)
# ----------------------------------------------------
@router.get(
    "/scorecard/{organization_id}",
    response_model=EnterpriseScaleScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_enterprise_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseScaleService(db=db)
    return service.get_enterprise_scorecard(organization_id)
