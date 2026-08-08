# CodeAtlas v1.2 — Production Incident Response Playbooks

## Overview

This document contains step-by-step incident response playbooks for common production operational alerts in **CodeAtlas v1.2.0-rc1**.

---

## Playbook 1: PostgreSQL Database Unavailable

### Symptoms
- Health readiness probe returns `checks.database: UNHEALTHY`.
- API endpoints return 500 error `DATABASE_ERROR`.

### Response Steps
1. **Verify Connection**:
   ```bash
   pg_isready -h postgres -p 5432
   ```
2. **Check Container Status**:
   ```bash
   docker compose ps postgres
   docker compose logs --tail=100 postgres
   ```
3. **Restart Database Container**:
   ```bash
   docker compose restart postgres
   ```
4. **Trigger Restoration if Data Corrupted**:
   Follow restoration procedure in [production-runbook.md](file:///c:/Users/mulug/OneDrive/ドキュメント/Desktop/CodeAtlas/docs/operations/production-runbook.md).

---

## Playbook 2: AI Provider Timeout or Outage

### Symptoms
- API queries log `AI_ERROR` or provider connection timeouts.

### Automatic Fallback Verification
- CodeAtlas v1.2 automatically falls back to deterministic graph, impact, and evidence packs with `ai_explanation_available: False`.

### Response Steps
1. Check external Gemini/OpenAI API status dashboards.
2. Verify API key environment configuration:
   ```bash
   echo $GEMINI_API_KEY
   ```
3. Switch provider mode to `MockProvider` or fallback mode if outage persists:
   ```bash
   export DEFAULT_AI_PROVIDER=mock
   docker compose restart backend
   ```

---

## Playbook 3: Redis Cache or Task Queue Down

### Symptoms
- Celery worker tasks fail to receive jobs or lag behind.
- Rate limiting or session caching throws connection errors.

### Response Steps
1. Inspect Redis status:
   ```bash
   docker compose exec redis redis-cli ping
   ```
2. Inspect Celery queue depth:
   ```bash
   docker compose exec backend celery -A app.workers inspect active
   ```
3. Restart Redis & Worker pool cleanly:
   ```bash
   docker compose restart redis workers
   ```

---

## Playbook 4: High Memory / High CPU Alert

### Symptoms
- API response latency exceeds performance budget (>1,000ms).
- Host memory utilization > 90%.

### Response Steps
1. Identify high-consumption process:
   ```bash
   docker stats --no-stream
   ```
2. Trigger cache purge and lazy memory reclamation:
   ```bash
   docker compose exec backend python -c "from app.core.database import engine; engine.dispose()"
   ```
3. Scale worker concurrency replicas if queue depth is accumulating.

---

## Playbook 5: Security Incident & Secret Leak Protocol

### Symptoms
- Secret scanner flags legacy token or credential in repository text.

### Response Steps
1. Execute secret scanner audit endpoint:
   ```bash
   curl -X POST http://localhost:8000/api/v1/release/secret-scan?repository_id=target_repo
   ```
2. Immediately revoke the identified secret key upstream in cloud provider.
3. Verify that production hardening middleware masked secret from output logs.
