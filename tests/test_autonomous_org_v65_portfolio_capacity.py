"""
Tests for CodeAtlas v6.5 - Engineering Portfolio, Initiative Priority Engine, Risk Portfolio & Capacity Forecasting Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.autonomous_org_v65.portfolio_initiatives_capacity import PortfolioInitiativesCapacityEngine, InitiativeCategory

client = TestClient(app)

def test_portfolio_prioritization_risk_and_capacity():
    engine = PortfolioInitiativesCapacityEngine()
    
    portfolio = engine.get_unified_portfolio_and_prioritization()
    assert portfolio["portfolio_summary"]["total_initiatives"] == 3
    assert len(portfolio["priority_ranked_initiatives"]) == 3
    
    risk_port = engine.evaluate_engineering_risk_portfolio()
    assert risk_port["risk_portfolio_score"] == "MEDIUM_MANAGED"
    assert risk_port["business_blast_radius"]["highest_risk_service"] == "orders-db-postgresql"
    
    capacity = engine.forecast_capacity_and_workload_breakdown()
    assert capacity["total_engineering_capacity_person_weeks"] == 96
    assert capacity["workload_distribution_pct"]["feature_development"] == 50.0

def test_portfolio_and_capacity_api_endpoints():
    res_port = client.get("/api/v1/autonomous-org-v65/portfolio/unified")
    assert res_port.status_code == 200
    assert res_port.json()["portfolio_summary"]["total_initiatives"] == 3

    res_risk = client.get("/api/v1/autonomous-org-v65/risk/portfolio")
    assert res_risk.status_code == 200
    assert res_risk.json()["risk_portfolio_score"] == "MEDIUM_MANAGED"

    res_cap = client.get("/api/v1/autonomous-org-v65/capacity/forecast")
    assert res_cap.status_code == 200
    assert res_cap.json()["total_engineering_capacity_person_weeks"] == 96
