# CodeAtlas Operational Runbooks Catalog

This catalog contains 10 standardized operational runbooks for SREs and on-call engineers.

---

## Catalog Index

1. [RUNBOOK_API_DOWN](#1-runbook_api_down)
2. [RUNBOOK_DATABASE_DOWN](#2-runbook_database_down)
3. [RUNBOOK_REDIS_DOWN](#3-runbook_redis_down)
4. [RUNBOOK_QUEUE_BACKLOG](#4-runbook_queue_backlog)
5. [RUNBOOK_WORKER_FAILURE](#5-runbook_worker_failure)
6. [RUNBOOK_AI_OUTAGE](#6-runbook_ai_outage)
7. [RUNBOOK_DEPLOYMENT_FAILURE](#7-runbook_deployment_failure)
8. [RUNBOOK_MIGRATION_FAILURE](#8-runbook_migration_failure)
9. [RUNBOOK_HIGH_LATENCY](#9-runbook_high_latency)
10. [RUNBOOK_SECURITY_INCIDENT](#10-runbook_security_incident)

---

### 1. RUNBOOK_API_DOWN
- **Symptoms**: FastAPI backend unreachable; 502/504 errors on `https://api.codeatlas.io`.
- **Diagnosis**: Check process health: `docker compose ps backend` or Render instance status.
- **Immediate Action**: Restart API server container: `docker compose restart backend`.
- **Recovery**: Verify `/api/v1/health/live` returns 200 OK.

---

### 2. RUNBOOK_DATABASE_DOWN
- **Symptoms**: `/health/ready` returns `NOT_READY` for database check.
- **Diagnosis**: Query PostgreSQL log output and active connection count.
- **Immediate Action**: Restart DB instance; if connection exhaustion occurs, clear hung worker pool connections.
- **Recovery**: Execute `SELECT 1` ping test in psql.

---

### 3. RUNBOOK_REDIS_DOWN
- **Symptoms**: Session cache timing out, task queue broker connection errors.
- **Diagnosis**: Check Redis container: `docker compose exec redis redis-cli ping`.
- **Immediate Action**: Restart Redis: `docker compose restart redis`. Ensure maxmemory policy is `volatile-lru`.

---

### 4. RUNBOOK_QUEUE_BACKLOG
- **Symptoms**: Task queue length > 500; delayed repository ingestion.
- **Diagnosis**: Query Celery backlog depth: `redis-cli llen celery`.
- **Immediate Action**: Autoscale Celery worker count: `docker compose scale worker=4`.

---

### 5. RUNBOOK_WORKER_FAILURE
- **Symptoms**: Celery background jobs stalling in `RUNNING` or `QUEUED` state.
- **Diagnosis**: Inspect worker logs: `docker compose logs worker`.
- **Immediate Action**: Restart Celery worker service: `docker compose restart worker`.

---

### 6. RUNBOOK_AI_OUTAGE
- **Symptoms**: AI CTO Advisor queries failing or timing out (>30s).
- **Diagnosis**: Check OpenAI status page and inspect `/health/deps`.
- **Immediate Action**: CodeAtlas automatically falls back to local Knowledge Graph intelligence. Core repository analysis remains 100% operational.

---

### 7. RUNBOOK_DEPLOYMENT_FAILURE
- **Symptoms**: Staging or production deployment fails post-deployment smoke test.
- **Immediate Action**: Execute emergency rollback to previous stable commit tag.

---

### 8. RUNBOOK_MIGRATION_FAILURE
- **Symptoms**: `alembic upgrade head` throws schema lock or syntax error.
- **Immediate Action**: Roll back database schema to previous migration revision: `alembic downgrade -1`.

---

### 9. RUNBOOK_HIGH_LATENCY
- **Symptoms**: API latency > 2,000ms on complex graph queries.
- **Immediate Action**: Enable Redis query caching for repetitive graph traversals and restrict max graph node expansion limit.

---

### 10. RUNBOOK_SECURITY_INCIDENT
- **Symptoms**: Suspicious authentication anomaly or rate limit violation spike.
- **Immediate Action**: Revoke compromised OAuth/JWT secrets immediately and rotate `SECRET_KEY` in environment config.
