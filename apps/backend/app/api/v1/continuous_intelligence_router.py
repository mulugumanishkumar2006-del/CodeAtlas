from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.continuous_intelligence import (
    ContinuousTimelineModel,
    DailyEngineeringBriefModel,
    DataFreshnessModel,
    EngineeringEventModel,
    EventReplayRequestModel,
    EventType,
    NotificationItemModel,
)
from app.services.continuous_intelligence_service import ContinuousIntelligenceService

router = APIRouter(prefix="/continuous", tags=["Continuous Engineering Intelligence"])


@router.post(
    "/webhook/ingest",
    response_model=EngineeringEventModel,
    status_code=status.HTTP_201_CREATED,
)
def ingest_engineering_event(
    organization_id: str = Query(...),
    repository_id: str = Query(...),
    event_type: EventType = Query(EventType.COMMIT),
    summary: str = Query("Commit: Decouple OAuth2 interface"),
    affected_components: List[str] = Query(["auth_service.py", "gateway_router.py"]),
    db: Session = Depends(get_db),
):
    """
    ⭐ Webhook & Engineering Event Ingestion Endpoint. Triggers change classification, incremental analysis, and alert deduplication.
    """
    service = ContinuousIntelligenceService(db=db)
    return service.ingest_engineering_event(
        organization_id=organization_id,
        repository_id=repository_id,
        event_type=event_type,
        summary=summary,
        affected_components=affected_components,
    )


@router.get(
    "/timeline/{repository_id}",
    response_model=ContinuousTimelineModel,
    status_code=status.HTTP_200_OK,
)
def get_continuous_timeline(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns continuous engineering timeline for a repository (events, drift, predictions, decisions).
    """
    service = ContinuousIntelligenceService(db=db)
    return service.get_continuous_timeline(repository_id)


@router.get(
    "/daily-brief/{organization_id}",
    response_model=DailyEngineeringBriefModel,
    status_code=status.HTTP_200_OK,
)
def get_daily_brief(
    organization_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Generates Daily Engineering Brief summarizing meaningful architecture, risk, and prediction changes.
    """
    service = ContinuousIntelligenceService(db=db)
    return service.get_daily_brief(organization_id)


@router.get(
    "/freshness/{repository_id}",
    response_model=DataFreshnessModel,
    status_code=status.HTTP_200_OK,
)
def get_data_freshness(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns real-time data freshness status badges for knowledge graph, prediction models, and search index.
    """
    service = ContinuousIntelligenceService(db=db)
    return service.get_data_freshness(repository_id)


@router.post(
    "/event-replay",
    response_model=Dict[str, Any],
    status_code=status.HTTP_200_OK,
)
def replay_events(
    req: EventReplayRequestModel,
    db: Session = Depends(get_db),
):
    """
    ⭐ Replays engineering event streams for testing, graph rebuilding, or auditing without mutating production repositories.
    """
    service = ContinuousIntelligenceService(db=db)
    return service.replay_events(req)


@router.get(
    "/notifications/{recipient_role}",
    response_model=List[NotificationItemModel],
    status_code=status.HTTP_200_OK,
)
def get_notifications_for_role(
    recipient_role: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Returns deduplicated, role-targeted notification digest (Developer, Architect, Security Reviewer, Team Lead, Executive).
    """
    service = ContinuousIntelligenceService(db=db)
    return service.get_notifications_for_role(recipient_role)
