# CodeAtlas Incident Response Process & Protocol

This document establishes the official 7-stage Incident Response Protocol for SREs, Platform Engineers, and On-Call Engineers operating CodeAtlas in production environments.

---

## 7-Stage Incident Lifecycle

```
[1. DETECT] → [2. TRIAGE] → [3. CONTAIN] → [4. RECOVER] → [5. VALIDATE] → [6. COMMUNICATE] → [7. POSTMORTEM]
```

---

### Stage 1: Detection & Alerting
- Incidents are detected automatically via `/health/ready` probe failures, Prometheus/Datadog metric alerts, or user reports via `BetaFeedbackModal`.

### Stage 2: Triage & Severity Classification
- **P0 (CRITICAL)**: Total platform outage, database unhealthiness, data corruption, or security breach. Response SLA: **< 15 minutes**.
- **P1 (HIGH)**: Degraded repository analysis, worker queue backlog (>500 tasks), or API latency spikes (>2s). Response SLA: **< 30 minutes**.
- **P2 (MEDIUM)**: Non-critical feature failure, search degradation, or external LLM rate limits. Response SLA: **< 2 hours**.
- **P3 (LOW)**: Minor cosmetic UI defect or non-breaking bug. Response SLA: Next sprint.

### Stage 3: Containment
- Isolate affected service components without destroying evidence logs.
- If worker queue backpressure occurs, scale background workers horizontally (`docker compose scale worker=4`).
- If security violation occurs, revoke affected OAuth tokens or API keys immediately.

### Stage 4: Recovery
- Reference the corresponding operational runbook from [OPERATIONAL_RUNBOOKS_CATALOG.md](file:///c:/Users/mulug/OneDrive/ドキュメント/Desktop/CodeAtlas/docs/OPERATIONAL_RUNBOOKS_CATALOG.md).
- If deployment bug is detected, execute emergency rollback to the previous stable release SHA.

### Stage 5: Validation
- Verify health status via `/api/v1/health/ready` and execute post-incident smoke test.

### Stage 6: Communication
- Post incident status updates to internal engineering channels and public status page.

### Stage 7: Postmortem
- Complete a blameless postmortem using [POSTMORTEM_TEMPLATE.md](file:///c:/Users/mulug/OneDrive/ドキュメント/Desktop/CodeAtlas/docs/POSTMORTEM_TEMPLATE.md) within 48 hours.
