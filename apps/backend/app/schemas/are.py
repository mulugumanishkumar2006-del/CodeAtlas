from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class RefactoringScanRequest(BaseModel):
    repository_id: str
    target_path: Optional[str] = None
    deep_ast_analysis: bool = True


class RefactoringOpportunitySchema(BaseModel):
    id: str
    smell_type: str
    title: str
    description: Optional[str] = None
    target_file: str
    target_symbol: Optional[str] = None
    line_range: Optional[str] = None
    priority_score: float
    business_value: float
    engineering_cost: float
    risk_score: float
    tech_debt_impact: float
    customer_impact: float
    recommended_action: Optional[str] = None
    refactoring_pattern: Optional[str] = None
    status: str
    metadata_json: Dict[str, Any] = {}


class RefactoringScanResponse(BaseModel):
    id: str
    repository_id: str
    scan_status: str
    total_files_scanned: int
    total_opportunities_found: int
    god_classes_count: int
    god_functions_count: int
    dead_code_count: int
    duplicate_blocks_count: int
    circular_deps_count: int
    overall_health_score: float
    refactoring_debt_score: float
    repository_cleanup_score: float
    module_cohesion_score: float
    opportunities: List[RefactoringOpportunitySchema] = []
    summary_metrics: Dict[str, Any] = {}


class PlanGenerationRequest(BaseModel):
    repository_id: str
    timeframe_weeks: int = 4
    focus_areas: List[str] = Field(
        default=["god_class", "circular_dependency", "dead_code"]
    )


class RefactoringPlanStage(BaseModel):
    week_number: int
    stage_name: str
    actions: List[str]
    target_modules: List[str]
    risk_level: str
    estimated_hours: float


class RefactoringPlanResponse(BaseModel):
    id: str
    repository_id: str
    title: str
    timeframe: str
    total_stages: int
    stages: List[RefactoringPlanStage]
    total_estimated_roi_pct: float
    total_estimated_hours: float
    status: str


class RoadmapResponse(BaseModel):
    id: str
    repository_id: str
    quarter: str
    roadmap_summary: str
    sprints_breakdown: List[Dict[str, Any]]
    team_assignments: Dict[str, List[str]]
    roi_analysis: Dict[str, Any]
    cost_estimation_usd: float


class PriorityEvaluationRequest(BaseModel):
    repository_id: str
    opportunity_ids: Optional[List[str]] = None


class PriorityEvaluationResponse(BaseModel):
    repository_id: str
    prioritized_opportunities: List[RefactoringOpportunitySchema]


class MonolithDecompositionRequest(BaseModel):
    repository_id: str
    target_monolith_module: Optional[str] = "apps/backend"
    preferred_architecture: str = "modular_monolith"


class MonolithDecompositionResponse(BaseModel):
    repository_id: str
    candidates: List[Dict[str, Any]]
    coupling_reduction_pct: float
    complexity_delta: float


class CycleEliminationRequest(BaseModel):
    repository_id: str


class CycleEliminationResponse(BaseModel):
    repository_id: str
    cycles_detected: List[Dict[str, Any]]
    proposed_interface_extractions: List[Dict[str, Any]]
    cycle_free_graph_preview: Dict[str, Any]


class DuplicateIntelligenceRequest(BaseModel):
    repository_id: str
    min_duplicate_lines: int = 5


class DuplicateIntelligenceResponse(BaseModel):
    repository_id: str
    duplicate_clusters: List[Dict[str, Any]]
    recommended_abstractions: List[Dict[str, Any]]


class DependencyCleanupRequest(BaseModel):
    repository_id: str


class DependencyCleanupResponse(BaseModel):
    repository_id: str
    unused_libraries: List[str]
    outdated_packages: List[Dict[str, Any]]
    heavy_dependencies: List[Dict[str, Any]]
    security_vulnerabilities: List[Dict[str, Any]]


class DeadCodeRequest(BaseModel):
    repository_id: str


class DeadCodeResponse(BaseModel):
    repository_id: str
    unused_functions: List[Dict[str, Any]]
    unused_apis: List[Dict[str, Any]]
    unused_classes: List[Dict[str, Any]]
    unused_modules: List[Dict[str, Any]]


class SimulationRequest(BaseModel):
    repository_id: str
    opportunity_id: str
    apply_pattern: Optional[str] = None


class SimulationResponse(BaseModel):
    simulation_id: str
    repository_id: str
    opportunity_id: Optional[str]
    simulation_name: str
    simulated_diff: str
    safety_score: float
    breaking_change_risk: float
    test_coverage_pass_rate: float
    validation_checks: List[Dict[str, Any]]
    recommended_pr_title: str
    generated_pr_branch: str
    status: str


class NamingIntelligenceResponse(BaseModel):
    repository_id: str
    class_name_recommendations: List[Dict[str, Any]]
    package_name_recommendations: List[Dict[str, Any]]
    module_name_recommendations: List[Dict[str, Any]]
    api_name_recommendations: List[Dict[str, Any]]


class LayerValidationResponse(BaseModel):
    repository_id: str
    layer_hierarchy: List[str]
    layer_violations: List[Dict[str, Any]]
    is_layer_separated: bool


class StaticSmellExplorerResponse(BaseModel):
    repository_id: str
    generic_code_smells: List[Dict[str, Any]]
    utility_class_smells: List[Dict[str, Any]]
    excessive_inheritance_smells: List[Dict[str, Any]]
    complex_switch_smells: List[Dict[str, Any]]
    large_file_smells: List[Dict[str, Any]]


class ADRResponse(BaseModel):
    id: str
    repository_id: str
    adr_number: int
    title: str
    status: str
    context: str
    decision: str
    consequences: str


class RollbackPlannerResponse(BaseModel):
    repository_id: str
    rollback_strategy: str
    safe_checkpoints: List[str]
    automated_rollback_script: str
    confidence_score: float


class ArchitectureMigrationResponse(BaseModel):
    repository_id: str
    architecture_style: str  # Clean, Hexagonal, CQRS, Event-Driven
    migration_phases: List[Dict[str, Any]]
    estimated_weeks: int


class AIRefactoringStudioSessionResponse(BaseModel):
    id: str
    repository_id: str
    session_name: str
    baseline_health_score: float
    target_health_score: float
    tech_debt_delta_pct: float
    build_time_delta_pct: float
    deployment_risk_delta_pct: float
    developer_productivity_delta_pct: float
    sprints_timeline: List[Dict[str, Any]]
    simulation_replay_steps: List[Dict[str, Any]]
    status: str


class GeneratePRRequest(BaseModel):
    repository_id: str
    simulation_id: str
    target_branch: str = "main"


class GeneratePRResponse(BaseModel):
    pr_url: str
    branch_name: str
    pr_title: str
    pr_body: str
    status: str
