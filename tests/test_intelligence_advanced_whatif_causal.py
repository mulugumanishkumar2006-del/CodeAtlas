"""
Tests for CodeAtlas v3.7 - What-If Scenario Simulator, Knowledge Graph 2.0 & Causal Counterfactual Engine
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.intelligence_advanced.whatif_future_simulator import WhatIfAndFutureSimulatorEngine
from app.intelligence_advanced.causal_kg_team_intelligence import CausalKGAndTeamIntelligenceEngine, CausalConfidence

client = TestClient(app)

def test_whatif_simulator_and_tradeoffs():
    wf = WhatIfAndFutureSimulatorEngine()
    sim_10x = wf.simulate_whatif_scenario("TRAFFIC_SURGE", "payment-service", "10x_TRAFFIC_SURGE")
    assert sim_10x["futures_state"] == "STRESSED_FUTURE"
    assert "Redis" in sim_10x["simulation_result"]["predicted_bottleneck"]

    tradeoff = wf.evaluate_architectural_tradeoffs("Event-Driven Microservices with Kafka")
    assert tradeoff["tradeoff_scores"]["performance"] == 94.0
    assert tradeoff["net_verdict"].startswith("RECOMMENDED")

def test_knowledge_graph_2_and_causal_counterfactual():
    ckg = CausalKGAndTeamIntelligenceEngine()
    multi_hop = ckg.query_multi_hop_knowledge_graph("redis_unpooled_connect()")
    assert len(multi_hop["multi_hop_chain"]) == 5

    causal = ckg.evaluate_causal_hypothesis_and_counterfactual("PR #101 Merge", "Incident INC-9941")
    assert causal["causal_confidence"] == CausalConfidence.CONFIRMED
    assert "avoided_downtime_mins" in causal["counterfactual_simulation"]

    bus = ckg.evaluate_team_knowledge_and_bus_factor("payment-service")
    assert bus["bus_factor_score"] == 1
    assert bus["knowledge_loss_risk"] == "HIGH"

def test_whatif_and_causal_api_endpoints():
    res_kg = client.get("/api/v1/intelligence-advanced/kg2/multi-hop?symbol=redis_unpooled_connect()")
    assert res_kg.status_code == 200
    assert len(res_kg.json()["multi_hop_chain"]) == 5
