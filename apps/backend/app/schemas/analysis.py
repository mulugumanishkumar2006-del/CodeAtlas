from typing import Any, Dict, List, Optional

from pydantic import BaseModel


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


# 4. Architecture Pattern Detection
class PatternDetail(BaseModel):
    pattern: str
    confidence: float
    description: str
    evidence: List[str]


class ArchitecturePatternResponse(BaseModel):
    patterns: List[PatternDetail]


# 5. Domain Detection
class DomainCluster(BaseModel):
    name: str
    description: str
    node_ids: List[str]


class DomainDetectionResponse(BaseModel):
    domains: List[DomainCluster]


# 6. Knowledge Query Engine
class SemanticQueryResult(BaseModel):
    id: str
    name: str
    type: str
    relationship: Optional[str] = None
    target: Optional[str] = None
    details: Optional[str] = None


class SemanticQueryResponse(BaseModel):
    query: str
    inferred_intent: str
    results: List[SemanticQueryResult]


# 7. Repository Search Engine
class SemanticSearchNodeResponse(BaseModel):
    id: str
    name: str
    type: str
    properties: Optional[Dict[str, Any]] = None
    score: float
    matched_concepts: List[str]
