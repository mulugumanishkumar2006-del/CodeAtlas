from sqlalchemy import JSON, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Import(Base):
    __tablename__ = "imports"

    id = Column(String, primary_key=True, index=True)
    file_id = Column(String, ForeignKey("files.id", ondelete="CASCADE"), nullable=False)
    module = Column(String, nullable=False)
    names = Column(JSON, nullable=False)  # list of names imported
    line = Column(Integer, nullable=False)

    file = relationship("File", back_populates="imports")
