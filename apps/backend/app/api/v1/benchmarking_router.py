# apps/backend/app/api/v1/benchmarking_router.py


from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.benchmarking import (
    AIConfidenceRequest,
    AIConfidenceResponse,
    EngineeringMaturityResponse,
    EvolutionComparisonRequest,
    EvolutionComparisonResponse,
    IndustryRecommendationsResponse,
    ObservabilityBenchmarkResponse,
    ReleaseMaturityResponse,
    ReliabilityBenchmarkResponse,
    ScalabilityBenchmarkResponse,
    TeamWorkflowIntelligenceResponse,
    TechDebtBenchmarkResponse,
)
from app.services.benchmarking_service import BenchmarkingService

router = APIRouter(
    prefix="/benchmarking",
    tags=["maturity_benchmarking"],
)

benchmarking_service = BenchmarkingService()


@router.post("/evolution-compare", response_model=EvolutionComparisonResponse)
def compare_repository_evolution(
    payload: EvolutionComparisonRequest,
    db: Session = Depends(get_db),
) -> EvolutionComparisonResponse:
    """Feature 21: Repository Evolution Comparison"""
    return benchmarking_service.compare_repository_evolution(
        payload.base_repo_id, payload.target_repo_id, db
    )


@router.get("/team-workflow/{repo_id}", response_model=TeamWorkflowIntelligenceResponse)
def get_team_workflow_intelligence(
    repo_id: str,
    db: Session = Depends(get_db),
) -> TeamWorkflowIntelligenceResponse:
    """Feature 22: Team Workflow Intelligence"""
    return benchmarking_service.get_team_workflow_intelligence(repo_id, db)


@router.get(
    "/engineering-maturity/{repo_id}", response_model=EngineeringMaturityResponse
)
def assess_engineering_maturity(
    repo_id: str,
    db: Session = Depends(get_db),
) -> EngineeringMaturityResponse:
    """Feature 23: Engineering Maturity Model"""
    return benchmarking_service.assess_engineering_maturity(repo_id, db)


@router.get("/tech-debt/{repo_id}", response_model=TechDebtBenchmarkResponse)
def benchmark_tech_debt(
    repo_id: str,
    db: Session = Depends(get_db),
) -> TechDebtBenchmarkResponse:
    """Feature 24: Technical Debt Benchmarking"""
    return benchmarking_service.benchmark_tech_debt(repo_id, db)


@router.get("/scalability/{repo_id}", response_model=ScalabilityBenchmarkResponse)
def benchmark_scalability(
    repo_id: str,
    db: Session = Depends(get_db),
) -> ScalabilityBenchmarkResponse:
    """Feature 25: Scalability Benchmarking"""
    return benchmarking_service.benchmark_scalability(repo_id, db)


@router.get("/reliability/{repo_id}", response_model=ReliabilityBenchmarkResponse)
def benchmark_reliability(
    repo_id: str,
    db: Session = Depends(get_db),
) -> ReliabilityBenchmarkResponse:
    """Feature 26: Reliability Benchmarking"""
    return benchmarking_service.benchmark_reliability(repo_id, db)


@router.get("/observability/{repo_id}", response_model=ObservabilityBenchmarkResponse)
def benchmark_observability(
    repo_id: str,
    db: Session = Depends(get_db),
) -> ObservabilityBenchmarkResponse:
    """Feature 27: Observability Benchmarking"""
    return benchmarking_service.benchmark_observability(repo_id, db)


@router.get("/release-maturity/{repo_id}", response_model=ReleaseMaturityResponse)
def assess_release_maturity(
    repo_id: str,
    db: Session = Depends(get_db),
) -> ReleaseMaturityResponse:
    """Feature 28: Release Maturity Benchmarking"""
    return benchmarking_service.assess_release_maturity(repo_id, db)


@router.post("/ai-confidence", response_model=AIConfidenceResponse)
def calculate_ai_confidence(
    payload: AIConfidenceRequest,
    db: Session = Depends(get_db),
) -> AIConfidenceResponse:
    """Feature 29: AI Recommendation Confidence Engine"""
    return benchmarking_service.calculate_ai_confidence(payload, db)


@router.get("/industry-recommendations", response_model=IndustryRecommendationsResponse)
def get_industry_recommendations(
    industry: str = Query("Cloud-Native SaaS", description="Target industry vertical"),
    db: Session = Depends(get_db),
) -> IndustryRecommendationsResponse:
    """Feature 30: Industry-Specific Recommendations"""
    return benchmarking_service.get_industry_recommendations(industry, db)
