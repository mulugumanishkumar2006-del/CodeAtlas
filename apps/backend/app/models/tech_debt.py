from sqlalchemy import Column, DateTime, ForeignKey, String, Float, Integer
from sqlalchemy.sql import func

from app.core.database import Base

class TechnicalDebtReport(Base):
    __tablename__ = "technical_debt_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    module = Column(String, nullable=False)
    debt_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class HealthScore(Base):
    __tablename__ = "health_scores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    architecture = Column(Float, nullable=False)
    maintainability = Column(Float, nullable=False)
    testing = Column(Float, nullable=False)
    documentation = Column(Float, nullable=False)
    performance = Column(Float, nullable=False)
    overall = Column(Float, nullable=False)

class RiskForecast(Base):
    __tablename__ = "risk_forecasts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    repo_id = Column(String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    prediction_date = Column(DateTime(timezone=True), nullable=False)
    predicted_debt = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
