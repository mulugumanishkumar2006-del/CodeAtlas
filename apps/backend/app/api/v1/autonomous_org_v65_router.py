"""
CodeAtlas v6.5 - Autonomous Engineering Organization API Router
Exposes endpoints for Hierarchy, Product-Engineering Graph, Portfolio & Prioritization, Capacity Forecasting, Portfolio Strategy Simulation, Autonomous Roadmap, Tech Debt & Reuse, Developer Friction, Role Intelligence, 19-Step Test, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.autonomous_org_v65.org_hierarchy_product_graph import OrgHierarchyProductGraphEngine
from app.autonomous_org_v65.portfolio_initiatives_capacity import PortfolioInitiativesCapacityEngine
from app.autonomous_org_v65.roadmap_simulation_replanning import RoadmapSimulationReplanningEngine, PortfolioStrategy
from app.autonomous_org_v65.role_intelligence_decision_center import RoleIntelligenceDecisionCenterEngine, RoleType

router = APIRouter(prefix="/autonomous-org-v65", tags=["Autonomous Engineering Organization v6.5"])

org_hierarchy = OrgHierarchyProductGraphEngine()
portfolio_capacity = PortfolioInitiativesCapacityEngine()
roadmap_replanning = RoadmapSimulationReplanningEngine()
role_decision = RoleIntelligenceDecisionCenterEngine()


# --- Hierarchy, Product Graph & Ownership ---

@router.get("/hierarchy")
def get_hierarchy():
    return org_hierarchy.get_engineering_hierarchy()

@router.get("/product-graph")
def get_product_graph(product_id: str = Query("prod_checkout_platform")):
    return org_hierarchy.get_product_engineering_graph(product_id)

@router.get("/ownership/health")
def get_ownership_health():
    return org_hierarchy.evaluate_ownership_health_and_bus_factor()


# --- Portfolio, Risk & Capacity ---

@router.get("/portfolio/unified")
def get_unified_portfolio():
    return portfolio_capacity.get_unified_portfolio_and_prioritization()

@router.get("/risk/portfolio")
def get_risk_portfolio():
    return portfolio_capacity.evaluate_engineering_risk_portfolio()

@router.get("/capacity/forecast")
def get_capacity_forecast():
    return portfolio_capacity.forecast_capacity_and_workload_breakdown()


# --- Roadmap Simulation & Replanning ---

@router.post("/portfolio/simulate")
def simulate_portfolio(strategy: str = Body(PortfolioStrategy.BALANCED_STRATEGIC, embed=True)):
    return roadmap_replanning.simulate_portfolio_strategy(strategy)

@router.get("/roadmap/generate")
def generate_roadmap():
    return roadmap_replanning.generate_autonomous_roadmap()

@router.post("/roadmap/replan")
def trigger_replan(event: str = Body("Unplanned Security Finding Severity 9.8", embed=True)):
    return roadmap_replanning.detect_plan_reality_gap_and_replan(event)

@router.get("/tech-debt/portfolio")
def get_tech_debt_and_reuse():
    return roadmap_replanning.evaluate_technical_debt_and_reuse()


# --- Role Intelligence, Decision Center & 19-Step Test ---

@router.get("/role-intelligence")
def get_role_intelligence(role: str = Query(RoleType.CTO)):
    return role_decision.get_role_aware_intelligence(role)

@router.get("/friction-map")
def get_friction_map():
    return role_decision.get_developer_experience_friction_map()

@router.post("/test-harness/19-step-test")
def run_19_step_test(product_name: str = Body("Global Checkout v2 Platform", embed=True)):
    return role_decision.execute_19_step_final_organizational_product_launch_test(product_name)

@router.get("/readiness")
def get_org_readiness():
    return role_decision.audit_v65_autonomous_org_readiness()
