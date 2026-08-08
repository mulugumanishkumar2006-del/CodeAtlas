# CodeAtlas Production Operational Runbooks

This document contains standardized operational procedures for on-call SREs, Platform Engineers, and DevOps leads managing CodeAtlas in production environments.

---

## Runbook 1: PostgreSQL Database Outage & Recovery

### Severity: CRITICAL (P1)
**Symptoms**: `/health/ready` returns `status: NOT_READY` for Database check. API requests return 500 error codes.

### Diagnostic Steps
1. Inspect database pod/service status:
   ```bash
   docker compose ps postgres
   # or Kubernetes:
   kubectl get pods -l app=postgres -n codeatlas-prod
   ```
2. Inspect recent database logs for connection exhaustion or crash:
   ```bash
   docker compose logs --tail=100 postgres
   ```
3. Test direct psql connectivity from backend:
   ```bash
   docker compose exec backend python -c "from app.core.database import engine; print(engine.connect())"
   ```

### Containment & Recovery
1. **If connection pool exhausted**: Restart backend worker instances to clear hung connections.
2. **If database crashed**:
   - Restart database service: `docker compose restart postgres`
   - Verify filesystem integrity and disk space (`df -h`).
3. **If data corruption occurs**: Trigger Point-In-Time Recovery (PITR) from the latest hourly WAL backup stored in S3/Object Storage.

---

## Runbook 2: Redis Cache Degradation & Memory Pressure

### Severity: HIGH (P2)
**Symptoms**: Elevated API latency on repetitive GET requests, Redis readiness check warning.

### Diagnostic Steps
1. Inspect Redis memory consumption:
   ```bash
   docker compose exec redis redis-cli info memory
   ```
2. Check eviction policy setting:
   ```bash
   docker compose exec redis redis-cli config get maxmemory-policy
   ```

### Containment & Recovery
1. Ensure eviction policy is set to `volatile-lru` or `allkeys-lru`.
2. Flush transient non-essential cache entries safely:
   ```bash
   docker compose exec redis redis-cli memory purge
   ```

---

## Runbook 3: Celery Background Queue Backlog & Worker Autoscale

### Severity: HIGH (P2)
**Symptoms**: Repository analysis or graph generation jobs delayed. Queue depth > 500 tasks.

### Diagnostic Steps
1. Query task queue metrics:
   ```bash
   docker compose exec backend celery -A app.workers inspect active
   ```
2. Inspect queue depth in Redis:
   ```bash
   docker compose exec redis redis-cli llen celery
   ```

### Containment & Recovery
1. Scale background worker count horizontally:
   ```bash
   docker compose scale worker=4
   ```
2. Cancel stalled un-acknowledged tasks if necessary:
   ```bash
   docker compose exec backend celery -A app.workers purge -f
   ```

---

## Runbook 4: LLM Provider Outage & Local Graph Fallback

### Severity: MEDIUM (P3)
**Symptoms**: AI CTO Advisor queries timing out or returning 503 errors.

### Diagnostic Steps
1. Verify OpenAI / LLM provider API status:
   ```bash
   curl -I https://api.openai.com/v1/models
   ```

### Containment & Recovery
1. CodeAtlas automatically falls back to local Knowledge Graph intelligence when LLM providers are unresponsive.
2. Verify local fallback state in `/health/deps`. Core repository analysis, architecture visualization, and dependency graphs remain 100% operational without external LLM availability.

---

## Runbook 5: Emergency Deployment Rollback

### Severity: CRITICAL (P1)
**Symptoms**: Post-deployment smoke test failures or widespread client error rate spikes (> 5%).

### Execution Steps
1. Revert deployment image tag to previous stable git commit SHA in Kubernetes / Docker Compose:
   ```bash
   git checkout tags/v2.4.1
   docker compose up -d --build
   ```
2. Verify database migration compatibility (Ensure expand-migrate-contract schema pattern was used).
3. Execute post-rollback smoke test:
   ```bash
   curl -s http://localhost:8000/api/v1/health/ready
   ```
