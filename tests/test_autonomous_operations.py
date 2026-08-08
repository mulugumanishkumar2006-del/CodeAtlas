import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Autonomy Policies & Plans
# ----------------------------------------------------
def test_get_autonomy_policy(client):
    res = client.get("/api/v1/autonomous-operations/policies/acme-corp")
    assert res.status_code == 200
    pol = res.json()
    assert pol["max_allowed_autonomy_level"] == 3


def test_generate_operation_plan(client):
    res = client.post("/api/v1/autonomous-operations/plans/generate?target_service=auth_service")
    assert res.status_code == 200
    plan = res.json()
    assert len(plan["steps"]) >= 2
    assert plan["status"] == "PENDING_APPROVAL"


def test_simulate_plan(client):
    res = client.get("/api/v1/autonomous-operations/plans/simulate/plan_123")
    assert res.status_code == 200
    sim = res.json()
    assert sim["rollback_capability_verified"] is True


# ----------------------------------------------------
# 2. Approvals & Verification
# ----------------------------------------------------
def test_request_approval(client):
    res = client.post("/api/v1/autonomous-operations/approvals/request/plan_123")
    assert res.status_code == 200
    appr = res.json()
    assert appr["status"] == "PENDING"


def test_verify_operation(client):
    res = client.get("/api/v1/autonomous-operations/verification/plan_123")
    assert res.status_code == 200
    ver = res.json()
    assert ver["verification_passed"] is True


# ----------------------------------------------------
# 3. Emergency Stop & Scorecard
# ----------------------------------------------------
def test_emergency_stop_flow(client):
    res1 = client.get("/api/v1/autonomous-operations/emergency-stop/status/acme-corp")
    assert res1.status_code == 200
    assert res1.json()["is_emergency_stop_active"] is False

    res2 = client.post("/api/v1/autonomous-operations/emergency-stop/trigger/acme-corp?triggered_by=sec_lead")
    assert res2.status_code == 200
    assert res2.json()["is_emergency_stop_active"] is True


def test_get_autonomous_scorecard(client):
    res = client.get("/api/v1/autonomous-operations/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["autonomous_status"] == "CODEATLAS V2.6 AUTONOMOUS ENGINEERING READY"
