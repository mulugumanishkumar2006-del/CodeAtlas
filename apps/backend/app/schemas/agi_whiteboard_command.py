# apps/backend/app/schemas/agi_whiteboard_command.py

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# 🌟 Signature Feature: AI Architecture Whiteboard DTOs
class WhiteboardNode(BaseModel):
    id: str
    label: str
    node_type: str  # "LoadBalancer", "Microservice", "Database", "Cache", "Queue"
    subsystem: str
    status: str  # "Active", "Migrating", "New"


class WhiteboardEdge(BaseModel):
    source_id: str
    target_id: str
    protocol: str  # "gRPC", "HTTPS", "mTLS"
    latency_ms: float


class InteractiveWhiteboardDiagram(BaseModel):
    title: str
    target_scale_users: str  # "50 Million Users"
    nodes: List[WhiteboardNode]
    edges: List[WhiteboardEdge]


class MigrationPhase(BaseModel):
    phase_number: int
    phase_title: str
    duration_months: int
    key_deliverable: str


class WhiteboardCostEstimate(BaseModel):
    monthly_cloud_infra_usd: float
    one_time_migration_usd: float
    total_scale_budget_usd: float
    annual_cost_savings_usd: float


class RiskMatrixItem(BaseModel):
    risk_title: str
    impact: str  # "High", "Medium", "Low"
    mitigation: str


class SprintBacklogItem(BaseModel):
    epic_id: str
    title: str
    story_points: int
    priority: str


class HiringPlanItem(BaseModel):
    role_title: str
    headcount: int
    quarter: str


class InfraPlanItem(BaseModel):
    component: str
    spec: str
    region: str


class RollbackStrategy(BaseModel):
    rollback_trigger: str
    automated_switchback_seconds: int
    data_reconciliation_plan: str


class WhiteboardSignatureResponse(BaseModel):
    prompt: str
    diagram: InteractiveWhiteboardDiagram
    migration_phases: List[MigrationPhase]
    cost_estimate: WhiteboardCostEstimate
    risk_matrix: List[RiskMatrixItem]
    sprint_backlog: List[SprintBacklogItem]
    hiring_plan: List[HiringPlanItem]
    infra_plan: List[InfraPlanItem]
    rollback_strategy: RollbackStrategy
    verdict: str  # "SIGNATURE_WHITEBOARD_GENERATED"


# Features 41-60 Auxiliary DTOs
class WhiteboardRedesignRequest(BaseModel):
    prompt: str = "Redesign this architecture for 50 million users."
    target_scale: Optional[str] = "50,000,000 Users"


class NaturalLanguagePlanResponse(BaseModel):
    nl_query: str
    generated_plan_steps: List[str]


class AISprintDesignerResponse(BaseModel):
    target_sprint: str
    allocated_tickets: List[Dict[str, Any]]
    total_points: int


class ExecutiveBriefingResponse(BaseModel):
    executive_summary: str
    key_takeaways: List[str]
    roi_pct: float


class GenomeExplorerResponse(BaseModel):
    repo_dna_signature: str
    primary_code_archetype: str
    genome_health_score: float


class ConfidenceHeatmapResponse(BaseModel):
    component_confidence_map: Dict[str, float]
    overall_confidence_pct: float
