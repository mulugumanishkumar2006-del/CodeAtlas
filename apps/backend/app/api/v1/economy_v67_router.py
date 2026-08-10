"""
CodeAtlas v6.7 - Autonomous Engineering Economy API Router
Exposes endpoints for FinOps Anomalies, Unit Economics, Automation Payback, Tech Debt Liability, Build vs Buy, Traffic Scaling Curves, Investment Tradeoffs, Monte Carlo Economic Twin, Executive Dashboards, 10-Step Economic Test, and Readiness Audit.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.economy_v67.economic_model_finops_unit_econ import EconomicModelFinOpsUnitEconEngine
from app.economy_v67.debt_security_automation_roi import DebtSecurityAutomationROIEngine
from app.economy_v67.scaling_tradeoffs_economic_twin import ScalingTradeoffsEconomicTwinEngine
from app.economy_v67.governance_cfo_cto_views_test_harness import GovernanceCFOCTOViewsTestHarnessEngine, RoleViewType

router = APIRouter(prefix="/economy-v67", tags=["Autonomous Engineering Economy v6.7"])

economic_model = EconomicModelFinOpsUnitEconEngine()
debt_roi = DebtSecurityAutomationROIEngine()
scaling_twin = ScalingTradeoffsEconomicTwinEngine()
governance_exec = GovernanceCFOCTOViewsTestHarnessEngine()


# --- FinOps, Waste & Unit Economics ---

@router.get("/finops/anomalies")
def get_finops_anomalies():
    return economic_model.detect_cloud_cost_anomalies_and_waste()

@router.get("/unit-economics")
def get_unit_economics(service_id: str = Query("checkout-service")):
    return economic_model.calculate_unit_and_product_economics(service_id)


# --- Automation ROI, Tech Debt Liability & Build vs Buy ---

@router.post("/automation/payback")
def evaluate_automation_payback(
    name: str = Body("Automated Database Canary Migration & Verification"),
    cost_usd: float = Body(24000.0),
    hours_saved: float = Body(120.0),
    hourly_rate: float = Body(125.0)
):
    return debt_roi.evaluate_automation_payback_and_roi(name, cost_usd, hours_saved, hourly_rate)

@router.post("/tech-debt/liability")
def calculate_tech_debt_liability(
    debt_title: str = Body("Legacy Single-Region RDS Schema Monolith"),
    principal_cost: float = Body(45000.0)
):
    return debt_roi.calculate_technical_debt_economic_liability(debt_title, principal_cost)

@router.post("/build-vs-buy/evaluate")
def evaluate_build_vs_buy(
    capability: str = Body("Distributed Database Cluster Management"),
    build_option: str = Body("Self-Hosted PostgreSQL Cluster on EC2"),
    buy_option: str = Body("CockroachDB Dedicated Managed Cloud")
):
    return debt_roi.evaluate_build_vs_buy_economics(capability, build_option, buy_option)


# --- Scaling Curves, Investment Tradeoffs & Economic Twin ---

@router.get("/scaling/cost-curve")
def get_scaling_cost_curve(
    baseline_cost: float = Query(42500.0),
    baseline_rps: float = Query(1250.0)
):
    return scaling_twin.simulate_traffic_scaling_cost_curve(baseline_cost, baseline_rps)

@router.post("/tradeoff/evaluate")
def evaluate_tradeoff(
    target_investment: str = Body("CockroachDB Migration ($45,000)"),
    competing_initiative: str = Body("One-Click Checkout Feature ($30,000)")
):
    return scaling_twin.evaluate_investment_tradeoff(target_investment, competing_initiative)

@router.post("/digital-twin/monte-carlo")
def run_economic_digital_twin(
    iterations: int = Body(1000),
    baseline_cost: float = Body(42500.0)
):
    return scaling_twin.run_economic_digital_twin_monte_carlo(iterations, baseline_cost)


# --- Executive Dashboards, 10-Step Test & Readiness Audit ---

@router.get("/dashboard/executive")
def get_executive_dashboard(role: str = Query(RoleViewType.CTO)):
    return governance_exec.get_executive_economic_view(role)

@router.post("/test-harness/10-step-test")
def run_10_step_test(quarter: str = Body("Q4-2026", embed=True)):
    return governance_exec.execute_10_step_final_economic_resource_allocation_test(quarter)

@router.get("/readiness")
def get_economy_readiness():
    return governance_exec.audit_v67_engineering_economy_readiness()
