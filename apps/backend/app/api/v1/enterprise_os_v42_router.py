"""
CodeAtlas v4.2 - Enterprise Intelligence & Organizational Engineering OS API Router
Exposes endpoints for Org Hierarchy, Bus Factor, Tech Lifecycle, Portfolios, ABAC Identity, Environment Drift, FinOps Allocation, AI Governance, and Executive Intelligence.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.enterprise_os_v42.org_model_bus_factor import OrganizationModelAndBusFactorEngine
from app.enterprise_os_v42.portfolios_tech_lifecycle import EnterprisePortfoliosAndTechLifecycleEngine
from app.enterprise_os_v42.identity_security_finops import IdentitySecurityAndFinOpsEngine
from app.enterprise_os_v42.ai_agent_executive_governance import AIAgentAndExecutiveGovernanceEngine

router = APIRouter(prefix="/enterprise-os-v42", tags=["Enterprise Intelligence & Organizational OS v4.2"])

org_bus = OrganizationModelAndBusFactorEngine()
port_tech = EnterprisePortfoliosAndTechLifecycleEngine()
id_finops = IdentitySecurityAndFinOpsEngine()
ai_exec = AIAgentAndExecutiveGovernanceEngine()


# --- Org Hierarchy & Bus Factor ---

@router.get("/org/hierarchy")
def get_org_hierarchy():
    return org_bus.get_organization_hierarchy_and_graph()

@router.get("/bus-factor")
def get_bus_factor(team: str = Query("Team-Payments")):
    return org_bus.detect_ownership_gaps_and_bus_factor(team)

@router.get("/bottlenecks")
def get_bottlenecks():
    return org_bus.analyze_cross_team_bottlenecks()


# --- Portfolios & Tech Stack Lifecycle ---

@router.get("/portfolios")
def get_portfolios():
    return port_tech.get_enterprise_portfolios_and_criticality()

@router.get("/tech-landscape")
def get_tech_landscape():
    return port_tech.get_technology_landscape_and_lifecycle()

@router.post("/migration/risk")
def calculate_migration_risk(name: str = Body(..., embed=True)):
    return port_tech.calculate_migration_portfolio_risk(name)


# --- Identity, ABAC, Security & FinOps ---

@router.post("/abac/evaluate")
def evaluate_abac(
    role: str = Body(...),
    team: str = Body(...),
    environment: str = Body(...),
    resource: str = Body(...),
    risk: str = Body(...)
):
    return id_finops.evaluate_abac_access_policy(role, team, environment, resource, risk)

@router.post("/security/policy-exception")
def request_policy_exception(
    policy_id: str = Body(...),
    reason: str = Body(...),
    owner: str = Body(...),
    duration_days: int = Body(30)
):
    return id_finops.request_security_policy_exception(policy_id, reason, owner, duration_days)

@router.get("/env/drift")
def get_env_drift():
    return id_finops.detect_environment_drift()

@router.get("/finops/cost-attribution")
def get_cost_attribution():
    return id_finops.calculate_finops_cloud_cost_attribution()


# --- AI Governance & Executive OS ---

@router.get("/ai/governance")
def get_ai_governance():
    return ai_exec.get_enterprise_ai_and_agent_governance()

@router.post("/ai/org-assistant")
def query_org_assistant(question: str = Body(..., embed=True)):
    return ai_exec.query_organizational_ai_assistant(question)

@router.get("/executive/intelligence")
def get_executive_intelligence():
    return ai_exec.get_executive_engineering_intelligence()

@router.get("/enterprise-readiness")
def get_enterprise_readiness():
    return ai_exec.audit_v42_enterprise_readiness()
