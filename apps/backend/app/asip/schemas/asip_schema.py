# apps/backend/app/asip/schemas/asip_schema.py

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class MondayBriefingResponse(BaseModel):
    repository_id: str = Field(..., description="Repository ID being evaluated")
    timestamp: str = Field(..., description="Briefing generation timestamp")
    repos_needing_attention_count: int = Field(
        ..., description="Number of repositories requiring attention"
    )
    attention_repositories: List[Dict[str, Any]] = Field(default_factory=list)
    architecture_drift_alerts: List[Dict[str, Any]] = Field(default_factory=list)
    service_bottleneck_forecasts: List[Dict[str, Any]] = Field(default_factory=list)
    security_risk_delta: Dict[str, Any] = Field(default_factory=dict)
    tech_debt_growth_rate_pct: float = Field(
        ..., description="Weekly technical debt growth velocity %"
    )
    deployment_risk_forecast: List[Dict[str, Any]] = Field(default_factory=list)
    high_roi_modernization_opportunities: List[Dict[str, Any]] = Field(
        default_factory=list
    )


class ASIPSimulationRequest(BaseModel):
    scenario_type: str = Field(
        default="user_scale_100m",
        description="Scenario type to simulate (user_scale_100m, framework_migration, microservices_split)",
    )
    target_users: int = Field(default=100000000, description="User scale target")
    migration_target: Optional[str] = Field(
        default=None, description="Optional target framework or cloud platform"
    )


class ASIPSimulationResponse(BaseModel):
    repository_id: str
    scenario_type: str
    predicted_latency_p99_ms: float
    predicted_monthly_cost_usd: float
    predicted_reliability_score_pct: float
    predicted_security_risk_score: float
    simulation_logs: List[str]
    verdict: str


class GovernancePolicyResponse(BaseModel):
    repository_id: str
    compliance_score_pct: float
    enforced_policies_count: int
    policies: List[Dict[str, Any]]
    pending_approvals: List[Dict[str, Any]]


class HumanApprovalRequest(BaseModel):
    recommendation_id: str
    approved: bool
    comments: Optional[str] = None
