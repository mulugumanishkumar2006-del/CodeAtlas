"""
Tests for CodeAtlas v5.2 - Zero Trust Identity, SSO/SAML/OIDC/SCIM, 8-Role RBAC & Break-Glass Access
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.security_v52.zero_trust_identity_access import ZeroTrustIdentityAndAccessEngine, UserRole, ActionPolicyTier

client = TestClient(app)

def test_sso_authentication_and_rbac_authorization():
    engine = ZeroTrustIdentityAndAccessEngine()
    auth = engine.authenticate_sso_saml_oidc("alice@enterprise.com", "Okta-SAML-SSO", True)
    assert auth["mfa_verified"] is True
    assert auth["scim_provisioned"] is True

    # Developer role allowed read
    auth_dev = engine.authorize_resource_action(UserRole.DEVELOPER, "repo_001", ActionPolicyTier.READ, "Internal")
    assert auth_dev["authorized"] is True

    # Viewer role denied delete
    auth_viewer = engine.authorize_resource_action(UserRole.VIEWER, "repo_001", ActionPolicyTier.DELETE, "Internal")
    assert auth_viewer["authorized"] is False

def test_break_glass_access_recording():
    engine = ZeroTrustIdentityAndAccessEngine()
    bg = engine.execute_break_glass_emergency_access("bob@enterprise.com", "P0 Incident INC-9901 Response", "security-lead@enterprise.com")
    assert bg["elevated_role"] == UserRole.ADMIN
    assert bg["jit_duration"] == "30 minutes"

def test_identity_and_auth_api_endpoints():
    res_sso = client.post("/api/v1/security-v52/auth/sso", json={"email": "alice@enterprise.com", "provider": "Okta-SAML-SSO"})
    assert res_sso.status_code == 200
    assert res_sso.json()["mfa_verified"] is True

    res_auth = client.post("/api/v1/security-v52/auth/authorize", json={"role": "VIEWER", "resource_id": "repo_1", "action_tier": "DELETE", "classification": "Internal"})
    assert res_auth.status_code == 200
    assert res_auth.json()["authorized"] is False
