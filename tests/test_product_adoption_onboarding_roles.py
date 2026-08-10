"""
Tests for CodeAtlas v4.1 - Onboarding Stage Progress & Role-Aware Personalized Dashboards
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.product_adoption_v41.onboarding_role_dashboards import OnboardingAndRoleDashboardEngine, UserRole

client = TestClient(app)

def test_onboarding_analysis_stage_progress():
    engine = OnboardingAndRoleDashboardEngine()
    progress = engine.get_analysis_stage_progress("payment-service")
    assert progress["overall_progress_pct"] == 100
    assert len(progress["analysis_stages"]) == 6
    assert "first_value_insight" in progress

def test_role_personalized_dashboards():
    engine = OnboardingAndRoleDashboardEngine()
    dev_dash = engine.get_role_personalized_dashboard(UserRole.DEVELOPER)
    assert "My PRs & Code Changes" in dev_dash["personalized_priorities"][0]

    sre_dash = engine.get_role_personalized_dashboard(UserRole.SRE)
    assert "Active Incidents & MTTR" in sre_dash["personalized_priorities"][0]

    exec_dash = engine.get_role_personalized_dashboard(UserRole.EXECUTIVE_CTO)
    assert "Overall System Health" in exec_dash["personalized_priorities"][0]

def test_onboarding_and_roles_api_endpoints():
    res_prog = client.get("/api/v1/product-adoption-v41/onboarding/progress?repository=payment-service")
    assert res_prog.status_code == 200
    assert res_prog.json()["overall_progress_pct"] == 100

    res_role = client.get("/api/v1/product-adoption-v41/role/dashboard?role=SRE")
    assert res_role.status_code == 200
    assert res_role.json()["role"] == "SRE"
