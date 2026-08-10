"""
Tests for CodeAtlas v4.5 - 10-Layer Global Engineering Graph & Software Supply Chain Provenance
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.network_v45.global_graph_supply_chain import GlobalGraphAndSupplyChainEngine

client = TestClient(app)

def test_ten_layer_network_graph():
    engine = GlobalGraphAndSupplyChainEngine()
    graph = engine.get_ten_layer_network_graph()
    assert len(graph["network_taxonomy_layers"]) == 10
    assert graph["network_taxonomy_layers"][0]["name"] == "Code"
    assert graph["network_taxonomy_layers"][9]["name"] == "AI Systems & Autonomous Agents"

def test_artifact_build_provenance_tracing():
    engine = GlobalGraphAndSupplyChainEngine()
    prov = engine.trace_artifact_build_provenance("dep_8814")
    assert prov["provenance_verdict"] == "100% VERIFIED_ORIGIN"
    assert "source_commit" in prov["provenance_chain"]
    assert "artifact_digest" in prov["provenance_chain"]

def test_10_layer_graph_api_endpoints():
    res_graph = client.get("/api/v1/network-v45/graph/10-layer")
    assert res_graph.status_code == 200
    assert len(res_graph.json()["network_taxonomy_layers"]) == 10

    res_prov = client.get("/api/v1/network-v45/supply-chain/provenance?deployment_id=dep_8814")
    assert res_prov.status_code == 200
    assert res_prov.json()["provenance_verdict"] == "100% VERIFIED_ORIGIN"
