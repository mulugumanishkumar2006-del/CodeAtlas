"""
Tests for CodeAtlas v6.9 - Ecosystem Knowledge Graph, Software Supply Chain & API Monitoring Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ecosystem_v69.ecosystem_graph_supply_chain import EcosystemGraphSupplyChainEngine, DependencyLifecycleState

client = TestClient(app)

def test_supply_chain_and_api_monitoring():
    engine = EcosystemGraphSupplyChainEngine()
    
    graph = engine.get_software_supply_chain_graph("CodeAtlas/apps/backend")
    assert graph["supply_chain_freshness_pct"] == 82.5
    assert len(graph["outdated_dependencies"]) == 1
    assert graph["outdated_dependencies"][0]["package"] == "pydantic"
    
    api_res = engine.monitor_external_api_ecosystem("Stripe API")
    assert api_res["external_api"] == "Stripe API"
    assert len(api_res["detected_changes"]) == 1

def test_supply_chain_and_api_monitoring_api_endpoints():
    res_sc = client.get("/api/v1/ecosystem-v69/supply-chain/graph?repo_id=CodeAtlas/apps/backend")
    assert res_sc.status_code == 200
    assert res_sc.json()["supply_chain_freshness_pct"] == 82.5

    res_api = client.get("/api/v1/ecosystem-v69/api/monitor?api_name=Stripe%20API")
    assert res_api.status_code == 200
    assert res_api.json()["external_api"] == "Stripe API"
