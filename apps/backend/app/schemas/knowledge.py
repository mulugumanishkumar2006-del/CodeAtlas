import json
from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, Field, field_validator, model_validator


class OwnershipDistributionResponse(BaseModel):
    author_name: str
    author_email: str
    files_owned: int
    ownership_percentage: float
    last_commit_at: Optional[datetime] = None
    risk_score: float

    class Config:
        from_attributes = True


class KnowledgeRiskItemResponse(BaseModel):
    file_path: str
    risk_level: str
    reason: str
    owner_name: str
    owner_email: str
    mitigation_action: str

    class Config:
        from_attributes = True


class DocumentationGapResponse(BaseModel):
    file_path: str
    complexity: int
    documentation_coverage: float
    comment_lines: int
    code_lines: int
    gap_severity: str

    class Config:
        from_attributes = True


class UndocumentedArchitectureNodeResponse(BaseModel):
    id: str
    name: str
    type: str
    coupling: float
    reason: str
    mitigation: str

    class Config:
        from_attributes = True


class ModuleOwnershipResponse(BaseModel):
    file_path: str
    primary_owner_name: str
    primary_owner_email: str
    secondary_owner_name: Optional[str] = None
    secondary_owner_email: Optional[str] = None
    num_contributors: int
    last_modified_at: Optional[datetime] = None
    ownership_concentration: float
    risk_level: str
    knowledge_risk_score: float
    risk_reasons: List[str] = Field(default_factory=list)

    @field_validator("risk_reasons", mode="before")
    @classmethod
    def parse_reasons(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [v]
        return v or []

    class Config:
        from_attributes = True


class DocumentationReportResponse(BaseModel):
    documentation_score: float
    readme_score: float
    adr_score: float
    api_doc_score: float
    inline_comments_score: float
    missing_docs_count: int
    readme_details: Optional[str] = None
    adr_details: Optional[str] = None
    api_doc_details: Optional[str] = None
    inline_comments_details: Optional[str] = None

    class Config:
        from_attributes = True


class KnowledgeGapDetailResponse(BaseModel):
    file_path: str
    complexity: int
    documentation_coverage: float
    num_contributors: int
    recent_changes_count: int
    risk_score: float
    risk_level: str
    reasons: str
    mitigation_action: str

    class Config:
        from_attributes = True


class ExpertiseGraphNodeResponse(BaseModel):
    id: str
    name: str
    type: str

    class Config:
        from_attributes = True


class ExpertiseGraphEdgeResponse(BaseModel):
    source: str
    target: str
    type: str

    class Config:
        from_attributes = True


class ExpertiseGraphResponse(BaseModel):
    nodes: List[ExpertiseGraphNodeResponse] = Field(default_factory=list)
    edges: List[ExpertiseGraphEdgeResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True


class KnowledgeTransferPlanResponse(BaseModel):
    file_path: str
    current_owners_summary: str
    steps: List[str] = Field(default_factory=list)
    current_risk_score: float
    projected_risk_score: float

    @model_validator(mode="before")
    @classmethod
    def from_orm_custom(cls, data):
        if not isinstance(data, dict):
            steps_val = getattr(data, "steps_json", "[]")
            steps = []
            if isinstance(steps_val, str):
                try:
                    steps = json.loads(steps_val)
                except Exception:
                    steps = [steps_val]
            return {
                "file_path": data.file_path,
                "current_owners_summary": data.current_owners_summary,
                "steps": steps,
                "current_risk_score": data.current_risk_score,
                "projected_risk_score": data.projected_risk_score,
            }
        return data

    class Config:
        from_attributes = True


class AIDocumentationAdvisorResponse(BaseModel):
    missing_adrs: List[str] = Field(default_factory=list)
    missing_api_docs: List[str] = Field(default_factory=list)
    missing_readme_sections: List[str] = Field(default_factory=list)
    missing_architecture_diagrams: List[str] = Field(default_factory=list)
    missing_onboarding_guides: List[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def from_orm_custom(cls, data):
        if not isinstance(data, dict):

            def parse_list(val):
                if isinstance(val, str):
                    try:
                        return json.loads(val)
                    except Exception:
                        return [x.strip() for x in val.split(",") if x.strip()]
                return val or []

            return {
                "missing_adrs": parse_list(data.missing_adrs),
                "missing_api_docs": parse_list(data.missing_api_docs),
                "missing_readme_sections": parse_list(data.missing_readme_sections),
                "missing_architecture_diagrams": parse_list(
                    data.missing_architecture_diagrams
                ),
                "missing_onboarding_guides": parse_list(data.missing_onboarding_guides),
            }
        return data

    class Config:
        from_attributes = True


class KnowledgeMemoryResponse(BaseModel):
    id: int
    topic: str
    answer: str
    source_type: str
    source_path: str

    class Config:
        from_attributes = True


class KnowledgeDashboardResponse(BaseModel):
    repo_id: str
    bus_factor: int
    knowledge_concentration: float
    documentation_quality: float
    team_resilience_score: float
    overall_risk: str
    ownership_distribution: List[OwnershipDistributionResponse] = Field(
        default_factory=list
    )
    risk_items: List[KnowledgeRiskItemResponse] = Field(default_factory=list)
    documentation_gaps: List[DocumentationGapResponse] = Field(default_factory=list)
    undocumented_architecture: List[UndocumentedArchitectureNodeResponse] = Field(
        default_factory=list
    )
    module_ownerships: List[ModuleOwnershipResponse] = Field(default_factory=list)
    documentation_report: Optional[DocumentationReportResponse] = None
    knowledge_gaps: List[KnowledgeGapDetailResponse] = Field(default_factory=list)
    expertise_graph: Optional[ExpertiseGraphResponse] = None
    transfer_plans: List[KnowledgeTransferPlanResponse] = Field(default_factory=list)
    doc_advisor: Optional[AIDocumentationAdvisorResponse] = None
    generated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


class KnowledgeEvolutionSnapshotResponse(BaseModel):
    id: int
    timestamp: datetime
    event_type: str
    description: str
    affected_file: Optional[str] = None
    bus_factor: int
    risk_score: float

    class Config:
        from_attributes = True


class ExecutiveKnowledgeResponse(BaseModel):
    bus_factor: int
    documentation_score: float
    knowledge_risk: float
    critical_knowledge_gaps_count: int
    team_resilience: float
    documentation_coverage: float
    recommended_transfer_task: str

    class Config:
        from_attributes = True


class BusFactorResponse(BaseModel):
    bus_factor: int
    overall_risk: str
    knowledge_concentration: float

    class Config:
        from_attributes = True


class OwnershipSchemaResponse(BaseModel):
    id: int
    repo_id: str
    module: str
    primary_owner: str
    secondary_owner: Optional[str] = None
    contributors: int

    class Config:
        from_attributes = True


class DocumentationResponse(BaseModel):
    id: int
    repo_id: str
    coverage: float
    missing_docs: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def parse_json_fields(cls, data: Any) -> Any:
        if hasattr(data, "missing_docs") and isinstance(data.missing_docs, str):
            try:
                data.missing_docs = json.loads(data.missing_docs)
            except Exception:
                data.missing_docs = []
        if hasattr(data, "recommendations") and isinstance(data.recommendations, str):
            try:
                data.recommendations = json.loads(data.recommendations)
            except Exception:
                data.recommendations = []
        return data

    class Config:
        from_attributes = True
