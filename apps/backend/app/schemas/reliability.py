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


class ReliabilityTrend(BaseModel):
    checkpoint_date: datetime
    health_score: float
    failure_probability: float


class ReliabilityDashboardResponse(BaseModel):
    repo_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    reliability_score: float
    deployment_risk: str
    hotspots: List[BugHotspot] = Field(default_factory=list)
    trends: List[ReliabilityTrend] = Field(default_factory=list)
