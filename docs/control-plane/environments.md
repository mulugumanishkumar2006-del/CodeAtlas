# CodeAtlas Environment Model & Environment Graph Specification

## Supported Environments

CodeAtlas supports 6 standardized environment classifications:

1. **LOCAL**: Developers' local workstations and devcontainers.
2. **DEVELOPMENT**: Shared cloud dev clusters (e.g., AWS EKS Dev).
3. **TEST**: Automated integration and regression test environments.
4. **STAGING**: Pre-production mirror environment for simulation and load testing.
5. **PRODUCTION**: Mission-critical multi-region production clusters.
6. **CUSTOM**: User-defined dedicated testbeds or sandbox environments.

## Environment Matrix Attributes

Each environment maintains:
- `Name`: Logical environment identifier.
- `Provider`: Underlying provider (AWS EKS, GCP GKE, Azure AKS, Bare-Metal).
- `Region`: Geographic cloud regions.
- `Access policy`: RBAC / IAM integration mode.
- `Deployment policy`: Guardrails (e.g., CANARY, BLUE_GREEN, MANUAL).
- `Risk level`: LOW, MEDIUM, HIGH, CRITICAL.
- `Allowed operations`: Whitelisted actions (DEPLOY, CANARY_TEST, HOTFIX, ROLLBACK).
- `Status`: Real-time health status.

## Environment Graph (What Runs Where)

The Environment Graph links 10 core entities:
`Repository` → `Branch` → `Build` → `Artifact` → `Deployment` → `Environment` → `Service` → `Infrastructure` → `Observability` → `Team`.

It provides clear visibility into:
- What version is running in each cluster
- Who owns each service and environment
- What changes were deployed in the last execution cycle
- Environment configuration and version drift (STATIC vs RUNTIME vs UNKNOWN).
