"""Tests for Phase 26 Finale Features 8-10 and Ultimate Feature AI Engineering Boardroom."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_ultimate_ai_engineering_boardroom():
    payload = {
        "proposal_title": "Split Checkout Service & Migrate to Active-Active Dual Region",
    }
    response = client.post("/api/v1/aeo-boardroom/convene-boardroom", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["consensus_verdict"] == "Consensus: Migration in Q2."
    assert len(data["discussion_statements"]) == 5

    roles = [s["role_title"] for s in data["discussion_statements"]]
    assert "CTO AI" in roles
    assert "Architect AI" in roles
    assert "SRE AI" in roles
    assert "Security Engineer AI" in roles
    assert "Product Manager AI" in roles


def test_strategic_decision_simulator():
    response = client.post(
        "/api/v1/aeo-boardroom/simulate-strategic-decision?query=Compare%20Option%20A%20vs%20Option%20B"
    )
    assert response.status_code == 200
    data = response.json()
    assert (
        data["option_b"]["business_impact_score"]
        > data["option_a"]["business_impact_score"]
    )
    assert "Dual-Region Microservices" in data["recommended_strategy"]


def test_executive_dashboard():
    response = client.get("/api/v1/aeo-boardroom/executive-dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["delivery_health_pct"] > 90.0
    assert data["architecture_health_pct"] > 90.0
    assert data["cost_forecast_monthly_usd"] > 0


def test_autonomous_improvement_engine():
    response = client.get("/api/v1/aeo-boardroom/autonomous-improvement")
    assert response.status_code == 200
    data = response.json()
    assert data["total_opportunities_detected"] > 0
    assert len(data["opportunities"]) > 0
    assert data["engine_verdict"] == "AUTONOMOUS_IMPROVEMENT_OPPORTUNITIES_READY"
