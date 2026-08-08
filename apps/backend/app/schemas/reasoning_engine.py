from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class EngineeringIntent(str, Enum):
    EXPLAIN = "EXPLAIN"
    INVESTIGATE = "INVESTIGATE"
    TRACE = "TRACE"
    COMPARE = "COMPARE"
    IMPACT = "IMPACT"
    DEBUG = "DEBUG"
    ROOT_CAUSE = "ROOT_CAUSE"
    ARCHITECTURE = "ARCHITECTURE"
    DEPENDENCY = "DEPENDENCY"
    SECURITY = "SECURITY"
    PERFORMANCE = "PERFORMANCE"
    TECHNICAL_DEBT = "TECHNICAL_DEBT"
    MIGRATION = "MIGRATION"
    CHANGE_PLAN = "CHANGE_PLAN"
    DOCUMENTATION = "DOCUMENTATION"
    TESTING = "TESTING"
    CODE_REVIEW = "CODE_REVIEW"


class ClaimType(str, Enum):
    FACT = "FACT"
    INFERENCE = "INFERENCE"
    PREDICTION = "PREDICTION"
    RECOMMENDATION = "RECOMMENDATION"
    UNKNOWN = "UNKNOWN"


class Claim(BaseModel):
    id: str
    text: str
    category: ClaimType
    supporting_evidence_ids: List[str] = Field(default_factory=list)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    is_verified: bool = True


class EvidenceItem(BaseModel):
    id: str
    type: str  # code, graph, dependency, architecture, history, impact, test, error
    source: str
    location: str  # file path, symbol name, commit hash, etc.
    line_range: Optional[str] = None
    content: str
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    recency_score: float = Field(default=1.0, ge=0.0, le=1.0)
    reliability_score: float = Field(default=1.0, ge=0.0, le=1.0)


class EvidencePack(BaseModel):
    repository_id: str
    analysis_version: str
    target: str
    items: List[EvidenceItem] = Field(default_factory=list)
    known_limitations: List[str] = Field(default_factory=list)
    total_token_estimate: int = 0


class SourceCitation(BaseModel):
    citation_id: str
    file_path: str
    symbol: Optional[str] = None
    line_range: Optional[str] = None
    commit_hash: Optional[str] = None
    analysis_version: str
    description: str


class StructuredAnalysisStep(BaseModel):
    stage: str  # OBSERVE, CONNECT, ANALYZE, ASSESS, VALIDATE, RECOMMEND
    content: str
    evidence_ids: List[str] = Field(default_factory=list)


class ReasoningContract(BaseModel):
    summary: str
    known_facts: List[Claim] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    structured_steps: List[StructuredAnalysisStep] = Field(default_factory=list)
    analysis: str
    potential_impact: Dict[str, Any] = Field(default_factory=dict)
    risks: List[str] = Field(default_factory=list)
    uncertainties: List[str] = Field(default_factory=list)
    recommendation: List[str] = Field(default_factory=list)
    validation_steps: List[str] = Field(default_factory=list)
    sources: List[SourceCitation] = Field(default_factory=list)
    all_claims: List[Claim] = Field(default_factory=list)


class ReasoningTrace(BaseModel):
    evidence_ids_considered: List[str] = Field(default_factory=list)
    relationships_found: List[str] = Field(default_factory=list)
    key_observations: List[str] = Field(default_factory=list)
    uncertainties_flagged: List[str] = Field(default_factory=list)
    recommended_validation: List[str] = Field(default_factory=list)
    execution_time_ms: float = 0.0


class DeveloperAction(BaseModel):
    action_type: str  # open_source, open_dependency, view_impact, view_history, run_analysis, inspect_test, start_investigation, create_plan
    title: str
    target: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    is_safe: bool = True


class ReasoningQueryRequest(BaseModel):
    repository_id: str
    tenant_id: str = "default"
    workspace_id: Optional[str] = None
    query: str
    intent_override: Optional[EngineeringIntent] = None
    target_component: Optional[str] = None
    context_files: List[str] = Field(default_factory=list)
    include_history: bool = True
    include_impact: bool = True


class ReasoningQueryResponse(BaseModel):
    query: str
    detected_intent: EngineeringIntent
    intent_confidence: float
    contract: ReasoningContract
    reasoning_trace: ReasoningTrace
    safe_actions: List[DeveloperAction] = Field(default_factory=list)
    ai_explanation_available: bool = True
    fallback_message: Optional[str] = None


class InvestigationState(BaseModel):
    investigation_id: str
    repository_id: str
    tenant_id: str
    question: str
    hypothesis: Optional[str] = None
    evidence: List[EvidenceItem] = Field(default_factory=list)
    findings: List[str] = Field(default_factory=list)
    rejected_hypotheses: List[str] = Field(default_factory=list)
    conclusion: Optional[str] = None
    recommended_action: Optional[str] = None
    validation_status: str = "IN_PROGRESS"  # IN_PROGRESS, VALIDATED, REJECTED, UNCERTAIN
    created_at: str
    updated_at: str


class EvaluationMetrics(BaseModel):
    factual_accuracy: float
    grounding_score: float
    evidence_correctness: float
    hallucination_rate: float
    uncertainty_handling_score: float
    usefulness_score: float
    latency_ms: float
    cost_usd: float
    passed_all_gates: bool


class AdversarialTestResult(BaseModel):
    test_name: str
    attack_type: str
    passed: bool
    details: str
    prompt_injection_prevented: bool
    tenant_isolation_preserved: bool
