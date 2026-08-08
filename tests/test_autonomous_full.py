import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_66_phases_autonomous_operations(client):
    org_id = "acme-corp"

    # Autonomy Policies, Plan Generation & Simulation
    assert client.get(f"/api/v1/autonomous-operations/policies/{org_id}").status_code == 200
    plan_res = client.post("/api/v1/autonomous-operations/plans/generate?target_service=auth_service")
    assert plan_res.status_code == 200
    plan_id = plan_res.json()["plan_id"]
    assert client.get(f"/api/v1/autonomous-operations/plans/simulate/{plan_id}").status_code == 200

    # Approvals & Verification
    assert client.post(f"/api/v1/autonomous-operations/approvals/request/{plan_id}").status_code == 200
    assert client.get(f"/api/v1/autonomous-operations/verification/{plan_id}").status_code == 200

    # Emergency Stop
    assert client.get(f"/api/v1/autonomous-operations/emergency-stop/status/{org_id}").status_code == 200

    # Completion Scorecard
    res_card = client.get(f"/api/v1/autonomous-operations/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["autonomous_status"] == "CODEATLAS V2.6 AUTONOMOUS ENGINEERING READY"


def test_full_34_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=ops@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace, Global, Predictive, Autonomous
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200
    assert client.get("/api/v1/platform/health").status_code == 200
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/developer-platform/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/global-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/predictive-cloud/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/autonomous-operations/scorecard/acme-corp").status_code == 200
