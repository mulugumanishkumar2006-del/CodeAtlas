from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.knowledge import (
    ExecutiveKnowledgeResponse,
    KnowledgeDashboardResponse,
    KnowledgeEvolutionSnapshotResponse,
    KnowledgeMemoryResponse,
)
from app.services.knowledge_intelligence import KnowledgeIntelligenceService

router = APIRouter()
knowledge_service = KnowledgeIntelligenceService()


def _validate_repo(repo_id: str, db: Session, user: User) -> Repository:
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or (repo.user_id != user.id and repo_id != "demo"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied.",
        )
    return repo


@router.get(
    "/repositories/{repo_id}/knowledge/dashboard",
    response_model=KnowledgeDashboardResponse,
    summary="Get knowledge loss detector and intelligence dashboard (Phase 13)",
    tags=["knowledge"],
)
def get_knowledge_dashboard(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return knowledge_service.get_dashboard(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch knowledge dashboard: {str(e)}",
        )


@router.post(
    "/repositories/{repo_id}/knowledge/analyze",
    response_model=KnowledgeDashboardResponse,
    summary="Trigger Knowledge Loss Detector analysis run (Phase 13)",
    tags=["knowledge"],
)
def run_knowledge_analysis(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return knowledge_service.analyze_knowledge(db, repo_id)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Knowledge analysis run failed: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/knowledge/memory/search",
    response_model=List[KnowledgeMemoryResponse],
    summary="Search engineering memory by keyword topic or answer terms (Phase 13)",
    tags=["knowledge"],
)
def search_knowledge_memory(
    repo_id: str,
    query: str = "",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return knowledge_service.search_memory(db, repo_id, query)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to query knowledge memory: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/knowledge/evolution",
    response_model=List[KnowledgeEvolutionSnapshotResponse],
    summary="Get repository knowledge distribution evolution snapshots (Phase 13)",
    tags=["knowledge"],
)
def get_knowledge_evolution(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return knowledge_service.get_evolution_history(db, repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch evolution history: {str(e)}",
        )


@router.get(
    "/repositories/{repo_id}/knowledge/executive",
    response_model=ExecutiveKnowledgeResponse,
    summary="Get C-level Executive Knowledge dashboard report (Phase 13)",
    tags=["knowledge"],
)
def get_executive_summary(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _validate_repo(repo_id, db, user)
    try:
        return knowledge_service.get_executive_summary(db, repo_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to compile executive summary dashboard: {str(e)}",
        )
