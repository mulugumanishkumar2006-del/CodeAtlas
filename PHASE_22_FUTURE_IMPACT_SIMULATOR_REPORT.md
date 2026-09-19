# CodeAtlas — Phase 22 Implementation Report
## Phase 22: Future Impact Simulator

**Date:** September 19, 2026  
**Status:** Completed & 100% Verified  
**Branch:** `main`

---

## 1. Executive Summary

Phase 22 implements a production-grade **Future Impact Simulator** for CodeAtlas. Developers can now ask:
> *"What happens if I change this part of the repository?"*

The simulator conducts static, deterministic impact reasoning against the repository and produces structured, explainable findings without falsely claiming to execute changes that were never run.

A fundamental design principle is the **Epistemic Triad**:
1. **Known Consequences**: Directly verified by repository AST, symbol references, and static import graphs (e.g. broken callers, compiler/import failures).
2. **Predicted Consequences**: Inferred from structural graph coupling, Martin instability metrics, architecture layer boundaries, and historical change velocity.
3. **Unknown Consequences**: Explicit identification of runtime blind spots (reflection, dynamic dispatch, unindexed clients, external third-party APIs).

---

## 2. Reused Systems & Foundation

Phase 22 builds directly upon the existing CodeAtlas architecture:
- **Phase 19 (Impact Analysis)**: Normalized target resolution across 9 entity types (`FILE`, `SYMBOL`, `CLASS`, `FUNCTION`, `METHOD`, `MODULE`, `API`, `DEPENDENCY`, `COMPONENT`), upstream/downstream graph traversal, direct callers, callees, and test mapping.
- **Phase 18 (Advanced Architecture Intelligence)**: Component boundaries, data flow paths, Afferent/Efferent coupling, and instability metrics.
- **Phase 20 (Code Time Machine)**: Historical file churn, author concentration, and rename history (`--follow`).
- **Phase 21 (Technical Debt & Risk Intelligence)**: Multi-signal risk scores, engineering hotspots, and risk propagation.
- **Phase 9 (Repository Q&A / RAG)**: Integration of `SIMULATION` intent to retrieve simulation models when developers ask what-if questions in natural language.
- **Database (`simulations` table)**: Persistence of simulation parameters and results with strict repository isolation.

---

## 3. Core Capabilities Implemented

### 3.1 Natural-Language Intent Parser
- Extracts operations: `REMOVE`, `RENAME`, `SIGNATURE_CHANGE`, `MOVE`, `DEPENDENCY_REMOVE`, `DEPENDENCY_REPLACE`, `API_CHANGE`, `MODULE_SPLIT`, `MODULE_MERGE`, `MODIFY`.
- Detects targets and parameters (e.g., `new_name`, `new_path`, `replacement`).
- Explicitly flags ambiguous questions (e.g. *"What happens if I change it?"*) with `requires_clarification=True` and actionable prompts instead of hallucinating targets.

### 3.2 Epistemic Triad Categorization
- **Known**: Specific call sites and line numbers that will fail; broken import statements; verified test files.
- **Predicted**: Downstream orphan components; architectural layer boundary violations; elevated risk when touching engineering hotspots.
- **Unknown**: Runtime reflection, dynamic dictionary dispatch, network latency changes, external clients.

### 3.3 Hypothetical Before / After Structural Model
- Side-by-side diff comparing current nodes and simulated nodes.
- Status tagging on nodes (`UNCHANGED`, `MODIFIED`, `REMOVED`, `REDIRECTED`, `ADDED`) and edges (`ACTIVE`, `BROKEN`, `REQUIRES_UPDATE`, `HYPOTHETICAL`).
- Textual diff summary detailing structural transformations.

### 3.4 Deterministic Validation Checklist
- Generates actionable verification steps prior to landing changes:
  - Specific test files to execute.
  - Affected API endpoints to smoke-test.
  - Static type checking validation for callers.
  - Integration and regression suite recommendations.

### 3.5 Simulation Persistence & Strict Repository Isolation
- Full CRUD operations scoped to `repository_id`.
- Repositories cannot access, list, or delete simulations belonging to other repositories.

---

## 4. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/repositories/{id}/simulations` | Runs static change simulation and persists result to database |
| `GET` | `/api/v1/repositories/{id}/simulations` | Lists past simulation runs strictly scoped to the repository |
| `GET` | `/api/v1/repositories/{id}/simulations/{sim_id}` | Retrieves a saved simulation by ID with repository isolation |
| `DELETE` | `/api/v1/repositories/{id}/simulations/{sim_id}` | Deletes a saved simulation record |
| `POST` | `/api/v1/repositories/{id}/simulations/target` | Interactive preview simulation without saving to database |

---

## 5. Frontend UI (`SimulationView.tsx`)

Added as a top-level tab in `WorkspaceNav` and `RepositoryDetail`:
- **Change Proposal Bar**: Input field with sample template chips (`Remove module`, `Rename symbol`, `Change signature`, `Replace dependency`, `Split module`).
- **Epistemic Triad Cards**: Color-coded panels for Known (emerald), Predicted (amber), and Unknown (rose).
- **Before / After Diff Tab**: Visual structural model and text diff summary.
- **Affected Tests & APIs Tab**: Clickable test files with source code navigation; exposed API routes.
- **Validation Checklist Tab**: Interactive checkboxes tracking verification steps.
- **Past Simulations Drawer**: Quick browsing, loading, and deletion of historical simulations.

---

## 6. Verification Results

- **Frontend Compilation**: `tsc && vite build` succeeded with 0 errors (1,827 modules transformed in 3.42s).
- **Phase 22 Automated Tests**: 5/5 tests passed in 5.91s (`backend/tests/test_phase22_future_impact_simulator.py`).
- **Full Regression Suite (Phases 19–22)**: 34/34 tests passed in 28.69s:
  - Phase 19 Impact Analysis: 7/7 PASSED
  - Phase 20 Code Time Machine: 9/9 PASSED
  - Phase 21 Technical Debt & Risk: 13/13 PASSED
  - Phase 22 Future Impact Simulator: 5/5 PASSED
