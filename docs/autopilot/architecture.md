# Engineering Autopilot Architecture

## 1. Overview

CodeAtlas Engineering Autopilot connects detection, investigation, simulation, planning, human approval, sandbox execution, static/test validation, and Git PR preparation into a controlled engineering workflow.

---

## 2. 14-State Machine Diagram

```
DETECTED
   ↓
INVESTIGATING
   ↓
PLANNING
   ↓
SIMULATING
   ↓
AWAITING_APPROVAL  <--- HUMAN APPROVAL GATE
   ↓
APPROVED
   ↓
EXECUTING (Isolated Sandbox Branch)
   ↓
TESTING (Static Linter & Pytest Suite)
   ↓
VALIDATING (Plan vs Actual Diff Review)
   ↓
COMPLETED (PR Prepared)
```

---

## 3. Human-in-the-Loop Approval Model

The system operates under strict approval scope policies:
- Default: `ANALYSIS_ONLY`.
- Code modification, commit preparation, and PR creation require explicit human approval (`[ APPROVE ]`).
