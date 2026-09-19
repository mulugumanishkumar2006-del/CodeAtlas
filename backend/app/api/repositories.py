import logging
from datetime import datetime, timezone
from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from backend.app.db.session import get_db
from backend.app.models.repository import Repository
from backend.app.models.workspace import Workspace
from backend.app.models.analysis import Analysis
from backend.app.models.file import File
from backend.app.models.symbol import Symbol
from backend.app.models.dependency import Dependency
from backend.app.models.graph import GraphNode, GraphRelationship
from backend.app.models.conversation import Conversation
from backend.app.schemas.repository import (
    RepositoryCreate,
    RepositoryResponse,
    RepositoryStatusResponse,
    AnalysisResponse,
    AnalysisProgressResponse,
    IndexStatusResponse,
    FileResponse,
    FileDetailResponse,
    CodeSearchMatch,
    SymbolSearchMatch,
    RepositorySearchResponse,
    SymbolResponse,
    DependencyResponse,
    GraphResponse,
    GraphNodeResponse,
    GraphRelationshipResponse,
    ArchitectureResponse,
    RepositoryQueryRequest,
    RepositoryQueryResponse,
    ConversationResponse,
    ConversationListResponse,
    ConversationCreateRequest,
    ImpactAnalysisResponse,
    ImpactTargetItem,
    ImpactTargetResolveRequest,
    ImpactExplainRequest,
    TargetDependencyResponse,
    QualitySummaryResponse,
    QualityFindingsResponse,
    QualityFilesResponse,
    QualityDuplicationsResponse,
    SecurityReliabilitySummaryResponse,
    SecurityReliabilityFindingsResponse,
    SecurityDependenciesResponse,
    SecurityHotspotsResponse,
    GitHistorySummaryResponse,
    CommitListResponse,
    CommitDetailResponse,
    FileEvolutionListResponse,
    FileEvolutionDetailResponse,
    CommitItem,
    DependencySummaryResponse,
    DependencyListResponse,
    DependencyDetailResponse,
    DependencyImpactResponse,
    DependencyIntelligenceItem,
    RepositoryProfileResponse,
    AnalysisSnapshotResponse,
    ArchitectureGraphNode,
    ArchitectureGraphEdge,
    ArchitectureComponentItem,
    ArchitectureDataFlowPath,
    CouplingMetricItem,
    ArchitectureViolation,
    ArchitectureSnapshotDiffResponse,
    AdvancedArchitectureIntelligenceResponse,
    HistoricalSnapshotItem,
    HistoricalSnapshotListResponse,
    FileRenameItem,
    FileCommitItem,
    FileEvolutionHistoryResponse,
    DiffHunk,
    FileDiffItem,
    SymbolDiffItem,
    CommitDetailPhase20Response,
    CommitCompareRequest,
    CommitCompareResponse,
    TechnicalDebtFindingItem,
    TechnicalDebtSummaryResponse,
    RiskSignalItem,
    EngineeringHotspotItem,
    HotspotsListResponse,
    EntityRiskResponse,
    DebtRiskTrendItem,
    DebtRiskTrendsResponse,
    RepositoryRiskSummaryResponse,
    FindingDetailResponse,
    SimulationCreateRequest,
    SimulationDetailResponse,
    SimulationListItem,
    SimulationListResponse,
    EngineeringHealthResponse,
    EngineeringPrioritiesResponse,
    EngineeringRoadmapResponse,
    WhatShouldWeDoNextResponse,
    StrategyComparisonResponse,
    SimulateIgnoreResponse,
    EngineeringPlanCreateRequest,
    EngineeringPlanGenerateRequest,
    EngineeringPlanResponse,
    EngineeringPlanListItem,
    EngineeringPlanListResponse,
)
from backend.app.services.engineering_planning_service import engineering_planning_service
from backend.app.services.future_impact_simulator_service import future_impact_simulator_service
from backend.app.services.time_machine_service import time_machine_service
from backend.app.services.technical_debt_service import technical_debt_service
from backend.app.services.risk_intelligence_service import risk_intelligence_service
from backend.app.services.architecture_service import architecture_service
from backend.app.services.architecture_intelligence_service import architecture_intelligence_service
from backend.app.services.code_quality_service import code_quality_service
from backend.app.services.security_reliability_service import security_reliability_service
from backend.app.services.git_history_service import git_history_service
from backend.app.services.dependency_intelligence_service import dependency_intelligence_service
from backend.app.services.source_code_service import source_code_service
from backend.app.services.search_intelligence_service import search_intelligence_service
from backend.app.services.rag_service import rag_service
from backend.app.services.impact_analysis_service import impact_service
from backend.app.services.universal_analyzer_service import universal_analyzer
from backend.app.services.git_repository_service import (
    git_service,
    GitValidationError,
    GitAuthenticationError,
    GitRepositoryNotFoundError,
    GitTimeoutError,
    GitServiceError,
)
from backend.app.services.repository_ingestion_service import ingestion_service
from backend.app.workers.indexing_worker import run_indexing_task

logger = logging.getLogger("codeatlas.api.repositories")
router = APIRouter(prefix="/repositories", tags=["Repositories"])


async def get_or_create_default_workspace(db: AsyncSession) -> Workspace:
    result = await db.execute(select(Workspace).where(Workspace.slug == "default"))
    workspace = result.scalars().first()
    if not workspace:
        workspace = Workspace(
            name="Default Workspace",
            slug="default",
            description="Default workspace for repositories",
        )
        db.add(workspace)
        await db.flush()
    return workspace


@router.get("", response_model=List[RepositoryResponse])
async def list_repositories(
    workspace_id: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> List[RepositoryResponse]:
    query = select(Repository)
    if workspace_id:
        query = query.where(Repository.workspace_id == workspace_id)
    query = query.order_by(Repository.created_at.desc())
    result = await db.execute(query)
    repos = result.scalars().all()
    return [RepositoryResponse.model_validate(repo) for repo in repos]


@router.post("", response_model=RepositoryResponse, status_code=status.HTTP_201_CREATED)
async def create_repository(
    payload: RepositoryCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> RepositoryResponse:
    target_workspace_id = payload.workspace_id
    if not target_workspace_id:
        workspace = await get_or_create_default_workspace(db)
        target_workspace_id = workspace.id
    else:
        ws_res = await db.execute(select(Workspace).where(Workspace.id == target_workspace_id))
        if not ws_res.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Workspace with id '{target_workspace_id}' not found.",
            )

    # Validate Git URL format & safety
    try:
        validated_url = git_service.validate_git_url(payload.url)
    except GitValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )

    # Check for duplicate repository within the workspace
    existing = await db.execute(
        select(Repository).where(
            Repository.workspace_id == target_workspace_id,
            (Repository.name == payload.name.strip()) | (Repository.url == validated_url),
        )
    )
    if existing.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Repository with name '{payload.name}' or URL '{payload.url}' already exists in this workspace.",
        )

    new_repo = Repository(
        workspace_id=target_workspace_id,
        name=payload.name.strip(),
        url=validated_url,
        provider=payload.provider.strip() if payload.provider else "github",
        owner_name=payload.owner_name.strip() if payload.owner_name else None,
        default_branch=payload.default_branch.strip() if payload.default_branch else "main",
        description=payload.description.strip() if payload.description else None,
        connection_status="connected",
        acquisition_status="NOT_CLONED",
        analysis_status="pending",
    )
    db.add(new_repo)
    await db.commit()
    await db.refresh(new_repo)

    # Automatically start background ingestion upon repository addition
    background_tasks.add_task(run_indexing_task, new_repo.id)

    return RepositoryResponse.model_validate(new_repo)


@router.get("/{repository_id}", response_model=RepositoryResponse)
async def get_repository(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> RepositoryResponse:
    result = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = result.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    return RepositoryResponse.model_validate(repo)


@router.get("/{repository_id}/status", response_model=RepositoryStatusResponse)
async def get_repository_status(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> RepositoryStatusResponse:
    result = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = result.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    active_op = git_service.is_operation_in_progress(repository_id)
    current_status = active_op or repo.acquisition_status or "NOT_CLONED"

    return RepositoryStatusResponse(
        repository_id=repo.id,
        status=current_status,
        branch=repo.default_branch,
        commit_sha=repo.current_commit_sha,
        last_synced_at=repo.last_synced_at,
        error=repo.acquisition_error,
    )


@router.post("/{repository_id}/clone", response_model=RepositoryStatusResponse)
async def clone_repository_endpoint(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> RepositoryStatusResponse:
    result = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = result.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    active_op = git_service.is_operation_in_progress(repository_id)
    if active_op:
        return RepositoryStatusResponse(
            repository_id=repo.id,
            status=active_op,
            branch=repo.default_branch,
            commit_sha=repo.current_commit_sha,
            last_synced_at=repo.last_synced_at,
            error=repo.acquisition_error,
        )

    repo.acquisition_status = "CLONING"
    repo.acquisition_error = None
    await db.commit()

    try:
        clone_result = await git_service.clone_repository(
            repo_id=repo.id,
            url=repo.url,
            default_branch=repo.default_branch,
        )

        repo.acquisition_status = "READY"
        repo.acquisition_error = None
        if clone_result.get("branch"):
            repo.default_branch = clone_result["branch"]
        if clone_result.get("commit_sha"):
            repo.current_commit_sha = clone_result["commit_sha"]
        if clone_result.get("clone_path"):
            repo.clone_path = clone_result["clone_path"]
        repo.last_synced_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(repo)

        return RepositoryStatusResponse(
            repository_id=repo.id,
            status="READY",
            branch=repo.default_branch,
            commit_sha=repo.current_commit_sha,
            last_synced_at=repo.last_synced_at,
            error=None,
        )

    except (GitAuthenticationError, GitRepositoryNotFoundError, GitTimeoutError, GitServiceError) as e:
        error_msg = str(e)
        repo.acquisition_status = "ERROR"
        repo.acquisition_error = error_msg
        await db.commit()

        return RepositoryStatusResponse(
            repository_id=repo.id,
            status="ERROR",
            branch=repo.default_branch,
            commit_sha=repo.current_commit_sha,
            last_synced_at=repo.last_synced_at,
            error=error_msg,
        )


@router.post("/{repository_id}/sync", response_model=RepositoryStatusResponse)
async def sync_repository_endpoint(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> RepositoryStatusResponse:
    result = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = result.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    active_op = git_service.is_operation_in_progress(repository_id)
    if active_op:
        return RepositoryStatusResponse(
            repository_id=repo.id,
            status=active_op,
            branch=repo.default_branch,
            commit_sha=repo.current_commit_sha,
            last_synced_at=repo.last_synced_at,
            error=repo.acquisition_error,
        )

    repo.acquisition_status = "SYNCING"
    repo.acquisition_error = None
    await db.commit()

    try:
        sync_result = await git_service.sync_repository(
            repo_id=repo.id,
            url=repo.url,
            branch=repo.default_branch,
        )

        repo.acquisition_status = "READY"
        repo.acquisition_error = None
        if sync_result.get("branch"):
            repo.default_branch = sync_result["branch"]
        if sync_result.get("commit_sha"):
            repo.current_commit_sha = sync_result["commit_sha"]
        if sync_result.get("clone_path"):
            repo.clone_path = sync_result["clone_path"]
        repo.last_synced_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(repo)

        return RepositoryStatusResponse(
            repository_id=repo.id,
            status="READY",
            branch=repo.default_branch,
            commit_sha=repo.current_commit_sha,
            last_synced_at=repo.last_synced_at,
            error=None,
        )

    except (GitAuthenticationError, GitRepositoryNotFoundError, GitTimeoutError, GitServiceError) as e:
        error_msg = str(e)
        repo.acquisition_status = "ERROR"
        repo.acquisition_error = error_msg
        await db.commit()

        return RepositoryStatusResponse(
            repository_id=repo.id,
            status="ERROR",
            branch=repo.default_branch,
            commit_sha=repo.current_commit_sha,
            last_synced_at=repo.last_synced_at,
            error=error_msg,
        )


# =========================================================================
# Ingestion & Automatic Code Analysis Endpoints
# =========================================================================

@router.post("/{repository_id}/index", response_model=AnalysisProgressResponse)
async def index_repository_endpoint(
    repository_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> AnalysisProgressResponse:
    """
    Start or re-index repository source code, AST parsing, and symbol extraction.
    """
    result = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = result.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # Invalidate cached RAG, impact, architecture, quality, security, history, and dependency data upon re-index
    rag_service.invalidate_cache(repository_id)
    impact_service.invalidate_cache(repository_id)
    architecture_service.invalidate_cache(repository_id)
    code_quality_service.invalidate_cache(repository_id)
    security_reliability_service.invalidate_cache(repository_id)
    git_history_service.invalidate_cache(repository_id)
    dependency_intelligence_service.invalidate_cache(repository_id)
    architecture_intelligence_service.invalidate_cache(repository_id)

    # Schedule background ingestion worker task
    background_tasks.add_task(run_indexing_task, repository_id)

    # Check immediate progress
    progress = ingestion_service.get_progress(repository_id)
    if progress:
        return AnalysisProgressResponse(
            repository_id=repository_id,
            status=progress.get("status", "running"),
            stage=progress.get("stage", "queued"),
            files_discovered=progress.get("files_discovered", 0),
            files_processed=progress.get("files_processed", 0),
            symbols_extracted=progress.get("symbols_extracted", 0),
            progress_percent=progress.get("progress_percent", 5),
            error=progress.get("error"),
            updated_at=progress.get("updated_at"),
        )

    return AnalysisProgressResponse(
        repository_id=repository_id,
        status="running",
        stage="Queued for analysis",
        files_discovered=0,
        files_processed=0,
        symbols_extracted=0,
        progress_percent=5,
        updated_at=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/{repository_id}/analysis", response_model=AnalysisProgressResponse)
async def get_repository_analysis(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> AnalysisProgressResponse:
    """
    Get latest analysis progress and status for a repository.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # 1. Check live in-memory progress first
    live_progress = ingestion_service.get_progress(repository_id)
    if live_progress and live_progress.get("status") in ["running", "QUEUED", "CLONING", "DISCOVERING", "PARSING", "BUILDING_GRAPH", "ANALYZING"]:
        return AnalysisProgressResponse(**live_progress)

    # 2. Check latest Analysis record in database
    analysis_res = await db.execute(
        select(Analysis)
        .where(Analysis.repository_id == repository_id)
        .order_by(Analysis.created_at.desc())
    )
    latest_analysis = analysis_res.scalars().first()

    if latest_analysis:
        meta = latest_analysis.metadata_json or {}
        return AnalysisProgressResponse(
            repository_id=repository_id,
            status=latest_analysis.status,
            stage=latest_analysis.summary or ("Completed" if latest_analysis.status == "completed" else latest_analysis.status),
            files_discovered=meta.get("total_files", 0),
            files_processed=meta.get("total_files", 0),
            symbols_extracted=meta.get("total_symbols", 0),
            progress_percent=100 if latest_analysis.status in ["completed", "partial"] else 0,
            error=latest_analysis.error_message,
            partial_errors=meta.get("partial_errors", []),
            unsupported_languages=meta.get("unsupported_languages", []),
            updated_at=latest_analysis.updated_at.isoformat() if latest_analysis.updated_at else None,
        )

    return AnalysisProgressResponse(
        repository_id=repository_id,
        status=repo.analysis_status or "pending",
        stage="Not analyzed yet",
        files_discovered=0,
        files_processed=0,
        symbols_extracted=0,
        progress_percent=0,
    )


@router.get("/{repository_id}/profile", response_model=RepositoryProfileResponse)
async def get_repository_profile(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> RepositoryProfileResponse:
    """
    Get the universal repository profile: languages, frameworks, package managers,
    monorepo info, entry points, API routes, databases, configs, tests, documentation,
    infrastructure, modules, services, and normalized architecture.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # 1. Check if profile already exists in repo metadata
    meta = repo.metadata_json or {}
    if "profile" in meta and meta["profile"]:
        return RepositoryProfileResponse(**meta["profile"])

    # 2. Check latest Analysis in database
    analysis_res = await db.execute(
        select(Analysis)
        .where(Analysis.repository_id == repository_id)
        .order_by(Analysis.created_at.desc())
    )
    latest_analysis = analysis_res.scalars().first()
    if latest_analysis and latest_analysis.metadata_json and "profile" in latest_analysis.metadata_json:
        return RepositoryProfileResponse(**latest_analysis.metadata_json["profile"])

    # 3. If not pre-built, build on-the-fly dynamically from indexed database records
    files_res = await db.execute(select(File).where(File.repository_id == repository_id))
    files = files_res.scalars().all()
    files_data = [
        {"id": f.id, "path": f.path, "language": f.language, "line_count": f.line_count or 0, "size_bytes": f.size_bytes or 0, "source_metadata": f.source_metadata or {}}
        for f in files
    ]

    syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id).limit(500))
    syms_data = [
        {"id": s.id, "file_id": s.file_id, "name": s.name, "symbol_type": s.symbol_type, "start_line": s.start_line, "end_line": s.end_line, "ast_metadata": s.ast_metadata or {}}
        for s in syms_res.scalars().all()
    ]

    deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id).limit(500))
    deps_data = [
        {"id": d.id, "name": d.name, "source_path": (d.metadata_json or {}).get("source_path") if d.metadata_json else None, "target_path": (d.metadata_json or {}).get("target_path") if d.metadata_json else d.name, "resolved": (d.metadata_json or {}).get("resolved", d.target_file_id is not None)}
        for d in deps_res.scalars().all()
    ]

    source_dir = git_service.get_storage_path(repository_id) if git_service.verify_repository_source(repository_id)[0] else None

    profile_dict = universal_analyzer.build_universal_profile(
        repository_id=repository_id,
        files=files_data,
        dependencies=deps_data,
        symbols=syms_data,
        source_dir=source_dir,
        commit_sha=repo.current_commit_sha,
    )
    return RepositoryProfileResponse(**profile_dict)


@router.get("/{repository_id}/snapshot", response_model=AnalysisSnapshotResponse)
async def get_repository_snapshot(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> AnalysisSnapshotResponse:
    """
    Get point-in-time analysis snapshot for a repository.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # 1. Check if snapshot is cached in repo metadata
    meta = repo.metadata_json or {}
    if "snapshot" in meta and meta["snapshot"]:
        return AnalysisSnapshotResponse(**meta["snapshot"])

    # 2. Check latest Analysis in database
    analysis_res = await db.execute(
        select(Analysis)
        .where(Analysis.repository_id == repository_id)
        .order_by(Analysis.created_at.desc())
    )
    latest_analysis = analysis_res.scalars().first()
    if latest_analysis and latest_analysis.metadata_json and "snapshot" in latest_analysis.metadata_json:
        return AnalysisSnapshotResponse(**latest_analysis.metadata_json["snapshot"])

    # 3. Otherwise build from profile
    profile_resp = await get_repository_profile(repository_id, db)
    files_res = await db.execute(select(File).where(File.repository_id == repository_id))
    total_files = len(files_res.scalars().all())

    snapshot_dict = universal_analyzer.create_analysis_snapshot(
        repository_id=repository_id,
        commit_sha=repo.current_commit_sha,
        profile=profile_resp.model_dump(),
        stats={
            "total_files": total_files,
            "commit_sha": repo.current_commit_sha,
        },
    )
    return AnalysisSnapshotResponse(**snapshot_dict)


@router.get("/{repository_id}/index/status", response_model=IndexStatusResponse)
async def get_repository_index_status(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> IndexStatusResponse:
    """
    Get the current indexing status and progress for a repository.
    Conforms to Phase 3 Section 11 API contract.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # Check live in-memory progress first
    live_progress = ingestion_service.get_progress(repository_id)
    if live_progress:
        return IndexStatusResponse(
            repository_id=repository_id,
            status=live_progress.get("status", "PENDING"),
            progress=live_progress.get("progress_percent", 0),
            files_discovered=live_progress.get("files_discovered", 0),
            files_indexed=live_progress.get("files_processed", 0),
            current_stage=live_progress.get("stage", "Processing"),
            error=live_progress.get("error"),
        )

    # Check latest Analysis in DB
    analysis_res = await db.execute(
        select(Analysis)
        .where(Analysis.repository_id == repository_id)
        .order_by(Analysis.created_at.desc())
    )
    latest_analysis = analysis_res.scalars().first()

    if latest_analysis:
        meta = latest_analysis.metadata_json or {}
        st = "COMPLETED" if latest_analysis.status == "completed" else ("FAILED" if latest_analysis.status == "failed" else "PENDING")
        return IndexStatusResponse(
            repository_id=repository_id,
            status=st,
            progress=100 if latest_analysis.status == "completed" else 0,
            files_discovered=meta.get("total_files", 0),
            files_indexed=meta.get("total_files", 0),
            current_stage=latest_analysis.summary or ("Repository ready" if latest_analysis.status == "completed" else "Analysis complete"),
            error=latest_analysis.error_message,
        )

    return IndexStatusResponse(
        repository_id=repository_id,
        status="PENDING",
        progress=0,
        files_discovered=0,
        files_indexed=0,
        current_stage="Not indexed yet",
        error=None,
    )


@router.get("/{repository_id}/files", response_model=List[FileResponse])
async def list_repository_files(
    repository_id: str,
    directory: Optional[str] = Query(None, description="Filter by parent directory path"),
    path: Optional[str] = Query(None, description="Filter by exact or partial file path"),
    language: Optional[str] = Query(None, description="Filter by programming language"),
    q: Optional[str] = Query(None, description="Search filter for path or name"),
    db: AsyncSession = Depends(get_db),
) -> List[FileResponse]:
    """
    List all indexed source files belonging strictly to the specified repository.
    Supports directory, path, language, and name filtering.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    if not repo_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    query = select(File).where(File.repository_id == repository_id)

    if language:
        query = query.where(File.language.ilike(f"%{language}%"))

    if directory:
        clean_dir = directory.strip("/").replace("\\", "/")
        query = query.where(File.path.ilike(f"{clean_dir}/%"))

    if path:
        query = query.where(File.path.ilike(f"%{path}%"))

    if q:
        query = query.where(File.path.ilike(f"%{q}%"))

    query = query.order_by(File.path.asc())

    result = await db.execute(query)
    files = result.scalars().all()

    resp = []
    for f in files:
        meta = f.source_metadata or {}
        sym_count = meta.get("symbol_count")
        resp.append(
            FileResponse(
                id=f.id,
                repository_id=f.repository_id,
                analysis_id=f.analysis_id,
                path=f.path,
                language=f.language,
                size_bytes=f.size_bytes,
                line_count=f.line_count,
                content_hash=f.content_hash,
                created_at=f.created_at,
                symbol_count=sym_count,
            )
        )
    return resp


@router.get("/{repository_id}/files/{file_id}", response_model=FileDetailResponse)
async def get_file_detail(
    repository_id: str,
    file_id: str,
    db: AsyncSession = Depends(get_db),
) -> FileDetailResponse:
    """
    Get detailed information and actual source code for a single file belonging to repository.
    Enforces strict repository ownership & IDOR protection: returns 404 if file does not belong to repository.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # 1. Fetch file with strict repository_id check
    file_res = await db.execute(
        select(File).where(File.id == file_id, File.repository_id == repository_id)
    )
    file = file_res.scalars().first()
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with id '{file_id}' not found in repository '{repository_id}'.",
        )

    # 2. Fetch real source content from disk
    source_info = source_code_service.get_file_source(repository_id, file.path)

    # 3. Fetch symbols in this file
    sym_res = await db.execute(
        select(Symbol)
        .where(Symbol.repository_id == repository_id, Symbol.file_id == file.id)
        .order_by(Symbol.start_line.asc())
    )
    symbols = sym_res.scalars().all()
    symbols_resp = [SymbolResponse.model_validate(s) for s in symbols]

    # 4. Fetch outgoing dependencies (imports made by this file)
    out_deps_res = await db.execute(
        select(Dependency).where(
            Dependency.repository_id == repository_id,
            Dependency.source_file_id == file.id,
        )
    )
    out_deps = out_deps_res.scalars().all()

    # 5. Fetch incoming dependents (files that import this file)
    in_deps_res = await db.execute(
        select(Dependency).where(
            Dependency.repository_id == repository_id,
            Dependency.target_file_id == file.id,
        )
    )
    in_deps = in_deps_res.scalars().all()

    # Query file map to populate source/target paths for dependencies
    all_files_res = await db.execute(select(File).where(File.repository_id == repository_id))
    file_map = {f.id: f.path for f in all_files_res.scalars().all()}

    def format_dep(d: Dependency) -> DependencyResponse:
        meta = d.metadata_json or {}
        return DependencyResponse(
            id=d.id,
            repository_id=d.repository_id,
            analysis_id=d.analysis_id,
            name=d.name,
            dependency_type=d.dependency_type,
            source_file_id=d.source_file_id,
            target_file_id=d.target_file_id,
            source_path=meta.get("source_path") or file_map.get(d.source_file_id),
            target_path=meta.get("target_path") or file_map.get(d.target_file_id),
            resolved=meta.get("resolved", d.target_file_id is not None),
            line=meta.get("start_line"),
            metadata_json=meta,
            created_at=d.created_at,
        )

    out_deps_resp = [format_dep(d) for d in out_deps]
    in_deps_resp = [format_dep(d) for d in in_deps]

    # Commit metadata
    repo_meta = repo.metadata_json or {}
    latest_commit = repo_meta.get("latest_commit") or repo_meta.get("head_commit")

    return FileDetailResponse(
        id=file.id,
        repository_id=file.repository_id,
        analysis_id=file.analysis_id,
        path=file.path,
        language=file.language,
        size_bytes=source_info["size_bytes"] or file.size_bytes,
        line_count=source_info["total_lines"] if not source_info["is_missing"] else file.line_count,
        content_hash=file.content_hash,
        source=source_info["source"],
        is_binary=source_info["is_binary"],
        is_missing=source_info["is_missing"],
        is_truncated=source_info["is_truncated"],
        commit_sha=latest_commit,
        branch=repo.default_branch,
        symbols=symbols_resp,
        dependencies=out_deps_resp,
        dependents=in_deps_resp,
        created_at=file.created_at,
    )


@router.get("/{repository_id}/search", response_model=RepositorySearchResponse)
async def search_repository(
    repository_id: str,
    q: str = Query("", description="Search query string or natural language question"),
    type: Optional[str] = Query("all", description="Search type: 'all', 'code', 'symbol', 'file', 'directory', 'dependency', 'query'"),
    path: Optional[str] = Query(None, description="Optional path substring filter"),
    language: Optional[str] = Query(None, description="Optional language filter"),
    limit: int = Query(50, ge=1, le=200, description="Max matches per category to return"),
    offset: int = Query(0, ge=0, description="Result pagination offset"),
    db: AsyncSession = Depends(get_db),
) -> RepositorySearchResponse:
    """
    Unified code, symbol, file, directory, and dependency search with natural-language query processor.
    Strictly scoped to the specified repository.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # If query is empty, return empty result
    if not q or not q.strip():
        return RepositorySearchResponse(
            repository_id=repository_id,
            query="",
            intent="KEYWORD_SEARCH",
            explanation="Search this repository...",
            total_matches=0,
            symbols=[],
            files=[],
            code_matches=[],
            dependencies=[],
            directories=[],
            architecture=[],
            architecture_matches=[],
            limit=limit,
            offset=offset,
            has_more=False,
        )

    search_res = await search_intelligence_service.search_repository(
        repository_id=repository_id,
        query_str=q,
        search_type=type or "all",
        path_filter=path,
        language_filter=language,
        limit=limit,
        offset=offset,
        db=db,
    )

    return RepositorySearchResponse(**search_res)



@router.get("/{repository_id}/symbols", response_model=List[SymbolResponse])
async def list_repository_symbols(
    repository_id: str,
    q: Optional[str] = Query(None, description="Filter by symbol name"),
    name: Optional[str] = Query(None, description="Filter by exact or partial symbol name"),
    symbol_type: Optional[str] = Query(None, description="Filter by symbol type (class, function, method, interface)"),
    type: Optional[str] = Query(None, description="Alias for symbol_type filter"),
    file_id: Optional[str] = Query(None, description="Filter by specific file ID"),
    file: Optional[str] = Query(None, description="Filter by file path substring or file ID"),
    language: Optional[str] = Query(None, description="Filter by file language"),
    limit: int = Query(500, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
) -> List[SymbolResponse]:
    """
    List AST code symbols belonging strictly to the specified repository.
    Supports filtering by name, type, file, and language.
    Guarantees isolation: symbols from other repositories are never returned.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    if not repo_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # Strictly scoped to repository_id
    query = select(Symbol).where(Symbol.repository_id == repository_id)

    # Filter by name / search query
    name_filter = name or q
    if name_filter:
        query = query.where(Symbol.name.ilike(f"%{name_filter}%"))

    # Filter by type / symbol_type
    target_type = symbol_type or type
    if target_type:
        query = query.where(Symbol.symbol_type == target_type)

    # Filter by file ID or file path substring
    target_file = file or file_id
    if target_file:
        # Check if target_file is a UUID
        if len(target_file) == 36 and "-" in target_file:
            query = query.where(Symbol.file_id == target_file)
        else:
            query = query.join(File, Symbol.file_id == File.id).where(File.path.ilike(f"%{target_file}%"))

    # Filter by language
    if language:
        if not target_file or not (len(target_file) != 36 or "-" not in target_file):
            query = query.join(File, Symbol.file_id == File.id)
        query = query.where(File.language == language)

    query = query.order_by(Symbol.start_line.asc()).limit(limit)
    result = await db.execute(query)
    symbols = result.scalars().all()
    return [SymbolResponse.model_validate(s) for s in symbols]


@router.get("/{repository_id}/files/{file_id}/symbols", response_model=List[SymbolResponse])
async def get_file_symbols(
    repository_id: str,
    file_id: str,
    db: AsyncSession = Depends(get_db),
) -> List[SymbolResponse]:
    """
    Get all AST symbols defined in a specific file of a repository.
    """
    file_res = await db.execute(
        select(File).where(File.repository_id == repository_id, File.id == file_id)
    )
    if not file_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File '{file_id}' not found in repository '{repository_id}'.",
        )

    query = select(Symbol).where(
        Symbol.repository_id == repository_id,
        Symbol.file_id == file_id,
    ).order_by(Symbol.start_line.asc())

    result = await db.execute(query)
    symbols = result.scalars().all()
    return [SymbolResponse.model_validate(s) for s in symbols]

# =========================================================================
# Dependencies & Graph Endpoints (Phase 5)
# =========================================================================

@router.get("/{repository_id}/dependencies")
async def get_repository_dependencies(
    repository_id: str,
    source_file: Optional[str] = Query(None, description="Filter by source file path or ID"),
    target_file: Optional[str] = Query(None, description="Filter by target file path or ID"),
    dependency_type: Optional[str] = Query(None, description="Filter by dependency type"),
    type: Optional[str] = Query(None, description="Alias for dependency_type"),
    resolved: Optional[bool] = Query(None, description="Filter by resolved status"),
    ecosystem: Optional[str] = Query(None, description="Filter by ecosystem: PyPI, npm, Go, etc."),
    centrality: Optional[str] = Query(None, description="Filter by centrality: HIGH, MEDIUM, LOW, UNUSED"),
    pinning_status: Optional[str] = Query(None, description="Filter by pinning: PINNED, CONSTRAINED, UNCONSTRAINED"),
    search: Optional[str] = Query(None, description="Search package name"),
    unused_only: bool = Query(False, description="Filter only potentially unused packages"),
    undeclared_only: bool = Query(False, description="Filter only potentially undeclared imports"),
    high_impact_only: bool = Query(False, description="Filter only high-impact packages"),
    limit: int = Query(500, ge=1, le=2000, description="Max dependencies to return"),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> List[Any]:
    """
    Get real repository dependencies: supports both graph resolution and supply-chain intelligence.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    if not repo_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # If caller specifically asked for source_file or target_file or resolved flag, query DB Dependency records
    if source_file or target_file or resolved is not None:
        query = select(Dependency).where(Dependency.repository_id == repository_id)
        effective_type = dependency_type or type
        if effective_type:
            query = query.where(Dependency.dependency_type.ilike(f"%{effective_type}%"))
        if source_file:
            if len(source_file) == 36 and "-" in source_file:
                query = query.where(Dependency.source_file_id == source_file)
            else:
                query = query.join(File, Dependency.source_file_id == File.id).where(File.path.ilike(f"%{source_file}%"))
        if target_file:
            if len(target_file) == 36 and "-" in target_file:
                query = query.where(Dependency.target_file_id == target_file)
            else:
                query = query.where(Dependency.name.ilike(f"%{target_file}%"))

        query = query.limit(limit)
        result = await db.execute(query)
        dependencies = result.scalars().all()

        resp: List[DependencyResponse] = []
        for d in dependencies:
            meta = d.metadata_json or {}
            is_resolved = meta.get("resolved", d.target_file_id is not None)
            if resolved is not None and is_resolved != resolved:
                continue
            resp.append(
                DependencyResponse(
                    id=d.id,
                    repository_id=d.repository_id,
                    analysis_id=d.analysis_id,
                    name=d.name,
                    version_spec=d.version_spec,
                    dependency_type=d.dependency_type,
                    package_manager=d.package_manager,
                    source_file_id=d.source_file_id,
                    target_file_id=d.target_file_id,
                    metadata_json=meta,
                    created_at=d.created_at,
                    updated_at=d.updated_at,
                )
            )
        return [r.model_dump() for r in resp]

    # Supply-Chain Dependency Intelligence
    data = await _get_repository_dependency_data(repository_id, db)
    deps = list(data.get("dependencies", []))

    if ecosystem:
        deps = [d for d in deps if d.get("ecosystem", "").upper() == ecosystem.upper()]
    if dependency_type or type:
        eff_t = (dependency_type or type).upper()
        deps = [d for d in deps if d.get("dependency_type", "").upper() == eff_t]
    if centrality:
        deps = [d for d in deps if d.get("centrality", "").upper() == centrality.upper()]
    if pinning_status:
        deps = [d for d in deps if d.get("pinning_status", "").upper() == pinning_status.upper()]
    if unused_only:
        deps = [d for d in deps if d.get("is_potentially_unused") is True]
    if undeclared_only:
        deps = [d for d in deps if d.get("is_potentially_undeclared") is True]
    if high_impact_only:
        deps = [d for d in deps if d.get("is_high_impact") is True]
    if search:
        s_lower = search.lower()
        deps = [d for d in deps if s_lower in d.get("name", "").lower()]

    return deps[offset : offset + limit]


@router.get("/{repository_id}/graph", response_model=GraphResponse)
async def get_repository_graph(
    repository_id: str,
    level: Optional[str] = Query("file", description="Graph level: 'directory', 'file', or 'symbol'"),
    db: AsyncSession = Depends(get_db),
) -> GraphResponse:
    """
    Get the real dependency & architecture graph for a repository with strict isolation and level support.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # Metrics from repository metadata or computed dynamically
    repo_meta = repo.metadata_json or {}
    graph_metrics = repo_meta.get("graph_metrics") or {}
    cycles = graph_metrics.get("cycles", [])

    if level == "directory":
        # Aggregate to directory-level graph dynamically
        files_res = await db.execute(select(File).where(File.repository_id == repository_id))
        files = files_res.scalars().all()
        files_data = [
            {
                "id": f.id,
                "path": f.path,
                "language": f.language,
                "line_count": f.line_count,
                "size_bytes": f.size_bytes,
                "source_metadata": f.source_metadata or {},
            }
            for f in files
        ]

        file_map = {f.id: f.path for f in files}
        deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
        deps = deps_res.scalars().all()
        deps_data = []
        for d in deps:
            meta = d.metadata_json or {}
            src_p = meta.get("source_path") or file_map.get(d.source_file_id)
            tgt_p = meta.get("target_path") or file_map.get(d.target_file_id)
            is_res = meta.get("resolved", d.target_file_id is not None)
            deps_data.append({
                "id": d.id,
                "source_path": src_p,
                "target_path": tgt_p,
                "dependency_type": d.dependency_type,
                "resolved": is_res,
                "start_line": meta.get("start_line"),
                "source_file_id": d.source_file_id,
                "target_file_id": d.target_file_id,
            })

        arch_model = architecture_service.build_architecture_model(
            repository_id=repository_id,
            files=files_data,
            dependencies=deps_data,
            cycles=cycles,
        )

        dir_nodes = [
            {
                "id": g["id"],
                "key": f"dir:{g['name']}",
                "label": g["name"],
                "type": "directory",
                "file_id": None,
                "properties": {
                    "file_count": g["file_count"],
                    "line_count": g["line_count"],
                    "code_lines": g["code_lines"],
                    "symbol_count": g["symbol_count"],
                    "incoming_dependencies": g["incoming_dependencies"],
                    "outgoing_dependencies": g["outgoing_dependencies"],
                    "languages": g["languages"],
                },
            }
            for g in arch_model["groups"]
        ]

        dir_edges = [
            {
                "id": r["id"],
                "source": r["source_group_id"],
                "target": r["target_group_id"],
                "source_label": r["source"],
                "target_label": r["target"],
                "type": "DIRECTORY_DEPENDENCY",
                "weight": float(r["dependency_count"]),
                "properties": {
                    "dependency_count": r["dependency_count"],
                    "sample_dependencies": r["dependencies"],
                },
            }
            for r in arch_model["relationships"]
        ]

        return GraphResponse(
            repository_id=repository_id,
            nodes=dir_nodes,
            edges=dir_edges,
            metrics={
                "total_nodes": len(dir_nodes),
                "total_edges": len(dir_edges),
                "connected_components": 1 if dir_nodes else 0,
                "has_cycles": len(cycles) > 0,
                "cycle_count": len(cycles),
                "cycles": cycles,
            },
            cycles=cycles,
        )

    # Default: File-level graph
    nodes_res = await db.execute(
        select(GraphNode).where(GraphNode.repository_id == repository_id)
    )
    nodes = nodes_res.scalars().all()
    node_id_to_label: dict[str, str] = {n.id: n.label for n in nodes}

    edges_res = await db.execute(
        select(GraphRelationship).where(GraphRelationship.repository_id == repository_id)
    )
    edges = edges_res.scalars().all()

    formatted_nodes = [
        {
            "id": n.id,
            "key": n.node_key,
            "label": n.label,
            "type": n.node_type,
            "file_id": n.file_id,
            "properties": n.properties or {},
        }
        for n in nodes
    ]

    formatted_edges = [
        {
            "id": e.id,
            "source": e.source_node_id,
            "target": e.target_node_id,
            "source_label": node_id_to_label.get(e.source_node_id, "Unknown"),
            "target_label": node_id_to_label.get(e.target_node_id, "Unknown"),
            "type": e.relationship_type,
            "weight": e.weight,
            "properties": e.properties or {},
        }
        for e in edges
    ]

    if not graph_metrics:
        graph_metrics = {
            "total_nodes": len(formatted_nodes),
            "total_edges": len(formatted_edges),
            "connected_components": 1 if formatted_nodes else 0,
            "has_cycles": False,
            "cycle_count": 0,
            "cycles": [],
        }

    return GraphResponse(
        repository_id=repository_id,
        nodes=formatted_nodes,
        edges=formatted_edges,
        metrics=graph_metrics,
        cycles=cycles,
    )


@router.get("/{repository_id}/architecture", response_model=ArchitectureResponse)
async def get_repository_architecture(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> ArchitectureResponse:
    """
    Get aggregated directory-level architecture model, group relationships,
    deterministic explainable health score, and cycle highlights for a repository with strict isolation.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # 1. Query files for this repository
    files_res = await db.execute(select(File).where(File.repository_id == repository_id))
    files = files_res.scalars().all()
    files_data = [
        {
            "id": f.id,
            "path": f.path,
            "language": f.language,
            "line_count": f.line_count,
            "size_bytes": f.size_bytes,
            "source_metadata": f.source_metadata or {},
        }
        for f in files
    ]

    file_map = {f.id: f.path for f in files}
    deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
    deps = deps_res.scalars().all()
    deps_data = []
    for d in deps:
        meta = d.metadata_json or {}
        src_p = meta.get("source_path") or file_map.get(d.source_file_id)
        tgt_p = meta.get("target_path") or file_map.get(d.target_file_id)
        is_res = meta.get("resolved", d.target_file_id is not None)
        deps_data.append({
            "id": d.id,
            "name": d.name,
            "source_path": src_p,
            "target_path": tgt_p,
            "dependency_type": d.dependency_type,
            "resolved": is_res,
            "start_line": meta.get("start_line"),
            "source_file_id": d.source_file_id,
            "target_file_id": d.target_file_id,
        })

    # 3. Query symbols for this repository
    syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id))
    syms = syms_res.scalars().all()
    syms_data = [
        {
            "id": s.id,
            "file_id": s.file_id,
            "name": s.name,
            "symbol_type": s.symbol_type,
            "qualified_name": s.qualified_name,
            "start_line": s.start_line,
            "end_line": s.end_line,
        }
        for s in syms
    ]

    # 4. Extract cycles from repository metadata
    repo_meta = repo.metadata_json or {}
    graph_metrics = repo_meta.get("graph_metrics") or {}
    cycles = graph_metrics.get("cycles", [])

    # 5. Build architecture model
    arch_model = architecture_service.build_architecture_model(
        repository_id=repository_id,
        files=files_data,
        dependencies=deps_data,
        cycles=cycles,
        symbols=syms_data,
    )

    return ArchitectureResponse(**arch_model)


@router.get("/{repository_id}/architecture/modules")
async def get_repository_architecture_modules(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get logical architectural modules with internal and external coupling metrics.
    """
    arch = await get_repository_architecture(repository_id, db=db)
    return {
        "repository_id": repository_id,
        "modules": arch.modules,
        "total_modules": len(arch.modules),
    }


@router.get("/{repository_id}/architecture/modules/{module_id}")
async def get_repository_architecture_module_detail(
    repository_id: str,
    module_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get details for a single logical module, its files, symbols, and dependencies.
    """
    arch = await get_repository_architecture(repository_id, db=db)
    mod = next((m for m in arch.modules if m.id == module_id or m.name.lower() == module_id.lower()), None)
    if not mod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module '{module_id}' not found in repository '{repository_id}'.",
        )
    return mod


# =========================================================================
# Phase 12: Code Quality & Technical Debt Endpoints
# =========================================================================

async def _get_repository_quality_data(repository_id: str, db: AsyncSession) -> dict:
    """Helper to compute or fetch quality data for a repository."""
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    files_res = await db.execute(select(File).where(File.repository_id == repository_id))
    files = files_res.scalars().all()
    files_data = [
        {"id": f.id, "path": f.path, "language": f.language, "line_count": f.line_count, "source_metadata": f.source_metadata or {}}
        for f in files
    ]
    file_map = {f.id: f.path for f in files}

    deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
    deps = deps_res.scalars().all()
    deps_data = [
        {
            "id": d.id,
            "name": d.name,
            "source_path": (d.metadata_json or {}).get("source_path") or file_map.get(d.source_file_id),
            "target_path": (d.metadata_json or {}).get("target_path") or file_map.get(d.target_file_id),
            "dependency_type": d.dependency_type,
            "resolved": d.target_file_id is not None,
            "start_line": (d.metadata_json or {}).get("start_line"),
        }
        for d in deps
    ]

    syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id))
    syms = syms_res.scalars().all()
    syms_data = [
        {
            "id": s.id,
            "file_id": s.file_id,
            "name": s.name,
            "symbol_type": s.symbol_type,
            "qualified_name": s.qualified_name,
            "start_line": s.start_line,
            "end_line": s.end_line,
        }
        for s in syms
    ]

    files_sources = {}
    for f in files:
        f_src = source_code_service.get_file_source(repository_id, f.path)
        files_sources[f.path] = f_src.get("source", "")

    repo_meta = repo.metadata_json or {}
    graph_metrics = repo_meta.get("graph_metrics") or {}
    cycles = graph_metrics.get("cycles", [])

    # Fetch architecture violations and drift if available
    arch_data = architecture_service.build_architecture_model(
        repository_id=repository_id,
        files=files_data,
        dependencies=deps_data,
        cycles=cycles,
        symbols=syms_data,
    )

    quality_data = code_quality_service.analyze_repository_quality(
        repository_id=repository_id,
        files=files_data,
        symbols=syms_data,
        dependencies=deps_data,
        files_sources=files_sources,
        cycles=cycles,
        arch_violations=arch_data.get("violations"),
        arch_drift=arch_data.get("drift"),
    )
    return quality_data


@router.get("/{repository_id}/quality", response_model=QualitySummaryResponse)
async def get_repository_quality(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> QualitySummaryResponse:
    """
    Get repository code quality summary, explainable technical debt score (0–100),
    factor breakdown, and top maintainability hotspots.
    """
    data = await _get_repository_quality_data(repository_id, db)
    return QualitySummaryResponse(**data)


@router.get("/{repository_id}/quality/findings", response_model=QualityFindingsResponse)
async def get_repository_quality_findings(
    repository_id: str,
    category: Optional[str] = Query(None, description="Filter by category (COMPLEXITY, DUPLICATION, COUPLING, etc.)"),
    severity: Optional[str] = Query(None, description="Filter by severity (CRITICAL, HIGH, MEDIUM, LOW)"),
    file_path: Optional[str] = Query(None, description="Filter by file path"),
    symbol: Optional[str] = Query(None, description="Filter by symbol name"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> QualityFindingsResponse:
    """
    Get paginated technical debt and code quality findings with evidence and line numbers.
    """
    data = await _get_repository_quality_data(repository_id, db)
    findings = data.get("findings", [])

    if category:
        findings = [f for f in findings if f.get("category", "").upper() == category.upper()]
    if severity:
        findings = [f for f in findings if f.get("severity", "").upper() == severity.upper()]
    if file_path:
        findings = [f for f in findings if file_path.lower() in (f.get("file_path") or "").lower()]
    if symbol:
        findings = [f for f in findings if symbol.lower() in (f.get("symbol") or "").lower()]

    total = len(findings)
    paged = findings[offset : offset + limit]

    return QualityFindingsResponse(
        repository_id=repository_id,
        total=total,
        findings=paged,
        limit=limit,
        offset=offset,
    )


@router.get("/{repository_id}/quality/files", response_model=QualityFilesResponse)
async def get_repository_quality_files(
    repository_id: str,
    risk_level: Optional[str] = Query(None, description="Filter by risk level (CRITICAL, HIGH, MEDIUM, LOW)"),
    sort_by: Optional[str] = Query("risk", description="Sort by risk, complexity, loc, duplication, coupling, findings"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> QualityFilesResponse:
    """
    Get file-level code quality metrics table (LOC, complexity, duplication, coupling, risk level).
    """
    data = await _get_repository_quality_data(repository_id, db)
    files = data.get("files", [])

    if risk_level:
        files = [f for f in files if f.get("risk_level", "").upper() == risk_level.upper()]

    if sort_by == "complexity":
        files.sort(key=lambda x: -x.get("complexity", 0))
    elif sort_by == "loc":
        files.sort(key=lambda x: -x.get("lines_of_code", 0))
    elif sort_by == "duplication":
        files.sort(key=lambda x: -x.get("duplication_percentage", 0))
    elif sort_by == "coupling":
        files.sort(key=lambda x: -(x.get("incoming_dependencies", 0) + x.get("outgoing_dependencies", 0)))
    elif sort_by == "findings":
        files.sort(key=lambda x: -x.get("findings_count", 0))
    else:  # risk default
        files.sort(key=lambda x: (
            0 if x.get("risk_level") == "CRITICAL" else (1 if x.get("risk_level") == "HIGH" else (2 if x.get("risk_level") == "MEDIUM" else 3)),
            -x.get("complexity", 0),
            -x.get("lines_of_code", 0)
        ))

    total = len(files)
    paged = files[offset : offset + limit]

    return QualityFilesResponse(
        repository_id=repository_id,
        total=total,
        files=paged,
        limit=limit,
        offset=offset,
    )


@router.get("/{repository_id}/quality/duplications", response_model=QualityDuplicationsResponse)
async def get_repository_quality_duplications(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> QualityDuplicationsResponse:
    """
    Get detected code duplication clusters across repository files.
    """
    data = await _get_repository_quality_data(repository_id, db)
    dups = data.get("duplications", [])
    return QualityDuplicationsResponse(
        repository_id=repository_id,
        total=len(dups),
        clusters=dups,
    )


# =========================================================================
# Phase 13: Security & Reliability Intelligence Endpoints
# =========================================================================

async def _get_repository_security_data(repository_id: str, db: AsyncSession) -> dict:
    """Helper to compute or fetch security & reliability intelligence data."""
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    files_res = await db.execute(select(File).where(File.repository_id == repository_id))
    files = files_res.scalars().all()
    files_data = [
        {"id": f.id, "path": f.path, "language": f.language, "line_count": f.line_count, "source_metadata": f.source_metadata or {}}
        for f in files
    ]
    file_map = {f.id: f.path for f in files}

    deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
    deps = deps_res.scalars().all()
    deps_data = [
        {
            "id": d.id,
            "name": d.name,
            "source_path": (d.metadata_json or {}).get("source_path") or file_map.get(d.source_file_id),
            "target_path": (d.metadata_json or {}).get("target_path") or file_map.get(d.target_file_id),
            "dependency_type": d.dependency_type,
            "resolved": d.target_file_id is not None,
            "start_line": (d.metadata_json or {}).get("start_line"),
        }
        for d in deps
    ]

    syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id))
    syms = syms_res.scalars().all()
    syms_data = [
        {
            "id": s.id,
            "file_id": s.file_id,
            "name": s.name,
            "symbol_type": s.symbol_type,
            "qualified_name": s.qualified_name,
            "start_line": s.start_line,
            "end_line": s.end_line,
        }
        for s in syms
    ]

    files_sources = {}
    for f in files:
        f_src = source_code_service.get_file_source(repository_id, f.path)
        files_sources[f.path] = f_src.get("source", "")

    repo_meta = repo.metadata_json or {}
    graph_metrics = repo_meta.get("graph_metrics") or {}
    cycles = graph_metrics.get("cycles", [])

    security_data = security_reliability_service.analyze_repository_security_reliability(
        repository_id=repository_id,
        files=files_data,
        symbols=syms_data,
        dependencies=deps_data,
        files_sources=files_sources,
        cycles=cycles,
    )
    return security_data


@router.get("/{repository_id}/security", response_model=SecurityReliabilitySummaryResponse)
async def get_repository_security_summary(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> SecurityReliabilitySummaryResponse:
    """
    Get repository security & reliability summary, explainable scores (0–100),
    factor breakdowns, external services inventory, and top findings.
    """
    data = await _get_repository_security_data(repository_id, db)
    return SecurityReliabilitySummaryResponse(**data)


@router.get("/{repository_id}/security/findings", response_model=SecurityReliabilityFindingsResponse)
async def get_repository_security_findings(
    repository_id: str,
    finding_type: Optional[str] = Query(None, description="Filter by finding type: SECURITY or RELIABILITY"),
    category: Optional[str] = Query(None, description="Filter by category (SECRET_EXPOSURE, INJECTION, TIMEOUT, etc.)"),
    severity: Optional[str] = Query(None, description="Filter by severity (CRITICAL, HIGH, MEDIUM, LOW)"),
    confidence: Optional[str] = Query(None, description="Filter by confidence (HIGH, MEDIUM, LOW)"),
    file_path: Optional[str] = Query(None, description="Filter by file path"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> SecurityReliabilityFindingsResponse:
    """
    Get paginated security & reliability findings with redacted evidence.
    """
    data = await _get_repository_security_data(repository_id, db)
    findings = data.get("findings", [])

    if finding_type:
        findings = [f for f in findings if f.get("finding_type", "").upper() == finding_type.upper()]
    if category:
        findings = [f for f in findings if f.get("category", "").upper() == category.upper()]
    if severity:
        findings = [f for f in findings if f.get("severity", "").upper() == severity.upper()]
    if confidence:
        findings = [f for f in findings if f.get("confidence", "").upper() == confidence.upper()]
    if file_path:
        findings = [f for f in findings if file_path.lower() in (f.get("file_path") or "").lower()]

    total = len(findings)
    paged = findings[offset : offset + limit]

    return SecurityReliabilityFindingsResponse(
        repository_id=repository_id,
        total=total,
        findings=paged,
        limit=limit,
        offset=offset,
    )


@router.get("/{repository_id}/security/dependencies", response_model=SecurityDependenciesResponse)
async def get_repository_security_dependencies(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> SecurityDependenciesResponse:
    """
    Get extracted dependency manifest inventory with ecosystems and version pinning status.
    """
    data = await _get_repository_security_data(repository_id, db)
    deps = data.get("dependencies", [])
    return SecurityDependenciesResponse(
        repository_id=repository_id,
        total=len(deps),
        dependencies=deps,
    )


@router.get("/{repository_id}/security/hotspots", response_model=SecurityHotspotsResponse)
async def get_repository_security_hotspots(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> SecurityHotspotsResponse:
    """
    Get reliability hotspots and Single Point of Failure (SPOF) modules.
    """
    data = await _get_repository_security_data(repository_id, db)
    hotspots = data.get("top_hotspots", [])
    return SecurityHotspotsResponse(
        repository_id=repository_id,
        total=len(hotspots),
        hotspots=hotspots,
    )


# =========================================================================
# Phase 14: Git History & Evolution Intelligence Endpoints
# =========================================================================

async def _get_repository_history_data(repository_id: str, db: AsyncSession) -> dict:
    """Helper to extract or fetch Git history and evolution intelligence data."""
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    files_res = await db.execute(select(File).where(File.repository_id == repository_id))
    files = files_res.scalars().all()
    files_data = [{"id": f.id, "path": f.path, "language": f.language} for f in files]

    # Fetch code quality metrics if available to cross-reference complexity + churn
    quality_metrics = []
    try:
        q_data = await _get_repository_quality_data(repository_id, db)
        quality_metrics = q_data.get("files", [])
    except Exception:
        pass

    clone_path = repo.clone_path or str(git_service.get_repository_path(repository_id))

    history_data = git_history_service.analyze_repository_history(
        repository_id=repository_id,
        clone_path=clone_path,
        files=files_data,
        quality_metrics=quality_metrics,
    )
    return history_data


@router.get("/{repository_id}/history/summary", response_model=GitHistorySummaryResponse)
async def get_repository_history_summary(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> GitHistorySummaryResponse:
    """
    Get Git history evolution summary, commit velocity, top churn files, and contributor breakdown.
    """
    data = await _get_repository_history_data(repository_id, db)
    return GitHistorySummaryResponse(**data)


@router.get("/{repository_id}/history/files", response_model=FileEvolutionListResponse)
async def get_repository_file_evolution(
    repository_id: str,
    sort_by: Optional[str] = Query(None, description="Sort by: churn, commits, recent_churn, inactivity, ownership"),
    activity_status: Optional[str] = Query(None, description="Filter by status: ACTIVE, LOW_ACTIVITY, INACTIVE"),
    knowledge_concentration: Optional[str] = Query(None, description="Filter by concentration: HIGH, MEDIUM, BALANCED"),
    high_risk_only: bool = Query(False, description="Filter only high evolution risk files"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> FileEvolutionListResponse:
    """
    Get file-level evolution, churn, and author ownership metrics.
    """
    data = await _get_repository_history_data(repository_id, db)
    files = list(data.get("files_metrics", []))

    if activity_status:
        files = [f for f in files if f.get("activity_status", "").upper() == activity_status.upper()]
    if knowledge_concentration:
        files = [f for f in files if f.get("knowledge_concentration", "").upper() == knowledge_concentration.upper()]
    if high_risk_only:
        files = [f for f in files if f.get("is_high_evolution_risk") is True]

    if sort_by == "commits":
        files.sort(key=lambda x: -x["total_commits"])
    elif sort_by == "recent_churn":
        files.sort(key=lambda x: -x["recent_churn_30d"])
    elif sort_by == "inactivity":
        files.sort(key=lambda x: -x["inactivity_days"])
    elif sort_by == "ownership":
        files.sort(key=lambda x: -x["primary_author_ownership"])
    else:  # default churn
        files.sort(key=lambda x: -x["total_churn"])

    total = len(files)
    paged = files[offset : offset + limit]

    return FileEvolutionListResponse(
        repository_id=repository_id,
        total=total,
        files=paged,
        limit=limit,
        offset=offset,
    )


@router.get("/{repository_id}/commits", response_model=CommitListResponse)
async def get_repository_commits(
    repository_id: str,
    author: Optional[str] = Query(None, description="Filter by author name or email"),
    category: Optional[str] = Query(None, description="Filter by classification: FEATURE, FIX, REFACTOR, etc."),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> CommitListResponse:
    """
    Get paginated Git commits with classifications and file stats.
    """
    data = await _get_repository_history_data(repository_id, db)
    commits = list(data.get("commits", []))

    if author:
        author_lower = author.lower()
        commits = [
            c for c in commits
            if author_lower in (c.get("author_name") or "").lower() or author_lower in (c.get("author_email") or "").lower()
        ]
    if category:
        commits = [c for c in commits if c.get("category", "").upper() == category.upper()]

    total = len(commits)
    paged = commits[offset : offset + limit]

    return CommitListResponse(
        repository_id=repository_id,
        total=total,
        commits=paged,
        limit=limit,
        offset=offset,
    )


@router.get("/{repository_id}/commits/{commit_sha}", response_model=CommitDetailResponse)
async def get_repository_commit_detail(
    repository_id: str,
    commit_sha: str,
    db: AsyncSession = Depends(get_db),
) -> CommitDetailResponse:
    """
    Get detailed commit information and changed files diff stats.
    """
    data = await _get_repository_history_data(repository_id, db)
    commits = data.get("commits", [])
    matched = next((c for c in commits if c.get("commit_sha", "").startswith(commit_sha)), None)
    if not matched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Commit with SHA '{commit_sha}' not found in repository '{repository_id}'.",
        )
    return CommitDetailResponse(
        repository_id=repository_id,
        commit=CommitItem(**matched),
    )


@router.get("/{repository_id}/files/{file_id}/history", response_model=FileEvolutionDetailResponse)
async def get_repository_file_history(
    repository_id: str,
    file_id: str,
    db: AsyncSession = Depends(get_db),
) -> FileEvolutionDetailResponse:
    """
    Get history, churn, author ownership, and commits for a specific file.
    """
    file_res = await db.execute(select(File).where(File.id == file_id, File.repository_id == repository_id))
    target_file = file_res.scalars().first()
    if not target_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File with id '{file_id}' not found in repository '{repository_id}'.",
        )

    data = await _get_repository_history_data(repository_id, db)
    files_metrics = data.get("files_metrics", [])
    matched_metric = next((fm for fm in files_metrics if fm.get("file_path") == target_file.path), None)

    if not matched_metric:
        # File has no commits in current git window
        matched_metric = {
            "file_path": target_file.path,
            "file_id": target_file.id,
            "total_commits": 0,
            "first_commit_date": None,
            "last_commit_date": None,
            "age_days": 0,
            "inactivity_days": 0,
            "activity_status": "ACTIVE",
            "total_additions": 0,
            "total_deletions": 0,
            "total_churn": 0,
            "recent_churn_30d": 0,
            "change_frequency": 0.0,
            "unique_authors_count": 0,
            "primary_author": None,
            "primary_author_ownership": 0.0,
            "knowledge_concentration": "BALANCED",
            "authors": [],
            "complexity": None,
            "is_high_evolution_risk": False,
        }

    # Extract all commits touching this file
    all_commits = data.get("commits", [])
    touching_commits = [
        c for c in all_commits
        if any(fc.get("file_path") == target_file.path for fc in c.get("file_changes", []))
    ]

    return FileEvolutionDetailResponse(
        repository_id=repository_id,
        metric=FileEvolutionMetricItem(**matched_metric),
        commits=touching_commits,
    )


# =========================================================================
# Phase 15: Dependency Intelligence & Supply-Chain Endpoints
# =========================================================================

async def _get_repository_dependency_data(repository_id: str, db: AsyncSession) -> dict:
    """Helper to compute or fetch Dependency Intelligence & Supply-Chain data."""
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    files_res = await db.execute(select(File).where(File.repository_id == repository_id))
    files = files_res.scalars().all()
    files_data = [{"id": f.id, "path": f.path, "language": f.language} for f in files]

    files_sources = {}
    for f in files:
        f_src = source_code_service.get_file_source(repository_id, f.path)
        files_sources[f.path] = f_src.get("source", "")

    # Architecture nodes if available
    arch_nodes = []
    try:
        a_data = await _get_repository_architecture_data(repository_id, db)
        arch_nodes = a_data.get("nodes", [])
    except Exception:
        pass

    dep_data = dependency_intelligence_service.analyze_repository_dependencies(
        repository_id=repository_id,
        files=files_data,
        files_sources=files_sources,
        architecture_nodes=arch_nodes,
    )
    return dep_data


@router.get("/{repository_id}/dependencies/summary", response_model=DependencySummaryResponse)
async def get_repository_dependencies_summary(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> DependencySummaryResponse:
    """
    Get repository dependency summary metrics (direct, transitive, dev, unpinned, unused, undeclared).
    """
    data = await _get_repository_dependency_data(repository_id, db)
    return DependencySummaryResponse(**data)


@router.get("/{repository_id}/dependencies/{dependency_id}")
async def get_repository_dependency_detail(
    repository_id: str,
    dependency_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get detailed metadata for a dependency (supply-chain package or repository target entity).
    """
    data = await _get_repository_dependency_data(repository_id, db)
    deps = data.get("dependencies", [])
    matched = next((d for d in deps if d.get("id") == dependency_id or d.get("name", "").lower() == dependency_id.lower()), None)
    if matched:
        return DependencyDetailResponse(
            repository_id=repository_id,
            dependency=DependencyIntelligenceItem(**matched),
        )

    # Fallback to Phase 10 target dependency resolution (file / symbol / module)
    try:
        deps_result = await impact_service.get_target_dependencies(
            db=db,
            repository_id=repository_id,
            target_id=dependency_id,
        )
        return deps_result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/dependencies/{dependency_id}/impact", response_model=DependencyImpactResponse)
async def get_repository_dependency_impact(
    repository_id: str,
    dependency_id: str,
    db: AsyncSession = Depends(get_db),
) -> DependencyImpactResponse:
    """
    Analyze architectural and source impact surface for a given dependency.
    """
    data = await _get_repository_dependency_data(repository_id, db)
    deps = data.get("dependencies", [])
    matched = next((d for d in deps if d.get("id") == dependency_id or d.get("name", "").lower() == dependency_id.lower()), None)
    if not matched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dependency with id/name '{dependency_id}' not found in repository '{repository_id}'.",
        )

    importing_files = [f["file_path"] for f in matched.get("importing_files", [])]
    test_files = [f for f in importing_files if any(t in f.lower() for t in ["test", "spec", "tests/"])]
    symbols = []
    for f in matched.get("importing_files", []):
        symbols.extend(f.get("imported_symbols", []))

    return DependencyImpactResponse(
        repository_id=repository_id,
        dependency_id=matched["id"],
        dependency_name=matched["name"],
        affected_files=importing_files,
        affected_symbols=sorted(list(set(symbols))),
        affected_architecture_nodes=matched.get("affected_architecture_nodes", []),
        affected_test_files=test_files,
        total_affected_files=len(importing_files),
        centrality=matched.get("centrality", "LOW"),
        explanation=f"Dependency '{matched['name']}' is imported across {len(importing_files)} file(s) and {len(matched.get('affected_architecture_nodes', []))} architecture component(s).",
    )


@router.delete("/{repository_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_repository(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    result = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = result.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    # 1. Clean up local repository storage (never touch GitHub remote)
    git_service.remove_repository_source(repository_id)

    # Invalidate RAG, Impact, Architecture, Quality, Security, History, and Dependency cache for this repository
    rag_service.invalidate_cache(repository_id)
    impact_service.invalidate_cache(repository_id)
    architecture_service.invalidate_cache(repository_id)
    code_quality_service.invalidate_cache(repository_id)
    security_reliability_service.invalidate_cache(repository_id)
    git_history_service.invalidate_cache(repository_id)
    dependency_intelligence_service.invalidate_cache(repository_id)
    future_impact_simulator_service.invalidate_cache(repository_id)

    # 2. Remove repository record from database (cascades to files, symbols, analyses)
    await db.execute(delete(Repository).where(Repository.id == repository_id))
    await db.commit()


# =========================================================================
# Phase 9: Evidence-Grounded Repository Q&A / RAG Endpoints
# =========================================================================

@router.post("/{repository_id}/query", response_model=RepositoryQueryResponse)
async def query_repository(
    repository_id: str,
    payload: RepositoryQueryRequest,
    db: AsyncSession = Depends(get_db),
) -> RepositoryQueryResponse:
    """
    Query the repository with evidence-grounded Q&A / RAG.
    Strictly repository-scoped. Never fabricates repository code or claims.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    if not payload.question or not payload.question.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Question string cannot be empty.",
        )

    result = await rag_service.answer_repository_query(
        repository_id=repository_id,
        question=payload.question.strip(),
        conversation_id=payload.conversation_id,
        db=db,
    )

    return RepositoryQueryResponse(**result)


@router.get("/{repository_id}/conversations", response_model=ConversationListResponse)
async def list_repository_conversations(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> ConversationListResponse:
    """
    List all conversations strictly belonging to the specified repository.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    if not repo_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    conv_q = (
        select(Conversation)
        .where(Conversation.repository_id == repository_id)
        .order_by(Conversation.created_at.desc())
    )
    conv_rows = (await db.execute(conv_q)).scalars().all()
    conversations = [
        ConversationResponse(
            id=c.id,
            repository_id=c.repository_id,
            title=c.title,
            context_type=c.context_type,
            messages=c.messages or [],
            created_at=c.created_at,
            updated_at=c.updated_at,
        )
        for c in conv_rows
    ]

    return ConversationListResponse(
        repository_id=repository_id,
        conversations=conversations,
    )


@router.post("/{repository_id}/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_repository_conversation(
    repository_id: str,
    payload: Optional[ConversationCreateRequest] = None,
    db: AsyncSession = Depends(get_db),
) -> ConversationResponse:
    """
    Create a new conversation session strictly scoped to the specified repository.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    title = payload.title if payload and payload.title else f"Chat about {repo.name}"
    conversation = Conversation(
        repository_id=repository_id,
        workspace_id=repo.workspace_id,
        title=title,
        context_type="repository",
        messages=[],
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)

    return ConversationResponse(
        id=conversation.id,
        repository_id=conversation.repository_id,
        title=conversation.title,
        context_type=conversation.context_type,
        messages=conversation.messages or [],
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
    )


@router.get("/{repository_id}/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_repository_conversation(
    repository_id: str,
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
) -> ConversationResponse:
    """
    Retrieve conversation history by ID for the active repository.
    """
    conv_q = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.repository_id == repository_id,
    )
    conv_res = await db.execute(conv_q)
    conv = conv_res.scalars().first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation '{conversation_id}' not found for repository '{repository_id}'.",
        )

    return ConversationResponse(
        id=conv.id,
        repository_id=conv.repository_id,
        title=conv.title,
        context_type=conv.context_type,
        messages=conv.messages or [],
        created_at=conv.created_at,
        updated_at=conv.updated_at,
    )


@router.delete("/{repository_id}/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_repository_conversation(
    repository_id: str,
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a conversation by ID from the repository.
    """
    conv_q = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.repository_id == repository_id,
    )
    conv_res = await db.execute(conv_q)
    conv = conv_res.scalars().first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Conversation '{conversation_id}' not found for repository '{repository_id}'.",
        )

    await db.execute(delete(Conversation).where(Conversation.id == conversation_id))
    await db.commit()


# =========================================================================
# Phase 10 & Phase 19: Dependency & Impact Intelligence Endpoints
# =========================================================================

@router.get("/{repository_id}/impact/{target_id}", response_model=ImpactAnalysisResponse)
async def get_repository_impact_analysis(
    repository_id: str,
    target_id: str,
    target_type: Optional[str] = Query(None, description="Optional target type: FILE, SYMBOL, CLASS, FUNCTION, METHOD, MODULE, API, DEPENDENCY, COMPONENT"),
    direction: str = Query("both", pattern="^(upstream|downstream|both)$", description="Traversal direction"),
    max_depth: int = Query(3, ge=1, le=10, description="Maximum traversal depth (1..10)"),
    limit: int = Query(500, ge=1, le=1000, description="Maximum number of nodes in impact graph"),
    db: AsyncSession = Depends(get_db),
) -> ImpactAnalysisResponse:
    """
    Real Phase 19 Impact Intelligence for CodeAtlas.
    Calculates upstream dependencies, downstream impact, blast radius, cycles,
    callers, callees, affected files, modules, APIs, tests, dependencies,
    architecture boundary crossings, line-level evidence, uncertainty analysis,
    and deterministic risk score for a selected normalized target.
    Strictly repository-isolated.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    if repo.analysis_status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Repository '{repo.name}' has not been fully indexed yet (status: {repo.analysis_status}). Please wait for indexing to complete.",
        )

    meta = repo.metadata_json or {}
    index_version = meta.get("head_commit_hash") or meta.get("analysis_summary", {}).get("total_files", "v1")

    try:
        impact_result = await impact_service.analyze_impact(
            db=db,
            repository_id=repository_id,
            target_id=target_id,
            target_type=target_type,
            direction=direction,
            max_depth=max_depth,
            limit=limit,
            index_version=str(index_version),
        )
        return impact_result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error during impact analysis for target '{target_id}' in repo '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Impact analysis error: {str(e)}",
        )


@router.post("/{repository_id}/impact/resolve", response_model=ImpactTargetItem)
async def resolve_repository_impact_target(
    repository_id: str,
    payload: ImpactTargetResolveRequest,
    db: AsyncSession = Depends(get_db),
) -> ImpactTargetItem:
    """
    Phase 19: Resolves a normalized impact target (FILE, SYMBOL, CLASS, FUNCTION, METHOD, MODULE, API, DEPENDENCY, COMPONENT)
    scoped strictly to the given repository with database identity verification.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    resolved = await impact_service.resolve_target(
        db=db,
        repository_id=repository_id,
        target_id=payload.target,
        target_type=payload.target_type,
    )
    if not resolved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target '{payload.target}' could not be resolved in repository '{repository_id}'.",
        )
    return resolved


@router.post("/{repository_id}/impact/explain", response_model=ImpactAnalysisResponse)
async def explain_repository_impact(
    repository_id: str,
    payload: ImpactExplainRequest,
    db: AsyncSession = Depends(get_db),
) -> ImpactAnalysisResponse:
    """
    Phase 19: Generates a complete impact analysis and structured AI explanation answering the 12 core questions
    with line-level evidence and uncertainty warnings.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    meta = repo.metadata_json or {}
    index_version = meta.get("head_commit_hash") or meta.get("analysis_summary", {}).get("total_files", "v1")

    try:
        impact_result = await impact_service.analyze_impact(
            db=db,
            repository_id=repository_id,
            target_id=payload.target_id,
            target_type=payload.target_type,
            direction=payload.direction or "both",
            max_depth=payload.max_depth or 3,
            index_version=str(index_version),
        )
        return impact_result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error during impact explain for target '{payload.target_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Impact explain error: {str(e)}",
        )


# =========================================================================
# Phase 18: Advanced Architecture Intelligence Endpoints
# =========================================================================

@router.get("/{repository_id}/architecture/intelligence", response_model=AdvancedArchitectureIntelligenceResponse)
async def get_repository_architecture_intelligence(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> AdvancedArchitectureIntelligenceResponse:
    """
    Get comprehensive Advanced Architecture Intelligence for a repository.
    Includes 12 node types, 11 edge types, canonical component discovery,
    end-to-end data flows, coupling/instability metrics, circular dependency analysis,
    and architectural violation detection backed by repository evidence.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    try:
        intel = await architecture_intelligence_service.get_advanced_architecture_intelligence(
            repository_id=repository_id,
            db=db,
        )
        return AdvancedArchitectureIntelligenceResponse(**intel)
    except Exception as e:
        logger.error(f"Error fetching architecture intelligence for repo '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Architecture intelligence error: {str(e)}",
        )


@router.get("/{repository_id}/architecture/graph")
async def get_advanced_architecture_graph(
    repository_id: str,
    node_type: Optional[str] = Query(None, description="Filter by node_type (e.g., service, module, api, database)"),
    edge_type: Optional[str] = Query(None, description="Filter by edge relationship_type (e.g., CALLS, PERSISTS_TO, EXPOSES)"),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get the multi-entity Architecture Graph for a repository.
    Supports node_type and edge_type filtering.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    if not repo_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    intel = await architecture_intelligence_service.get_advanced_architecture_intelligence(
        repository_id=repository_id,
        db=db,
    )
    graph = intel.get("graph", {})
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])

    if node_type:
        nodes = [n for n in nodes if n.get("node_type", "").lower() == node_type.lower()]
        node_ids = {n["id"] for n in nodes}
        edges = [e for e in edges if e["source"] in node_ids and e["target"] in node_ids]

    if edge_type:
        edges = [e for e in edges if e.get("relationship_type", "").upper() == edge_type.upper()]

    return {
        "repository_id": repository_id,
        "nodes": nodes,
        "edges": edges,
        "total_nodes": len(nodes),
        "total_edges": len(edges),
        "node_types": graph.get("node_types", []),
        "edge_types": graph.get("edge_types", []),
    }


@router.get("/{repository_id}/architecture/data-flows")
async def get_architecture_data_flows(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get traced end-to-end data flow paths (e.g. Route -> Controller -> Service -> Repository -> Database)
    discovered through repository code evidence.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    if not repo_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    intel = await architecture_intelligence_service.get_advanced_architecture_intelligence(
        repository_id=repository_id,
        db=db,
    )
    return {
        "repository_id": repository_id,
        "data_flows": intel.get("data_flows", []),
        "total_data_flows": len(intel.get("data_flows", [])),
    }


@router.get("/{repository_id}/architecture/coupling")
async def get_architecture_coupling_metrics(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Get component and module coupling analysis including Afferent coupling (Ca),
    Efferent coupling (Ce), Martin's Instability metric (I = Ce / (Ca + Ce)),
    architectural hubs, and isolated/orphan modules.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    if not repo_res.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    intel = await architecture_intelligence_service.get_advanced_architecture_intelligence(
        repository_id=repository_id,
        db=db,
    )
    return {
        "repository_id": repository_id,
        **intel.get("coupling", {}),
    }


@router.get("/{repository_id}/architecture/diff", response_model=ArchitectureSnapshotDiffResponse)
async def get_architecture_snapshot_diff(
    repository_id: str,
    base_commit: Optional[str] = Query(None, description="Optional previous commit SHA to diff against"),
    db: AsyncSession = Depends(get_db),
) -> ArchitectureSnapshotDiffResponse:
    """
    Diff architectural components (modules, services, API endpoints) between repository snapshots.
    If base_commit is not provided, compares against initial baseline or previous snapshot.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    meta = repo.metadata_json or {}
    curr_profile = meta.get("profile") or {}
    curr_commit = repo.current_commit_sha or "HEAD"
    curr_profile["commit_sha"] = curr_commit

    base_profile: Dict[str, Any] = {"commit_sha": base_commit or "INIT", "modules": [], "services": [], "api_endpoints": []}

    diff_result = architecture_intelligence_service.diff_architecture_snapshots(
        base_profile=base_profile,
        current_profile=curr_profile,
    )
    return ArchitectureSnapshotDiffResponse(**diff_result)


# =========================================================================
# Phase 20: Code Time Machine Endpoints
# =========================================================================

@router.get("/{repository_id}/history/snapshots", response_model=HistoricalSnapshotListResponse)
async def get_repository_historical_snapshots(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> HistoricalSnapshotListResponse:
    """
    Get historical repository snapshots representing states at specific commits.
    Combines persisted architecture/index snapshots with git commit points.
    """
    try:
        data = await time_machine_service.get_historical_snapshots(db=db, repository_id=repository_id)
        return HistoricalSnapshotListResponse(**data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/history/files/{file_id:path}", response_model=FileEvolutionHistoryResponse)
async def get_repository_file_history(
    repository_id: str,
    file_id: str,
    db: AsyncSession = Depends(get_db),
) -> FileEvolutionHistoryResponse:
    """
    Get real historical evolution for a tracked file:
    - First appearance and last modification commits
    - Total additions, deletions, commit count, and churn
    - Author contributions & sequence
    - Rename history via git log --follow
    - Available analysis snapshots
    """
    try:
        data = await time_machine_service.get_file_evolution(
            db=db, repository_id=repository_id, file_identifier=file_id
        )
        return FileEvolutionHistoryResponse(**data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/history/commits/{commit_hash}", response_model=CommitDetailPhase20Response)
async def get_repository_commit_details(
    repository_id: str,
    commit_hash: str,
    db: AsyncSession = Depends(get_db),
) -> CommitDetailPhase20Response:
    """
    Get detailed information for a specific Git commit:
    - Commit metadata (hash, parent, author, email, timestamp, message, branch)
    - Changed files with unified diff hunks and line-level coordinates
    - AST symbol changes mapped with evidence and uncertainty detection
    - Architectural layer changes
    """
    try:
        data = await time_machine_service.get_commit_details(
            db=db, repository_id=repository_id, commit_hash=commit_hash
        )
        return CommitDetailPhase20Response(**data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.post("/{repository_id}/history/compare", response_model=CommitCompareResponse)
async def compare_repository_commits(
    repository_id: str,
    request: CommitCompareRequest,
    db: AsyncSession = Depends(get_db),
) -> CommitCompareResponse:
    """
    Compare two commits in a repository:
    - Added, deleted, modified, and renamed files
    - Real file-level diff hunks with line coordinates
    - Added, deleted, modified, and renamed symbols mapped from AST
    - Dependency manifest changes
    - API changes
    - Architectural layer changes
    - Quantitative metrics deltas
    """
    try:
        data = await time_machine_service.compare_commits(
            db=db,
            repository_id=repository_id,
            from_commit=request.from_commit,
            to_commit=request.to_commit,
        )
        return CommitCompareResponse(**data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================================
# Phase 21: Technical Debt & Risk Intelligence Endpoints
# =========================================================================

@router.get("/{repository_id}/debt", response_model=TechnicalDebtSummaryResponse)
async def get_repository_technical_debt(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> TechnicalDebtSummaryResponse:
    """
    Get comprehensive technical debt intelligence for the repository:
    - Debt score (0–100)
    - Findings distribution by category (Complexity, Duplication, Dependency, Architecture, Test Gap, Documentation)
    - Estimated remediation effort in engineering hours
    """
    try:
        data = await technical_debt_service.analyze_technical_debt(db=db, repository_id=repository_id)
        return TechnicalDebtSummaryResponse(**data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/risk", response_model=RepositoryRiskSummaryResponse)
async def get_repository_risk(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> RepositoryRiskSummaryResponse:
    """
    Get repository-wide risk intelligence and explainable signals:
    - Multi-signal composite risk score
    - Risk distribution across files/modules
    - Top contributing risk factors
    - Signals breakdown (Complexity, Historical Churn, Coupling, Findings)
    """
    try:
        data = await risk_intelligence_service.analyze_repository_risk(db=db, repository_id=repository_id)
        return RepositoryRiskSummaryResponse(**data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/findings", response_model=List[TechnicalDebtFindingItem])
async def get_repository_debt_findings(
    repository_id: str,
    category: Optional[str] = Query(None, description="Filter by category (COMPLEXITY, DUPLICATION, DEPENDENCY, ARCHITECTURE, TEST_GAP, DOCUMENTATION)"),
    severity: Optional[str] = Query(None, description="Filter by severity (CRITICAL, HIGH, MEDIUM, LOW, INFO)"),
    rule: Optional[str] = Query(None, description="Filter by rule type"),
    file_path: Optional[str] = Query(None, description="Filter by file path"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> List[TechnicalDebtFindingItem]:
    """
    Get paginated technical debt & risk findings with exact line coordinates and remediation steps.
    """
    try:
        data = await technical_debt_service.analyze_technical_debt(db=db, repository_id=repository_id)
        findings = data.get("findings", [])

        if category:
            findings = [f for f in findings if f.get("category", "").upper() == category.upper()]
        if severity:
            findings = [f for f in findings if f.get("severity", "").upper() == severity.upper()]
        if rule:
            findings = [f for f in findings if rule.lower() in f.get("type", "").lower()]
        if file_path:
            norm_p = file_path.lower()
            findings = [f for f in findings if norm_p in (f.get("file_path") or "").lower() or any(norm_p in af.lower() for af in f.get("affected_files", []))]

        paged = findings[offset : offset + limit]
        return [TechnicalDebtFindingItem(**f) for f in paged]
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/findings/{finding_id}", response_model=FindingDetailResponse)
async def get_repository_finding_detail(
    repository_id: str,
    finding_id: str,
    db: AsyncSession = Depends(get_db),
) -> FindingDetailResponse:
    """
    Get deep inspection for a specific technical debt finding:
    - Traceable code evidence and line coordinates
    - Impact analysis context and blast radius
    - Code Time Machine commit context
    - Actionable remediation advice
    """
    try:
        data = await technical_debt_service.analyze_technical_debt(db=db, repository_id=repository_id)
        findings = data.get("findings", [])
        target = next((f for f in findings if f.get("id") == finding_id), None)

        if not target:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Finding '{finding_id}' not found in repository '{repository_id}'",
            )

        # Build impact context if file_path available
        impact_context = None
        if target.get("file_path"):
            try:
                imp = await impact_service.calculate_impact(
                    db=db, repository_id=repository_id, target_identifier=target["file_path"], target_type="FILE", max_depth=2
                )
                impact_context = {
                    "blast_radius": imp.impact.affected_files + imp.impact.affected_symbols,
                    "direct_dependents": len(imp.direct_dependents),
                    "affected_files_count": len(imp.affected_files),
                }
            except Exception:
                pass

        # Build time machine context if file_path available
        time_machine_context = None
        if target.get("file_path"):
            try:
                evol = await time_machine_service.get_file_evolution(
                    db=db, repository_id=repository_id, file_identifier=target["file_path"]
                )
                time_machine_context = {
                    "commit_count": evol.get("commit_count", 0),
                    "churn": evol.get("churn", 0),
                    "last_modified": evol.get("last_modified_at"),
                    "authors": evol.get("authors", []),
                }
            except Exception:
                pass

        return FindingDetailResponse(
            finding=TechnicalDebtFindingItem(**target),
            traceable_evidence=target.get("evidence", {}),
            impact_context=impact_context,
            time_machine_context=time_machine_context,
        )
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/hotspots", response_model=HotspotsListResponse)
async def get_repository_hotspots(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> HotspotsListResponse:
    """
    Get ranked engineering hotspots where multiple risk vectors intersect
    (e.g. High Churn + High Complexity, High Blast Radius + Weak Tests).
    """
    try:
        data = await risk_intelligence_service.analyze_repository_risk(db=db, repository_id=repository_id)
        hotspots = data.get("hotspots", [])
        return HotspotsListResponse(
            repository_id=repository_id,
            total_hotspots=len(hotspots),
            hotspots=[EngineeringHotspotItem(**h) for h in hotspots],
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/risk/trends", response_model=DebtRiskTrendsResponse)
async def get_repository_risk_trends(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> DebtRiskTrendsResponse:
    """
    Get historical risk and technical debt trends across repository commits:
    - Overall trajectory (INCREASING, DECREASING, STABLE)
    - Timeline of historical risk and debt snapshots
    """
    try:
        data = await risk_intelligence_service.get_debt_risk_trends(db=db, repository_id=repository_id)
        return DebtRiskTrendsResponse(**data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get("/{repository_id}/risk/{entity_type}/{entity_id:path}", response_model=EntityRiskResponse)
async def get_repository_entity_risk(
    repository_id: str,
    entity_type: str,
    entity_id: str,
    db: AsyncSession = Depends(get_db),
) -> EntityRiskResponse:
    """
    Get granular risk assessment for any repository entity:
    - REPOSITORY, DIRECTORY, FILE, MODULE, SYMBOL, SERVICE, DEPENDENCY, API
    - Composite risk level, signals, evidence, dependents, and blast radius
    """
    try:
        data = await risk_intelligence_service.get_entity_risk(
            db=db, repository_id=repository_id, entity_type=entity_type, entity_id=entity_id
        )
        return EntityRiskResponse(**data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================================
# Phase 22: Future Impact Simulator Endpoints
# =========================================================================

@router.post("/{repository_id}/simulations", response_model=SimulationDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_repository_simulation(
    repository_id: str,
    payload: SimulationCreateRequest,
    db: AsyncSession = Depends(get_db),
) -> SimulationDetailResponse:
    """
    Phase 22: Run a hypothetical change simulation against the repository and persist the result.
    Evaluates:
    - Target resolution across files, symbols, modules, APIs, and dependencies
    - Static dependency and call graph impact
    - Architecture boundaries crossed
    - Technical debt and engineering risk propagation
    - Historical churn and evolution signals
    - Epistemic triad: Known vs Predicted vs Unknown consequences
    - Hypothetical before/after structural model and diff
    - Deterministic validation checklist
    Strictly repository-isolated.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    try:
        sim_data = await future_impact_simulator_service.create_and_save_simulation(
            db=db,
            repository_id=repository_id,
            proposed_change=payload.proposed_change,
            operation=payload.operation,
            target_id=payload.target_id,
            target_type=payload.target_type,
            parameters=payload.parameters,
        )
        return SimulationDetailResponse(**sim_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error creating simulation for repo '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation engine error: {str(e)}",
        )


@router.get("/{repository_id}/simulations", response_model=SimulationListResponse)
async def list_repository_simulations(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> SimulationListResponse:
    """
    Phase 22: List past simulation runs strictly scoped to the specified repository.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    try:
        items = await future_impact_simulator_service.list_simulations(
            db=db, repository_id=repository_id
        )
        return SimulationListResponse(
            repository_id=repository_id,
            total_simulations=len(items),
            simulations=items,
        )
    except Exception as e:
        logger.error(f"Error listing simulations for repo '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list simulations: {str(e)}",
        )


@router.get("/{repository_id}/simulations/{simulation_id}", response_model=SimulationDetailResponse)
async def get_repository_simulation(
    repository_id: str,
    simulation_id: str,
    db: AsyncSession = Depends(get_db),
) -> SimulationDetailResponse:
    """
    Phase 22: Retrieve a saved simulation by ID with strict repository isolation.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    sim_data = await future_impact_simulator_service.get_simulation(
        db=db, repository_id=repository_id, simulation_id=simulation_id
    )
    if not sim_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation '{simulation_id}' not found in repository '{repository_id}'.",
        )

    return SimulationDetailResponse(**sim_data)


@router.delete("/{repository_id}/simulations/{simulation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_repository_simulation(
    repository_id: str,
    simulation_id: str,
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Phase 22: Delete a saved simulation by ID with strict repository isolation.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    deleted = await future_impact_simulator_service.delete_simulation(
        db=db, repository_id=repository_id, simulation_id=simulation_id
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Simulation '{simulation_id}' not found in repository '{repository_id}'.",
        )


@router.post("/{repository_id}/simulations/target", response_model=SimulationDetailResponse)
async def simulate_target_change(
    repository_id: str,
    payload: SimulationCreateRequest,
    db: AsyncSession = Depends(get_db),
) -> SimulationDetailResponse:
    """
    Phase 22: Interactive preview simulation endpoint without persisting to DB.
    Allows rapid parameter exploration and what-if queries.
    """
    repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
    repo = repo_res.scalars().first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )

    try:
        sim_data = await future_impact_simulator_service.run_simulation(
            db=db,
            repository_id=repository_id,
            proposed_change=payload.proposed_change,
            explicit_operation=payload.operation,
            explicit_target_id=payload.target_id,
            explicit_target_type=payload.target_type,
            parameters=payload.parameters,
        )
        return SimulationDetailResponse(**sim_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error simulating target change for repo '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation engine error: {str(e)}",
        )


# =========================================================================
# Phase 23: AI CTO / Engineering Planning Endpoints
# =========================================================================

@router.get("/{repository_id}/engineering/health", response_model=EngineeringHealthResponse)
async def get_engineering_health(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> EngineeringHealthResponse:
    """
    Phase 23: Multi-dimensional engineering health assessment across 7 dimensions.
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        data = await engineering_planning_service.get_engineering_health(db, repository_id)
        return EngineeringHealthResponse(**data)
    except Exception as e:
        logger.error(f"Error assessing engineering health for '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health assessment error: {str(e)}",
        )


@router.get("/{repository_id}/engineering/priorities", response_model=EngineeringPrioritiesResponse)
async def get_engineering_priorities(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> EngineeringPrioritiesResponse:
    """
    Phase 23: Grounded engineering priorities with problem statements, recommended actions,
    validation plans, and dependency prerequisite sequencing.
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        data = await engineering_planning_service.get_engineering_priorities(db, repository_id)
        return EngineeringPrioritiesResponse(**data)
    except Exception as e:
        logger.error(f"Error fetching engineering priorities for '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Priorities calculation error: {str(e)}",
        )


@router.get("/{repository_id}/engineering/roadmap", response_model=EngineeringRoadmapResponse)
async def get_engineering_roadmap(
    repository_id: str,
    time_frame: str = Query("1_month", description="Roadmap horizon: 1_week, 1_month, 3_months, long_term"),
    db: AsyncSession = Depends(get_db),
) -> EngineeringRoadmapResponse:
    """
    Phase 23: Technical roadmap categorized into Now, Next, and Later horizons.
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        data = await engineering_planning_service.generate_roadmap(db, repository_id, time_frame=time_frame)
        return EngineeringRoadmapResponse(**data)
    except Exception as e:
        logger.error(f"Error generating engineering roadmap for '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Roadmap generation error: {str(e)}",
        )


@router.get("/{repository_id}/engineering/next", response_model=WhatShouldWeDoNextResponse)
async def what_should_we_do_next(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> WhatShouldWeDoNextResponse:
    """
    Phase 23: Single highest-impact engineering action recommendation justified by evidence.
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        data = await engineering_planning_service.what_should_we_do_next(db, repository_id)
        return WhatShouldWeDoNextResponse(**data)
    except Exception as e:
        logger.error(f"Error answering 'what should we do next' for '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Next action error: {str(e)}",
        )


@router.get("/{repository_id}/engineering/strategies", response_model=StrategyComparisonResponse)
async def compare_engineering_strategies(
    repository_id: str,
    work_item_id: Optional[str] = Query(None, description="Optional target work item ID"),
    topic: Optional[str] = Query(None, description="Optional topic or component to compare"),
    db: AsyncSession = Depends(get_db),
) -> StrategyComparisonResponse:
    """
    Phase 23: Compare 4 engineering strategies (Minimal Change, Structural Refactor,
    Incremental Migration, Containment).
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        data = await engineering_planning_service.compare_strategies(
            db, repository_id, work_item_id=work_item_id, topic=topic
        )
        return StrategyComparisonResponse(**data)
    except Exception as e:
        logger.error(f"Error comparing engineering strategies for '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Strategy comparison error: {str(e)}",
        )


@router.post("/{repository_id}/engineering/simulate-ignore", response_model=SimulateIgnoreResponse)
async def simulate_ignore(
    repository_id: str,
    work_item_id: str = Query(..., description="Work item ID to simulate ignoring"),
    db: AsyncSession = Depends(get_db),
) -> SimulateIgnoreResponse:
    """
    Phase 23: Simulates what happens if a specific engineering work item is ignored.
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        data = await engineering_planning_service.simulate_ignore(db, repository_id, work_item_id=work_item_id)
        return SimulateIgnoreResponse(**data)
    except Exception as e:
        logger.error(f"Error simulating ignore for work item '{work_item_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulate ignore error: {str(e)}",
        )


@router.get("/{repository_id}/engineering/plans", response_model=EngineeringPlanListResponse)
async def list_engineering_plans(
    repository_id: str,
    db: AsyncSession = Depends(get_db),
) -> EngineeringPlanListResponse:
    """
    Phase 23: List all persisted engineering plans for a repository.
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        plans = await engineering_planning_service.list_plans(db, repository_id)
        items = [
            EngineeringPlanListItem(
                id=p.id,
                repository_id=p.repository_id,
                title=p.title,
                status=p.status,
                version=p.version,
                time_horizon=p.time_horizon,
                work_item_count=len(p.work_items or []),
                created_at=p.created_at.isoformat() if p.created_at else None,
                updated_at=p.updated_at.isoformat() if p.updated_at else None,
            )
            for p in plans
        ]
        return EngineeringPlanListResponse(
            repository_id=repository_id,
            total_plans=len(items),
            plans=items,
        )
    except Exception as e:
        logger.error(f"Error listing engineering plans for '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list plans: {str(e)}",
        )


@router.post("/{repository_id}/engineering/plans/generate", response_model=EngineeringPlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_engineering_plan(
    repository_id: str,
    payload: EngineeringPlanGenerateRequest,
    db: AsyncSession = Depends(get_db),
) -> EngineeringPlanResponse:
    """
    Phase 23: Autonomous AI CTO Plan Generation with Auto-Versioning (Plan v1 -> Plan v2).
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        plan = await engineering_planning_service.generate_plan(
            db=db,
            repository_id=repository_id,
            title=payload.title,
            time_horizon=payload.time_horizon,
            focus_areas=payload.focus_areas,
        )
        return EngineeringPlanResponse(
            id=plan.id,
            repository_id=plan.repository_id,
            title=plan.title,
            status=plan.status,
            version=plan.version,
            time_horizon=plan.time_horizon,
            summary=plan.summary or "",
            health_snapshot=plan.health_snapshot or {},
            work_items=plan.work_items or [],
            roadmaps=plan.roadmaps or {},
            source_evidence={"evidence": plan.source_evidence or []},
            created_at=plan.created_at.isoformat() if plan.created_at else None,
            updated_at=plan.updated_at.isoformat() if plan.updated_at else None,
        )
    except Exception as e:
        logger.error(f"Error generating engineering plan for '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Plan generation failed: {str(e)}",
        )


@router.post("/{repository_id}/engineering/plans", response_model=EngineeringPlanResponse, status_code=status.HTTP_201_CREATED)
async def create_custom_engineering_plan(
    repository_id: str,
    payload: EngineeringPlanCreateRequest,
    db: AsyncSession = Depends(get_db),
) -> EngineeringPlanResponse:
    """
    Phase 23: Create or save a customized engineering plan with auto-versioning.
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        plan = await engineering_planning_service.create_plan(
            db=db,
            repository_id=repository_id,
            title=payload.title,
            time_horizon=payload.time_horizon,
            summary=payload.summary,
            work_items=payload.work_items,
            roadmaps=payload.roadmaps,
        )
        return EngineeringPlanResponse(
            id=plan.id,
            repository_id=plan.repository_id,
            title=plan.title,
            status=plan.status,
            version=plan.version,
            time_horizon=plan.time_horizon,
            summary=plan.summary or "",
            health_snapshot=plan.health_snapshot or {},
            work_items=plan.work_items or [],
            roadmaps=plan.roadmaps or {},
            source_evidence={"evidence": plan.source_evidence or []},
            created_at=plan.created_at.isoformat() if plan.created_at else None,
            updated_at=plan.updated_at.isoformat() if plan.updated_at else None,
        )
    except Exception as e:
        logger.error(f"Error creating custom engineering plan for '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Plan creation failed: {str(e)}",
        )


@router.get("/{repository_id}/engineering/plans/{plan_id}", response_model=EngineeringPlanResponse)
async def get_engineering_plan(
    repository_id: str,
    plan_id: str,
    db: AsyncSession = Depends(get_db),
) -> EngineeringPlanResponse:
    """
    Phase 23: Fetch single engineering plan with strict repository isolation.
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        plan = await engineering_planning_service.get_plan(db, repository_id, plan_id)
        return EngineeringPlanResponse(
            id=plan.id,
            repository_id=plan.repository_id,
            title=plan.title,
            status=plan.status,
            version=plan.version,
            time_horizon=plan.time_horizon,
            summary=plan.summary or "",
            health_snapshot=plan.health_snapshot or {},
            work_items=plan.work_items or [],
            roadmaps=plan.roadmaps or {},
            source_evidence={"evidence": plan.source_evidence or []},
            created_at=plan.created_at.isoformat() if plan.created_at else None,
            updated_at=plan.updated_at.isoformat() if plan.updated_at else None,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error retrieving plan '{plan_id}' for repo '{repository_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch plan: {str(e)}",
        )


@router.patch("/{repository_id}/engineering/plans/{plan_id}", response_model=EngineeringPlanResponse)
async def update_engineering_plan_status(
    repository_id: str,
    plan_id: str,
    new_status: str = Query(..., pattern="^(active|draft|completed|archived)$"),
    db: AsyncSession = Depends(get_db),
) -> EngineeringPlanResponse:
    """
    Phase 23: Update engineering plan status (active, draft, completed, archived).
    """
    repo = await db.get(Repository, repository_id)
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Repository with id '{repository_id}' not found.",
        )
    try:
        plan = await engineering_planning_service.update_plan_status(db, repository_id, plan_id, status=new_status)
        return EngineeringPlanResponse(
            id=plan.id,
            repository_id=plan.repository_id,
            title=plan.title,
            status=plan.status,
            version=plan.version,
            time_horizon=plan.time_horizon,
            summary=plan.summary or "",
            health_snapshot=plan.health_snapshot or {},
            work_items=plan.work_items or [],
            roadmaps=plan.roadmaps or {},
            source_evidence={"evidence": plan.source_evidence or []},
            created_at=plan.created_at.isoformat() if plan.created_at else None,
            updated_at=plan.updated_at.isoformat() if plan.updated_at else None,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error updating status for plan '{plan_id}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update plan status: {str(e)}",
        )





