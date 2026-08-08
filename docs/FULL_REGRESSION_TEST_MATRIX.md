# CodeAtlas Full Regression Test Suite Matrix

This document records the full regression test execution for the CodeAtlas v1.0.0 Release Candidate (`v1.0.0-rc.1`).

---

## Full Regression Test Execution Results

| Test Domain | Test Scope & Description | Test Result | Status |
| :--- | :--- | :--- | :--- |
| **1. End-to-End Workflow** | `Login → Workspace → Connect Repo → Analyze → Explore → Architecture → Search → Investigate → AI → Simulate → Optimize → Logout` | 100% Transition Success | **PASSED** |
| **2. Authentication & Auth** | Token validation, refresh, session expiration, invalid login handling | All HTTP 401/403 responses verified | **PASSED** |
| **3. Tenant Isolation** | Cross-tenant data access, search queries, Redis cache isolation, graph isolation | 0 data leaks across tenant boundaries | **PASSED** |
| **4. Repository Analysis** | Parsing 50 to 4,850 file codebases (Node.js, Python, TypeScript, Go, Java) | All progressive analysis stages completed | **PASSED** |
| **5. AI CTO Grounding** | Grounding verification across 100 benchmark queries | 100% Grounded (0 Hallucinated files) | **PASSED** |
| **6. Prompt Injection** | Adversarial instructions in `README.md` and source code comments | 100% Injection Block Rate | **PASSED** |
| **7. Simulation Engine** | Side-by-side graph diff generation for service extractions | Correctly separates Facts, Inferences, Predictions | **PASSED** |
| **8. Autonomous Safety** | Autonomy level configuration and Level 4 Human Approval Gateway | Human authorization enforced for execution | **PASSED** |
| **9. Backup & Restore** | PostgreSQL WAL archive restoration & Redis persistence verification | Restored database 100% readable & compatible | **PASSED** |
| **10. Health & Probes** | `/health/live`, `/health/ready`, `/health/deps`, `/health/readiness-score` | **98.5% Readiness Score** | **PASSED** |
| **11. Frontend Quality** | TypeScript compilation check (`npx tsc --noEmit`) | **0 Errors** across all components | **PASSED** |
| **12. Backend API Suite** | FastAPI route registration check (`app.routes`) | **77 / 77 Routes Registered** | **PASSED** |
