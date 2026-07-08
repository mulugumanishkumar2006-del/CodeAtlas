from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import datetime

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.repository import Repository
from app.models.file import File
from app.models.tech_debt import TechnicalDebtReport, HealthScore, RiskForecast
from app.schemas.tech_debt import (
    TechDebtReportResponse,
    HeatmapNodeResponse,
    HotspotDetectionResponse,
    RefactoringRecommendationResponse,
    TimelineSnapshotResponse,
    ForecastSnapshotResponse,
    RepositoryRiskScorecard
)
from app.services.tech_debt_service import TechDebtService

router = APIRouter()

def validate_repository_access(repo_id: str, db: Session, user: User) -> Repository:
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )
    files_count = db.query(File).filter(File.repository_id == repo_id).count()
    if files_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Repository has not been parsed yet. Please trigger a scan/parse first.",
        )
    return repo

@router.post(
    "/repositories/{repo_id}/technical-debt/analyze",
    response_model=TechDebtReportResponse,
)
def analyze_repository_tech_debt(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    validate_repository_access(repo_id, db, user)
    try:
        report = service.calculate_repository_tech_debt(db=db, repo_id=repo_id)
        
        # Save analysis data to PostgreSQL tables
        db_report = TechnicalDebtReport(
            repo_id=repo_id,
            module="root",
            debt_score=report["summary"]["average_debt_score"],
            risk_level="CRITICAL" if report["summary"]["average_debt_score"] > 80 else "HIGH" if report["summary"]["average_debt_score"] > 60 else "WARNING"
        )
        db.add(db_report)
        
        db_health = HealthScore(
            repo_id=repo_id,
            architecture=report["scorecard"]["architecture"],
            maintainability=report["scorecard"]["maintainability"],
            testing=report["scorecard"]["testing"],
            documentation=report["scorecard"]["documentation"],
            performance=report["scorecard"]["performance"],
            overall=report["scorecard"]["overall_health"]
        )
        db.add(db_health)
        
        # Clear old forecasts and write new ones
        db.query(RiskForecast).filter(RiskForecast.repo_id == repo_id).delete()
        for snap in report["forecast"]:
            days = 0
            if "30" in snap["label"]:
                days = 30
            elif "90" in snap["label"]:
                days = 90
            elif "180" in snap["label"]:
                days = 180
            pred_date = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=days)
            db_forecast = RiskForecast(
                repo_id=repo_id,
                prediction_date=pred_date,
                predicted_debt=snap["score"],
                confidence=0.9 if days > 0 else 1.0
            )
            db.add(db_forecast)
            
        db.commit()
        return report
    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis calculation failed: {str(e)}"
        )

@router.get(
    "/repositories/{repo_id}/technical-debt",
    response_model=TechDebtReportResponse,
)
def get_repository_tech_debt(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    validate_repository_access(repo_id, db, user)
    try:
        return service.calculate_repository_tech_debt(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/repositories/{repo_id}/tech-debt",
    response_model=TechDebtReportResponse,
)
def get_repository_tech_debt_alias(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    return get_repository_tech_debt(repo_id, db, user, service)

@router.get(
    "/repositories/{repo_id}/technical-debt/heatmap",
    response_model=HeatmapNodeResponse,
)
def get_repository_heatmap(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    validate_repository_access(repo_id, db, user)
    try:
        report = service.calculate_repository_tech_debt(db=db, repo_id=repo_id)
        return report["heatmap"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/repositories/{repo_id}/technical-debt/hotspots",
    response_model=HotspotDetectionResponse,
)
def get_repository_hotspots(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    validate_repository_access(repo_id, db, user)
    try:
        report = service.calculate_repository_tech_debt(db=db, repo_id=repo_id)
        return report["hotspots"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/repositories/{repo_id}/technical-debt/recommendations",
    response_model=List[RefactoringRecommendationResponse],
)
def get_repository_recommendations(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    validate_repository_access(repo_id, db, user)
    try:
        report = service.calculate_repository_tech_debt(db=db, repo_id=repo_id)
        return report["recommendations"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/repositories/{repo_id}/technical-debt/history",
    response_model=List[TimelineSnapshotResponse],
)
def get_repository_history(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    validate_repository_access(repo_id, db, user)
    try:
        report = service.calculate_repository_tech_debt(db=db, repo_id=repo_id)
        return report["timeline"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/repositories/{repo_id}/technical-debt/forecast",
    response_model=List[ForecastSnapshotResponse],
)
def get_repository_forecast(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    validate_repository_access(repo_id, db, user)
    try:
        report = service.calculate_repository_tech_debt(db=db, repo_id=repo_id)
        return report["forecast"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get(
    "/repositories/{repo_id}/health",
    response_model=RepositoryRiskScorecard,
)
def get_repository_health(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: TechDebtService = Depends(lambda: TechDebtService())
):
    validate_repository_access(repo_id, db, user)
    try:
        report = service.calculate_repository_tech_debt(db=db, repo_id=repo_id)
        return report["scorecard"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
