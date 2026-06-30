from typing import Optional

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: str
    username: str
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    name: Optional[str] = None
