from sqlalchemy import Column, ForeignKey, Integer, Float, String, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class RepositoryStatistics(Base):
    __tablename__ = "repository_statistics"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    total_files = Column(Integer, default=0, nullable=False)
    total_lines = Column(Integer, default=0, nullable=False)
    total_code_lines = Column(Integer, default=0, nullable=False)
    total_comment_lines = Column(Integer, default=0, nullable=False)
    total_blank_lines = Column(Integer, default=0, nullable=False)
    total_size_bytes = Column(Integer, default=0, nullable=False)
    total_complexity = Column(Integer, default=0, nullable=False)
    average_complexity = Column(Float, default=0.0, nullable=False)
    documentation_coverage = Column(Float, default=0.0, nullable=False)
    languages = Column(JSON, nullable=True)  # e.g., {"Python": 12}

    repository = relationship("Repository", back_populates="statistics")
