# CodeAtlas

> Software Repository Intelligence Platform

CodeAtlas provides structural intelligence across software codebases. It is designed to index repositories, parse abstract syntax trees (ASTs), model symbol call graphs, map system architectures, and enable natural language code exploration.

---

## Project Structure

```
CodeAtlas/
├── .env.example            # Environment configuration template
├── .env                    # Local environment variables
├── .gitignore              # Git ignore rules
├── docker-compose.yml      # Local services (PostgreSQL 16, Redis 7)
├── README.md               # Root documentation
│
├── backend/                # FastAPI Backend Application
│   ├── pyproject.toml      # Python package definition
│   ├── requirements.txt    # Production & test dependencies
│   ├── app/
│   │   ├── api/            # API endpoints (/health, /repositories)
│   │   ├── db/             # SQLAlchemy engine & Redis async client
│   │   ├── models/         # Database models (Repository)
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── config.py       # Pydantic Settings configuration
│   │   └── main.py         # FastAPI application entrypoint
│   └── tests/              # Pytest test suite (health, repository CRUD)
│
├── frontend/               # React + TypeScript + Vite Application
│   ├── package.json        # Frontend dependencies & scripts
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── src/
│   │   ├── components/     # UI components (Sidebar, WorkspaceNav, EmptyState, ChatInput, Modals)
│   │   ├── services/       # Typed HTTP API client
│   │   ├── types/          # Shared TypeScript interfaces
│   │   ├── index.css       # Obsidian & indigo/cyan design system
│   │   ├── App.tsx         # Main application container
│   │   └── main.tsx        # React mount entrypoint
│   └── index.html          # HTML template
│
└── docs/                   # Platform Documentation
    ├── architecture.md     # Subsystem architecture & data flow
    ├── api.md              # REST API reference
    └── development.md      # Local setup and workflow guide
```

---

## Quickstart

### 1. Start Infrastructure (PostgreSQL & Redis)
```bash
docker compose up -d
```

### 2. Start Backend
```bash
# Activate virtual environment
.\.venv\Scripts\Activate

# Run tests
pytest backend/tests

# Run API server
uvicorn backend.app.main:app --reload --port 8000
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to explore CodeAtlas.
