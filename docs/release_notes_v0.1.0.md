# CodeAtlas Release v0.1.0

We are pleased to introduce the initial release of **CodeAtlas (v0.1.0)**! This release marks the completion of the core monorepo foundation, responsive layouts, user auth verification, persistent storage layers, and asynchronous git repository workers.

## What's New in v0.1.0

### Core Foundation

- Scaffolded workspace directories (`apps`, `packages`, `docs`, `tests`).
- Configured ESLint (flat format), Prettier formatting rules, and Python tools (Ruff, Black).
- Implemented pre-commit Git hooks ensuring code quality checks are run prior to commits.

### Next.js Client

- Created clean responsive App Router layout using Tailwind CSS.
- Collapsible responsive dashboard sidebar.
- Added dark/light mode toggle with theme transitions.

### FastAPI Service & Auth

- Standardized config module loading env parameters.
- Implemented structured logging middleware.
- Built token-based authorization using JSON Web Tokens (JWT) and GitHub OAuth callback routes.
- Created local bypass stub for OAuth authentication.

### Database & Background Jobs

- Implemented PostgreSQL persistence with SQLAlchemy 2.0.
- Implemented database models tracking users, repositories, settings, and jobs.
- Implemented Celery queue task managers connecting to Redis to trigger out-of-band repository clones.

### Operations Infrastructure

- Docker container images for both frontend and backend.
- Reverse proxy routing with Nginx.
- Docker Compose setup with dependent health check blocks.
- GitHub Actions continuous integration (CI) workflow.
