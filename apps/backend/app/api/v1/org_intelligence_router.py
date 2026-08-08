from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.org_intelligence import (
    AIArchitectQueryRequest,
    AIArchitectQueryResponse,
    ExecutiveBriefingModel,
    OrganizationHealthModel,
    OrganizationSnapshotModel,
)
from app.services.org_intelligence_service import OrganizationIntelligenceService

router = APIRouter(prefix="/org", tags=["Organizational Intelligence"])


@router.get(
    "/snapshot/{organization_id}",
    response_model=OrganizationSnapshotModel,
    status_code=status.HTTP_200_OK,
)
def get_organization_snapshot(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ CodeAtlas v1.4 Organizational Intelligence Snapshot Endpoint.
    Returns 7-dimension engineering health, single points of failure, 2x2 priority matrix, initiatives, and major migrations.
    """
    service = OrganizationIntelligenceService(db=db)
    return service.get_organization_snapshot(organization_id)


@router.get(
    "/health/{organization_id}",
    response_model=OrganizationHealthModel,
    status_code=status.HTTP_200_OK,
)
def get_organization_health(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns evidence-based 7-dimension engineering health scores and trends.
    """
    service = OrganizationIntelligenceService(db=db)
    return service.get_organization_health(organization_id)


@router.get(
    "/executive-briefing/{organization_id}",
    response_model=ExecutiveBriefingModel,
    status_code=status.HTTP_200_OK,
)
def get_executive_briefing(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Generates concise executive briefing answering: What changed? What is at risk? What matters most?
    """
    service = OrganizationIntelligenceService(db=db)
    return service.get_executive_briefing(organization_id)


@router.post(
    "/ai-architect/query",
    response_model=AIArchitectQueryResponse,
    status_code=status.HTTP_200_OK,
)
def query_ai_architect(
    req: AIArchitectQueryRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Organizational AI Architect RAG Endpoint. Responds to strategic questions with evidence citations and recommended next steps.
    """
    service = OrganizationIntelligenceService(db=db)
    return service.query_ai_architect(req)
