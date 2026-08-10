"""
Tests for CodeAtlas v7.0 - Unified Platform Model, Engineering Graph, Context Engine & Unified Search
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.platform_v70.unified_graph_context_search import UnifiedGraphContextSearchEngine, PlatformEntityType

client = TestClient(app)

def test_context_engine_and_unified_search():
    engine = UnifiedGraphContextSearchEngine()
    
    ctx = engine.build_context_aware_intelligence_payload("Architect", "Evaluating CockroachDB Migration")
    assert ctx["confidence_score"] == 0.98
    assert len(ctx["grounded_evidence"]) == 3
    
    srch = engine.execute_unified_search("Why did checkout service latency spike?", "TEMPORAL")
    assert srch["search_mode"] == "TEMPORAL"
    assert "temporal_insights" in srch
    assert len(srch["graph_matches"]) == 1

def test_context_and_search_api_endpoints():
    res_ctx = client.get("/api/v1/platform-v70/context/payload?user_role=Architect")
    assert res_ctx.status_code == 200
    assert res_ctx.json()["confidence_score"] == 0.98

    res_srch = client.get("/api/v1/platform-v70/search/unified?query=latency&mode=TEMPORAL")
    assert res_srch.status_code == 200
    assert res_srch.json()["search_mode"] == "TEMPORAL"
