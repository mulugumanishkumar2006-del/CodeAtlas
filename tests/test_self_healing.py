import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Recovery Strategies & Runs
# ----------------------------------------------------
def test_get_recovery_strategies(client):
    res = client.get("/api/v1/self-healing/strategies")
    assert res.status_code == 200
    strats = res.json()
    assert len(strats) >= 2


def test_simulate_recovery(client):
    res = client.get("/api/v1/self-healing/simulate/auth_service")
    assert res.status_code == 200
    sim = res.json()
    assert sim["is_safe_to_execute"] is True


def test_execute_recovery_run(client):
    res = client.post("/api/v1/self-healing/execute/auth_service")
    assert res.status_code == 200
    run = res.json()
    assert run["current_state"] == "RECOVERED"


# ----------------------------------------------------
# 2. MTTR, Runbooks & Cascading Protection
# ----------------------------------------------------
def test_get_mttr_intelligence(client):
    res = client.get("/api/v1/self-healing/mttr/auth_service")
    assert res.status_code == 200
    mttr = res.json()
    assert mttr["total_mttr_seconds"] == 75.0


def test_get_runbooks(client):
    res = client.get("/api/v1/self-healing/runbooks/auth_service")
    assert res.status_code == 200
    rbs = res.json()
    assert len(rbs) >= 1


def test_get_cascading_protection(client):
    res = client.get("/api/v1/self-healing/cascading-protection/acme-corp")
    assert res.status_code == 200
    casc = res.json()
    assert casc["circuit_breaker_status"] == "CLOSED"


# ----------------------------------------------------
# 3. Scorecard & Readiness
# ----------------------------------------------------
def test_get_self_healing_scorecard(client):
    res = client.get("/api/v1/self-healing/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["self_healing_status"] == "CODEATLAS V2.7 SELF-HEALING READY"
