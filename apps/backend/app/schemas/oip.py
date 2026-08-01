from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class OrganizationCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    total_repositories: Optional[int] = 0
    total_teams: Optional[int] = 0
    total_engineers: Optional[int] = 0
    strategic_goals: Optional[List[str]] = None


class OrganizationResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    total_repositories: int
    total_teams: int
    total_engineers: int
    overall_health_score: float
    modernization_index: float
    bottleneck_risk_score: float
    knowledge_silo_risk: float
    strategic_goals: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TeamCreate(BaseModel):
    organization_id: str
    name: str
    lead_name: Optional[str] = "Engineering Lead"
    team_type: Optional[str] = "Product Engineering"
    headcount: Optional[int] = 8
    owned_services: Optional[List[str]] = None
    key_members: Optional[List[str]] = None


class TeamResponse(BaseModel):
    id: str
    organization_id: str
    name: str
    lead_name: str
    team_type: str
    headcount: int
    velocity_pts: float
    workload_score: float
    burnout_risk_score: float
    cognitive_load_score: float
    owned_repos_count: int
    open_prs_count: int
    tech_debt_contribution_pct: float
    key_members: List[str]
    owned_services: List[str]

    class Config:
        from_attributes = True


class RepositoryIntelligenceSchema(BaseModel):
    id: str
    organization_id: str
    repository_id: str
    repository_name: str
    modernization_urgency: float
    maintenance_impossibility_index: float
    codebase_health_score: float
    code_churn_rate: float
    bus_factor: int
    duplicate_code_ratio: float
    complexity_tier: str
    primary_language: str
    assigned_team: str
    tech_stack: List[str]
    risk_factors: List[str]

    class Config:
        from_attributes = True


class KnowledgeSiloSchema(BaseModel):
    id: str
    organization_id: str
    service_or_repo: str
    silo_risk_level: str
    silo_score: float
    bus_factor: int
    onboarding_friction_score: float
    documentation_coverage: float
    key_knowledge_holders: List[str]
    siloed_topics: List[str]
    mitigation_steps: List[str]

    class Config:
        from_attributes = True


class BusinessCriticalitySchema(BaseModel):
    id: str
    organization_id: str
    service_name: str
    revenue_impact_tier: str
    sla_tier: str
    business_criticality_score: float
    failure_blast_radius: float
    customer_dependency_count: int
    is_duplicate_work_risk: bool
    duplicate_candidates: List[str]
    owning_team: str

    class Config:
        from_attributes = True


class StrategicRecommendationSchema(BaseModel):
    id: str
    organization_id: str
    title: str
    target_entity: str
    action_type: str
    priority: str
    impact_score: float
    urgency_score: float
    summary: str
    justification: Optional[str] = None
    execution_steps: List[str]
    expected_roi: str
    created_at: datetime

    class Config:
        from_attributes = True


class ExecutiveDashboardMetricsSchema(BaseModel):
    organization_name: str
    total_repos_analyzed: int
    total_teams_tracked: int
    total_engineers_tracked: int
    overloaded_teams_count: int
    at_risk_projects_count: int
    knowledge_silos_count: int
    modernization_needed_repos_count: int
    critical_business_services_count: int
    org_health_score: float
    org_modernization_score: float
    org_bottleneck_risk: float
    top_risk_factors: List[str]
    recent_recommendations: List[StrategicRecommendationSchema]


class StrategyEngineRequest(BaseModel):
    organization_id: str
    strategic_priorities: Optional[List[str]] = Field(
        default_factory=lambda: [
            "Reduce Tech Debt",
            "Eliminate Knowledge Silos",
            "Modernize Legacy Repos",
        ]
    )
    max_recommendations: Optional[int] = 5


class StrategyEngineResponse(BaseModel):
    organization_id: str
    generated_at: datetime
    total_recommendations: int
    strategic_roadmap: List[StrategicRecommendationSchema]
    overall_projected_impact: str


class MaturityScoreSchema(BaseModel):
    id: str
    organization_id: str
    overall_score: float
    architecture_score: float
    devops_score: float
    security_score: float
    testing_score: float
    ai_adoption_score: float
    documentation_score: float
    reliability_score: float
    updated_at: datetime

    class Config:
        from_attributes = True


class OrgGraphNodeSchema(BaseModel):
    id: str
    label: str
    tier: str  # ORGANIZATION, DEPARTMENT, TEAM, REPOSITORY, SERVICE, MODULE, FILE, FUNCTION
    health_score: Optional[float] = 85.0
    risk_level: Optional[str] = "LOW"
    metadata: Optional[Dict[str, Any]] = None


class OrgGraphEdgeSchema(BaseModel):
    source: str
    target: str
    relationship_type: str  # CONTAINS, OWNS, DEPENDS_ON, CALLS


class OrgGraphResponseSchema(BaseModel):
    organization_id: str
    total_nodes: int
    total_edges: int
    tier_counts: Dict[str, int]
    nodes: List[OrgGraphNodeSchema]
    edges: List[OrgGraphEdgeSchema]


class TeamDeepAnalyticsSchema(BaseModel):
    id: str
    organization_id: str
    team_name: str
    collaboration_index: float
    review_latency_hours: float
    review_participation_rate: float
    onboarding_complexity_days: float
    capacity_utilization_pct: float
    documentation_velocity_score: float
    code_ownership_map: Dict[str, Any]
    skill_distribution: Dict[str, Any]
    cross_team_dependencies: List[Dict[str, Any]]
    updated_at: datetime

    class Config:
        from_attributes = True


class PortfolioDeepAnalyticsSchema(BaseModel):
    id: str
    organization_id: str
    repository_id: str
    repository_name: str
    repo_health_rank: int
    tech_debt_score: float
    is_duplicate_repo: bool
    is_legacy: bool
    legacy_reason: Optional[str] = None
    modernization_candidate_score: float
    lifecycle_stage: str
    build_reliability_pct: float
    release_frequency_per_month: float
    security_posture_score: float
    documentation_completeness_score: float
    risk_heatmap_score: float
    portfolio_health_score: float
    dependency_sharing_map: Dict[str, Any]
    shared_library_usage: List[str]
    tech_stack_inventory: List[str]
    framework_usage: Dict[str, Any]
    language_distribution: Dict[str, Any]
    infrastructure_inventory: List[str]
    updated_at: datetime

    class Config:
        from_attributes = True


class KnowledgeDeepAnalyticsSchema(BaseModel):
    id: str
    organization_id: str
    org_knowledge_graph_size: int
    knowledge_concentration_index: float
    documentation_coverage_pct: float
    adr_coverage_pct: float
    doc_freshness_score: float
    org_memory_score: float
    onboarding_difficulty_score: float
    wiki_health_score: float
    knowledge_risk_trend_pct: float
    organization_learning_score: float
    knowledge_transfer_recommendations: List[Dict[str, Any]]
    expert_discovery_map: Dict[str, Any]
    knowledge_gap_predictions: List[Dict[str, Any]]
    critical_knowledge_alerts: List[Dict[str, Any]]
    engineering_glossary: Dict[str, str]
    semantic_doc_graph_nodes: List[Dict[str, Any]]
    updated_at: datetime

    class Config:
        from_attributes = True


class ExecutiveDeepAnalyticsSchema(BaseModel):
    id: str
    organization_id: str
    deployment_frequency_per_day: float
    lead_time_hours: float
    change_failure_rate_pct: float
    mttr_hours: float
    cost_of_tech_debt_usd: float
    engineering_roi_pct: float
    team_productivity_index: float
    delivery_forecasting_confidence_pct: float
    innovation_index: float
    ai_adoption_pct: float
    strategic_modernization_progress_pct: float
    business_capability_alignment_score: float
    dora_tier: str
    executive_ai_briefing: Optional[str] = None
    cto_dashboard_metrics: Dict[str, Any]
    vp_eng_dashboard_metrics: Dict[str, Any]
    portfolio_risk_matrix: Dict[str, Any]
    updated_at: datetime

    class Config:
        from_attributes = True


class EngineeringEarthNodeSchema(BaseModel):
    id: str
    team_name: str
    domain_category: str
    health_status: str  # OPTIMAL, WARNING, CRITICAL
    health_score: float
    architecture_maturity: float
    tech_debt_score: float
    knowledge_risk: str
    deployment_health: float
    documentation_score: float
    active_engineers: int
    owned_repos_count: int
    ai_recommendations: List[str]


class AIOrgIntelligenceSchema(BaseModel):
    id: str
    organization_id: str
    ai_advisor_confidence_pct: float
    compliance_score_pct: float
    scaling_headcount_capacity: int
    repo_consolidation_opportunity_count: int
    engineering_earth_active_nodes: int
    ai_org_advisor_recommendations: List[Dict[str, Any]]
    ai_cto_assistant_insights: Dict[str, Any]
    ai_vp_eng_assistant_insights: Dict[str, Any]
    ai_hiring_recommendations: List[Dict[str, Any]]
    ai_team_scaling_simulator: Dict[str, Any]
    ai_compliance_status: Dict[str, Any]
    engineering_earth_nodes: List[EngineeringEarthNodeSchema]
    ai_executive_chat_history: List[Dict[str, Any]]
    updated_at: datetime

    class Config:
        from_attributes = True
