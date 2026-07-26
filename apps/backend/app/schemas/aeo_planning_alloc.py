# apps/backend/app/schemas/aeo_planning_alloc.py

from typing import List, Optional

from pydantic import BaseModel


# Feature 1: Multi-Role Collaboration Matrix DTOs
class RoleContribution(BaseModel):
    role_name: str
    perspective: str
    key_recommendation: str
    risk_concern: str


class CollaborationMatrixResponse(BaseModel):
    initiative_title: str
    role_contributions: List[RoleContribution]
    consensus_verdict: str


# Feature 2: AI Sprint Planner DTOs
class SprintTicket(BaseModel):
    ticket_id: str
    title: str
    priority: str  # "P0", "P1", "P2"
    story_points: int
    assignee_role: str
    dependencies: List[str]


class SprintRisk(BaseModel):
    risk_title: str
    severity: str  # "High", "Medium", "Low"
    mitigation: str


class EngineeringMilestone(BaseModel):
    milestone_id: str
    title: str
    target_date: str
    deliverable: str


class AISprintPlannerRequest(BaseModel):
    sprint_name: Optional[str] = "Sprint 42 - Multi-Region Scale"
    target_duration_weeks: Optional[int] = 2


class AISprintPlannerResponse(BaseModel):
    sprint_name: str
    duration_weeks: int
    total_story_points: int
    backlog_tickets: List[SprintTicket]
    sprint_risks: List[SprintRisk]
    milestones: List[EngineeringMilestone]


# Feature 3: AI Team Allocation & Skill Gap Identification DTOs
class TeamOwnershipMapping(BaseModel):
    team_name: str
    owned_microservices: List[str]
    current_capacity_pct: float
    status: str  # "Optimal", "Near Capacity", "Overloaded"


class SkillGapItem(BaseModel):
    gap_title: str
    impacted_team: str
    required_skill: str
    recommendation: str


class TeamAllocationRequest(BaseModel):
    project_initiative: Optional[str] = "50 Million User Multi-Region Migration"


class TeamAllocationResponse(BaseModel):
    initiative: str
    team_mappings: List[TeamOwnershipMapping]
    skill_gaps: List[SkillGapItem]
    resource_balancing_verdict: str
