from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.file import File
from app.models.repository import Repository
from app.models.repository_statistics import RepositoryStatistics
from app.models.symbol import Symbol
from app.models.user import User
from app.services.analysis_service import AnalysisService
from app.services.parse_service import ParseService
from app.services.repository import RepositoryService

router = APIRouter()


class RepositoryCreate(BaseModel):
    name: str
    full_name: str
    clone_url: str


class RepositoryResponse(BaseModel):
    id: str
    name: str
    full_name: str
    clone_url: str
    status: str


class RepositoryStatisticsResponse(BaseModel):
    id: str
    repository_id: str
    total_files: int
    total_lines: int
    total_code_lines: int
    total_comment_lines: int
    total_blank_lines: int
    total_size_bytes: int
    total_complexity: int
    average_complexity: float
    documentation_coverage: float
    languages: Optional[Dict[str, int]] = None

    class Config:
        from_attributes = True


class FileMetricsResponse(BaseModel):
    complexity_total: int
    complexity_average: float
    complexity_max: int
    complexity_max_function: Optional[str] = None
    documentation_symbols: int
    total_documentable: int
    coverage_percent: float

    class Config:
        from_attributes = True


class ImportResponse(BaseModel):
    module: str
    names: List[str]
    line: int

    class Config:
        from_attributes = True


class FileResponse(BaseModel):
    id: str
    file_path: str
    language: str
    size_bytes: int
    code_lines: int
    comment_lines: int
    blank_lines: int
    total_lines: int
    metrics: Optional[FileMetricsResponse] = None
    imports: Optional[List[ImportResponse]] = None

    class Config:
        from_attributes = True


class SymbolResponse(BaseModel):
    id: str
    name: str
    kind: str
    file_path: str
    start_line: int
    start_column: int
    end_line: int
    end_column: int
    parent_name: Optional[str] = None
    docstring: Optional[str] = None
    is_async: bool
    is_exported: bool

    class Config:
        from_attributes = True


class FileMetricSummary(BaseModel):
    file_path: str
    complexity_total: int
    coverage_percent: float
    total_lines: int


class RepositoryMetricsResponse(BaseModel):
    statistics: RepositoryStatisticsResponse
    files: List[FileMetricSummary]


class LanguageBreakdownResponse(BaseModel):
    languages: Dict[str, int]


class RepositoryDnaResponse(BaseModel):
    repository_id: str
    repository_name: str
    architecture_dna: float
    complexity_dna: float
    dependency_dna: float
    knowledge_dna: float
    performance_dna: float


class DnaComparisonResponse(BaseModel):
    repository_a: RepositoryDnaResponse
    repository_b: RepositoryDnaResponse
    summary: str


class AvatarChatRequest(BaseModel):
    message: str


class AvatarChatResponse(BaseModel):
    reply: str


class PresentationSlide(BaseModel):
    slide_number: int
    title: str
    points: List[str]
    narrative: str
    category: str


class PresentationResponse(BaseModel):
    slides: List[PresentationSlide]


class ScenarioResponse(BaseModel):
    query: str
    narrative: str
    health_before: float
    health_after: float
    performance_impact: str
    reliability_impact: str
    cost_change: str
    team_effort: str
    migration_phases: List[str]
    risks: List[str]
    rollback_strategy: str


def get_repository_service() -> RepositoryService:
    return RepositoryService()


def get_parse_service() -> ParseService:
    return ParseService()


@router.post(
    "/repositories",
    response_model=RepositoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_repository(
    payload: RepositoryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: RepositoryService = Depends(get_repository_service),
):
    repo = service.add_repository(
        db=db,
        name=payload.name,
        full_name=payload.full_name,
        clone_url=payload.clone_url,
        user=user,
    )
    return RepositoryResponse(
        id=repo.id,
        name=repo.name,
        full_name=repo.full_name,
        clone_url=repo.clone_url,
        status=repo.status,
    )


@router.get(
    "/repositories",
    response_model=List[RepositoryResponse],
)
def get_repositories(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: RepositoryService = Depends(get_repository_service),
):
    repos = service.get_repositories_by_user(db=db, user=user)
    return [
        RepositoryResponse(
            id=repo.id,
            name=repo.name,
            full_name=repo.full_name,
            clone_url=repo.clone_url,
            status=repo.status,
        )
        for repo in repos
    ]


@router.delete("/repositories/{repo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_repository(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: RepositoryService = Depends(get_repository_service),
):
    service.delete_repository(db=db, repo_id=repo_id, user=user)
    return None


@router.post(
    "/repositories/{repo_id}/parse",
    response_model=RepositoryStatisticsResponse,
)
def parse_repository(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: ParseService = Depends(get_parse_service),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    stats = service.parse_repository(db=db, repo_id=repo_id)
    return stats


@router.get(
    "/repositories/{repo_id}/files",
    response_model=List[FileResponse],
)
def get_files(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    files = db.query(File).filter(File.repository_id == repo_id).all()
    res = []
    for f in files:
        metrics_resp = None
        if f.metrics:
            metrics_resp = FileMetricsResponse(
                complexity_total=f.metrics.complexity_total,
                complexity_average=f.metrics.complexity_average,
                complexity_max=f.metrics.complexity_max,
                complexity_max_function=f.metrics.complexity_max_function,
                documentation_symbols=f.metrics.documentation_symbols,
                total_documentable=f.metrics.total_documentable,
                coverage_percent=f.metrics.coverage_percent,
            )
        imports_resp = []
        if f.imports:
            for imp in f.imports:
                imports_resp.append(
                    ImportResponse(module=imp.module, names=imp.names, line=imp.line)
                )
        res.append(
            FileResponse(
                id=f.id,
                file_path=f.file_path,
                language=f.language,
                size_bytes=f.size_bytes,
                code_lines=f.code_lines,
                comment_lines=f.comment_lines,
                blank_lines=f.blank_lines,
                total_lines=f.total_lines,
                metrics=metrics_resp,
                imports=imports_resp,
            )
        )
    return res


@router.get(
    "/repositories/{repo_id}/symbols",
    response_model=List[SymbolResponse],
)
def get_symbols(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    symbols = db.query(Symbol).join(File).filter(File.repository_id == repo_id).all()
    res = []
    for sym in symbols:
        res.append(
            SymbolResponse(
                id=sym.id,
                name=sym.name,
                kind=sym.kind,
                file_path=sym.file.file_path,
                start_line=sym.start_line,
                start_column=sym.start_column,
                end_line=sym.end_line,
                end_column=sym.end_column,
                parent_name=sym.parent_name,
                docstring=sym.docstring,
                is_async=sym.is_async,
                is_exported=sym.is_exported,
            )
        )
    return res


@router.get(
    "/repositories/{repo_id}/metrics",
    response_model=RepositoryMetricsResponse,
)
def get_metrics(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    stats = (
        db.query(RepositoryStatistics)
        .filter(RepositoryStatistics.repository_id == repo_id)
        .first()
    )
    if not stats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Repository has not been parsed yet",
        )

    files = db.query(File).filter(File.repository_id == repo_id).all()
    file_metric_summaries = []
    for f in files:
        comp_tot = f.metrics.complexity_total if f.metrics else 0
        cov_pct = f.metrics.coverage_percent if f.metrics else 0.0
        file_metric_summaries.append(
            FileMetricSummary(
                file_path=f.file_path,
                complexity_total=comp_tot,
                coverage_percent=cov_pct,
                total_lines=f.total_lines,
            )
        )

    stats_resp = RepositoryStatisticsResponse.model_validate(stats)
    return RepositoryMetricsResponse(statistics=stats_resp, files=file_metric_summaries)


@router.get(
    "/repositories/{repo_id}/languages",
    response_model=LanguageBreakdownResponse,
)
def get_languages(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found"
        )

    stats = (
        db.query(RepositoryStatistics)
        .filter(RepositoryStatistics.repository_id == repo_id)
        .first()
    )
    if not stats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Repository has not been parsed yet",
        )

    return LanguageBreakdownResponse(languages=stats.languages or {})


@router.get(
    "/files/content",
    summary="Get source file contents for display",
)
def get_file_content(
    path: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    import os

    # Basic directory traversal security check
    normalized_path = os.path.normpath(path)
    if normalized_path.startswith("..") or os.path.isabs(normalized_path):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file path"
        )

    try:
        if not os.path.exists(normalized_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
            )
        with open(normalized_path, "r", encoding="utf-8") as f:
            content = f.read()
        return {"path": path, "content": content}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


def _calculate_dna_profile(db: Session, repo_id: str) -> RepositoryDnaResponse:
    from app.models.import_model import Import
    from app.services.analysis_service import AnalysisService

    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    stats = (
        db.query(RepositoryStatistics)
        .filter(RepositoryStatistics.repository_id == repo_id)
        .first()
    )
    files = db.query(File).filter(File.repository_id == repo_id).all()
    file_count = len(files)

    # Defaults in case not fully parsed
    if not stats or file_count == 0:
        return RepositoryDnaResponse(
            repository_id=repo_id,
            repository_name=repo.name,
            architecture_dna=50.0,
            complexity_dna=50.0,
            dependency_dna=50.0,
            knowledge_dna=50.0,
            performance_dna=50.0,
        )

    # 1. Architecture DNA
    class_count = (
        db.query(Symbol)
        .join(File)
        .filter(File.repository_id == repo_id, Symbol.kind == "class")
        .count()
    )
    modularity = 100.0 - min(
        40.0, max(0.0, (class_count / max(1.0, float(file_count)) - 1.5) * 15.0)
    )

    max_depth = 1
    for f in files:
        parts = [p for p in f.file_path.replace("\\", "/").split("/") if p]
        max_depth = max(max_depth, len(parts))
    structure_score = 100.0 - min(30.0, max(0.0, float(max_depth - 3) * 10.0))
    architecture_score = round(
        max(10.0, min(100.0, (modularity + structure_score) / 2.0)), 1
    )

    # 2. Complexity DNA
    avg_complexity = stats.average_complexity or 1.0
    tot_complexity = stats.total_complexity or 0
    complexity_score = round(
        max(
            10.0, min(100.0, 100.0 - (avg_complexity * 8.0) - (tot_complexity / 800.0))
        ),
        1,
    )

    # 3. Dependency DNA
    total_imports = (
        db.query(Import).join(File).filter(File.repository_id == repo_id).count()
    )
    avg_imports = total_imports / max(1.0, float(file_count))

    try:
        cycles_report = AnalysisService().detect_circular_dependencies(db, repo_id)
        circular_count = len(cycles_report.get("cycles", []))
    except Exception:
        circular_count = 0

    dependency_score = round(
        max(10.0, min(100.0, 100.0 - (circular_count * 15.0) - (avg_imports * 3.5))), 1
    )

    # 4. Knowledge DNA
    doc_coverage = stats.documentation_coverage or 0.0
    total_comment_lines = stats.total_comment_lines or 0
    total_lines = stats.total_lines or 1
    comment_ratio = float(total_comment_lines) / float(max(1, total_lines))

    knowledge_score = round(
        max(
            10.0,
            min(100.0, (doc_coverage * 70.0) + (min(1.0, comment_ratio * 4.0) * 30.0)),
        ),
        1,
    )

    # 5. Performance DNA
    total_functions = (
        db.query(Symbol)
        .join(File)
        .filter(File.repository_id == repo_id, Symbol.kind.in_(["function", "method"]))
        .count()
    )
    async_functions = (
        db.query(Symbol)
        .join(File)
        .filter(
            File.repository_id == repo_id,
            Symbol.kind.in_(["function", "method"]),
            Symbol.is_async.is_(True),
        )
        .count()
    )
    async_ratio = float(async_functions) / float(max(1, total_functions))

    endpoints_count = (
        db.query(Symbol)
        .join(File)
        .filter(
            File.repository_id == repo_id,
            Symbol.name.like("%api%")
            | Symbol.name.like("%controller%")
            | Symbol.name.like("%route%"),
        )
        .count()
    )

    performance_score = round(
        max(
            10.0,
            min(
                100.0,
                60.0 + (async_ratio * 30.0) + min(10.0, float(endpoints_count) * 1.5),
            ),
        ),
        1,
    )

    return RepositoryDnaResponse(
        repository_id=repo_id,
        repository_name=repo.name,
        architecture_dna=architecture_score,
        complexity_dna=complexity_score,
        dependency_dna=dependency_score,
        knowledge_dna=knowledge_score,
        performance_dna=performance_score,
    )


@router.get(
    "/repositories/{repo_id}/dna",
    response_model=RepositoryDnaResponse,
    summary="Get repository software DNA profile",
)
def get_repository_dna(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=404, detail="Repository not found or access denied."
        )
    return _calculate_dna_profile(db, repo_id)


@router.get(
    "/repositories/compare",
    response_model=DnaComparisonResponse,
    summary="Compare software DNA between two repositories",
)
def compare_repositories(
    repo_ids: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ids = [i.strip() for i in repo_ids.split(",") if i.strip()]
    if len(ids) < 2:
        raise HTTPException(
            status_code=400, detail="Provide at least two repository IDs to compare."
        )

    for r_id in ids[:2]:
        r = db.query(Repository).filter(Repository.id == r_id).first()
        if not r or r.user_id != user.id:
            raise HTTPException(
                status_code=404, detail=f"Repository {r_id} not found or access denied."
            )

    dna_a = _calculate_dna_profile(db, ids[0])
    dna_b = _calculate_dna_profile(db, ids[1])

    # Generate comparative summary
    points = []
    if dna_a.architecture_dna > dna_b.architecture_dna:
        points.append(
            f"'{dna_a.repository_name}' has a more modular directory structure and cleaner architecture ({dna_a.architecture_dna}% vs {dna_b.architecture_dna}%)."
        )
    else:
        points.append(
            f"'{dna_b.repository_name}' exhibits superior class layering and modularity ({dna_b.architecture_dna}% vs {dna_a.architecture_dna}%)."
        )

    if dna_a.complexity_dna > dna_b.complexity_dna:
        points.append(
            f"'{dna_a.repository_name}' has lower relative code complexity and is easier to maintain ({dna_a.complexity_dna}% vs {dna_b.complexity_dna}%)."
        )
    else:
        points.append(
            f"'{dna_b.repository_name}' maintains simpler, less nested code logic flow ({dna_b.complexity_dna}% vs {dna_a.complexity_dna}%)."
        )

    if dna_a.dependency_dna > dna_b.dependency_dna:
        points.append(
            f"'{dna_a.repository_name}' features highly isolated components and fewer circular coupling risks ({dna_a.dependency_dna}% vs {dna_b.dependency_dna}%)."
        )
    else:
        points.append(
            f"'{dna_b.repository_name}' has cleaner package import boundaries and fewer coupling bottlenecks ({dna_b.dependency_dna}% vs {dna_a.dependency_dna}%)."
        )

    if dna_a.knowledge_dna > dna_b.knowledge_dna:
        points.append(
            f"'{dna_a.repository_name}' is better documented with higher comments and docstring coverage ({dna_a.knowledge_dna}% vs {dna_b.knowledge_dna}%)."
        )
    else:
        points.append(
            f"'{dna_b.repository_name}' features more comprehensive inline doc documentation ({dna_b.knowledge_dna}% vs {dna_a.knowledge_dna}%)."
        )

    if dna_a.performance_dna > dna_b.performance_dna:
        points.append(
            f"'{dna_a.repository_name}' stands out with greater async usage and non-blocking call setups ({dna_a.performance_dna}% vs {dna_b.performance_dna}%)."
        )
    else:
        points.append(
            f"'{dna_b.repository_name}' uses async execution patterns more effectively for performance ({dna_b.performance_dna}% vs {dna_a.performance_dna}%)."
        )

    summary_text = "Comparison highlights: " + " ".join(points)

    return DnaComparisonResponse(
        repository_a=dna_a, repository_b=dna_b, summary=summary_text
    )


@router.post(
    "/repositories/{repo_id}/avatar/chat",
    response_model=AvatarChatResponse,
    summary="Chat with repository digital twin avatar",
)
def chat_with_avatar(
    repo_id: str,
    payload: AvatarChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=404, detail="Repository not found or access denied."
        )

    stats = (
        db.query(RepositoryStatistics)
        .filter(RepositoryStatistics.repository_id == repo_id)
        .first()
    )
    files = db.query(File).filter(File.repository_id == repo_id).all()
    file_count = len(files)

    msg = payload.message.lower().strip()

    # 1. Health Question
    if "healthy" in msg or "health" in msg:
        health_score = 90.0
        if stats:
            health_score = round(
                max(
                    30.0,
                    min(
                        100.0,
                        (stats.documentation_coverage or 0.0) * 50.0
                        + (100.0 - (stats.average_complexity or 1.0) * 8.0),
                    ),
                ),
                1,
            )

        reply = (
            f"Hello! I am the Digital Twin Avatar of '{repo.name}'. "
            f"Currently, my health score is estimated at {health_score}%. I consist of {file_count} files, "
            f"spanning {stats.total_lines if stats else 0} total lines. "
        )
        if health_score >= 80:
            reply += "Overall, my architecture is solid, and my codebase feels clean and maintainable!"
        elif health_score >= 60:
            reply += "I'm doing okay, but there is some technical debt piling up in my core modules."
        else:
            reply += "To be honest, I'm feeling a bit bloated. High complexity and low test/documentation coverage are weighing me down."

    # 2. Worries Question
    elif "worry" in msg or "worries" in msg or "risk" in msg:
        worries = []
        if stats and (stats.average_complexity or 0) > 6.0:
            worries.append(
                f"my high average complexity of {stats.average_complexity} which makes some functions hard to test"
            )

        try:
            cycles_report = AnalysisService().detect_circular_dependencies(db, repo_id)
            cycles_count = len(cycles_report.get("cycles", []))
            if cycles_count > 0:
                worries.append(
                    f"{cycles_count} circular dependency cycle(s) coupling my packages"
                )
        except Exception:
            pass

        complex_files = []
        for f in files:
            if f.metrics and f.metrics.complexity_total > 50:
                complex_files.append(f.file_path.split("/")[-1])
        if complex_files:
            worries.append(f"bloated logic files like {', '.join(complex_files[:3])}")

        if not worries:
            reply = (
                "I'm feeling very confident! I don't have any major architectural circular dependencies, "
                "my complexity is low, and my components are well-isolated. Keep up the clean work!"
            )
        else:
            reply = (
                f"I've analyzed my Digital Twin, and here is what worries me: "
                f"Firstly, {worries[0]}. "
            )
            if len(worries) > 1:
                reply += (
                    f"Additionally, I'm concerned about {', and '.join(worries[1:])}."
                )

    # 3. Improvement Question
    elif "improve" in msg or "refactor" in msg or "what should we" in msg:
        improvements = []
        low_doc_files = []
        for f in files:
            if f.metrics and f.metrics.coverage_percent < 40:
                low_doc_files.append(f.file_path.split("/")[-1])
        if low_doc_files:
            improvements.append(
                f"Write docstrings and comments for undocumented modules (like {', '.join(low_doc_files[:3])})"
            )

        high_comp_files = []
        for f in files:
            if f.metrics and f.metrics.complexity_max > 15:
                high_comp_files.append(f.file_path.split("/")[-1])
        if high_comp_files:
            improvements.append(
                f"Refactor complex nested functions inside {', '.join(high_comp_files[:2])} to simplify code branches"
            )

        improvements.append(
            "Introduce interface decoupling to break down tight package dependencies."
        )

        reply = "Here are my top recommendations to improve my codebase:\n" + "\n".join(
            [f"• {imp}" for imp in improvements[:3]]
        )

    # 4. Scalability Question
    elif "scale" in msg or "scalable" in msg or "scalability" in msg:
        total_functions = (
            db.query(Symbol)
            .join(File)
            .filter(
                File.repository_id == repo_id, Symbol.kind.in_(["function", "method"])
            )
            .count()
        )
        async_functions = (
            db.query(Symbol)
            .join(File)
            .filter(
                File.repository_id == repo_id,
                Symbol.kind.in_(["function", "method"]),
                Symbol.is_async.is_(True),
            )
            .count()
        )
        async_ratio = (
            (async_functions / max(1, total_functions)) * 100
            if total_functions > 0
            else 0.0
        )

        reply = f"Regarding my scalability profile: about {async_ratio:.1f}% of my code uses async/await non-blocking design. "
        if async_ratio > 40:
            reply += "This async setup makes me highly scalable for I/O-bound request-handling operations!"
        else:
            reply += (
                "Since a lot of my methods run synchronously, high concurrent request spikes could exhaust "
                "our threads quickly. Decoupling routes using task queues and caching is recommended."
            )

    # 5. Why is Payment complex?
    elif "payment" in msg:
        payment_file = None
        for f in files:
            if "payment" in f.file_path.lower():
                payment_file = f
                break

        if payment_file:
            reply = (
                f"Ah, the Payment component! Let me tell you: `{payment_file.file_path.split('/')[-1]}` "
                f"contains a massive amount of mixed responsibilities. It orchestrates Stripe charges, "
                f"synchronously writes user billing logs, emits confirmation emails, and triggers "
                f"webhooks all inside highly nested blocks. This drives its cyclomatic complexity to a "
                f"critical level, making changes very risky without a major refactoring."
            )
        else:
            reply = (
                "Although I don't see a specific 'Payment' file in my current graph, typically billing "
                "modules are complex because they combine strict external API calls (e.g. Stripe/PayPal) "
                "with synchronous, high-reliability database operations, requiring strong error recovery."
            )

    return AvatarChatResponse(reply=reply)


class ScenarioRequest(BaseModel):
    query: str


@router.get(
    "/repositories/{repo_id}/presentation",
    response_model=PresentationResponse,
    summary="Get narrated slide deck presentation of repository architecture",
)
def get_repository_presentation(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=404, detail="Repository not found or access denied."
        )

    stats = (
        db.query(RepositoryStatistics)
        .filter(RepositoryStatistics.repository_id == repo_id)
        .first()
    )
    files = db.query(File).filter(File.repository_id == repo_id).all()
    file_count = len(files)
    total_lines = stats.total_lines if stats else 0

    hotspots = []
    for f in files:
        if f.metrics and f.metrics.complexity_total > 50:
            hotspots.append(f.file_path.split("/")[-1])

    try:
        from app.services.analysis_service import AnalysisService

        cycles_report = AnalysisService().detect_circular_dependencies(db, repo_id)
        circular_count = len(cycles_report.get("cycles", []))
    except Exception:
        circular_count = 0

    slides = [
        PresentationSlide(
            slide_number=1,
            title="Repository Overview",
            points=[
                f"Active Repository: {repo.name}",
                f"Parsed File Count: {file_count} source modules",
                f"Total Line Count: {total_lines:,} lines of code",
                f"Health Index: {stats.documentation_coverage * 40 + 50 if stats else 70.0:.1f}% status rating",
            ],
            narrative=(
                f"Welcome to the architectural presentation of the {repo.name} repository. "
                f"Our codebase consists of {file_count} files, containing {total_lines:,} total lines of code. "
                "Overall, the digital twin reports that our code structure is initialized and fully analyzed."
            ),
            category="overview",
        ),
        PresentationSlide(
            slide_number=2,
            title="Core Code Domains",
            points=[
                "Modular districts layout mapping architectural layers",
                "Service directories managing business domain models",
                "Database schemas and configuration interfaces",
                "API route controllers exposing core web methods",
            ],
            narrative=(
                "Analyzing our structural layout: our domains are divided into distinct folders. "
                "The core packages handle data schemas, route handlers, and main services. "
                "We partition business logic to isolate data changes."
            ),
            category="domains",
        ),
        PresentationSlide(
            slide_number=3,
            title="Architecture Evolution Milestones",
            points=[
                "Milestone 1: Repository initial file parsing structure setup",
                "Milestone 2: Decoupled package directory structures and import checking",
                "Milestone 3: Database mapping, classes, and function indexing",
                "Milestone 4: Live relational twin synchronization completed",
            ],
            narrative=(
                "Looking back at the architecture evolution: our codebase transitioned from a single "
                "monolithic package structure to clean modular directories. "
                "This decoupled setup improves team ownership boundaries."
            ),
            category="evolution",
        ),
        PresentationSlide(
            slide_number=4,
            title="Technical Debt Hotspots",
            points=[
                f"God class complexity locations: {', '.join(hotspots[:2]) if hotspots else 'None'}",
                "Highly nested functions reducing readability variables",
                "Duplicated logic paths waiting for function abstractions",
                "Unused local symbol exports and module dependencies",
            ],
            narrative=(
                f"Every repository has tech debt. In our code, we locate complexity hotspots "
                f"in files like {', '.join(hotspots[:2]) if hotspots else 'our core helper files'}. "
                "These modules have high cyclomatic counts and should be refactored."
            ),
            category="debt",
        ),
        PresentationSlide(
            slide_number=5,
            title="Reliability & Risk Concerns",
            points=[
                f"Circular coupling imports: {circular_count} loops detected",
                "Synchronous database locks on transaction updates",
                "Missing fallback logic during external api outages",
                "Untested critical functions in low doc modules",
            ],
            narrative=(
                f"For system reliability, our primary concern is the {circular_count} circular dependency "
                "import loop paths. These loops couple packages together, making updates risky. "
                "Decoupling these modules is highly recommended."
            ),
            category="reliability",
        ),
        PresentationSlide(
            slide_number=6,
            title="Scalability Bottlenecks",
            points=[
                "High density of synchronous thread operations",
                "Missing Redis caching layers on read endpoints",
                "Lack of write db replica read-write segregations",
                "Tight couplings between web layers and data engines",
            ],
            narrative=(
                "Our scaling profiles show that synchronous calls can throttle concurrent user loads. "
                "Adding memory caching and segregation replicas is required to handle traffic "
                "spikes effectively."
            ),
            category="scalability",
        ),
        PresentationSlide(
            slide_number=7,
            title="Recommended Architectural Roadmap",
            points=[
                "Phase 1: Refactor God class files into decoupled methods",
                "Phase 2: Remove circular import paths using interface classes",
                "Phase 3: Set up memory caching using Redis cache libraries",
                "Phase 4: Enhance doc coverage past 80% to assist onboarding",
            ],
            narrative=(
                "To conclude: our technical roadmap prioritizes splitting complex God classes "
                "and breaking circular dependencies. In the next phase, we will introduce Redis caching. "
                "Thank you, and let's proceed to code reviews."
            ),
            category="roadmap",
        ),
    ]
    return PresentationResponse(slides=slides)


@router.post(
    "/repositories/{repo_id}/simulation/scenario",
    response_model=ScenarioResponse,
    summary="Simulate a hypothetical software architecture scenario",
)
def simulate_scenario(
    repo_id: str,
    payload: ScenarioRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo or repo.user_id != user.id:
        raise HTTPException(
            status_code=404, detail="Repository not found or access denied."
        )

    stats = (
        db.query(RepositoryStatistics)
        .filter(RepositoryStatistics.repository_id == repo_id)
        .first()
    )
    base_health = (stats.documentation_coverage * 40.0 + 50.0) if stats else 75.0

    q = payload.query.lower().strip()

    if "kubernetes" in q or "k8s" in q:
        narrative = (
            "Migrating our architecture to Kubernetes introduces containerized scaling. "
            "Our overall health increases due to self-healing node replication, but cloud costs rise."
        )
        res = ScenarioResponse(
            query=payload.query,
            narrative=narrative,
            health_before=base_health,
            health_after=round(min(98.0, base_health + 8.5), 1),
            performance_impact="Highly scalable container replica management. Latency spikes are automatically mitigated.",
            reliability_impact="Self-healing cluster pods restart failed nodes automatically. 99.99% SLA.",
            cost_change="Increases cloud invoice by 30-40% due to cluster control plane and node groups.",
            team_effort="Medium (requires Dockerizing, writing Helm charts, and building CI pipelines)",
            migration_phases=[
                "Dockerize all services using minimal alpine image targets",
                "Author k8s Deployment, Service, and ConfigMap YAML sheets",
                "Deploy local Dev minikube and configure ingress routers",
                "Provision cloud EKS cluster and rollout helm packages",
            ],
            risks=[
                "Network virtualization overhead may cause minor latency drifts",
                "Configuration errors in YAML specifications leading to pods restart loops",
            ],
            rollback_strategy="Keep the existing virtual server host online, re-route DNS traffic back using AWS Route 53 weight ratios.",
        )

    elif "payment" in q or "split" in q:
        narrative = (
            "Splitting the coupled billing/payment service into an isolated microservice module "
            "dramatically decreases core package cyclomatic complexity. This isolation improves health score."
        )
        res = ScenarioResponse(
            query=payload.query,
            narrative=narrative,
            health_before=base_health,
            health_after=round(min(98.0, base_health + 12.0), 1),
            performance_impact="Reduces lock time in database billing tables. Payment methods process asynchronously.",
            reliability_impact="Highly decoupled. Billing replica failures do not block user login/browse flows.",
            cost_change="Negligible cloud cost difference. Improves developer velocity and maintenance overhead.",
            team_effort="High (requires refactoring model imports and creating HTTP webhook interfaces)",
            migration_phases=[
                "Create new isolated repository for billing microservice",
                "Refactor and extract stripe/billing dependencies out of core",
                "Define lightweight HTTP REST schema contracts for calling core",
                "Implement transactional outbox pattern to synchronize states",
            ],
            risks=[
                "Distributed transactions might fall out of sync without outboxes",
                "Increased debugging complexity across multiple source twins",
            ],
            rollback_strategy="Keep payment methods legacy code flagged under feature-flags. Re-activate flags if split is unstable.",
        )

    elif "100" in q or "traffic" in q or "grow" in q:
        narrative = (
            "A 100-times traffic spike severely throttles concurrent connection limits in our current "
            "synchronous thread framework. Health drops significantly unless caching is implemented."
        )
        res = ScenarioResponse(
            query=payload.query,
            narrative=narrative,
            health_before=base_health,
            health_after=round(max(30.0, base_health - 25.0), 1),
            performance_impact="Drastic latency spikes. Threads choke waiting for database lock releases.",
            reliability_impact="Risk of cascading OOM outages under sustained peak loads.",
            cost_change="Substantial cloud resource costs to scale CPU and memory capacities.",
            team_effort="Medium (requires integrating cache caches, queuing heavy requests, and scaling nodes)",
            migration_phases=[
                "Install Redis cache to store hot-read catalog items",
                "Offload slow synchronous methods to Celery queue workers",
                "Configure PostgreSQL connection pooling (e.g. pgBouncer)",
                "Add AWS Application Load Balancer to replica instances",
            ],
            risks=[
                "Cache stampedes or cache-invalidation mismatches",
                "Database deadlock locks on concurrent writes",
            ],
            rollback_strategy="Scale virtual machines vertically (scale up instance types) while deploying caching updates.",
        )

    elif "postgres" in q or "postgresql" in q or "fail" in q:
        narrative = (
            "A complete database crash offline stops all state persistence operations, bringing core health down. "
            "Setting up auto-failover replicas is required to mitigate this risk."
        )
        res = ScenarioResponse(
            query=payload.query,
            narrative=narrative,
            health_before=base_health,
            health_after=round(max(15.0, base_health - 50.0), 1),
            performance_impact="Zero database request resolution. All read/write attempts time out.",
            reliability_impact="Severe reliability outage. System offline for users.",
            cost_change="Increases SQL cost by 50% to configure multi-AZ streaming replicas.",
            team_effort="Low (requires infrastructure configuration switches)",
            migration_phases=[
                "Configure secondary database replica inside separate AWS AZ",
                "Set up health check monitoring to detect primary failures",
                "Implement auto-failover DNS switching (e.g., using pg_isready)",
                "Verify replica replication lag constraints",
            ],
            risks=[
                "Split-brain replica states if failover detects fake failures",
                "Minor data loss lag during transition windows",
            ],
            rollback_strategy="Keep daily backup snapshots active. Revert primary instance to snapshot if recovery fails.",
        )

    elif "redis" in q or "remove" in q:
        narrative = (
            "Removing Redis cache drives all read queries directly to the relational database tables, "
            "increasing load metrics and slightly decreasing health scores."
        )
        res = ScenarioResponse(
            query=payload.query,
            narrative=narrative,
            health_before=base_health,
            health_after=round(max(35.0, base_health - 10.0), 1),
            performance_impact="Read response latency increases from sub-millisecond to 45-80ms.",
            reliability_impact="Increases query lock hazards under concurrent traffic spikes.",
            cost_change="Reduces cloud cache invoice, but database sizing must scale up.",
            team_effort="Low (requires code deletion of caching wrappers)",
            migration_phases=[
                "Search and delete all redis-caching method decorators",
                "Remove Celery/Redis connection string environment variables",
                "De-provision Redis cloud instance",
                "Run database performance indexes check under direct load",
            ],
            risks=["Database CPU usage spikes to 90% during peak read traffic windows"],
            rollback_strategy="Re-deploy the Redis cache instance and roll back code changes via git revert.",
        )

    else:
        narrative = (
            f"Simulating target scenario: '{payload.query}'. Making architectural structural changes "
            "optimizes codebase modularity profiles, but introduces standard integration efforts."
        )
        res = ScenarioResponse(
            query=payload.query,
            narrative=narrative,
            health_before=base_health,
            health_after=round(min(98.0, base_health + 4.5), 1),
            performance_impact="Optimized thread execution profiles and faster memory resolutions.",
            reliability_impact="Fewer circular boundaries results in less cascading code drifts.",
            cost_change="Neutral cloud cost change. Developer velocity increases.",
            team_effort="Medium (requires refactoring folder directories and import lists)",
            migration_phases=[
                "Create feature sprint scope board for target changes",
                "Refactor imports to decoupled patterns",
                "Validate schema changes in sandbox tests",
                "Promote changes to staging and release twins",
            ],
            risks=["Temporary integration bugs during interface changes"],
            rollback_strategy="Create a dedicated git checkout branch and roll back main using git merge.",
        )

    return res
