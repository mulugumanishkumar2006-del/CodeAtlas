# CodeAtlas Architecture Guide

This document describes the high-level architecture, request lifecycle, data models, and background task queues of the CodeAtlas platform.

## Overview Flowchart

The following diagram maps how web client requests are proxied by Nginx to either the Next.js frontend or the FastAPI backend, and how tasks are queued via Redis to the Celery background worker:

```mermaid
flowchart TD
    Client[Web Client] -->|Port 80| Proxy[Nginx Reverse Proxy]
    Proxy -->|/api/v1/*| Backend[FastAPI Backend: Port 8000]
    Proxy -->|/*| Frontend[Next.js Frontend: Port 3000]

    Backend -->|Read/Write| DB[(PostgreSQL Database)]
    Backend -->|Queue Task| Redis[(Redis Broker)]

    Redis -->|Consume Task| Worker[Celery Async Worker]
    Worker -->|git clone| Disk[(Local Repository Storage)]
    Worker -->|Update Status| DB
```

---

## Authentication Flow (GitHub OAuth & JWT)

Secure sessions are managed by exchanging GitHub authorization codes for local signed JWTs:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Agent
    participant Web as Next.js Web App
    participant API as FastAPI Backend
    participant GH as GitHub API

    User->>Web: Access Protected Route
    Web->>User: Redirect to /login
    User->>Web: Click "Login with GitHub"
    Web->>API: GET /auth/login/github
    API->>User: Redirect to GitHub OAuth page
    User->>GH: Authenticate & Authorize
    GH->>Web: Callback to /login/callback?code=AUTH_CODE
    Web->>API: POST /auth/github/callback {"code": "AUTH_CODE"}
    API->>GH: Post code for Access Token
    GH->>API: Return Access Token
    API->>GH: Get User details (/user)
    GH->>API: User info (id, login, avatar_url)
    API->>API: Upsert User record in Database
    API->>API: Generate local signed JWT
    API->>Web: Return JWT token
    Web->>User: Set state & redirect to Dashboard (/)
```

---

## Asynchronous Git Cloning Lifecycle

Repository clones are executed out-of-band by workers using Celery:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Agent
    participant Web as Next.js Web App
    participant API as FastAPI Backend
    participant DB as PostgreSQL
    participant Worker as Celery Worker

    User->>Web: Click "Add Repository"
    Web->>API: POST /repositories {"name": "...", "clone_url": "..."}
    API->>DB: Create Repository (status='pending')
    API->>DB: Create Job (status='pending')
    API->>Worker: Trigger clone_repository_task.delay(repo_id, job_id)
    API->>Web: Return 201 Created (repo details)
    Worker->>DB: Update Repository status='cloning' & Job status='running'
    Worker->>Worker: Execute git clone subprocess
    alt Clone Succeeds
        Worker->>DB: Update Repository status='cloned' & Job status='completed'
    else Clone Fails
        Worker->>DB: Update Repository status='failed' & Job status='failed' with logs
    end
```