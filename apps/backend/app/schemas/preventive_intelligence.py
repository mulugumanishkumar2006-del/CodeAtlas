from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PreventionStatus(str, Enum):
    PROPOSED = "PROPOSED"
    SIMULATED = "SIMULATED"
    PLANNING = "PLANNING"
    IMPLEMENTING = "IMPLEMENTING"
    VALIDATED = "VALIDATED"
    SUCCESSFULLY_PREVENTED = "SUCCESSFULLY_PREVENTED"
    PARTIALLY_IMPROVED = "PARTIALLY_IMPROVED"
    NOT_RESOLVED = "NOT_RESOLVED"
    REGRESSED = "REGRESSED"
    REJECTED = "REJECTED"


class PreventionOutcome(str, Enum):
    SUCCESSFULLY_PREVENTED = "SUCCESSFULLY_PREVENTED"
    PARTIALLY_IMPROVED = "PARTIALLY_IMPROVED"
    NOT_RESOLVED = "NOT_RESOLVED"
    REGRESSED = "REGRESSED"
    UNKNOWN = "UNKNOWN"


class OptionSafestRank(str, Enum):
    BEST_OPTION = "BEST_OPTION"
    LOWEST_RISK_OPTION = "LOWEST_RISK_OPTION"
    LOWEST_EFFORT_OPTION = "LOWEST_EFFORT_OPTION"
    HIGHEST_IMPACT_OPTION = "HIGHEST_IMPACT_OPTION"


class InterventionCategory(str, Enum):
    REDUCE_COUPLING = "REDUCE_COUPLING"
    REMOVE_DEPENDENCY = "REMOVE_DEPENDENCY"
    INTRODUCE_INTERFACE = "INTRODUCE_INTERFACE"
    EXTRACT_MODULE = "EXTRACT_MODULE"
    SPLIT_SERVICE = "SPLIT_SERVICE"
    MOVE_RESPONSIBILITY = "MOVE_RESPONSIBILITY"
    IMPROVE_BOUNDARY = "IMPROVE_BOUNDARY"
    INCREASE_TEST_COVERAGE = "INCREASE_TEST_COVERAGE"


class InterventionEvidenceModel(BaseModel):
    why_proposed: str
    affected_components: List[str] = Field(default_factory=list)
    expected_benefit: List[str] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    unknowns: List[str] = Field(default_factory=list)
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)


class InterventionOptionModel(BaseModel):
    option_id: str
    title: str
    description: str
    category: InterventionCategory
    rank: OptionSafestRank
    explainable_score: float = Field(ge=0.0, le=100.0)
    risk_reduction_percentage: float = Field(ge=0.0, le=100.0)
    implementation_effort: str = "MEDIUM"  # LOW, MEDIUM, HIGH
    blast_radius_score: float = 25.0
    simulated_risk_delta: float = -20.0
    evidence: InterventionEvidenceModel
    testing_requirements: List[str] = Field(default_factory=list)


class BeforeAfterComparisonModel(BaseModel):
    target_entity: str
    current_risk_score: float = 78.5
    proposed_risk_score: float = 28.0
    risk_delta: float = -50.5
    current_coupling_score: float = 0.82
    proposed_coupling_score: float = 0.15
    affected_components_count: int = 3
    summary: str


class PreventionTaskItemModel(BaseModel):
    task_id: str
    step_number: int
    title: str
    category: str = "CODE"  # CODE, API, DB, CONFIG, TEST, DEPLOY
    is_completed: bool = False


class PreventionPlanModel(BaseModel):
    plan_id: str
    prediction_id: str
    repository_id: str
    tenant_id: str = "default"
    target_entity: str
    objective: str
    problem_summary: str
    chosen_option_id: str
    affected_files: List[str] = Field(default_factory=list)
    affected_components: List[str] = Field(default_factory=list)
    expected_dependencies: List[str] = Field(default_factory=list)
    api_changes: List[str] = Field(default_factory=list)
    db_changes: List[str] = Field(default_factory=list)
    config_changes: List[str] = Field(default_factory=list)
    task_breakdown: List[PreventionTaskItemModel] = Field(default_factory=list)
    validation_plan: List[str] = Field(default_factory=list)
    success_criteria: List[str] = Field(default_factory=list)
    rollback_steps: List[str] = Field(default_factory=list)
    created_at: str
    status: PreventionStatus = PreventionStatus.PLANNING
    outcome: PreventionOutcome = PreventionOutcome.UNKNOWN


class RecurrencePatternModel(BaseModel):
    pattern_id: str
    repository_id: str
    entity_name: str
    occurrence_count: int = 3
    risk_type: str = "COUPLING_DRIFT"
    previous_interventions: List[str] = Field(default_factory=list)
    previous_outcomes: List[str] = Field(default_factory=list)
    recommended_action: str
    detected_at: str


class PreventionPipelineRequest(BaseModel):
    prediction_id: str
    repository_id: str


class PreventionPipelineResponse(BaseModel):
    pipeline_id: str
    repository_id: str
    target_entity: str
    risk_summary: str
    interventions: List[InterventionOptionModel]
    before_after: BeforeAfterComparisonModel
    safest_option: InterventionOptionModel
    recommendation: str
    recurrence: Optional[RecurrencePatternModel] = None


class PreventionOutcomeRequest(BaseModel):
    plan_id: str
    actual_outcome: PreventionOutcome
    measured_risk_reduction: float = 45.0
    notes: Optional[str] = None
