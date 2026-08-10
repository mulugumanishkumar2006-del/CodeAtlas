"""
Tests for CodeAtlas v5.1 - AI Provider Fallback Routing, Admin Operations & 10,000 Repo Load Audit
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.production_v51.ai_cost_admin_ops import AICostAndAdminOpsEngine

client = TestClient(app)

def test_ai_provider_fallback_routing():
    engine = AICostAndAdminOpsEngine()
    
    # Primary active
    primary = engine.route_ai_inference_with_fallback("Analyze payment-service", simulate_primary_failure=False)
    assert primary["status"] == "PRIMARY_PROVIDER_ACTIVE"
    assert "OpenAI" in primary["provider_used"]

    # Fallback active
    fallback = engine.route_ai_inference_with_fallback("Analyze payment-service", simulate_primary_failure=True)
    assert fallback["status"] == "FALLBACK_PROVIDER_ACTIVE"
    assert "Llama3" in fallback["provider_used"]

def test_admin_ops_and_10000_repo_load_test():
    engine = AICostAndAdminOpsEngine()
    admin = engine.execute_admin_ops_action("PAUSE_WORKERS", "all_workers")
    assert admin["admin_action"] == "PAUSE_WORKERS"

    stress = engine.run_10000_repository_load_simulation()
    assert stress["simulated_repositories"] == 10000
    assert stress["load_simulation_verdict"] == "PASSED_10000_REPO_STRESS_TEST"

    readiness = engine.audit_v51_production_readiness()
    assert readiness["production_decision"] == "CODEATLAS V5.1 PRODUCTION READY"
    assert readiness["checks_passed"] == 25

def test_ai_fallback_and_production_readiness_api_endpoints():
    res_ai = client.post("/api/v1/production-v51/ai/route-fallback", json={"prompt": "Analyze payment-service", "simulate_primary_failure": True})
    assert res_ai.status_code == 200
    assert res_ai.json()["status"] == "FALLBACK_PROVIDER_ACTIVE"

    res_stress = client.post("/api/v1/production-v51/load-test/10000-repos")
    assert res_stress.status_code == 200
    assert res_stress.json()["load_simulation_verdict"] == "PASSED_10000_REPO_STRESS_TEST"

    res_ready = client.get("/api/v1/production-v51/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["production_decision"] == "CODEATLAS V5.1 PRODUCTION READY"
