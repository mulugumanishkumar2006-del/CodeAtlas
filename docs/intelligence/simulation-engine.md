# CodeAtlas v1.2 — Advanced Engineering Simulation Studio

## Overview

The **CodeAtlas v1.2 Engineering Simulation Studio** enables software architects and developers to safely evaluate proposed system modifications by asking:

> **"What happens if I make this change?"**

Simulations operate strictly over **isolated in-memory virtual graphs** derived from the current software knowledge graph.

---

## Core Simulation Pipeline Architecture

```
REAL REPOSITORY
       ↓
CURRENT STATE (Deterministic Code & Graph Intelligence)
       ↓
USER-PROPOSED CHANGE (Modify function, Rename, Add/Remove dependency, Service extraction, DB schema change)
       ↓
VIRTUAL GRAPH (Isolated in-memory graph representation)
       ↓
SIMULATED IMPACT & RISK (Current Risk vs Simulated Risk comparison)
       ↓
ARCHITECTURE & MIGRATION CONSEQUENCES (Current Arch vs Simulated Arch diff)
       ↓
EXPLICIT ASSUMPTIONS & CONFIDENCE SCORE (HIGH, MEDIUM, LOW, UNKNOWN)
       ↓
AI SIMULATION REASONING (Fact vs Inference vs Prediction)
       ↓
DECISION SUPPORT & VALIDATION PLAN (Non-destructive validation steps & downloadable report)
```

---

## Core Principles & Guarantees

1. **Zero Production Mutation**: Simulations never alter production repository files, databases, or configuration files automatically.
2. **Zero Autonomous Execution**: Suggested validation steps (unit tests, DB migration checks) are never executed automatically.
3. **Explicit Assumptions & Confidence**: Every predicted result is accompanied by visible assumptions and a confidence score (`HIGH`, `MEDIUM`, `LOW`, `UNKNOWN`).
4. **Multi-Scenario Decision Support**: Enables comparing multiple change options (Option A vs Option B vs Option C) with benefits, costs, risks, and explainable recommendations.

---

## 13 Supported Proposed Change Types (Phase 3)

1. `MODIFY_FUNCTION`: Virtual function contract or implementation modification.
2. `RENAME_SYMBOL`: Virtual symbol renaming across call graphs.
3. `DELETE_SYMBOL`: Virtual symbol removal impact check.
4. `MOVE_MODULE`: Virtual module relocation across domain boundaries.
5. `ADD_DEPENDENCY`: Virtual dependency introduction.
6. `REMOVE_DEPENDENCY`: Virtual dependency elimination.
7. `CHANGE_API`: Virtual API breaking change simulation on caller endpoints.
8. `CHANGE_DB_SCHEMA`: Virtual column/table schema migration impact on models and queries.
9. `CHANGE_CONFIG`: Virtual configuration parameter update.
10. `SERVICE_BOUNDARY_CHANGE`: Virtual component boundary alteration.
11. `EXTRACT_SERVICE`: Virtual microservice extraction from monolith boundary.
12. `INTRODUCE_QUEUE`: Asynchronous message queue introduction.
13. `INTRODUCE_CACHE`: Cache layer introduction between services.

---

## Simulation Lifecycle & States (Phase 2)

```
CREATE → CONFIGURE → RUN → ANALYZE → COMPARE → SAVE → DISCARD
```

States: `DRAFT`, `RUNNING`, `COMPLETED`, `FAILED`, `DISCARDED`.

---

## Multi-Scenario Comparison & Decision Support (Phases 17-19)

Allows side-by-side comparison of multiple architectural options:
- **Option A**: In-place function refactor (Lower risk, higher confidence).
- **Option B**: Service extraction into microservice (Higher risk, higher long-term modularity).

Each scenario provides: `BENEFITS`, `COSTS`, `RISKS`, `AFFECTED SYSTEMS`, `ASSUMPTIONS`, `EVIDENCE`, `VALIDATION`, and `EXPLAINABLE RECOMMENDATION`.

---

## Security & Data Isolation (Phase 26)

- **Tenant Isolation**: Simulations are strictly scoped by Tenant ID, Workspace ID, and Repository ID.
- **Secret Protection**: Legacy credentials in past commits are never exposed.
- **Prompt Injection Defense**: Intercepts override directives in prompt input, treating them strictly as data literals.
