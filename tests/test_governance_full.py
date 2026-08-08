import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_81_phases_governance(client):
    org_id = "acme-corp"

    # Agent Registry & Governance Policies
    assert client.get(f"/api/v1/governance/agents/{org_id}").status_code == 200
    assert client.get(f"/api/v1/governance/policies/{org_id}").status_code == 200

    # Four-Eyes, Break-Glass & Prompt Defense
    assert client.post("/api/v1/governance/four-eyes/evaluate").status_code == 200
    assert client.post(f"/api/v1/governance/break-glass/create/{org_id}").status_code == 200
    assert client.post("/api/v1/governance/prompt-defense/scan").status_code == 200

    # Audit & Compliance
    assert client.get(f"/api/v1/governance/audit-trail/{org_id}").status_code == 200
    assert client.get(f"/api/v1/governance/compliance/{org_id}").status_code == 200

    # Completion Scorecard
    res_card = client.get(f"/api/v1/governance/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["governance_status"] == "CODEATLAS V2.9 GOVERNANCE READY"


def test_full_37_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=gov@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Control Plane, Platform, Scale, Developer Platform, Marketplace, Global, Predictive, Autonomous, Self-Healing, Optimization, Governance
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
