from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict, Any, Optional

class LayerRule(BaseModel):
    name: str = Field(..., description="Name of the layer (e.g. API, Service, Repository, Database)")
    matching_patterns: List[str] = Field(..., description="Glob patterns or keywords to match file paths or symbol names in this layer")
    allowed_dependencies: List[str] = Field(..., description="Names of layers that this layer is allowed to call/depend on")

class BoundaryRule(BaseModel):
    name: str = Field(..., description="Name of the boundary/domain (e.g. auth, billing, notifications)")
    matching_patterns: List[str] = Field(..., description="Glob patterns or keywords to match file paths belonging to this boundary")
    forbidden_dependencies: List[str] = Field(default_factory=list, description="List of domain names this domain is forbidden to depend on")

class PatternRule(BaseModel):
    type: str = Field(..., description="Type of design pattern rule (e.g. no_direct_db_access_from_api, no_circular_dependencies)")
    severity: str = Field("critical", description="Severity level: critical, warning, info")
    matching_patterns: Optional[List[str]] = Field(None, description="Optional custom patterns for matching naming conventions or boundaries")

class ArchitectureRulesSchema(BaseModel):
    layers: List[LayerRule] = Field(default_factory=list)
    boundaries: List[BoundaryRule] = Field(default_factory=list)
    patterns: List[PatternRule] = Field(default_factory=list)

class DriftViolation(BaseModel):
    type: str = Field(..., description="Violation type: layer_violation, boundary_violation, pattern_violation, circular_dependency")
    severity: str = Field(..., description="Severity level: critical, warning, info")
    message: str = Field(..., description="Description of the violation")
    source_node: Optional[Dict[str, Any]] = Field(None, description="Detailed info about the source node causing the violation")
    target_node: Optional[Dict[str, Any]] = Field(None, description="Detailed info about the target node being called")
    file_path: Optional[str] = Field(None, description="The file path where the violation was detected")
    affected_modules: Optional[List[str]] = Field(None, description="Modules involved in a circular dependency loop")
    suggested_fix: Optional[str] = Field(None, description="Suggested refactoring remediation guidance")
    severity_score: Optional[int] = Field(None, description="Numerical severity score from 1-100")

class GovernanceAlert(BaseModel):
    type: str = Field(..., description="Alert type: layer_violation, boundary_violation, pattern_violation, circular_dependency")
    severity: str = Field(..., description="Severity level: critical, warning, info")
    message: str = Field(..., description="Alert details")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ArchitectureDriftReportResponse(BaseModel):
    compliance_score: float = Field(..., description="Compliance score out of 100")
    violations: List[DriftViolation] = Field(default_factory=list)
    alerts: List[GovernanceAlert] = Field(default_factory=list)
    layers: List[LayerRule] = Field(default_factory=list)
    boundaries: List[BoundaryRule] = Field(default_factory=list)
    patterns: List[PatternRule] = Field(default_factory=list)
