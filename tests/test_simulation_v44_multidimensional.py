"""
Tests for CodeAtlas v4.4 - Multi-Dimensional Simulation Suite (100x Load, Failure Injection, Security & Cost)
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.simulation_v44.multidimensional_simulators import MultiDimensionalSimulatorsEngine

client = TestClient(app)

def test_100x_traffic_load_surge_simulation():
    engine = MultiDimensionalSimulatorsEngine()
    load10 = engine.simulate_traffic_load_surge(10)
    assert load10["load_multiplier"] == "10x"
    assert len(load10["predicted_bottlenecks"]) >= 1

    load100 = engine.simulate_traffic_load_surge(100)
    assert load100["load_multiplier"] == "100x"
    assert len(load100["predicted_bottlenecks"]) == 3

def test_failure_injection_and_security_cost_simulation():
    engine = MultiDimensionalSimulatorsEngine()
    fail = engine.simulate_failure_injection_and_cascading("PostgreSQL-PaymentDB-Primary")
    assert fail["single_point_of_failure_detected"] is True
    assert len(fail["cascading_failure_path"]) == 4

    cost = engine.simulate_security_and_cost_impact("Cloud_Spanner_Migration")
    assert cost["finops_cost_simulation"]["current_monthly_tco"] == "$142,500"

def test_multidimensional_api_endpoints():
    res_load = client.post("/api/v1/simulation-v44/simulate/load", json={"multiplier": 10})
    assert res_load.status_code == 200
    assert res_load.json()["load_multiplier"] == "10x"

    res_fail = client.post("/api/v1/simulation-v44/simulate/failure", json={"component": "PostgreSQL-PaymentDB-Primary"})
    assert res_fail.status_code == 200
    assert res_fail.json()["single_point_of_failure_detected"] is True
