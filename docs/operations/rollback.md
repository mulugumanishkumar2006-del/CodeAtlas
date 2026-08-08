# CodeAtlas v1.2 — Production Rollback Standard Operating Procedure

## Overview

This procedure details the exact commands required to execute an emergency production rollback to **v1.1** or previous release candidate if critical issues are detected during the canary or post-launch window.

---

## 1. Fast Application & Celery Worker Rollback

To immediately revert backend containers and celery background workers to the previous verified release tag (`v1.1.0`):

```bash
# 1. Update deployment image tag in docker-compose.yml or environment
export CODEATLAS_IMAGE_TAG=v1.1.0

# 2. Perform rolling container update
docker compose -f docker-compose.yml up -d --no-deps backend workers

# 3. Verify container health
docker compose ps
curl -f http://localhost:8000/api/v1/release/health/readiness
```

---

## 2. Reversible Database Schema Migration Rollback

If database migration `v1.2_migration` needs to be reverted safely:

```bash
# 1. Inspect current migration head
docker compose exec backend alembic current

# 2. Revert 1 migration step backwards
docker compose exec backend alembic downgrade -1

# 3. Verify schema state
docker compose exec backend alembic heads
```

---

## 3. Frontend Static Web App Rollback

```bash
# Revert Vercel / Nginx web deployment to previous commit SHA
git checkout tags/v1.1.0 -b hotfix-rollback
npm run build
docker compose restart web
```

---

## 4. Cache Purge & Session Reset

Purge transient Redis cache keys to prevent stale schema deserialization errors:

```bash
docker compose exec redis redis-cli FLUSHDB
```

---

## 5. Post-Rollback Verification Checklist

- [ ] Liveness probe returns HTTP 200 `UP`.
- [ ] Readiness probe returns `checks.database: HEALTHY`.
- [ ] Celery workers consuming tasks from queue.
- [ ] Web frontend rendering dashboard without Javascript exceptions.
