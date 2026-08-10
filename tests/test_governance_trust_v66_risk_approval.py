"""
Tests for CodeAtlas v6.6 - Risk Engine, Approval Workflows, Explainability & Complete Decision Trace
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.governance_trust_v66.risk_approval_explainability_trace import RiskApprovalExplainabilityTraceEngine, RiskLevel

client = TestClient(app)

def test_risk_approval_and_complete_decision_trace():
    engine = RiskApprovalExplainabilityTraceEngine()
    
    risk = engine.evaluate_action_risk_level("Online Database Schema Switchover", "PRODUCTION", "REVERSIBLE_VIA_DUAL_WRITE", 4)
    assert risk["calculated_risk_level"] == RiskLevel.HIGH
    
    context = engine.generate_approval_context_payload("CockroachDB Switchover", RiskLevel.HIGH)
    assert context["multi_approval_required"] is True
    assert len(context["required_approvers"]) == 2
    
    chain = engine.build_complete_decision_chain_trace("Migrate Checkout DB to CockroachDB")
    assert chain["traceability_status"] == "COMPLETE_END_TO_END_TRACEABILITY_CONFIRMED"
    assert "stage_1_evidence" in chain["complete_chain"]
    assert "stage_6_outcome" in chain["complete_chain"]

def test_risk_and_approval_api_endpoints():
    res_risk = client.post("/api/v1/governance-trust-v66/risk/evaluate", json={
        "action_name": "Online Schema Switchover",
        "environment": "PRODUCTION",
        "reversibility": "REVERSIBLE_VIA_DUAL_WRITE",
        "affected_services": 4
    })
    assert res_risk.status_code == 200
    assert res_risk.json()["calculated_risk_level"] == "HIGH"

    res_appr = client.get("/api/v1/governance-trust-v66/approval/context?action_name=CockroachDB Switchover")
    assert res_appr.status_code == 200
    assert res_appr.json()["multi_approval_required"] is True

    res_trace = client.get("/api/v1/governance-trust-v66/trace/decision-chain?recommendation=Migrate Checkout DB")
    assert res_trace.status_code == 200
    assert res_trace.json()["traceability_status"] == "COMPLETE_END_TO_END_TRACEABILITY_CONFIRMED"
