# CodeAtlas Developer Journey Map & Technical Debt Evaluation

This document maps the developer experience lifecycle and prioritizes technical debt for CodeAtlas.

---

## 1. Developer Journey Map

| Journey Stage | Developer Goal | System Action | Observed Friction Point | Product Opportunity |
| :--- | :--- | :--- | :--- | :--- |
| **1. CONNECT** | Ingest repository | Clone & parse files | OAuth permission scope prompts | Add 1-click personal access token quick-fill |
| **2. ANALYZE** | Generate graph | Progressive analysis | Waiting ~100s on 5k+ file monorepos | Add granular real-time progress percentage bar |
| **3. EXPLORE** | Understand architecture | Render service graph | Large graphs feel crowded without filter | Add quick filter presets (*"API Ingress", "DB Access"*) |
| **4. INVESTIGATE**| Trace call flow | Highlight call paths | Complex call graphs require scrolling | Add 1-click focus mode on active execution path |
| **5. SIMULATE** | Model change | Generate graph diff | Comparing text diffs side-by-side | Highlight changed graph edges in contrasting colors |
| **6. IMPROVE** | Authorize fix | Level 4 approval gateway | Manual code review before approval | Provide 1-click visual code diff previewer modal |

---

## 2. Technical Debt Evaluation & Prioritization

| Debt ID | Category | Location | Description / Impact | Priority | Remediation Effort |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEBT-01** | `PERFORMANCE`| `backend/services/graph` | Memory allocation during large monorepo parsing | **P1 (High)** | Medium (Implement chunked graph streaming) |
| **DEBT-02** | `TESTING` | `tests/integration` | Missing automated integration tests for Neo4j queries | **P2 (Med)** | Low (Add mock Neo4j fixture suite) |
| **DEBT-03** | `FRONTEND` | `components/ui/graph` | Re-rendering graph canvas on window resize | **P2 (Med)** | Low (Debounce resize event listener) |
| **DEBT-04** | `DOCS` | `docs/api` | Missing OpenAPI schema generator script | **P3 (Low)** | Very Low (Export Swagger JSON spec) |
