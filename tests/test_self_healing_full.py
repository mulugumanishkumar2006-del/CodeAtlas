import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_65_phases_self_healing(client):
    org_id = "acme-corp"

    # Strategies, Simulation & Execution
    assert client.get("/api/v1/self-healing/strategies").status_code == 200
    assert client.get("/api/v1/self-healing/simulate/auth_service").status_code == 200
    assert client.post("/api/v1/self-healing/execute/auth_service").status_code == 200

    # MTTR, Runbooks & Cascading Protection
    assert client.get("/api/v1/self-healing/mttr/auth_service").status_code == 200
    assert client.get("/api/v1/self-healing/runbooks/auth_service").status_code == 200
    assert client.get(f"/api/v1/self-healing/cascading-protection/{org_id}").status_code == 200

    # Completion Scorecard
    res_card = client.get(f"/api/v1/self-healing/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["self_healing_status"] == "CODEATLAS V2.7 SELF-HEALING READY"


def test_full_35_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=sre@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace, Global, Predictive, Autonomous, Self-Healing
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200
    assert client.get("/api/v1/platform/health").status_code == 200
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/developer-platform/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/global-intelligence/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/predictive-cloud/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/autonomous-operations/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/self-healing/scorecard/acme-corp").status_code == 200
