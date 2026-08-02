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


class CTOChatMessageRequest(BaseModel):
    message: str = Field(..., description="User query to AI CTO")
    history: Optional[List[dict]] = Field(
        default=[], description="Previous conversation turns"
    )


@router.post(
    "/repositories/{repo_id}/cto/chat",
    summary="Natural language conversation with AI CTO (Feature 28)",
)
def chat_with_cto(
    repo_id: str,
    req: CTOChatMessageRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.chat(
            db=db,
            repo_id=repo_id,
            message=req.message,
            conversation_history=req.history,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI CTO Chat error: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/history",
    summary="Retrieve historical CTO recommendations and snapshots (Feature 29)",
)
def get_cto_history(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.get_strategy_history(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve CTO strategy history: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/history/compare",
    summary="Compare strategy versions and progress metrics (Feature 29)",
)
def compare_cto_history(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.compare_strategy_versions(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compare CTO strategy history: {str(e)}",
        )


@router.post(
    "/repositories/{repo_id}/cto/continuous-reevaluate",
    summary="Trigger Continuous AI CTO re-evaluation pipeline (Feature 30)",
)
def trigger_continuous_reevaluation(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.run_continuous_reevaluation(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Continuous CTO re-evaluation error: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/strategic-decisions",
    summary="Get evidence-backed strategic answers to 8 core CTO questions (Phase 39)",
)
def get_cto_strategic_decisions(
    repo_id: str,
    target_users: Optional[int] = 100000,
    target_requests_per_sec: Optional[int] = 500,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        analysis = cto_orchestrator.analyze_repository(
            db=db,
            repo_id=repo_id,
            target_users=target_users,
            target_requests_per_sec=target_requests_per_sec,
        )
        return analysis.strategic_decisions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve CTO strategic decisions: {str(e)}",
        )


class ScaleSimulationRequest(BaseModel):
    target_users: int = Field(
        default=100000000, description="User scale simulation target"
    )
    target_requests_per_sec: int = Field(
        default=50000, description="Requests/sec simulation target"
    )


@router.post(
    "/repositories/{repo_id}/cto/simulate-scale",
    summary="Execute custom 100M+ user infrastructure stress simulation (Phase 39)",
)
def simulate_scale_scenario(
    repo_id: str,
    req: ScaleSimulationRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        analysis = cto_orchestrator.analyze_repository(
            db=db,
            repo_id=repo_id,
            target_users=req.target_users,
            target_requests_per_sec=req.target_requests_per_sec,
        )
        return {
            "goals": analysis.goals,
            "scenario_simulation": analysis.scenario_simulation,
            "scaling_100m_analysis": analysis.strategic_decisions.get(
                "scaling_100m", {}
            ),
            "capacity_planning": analysis.capacity_planning,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scale simulation execution error: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/engineering-strategy",
    summary="Generate 1-Year, 3-Year, and 5-Year Multi-Year Engineering Strategy (Feature 2)",
)
def get_engineering_strategy(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.get_engineering_strategy(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate engineering strategy: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/engineering-vision-2030",
    summary="Generate formal Engineering Vision 2030 Document (Feature 3)",
)
def get_engineering_vision_2030(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.get_engineering_vision_2030(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate Engineering Vision 2030: {str(e)}",
        )


class StrategicAdvisorRequest(BaseModel):
    decision_key: str = Field(
        default="monolith_vs_microservices",
        description="Architectural decision topic to evaluate",
    )


@router.post(
    "/repositories/{repo_id}/cto/strategic-advisor",
    summary="Evaluate trade-off decisions (Build vs Buy, Monolith vs Microservices, etc.) (Feature 5)",
)
def evaluate_tradeoff_decision(
    repo_id: str,
    req: StrategicAdvisorRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.evaluate_tradeoff_decision(
            db=db, repo_id=repo_id, decision_key=req.decision_key
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Trade-off decision evaluation error: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/technology-intelligence",
    summary="Get Technology Intelligence Suite across 20 specialized domains (Features 6–25)",
)
def get_technology_intelligence(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.get_technology_intelligence(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve technology intelligence suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/growth-intelligence",
    summary="Get Engineering Growth Intelligence Suite (Features 26–50)",
)
def get_growth_intelligence(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.get_growth_intelligence(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve growth intelligence suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/engineering-economics",
    summary="Get Engineering Economics & FinOps Suite (Features 51–75)",
)
def get_engineering_economics(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.get_engineering_economics(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve engineering economics suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/future-intelligence",
    summary="Get Future Engineering Intelligence & 10-Year Horizon Suite (Features 76–100)",
)
def get_future_intelligence(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.get_future_intelligence(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve future intelligence suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/cto/global-executive",
    summary="Get Global Executive Intelligence Suite (Features 101–120)",
)
def get_global_executive_intelligence(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.get_global_executive_intelligence(
            db=db, repo_id=repo_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve global executive intelligence suite: {str(e)}",
        )


class DigitalCTOCommandRequest(BaseModel):
    query_prompt: str = Field(
        default="Our company expects to grow from 1 million to 100 million users over the next five years. What should we do?",
        description="Strategic query for Virtual CTO reasoning engine",
    )


@router.post(
    "/repositories/{repo_id}/cto/digital-command-center",
    summary="Signature Feature 120: Ask the AI CTO (Digital CTO Command Center Console)",
)
def run_digital_cto_command(
    repo_id: str,
    req: DigitalCTOCommandRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return cto_orchestrator.run_digital_cto_command(
            db=db, repo_id=repo_id, query_prompt=req.query_prompt
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Digital CTO Command Center execution error: {str(e)}",
        )
