import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_full_13_pillars_marketplace(client):
    org_id = "acme-corp"

    # Catalog & Filter
    assert client.get("/api/v1/marketplace-intelligence/items").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/items?category=AGENT").status_code == 200

    # Submission, Rating & Review
    res_sub = client.post("/api/v1/marketplace-intelligence/submit", json={"category": "WORKFLOW", "title": "Deploy Guard", "description": "Guard workflow."})
    assert res_sub.status_code == 201
    assert client.post("/api/v1/marketplace-intelligence/review", json={"item_id": "mp_ag_sec_compliance", "rating": 5, "review_title": "Superb", "review_text": "Works."}).status_code == 201

    # Org Approvals, Revenue & Analytics
    assert client.get(f"/api/v1/marketplace-intelligence/approvals/{org_id}").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/revenue/pub_codeatlas").status_code == 200
    assert client.get("/api/v1/marketplace-intelligence/analytics/mp_ag_sec_compliance").status_code == 200

    # Scorecard & Readiness
    res_card = client.get(f"/api/v1/marketplace-intelligence/scorecard/{org_id}")
    assert res_card.status_code == 200
    assert res_card.json()["marketplace_status"] == "CODEATLAS V2.3 MARKETPLACE READY"


def test_full_31_systems_regression(client):
    # 1. Auth & Login
    assert client.post("/api/v1/platform/auth/login?email=admin@acme.com&organization_id=acme-corp").status_code == 200

    # 2. Hierarchy & Catalogs
    assert client.get("/api/v1/enterprise-scale/business-units/acme-corp").status_code == 200

    # 3. Repository & Search
    assert client.get("/api/v1/enterprise-scale/repository-catalog/acme-corp").status_code == 200
    assert client.get("/api/v1/enterprise-scale/search/acme-corp?query=OAuth2").status_code == 200

    # 4. Control Plane & Platform
    assert client.get("/api/v1/control-plane/overview/acme-corp").status_code == 200
    assert client.get("/api/v1/platform/health").status_code == 200

    # 5. Enterprise Scale & Developer Platform
    assert client.get("/api/v1/enterprise-scale/scorecard/acme-corp").status_code == 200
    assert client.get("/api/v1/developer-platform/scorecard/acme-corp").status_code == 200

    # 6. Intelligence Marketplace
    assert client.get("/api/v1/marketplace-intelligence/scorecard/acme-corp").status_code == 200
