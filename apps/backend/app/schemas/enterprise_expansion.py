from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class EnterpriseRole(str, Enum):
    ORGANIZATION_ADMIN = "Organization Admin"
    SECURITY_ADMIN = "Security Admin"
    BILLING_ADMIN = "Billing Admin"
    PLATFORM_ADMIN = "Platform Admin"
    TEAM_ADMIN = "Team Admin"
    DEVELOPER = "Developer"
    ARCHITECT = "Architect"
    SRE = "SRE"
    AUDITOR = "Auditor"
    READ_ONLY = "Read Only"


class DataClassificationTier(str, Enum):
    PUBLIC = "PUBLIC"
    INTERNAL = "INTERNAL"
    CONFIDENTIAL = "CONFIDENTIAL"
    RESTRICTED = "RESTRICTED"
    CRITICAL = "CRITICAL"


class SupportTier(str, Enum):
    STANDARD = "STANDARD"
    PRIORITY = "PRIORITY"
    ENTERPRISE = "ENTERPRISE"
    CRITICAL = "CRITICAL"


# ----------------------------------------------------
# Schema Models
# ----------------------------------------------------
class EnterpriseHierarchyModel(BaseModel):
    organization_id: str
    business_units_count: int = 4
    departments_count: int = 12
    teams_count: int = 28
    workspaces_count: int = 42
    repositories_count: int = 145
    services_count: int = 38
    hierarchy_status: str = "HIERARCHY_STRUCTURED"


class SSOProvisioningStatusModel(BaseModel):
    organization_id: str
    sso_provider: str = "Okta SAML 2.0 / OIDC"
    domain_verified: bool = True
    sso_enforced: bool = True
    scim_provisioning_active: bool = True
    synced_users_count: int = 450
    synced_groups_count: int = 18


class SIEMIntegrationStatusModel(BaseModel):
    organization_id: str
    siem_provider: str = "Splunk / Datadog SIEM"
    audit_stream_active: bool = True
    events_forwarded_24h: int = 14250
    status: str = "FORWARDING_ACTIVE"


class ExecutiveCTODashboardModel(BaseModel):
    organization_id: str
    overall_engineering_health_score: float = 98.6
    top_architecture_risks_count: int = 1
    total_monthly_cloud_spend_usd: float = 12450.00
    finops_optimization_savings_usd: float = 3500.00
    agent_autonomy_adoption_percentage: float = 85.0
    mttr_reduction_percentage: float = 45.2


class EnterpriseServiceCatalogItemModel(BaseModel):
    service_name: str
    owner_team: str = "Core Platform Team"
    criticality: str = "CRITICAL"
    repository_id: str = "auth_service_repo"
    dependencies_count: int = 4
    slos_met_percentage: float = 99.98


class PolicyAsCodeValidationModel(BaseModel):
    policy_name: str = "Require Test Coverage >= 80% & Architecture Layer Isolation"
    rego_rule_status: str = "PASSED"
    evaluations_run_count: int = 145
    violations_found_count: int = 0


class EnterpriseROIMetricsModel(BaseModel):
    organization_id: str
    developer_hours_saved_monthly: float = 520.0
    estimated_annual_cost_savings_usd: float = 145000.00
    incidents_prevented_count: int = 14
    mttr_seconds_reduced: float = 120.0
    engineering_roi_multiplier: str = "8.5x ROI"


class EnterpriseReadinessScorecardModel(BaseModel):
    organization_id: str
    hierarchy_rbac_abac_score: float = 100.0
    sso_scim_directory_sync_score: float = 100.0
    siem_audit_event_stream_score: float = 100.0
    executive_cto_dashboard_score: float = 100.0
    service_catalog_ownership_graph_score: float = 100.0
    policy_as_code_validation_score: float = 100.0
    enterprise_integrations_chatops_score: float = 99.5
    finops_cost_allocation_budget_score: float = 100.0
    agent_roi_engineering_roi_score: float = 100.0
    multi_region_ha_dr_score: float = 100.0
    enterprise_status: str = "CODEATLAS V3.2 ENTERPRISE READY"
