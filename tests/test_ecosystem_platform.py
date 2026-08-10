"""
Tests for CodeAtlas v3.3 - Ecosystem Platform & Registry Core Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem.platform_engine import IntegrationPlatformEngine
from app.ecosystem.registry import IntegrationRegistryManager

client = TestClient(app)

def test_platform_webhook_and_normalization():
    engine = IntegrationPlatformEngine()
    result = engine.process_webhook(
        delivery_id="del_101",
        provider="github",
        event_type="pull_request.opened",
        payload={"pr_id": 101, "title": "Add Caching Layer"},
        signature=""
    )
    assert result["status"] == "SUCCESS"
    assert result["normalized_event"]["normalized_type"] == "CODE_CHANGE_REVIEW"

def test_registry_integration_lifecycle():
    registry = IntegrationRegistryManager()
    int_rec = registry.register_integration(
        name="GitHub Dev",
        provider="github",
        category="Source Control",
        credentials={"token": "secret_abc"},
        scopes=["repo"]
    )
    assert int_rec["status"] == "CONNECTED"
    assert "int_github_" in int_rec["id"]

    rotated = registry.rotate_credentials(int_rec["id"], {"token": "new_secret"})
    assert rotated["status"] == "HEALTHY"

    assert len(registry.list_integrations()) >= 6
    assert len(registry.get_marketplace_catalog()) >= 10

def test_ecosystem_api_endpoints():
    response = client.get("/api/v1/ecosystem/integrations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5

    mp_res = client.get("/api/v1/ecosystem/marketplace")
    assert mp_res.status_code == 200
    assert len(mp_res.json()) >= 10

    policies_res = client.get("/api/v1/ecosystem/platform/policies")
    assert policies_res.status_code == 200
    assert len(policies_res.json()) >= 3
