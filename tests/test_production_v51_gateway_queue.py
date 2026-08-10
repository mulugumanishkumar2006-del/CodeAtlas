"""
Tests for CodeAtlas v5.1 - API Gateway Validation, Priority Job Queue & Incremental Indexing
"""

import pytest
from typing import List, Dict, Any
from fastapi.testclient import TestClient
from app.main import app
from app.production_v51.gateway_job_queue import ProductionGatewayAndJobQueueEngine, JobPriority
from app.production_v51.indexing_database_resilience import IndexingAndDatabaseResilienceEngine

client = TestClient(app)

def test_gateway_validation_and_priority_queue():
    engine = ProductionGatewayAndJobQueueEngine()
    gw = engine.validate_and_route_gateway_request("/api/v1/repositories", "GET", "tenant_acme")
    assert gw["gateway_status"] == "REQUEST_AUTHORIZED"
    assert "correlation_id" in gw

    job = engine.enqueue_background_job("REASONING_ANALYSIS", JobPriority.CRITICAL_ANALYSIS, "tenant_acme", {"query": "Why is checkout slow?"})
    assert job["status"] == "ENQUEUED"
    assert job["priority"] == JobPriority.CRITICAL_ANALYSIS

    completed = engine.process_next_job(simulate_failure=False)
    assert completed["status"] == "COMPLETED"

def test_dlq_routing_and_incremental_indexing():
    queue = ProductionGatewayAndJobQueueEngine()
    queue.enqueue_background_job("LARGE_SIMULATION", JobPriority.LARGE_SIMULATION, "tenant_acme", {"sim": "100x"})
    
    dlq_res = queue.process_next_job(simulate_failure=True)
    assert dlq_res["status"] == "FAILED"
    assert dlq_res["dlq_count"] == 1

    idx = IndexingAndDatabaseResilienceEngine()
    incremental = idx.process_incremental_repository_indexing("payment-service", 12000, ["apps/backend/app/main.py"])
    assert incremental["processed_changed_files_count"] == 1
    assert incremental["skipped_unchanged_files_count"] == 11999

def test_gateway_and_queue_api_endpoints():
    res_gw = client.post("/api/v1/production-v51/gateway/validate", json={"path": "/api/v1/repos", "method": "GET", "tenant_id": "tenant_acme"})
    assert res_gw.status_code == 200
    assert res_gw.json()["gateway_status"] == "REQUEST_AUTHORIZED"

    res_idx = client.post("/api/v1/production-v51/indexing/incremental", json={"repository": "payment-service", "changed_files": ["main.py"]})
    assert res_idx.status_code == 200
    assert res_idx.json()["processed_changed_files_count"] == 1
