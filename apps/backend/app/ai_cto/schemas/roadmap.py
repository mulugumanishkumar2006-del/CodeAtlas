from typing import Dict, List

from pydantic import BaseModel, Field


class Milestone(BaseModel):
    id: str = Field(..., description="Unique ID of the milestone, e.g. mile_001")
    sprint: int = Field(..., description="Sprint number this milestone belongs to")
    title: str = Field(..., description="Title of the milestone task")
    description: str = Field(
        ..., description="Brief description of the milestone objective"
    )
    dependencies: List[str] = Field(
        default_factory=list, description="IDs of other milestones this depends on"
    )
    estimated_duration_days: int = Field(
        ..., description="Estimated duration in days to complete the milestone"
    )
    allocated_resources: List[str] = Field(
        default_factory=list, description="Assigned engineering roles for the milestone"
    )


class EngineeringRoadmap(BaseModel):
    repository_id: str = Field(
        ..., description="Repository ID the roadmap was generated for"
    )
    sprints: int = Field(..., description="Total sprints estimated")
    milestones: List[Milestone] = Field(
        default_factory=list, description="List of roadmap milestones"
    )
    estimated_completion_date: str = Field(
        ..., description="Estimated completion date (ISO format or descriptive)"
    )
    resource_allocation_summary: str = Field(
        ..., description="Summary of team constraints and resource allocations"
    )
    quarterly_goals: Dict[str, List[str]] = Field(
        default_factory=dict,
        description="Quarterly roadmap distribution of engineering initiatives",
    )
