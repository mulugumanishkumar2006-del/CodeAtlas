"""
Tests for CodeAtlas v6.7 - Unified Economic Model, FinOps Intelligence, Anomaly Detection & Unit Economics Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.economy_v67.economic_model_finops_unit_econ import EconomicModelFinOpsUnitEconEngine, CostState

client = TestClient(app)

def test_finops_anomalies_and_unit_economics():
    engine = EconomicModelFinOpsUnitEconEngine()
    
    anomalies = engine.detect_cloud_cost_anomalies_and_waste()
    assert len(anomalies["anomalies_detected"]) == 2
    assert anomalies["total_monthly_waste_identified_usd"] == 3600.0
    
    unit = engine.calculate_unit_and_product_economics("checkout-service")
    assert unit["cost_state"] == CostState.OBSERVED
    assert unit["monthly_total_cost_usd"] == 18200.0
    assert "cost_per_transaction_usd" in unit["unit_economics"]

def test_finops_and_unit_econ_api_endpoints():
    res_anom = client.get("/api/v1/economy-v67/finops/anomalies")
    assert res_anom.status_code == 200
    assert res_anom.json()["total_monthly_waste_identified_usd"] == 3600.0

    res_unit = client.get("/api/v1/economy-v67/unit-economics?service_id=checkout-service")
    assert res_unit.status_code == 200
    assert res_unit.json()["service_id"] == "checkout-service"
