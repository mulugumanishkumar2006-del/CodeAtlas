"""
Tests for CodeAtlas v5.4 - Agent Trust Scores, Skill Composition & Semantic Natural-Language Discovery
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.marketplace_v54.sdks_skills_workflows import ConnectorAndAgentSDKEngine
from app.marketplace_v54.policies_knowledge_discovery import PolicyKnowledgeAndDiscoveryEngine

client = TestClient(app)

def test_agent_trust_score_and_skill_composition():
    sdk = ConnectorAndAgentSDKEngine()
    
    trust = sdk.evaluate_agent_trust_score("agent_sre_01", accuracy_pct=98.4, safety_score=99.8)
    assert trust["trust_tier"] == "VERIFIED_HIGH_TRUST"
    assert trust["overall_trust_score"] == 99.1

    comp = sdk.compose_skills_into_marketplace_workflow("Incident Investigation Workflow", ["Investigate Incident", "Check Telemetry"], True)
    assert comp["status"] == "WORKFLOW_VERIFIED_READY"
    assert comp["simulation_result"]["simulation_passed"] is True

def test_semantic_marketplace_discovery_and_knowledge_provenance():
    disc = PolicyKnowledgeAndDiscoveryEngine()
    
    search = disc.search_semantic_marketplace("Find an agent that investigates Kubernetes incidents")
    assert search["total_results"] > 0
    assert "Kubernetes" in search["matches"][0]["name"]

    prov = disc.get_knowledge_pack_provenance("ext_fintech_knowledge_pack")
    assert prov["domain"] == "FinTech / PCI-DSS"
    assert prov["confidence_score"] == 0.99

def test_discovery_and_trust_score_api_endpoints():
    res_trust = client.get("/api/v1/marketplace-v54/agent/trust-score?agent_id=agent_sre_01")
    assert res_trust.status_code == 200
    assert res_trust.json()["overall_trust_score"] == 99.1

    res_search = client.get("/api/v1/marketplace-v54/discovery/search?query=Kubernetes")
    assert res_search.status_code == 200
    assert res_search.json()["total_results"] > 0
