# CodeAtlas v1.2 Impact Intelligence Engine Architecture

This document defines the technical specification, traversal algorithms, deterministic risk scoring, confidence models, evidence schemas, and API contracts for the CodeAtlas Impact Intelligence Engine.

---

## 1. Normalized Impact Query Pipeline

```
USER TARGET SELECTION (File / Symbol / API / Database / Config)
       ↓
GRAPH TRAVERSAL ENGINE (Depth 1 → Depth 2 → Depth 3 Bounded Paths)
       ↓
IMPACT CATEGORIZATION (Direct, Indirect, Architectural, API, Data)
       ↓
DETERMINISTIC RISK & CONFIDENCE SCORING
       ↓
GROUNDED AI CTO IMPACT REASONING (Fact vs Inference vs Prediction)
       ↓
INTERACTIVE IMPACT REPORT & GRAPH DIFF
```

---

## 2. Deterministic Risk & Confidence Models

### Deterministic Risk Score Formula
$$\text{Risk Score} = (\text{Affected Component Count} \times 0.4) + (\text{Max Depth} \times 0.3) + (\text{Boundary Crossings} \times 0.3)$$

- **Risk Bands**:
  - **CRITICAL** (8.0 – 10.0): Crosses microservice or DB boundaries with > 5 callers.
  - **HIGH** (6.0 – 7.9): Multiple indirect service callers.
  - **MEDIUM** (3.5 – 5.9): Local module or internal service callers.
  - **LOW** (0.0 – 3.4): Single file internal dependency.

### Confidence Model
- **HIGH**: Direct static graph relationship + explicit source evidence.
- **MEDIUM**: Multi-signal inference without direct graph edge.
- **LOW**: Incomplete parsing context or dynamic reflect calls.

---

## 3. REST API Contracts

| Endpoint | Method | Request Payload | Response Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/impact/analyze` | `POST` | `target_id`, `change_type`, `depth` | Computes full impact report & risk score |
| `/api/v1/impact/{id}` | `GET` | Impact Analysis ID | Fetches cached impact analysis summary |
| `/api/v1/impact/{id}/graph` | `GET` | Impact Analysis ID | Returns sub-graph nodes & contrasting edges |
| `/api/v1/impact/{id}/evidence` | `GET` | Impact Analysis ID | Returns 5-attribute evidence payload list |
| `/api/v1/impact/{id}/report` | `GET` | Impact Analysis ID | Generates exportable impact report JSON |
