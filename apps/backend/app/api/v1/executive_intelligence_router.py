# apps/backend/app/api/v1/executive_intelligence_router.py

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.enterprise.executive_intelligence_engine import executive_intelligence_engine

router = APIRouter(prefix="/executive-intelligence", tags=["Executive Engineering Intelligence"])


# Pydantic Schemas
class WhatIfRequest(BaseModel):
    scenario: str = "DECOUPLE_ANALYTICS_DB"
    target_system: str = "payment-processing-core"

    model_config = ConfigDict(from_attributes=True)


class AIBriefingRequest(BaseModel):
    prompt: str

    model_config = ConfigDict(from_attributes=True)


# Router Endpoints
@router.get("/home")
def get_executive_home(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Executive Home primary overview payload."""
    return executive_intelligence_engine.get_executive_home()


@router.get("/health-dimensions")
def get_health_dimensions(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """9-dimensional Executive Engineering Health breakdown."""
    home = executive_intelligence_engine.get_executive_home()
    return home.get("health_dimensions", [])


@router.get("/signals")
def get_executive_signals(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """High-value executive signals and change detection feed."""
    home = executive_intelligence_engine.get_executive_home()
    return home.get("top_executive_signals", [])


@router.get("/risks")
def get_executive_risks(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Intelligent Risk Register prioritized for technical leadership."""
    return executive_intelligence_engine.get_risk_register()


@router.get("/risk-story/{risk_id}")
def get_executive_risk_story(risk_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Executive Risk Story: Summary → Explanation → Evidence → Technical Drill-down."""
    return executive_intelligence_engine.get_risk_story(risk_id=risk_id)


@router.get("/investments")
def get_engineering_investments(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Engineering activity vs actual outcome tracking."""
    return executive_intelligence_engine.get_investments()


@router.get("/predictive")
def get_predictive_horizons(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """30/60/90 day projected technical debt, architecture, and security risk timelines."""
    return executive_intelligence_engine.get_predictive_horizons()


@router.post("/what-if")
def run_what_if_simulation(
    req: WhatIfRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Executive scenario simulator connected to Simulation Studio."""
    return executive_intelligence_engine.run_what_if_simulation(scenario=req.scenario, target=req.target_system)


@router.post("/ai-briefing")
def query_ai_briefing(
    req: AIBriefingRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Conversational AI CTO Executive Briefing assistant."""
    return executive_intelligence_engine.query_ai_briefing(prompt=req.prompt)


@router.get("/decision-brief")
def get_decision_brief(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Auto-generated drillable AI Executive Decision Brief."""
    return executive_intelligence_engine.get_decision_brief()


@router.get("/alerts")
def get_executive_alerts(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Prioritized alert digest (Today, This Week, This Month)."""
    return executive_intelligence_engine.get_alerts_digest()


@router.get("/timeline")
def get_executive_timeline(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Organization-level engineering timeline."""
    return executive_intelligence_engine.get_executive_timeline()


@router.get("/portfolio")
def get_system_portfolio(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Portfolio matrix of systems and services."""
    return executive_intelligence_engine.get_system_portfolio()
