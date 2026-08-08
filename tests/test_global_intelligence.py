import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Digital Twin, Cloud & Infrastructure
# ----------------------------------------------------
def test_get_cloud_resources(client):
    res = client.get("/api/v1/global-intelligence/cloud-resources/acme-corp")
    assert res.status_code == 200
    resources = res.json()
    assert len(resources) >= 2


def test_get_runtime_topology(client):
    res = client.get("/api/v1/global-intelligence/runtime-topology/acme-corp")
    assert res.status_code == 200
    edges = res.json()
    assert len(edges) >= 2


def test_analyze_architecture_drift(client):
    res = client.get("/api/v1/global-intelligence/architecture-drift/acme-corp")
    assert res.status_code == 200
    drift = res.json()
    assert drift["drift_risk_score"] == 0.0


# ----------------------------------------------------
# 2. Blast Radius & Telemetry
# ----------------------------------------------------
def test_calculate_change_blast_radius(client):
    res = client.get("/api/v1/global-intelligence/blast-radius/auth_service")
    assert res.status_code == 200
    radius = res.json()
    assert radius["deployment_risk_level"] == "LOW"


def test_get_observability_summary(client):
    res = client.get("/api/v1/global-intelligence/observability/auth_service")
    assert res.status_code == 200
    obs = res.json()
    assert obs["throughput_rps"] >= 800.0


# ----------------------------------------------------
# 3. Incidents, Copilot & Time Machine
# ----------------------------------------------------
def test_get_incident_report(client):
    res = client.get("/api/v1/global-intelligence/incidents/inc_901")
    assert res.status_code == 200
    inc = res.json()
    assert len(inc["timeline"]) == 4


def test_get_ai_incident_copilot(client):
    res = client.get("/api/v1/global-intelligence/incident-copilot/inc_901")
    assert res.status_code == 200
    copilot = res.json()
    assert copilot["confidence"] == "CONFIRMED"


def test_get_time_machine_snapshot(client):
    res = client.get("/api/v1/global-intelligence/time-machine/acme-corp")
    assert res.status_code == 200
    snap = res.json()
    assert snap["system_health_score"] >= 90.0


# ----------------------------------------------------
# 4. Scorecard & Readiness
# ----------------------------------------------------
def test_get_global_scorecard(client):
    res = client.get("/api/v1/global-intelligence/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["global_status"] == "CODEATLAS V2.4 GLOBAL INTELLIGENCE READY"
