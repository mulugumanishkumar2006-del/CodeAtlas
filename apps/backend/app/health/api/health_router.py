"""FastAPI router for Phase 14 AI Health Advisor and dashboards."""

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.health.advisor.health_advisor import HealthAdvisor
from app.health.engine.health_engine import HealthEngine
from app.health.models.health import HealthHistory, Recommendation, RepositoryHealth
from app.health.reports.cto_report import CtoReportGenerator
from app.health.reports.executive_report import ExecutiveReportGenerator
from app.models.file import File
from app.models.repository import Repository
from app.models.user import User

router = APIRouter()
_engine = HealthEngine()
_advisor = HealthAdvisor()


# ─── Pydantic Schemas ────────────────────────────────────────────────────────


class ForecastPointResponse(BaseModel):
    days: int
    label: str
    score: float


class ForecastResponse(BaseModel):
    current_score: float
    predictions: List[ForecastPointResponse]
    reasons: List[str]
    expected_after_improvements: float


class RecommendationResponse(BaseModel):
    recommendation: str
    improvement: float
    priority: str
    estimated_effort: str


class ExecutiveResponse(BaseModel):
    repository_health: float
    engineering_velocity: str
    risk: str
    deployment_readiness: str
    knowledge_risk: str
    technical_debt: str
    future_health: str


class CtoResponse(BaseModel):
    critical_issues: List[str]
    top_opportunities: List[str]
    architecture_drift: str


class HistoryPointResponse(BaseModel):
    id: int
    score: float
    timestamp: str


class HealthDashboardResponse(BaseModel):
    overall_score: float
    grade: str
    status: str
    status_color: str
    dimensions: List[dict]
    categories: dict
    forecast: ForecastResponse
    history: List[HistoryPointResponse]
    recommendations: List[RecommendationResponse]
    executive: ExecutiveResponse
    cto: CtoResponse


# ─── Helper Functions ────────────────────────────────────────────────────────


def _validate_repo(repo_id: str, db: Session, user: User) -> Repository:
    """Ensure the repo exists, belongs to the user, and has files."""
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
            detail="Repository has not been parsed yet. Please scan first.",
        )
    return repo


# ─── API Endpoints ───────────────────────────────────────────────────────────


@router.post(
    "/repositories/{id}/health/analyze",
    summary="Trigger full AI Health Advisor analysis run",
)
def analyze_health(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Run all analyzers, write to database, generate recommendations & forecasts."""
    _validate_repo(id, db, user)

    try:
        report = _engine.run_analysis(db, id)

        # 1. Persist in repository_health
        # Remove existing repository health row
        db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).delete()

        repo_health = RepositoryHealth(
            repo_id=id,
            overall_score=report["overall_score"],
            architecture_score=report["categories"]["architecture_health"]["score"],
            quality_score=report["categories"]["code_quality"]["score"],
            technical_debt=report["categories"]["technical_debt"]["score"],
            knowledge_score=report["categories"]["knowledge_health"]["score"],
            security_score=report["categories"]["security_readiness"]["score"],
            performance_score=report["categories"]["performance_readiness"]["score"],
            scalability_score=report["categories"]["scalability"]["score"],
            developer_experience=report["categories"]["developer_experience"]["score"],
        )
        db.add(repo_health)

        # 2. Append to health_history
        history_item = HealthHistory(
            repo_id=id,
            score=report["overall_score"],
        )
        db.add(history_item)

        db.commit()

        # 3. Generate advisor recommendations
        raw_scores = {d["name"]: d["score"] for d in report["dimensions"]}
        _advisor.generate_recommendations(db, id, raw_scores)

        # Also write the old RepositoryHealthSnapshot so backwards-compatible systems work
        from app.models.health_intelligence import RepositoryHealthSnapshot

        snapshot = RepositoryHealthSnapshot(
            repo_id=id,
            overall_score=report["overall_score"],
            grade=report["grade"],
            status=report["status"],
            score_architecture=raw_scores["Architecture"],
            score_technical_debt=raw_scores["Technical Debt"],
            score_reliability=raw_scores["Reliability"],
            score_knowledge=raw_scores["Knowledge"],
            score_documentation=raw_scores["Documentation"],
            score_performance=raw_scores["Performance"],
            score_testing=raw_scores["Testing"],
            score_security=raw_scores["Security"],
            score_developer_experience=raw_scores["Developer Experience"],
            score_scalability=raw_scores["Scalability"],
            score_maintainability=raw_scores["Maintainability"],
            headline=f"Health analysis completed at {datetime.now(timezone.utc)}.",
            narrative="Analysis run succeeded.",
        )
        db.add(snapshot)
        db.commit()

        return {
            "message": "Analysis completed successfully.",
            "overall_score": report["overall_score"],
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}",
        )


@router.get("/repositories/{id}/health")
def get_health(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Retrieve current repository health score."""
    _validate_repo(id, db, user)
    repo_health = (
        db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).first()
    )
    if not repo_health:
        # Trigger analysis automatically
        analyze_health(id, db, user)
        repo_health = (
            db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).first()
        )

    return {
        "repo_id": id,
        "overall_score": repo_health.overall_score,
        "created_at": repo_health.created_at,
        "categories": {
            "architecture": repo_health.architecture_score,
            "quality": repo_health.quality_score,
            "technical_debt": repo_health.technical_debt,
            "knowledge": repo_health.knowledge_score,
            "security": repo_health.security_score,
            "performance": repo_health.performance_score,
            "scalability": repo_health.scalability_score,
            "developer_experience": repo_health.developer_experience,
        },
    }


@router.get(
    "/repositories/{id}/health/history", response_model=List[HistoryPointResponse]
)
def get_history(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Retrieve full health history timeline."""
    _validate_repo(id, db, user)
    histories = (
        db.query(HealthHistory)
        .filter(HealthHistory.repo_id == id)
        .order_by(HealthHistory.timestamp.asc())
        .all()
    )
    return [
        HistoryPointResponse(
            id=h.id,
            score=h.score,
            timestamp=h.timestamp.isoformat(),
        )
        for h in histories
    ]


@router.get(
    "/repositories/{id}/health/recommendations",
    response_model=List[RecommendationResponse],
)
def get_recommendations(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Retrieve advisor recommendations."""
    _validate_repo(id, db, user)
    recs = db.query(Recommendation).filter(Recommendation.repo_id == id).all()
    # If no recommendations, generate defaults
    if not recs:
        # Try triggering analysis
        repo_health = (
            db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).first()
        )
        if not repo_health:
            analyze_health(id, db, user)
        else:
            raw_scores = {
                "Architecture": repo_health.architecture_score,
                "Testing": 70.0,
                "Documentation": 70.0,
                "Technical Debt": repo_health.technical_debt,
            }
            _advisor.generate_recommendations(db, id, raw_scores)
        recs = db.query(Recommendation).filter(Recommendation.repo_id == id).all()

    return [
        RecommendationResponse(
            recommendation=r.recommendation,
            improvement=r.improvement,
            priority=r.priority,
            estimated_effort=r.estimated_effort,
        )
        for r in recs
    ]


@router.get("/repositories/{id}/health/executive", response_model=ExecutiveResponse)
def get_executive(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Retrieve CEO view snapshot."""
    _validate_repo(id, db, user)
    repo_health = (
        db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).first()
    )
    if not repo_health:
        analyze_health(id, db, user)
        repo_health = (
            db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).first()
        )

    return ExecutiveReportGenerator.generate(db, id, repo_health.overall_score)


@router.get("/repositories/{id}/health/cto", response_model=CtoResponse)
def get_cto(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Retrieve CTO technical dashboard risk views."""
    _validate_repo(id, db, user)
    repo_health = (
        db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).first()
    )
    if not repo_health:
        analyze_health(id, db, user)
        repo_health = (
            db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).first()
        )

    scores = {
        "Reliability": 75.0,
        "Security": repo_health.security_score,
        "Architecture": repo_health.architecture_score,
        "Scalability": repo_health.scalability_score,
    }
    return CtoReportGenerator.generate(db, id, scores)


@router.get(
    "/repositories/{id}/health/dashboard", response_model=HealthDashboardResponse
)
def get_dashboard(
    id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Retrieve consolidated dashboards payload containing forecasts and recommendations."""
    _validate_repo(id, db, user)
    repo_health = (
        db.query(RepositoryHealth).filter(RepositoryHealth.repo_id == id).first()
    )
    if not repo_health:
        analyze_health(id, db, user)

    # Force a full analysis refresh if needed, but let's run engine run_analysis
    report = _engine.run_analysis(db, id)

    # Load DB items
    histories = get_history(id, db, user)
    recs = get_recommendations(id, db, user)
    exec_data = get_executive(id, db, user)
    cto_data = get_cto(id, db, user)

    return HealthDashboardResponse(
        overall_score=report["overall_score"],
        grade=report["grade"],
        status=report["status"],
        status_color=report["status_color"],
        dimensions=report["dimensions"],
        categories=report["categories"],
        forecast=ForecastResponse(
            current_score=report["forecast"]["current_score"],
            predictions=[
                ForecastPointResponse(
                    days=p["days"],
                    label=p["label"],
                    score=p["score"],
                )
                for p in report["forecast"]["predictions"]
            ],
            reasons=report["forecast"]["reasons"],
            expected_after_improvements=report["forecast"][
                "expected_after_improvements"
            ],
        ),
        history=histories,
        recommendations=recs,
        executive=exec_data,
        cto=cto_data,
    )
