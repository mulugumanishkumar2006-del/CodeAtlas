import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.biie_primary_service import BIIEPrimaryService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/biie/analytics", tags=["biie_analytics"])


class CustomerImpactEvaluationRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    target_service: str = Field(
        "payment_service", description="Target service to evaluate"
    )


@router.get("/capability-graph")
def get_business_capability_graph(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 1: Business Capability Graph.
    Maps Business Domains -> Products -> Features -> Customers -> Revenue Streams -> Teams -> Services.
    """
    try:
        return BIIEPrimaryService.build_business_capability_graph(db, repository_id)
    except Exception as e:
        logger.error(f"Error building capability graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/revenue-graph")
def get_revenue_dependency_graph(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 2: Revenue Dependency Graph.
    Identifies revenue-generating services, payment-stopping APIs, and failure risks.
    """
    try:
        return BIIEPrimaryService.build_revenue_dependency_graph(db, repository_id)
    except Exception as e:
        logger.error(f"Error building revenue graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/customer-impact")
def evaluate_customer_impact(
    req: CustomerImpactEvaluationRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 3: Customer Impact Engine.
    Evaluates blast radius by Region, Tier (Enterprise/Growth), and Internal users.
    """
    try:
        return BIIEPrimaryService.evaluate_customer_impact_engine(
            db, req.repository_id, req.target_service
        )
    except Exception as e:
        logger.error(f"Error evaluating customer impact: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/criticality-score")
def get_business_criticality_score(
    repository_id: str = Query(..., description="Target repository ID"),
    service_name: str = Query("payment_service", description="Target microservice"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 4: Business Criticality Score (0–100).
    Weighted calculation across Revenue, Traffic, SLA, Usage, and Ops dependency.
    """
    try:
        return BIIEPrimaryService.calculate_business_criticality_score(
            db, repository_id, service_name
        )
    except Exception as e:
        logger.error(f"Error calculating criticality score: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/product-dependency-graph")
def get_product_dependency_graph(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 5: Product Dependency Graph.
    Tree topology: Product -> Feature -> Microservice -> API -> Database Table.
    """
    try:
        return BIIEPrimaryService.build_product_dependency_graph(db, repository_id)
    except Exception as e:
        logger.error(f"Error building product dependency graph: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/business-analytics-suite")
def get_business_analytics_suite(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 6–20: Business Analytics Suite.
    Comprehensive analysis including revenue risk, heatmaps, hotspots, SPOF continuity,
    adoption trends, and modernization score.
    """
    try:
        return BIIEPrimaryService.get_business_analytics_suite(db, repository_id)
    except Exception as e:
        logger.error(f"Error building business analytics suite: {e}")
        raise HTTPException(status_code=500, detail=str(e))
