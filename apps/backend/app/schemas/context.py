from pydantic import BaseModel
from typing import List, Optional

class EntityContextResponse(BaseModel):
    name: str
    purpose: str
    created: str
    reason: str
    related_adr: Optional[str] = None
    related_pr: Optional[str] = None
    dependencies: List[str]

class LineageStep(BaseModel):
    type: str  # API, Doc, ADR, Implementation, Test
    name: str
    file_path: Optional[str] = None

class EntityLineageResponse(BaseModel):
    entity_name: str
    steps: List[LineageStep]

class NodeContextResponse(BaseModel):
    node_id: str
    name: str
    type: str
    description: str
    purpose: str
    history: List[str]
    owner: Optional[str] = None
    related_documents: List[str]
    related_commits: List[str]
    related_prs: List[str]
    related_issues: List[str]
