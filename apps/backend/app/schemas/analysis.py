from pydantic import BaseModel
from typing import List, Optional, Dict, Any


# 1. Circular Dependency Detection
class CycleReport(BaseModel):
    id: str
    cycle: List[str]
    description: str
    affected_modules: List[str]
    suggested_fixes: List[str]


class CircularDependencyResponse(BaseModel):
    total_cycles: int
    cycles: List[CycleReport]
    affected_modules: List[str]


# 2. Coupling Analysis
class CouplingMetric(BaseModel):
    node_id: str
    type: str
    name: str
    fan_in: int
    fan_out: int
    coupling_score: float
    centrality: float


class ReusedModule(BaseModel):
    id: str
    name: str
    type: str
    fan_in_count: int


class CouplingAnalysisResponse(BaseModel):
    metrics: List[CouplingMetric]
    most_reused_module: Optional[ReusedModule] = None


# 3. Impact Analysis
class ImpactRequest(BaseModel):
    symbol_name: str


class AffectedCounts(BaseModel):
    files: int
    functions: int
    classes: int
    apis: int
    tests: int


class AffectedDetail(BaseModel):
    id: str
    name: str
    type: str


class ImpactAnalysisResponse(BaseModel):
    symbol_name: str
    total_affected_nodes: int
    affected_counts: AffectedCounts
    risk: str
    affected_details: List[AffectedDetail]
