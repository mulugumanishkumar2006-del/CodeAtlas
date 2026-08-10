"""
Tests for CodeAtlas v3.4 - Canonical Temporal Graph, Memory & Semantic Search
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.intelligence_scale.canonical_temporal_graph import CanonicalTemporalGraphEngine, EntityType
from app.intelligence_scale.engineering_memory import EngineeringMemoryEngine
from app.intelligence_scale.semantic_contextual_search import SemanticContextualSearchEngine, SearchMode
from app.intelligence_scale.evidence_grounded_ai import EvidenceGroundedAIEngine

client = TestClient(app)

def test_canonical_temporal_graph():
    graph = CanonicalTemporalGraphEngine()
    stats = graph.get_canonical_graph_stats()
    assert stats["supported_entity_types"] == 23
    assert stats["total_canonical_entities"] >= 20

    ent = graph.add_entity(EntityType.SERVICE, "analytics-pipeline")
    assert "ent_service_" in ent["id"]

    history = graph.query_temporal_history("dev_alice")
    assert len(history) >= 1

def test_engineering_memory_and_quality():
    mem = EngineeringMemoryEngine()
    mem_item = mem.add_knowledge_item("ARCHITECTURE", "Redis Cache Policy", "Use connection pool", "ADR-001", "Team-Core")
    assert mem_item["quality_score"] > 0.80

    incidents = mem.search_incident_memory(["HTTP 500"], "payment-service")
    assert len(incidents) >= 1
    assert "successful_fix" in incidents[0]

    conflicts = mem.get_detected_conflicts()
    assert len(conflicts) >= 1
    assert conflicts[0]["type"] == "OWNERSHIP_MISMATCH"

def test_semantic_contextual_search():
    search = SemanticContextualSearchEngine()
    res = search.execute_natural_language_query("Why is checkout slow?", mode=SearchMode.INCIDENT_MODE)
    assert "latency" in res["answer"].lower() or "slow" in res["answer"].lower()
    assert len(res["prioritized_results"]) >= 2

    graph_res = search.execute_graph_query("payment-service", "AFFECTED_BY")
    assert "affected_services" in graph_res["connected_subgraph"]

def test_evidence_grounded_ai():
    ai = EvidenceGroundedAIEngine()
    res = ai.generate_grounded_answer("Why did production fail?", [{"source": "Datadog"}])
    assert res["verification_status"] == "VERIFIED_PASSED"
    assert res["confidence_score"] >= 0.70
    assert len(res["citations"]) == 3
