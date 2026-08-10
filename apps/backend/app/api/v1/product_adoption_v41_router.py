"""
CodeAtlas v4.1 - Product Adoption, DX & Market Readiness API Router
Exposes endpoints for Onboarding Progress, Role Dashboards, Explainable AI, Shared Investigations & Reports, Sandboxed Demo Workspace, Product Analytics & Market Readiness.
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional

from app.product_adoption_v41.onboarding_role_dashboards import OnboardingAndRoleDashboardEngine, UserRole
from app.product_adoption_v41.investigations_reports_sharing import InvestigationsReportsAndSharingEngine
from app.product_adoption_v41.notifications_demo_analytics import NotificationsDemoAndAnalyticsEngine

router = APIRouter(prefix="/product-adoption-v41", tags=["Product Adoption, DX & Market Readiness v4.1"])

onboarding_roles = OnboardingAndRoleDashboardEngine()
reports_sharing = InvestigationsReportsAndSharingEngine()
demo_analytics = NotificationsDemoAndAnalyticsEngine()


# --- Onboarding Progress & Role Dashboards ---

@router.get("/onboarding/progress")
def get_onboarding_progress(repository: str = Query("payment-service")):
    return onboarding_roles.get_analysis_stage_progress(repository)

@router.get("/role/dashboard")
def get_role_dashboard(role: str = Query("DEVELOPER")):
    return onboarding_roles.get_role_personalized_dashboard(role)


# --- Explainable AI, Investigations & Reports ---

@router.post("/ai/explain")
def explain_ai_finding(query: str = Body(..., embed=True)):
    return reports_sharing.get_explainable_ai_response(query)

@router.post("/investigation/create")
def create_investigation(
    title: str = Body(...),
    creator: str = Body(...),
    evidence: List[str] = Body(...)
):
    return reports_sharing.create_shared_investigation(title, creator, evidence)

@router.post("/reports/generate")
def generate_report(type: str = Body("TECHNICAL_ENGINEERING", embed=True), format: str = Body("MARKDOWN", embed=True)):
    return reports_sharing.generate_multi_format_report(type, format)


# --- Demo Workspace, Analytics & Market Readiness ---

@router.post("/demo/init")
def initialize_demo_workspace():
    return demo_analytics.initialize_sandboxed_demo_workspace()

@router.get("/analytics/activation")
def get_activation_analytics():
    return demo_analytics.get_product_analytics_and_activation()

@router.get("/market-readiness")
def get_market_readiness():
    return demo_analytics.audit_v41_market_readiness()
