"""Tests for Phase 25: Engineering AGI (Project Atlas)."""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_engineering_agi_personas_list():
    response = client.get("/api/v1/engineering-agi/personas")
    assert response.status_code == 200
    personas = response.json()
    assert len(personas) == 9
    roles = [p["role"] for p in personas]
    assert "CTO AI" in roles
    assert "Architect AI" in roles
    assert "Security AI" in roles
    assert "Finance AI" in roles


def test_engineering_agi_executive_macro_query():
    payload = {
        "prompt": "Our company wants to expand from India to Europe over the next two years. What engineering changes must we make?",
        "target_timeline_years": 2.0,
        "primary_region": "India (ap-south-1)",
        "target_region": "Europe (eu-central-1)",
    }
    response = client.post("/api/v1/engineering-agi/executive-plan", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "macro_prompt" in data
    assert len(data["persona_council_insights"]) == 9
    assert data["cost_estimate"]["total_2year_cost_usd"] > 0
    assert len(data["hiring_estimates"]) > 0
    assert len(data["risk_predictions"]) > 0
    assert len(data["two_year_roadmap"]) > 0
    assert len(data["sprint_plans"]) > 0
    assert data["cloud_strategy"]["primary_region"] != ""
    assert data["trade_off_analysis"]["recommended_option"] != ""
    assert data["simulation_metrics"]["gdpr_compliance_score"] > 90.0
    assert data["overall_system_verdict"] == "OPTIMAL_EXECUTIVE_BLUEPRINT_APPROVED"
