import os
import shutil
import subprocess
from datetime import datetime, timezone

from app.core.celery_app import celery_app
from app.core.config import settings
from app.core.database import SessionLocal
from app.repositories.job import job_repository
from app.repositories.repository import repository_repository


@celery_app.task(name="app.workers.tasks.clone_repository_task")
def clone_repository_task(repo_id: str, job_id: str) -> bool:
    db = SessionLocal()
    try:
        repo = repository_repository.get_by_id(db, repo_id)
        job = job_repository.get_by_id(db, job_id)
        if not repo or not job:
            return False

        # Update status
        repo.status = "cloning"
        job.status = "running"
        repository_repository.save(db, repo)
        job_repository.save(db, job)

        # Setup destination directory
        target_dir = os.path.join(settings.CLONED_REPOS_DIR, repo.id)
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
        os.makedirs(settings.CLONED_REPOS_DIR, exist_ok=True)

        # Execute git clone
        logs = f"Starting git clone for {repo.clone_url}\n"
        process = subprocess.Popen(
            ["git", "clone", repo.clone_url, target_dir],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )

        stdout_content, _ = process.communicate()
        logs += stdout_content
        job.logs = logs

        if process.returncode == 0:
            repo.status = "cloned"
            job.status = "completed"
        else:
            repo.status = "failed"
            job.status = "failed"
            logs += f"\nError: Git clone failed with exit code {process.returncode}"
            job.logs = logs

        job.finished_at = datetime.now(timezone.utc)
        repository_repository.save(db, repo)
        job_repository.save(db, job)
        return process.returncode == 0
    except Exception as e:
        try:
            job = job_repository.get_by_id(db, job_id)
            if job:
                job.status = "failed"
                job.logs = f"Unexpected Exception: {str(e)}"
                job.finished_at = datetime.now(timezone.utc)
                job_repository.save(db, job)
            repo = repository_repository.get_by_id(db, repo_id)
            if repo:
                repo.status = "failed"
                repository_repository.save(db, repo)
        except Exception:
            pass
        return False
    finally:
        db.close()
