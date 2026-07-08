from sqlalchemy import JSON, Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(String, primary_key=True, index=True)
    file_id = Column(String, ForeignKey("files.id", ondelete="CASCADE"), nullable=False)
    complexity_total = Column(Integer, default=0, nullable=False)
    complexity_average = Column(Float, default=0.0, nullable=False)
    complexity_max = Column(Integer, default=0, nullable=False)
    complexity_max_function = Column(String, nullable=True)
    complexity_per_function = Column(JSON, nullable=True)
    documentation_symbols = Column(Integer, default=0, nullable=False)
    total_documentable = Column(Integer, default=0, nullable=False)
    coverage_percent = Column(Float, default=0.0, nullable=False)

    file = relationship("File", back_populates="metrics")
