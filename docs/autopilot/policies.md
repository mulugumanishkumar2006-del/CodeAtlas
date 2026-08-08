# Engineering Autopilot Policies & Risk-Based Autonomy

## 1. Approval Scopes

- `ANALYSIS_ONLY`: Context building, investigation, plan generation, and virtual graph simulation.
- `CODE_MODIFICATION`: Modifying file contents in an isolated sandbox branch.
- `TESTING`: Executing static linters and pytest test suites.
- `COMMIT`: Creating git commits with human-approved change summaries.
- `PULL_REQUEST`: Opening GitHub pull request drafts for review.

## 2. Risk-Based Autonomy Ranks

- **LOW**: Formatting, linting, test generation.
- **MEDIUM**: Business logic refactoring, coupling reduction.
- **HIGH**: Database schema changes, API contract updates.
- **CRITICAL**: Production deployment, release creation.
