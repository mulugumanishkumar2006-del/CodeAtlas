import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. SLO Baselines & Onboarding
# ----------------------------------------------------
def test_get_slo_baseline(client):
    res = client.get("/api/v1/production-launch/slo-baseline/acme-corp")
    assert res.status_code == 200
    slo = res.json()
    assert slo["availability_percentage"] >= 99.9


def test_get_onboarding_metrics(client):
    res = client.get("/api/v1/production-launch/onboarding/acme-corp")
    assert res.status_code == 200
    onboarding = res.json()
    assert onboarding["total_time_to_first_value_seconds"] <= 90.0


# ----------------------------------------------------
# 2. Status Page & Security Trust Center
# ----------------------------------------------------
def test_get_public_status_page(client):
    res = client.get("/api/v1/production-launch/status-page")
    assert res.status_code == 200
    status_page = res.json()
    assert status_page["overall_status"] == "OPERATIONAL"


def test_get_pentest_report(client):
    res = client.get("/api/v1/production-launch/pentest-report")
    assert res.status_code == 200
    pentest = res.json()
    assert pentest["vulnerabilities_found"] == 0


def test_get_trust_center_info(client):
    res = client.get("/api/v1/production-launch/trust-center")
    assert res.status_code == 200
    trust = res.json()
    assert trust["code_training_policy"] == "CUSTOMER_CODE_NEVER_USED_FOR_MODEL_TRAINING"


# ----------------------------------------------------
# 3. Canary Release & Scorecard
# ----------------------------------------------------
def test_get_canary_release_status(client):
    res = client.get("/api/v1/production-launch/canary-status")
    assert res.status_code == 200
    canary = res.json()
    assert canary["deployment_status"] == "PROMOTED_TO_PRODUCTION"


def test_get_launch_readiness_scorecard(client):
    res = client.get("/api/v1/production-launch/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["launch_status"] == "CODEATLAS V3.1 LAUNCH READY"
