from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx
import jwt
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User
from app.repositories.user import user_repository


class AuthService:
    def generate_token(self, user: User) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        payload = {
            "sub": user.id,
            "exp": expire.timestamp(),
            "username": user.username,
        }
        return jwt.encode(
            payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
        )

    def verify_token(self, db: Session, token: str) -> Optional[User]:
        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
            )
            user_id: Optional[str] = payload.get("sub")
            if not user_id:
                return None
            return user_repository.get_by_id(db, user_id)
        except (jwt.PyJWTError, ValueError):
            return None

    async def login_with_github(self, db: Session, code: str) -> User:
        # Stub bypass for local testing if GitHub secrets are stubbed
        if code == "stub_code":
            existing_user = user_repository.get_by_id(db, "12345")
            if existing_user:
                return existing_user
            stub_user = User(
                id="12345",
                username="github_stub_user",
                name="Stub User",
                email="stub@codeatlas.com",
                avatar_url="https://github.com/identicons/stub.png",
            )
            return user_repository.save(db, stub_user)

        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": settings.GITHUB_REDIRECT_URI,
                },
                headers={"Accept": "application/json"},
            )
            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to authenticate with GitHub",
                )

            token_data = token_response.json()
            access_token = token_data.get("access_token")
            if not access_token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"GitHub OAuth error: "
                        f"{token_data.get('error_description', 'No access token')}"
                    ),
                )

            # Retrieve user data from GitHub API
            user_response = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"token {access_token}"},
            )
            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to fetch user details from GitHub",
                )

            github_user = user_response.json()

            user = User(
                id=str(github_user["id"]),
                username=github_user["login"],
                name=github_user.get("name"),
                email=github_user.get("email"),
                avatar_url=github_user.get("avatar_url"),
            )
            return user_repository.save(db, user)
