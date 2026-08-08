from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.enterprise_expansion import (
    EnterpriseHierarchyModel,
    EnterpriseReadinessScorecardModel,
    EnterpriseROIMetricsModel,
    EnterpriseServiceCatalogItemModel,
    ExecutiveCTODashboardModel,
    PolicyAsCodeValidationModel,
    SIEMIntegrationStatusModel,
    SSOProvisioningStatusModel,
)
from app.services.enterprise_expansion_service import EnterpriseExpansionService

router = APIRouter(prefix="/enterprise-expansion", tags=["Enterprise Expansion"])


# ----------------------------------------------------
# Hierarchy & SSO/SCIM (Phases 1-16)
# ----------------------------------------------------
@router.get(
    "/hierarchy/{organization_id}",
    response_model=EnterpriseHierarchyModel,
    status_code=status.HTTP_200_OK,
)
def get_enterprise_hierarchy(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseExpansionService(db=db)
    return service.get_enterprise_hierarchy(organization_id)


@router.get(
    "/sso-status/{organization_id}",
    response_model=SSOProvisioningStatusModel,
    status_code=status.HTTP_200_OK,
)
def get_sso_status(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseExpansionService(db=db)
    return service.get_sso_status(organization_id)


# ----------------------------------------------------
# SIEM, CTO Dashboard & Catalog (Phases 17-46)
# ----------------------------------------------------
@router.get(
    "/siem-status/{organization_id}",
    response_model=SIEMIntegrationStatusModel,
    status_code=status.HTTP_200_OK,
)
def get_siem_status(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseExpansionService(db=db)
    return service.get_siem_status(organization_id)


@router.get(
    "/executive-cto/{organization_id}",
    response_model=ExecutiveCTODashboardModel,
    status_code=status.HTTP_200_OK,
)
def get_executive_cto_dashboard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseExpansionService(db=db)
    return service.get_executive_cto_dashboard(organization_id)


@router.get(
    "/service-catalog/{organization_id}",
    response_model=List[EnterpriseServiceCatalogItemModel],
    status_code=status.HTTP_200_OK,
)
def get_service_catalog(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseExpansionService(db=db)
    return service.get_service_catalog(organization_id)


@router.post(
    "/policy-as-code/validate",
    response_model=PolicyAsCodeValidationModel,
    status_code=status.HTTP_200_OK,
)
def validate_policy_as_code(
    organization_id: str = Query("acme-corp"),
    db: Session = Depends(get_db),
):
    service = EnterpriseExpansionService(db=db)
    return service.validate_policy_as_code(organization_id)


# ----------------------------------------------------
# Engineering ROI & Readiness Scorecard (Phases 69, 89)
# ----------------------------------------------------
@router.get(
    "/roi/{organization_id}",
    response_model=EnterpriseROIMetricsModel,
    status_code=status.HTTP_200_OK,
)
def get_engineering_roi(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseExpansionService(db=db)
    return service.get_engineering_roi(organization_id)


@router.get(
    "/scorecard/{organization_id}",
    response_model=EnterpriseReadinessScorecardModel,
    status_code=status.HTTP_200_OK,
)
def get_enterprise_readiness_scorecard(
    organization_id: str,
    db: Session = Depends(get_db),
):
    service = EnterpriseExpansionService(db=db)
    return service.get_enterprise_readiness_scorecard(organization_id)
