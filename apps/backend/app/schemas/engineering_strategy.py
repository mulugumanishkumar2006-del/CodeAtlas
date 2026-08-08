from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class StrategicObjectiveCategory(str, Enum):
    REDUCE_ARCHITECTURE_RISK = "REDUCE_ARCHITECTURE_RISK"
    IMPROVE_RELIABILITY = "IMPROVE_RELIABILITY"
    REDUCE_TECHNICAL_DEBT = "REDUCE_TECHNICAL_DEBT"
    ACCELERATE_DELIVERY = "ACCELERATE_DELIVERY"
    SIMPLIFY_ARCHITECTURE = "SIMPLIFY_ARCHITECTURE"
    REDUCE_DEPENDENCY_CONCENTRATION = "REDUCE_DEPENDENCY_CONCENTRATION"
    MODERNIZE_TECHNOLOGY = "MODERNIZE_TECHNOLOGY"
    IMPROVE_SECURITY_POSTURE = "IMPROVE_SECURITY_POSTURE"


class RoadmapPhase(str, Enum):
    NOW = "NOW"
    NEXT = "NEXT"
    LATER = "LATER"
    OPTIONAL = "OPTIONAL"


class MigrationStrategyType(str, Enum):
    STRANGLER = "STRANGLER"
    INCREMENTAL = "INCREMENTAL"
    PARALLEL = "PARALLEL"
    BIG_BANG = "BIG_BANG"
    COMPATIBILITY_LAYER = "COMPATIBILITY_LAYER"


class TechnologyStatus(str, Enum):
    STANDARDIZE = "STANDARDIZE"
    MAINTAIN = "MAINTAIN"
    MIGRATE = "MIGRATE"
    RETIRE = "RETIRE"
    EVALUATE = "EVALUATE"


class StrategicObjectiveModel(BaseModel):
    objective_id: str
    organization_id: str
    title: str
    category: StrategicObjectiveCategory
    priority_weight: float = Field(default=0.85, ge=0.0, le=1.0)
    description: str
    created_at: str


class StrategicOptionModel(BaseModel):
    option_id: str
    title: str
    description: str
    category: str
    risk_delta: float = -45.0
    effort_level: str = "MEDIUM"  # LOW, MEDIUM, HIGH
    blast_radius_score: float = 20.0
    reversibility: str = "HIGH"
    trade_offs: List[str] = Field(default_factory=list)
    confidence: float = 0.94


class ScenarioComparisonModel(BaseModel):
    scenario_a: str
    scenario_b: str
    better_for: List[str] = Field(default_factory=list)
    worse_for: List[str] = Field(default_factory=list)
    trade_off_summary: str
    risk_comparison: str
    confidence: float = 0.95
    unknowns: List[str] = Field(default_factory=list)


class StrategicInitiativeItemModel(BaseModel):
    initiative_id: str
    title: str
    category: str
    roadmap_phase: RoadmapPhase = RoadmapPhase.NOW
    priority_score: float = Field(default=88.0, ge=0.0, le=100.0)
    risk_reduction_score: float = 45.0
    dependencies: List[str] = Field(default_factory=list)
    owner: str = "VP of Engineering"


class DoNothingAnalysisModel(BaseModel):
    target_entity: str
    projected_risk_trend: str = "DEGRADING (+15 pts risk per quarter)"
    projected_tech_debt_trend: str = "INCREASING (+22% AST complexity)"
    projected_drift_trend: str = "ACCELERATING (+3 cross-layer violations)"
    consequence_summary: str


class StrategicDecisionRecordModel(BaseModel):
    decision_id: str
    organization_id: str
    objective_id: str
    chosen_option_id: str
    title: str
    summary: str
    evidence_citations: List[str] = Field(default_factory=list)
    reviewers: List[str] = Field(default_factory=list)
    expected_outcome: str
    actual_outcome: Optional[str] = None
    created_at: str


class LeadershipBriefModel(BaseModel):
    organization_id: str
    what_matters_most: List[str] = Field(default_factory=list)
    why: str
    what_is_changing: List[str] = Field(default_factory=list)
    options: List[str] = Field(default_factory=list)
    trade_offs: List[str] = Field(default_factory=list)
    what_to_invest: List[str] = Field(default_factory=list)
    what_to_defer: List[str] = Field(default_factory=list)
    needed_decisions: List[str] = Field(default_factory=list)


class AIStrategistRequest(BaseModel):
    organization_id: str
    question: str


class AIStrategistResponse(BaseModel):
    organization_id: str
    question: str
    recommendation: str
    evidence: List[str] = Field(default_factory=list)
    options: List[str] = Field(default_factory=list)
    trade_offs: List[str] = Field(default_factory=list)
    confidence: float = 0.95
    unknowns: List[str] = Field(default_factory=list)
    next_step: str
