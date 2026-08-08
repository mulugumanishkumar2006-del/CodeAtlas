# CodeAtlas Policy Engine Specification

## Overview

The CodeAtlas Policy Engine provides real-time, evidence-based policy evaluation prior to any controlled operational action.

## 8-Dimensional Policy Evaluation Matrix

Every evaluation checks:
1. **WHO**: User identity, agent identity, team, and RBAC role.
2. **WHAT**: Action requested (DEPLOY, ROLLBACK, CONFIG_CHANGE, MIGRATION).
3. **WHERE**: Target environment and target service.
4. **WHEN**: Time window, maintenance window, freeze period.
5. **WHY**: Associated Change Request and architectural objective.
6. **RISK**: Evidence-backed calculated deployment risk score.
7. **POLICY**: Environment-specific rules and security policies.
8. **APPROVAL**: Required multi-role sign-offs obtained.

## Policy Outcomes

- **ALLOWED**: Operation passes all gates automatically.
- **REQUIRES APPROVAL**: Operation paused in queue awaiting mandatory human/role approval.
- **BLOCKED**: Operation rejected due to policy violation, high risk score, or active freeze window.
