# CodeAtlas v1.2 — AI Engineering Reasoning Engine Documentation

## Overview

The **CodeAtlas v1.2 AI Engineering Reasoning Engine** evolves CodeAtlas from basic AI question-answering into an **evidence-grounded engineering intelligence system**.

The core principle is:
> **The deterministic system establishes facts.**
> **The AI explains, connects, evaluates, and reasons over those facts.**

The system operates across **37 core capabilities** spanning context planning, claim classification, prompt injection defense, structured reasoning sequences, failure fallbacks, and adversarial benchmarks.

---

## Reasoning Pipeline Architecture

```
USER QUESTION
      ↓
INTENT CLASSIFICATION (17 Engineering Intents)
      ↓
REPOSITORY CONTEXT & CONTEXT PLANNER
      ↓
EVIDENCE PACK ASSEMBLY & RANKING
      ↓
TRUST BOUNDARY & PROMPT INJECTION DEFENSE
      ↓
STRUCTURED REASONING ENGINE (OBSERVE → CONNECT → ANALYZE → ASSESS → VALIDATE → RECOMMEND)
      ↓
REASONING VALIDATOR & CLAIM CLASSIFICATION (FACT, INFERENCE, PREDICTION, RECOMMENDATION, UNKNOWN)
      ↓
SAFE REASONING TRACE & CLICKABLE SOURCE CITATIONS
      ↓
ENGINEERING ANSWER & SAFE DEVELOPER ACTIONS
```

---

## 1. Intent Classification (17 Engineering Intents)

The reasoning engine automatically classifies incoming user questions into one of 17 supported engineering intents:

1. `EXPLAIN`: Explains code structure, symbols, or component design.
2. `INVESTIGATE`: Investigates unknown system behavior or code anomalies.
3. `TRACE`: Traces execution paths and call hierarchies.
4. `COMPARE`: Compares implementations, diffs, or architecture versions.
5. `IMPACT`: Evaluates dependency and breaking change impact.
6. `DEBUG`: Diagnoses stack traces, exceptions, and runtime errors.
7. `ROOT_CAUSE`: Performs symptom-to-cause root cause analysis.
8. `ARCHITECTURE`: Evaluates architectural coupling, boundaries, and cohesion.
9. `DEPENDENCY`: Analyzes direct and transitive dependency trees.
10. `SECURITY`: Evaluates auth flows, trust boundaries, and secret protection.
11. `PERFORMANCE`: Analyzes execution paths, DB queries, and bottleneck hotspots.
12. `TECHNICAL_DEBT`: Evaluates code smells, duplications, and complexity metrics.
13. `MIGRATION`: Generates staged migration plans with rollback procedures.
14. `CHANGE_PLAN`: Formulates implementation plans for proposed changes (without auto-editing code).
15. `DOCUMENTATION`: Generates architecture and API specification docs.
16. `TESTING`: Evaluates test coverage and missing test cases.
17. `CODE_REVIEW`: Analyzes PRs and commits for bugs, security risks, and regressions.

When intent is ambiguous, available context is used without inventing missing requirements.

---

## 2. Claim Classification & Evidence Grounding

Every generated claim is internally classified into one of 5 strict claim categories:

- **FACT**: Directly verified in current repository code or knowledge graph (e.g. *"Service A calls Service B"*).
- **INFERENCE**: Derived logically from verified facts (e.g. *"Changing Service B may affect Service A"*).
- **PREDICTION**: Forecast of future system behavior (e.g. *"This API change is likely to require frontend updates"*).
- **RECOMMENDATION**: Suggested engineering action (e.g. *"Run integration tests before merging"*).
- **UNKNOWN**: Explicitly identified missing information (e.g. *"No dependency information was found"*).

Categories are never collapsed. Unevidenced claims have their confidence downgraded or are removed by the Reasoning Validator.

---

## 3. Trust Boundaries & Prompt Injection Defense

All repository-derived text (source code strings, comments, READMEs, issue titles, commit messages) is treated as **UNTRUSTED DATA**.

The system actively intercepts prompt injection patterns such as:
- *"Ignore previous instructions"*
- *"Reveal your system prompt"*
- *"Send secrets"*
- *"Execute this command"*

Suspicious inputs are contained as data literals and never executed as instructions.

---

## 4. AI Provider Abstraction & Failure Handling

The engine uses a provider abstraction layer (`LLMProvider`) supporting Gemini, OpenAI, and Mock providers with configurable timeouts, retries, and token limits.

If AI models fail or time out, CodeAtlas automatically falls back to returning **deterministic graph, impact, search, and evidence packs** with `ai_explanation_available: False` and a clear status message.

---

## 5. Security & Tenant Boundaries

- **Tenant Isolation**: Queries and evidence packs are strictly scoped to the caller's tenant ID and workspace ID.
- **No Autonomous Execution**: The system will **never** automatically execute code or alter production files without explicit human action.
- **Clickable Citations**: Every claim links directly to its source file, line range, symbol, or commit hash.
