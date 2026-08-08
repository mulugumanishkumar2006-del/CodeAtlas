from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class EventType(str, Enum):
    COMMIT = "COMMIT"
    PULL_REQUEST_MERGE = "PULL_REQUEST_MERGE"
    DEPENDENCY_CHANGE = "DEPENDENCY_CHANGE"
    ARCHITECTURE_DRIFT = "ARCHITECTURE_DRIFT"
    SECURITY_SIGNAL = "SECURITY_SIGNAL"
    RISK_CHANGE = "RISK_CHANGE"
    PREDICTION_CHANGE = "PREDICTION_CHANGE"
    AUTOPILOT_EVENT = "AUTOPILOT_EVENT"


class EventSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


class ChangeCategory(str, Enum):
    COSMETIC = "COSMETIC"
    LOW_IMPACT = "LOW_IMPACT"
    STRUCTURAL = "STRUCTURAL"
    ARCHITECTURAL = "ARCHITECTURAL"
    DEPENDENCY = "DEPENDENCY"
    SECURITY = "SECURITY"
    HIGH_IMPACT = "HIGH_IMPACT"
    UNKNOWN = "UNKNOWN"


class DataFreshnessStatus(str, Enum):
    FRESH = "FRESH"
    STALE = "STALE"
    UPDATING = "UPDATING"
    FAILED = "FAILED"
    UNKNOWN = "UNKNOWN"


class AutopilotOperatingMode(str, Enum):
    OBSERVE_ONLY = "OBSERVE_ONLY"
    RECOMMEND = "RECOMMEND"
    PLAN = "PLAN"
    HUMAN_APPROVAL = "HUMAN_APPROVAL"
    EXECUTE = "EXECUTE"


class EngineeringEventModel(BaseModel):
    event_id: str
    organization_id: str
    repository_id: str
    event_type: EventType
    severity: EventSeverity = EventSeverity.MEDIUM
    change_category: ChangeCategory = ChangeCategory.STRUCTURAL
    source: str = "GitHub Webhook"
    summary: str
    evidence_summary: str
    affected_components: List[str] = Field(default_factory=list)
    timestamp: str


class IncrementalAnalysisResultModel(BaseModel):
    analysis_id: str
    repository_id: str
    trigger_event_id: str
    changed_components_count: int = 3
    affected_graph_nodes_count: int = 12
    risk_score_delta: float = -15.5
    architecture_drift_delta: float = -2.0
    refreshed_predictions_count: int = 4
    status: str = "COMPLETED"
    timestamp: str


class NotificationItemModel(BaseModel):
    notification_id: str
    recipient_role: str  # Developer, Architect, Security Reviewer, Team Lead, Executive
    title: str
    body: str
    priority: EventSeverity = EventSeverity.HIGH
    deduplicated_event_count: int = 1
    evidence: str
    timestamp: str


class ContinuousTimelineModel(BaseModel):
    timeline_id: str
    repository_id: str
    events: List[EngineeringEventModel] = Field(default_factory=list)
    total_events_count: int = 0
    time_window: str = "7d"


class DailyEngineeringBriefModel(BaseModel):
    date: str
    organization_id: str
    summary_headline: str
    meaningful_changes_count: int = 5
    architecture_changes: List[str] = Field(default_factory=list)
    risk_changes: List[str] = Field(default_factory=list)
    security_signals: List[str] = Field(default_factory=list)
    recommended_investigations: List[str] = Field(default_factory=list)


class DataFreshnessModel(BaseModel):
    repository_id: str
    status: DataFreshnessStatus = DataFreshnessStatus.FRESH
    graph_freshness: str = "UP_TO_DATE (0s delay)"
    prediction_freshness: str = "UP_TO_DATE"
    last_successful_analysis_at: str
    retry_count: int = 0
    failure_reason: Optional[str] = None


class EventReplayRequestModel(BaseModel):
    organization_id: str
    repository_id: str
    event_ids: List[str] = Field(default_factory=list)
    dry_run: bool = True
