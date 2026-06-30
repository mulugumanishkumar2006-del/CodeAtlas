from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.services.repository import RepositoryService

router = APIRouter()


class RepositoryCreate(BaseModel):
    name: str
    full_name: str
    clone_url: str


class RepositoryResponse(BaseModel):
    id: str
    name: str
    full_name: str
    clone_url: str
    status: str


def get_repository_service() -> RepositoryService:
    return RepositoryService()


@router.post(
    "/repositories",
    response_model=RepositoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_repository(
    payload: RepositoryCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: RepositoryService = Depends(get_repository_service),
):
    repo = service.add_repository(
        db=db,
        name=payload.name,
        full_name=payload.full_name,
        clone_url=payload.clone_url,
        user=user,
    )
    return RepositoryResponse(
        id=repo.id,
        name=repo.name,
        full_name=repo.full_name,
        clone_url=repo.clone_url,
        status=repo.status,
    )


@router.delete("/repositories/{repo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_repository(
    repo_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    service: RepositoryService = Depends(get_repository_service),
):
    service.delete_repository(db=db, repo_id=repo_id, user=user)
    return None
