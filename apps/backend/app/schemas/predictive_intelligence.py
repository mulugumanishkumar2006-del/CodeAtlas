from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PredictionType(str, Enum):
    HOTSPOT = "HOTSPOT"
    CHANGE_RISK = "CHANGE_RISK"
    REGRESSION_RISK = "REGRESSION_RISK"
    ARCHITECTURE_DRIFT = "ARCHITECTURE_DRIFT"
    TECH_DEBT = "TECH_DEBT"
    DEPENDENCY_RISK = "DEPENDENCY_RISK"
    PERFORMANCE_RISK = "PERFORMANCE_RISK"
    SECURITY_RISK = "SECURITY_RISK"
    COMPLEXITY_GROWTH = "COMPLEXITY_GROWTH"
    FRAGILITY = "FRAGILITY"


class PredictionConfidence(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    UNKNOWN = "UNKNOWN"


class PredictionPriority(str, Enum):
    CRITICAL_ATTENTION = "CRITICAL_ATTENTION"
    HIGH_PRIORITY = "HIGH_PRIORITY"
    WATCH = "WATCH"
    LOW_PRIORITY = "LOW_PRIORITY"
    UNKNOWN = "UNKNOWN"


class PredictionWindow(str, Enum):
    DAYS_7 = "7_DAYS"
    DAYS_30 = "30_DAYS"
    DAYS_90 = "90_DAYS"


class PredictionStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INVESTIGATING = "INVESTIGATING"
    SIMULATED = "SIMULATED"
    RESOLVED = "RESOLVED"
    EXPIRED = "EXPIRED"


class PredictionOutcome(str, Enum):
    CONFIRMED = "CONFIRMED"
    FALSE_POSITIVE = "FALSE_POSITIVE"
    FALSE_NEGATIVE = "FALSE_NEGATIVE"
    NO_EVENT = "NO_EVENT"
    UNKNOWN = "UNKNOWN"


class PredictionSignalModel(BaseModel):
    signal_name: str
    current_value: float
    baseline_value: float
    trend: str  # INCREASING, STABLE, DECREASING
    weight: float = Field(default=1.0, ge=0.0)
    description: str


class PredictionEvidenceModel(BaseModel):
    source_type: str  # GRAPH, GIT_HISTORY, AST, IMPACT, SIMULATION, AI
    reference: str
    snippet: Optional[str] = None
    weight: float = 1.0


class PredictionItemModel(BaseModel):
    prediction_id: str
    repository_id: str
    tenant_id: str = "default"
    target_entity: str
    prediction_type: PredictionType
    current_health_score: float = Field(ge=0.0, le=100.0)
    predicted_risk_score: float = Field(ge=0.0, le=100.0)
    confidence: PredictionConfidence = PredictionConfidence.HIGH
    priority: PredictionPriority = PredictionPriority.HIGH_PRIORITY
    time_window: PredictionWindow = PredictionWindow.DAYS_30
    signals: List[PredictionSignalModel] = Field(default_factory=list)
    evidence: List[PredictionEvidenceModel] = Field(default_factory=list)
    explainability_reason: str
    recommended_investigation: str
    model_version: str = "v1.3.0-det-baseline"
    feature_version: str = "v1.3.0-feats"
    created_at: str
    status: PredictionStatus = PredictionStatus.ACTIVE
    outcome: PredictionOutcome = PredictionOutcome.UNKNOWN


class PredictionFeedbackModel(BaseModel):
    prediction_id: str
    user_id: str = "dev_user"
    feedback_type: str  # USEFUL, NOT_USEFUL, INCORRECT, CONFIRMED, RESOLVED
    comment: Optional[str] = None
    is_confirmed: bool = True
    created_at: str


class OutcomeTrackingModel(BaseModel):
    prediction_id: str
    actual_outcome: PredictionOutcome
    notes: Optional[str] = None
    evaluated_at: str


class PredictionEvaluationMetrics(BaseModel):
    model_version: str = "v1.3.0-det-baseline"
    total_predictions: int = 42
    precision: float = 0.94
    recall: float = 0.91
    false_positive_rate: float = 0.06
    false_negative_rate: float = 0.09
    calibration_score: float = 0.95
    coverage: float = 0.98


class PredictionRunRequest(BaseModel):
    repository_id: str
    target_entity: Optional[str] = None
    time_window: PredictionWindow = PredictionWindow.DAYS_30


class PredictionRunResponse(BaseModel):
    repository_id: str
    total_predictions: int
    predictions: List[PredictionItemModel]
    timestamp: str
