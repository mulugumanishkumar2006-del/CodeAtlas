"""
Tests for CodeAtlas v6.9 - Ecosystem Scenarios, Early Warnings, Executive Views, Developer Extensions & 12-Step Test Harness
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem_v69.scenarios_disruption_digital_twin import ScenariosDisruptionDigitalTwinEngine, ScenarioType
from app.ecosystem_v69.governance_views_extension_test_harness import GovernanceViewsExtensionTestHarnessEngine

client = TestClient(app)

def test_scenarios_early_warnings_extension_and_12_step_test():
    scenario_engine = ScenariosDisruptionDigitalTwinEngine()
    
    sim = scenario_engine.run_ecosystem_scenario_simulation(ScenarioType.CLOUD_PRICE_CHANGE)
    assert sim["scenario_type"] == ScenarioType.CLOUD_PRICE_CHANGE
    assert len(sim["strategic_response_options"]) == 2
    
    warn = scenario_engine.detect_early_warnings_and_disruptions()
    assert len(warn["early_warnings_detected"]) == 1
    
    gov_engine = GovernanceViewsExtensionTestHarnessEngine()
    cto_dash = gov_engine.get_executive_ecosystem_dashboard("CTO")
    assert cto_dash["view"] == "CTO_ECOSYSTEM_VIEW"
    
    ext = gov_engine.execute_developer_extension_governance_check("ext_scanner", "READ_ONLY")
    assert ext["governance_status"] == "AUTHORIZED_UNDER_SANDBOX_POLICY"
    
    test12 = gov_engine.execute_12_step_final_end_to_end_ecosystem_test("Redis BSL & Pydantic v1")
    assert test12["steps_executed"] == 12
    assert test12["ecosystem_test_verdict"] == "CODEATLAS_CONTINUOUSLY_LEARNS_FROM_EXTERNAL_ECOSYSTEM_CHANGES"
    
    p99 = gov_engine.execute_final_ecosystem_question_audit()
    assert p99["final_question"] == "What external change could materially affect our organization?"
    
    readiness = gov_engine.audit_v69_autonomous_ecosystem_readiness()
    assert readiness["ecosystem_decision"] == "CODEATLAS v6.9 AUTONOMOUS ENGINEERING ECOSYSTEM READY"
    assert readiness["checks_passed"] == 24

def test_scenarios_extension_and_readiness_api_endpoints():
    res_sim = client.post("/api/v1/ecosystem-v69/scenario/simulate", json={"scenario_type": ScenarioType.CLOUD_PRICE_CHANGE})
    assert res_sim.status_code == 200
    assert res_sim.json()["scenario_type"] == ScenarioType.CLOUD_PRICE_CHANGE

    res_warn = client.get("/api/v1/ecosystem-v69/early-warnings")
    assert res_warn.status_code == 200
    assert len(res_warn.json()["early_warnings_detected"]) == 1

    res_dash = client.get("/api/v1/ecosystem-v69/dashboard/executive?role=CTO")
    assert res_dash.status_code == 200
    assert res_dash.json()["view"] == "CTO_ECOSYSTEM_VIEW"

    res_ext = client.post("/api/v1/ecosystem-v69/extension/authorize", json={"ext_id": "ext_scanner", "scope": "READ_ONLY"})
    assert res_ext.status_code == 200
    assert res_ext.json()["governance_status"] == "AUTHORIZED_UNDER_SANDBOX_POLICY"

    res_12 = client.post("/api/v1/ecosystem-v69/test-harness/12-step-test", json={"dependency": "Redis BSL"})
    assert res_12.status_code == 200
    assert res_12.json()["steps_executed"] == 12

    res_p99 = client.get("/api/v1/ecosystem-v69/test-harness/phase-99-question")
    assert res_p99.status_code == 200
    assert res_p99.json()["final_question"] == "What external change could materially affect our organization?"

    res_ready = client.get("/api/v1/ecosystem-v69/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["ecosystem_decision"] == "CODEATLAS v6.9 AUTONOMOUS ENGINEERING ECOSYSTEM READY"
