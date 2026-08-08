import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.simulation_studio import (
    ConfidenceLevel,
    DiffState,
    ProposedChange,
    ProposedChangeType,
    ScenarioComparisonRequest,
    SimulationRunRequest,
    SimulationStatus,
)
from app.services.simulation_studio_service import SimulationStudioService


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def sim_service():
    return SimulationStudioService()


# ----------------------------------------------------
# 1. Virtual Graph & Diffing Tests
# ----------------------------------------------------
def test_virtual_graph_construction(sim_service):
    changes = [
        ProposedChange(
            change_id="ch_1",
            change_type=ProposedChangeType.EXTRACT_SERVICE,
            target_entity="auth_domain",
            new_value="oauth2_service",
        ),
        ProposedChange(
            change_id="ch_2",
            change_type=ProposedChangeType.ADD_DEPENDENCY,
            target_entity="auth_service",
            new_value="redis",
        ),
    ]

    vgraph, diff = sim_service.construct_virtual_graph("sim_repo_1", changes)
    assert len(vgraph.nodes) >= 4
    assert len(diff) >= 2
    assert any(d.entity_id == "oauth2_service" and d.diff_state == DiffState.ADDED for d in diff)
    assert any(d.entity_id == "redis" and d.diff_state == DiffState.ADDED for d in diff)


# ----------------------------------------------------
# 2. Simulated Impact & Projected Risk Tests
# ----------------------------------------------------
def test_impact_and_risk_calculation(sim_service):
    changes = [
        ProposedChange(
            change_id="ch_api",
            change_type=ProposedChangeType.CHANGE_API,
            target_entity="AuthService.authenticate",
        )
    ]
    vgraph, _ = sim_service.construct_virtual_graph("sim_repo_1", changes)
    impact, risk = sim_service.calculate_simulated_impact_and_risk("sim_repo_1", vgraph, changes)

    assert impact.direct_impact_count == 1
    assert impact.api_impact_count == 1
    assert len(impact.breaking_change_risks) > 0
    assert risk.simulated_risk_score > risk.current_risk_score
    assert risk.risk_delta > 0.0


# ----------------------------------------------------
# 3. Assumptions & Confidence Level Tests
# ----------------------------------------------------
def test_assumptions_and_confidence(sim_service):
    db_change = [
        ProposedChange(
            change_id="ch_db",
            change_type=ProposedChangeType.CHANGE_DB_SCHEMA,
            target_entity="users_table",
        )
    ]
    assumptions, confidence = sim_service.generate_assumptions_and_confidence(db_change)
    assert len(assumptions) >= 2
    assert confidence == ConfidenceLevel.MEDIUM


# ----------------------------------------------------
# 4. Non-Destructive Validation Plan Tests
# ----------------------------------------------------
def test_validation_plan_generation(sim_service):
    changes = [
        ProposedChange(
            change_id="ch_code",
            change_type=ProposedChangeType.MODIFY_FUNCTION,
            target_entity="apps/backend/app/services/auth.py",
        )
    ]
    vgraph, _ = sim_service.construct_virtual_graph("sim_repo_1", changes)
    impact, _ = sim_service.calculate_simulated_impact_and_risk("sim_repo_1", vgraph, changes)
    plan = sim_service.generate_validation_plan(changes, impact)

    assert len(plan.recommended_unit_tests) > 0
    assert len(plan.recommended_integration_tests) > 0
    assert len(plan.security_boundary_checks) > 0


# ----------------------------------------------------
# 5. Full Simulation Run Execution Tests
# ----------------------------------------------------
def test_run_simulation_service(sim_service):
    req = SimulationRunRequest(
        repository_id="sim_repo_1",
        title="Simulate Service Extraction",
        base_commit_sha="HEAD",
        proposed_changes=[
            ProposedChange(
                change_id="ch_ext",
                change_type=ProposedChangeType.EXTRACT_SERVICE,
                target_entity="payment_domain",
                new_value="payment_service",
            )
        ],
    )

    res = sim_service.run_simulation(req)
    assert res.status == SimulationStatus.COMPLETED
    assert res.simulation_id.startswith("sim_")
    assert res.confidence in [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM]
    assert len(res.virtual_graph.nodes) > 0
    assert len(res.graph_diff) > 0
    assert "SIMULATED ENGINEERING REASONING" in res.ai_reasoning
    assert res.decision_support.recommendation != ""


# ----------------------------------------------------
# 6. Multi-Scenario Comparison Tests
# ----------------------------------------------------
def test_scenario_comparison(sim_service):
    req = ScenarioComparisonRequest(repository_id="sim_repo_1", simulation_ids=["sim_1", "sim_2"])
    res = sim_service.compare_scenarios(req)

    assert len(res.scenarios) == 2
    assert "MULTI-SCENARIO COMPARISON" in res.comparison_summary
    assert res.recommended_option_id == "sc_option_a"


# ----------------------------------------------------
# 7. Simulation Export & Evaluation Tests
# ----------------------------------------------------
def test_export_and_evaluation(sim_service):
    report = sim_service.export_simulation_report("sim_100")
    assert report.simulation_id == "sim_100"
    assert report.status == SimulationStatus.COMPLETED
    assert len(report.proposed_changes) > 0

    eval_res = sim_service.evaluate_simulation_engine("sim_repo_1")
    assert eval_res.grounding_score > 0.9
    assert eval_res.passed_all_gates is True


# ----------------------------------------------------
# 8. API Router Endpoints Integration Tests
# ----------------------------------------------------
def test_api_simulation_endpoints(client):
    payload = {
        "repository_id": "api_sim_repo",
        "title": "API Test Simulation",
        "base_commit_sha": "HEAD",
        "proposed_changes": [
            {
                "change_id": "c1",
                "change_type": "RENAME_SYMBOL",
                "target_entity": "AuthService",
                "new_value": "AuthenticationEngine",
            }
        ],
    }

    # Run
    res1 = client.post("/api/v1/simulation/run", json=payload)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["status"] == "COMPLETED"
    assert "simulation_id" in data1
    sim_id = data1["simulation_id"]

    # Compare
    res2 = client.post(
        "/api/v1/simulation/compare",
        json={"repository_id": "api_sim_repo", "simulation_ids": [sim_id]},
    )
    assert res2.status_code == 200
    assert len(res2.json()["scenarios"]) == 2

    # Export
    res3 = client.get(f"/api/v1/simulation/export/{sim_id}")
    assert res3.status_code == 200
    assert res3.json()["status"] == "COMPLETED"

    # Evaluate
    res4 = client.post("/api/v1/simulation/evaluate", params={"repository_id": "api_sim_repo"})
    assert res4.status_code == 200
    assert res4.json()["passed_all_gates"] is True
