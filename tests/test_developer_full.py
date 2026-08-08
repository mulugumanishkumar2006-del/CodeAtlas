import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_63_phases_developer_platform(client):
    org_id = "acme-corp"

    # API Keys & OAuth
    res_key = client.post(f"/api/v1/developer-platform/api-keys/{org_id}", json={"name": "Pipeline Key", "scopes": ["repository:read"]})
    assert res_key.status_code == 201
    res_oauth = client.post(f"/api/v1/developer-platform/oauth-apps/{org_id}", json={"app_name": "Slack Bot", "redirect_urls": ["https://slack.com"], "scopes": ["repository:read"]})
    assert res_oauth.status_code == 201

    # Webhooks, CLI & SDKs
    assert client.get(f"/api/v1/developer-platform/webhooks/{org_id}").status_code == 200
    assert client.get("/api/v1/developer-platform/webhook-deliveries/sub_wh_101").status_code == 200
    assert client.get("/api/v1/developer-platform/cli-profile").status_code == 200
    assert client.get("/api/v1/developer-platform/sdk-config/typescript").status_code == 200

    # Agent, Tool, Plugin & Workflows
    assert client.get(f"/api/v1/developer-platform/agents/{org_id}").status_code == 200
    assert client.get(f"/api/v1/developer-platform/tools/{org_id}").status_code == 200
    assert client.get(f"/api/v1/developer-platform/plugins/{org_id}").status_code == 200
    assert client.get(f"/api/v1/developer-platform/workflows/{org_id}").status_code == 200

    # Marketplace, Sandbox & Analytics
    assert client.get("/api/v1/developer-platform/marketplace").status_code == 200
    assert client.get(f"/api/v1/developer-platform/sandbox/{org_id}").status_code == 200
    assert client.get(f"/api/v1/developer-platform/analytics/{org_id}").status_code == 200

    # Phase 63: Scorecard & Readiness
    res_card = client.get(f"/api/v1/developer-platform/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["ecosystem_status"] == "CODEATLAS V2.2 DEVELOPER PLATFORM READY"


def test_full_30_systems_regression(client):
    # 1. Login/Auth
    assert client.post("/api/v1/platform/auth/login?email=dev@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Organization / Workspaces
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Repository & Search
    assert client.get("/api/v1/enterprise-scale/repository-catalog/acme-corp").status_code == 200
    assert client.get("/api/v1/enterprise-scale/search/acme-corp?query=OAuth2").status_code == 200

    # 4. Control Plane
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200

    # 5. Platform Launch
    assert client.get("/api/v1/platform/health").status_code == 200

    # 6. Enterprise Scale
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200

    # 7. Developer Platform Ecosystem
    assert client.get("/api/v1/developer-platform/scorecard/acme-corp").status_code == 200
