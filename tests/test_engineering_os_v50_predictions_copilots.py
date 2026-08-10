"""
Tests for CodeAtlas v5.0 - Evidence Reasoning, Multi-Domain Predictions & 5 Role Copilots
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.engineering_os_v50.reasoning_prediction_tradeoffs import ReasoningPredictionAndTradeoffEngine
from app.engineering_os_v50.role_copilots_command_center import RoleCopilotsAndCommandCenterEngine

client = TestClient(app)

def test_evidence_reasoning_and_predictions():
    engine = ReasoningPredictionAndTradeoffEngine()
    reasoning = engine.execute_evidence_first_reasoning("Why is checkout slow?")
    assert reasoning["confidence_score"] == 0.98
    assert len(reasoning["evidence"]) == 3

    predict = engine.predict_multi_domain_engineering_outcomes("payment-service")
    assert "failure_prediction" in predict["predictions"]
    assert "cost_prediction" in predict["predictions"]

def test_multi_objective_tradeoffs_and_role_copilots():
    trade = ReasoningPredictionAndTradeoffEngine()
    opts = trade.optimize_multi_objective_tradeoffs({"reliability": "HIGH", "cost": "MINIMIZE", "speed": "MAXIMIZE"})
    assert len(opts["optimized_strategies"]) == 2
    assert opts["optimized_strategies"][0]["score"] == 92.4

    copilot = RoleCopilotsAndCommandCenterEngine()
    cto_res = copilot.query_role_copilot("CTO", "What is overall system risk?")
    assert "system health is 98.6" in cto_res["response"]

def test_reasoning_and_copilot_api_endpoints():
    res_reason = client.post("/api/v1/engineering-os-v50/reason", json={"query": "Why is checkout slow?"})
    assert res_reason.status_code == 200
    assert res_reason.json()["confidence_score"] == 0.98

    res_copilot = client.post("/api/v1/engineering-os-v50/copilot/query", json={"role": "SRE", "query": "What is current P99?"})
    assert res_copilot.status_code == 200
    assert "42ms" in res_copilot.json()["response"]
