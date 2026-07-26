# apps/backend/app/schemas/edg_lab_finale.py

from typing import List

from pydantic import BaseModel


class ChromosomeExplorerItem(BaseModel):
    chromosome_id: str  # e.g. "CHR-01"
    name: str  # e.g. "Security & Trust Chromosome"
    base_pairs_count: int  # 840
    genes_count: int  # 12
    dominant_trait: str
    health_rating: str  # "Optimal"


class SpecializedGenomeProfile(BaseModel):
    category_name: str  # e.g. "Dependency Genome", "API Genome", "Security Genome", "Cloud Genome", "Testing Genome", "Database Genome", "Reliability Genome", "Performance Genome", "AI Readiness Genome", "Documentation Genome", "Developer Experience Genome", "Technical Debt Genome", "Compliance Genome", "Plugin Ecosystem Genome"
    score_out_of_20: int  # 15
    key_gene_traits: List[str]
    health_status: str  # "Optimal", "Good", "Needs Review"


class EDGLabFinaleResponse(BaseModel):
    repository_id: str
    chromosomes: List[ChromosomeExplorerItem]
    specialized_genomes: List[SpecializedGenomeProfile]
    genome_sequencing_verdict: str
