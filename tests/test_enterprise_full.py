import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_66_phases_enterprise(client):
    org_id = "acme-corp"

    # Hierarchy & Catalogs
    assert client.get(f"/api/v1/enterprise-scale/business-units/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/departments/bu_core").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/repository-catalog/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/service-catalog/{org_id}").status_code == 200
    assert client.get("/api/v1/enterprise-scale/ownership/demo-repo").status_code == 200

    # Impact, Knowledge & Search
    assert client.get("/api/v1/enterprise-scale/impact/auth_service").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/knowledge-freshness/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/search/{org_id}?query=OAuth2").status_code == 200

    # Policy as Code, Executive & Governance
    assert client.get(f"/api/v1/enterprise-scale/executive-dashboard/{org_id}").status_code == 200
    assert client.get("/api/v1/enterprise-scale/policy-as-code/demo-repo").status_code == 200
    assert client.post("/api/v1/enterprise-scale/policy-exception?policy_id=pol_1&reason=grace_period").status_code == 201
    assert client.get(f"/api/v1/enterprise-scale/governance/{org_id}").status_code == 200

    # SSO, SCIM, Compliance, Security & Release Train
    assert client.get(f"/api/v1/enterprise-scale/sso-config/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/scim-status/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/compliance/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/security-center/{org_id}").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/release-train/{org_id}").status_code == 200

    # AI & Agent Governance
    assert client.get(f"/api/v1/enterprise-scale/ai-governance/{org_id}").status_code == 200
    assert client.get("/api/v1/enterprise-scale/agent-evaluation/agent_autonomy_1").status_code == 200

    # Chaos & FinOps Cost Anomalies
    assert client.post("/api/v1/enterprise-scale/chaos-test?scenario=DB_FAILOVER").status_code == 200
    assert client.get(f"/api/v1/enterprise-scale/cost-anomalies/{org_id}").status_code == 200

    # Phase 66: Scorecard & Readiness
    res_card = client.get(f"/api/v1/enterprise-scale/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["enterprise_status"] == "CODEATLAS V2.1 ENTERPRISE READY"


def test_full_29_systems_regression(client):
    # 1. Login/Auth
    assert client.post("/api/v1/platform/auth/login?email=admin@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Organization / Workspace / Team
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Repository Connect / Catalogs
    assert client.get("/api/v1/enterprise-scale/repository-catalog/acme-corp").status_code == 200

    # 4. Search
    assert client.get("/api/v1/enterprise-scale/search/acme-corp?query=OAuth2").status_code == 200

    # 5. Control Plane
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200

    # 6. Platform Launch
    assert client.get("/api/v1/platform/health").status_code == 200

    # 7. Enterprise Scale
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200
