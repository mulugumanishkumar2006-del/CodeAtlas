# apps/backend/app/api/v1/memory_router.py

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.memory_engine.decision_logger import ADRManager
from app.memory_engine.historian_engine import AIEngineeringHistorian
from app.memory_engine.historical_context import HistoricalContextRecall
from app.memory_engine.incident_memory import IncidentMemoryEngine
from app.memory_engine.meeting_intelligence import MeetingIntelligenceEngine
from app.memory_engine.memory_engine import AIMemoryEngine
from app.memory_engine.memory_graph import EngineeringMemoryGraph
from app.memory_engine.onboarding_memory import DeveloperOnboardingAI
from app.memory_engine.pr_intelligence import PRIntelligenceEngine

router = APIRouter(
    prefix="/memory", tags=["Engineering Memory Graph (The Engineering Brain)"]
)


@router.get("/graph-snapshot")
def get_graph_snapshot(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return EngineeringMemoryGraph().get_memory_graph_topology(db)


@router.get("/query")
def query_memory(
    q: str = Query(..., description="Ask the Engineering Brain a question"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return AIMemoryEngine().query_engineering_memory(db, q)


@router.get("/adrs")
def get_adrs(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return ADRManager().list_architecture_decisions(db)


@router.get("/historical-recall")
def get_historical_recall(
    topic: str = "performance", db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return HistoricalContextRecall().recall_historical_context(db, topic)


@router.get("/pr-intelligence")
def get_pr_intelligence(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return PRIntelligenceEngine().get_pr_intelligence(db)


@router.get("/incident-memory")
def get_incident_memory(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return IncidentMemoryEngine().get_incident_memory(db)


@router.get("/meeting-intelligence")
def get_meeting_intelligence(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return MeetingIntelligenceEngine().get_meeting_intelligence(db)


@router.get("/engineering-historian")
def explain_subsystem_history(
    subsystem: str = "Auth", db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return AIEngineeringHistorian().explain_subsystem_history(db, subsystem)


@router.get("/system-story")
def generate_system_story(
    system_name: str = "CodeAtlas Core", db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return AIEngineeringHistorian().generate_system_story(db, system_name)


@router.get("/developer-onboarding")
def get_onboarding_guide(
    role: str = "Backend Engineer", db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return DeveloperOnboardingAI().get_onboarding_guide(db, role)
