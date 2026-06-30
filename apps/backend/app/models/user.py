from typing import Optional

from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: str  # GitHub ID
    username: str
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    name: Optional[str] = None
