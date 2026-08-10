"""
Tests for CodeAtlas v6.7 - Technical Debt Economics, Automation ROI, Security/Reliability Economics & Build vs Buy Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.economy_v67.debt_security_automation_roi import DebtSecurityAutomationROIEngine

client = TestClient(app)

def test_automation_payback_tech_debt_and_build_vs_buy():
    engine = DebtSecurityAutomationROIEngine()
    
    auto = engine.evaluate_automation_payback_and_roi("Automated Migration", 24000.0, 120.0, 125.0)
    assert auto["monthly_cost_savings_usd"] == 15000.0
    assert auto["estimated_payback_period_months"] == 1.6
    
    debt = engine.calculate_technical_debt_economic_liability("Legacy Monolith", 45000.0)
    assert debt["annual_recurring_debt_interest_usd"] == 28000.0
    assert debt["tradeoff_recommendation"] == "PAY_DOWN_NOW (Payback achieved in 1.6 years through outage prevention and developer velocity lift)"
    
    bvb = engine.evaluate_build_vs_buy_economics()
    assert bvb["economic_verdict"] == "BUY_MANAGED_SOLUTION"

def test_debt_automation_and_bvb_api_endpoints():
    res_auto = client.post("/api/v1/economy-v67/automation/payback", json={
        "name": "DB Migration Bot",
        "cost_usd": 24000.0,
        "hours_saved": 120.0,
        "hourly_rate": 125.0
    })
    assert res_auto.status_code == 200
    assert res_auto.json()["estimated_payback_period_months"] == 1.6

    res_debt = client.post("/api/v1/economy-v67/tech-debt/liability", json={
        "debt_title": "Legacy RDS Monolith",
        "principal_cost": 45000.0
    })
    assert res_debt.status_code == 200
    assert res_debt.json()["annual_recurring_debt_interest_usd"] == 28000.0

    res_bvb = client.post("/api/v1/economy-v67/build-vs-buy/evaluate", json={
        "capability": "Distributed DB",
        "build_option": "Self-Hosted EC2",
        "buy_option": "Managed Cloud"
    })
    assert res_bvb.status_code == 200
    assert res_bvb.json()["economic_verdict"] == "BUY_MANAGED_SOLUTION"
