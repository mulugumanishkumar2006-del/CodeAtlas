# CodeAtlas API Keys & Authentication Specification

## Scoped API Keys

API keys are created with explicit, non-overlapping granular scopes:
- `repository:read`, `repository:write`
- `architecture:read`, `graph:read`, `knowledge:read`
- `agent:execute`, `deployment:read`, `deployment:execute`
- `admin:read`, `admin:write`

Raw secret keys are displayed **only once** upon generation and stored as salted hashes.
