"""
Tests for CodeAtlas v5.4 - Extension Manifest Validation & 7-Stage Lifecycle Management
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.marketplace_v54.extension_manifest_lifecycle import ExtensionManifestAndLifecycleEngine, ExtensionType, TrustTier

client = TestClient(app)

def test_extension_manifest_validation_and_lifecycle():
    engine = ExtensionManifestAndLifecycleEngine()
    
    # Valid manifest
    manifest = {
        "name": "Kubernetes SRE Agent",
        "version": "1.0.0",
        "extension_type": ExtensionType.AGENT,
        "author": "CodeAtlas Team",
        "permissions": ["READ_TELEMETRY", "EXECUTE_SANDBOX_TOOL"],
        "min_codeatlas_version": "v5.4.0"
    }
    val = engine.validate_extension_manifest(manifest)
    assert val["valid"] is True

    # Lifecycle operations
    inst = engine.execute_lifecycle_operation("ext_k8s_agent", "INSTALL", manifest, TrustTier.VERIFIED)
    assert inst["operation"] == "INSTALL"
    assert inst["active_installed_count"] == 1

    upd = engine.execute_lifecycle_operation("ext_k8s_agent", "UPDATE")
    assert upd["operation"] == "UPDATE"

    dis = engine.execute_lifecycle_operation("ext_k8s_agent", "DISABLE")
    assert dis["operation"] == "DISABLE"

    rem = engine.execute_lifecycle_operation("ext_k8s_agent", "REMOVE")
    assert rem["operation"] == "REMOVE"
    assert rem["active_installed_count"] == 0

def test_manifest_and_lifecycle_api_endpoints():
    manifest = {
        "name": "SOC2 Policy Pack",
        "version": "1.0.0",
        "extension_type": "POLICY",
        "author": "SecTeam",
        "permissions": ["READ_POLICIES"],
        "min_codeatlas_version": "v5.4.0"
    }
    res_val = client.post("/api/v1/marketplace-v54/manifest/validate", json=manifest)
    assert res_val.status_code == 200
    assert res_val.json()["valid"] is True

    res_lifecycle = client.post("/api/v1/marketplace-v54/extension/lifecycle", json={
        "extension_id": "ext_soc2",
        "operation": "INSTALL",
        "manifest": manifest,
        "trust_tier": "VERIFIED"
    })
    assert res_lifecycle.status_code == 200
    assert res_lifecycle.json()["active_installed_count"] == 1
