from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.reliability import ReliabilityDashboardResponse
from app.services.reliability_intelligence import ReliabilityIntelligenceService

router = APIRouter()
reliability_service = ReliabilityIntelligenceService()


def _validate_repo(repo_id: str, db: Session, user: User) -> Repository:
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied.",
        )
    return repo


@router.get(
    "/repositories/{repo_id}/reliability/dashboard",
    response_model=ReliabilityDashboardResponse,
    summary="Get bug predictions forecast dashboard (Phase 12)",
    tags=["reliability"],
)
def get_reliability_dashboard(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return reliability_service.get_dashboard(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reliability dashboard: {str(e)}",
        )


@router.post(
    "/repositories/{repo_id}/reliability/predict",
    response_model=ReliabilityDashboardResponse,
    summary="Trigger Reliability Intelligence prediction run (Phase 12)",
    tags=["reliability"],
)
def run_reliability_predictions(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return reliability_service.predict(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction run failed: {str(e)}",
        )
