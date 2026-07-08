from sqlalchemy import JSON, Column, ForeignKey, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class GraphNode(Base):
    __tablename__ = "graph_nodes"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    properties = Column(JSON, nullable=True)

    repository = relationship("Repository", back_populates="graph_nodes")
