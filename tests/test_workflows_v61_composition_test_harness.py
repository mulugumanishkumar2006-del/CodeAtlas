"""
Tests for CodeAtlas v6.1 - Workflow Composition, Human Review Center, 15-Step Test Harness & Audit
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.workflows_v61.composition_human_review import CompositionAndHumanReviewEngine
from app.workflows_v61.sdk_replay_test_harness import SDKReplayAndTestHarnessEngine

client = TestClient(app)

def test_workflow_composition_human_review_and_rollback():
    comp_engine = CompositionAndHumanReviewEngine()
    
    comp = comp_engine.compose_cross_workflows("Incident Investigator", ["Security Remediator", "Test Engineer"])
    assert comp["status"] == "COMPOSED_EXECUTION_GRAPH_READY"

    rev = comp_engine.submit_for_human_review("wf_inc_001", "Deploy Migration #412", "+ ADD INDEX on order_id", "MEDIUM")
    assert rev["status"] == "WAITING_HUMAN_APPROVAL"

    rb = comp_engine.execute_automated_rollback("wf_inc_001", "Post-deploy latency spike")
    assert rb["rollback_status"] == "ROLLBACK_SUCCESSFUL"

def test_15_step_final_autonomous_engineering_test_and_audit():
    harness = SDKReplayAndTestHarnessEngine()
    
    test15 = harness.execute_15_step_final_autonomous_engineering_test("Service latency spike on checkout endpoint")
    assert test15["steps_executed"] == 15
    assert test15["test_verdict"] == "CODEATLAS_CAN_SAFELY_PERFORM_REAL_ENGINEERING_WORK"

    readiness = harness.audit_v61_workflows_readiness()
    assert readiness["workflows_decision"] == "CODEATLAS v6.1 AUTONOMOUS ENGINEERING WORKFLOWS READY"
    assert readiness["checks_passed"] == 18

def test_composition_and_15_step_test_api_endpoints():
    res_comp = client.post("/api/v1/workflows-v61/composition/compose", json={
        "primary": "Incident Investigator",
        "children": ["Security Remediator", "Test Engineer"]
    })
    assert res_comp.status_code == 200
    assert res_comp.json()["status"] == "COMPOSED_EXECUTION_GRAPH_READY"

    res_15 = client.post("/api/v1/workflows-v61/test-harness/15-step-test", json={"trigger": "Checkout latency spike"})
    assert res_15.status_code == 200
    assert res_15.json()["steps_executed"] == 15

    res_ready = client.get("/api/v1/workflows-v61/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["workflows_decision"] == "CODEATLAS v6.1 AUTONOMOUS ENGINEERING WORKFLOWS READY"
