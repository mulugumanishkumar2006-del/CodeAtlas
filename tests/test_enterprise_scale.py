import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Enterprise Hierarchy & Catalogs (Phases 1-5)
# ----------------------------------------------------
def test_get_business_units(client):
    res = client.get("/api/v1/enterprise-scale/business-units/acme-corp")
    assert res.status_code == 200
    units = res.json()
    assert len(units) >= 2


def test_get_repository_catalog(client):
    res = client.get("/api/v1/enterprise-scale/repository-catalog/acme-corp")
    assert res.status_code == 200
    repos = res.json()
    assert len(repos) >= 2
    assert repos[0]["name"] == "CodeAtlas Main Monorepo"


def test_get_service_catalog(client):
    res = client.get("/api/v1/enterprise-scale/service-catalog/acme-corp")
    assert res.status_code == 200
    services = res.json()
    assert len(services) >= 2
    assert services[0]["service_name"] == "auth_service"


def test_get_ownership_map(client):
    res = client.get("/api/v1/enterprise-scale/ownership/demo-repo")
    assert res.status_code == 200
    ownership = res.json()
    assert ownership["unowned_alert"] is False


# ----------------------------------------------------
# 2. Policy-as-Code & Governance (Phases 17-20)
# ----------------------------------------------------
def test_evaluate_policy_as_code(client):
    res = client.get("/api/v1/enterprise-scale/policy-as-code/demo-repo")
    assert res.status_code == 200
    rules = res.json()
    assert len(rules) >= 2
    assert rules[0]["result"] == "PASS"


def test_create_policy_exception(client):
    res = client.post("/api/v1/enterprise-scale/policy-exception?policy_id=pol_101&reason=Legacy%20migration%20grace%20period")
    assert res.status_code == 201
    exc = res.json()
    assert exc["exception_id"].startswith("exc_")


def test_get_governance_dashboard(client):
    res = client.get("/api/v1/enterprise-scale/governance/acme-corp")
    assert res.status_code == 200
    dash = res.json()
    assert dash["compliance_score"] >= 90.0


# ----------------------------------------------------
# 3. Release Train & Safe Dependency Order (Phases 32-33)
# ----------------------------------------------------
def test_get_release_train(client):
    res = client.get("/api/v1/enterprise-scale/release-train/acme-corp")
    assert res.status_code == 200
    train = res.json()
    assert len(train["safe_dependency_order"]) == 3
    assert train["safe_dependency_order"][0] == "auth_service"


# ----------------------------------------------------
# 4. Chaos Testing & Scorecard (Phases 48, 66)
# ----------------------------------------------------
def test_run_chaos_test(client):
    res = client.post("/api/v1/enterprise-scale/chaos-test?scenario=WORKER_FAILURE")
    assert res.status_code == 200
    report = res.json()
    assert report["recovered_successfully"] is True


def test_get_enterprise_scorecard(client):
    res = client.get("/api/v1/enterprise-scale/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["enterprise_status"] == "CODEATLAS V2.1 ENTERPRISE READY"
