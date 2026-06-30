from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserResponse
from app.services.auth import AuthService

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token-stub", auto_error=False
)


def get_auth_service() -> AuthService:
    return AuthService()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service),
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = auth_service.verify_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or user session expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@router.get("/auth/login/github")
def github_login_redirect():
    github_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&redirect_uri={settings.GITHUB_REDIRECT_URI}"
        f"&scope=user:email"
    )
    return RedirectResponse(url=github_url)


@router.post("/auth/github/callback", response_model=Token)
async def github_callback(
    payload: dict,
    auth_service: AuthService = Depends(get_auth_service),
):
    code = payload.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code is missing")

    user = await auth_service.login_with_github(code)
    token_str = auth_service.generate_token(user)
    return Token(access_token=token_str, token_type="bearer")


@router.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
