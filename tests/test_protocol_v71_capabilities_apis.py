"""
Tests for CodeAtlas v7.1 - Platform APIs, Intelligence Operations & Registries
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.protocol_v71.apis_registries_capability_discovery import ApisRegistriesCapabilityDiscoveryEngine, IntelligenceOperation

client = TestClient(app)

def test_capability_discovery_and_intelligence_operation():
    engine = ApisRegistriesCapabilityDiscoveryEngine()
    
    caps = engine.discover_platform_capabilities()
    assert caps["protocol_version"] == "caip/1.0"
    assert IntelligenceOperation.INVESTIGATE in caps["supported_intelligence_operations"]
    assert caps["registered_agents_count"] >= 1
    
    op = engine.execute_intelligence_operation(IntelligenceOperation.INVESTIGATE, "checkout-service")
    assert op["status"] == "COMPLETED"
    assert op["result"]["confidence_score"] == 0.98

def test_capabilities_and_intelligence_op_api_endpoints():
    res_caps = client.get("/api/v1/protocol-v71/capabilities")
    assert res_caps.status_code == 200
    assert res_caps.json()["protocol_version"] == "caip/1.0"

    res_op = client.post("/api/v1/protocol-v71/intelligence/operate", json={
        "op": IntelligenceOperation.INVESTIGATE,
        "target": "checkout-service"
    })
    assert res_op.status_code == 200
    assert res_op.json()["status"] == "COMPLETED"
