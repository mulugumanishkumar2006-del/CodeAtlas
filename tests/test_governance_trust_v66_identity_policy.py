"""
Tests for CodeAtlas v6.6 - Trust Architecture, Identity Model, RBAC/ABAC & Policy Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.governance_trust_v66.trust_identity_permissions_policy import TrustIdentityPermissionsPolicyEngine, IdentityType, RoleTypeRBAC, ActionTypePermission

client = TestClient(app)

def test_identity_permissions_and_policy_as_code():
    engine = TrustIdentityPermissionsPolicyEngine()
    
    # Agent executing in PROD defaults to DENIED unless approved
    eval_prod = engine.evaluate_identity_permissions("agent_migration_bot_v66", "Service:checkout-service", ActionTypePermission.EXECUTE, "PRODUCTION")
    assert eval_prod["decision"] == "DENIED"
    assert "human approval" in eval_prod["denial_reason"]
    
    # Agent analyzing in STAGING is AUTHORIZED
    eval_stg = engine.evaluate_identity_permissions("agent_migration_bot_v66", "Service:checkout-service", ActionTypePermission.ANALYZE, "STAGING")
    assert eval_stg["decision"] == "AUTHORIZED"
    
    pol = engine.evaluate_policy_as_code("Database Migration", "HIGH", "PRODUCTION")
    assert pol["policy_compliance_status"] == "COMPLIANT_WITH_GOVERNANCE_GATE"
    assert pol["requires_human_approval"] is True

def test_identity_and_policy_api_endpoints():
    res_perm = client.post("/api/v1/governance-trust-v66/identity/permissions/evaluate", json={
        "identity_id": "agent_migration_bot_v66",
        "resource": "Service:checkout-service",
        "action": "EXECUTE",
        "environment": "PRODUCTION"
    })
    assert res_perm.status_code == 200
    assert res_perm.json()["decision"] == "DENIED"

    res_pol = client.post("/api/v1/governance-trust-v66/policy/evaluate", json={
        "proposed_action": "DB Schema Switchover",
        "risk_level": "HIGH",
        "environment": "PRODUCTION"
    })
    assert res_pol.status_code == 200
    assert res_pol.json()["requires_human_approval"] is True
