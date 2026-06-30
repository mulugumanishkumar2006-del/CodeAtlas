from typing import Optional

from sqlalchemy.orm import Session

from app.models.job import Job


class JobRepository:
    def get_by_id(self, db: Session, job_id: str) -> Optional[Job]:
        return db.query(Job).filter(Job.id == job_id).first()

    def save(self, db: Session, job: Job) -> Job:
        db.add(job)
        db.commit()
        db.refresh(job)
        return job


job_repository = JobRepository()
