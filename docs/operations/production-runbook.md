# CodeAtlas v1.2 — Production Operational Runbook

## Overview

This production runbook provides operational instructions for deploying, managing, monitoring, backing up, restoring, and rolling back **CodeAtlas v1.2.0-rc1** in staging and production environments.

---

## System Services & Port Architecture

| Component | Service Name | Default Port | Health Check Probe |
| :--- | :--- | :--- | :--- |
| API Server | `codeatlas-backend` | 8000 | `/api/v1/release/health/liveness` |
| Database | PostgreSQL 16 | 5432 | `pg_isready -h localhost -p 5432` |
| Cache & Broker | Redis 7 | 6379 | `redis-cli ping` |
| Background Worker | Celery Worker | N/A | `celery -A app.workers inspect ping` |
| Web Frontend | Next.js Frontend | 3000 | `/` |

---

## 1. Environment Configuration Setup

Ensure environment variables are loaded securely without hardcoding credentials:

```bash
DATABASE_URL=postgresql://codeatlas_user:${DB_PASSWORD}@postgres:5432/codeatlas
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0
SECRET_KEY=${JWT_SECRET_KEY}
GEMINI_API_KEY=${GEMINI_API_KEY}
ENVIRONMENT=production
LOG_LEVEL=INFO
```

---

## 2. Deployment Procedures

### Staging & Production Deployment via Docker Compose

```bash
# 1. Pull latest verified release candidate image
docker compose -f docker-compose.yml pull

# 2. Execute database schema migrations safely
docker compose -f docker-compose.yml run --rm backend alembic upgrade head

# 3. Perform rolling service update
docker compose -f docker-compose.yml up -d --remove-orphans

# 4. Verify readiness probe
curl -f http://localhost:8000/api/v1/release/health/readiness
```

---

## 3. Database Migration & Rollback Procedures

### Executing Migrations
```bash
alembic upgrade head
```

### Rolling Back Database Migration (One Step)
```bash
alembic downgrade -1
```

---

## 4. Backup & Disaster Recovery Procedures (RPO < 5 min, RTO < 15 min)

### Automated PostgreSQL Database Backup
```bash
pg_dump -h localhost -U codeatlas_user -d codeatlas -F c -b -v -f "/backups/codeatlas_$(date +%Y%m%d_%H%M%S).dump"
```

### Verified Restoration Procedure
```bash
# 1. Terminate existing database connections
pg_restore -h localhost -U codeatlas_user -d codeatlas --clean --if-exists /backups/codeatlas_latest.dump
```

---

## 5. Automated E2E Smoke Testing

Run the release candidate smoke test to verify all 14 journey steps:

```bash
curl -X POST http://localhost:8000/api/v1/release/smoke-test?repository_id=demo-repo
```

Expected Output: `overall_status: "PASSED"` across all 14 steps.
