import uuid

import app.models  # noqa: F401
import pytest
from app.core.database import Base, get_db
from app.main import app
from app.models.activity import Activity  # noqa: F401
from app.models.repository import Repository
from app.models.user import User
from app.schemas.edie import EngineeringDecisionCreate
from app.services.edie_service import EDIEService
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def test_repo_id(db_session):
    user_id = str(uuid.uuid4())
    repo_id = str(uuid.uuid4())

    user = User(id=user_id, username="edie_user", email="edie@codeatlas.com")
    db_session.add(user)

    repo = Repository(
        id=repo_id,
        name="EDIETestRepo",
        full_name="org/EDIETestRepo",
        clone_url="https://github.com/org/EDIETestRepo.git",
        user_id=user_id,
    )
    db_session.add(repo)
    db_session.commit()
    return repo_id


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_seed_and_get_decisions(db_session, test_repo_id):
    decisions = EDIEService.get_decisions(db_session, test_repo_id)
    assert len(decisions) >= 6
    titles = [d.title for d in decisions]
    assert any("Redis" in t for t in titles)
    assert any("Kafka" in t for t in titles)
    assert any("Microservices" in t or "Payment" in t for t in titles)


def test_create_decision(db_session, test_repo_id):
    new_dec = EngineeringDecisionCreate(
        repository_id=test_repo_id,
        title="Adopt PostgreSQL for JSONB Semi-Structured Data Storage",
        decision_type="TECHNOLOGY",
        status="ACCEPTED",
        context="System needed transactional ACID compliance along with flexible JSON document querying.",
        decision="Use PostgreSQL as the primary relational database with native JSONB columns.",
        consequences="Unified DB administration; eliminated need for separate MongoDB instance.",
        alternatives_considered=["MongoDB", "DynamoDB"],
        sources=["ADR-025"],
        author="Architect Alex",
        tags=["postgres", "database", "jsonb"],
        impact_score=90.0,
        confidence_score=0.97,
        health_status="HEALTHY",
    )

    created = EDIEService.create_decision(db_session, new_dec)
    assert created.id is not None
    assert created.title == new_dec.title

    # Verify decision is retrieved
    fetched = EDIEService.get_decision(db_session, created.id)
    assert fetched is not None
    assert fetched.title == new_dec.title


def test_query_reasoning_engine(db_session, test_repo_id):
    res_redis = EDIEService.query_reasoning_engine(
        db_session, test_repo_id, "Why was Redis introduced?"
    )
    assert res_redis.answer is not None
    assert "Redis" in res_redis.decision_title or "caching" in res_redis.answer.lower()
    assert res_redis.confidence_score > 0.8
    assert len(res_redis.evidence) > 0

    res_kafka = EDIEService.query_reasoning_engine(
        db_session, test_repo_id, "Why is Kafka used for messaging?"
    )
    assert res_kafka.decision_title is not None
    assert "Kafka" in res_kafka.decision_title or "event" in res_kafka.answer.lower()


def test_build_decision_graph(db_session, test_repo_id):
    graph = EDIEService.build_decision_graph(db_session, test_repo_id)
    assert graph.total_nodes >= 6
    assert graph.total_edges >= 4
    edge_types = [e.relation_type for e in graph.edges]
    assert "ENABLES" in edge_types or "DEPENDS_ON" in edge_types


def test_get_decision_timeline(db_session, test_repo_id):
    timeline = EDIEService.get_decision_timeline(db_session, test_repo_id)
    assert len(timeline) >= 6
    assert timeline[0].event_type == "CREATED"


def test_validate_decisions(db_session, test_repo_id):
    validations = EDIEService.validate_decisions(db_session, test_repo_id)
    assert len(validations) >= 6

    # Verify drift detection
    drifted = [v for v in validations if v.drift_status == "DRIFTED"]
    assert len(drifted) > 0
    assert len(drifted[0].violations_found) > 0


def test_future_recommendations(db_session, test_repo_id):
    recs = EDIEService.generate_future_recommendations(db_session, test_repo_id)
    assert len(recs) >= 3
    assert recs[0].impact in ["HIGH", "MEDIUM", "LOW"]


def test_export_adr_markdown(db_session, test_repo_id):
    decisions = EDIEService.get_decisions(db_session, test_repo_id)
    target_dec = decisions[0]

    adr = EDIEService.export_adr_markdown(db_session, target_dec.id)
    assert adr.filename.endswith(".md")
    assert target_dec.title in adr.madr_content
    assert "Context and Problem Statement" in adr.madr_content


def test_summary_stats(db_session, test_repo_id):
    stats = EDIEService.get_summary_stats(db_session, test_repo_id)
    assert stats.total_decisions >= 6
    assert stats.active_graph_nodes >= 6
    assert stats.aligned_count > 0


def test_fastapi_endpoints(db_session, test_repo_id):
    # Summary
    resp = client.get(f"/api/v1/edie/summary/{test_repo_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_decisions"] >= 6

    # List Decisions
    resp = client.get(f"/api/v1/edie/decisions/{test_repo_id}")
    assert resp.status_code == 200
    decisions_json = resp.json()
    assert len(decisions_json) >= 6
    dec_id = decisions_json[0]["id"]

    # Decision Detail
    resp = client.get(f"/api/v1/edie/decisions/detail/{dec_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == dec_id

    # Reasoning Query
    resp = client.post(
        "/api/v1/edie/query",
        json={"repository_id": test_repo_id, "query": "Why was Redis introduced?"},
    )
    assert resp.status_code == 200
    query_json = resp.json()
    assert "query" in query_json
    assert query_json["confidence_score"] > 0.5

    # Decision Graph
    resp = client.get(f"/api/v1/edie/graph/{test_repo_id}")
    assert resp.status_code == 200
    assert resp.json()["total_nodes"] >= 6

    # Timeline
    resp = client.get(f"/api/v1/edie/timeline/{test_repo_id}")
    assert resp.status_code == 200
    assert len(resp.json()) >= 6

    # Validation
    resp = client.get(f"/api/v1/edie/validate/{test_repo_id}")
    assert resp.status_code == 200
    assert len(resp.json()) >= 6

    # Recommendations
    resp = client.get(f"/api/v1/edie/recommendations/{test_repo_id}")
    assert resp.status_code == 200
    assert len(resp.json()) >= 3

    # Export ADR
    resp = client.get(f"/api/v1/edie/export-adr/{dec_id}")
    assert resp.status_code == 200
    assert resp.json()["filename"].endswith(".md")


def test_knowledge_intelligence_suite(db_session, test_repo_id):
    # Wiki
    wiki = EDIEService.generate_engineering_wiki(db_session, test_repo_id)
    assert wiki.total_decisions_indexed >= 6
    assert "Engineering Architecture Wiki" in wiki.markdown_content

    # Historian
    historian = EDIEService.get_repository_historian_narrative(db_session, test_repo_id)
    assert len(historian.historical_milestones) >= 5

    # Story
    story = EDIEService.generate_architecture_story(db_session, test_repo_id)
    assert len(story.key_turning_points) >= 3

    # Evolution Narrative
    eras = EDIEService.get_evolution_narrative(db_session, test_repo_id)
    assert len(eras) >= 5

    # Design Patterns
    patterns = EDIEService.get_design_patterns(db_session, test_repo_id)
    assert len(patterns) >= 4

    # Framework Timeline
    frameworks = EDIEService.get_framework_adoption_timeline(db_session, test_repo_id)
    assert len(frameworks) >= 4

    # Tech Lifecycle
    lifecycle = EDIEService.get_technology_lifecycle_tracker(db_session, test_repo_id)
    assert len(lifecycle) >= 4

    # Knowledge Gaps
    gaps = EDIEService.detect_knowledge_gaps(db_session, test_repo_id)
    assert len(gaps) >= 3

    # ADR Validation
    valid_adr = EDIEService.validate_adr_content(
        "ADR-001.md",
        "# Title\n## Context\nContext text\n## Decision\nDecision text\n## Status\nACCEPTED",
    )
    assert valid_adr.is_valid_format is True


def test_knowledge_intelligence_endpoints(db_session, test_repo_id):
    assert client.get(f"/api/v1/edie/wiki/{test_repo_id}").status_code == 200
    assert client.get(f"/api/v1/edie/historian/{test_repo_id}").status_code == 200
    assert (
        client.get(f"/api/v1/edie/architecture-story/{test_repo_id}").status_code == 200
    )
    assert (
        client.get(f"/api/v1/edie/evolution-narrative/{test_repo_id}").status_code
        == 200
    )
    assert client.get(f"/api/v1/edie/design-patterns/{test_repo_id}").status_code == 200
    assert (
        client.get(f"/api/v1/edie/framework-timeline/{test_repo_id}").status_code == 200
    )
    assert client.get(f"/api/v1/edie/tech-lifecycle/{test_repo_id}").status_code == 200
    assert client.get(f"/api/v1/edie/knowledge-gaps/{test_repo_id}").status_code == 200


def test_ai_reasoning_suite(db_session, test_repo_id):
    # Test Service Method
    suite = EDIEService.generate_ai_reasoning_suite(db_session, test_repo_id)
    assert suite.repository_id == test_repo_id
    assert len(suite.alternative_solutions) >= 3  # F21
    assert len(suite.tradeoff_analysis) >= 2  # F22
    assert len(suite.debate_simulation) >= 3  # F23
    assert len(suite.future_predictions) >= 2  # F24
    assert suite.staff_engineer_review != ""  # F25
    assert suite.cto_opinion != ""  # F26
    assert suite.principal_engineer_feedback != ""  # F27
    assert len(suite.solution_rankings) >= 3  # F28
    assert "overall_risk_level" in suite.risk_assessment  # F29
    assert "estimated_monthly_usd" in suite.cost_analysis  # F30
    assert "max_throughput_rps" in suite.scalability_review  # F31
    assert "compliance" in suite.security_review  # F32
    assert "cognitive_load_score" in suite.maintainability_review  # F33
    assert "p95_latency_ms" in suite.performance_review  # F34
    assert suite.architecture_advisor_notes != ""  # F35
    assert suite.tech_debt_advisor_notes != ""  # F36
    assert suite.modernization_advisor_notes != ""  # F37
    assert len(suite.migration_advisor_steps) >= 4  # F38
    assert suite.generated_documentation != ""  # F39
    assert suite.executive_summary != ""  # F40

    # Test Endpoint
    resp = client.get(f"/api/v1/edie/ai-reasoning/{test_repo_id}")
    assert resp.status_code == 200
    res_json = resp.json()
    assert res_json["decision_title"] != ""
    assert len(res_json["debate_simulation"]) >= 3


def test_decision_evolution_suite(db_session, test_repo_id):
    # Test Service Method
    evo = EDIEService.generate_decision_evolution_suite(db_session, test_repo_id)
    assert evo.repository_id == test_repo_id
    assert len(evo.technology_replacements) >= 1  # F41
    assert len(evo.dependency_replacements) >= 1  # F42
    assert len(evo.deprecated_technology_alerts) >= 1  # F43
    assert len(evo.framework_upgrade_roadmap) >= 2  # F44
    assert len(evo.database_evolution_plan) >= 3  # F45
    assert len(evo.cloud_migration_decisions) >= 1  # F46
    assert len(evo.event_driven_adoption) >= 1  # F47
    assert len(evo.api_version_strategy) >= 3  # F48
    assert len(evo.architecture_style_evolution) >= 3  # F49
    assert len(evo.team_growth_recommendations) >= 1  # F50
    assert "cross_team_dependencies" in evo.org_impact_analysis  # F51
    assert len(evo.business_capability_mapping) >= 2  # F52
    assert len(evo.compliance_decision_tracking) >= 2  # F53
    assert len(evo.security_policy_evolution) >= 3  # F54
    assert "green_computing_score" in evo.sustainability_decisions  # F55
    assert len(evo.cost_optimization_timeline) >= 1  # F56
    assert len(evo.observability_roadmap) >= 2  # F57
    assert len(evo.platform_engineering_plan) >= 1  # F58
    assert "local_setup_time_minutes" in evo.developer_experience_evolution  # F59
    assert len(evo.long_term_tech_strategy) >= 2  # F60

    # Test Endpoint
    resp = client.get(f"/api/v1/edie/decision-evolution/{test_repo_id}")
    assert resp.status_code == 200
    res_json = resp.json()
    assert len(res_json["framework_upgrade_roadmap"]) >= 2
    assert len(res_json["long_term_tech_strategy"]) >= 2


def test_engineering_brain_and_executive_intelligence_suite(db_session, test_repo_id):
    # Test Feature 80 Signature Engineering Brain Service & Endpoint
    brain_res = EDIEService.query_engineering_brain(
        db_session, test_repo_id, "Why does this company use Kafka instead of RabbitMQ?"
    )
    assert brain_res.decision_name == "Apache Kafka Event Bus Standard"
    assert "RabbitMQ" in brain_res.alternatives[0]
    assert brain_res.confidence_score == 0.96
    assert brain_res.current_status == "Still Recommended (Active Standard)"

    post_resp = client.post(
        "/api/v1/edie/engineering-brain",
        json={
            "repository_id": test_repo_id,
            "query": "Why does this company use Kafka instead of RabbitMQ?",
        },
    )
    assert post_resp.status_code == 200
    post_json = post_resp.json()
    assert post_json["decision_name"] == "Apache Kafka Event Bus Standard"
    assert post_json["confidence_score"] == 0.96

    # Test Executive Intelligence Suite (Features 61-80)
    exec_suite = EDIEService.generate_executive_intelligence_suite(
        db_session, test_repo_id
    )
    assert exec_suite.repository_id == test_repo_id
    assert exec_suite.engineering_knowledge_score == 95.4  # F61
    assert "overall_bus_factor" in exec_suite.bus_factor_dashboard  # F62
    assert len(exec_suite.team_decision_heatmap) >= 3  # F63
    assert len(exec_suite.strategic_decision_calendar) >= 2  # F64
    assert len(exec_suite.executive_architecture_reports) >= 1  # F65
    assert "caching_roi" in exec_suite.technology_investment_tracker  # F66
    assert "architecture_health" in exec_suite.engineering_kpi_dashboard  # F67
    assert exec_suite.innovation_score == 92.8  # F68
    assert "high_risk_decisions_count" in exec_suite.decision_risk_matrix  # F69
    assert (
        "quarterly_tech_debt_budget_pct" in exec_suite.tech_debt_investment_tracker
    )  # F70
    assert "policies_enforced" in exec_suite.architecture_governance_dashboard  # F71
    assert len(exec_suite.portfolio_insights) >= 1  # F72
    assert "total_linked_repos" in exec_suite.cross_repo_decision_graph  # F73
    assert len(exec_suite.multi_team_alignment) >= 1  # F74
    assert exec_suite.ai_executive_assistant_notes != ""  # F75
    assert "total_memory_records" in exec_suite.global_engineering_memory  # F76
    assert len(exec_suite.architecture_audit_reports) >= 1  # F77
    assert len(exec_suite.decision_simulation_history) >= 1  # F78
    assert "retention_rate" in exec_suite.knowledge_retention_analytics  # F79
    assert exec_suite.engineering_brain.decision_name != ""  # F80 Signature

    # Test Endpoint
    resp = client.get(f"/api/v1/edie/executive-intelligence/{test_repo_id}")
    assert resp.status_code == 200
    res_json = resp.json()
    assert res_json["engineering_knowledge_score"] == 95.4
    assert res_json["engineering_brain"]["confidence_score"] == 0.96
