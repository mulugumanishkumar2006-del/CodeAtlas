import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.biie_risk_service import BIIERiskService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/biie/risk", tags=["biie_risk"])


class OutageSimulationRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    duration_hours: float = Field(2.0, description="Outage duration in hours")


@router.get("/risk-intelligence-suite")
def get_risk_intelligence_suite(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 41–60: Master Business Risk Intelligence Suite.
    Includes revenue loss prediction, SLA breach forecasting, compliance/privacy assessments,
    vendor dependency analysis, outage simulation, and executive risk matrix.
    """
    try:
        return BIIERiskService.get_risk_intelligence_suite(db, repository_id)
    except Exception as e:
        logger.error(f"Error fetching risk intelligence suite: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/outage-simulation")
def simulate_business_outage(
    req: OutageSimulationRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 53: Business Outage Simulator.
    Simulates dry-run outage financial loss, SLA penalty credits, and recovery metrics.
    """
    try:
        return BIIERiskService.simulate_business_outage(
            db, req.repository_id, req.duration_hours
        )
    except Exception as e:
        logger.error(f"Error simulating business outage: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/compliance-privacy")
def get_compliance_and_privacy(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 44–46: Compliance, Regulatory Readiness & Data Privacy Assessment.
    """
    try:
        suite = BIIERiskService.get_risk_intelligence_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "compliance_impact": suite["compliance_impact"],
            "regulatory_readiness": suite["regulatory_readiness"],
            "data_privacy_assessment": suite["data_privacy_assessment"],
        }
    except Exception as e:
        logger.error(f"Error fetching compliance & privacy assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/vendor-supply-chain")
def get_vendor_and_supply_chain(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 48–50: Vendor Dependency, Supply Chain & Third-Party API Risks.
    """
    try:
        suite = BIIERiskService.get_risk_intelligence_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "vendor_dependency_analysis": suite["vendor_dependency_analysis"],
            "supply_chain_risk": suite["supply_chain_risk"],
            "third_party_api_risk": suite["third_party_api_risk"],
        }
    except Exception as e:
        logger.error(f"Error fetching vendor & supply chain risk: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/executive-matrix-heatmap")
def get_executive_matrix_heatmap(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 58–60: Executive Risk Matrix, Portfolio Heatmap & Resilience Index.
    """
    try:
        suite = BIIERiskService.get_risk_intelligence_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "executive_risk_matrix": suite["executive_risk_matrix"],
            "portfolio_risk_heatmap": suite["portfolio_risk_heatmap"],
            "business_resilience_index": suite["business_resilience_index"],
        }
    except Exception as e:
        logger.error(f"Error fetching executive risk matrix: {e}")
        raise HTTPException(status_code=500, detail=str(e))
