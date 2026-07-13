from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


class BugHotspot(BaseModel):
    id: str
    file_path: str
    prediction_type: str  # "file", "class", "function", "service"
    name: str
    failure_probability: float
    confidence: float
    regression_risk: float
    change_risk: float
    complexity: int
    lines_of_code: int
    reliability: float
    failure_risk: float
    recovery_difficulty: str
    root_cause_path: List[str] = Field(default_factory=list)


class ReliabilityTrend(BaseModel):
    checkpoint_date: datetime
    health_score: float
    failure_probability: float


class ReliabilityTimelinePoint(BaseModel):
    month: str
    score: float
    failure_risk: float


class ReliabilityRecommendation(BaseModel):
    id: str
    title: str
    description: str
    expected_improvement: float


class FailureGraphNode(BaseModel):
    id: str
    name: str
    type: str
    dependencies: List[str] = Field(default_factory=list)


class ReliabilityDashboardResponse(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    reliability_score: float
    deployment_risk: str
    hotspots: List[BugHotspot] = Field(default_factory=list)
    trends: List[ReliabilityTrend] = Field(default_factory=list)
    timeline: List[ReliabilityTimelinePoint] = Field(default_factory=list)
    recommendations: List[ReliabilityRecommendation] = Field(default_factory=list)
    failure_graph: List[FailureGraphNode] = Field(default_factory=list)
