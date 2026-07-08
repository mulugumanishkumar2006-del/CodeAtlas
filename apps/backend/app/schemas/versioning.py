from typing import Dict, List

from pydantic import BaseModel


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
