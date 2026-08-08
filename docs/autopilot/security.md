# Engineering Autopilot Security Architecture

## 1. Safety Principles

- **No Silent Mutations**: Autopilot **NEVER** silently modifies production repositories, pushes code, or merges PRs without human approval.
- **Command Allowlist**: Only pre-approved commands (`pytest`, `git diff`, `black`, `flake8`, `mypy`) can execute in sandboxes. Destructive commands (`rm -rf`, `drop database`, `git push --force`) are blocked.
- **Secret Redaction**: Secret tokens, credentials, and API keys are automatically replaced with `[REDACTED_SECRET]`.
- **Tenant & Repository Isolation**: Strict tenant boundaries prevent cross-repository context leakage.
