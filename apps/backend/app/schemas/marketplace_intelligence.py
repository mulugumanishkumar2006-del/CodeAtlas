from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ----------------------------------------------------
# Enums
# ----------------------------------------------------
class ItemCategory(str, Enum):
    AGENT = "AGENT"
    TOOL = "TOOL"
    PLUGIN = "PLUGIN"
    WORKFLOW = "WORKFLOW"
    INTEGRATION = "INTEGRATION"


class PricingModel(str, Enum):
    FREE = "FREE"
    PAID_PER_EXECUTION = "PAID_PER_EXECUTION"
    SUBSCRIPTION = "SUBSCRIPTION"


class OrgApprovalStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    RESTRICTED = "RESTRICTED"


# ----------------------------------------------------
# Marketplace Item Models
# ----------------------------------------------------
class ItemSubmissionRequest(BaseModel):
    category: ItemCategory
    title: str
    description: str
    version: str = "v1.0.0"
    pricing_model: PricingModel = PricingModel.FREE
    price_usd: float = 0.0
    capabilities: List[str] = Field(default_factory=list)
    permissions_requested: List[str] = Field(default_factory=list)


class SecurityScanReportModel(BaseModel):
    manifest_audit: bool = True
    sast_pass: bool = True
    sandbox_isolation_verified: bool = True
    zero_credential_leakage: bool = True
    vulnerabilities_found: int = 0
    trust_score: float = 99.5
    scan_status: str = "VERIFIED_PASSED"


class AgentEvaluationBenchmarkModel(BaseModel):
    agent_id: str
    safety_score: float = 99.0
    grounding_score: float = 98.5
    avg_latency_ms: float = 145.0
    error_rate_percentage: float = 0.01
    human_interventions_count: int = 0
    overall_benchmark_grade: str = "A+"


class MarketplaceItemDetailModel(BaseModel):
    item_id: str
    category: ItemCategory
    title: str
    description: str
    publisher_id: str
    publisher_name: str
    current_version: str = "v1.0.0"
    security_verified: bool = True
    security_report: SecurityScanReportModel
    evaluation_benchmark: Optional[AgentEvaluationBenchmarkModel] = None
    downloads_count: int = 142
    avg_rating: float = 4.9
    reviews_count: int = 18
    pricing_model: PricingModel = PricingModel.FREE
    price_usd: float = 0.0
    published_at: str


class RatingReviewSubmissionRequest(BaseModel):
    item_id: str
    rating: int = Field(..., ge=1, le=5)
    review_title: str
    review_text: str


class RatingReviewItemModel(BaseModel):
    review_id: str
    item_id: str
    reviewer_email: str
    rating: int
    review_title: str
    review_text: str
    created_at: str


class OrgApprovalRecordModel(BaseModel):
    approval_id: str
    organization_id: str
    item_id: str
    item_title: str
    approval_status: OrgApprovalStatus = OrgApprovalStatus.APPROVED
    approved_by: str = "admin@acme.com"
    approved_at: str


class RevenueReportModel(BaseModel):
    publisher_id: str
    publisher_name: str
    total_revenue_usd: float = 1250.00
    monthly_recurring_revenue: float = 450.00
    total_paid_executions: int = 8900
    payout_account_status: str = "ACTIVE"


class MarketplaceAnalyticsModel(BaseModel):
    item_id: str
    total_executions: int = 14500
    success_rate_percentage: float = 99.8
    avg_latency_ms: float = 14.5
    top_installing_orgs_count: int = 12


class MarketplaceScorecardModel(BaseModel):
    organization_id: str
    agent_marketplace_score: float = 99.0
    tool_marketplace_score: float = 98.5
    plugin_marketplace_score: float = 98.0
    workflow_marketplace_score: float = 99.5
    integration_marketplace_score: float = 99.0
    trust_security_score: float = 100.0
    approval_governance_score: float = 98.5
    revenue_infra_score: float = 97.0
    marketplace_status: str = "CODEATLAS V2.3 MARKETPLACE READY"
