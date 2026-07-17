"""FastAPI router for the Repository Health Intelligence Engine."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.file import File
from app.models.repository import Repository
from app.models.user import User
from app.schemas.health_intelligence import (
    AnalyzeHealthRequest,
    HealthIntelligenceReport,
    TrendResponse,
)
from app.services.health_intelligence_service import HealthIntelligenceService

router = APIRouter()
_service = HealthIntelligenceService()


def _validate_repo(repo_id: str, db: Session, user: User) -> Repository:
    """Ensure the repo exists, belongs to the user, and has been parsed."""
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied.",
        )
    files_count = db.query(File).filter(File.repository_id == repo_id).count()
    if files_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Repository has not been parsed yet. "
                "Please trigger a scan/parse first."
            ),
        )
    return repo


@router.post(
    "/repositories/{repo_id}/health-intelligence/analyze",
    response_model=HealthIntelligenceReport,
    summary="Trigger a full Repository Health Intelligence analysis",
    tags=["health_intelligence"],
)
def analyze_health(
    repo_id: str,
    request: AnalyzeHealthRequest = AnalyzeHealthRequest(),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HealthIntelligenceReport:
    """
    Run all sub-engines (TechDebt, Reliability, Knowledge) and produce a
    unified health report with composite score, 11-dimension breakdown,
    AI narrative, priority actions, and trend snapshot.

    Each call persists a new snapshot so the trend chart grows over time.
    """
    _validate_repo(repo_id, db, user)
    try:
        return _service.analyze(db, repo_id, request)
    except Exception as exc:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health analysis failed: {exc}",
        )


@router.get(
    "/repositories/{repo_id}/health-intelligence/report",
    response_model=HealthIntelligenceReport,
    summary="Get the latest Repository Health Intelligence report",
    tags=["health_intelligence"],
)
def get_report(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> HealthIntelligenceReport:
    """
    Return the most recently computed health report.
    If no snapshot exists, a fresh analysis is triggered automatically.
    """
    _validate_repo(repo_id, db, user)
    try:
        return _service.get_report(db, repo_id)
    except Exception as exc:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve health report: {exc}",
        )


@router.get(
    "/repositories/{repo_id}/health-intelligence/trend",
    response_model=TrendResponse,
    summary="Get historical health snapshots for trend analysis",
    tags=["health_intelligence"],
)
def get_trend(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> TrendResponse:
    """
    Return all historical health snapshots for this repository,
    sorted by timestamp ascending, for rendering the trend chart.
    """
    _validate_repo(repo_id, db, user)
    try:
        return _service.get_trend(db, repo_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve health trend: {exc}",
        )
