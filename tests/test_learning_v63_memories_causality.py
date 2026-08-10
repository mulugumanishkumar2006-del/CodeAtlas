"""
Tests for CodeAtlas v6.3 - 8 Persistent Engineering Memories, Pattern Discovery & Causal Attribution Engine
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.learning_v63.memories_patterns_causality import MemoriesPatternsAndCausalityEngine

client = TestClient(app)

def test_persistent_memories_patterns_and_counterfactuals():
    engine = MemoriesPatternsAndCausalityEngine()
    
    mem = engine.record_decision_memory("Use PostgreSQL", "ACID Compliance required", ["MongoDB", "DynamoDB"], "High performance under 100k IOPS")
    assert mem["decision"] == "Use PostgreSQL"

    pats = engine.discover_engineering_patterns("ORGANIZATION_WIDE")
    assert pats["pattern_verdict"] == "PATTERNS_IDENTIFIED_AND_INDEXED"
    assert len(pats["discovered_patterns"]) == 2

    cf = engine.perform_counterfactual_analysis("What if we did nothing?")
    assert cf["attribution_verdict"] == "CAUSAL_EVIDENCE_CONFIRMED"

def test_memories_and_causality_api_endpoints():
    res_mem = client.post("/api/v1/learning-v63/memory/decision", json={
        "decision": "Use Redis Cache",
        "reason": "Reduce DB load",
        "alternatives": ["Memcached"],
        "outcome": "DB load reduced by 40%"
    })
    assert res_mem.status_code == 200
    assert res_mem.json()["decision"] == "Use Redis Cache"

    res_pat = client.get("/api/v1/learning-v63/patterns/discover?scope=ORGANIZATION_WIDE")
    assert res_pat.status_code == 200
    assert res_pat.json()["pattern_verdict"] == "PATTERNS_IDENTIFIED_AND_INDEXED"
