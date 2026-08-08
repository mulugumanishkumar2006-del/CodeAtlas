import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_90_phases_enterprise_expansion(client):
    org_id = "acme-corp"

    # Hierarchy & SSO/SCIM
    assert client.get(f"/api/v1/enterprise-expansion/hierarchy/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-expansion/sso-status/{org_id}").status_code == 200

    # SIEM, CTO Dashboard, Service Catalog & Policy as Code
    assert client.get(f"/api/v1/enterprise-expansion/siem-status/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-expansion/executive-cto/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-expansion/service-catalog/{org_id}").status_code == 200
    assert client.post("/api/v1/enterprise-expansion/policy-as-code/validate").status_code == 200

    # Engineering ROI & Readiness Scorecard
    assert client.get(f"/api/v1/enterprise-expansion/roi/{org_id}").status_code == 200
    res_card = client.get(f"/api/v1/enterprise-expansion/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["enterprise_status"] == "CODEATLAS V3.2 ENTERPRISE READY"


def test_full_40_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=ent@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace, Global, Predictive, Autonomous, Self-Healing, Optimization, Governance, Autonomous Cloud, Production Launch, Enterprise Expansion
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
    assert client.get("/api/v1/enterprise-expansion/scorecard/acme-corp").status_code == 200
