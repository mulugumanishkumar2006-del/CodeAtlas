# apps/backend/app/schemas/edg.py

from typing import List, Optional

from pydantic import BaseModel


class DNASequenceGene(BaseModel):
    gene_code: str  # e.g. "ARCH-12", "SEC-15"
    category: str  # e.g. "Architecture", "Security"
    expression_score: int  # 1 to 20
    phenotype_description: str


class RepositoryGenomeProfile(BaseModel):
    repository_id: str
    repository_name: str
    organism_type: str  # e.g. "High-Scale Resilient Cloud Native Microservice"
    dna_sequence_string: (
        str  # "ARCH-12-PERF-8-SEC-15-TEST-11-DATA-4-OBS-9-AI-3-DX-7-SCAL-10-CLOUD-8"
    )
    genes: List[DNASequenceGene]
    health_compatibility_pct: float
    genome_verdict: str


class DNASequencerPipelineStage(BaseModel):
    stage_name: str  # e.g. "Repository", "AST", "Knowledge Graph", "Runtime", "Prediction", "Physics", "Engineering Brain", "Genome Sequencer", "DNA Report"
    stage_index: int
    status: str  # "Completed", "Processing"
    extracted_tokens: int


class DNASequencerPipelineRequest(BaseModel):
    repository_id: Optional[str] = "main_backend_repo"


class DNASequencerPipelineResponse(BaseModel):
    repository_id: str
    pipeline_stages: List[DNASequencerPipelineStage]
    genome_profile: RepositoryGenomeProfile
    pipeline_verdict: str
