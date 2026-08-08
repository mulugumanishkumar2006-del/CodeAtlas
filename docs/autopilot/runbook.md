# Engineering Autopilot Operations Runbook

## 1. Initiating an Autopilot Run

Run the initiation endpoint or trigger via UI:
`POST /api/v1/autopilot/initiate`

## 2. Reviewing & Granting Approval

Review plan summary and simulation results, then grant scope permissions:
`POST /api/v1/autopilot/approve`

## 3. Monitoring Sandbox Execution & Audit Logs

Track live step progress via:
`GET /api/v1/autopilot/run/{run_id}`
