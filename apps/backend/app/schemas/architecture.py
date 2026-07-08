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

class CustomRule(BaseModel):
    id: str = Field(..., description="Unique identifier for the custom rule")
    name: str = Field(..., description="Descriptive name of the rule")
    source_matcher: str = Field(..., description="Glob pattern or inclusion check for the source component name/path")
    target_matcher: str = Field(..., description="Glob pattern or inclusion check for the target component name/path")
    type: str = Field("forbidden", description="Rule constraint type: forbidden or only_allowed_from")
    allowed_source_matcher: Optional[str] = Field(None, description="Glob pattern for allowed source components if type is only_allowed_from")
    severity: str = Field("critical", description="Rule breach severity: critical, warning, info")

class ArchitectureRulesSchema(BaseModel):
    layers: List[LayerRule] = Field(default_factory=list)
    boundaries: List[BoundaryRule] = Field(default_factory=list)
    patterns: List[PatternRule] = Field(default_factory=list)
    custom_rules: List[CustomRule] = Field(default_factory=list)

class DriftViolation(BaseModel):
    type: str = Field(..., description="Violation type: layer_violation, boundary_violation, pattern_violation, circular_dependency, custom_rule_violation")
    severity: str = Field(..., description="Severity level: critical, warning, info")
    message: str = Field(..., description="Description of the violation")
    source_node: Optional[Dict[str, Any]] = Field(None, description="Detailed info about the source node causing the violation")
    target_node: Optional[Dict[str, Any]] = Field(None, description="Detailed info about the target node being called")
    file_path: Optional[str] = Field(None, description="The file path where the violation was detected")
    affected_modules: Optional[List[str]] = Field(None, description="Modules involved in a circular dependency loop")
    suggested_fix: Optional[str] = Field(None, description="Suggested refactoring remediation guidance")
    severity_score: Optional[int] = Field(None, description="Numerical severity score from 1-100")

class GovernanceAlert(BaseModel):
    type: str = Field(..., description="Alert type: layer_violation, boundary_violation, pattern_violation, circular_dependency, custom_rule_violation")
    severity: str = Field(..., description="Severity level: critical, warning, info")
    message: str = Field(..., description="Alert details")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AIArchitectureReview(BaseModel):
    summary: str = Field(..., description="Summary title of the review")
    findings: List[str] = Field(default_factory=list, description="AI findings lists")
    recommendations: List[str] = Field(default_factory=list, description="AI recommendation items")
    maintainability_improvement: int = Field(..., description="Estimated maintainability improvement percentage")

class ArchitectureDriftReportResponse(BaseModel):
    compliance_score: float = Field(..., description="Compliance score out of 100")
    violations: List[DriftViolation] = Field(default_factory=list)
    alerts: List[GovernanceAlert] = Field(default_factory=list)
    layers: List[LayerRule] = Field(default_factory=list)
    boundaries: List[BoundaryRule] = Field(default_factory=list)
    patterns: List[PatternRule] = Field(default_factory=list)
    custom_rules: List[CustomRule] = Field(default_factory=list)
    microservice_boundary_analysis: Dict[str, Any] = Field(default_factory=dict, description="Microservice boundary smell report details")
    ai_review: Optional[AIArchitectureReview] = Field(None, description="Automatically generated AI review comments")

class DriftTimelinePoint(BaseModel):
    commit_sha: str = Field(..., description="Commit hash")
    committed_at: datetime = Field(..., description="Commit date")
    message: str = Field(..., description="Commit message")
    compliance_score: float = Field(..., description="Compliance score (0-100)")
    violations_count: int = Field(..., description="Number of violations at this point")
    release_tag: Optional[str] = Field(None, description="Associated release tag")
    status: str = Field(..., description="Overall health status: Healthy, Warning, Critical")
    introduced_violations: List[str] = Field(default_factory=list, description="List of violations introduced in this commit/release")
