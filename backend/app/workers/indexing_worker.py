import asyncio
import logging
from backend.app.services.repository_ingestion_service import ingestion_service

logger = logging.getLogger("codeatlas.worker")


async def run_indexing_task(repository_id: str):
    """
    Background worker task to execute repository ingestion and indexing.
    """
    logger.info(f"Worker started indexing job for repository {repository_id}")
    try:
        result = await ingestion_service.ingest_repository(repository_id)
        logger.info(f"Worker completed indexing job for repository {repository_id} with status {result.get('status')}")
    except Exception as e:
        logger.error(f"Worker encountered unexpected error indexing repository {repository_id}: {e}", exc_info=True)


def schedule_indexing_job(repository_id: str):
    """
    Schedules an indexing job asynchronously in the background event loop.
    """
    loop = asyncio.get_event_loop()
    loop.create_task(run_indexing_task(repository_id))
