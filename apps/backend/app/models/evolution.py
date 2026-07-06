from sqlalchemy import Column, DateTime, ForeignKey, Integer, Float, String, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class CommitSnapshot(Base):
    __tablename__ = "commit_snapshots"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    commit_sha = Column(String, nullable=False, index=True)
    author_name = Column(String, nullable=True)
    author_email = Column(String, nullable=True)
    committed_at = Column(DateTime(timezone=True), nullable=False)
    message = Column(String, nullable=True)

    total_files = Column(Integer, default=0, nullable=False)
    total_lines = Column(Integer, default=0, nullable=False)
    code_lines = Column(Integer, default=0, nullable=False)
    comment_lines = Column(Integer, default=0, nullable=False)
    complexity_total = Column(Integer, default=0, nullable=False)
    complexity_average = Column(Float, default=0.0, nullable=False)
    complexity_max = Column(Integer, default=0, nullable=False)
    documentation_coverage = Column(Float, default=0.0, nullable=False)
    dependencies_count = Column(Integer, default=0, nullable=False)
    languages = Column(JSON, nullable=True)
    health_score = Column(Float, default=100.0, nullable=False)
    architecture_patterns = Column(JSON, nullable=True)
    graph_data = Column(JSON, nullable=True)
    average_function_size = Column(Float, default=0.0, nullable=False)
    cohesion_score = Column(Float, default=1.0, nullable=False)
    maintainability_index = Column(Float, default=100.0, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    repository = relationship("Repository")
    components = relationship(
        "ComponentSnapshot",
        back_populates="commit_snapshot",
        cascade="all, delete-orphan",
    )


class ComponentSnapshot(Base):
    __tablename__ = "component_snapshots"

    id = Column(String, primary_key=True, index=True)
    commit_snapshot_id = Column(
        String, ForeignKey("commit_snapshots.id", ondelete="CASCADE"), nullable=False
    )
    path = Column(String, nullable=False, index=True)  # path/to/file, folder/path, or domain name
    type = Column(String, nullable=False)  # "file", "folder", "domain"
    name = Column(String, nullable=False)

    complexity_total = Column(Integer, default=0, nullable=False)
    complexity_average = Column(Float, default=0.0, nullable=False)
    complexity_max = Column(Integer, default=0, nullable=False)
    code_lines = Column(Integer, default=0, nullable=False)
    comment_lines = Column(Integer, default=0, nullable=False)
    dependencies_count = Column(Integer, default=0, nullable=False)
    dependents_count = Column(Integer, default=0, nullable=False)
    coupling_score = Column(Float, default=0.0, nullable=False)
    technical_debt_score = Column(Float, default=0.0, nullable=False)

    commit_snapshot = relationship("CommitSnapshot", back_populates="components")
