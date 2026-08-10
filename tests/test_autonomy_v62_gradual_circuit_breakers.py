"""
Tests for CodeAtlas v6.2 - Gradual Autonomy Promotion/Demotion & Circuit Breaker Engine
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.autonomy_v62.gradual_autonomy_circuit_breakers import GradualAutonomyAndCircuitBreakerEngine, AutonomyPromotionStage

client = TestClient(app)

def test_autonomy_promotion_demotion_and_circuit_breaker():
    engine = GradualAutonomyAndCircuitBreakerEngine()
    
    prom = engine.evaluate_and_promote_autonomy("security_remediator", consecutive_successes=12)
    assert prom["promoted_stage"] == AutonomyPromotionStage.LIMITED
    assert prom["promotion_verdict"] == "PROMOTED_GRADUAL_AUTONOMY"

    dem = engine.demote_autonomy_and_check_circuit_breaker("security_remediator", verification_failed=True)
    assert dem["current_stage"] == AutonomyPromotionStage.APPROVAL
    assert dem["circuit_breaker_tripped"] is True

def test_autonomy_promotion_api_endpoints():
    res_prom = client.post("/api/v1/autonomy-v62/autonomy/promote", json={
        "workflow": "security_remediator",
        "successes": 15
    })
    assert res_prom.status_code == 200
    assert res_prom.json()["promoted_stage"] == "LIMITED"

    res_dem = client.post("/api/v1/autonomy-v62/autonomy/demote", json={
        "workflow": "security_remediator",
        "failed": True
    })
    assert res_dem.status_code == 200
    assert res_dem.json()["circuit_breaker_tripped"] is True
