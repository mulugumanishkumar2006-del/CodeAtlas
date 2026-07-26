"""Tests for SPE Features 6-10 (Acceleration, Friction, Elasticity, Entropy, Energy)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_acceleration_breakdown():
    response = client.get("/api/v1/spe-secondary/acceleration-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["acceleration_score"] == 5.5
    assert data["velocity_delta_pct"] == 15.4


def test_friction_breakdown():
    response = client.get("/api/v1/spe-secondary/friction-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["friction_score"] == 7.0
    assert data["coupling_score"] == 7.5
    assert data["complexity_score"] == 8.0
    assert data["test_coverage_pct"] == 62.0
    assert data["documentation_score"] == 45.0


def test_elasticity_breakdown():
    response = client.get("/api/v1/spe-secondary/elasticity-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["elasticity_score"] == 9.0
    assert data["resilience_recovery_time_sec"] == 4.2


def test_entropy_breakdown():
    response = client.get("/api/v1/spe-secondary/entropy-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["entropy_score"] == 6.0
    assert len(data["historical_snapshots"]) == 4
    assert data["historical_snapshots"][0]["quarter"] == "Q1 2025"


def test_energy_breakdown():
    response = client.get("/api/v1/spe-secondary/energy-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["engineering_effort_hours"] == 420.0
    assert data["compute_power_kwh"] == 1450.0


def test_all_secondary_features():
    response = client.get("/api/v1/spe-secondary/all-secondary-features/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["component_id"] == "auth_service"
    assert data["friction"]["friction_score"] == 7.0
    assert data["entropy"]["entropy_score"] == 6.0
