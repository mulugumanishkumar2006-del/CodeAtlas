"""
Tests for CodeAtlas v4.2 - Enterprise Portfolios, Tech Stack Lifecycle & ABAC Security
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.enterprise_os_v42.portfolios_tech_lifecycle import EnterprisePortfoliosAndTechLifecycleEngine, TechLifecycleState
from app.enterprise_os_v42.identity_security_finops import IdentitySecurityAndFinOpsEngine

client = TestClient(app)

def test_enterprise_portfolios_and_tech_lifecycle():
    engine = EnterprisePortfoliosAndTechLifecycleEngine()
    port = engine.get_enterprise_portfolios_and_criticality()
    assert port["portfolio_summary"]["repositories_count"] == 142
    assert port["business_applications"][0]["criticality"] == "MISSION_CRITICAL"

    tech = engine.get_technology_landscape_and_lifecycle()
    assert len(tech["domains"]) == 2
    assert tech["technology_landscape"][0]["status"] == TechLifecycleState.PREFERRED

    mig = engine.calculate_migration_portfolio_risk("Aurora_to_Spanner")
    assert mig["risk_level"] == "MEDIUM_RISK"

def test_abac_security_policy_and_exceptions():
    sec = IdentitySecurityAndFinOpsEngine()
    
    # Denied ABAC
    denied = sec.evaluate_abac_access_policy("DEVELOPER", "Team-Checkout", "PRODUCTION", "payment-db", "HIGH")
    assert denied["access_granted"] is False

    # Granted ABAC
    granted = sec.evaluate_abac_access_policy("SRE", "Team-SRE", "PRODUCTION", "payment-db", "HIGH")
    assert granted["access_granted"] is True

    exc = sec.request_security_policy_exception("POL_001", "Legacy auth deprecation buffer", "Alice")
    assert exc["approval_status"] == "APPROVED_WITH_EXPIRATION"

def test_portfolios_and_security_api_endpoints():
    res_port = client.get("/api/v1/enterprise-os-v42/portfolios")
    assert res_port.status_code == 200
    assert res_port.json()["portfolio_summary"]["repositories_count"] == 142

    res_abac = client.post(
        "/api/v1/enterprise-os-v42/abac/evaluate",
        json={
            "role": "SRE",
            "team": "Team-SRE",
            "environment": "PRODUCTION",
            "resource": "payment-db",
            "risk": "HIGH"
        }
    )
    assert res_abac.status_code == 200
    assert res_abac.json()["access_granted"] is True
