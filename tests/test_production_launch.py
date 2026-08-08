import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Preflight Infrastructure Audit Tests
# ----------------------------------------------------
def test_production_preflight_checks(client):
    res = client.post("/api/v1/launch/preflight")
    assert res.status_code == 200
    data = res.json()
    assert data["environment"] == "production"
    assert data["overall_passed"] is True


# ----------------------------------------------------
# 2. Service Health & Readiness Probes (Phase 38)
# ----------------------------------------------------
def test_platform_health_probes(client):
    res_h = client.get("/api/v1/platform/health")
    assert res_h.status_code == 200
    assert res_h.json()["status"] == "HEALTHY"

    res_r = client.get("/api/v1/platform/readiness")
    assert res_r.status_code == 200
    assert res_r.json()["status"] == "READY"

    res_l = client.get("/api/v1/platform/liveness")
    assert res_l.status_code == 200
    assert res_l.json()["status"] == "ALIVE"


# ----------------------------------------------------
# 3. Production Scorecard & Launch Readiness (Phase 66)
# ----------------------------------------------------
def test_production_scorecard(client):
    res = client.get("/api/v1/platform/scorecard/acme-corp")
    assert res.status_code == 200
    data = res.json()
    assert data["launch_status"] == "CODEATLAS V2.0 PRODUCTION READY"
    assert data["security_score"] >= 95.0
    assert data["reliability_score"] >= 95.0


# ----------------------------------------------------
# 4. Full End-to-End Suite Regression Verification
# ----------------------------------------------------
def test_full_production_suite_regression(client):
    assert client.get("/api/v1/release/health/readiness").status_code == 200
    assert client.post("/api/v1/release/smoke-test").status_code == 200
    assert client.get("/api/v1/launch/decision").status_code == 200
