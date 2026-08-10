"""
Tests for CodeAtlas v6.4 - Scenario Engine, What-If Engine, Multi-Scenario Branching & Failure/Migration Simulations
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.simulation_v64.scenario_engine_simulations import ScenarioEngineAndSimulations, ScenarioType

client = TestClient(app)

def test_scenario_branching_what_if_and_migrations():
    engine = ScenarioEngineAndSimulations()
    
    scen = engine.create_scenario_branch("CockroachDB Migration Scenario", ScenarioType.DATABASE_MIGRATION)
    assert scen["scenario_type"] == ScenarioType.DATABASE_MIGRATION
    assert scen["simulation_status"] == "READY_FOR_SIMULATION"
    
    whatif = engine.run_what_if_simulation("What if traffic doubles?", 2.0)
    assert whatif["traffic_multiplier"] == "2.0x"
    assert whatif["slo_breach_risk"] == "LOW"
    
    whatif_5x = engine.run_what_if_simulation("What if traffic 5x?", 5.0)
    assert whatif_5x["slo_breach_risk"] == "MEDIUM"
    
    db_mig = engine.simulate_database_migration("PostgreSQL RDS", "CockroachDB Cloud")
    assert len(db_mig["migration_stages"]) == 6
    assert db_mig["risk_assessment"]["estimated_downtime_seconds"] == 0

def test_scenario_engine_api_endpoints():
    res_scen = client.post("/api/v1/simulation-v64/scenario/create", json={
        "scenario_name": "Traffic Scaling Test",
        "scenario_type": "TRAFFIC_INCREASE"
    })
    assert res_scen.status_code == 200
    assert res_scen.json()["scenario_name"] == "Traffic Scaling Test"

    res_whatif = client.post("/api/v1/simulation-v64/scenario/what-if", json={
        "question": "What if traffic increases 5x?",
        "traffic_multiplier": 5.0
    })
    assert res_whatif.status_code == 200
    assert res_whatif.json()["estimated_p99_latency_ms"] == 85.0

    res_mig = client.post("/api/v1/simulation-v64/scenario/database-migration", json={
        "source_db": "PostgreSQL",
        "target_db": "CockroachDB"
    })
    assert res_mig.status_code == 200
    assert res_mig.json()["risk_assessment"]["failure_probability_pct"] == 3.2
