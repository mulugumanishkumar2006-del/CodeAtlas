"""
Tests for CodeAtlas v4.3 - Agent Registry, Tool Risk Classifier & Plan Generator
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.autonomous_v43.agent_runtime_registry import AgentRuntimeRegistryEngine, ToolRiskClass
from app.autonomous_v43.planning_execution_verification import PlanningExecutionAndVerificationEngine

client = TestClient(app)

def test_tool_risk_classification_and_kill_switch():
    engine = AgentRuntimeRegistryEngine()
    
    # Destructive tool check
    dest = engine.classify_tool_risk_and_policy("delete_database_cluster", "PRODUCTION")
    assert dest["risk_classification"] == ToolRiskClass.DESTRUCTIVE
    assert dest["requires_human_approval"] is True

    # Read-only tool check
    read_check = engine.classify_tool_risk_and_policy("fetch_repository_ast", "PRODUCTION")
    assert read_check["risk_classification"] == ToolRiskClass.READ
    assert read_check["requires_human_approval"] is False

    # Emergency Kill Switch
    ks = engine.trigger_global_emergency_kill_switch("Alice", "SEV-1 Latency Investigation Safeguard")
    assert ks["kill_switch_active"] is True
    assert ks["status"] == "ALL_AGENTS_HALTED_AND_CANCELLED"

def test_plan_generation_and_validation():
    engine = PlanningExecutionAndVerificationEngine()
    plan = engine.generate_and_validate_execution_plan("Remediate Redis Thread Pool Lock", "payment-service", "PRODUCTION")
    assert len(plan["steps"]) == 8
    assert plan["approval_required"] is True
    assert plan["approval_expiration_mins"] == 30

def test_registry_and_planning_api_endpoints():
    res_risk = client.post("/api/v1/autonomous-v43/tool/classify-risk", json={"tool": "delete_db", "environment": "PRODUCTION"})
    assert res_risk.status_code == 200
    assert res_risk.json()["risk_classification"] == ToolRiskClass.DESTRUCTIVE

    res_plan = client.post("/api/v1/autonomous-v43/plan/generate", json={"goal": "Remediate Redis Lock", "target_service": "payment-service", "environment": "PRODUCTION"})
    assert res_plan.status_code == 200
    assert len(res_plan.json()["steps"]) == 8
