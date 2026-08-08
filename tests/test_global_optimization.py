import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


# ----------------------------------------------------
# 1. Engineering Scorecard & Opportunities
# ----------------------------------------------------
def test_get_engineering_scorecard(client):
    res = client.get("/api/v1/global-optimization/engineering-scorecard/acme-corp")
    assert res.status_code == 200
    sc = res.json()
    assert sc["overall_engineering_score"] >= 90.0


def test_get_opportunities(client):
    res = client.get("/api/v1/global-optimization/opportunities/acme-corp")
    assert res.status_code == 200
    opps = res.json()
    assert len(opps) >= 2


def test_get_architecture_comparison(client):
    res = client.get("/api/v1/global-optimization/architecture-comparison/auth_service")
    assert res.status_code == 200
    arch = res.json()
    assert len(arch["alternatives"]) == 3


# ----------------------------------------------------
# 2. Experiments & Executive Summary
# ----------------------------------------------------
def test_get_experiments(client):
    res = client.get("/api/v1/global-optimization/experiments/acme-corp")
    assert res.status_code == 200
    exps = res.json()
    assert len(exps) >= 1


def test_get_executive_summary(client):
    res = client.get("/api/v1/global-optimization/executive-summary/acme-corp")
    assert res.status_code == 200
    exec_sum = res.json()
    assert exec_sum["total_identified_savings_monthly_usd"] >= 1000.00


# ----------------------------------------------------
# 3. Scorecard & Readiness
# ----------------------------------------------------
def test_get_global_optimization_scorecard(client):
    res = client.get("/api/v1/global-optimization/scorecard/acme-corp")
    assert res.status_code == 200
    card = res.json()
    assert card["optimization_status"] == "CODEATLAS V2.8 GLOBAL OPTIMIZATION READY"
