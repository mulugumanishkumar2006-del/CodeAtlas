"""
Tests for CodeAtlas v4.4 - Digital Twin Core, Natural Language Scenarios & Blast Radius Engine
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.simulation_v44.digital_twin_core import DigitalTwinCoreEngine, SystemStateType
from app.simulation_v44.scenario_blast_radius import ScenarioBlastRadiusEngine

client = TestClient(app)

def test_digital_twin_state_comparison():
    engine = DigitalTwinCoreEngine()
    current = engine.current_state_v1
    assert current["type"] == SystemStateType.CURRENT
    assert len(current["entities"]["services"]) == 3

    prop = engine.create_proposed_future_state("Migrate DB to Google Cloud Spanner", {"databases": ["Google Cloud Spanner"]})
    assert prop["type"] == SystemStateType.PROPOSED

    diff = engine.compare_system_states(current["state_id"], prop["state_id"])
    assert "Spanner" in diff["entity_diff"]["database_changes"]

def test_natural_language_scenario_and_blast_radius():
    engine = ScenarioBlastRadiusEngine()
    parsed = engine.parse_natural_language_scenario("Replace PostgreSQL with Spanner database")
    assert parsed["change_type"] == "DATABASE_MIGRATION"
    assert parsed["is_technically_valid"] is True

    blast = engine.calculate_multi_layer_blast_radius("DATABASE_MIGRATION", "PostgreSQL-PaymentDB-Primary")
    assert blast["blast_radius"]["affected_files_count"] == 42
    assert len(blast["blast_radius"]["affected_teams"]) == 2

def test_digital_twin_and_blast_radius_api_endpoints():
    res_curr = client.get("/api/v1/simulation-v44/twin/current-state")
    assert res_curr.status_code == 200
    assert res_curr.json()["type"] == SystemStateType.CURRENT

    res_parse = client.post("/api/v1/simulation-v44/scenario/parse", json={"prompt": "Replace PostgreSQL with Spanner database"})
    assert res_parse.status_code == 200
    assert res_parse.json()["change_type"] == "DATABASE_MIGRATION"
