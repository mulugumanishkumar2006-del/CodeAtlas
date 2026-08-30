# CodeAtlas Development Guide

## Prerequisites

- **Python**: 3.10+
- **Node.js**: 18+
- **Docker**: Docker & Docker Compose (for PostgreSQL and Redis)

---

## 1. Environment Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

---

## 2. Start PostgreSQL & Redis

Start database and caching services using Docker Compose:
```bash
docker compose up -d
```

Verify services are up:
```bash
docker compose ps
```

---

## 3. Backend Setup & Run

Create and activate Python virtual environment:
```bash
python -m venv .venv
# Windows
.\.venv\Scripts\Activate
# Linux / macOS
source .venv/bin/activate
```

Install backend dependencies:
```bash
pip install -r backend/requirements.txt
```

Run backend test suite:
```bash
pytest backend/tests
```

Start backend development server:
```bash
uvicorn backend.app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000` (API Docs: `http://localhost:8000/api/v1/docs`).

---

## 4. Frontend Setup & Run

Install frontend dependencies:
```bash
cd frontend
npm install
```

Build or typecheck frontend:
```bash
npm run build
```

Start frontend development server:
```bash
npm run dev
```

Frontend will be accessible at `http://localhost:5173`.
