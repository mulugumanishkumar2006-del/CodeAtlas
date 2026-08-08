import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON, Integer
from app.core.database import Base


class FeatureStoreEntryDBModel(Base):
    __tablename__ = "pcloud_feature_store"

    id = Column(String, primary_key=True, index=True)
    entity_id = Column(String, index=True, nullable=False)
    feature_name = Column(String, nullable=False)
    feature_value = Column(Float, nullable=False)
    trend_window = Column(String, default="30d")  # 7d, 30d, 90d
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


class PredictiveModelRegistryDBModel(Base):
    __tablename__ = "pcloud_model_registry"

    id = Column(String, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    version = Column(String, default="v1.0.0")
    category = Column(String, nullable=False)  # FAILURE, INCIDENT, DEPLOYMENT, CAPACITY, COST, SECURITY
    accuracy_score = Column(Float, default=0.94)
    calibration_score = Column(Float, default=0.96)
    status = Column(String, default="CHAMPION")  # CHAMPION, CHALLENGER, SHADOW
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


class PredictionRecordDBModel(Base):
    __tablename__ = "pcloud_records"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    prediction_type = Column(String, nullable=False)
    target_entity = Column(String, nullable=False)
    probability = Column(Float, nullable=False)
    confidence = Column(String, default="HIGH")  # HIGH, MEDIUM, LOW, INSUFFICIENT_DATA
    time_horizon = Column(String, default="7d")
    evidence_citations = Column(JSON, nullable=False, default=list)
    recommended_action = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class RiskRegisterItemDBModel(Base):
    __tablename__ = "pcloud_risk_register"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    risk_title = Column(String, nullable=False)
    category = Column(String, default="RELIABILITY")
    probability = Column(Float, default=0.35)
    potential_impact = Column(String, default="HIGH")
    confidence = Column(String, default="HIGH")
    owner_team = Column(String, nullable=False)
    prevention_plan = Column(Text, nullable=False)
    status = Column(String, default="OPEN")  # OPEN, MITIGATED, ACCEPTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class WhatIfScenarioDBModel(Base):
    __tablename__ = "pcloud_scenarios"

    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, index=True, nullable=False)
    scenario_title = Column(String, nullable=False)
    baseline_risk_score = Column(Float, default=14.5)
    simulated_risk_score = Column(Float, default=28.0)
    confidence = Column(String, default="HIGH")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PredictionOutcomeFeedbackDBModel(Base):
    __tablename__ = "pcloud_feedback"

    id = Column(String, primary_key=True, index=True)
    prediction_id = Column(String, index=True, nullable=False)
    user_feedback = Column(String, nullable=False)  # CORRECT, INCORRECT, PARTIAL
    actual_outcome_occurred = Column(Boolean, default=False)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)


class ModelDriftMetricDBModel(Base):
    __tablename__ = "pcloud_model_drift"

    id = Column(String, primary_key=True, index=True)
    model_id = Column(String, index=True, nullable=False)
    drift_score = Column(Float, default=0.02)
    data_quality_score = Column(Float, default=99.2)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
