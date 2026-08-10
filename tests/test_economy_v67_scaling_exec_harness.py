"""
Tests for CodeAtlas v6.7 - Scaling Curves, Economic Digital Twin, Executive Dashboards & 10-Step Allocation Test
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.economy_v67.scaling_tradeoffs_economic_twin import ScalingTradeoffsEconomicTwinEngine
from app.economy_v67.governance_cfo_cto_views_test_harness import GovernanceCFOCTOViewsTestHarnessEngine, RoleViewType

client = TestClient(app)

def test_scaling_curves_economic_twin_and_10_step_allocation_test():
    scaling_engine = ScalingTradeoffsEconomicTwinEngine()
    
    curve = scaling_engine.simulate_traffic_scaling_cost_curve(42500.0, 1250.0)
    assert len(curve["scaling_cost_curve"]) == 4
    assert curve["scaling_cost_curve"][3]["traffic_scale"] == "10.0x"
    
    tradeoff = scaling_engine.evaluate_investment_tradeoff()
    assert "tradeoff_analysis" in tradeoff
    
    twin = scaling_engine.run_economic_digital_twin_monte_carlo(100, 42500.0)
    assert twin["iterations_run"] == 100
    assert "p99_monthly_cost_usd" in twin["confidence_intervals_95_pct"]
    
    exec_engine = GovernanceCFOCTOViewsTestHarnessEngine()
    cto_view = exec_engine.get_executive_economic_view(RoleViewType.CTO)
    assert cto_view["view"] == RoleViewType.CTO
    
    cfo_view = exec_engine.get_executive_economic_view(RoleViewType.CFO)
    assert cfo_view["monthly_cloud_infrastructure_cost_usd"] == 42500.0
    
    test10 = exec_engine.execute_10_step_final_economic_resource_allocation_test("Q4-2026")
    assert test10["steps_executed"] == 10
    assert test10["economic_test_verdict"] == "CODEATLAS_HELP_ENGINEERING_ORGANIZATIONS_ALLOCATE_SCARCE_RESOURCES_INTELLIGENTLY"
    
    readiness = exec_engine.audit_v67_engineering_economy_readiness()
    assert readiness["economy_decision"] == "CODEATLAS v6.7 AUTONOMOUS ENGINEERING ECONOMY READY"
    assert readiness["checks_passed"] == 20

def test_scaling_twin_exec_dashboard_api_endpoints():
    res_curve = client.get("/api/v1/economy-v67/scaling/cost-curve?baseline_cost=42500.0&baseline_rps=1250.0")
    assert res_curve.status_code == 200
    assert len(res_curve.json()["scaling_cost_curve"]) == 4

    res_tradeoff = client.post("/api/v1/economy-v67/tradeoff/evaluate", json={
        "target_investment": "DB Migration",
        "competing_initiative": "Checkout Feature"
    })
    assert res_tradeoff.status_code == 200
    assert "tradeoff_analysis" in res_tradeoff.json()

    res_mc = client.post("/api/v1/economy-v67/digital-twin/monte-carlo", json={
        "iterations": 100,
        "baseline_cost": 42500.0
    })
    assert res_mc.status_code == 200
    assert res_mc.json()["iterations_run"] == 100

    res_cto = client.get(f"/api/v1/economy-v67/dashboard/executive?role={RoleViewType.CTO}")
    assert res_cto.status_code == 200
    assert res_cto.json()["view"] == RoleViewType.CTO

    res_10 = client.post("/api/v1/economy-v67/test-harness/10-step-test", json={"quarter": "Q4-2026"})
    assert res_10.status_code == 200
    assert res_10.json()["steps_executed"] == 10

    res_ready = client.get("/api/v1/economy-v67/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["economy_decision"] == "CODEATLAS v6.7 AUTONOMOUS ENGINEERING ECONOMY READY"
