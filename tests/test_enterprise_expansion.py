import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Hierarchy & SSO/SCIM
# ----------------------------------------------------
def test_get_enterprise_hierarchy(client):
    res = client.get("/api/v1/enterprise-expansion/hierarchy/acme-corp")
    assert res.status_code == 200
    hierarchy = res.json()
    assert hierarchy["business_units_count"] == 4


def test_get_sso_status(client):
    res = client.get("/api/v1/enterprise-expansion/sso-status/acme-corp")
    assert res.status_code == 200
    sso = res.json()
    assert sso["domain_verified"] is True


# ----------------------------------------------------
# 2. SIEM, CTO Dashboard & Service Catalog
# ----------------------------------------------------
def test_get_siem_status(client):
    res = client.get("/api/v1/enterprise-expansion/siem-status/acme-corp")
    assert res.status_code == 200
    siem = res.json()
    assert siem["status"] == "FORWARDING_ACTIVE"


def test_get_executive_cto_dashboard(client):
    res = client.get("/api/v1/enterprise-expansion/executive-cto/acme-corp")
    assert res.status_code == 200
    cto = res.json()
    assert cto["overall_engineering_health_score"] >= 95.0


def test_get_service_catalog(client):
    res = client.get("/api/v1/enterprise-expansion/service-catalog/acme-corp")
    assert res.status_code == 200
    catalog = res.json()
    assert len(catalog) >= 2


def test_validate_policy_as_code(client):
    res = client.post("/api/v1/enterprise-expansion/policy-as-code/validate")
    assert res.status_code == 200
    pol = res.json()
    assert pol["rego_rule_status"] == "PASSED"


# ----------------------------------------------------
# 3. Engineering ROI & Scorecard
# ----------------------------------------------------
def test_get_engineering_roi(client):
    res = client.get("/api/v1/enterprise-expansion/roi/acme-corp")
    assert res.status_code == 200
    roi = res.json()
    assert roi["developer_hours_saved_monthly"] == 520.0


def test_get_enterprise_readiness_scorecard(client):
    res = client.get("/api/v1/enterprise-expansion/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["enterprise_status"] == "CODEATLAS V3.2 ENTERPRISE READY"
