from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.repository import Repository
from app.models.file import File
from app.models.symbol import Symbol
from app.models.repository_statistics import RepositoryStatistics
from app.services.repository import RepositoryService
from app.services.parse_service import ParseService

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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

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
                imports_resp.append(ImportResponse(
                    module=imp.module,
                    names=imp.names,
                    line=imp.line
                ))
        res.append(FileResponse(
            id=f.id,
            file_path=f.file_path,
            language=f.language,
            size_bytes=f.size_bytes,
            code_lines=f.code_lines,
            comment_lines=f.comment_lines,
            blank_lines=f.blank_lines,
            total_lines=f.total_lines,
            metrics=metrics_resp,
            imports=imports_resp
        ))
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    symbols = db.query(Symbol).join(File).filter(File.repository_id == repo_id).all()
    res = []
    for sym in symbols:
        res.append(SymbolResponse(
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
        ))
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    stats = db.query(RepositoryStatistics).filter(RepositoryStatistics.repository_id == repo_id).first()
    if not stats:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Repository has not been parsed yet")

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
                total_lines=f.total_lines
            )
        )

    stats_resp = RepositoryStatisticsResponse.model_validate(stats)
    return RepositoryMetricsResponse(
        statistics=stats_resp,
        files=file_metric_summaries
    )


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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repository not found")

    stats = db.query(RepositoryStatistics).filter(RepositoryStatistics.repository_id == repo_id).first()
    if not stats:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Repository has not been parsed yet")

    return LanguageBreakdownResponse(languages=stats.languages or {})

