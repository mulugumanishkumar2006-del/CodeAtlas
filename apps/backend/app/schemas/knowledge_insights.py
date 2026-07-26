# apps/backend/app/schemas/knowledge_insights.py

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# Feature 31: Knowledge Graph Explorer
class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # "repository", "module", "service", "author", "pattern"
    properties: Dict[str, Any]


class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str  # "DEPENDS_ON", "OWNS", "IMPLEMENTS", "USES_PATTERN"
    weight: float = 1.0


class KnowledgeGraphExplorerResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    total_nodes: int
    total_edges: int
    graph_density: float


# Feature 32: Technology Lifecycle Tracking
class TechRadarItem(BaseModel):
    name: str
    category: str  # "Languages", "Frameworks", "Databases", "Infrastructure"
    status: str  # "Adopt", "Trial", "Assess", "Hold"
    version: str
    adoption_ratio_pct: float
    deprecation_risk: str  # "Low", "Medium", "High"
    notes: str


class TechLifecycleResponse(BaseModel):
    technology_radar: List[TechRadarItem]
    total_tracked_technologies: int
    hold_count: int
    adopt_count: int


# Feature 33: Emerging Technology Alerts
class EmergingAlert(BaseModel):
    alert_id: str
    technology: str
    severity: str  # "Critical", "Warning", "Info"
    alert_type: str  # "Security CVE", "Breaking Deprecation", "Paradigm Shift"
    description: str
    recommended_action: str
    published_at: str


class EmergingTechAlertsResponse(BaseModel):
    alerts: List[EmergingAlert]
    unread_critical_count: int


# Feature 34: Architecture Success Stories
class SuccessStory(BaseModel):
    story_id: str
    title: str
    organization_tier: str
    initial_architecture: str
    target_architecture: str
    key_outcomes: List[str]
    latency_reduction_pct: float
    cost_savings_pct: float


class ArchitectureSuccessStoriesResponse(BaseModel):
    stories: List[SuccessStory]


# Feature 35: Engineering Case Studies
class CaseStudy(BaseModel):
    study_id: str
    title: str
    domain: str
    problem_statement: str
    solution_design: str
    before_metrics: Dict[str, Any]
    after_metrics: Dict[str, Any]
    lessons_learned: List[str]


class EngineeringCaseStudiesResponse(BaseModel):
    case_studies: List[CaseStudy]


# Feature 36: AI Learning Feedback Loop
class AIFeedbackRequest(BaseModel):
    recommendation_id: str
    rating: str  # "accepted", "rejected", "modified"
    user_feedback_notes: Optional[str] = None
    override_action_taken: Optional[str] = None


class AIFeedbackResponse(BaseModel):
    feedback_id: str
    status: str
    model_finetune_weight_adjusted: float
    message: str


# Feature 37: Pattern Confidence Scoring
class PatternConfidenceResponse(BaseModel):
    pattern_id: str
    pattern_name: str
    overall_confidence_score: float  # 0 to 100
    ast_structural_match_pct: float
    security_compliance_pct: float
    runtime_stability_pct: float
    verdict: str  # "HIGHLY_RECOMMENDED", "CONDITIONAL", "DEPRECATED"


# Feature 38: Historical Trend Visualization
class HistoricalMetricPoint(BaseModel):
    timestamp: str
    health_score: float
    code_lines: int
    test_coverage_pct: float
    tech_debt_hours: float
    commit_count: int


class HistoricalTrendsResponse(BaseModel):
    repo_id: str
    metric_points: List[HistoricalMetricPoint]
    net_tech_debt_reduction_pct: float
    coverage_growth_pct: float


# Feature 39: Recommendation Explanations
class XAIFactor(BaseModel):
    factor_name: str
    impact_score: float  # -1.0 to +1.0
    evidence: str


class RecommendationExplanationResponse(BaseModel):
    recommendation_id: str
    recommendation_title: str
    explainable_summary: str
    decision_factors: List[XAIFactor]
    ast_evidence_snippet: str
    alternative_options_evaluated: List[str]


# Feature 40: Cross-Domain Engineering Insights
class CrossDomainInsight(BaseModel):
    insight_id: str
    title: str
    impacted_domains: List[
        str
    ]  # e.g., ["Backend Microservice", "Postgres DB", "Next.js Frontend"]
    insight_description: str
    strategic_action: str


class CrossDomainInsightsResponse(BaseModel):
    insights: List[CrossDomainInsight]
    total_insights: int
