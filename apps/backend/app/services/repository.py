import os
import shutil
import uuid
from typing import List

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.job import Job
from app.models.repository import Repository
from app.models.user import User
from app.repositories.job import job_repository
from app.repositories.repository import repository_repository
from app.workers.tasks import clone_repository_task


class RepositoryService:
    def add_repository(
        self, db: Session, name: str, full_name: str, clone_url: str, user: User
    ) -> Repository:
        repo_id = str(uuid.uuid4())
        repo = Repository(
            id=repo_id,
            name=name,
            full_name=full_name,
            clone_url=clone_url,
            status="pending",
            user_id=user.id,
        )
        repository_repository.save(db, repo)

        # Create background Job entry
        job_id = str(uuid.uuid4())
        job = Job(
            id=job_id,
            name=f"Clone repository: {full_name}",
            status="pending",
            repository_id=repo_id,
        )
        job_repository.save(db, job)

        # Trigger async Celery task
        clone_repository_task.delay(repo_id, job_id)

        return repo

    def delete_repository(self, db: Session, repo_id: str, user: User) -> None:
        repo = repository_repository.get_by_id(db, repo_id)
        if not repo or repo.user_id != user.id:
            from fastapi import HTTPException

            raise HTTPException(status_code=404, detail="Repository not found")

        # Delete database entry
        repository_repository.delete(db, repo)

        # Clean files on disk
        target_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir, ignore_errors=True)

    def get_repositories_by_user(self, db: Session, user: User) -> List[Repository]:
        return repository_repository.get_by_user_id(db, user.id)
