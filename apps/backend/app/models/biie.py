import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)

from app.core.database import Base


class BusinessCapability(Base):
    """
    Represents a core business capability mapped to software architecture nodes.
    e.g., 'Order Checkout & Payment Processing', 'User Authentication & SSO',
    'Real-Time Analytics Ingestion', 'Subscription Lifecycle Management'.
    """

    __tablename__ = "business_capabilities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    capability_name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    owner_team = Column(String(100), default="Core Platform")
    tier = Column(
        String(50), default="Tier 1 - Mission Critical", index=True
    )  # Tier 1, Tier 2, Tier 3

    target_sla_up_pct = Column(Float, default=99.99)
    hourly_revenue_usd = Column(Float, default=15000.0)
    total_arr_usd = Column(Float, default=2500000.0)

    # Architectural Mappings
    mapped_services = Column(JSON, default=list)  # list of service names
    mapped_code_nodes = Column(JSON, default=list)  # list of symbols/endpoints/files
    mapped_db_schemas = Column(JSON, default=list)  # DB tables/schemas

    criticality_score = Column(Float, default=95.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BusinessSystemConnector(Base):
    """
    Tracks connections & cached telemetry from external business systems:
    CRM (Salesforce/HubSpot), ERP (Netsuite/SAP), Analytics (Mixpanel/Amplitude),
    Feature Flags (LaunchDarkly), SLA Monitors (Datadog/NewRelic), Incident Data (PagerDuty).
    """

    __tablename__ = "business_system_connectors"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    connector_type = Column(
        String(50), nullable=False, index=True
    )  # crm, erp, analytics, feature_flags, sla_metrics, incident_data
    name = Column(String(255), nullable=False)
    status = Column(
        String(50), default="connected", index=True
    )  # connected, error, syncing

    config_json = Column(JSON, default=dict)
    metrics_json = Column(JSON, default=dict)

    last_synced_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class ImpactAnalysisRecord(Base):
    """
    Stores historical & real-time blast radius and business impact analysis reports.
    """

    __tablename__ = "impact_analysis_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    target_service = Column(String(255), nullable=False, index=True)
    target_commit_or_pr = Column(String(100), nullable=True)

    # Impact Metrics
    customer_blast_radius_total = Column(Integer, default=14200)
    enterprise_customers_impacted = Column(Integer, default=48)
    growth_customers_impacted = Column(Integer, default=320)
    total_mau_affected = Column(Integer, default=850000)

    revenue_at_risk_hourly_usd = Column(Float, default=42500.0)
    arr_threatened_usd = Column(Float, default=3800000.0)
    sla_breach_penalty_per_hour_usd = Column(Float, default=12500.0)

    capability_degradation_pct = Column(Float, default=65.0)
    risk_level = Column(
        String(50), default="HIGH", index=True
    )  # CRITICAL, HIGH, MEDIUM, LOW

    impacted_capabilities = Column(JSON, default=list)
    product_launch_blockers = Column(JSON, default=list)
    cascading_service_dependencies = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)


class CostOfInactionForecast(Base):
    """
    Stores 30/60/90-day Cost of Inaction (Cost of Not Fixing) forecasts & refactoring ROI.
    """

    __tablename__ = "cost_of_inaction_forecasts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    target_service_or_module = Column(String(255), nullable=False, index=True)
    horizon_days = Column(Integer, default=90)  # 30, 60, 90

    # Risk & Cost Projections
    total_cost_of_inaction_usd = Column(Float, default=185000.0)
    tech_debt_compound_interest_usd = Column(Float, default=45000.0)
    projected_churn_arr_usd = Column(Float, default=80000.0)
    projected_incident_cost_usd = Column(Float, default=35000.0)
    sla_penalty_exposure_usd = Column(Float, default=25000.0)

    risk_probability_pct = Column(Float, default=78.5)
    recommended_remediation_hours = Column(Float, default=60.0)
    estimated_remediation_cost_usd = Column(Float, default=15000.0)
    net_roi_pct = Column(Float, default=1133.3)  # ROI of fixing vs inaction

    forecast_breakdown_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


class ExecutiveIntelligenceBrief(Base):
    """
    Automated decision brief tailored for C-suite (CTO, CEO, CFO, Board).
    """

    __tablename__ = "executive_intelligence_briefs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    repository_id = Column(
        String(36),
        ForeignKey("repositories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    brief_title = Column(String(255), nullable=False)
    target_audience = Column(
        String(50), default="CTO", index=True
    )  # CTO, CEO, CFO, BOARD

    executive_summary = Column(Text, nullable=False)
    revenue_at_risk_summary = Column(Text, nullable=False)
    capabilities_threatened_summary = Column(Text, nullable=False)
    cost_of_inaction_summary = Column(Text, nullable=False)

    strategic_action_recommendations = Column(JSON, default=list)
    key_metrics_snapshot = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.utcnow)
