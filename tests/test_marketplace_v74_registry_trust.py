"""
Tests for CodeAtlas v7.4 - Asset Registry, Manifests, Supply Chain Security & Trust Center Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.marketplace_v74.registry_manifests_trust_center import RegistryManifestsTrustCenterEngine, AssetType, RiskClassification

client = TestClient(app)

def test_asset_registration_and_trust_center():
    engine = RegistryManifestsTrustCenterEngine()
    
    reg = engine.register_and_scan_asset("ast_custom_sec", "Custom Security Agent", AssetType.AGENT)
    assert reg["asset"]["asset_id"] == "ast_custom_sec"
    assert reg["sandbox_security_analysis"]["dependency_graph_vulnerabilities"] == 0
    
    trust = engine.get_decomposable_trust_center_profile("ast_custom_sec")
    assert trust["overall_trust_score"] == 0.95
    assert trust["trust_explanation_breakdown"]["security_evaluation"] == 0.98

def test_asset_registration_and_trust_center_api_endpoints():
    res_reg = client.post("/api/v1/marketplace-v74/assets/register", json={
        "asset_id": "ast_custom_sec",
        "name": "Custom Security Agent"
    })
    assert res_reg.status_code == 200
    assert res_reg.json()["asset"]["asset_id"] == "ast_custom_sec"

    res_trust = client.get("/api/v1/marketplace-v74/trust-center/profile?asset_id=ast_custom_sec")
    assert res_trust.status_code == 200
    assert res_trust.json()["overall_trust_score"] == 0.95
