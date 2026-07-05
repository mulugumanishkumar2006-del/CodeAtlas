from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Repository(Base):
    __tablename__ = "repositories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    clone_url = Column(String, nullable=False)
    status = Column(
        String, default="pending", nullable=False
    )  # pending, cloning, cloned, failed
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    summary = Column(String, nullable=True)
    graph_version = Column(String, default="1.0.0", nullable=False)

    owner = relationship("User", back_populates="repositories")
    jobs = relationship(
        "Job", back_populates="repository", cascade="all, delete-orphan"
    )
    files = relationship(
        "File", back_populates="repository", cascade="all, delete-orphan"
    )
    relationships = relationship(
        "Relationship", back_populates="repository", cascade="all, delete-orphan"
    )
    statistics = relationship(
        "RepositoryStatistics", back_populates="repository", uselist=False, cascade="all, delete-orphan"
    )
    graph_nodes = relationship(
        "GraphNode", back_populates="repository", cascade="all, delete-orphan"
    )
    graph_relationships = relationship(
        "GraphRelationship", back_populates="repository", cascade="all, delete-orphan"
    )

