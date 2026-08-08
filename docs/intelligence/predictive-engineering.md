# Predictive Engineering Intelligence — Technical Documentation

## 1. Overview & Core Philosophy

**Predictive Engineering Intelligence** enables CodeAtlas to identify architectural risks, code hotspots, regression points, technical debt spikes, and dependency bottlenecks **BEFORE** they manifest as production incidents or breaking changes.

> **Key Rule**: Predictions are probabilistic risk warnings based on deterministic graph metrics, Git commit churn, AST cyclomatic complexity, and call graph centrality. They are **never** presented as absolute guaranteed facts.

---

## 2. Intelligence Pipeline Architecture

```
HISTORICAL SIGNALS (Git Commit Churn, Co-Change Patterns, Temporal Snapshots)
       ↓
GRAPH STRUCTURE & CODE HEALTH (WSKG Centrality, AST Complexity, Coupling Scores)
       ↓
DETERMINISTIC FEATURE EXTRACTION ENGINE (Zero ungrounded AI manufacturing)
       ↓
8 PREDICTION ENGINES (Hotspot, Change Risk, Drift, Debt, Dependency, Perf, Sec)
       ↓
CONFIDENCE & EXPLAINABILITY GENERATOR (7d, 30d, 90d Time Windows)
       ↓
PREDICTION EXPLORER UI & SIMULATION/INVESTIGATION BRIDGES
```

---

## 3. Supported Prediction Types & Deterministic Signals

| Prediction Type | Primary Deterministic Signals | Time Horizon | Default Priority |
| :--- | :--- | :---: | :---: |
| **Hotspot Risk** | High commit churn + high centrality + large consumer fan-out | 30 Days | `CRITICAL_ATTENTION` |
| **Architecture Drift** | Cross-layer boundary violations + bypass caller edges | 30 Days | `HIGH_PRIORITY` |
| **Change Risk** | Blast radius impact score + downstream caller count | 7 Days | `HIGH_PRIORITY` |
| **Technical Debt** | Cyclomatic complexity $> 30$ + duplicate AST code patterns | 90 Days | `CRITICAL_ATTENTION` |
| **Dependency Risk** | High consumer fan-out count + zero fallback isolation | 30 Days | `WATCH` |
| **Performance Risk** | Labeled `[STATIC SIGNAL]` nested loop $O(N^4)$ complexity | 30 Days | `WATCH` |
| **Security Risk** | Auth boundary exposure score + unverified claim path | 30 Days | `WATCH` |

---

## 4. Explainability Formula & Confidence Calibration

$$\text{Predicted Risk Score} = \sum_{i=1}^{K} \left( \text{Signal Value}_i \times \text{Weight}_i \right)$$

- **Confidence Calibration**: `HIGH` ($> 85\%$), `MEDIUM` ($60\% - 85\%$), `LOW` ($< 60\%$).
- **Model Version**: `v1.3.0-det-baseline`.
