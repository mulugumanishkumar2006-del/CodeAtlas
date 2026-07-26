# apps/backend/app/api/v1/knowledge_insights_router.py


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.knowledge_insights import (
    AIFeedbackRequest,
    AIFeedbackResponse,
    ArchitectureSuccessStoriesResponse,
    CrossDomainInsightsResponse,
    EmergingTechAlertsResponse,
    EngineeringCaseStudiesResponse,
    HistoricalTrendsResponse,
    KnowledgeGraphExplorerResponse,
    PatternConfidenceResponse,
    RecommendationExplanationResponse,
    TechLifecycleResponse,
)
from app.services.knowledge_insights_service import KnowledgeInsightsService

router = APIRouter(
    prefix="/knowledge-insights",
    tags=["knowledge_insights"],
)

knowledge_insights_service = KnowledgeInsightsService()


@router.get("/graph-explorer", response_model=KnowledgeGraphExplorerResponse)
def get_knowledge_graph(
    db: Session = Depends(get_db),
) -> KnowledgeGraphExplorerResponse:
    """Feature 31: Knowledge Graph Explorer"""
    return knowledge_insights_service.get_knowledge_graph(db)


@router.get("/tech-lifecycle", response_model=TechLifecycleResponse)
def get_tech_lifecycle(
    db: Session = Depends(get_db),
) -> TechLifecycleResponse:
    """Feature 32: Technology Lifecycle Tracking"""
    return knowledge_insights_service.get_tech_lifecycle(db)


@router.get("/emerging-alerts", response_model=EmergingTechAlertsResponse)
def get_emerging_alerts(
    db: Session = Depends(get_db),
) -> EmergingTechAlertsResponse:
    """Feature 33: Emerging Technology Alerts"""
    return knowledge_insights_service.get_emerging_alerts(db)


@router.get("/success-stories", response_model=ArchitectureSuccessStoriesResponse)
def get_success_stories(
    db: Session = Depends(get_db),
) -> ArchitectureSuccessStoriesResponse:
    """Feature 34: Architecture Success Stories"""
    return knowledge_insights_service.get_success_stories(db)


@router.get("/case-studies", response_model=EngineeringCaseStudiesResponse)
def get_case_studies(
    db: Session = Depends(get_db),
) -> EngineeringCaseStudiesResponse:
    """Feature 35: Engineering Case Studies"""
    return knowledge_insights_service.get_case_studies(db)


@router.post("/learning-feedback", response_model=AIFeedbackResponse)
def process_ai_feedback(
    payload: AIFeedbackRequest,
    db: Session = Depends(get_db),
) -> AIFeedbackResponse:
    """Feature 36: AI Learning Feedback Loop"""
    return knowledge_insights_service.process_ai_feedback(payload, db)


@router.get(
    "/pattern-confidence/{pattern_id}", response_model=PatternConfidenceResponse
)
def calculate_pattern_confidence(
    pattern_id: str,
    db: Session = Depends(get_db),
) -> PatternConfidenceResponse:
    """Feature 37: Pattern Confidence Scoring"""
    return knowledge_insights_service.calculate_pattern_confidence(pattern_id, db)


@router.get("/historical-trends/{repo_id}", response_model=HistoricalTrendsResponse)
def get_historical_trends(
    repo_id: str,
    db: Session = Depends(get_db),
) -> HistoricalTrendsResponse:
    """Feature 38: Historical Trend Visualization"""
    return knowledge_insights_service.get_historical_trends(repo_id, db)


@router.get(
    "/explain-recommendation/{rec_id}", response_model=RecommendationExplanationResponse
)
def explain_recommendation(
    rec_id: str,
    db: Session = Depends(get_db),
) -> RecommendationExplanationResponse:
    """Feature 39: Recommendation Explanations"""
    return knowledge_insights_service.explain_recommendation(rec_id, db)


@router.get("/cross-domain-insights", response_model=CrossDomainInsightsResponse)
def get_cross_domain_insights(
    db: Session = Depends(get_db),
) -> CrossDomainInsightsResponse:
    """Feature 40: Cross-Domain Engineering Insights"""
    return knowledge_insights_service.get_cross_domain_insights(db)
