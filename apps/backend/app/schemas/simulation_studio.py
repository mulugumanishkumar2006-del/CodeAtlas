from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SimulationStatus(str, Enum):
    DRAFT = "DRAFT"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    DISCARDED = "DISCARDED"


class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    UNKNOWN = "UNKNOWN"


class ProposedChangeType(str, Enum):
    MODIFY_FUNCTION = "MODIFY_FUNCTION"
    RENAME_SYMBOL = "RENAME_SYMBOL"
    DELETE_SYMBOL = "DELETE_SYMBOL"
    MOVE_MODULE = "MOVE_MODULE"
    ADD_DEPENDENCY = "ADD_DEPENDENCY"
    REMOVE_DEPENDENCY = "REMOVE_DEPENDENCY"
    CHANGE_API = "CHANGE_API"
    CHANGE_DB_SCHEMA = "CHANGE_DB_SCHEMA"
    CHANGE_CONFIG = "CHANGE_CONFIG"
    SERVICE_BOUNDARY_CHANGE = "SERVICE_BOUNDARY_CHANGE"
    EXTRACT_SERVICE = "EXTRACT_SERVICE"
    INTRODUCE_QUEUE = "INTRODUCE_QUEUE"
    INTRODUCE_CACHE = "INTRODUCE_CACHE"


class DiffState(str, Enum):
    UNCHANGED = "UNCHANGED"
    ADDED = "ADDED"
    REMOVED = "REMOVED"
    CHANGED = "CHANGED"
    PREDICTED = "PREDICTED"
    UNKNOWN = "UNKNOWN"


class ProposedChange(BaseModel):
    change_id: str
    change_type: ProposedChangeType
    target_entity: str  # file, symbol, module, dependency, table
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)


class VirtualNode(BaseModel):
    id: str
    name: str
    type: str  # service, module, file, api, database
    diff_state: DiffState = DiffState.UNCHANGED
    metadata: Dict[str, Any] = Field(default_factory=dict)


class VirtualEdge(BaseModel):
    source: str
    target: str
    relationship_type: str
    diff_state: DiffState = DiffState.UNCHANGED


class VirtualGraph(BaseModel):
    nodes: List[VirtualNode] = Field(default_factory=list)
    edges: List[VirtualEdge] = Field(default_factory=list)


class GraphDiffItem(BaseModel):
    entity_id: str
    entity_type: str
    diff_state: DiffState
    description: str


class SimulationImpact(BaseModel):
    direct_impact_count: int = 0
    indirect_impact_count: int = 0
    api_impact_count: int = 0
    database_impact_count: int = 0
    test_impact_count: int = 0
    affected_components: List[str] = Field(default_factory=list)
    breaking_change_risks: List[str] = Field(default_factory=list)


class SimulationRisk(BaseModel):
    current_risk_score: float = 30.0
    simulated_risk_score: float = 45.0
    risk_delta: float = 15.0
    new_risks: List[str] = Field(default_factory=list)
    resolved_risks: List[str] = Field(default_factory=list)
    risk_explanations: List[str] = Field(default_factory=list)


class SimulationAssumption(BaseModel):
    assumption_id: str
    description: str
    impacts_confidence: bool = True
    mitigation: Optional[str] = None


class SimulationValidationPlan(BaseModel):
    recommended_unit_tests: List[str] = Field(default_factory=list)
    recommended_integration_tests: List[str] = Field(default_factory=list)
    api_consumer_checks: List[str] = Field(default_factory=list)
    database_migration_steps: List[str] = Field(default_factory=list)
    security_boundary_checks: List[str] = Field(default_factory=list)


class SimulationScenario(BaseModel):
    scenario_id: str
    title: str
    description: str
    proposed_changes: List[ProposedChange] = Field(default_factory=list)
    simulated_risk: SimulationRisk
    simulated_impact: SimulationImpact
    confidence: ConfidenceLevel = ConfidenceLevel.HIGH


class SimulationDecisionSupport(BaseModel):
    simulation_id: str
    option_title: str
    benefits: List[str] = Field(default_factory=list)
    costs: List[str] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    affected_systems: List[str] = Field(default_factory=list)
    assumptions: List[SimulationAssumption] = Field(default_factory=list)
    evidence: List[str] = Field(default_factory=list)
    validation: SimulationValidationPlan
    recommendation: str


class SimulationRunRequest(BaseModel):
    repository_id: str
    title: str
    base_commit_sha: Optional[str] = "HEAD"
    proposed_changes: List[ProposedChange] = Field(default_factory=list)


class SimulationRunResponse(BaseModel):
    simulation_id: str
    repository_id: str
    status: SimulationStatus
    created_at: str
    proposed_changes: List[ProposedChange]
    virtual_graph: VirtualGraph
    graph_diff: List[GraphDiffItem]
    impact: SimulationImpact
    risk: SimulationRisk
    assumptions: List[SimulationAssumption]
    confidence: ConfidenceLevel
    validation_plan: SimulationValidationPlan
    ai_reasoning: str
    decision_support: SimulationDecisionSupport


class ScenarioComparisonRequest(BaseModel):
    repository_id: str
    simulation_ids: List[str] = Field(default_factory=list)


class ScenarioComparisonResponse(BaseModel):
    repository_id: str
    scenarios: List[SimulationScenario] = Field(default_factory=list)
    comparison_summary: str
    recommended_option_id: Optional[str] = None


class SimulationExportReport(BaseModel):
    simulation_id: str
    repository_id: str
    title: str
    generated_at: str
    status: SimulationStatus
    proposed_changes: List[ProposedChange]
    impact_summary: SimulationImpact
    risk_summary: SimulationRisk
    assumptions: List[SimulationAssumption]
    confidence: ConfidenceLevel
    validation_plan: SimulationValidationPlan
    decision_recommendation: str


class SimulationEvalMetrics(BaseModel):
    grounding_score: float
    prediction_accuracy: float
    evidence_usage_score: float
    assumption_handling_score: float
    hallucination_rate: float
    passed_all_gates: bool
