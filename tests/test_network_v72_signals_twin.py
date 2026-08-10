"""
Tests for CodeAtlas v7.2 - Shared Signals, Systemic Risk & Federated Digital Twin Simulation Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.network_v72.shared_signals_systemic_risk_twin import SharedSignalsSystemicRiskTwinEngine

client = TestClient(app)

def test_systemic_risk_and_cross_node_digital_twin():
    engine = SharedSignalsSystemicRiskTwinEngine()
    
    risk = engine.detect_systemic_supply_chain_risks("requests")
    assert risk["systemic_exposure_detected"] is True
    assert risk["nodes_impacted_count"] == 3
    
    sim = engine.run_cross_node_digital_twin_simulation("AWS_US_EAST_1_REGIONAL_OUTAGE")
    assert sim["simulation_scenario"] == "AWS_US_EAST_1_REGIONAL_OUTAGE"
    assert len(sim["participating_nodes"]) == 2

def test_systemic_risk_and_digital_twin_api_endpoints():
    res_risk = client.get("/api/v1/network-v72/systemic-risk/detect?package_name=requests")
    assert res_risk.status_code == 200
    assert res_risk.json()["systemic_exposure_detected"] is True

    res_sim = client.post("/api/v1/network-v72/digital-twin/simulation", json={"scenario": "AWS_OUTAGE"})
    assert res_sim.status_code == 200
    assert len(res_sim.json()["participating_nodes"]) == 2
