"""
Tests for CodeAtlas v5.5 - Federated Org Identity, Sharing Contracts, Revocation & Federated Search
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.federation_v55.identity_sharing_contracts import FederatedIdentityAndSharingContractEngine
from app.federation_v55.graph_search_systemic_simulation import FederatedGraphAndSystemicSimulationEngine

client = TestClient(app)

def test_sharing_contract_establishment_and_revocation():
    engine = FederatedIdentityAndSharingContractEngine()
    
    contract = engine.establish_sharing_contract("org_acme", "org_globex", "API_CONTRACTS", "Partner Integration Test", 90)
    assert contract["status"] == "APPROVED_ACTIVE"
    assert contract["data_minimization"] == "ENFORCED_ANONYMIZED"

    rev = engine.revoke_sharing_contract(contract["contract_id"], "org_acme")
    assert rev["status"] == "REVOKED"
    assert "Access terminated" in rev["message"]

def test_federated_search_privacy():
    search_engine = FederatedGraphAndSystemicSimulationEngine()
    res = search_engine.execute_federated_search("payment_service", "org_acme")
    assert res["results"]["private_internal_results_count"] == 14
    assert res["results"]["explicit_shared_partner_results_count"] == 3
    assert res["privacy_isolation_verdict"] == "POLICIES_ENFORCED_ZERO_LEAKAGE"

def test_contracts_and_search_api_endpoints():
    res_cntr = client.post("/api/v1/federation-v55/contract/establish", json={
        "provider_org_id": "org_acme",
        "consumer_org_id": "org_globex",
        "shared_data_type": "SECURITY_INTELLIGENCE",
        "purpose": "Threat Defense",
        "duration_days": 30
    })
    assert res_cntr.status_code == 200
    assert res_cntr.json()["status"] == "APPROVED_ACTIVE"

    res_search = client.get("/api/v1/federation-v55/search/federated?query=payment_service&caller_org_id=org_acme")
    assert res_search.status_code == 200
    assert res_search.json()["privacy_isolation_verdict"] == "POLICIES_ENFORCED_ZERO_LEAKAGE"
