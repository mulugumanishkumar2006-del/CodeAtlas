import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.biie_executive_command_service import BIIEExecutiveCommandService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/biie/command-center", tags=["biie_command_center"])


class AIExecutiveChatRequest(BaseModel):
    repository_id: str = Field(..., description="Target repository ID")
    query: str = Field(..., description="Executive natural language question")


@router.get("/executive-cockpit")
def get_global_command_center(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 81–100: Global Business Intelligence Command Center Cockpit.
    Includes all 100 enterprise features and the Signature Engineering-to-Business Digital Twin.
    """
    try:
        return BIIEExecutiveCommandService.get_global_command_center(db, repository_id)
    except Exception as e:
        logger.error(f"Error fetching global command center: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/role-dashboard/{role}")
def get_role_dashboard(
    role: str = Path(..., description="Role: CEO, CTO, CIO, CFO, or PRODUCT"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Features 81–85: Executive Role-Tailored Dashboard (CEO, CTO, CIO, CFO, Product).
    """
    try:
        return BIIEExecutiveCommandService.get_role_dashboard(db, role)
    except Exception as e:
        logger.error(f"Error fetching role dashboard for {role}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/engineering-to-business-twin")
def get_engineering_to_business_digital_twin(
    service_name: str = Query("Payments Service", description="Target service name"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    🌟 Signature Feature: Engineering-to-Business Digital Twin.
    Connects code architecture directly to revenue ($850M/yr), customers (18.4M), regions (42),
    APIs (214), downtime costs ($1.8M/hr), criticality (98/100), and actionable recommendations.
    """
    try:
        return BIIEExecutiveCommandService.get_engineering_to_business_digital_twin(
            db, service_name
        )
    except Exception as e:
        logger.error(f"Error fetching digital twin for {service_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ai-executive-chat")
def query_ai_executive_chat(
    req: AIExecutiveChatRequest,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 97: AI Executive Chat Engine.
    """
    try:
        return BIIEExecutiveCommandService.query_ai_executive_chat(
            db, req.repository_id, req.query
        )
    except Exception as e:
        logger.error(f"Error executing AI executive chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/board-report")
def get_board_meeting_report(
    repository_id: str = Query(..., description="Target repository ID"),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Feature 99: Board Meeting Reports & Executive Presentation Deck.
    """
    try:
        cockpit = BIIEExecutiveCommandService.get_global_command_center(
            db, repository_id
        )
        return {
            "repository_id": repository_id,
            "board_meeting_reports": cockpit["board_meeting_reports"],
            "digital_twin": cockpit["digital_twin"],
            "executive_kpis": cockpit["executive_kpi_center"],
        }
    except Exception as e:
        logger.error(f"Error fetching board report: {e}")
        raise HTTPException(status_code=500, detail=str(e))
