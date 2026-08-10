"""
Tests for CodeAtlas v4.0 - AI Workspace, Grounded RCA & Simulation Studio
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.global_intelligence_v4.ai_workspace_simulation import AIWorkspaceAndSimulationEngine

client = TestClient(app)

def test_ai_workspace_rca_investigation():
    sim = AIWorkspaceAndSimulationEngine()
    rca = sim.run_structured_ai_investigation_and_rca("Why did checkout latency spike?")
    assert len(rca["investigation_workflow"]["step_1_gather_evidence"]) == 3
    assert len(rca["citations"]) == 2

def test_simulation_studio_100x_surge_and_migration():
    sim = AIWorkspaceAndSimulationEngine()
    surge = sim.run_simulation_studio_scenario("100x_TRAFFIC_SURGE", "100x")
    assert surge["simulation_result"]["system_status"] == "STRESSED_FUTURE"
    assert "Redis" in surge["simulation_result"]["bottlenecks"][0]
    assert len(surge["migration_plan"]["stages"]) == 3

def test_ai_and_simulation_api_endpoints():
    res_rca = client.post("/api/v1/global-intelligence-v4/ai/investigate", json={"query": "Why did checkout latency spike?"})
    assert res_rca.status_code == 200
    assert len(res_rca.json()["citations"]) == 2

    res_sim = client.post("/api/v1/global-intelligence-v4/simulation/run", json={"scenario": "100x_TRAFFIC_SURGE", "scale": "100x"})
    assert res_sim.status_code == 200
    assert res_sim.json()["simulation_result"]["system_status"] == "STRESSED_FUTURE"
