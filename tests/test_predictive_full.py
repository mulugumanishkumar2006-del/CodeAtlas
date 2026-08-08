import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_65_phases_predictive_cloud(client):
    org_id = "acme-corp"

    # Failures & Incidents
    assert client.get("/api/v1/predictive-cloud/predictions/failures/auth_service").status_code == 200
    assert client.get(f"/api/v1/predictive-cloud/predictions/incidents/{org_id}").status_code == 200
    assert client.get("/api/v1/predictive-cloud/predictions/deployment/auth_service").status_code == 200

    # Capacity & Cost
    assert client.get("/api/v1/predictive-cloud/predictions/capacity/auth_service").status_code == 200
    assert client.get(f"/api/v1/predictive-cloud/predictions/cost/{org_id}").status_code == 200

    # Scenarios, Risk Register & Copilot
    assert client.get("/api/v1/predictive-cloud/scenarios/evaluate").status_code == 200
    assert client.get(f"/api/v1/predictive-cloud/risk-register/{org_id}").status_code == 200
    assert client.get("/api/v1/predictive-cloud/copilot").status_code == 200
    assert client.get("/api/v1/predictive-cloud/model-monitoring").status_code == 200

    # Completion Scorecard
    res_card = client.get(f"/api/v1/predictive-cloud/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["predictive_status"] == "CODEATLAS V2.5 PREDICTIVE ENGINEERING READY"


def test_full_33_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=ml@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace, Global
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200
    assert client.get("/api/v1/platform/health").status_code == 200
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/developer-platform/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/global-intelligence/scorecard/acme-corp").status_code == 200

    # 4. Predictive Engineering Cloud
    assert client.get("/api/v1/predictive-cloud/scorecard/acme-corp").status_code == 200
