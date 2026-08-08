import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class ControlPlaneDBModel(Base):
    __tablename__ = "cp_control_planes"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, default="ACTIVE")
    active_environments_count = Column(Integer, default=5)
    pending_approvals_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class EnvironmentDBModel(Base):
    __tablename__ = "cp_environments"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # LOCAL, DEVELOPMENT, TEST, STAGING, PRODUCTION, CUSTOM
    provider = Column(String, default="AWS / Kubernetes")
    region = Column(String, default="us-east-1")
    current_version = Column(String, default="v1.2.0")
    risk_level = Column(String, default="LOW")
    allowed_operations = Column(JSON, default=list)
    status = Column(String, default="HEALTHY")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class EnvironmentPolicyDBModel(Base):
    __tablename__ = "cp_environment_policies"

    id = Column(String, primary_key=True, index=True)
    environment_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    required_approvals = Column(Integer, default=1)
    allowed_roles = Column(JSON, default=list)
    maintenance_windows = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class DeploymentDBModel(Base):
    __tablename__ = "cp_deployments"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    target_environment = Column(String, nullable=False)
    target_version = Column(String, nullable=False)
    strategy = Column(String, default="CANARY")
    risk_score = Column(Float, default=24.0)
    policy_result = Column(String, default="ALLOWED")
    status = Column(String, default="COMPLETED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class DeploymentTargetDBModel(Base):
    __tablename__ = "cp_deployment_targets"

    id = Column(String, primary_key=True, index=True)
    deployment_id = Column(String, index=True, nullable=False)
    cluster_name = Column(String, nullable=False)
    namespace = Column(String, default="default")
    replicas = Column(Integer, default=3)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ReleaseCandidateDBModel(Base):
    __tablename__ = "cp_releases"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    version = Column(String, nullable=False)
    commit_hash = Column(String, nullable=False)
    build_status = Column(String, default="SUCCESS")
    security_status = Column(String, default="PASS")
    architecture_status = Column(String, default="PASS")
    release_readiness = Column(String, default="READY")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PipelineDBModel(Base):
    __tablename__ = "cp_pipelines"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    provider = Column(String, default="GitHub Actions")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PipelineRunDBModel(Base):
    __tablename__ = "cp_pipeline_runs"

    id = Column(String, primary_key=True, index=True)
    pipeline_id = Column(String, index=True, nullable=False)
    commit_hash = Column(String, nullable=False)
    status = Column(String, default="SUCCESS")
    duration_seconds = Column(Integer, default=120)
    logs_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OperationQueueDBModel(Base):
    __tablename__ = "cp_op_queue"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    agent_or_user = Column(String, nullable=False)
    action = Column(Text, nullable=False)
    target_environment = Column(String, nullable=False)
    status = Column(String, default="RUNNING")
    queue_position = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ChangeRequestDBModel(Base):
    __tablename__ = "cp_change_requests"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    repository_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    status = Column(String, default="OPEN")
    risk_score = Column(Float, default=15.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditDBModel(Base):
    __tablename__ = "cp_audit_logs"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    actor = Column(String, nullable=False)
    action = Column(String, nullable=False)
    target = Column(String, nullable=False)
    environment = Column(String, nullable=False)
    result = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
