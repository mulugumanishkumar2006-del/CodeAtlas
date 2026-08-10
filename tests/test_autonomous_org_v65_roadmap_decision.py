"""
Tests for CodeAtlas v6.5 - Portfolio Simulation, Autonomous Roadmap, DX Friction, Role Intelligence & 19-Step Final Test
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.autonomous_org_v65.roadmap_simulation_replanning import RoadmapSimulationReplanningEngine, PortfolioStrategy
from app.autonomous_org_v65.role_intelligence_decision_center import RoleIntelligenceDecisionCenterEngine, RoleType

client = TestClient(app)

def test_roadmap_replanning_role_intelligence_and_19_step_test():
    roadmap_engine = RoadmapSimulationReplanningEngine()
    
    strat_sim = roadmap_engine.simulate_portfolio_strategy(PortfolioStrategy.BALANCED_STRATEGIC)
    assert strat_sim["evaluated_strategy"] == PortfolioStrategy.BALANCED_STRATEGIC
    
    rdmp = roadmap_engine.generate_autonomous_roadmap()
    assert len(rdmp["roadmap_phases"]) == 3
    
    replan = roadmap_engine.detect_plan_reality_gap_and_replan("Security Incident")
    assert replan["plan_divergence_detected"] is True
    
    role_engine = RoleIntelligenceDecisionCenterEngine()
    cto_intel = role_engine.get_role_aware_intelligence(RoleType.CTO)
    assert cto_intel["role"] == RoleType.CTO
    
    test19 = role_engine.execute_19_step_final_organizational_product_launch_test("Global Checkout v2 Platform")
    assert test19["steps_executed"] == 19
    assert test19["organizational_test_verdict"] == "CODEATLAS_IS_AN_ORGANIZATION_WIDE_ENGINEERING_INTELLIGENCE_SYSTEM"
    
    readiness = role_engine.audit_v65_autonomous_org_readiness()
    assert readiness["autonomous_org_decision"] == "CODEATLAS v6.5 AUTONOMOUS ENGINEERING ORGANIZATION READY"
    assert readiness["checks_passed"] == 18

def test_roadmap_and_role_intelligence_api_endpoints():
    res_strat = client.post("/api/v1/autonomous-org-v65/portfolio/simulate", json={"strategy": "BALANCED_STRATEGIC"})
    assert res_strat.status_code == 200
    assert res_strat.json()["evaluated_strategy"] == "BALANCED_STRATEGIC"

    res_rdmp = client.get("/api/v1/autonomous-org-v65/roadmap/generate")
    assert res_rdmp.status_code == 200
    assert len(res_rdmp.json()["roadmap_phases"]) == 3

    res_cto = client.get(f"/api/v1/autonomous-org-v65/role-intelligence?role={RoleType.CTO}")
    assert res_cto.status_code == 200
    assert res_cto.json()["role"] == RoleType.CTO

    res_19 = client.post("/api/v1/autonomous-org-v65/test-harness/19-step-test", json={"product_name": "Checkout v2"})
    assert res_19.status_code == 200
    assert res_19.json()["steps_executed"] == 19

    res_ready = client.get("/api/v1/autonomous-org-v65/readiness")
    assert res_ready.status_code == 200
    assert res_ready.json()["autonomous_org_decision"] == "CODEATLAS v6.5 AUTONOMOUS ENGINEERING ORGANIZATION READY"
