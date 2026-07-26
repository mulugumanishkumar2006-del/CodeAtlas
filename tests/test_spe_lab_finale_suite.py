"""Tests for Phase 27 Finale Features 16-30 and WOW Feature Interactive Software Physics Lab."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_interactive_lab_drag_simulation():
    payload = {
        "dragged_component_id": "payments_service",
        "new_orbit_distance_km": 600.0,
    }
    response = client.post("/api/v1/spe-lab/drag-service-simulation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["dragged_component_id"] == "payments_service"
    assert data["performance_impact_pct"] > 0
    assert data["technical_debt_delta"] < 0
    assert data["stability_shift_verdict"] == "ORBITAL_SHIFT_STABILITY_IMPROVED"


def test_gravity_wells():
    response = client.get("/api/v1/spe-lab/gravity-wells")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["debt_mass_score"] > 9.0


def test_architecture_black_holes():
    response = client.get("/api/v1/spe-lab/architecture-black-holes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["consumed_modules_count"] > 20


def test_dependency_orbit_map():
    response = client.get("/api/v1/spe-lab/dependency-orbit-map")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["orbiting_satellites_count"] == 14


def test_all_lab_features():
    response = client.get("/api/v1/spe-lab/all-lab-features")
    assert response.status_code == 200
    data = response.json()
    assert data["architecture_equilibrium_score"] == 92.4
    assert data["long_term_entropy_forecast_12m"] == 3.8
