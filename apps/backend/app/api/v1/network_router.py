# apps/backend/app/api/v1/network_router.py

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.intelligence_network.network_graph import ArchitectureKnowledgeGraph
from app.intelligence_network.pattern_extraction import PatternExtractionEngine
from app.intelligence_network.recommendation_engine import (
    GlobalPatternRecommendationEngine,
)
from app.intelligence_network.repo_intel_engine import RepositoryIntelligenceEngine

router = APIRouter(
    prefix="/network", tags=["Engineering Intelligence Network (The Software Internet)"]
)


@router.get("/overview")
def get_network_overview(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return RepositoryIntelligenceEngine().get_network_overview(db)


@router.get("/patterns")
def extract_patterns(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return PatternExtractionEngine().extract_patterns(db)


@router.get("/graph")
def get_network_graph(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return ArchitectureKnowledgeGraph().get_network_graph(db)


@router.get("/global-recommendation")
def generate_global_recommendation(
    local_issue: str = Query(
        "DB lock contention on checkout", description="Local issue query"
    ),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    return GlobalPatternRecommendationEngine().generate_global_recommendation(
        db, local_issue
    )
