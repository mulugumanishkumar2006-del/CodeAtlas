"""
Tests for CodeAtlas v5.5 - Federated Governed Agents, 10-Step Multi-Org Scenario & Federation Audit
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.federation_v55.incidents_workflows_agents import IncidentsWorkflowsAndFederatedAgentsEngine
from app.federation_v55.explorer_sdk_network_test import NetworkExplorerAndSDKEngine

client = TestClient(app)

def test_federated_governed_agent_and_benchmarks():
    inc_engine = IncidentsWorkflowsAndFederatedAgentsEngine()
    
    agent_res = inc_engine.execute_federated_governed_agent("agent_sre_01", "org_acme", "org_globex", "VERIFY_API_COMPATIBILITY")
    assert agent_res["cross_org_approval"] == "EXPLICIT_PARTNER_APPROVED"
    assert agent_res["verdict"] == "FEDERATED_ACTION_EXECUTED_AND_VERIFIED"

    bench = inc_engine.get_privacy_preserving_benchmarks("deployment_velocity")
    assert "DIFFERENTIAL_PRIVACY" in bench["privacy_protection"]

def test_10_step_multi_org_remediation_scenario_and_audit():
    exp_engine = NetworkExplorerAndSDKEngine()
    
    test10 = exp_engine.execute_10_step_multi_org_remediation_scenario("org_payments", "org_retail", "org_cloud")
    assert test10["steps_executed"] == 10
    assert test10["scenario_verdict"] == "SUCCESSFULLY_COORDINATED_REMEDIATED_AND_REVOKED"

    readiness = exp_engine.audit_v55_federation_readiness()
    assert readiness["federation_decision"] == "CODEATLAS V5.5 FEDERATED INTELLIGENCE NETWORK READY"
    assert readiness["checks_passed"] == 20

def test_federated_agent_and_10_step_scenario_api_endpoints():
    res_agent = client.post("/api/v1/federation-v55/agent/execute", json={
        "agent_id": "agent_sre_01",
        "originating_org_id": "org_acme",
        "target_org_id": "org_globex",
        "action": "VERIFY_COMPATIBILITY"
    })
    assert res_agent.status_code == 200
    assert res_agent.json()["cross_org_approval"] == "EXPLICIT_PARTNER_APPROVED"

    res_10 = client.post("/api/v1/federation-v55/scenario/10-step-test")
    assert res_10.status_code == 200
    assert res_10.json()["steps_executed"] == 10

    res_ready = client.get("/api/v1/federation-v55/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["federation_decision"] == "CODEATLAS V5.5 FEDERATED INTELLIGENCE NETWORK READY"
