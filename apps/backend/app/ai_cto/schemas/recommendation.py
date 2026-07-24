from pydantic import BaseModel, Field


class CostOptimization(BaseModel):
    title: str = Field(..., description="Actionable optimization recommendation")
    target: str = Field(
        ..., description="Cloud resource target, e.g. EC2, Postgres, Cache"
    )
    current_cost_usd: float = Field(..., description="Estimated current monthly cost")
    proposed_cost_usd: float = Field(
        ..., description="Estimated monthly cost after optimization"
    )
    action_required: str = Field(
        ..., description="Concrete steps required to realize the savings"
    )
    performance_impact: str = Field(
        ..., description="Description of performance or availability trade-offs"
    )


class HiringRecommendation(BaseModel):
    role: str = Field(
        ..., description="Proposed engineering role, e.g. DevOps Engineer, Backend Lead"
    )
    count: int = Field(..., description="Number of resources needed")
    priority: str = Field(..., description="Hiring priority: HIGH | MEDIUM | LOW")
    justification: str = Field(
        ..., description="Codebase-backed rationale for this hire"
    )


class RiskProfile(BaseModel):
    category: str = Field(
        ...,
        description="Risk category: Technical Debt | Security | Reliability | Bus Factor",
    )
    risk_type: str = Field(
        ...,
        description="Specific risk class, e.g. Circular Import, Single Maintainer, Memory Leaks",
    )
    severity: str = Field(
        ..., description="Severity level: CRITICAL | HIGH | MEDIUM | LOW"
    )
    description: str = Field(
        ..., description="Detailed description of the risk context"
    )
    mitigation_action: str = Field(
        ..., description="Proposed refactoring or management action to mitigate risk"
    )
