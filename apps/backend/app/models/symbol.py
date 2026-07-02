from sqlalchemy import Column, ForeignKey, Integer, String, Text, Boolean, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Symbol(Base):
    __tablename__ = "symbols"

    id = Column(String, primary_key=True, index=True)
    file_id = Column(
        String, ForeignKey("files.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String, nullable=False)
    kind = Column(String, nullable=False)
    start_line = Column(Integer, nullable=False)
    start_column = Column(Integer, nullable=False)
    end_line = Column(Integer, nullable=False)
    end_column = Column(Integer, nullable=False)
    parent_name = Column(String, nullable=True)
    docstring = Column(Text, nullable=True)
    parameters = Column(JSON, nullable=True)
    return_type = Column(String, nullable=True)
    decorators = Column(JSON, nullable=True)
    bases = Column(JSON, nullable=True)
    is_async = Column(Boolean, default=False, nullable=False)
    is_exported = Column(Boolean, default=False, nullable=False)
    text = Column(Text, nullable=True)

    file = relationship("File", back_populates="symbols")
