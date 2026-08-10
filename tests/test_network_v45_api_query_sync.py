"""
Tests for CodeAtlas v4.5 - API Contract Health, Natural Language Graph Queries & Network Audit
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.network_v45.api_event_explorer_sync import APIEventExplorerAndSyncEngine

client = TestClient(app)

def test_api_event_ecosystem_health():
    engine = APIEventExplorerAndSyncEngine()
    health = engine.get_api_and_event_ecosystem_health()
    assert health["api_contract_health"]["active_api_endpoints"] == 64
    assert len(health["event_message_flow"]) >= 1

def test_natural_language_graph_query():
    engine = APIEventExplorerAndSyncEngine()
    query_res = engine.execute_natural_language_graph_query("Which systems depend on openssl?")
    assert query_res["matched_nodes_count"] == 14
    assert len(query_res["evidence_citations"]) >= 1
    assert query_res["privacy_isolation_verdict"].startswith("ENFORCED")

def test_global_network_readiness_api_endpoint():
    res_ready = client.get("/api/v1/network-v45/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["network_decision"] == "CODEATLAS V4.5 GLOBAL ENGINEERING NETWORK READY"
    assert res_ready.json()["checks_passed"] == 25
