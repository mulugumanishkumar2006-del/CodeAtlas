"""
Tests for CodeAtlas v5.4 - Cryptographic Signing, 13-Stage Lifecycle Test Harness & Marketplace Audit
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.marketplace_v54.governance_signing_test_harness import GovernanceSigningAndTestHarnessEngine

client = TestClient(app)

def test_cryptographic_extension_signing():
    engine = GovernanceSigningAndTestHarnessEngine()
    signed = engine.sign_extension_artifact("publisher_codeatlas_official", "ext_k8s_agent_v1.0.0.tar.gz")
    assert signed["provenance_chain"] == "VERIFIED_CRYPTO_SIGNED"
    assert "sig_rsa2048_" in signed["crypto_signature"]

def test_13_stage_extension_lifecycle_test_and_audit():
    engine = GovernanceSigningAndTestHarnessEngine()
    test13 = engine.execute_13_stage_extension_lifecycle_test("ext_k8s_sre_agent")
    assert test13["stages_executed"] == 13
    assert test13["lifecycle_test_verdict"] == "PASSED_WITH_ZERO_CORE_IMPACT"

    readiness = engine.audit_v54_marketplace_readiness()
    assert readiness["marketplace_decision"] == "CODEATLAS V5.4 ECOSYSTEM READY"
    assert readiness["checks_passed"] == 23

def test_signing_and_readiness_api_endpoints():
    res_sign = client.post("/api/v1/marketplace-v54/signing/sign", json={
        "publisher_id": "pub_official",
        "artifact_summary": "artifact.tar.gz"
    })
    assert res_sign.status_code == 200
    assert res_sign.json()["provenance_chain"] == "VERIFIED_CRYPTO_SIGNED"

    res_13 = client.post("/api/v1/marketplace-v54/test-harness/13-stage-test", json={"extension_id": "ext_k8s_agent"})
    assert res_13.status_code == 200
    assert res_13.json()["stages_executed"] == 13

    res_ready = client.get("/api/v1/marketplace-v54/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["marketplace_decision"] == "CODEATLAS V5.4 ECOSYSTEM READY"
