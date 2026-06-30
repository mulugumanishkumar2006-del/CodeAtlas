from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # GitHub ID
    username = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)

    repositories = relationship(
        "Repository", back_populates="owner", cascade="all, delete-orphan"
    )
    settings = relationship(
        "Setting", back_populates="user", cascade="all, delete-orphan"
    )
    activities = relationship(
        "Activity", back_populates="user", cascade="all, delete-orphan"
    )
