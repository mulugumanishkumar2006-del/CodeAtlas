"""
Tests for CodeAtlas v6.0 - Digital Twin What-If Engine, Engineering FinOps ROI, 14-Step Loop & Audit
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.commercial_v60.digital_twin_finops_loop import DigitalTwinFinOpsAndLoopEngine

client = TestClient(app)

def test_digital_twin_what_if_and_finops_roi():
    engine = DigitalTwinFinOpsAndLoopEngine()
    
    whatif = engine.simulate_what_if_scenario("What if we replace PostgreSQL with DynamoDB?")
    assert "affected_services" in whatif["simulated_outcomes"]
    assert "PROCEED" in whatif["recommendation"]

    roi = engine.get_engineering_finops_roi("org_acme")
    assert roi["attribution_category"] == "MEASURED_AND_VERIFIED"
    assert roi["measured_value_attribution"]["investigation_time_reduced_pct"] == "78%"

def test_14_step_autonomous_engineering_loop_and_readiness_audit():
    engine = DigitalTwinFinOpsAndLoopEngine()
    
    loop14 = engine.execute_14_step_autonomous_engineering_loop("Service latency spike on checkout endpoint")
    assert loop14["steps_executed"] == 14
    assert loop14["loop_verdict"] == "CODEATLAS_AUTONOMOUS_ENGINEERING_LOOP_SUCCESSFUL"

    readiness = engine.audit_v60_commercial_readiness()
    assert readiness["commercial_decision"] == "CODEATLAS v6.0 COMMERCIAL AUTONOMOUS ENGINEERING PLATFORM READY"
    assert readiness["checks_passed"] == 22

def test_digital_twin_and_loop_api_endpoints():
    res_whatif = client.post("/api/v1/commercial-v60/digital-twin/what-if", json={"query": "What if PostgreSQL is replaced?"})
    assert res_whatif.status_code == 200
    assert "affected_services" in res_whatif.json()["simulated_outcomes"]

    res_14 = client.post("/api/v1/commercial-v60/autonomous-loop/execute", json={"problem": "Checkout latency spike"})
    assert res_14.status_code == 200
    assert res_14.json()["steps_executed"] == 14

    res_ready = client.get("/api/v1/commercial-v60/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["commercial_decision"] == "CODEATLAS v6.0 COMMERCIAL AUTONOMOUS ENGINEERING PLATFORM READY"
