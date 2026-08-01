import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
)

from app.core.database import Base


class EngineeringOrganization(Base):
    """
    Represents an Engineering Organization comprising repositories, teams, and strategic policies.
    """

    __tablename__ = "oip_organizations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True)
    description = Column(Text, nullable=True)

    total_repositories = Column(Integer, default=0)
    total_teams = Column(Integer, default=0)
    total_engineers = Column(Integer, default=0)

    overall_health_score = Column(Float, default=82.5)
    modernization_index = Column(Float, default=74.0)
    bottleneck_risk_score = Column(Float, default=28.0)
    knowledge_silo_risk = Column(Float, default=35.0)

    strategic_goals = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class EngineeringTeam(Base):
    """
    Represents an engineering team with workload, burnout index, and debt metrics.
    """

    __tablename__ = "oip_teams"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    lead_name = Column(String(255), default="Engineering Lead")
    team_type = Column(String(100), default="Product Engineering")

    headcount = Column(Integer, default=8)
    velocity_pts = Column(Float, default=45.0)
    workload_score = Column(Float, default=78.5)
    burnout_risk_score = Column(Float, default=32.0)
    cognitive_load_score = Column(Float, default=65.0)

    owned_repos_count = Column(Integer, default=5)
    open_prs_count = Column(Integer, default=14)
    tech_debt_contribution_pct = Column(Float, default=18.5)

    key_members = Column(JSON, default=list)
    owned_services = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPRepositoryIntelligence(Base):
    """
    Stores Repository Intelligence metrics including modernization urgency and maintenance impossibility.
    """

    __tablename__ = "oip_repo_intelligence"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)
    repository_id = Column(String(255), index=True, nullable=False)
    repository_name = Column(String(255), nullable=False)

    modernization_urgency = Column(Float, default=45.0)
    maintenance_impossibility_index = Column(Float, default=30.0)
    codebase_health_score = Column(Float, default=80.0)
    code_churn_rate = Column(Float, default=22.0)
    bus_factor = Column(Integer, default=2)
    duplicate_code_ratio = Column(Float, default=12.5)

    complexity_tier = Column(String(50), default="MEDIUM")
    primary_language = Column(String(50), default="Python")
    assigned_team = Column(String(255), default="Platform Team")

    tech_stack = Column(JSON, default=list)
    risk_factors = Column(JSON, default=list)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPKnowledgeSilo(Base):
    """
    Tracks knowledge concentration, bus factor risks, and onboarding friction across repositories/services.
    """

    __tablename__ = "oip_knowledge_silos"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)
    service_or_repo = Column(String(255), nullable=False, index=True)

    silo_risk_level = Column(
        String(50), default="MODERATE"
    )  # LOW, MODERATE, HIGH, CRITICAL
    silo_score = Column(Float, default=55.0)
    bus_factor = Column(Integer, default=1)
    onboarding_friction_score = Column(Float, default=62.0)
    documentation_coverage = Column(Float, default=48.0)

    key_knowledge_holders = Column(JSON, default=list)
    siloed_topics = Column(JSON, default=list)
    mitigation_steps = Column(JSON, default=list)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPServiceBusinessCriticality(Base):
    """
    Evaluates business criticality, revenue impact, and SLA failure risk for services.
    """

    __tablename__ = "oip_business_criticality"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)
    service_name = Column(String(255), nullable=False, index=True)

    revenue_impact_tier = Column(
        String(50), default="HIGH"
    )  # CRITICAL, HIGH, MEDIUM, LOW
    sla_tier = Column(String(50), default="99.99%")
    business_criticality_score = Column(Float, default=88.0)
    failure_blast_radius = Column(Float, default=75.0)
    customer_dependency_count = Column(Integer, default=1500)

    is_duplicate_work_risk = Column(Boolean, default=False)
    duplicate_candidates = Column(JSON, default=list)
    owning_team = Column(String(255), default="Core Services")

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPStrategicRecommendation(Base):
    """
    AI-driven strategic recommendations generated by the Engineering Strategy Engine.
    """

    __tablename__ = "oip_strategic_recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)

    title = Column(String(255), nullable=False)
    target_entity = Column(
        String(255), nullable=False
    )  # Team name, repo name, service name
    action_type = Column(
        String(100), default="REALLOCATE_ENGINEERS"
    )  # REALLOCATE_ENGINEERS, MODERNIZATION, KNOWLEDGE_TRANSFER, REFACTOR
    priority = Column(String(50), default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    impact_score = Column(Float, default=85.0)
    urgency_score = Column(Float, default=78.0)

    summary = Column(Text, nullable=False)
    justification = Column(Text, nullable=True)
    execution_steps = Column(JSON, default=list)
    expected_roi = Column(String(255), default="25% Reduction in Incidents")

    created_at = Column(DateTime, default=datetime.utcnow)


class EngineeringMaturityScore(Base):
    """
    Stores 0-100 maturity scores across 7 key engineering dimensions (Feature 5).
    """

    __tablename__ = "oip_maturity_scores"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)

    overall_score = Column(Float, default=81.4)
    architecture_score = Column(Float, default=84.0)
    devops_score = Column(Float, default=88.5)
    security_score = Column(Float, default=79.0)
    testing_score = Column(Float, default=76.5)
    ai_adoption_score = Column(Float, default=82.0)
    documentation_score = Column(Float, default=74.0)
    reliability_score = Column(Float, default=86.0)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPTeamDeepAnalytics(Base):
    """
    Stores metrics for Features 6-20 (Collaboration, Ownership, Review Latency, Onboarding, Skill Radar).
    """

    __tablename__ = "oip_team_deep_analytics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)
    team_name = Column(String(255), index=True, nullable=False)

    collaboration_index = Column(Float, default=82.0)
    review_latency_hours = Column(Float, default=4.2)
    review_participation_rate = Column(Float, default=91.0)
    onboarding_complexity_days = Column(Float, default=14.0)
    capacity_utilization_pct = Column(Float, default=88.0)
    documentation_velocity_score = Column(Float, default=76.0)

    code_ownership_map = Column(JSON, default=dict)
    skill_distribution = Column(JSON, default=dict)
    cross_team_dependencies = Column(JSON, default=list)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPPortfolioDeepAnalytics(Base):
    """
    Stores metrics for Features 21-40 (Portfolio Ranking, Tech Debt Leaderboard, Duplicate Repos, Security Posture, Infrastructure Inventory).
    """

    __tablename__ = "oip_portfolio_deep_analytics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)
    repository_id = Column(String(255), index=True, nullable=False)
    repository_name = Column(String(255), nullable=False)

    repo_health_rank = Column(Integer, default=1)
    tech_debt_score = Column(Float, default=42.0)
    is_duplicate_repo = Column(Boolean, default=False)
    is_legacy = Column(Boolean, default=False)
    legacy_reason = Column(String(255), nullable=True)
    modernization_candidate_score = Column(Float, default=65.0)
    lifecycle_stage = Column(
        String(50), default="ACTIVE"
    )  # EXPERIMENTAL, ACTIVE, DEPRECATED, LEGACY

    build_reliability_pct = Column(Float, default=98.5)
    release_frequency_per_month = Column(Float, default=14.0)
    security_posture_score = Column(Float, default=84.0)
    documentation_completeness_score = Column(Float, default=72.0)
    risk_heatmap_score = Column(Float, default=38.0)
    portfolio_health_score = Column(Float, default=82.5)

    dependency_sharing_map = Column(JSON, default=dict)
    shared_library_usage = Column(JSON, default=list)
    tech_stack_inventory = Column(JSON, default=list)
    framework_usage = Column(JSON, default=dict)
    language_distribution = Column(JSON, default=dict)
    infrastructure_inventory = Column(JSON, default=list)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPKnowledgeDeepAnalytics(Base):
    """
    Stores metrics for Features 41-60 (Org Knowledge Graph, Expert Discovery, ADR Coverage, Glossary, Learning Score).
    """

    __tablename__ = "oip_knowledge_deep_analytics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)

    org_knowledge_graph_size = Column(Integer, default=1450)
    knowledge_concentration_index = Column(Float, default=68.0)
    documentation_coverage_pct = Column(Float, default=74.5)
    adr_coverage_pct = Column(Float, default=82.0)
    doc_freshness_score = Column(Float, default=78.0)
    org_memory_score = Column(Float, default=85.0)
    onboarding_difficulty_score = Column(Float, default=42.0)
    wiki_health_score = Column(Float, default=79.0)
    knowledge_risk_trend_pct = Column(Float, default=-8.5)
    organization_learning_score = Column(Float, default=84.0)

    knowledge_transfer_recommendations = Column(JSON, default=list)
    expert_discovery_map = Column(JSON, default=dict)
    knowledge_gap_predictions = Column(JSON, default=list)
    critical_knowledge_alerts = Column(JSON, default=list)
    engineering_glossary = Column(JSON, default=dict)
    semantic_doc_graph_nodes = Column(JSON, default=list)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPExecutiveDeepAnalytics(Base):
    """
    Stores metrics for Features 61-80 (CTO Dashboard, DORA Metrics, Cost of Tech Debt, Eng ROI, Executive AI Briefing).
    """

    __tablename__ = "oip_executive_deep_analytics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)

    deployment_frequency_per_day = Column(Float, default=14.2)
    lead_time_hours = Column(Float, default=3.4)
    change_failure_rate_pct = Column(Float, default=2.1)
    mttr_hours = Column(Float, default=1.1)

    cost_of_tech_debt_usd = Column(Float, default=4200000.0)
    engineering_roi_pct = Column(Float, default=280.0)
    team_productivity_index = Column(Float, default=91.5)
    delivery_forecasting_confidence_pct = Column(Float, default=94.0)
    innovation_index = Column(Float, default=88.0)
    ai_adoption_pct = Column(Float, default=82.0)
    strategic_modernization_progress_pct = Column(Float, default=68.5)
    business_capability_alignment_score = Column(Float, default=89.0)

    dora_tier = Column(String(50), default="ELITE")
    executive_ai_briefing = Column(Text, nullable=True)

    cto_dashboard_metrics = Column(JSON, default=dict)
    vp_eng_dashboard_metrics = Column(JSON, default=dict)
    portfolio_risk_matrix = Column(JSON, default=dict)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OIPAIOrgIntelligence(Base):
    """
    Stores metrics for Features 81-100 (AI CTO Assistant, Hiring Advisor, Scaling Simulator, Compliance, Engineering Earth Nodes).
    """

    __tablename__ = "oip_ai_org_intelligence"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), index=True, nullable=False)

    ai_advisor_confidence_pct = Column(Float, default=96.5)
    compliance_score_pct = Column(Float, default=94.0)
    scaling_headcount_capacity = Column(Integer, default=120)
    repo_consolidation_opportunity_count = Column(Integer, default=18)
    engineering_earth_active_nodes = Column(Integer, default=48)

    ai_org_advisor_recommendations = Column(JSON, default=list)
    ai_cto_assistant_insights = Column(JSON, default=dict)
    ai_vp_eng_assistant_insights = Column(JSON, default=dict)
    ai_hiring_recommendations = Column(JSON, default=list)
    ai_team_scaling_simulator = Column(JSON, default=dict)
    ai_compliance_status = Column(JSON, default=dict)
    engineering_earth_nodes = Column(JSON, default=list)
    ai_executive_chat_history = Column(JSON, default=list)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
