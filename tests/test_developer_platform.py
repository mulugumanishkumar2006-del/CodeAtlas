import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. API Keys & OAuth (Phases 1-6)
# ----------------------------------------------------
def test_create_api_key(client):
    res = client.post(
        "/api/v1/developer-platform/api-keys/acme-corp",
        json={"name": "Test Key", "scopes": ["repository:read", "graph:read"]},
    )
    assert res.status_code == 201
    key = res.json()
    assert key["secret_key"].startswith("ca_sk_")
    assert len(key["scopes"]) == 2


def test_create_oauth_app(client):
    res = client.post(
        "/api/v1/developer-platform/oauth-apps/acme-corp",
        json={"app_name": "Test OAuth App", "redirect_urls": ["https://app.com/callback"], "scopes": ["repository:read"]},
    )
    assert res.status_code == 201
    oauth = res.json()
    assert oauth["client_id"].startswith("ca_cid_")


# ----------------------------------------------------
# 2. Webhooks & CLI/SDK Config (Phases 9-18)
# ----------------------------------------------------
def test_get_webhook_subscriptions(client):
    res = client.get("/api/v1/developer-platform/webhooks/acme-corp")
    assert res.status_code == 200
    subs = res.json()
    assert len(subs) >= 1


def test_get_cli_profile(client):
    res = client.get("/api/v1/developer-platform/cli-profile")
    assert res.status_code == 200
    prof = res.json()
    assert prof["profile_name"] == "default"


def test_get_sdk_config(client):
    res = client.get("/api/v1/developer-platform/sdk-config/python")
    assert res.status_code == 200
    sdk = res.json()
    assert sdk["language"] == "PYTHON"


# ----------------------------------------------------
# 3. Agent, Tool & Marketplace Registries (Phases 19-46)
# ----------------------------------------------------
def test_get_agent_registry(client):
    res = client.get("/api/v1/developer-platform/agents/acme-corp")
    assert res.status_code == 200
    agents = res.json()
    assert len(agents) >= 2


def test_get_marketplace_listings(client):
    res = client.get("/api/v1/developer-platform/marketplace")
    assert res.status_code == 200
    market = res.json()
    assert len(market) >= 2


# ----------------------------------------------------
# 4. Scorecard & Readiness (Phase 63)
# ----------------------------------------------------
def test_get_ecosystem_scorecard(client):
    res = client.get("/api/v1/developer-platform/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["ecosystem_status"] == "CODEATLAS V2.2 DEVELOPER PLATFORM READY"
