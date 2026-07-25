# apps/backend/app/api/v1/memory_router.py

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.memory_engine.decision_logger import ADRManager
from app.memory_engine.historical_context import HistoricalContextRecall
from app.memory_engine.memory_engine import AIMemoryEngine
from app.memory_engine.memory_graph import EngineeringMemoryGraph

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
