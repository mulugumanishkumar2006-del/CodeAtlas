"""
Tests for CodeAtlas v4.2 - Environment Drift, FinOps Cloud Attribution & Executive Intelligence
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.enterprise_os_v42.identity_security_finops import IdentitySecurityAndFinOpsEngine
from app.enterprise_os_v42.ai_agent_executive_governance import AIAgentAndExecutiveGovernanceEngine

client = TestClient(app)

def test_environment_drift_and_finops_attribution():
    finops = IdentitySecurityAndFinOpsEngine()
    drift = finops.detect_environment_drift()
    assert drift["drift_detected"] is True
    assert drift["dora_delivery_metrics"]["deployment_frequency"].startswith("18.4")

    cost = finops.calculate_finops_cloud_cost_attribution()
    assert cost["total_monthly_cloud_cost"] == "$142,500"
    assert len(cost["team_cost_attribution"]) == 3

def test_ai_governance_and_executive_intelligence():
    gov = AIAgentAndExecutiveGovernanceEngine()
    ai_gov = gov.get_enterprise_ai_and_agent_governance()
    assert len(ai_gov["ai_inventory"]) == 2

    assistant = gov.query_organizational_ai_assistant("What systems are most risky?")
    assert "payment-service" in assistant["answer"]

    exec_intel = gov.get_executive_engineering_intelligence()
    assert exec_intel["executive_summary"]["overall_enterprise_health_score"] == 98.6

    readiness = gov.audit_v42_enterprise_readiness()
    assert readiness["enterprise_decision"] == "CODEATLAS V4.2 ENTERPRISE READY"
    assert readiness["checks_passed"] == 24

def test_finops_and_executive_api_endpoints():
    res_finops = client.get("/api/v1/enterprise-os-v42/finops/cost-attribution")
    assert res_finops.status_code == 200
    assert res_finops.json()["total_monthly_cloud_cost"] == "$142,500"

    res_ready = client.get("/api/v1/enterprise-os-v42/enterprise-readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["enterprise_decision"] == "CODEATLAS V4.2 ENTERPRISE READY"
