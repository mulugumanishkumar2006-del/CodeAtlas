# apps/backend/app/schemas/edg_features_6_10.py

from typing import List

from pydantic import BaseModel


class DangerousMutationAlert(BaseModel):
    alert_id: str
    pr_id: str
    author: str
    target_file: str
    degradation_type: str  # "Circular Dependency Injection", "Security Vault Bypass"
    risk_level: str  # "Critical", "High"
    propagation_containment_strategy: str


class DangerousMutationDetectorResponse(BaseModel):
    total_prs_intercepted: int
    dangerous_mutations_count: int
    alerts: List[DangerousMutationAlert]
    degradation_verdict: str


class RepoDNAComparisonItem(BaseModel):
    company_repo_name: str  # e.g. "Netflix Core", "Uber Dispatch", "Stripe Payments"
    dna_sequence_string: str
    architecture_match_pct: float  # e.g. 92.4
    key_shared_trait: str


class DNAComparisonResponse(BaseModel):
    target_repository_id: str
    target_dna_string: str
    comparisons: List[RepoDNAComparisonItem]
    benchmark_verdict: str


class GenomeSimilarityMatch(BaseModel):
    similar_repository_id: str
    similarity_score_pct: float  # 94.2
    shared_engineering_characteristics: List[str]


class GenomeSimilarityResponse(BaseModel):
    target_repository_id: str
    matches_count: int
    matches: List[GenomeSimilarityMatch]


class EvolutionScoreResponse(BaseModel):
    repository_id: str
    architecture_improvement_score_pct: float  # +34.5
    refactoring_velocity_delta: float
    code_quality_index: float
    evolution_score_verdict: str


class GeneticDriftResponse(BaseModel):
    repository_id: str
    multi_year_drift_rate_pct_per_year: float  # 2.4%
    unwanted_drift_warnings_count: int
    drift_risk_assessment: str
    drift_verdict: str


class EDGSecondaryFeaturesResponse(BaseModel):
    repository_id: str
    dangerous_mutations: DangerousMutationDetectorResponse
    dna_comparison: DNAComparisonResponse
    genome_similarity: GenomeSimilarityResponse
    evolution_score: EvolutionScoreResponse
    genetic_drift: GeneticDriftResponse
