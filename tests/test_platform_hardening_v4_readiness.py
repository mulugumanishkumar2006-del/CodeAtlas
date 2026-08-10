"""
Tests for CodeAtlas v3.8 - Observability, Runbooks, Metering & CodeAtlas v4.0 Go-Live Gate
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.platform_hardening.observability_sre_runbooks import ObservabilityAndRunbookEngine
from app.platform_hardening.release_metering_v4_gate import ReleaseMeteringAndV4GateEngine, PlanTier

client = TestClient(app)

def test_observability_json_logging_and_slos():
    obs = ObservabilityAndRunbookEngine()
    log_entry = obs.format_structured_json_log("INFO", "Deployment completed", "api-gateway", request_id="req_101", trace_id="trc_202")
    assert log_entry["context"]["request_id"] == "req_101"
    assert log_entry["context"]["trace_id"] == "trc_202"

    slos = obs.get_production_slo_status()
    assert len(slos["production_slos"]) == 2
    assert slos["production_slos"][0]["status"] == "HEALTHY"

    runbook = obs.get_operational_runbook("rb_api_outage")
    assert "API Gateway Outage" in runbook["title"]

def test_plan_metering_and_graceful_degradation():
    engine = ReleaseMeteringAndV4GateEngine()
    
    # Under free limit
    free_check = engine.enforce_plan_quotas("tenant_free", PlanTier.FREE, "repositories", current_usage=2)
    assert free_check["allowed"] is True

    # Exceed free limit
    free_over = engine.enforce_plan_quotas("tenant_free", PlanTier.FREE, "repositories", current_usage=3)
    assert free_over["allowed"] is False
    assert free_over["upgrade_required"] is True

    # Vendor fallback
    fallback = engine.evaluate_graceful_degradation_fallback("openai")
    assert "LLAMA3" in fallback["fallback_action"]

def test_v4_go_live_readiness_gate_audit():
    engine = ReleaseMeteringAndV4GateEngine()
    gate_res = engine.audit_v4_go_live_readiness_gates()
    assert gate_res["go_live_decision"] == "CODEATLAS V4.0 READY"
    assert gate_res["gates_passed"] == 15
    assert gate_res["readiness_score"] == 98.6

def test_v4_readiness_gate_api_endpoint():
    res_gate = client.get("/api/v1/platform-hardening/v4-readiness-gate")
    assert res_gate.status_code == 200
    assert res_gate.json()["go_live_decision"] == "CODEATLAS V4.0 READY"
    assert res_gate.json()["readiness_score"] == 98.6
