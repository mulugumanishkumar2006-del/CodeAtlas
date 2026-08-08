# Engineering Event Model & Change Classification

## 1. Engineering Events

Classifies engineering events into:
- `COMMIT`
- `PULL_REQUEST_MERGE`
- `DEPENDENCY_CHANGE`
- `ARCHITECTURE_DRIFT`
- `SECURITY_SIGNAL`
- `RISK_CHANGE`
- `PREDICTION_CHANGE`
- `AUTOPILOT_EVENT`

---

## 2. Change Categories

- `COSMETIC`: White space / formatting changes.
- `STRUCTURAL`: Internal method refactoring.
- `ARCHITECTURAL`: Cross-boundary interface modifications.
- `DEPENDENCY`: Package version updates.
- `SECURITY`: Secret token path modifications.
