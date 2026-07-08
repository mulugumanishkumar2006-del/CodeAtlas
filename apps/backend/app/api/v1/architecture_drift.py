from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.repository import Repository
from app.services.drift_detection_service import DriftDetectionService
from app.schemas.architecture import (
    ArchitectureDriftReportResponse,
    ArchitectureRulesSchema,
    DriftTimelinePoint,
)

router = APIRouter()
drift_service = DriftDetectionService()

def validate_repository_access(repo_id: str, db: Session, user: User) -> Repository:
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied."
        )
    return repo

@router.get(
    "/repositories/{repo_id}/architecture/drift",
    response_model=ArchitectureDriftReportResponse,
)
def get_architecture_drift_report(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        report = drift_service.detect_drift(db, repo_id)
        return report
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate architectural drift: {str(e)}"
        )

@router.get(
    "/repositories/{repo_id}/architecture/drift/timeline",
    response_model=List[DriftTimelinePoint],
)
def get_architecture_drift_timeline(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        timeline = drift_service.get_drift_timeline(db, repo_id)
        return timeline
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load architectural drift timeline: {str(e)}"
        )

@router.get(
    "/repositories/{repo_id}/architecture/rules",
    response_model=ArchitectureRulesSchema,
)
def get_architecture_rules(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        rules = drift_service.load_rules(repo_id)
        return rules
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load architectural rules: {str(e)}"
        )

@router.post(
    "/repositories/{repo_id}/architecture/rules",
    response_model=ArchitectureRulesSchema,
)
def update_architecture_rules(
    repo_id: str,
    rules: ArchitectureRulesSchema,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    validate_repository_access(repo_id, db, user)
    try:
        drift_service.save_rules(repo_id, rules.model_dump())
        return rules
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save architectural rules: {str(e)}"
        )
