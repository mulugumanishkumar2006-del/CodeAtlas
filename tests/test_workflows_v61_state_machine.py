"""
Tests for CodeAtlas v6.1 - Centralized Orchestrator, 8-State Workflow State Machine & Evidence Store
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.workflows_v61.orchestrator_state_machine import CentralizedOrchestratorAndStateMachineEngine, WorkflowState, ActionRiskLevel

client = TestClient(app)

def test_workflow_creation_state_transitions_and_evidence():
    engine = CentralizedOrchestratorAndStateMachineEngine()
    
    wf = engine.create_autonomous_workflow("Incident Investigator", "Investigate checkout latency spike", ActionRiskLevel.WRITE, 50000)
    assert wf["state"] == WorkflowState.CREATED
    assert wf["budgets"]["action_limit"] == 10

    t1 = engine.transition_workflow_state(wf["workflow_id"], WorkflowState.INVESTIGATING)
    assert t1["current_state"] == WorkflowState.INVESTIGATING

    t2 = engine.transition_workflow_state(wf["workflow_id"], WorkflowState.COMPLETED)
    assert t2["current_state"] == WorkflowState.COMPLETED

    ev = engine.record_evidence(wf["workflow_id"], "OpenTelemetry", "Span latency 420ms on /checkout", 0.98)
    assert ev["total_evidence_items"] == 1
    assert ev["latest_evidence"]["confidence"] == 0.98

def test_workflow_state_machine_api_endpoints():
    res_create = client.post("/api/v1/workflows-v61/workflow/create", json={
        "name": "Security Remediator",
        "purpose": "Remediate CVE-2026-9901",
        "risk_level": "CREATE_PR",
        "budget": 60000
    })
    assert res_create.status_code == 200
    wf_id = res_create.json()["workflow_id"]

    res_trans = client.post("/api/v1/workflows-v61/workflow/state", json={
        "workflow_id": wf_id,
        "target_state": "INVESTIGATING"
    })
    assert res_trans.status_code == 200
    assert res_trans.json()["current_state"] == "INVESTIGATING"

    res_ev = client.post("/api/v1/workflows-v61/workflow/evidence", json={
        "workflow_id": wf_id,
        "source": "SAST Engine",
        "observation": "Vulnerable library dependency found",
        "confidence": 0.99
    })
    assert res_ev.status_code == 200
    assert res_ev.json()["total_evidence_items"] == 1
