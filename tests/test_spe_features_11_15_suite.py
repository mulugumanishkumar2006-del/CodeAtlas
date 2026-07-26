"""Tests for SPE Features 11-15 (Force Simulation, Collision Detector, Stability Index, Resonance Detection, Engineering Climate)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_force_simulation():
    payload = {
        "source_component_id": "auth_service",
        "proposed_change_description": "Migrate Auth Vault to gRPC Protobuf binary streaming",
    }
    response = client.post("/api/v1/spe-dynamics/simulate-force", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["source_component_id"] == "auth_service"
    assert data["force_magnitude_newtons"] > 0
    assert len(data["affected_nodes"]) > 0


def test_detect_collisions():
    response = client.get("/api/v1/spe-dynamics/detect-collisions")
    assert response.status_code == 200
    data = response.json()
    assert data["total_active_prs_analyzed"] > 0
    assert len(data["collisions"]) > 0
    assert data["collision_verdict"] == "ARCHITECTURAL_PR_COLLISION_DETECTED"


def test_stability_index():
    response = client.get("/api/v1/spe-dynamics/stability-index/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["component_id"] == "auth_service"
    assert data["stability_index_pct"] == 94.2
    assert data["mtbf_hours"] == 720.0


def test_detect_resonance():
    response = client.get("/api/v1/spe-dynamics/detect-resonance")
    assert response.status_code == 200
    data = response.json()
    assert data["total_patterns_detected"] > 0
    assert len(data["resonance_patterns"]) > 0
    assert data["resonance_patterns"][0]["cycle_period_days"] == 14


def test_engineering_climate():
    response = client.get("/api/v1/spe-dynamics/engineering-climate")
    assert response.status_code == 200
    data = response.json()
    assert data["climate_state"] in ["Calm", "Warming", "Storm", "Critical"]
    assert data["climate_state"] == "Warming"
    assert data["climate_index_score"] > 0


def test_all_dynamic_features():
    response = client.get("/api/v1/spe-dynamics/all-dynamic-features/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["component_id"] == "auth_service"
    assert data["climate"]["climate_state"] == "Warming"
    assert data["stability"]["stability_index_pct"] == 94.2
