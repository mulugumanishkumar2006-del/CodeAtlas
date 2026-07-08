# CodeAtlas

CodeAtlas is a developer platform designed to organize, analyze, and manage codebases. Built with a Next.js frontend and a FastAPI backend, it features GitHub OAuth + JWT authorization, PostgreSQL persistence, and Celery asynchronous background tasks for repo management.

## Key Features

- **Collapsible Dashboard**: A responsive, theme-aware layout supporting light and dark modes.
- **GitHub OAuth + JWT Authentication**: Secure authentication flow with token-based session verification.
- **Relational Code Base Tracking**: Complete persistence layers for tracking users, repositories, and jobs.
- **Async Git Cloning**: Asynchronous clone execution using Celery background workers and Redis queues.
- **Reversed Proxy Routing**: Pre-configured Nginx routing to handle server paths natively.

## Project Structure

```text
codeatlas/
├── apps/
│   ├── backend/             # FastAPI Backend Service
│   │   ├── app/
│   │   │   ├── api/v1/      # API endpoints (Auth, Repositories, Health)
│   │   │   ├── core/        # Database session and Celery configurations
│   │   │   ├── models/      # SQLAlchemy Database Models
│   │   │   ├── repositories/# Database persistence query layers
│   │   │   ├── schemas/     # Pydantic schemas (Token, User)
│   │   │   ├── services/    # Business services (Auth, Repository)
│   │   │   └── workers/     # Celery background tasks
│   │   └── Dockerfile
│   └── web/                 # Next.js Frontend Application
│       ├── src/
│       │   ├── app/         # App Router Views (Dashboard, Login)
│       │   ├── components/  # Collapsible Sidebar, ThemeToggle
│       │   └── context/     # Auth Context storing local tokens
│       └── Dockerfile
├── docs/                    # REST API specifications and release notes
├── nginx/                   # Nginx reverse proxy configuration
├── docker-compose.yml       # Production/Local orchestrator
├── eslint.config.js         # JavaScript workspace linting
├── pyproject.toml           # Python styling (Ruff, Black)
└── pnpm-workspace.yaml      # Monorepo configuration
```

## Quick Start (Local Development)

### 1. Prerequisites

- Node.js (v24 or later)
- Python (v3.10 or later)
- PostgreSQL
- Redis

### 2. Backend Setup

1. Change directory to `apps/backend/`.
2. Create and activate a python virtual environment:
      ```bash
      python -m venv .venv
      .venv\Scripts\activate  # Windows
      source .venv/bin/activate  # macOS/Linux
      ```
3. Install dependencies:
      ```bash
      pip install -r requirements.txt
      ```
4. Start FastAPI server:
      ```bash
      uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
      ```

### 3. Frontend Setup

1. Install JS/TS dependencies from root:
      ```bash
      pnpm install
      ```
2. Start Next.js development server:
      ```bash
      pnpm --filter web run dev
      ```

### 4. Code Quality & Formatting

To ensure your code passes repository CI checks, run the formatters and linters locally before pushing:

**JavaScript/TypeScript (Next.js):**

```bash
# Format JS/TS/JSON/CSS/MD files
pnpm run format:js:fix

# Check formatting status
pnpm run format:js

# Run ESLint linter
pnpm run lint:js
```

**Python (FastAPI):**

```bash
# Format Python code with Black
python -m black apps/backend

# Check formatting status
python -m black --check apps/backend

# Run Ruff linter checks
python -m ruff check apps/backend

# Autofix fixable Ruff violations
python -m ruff check --fix apps/backend
```

---

## Running with Docker Compose

To boot the entire stack (Postgres, Redis, Backend, Workers, Frontend, and Nginx proxy):

```bash
docker-compose up --build
```

Once healthy, navigate to `http://localhost/` in your browser.
