from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class CAEEAnalysisRequest(BaseModel):
    repository_id: str
    target_horizon_years: int = 3  # 1, 3, or 5 years


class ArchitectureGapSchema(BaseModel):
    id: str
    gap_title: str
    category: str
    severity: str
    description: Optional[str] = None
    impacted_components: List[str] = []


class MigrationStepSchema(BaseModel):
    id: str
    phase_name: str
    action_item: str
    horizon: str
    estimated_effort_person_days: float
    risk_level: str
    status: str


class TimelineMilestoneSchema(BaseModel):
    id: str
    quarter: str
    milestone_title: str
    target_architecture_pattern: str
    coupling_target: float
    is_completed: bool


class CAEESessionResponse(BaseModel):
    id: str
    repository_id: str
    overall_evolution_score: float
    architecture_stability_index: float
    current_coupling_coefficient: float
    target_coupling_coefficient: float
    current_state_summary: Optional[str] = None
    target_vision_1y: Dict[str, Any] = {}
    target_vision_3y: Dict[str, Any] = {}
    target_vision_5y: Dict[str, Any] = {}
    gaps: List[ArchitectureGapSchema] = []
    migration_steps: List[MigrationStepSchema] = []
    timeline: List[TimelineMilestoneSchema] = []


class TargetArchitectureVisionResponse(BaseModel):
    repository_id: str
    vision_1y: Dict[str, Any]
    vision_3y: Dict[str, Any]
    vision_5y: Dict[str, Any]


class ArchitectureGapAnalysisResponse(BaseModel):
    repository_id: str
    total_gaps_found: int
    critical_gaps_count: int
    gaps: List[ArchitectureGapSchema]


class MigrationPlanResponse(BaseModel):
    repository_id: str
    total_person_days: float
    phases: List[MigrationStepSchema]


class EvolutionRiskAnalysisResponse(BaseModel):
    repository_id: str
    overall_risk_level: str
    blast_radius_score: float
    business_continuity_risk: str
    risk_mitigation_strategies: List[str]


class ArchitectureEvolutionTimelineResponse(BaseModel):
    repository_id: str
    milestones: List[TimelineMilestoneSchema]


class ContinuousMonitoringStatusResponse(BaseModel):
    repository_id: str
    monitoring_status: str
    compliance_score: float
    drift_violations_count: int
    active_rules: List[str]


class CAEEControlCenterResponse(BaseModel):
    repository_id: str
    overall_evolution_score: float
    architecture_stability_index: float
    horizon_projections: Dict[str, Any]
    active_gaps_count: int
    next_migration_phase: str
    status: str


class ArchitectureIntelligenceResponse(BaseModel):
    repository_id: str
    evolution_roadmap: Dict[str, Any]  # Feature 1 (6 Months, 1 Year, 3 Years, 5 Years)
    target_architecture_progression: List[
        Dict[str, Any]
    ]  # Feature 2 (Modular Monolith -> Microservices -> Event Driven -> AI Native Platform)
    maturity_score: Dict[
        str, Any
    ]  # Feature 3 (0-100 across Scalability, Maintainability, Reliability, Observability, Security, Cloud Readiness)
    drift_timeline: Dict[
        str, Any
    ]  # Feature 4 (Monthly drift, Quarterly drift, Yearly drift)
    future_forecast: Dict[str, Any]  # Feature 5 (1 Year, 3 Years, 5 Years)


class ServiceEvolutionResponse(BaseModel):
    repository_id: str
    microservice_readiness: Dict[
        str, Any
    ]  # Feature 6 (Keep Monolith / Modular Monolith / Microservices)
    service_split_planner: Dict[
        str, Any
    ]  # Feature 7 (Which services, Split order, Risks, Cost)
    dependency_evolution: Dict[str, Any]  # Feature 8 (Predict future dependency growth)
    domain_boundary_validator: Dict[str, Any]  # Feature 9 (Verify DDD boundaries)
    event_driven_migration_planner: Dict[
        str, Any
    ]  # Feature 10 (Generate migration roadmap)


class TechnicalDebtEvolutionResponse(BaseModel):
    repository_id: str
    debt_trend_forecasting: Dict[str, Any]  # Feature 11
    legacy_modernization_planner: Dict[str, Any]  # Feature 12
    architecture_violation_detector: List[Dict[str, Any]]  # Feature 13
    layer_separation_validator: Dict[str, Any]  # Feature 14
    module_health_trends: Dict[str, Any]  # Feature 15
    coupling_evolution: Dict[str, Any]  # Feature 16
    cohesion_evolution: Dict[str, Any]  # Feature 17
    package_optimization_planner: Dict[str, Any]  # Feature 18
    architecture_cleanup_planner: List[Dict[str, Any]]  # Feature 19
    repository_modularization: Dict[str, Any]  # Feature 20
    shared_library_extraction: List[Dict[str, Any]]  # Feature 21
    api_gateway_recommendation: Dict[str, Any]  # Feature 22
    bounded_context_analyzer: Dict[str, Any]  # Feature 23
    domain_model_optimizer: Dict[str, Any]  # Feature 24
    dependency_reduction_planner: Dict[str, Any]  # Feature 25


class CloudInfrastructureEvolutionResponse(BaseModel):
    repository_id: str
    kubernetes_readiness: Dict[str, Any]  # Feature 26
    serverless_recommendation: Dict[str, Any]  # Feature 27
    cloud_native_maturity: Dict[str, Any]  # Feature 28
    multi_region_planning: Dict[str, Any]  # Feature 29
    disaster_recovery_architecture: Dict[str, Any]  # Feature 30
    high_availability_planner: Dict[str, Any]  # Feature 31
    autoscaling_architecture: Dict[str, Any]  # Feature 32
    cdn_optimization: Dict[str, Any]  # Feature 33
    edge_computing_recommendation: Dict[str, Any]  # Feature 34
    storage_evolution: Dict[str, Any]  # Feature 35
    infrastructure_modernization: Dict[str, Any]  # Feature 36
    cloud_cost_evolution: Dict[str, Any]  # Feature 37
    platform_engineering_roadmap: List[Dict[str, Any]]  # Feature 38
    infrastructure_as_code_maturity: Dict[str, Any]  # Feature 39
    observability_architecture_planner: Dict[str, Any]  # Feature 40


class AIEngineeringIntelligenceResponse(BaseModel):
    repository_id: str
    ai_cto_recommendations: List[str]  # Feature 41
    ai_staff_engineer_review: Dict[str, Any]  # Feature 42
    ai_architecture_debate: Dict[str, Any]  # Feature 43
    ai_migration_planner: Dict[str, Any]  # Feature 44
    ai_modernization_advisor: Dict[str, Any]  # Feature 45
    ai_cost_optimizer: Dict[str, Any]  # Feature 46
    ai_scalability_advisor: Dict[str, Any]  # Feature 47
    ai_reliability_planner: Dict[str, Any]  # Feature 48
    ai_engineering_mentor: Dict[str, Any]  # Feature 49
    ai_technology_roadmap: List[Dict[str, Any]]  # Feature 50
    ai_architecture_memory: Dict[str, Any]  # Feature 51
    ai_tradeoff_analyzer: Dict[str, Any]  # Feature 52
    ai_governance_recommendations: List[str]  # Feature 53


class ExecutiveIntelligenceResponse(BaseModel):
    repository_id: str
    executive_architecture_dashboard: Dict[str, Any]  # Feature 56
    architecture_investment_roi: Dict[str, Any]  # Feature 57
    engineering_capability_score: Dict[str, Any]  # Feature 58
    team_maturity_assessment: Dict[str, Any]  # Feature 59
    modernization_timeline: List[Dict[str, Any]]  # Feature 60
    architecture_kpi_tracking: Dict[str, Any]  # Feature 61
    strategic_dependency_analysis: Dict[str, Any]  # Feature 62
    executive_reports: List[Dict[str, Any]]  # Feature 63
    business_capability_mapping: Dict[str, Any]  # Feature 64
    engineering_okr_alignment: List[Dict[str, Any]]  # Feature 65
    architecture_change_calendar: List[Dict[str, Any]]  # Feature 66
    compliance_evolution: Dict[str, Any]  # Feature 67
    sustainability_score: Dict[str, Any]  # Feature 68
    portfolio_wide_architecture_health: Dict[str, Any]  # Feature 69
    global_evolution_command_center: Dict[str, Any]  # Feature 70


class ArchitectureTimeNavigatorResponse(BaseModel):
    repository_id: str
    selected_timeframe: str  # Today, +1 Year, +3 Years, +5 Years
    visual_transformation: Dict[
        str, Any
    ]  # Services split, Dependencies shrink, Technical debt reduce, Performance improve, Infrastructure
    timeframe_metrics: Dict[str, Any]
    evolution_simulation_log: List[str]
