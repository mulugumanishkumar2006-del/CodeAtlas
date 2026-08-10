"""
CodeAtlas v6.9 - Autonomous Engineering Ecosystem API Router
Exposes endpoints for Supply Chain Graph, API Monitoring, Vendor Concentration/Lock-In, Vulnerability Impact Graph, Technology Substitution, Ecosystem Scenarios, Disruption Early Warnings, Executive Ecosystem Dashboards, Developer Extension Governance, 12-Step Ecosystem Test, Phase 99 Audit, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.ecosystem_v69.ecosystem_graph_supply_chain import EcosystemGraphSupplyChainEngine
from app.ecosystem_v69.vendor_cloud_vulnerability_radar import VendorCloudVulnerabilityRadarEngine
from app.ecosystem_v69.scenarios_disruption_digital_twin import ScenariosDisruptionDigitalTwinEngine, ScenarioType
from app.ecosystem_v69.governance_views_extension_test_harness import GovernanceViewsExtensionTestHarnessEngine

router = APIRouter(prefix="/ecosystem-v69", tags=["Autonomous Engineering Ecosystem v6.9"])

supply_chain = EcosystemGraphSupplyChainEngine()
vendor_radar = VendorCloudVulnerabilityRadarEngine()
scenarios_twin = ScenariosDisruptionDigitalTwinEngine()
governance_views = GovernanceViewsExtensionTestHarnessEngine()


# --- Supply Chain & API Monitoring ---

@router.get("/supply-chain/graph")
def get_supply_chain_graph(repo_id: str = Query("CodeAtlas/apps/backend")):
    return supply_chain.get_software_supply_chain_graph(repo_id)

@router.get("/api/monitor")
def monitor_api(api_name: str = Query("Stripe Payment Gateway v1")):
    return supply_chain.monitor_external_api_ecosystem(api_name)


# --- Vendor Concentration, Vulnerabilities & Substitution ---

@router.get("/vendor/concentration")
def get_vendor_concentration():
    return vendor_radar.evaluate_vendor_concentration_and_lockin()

@router.get("/vulnerability/impact")
def get_vulnerability_impact(advisory_id: str = Query("GHSA-c5qf-59p4-qvg7")):
    return vendor_radar.generate_vulnerability_impact_graph(advisory_id)

@router.post("/technology/substitution")
def evaluate_substitution(tech: str = Body("Redis Single-Instance Caching", embed=True)):
    return vendor_radar.evaluate_technology_substitution_matrix(tech)


# --- Scenarios, Disruption & What-If ---

@router.post("/scenario/simulate")
def simulate_scenario(
    scenario_type: str = Body(ScenarioType.CLOUD_PRICE_CHANGE),
    params: Dict[str, Any] = Body(None)
):
    return scenarios_twin.run_ecosystem_scenario_simulation(scenario_type, params)

@router.get("/early-warnings")
def get_early_warnings():
    return scenarios_twin.detect_early_warnings_and_disruptions()


# --- Dashboards, Extension Model, 12-Step Test & Readiness ---

@router.get("/dashboard/executive")
def get_executive_dashboard(role: str = Query("CTO")):
    return governance_views.get_executive_ecosystem_dashboard(role)

@router.post("/extension/authorize")
def authorize_extension(
    ext_id: str = Body("ext_npm_security_scanner"),
    scope: str = Body("READ_ONLY_SUPPLY_CHAIN")
):
    return governance_views.execute_developer_extension_governance_check(ext_id, scope)

@router.post("/test-harness/12-step-test")
def run_12_step_test(dependency: str = Body("Redis BSL Licensing & Pydantic v1 Deprecation", embed=True)):
    return governance_views.execute_12_step_final_end_to_end_ecosystem_test(dependency)

@router.get("/test-harness/phase-99-question")
def run_phase_99_question():
    return governance_views.execute_final_ecosystem_question_audit()

@router.get("/readiness")
def get_ecosystem_readiness():
    return governance_views.audit_v69_autonomous_ecosystem_readiness()
