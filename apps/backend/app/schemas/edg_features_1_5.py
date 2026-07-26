# apps/backend/app/schemas/edg_features_1_5.py

from datetime import datetime
from typing import List

from pydantic import BaseModel


class RepositoryDNAFingerprint(BaseModel):
    repository_id: str
    dna_sha256_hash: str  # e.g. "dna_sha256_8f9a2e41b7c3d05e81f"
    base_pairs_count: int  # 4200
    sequenced_at: datetime
    fingerprint_verdict: str


class GeneMutationItem(BaseModel):
    mutation_id: str
    commit_sha: str
    author: str
    gene_code: str  # e.g. "SEC-15"
    mutation_type: str  # "Beneficial (Good)", "Deleterious (Bad)"
    impact_delta: float  # +2.4 or -1.8
    mutation_description: str


class MutationDetectorResponse(BaseModel):
    total_commits_analyzed: int
    good_mutations_count: int
    bad_mutations_count: int
    health_mutation_ratio_pct: float
    mutations: List[GeneMutationItem]
    mutation_verdict: str


class DNAEvolutionSnapshot(BaseModel):
    snapshot_id: str
    quarter_tag: str  # e.g. "Q1 2025", "Q2 2026"
    dna_sequence_string: str
    genome_fitness_score: float  # 0 to 100
    dominant_phenotype_trait: str


class EvolutionTrackerResponse(BaseModel):
    total_snapshots: int
    evolution_history: List[DNAEvolutionSnapshot]
    evolution_trend: str  # "POSITIVE_GENETIC_SELECTION"


class HealthyMutationDetectorResponse(BaseModel):
    top_beneficial_mutations_count: int
    top_mutations: List[GeneMutationItem]
    healthy_verdict: str


class EDGPrimaryFeaturesResponse(BaseModel):
    repository_id: str
    fingerprint: RepositoryDNAFingerprint
    mutations: MutationDetectorResponse
    evolution: EvolutionTrackerResponse
    healthy_mutations: HealthyMutationDetectorResponse
