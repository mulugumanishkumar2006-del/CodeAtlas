"""
Tests for CodeAtlas v7.0 - Decision Engine, Policy/Governance, Action Provenance & Standardized Agent Platform
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.platform_v70.decision_policy_agent_platform import DecisionPolicyAgentPlatformEngine, AgentRole

client = TestClient(app)

def test_governed_action_agent_handoff_and_failsafe():
    engine = DecisionPolicyAgentPlatformEngine()
    
    act = engine.execute_governed_decision_and_action("Migrate Valkey", "MODIFY_CONTAINER_IMAGE_SPEC", "LOW")
    assert act["approval_status"] == "AUTO_APPROVED_LOW_RISK_POLICY"
    assert "sha256_audit_hash" in act["action_provenance"]
    
    handoff = engine.orchestrate_agent_handoff_workflow(AgentRole.SRE, AgentRole.ARCHITECT, "Investigate latency")
    assert handoff["handoff_status"] == "HANDOFF_SUCCESSFUL"
    
    pause = engine.set_emergency_global_failsafe_pause(True)
    assert pause["emergency_global_failsafe_pause"] is True
    
    blocked = engine.execute_governed_decision_and_action("Migrate Valkey", "MODIFY_CONTAINER_IMAGE_SPEC", "LOW")
    assert blocked["action_status"] == "BLOCKED_BY_GLOBAL_EMERGENCY_FAILSAFE_PAUSE"

def test_action_handoff_and_failsafe_api_endpoints():
    # Ensure failsafe is unpaused first
    client.post("/api/v1/platform-v70/failsafe/pause", json={"pause": False})

    res_act = client.post("/api/v1/platform-v70/action/execute", json={
        "decision_title": "Migrate Valkey",
        "action_type": "MODIFY_CONTAINER_IMAGE_SPEC",
        "risk_level": "LOW"
    })
    assert res_act.status_code == 200
    assert res_act.json()["approval_status"] == "AUTO_APPROVED_LOW_RISK_POLICY"

    res_hoff = client.post("/api/v1/platform-v70/agent/handoff", json={
        "initial_agent": AgentRole.SRE,
        "target_agent": AgentRole.ARCHITECT,
        "task": "Investigate latency"
    })
    assert res_hoff.status_code == 200
    assert res_hoff.json()["handoff_status"] == "HANDOFF_SUCCESSFUL"
