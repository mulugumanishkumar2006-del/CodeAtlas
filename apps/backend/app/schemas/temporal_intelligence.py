from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class DriftTrend(str, Enum):
    NEW = "NEW"
    STABLE = "STABLE"
    INCREASING = "INCREASING"
    DECREASING = "DECREASING"
    RESOLVED = "RESOLVED"
    UNKNOWN = "UNKNOWN"


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ArchitectureEventType(str, Enum):
    SERVICE_INTRODUCED = "SERVICE_INTRODUCED"
    MODULE_SPLIT = "MODULE_SPLIT"
    SERVICE_REMOVED = "SERVICE_REMOVED"
    DEPENDENCY_ADDED = "DEPENDENCY_ADDED"
    API_INTRODUCED = "API_INTRODUCED"
    DB_DEP_CHANGED = "DB_DEP_CHANGED"
    QUEUE_INTRODUCED = "QUEUE_INTRODUCED"
    COUPLING_CHANGED = "COUPLING_CHANGED"


class CommitModel(BaseModel):
    commit_id: str
    repository_id: str
    parent_sha: Optional[str] = None
    commit_sha: str
    author_name: Optional[str] = None
    author_email: Optional[str] = None
    committed_at: str
    branch: str = "main"
    message: str
    total_files_changed: int = 0
    added_lines: int = 0
    removed_lines: int = 0
    renamed_files: List[Dict[str, str]] = Field(default_factory=list)
    changed_symbols: List[str] = Field(default_factory=list)
    changed_dependencies: List[str] = Field(default_factory=list)
    changed_config: List[str] = Field(default_factory=list)
    analysis_version: str = "v1.2-temporal"


class HistoricalSnapshot(BaseModel):
    snapshot_id: str
    repository_id: str
    commit_sha: str
    committed_at: str
    total_components: int
    total_relationships: int
    graph_state: Dict[str, Any] = Field(default_factory=dict)
    architecture_state: Dict[str, Any] = Field(default_factory=dict)
    health_score: float = 100.0


class ChangeModelEvolution(BaseModel):
    commit_sha: str
    added_files: List[str] = Field(default_factory=list)
    removed_files: List[str] = Field(default_factory=list)
    modified_files: List[str] = Field(default_factory=list)
    renamed_files: List[Dict[str, str]] = Field(default_factory=list)
    added_symbols: List[str] = Field(default_factory=list)
    removed_symbols: List[str] = Field(default_factory=list)
    changed_symbols: List[str] = Field(default_factory=list)
    added_dependencies: List[str] = Field(default_factory=list)
    removed_dependencies: List[str] = Field(default_factory=list)
    api_changes: List[str] = Field(default_factory=list)
    config_changes: List[str] = Field(default_factory=list)


class GraphEvolutionDiff(BaseModel):
    base_commit_sha: str
    head_commit_sha: str
    new_nodes: List[str] = Field(default_factory=list)
    removed_nodes: List[str] = Field(default_factory=list)
    new_relationships: List[Dict[str, str]] = Field(default_factory=list)
    removed_relationships: List[Dict[str, str]] = Field(default_factory=list)
    changed_dependency_paths: List[str] = Field(default_factory=list)
    boundary_changes: List[str] = Field(default_factory=list)


class ArchitectureTimelineEvent(BaseModel):
    event_id: str
    repository_id: str
    commit_sha: str
    timestamp: str
    event_type: ArchitectureEventType
    title: str
    description: str
    affected_components: List[str] = Field(default_factory=list)
    severity: str = "INFO"


class ArchitectureDiff(BaseModel):
    base_sha: str
    head_sha: str
    added_components: List[str] = Field(default_factory=list)
    removed_components: List[str] = Field(default_factory=list)
    new_dependencies: List[Dict[str, str]] = Field(default_factory=list)
    removed_dependencies: List[Dict[str, str]] = Field(default_factory=list)
    changed_boundaries: List[str] = Field(default_factory=list)
    risk_changes: Dict[str, str] = Field(default_factory=dict)
    evidence: List[str] = Field(default_factory=list)


class DependencyEvolution(BaseModel):
    dependency_name: str
    status: str  # INTRODUCED, REMOVED, STABLE
    introduced_at_commit: str
    introduced_at_timestamp: str
    removed_at_commit: Optional[str] = None
    change_frequency: int = 1
    affected_components: List[str] = Field(default_factory=list)
    incident_count: int = 0


class CoChangeRelationship(BaseModel):
    component_a: str
    component_b: str
    co_change_frequency: int
    shared_commits: List[str] = Field(default_factory=list)
    strength_score: float = Field(default=0.0, ge=0.0, le=1.0)
    label: str = "Historical co-change"  # Explicit non-causal label


class ArchitectureDriftFinding(BaseModel):
    finding_id: str
    repository_id: str
    rule_name: str
    declared_architecture: str
    observed_architecture: str
    relationship: str
    evidence: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    confidence: float = 1.0
    trend: DriftTrend = DriftTrend.NEW
    first_seen_commit: str
    latest_seen_commit: str


class TechnicalDebtEvolution(BaseModel):
    debt_introduced: float
    debt_resolved: float
    net_debt_growth: float
    average_debt_age_days: float
    high_risk_aging_components: List[str] = Field(default_factory=list)
    debt_concentration: Dict[str, float] = Field(default_factory=dict)


class RiskEvolution(BaseModel):
    component_path: str
    historical_levels: List[Dict[str, Any]] = Field(default_factory=list)  # [{timestamp, commit, level}]
    current_risk: RiskLevel
    risk_trend: str  # INCREASING, STABLE, DECREASING
    signals: List[str] = Field(default_factory=list)  # Dependency growth, coupling, drift, etc.


class ChangeHotspot(BaseModel):
    component_path: str
    change_frequency: int
    dependency_centrality: float
    risk_level: RiskLevel
    failure_history_count: int
    explanation: str


class TemporalImpactResponse(BaseModel):
    target_component: str
    current_impacted_services: int
    historical_impacted_services: int
    historical_snapshots_count: int
    impact_timeline: List[Dict[str, Any]] = Field(default_factory=list)


class TemporalAIExplanationRequest(BaseModel):
    repository_id: str
    query: str
    target_component: Optional[str] = None
    from_commit: Optional[str] = None
    to_commit: Optional[str] = None


class TemporalAIExplanationResponse(BaseModel):
    query: str
    explanation: str
    historical_facts: List[str] = Field(default_factory=list)
    observations: List[str] = Field(default_factory=list)
    inferences: List[str] = Field(default_factory=list)
    predictions: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    sources: List[Dict[str, str]] = Field(default_factory=list)


class TemporalSearchRequest(BaseModel):
    repository_id: str
    query: str
    author: Optional[str] = None
    from_date: Optional[str] = None
    to_date: Optional[str] = None


class TemporalSearchResponse(BaseModel):
    query: str
    matching_commits: List[CommitModel] = Field(default_factory=list)
    matching_events: List[ArchitectureTimelineEvent] = Field(default_factory=list)
    matching_drifts: List[ArchitectureDriftFinding] = Field(default_factory=list)


class TemporalEvalMetrics(BaseModel):
    historical_accuracy: float
    evidence_correctness: float
    timeline_correctness: float
    graph_diff_correctness: float
    ai_grounding_score: float
    uncertainty_handling_score: float
    passed_all_gates: bool
