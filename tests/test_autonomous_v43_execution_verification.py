"""
Tests for CodeAtlas v4.3 - Transactional Action Execution, State Comparison & Automated Rollback
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.autonomous_v43.planning_execution_verification import PlanningExecutionAndVerificationEngine, TransactionState

client = TestClient(app)

def test_transactional_execution_success():
    engine = PlanningExecutionAndVerificationEngine()
    tx = engine.execute_transactional_action_and_verify("pln_001", "Deploy Async Redis Pool Patch", simulate_verification_failure=False)
    assert tx["state"] == TransactionState.COMMIT
    assert "VERIFIED_SUCCESSFUL" in tx["verification_result"]
    assert "after_state" in tx["state_comparison"]

def test_transactional_execution_automated_rollback_on_failure():
    engine = PlanningExecutionAndVerificationEngine()
    tx_fail = engine.execute_transactional_action_and_verify("pln_001", "Deploy Faulty Patch", simulate_verification_failure=True)
    assert tx_fail["state"] == TransactionState.ROLLED_BACK
    assert tx_fail["automated_rollback"]["rollback_executed"] is True
    assert "INC-10042" in tx_fail["automated_rollback"]["incident_created"]

def test_execution_api_endpoints():
    res_success = client.post("/api/v1/autonomous-v43/transaction/execute", json={"plan_id": "pln_001", "action": "Deploy Patch", "simulate_failure": False})
    assert res_success.status_code == 200
    assert res_success.json()["state"] == TransactionState.COMMIT

    res_fail = client.post("/api/v1/autonomous-v43/transaction/execute", json={"plan_id": "pln_001", "action": "Deploy Faulty Patch", "simulate_failure": True})
    assert res_fail.status_code == 200
    assert res_fail.json()["state"] == TransactionState.ROLLED_BACK
