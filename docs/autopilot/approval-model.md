# Engineering Autopilot Human Approval Model

## Approval Decision Flow

```
DEVELOPER OBJECTIVE
        ↓
ANALYSIS & VIRTUAL SIMULATION (Non-destructive)
        ↓
AWAITING_APPROVAL GATE  <--- [ APPROVE ] / [ EDIT PLAN ] / [ REJECT ]
        ↓
ISOLATED SANDBOX EXECUTION & TEST VERIFICATION
        ↓
PLAN VS ACTUAL DIFF REVIEW
        ↓
PULL REQUEST CREATION (Human-Approved Only)
```
