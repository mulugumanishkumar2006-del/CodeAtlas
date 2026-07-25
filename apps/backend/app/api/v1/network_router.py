# apps/backend/app/api/v1/network_router.py

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.intelligence_network.anti_pattern_detector import AntiPatternDetector
from app.intelligence_network.architecture_coach import AIArchitectureCoach
from app.intelligence_network.benchmark_suite import GlobalBenchmarkingSuite
from app.intelligence_network.network_graph import ArchitectureKnowledgeGraph
from app.intelligence_network.pattern_advisor import AIPatternAdvisor
from app.intelligence_network.pattern_extraction import PatternExtractionEngine
from app.intelligence_network.pattern_library import ArchitecturePatternLibrary
from app.intelligence_network.recommendation_engine import (
    GlobalPatternRecommendationEngine,
)
from app.intelligence_network.repo_intel_engine import RepositoryIntelligenceEngine
from app.intelligence_network.similarity_engine import RepositorySimilarityEngine
from app.intelligence_network.trend_detector import EngineeringTrendDetector

router = APIRouter(
    prefix="/network", tags=["Engineering Intelligence Network (The Software Internet)"]
)


@router.get("/global-benchmarks")
def run_global_benchmarks(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return GlobalBenchmarkingSuite().run_global_benchmarks(db)


@router.get("/trends")
def get_global_trends(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return EngineeringTrendDetector().get_global_trends(db)


@router.get("/anti-patterns")
def detect_anti_patterns(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return AntiPatternDetector().detect_anti_patterns(db)


@router.get("/architecture-coach")
def get_coach_guidance(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return AIArchitectureCoach().get_coach_guidance(db)


@router.get("/pattern-library")
def detect_patterns(db: Session = Depends(get_db)) -> Dict[str, Any]:
    return ArchitecturePatternLibrary().detect_patterns(db)


@router.get("/similar-repositories")
def find_similar_repositories(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return RepositorySimilarityEngine().find_similar_repositories(db)


@router.get("/pattern-advisor")
def get_pattern_recommendations(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return AIPatternAdvisor().get_pattern_recommendations(db)


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
