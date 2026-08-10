"""
Tests for CodeAtlas v5.2 - Secret Detection & Redaction, Model Allowlist & KMS Envelope Encryption
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.security_v52.secrets_data_classification_kms import SecretScannerAndKMSEngine

client = TestClient(app)

def test_secret_detection_and_redaction():
    engine = SecretScannerAndKMSEngine()
    
    # Redact OpenAI key
    res = engine.scan_and_redact_secrets("Use key sk-12345678901234567890123456789012 for inference")
    assert res["secrets_found_count"] == 1
    assert "[REDACTED_OPENAI_KEY]" in res["redacted_text"]

def test_model_allowlist_and_kms_key_rotation():
    engine = SecretScannerAndKMSEngine()
    
    # Approved model
    approved = engine.enforce_model_allowlist_and_residency("OpenAI-GPT-4o", "EU_GERMANY")
    assert approved["is_approved"] is True
    assert approved["gdpr_compliance"] == "COMPLIANT_LOCAL_PROCESSING"

    # Unapproved model
    blocked = engine.enforce_model_allowlist_and_residency("Untrusted-Model-X", "EU_GERMANY")
    assert blocked["is_approved"] is False

    # KMS key rotation
    kms = engine.rotate_envelope_kms_key()
    assert kms["key_rotation_status"] == "SUCCESSFULLY_ROTATED"

def test_secret_scan_and_kms_api_endpoints():
    res_scan = client.post("/api/v1/security-v52/secrets/scan", json={"text": "ghp_123456789012345678901234567890123456"})
    assert res_scan.status_code == 200
    assert "[REDACTED_GITHUB_TOKEN]" in res_scan.json()["redacted_text"]

    res_kms = client.post("/api/v1/security-v52/kms/rotate")
    assert res_kms.status_code == 200
    assert res_kms.json()["key_rotation_status"] == "SUCCESSFULLY_ROTATED"
