import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Failure & Incident Predictions
# ----------------------------------------------------
def test_predict_failure_risk(client):
    res = client.get("/api/v1/predictive-cloud/predictions/failures/auth_service")
    assert res.status_code == 200
    pred = res.json()
    assert pred["confidence"] == "HIGH"
    assert pred["failure_probability"] <= 0.50


def test_predict_incident_patterns(client):
    res = client.get("/api/v1/predictive-cloud/predictions/incidents/acme-corp")
    assert res.status_code == 200
    pats = res.json()
    assert len(pats) >= 1


def test_predict_deployment_risk(client):
    res = client.get("/api/v1/predictive-cloud/predictions/deployment/auth_service?commit_sha=a9b3c4d")
    assert res.status_code == 200
    dep = res.json()
    assert dep["success_probability"] >= 0.90


# ----------------------------------------------------
# 2. Capacity & Cost Forecasting
# ----------------------------------------------------
def test_forecast_capacity(client):
    res = client.get("/api/v1/predictive-cloud/predictions/capacity/auth_service")
    assert res.status_code == 200
    cap = res.json()
    assert cap["forecasted_days_until_exhaustion"] >= 30


def test_forecast_cost_anomalies(client):
    res = client.get("/api/v1/predictive-cloud/predictions/cost/acme-corp")
    assert res.status_code == 200
    cost = res.json()
    assert cost["predicted_monthly_cost_usd"] >= 1000.00


# ----------------------------------------------------
# 3. Scenarios, Copilot & Risk Register
# ----------------------------------------------------
def test_evaluate_what_if_scenario(client):
    res = client.get("/api/v1/predictive-cloud/scenarios/evaluate?scenario_title=What%20if%20DB%20latency%20doubles%3F")
    assert res.status_code == 200
    scen = res.json()
    assert scen["risk_delta"] > 0


def test_get_risk_register(client):
    res = client.get("/api/v1/predictive-cloud/risk-register/acme-corp")
    assert res.status_code == 200
    reg = res.json()
    assert len(reg) >= 1


def test_ask_predictive_copilot(client):
    res = client.get("/api/v1/predictive-cloud/copilot?query=What%20is%20likely%20to%20fail%20next%3F")
    assert res.status_code == 200
    copilot = res.json()
    assert copilot["confidence"] == "HIGH"


# ----------------------------------------------------
# 4. Scorecard & Readiness
# ----------------------------------------------------
def test_get_predictive_scorecard(client):
    res = client.get("/api/v1/predictive-cloud/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["predictive_status"] == "CODEATLAS V2.5 PREDICTIVE ENGINEERING READY"
