"""
Tests for CodeAtlas v6.0 - Safe Autonomy Levels L0-L5, Autonomous PR Generator & Kill Switch
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.commercial_v60.autonomy_pr_multi_agent import AutonomyPRAndMultiAgentEngine, AutonomyTier

client = TestClient(app)

def test_autonomous_pr_and_multi_agent_orchestration():
    engine = AutonomyPRAndMultiAgentEngine()
    
    pr = engine.generate_autonomous_pr("ISSUE-992", "codeatlas/checkout-service", AutonomyTier.L3_EXECUTE_WITH_APPROVAL)
    assert pr["pr_number"] == 412
    assert pr["ai_engineering_review"]["review_verdict"] == "APPROVED_PASSING_POLICY_GATES"

    agents = engine.orchestrate_multi_agent_team("Resolve checkout latency spike")
    assert agents["participating_agents_count"] == 5
    assert agents["multi_agent_consensus"] == "UNANIMOUS_CONSENSUS_REACHED"

def test_autonomy_kill_switch():
    engine = AutonomyPRAndMultiAgentEngine()
    kill = engine.trigger_autonomy_kill_switch("admin@acme.com")
    assert kill["kill_switch_status"] == "ACTIVE_STOPPED"

    blocked_pr = engine.generate_autonomous_pr("ISSUE-993", "codeatlas/payment-service")
    assert blocked_pr["status"] == "BLOCKED_BY_KILL_SWITCH"

def test_autonomy_api_endpoints():
    res_pr = client.post("/api/v1/commercial-v60/autonomy/pr", json={
        "issue_id": "ISSUE-992",
        "target_repo": "codeatlas/checkout-service",
        "autonomy_level": "L3_EXECUTE_WITH_APPROVAL"
    })
    assert res_pr.status_code == 200
    assert res_pr.json()["pr_number"] == 412

    res_kill = client.post("/api/v1/commercial-v60/autonomy/kill-switch", json={"admin": "admin@acme.com"})
    assert res_kill.status_code == 200
    assert res_kill.json()["kill_switch_status"] == "ACTIVE_STOPPED"
