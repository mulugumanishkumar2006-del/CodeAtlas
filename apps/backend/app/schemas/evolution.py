from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class CommitSnapshotResponse(BaseModel):
    id: str
    commit_sha: str
    author_name: Optional[str] = None
    author_email: Optional[str] = None
    committed_at: datetime
    message: Optional[str] = None
    total_files: int
    total_lines: int
    code_lines: int
    comment_lines: int
    complexity_total: int
    complexity_average: float
    complexity_max: int
    documentation_coverage: float
    dependencies_count: int
    languages: Optional[Dict[str, int]] = None
    health_score: float
    architecture_patterns: Optional[List[Dict[str, Any]]] = None
    graph_data: Optional[Dict[str, Any]] = None
    average_function_size: float
    cohesion_score: float
    maintainability_index: float

    class Config:
        from_attributes = True


class ComponentSnapshotResponse(BaseModel):
    id: str
    commit_snapshot_id: str
    path: str
    type: str  # "file", "folder", "domain"
    name: str
    complexity_total: int
    complexity_average: float
    complexity_max: int
    code_lines: int
    comment_lines: int
    dependencies_count: int
    dependents_count: int
    coupling_score: float
    technical_debt_score: float

    class Config:
        from_attributes = True


class EvolutionTriggerResponse(BaseModel):
    status: str
    job_id: str
    repository_id: str


class ComponentMetricDiff(BaseModel):
    path: str
    name: str
    type: str
    base_metrics: Dict[str, Any]
    head_metrics: Dict[str, Any]
    metrics_diff: Dict[str, Any]


class ArchitectureDiffResponse(BaseModel):
    base_sha: str
    head_sha: str
    total_lines_diff: int
    code_lines_diff: int
    complexity_total_diff: int
    documentation_coverage_diff: float
    dependencies_count_diff: int
    added_components: List[ComponentSnapshotResponse]
    removed_components: List[ComponentSnapshotResponse]
    changed_components: List[ComponentMetricDiff]
    evolution_highlights: List[str] = []
    debt_hike_reason: Optional[str] = None


class TimelineAnomaly(BaseModel):
    commit_sha: str
    message: str
    committed_at: datetime
    author_name: str
    metric_name: str  # "complexity", "dependencies", "tech_debt"
    previous_value: float
    new_value: float
    spike_value: float
    description: str


class ArchitectureDriftEvent(BaseModel):
    commit_sha: str
    committed_at: datetime
    author_name: str
    message: str
    type: str
    severity: str


class EngineeringTimelineEvent(BaseModel):
    commit_sha: str
    committed_at: datetime
    author_name: str
    type: str  # "commit", "release", "adr", "refactor", "infrastructure", "service"
    title: str
    description: str


class EvolutionSummaryResponse(BaseModel):
    summary_bullets: List[str]
    base_sha: str
    head_sha: str


class EvolutionInsightsResponse(BaseModel):
    largest_arch_change: str
    most_impactful_release: str
    biggest_refactoring: str
    most_stable_module: str
    fastest_growing_service: str
    most_frequently_modified_api: str


class EvolutionAnalyticsResponse(BaseModel):
    longest_common_subgraph: dict
    change_points: List[dict]
    community_evolution: List[dict]
    trend_slopes: dict
