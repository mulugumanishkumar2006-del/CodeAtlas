"""
Tests for CodeAtlas v7.4 - Installation Lifecycle, Suspension, Problem-to-Solution Discovery & Master Harness
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.marketplace_v74.installation_lifecycle_governance_economics import InstallationLifecycleGovernanceEconomicsEngine, InstallationStatus
from app.marketplace_v74.problem_solution_master_test_harness import ProblemSolutionMasterTestHarnessEngine

client = TestClient(app)

def test_installation_suspension_problem_discovery_and_14_step_test():
    inst_engine = InstallationLifecycleGovernanceEconomicsEngine()
    
    inst = inst_engine.manage_installation_lifecycle("ast_k8s_latency_agent", "INSTALL")
    assert inst["installation"]["status"] == InstallationStatus.ENABLED
    
    susp = inst_engine.execute_policy_automatic_suspension("ast_k8s_latency_agent", "Vulnerability detected")
    assert susp["action"] == "AUTOMATIC_POLICY_SUSPENSION"
    assert susp["workspaces_suspended_count"] >= 1
    
    harness = ProblemSolutionMasterTestHarnessEngine()
    sol = harness.discover_solutions_for_problem("Why is the service slow?")
    assert len(sol["recommended_solutions"]) == 3
    
    p95 = harness.execute_phase_95_supply_chain_attack_test()
    assert p95["test_name"] == "PHASE_95_SUPPLY_CHAIN_ATTACK_TEST"
    
    p96 = harness.execute_phase_96_marketplace_manipulation_test()
    assert p96["test_name"] == "PHASE_96_MARKETPLACE_MANIPULATION_TEST"
    
    test14 = harness.execute_14_step_end_to_end_marketplace_test("Investigate latency")
    assert test14["steps_executed"] == 14
    assert test14["marketplace_test_verdict"] == "CODEATLAS_OPERATES_AS_A_TRUSTED_ENGINEERING_INTELLIGENCE_MARKETPLACE"
    
    p99 = harness.execute_phase_99_developer_ecosystem_test()
    assert p99["steps_executed"] == 10
    
    readiness = harness.audit_v74_marketplace_readiness()
    assert readiness["marketplace_decision"] == "CODEATLAS v7.4 ENGINEERING INTELLIGENCE MARKETPLACE READY"
    assert readiness["checks_passed"] == 39

def test_installation_suspension_problem_discovery_and_readiness_api_endpoints():
    res_inst = client.post("/api/v1/marketplace-v74/installation/manage", json={
        "asset_id": "ast_k8s_latency_agent",
        "action": "INSTALL"
    })
    assert res_inst.status_code == 200
    assert res_inst.json()["installation"]["status"] == InstallationStatus.ENABLED

    res_susp = client.post("/api/v1/marketplace-v74/governance/suspend", json={
        "asset_id": "ast_k8s_latency_agent",
        "reason": "Vulnerability detected"
    })
    assert res_susp.status_code == 200
    assert res_susp.json()["action"] == "AUTOMATIC_POLICY_SUSPENSION"

    res_sol = client.get("/api/v1/marketplace-v74/discovery/problem-to-solution?query=Why%20is%20service%20slow")
    assert res_sol.status_code == 200
    assert len(res_sol.json()["recommended_solutions"]) == 3

    res_p95 = client.get("/api/v1/marketplace-v74/test-harness/phase-95-supply-chain")
    assert res_p95.status_code == 200
    assert res_p95.json()["test_name"] == "PHASE_95_SUPPLY_CHAIN_ATTACK_TEST"

    res_p96 = client.get("/api/v1/marketplace-v74/test-harness/phase-96-manipulation")
    assert res_p96.status_code == 200
    assert res_p96.json()["test_name"] == "PHASE_96_MARKETPLACE_MANIPULATION_TEST"

    res_14 = client.post("/api/v1/marketplace-v74/test-harness/14-step-test", json={"problem": "Investigate latency"})
    assert res_14.status_code == 200
    assert res_14.json()["steps_executed"] == 14

    res_p99 = client.get("/api/v1/marketplace-v74/test-harness/phase-99-ecosystem")
    assert res_p99.status_code == 200
    assert res_p99.json()["steps_executed"] == 10

    res_ready = client.get("/api/v1/marketplace-v74/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["marketplace_decision"] == "CODEATLAS v7.4 ENGINEERING INTELLIGENCE MARKETPLACE READY"
