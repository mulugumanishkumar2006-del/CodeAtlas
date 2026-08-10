"""
Tests for CodeAtlas v5.5 - Cross-Org Incident Rooms & Systemic Ecosystem Failure Simulation
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.federation_v55.graph_search_systemic_simulation import FederatedGraphAndSystemicSimulationEngine
from app.federation_v55.incidents_workflows_agents import IncidentsWorkflowsAndFederatedAgentsEngine

client = TestClient(app)

def test_shared_incident_room_and_systemic_simulation():
    inc_engine = IncidentsWorkflowsAndFederatedAgentsEngine()
    room = inc_engine.create_shared_incident_room("INC-9901", ["org_acme", "org_globex"], "CVE-2026-8814")
    assert room["shared_mitigation_status"] == "COORDINATING_REMEDIATION"
    assert len(room["participating_orgs"]) == 2

    sim_engine = FederatedGraphAndSystemicSimulationEngine()
    sim = sim_engine.simulate_systemic_ecosystem_failure("AWS-us-east-1")
    assert sim["systemic_risk_level"] == "HIGH_CONCENTRATION_RISK"
    assert sim["simulated_blast_radius"]["affected_services"] == 64

def test_incident_room_and_systemic_sim_api_endpoints():
    res_room = client.post("/api/v1/federation-v55/incidents/room", json={
        "incident_id": "INC-9901",
        "orgs": ["org_acme", "org_globex"],
        "indicator": "CVE-2026-8814"
    })
    assert res_room.status_code == 200
    assert res_room.json()["shared_mitigation_status"] == "COORDINATING_REMEDIATION"

    res_sim = client.post("/api/v1/federation-v55/simulation/systemic", json={"target": "AWS-us-east-1"})
    assert res_sim.status_code == 200
    assert res_sim.json()["systemic_risk_level"] == "HIGH_CONCENTRATION_RISK"
