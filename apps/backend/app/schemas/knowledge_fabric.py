from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class KnowledgeEntityType(str, Enum):
    REPOSITORY = "REPOSITORY"
    SERVICE = "SERVICE"
    FILE = "FILE"
    FUNCTION = "FUNCTION"
    DECISION = "DECISION"
    ADR = "ADR"
    INVESTIGATION = "INVESTIGATION"
    RISK = "RISK"
    PREDICTION = "PREDICTION"
    PREVENTION_PLAN = "PREVENTION_PLAN"
    MIGRATION = "MIGRATION"
    DOCUMENT = "DOCUMENT"
    LESSON = "LESSON"
    TECHNOLOGY = "TECHNOLOGY"
    TEAM = "TEAM"


class KnowledgeRelationType(str, Enum):
    DEPENDS_ON = "DEPENDS_ON"
    CALLS = "CALLS"
    OWNED_BY = "OWNED_BY"
    DECIDED_BY = "DECIDED_BY"
    INVESTIGATED_BY = "INVESTIGATED_BY"
    SUPERSEDES = "SUPERSEDES"
    CONFLICTS_WITH = "CONFLICTS_WITH"
    RESULTED_IN = "RESULTED_IN"
    DERIVED_FROM = "DERIVED_FROM"


class KnowledgeFreshnessLevel(str, Enum):
    FRESH = "FRESH"
    AGING = "AGING"
    STALE = "STALE"
    EXPIRED = "EXPIRED"


class KnowledgeValidationStatus(str, Enum):
    AI_GENERATED = "AI_GENERATED"
    HUMAN_VERIFIED = "HUMAN_VERIFIED"
    SYSTEM_DERIVED = "SYSTEM_DERIVED"
    UNVERIFIED = "UNVERIFIED"


class KnowledgeEntityModel(BaseModel):
    entity_id: str
    organization_id: str
    repository_id: str
    entity_type: KnowledgeEntityType
    name: str
    description: str
    provenance_source: str = "ADR-001 / Commit Log"
    validation_status: KnowledgeValidationStatus = KnowledgeValidationStatus.HUMAN_VERIFIED
    freshness: KnowledgeFreshnessLevel = KnowledgeFreshnessLevel.FRESH
    confidence: float = Field(default=0.96, ge=0.0, le=1.0)
    created_at: str


class KnowledgeRelationshipModel(BaseModel):
    relation_id: str
    source_entity_id: str
    target_entity_id: str
    relation_type: KnowledgeRelationType
    evidence_summary: str
    confidence: float = 0.95


class KnowledgeConflictModel(BaseModel):
    conflict_id: str
    entity_id: str
    entity_name: str
    statement_a: str
    source_a: str
    statement_b: str
    source_b: str
    status: str = "REVIEW_REQUIRED"
    confidence: float = 0.92
    created_at: str


class EngineeringLessonModel(BaseModel):
    lesson_id: str
    organization_id: str
    context: str
    action_taken: str
    observed_outcome: str
    lesson_text: str
    evidence_summary: str
    confidence: float = 0.94


class WhyHistoryResponseModel(BaseModel):
    question: str
    answer: str
    target_entity_name: str
    rationale_summary: str
    decision_citations: List[str] = Field(default_factory=list)
    evidence_citations: List[str] = Field(default_factory=list)
    confidence: float = 0.96
    unknowns: List[str] = Field(default_factory=list)


class KnowledgeExplorerNodeModel(BaseModel):
    id: str
    label: str
    type: str
    freshness: str


class KnowledgeExplorerEdgeModel(BaseModel):
    source: str
    target: str
    label: str


class KnowledgeExplorerGraphModel(BaseModel):
    root_entity_id: str
    nodes: List[KnowledgeExplorerNodeModel] = Field(default_factory=list)
    edges: List[KnowledgeExplorerEdgeModel] = Field(default_factory=list)
    total_relationships: int = 0


class KnowledgeAIRequest(BaseModel):
    organization_id: str
    question: str


class KnowledgeAIResponse(BaseModel):
    organization_id: str
    question: str
    answer: str
    evidence_citations: List[str] = Field(default_factory=list)
    timeline_summary: str
    confidence: float = 0.96
    unknowns: List[str] = Field(default_factory=list)
