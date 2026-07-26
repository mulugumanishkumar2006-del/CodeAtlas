"""Tests for SPE Features 1-5 (Mass, Gravity, Temperature, Pressure, Velocity)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_mass_breakdown():
    response = client.get("/api/v1/spe-primary/mass-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["mass_score"] == 10.0
    assert data["loc_count"] == 42000
    assert data["cyclomatic_complexity"] == 142
    assert data["class_count"] == 64
    assert data["function_count"] == 380


def test_gravity_breakdown():
    response = client.get("/api/v1/spe-primary/gravity-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["gravity_score"] == 9.0
    assert data["dependent_services_count"] == 14
    assert len(data["dependent_repos"]) > 0


def test_temperature_breakdown():
    response = client.get("/api/v1/spe-primary/temperature-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["recent_commits_14d"] == 78
    assert data["active_authors_count"] == 12


def test_pressure_breakdown():
    response = client.get("/api/v1/spe-primary/pressure-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["peak_rps"] == 12400.0
    assert data["concurrency_threads"] == 500


def test_velocity_breakdown():
    response = client.get("/api/v1/spe-primary/velocity-breakdown/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["loc_churn_per_day"] == 45.0
    assert data["release_cadence_days"] == 14.0


def test_all_primary_features():
    response = client.get("/api/v1/spe-primary/all-primary-features/auth_service")
    assert response.status_code == 200
    data = response.json()
    assert data["component_id"] == "auth_service"
    assert data["mass"]["mass_score"] == 10.0
    assert data["gravity"]["gravity_score"] == 9.0
