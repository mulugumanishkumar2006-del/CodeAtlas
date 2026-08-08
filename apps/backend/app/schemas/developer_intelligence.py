from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class HypothesisStatus(str, Enum):
    OPEN = "OPEN"
    SUPPORTED = "SUPPORTED"
    REJECTED = "REJECTED"
    UNKNOWN = "UNKNOWN"


class FindingType(str, Enum):
    FACT = "FACT"
    RISK = "RISK"
    DEPENDENCY = "DEPENDENCY"
    ARCHITECTURE_ISSUE = "ARCHITECTURE_ISSUE"
    PERFORMANCE_SIGNAL = "PERFORMANCE_SIGNAL"
    SECURITY_SIGNAL = "SECURITY_SIGNAL"
    HISTORICAL_SIGNAL = "HISTORICAL_SIGNAL"


class DecisionStatus(str, Enum):
    DRAFT = "DRAFT"
    PROPOSED = "PROPOSED"
    RECORDED = "RECORDED"
    IMPLEMENTING = "IMPLEMENTING"
    VALIDATED = "VALIDATED"
    REJECTED = "REJECTED"


class HypothesisModel(BaseModel):
    hypothesis_id: str
    text: str
    evidence_for: List[str] = Field(default_factory=list)
    evidence_against: List[str] = Field(default_factory=list)
    confidence: float = Field(default=0.8, ge=0.0, le=1.0)
    validation_required: List[str] = Field(default_factory=list)
    status: HypothesisStatus = HypothesisStatus.OPEN


class FindingModel(BaseModel):
    finding_id: str
    statement: str
    evidence_ids: List[str] = Field(default_factory=list)
    finding_type: FindingType
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    impact_summary: str
    related_hypothesis_id: Optional[str] = None


class OptionModel(BaseModel):
    option_id: str
    title: str
    description: str
    benefits: List[str] = Field(default_factory=list)
    costs: List[str] = Field(default_factory=list)
    affected_components: List[str] = Field(default_factory=list)
    risk_score: float = 30.0
    simulated_risk_delta: float = 5.0
    complexity: str = "MEDIUM"  # LOW, MEDIUM, HIGH
    migration_effort: str = "LOW"  # LOW, MEDIUM, HIGH
    testing_steps: List[str] = Field(default_factory=list)
    evidence_ids: List[str] = Field(default_factory=list)
    unknowns: List[str] = Field(default_factory=list)
    explainable_score: float = 85.0


class DecisionRecordModel(BaseModel):
    decision_id: str
    repository_id: str
    tenant_id: str = "default"
    investigation_question: str
    chosen_option_id: str
    title: str
    reason: str
    evidence_ids: List[str] = Field(default_factory=list)
    tradeoffs: List[str] = Field(default_factory=list)
    rejected_alternatives: List[str] = Field(default_factory=list)
    validation_plan: List[str] = Field(default_factory=list)
    owner: str = "Staff Software Engineer"
    timestamp: str
    status: DecisionStatus = DecisionStatus.RECORDED


class ImplementationCheckitem(BaseModel):
    task_id: str
    description: str
    is_completed: bool = False
    category: str = "CODE"  # CODE, API, DB, CONFIG, TEST, DEPLOY


class ImplementationPlanModel(BaseModel):
    plan_id: str
    decision_id: str
    repository_id: str
    title: str
    affected_files: List[str] = Field(default_factory=list)
    affected_components: List[str] = Field(default_factory=list)
    dependency_changes: List[str] = Field(default_factory=list)
    api_changes: List[str] = Field(default_factory=list)
    db_changes: List[str] = Field(default_factory=list)
    configuration_changes: List[str] = Field(default_factory=list)
    tests_to_run: List[str] = Field(default_factory=list)
    migration_steps: List[str] = Field(default_factory=list)
    deployment_checklist: List[ImplementationCheckitem] = Field(default_factory=list)
    rollback_steps: List[str] = Field(default_factory=list)


class PlanVsActualDiff(BaseModel):
    plan_id: str
    planned_impacted_components: List[str] = Field(default_factory=list)
    actual_impacted_components: List[str] = Field(default_factory=list)
    expected_changes: List[str] = Field(default_factory=list)
    unexpected_changes: List[str] = Field(default_factory=list)
    missing_changes: List[str] = Field(default_factory=list)
    new_risks_introduced: List[str] = Field(default_factory=list)
    fidelity_score: float = 95.0
    ai_review_summary: str


class DeveloperActionModel(BaseModel):
    action_id: str
    action_type: str  # OPEN_FILE, VIEW_IMPACT, VIEW_HISTORY, VIEW_SIMULATION, VIEW_EVIDENCE, OPEN_GIT_DIFF, CREATE_PLAN, RECORD_DECISION
    title: str
    target: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    is_safe: bool = True


class InvestigationRequest(BaseModel):
    repository_id: str
    question: str
    context_files: List[str] = Field(default_factory=list)


class InvestigationResponse(BaseModel):
    investigation_id: str
    repository_id: str
    question: str
    hypotheses: List[HypothesisModel]
    findings: List[FindingModel]
    options: List[OptionModel]
    recommendation: str
    insufficient_evidence: bool = False
    evidence_ids: List[str]
    safe_actions: List[DeveloperActionModel]


class AIReviewRequest(BaseModel):
    plan_id: str
    git_diff_text: str


class AIReviewResponse(BaseModel):
    plan_id: str
    matched_plan: bool
    assumptions_valid: bool
    unexpected_dependencies_found: List[str] = Field(default_factory=list)
    architecture_drift_detected: bool = False
    risk_level_shift: str = "UNCHANGED"
    test_sufficiency_score: float = 0.95
    ai_review: str
