# apps/backend/app/api/v1/asip_router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.asip.orchestrator.asip_orchestrator import ASIPOrchestrator
from app.asip.schemas.asip_schema import (
    ASIPSimulationRequest,
    HumanApprovalRequest,
)
from app.core.database import get_db
from app.models.repository import Repository
from app.models.user import User

router = APIRouter(tags=["Autonomous Software Intelligence Platform (ASIP)"])
asip_orchestrator = ASIPOrchestrator()


def _validate_repo(repo_id: str, db: Session, user: User) -> Repository:
    repo = (
        db.query(Repository)
        .filter(Repository.id == repo_id, Repository.user_id == user.id)
        .first()
    )
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository '{repo_id}' not found or access denied.",
        )
    return repo


@router.get(
    "/repositories/{repo_id}/asip/monday-briefing",
    summary="Get Virtual Operations Center Monday Morning Briefing (Phase 40)",
)
def get_monday_briefing(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_monday_briefing(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate ASIP Monday briefing: {str(e)}",
        )


@router.post(
    "/repositories/{repo_id}/asip/simulate",
    summary="Run Architecture & Policy Stress Test Simulation (Phase 40)",
)
def run_simulation(
    repo_id: str,
    req: ASIPSimulationRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.run_simulation(
            db=db,
            repo_id=repo_id,
            scenario_type=req.scenario_type,
            target_users=req.target_users,
            migration_target=req.migration_target,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ASIP simulation execution error: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/governance",
    summary="Get Governance & Policy Rules (Phase 40)",
)
def get_governance_policies(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_governance_policies(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve ASIP governance policies: {str(e)}",
        )


@router.post(
    "/repositories/{repo_id}/asip/approve",
    summary="Process Human-in-the-Loop Recommendation Approval (Phase 40)",
)
def process_human_approval(
    repo_id: str,
    req: HumanApprovalRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.process_human_approval(
            db=db,
            repo_id=repo_id,
            recommendation_id=req.recommendation_id,
            approved=req.approved,
            comments=req.comments,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process human approval decision: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/autonomous-intelligence",
    summary="Get Autonomous Intelligence Suite (Phase 40 Features 1–5)",
)
def get_autonomous_intelligence(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_autonomous_intelligence(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve autonomous intelligence suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/multi-agent-council",
    summary="Get 10-Agent Multi-Agent Engineering Council (Feature 3)",
)
def get_multi_agent_council(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_multi_agent_council(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve multi-agent council: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/engineering-digital-twin",
    summary="Get Engineering Digital Twin Snapshot (Feature 5)",
)
def get_engineering_digital_twin(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_engineering_digital_twin(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve engineering digital twin: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/architecture-intelligence",
    summary="Get Autonomous Architecture Intelligence Suite (Phase 40 Features 6–25)",
)
def get_architecture_intelligence(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_architecture_intelligence(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve architecture intelligence suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/continuous-analysis",
    summary="Get Continuous Analysis Suite (Phase 40 Features 6–30)",
)
def get_continuous_analysis(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_continuous_analysis(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve continuous analysis suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/ai-advisors",
    summary="Get 40 Specialized AI Advisors Suite (Phase 40 Features 31–70)",
)
def get_ai_advisors(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_ai_advisors(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve AI advisors suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/governance-compliance",
    summary="Get Governance & Compliance Suite (Phase 40 Features 71–100)",
)
def get_governance_compliance(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_governance_compliance(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve governance compliance suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/enterprise-intelligence",
    summary="Get Enterprise Intelligence Suite (Phase 40 Features 101–130)",
)
def get_enterprise_intelligence(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_enterprise_intelligence(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve enterprise intelligence suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/ecosystem-extensibility",
    summary="Get Ecosystem & Extensibility Suite (Phase 40 Features 131–150)",
)
def get_ecosystem_extensibility(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_ecosystem_extensibility(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve ecosystem extensibility suite: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/asip/mission-control",
    summary="Get Engineering Mission Control (Signature Feature)",
)
def get_mission_control(
    repo_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    _validate_repo(repo_id, db, user)
    try:
        return asip_orchestrator.get_mission_control(db=db, repo_id=repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve engineering mission control: {str(e)}",
        )
