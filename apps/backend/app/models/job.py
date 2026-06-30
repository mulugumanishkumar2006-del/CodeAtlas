from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(
        String, default="pending", nullable=False
    )  # pending, running, completed, failed
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    logs = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True), nullable=True)

    repository = relationship("Repository", back_populates="jobs")
