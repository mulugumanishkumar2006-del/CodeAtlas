from pydantic import BaseModel
from typing import List, Dict

class MemorySnapshotResponse(BaseModel):
    id: str
    version_tag: str
    timestamp: str
    statistics: Dict[str, int]

class DeltaValue(BaseModel):
    base: int
    head: int
    delta: int

class MemoryComparisonResponse(BaseModel):
    base_snapshot_id: str
    head_snapshot_id: str
    deltas: Dict[str, DeltaValue]
    added_adrs: List[str]
    added_docs: List[str]
