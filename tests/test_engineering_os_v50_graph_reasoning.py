"""
Tests for CodeAtlas v5.0 - Unified Graph, Time Travel & Engineering Memory
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.engineering_os_v50.unified_graph_memory import UnifiedGraphAndMemoryEngine, TruthType

client = TestClient(app)

def test_unified_graph_and_time_travel_history():
    engine = UnifiedGraphAndMemoryEngine()
    graph = engine.get_unified_graph_and_entity_resolution()
    assert graph["unified_graph_status"] == "MERGED_AND_RESOLVED"
    assert graph["stable_entities"]["repositories_resolved"] == 142

    history = engine.query_time_aware_architecture_history(180)
    assert history["architecture_snapshot"]["services_count"] == 22
    assert len(history["architectural_diff_vs_present"]["added_services"]) == 6

def test_engineering_memory_recording():
    engine = UnifiedGraphAndMemoryEngine()
    mem = engine.record_engineering_memory("Monolith Postgres migrated to Spanner", TruthType.HUMAN_DECISION, "ADR-014", 0.98)
    assert mem["truth_type"] == TruthType.HUMAN_DECISION
    assert mem["confidence"] == 0.98

def test_graph_and_memory_api_endpoints():
    res_graph = client.get("/api/v1/engineering-os-v50/graph/unified")
    assert res_graph.status_code == 200
    assert res_graph.json()["unified_graph_status"] == "MERGED_AND_RESOLVED"

    res_history = client.get("/api/v1/engineering-os-v50/time-travel?days_ago=180")
    assert res_history.status_code == 200
    assert res_history.json()["architecture_snapshot"]["services_count"] == 22
