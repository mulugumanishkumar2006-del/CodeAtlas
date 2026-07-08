from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class MemorySource(BaseModel):
    id: str
    type: str
    name: str
    details: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None


class MemoryQueryResponse(BaseModel):
    query: str
    answer: str
    sources: List[MemorySource]


class MemoryStatisticsResponse(BaseModel):
    repository_id: str
    statistics: Dict[str, int]
    total_memories: int
    adr_count: int
    doc_coverage: str
    knowledge_confidence: str
    recently_learned_concepts: List[str]
    unlinked_documentation: List[str]


class ChatRequest(BaseModel):
    message: str
