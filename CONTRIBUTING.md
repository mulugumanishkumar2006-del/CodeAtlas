# CodeAtlas Contributing Guide

Thank you for contributing to CodeAtlas! Follow these guidelines to maintain formatting integrity and correct application flows.

## Workspace Tooling

CodeAtlas is configured as a monorepo workspace managed by `pnpm`.

### Frontend Management

- Install dependencies: `pnpm install`
- Start frontend dev server: `pnpm --filter web run dev`
- Run Prettier check: `pnpm run format:js`
- Run ESLint checks: `pnpm run lint:js`

### Backend Management

- Run formatting using Black: `.\.venv\Scripts\black apps/backend`
- Run checks using Ruff: `.\.venv\Scripts\ruff check apps/backend`

---

## Git Pre-Commit Hooks

Git pre-commit hooks are configured to run validation checks automatically prior to recording commits.

The hooks execute:

1. **Prettier Formatting Checks**: Validates formatting across JS/TS/CSS/JSON/YAML documents.
2. **ESLint Checks**: Validates lint rules across Next.js and TypeScript.
3. **Ruff & Black Checks**: Verifies python styling and imports.

To skip checks during local testing (use cautiously):

```bash
git commit -m "commit message" --no-verify
```

---

## Database Migrations (Alembic)

When database models are modified in `apps/backend/app/models/`:

1. **Auto-Generate a Migration**:
   From `apps/backend/`, run:
      ```bash
      ..\..\.venv\Scripts\alembic revision --autogenerate -m "description of changes"
      ```
2. **Apply Migrations**:
   To apply migrations to your local Postgres database, run:
      ```bash
      ..\..\.venv\Scripts\alembic upgrade head
      ```
