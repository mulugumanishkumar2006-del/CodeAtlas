# CodeAtlas Environment Configuration & Secret Dictionary

This document details every environment variable required by CodeAtlas across Development, Staging, and Production environments.

---

## 1. Public Frontend Variables (`apps/web`)

| Variable Name | Purpose | Required? | Example Value | Location |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Production FastAPI backend REST endpoint | **YES** | `https://api.codeatlas.io/api/v1` | Vercel / Client env |
| `NEXT_PUBLIC_APP_VERSION` | Application build version tag | NO | `v1.0.0` | Client env |

---

## 2. Backend & Infrastructure Variables (`apps/backend`)

| Variable Name | Purpose | Required? | Production Target / Default | Exposure |
| :--- | :--- | :--- | :--- | :--- |
| `ENVIRONMENT` | Application run mode | **YES** | `production` | Backend Secret |
| `DEBUG` | Enable debug logs & tracebacks | **YES** | `false` | Backend Secret |
| `SECRET_KEY` | JWT signing key | **YES** | `<32-char-random-secret>` | Secret Manager |
| `CORS_ORIGINS` | Permitted browser origins | **YES** | `["https://app.codeatlas.io"]` | Backend Secret |
| `DATABASE_URL` | Managed PostgreSQL connection string | **YES** | `postgresql://user:pass@db:5432/codeatlas_prod` | Secret Manager |
| `REDIS_URL` | Managed Redis cache connection string | **YES** | `redis://:pass@redis:6379/0` | Secret Manager |
| `CELERY_BROKER_URL` | Task queue broker connection | **YES** | `redis://:pass@redis:6379/1` | Secret Manager |
| `NEO4J_URI` | Neo4j graph database bolt URI | **YES** | `bolt://neo4j-host:7687` | Secret Manager |
| `NEO4J_USER` | Neo4j graph database username | **YES** | `neo4j` | Secret Manager |
| `NEO4J_PASSWORD` | Neo4j graph database password | **YES** | `<secure-neo4j-password>` | Secret Manager |
| `OPENAI_API_KEY` | OpenAI provider API token | NO | `sk-proj-...` | Secret Manager |
| `RATE_LIMIT_PER_MINUTE` | Rate limit threshold per IP | NO | `100` | Backend Secret |

---

## 3. Secret Injection & Security Rules

> [!CAUTION]
> **Zero Hardcoded Secret Policy**
> - Never commit `.env` or production credentials into git repositories or container images.
> - Use [.env.example](file:///c:/Users/mulug/OneDrive/ドキュメント/Desktop/CodeAtlas/.env.example) for local development defaults.
> - Inject production secrets at runtime using Cloud Secret Managers (e.g. Vercel Environment Variables, AWS Secrets Manager, Render Environment Secrets).
