# Incident Postmortem: [INCIDENT TITLE]

**Incident Date**: YYYY-MM-DD  
**Severity**: P0 / P1 / P2  
**Incident Commander**: [Name]  
**Lead Investigator**: [Name]  
**Affected Services**: Backend API / Database / Workers / Frontend  

---

## 1. Executive Summary
Provide a brief 3-sentence summary of what happened, user impact, and resolution.

---

## 2. User & Business Impact
- **Downtime Duration**: XX minutes
- **Impacted Users**: XX% of active workspace sessions
- **Failed Requests**: XX request failures logged with `X-Correlation-ID`

---

## 3. Chronological Incident Timeline (UTC)
- **HH:MM** - Incident detected via `/health/ready` probe alert.
- **HH:MM** - Incident Commander assigned & triage initiated.
- **HH:MM** - Mitigation executed (e.g. worker pool autoscale / image rollback).
- **HH:MM** - Service restored and readiness score verified at 98.5%.

---

## 4. Root Cause Analysis (5 Whys)
1. **Why did the failure occur?** [Answer]
2. **Why was the trigger triggered?** [Answer]
3. **Why did default safety controls fail?** [Answer]
4. **Why was detection delayed/prompt?** [Answer]
5. **What underlying systemic factor allowed this?** [Answer]

---

## 5. Preventative Action Items

| Action Item | Owner | Target Date | Status |
| :--- | :--- | :--- | :--- |
| Add additional health probe check for memory pressure | On-Call Lead | YYYY-MM-DD | OPEN |
| Update deployment rollback runbook | DevOps Lead | YYYY-MM-DD | COMPLETED |
