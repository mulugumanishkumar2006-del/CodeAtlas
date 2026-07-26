"""Tests for Phase 25 Features 21-40: Simulation & Strategic Insights Suite."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_feature_21_evolution_simulator():
    response = client.post(
        "/api/v1/agi-sim-insights/evolution-simulator?horizon_years=3.0"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["simulated_horizon_years"] == 3.0
    assert data["projected_code_lines"] > 0


def test_feature_22_market_trends():
    response = client.get("/api/v1/agi-sim-insights/market-trends")
    assert response.status_code == 200
    data = response.json()
    assert len(data["trending_architectures"]) > 0


def test_feature_23_business_goal_translator():
    payload = {"business_okr": "Reduce checkout API response latency by 20%"}
    response = client.post(
        "/api/v1/agi-sim-insights/translate-business-goal", json=payload
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["translated_technical_epics"]) > 0
    assert data["estimated_refactoring_hours"] > 0


def test_feature_24_architecture_experiment():
    response = client.get(
        "/api/v1/atlas-command/pattern-explorer"
    )  # verify API routing sanity
    assert response.status_code == 200

    exp_response = client.post(
        "/api/v1/agi-sim-insights/architecture-experiment?option_a=REST&option_b=gRPC"
    )
    assert exp_response.status_code == 200
    data = exp_response.json()
    assert data["latency_delta_pct"] < 0


def test_feature_25_scenario_engine():
    response = client.post(
        "/api/v1/agi-sim-insights/scenario-engine?scenario_query=Database latency spike"
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["blast_radius_modules"]) > 0


def test_feature_26_decision_journal():
    response = client.get("/api/v1/agi-sim-insights/decision-journal")
    assert response.status_code == 200
    data = response.json()
    assert data["total_adrs"] > 0


def test_feature_27_governance_advisor():
    response = client.get("/api/v1/agi-sim-insights/governance-advisor")
    assert response.status_code == 200
    data = response.json()
    assert data["soc2_compliance_pct"] > 90.0


def test_feature_28_risk_portfolio():
    response = client.get("/api/v1/agi-sim-insights/risk-portfolio")
    assert response.status_code == 200
    data = response.json()
    assert data["overall_risk_score"] < 50.0


def test_feature_33_architecture_debate():
    response = client.get("/api/v1/agi-sim-insights/architecture-debate")
    assert response.status_code == 200
    data = response.json()
    assert "cto_argument" in data
    assert "consensus_verdict" in data


def test_feature_36_tech_debt_economist():
    response = client.get("/api/v1/agi-sim-insights/tech-debt-economist")
    assert response.status_code == 200
    data = response.json()
    assert data["paydown_roi_pct"] > 0
