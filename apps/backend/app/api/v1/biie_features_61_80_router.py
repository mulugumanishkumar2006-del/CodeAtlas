import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.biie_ai_advisor_service import BIIEAIAdvisorService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/biie/ai-advisor", tags=["biie_ai_advisor"])


class BusinessCaseGenerateRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    target_module: str = Field(
        "payment_service", description="Target module for refactoring proposal"
    )


class StrategicSimulationRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    investment_amount_usd: float = Field(
        15000.0, description="Investment budget amount ($)"
    )


@router.get("/advisor-suite")
def get_ai_advisor_suite(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 61–80: Master AI Business Advisor Suite.
    Includes AI CTO Business Advisor, AI Product Strategy, AI Business Case Generator,
    AI Product Roadmaps, AI Architecture ROI, and AI Strategic Simulations.
    """
    try:
        return BIIEAIAdvisorService.get_ai_advisor_suite(db, repository_id)
    except Exception as e:
        logger.error(f"Error fetching AI advisor suite: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/business-case-generator")
def generate_ai_business_case(
    req: BusinessCaseGenerateRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 67: AI Business Case Generator.
    Generates automated executive-grade business cases for refactoring.
    """
    try:
        return BIIEAIAdvisorService.generate_ai_business_case(
            db, req.repository_id, req.target_module
        )
    except Exception as e:
        logger.error(f"Error generating AI business case: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/product-roadmap")
def get_ai_product_roadmap(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 69: AI Product Roadmaps (Q1–Q4 Modernization Timeline).
    """
    try:
        suite = BIIEAIAdvisorService.get_ai_advisor_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "ai_product_roadmaps": suite["ai_product_roadmaps"],
        }
    except Exception as e:
        logger.error(f"Error fetching AI product roadmap: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/strategic-simulation")
def run_strategic_simulation(
    req: StrategicSimulationRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 80: AI Strategic Simulation Engine.
    Simulates multi-option strategic scenarios for executive decision making.
    """
    try:
        return BIIEAIAdvisorService.run_strategic_simulation(
            db, req.repository_id, req.investment_amount_usd
        )
    except Exception as e:
        logger.error(f"Error running strategic simulation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cto-recommendations")
def get_cto_recommendations(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 61 & 74: AI CTO Strategic Recommendations & Directives.
    """
    try:
        suite = BIIEAIAdvisorService.get_ai_advisor_suite(db, repository_id)
        return {
            "repository_id": repository_id,
            "ai_cto_advisor_summary": suite["ai_cto_advisor_summary"],
            "ai_strategic_recommendations": suite["ai_strategic_recommendations"],
            "ai_opportunity_detection": suite["ai_opportunity_detection"],
        }
    except Exception as e:
        logger.error(f"Error fetching CTO recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))
