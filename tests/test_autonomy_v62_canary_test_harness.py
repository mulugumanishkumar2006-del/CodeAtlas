"""
Tests for CodeAtlas v6.2 - Self-Healing Canary Controller, Predictive Forecasting & 15-Step Test Harness
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.autonomy_v62.self_healing_canary_controller import SelfHealingAndCanaryControllerEngine, CanaryRolloutStage
from app.autonomy_v62.forecasting_memory_test_harness import ForecastingMemoryAndTestHarnessEngine

client = TestClient(app)

def test_canary_remediation_and_predictive_forecasting():
    canary_engine = SelfHealingAndCanaryControllerEngine()
    
    canary = canary_engine.execute_canary_self_healing_remediation("INC-9912", "checkout_service", "DB Migration #412")
    assert canary["verification_verdict"] == "VERIFIED_HEALTHY_STABILITY_WINDOW_SATISFIED"
    assert len(canary["canary_execution_stages"]) == 3

    harness = ForecastingMemoryAndTestHarnessEngine()
    fc = harness.generate_predictive_failure_forecast(30)
    assert len(fc["predicted_risks"]) == 2
    assert fc["predicted_risks"][0]["confidence"] == 0.94

def test_15_step_final_self_healing_test_and_readiness_audit():
    harness = ForecastingMemoryAndTestHarnessEngine()
    
    test15 = harness.execute_15_step_final_self_healing_test("Service degradation on checkout endpoint")
    assert test15["steps_executed"] == 15
    assert test15["test_verdict"] == "CODEATLAS_SELF_HEALING_ENGINEERING_AUTONOMY_VERIFIED"

    readiness = harness.audit_v62_autonomy_readiness()
    assert readiness["autonomy_decision"] == "CODEATLAS v6.2 ENGINEERING AUTONOMY READY"
    assert readiness["checks_passed"] == 20

def test_canary_and_15_step_test_api_endpoints():
    res_canary = client.post("/api/v1/autonomy-v62/canary/remediate", json={
        "incident_id": "INC-9912",
        "service": "checkout_service",
        "action": "DB Migration #412"
    })
    assert res_canary.status_code == 200
    assert res_canary.json()["verification_verdict"] == "VERIFIED_HEALTHY_STABILITY_WINDOW_SATISFIED"

    res_15 = client.post("/api/v1/autonomy-v62/test-harness/15-step-test", json={"scenario": "Service degradation"})
    assert res_15.status_code == 200
    assert res_15.json()["steps_executed"] == 15

    res_ready = client.get("/api/v1/autonomy-v62/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["autonomy_decision"] == "CODEATLAS v6.2 ENGINEERING AUTONOMY READY"
