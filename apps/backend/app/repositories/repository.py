from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.repository import Repository


class RepositoryRepository:
    def get_by_id(self, db: Session, repo_id: str) -> Optional[Repository]:
        return db.query(Repository).filter(Repository.id == repo_id).first()

    def get_by_user_id(self, db: Session, user_id: str) -> List[Repository]:
        return db.query(Repository).filter(Repository.user_id == user_id).all()

    def save(self, db: Session, repo: Repository) -> Repository:
        db.add(repo)
        db.commit()
        db.refresh(repo)
        return repo

    def delete(self, db: Session, repo: Repository) -> None:
        db.delete(repo)
        db.commit()


repository_repository = RepositoryRepository()
