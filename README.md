# CodeAtlas

CodeAtlas is an AI Operating System for Software Engineering. Built with a Next.js frontend and a FastAPI backend, it features GitHub OAuth + JWT authorization, PostgreSQL persistence, and Celery asynchronous background tasks for repo management.

## Next-Generation Platform Features

- **AI Mission Control** (`/` & `/mission-control`): Real-time engineering command center replacing static dashboards with dynamic state greetings, 8 intelligent scorecards with SVG progress rings, live AI activity stream, repository digital twins, daily focus task lists, live engineering timeline, and docked context-aware AI Copilot.
- **AI CTO Workspace** (`/ai-cto`): Proactive organizational intelligence workspace offering 5 Executive Abstraction Views (`DEVELOPER`, `TECH_LEAD`, `ENGINEERING_MANAGER`, `PRINCIPAL_ENGINEER`, `CTO`), 10 live telemetry metrics, proactive AI recommendations, an interactive Engineering Advisor, a 6-week AI strategic roadmap, architectural decision support, and persistent long-term AI memory.
- **AI Investigation Engine** (`/investigate`): Autonomous incident response engine with 12 preset trigger queries (*slow checkout, auth failures, memory usage, drift, dependency conflicts, circular dependencies, database bottlenecks, etc.*), a real-time 15-stage reasoning pipeline, transparent chain-of-thought reasoning tree, structured report viewer with direct tool links (`/repositories`, `/architecture`, `/knowledge`, `/analyze`, `/simulate`, `/dependency-graph`, `/security`, `/tech-debt`, `/monitor`), and team collaboration tools.
- **AI Refactoring Planner** (`/improve`): Complete engineering execution planner featuring automatic refactoring opportunity detection (*God Services, God Classes, Cyclic Dependencies, DB Bottlenecks, Shotgun Surgery, etc.*), an interactive 6-step visual roadmap, side-by-side Digital Twin simulation comparison (latency, throughput, debt payoff), trade-off analysis matrix, detailed execution plan with rollback strategies, and a live execution progress assistant.
- **Collapsible Dashboard**: Responsive, theme-aware layout supporting light and dark modes.
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
│       │   ├── app/         # App Router Views (AI Mission Control, AI CTO, Investigate, Refactoring Planner)
│       │   ├── components/  # AI Mission Control, AI CTO, AI Investigation, Refactoring Planner components
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
