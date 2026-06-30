from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Setting(Base):
    __tablename__ = "settings"

    id = Column(String, primary_key=True, index=True)
    key = Column(String, nullable=False)
    value = Column(String, nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    user = relationship("User", back_populates="settings")
