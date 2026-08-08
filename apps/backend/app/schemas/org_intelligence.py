from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class HealthTrendDirection(str, Enum):
    IMPROVING = "IMPROVING"
    STABLE = "STABLE"
    DEGRADING = "DEGRADING"
    UNKNOWN = "UNKNOWN"


class RiskSeverityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class PriorityQuadrant(str, Enum):
    HIGH_IMPACT_HIGH_RISK = "HIGH_IMPACT_HIGH_RISK"
    HIGH_IMPACT_LOW_RISK = "HIGH_IMPACT_LOW_RISK"
    LOW_IMPACT_HIGH_RISK = "LOW_IMPACT_HIGH_RISK"
    LOW_IMPACT_LOW_RISK = "LOW_IMPACT_LOW_RISK"


class InitiativeStatus(str, Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    BLOCKED = "BLOCKED"
    COMPLETED = "COMPLETED"
    DELAYED = "DELAYED"
    CANCELLED = "CANCELLED"


class SinglePointType(str, Enum):
    TECHNICAL_SINGLE_POINT = "TECHNICAL_SINGLE_POINT"
    OWNERSHIP_SIGNAL = "OWNERSHIP_SIGNAL"
    UNKNOWN = "UNKNOWN"


class HealthDimensionModel(BaseModel):
    name: str
    current_score: float = Field(ge=0.0, le=100.0)
    trend: HealthTrendDirection = HealthTrendDirection.STABLE
    evidence_summary: str
    confidence: float = Field(default=0.92, ge=0.0, le=1.0)
    unknowns: List[str] = Field(default_factory=list)


class OrganizationHealthModel(BaseModel):
    organization_id: str
    overall_score: float = Field(default=84.5, ge=0.0, le=100.0)
    architecture_health: HealthDimensionModel
    dependency_health: HealthDimensionModel
    change_risk_health: HealthDimensionModel
    tech_debt_health: HealthDimensionModel
    security_health: HealthDimensionModel
    reliability_health: HealthDimensionModel
    knowledge_health: HealthDimensionModel


class SinglePointOfFailureModel(BaseModel):
    spof_id: str
    title: str
    type: SinglePointType
    target_entity: str
    impact_radius: int = 4
    evidence: str
    confidence: float = 0.90
    recommended_action: str


class OrganizationPriorityItemModel(BaseModel):
    priority_id: str
    title: str
    category: str  # ARCHITECTURE, DEPENDENCY, SECURITY, TECH_DEBT, MIGRATION
    quadrant: PriorityQuadrant
    impact_score: float = 85.0
    risk_score: float = 75.0
    confidence: float = 0.94
    evidence_summary: str
    recommended_action: str


class EngineeringInitiativeModel(BaseModel):
    initiative_id: str
    organization_id: str
    title: str
    objective: str
    problem_summary: str
    status: InitiativeStatus = InitiativeStatus.IN_PROGRESS
    progress_percentage: float = Field(default=45.0, ge=0.0, le=100.0)
    affected_teams: List[str] = Field(default_factory=list)
    affected_repositories: List[str] = Field(default_factory=list)
    milestones: List[str] = Field(default_factory=list)
    owner: str = "VP of Engineering"


class MigrationItemModel(BaseModel):
    migration_id: str
    title: str
    source_tech: str
    target_tech: str
    affected_services_count: int = 5
    progress_percentage: float = 60.0
    risk_score: float = 35.0
    remaining_work_summary: str


class TechnologyLandscapeModel(BaseModel):
    languages: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    infrastructure: List[str] = Field(default_factory=list)
    fragmentation_signals: List[str] = Field(default_factory=list)
    platform_opportunities: List[str] = Field(default_factory=list)


class ExecutiveBriefingModel(BaseModel):
    organization_id: str
    what_changed: List[str] = Field(default_factory=list)
    what_at_risk: List[str] = Field(default_factory=list)
    what_matters_most: List[str] = Field(default_factory=list)
    what_is_improving: List[str] = Field(default_factory=list)
    what_is_getting_worse: List[str] = Field(default_factory=list)
    needed_decisions: List[str] = Field(default_factory=list)
    recommended_next_steps: List[str] = Field(default_factory=list)


class OrganizationSnapshotModel(BaseModel):
    snapshot_id: str
    organization_id: str
    health: OrganizationHealthModel
    single_points_of_failure: List[SinglePointOfFailureModel] = Field(default_factory=list)
    priorities: List[OrganizationPriorityItemModel] = Field(default_factory=list)
    initiatives: List[EngineeringInitiativeModel] = Field(default_factory=list)
    migrations: List[MigrationItemModel] = Field(default_factory=list)
    tech_landscape: TechnologyLandscapeModel
    created_at: str


class AIArchitectQueryRequest(BaseModel):
    organization_id: str
    question: str


class AIArchitectQueryResponse(BaseModel):
    organization_id: str
    question: str
    answer: str
    evidence_citations: List[str] = Field(default_factory=list)
    confidence: float = 0.95
    unknowns: List[str] = Field(default_factory=list)
    recommended_next_step: str
