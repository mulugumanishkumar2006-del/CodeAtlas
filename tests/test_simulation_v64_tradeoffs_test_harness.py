"""
Tests for CodeAtlas v6.4 - Tradeoffs, Uncertainty, Monte Carlo, Decision Center & 20-Step Final Digital Twin Test
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.simulation_v64.tradeoffs_uncertainty_optimization import TradeoffsUncertaintyOptimizationEngine
from app.simulation_v64.memory_replay_gates_governance import MemoryReplayGatesGovernanceEngine

client = TestClient(app)

def test_tradeoffs_monte_carlo_and_20_step_migration_test():
    tradeoffs_engine = TradeoffsUncertaintyOptimizationEngine()
    
    matrix = tradeoffs_engine.evaluate_architecture_alternatives()
    assert matrix["recommended_choice"] == "CockroachDB Distributed SQL"
    assert len(matrix["evaluated_alternatives"]) == 3
    
    monte_carlo = tradeoffs_engine.run_monte_carlo_uncertainty_simulation(100, 42.0)
    assert monte_carlo["iterations_run"] == 100
    assert "p99_latency_ms" in monte_carlo["confidence_intervals_95_pct"]
    
    governance = MemoryReplayGatesGovernanceEngine()
    test20 = governance.execute_20_step_final_digital_twin_migration_test("CockroachDB Distributed SQL")
    assert test20["steps_executed"] == 20
    assert test20["digital_twin_test_verdict"] == "CODEATLAS_IS_A_DECISION_SIMULATION_SYSTEM"
    
    readiness = governance.audit_v64_digital_twin_readiness()
    assert readiness["simulation_decision"] == "CODEATLAS v6.4 ENGINEERING SIMULATION READY"
    assert readiness["checks_passed"] == 20

def test_tradeoffs_and_20_step_test_api_endpoints():
    res_matrix = client.post("/api/v1/simulation-v64/tradeoffs/evaluate", json={
        "primary": "CockroachDB",
        "alt_b": "Aurora",
        "alt_c": "DynamoDB"
    })
    assert res_matrix.status_code == 200
    assert res_matrix.json()["matrix_name"] == "6D Architecture Tradeoff Matrix"

    res_mc = client.post("/api/v1/simulation-v64/uncertainty/monte-carlo", json={
        "iterations": 100,
        "baseline_latency_ms": 42.0
    })
    assert res_mc.status_code == 200
    assert res_mc.json()["iterations_run"] == 100

    res_20 = client.post("/api/v1/simulation-v64/test-harness/20-step-test", json={"target_db": "CockroachDB"})
    assert res_20.status_code == 200
    assert res_20.json()["steps_executed"] == 20

    res_ready = client.get("/api/v1/simulation-v64/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["simulation_decision"] == "CODEATLAS v6.4 ENGINEERING SIMULATION READY"
