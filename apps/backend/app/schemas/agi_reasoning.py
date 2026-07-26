# apps/backend/app/schemas/agi_reasoning.py

from typing import Dict, List, Optional

from pydantic import BaseModel


# Feature 4: Multi-Step Engineering Reasoning
class ReasoningStep(BaseModel):
    step_number: int
    phase_name: str  # "Think", "Debate", "Simulate", "Verify", "Answer"
    execution_time_ms: float
    output_summary: str
    key_findings: List[str]


# Feature 5: Explainable Decisions
class ExplainableDecision(BaseModel):
    why: str
    evidence_sources: List[str]
    trade_offs: List[str]
    risk_factors: Dict[str, float]
    confidence_score_pct: float  # 0 to 100


# Feature 2: Long-Term Engineering Memory
class LongTermMemoryRecord(BaseModel):
    memory_id: str
    timestamp: str
    category: str  # "Architecture Decision", "Incident Retrospective", "Tech Debt Rule"
    key_context: str
    permanent_weight: float


# Feature 6-20: Specialized AI Scientist / Advisor DTOs
class SpecializedScientistRequest(BaseModel):
    scientist_id: (
        str  # e.g., "incident_scientist", "security_strategist", "database_scientist"
    )
    query_prompt: str
    repo_id: Optional[str] = "demo-repo"


class SpecializedScientistResponse(BaseModel):
    scientist_id: str
    scientist_title: str
    specialization: str
    assessment: str
    recommendation: str
    evidence_chain: List[str]
    confidence_pct: float
    risk_rating: str  # "Low", "Medium", "High", "Critical"


class AGIReasoningCoreRequest(BaseModel):
    prompt: str
    repo_id: Optional[str] = "demo-repo"


class AGIReasoningCoreResponse(BaseModel):
    query_prompt: str
    multi_step_chain: List[ReasoningStep]
    explainable_decision: ExplainableDecision
    retained_memories: List[LongTermMemoryRecord]
    final_executive_answer: str
    verdict: str  # "REASONING_COMPLETE_VERIFIED"
