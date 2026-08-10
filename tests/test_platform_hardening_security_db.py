"""
Tests for CodeAtlas v3.8 - Security Vault, Input Validation, Rate Limiting & SBOM
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.platform_hardening.security_privacy_audit import SecurityPrivacyAndSBOMEngine

client = TestClient(app)

def test_input_validation_and_secret_masking():
    sec = SecurityPrivacyAndSBOMEngine()
    raw = {
        "user_input": "Hello <script>alert('xss')</script> world",
        "api_token": "sk-123456789012345678901234567890"
    }
    sanitized = sec.validate_and_sanitize_input(raw)
    assert sanitized["validation_status"] == "PASSED_INPUT_VALIDATION"
    assert "<script>" not in sanitized["sanitized_payload"]["user_input"]
    assert "[MASKED_SECRET]" in sanitized["sanitized_payload"]["api_token"]

def test_rate_limiting_and_abuse_protection():
    sec = SecurityPrivacyAndSBOMEngine()
    client_ip = "192.168.1.50"
    endpoint = "/api/v1/search"
    
    # Under limit
    res1 = sec.enforce_rate_limiting(client_ip, endpoint, limit=2)
    assert res1["allowed"] is True

    res2 = sec.enforce_rate_limiting(client_ip, endpoint, limit=2)
    assert res2["allowed"] is True

    # Exceed limit
    res3 = sec.enforce_rate_limiting(client_ip, endpoint, limit=2)
    assert res3["allowed"] is False
    assert res3["status_code"] == 429

def test_sbom_generation_and_secret_rotation():
    sec = SecurityPrivacyAndSBOMEngine()
    sbom = sec.generate_software_bill_of_materials()
    assert sbom["sbom_version"] == "v1.4"
    assert len(sbom["components"]) >= 4

    rotation = sec.rotate_secret_credentials("sec_db_password", "DATABASE_CREDENTIAL")
    assert rotation["status"] == "ROTATION_SUCCESSFUL"

def test_security_api_endpoints():
    res_sbom = client.get("/api/v1/platform-hardening/security/sbom")
    assert res_sbom.status_code == 200
    assert res_sbom.json()["sbom_version"] == "v1.4"
