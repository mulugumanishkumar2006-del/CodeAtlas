"""
Tests for CodeAtlas v6.3 - Epistemological Model, Evidence Graph & Contradiction Resolution Engine
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.learning_v63.epistemology_evidence_graph import EpistemologyAndEvidenceGraphEngine, EpistemologicalCategory, KnowledgeLifecycleState

client = TestClient(app)

def test_epistemological_claims_and_contradiction_resolution():
    engine = EpistemologyAndEvidenceGraphEngine()
    
    claim1 = engine.record_epistemological_claim("Checkout is slow due to unindexed query", EpistemologicalCategory.INFERENCE, "AST + Telemetry", 0.98)
    assert claim1["category"] == "INFERENCE"
    assert claim1["lifecycle_state"] == KnowledgeLifecycleState.VERIFIED

    fact_doc = {"claim_text": "Team A owns Database X", "confidence": 0.60}
    fact_git = {"claim_text": "Team B owns Database X", "confidence": 0.95}

    res = engine.detect_and_resolve_contradiction(fact_doc, fact_git)
    assert res["resolution_verdict"] == "RESOLVED_IN_FAVOR_OF_HIGHER_AUTHORITY"
    assert res["accepted_fact"] == "Team B owns Database X"

def test_epistemology_api_endpoints():
    res_claim = client.post("/api/v1/learning-v63/claim/record", json={
        "claim_text": "Checkout slow",
        "category": "INFERENCE",
        "source": "OpenTelemetry",
        "confidence": 0.98,
        "evidence": ["Span latency 420ms"]
    })
    assert res_claim.status_code == 200
    assert res_claim.json()["lifecycle_state"] == "VERIFIED"

    res_res = client.post("/api/v1/learning-v63/contradiction/resolve", json={
        "fact_a": {"claim_text": "Team A owns DB", "confidence": 0.60},
        "fact_b": {"claim_text": "Team B owns DB", "confidence": 0.95}
    })
    assert res_res.status_code == 200
    assert res_res.json()["accepted_fact"] == "Team B owns DB"
