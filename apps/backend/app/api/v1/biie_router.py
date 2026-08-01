import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.biie_service import BIIEService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/biie", tags=["biie"])


# --- Request/Response Schemas ---
class BusinessCapabilityRegisterRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    capability_name: str = Field(..., description="Name of business capability")
    description: str = Field("", description="Detailed capability description")
    owner_team: str = Field("Core Platform", description="Owning engineering team")
    tier: str = Field("Tier 1 - Mission Critical", description="Criticality tier")
    hourly_revenue_usd: float = Field(
        15000.0, description="Hourly revenue generated ($/hr)"
    )
    total_arr_usd: float = Field(
        2500000.0, description="Total annual recurring revenue ($)"
    )
    mapped_services: List[str] = Field(
        default_factory=list, description="List of mapped microservice names"
    )
    mapped_code_nodes: List[str] = Field(
        default_factory=list, description="List of mapped AST code symbols/paths"
    )
    mapped_db_schemas: Optional[List[str]] = Field(
        default_factory=list, description="List of mapped DB tables/schemas"
    )
    target_sla_up_pct: float = Field(99.99, description="Target SLA uptime %")


class ImpactAnalysisRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    target_service: str = Field(
        ..., description="Microservice or module being changed/analyzed"
    )
    target_commit_or_pr: Optional[str] = Field(
        "PR #142 (Refactor Core Logic)", description="PR title or commit hash"
    )


class CostOfInactionRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    target_service_or_module: str = Field(
        ..., description="Service or module with technical debt"
    )
    horizon_days: int = Field(90, description="Forecast horizon in days (30, 60, 90)")


class ExecutiveBriefRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    target_audience: str = Field(
        "CTO", description="Target audience: CTO, CEO, CFO, or BOARD"
    )


# --- API Routes ---


@router.post("/connectors/sync")
def sync_business_connectors(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Synchronizes external telemetry & metadata from connected business systems:
    CRM, ERP, Analytics, Feature Flags, SLA Metrics, Incident Logs.
    """
    try:
        result = BIIEService.sync_business_systems(db)
        return result
    except Exception as e:
        logger.error(f"Error syncing business connectors: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/capabilities")
def list_business_capabilities(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Lists all registered business capabilities mapped to software architecture.
    """
    try:
        capabilities = BIIEService.seed_default_capabilities_if_empty(db, repository_id)
        return {
            "repository_id": repository_id,
            "capabilities_count": len(capabilities),
            "capabilities": [
                {
                    "id": c.id,
                    "capability_name": c.capability_name,
                    "description": c.description,
                    "owner_team": c.owner_team,
                    "tier": c.tier,
                    "target_sla_up_pct": c.target_sla_up_pct,
                    "hourly_revenue_usd": c.hourly_revenue_usd,
                    "total_arr_usd": c.total_arr_usd,
                    "mapped_services": c.mapped_services,
                    "mapped_code_nodes": c.mapped_code_nodes,
                    "mapped_db_schemas": c.mapped_db_schemas,
                    "criticality_score": c.criticality_score,
                }
                for c in capabilities
            ],
        }
    except Exception as e:
        logger.error(f"Error listing business capabilities: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/capabilities")
def register_business_capability(
    req: BusinessCapabilityRegisterRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Registers or updates a business capability mapping to software architecture nodes.
    """
    try:
        cap = BIIEService.register_business_capability(
            db=db,
            repository_id=req.repository_id,
            capability_name=req.capability_name,
            description=req.description,
            owner_team=req.owner_team,
            tier=req.tier,
            hourly_revenue_usd=req.hourly_revenue_usd,
            total_arr_usd=req.total_arr_usd,
            mapped_services=req.mapped_services,
            mapped_code_nodes=req.mapped_code_nodes,
            mapped_db_schemas=req.mapped_db_schemas,
            target_sla_up_pct=req.target_sla_up_pct,
        )
        return {
            "status": "success",
            "message": f"Registered capability '{cap.capability_name}'",
            "capability_id": cap.id,
        }
    except Exception as e:
        logger.error(f"Error registering business capability: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/impact-analysis")
def calculate_impact_analysis(
    req: ImpactAnalysisRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Performs real-time impact analysis for a service change or PR.
    Calculates customer blast radius, ARR at risk, hourly revenue exposure,
    product launch blockers, and capability degradation.
    """
    try:
        record = BIIEService.calculate_impact_analysis(
            db=db,
            repository_id=req.repository_id,
            target_service=req.target_service,
            target_commit_or_pr=req.target_commit_or_pr,
        )
        return {
            "id": record.id,
            "repository_id": record.repository_id,
            "target_service": record.target_service,
            "target_commit_or_pr": record.target_commit_or_pr,
            "customer_blast_radius_total": record.customer_blast_radius_total,
            "enterprise_customers_impacted": record.enterprise_customers_impacted,
            "growth_customers_impacted": record.growth_customers_impacted,
            "total_mau_affected": record.total_mau_affected,
            "revenue_at_risk_hourly_usd": record.revenue_at_risk_hourly_usd,
            "arr_threatened_usd": record.arr_threatened_usd,
            "sla_breach_penalty_per_hour_usd": record.sla_breach_penalty_per_hour_usd,
            "capability_degradation_pct": record.capability_degradation_pct,
            "risk_level": record.risk_level,
            "impacted_capabilities": record.impacted_capabilities,
            "product_launch_blockers": record.product_launch_blockers,
            "cascading_service_dependencies": record.cascading_service_dependencies,
            "created_at": record.created_at.isoformat(),
        }
    except Exception as e:
        logger.error(f"Error calculating impact analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/cost-of-inaction")
def calculate_cost_of_inaction(
    req: CostOfInactionRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Computes 30/60/90-day Cost of Inaction (cost of not fixing technical debt/issues)
    and predicts refactoring ROI %.
    """
    try:
        forecast = BIIEService.calculate_cost_of_inaction(
            db=db,
            repository_id=req.repository_id,
            target_service_or_module=req.target_service_or_module,
            horizon_days=req.horizon_days,
        )
        return {
            "id": forecast.id,
            "repository_id": forecast.repository_id,
            "target_service_or_module": forecast.target_service_or_module,
            "horizon_days": forecast.horizon_days,
            "total_cost_of_inaction_usd": forecast.total_cost_of_inaction_usd,
            "tech_debt_compound_interest_usd": forecast.tech_debt_compound_interest_usd,
            "projected_churn_arr_usd": forecast.projected_churn_arr_usd,
            "projected_incident_cost_usd": forecast.projected_incident_cost_usd,
            "sla_penalty_exposure_usd": forecast.sla_penalty_exposure_usd,
            "risk_probability_pct": forecast.risk_probability_pct,
            "recommended_remediation_hours": forecast.recommended_remediation_hours,
            "estimated_remediation_cost_usd": forecast.estimated_remediation_cost_usd,
            "net_roi_pct": forecast.net_roi_pct,
            "forecast_breakdown": forecast.forecast_breakdown_json,
            "created_at": forecast.created_at.isoformat(),
        }
    except Exception as e:
        logger.error(f"Error calculating cost of inaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/executive-brief")
def generate_executive_brief(
    req: ExecutiveBriefRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Generates automated executive decision briefing (tailored for CTO, CEO, CFO, or Board).
    """
    try:
        brief = BIIEService.generate_executive_intelligence_brief(
            db=db,
            repository_id=req.repository_id,
            target_audience=req.target_audience,
        )
        return {
            "id": brief.id,
            "repository_id": brief.repository_id,
            "brief_title": brief.brief_title,
            "target_audience": brief.target_audience,
            "executive_summary": brief.executive_summary,
            "revenue_at_risk_summary": brief.revenue_at_risk_summary,
            "capabilities_threatened_summary": brief.capabilities_threatened_summary,
            "cost_of_inaction_summary": brief.cost_of_inaction_summary,
            "strategic_action_recommendations": brief.strategic_action_recommendations,
            "key_metrics_snapshot": brief.key_metrics_snapshot,
            "created_at": brief.created_at.isoformat(),
        }
    except Exception as e:
        logger.error(f"Error generating executive brief: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard-summary")
def get_dashboard_summary(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Fetches aggregate metrics, capabilities list, latest impact record, cost of inaction, and graph nodes.
    """
    try:
        summary = BIIEService.get_biie_dashboard_summary(
            db=db, repository_id=repository_id
        )
        return summary
    except Exception as e:
        logger.error(f"Error fetching BIIE dashboard summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))
