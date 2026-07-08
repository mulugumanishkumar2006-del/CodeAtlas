from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class File(Base):
    __tablename__ = "files"

    id = Column(String, primary_key=True, index=True)
    repository_id = Column(
        String, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    file_path = Column(String, nullable=False)
    language = Column(String, nullable=False)
    size_bytes = Column(Integer, nullable=False)
    code_lines = Column(Integer, nullable=False)
    comment_lines = Column(Integer, nullable=False)
    blank_lines = Column(Integer, nullable=False)
    total_lines = Column(Integer, nullable=False)

    repository = relationship("Repository", back_populates="files")
    symbols = relationship(
        "Symbol", back_populates="file", cascade="all, delete-orphan"
    )
    imports = relationship(
        "Import", back_populates="file", cascade="all, delete-orphan"
    )
    metrics = relationship(
        "Metric", back_populates="file", uselist=False, cascade="all, delete-orphan"
    )
