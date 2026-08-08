import datetime
from sqlalchemy import Column, String, Text, DateTime, Float, Boolean, JSON
from app.core.database import Base


class PredictionRecordDBModel(Base):
    __tablename__ = "pred_records"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(String, index=True, nullable=False)
    tenant_id = Column(String, index=True, nullable=False, default="default")
    target_entity = Column(String, nullable=False)
    prediction_type = Column(String, nullable=False)
    current_health_score = Column(Float, default=85.0)
    predicted_risk_score = Column(Float, default=35.0)
    confidence = Column(String, default="HIGH")
    priority = Column(String, default="HIGH_PRIORITY")
    time_window = Column(String, default="30_DAYS")
    signals = Column(JSON, nullable=False, default=list)
    evidence = Column(JSON, nullable=False, default=list)
    explainability_reason = Column(Text, nullable=False)
    recommended_investigation = Column(Text, nullable=False)
    model_version = Column(String, default="v1.3.0-det-baseline")
    feature_version = Column(String, default="v1.3.0-feats")
    status = Column(String, default="ACTIVE")
    outcome = Column(String, default="UNKNOWN")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class PredictionFeedbackDBModel(Base):
    __tablename__ = "pred_feedback"

    id = Column(String, primary_key=True, index=True)
    prediction_id = Column(String, index=True, nullable=False)
    user_id = Column(String, default="dev_user")
    feedback_type = Column(String, nullable=False)
    comment = Column(Text, nullable=True)
    is_confirmed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class OutcomeTrackingDBModel(Base):
    __tablename__ = "pred_outcomes"

    id = Column(String, primary_key=True, index=True)
    prediction_id = Column(String, index=True, nullable=False)
    actual_outcome = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    evaluated_at = Column(DateTime, default=datetime.datetime.utcnow)
