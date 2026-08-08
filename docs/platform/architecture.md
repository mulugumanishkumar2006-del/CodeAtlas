# CodeAtlas v2.0 Platform — Production Architecture Specification

## Overview

CodeAtlas v2.0 is a production-grade, multi-tenant SaaS engineering control plane and intelligence platform.

## High-Level Topology

```
[ Frontend Next.js Dashboard / CodeAtlas CLI ]
                        │
                        ▼
            [ Cloudflare / API Gateway ]
                        │
                        ▼
   [ FastAPI Backend Cluster / Auth / Rate Limiting ]
      │             │              │              │
      ▼             ▼              ▼              ▼
[ PostgreSQL ]  [ Redis ]   [ Celery Job ]  [ S3 Storage ]
(Relational)    (Cache & Q)  (Worker Pool)  (Artifacts)
```

## System Components

1. **Frontend**: Next.js App Router with Vanilla CSS design system, server components, and Command Center UI.
2. **API Gateway & Middleware**: Fast, rate-limited `/api/v1` platform router with JWT authentication & RBAC authorization.
3. **Database & Cache**: PostgreSQL with Alembic migrations, connection pooling, and Redis caching.
4. **Asynchronous Job Workers**: Celery / Redis background worker pool processing AST parsing, graph building, and analysis without blocking HTTP threads.
5. **Object Storage**: S3-compatible blob storage storing static analysis artifacts, vector indices, and logs.
6. **AI Infrastructure**: Abstraction layer integrating Google Gemini 3.6 Flash with Anthropic/OpenAI fallbacks and strict token budget enforcement.
