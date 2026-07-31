from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class EngineeringDecisionBase(BaseModel):
    title: str
    decision_type: str = "ARCHITECTURE"
    status: str = "ACCEPTED"
    context: Optional[str] = None
    decision: str
    consequences: Optional[str] = None
    alternatives_considered: List[str] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list)
    author: str = "Lead Architect"
    tags: List[str] = Field(default_factory=list)
    impact_score: float = 85.0
    confidence_score: float = 0.95
    health_status: str = "HEALTHY"


class EngineeringDecisionCreate(EngineeringDecisionBase):
    repository_id: str


class EngineeringDecisionResponse(EngineeringDecisionBase):
    id: str
    repository_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReasoningQueryRequest(BaseModel):
    repository_id: str
    query: str


class DecisionEvidence(BaseModel):
    source_type: str
    reference: str
    snippet: Optional[str] = None
    weight: float = 1.0


class ReasoningQueryResponse(BaseModel):
    repository_id: str
    query: str
    answer: str
    decision_id: Optional[str] = None
    decision_title: Optional[str] = None
    rationale: str
    historical_tradeoffs: List[str] = Field(default_factory=list)
    evidence: List[DecisionEvidence] = Field(default_factory=list)
    original_author: Optional[str] = None
    confidence_score: float = 0.95


class DecisionGraphNodeSchema(BaseModel):
    id: str
    label: str
    node_type: str
    properties: Dict[str, Any] = Field(default_factory=dict)


class DecisionGraphEdgeSchema(BaseModel):
    id: str
    source_id: str
    target_id: str
    relation_type: str
    weight: float = 1.0
    metadata: Dict[str, Any] = Field(default_factory=dict)


class DecisionGraphResponse(BaseModel):
    repository_id: str
    nodes: List[DecisionGraphNodeSchema] = Field(default_factory=list)
    edges: List[DecisionGraphEdgeSchema] = Field(default_factory=list)
    total_nodes: int = 0
    total_edges: int = 0


class DecisionTimelineEventResponse(BaseModel):
    id: str
    decision_id: str
    repository_id: str
    event_type: str
    description: str
    actor: str
    timestamp: datetime

    class Config:
        from_attributes = True


class CodeViolationItem(BaseModel):
    file_path: str
    line_number: Optional[int] = None
    violation_reason: str
    suggested_fix: Optional[str] = None


class DecisionValidationRequest(BaseModel):
    repository_id: str
    decision_id: Optional[str] = None


class DecisionValidationResponse(BaseModel):
    decision_id: str
    decision_title: str
    is_valid: bool
    drift_status: str
    explanation: str
    violations_found: List[CodeViolationItem] = Field(default_factory=list)
    last_validated_at: datetime


class FutureRecommendationResponse(BaseModel):
    id: str
    repository_id: str
    title: str
    recommendation: str
    impact: str
    rationale: str
    related_decision_ids: List[str] = Field(default_factory=list)
    created_at: datetime

    class Config:
        from_attributes = True


class ADRExportResponse(BaseModel):
    decision_id: str
    title: str
    madr_content: str
    filename: str


class EDIESummaryStats(BaseModel):
    repository_id: str
    total_decisions: int
    active_graph_nodes: int
    aligned_count: int
    drifted_count: int
    recommendations_count: int


# Knowledge Intelligence Additions (Features 6-20)


class ADRValidationReport(BaseModel):
    filename: str
    is_valid_format: bool
    missing_sections: List[str] = Field(default_factory=list)
    implementation_alignment: str
    suggestions: List[str] = Field(default_factory=list)


class EngineeringWikiResponse(BaseModel):
    repository_id: str
    title: str
    markdown_content: str
    sections: List[str] = Field(default_factory=list)
    total_decisions_indexed: int


class RepositoryHistorianNarrative(BaseModel):
    repository_id: str
    narrative_title: str
    executive_summary: str
    historical_milestones: List[Dict[str, Any]] = Field(default_factory=list)
    key_architects: List[str] = Field(default_factory=list)


class ArchitectureStoryResponse(BaseModel):
    repository_id: str
    title: str
    story_markdown: str
    key_turning_points: List[str] = Field(default_factory=list)


class EvolutionNarrativeEra(BaseModel):
    year_or_era: str
    architecture_state: str
    key_decisions: List[str] = Field(default_factory=list)
    impact_summary: str


class DesignPatternTrackItem(BaseModel):
    pattern_name: str
    category: str
    status: str
    introduced_in_decision: str
    file_locations_count: int


class FrameworkAdoptionItem(BaseModel):
    technology_or_framework: str
    category: str
    adopted_year: str
    status: str
    decision_title: str


class TechnologyLifecycleItem(BaseModel):
    technology_name: str
    lifecycle_stage: str
    health_score: float
    replacement_technology: Optional[str] = None


class KnowledgeGapItem(BaseModel):
    id: str
    gap_type: str
    title: str
    description: str
    severity: str
    affected_component: str
    suggested_action: str


# AI Reasoning Suite Additions (Features 21-40)


class AlternativeSolutionItem(BaseModel):
    name: str
    description: str
    pros: List[str]
    cons: List[str]
    fit_score: float


class TradeoffAnalysisItem(BaseModel):
    dimension: str
    chosen_option_score: float
    alternative_option_score: float
    analysis_notes: str


class DebateTurnItem(BaseModel):
    speaker: str
    speaker_title: str
    statement: str
    recommendation: str


class SolutionRankingItem(BaseModel):
    rank: int
    solution_name: str
    total_score: float
    recommended: bool


class AIReasoningSuiteResponse(BaseModel):
    repository_id: str
    decision_title: str
    alternative_solutions: List[AlternativeSolutionItem] = Field(default_factory=list)
    tradeoff_analysis: List[TradeoffAnalysisItem] = Field(default_factory=list)
    debate_simulation: List[DebateTurnItem] = Field(default_factory=list)
    future_predictions: List[str] = Field(default_factory=list)
    staff_engineer_review: str
    cto_opinion: str
    principal_engineer_feedback: str
    solution_rankings: List[SolutionRankingItem] = Field(default_factory=list)
    risk_assessment: Dict[str, Any] = Field(default_factory=dict)
    cost_analysis: Dict[str, Any] = Field(default_factory=dict)
    scalability_review: Dict[str, Any] = Field(default_factory=dict)
    security_review: Dict[str, Any] = Field(default_factory=dict)
    maintainability_review: Dict[str, Any] = Field(default_factory=dict)
    performance_review: Dict[str, Any] = Field(default_factory=dict)
    architecture_advisor_notes: str
    tech_debt_advisor_notes: str
    modernization_advisor_notes: str
    migration_advisor_steps: List[str] = Field(default_factory=list)
    generated_documentation: str
    executive_summary: str = ""


# Decision Evolution Additions (Features 41-60)


class EvolutionPlanItem(BaseModel):
    feature_id: int
    title: str
    category: str
    current_state: str
    target_state: str
    action_items: List[str] = Field(default_factory=list)


class DecisionEvolutionSuiteResponse(BaseModel):
    repository_id: str
    technology_replacements: List[EvolutionPlanItem] = Field(default_factory=list)
    dependency_replacements: List[EvolutionPlanItem] = Field(default_factory=list)
    deprecated_technology_alerts: List[Dict[str, Any]] = Field(default_factory=list)
    framework_upgrade_roadmap: List[Dict[str, Any]] = Field(default_factory=list)
    database_evolution_plan: List[Dict[str, Any]] = Field(default_factory=list)
    cloud_migration_decisions: List[Dict[str, Any]] = Field(default_factory=list)
    event_driven_adoption: List[Dict[str, Any]] = Field(default_factory=list)
    api_version_strategy: List[Dict[str, Any]] = Field(default_factory=list)
    architecture_style_evolution: List[Dict[str, Any]] = Field(default_factory=list)
    team_growth_recommendations: List[Dict[str, Any]] = Field(default_factory=list)
    org_impact_analysis: Dict[str, Any] = Field(default_factory=dict)
    business_capability_mapping: List[Dict[str, Any]] = Field(default_factory=list)
    compliance_decision_tracking: List[Dict[str, Any]] = Field(default_factory=list)
    security_policy_evolution: List[Dict[str, Any]] = Field(default_factory=list)
    sustainability_decisions: Dict[str, Any] = Field(default_factory=dict)
    cost_optimization_timeline: List[Dict[str, Any]] = Field(default_factory=list)
    observability_roadmap: List[Dict[str, Any]] = Field(default_factory=list)
    platform_engineering_plan: List[Dict[str, Any]] = Field(default_factory=list)
    developer_experience_evolution: Dict[str, Any] = Field(default_factory=dict)
    long_term_tech_strategy: List[Dict[str, Any]] = Field(default_factory=list)


# Executive Intelligence & Signature Feature Additions (Features 61-80)


class EngineeringBrainResponse(BaseModel):
    query: str
    decision_name: str
    reason: str
    chosen_by: str
    decision_date: str
    alternatives: List[str] = Field(default_factory=list)
    tradeoffs: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    current_status: str
    confidence_score: float
    future_recommendation: str


class ExecutiveIntelligenceSuiteResponse(BaseModel):
    repository_id: str

    # Feature 80 Signature Feature:
    engineering_brain: EngineeringBrainResponse  # F80 Signature

    # Features 61-79 fields:
    engineering_knowledge_score: float  # F61
    bus_factor_dashboard: Dict[str, Any] = Field(default_factory=dict)  # F62
    team_decision_heatmap: List[Dict[str, Any]] = Field(default_factory=list)  # F63
    strategic_decision_calendar: List[Dict[str, Any]] = Field(
        default_factory=list
    )  # F64
    executive_architecture_reports: List[Dict[str, Any]] = Field(
        default_factory=list
    )  # F65
    technology_investment_tracker: Dict[str, Any] = Field(default_factory=dict)  # F66
    engineering_kpi_dashboard: Dict[str, Any] = Field(default_factory=dict)  # F67
    innovation_score: float  # F68
    decision_risk_matrix: Dict[str, Any] = Field(default_factory=dict)  # F69
    tech_debt_investment_tracker: Dict[str, Any] = Field(default_factory=dict)  # F70
    architecture_governance_dashboard: Dict[str, Any] = Field(
        default_factory=dict
    )  # F71
    portfolio_insights: List[Dict[str, Any]] = Field(default_factory=list)  # F72
    cross_repo_decision_graph: Dict[str, Any] = Field(default_factory=dict)  # F73
    multi_team_alignment: List[Dict[str, Any]] = Field(default_factory=list)  # F74
    ai_executive_assistant_notes: str  # F75
    global_engineering_memory: Dict[str, Any] = Field(default_factory=dict)  # F76
    architecture_audit_reports: List[Dict[str, Any]] = Field(
        default_factory=list
    )  # F77
    decision_simulation_history: List[Dict[str, Any]] = Field(
        default_factory=list
    )  # F78
    knowledge_retention_analytics: Dict[str, Any] = Field(default_factory=dict)  # F79
