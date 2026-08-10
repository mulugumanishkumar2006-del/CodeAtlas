"""
Tests for CodeAtlas v6.4 - Digital Twin Core Model, State Synchronization & Sub-Twins Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.simulation_v64.digital_twin_core_sync import DigitalTwinCoreSyncEngine, SubTwinType, DigitalTwinState

client = TestClient(app)

def test_digital_twin_entities_sync_and_sub_twins():
    engine = DigitalTwinCoreSyncEngine()
    
    assert len(engine.twin_entities) == 12
    assert "ent_svc_checkout" in engine.twin_entities
    
    sync_res = engine.synchronize_state_with_reality("Cloud Provider API")
    assert sync_res["status"] == "COMPLETED_SYNCHRONIZATION"
    assert sync_res["entities_synchronized"] == 12
    assert sync_res["state_validation"]["twin_confidence_score"] == 0.982
    
    arch_twin = engine.get_sub_twin_representation(SubTwinType.ARCHITECTURE)
    assert arch_twin["sub_twin"] == SubTwinType.ARCHITECTURE
    assert len(arch_twin["nodes"]) == 12
    
    cost_twin = engine.get_sub_twin_representation(SubTwinType.COST)
    assert cost_twin["sub_twin"] == SubTwinType.COST
    assert cost_twin["monthly_measured_cost_usd"] == 42500.0

def test_digital_twin_sync_api_endpoints():
    res_sync = client.post("/api/v1/simulation-v64/twin/sync", json={"source": "Kubernetes API"})
    assert res_sync.status_code == 200
    assert res_sync.json()["status"] == "COMPLETED_SYNCHRONIZATION"

    res_sub = client.get(f"/api/v1/simulation-v64/twin/sub-twin?twin_type={SubTwinType.RELIABILITY}")
    assert res_sub.status_code == 200
    assert res_sub.json()["current_availability_pct"] == 99.98
