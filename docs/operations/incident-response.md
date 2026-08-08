# CodeAtlas v1.2 — Production Incident Response Standard

## Incident Response Lifecycle

```
DETECT → TRIAGE → CONTAIN → RECOVER → VERIFY → DOCUMENT
```

---

## 1. Severity Classification Matrix

| Severity Level | Definition | Response SLA | On-Call Action |
| :--- | :--- | :--- | :--- |
| **P1 — CRITICAL** | Total system outage, DB failure, or tenant data leakage | < 15 mins | Immediate wake-up, initiate Rollback or Failover |
| **P2 — HIGH** | AI provider down, Worker queue deadlock, or search degradation | < 30 mins | Switch provider fallback mode or restart workers |
| **P3 — MEDIUM** | Isolated single-user error or non-blocking UI glitch | < 2 hours | Investigate logs and apply bugfix patch |
| **P4 — LOW** | Documentation typo or cosmetic formatting issue | < 24 hours | Log issue in backlog |

---

## 2. Standard Operating Procedures by Stage

### Stage 1: DETECT
- Automated PagerDuty alert triggered via `/api/v1/release/health/readiness` probe failure.

### Stage 2: TRIAGE
- Inspect correlation ID in central logs:
  ```bash
  docker compose logs --tail=200 backend | grep "correlation_id"
  ```

### Stage 3: CONTAIN
- If security anomaly or prompt injection attempt is detected:
  - Block source IP address via cloud WAF.
  - Revoke affected session tokens.

### Stage 4: RECOVER
- Follow incident playbook instructions in [incident-playbooks.md](file:///c:/Users/mulug/OneDrive/ドキュメント/Desktop/CodeAtlas/docs/operations/incident-playbooks.md).

### Stage 5: VERIFY
- Execute release smoke test:
  ```bash
  curl -X POST http://localhost:8000/api/v1/release/smoke-test?repository_id=demo-repo
  ```

### Stage 6: DOCUMENT
- Create Post-Mortem incident document detailing Root Cause, Timeline, Resolution, and Prevention Items.
