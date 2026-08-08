import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Catalog Browsing & Submission
# ----------------------------------------------------
def test_get_marketplace_items(client):
    res = client.get("/api/v1/marketplace-intelligence/items")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 4
    assert items[0]["title"] == "Enterprise Security Compliance Agent"


def test_submit_marketplace_item(client):
    res = client.post(
        "/api/v1/marketplace-intelligence/submit",
        json={"category": "AGENT", "title": "Custom Migration Agent", "description": "Automated DB schema refactoring agent."},
    )
    assert res.status_code == 201
    item = res.json()
    assert item["item_id"].startswith("mp_agent_")


# ----------------------------------------------------
# 2. Ratings, Reviews & Approvals
# ----------------------------------------------------
def test_submit_rating_review(client):
    res = client.post(
        "/api/v1/marketplace-intelligence/review",
        json={"item_id": "mp_ag_sec_compliance", "rating": 5, "review_title": "Excellent Agent", "review_text": "Great security audit results."},
    )
    assert res.status_code == 201
    rev = res.json()
    assert rev["review_id"].startswith("rev_")


def test_get_org_approvals(client):
    res = client.get("/api/v1/marketplace-intelligence/approvals/acme-corp")
    assert res.status_code == 200
    apprs = res.json()
    assert len(apprs) >= 1


# ----------------------------------------------------
# 3. Revenue & Analytics
# ----------------------------------------------------
def test_get_revenue_report(client):
    res = client.get("/api/v1/marketplace-intelligence/revenue/pub_codeatlas")
    assert res.status_code == 200
    rev = res.json()
    assert rev["total_revenue_usd"] >= 1000.00


def test_get_marketplace_analytics(client):
    res = client.get("/api/v1/marketplace-intelligence/analytics/mp_ag_sec_compliance")
    assert res.status_code == 200
    analytics = res.json()
    assert analytics["total_executions"] >= 10000


# ----------------------------------------------------
# 4. Scorecard & Readiness
# ----------------------------------------------------
def test_get_marketplace_scorecard(client):
    res = client.get("/api/v1/marketplace-intelligence/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["marketplace_status"] == "CODEATLAS V2.3 MARKETPLACE READY"
