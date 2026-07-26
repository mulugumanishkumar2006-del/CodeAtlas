"""Tests for Phase 27 Software Physics Engine (SPE)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_component_physics():
    response = client.get("/api/v1/spe/component-physics/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["component_id"] == "auth_service"
    assert data["physics"]["mass"] == 10.0
    assert data["physics"]["gravity"] == 9.0
    assert "mass" in data["visual_gauges"]
    assert "█" in data["visual_gauges"]["mass"]
    assert data["physical_law_verdict"] == "HIGH_GRAVITATIONAL_ORBITAL_PULL"


def test_simulate_universe():
    payload = {"environment": "production"}
    response = client.post("/api/v1/spe/simulate-universe", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_components_simulated"] == 3
    assert data["system_total_mass"] > 0
    assert data["physics_simulation_verdict"] == "PHYSICS_UNIVERSE_SIMULATION_OPTIMAL"
