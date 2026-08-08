import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Command Center & Digital Twin
# ----------------------------------------------------
def test_get_command_center_overview(client):
    res = client.get("/api/v1/autonomous-cloud/command-center/acme-corp")
    assert res.status_code == 200
    overview = res.json()
    assert overview["system_health_score"] >= 90.0


def test_get_digital_twin_topology(client):
    res = client.get("/api/v1/autonomous-cloud/digital-twin/acme-corp")
    assert res.status_code == 200
    twin = res.json()
    assert twin["total_connected_repositories"] == 42


# ----------------------------------------------------
# 2. Workflow Execution & Ingestion
# ----------------------------------------------------
def test_execute_end_to_end_workflow(client):
    res = client.post("/api/v1/autonomous-cloud/workflow/execute?organization_id=acme-corp&repository_id=repo_auth_01")
    assert res.status_code == 200
    wf = res.json()
    assert wf["workflow_status"] == "WORKFLOW_COMPLETED_SUCCESSFULLY"
    assert len(wf["stage_outcomes"]) == 13


def test_get_ingestion_status(client):
    res = client.get("/api/v1/autonomous-cloud/ingestion-status/repo_auth_01")
    assert res.status_code == 200
    ing = res.json()
    assert ing["progress_percentage"] == 100.0


# ----------------------------------------------------
# 3. Billing & Postmortems
# ----------------------------------------------------
def test_get_billing_ledger(client):
    res = client.get("/api/v1/autonomous-cloud/billing/acme-corp")
    assert res.status_code == 200
    bill = res.json()
    assert bill["tier"] == "ENTERPRISE"


def test_get_incident_postmortem(client):
    res = client.get("/api/v1/autonomous-cloud/postmortem/acme-corp/inc_101")
    assert res.status_code == 200
    pm = res.json()
    assert pm["severity"] == "SEV-1"


# ----------------------------------------------------
# 4. Readiness Scorecard
# ----------------------------------------------------
def test_get_production_readiness_scorecard(client):
    res = client.get("/api/v1/autonomous-cloud/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["production_status"] == "CODEATLAS V3.0 PRODUCTION READY"
