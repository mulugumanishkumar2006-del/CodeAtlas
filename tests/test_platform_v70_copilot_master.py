"""
Tests for CodeAtlas v7.0 - Universal Copilot, Role Workspaces, 16-Step Master Test & 29-Point Readiness Audit Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.platform_v70.copilot_workspaces_master_test_harness import CopilotWorkspacesMasterTestHarnessEngine
from app.platform_v70.integrated_intelligence_risk_opportunity import IntegratedIntelligenceRiskOpportunityEngine

client = TestClient(app)

def test_subsystems_integration_copilot_workspaces_and_16_step_test():
    hub = IntegratedIntelligenceRiskOpportunityEngine()
    status = hub.get_unified_subsystem_integration_status()
    assert status["platform_integration_status"] == "ALL_SUBSYSTEMS_UNIFIED"
    assert len(status["integrated_engines"]) == 7
    
    drift = hub.detect_multi_dimensional_drift_and_reality_sync()
    assert drift["reality_synchronization_status"] == "DRIFT_DETECTED"
    assert len(drift["detected_drifts"]) == 2
    
    copilot_engine = CopilotWorkspacesMasterTestHarnessEngine()
    c_res = copilot_engine.ask_universal_copilot("Should we migrate to CockroachDB?")
    assert c_res["confidence_score"] == 0.98
    assert "architecture" in c_res["dimensions_analyzed"]
    
    ws = copilot_engine.get_role_workspace("COMMAND_CENTER")
    assert ws["workspace"] == "COMMAND_CENTER"
    assert ws["platform_health"] == "OPERATIONAL"
    
    test16 = copilot_engine.execute_16_step_end_to_end_master_intelligence_test("Should we migrate this service?")
    assert test16["steps_executed"] == 16
    assert test16["master_test_verdict"] == "CODEATLAS_OPERATES_AS_A_UNIFIED_ENGINEERING_INTELLIGENCE_PLATFORM"
    
    p99 = copilot_engine.execute_phase_99_master_intelligence_query()
    assert p99["master_question"] == "What should the organization do next?"
    assert p99["unified_recommendation"]["confidence_score"] == 0.99
    
    readiness = copilot_engine.audit_v70_platform_readiness()
    assert readiness["platform_decision"] == "CODEATLAS v7.0 ENGINEERING INTELLIGENCE PLATFORM READY"
    assert readiness["checks_passed"] == 29

def test_copilot_subsystems_and_readiness_api_endpoints():
    res_sub = client.get("/api/v1/platform-v70/subsystems/status")
    assert res_sub.status_code == 200
    assert res_sub.json()["platform_integration_status"] == "ALL_SUBSYSTEMS_UNIFIED"

    res_drift = client.get("/api/v1/platform-v70/drift/detect")
    assert res_drift.status_code == 200
    assert len(res_drift.json()["detected_drifts"]) == 2

    res_cop = client.post("/api/v1/platform-v70/copilot/ask", json={"query": "Should we migrate?"})
    assert res_cop.status_code == 200
    assert res_cop.json()["confidence_score"] == 0.98

    res_ws = client.get("/api/v1/platform-v70/workspace/role?role=COMMAND_CENTER")
    assert res_ws.status_code == 200
    assert res_ws.json()["workspace"] == "COMMAND_CENTER"

    res_16 = client.post("/api/v1/platform-v70/test-harness/16-step-test", json={"question": "Should we migrate?"})
    assert res_16.status_code == 200
    assert res_16.json()["steps_executed"] == 16

    res_p99 = client.get("/api/v1/platform-v70/test-harness/phase-99-query")
    assert res_p99.status_code == 200
    assert res_p99.json()["master_question"] == "What should the organization do next?"

    res_ready = client.get("/api/v1/platform-v70/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["platform_decision"] == "CODEATLAS v7.0 ENGINEERING INTELLIGENCE PLATFORM READY"
