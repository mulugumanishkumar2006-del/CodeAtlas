from sqlalchemy import Column, DateTime, ForeignKey, String, Float
from sqlalchemy.sql import func
from app.core.database import Base

class RepositoryMemory(Base):
    __tablename__ = "repository_memories"

    id = Column(String, primary_key=True, index=True)
    repo_id = Column(String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    memory_type = Column(String, nullable=False)
    source = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ArchitectureDecision(Base):
    __tablename__ = "architecture_decisions"

    id = Column(String, primary_key=True, index=True)
    repo_id = Column(String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    alternatives = Column(String, nullable=False)
    impact = Column(String, nullable=False)
    related_entities = Column(String, nullable=False)

class MemorySnapshot(Base):
    __tablename__ = "memory_snapshots"

    id = Column(String, primary_key=True, index=True)
    repo_id = Column(String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)
    version = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
