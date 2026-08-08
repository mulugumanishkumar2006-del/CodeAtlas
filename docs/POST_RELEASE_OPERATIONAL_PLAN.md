# CodeAtlas Post-Release Operational Plan & Hotfix Policy

This document details operational monitoring procedures, incident escalation, and hotfix policies following the production release of CodeAtlas v1.0.0.

---

## 1. First 24-Hour Post-Release Watch

During the initial 24-hour launch window, SREs and DevOps leads maintain continuous watch on the following operational signals:

| Signal | Target Threshold | Action if Threshold Exceeded |
| :--- | :--- | :--- |
| **API Error Rate (5xx)** | < 0.1% | Trigger P1 Alert; investigate via `X-Correlation-ID` logs |
| **API p95 Latency** | < 500ms | Enable Redis query caching; inspect slow PostgreSQL queries |
| **Readiness Probe Score** | > 95.0% | Reference [RUNBOOK_DATABASE_DOWN](file:///c:/Users/mulug/OneDrive/ドキュメント/Desktop/CodeAtlas/docs/OPERATIONAL_RUNBOOKS_CATALOG.md) or [RUNBOOK_REDIS_DOWN](file:///c:/Users/mulug/OneDrive/ドキュメント/Desktop/CodeAtlas/docs/OPERATIONAL_RUNBOOKS_CATALOG.md) |
| **Worker Queue Depth** | < 100 tasks | Autoscale Celery worker count (`docker compose scale worker=4`) |
| **AI LLM Outages** | 0 Blocked Requests | CodeAtlas automatically falls back to local Knowledge Graph intelligence |

---

## 2. Post-Release Hotfix Policy (v1.0.1)

- **P0 / P1 Hotfixes**: Addressed immediately via emergency patch release (`v1.0.1`). Only bug, security, or reliability fixes are permitted.
- **P2 / P3 Maintenance**: Scheduled into minor patch releases.
- **No Unvalidated Features**: Unvalidated feature additions are strictly prohibited during the stabilization phase.

---

## 3. Post-Launch Feedback & v1.1 Decision Criteria

Feedback collected via `BetaFeedbackModal` will be evaluated against:
1. Frequency of user friction reports.
2. Real user time-to-insight metrics on new repository connections.
3. Actual developer activation and weekly retention rates.
