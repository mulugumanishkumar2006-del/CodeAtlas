from pydantic import BaseModel
from typing import List

class TimelineEntry(BaseModel):
    year: int
    date: str
    title: str
    description: str
    type: str  # commit, adr, system

class RepositoryTimelineResponse(BaseModel):
    repository_id: str
    timeline: List[TimelineEntry]
