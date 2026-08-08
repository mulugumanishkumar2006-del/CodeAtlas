import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class OrganizationDBModel(Base):
    __tablename__ = "plt_organizations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    subscription_tier = Column(String, default="ENTERPRISE")
    member_count = Column(Integer, default=14)
    repo_limit = Column(Integer, default=50)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class WorkspaceDBModel(Base):
    __tablename__ = "plt_workspaces"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class TeamDBModel(Base):
    __tablename__ = "plt_teams"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    lead_email = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class TenantUserDBModel(Base):
    __tablename__ = "plt_users"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, default="ADMIN")
    auth_token = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class UserSessionDBModel(Base):
    __tablename__ = "plt_user_sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    session_token = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class JobTaskDBModel(Base):
    __tablename__ = "plt_jobs"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, nullable=False)
    task_type = Column(String, nullable=False)
    status = Column(String, default="QUEUED")  # QUEUED, RUNNING, PARSING, INDEXING, GRAPH_BUILDING, ANALYZING, COMPLETED, FAILED
    progress = Column(Float, default=0.0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class WebhookEventDBModel(Base):
    __tablename__ = "plt_webhooks"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    event_type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    status = Column(String, default="PROCESSED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditLogDBModel(Base):
    __tablename__ = "plt_audit"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    user_id = Column(String, nullable=False)
    action = Column(Text, nullable=False)
    target_resource = Column(String, nullable=False)
    ip_address = Column(String, default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class QuotaUsageDBModel(Base):
    __tablename__ = "plt_quotas"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    monthly_ai_cost_usd = Column(Float, default=14.50)
    monthly_ai_cost_cap_usd = Column(Float, default=500.00)
    token_count = Column(Integer, default=1450000)
    repository_count = Column(Integer, default=6)
    analysis_count = Column(Integer, default=42)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AICostUsageDBModel(Base):
    __tablename__ = "plt_ai_cost_logs"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    model_name = Column(String, nullable=False)
    tokens_used = Column(Integer, default=1500)
    estimated_cost_usd = Column(Float, default=0.015)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
