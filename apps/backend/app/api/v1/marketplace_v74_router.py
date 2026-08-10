"""
CodeAtlas v7.4 - Engineering Intelligence Marketplace API Router
Exposes endpoints for Asset Registration, Trust Center Profiles, Performance Evaluation, AI Workflow Composition, Installation Lifecycle, Automatic Suspension, Problem->Solution Discovery, 14-Step Marketplace Test, Phase 95/96/99 Tests, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.marketplace_v74.registry_manifests_trust_center import RegistryManifestsTrustCenterEngine, AssetType, RiskClassification
from app.marketplace_v74.evaluation_discovery_ai_composer import EvaluationDiscoveryAIComposerEngine
from app.marketplace_v74.installation_lifecycle_governance_economics import InstallationLifecycleGovernanceEconomicsEngine, InstallationStatus
from app.marketplace_v74.problem_solution_master_test_harness import ProblemSolutionMasterTestHarnessEngine

router = APIRouter(prefix="/marketplace-v74", tags=["Engineering Intelligence Marketplace v7.4"])

registry_trust = RegistryManifestsTrustCenterEngine()
eval_composer = EvaluationDiscoveryAIComposerEngine()
inst_gov = InstallationLifecycleGovernanceEconomicsEngine()
problem_harness = ProblemSolutionMasterTestHarnessEngine()


# --- Asset Registration & Trust Center ---

@router.post("/assets/register")
def register_asset(
    asset_id: str = Body("ast_custom_security_agent"),
    name: str = Body("Custom Security Audit Agent"),
    asset_type: str = Body(AssetType.AGENT),
    publisher: str = Body("Acme Dev Tools"),
    version: str = Body("1.0.0"),
    risk_class: str = Body(RiskClassification.OPERATIONAL),
    capabilities: List[str] = Body(None),
    permissions: List[str] = Body(None)
):
    return registry_trust.register_and_scan_asset(asset_id, name, asset_type, publisher, version, risk_class, capabilities, permissions)

@router.get("/trust-center/profile")
def get_trust_profile(asset_id: str = Query("ast_k8s_latency_agent")):
    return registry_trust.get_decomposable_trust_center_profile(asset_id)


# --- Evaluation Framework & AI Composer ---

@router.get("/evaluation/matrix")
def get_evaluation(asset_id: str = Query("ast_k8s_latency_agent")):
    return eval_composer.evaluate_asset_performance(asset_id)

@router.post("/ai-composer/compose")
def compose_ai_workflow(prompt: str = Body("I need a production database latency investigation workflow", embed=True)):
    return eval_composer.compose_workflow_via_ai(prompt)


# --- Installation Lifecycle & Automatic Suspension ---

@router.post("/installation/manage")
def manage_installation(
    asset_id: str = Body("ast_k8s_latency_agent"),
    action: str = Body("INSTALL"),
    org_id: str = Body("org_acme_corp"),
    ws_id: str = Body("ws_prod_checkout")
):
    return inst_gov.manage_installation_lifecycle(asset_id, action, org_id, ws_id)

@router.post("/governance/suspend")
def suspend_asset(
    asset_id: str = Body("ast_k8s_latency_agent"),
    reason: str = Body("High-risk vulnerability detected")
):
    return inst_gov.execute_policy_automatic_suspension(asset_id, reason)


# --- Problem->Solution Discovery, 14-Step Test, Phase 95/96/99 & Readiness ---

@router.get("/discovery/problem-to-solution")
def discover_solutions(query: str = Query("Why is the checkout service API experiencing P99 latency spikes?")):
    return problem_harness.discover_solutions_for_problem(query)

@router.get("/test-harness/phase-95-supply-chain")
def run_phase_95_test():
    return problem_harness.execute_phase_95_supply_chain_attack_test()

@router.get("/test-harness/phase-96-manipulation")
def run_phase_96_test():
    return problem_harness.execute_phase_96_marketplace_manipulation_test()

@router.post("/test-harness/14-step-test")
def run_14_step_test(problem: str = Body("Investigate production database latency", embed=True)):
    return problem_harness.execute_14_step_end_to_end_marketplace_test(problem)

@router.get("/test-harness/phase-99-ecosystem")
def run_phase_99_ecosystem():
    return problem_harness.execute_phase_99_developer_ecosystem_test()

@router.get("/readiness")
def get_marketplace_readiness():
    return problem_harness.audit_v74_marketplace_readiness()
