"""
Tests for CodeAtlas v6.8 - Literature Ingestion, Method Comparison, Benchmark Normalization & Uncertainty Map Engine
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.science_v68.literature_benchmarks_uncertainty import LiteratureBenchmarksUncertaintyEngine, UncertaintyState

client = TestClient(app)

def test_paper_ingestion_benchmarks_and_uncertainty():
    engine = LiteratureBenchmarksUncertaintyEngine()
    
    paper = engine.ingest_and_parse_research_paper("CockroachDB Paper")
    assert "problem_addressed" in paper["structured_paper_analysis"]
    assert len(paper["extracted_claims"]) == 1
    
    bench = engine.normalize_and_compare_benchmarks()
    assert bench["normalization_status"] == "NORMALIZED_UNDER_EQUAL_HARDWARE_AND_WORKLOAD"
    assert len(bench["comparison_matrix"]) == 2
    
    uncert = engine.generate_uncertainty_map_and_knowledge_gaps()
    assert UncertaintyState.KNOWN in uncert["uncertainty_map"]
    assert len(uncert["detected_knowledge_gaps"]) == 1

def test_paper_and_uncertainty_api_endpoints():
    res_paper = client.post("/api/v1/science-v68/literature/ingest", json={"title": "CockroachDB Paper"})
    assert res_paper.status_code == 200
    assert "structured_paper_analysis" in res_paper.json()

    res_bench = client.post("/api/v1/science-v68/benchmarks/compare", json={
        "bench_a": "PostgreSQL RDS",
        "bench_b": "CockroachDB Dedicated"
    })
    assert res_bench.status_code == 200
    assert len(res_bench.json()["comparison_matrix"]) == 2

    res_uncert = client.get("/api/v1/science-v68/uncertainty/map")
    assert res_uncert.status_code == 200
    assert UncertaintyState.KNOWN in res_uncert.json()["uncertainty_map"]
