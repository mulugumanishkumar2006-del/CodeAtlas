import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.biie_economics_service import BIIEEconomicsService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/biie/economics", tags=["biie_economics"])


@router.get("/engineering-economics-suite")
def get_engineering_economics_suite(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 21–40: Engineering Economics Master Suite.
    Includes tech debt cost estimation, modernization ROI, cloud optimization,
    build/deployment failure costs, and executive financial dashboards.
    """
    try:
        return BIIEEconomicsService.get_engineering_economics_suite(db, repository_id)
    except Exception as e:
        logger.error(f"Error fetching engineering economics suite: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cloud-optimization")
def get_cloud_cost_optimization(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 24 & 33: Cloud Cost Optimization and AI Recommendations.
    """
    try:
        suite = BIIEEconomicsService.get_engineering_economics_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "cloud_cost_optimization": suite["cloud_cost_optimization"],
            "infrastructure_spending": suite["infrastructure_spending"],
            "ai_cost_recommendations": suite["ai_cost_recommendations"],
        }
    except Exception as e:
        logger.error(f"Error fetching cloud cost optimization: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/incident-build-costs")
def get_incident_build_costs(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 25–28: Build, Deployment, Productivity & Incident Failure Costs.
    """
    try:
        suite = BIIEEconomicsService.get_engineering_economics_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "team_productivity_cost": suite["team_productivity_cost"],
            "build_failure_cost": suite["build_failure_cost"],
            "deployment_failure_cost": suite["deployment_failure_cost"],
            "incident_cost_estimation": suite["incident_cost_estimation"],
        }
    except Exception as e:
        logger.error(f"Error fetching incident build costs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/modernization-roi")
def get_modernization_roi(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 21, 22, 30: Modernization ROI, Tech Debt Pricing & Net Present Value.
    """
    try:
        suite = BIIEEconomicsService.get_engineering_economics_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "tech_debt_cost_estimation": suite["tech_debt_cost_estimation"],
            "modernization_roi": suite["modernization_roi"],
            "refactoring_roi": suite["refactoring_roi"],
            "opportunity_cost_analysis": suite["opportunity_cost_analysis"],
        }
    except Exception as e:
        logger.error(f"Error fetching modernization ROI: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/executive-financial-dashboard")
def get_executive_financial_dashboard(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 40: Executive CFO/CTO Financial Overview.
    """
    try:
        suite = BIIEEconomicsService.get_engineering_economics_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "executive_financial_dashboard": suite["executive_financial_dashboard"],
            "cost_to_value_ratio": suite["cost_to_value_ratio"],
            "operational_efficiency": suite["operational_efficiency"],
            "portfolio_investment": suite["portfolio_investment"],
        }
    except Exception as e:
        logger.error(f"Error fetching executive financial dashboard: {e}")
        raise HTTPException(status_code=500, detail=str(e))
