# apps/backend/app/api/v1/evolution_atlas_router.py

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.evolution_atlas import (
    AIStrategyReportResponse,
    ArchitectureRecommendationDashboardResponse,
    ContinuousLearningResponse,
    EngineeringIntelligenceDashboardResponse,
    EngineeringRadarResponse,
    EnterpriseReportResponse,
    PatternExplorerResponse,
    PluginMarketplaceResponse,
    RepositoryDNAComparisonResponse,
    SoftwareEvolutionAtlasResponse,
)
from app.services.evolution_atlas_service import EvolutionAtlasService

router = APIRouter(
    prefix="/atlas-command",
    tags=["evolution_atlas_command"],
)

atlas_service = EvolutionAtlasService()


@router.get("/pattern-explorer", response_model=PatternExplorerResponse)
def explore_patterns(
    query: Optional[str] = Query(None, description="Search pattern query"),
    db: Session = Depends(get_db),
) -> PatternExplorerResponse:
    """Feature 41: Interactive Pattern Explorer"""
    return atlas_service.explore_patterns(query, db)


@router.get(
    "/recommendations-dashboard",
    response_model=ArchitectureRecommendationDashboardResponse,
)
def get_recommendation_dashboard(
    db: Session = Depends(get_db),
) -> ArchitectureRecommendationDashboardResponse:
    """Feature 42: Architecture Recommendation Dashboard"""
    return atlas_service.get_recommendation_dashboard(db)


@router.get("/software-evolution-atlas", response_model=SoftwareEvolutionAtlasResponse)
def get_software_evolution_atlas(
    db: Session = Depends(get_db),
) -> SoftwareEvolutionAtlasResponse:
    """Feature 43: Software Evolution Atlas (🌟 WOW Feature)"""
    return atlas_service.get_software_evolution_atlas(db)


@router.get("/engineering-radar/{repo_id}", response_model=EngineeringRadarResponse)
def get_engineering_radar(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EngineeringRadarResponse:
    """Feature 44: Engineering Radar"""
    return atlas_service.get_engineering_radar(repo_id, db)


@router.post("/dna-comparison", response_model=RepositoryDNAComparisonResponse)
def compare_repository_dna(
    repo_a_id: str = Query("repo-a-main", description="First repository ID"),
    repo_b_id: str = Query("repo-b-target", description="Second repository ID"),
    db: Session = Depends(get_db),
) -> RepositoryDNAComparisonResponse:
    """Feature 45: Repository DNA Comparison"""
    return atlas_service.compare_repository_dna(repo_a_id, repo_b_id, db)


@router.get("/enterprise-reports", response_model=EnterpriseReportResponse)
def get_enterprise_reports(
    db: Session = Depends(get_db),
) -> EnterpriseReportResponse:
    """Feature 46: Enterprise Benchmark Reports"""
    return atlas_service.get_enterprise_reports(db)


@router.get("/ai-strategy-reports", response_model=AIStrategyReportResponse)
def get_ai_strategy_reports(
    db: Session = Depends(get_db),
) -> AIStrategyReportResponse:
    """Feature 47: AI Strategy Reports"""
    return atlas_service.get_ai_strategy_reports(db)


@router.post("/continuous-learning/trigger", response_model=ContinuousLearningResponse)
def trigger_continuous_learning(
    db: Session = Depends(get_db),
) -> ContinuousLearningResponse:
    """Feature 48: Continuous Learning Engine"""
    return atlas_service.trigger_continuous_learning(db)


@router.get("/plugin-marketplace", response_model=PluginMarketplaceResponse)
def get_plugin_marketplace(
    db: Session = Depends(get_db),
) -> PluginMarketplaceResponse:
    """Feature 49: Plugin Marketplace for Patterns"""
    return atlas_service.get_plugin_marketplace(db)


@router.get(
    "/intelligence-dashboard", response_model=EngineeringIntelligenceDashboardResponse
)
def get_intelligence_dashboard(
    db: Session = Depends(get_db),
) -> EngineeringIntelligenceDashboardResponse:
    """Feature 50: Engineering Intelligence Network Dashboard (⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 10-Star Command Center)"""
    return atlas_service.get_intelligence_dashboard(db)
