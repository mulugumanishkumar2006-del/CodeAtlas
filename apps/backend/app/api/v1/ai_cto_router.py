# apps/backend/app/api/v1/ai_cto_router.py

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.ai_cto.orchestrator.cto_orchestrator import CTOOrchestrator
from app.ai_cto.schemas.recommendation import CostOptimization, RiskProfile
from app.ai_cto.schemas.report import CTOAnalysisResponse
from app.ai_cto.schemas.roadmap import EngineeringRoadmap
from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.repository import Repository
from app.models.user import User

router = APIRouter()
cto_orchestrator = CTOOrchestrator()


class CTOAnalysisRequest(BaseModel):
    target_users: Optional[int] = Field(
        default=10000, description="Goal scaling user count"
    )
    target_requests_per_sec: Optional[int] = Field(
        default=100, description="Goal scaling requests/sec throughput"
    )
    migration_target: Optional[str] = Field(
        default="serverless", description="Target environment migration focus"
    )
    budget_reduction_pct: Optional[float] = Field(
        default=0.0, description="Goal monthly budget reduction %"
    )


def _validate_repo(repo_id: str, db: Session, user: User) -> Repository:
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied.",
        )
    return repo


@router.post(
    "/repositories/{repo_id}/cto/analyze",
    response_model=CTOAnalysisResponse,
    summary="Generate full AI CTO report analyzing business goals vs repository digital twin",
)
def analyze_repository(
    repo_id: str,
    req: CTOAnalysisRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.analyze_repository(
            db=db,
            repo_id=repo_id,
            target_users=req.target_users,
            target_requests_per_sec=req.target_requests_per_sec,
            migration_target=req.migration_target,
            budget_reduction_pct=req.budget_reduction_pct,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"CTO analysis failed: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/roadmap",
    response_model=EngineeringRoadmap,
    summary="Get proposed engineering roadmaps",
)
def get_cto_roadmap(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        analysis = cto_orchestrator.analyze_repository(db=db, repo_id=repo_id)
        return analysis.roadmap
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve CTO roadmap: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/costs",
    response_model=List[CostOptimization],
    summary="Get cost optimization recommendations",
)
def get_cto_costs(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        analysis = cto_orchestrator.analyze_repository(db=db, repo_id=repo_id)
        return analysis.costs
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve CTO cost optimizations: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/risks",
    response_model=List[RiskProfile],
    summary="Get risk and technical bottleneck profiles",
)
def get_cto_risks(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        analysis = cto_orchestrator.analyze_repository(db=db, repo_id=repo_id)
        return analysis.risks
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve CTO risk profile: {str(e)}",
        )
