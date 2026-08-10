"""
Tests for CodeAtlas v4.1 - Sandboxed Demo Workspace, Product Analytics & Market Readiness
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.product_adoption_v41.notifications_demo_analytics import NotificationsDemoAndAnalyticsEngine

client = TestClient(app)

def test_sandboxed_demo_workspace():
    engine = NotificationsDemoAndAnalyticsEngine()
    demo = engine.initialize_sandboxed_demo_workspace()
    assert demo["workspace_type"] == "SANDBOXED_DEMO_ENVIRONMENT"
    assert len(demo["sample_repositories"]) == 2

def test_product_analytics_and_market_readiness():
    engine = NotificationsDemoAndAnalyticsEngine()
    analytics = engine.get_product_analytics_and_activation()
    assert analytics["activation_funnel"]["activation_rate_pct"] == "90.3%"
    assert analytics["roi_time_saved"]["total_team_hours_saved_monthly"] == 420

    readiness = engine.audit_v41_market_readiness()
    assert readiness["market_readiness_decision"] == "CODEATLAS V4.1 MARKET READY"
    assert readiness["checks_passed"] == 15

def test_demo_and_market_readiness_api_endpoints():
    res_demo = client.post("/api/v1/product-adoption-v41/demo/init")
    assert res_demo.status_code == 200
    assert res_demo.json()["workspace_type"] == "SANDBOXED_DEMO_ENVIRONMENT"

    res_mr = client.get("/api/v1/product-adoption-v41/market-readiness")
    assert res_mr.status_code == 200
    assert res_mr.json()["market_readiness_decision"] == "CODEATLAS V4.1 MARKET READY"
