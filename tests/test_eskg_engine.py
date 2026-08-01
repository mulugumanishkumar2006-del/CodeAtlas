import pytest
from app.core.database import Base
from app.enterprise.eskg_engine import eskg_engine
from app.schemas.eskg import (
    ESKGAIHiddenRelationshipRequest,
)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def test_seed_enterprise_graph(db):
    res = eskg_engine.seed_enterprise_graph(db)
    assert res.status == "success"
    assert res.nodes_created >= 20
    assert res.edges_created >= 15


def test_get_graph_topology(db):
    eskg_engine.seed_enterprise_graph(db)
    topology = eskg_engine.get_graph_topology(
        db, layer_filter="all", domain_filter="all"
    )
    assert topology.total_nodes >= 20
    assert topology.total_edges >= 15
    assert "business_domain" in topology.layer_breakdown
    assert "Auth" in topology.domain_breakdown

    # Filtered layer test
    microservice_topology = eskg_engine.get_graph_topology(
        db, layer_filter="microservice"
    )
    assert all(n.entity_type == "microservice" for n in microservice_topology.nodes)


def test_search_nodes(db):
    eskg_engine.seed_enterprise_graph(db)
    results = eskg_engine.search_nodes(db, query="Auth")
    assert len(results) >= 1
    assert any("Auth" in r.name or "Auth" in r.domain for r in results)


def test_calculate_blast_radius(db):
    eskg_engine.seed_enterprise_graph(db)
    blast = eskg_engine.calculate_blast_radius(
        db, target_node_id="db_auth_pg", max_depth=4
    )
    assert blast.target_node_id == "db_auth_pg"
    assert blast.target_node_name == "auth-users-db (PostgreSQL)"
    assert blast.impacted_nodes_count >= 1
    assert len(blast.mitigation_recommendations) >= 1


def test_detect_circular_dependencies(db):
    eskg_engine.seed_enterprise_graph(db)
    circ_resp = eskg_engine.detect_circular_dependencies(db)
    assert circ_resp.total_cycles >= 1
    assert len(circ_resp.cycles) >= 1
    assert any(
        "svc_inventory" in [n["id"] for n in circ_resp.cycles[0].nodes_in_cycle]
        for c in circ_resp.cycles
    )


def test_identify_spofs(db):
    eskg_engine.seed_enterprise_graph(db)
    spofs_resp = eskg_engine.identify_spofs(db)
    assert spofs_resp.total_spofs >= 1
    assert len(spofs_resp.spofs) >= 1
    assert len(spofs_resp.risk_reduction_strategies) >= 1


def test_find_dependency_path(db):
    eskg_engine.seed_enterprise_graph(db)
    path_resp = eskg_engine.find_dependency_path(
        db, source_node_id="svc_orders", target_node_id="db_auth_pg", max_hops=6
    )
    assert path_resp.found is True
    assert path_resp.path_length >= 1
    assert len(path_resp.path_nodes) >= 2


def test_reason_over_enterprise_graph(db):
    eskg_engine.seed_enterprise_graph(db)
    reasoning = eskg_engine.reason_over_enterprise_graph(
        db, query_text="What happens if auth postgres database fails?"
    )
    assert (
        "db_auth_pg" in reasoning.synthesized_answer
        or "Auth" in reasoning.synthesized_answer
        or "database" in reasoning.synthesized_answer
    )
    assert reasoning.confidence_score > 0.8
    assert len(reasoning.recommended_actions) >= 1


def test_get_enterprise_dashboard(db):
    eskg_engine.seed_enterprise_graph(db)
    dashboard = eskg_engine.get_enterprise_dashboard(db)
    assert dashboard.total_nodes >= 20
    assert dashboard.total_edges >= 15
    assert dashboard.spof_count >= 1
    assert dashboard.health_score > 80.0
    assert len(dashboard.top_critical_services) >= 1
    assert len(dashboard.system_alerts) >= 1


# --- Phase 37 Features 6–20 Unit Tests ---


def test_get_graph_analytics(db):
    eskg_engine.seed_enterprise_graph(db)
    analytics = eskg_engine.get_graph_analytics(db)
    assert len(analytics.centrality_ranking) >= 1
    assert len(analytics.community_clusters) >= 1
    assert analytics.graph_density > 0.0
    assert analytics.graph_quality_score >= 50.0
    assert len(analytics.dependency_evolution_trend) >= 3
    assert len(analytics.graph_pruning_suggestions) >= 1


def test_get_multi_level_navigation(db):
    eskg_engine.seed_enterprise_graph(db)
    nav = eskg_engine.get_multi_level_navigation(db)
    assert nav.company_name == "Global Enterprise Software Corp"
    assert nav.total_domains >= 1
    assert len(nav.hierarchy_tree) >= 1


def test_get_cross_repo_intelligence(db):
    eskg_engine.seed_enterprise_graph(db)
    cross = eskg_engine.get_cross_repo_intelligence(db)
    assert cross.total_chains >= 1
    assert len(cross.cross_repo_chains) >= 1


def test_discover_ai_hidden_relationships(db):
    eskg_engine.seed_enterprise_graph(db)
    hidden = eskg_engine.discover_ai_hidden_relationships(
        db, request=ESKGAIHiddenRelationshipRequest()
    )
    assert hidden.total_discovered >= 1
    assert len(hidden.discovered_relationships) >= 1
    assert hidden.discovered_relationships[0]["confidence_score"] > 0.8


def test_get_repository_intelligence(db):
    eskg_engine.seed_enterprise_graph(db)
    repo_intel = eskg_engine.get_repository_intelligence(db)
    assert len(repo_intel.cross_repo_apis) >= 1
    assert len(repo_intel.shared_code_blocks) >= 1
    assert len(repo_intel.duplicate_libraries) >= 1
    assert repo_intel.package_reuse_analysis["reuse_rate_pct"] > 50.0
    assert len(repo_intel.internal_sdks) >= 1
    assert len(repo_intel.hidden_coupling_vectors) >= 1
    assert len(repo_intel.cross_repo_refactorings) >= 1
    assert len(repo_intel.infrastructure_dependency_graph) >= 1
    assert len(repo_intel.deployment_dependency_graph) >= 1
    assert len(repo_intel.version_compatibility_matrix) >= 1
    assert "Python" in repo_intel.technology_usage_graph
    assert repo_intel.repository_ecosystem_score > 80.0


def test_get_enterprise_intelligence(db):
    eskg_engine.seed_enterprise_graph(db)
    ent_intel = eskg_engine.get_enterprise_intelligence(db)
    assert len(ent_intel.business_capability_graph) >= 1
    assert len(ent_intel.ddd_visualization) >= 1
    assert len(ent_intel.team_ownership_graph) >= 1
    assert len(ent_intel.customer_journey_map) >= 1
    assert "Auth & Identity Domain" in ent_intel.engineering_investment_graph
    assert len(ent_intel.cost_dependency_graph) >= 1
    assert len(ent_intel.compliance_graph) >= 1
    assert len(ent_intel.data_lineage) >= 1
    assert ent_intel.multi_cloud_graph["AWS"] == 80.0
    assert ent_intel.enterprise_health_graph["overall_health_score"] > 90.0


def test_get_ai_graph_intelligence(db):
    eskg_engine.seed_enterprise_graph(db)
    ai_intel = eskg_engine.get_ai_graph_intelligence(db)
    assert "query" in ai_intel.ai_graph_reasoning
    assert len(ai_intel.ai_dependency_predictions) >= 1
    assert len(ai_intel.ai_missing_edges) >= 1
    assert len(ai_intel.ai_architecture_recommendations) >= 1
    assert len(ai_intel.ai_modernization_graph) >= 1
    assert len(ai_intel.ai_root_cause_traces) >= 1
    assert len(ai_intel.ai_anomalies_detected) >= 1
    assert len(ai_intel.ai_pattern_minings) >= 1
    assert "svc_auth" in ai_intel.ai_graph_embeddings
    assert ai_intel.ai_graph_confidence_score > 90.0


def test_get_visualization_suite(db):
    eskg_engine.seed_enterprise_graph(db)
    vis = eskg_engine.get_visualization_suite(db)
    assert len(vis.software_universe_3d["nodes_3d"]) >= 10
    assert len(vis.graph_search_index) >= 10
    assert len(vis.time_travel_snapshots) >= 3
    assert len(vis.service_traffic_animation) >= 1
    assert vis.executive_dashboard_metrics["compliance_score"] == "96.7%"
    assert vis.graphml_export_url == "/api/v1/eskg/export-graphml"
    assert vis.software_universe_score > 95.0


def test_export_graphml(db):
    eskg_engine.seed_enterprise_graph(db)
    xml_str = eskg_engine.export_graphml(db)
    assert "<graphml" in xml_str
    assert '<graph id="ESKG"' in xml_str
    assert '<node id="svc_auth"' in xml_str
