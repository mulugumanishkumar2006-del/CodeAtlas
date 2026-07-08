from sqlalchemy import JSON, Column, ForeignKey, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class GraphRelationship(Base):
    __tablename__ = "graph_relationships"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    source_id = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    type = Column(String, nullable=False)
    properties = Column(JSON, nullable=True)

    repository = relationship("Repository", back_populates="graph_relationships")
