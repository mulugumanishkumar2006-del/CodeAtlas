# CodeAtlas API Specifications

The CodeAtlas REST API is mounted under path prefix `/api/v1/`.

## Health Endpoint

### `GET /api/v1/health`

Returns the operational health status of the application backend.

**Response (200 OK)**:

```json
{
                        "status": "healthy",
                        "environment": "local",
                        "project_name": "CodeAtlas API"
}
```

---

## Authentication Endpoints

### `GET /api/v1/auth/login/github`

Redirects the client browser to the GitHub OAuth authorization page.

**Response (307 Temporary Redirect)**:
Redirects to GitHub OAuth URL.

---

### `POST /api/v1/auth/github/callback`

Exchanges a GitHub authorization code for a signed JWT access token.

**Request Payload**:

```json
{
                        "code": "GITHUB_AUTHORIZATION_CODE"
}
```

**Response (200 OK)**:

```json
{
                        "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
                        "token_type": "bearer"
}
```

---

### `GET /api/v1/auth/me`

Retrieves information about the currently logged-in user context.

**Headers**:

- `Authorization: Bearer <access_token>`

**Response (200 OK)**:

```json
{
                        "id": "12345",
                        "username": "github_username",
                        "name": "User Name",
                        "email": "user@example.com",
                        "avatar_url": "https://avatars.githubusercontent.com/u/12345"
}
```

---

## Repository Endpoints

### `POST /api/v1/repositories`

Registers a repository for background cloning.

**Headers**:

- `Authorization: Bearer <access_token>`

**Request Payload**:

```json
{
                        "name": "my-project",
                        "full_name": "username/my-project",
                        "clone_url": "https://github.com/username/my-project.git"
}
```

**Response (201 Created)**:

```json
{
                        "id": "c1f7b764-a6f9-4674-8848-038d10b7f8be",
                        "name": "my-project",
                        "full_name": "username/my-project",
                        "clone_url": "https://github.com/username/my-project.git",
                        "status": "pending"
}
```

---

### `DELETE /api/v1/repositories/{repo_id}`

Deletes a repository from tracking and purges cloned directories on disk.

**Headers**:

- `Authorization: Bearer <access_token>`

**Response (204 No Content)**:
No body content returned.
