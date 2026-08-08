import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_70_phases_production_launch(client):
    org_id = "acme-corp"

    # SLO Baselines & Onboarding
    assert client.get(f"/api/v1/production-launch/slo-baseline/{org_id}").status_code == 200
    assert client.get(f"/api/v1/production-launch/onboarding/{org_id}").status_code == 200

    # Status Page, Pentest & Trust Center
    assert client.get("/api/v1/production-launch/status-page").status_code == 200
    assert client.get("/api/v1/production-launch/pentest-report").status_code == 200
    assert client.get("/api/v1/production-launch/trust-center").status_code == 200

    # Canary & Launch Readiness Scorecard
    assert client.get("/api/v1/production-launch/canary-status").status_code == 200
    res_card = client.get(f"/api/v1/production-launch/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["launch_status"] == "CODEATLAS V3.1 LAUNCH READY"


def test_full_39_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=launch@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace, Global, Predictive, Autonomous, Self-Healing, Optimization, Governance, Autonomous Cloud, Production Launch v3.1
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
    assert client.get("/api/v1/production-launch/scorecard/acme-corp").status_code == 200
