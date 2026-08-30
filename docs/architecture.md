# CodeAtlas Architecture

## Overview

**CodeAtlas** is a developer-focused software repository intelligence platform. It provides structural indexing, dependency graphing, architecture visualization, and natural codebase querying.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Interface                       │
│     (React 18 + TypeScript + Vite + Custom Design System)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST API (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend Engine                   │
│        (Python 3.10+, Async Lifespan, Pydantic v2)           │
├──────────────────────────────┬──────────────────────────────┤
│                              │                              │
│       SQLAlchemy (Async)     │       Redis Client (Async)   │
│              ▼               │              ▼               │
│     PostgreSQL Database      │         Redis Cache          │
│       (Port 5432)            │         (Port 6379)          │
└──────────────────────────────┴──────────────────────────────┘
```

## Core Subsystems

### 1. Frontend Workspace
- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Vanilla CSS tokens, glassmorphism, responsive split-pane layout, dark-mode first.
- **State Management**: React state hooks with decoupled API client layer.
- **Views**:
  - Sidebar: Application identity, repository listings, system health indicator.
  - Workspace Header: Active repository context, multi-view tab navigation.
  - Workspace View: Repository metadata and status.
  - Chat Dock: Natural chat-style query input bar.
  - Modals: Repository connection dialog with client and server validation.

### 2. Backend Application
- **Framework**: FastAPI with asynchronous route handlers and middleware.
- **Configuration**: Pydantic Settings reading environment variables with strict typing.
- **Health System**: Real-time database connection and Redis connection diagnostics.
- **Persistence**: Async SQLAlchemy 2.0 connected to PostgreSQL (`asyncpg`).
- **Caching / Queues**: Redis 7 async client configured for future background task orchestration.

### 3. Data Model (Foundation Phase)
- **Repository Model**:
  - `id`: String (UUIDv4 primary key)
  - `name`: Unique human-readable repository name/slug (e.g., `owner/repo`)
  - `url`: Git remote URL
  - `default_branch`: Main/default branch name
  - `description`: Optional text description
  - `status`: Lifecycle state (`connected`, etc.)
  - `created_at`: Timestamp (UTC)
  - `updated_at`: Timestamp (UTC)
