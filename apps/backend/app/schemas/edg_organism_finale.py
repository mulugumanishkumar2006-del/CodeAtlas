# apps/backend/app/schemas/edg_organism_finale.py

from typing import List

from pydantic import BaseModel


# 🌟 WOW Feature: Repository DNA Explorer DTOs
class RepositoryDNAExplorerScore(BaseModel):
    category: str  # e.g. "Architecture", "Security", "Scalability", "Testing", "Reliability", "AI Readiness", "Observability"
    score_pct: float  # e.g. 96.0
    gauge_string: str  # e.g. "██████████ 96%"
    status_label: str  # "Optimal", "Good", "Needs Review"


class RepositoryDNAExplorerProfile(BaseModel):
    repository_id: str
    repository_name: str
    architecture: RepositoryDNAExplorerScore
    security: RepositoryDNAExplorerScore
    scalability: RepositoryDNAExplorerScore
    testing: RepositoryDNAExplorerScore
    reliability: RepositoryDNAExplorerScore
    ai_readiness: RepositoryDNAExplorerScore
    observability: RepositoryDNAExplorerScore
    total_commits_sequenced: int
    organism_age_days: int
    evolution_summary: str


# Features 31–50 DTOs
class MutationReplayItem(BaseModel):
    replay_step: int
    commit_sha: str
    author: str
    mutation_description: str
    fitness_delta_pct: float  # +2.4%


class GenomeDiffItem(BaseModel):
    gene_code: str
    category: str
    old_score_pct: float
    new_score_pct: float
    change_delta_pct: float
    diff_status: str  # "Improved", "Regressed", "Unchanged"


class ExecutiveGenomeReport(BaseModel):
    overall_health_score_pct: float  # e.g. 94.8
    executive_summary: str
    strategic_investment_recommendations: List[str]
    engineering_biodiversity_score: float  # e.g. 88.5


class EDGOrganismFinaleResponse(BaseModel):
    repository_id: str
    dna_explorer: RepositoryDNAExplorerProfile
    mutation_replays: List[MutationReplayItem]
    genome_diffs: List[GenomeDiffItem]
    executive_report: ExecutiveGenomeReport
    organism_verdict: str
