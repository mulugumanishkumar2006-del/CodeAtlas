from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.temporal_intelligence import (
    ArchitectureDiff,
    ArchitectureDriftFinding,
    ArchitectureTimelineEvent,
    ChangeHotspot,
    CoChangeRelationship,
    CommitModel,
    DependencyEvolution,
    HistoricalSnapshot,
    RiskEvolution,
    TemporalAIExplanationRequest,
    TemporalAIExplanationResponse,
    TemporalEvalMetrics,
    TemporalImpactResponse,
    TemporalSearchRequest,
    TemporalSearchResponse,
)
from app.services.temporal_intelligence_service import TemporalIntelligenceService

router = APIRouter(prefix="/temporal", tags=["Temporal Software Intelligence"])


@router.post(
    "/ingest",
    response_model=CommitModel,
    status_code=status.HTTP_201_CREATED,
)
def ingest_commit(
    repository_id: str = Query(...),
    commit_sha: str = Query(...),
    message: str = Query(...),
    author_name: Optional[str] = Query("Developer"),
    author_email: Optional[str] = Query("dev@org.com"),
    parent_sha: Optional[str] = Query(None),
    branch: str = Query("main"),
    db: Session = Depends(get_db),
):
    """
    ⭐ Ingests Git commit history with secret masking & privacy-preserving metadata.
    """
    service = TemporalIntelligenceService(db=db)
    return service.ingest_git_commit(
        repository_id=repository_id,
        commit_sha=commit_sha,
        message=message,
        author_name=author_name,
        author_email=author_email,
        parent_sha=parent_sha,
        branch=branch,
    )


@router.get(
    "/snapshot/{repository_id}/{commit_sha}",
    response_model=HistoricalSnapshot,
    status_code=status.HTTP_200_OK,
)
def get_snapshot(
    repository_id: str,
    commit_sha: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Code Time Machine: Retrieves exact point-in-time software graph snapshot for commit SHA.
    """
    service = TemporalIntelligenceService(db=db)
    return service.get_snapshot(repository_id=repository_id, commit_sha=commit_sha)


@router.post(
    "/diff",
    response_model=ArchitectureDiff,
    status_code=status.HTTP_200_OK,
)
def diff_architecture(
    repository_id: str = Query(...),
    base_sha: str = Query(...),
    head_sha: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Compares Architecture A vs Architecture B (added/removed components, boundaries, risks).
    """
    service = TemporalIntelligenceService(db=db)
    return service.diff_architecture(repository_id=repository_id, base_sha=base_sha, head_sha=head_sha)


@router.get(
    "/timeline/{repository_id}",
    response_model=List[ArchitectureTimelineEvent],
    status_code=status.HTTP_200_OK,
)
def get_architecture_timeline(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Retrieves high-level architecture timeline (service introduced, module split, coupling shifts).
    """
    service = TemporalIntelligenceService(db=db)
    return service.get_architecture_timeline(repository_id)


@router.get(
    "/co-change/{repository_id}",
    response_model=List[CoChangeRelationship],
    status_code=status.HTTP_200_OK,
)
def get_co_change_intelligence(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Retrieves co-changing component pairs explicitly labeled as 'Historical co-change'.
    """
    service = TemporalIntelligenceService(db=db)
    return service.get_co_change_intelligence(repository_id)


@router.get(
    "/drift/{repository_id}",
    response_model=List[ArchitectureDriftFinding],
    status_code=status.HTTP_200_OK,
)
def get_architecture_drift(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Evaluates Declared vs Observed architecture and tracks drift trends (NEW, INCREASING, RESOLVED).
    """
    service = TemporalIntelligenceService(db=db)
    return service.get_architecture_drift(repository_id)


@router.get(
    "/risk-evolution/{repository_id}",
    response_model=List[RiskEvolution],
    status_code=status.HTTP_200_OK,
)
def get_risk_evolution(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Retrieves component risk trajectories over time (LOW -> MEDIUM -> HIGH).
    """
    service = TemporalIntelligenceService(db=db)
    return service.get_risk_evolution(repository_id)


@router.get(
    "/hotspots/{repository_id}",
    response_model=List[ChangeHotspot],
    status_code=status.HTTP_200_OK,
)
def get_change_hotspots(
    repository_id: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Discovers high change frequency components with high dependency centrality.
    """
    service = TemporalIntelligenceService(db=db)
    return service.get_change_hotspots(repository_id)


@router.post(
    "/ai-explain",
    response_model=TemporalAIExplanationResponse,
    status_code=status.HTTP_200_OK,
)
def query_temporal_ai(
    req: TemporalAIExplanationRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ AI Temporal Reasoning endpoint explaining architecture evolution with Fact vs Inference separation.
    """
    service = TemporalIntelligenceService(db=db)
    return service.query_temporal_ai(req)


@router.post(
    "/search",
    response_model=TemporalSearchResponse,
    status_code=status.HTTP_200_OK,
)
def search_history(
    req: TemporalSearchRequest,
    db: Session = Depends(get_db),
):
    """
    ⭐ Searches historical commits, architecture timeline events, and drift findings.
    """
    service = TemporalIntelligenceService(db=db)
    return service.search_history(req)


@router.get(
    "/impact-evolution/{repository_id}/{entity_path:path}",
    response_model=TemporalImpactResponse,
    status_code=status.HTTP_200_OK,
)
def get_temporal_impact(
    repository_id: str,
    entity_path: str,
    db: Session = Depends(get_db),
):
    """
    ⭐ Retrieves dependency blast radius evolution over time.
    """
    service = TemporalIntelligenceService(db=db)
    return service.get_temporal_impact(repository_id, entity_path)


@router.post(
    "/evaluate",
    response_model=TemporalEvalMetrics,
    status_code=status.HTTP_200_OK,
)
def evaluate_temporal_intelligence(
    repository_id: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    ⭐ Runs evaluation benchmark on historical accuracy, timeline correctness, and graph-diff precision.
    """
    service = TemporalIntelligenceService(db=db)
    return service.evaluate_temporal_intelligence(repository_id)
