"""
Tests for CodeAtlas v7.2 - Multi-Agent Argument Graph, Command Center, 15-Step E2E Test & 36-Point Readiness Audit
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.network_v72.multi_agent_consensus_governance import MultiAgentConsensusGovernanceEngine
from app.network_v72.resilience_command_center_master_test_harness import ResilienceCommandCenterMasterTestHarnessEngine

client = TestClient(app)

def test_argument_graph_approval_command_center_and_15_step_test():
    gov_engine = MultiAgentConsensusGovernanceEngine()
    
    arg = gov_engine.evaluate_multi_agent_argument_graph("DB Migration")
    assert arg["argument_graph"]["disagreement_preserved"] is True
    assert "EU Region Data Pinning" in arg["argument_graph"]["conclusion"]
    
    appr = gov_engine.execute_cross_node_multi_party_approval("wf_01", ["node_a", "node_b"])
    assert appr["governance_status"] == "APPROVED_BY_ALL_REQUIRED_NODES"
    
    admin_engine = ResilienceCommandCenterMasterTestHarnessEngine()
    cc = admin_engine.get_network_command_center_payload()
    assert cc["network_command_center"]["active_nodes_count"] == 2
    
    p95 = admin_engine.execute_phase_95_trust_failure_test()
    assert p95["test_name"] == "PHASE_95_TRUST_FAILURE_TEST"
    
    test15 = admin_engine.execute_15_step_end_to_end_network_test("CVE-2024-35195")
    assert test15["steps_executed"] == 15
    assert test15["network_test_verdict"] == "CODEATLAS_OPERATES_AS_A_FEDERATED_AUTONOMOUS_ENGINEERING_NETWORK"
    
    p99 = admin_engine.execute_phase_99_autonomous_network_query()
    assert p99["network_question"] == "What systemic engineering risk is emerging?"
    
    readiness = admin_engine.audit_v72_autonomous_network_readiness()
    assert readiness["network_decision"] == "CODEATLAS v7.2 AUTONOMOUS ENGINEERING NETWORK READY"
    assert readiness["checks_passed"] == 36

def test_argument_graph_command_center_and_readiness_api_endpoints():
    res_arg = client.get("/api/v1/network-v72/multi-agent/argument-graph?topic=DB%20Migration")
    assert res_arg.status_code == 200
    assert res_arg.json()["argument_graph"]["disagreement_preserved"] is True

    res_appr = client.post("/api/v1/network-v72/approval/cross-node", json={"workflow_id": "wf_01", "nodes": ["node_a", "node_b"]})
    assert res_appr.status_code == 200
    assert res_appr.json()["governance_status"] == "APPROVED_BY_ALL_REQUIRED_NODES"

    res_cc = client.get("/api/v1/network-v72/command-center")
    assert res_cc.status_code == 200
    assert res_cc.json()["network_command_center"]["active_nodes_count"] == 2

    res_p95 = client.get("/api/v1/network-v72/test-harness/phase-95-trust-failure")
    assert res_p95.status_code == 200
    assert res_p95.json()["test_name"] == "PHASE_95_TRUST_FAILURE_TEST"

    res_15 = client.post("/api/v1/network-v72/test-harness/15-step-test", json={"cve": "CVE-2024-35195"})
    assert res_15.status_code == 200
    assert res_15.json()["steps_executed"] == 15

    res_p99 = client.get("/api/v1/network-v72/test-harness/phase-99-autonomous-query")
    assert res_p99.status_code == 200
    assert res_p99.json()["network_question"] == "What systemic engineering risk is emerging?"

    res_ready = client.get("/api/v1/network-v72/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["network_decision"] == "CODEATLAS v7.2 AUTONOMOUS ENGINEERING NETWORK READY"
