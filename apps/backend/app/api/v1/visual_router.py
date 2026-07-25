# apps/backend/app/api/v1/visual_router.py

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.visual_engine.ai_debate_theater import AIDebateTheaterEngine
from app.visual_engine.gamification_engine import GamificationEngine
from app.visual_engine.rocket_launch_simulator import RocketLaunchSimulator
from app.visual_engine.software_universe_builder import SoftwareUniverseBuilder
from app.visual_engine.tech_debt_weather import TechDebtWeatherEngine

router = APIRouter(prefix="/visual", tags=["Visual & Interactive Experience"])


class CapacitySimulateRequest(BaseModel):
    target_users_scale: Optional[str] = "10M"

    model_config = ConfigDict(from_attributes=True)


class WhatIfSimulateRequest(BaseModel):
    source_module: str
    target_subsystem: str

    model_config = ConfigDict(from_attributes=True)


@router.get("/universe")
def get_software_universe(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return SoftwareUniverseBuilder().build_software_universe(db)


@router.get("/city")
def get_software_city(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return SoftwareUniverseBuilder().build_software_city(db)


@router.get("/orbit")
def get_repository_orbit(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return SoftwareUniverseBuilder().build_repository_orbit(db)


@router.get("/weather")
def get_tech_debt_weather(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TechDebtWeatherEngine().get_weather_forecast(db)


@router.get("/heartbeat")
def get_service_heartbeats(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TechDebtWeatherEngine().get_service_heartbeats(db)


@router.get("/mission-control")
def get_mission_control(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return TechDebtWeatherEngine().get_mission_control_data(db)


@router.post("/simulate-scaling", status_code=status.HTTP_200_OK)
def simulate_rocket_launch(
    req: CapacitySimulateRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return RocketLaunchSimulator().simulate_capacity_launch(db, req.target_users_scale)


@router.get("/time-portal")
def get_time_portal(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return RocketLaunchSimulator().get_time_portal_frames(db)


@router.post("/what-if", status_code=status.HTTP_200_OK)
def simulate_what_if(
    req: WhatIfSimulateRequest, db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return RocketLaunchSimulator().simulate_what_if_refactoring(
        db, req.source_module, req.target_subsystem
    )


@router.get("/debate")
def get_ai_debate(
    topic: Optional[str] = Query(
        "Split Payments Microservice", description="Debate topic"
    ),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return AIDebateTheaterEngine().get_debate_stream(db, topic)


@router.get("/mentor")
def get_ai_mentor_lesson(
    topic: Optional[str] = Query("Circular Dependencies", description="Lesson topic"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return AIDebateTheaterEngine().get_ai_mentor_lesson(db, topic)


@router.get("/mission-game")
def get_mission_mode(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GamificationEngine().get_mission_mode_status(db)


@router.get("/achievements")
def get_achievements(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GamificationEngine().get_achievements(db)


@router.get("/code-dna")
def get_code_dna(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GamificationEngine().get_code_dna(db)


@router.get("/life-score")
def get_life_score(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GamificationEngine().get_repository_life_score(db)


@router.get("/metaverse")
def get_metaverse_session(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GamificationEngine().get_metaverse_session(db)
