# Cross-Repository Graph Intelligence (Multi-Repo WSKG)

## 1. Cross-Repository Dependency Linker

The Multi-Repo WSKG resolves dependencies across microservices and team repositories:
- `API_CALL`: HTTP REST / gRPC invocations across services.
- `EVENT_PUB_SUB`: Kafka / RabbitMQ event topic linkages.
- `SHARED_LIBRARY`: Shared internal package imports.
- `DB_DEPENDENCY`: Shared database schemas or tables.

---

## 2. Breaking Change Cascade Analysis

When a core service (e.g. `repo-auth:auth_service`) modifies an API signature or database model, the engine calculates the downstream breaking change risk probability across all consumer repositories in the organization.
