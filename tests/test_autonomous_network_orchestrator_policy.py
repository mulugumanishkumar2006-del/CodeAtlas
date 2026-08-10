"""
Tests for CodeAtlas v3.5 - Task Orchestrator, Policy Engine & Emergency Kill Switch
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.autonomous_network.task_orchestrator import TaskOrchestratorEngine
from app.autonomous_network.risk_and_policy_engine import RiskAndPolicyEngine, PolicyDecision

client = TestClient(app)

def test_task_orchestrator_dag_planning():
    orchestrator = TaskOrchestratorEngine()
    plan = orchestrator.plan_engineering_task("Investigate checkout outage")
    assert plan["status"] == "PLANNED"
    assert len(plan["dag_steps"]) == 8

    handoff = orchestrator.execute_agent_handoff(
        from_agent="agent_sre",
        to_agent="agent_code",
        task_id=plan["task_id"],
        findings=["Redis connection pool exhausted"],
        evidence=["http_500_rate > 5%"],
        confidence=0.92,
        required_action="Generate patch for connection pool"
    )
    assert handoff["from_agent"] == "agent_sre"
    assert handoff["context_package"]["confidence"] == 0.92

    reconciled = orchestrator.reconcile_agent_findings([
        {"agent": "agent_sre", "finding": "Redis pool exhausted"},
        {"agent": "agent_arch", "finding": "PR #101 added non-async Redis client"}
    ])
    assert reconciled["reconciliation_status"] == "CONSENSUS_REACHED"

def test_risk_and_policy_engine():
    engine = RiskAndPolicyEngine()
    risk = engine.calculate_action_risk(
        prod_impact=9.0, security_impact=8.0, data_impact=7.0,
        blast_radius=8.5, reversibility=4.0, confidence=0.85, environment="production"
    )
    assert risk["risk_level"] in ["CRITICAL", "HIGH"]

    policy_dec = engine.evaluate_policy("agent_inc", "Execute Automated Rollback", "production", risk_score=8.5)
    assert policy_dec["decision"] == PolicyDecision.REQUIRE_APPROVAL

    low_risk_dec = engine.evaluate_policy("agent_doc", "Update Runbook", "staging", risk_score=2.0)
    assert low_risk_dec["decision"] == PolicyDecision.ALLOW

def test_emergency_kill_switch():
    engine = RiskAndPolicyEngine()
    ks_res = engine.trigger_emergency_kill_switch("GLOBAL", activate=True)
    assert ks_res["status"] == "PAUSED"

    policy_dec = engine.evaluate_policy("agent_code", "Generate Patch", "staging", risk_score=1.5)
    assert policy_dec["decision"] == PolicyDecision.DENY
    assert "KILL_SWITCH" in policy_dec["reason"]
