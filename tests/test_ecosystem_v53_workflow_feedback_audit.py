"""
Tests for CodeAtlas v5.3 - Visual Workflow Builder, Developer Feedback Loop & 14-Step Scenario Test
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem_v53.workflow_builder_plugins_sdks import VisualWorkflowAndSDKEngine
from app.ecosystem_v53.feedback_onboarding_analytics import DeveloperFeedbackAndEcosystemAuditEngine

client = TestClient(app)

def test_visual_workflow_builder_and_sdk_catalog():
    wf_engine = VisualWorkflowAndSDKEngine()
    wf = wf_engine.build_automated_workflow(
        "Vulnerability Remediation Workflow",
        "VULNERABILITY_DETECTED",
        [{"action": "CREATE_ISSUE"}, {"action": "NOTIFY_TEAM"}, {"action": "SIMULATE_UPGRADE"}]
    )
    assert wf["workflow_id"] == "wf_0001"
    assert wf["actions_count"] == 3

    sdk = wf_engine.get_connector_and_agent_sdk_catalog()
    assert "Connector-SDK" in sdk["connector_sdk_version"]
    assert len(sdk["reusable_templates"]) == 3

def test_developer_feedback_loop_and_14_step_scenario():
    fb_engine = DeveloperFeedbackAndEcosystemAuditEngine()
    fb = fb_engine.record_developer_feedback("rec_0042", "ACCEPT", "Approved async Redis connection pool")
    assert fb["feedback_action"] == "ACCEPT"
    assert fb["model_calibrated"] is True

    test14 = fb_engine.execute_14_step_developer_workflow_scenario()
    assert test14["steps_executed"] == 14
    assert test14["workflow_verdict"] == "DEVELOPER_WORKFLOW_FULLY_INTEGRATED"

    readiness = fb_engine.audit_v53_ecosystem_readiness()
    assert readiness["ecosystem_decision"] == "CODEATLAS V5.3 ECOSYSTEM READY"
    assert readiness["checks_passed"] == 26

def test_workflow_and_feedback_api_endpoints():
    res_wf = client.post("/api/v1/ecosystem-v53/workflow/build", json={
        "workflow_name": "Test Workflow",
        "trigger": "PR_OPENED",
        "actions": [{"action": "ANALYZE_IMPACT"}]
    })
    assert res_wf.status_code == 200
    assert res_wf.json()["workflow_id"] == "wf_0001"

    res_fb = client.post("/api/v1/ecosystem-v53/feedback/record", json={
        "recommendation_id": "rec_1",
        "feedback_action": "ACCEPT",
        "explanation": "Valid recommendation"
    })
    assert res_fb.status_code == 200
    assert res_fb.json()["feedback_action"] == "ACCEPT"

    res_ready = client.get("/api/v1/ecosystem-v53/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["ecosystem_decision"] == "CODEATLAS V5.3 ECOSYSTEM READY"
