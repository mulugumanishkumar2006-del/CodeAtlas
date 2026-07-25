# apps/backend/app/api/v1/prediction_router.py

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.prediction_engine.architecture_forecast import ArchitectureForecastAI
from app.prediction_engine.growth_ai import GrowthAI
from app.prediction_engine.incident_ai import IncidentAI
from app.prediction_engine.tech_debt_ai import TechnicalDebtAI
from app.prediction_engine.timeline import FutureEngineeringTimeline

router = APIRouter(
    prefix="/prediction", tags=["Engineering Prediction Engine (Future Intelligence)"]
)


@router.get("/architecture-forecast")
def get_architecture_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return ArchitectureForecastAI().forecast_architecture(db)


@router.get("/tech-debt-forecast")
def get_tech_debt_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TechnicalDebtAI().forecast_tech_debt(db)


@router.get("/incident-risk-forecast")
def get_incident_risk_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return IncidentAI().forecast_incidents(db)


@router.get("/growth-forecast")
def get_growth_forecast(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GrowthAI().forecast_growth(db)


@router.get("/future-timeline")
def get_future_timeline(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return FutureEngineeringTimeline().generate_future_timeline(db)


@router.get("/rewrite-recommendations")
def get_rewrite_recommendations(db: Session = Depends(get_db)) -> Dict[str, Any]:
    debt_data = TechnicalDebtAI().forecast_tech_debt(db)
    return {"rewrite_recommendations": debt_data.get("rewrite_advisor", [])}
