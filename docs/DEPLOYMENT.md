# CodeAtlas Real Cloud Deployment & Operability Guide

This document provides step-by-step production deployment instructions for running CodeAtlas as a real, scalable, production-grade cloud SaaS platform.

---

## 1. Target Cloud Production Architecture

```
User (Browser)
   ↓ (HTTPS / TLS)
Cloudflare CDN / DNS (Domain: codeatlas.io)
   ├───────────────────────────────┐
   ▼                               ▼
Next.js Frontend                FastAPI API Backend
Target: Vercel / Cloud Run      Target: Render / Cloud Run / ECS
(https://app.codeatlas.io)      (https://api.codeatlas.io)
                                   │
   ┌───────────────────────┬───────┴───────────────┬───────────────────────┐
   ▼                       ▼                       ▼                       ▼
Managed PostgreSQL 15   Managed Redis 7 Cache   Celery Worker Pool      Neo4j 5 Graph Database
Target: AWS RDS /       Target: Upstash /       Target: Render Worker /  Target: Neo4j AuraDB /
Supabase / Render DB    ElastiCache             Cloud Run Job            Docker Container
```

---

## 2. Component Deployment Instructions

### A. Managed PostgreSQL Database Setup
1. Provision a PostgreSQL 15 instance (e.g. AWS RDS PostgreSQL, Supabase, or Render PostgreSQL).
2. Configure connection URL in secret management:
   `DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/codeatlas_prod`
3. Execute database schema migrations:
   ```bash
   cd apps/backend
   alembic upgrade head
   ```

### B. Managed Redis 7 & Task Queue Setup
1. Provision a Redis 7 instance (e.g. Upstash Redis or AWS ElastiCache).
2. Configure Redis connection URLs:
   ```bash
   REDIS_URL=redis://:password@prod-redis.example.com:6379/0
   CELERY_BROKER_URL=redis://:password@prod-redis.example.com:6379/1
   CELERY_RESULT_BACKEND=redis://:password@prod-redis.example.com:6379/2
   ```

### C. FastAPI Backend API Deployment (Render / Cloud Run)
1. Build backend container using [Dockerfile.backend](file:///c:/Users/mulug/OneDrive/ドキュメント/Desktop/CodeAtlas/Dockerfile.backend).
2. Environment variables to inject:
   - `ENVIRONMENT=production`
   - `SECRET_KEY=<32-char-random-secret>`
   - `DATABASE_URL=<managed-postgres-url>`
   - `REDIS_URL=<managed-redis-url>`
   - `CORS_ORIGINS=["https://app.codeatlas.io"]`
3. Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4`
4. Custom Domain: Map to `https://api.codeatlas.io`.

### D. Celery Background Worker Deployment
1. Deploy dedicated worker instance using `Dockerfile.backend`.
2. Command: `celery -A app.workers worker --loglevel=info --concurrency=4`
3. Connects to `CELERY_BROKER_URL` to process repository ingestion, graph indexing, simulation, and optimization tasks.

### E. Next.js Frontend Deployment (Vercel / Cloud Run)
1. Connect repository root to Vercel or Cloud Run.
2. Build Settings:
   - Root Directory: `apps/web`
   - Framework Preset: `Next.js`
   - Build Command: `pnpm build`
3. Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://api.codeatlas.io/api/v1`
4. Custom Domain: Map to `https://app.codeatlas.io`.

---

## 3. Post-Deployment Verification & Health Checks

Run automated smoke test against production backend:
```bash
# Liveness Probe (Should return 200 OK)
curl -s https://api.codeatlas.io/api/v1/health/live

# Readiness Probe (Checks DB + Redis)
curl -s https://api.codeatlas.io/api/v1/health/ready

# Readiness Score (Target > 95%)
curl -s https://api.codeatlas.io/api/v1/health/readiness-score
```
