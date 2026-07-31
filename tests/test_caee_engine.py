import uuid

import app.models  # noqa: F401
import pytest
from app.core.database import Base
from app.models.activity import Activity  # noqa: F401
from app.models.caee import (
    ArchitectureEvolutionSession,
)
from app.models.repository import Repository
from app.models.user import User
from app.services.caee_service import CAEEService
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
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
def test_user_and_repo(db_session):
    user_id = str(uuid.uuid4())
    repo_id = str(uuid.uuid4())

    user = User(id=user_id, username="caee_tester", email="caee@codeatlas.com")
    db_session.add(user)

    repo = Repository(
        id=repo_id,
        name="CAEETestRepo",
        full_name="user/CAEETestRepo",
        clone_url="https://github.com/user/CAEETestRepo.git",
        user_id=user_id,
    )
    db_session.add(repo)
    db_session.commit()

    return user, repo


def test_analyze_architecture_evolution(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    res = service.analyze_architecture_evolution(
        repository_id=repo.id, target_horizon_years=3
    )
    assert res["overall_evolution_score"] == 92.5
    assert res["architecture_stability_index"] == 88.0
    assert "target_vision_1y" in res
    assert "target_vision_3y" in res
    assert "target_vision_5y" in res
    assert len(res["gaps"]) == 2
    assert len(res["migration_steps"]) == 3

    sessions = (
        db_session.query(ArchitectureEvolutionSession)
        .filter(ArchitectureEvolutionSession.repository_id == repo.id)
        .all()
    )
    assert len(sessions) == 1


def test_target_architecture_vision_projections(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    vision = service.get_target_architecture_vision(repository_id=repo.id)
    assert vision["vision_1y"]["pattern"] == "Modular Monolith"
    assert vision["vision_3y"]["pattern"] == "Decoupled Microservices"
    assert vision["vision_5y"]["pattern"] == "Event-Driven Reactive Mesh"


def test_gap_analysis_and_migration_plan(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    gaps = service.get_gap_analysis(repository_id=repo.id)
    assert gaps["total_gaps_found"] == 2
    assert gaps["critical_gaps_count"] == 1

    plan = service.get_migration_plan(repository_id=repo.id)
    assert plan["total_person_days"] == 36.0
    assert len(plan["phases"]) == 2


def test_evolution_risk_and_timeline(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    risk = service.get_evolution_risk_analysis(repository_id=repo.id)
    assert risk["overall_risk_level"] == "LOW"
    assert len(risk["risk_mitigation_strategies"]) >= 2

    timeline = service.get_evolution_timeline(repository_id=repo.id)
    assert len(timeline["milestones"]) == 2


def test_caee_control_center_data(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    cc = service.get_caee_control_center(repository_id=repo.id)
    assert cc["overall_evolution_score"] == 92.5
    assert cc["horizon_projections"]["1Y"] == "Modular Monolith"
    assert cc["status"] == "ON_TRACK_FOR_EVOLUTION"


def test_architecture_intelligence_features_1_to_5(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    ai = service.get_architecture_intelligence(repository_id=repo.id)
    assert "six_months" in ai["evolution_roadmap"]
    assert len(ai["target_architecture_progression"]) == 5
    assert ai["maturity_score"]["overall"] == 92.5
    assert ai["maturity_score"]["scalability"] == 90.0
    assert ai["drift_timeline"]["status"] == "LOW_DRIFT_CONTROLLED"
    assert "Modular Monolith" in ai["future_forecast"]["one_year_forecast"]


def test_service_evolution_features_6_to_10(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    se = service.get_service_evolution(repository_id=repo.id)
    assert se["microservice_readiness"]["recommendation"] == "Modular Monolith"
    assert len(se["service_split_planner"]["candidate_services"]) == 3
    assert se["dependency_evolution"]["growth_trend"] == "CONTROLLED_MODERATE"
    assert se["domain_boundary_validator"]["status"] == "VALIDATED"
    assert len(se["event_driven_migration_planner"]["migration_phases"]) == 3


def test_technical_debt_evolution_features_11_to_25(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    tde = service.get_technical_debt_evolution(repository_id=repo.id)
    assert tde["debt_trend_forecasting"]["trend"] == "DECREASING"
    assert (
        "Strangler Fig" in tde["legacy_modernization_planner"]["modernization_strategy"]
    )
    assert len(tde["architecture_violation_detector"]) == 1
    assert tde["layer_separation_validator"]["strict_isolation"] is True
    assert "EXCELLENT" in tde["module_health_trends"]["app.services"]
    assert tde["coupling_evolution"]["status"] == "IMPROVING"
    assert tde["cohesion_evolution"]["status"] == "HIGH_COHESION_TARGETED"
    assert tde["package_optimization_planner"]["unnecessary_imports_count"] == 0
    assert len(tde["architecture_cleanup_planner"]) == 2
    assert tde["repository_modularization"]["status"] == "MODULAR_BOUNDARIES_DEFINED"
    assert len(tde["shared_library_extraction"]) == 2
    assert "Kong" in tde["api_gateway_recommendation"]["recommendation"]
    assert tde["bounded_context_analyzer"]["user_context"] == "ISOLATED"
    assert tde["domain_model_optimizer"]["rich_domain_model_score"] == 92.0
    assert "httpx" in tde["dependency_reduction_planner"]["action"]


def test_cloud_infrastructure_evolution_features_26_to_40(
    db_session, test_user_and_repo
):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    cie = service.get_cloud_infrastructure_evolution(repository_id=repo.id)
    assert cie["kubernetes_readiness"]["readiness_score"] == 94.0
    assert "Lambda" in cie["serverless_recommendation"]["recommendation"]
    assert cie["cloud_native_maturity"]["maturity_score"] == 91.0
    assert len(cie["multi_region_planning"]["regions"]) == 3
    assert cie["disaster_recovery_architecture"]["rto_minutes"] == 0.5
    assert cie["high_availability_planner"]["sla_target_pct"] == 99.99
    assert cie["autoscaling_architecture"]["max_pods"] == 30
    assert "Cloudflare" in cie["cdn_optimization"]["provider"]
    assert (
        "Cloudflare Workers" in cie["edge_computing_recommendation"]["recommendation"]
    )
    assert "PostgreSQL" in cie["storage_evolution"]["primary_db"]
    assert cie["infrastructure_modernization"]["modernization_score"] == 93.5
    assert cie["cloud_cost_evolution"]["savings_pct"] == 26.2
    assert len(cie["platform_engineering_roadmap"]) == 2
    assert cie["infrastructure_as_code_maturity"]["coverage_pct"] == 98.0
    assert (
        cie["observability_architecture_planner"]["status"]
        == "FULLY_IMPLEMENTED_AND_VALIDATED"
    )


def test_ai_engineering_intelligence_features_41_to_55(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    aie = service.get_ai_engineering_intelligence(repository_id=repo.id)
    assert len(aie["ai_cto_recommendations"]) == 2
    assert "APPROVED" in aie["ai_staff_engineer_review"]["verdict"]
    assert "Saga pattern" in aie["ai_architecture_debate"]["ai_consensus"]
    assert "Strangler Fig" in aie["ai_migration_planner"]["strategy"]
    assert aie["ai_modernization_advisor"]["modernization_score"] == 96.0
    assert aie["ai_cost_optimizer"]["monthly_spend_reduction_usd"] == 1100.0
    assert aie["ai_scalability_advisor"]["max_concurrent_requests"] == 150000
    assert aie["ai_reliability_planner"]["target_availability"] == "99.99%"
    assert len(aie["ai_engineering_mentor"]["coaching_points"]) == 2
    assert len(aie["ai_technology_roadmap"]) == 3
    assert len(aie["ai_architecture_memory"]["adrs_tracked"]) == 2
    assert (
        "Consistency vs Availability"
        in aie["ai_tradeoff_analyzer"]["tradeoff_analyzed"]
    )
    assert len(aie["ai_governance_recommendations"]) == 2
    assert aie["ai_engineering_scorecard"]["overall_engineering_score"] == 93.5
    assert aie["ai_future_readiness"]["verdict"] == "READY_FOR_NEXT_GEN_SCALE"


def test_executive_intelligence_features_56_to_70(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    ei = service.get_executive_intelligence(repository_id=repo.id)
    assert ei["executive_architecture_dashboard"]["overall_health"] == "EXCELLENT"
    assert ei["architecture_investment_roi"]["roi_percentage"] == 266.6
    assert ei["engineering_capability_score"]["tier"] == "ELITE_ENGINEERING_ORG"
    assert "Level 5" in ei["team_maturity_assessment"]["maturity_level"]
    assert len(ei["modernization_timeline"]) == 3
    assert ei["architecture_kpi_tracking"]["change_failure_rate"] == "0.4%"
    assert (
        len(ei["strategic_dependency_analysis"]["critical_external_dependencies"]) == 3
    )
    assert len(ei["executive_reports"]) == 2
    assert "Payment" in ei["business_capability_mapping"]["order_processing"]
    assert len(ei["engineering_okr_alignment"]) == 2
    assert len(ei["architecture_change_calendar"]) == 2
    assert ei["compliance_evolution"]["soc2_compliance"] == "VERIFIED"
    assert ei["sustainability_score"]["carbon_efficiency_score"] == 94.5
    assert (
        ei["portfolio_wide_architecture_health"]["total_repositories_monitored"] == 14
    )
    assert (
        ei["global_evolution_command_center"]["command_center_status"]
        == "MISSION_CONTROL_ACTIVE"
    )


def test_architecture_time_navigator_wow_feature(db_session, test_user_and_repo):
    user, repo = test_user_and_repo
    service = CAEEService(db=db_session)

    # Test Today
    tn_today = service.get_time_navigator(repository_id=repo.id, timeframe="Today")
    assert tn_today["selected_timeframe"] == "Today"
    assert tn_today["visual_transformation"]["services_count"] == 1

    # Test +1 Year
    tn_1y = service.get_time_navigator(repository_id=repo.id, timeframe="1Y")
    assert tn_1y["selected_timeframe"] == "+1 Year"
    assert tn_1y["visual_transformation"]["services_count"] == 3

    # Test +3 Years
    tn_3y = service.get_time_navigator(repository_id=repo.id, timeframe="3Y")
    assert tn_3y["selected_timeframe"] == "+3 Years"
    assert tn_3y["visual_transformation"]["services_count"] == 7

    # Test +5 Years
    tn_5y = service.get_time_navigator(repository_id=repo.id, timeframe="5Y")
    assert tn_5y["selected_timeframe"] == "+5 Years"
    assert tn_5y["visual_transformation"]["services_count"] == 14
    assert tn_5y["timeframe_metrics"]["coupling_coefficient"] == 0.08
