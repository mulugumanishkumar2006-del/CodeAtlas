# CodeAtlas REST API Reference

Base URL: `http://localhost:8000/api/v1`

Interactive API Docs:
- Swagger UI: `http://localhost:8000/api/v1/docs`
- ReDoc: `http://localhost:8000/api/v1/redoc`

---

## 1. System Health

### `GET /api/v1/health`
Checks backend services status, database connectivity, and Redis connectivity.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "environment": "development",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2026-08-17T13:30:00.000Z"
}
```

---

## 2. Repositories

### `GET /api/v1/repositories`
List all connected repositories ordered by newest first.

**Response `200 OK`**:
```json
[
  {
    "id": "c7a8e265-f6d3-4f9e-a89e-9d29f8f416e8",
    "name": "fastapi/fastapi",
    "url": "https://github.com/fastapi/fastapi",
    "default_branch": "master",
    "description": "FastAPI framework, high performance",
    "status": "connected",
    "created_at": "2026-08-17T13:30:00.000Z",
    "updated_at": "2026-08-17T13:30:00.000Z"
  }
]
```

---

### `POST /api/v1/repositories`
Register a new repository.

**Request Body**:
```json
{
  "name": "fastapi/fastapi",
  "url": "https://github.com/fastapi/fastapi",
  "default_branch": "master",
  "description": "FastAPI framework"
}
```

**Response `201 Created`**:
```json
{
  "id": "c7a8e265-f6d3-4f9e-a89e-9d29f8f416e8",
  "name": "fastapi/fastapi",
  "url": "https://github.com/fastapi/fastapi",
  "default_branch": "master",
  "description": "FastAPI framework",
  "status": "connected",
  "created_at": "2026-08-17T13:30:00.000Z",
  "updated_at": "2026-08-17T13:30:00.000Z"
}
```

---

### `GET /api/v1/repositories/{id}`
Retrieve repository details by ID.

**Response `200 OK`** or `404 Not Found`.

---

### `DELETE /api/v1/repositories/{id}`
Delete a registered repository.

**Response `204 No Content`** or `404 Not Found`.
