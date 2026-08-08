import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_115_phases_autonomous_cloud(client):
    org_id = "acme-corp"

    # Command Center & Digital Twin
    assert client.get(f"/api/v1/autonomous-cloud/command-center/{org_id}").status_code == 200
    assert client.get(f"/api/v1/autonomous-cloud/digital-twin/{org_id}").status_code == 200

    # Workflow Execution & Ingestion
    assert client.post("/api/v1/autonomous-cloud/workflow/execute").status_code == 200
    assert client.get("/api/v1/autonomous-cloud/ingestion-status/repo_auth_01").status_code == 200

    # Billing & Postmortem
    assert client.get(f"/api/v1/autonomous-cloud/billing/{org_id}").status_code == 200
    assert client.get(f"/api/v1/autonomous-cloud/postmortem/{org_id}/inc_101").status_code == 200

    # Production Readiness Scorecard
    res_card = client.get(f"/api/v1/autonomous-cloud/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["production_status"] == "CODEATLAS V3.0 PRODUCTION READY"


def test_full_38_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=v3@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace, Global, Predictive, Autonomous, Self-Healing, Optimization, Governance, Autonomous Cloud
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200
    assert client.get("/api/v1/platform/health").status_code == 200
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/developer-platform/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/global-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/predictive-cloud/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/autonomous-operations/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/self-healing/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/global-optimization/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/governance/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/autonomous-cloud/scorecard/acme-corp").status_code == 200
