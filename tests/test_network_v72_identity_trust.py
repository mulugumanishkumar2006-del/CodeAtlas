"""
Tests for CodeAtlas v7.2 - Cryptographic Node Identity, Zero-Trust Negotiation & Federated Knowledge Graph Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.network_v72.node_identity_trust_federated_graph import NodeIdentityTrustFederatedGraphEngine, TrustSessionState

client = TestClient(app)

def test_zero_trust_negotiation_and_federated_search():
    engine = NodeIdentityTrustFederatedGraphEngine()
    
    sess = engine.execute_6_step_zero_trust_negotiation("node_eu_acme", "READ_PATTERNS")
    assert sess["state"] == TrustSessionState.ESTABLISHED
    assert len(sess["negotiation_log"]) == 6
    
    srch = engine.execute_privacy_preserving_federated_search()
    assert srch["federated_nodes_queried"] == 2
    assert srch["federated_results"][0]["raw_code_transferred"] is False

def test_trust_negotiation_and_search_api_endpoints():
    res_neg = client.post("/api/v1/network-v72/trust/negotiate", json={
        "target_node": "node_eu_acme",
        "scope": "READ_PATTERNS"
    })
    assert res_neg.status_code == 200
    assert res_neg.json()["state"] == TrustSessionState.ESTABLISHED

    res_srch = client.get("/api/v1/network-v72/search/federated?query=PostgreSQL")
    assert res_srch.status_code == 200
    assert len(res_srch.json()["federated_results"]) == 1
