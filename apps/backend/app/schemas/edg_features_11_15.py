# apps/backend/app/schemas/edg_features_11_15.py

from typing import List, Optional

from pydantic import BaseModel


class DNAStabilityResponse(BaseModel):
    repository_id: str
    stability_index_pct: float  # e.g. 94.2
    volatility_rating: str  # "Low"
    mutation_tolerance_score: float  # 8.5 / 10
    stability_verdict: str


class AIGeneticRecommendation(BaseModel):
    recommendation_id: str
    target_gene: str  # e.g. "PERF-8"
    proposed_mutation: str  # "Migrate to gRPC Protobuf binary streaming"
    expected_architectural_yield: str  # "+24.5% Throughput, -15ms Latency"
    priority: str  # "High"


class AIGeneticAdvisorResponse(BaseModel):
    total_recommendations: int
    recommendations: List[AIGeneticRecommendation]
    advisor_verdict: str


class EngineeringSpeciesClassificationResponse(BaseModel):
    repository_id: str
    primary_species: str  # "FinTech High-Frequency Vault"
    secondary_sector: str  # "SaaS Enterprise"
    supported_sectors: List[
        str
    ]  # ["SaaS", "FinTech", "Healthcare", "Gaming", "AI Platform", "DevTools", "Data Platform", "Embedded Systems"]
    taxonomy_code: str  # "TAXONOMY-FINTECH-V3"
    classification_confidence_pct: float  # 98.4


class AncestryNode(BaseModel):
    version_tag: str  # "v1.0-monolith", "v2.0-services", "v3.0-cloud-native"
    parent_version: Optional[str]
    release_date: str
    architectural_breakthrough: str


class RepositoryFamilyTreeResponse(BaseModel):
    repository_id: str
    lineage_nodes_count: int
    ancestry_tree: List[AncestryNode]
    ancestry_verdict: str


class GeneStrengthWeaknessItem(BaseModel):
    gene_code: str
    category: str
    score: int  # 1 to 20
    status: str  # "Strength", "Weakness"
    heatmap_color_hex: str  # "#10b981" or "#f43f5e"


class GenomeHeatmapResponse(BaseModel):
    repository_id: str
    total_genes_evaluated: int
    strengths_count: int
    weaknesses_count: int
    heatmap_grid: List[GeneStrengthWeaknessItem]


class EDGDynamicsFeaturesResponse(BaseModel):
    repository_id: str
    stability: DNAStabilityResponse
    ai_advisor: AIGeneticAdvisorResponse
    species: EngineeringSpeciesClassificationResponse
    family_tree: RepositoryFamilyTreeResponse
    heatmap: GenomeHeatmapResponse
