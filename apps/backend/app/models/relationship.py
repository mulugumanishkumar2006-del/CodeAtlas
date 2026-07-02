from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    source_id = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    kind = Column(String, nullable=False)
    label = Column(String, nullable=True)
    file_path = Column(String, nullable=True)
    line = Column(Integer, nullable=True)

    repository = relationship("Repository", back_populates="relationships")
