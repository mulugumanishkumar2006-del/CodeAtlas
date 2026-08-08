# CODEATLAS v1.2.0-rc1 — RELEASE CANDIDATE NOTES

**Release Date**: August 8, 2026  
**Target Environment**: Production / Staging  
**Build Status**: GREEN (Scorecard 100%)

---

## What's New in v1.2.0-rc1

### 1. Evidence-Grounded AI Engineering Reasoning Engine
- **Structured Reasoning Contract**: Answers enforce standard sections (`SUMMARY`, `KNOWN FACTS`, `EVIDENCE`, `ANALYSIS`, `POTENTIAL IMPACT`, `RISKS`, `UNCERTAINTIES`, `RECOMMENDATION`, `VALIDATION STEPS`, `SOURCES`).
- **5 Claim Types**: Explicitly separates `FACT`, `INFERENCE`, `PREDICTION`, `RECOMMENDATION`, and `UNKNOWN`.
- **17 Engineering Intents**: Detects intent automatically and executes specialized pipelines for Root Cause, Debugging, Architecture, Security, Performance, Change Planning, Code Review, and Migration.
- **Reasoning Validator**: Downgrades or flags unevidenced claims automatically.

### 2. Temporal Software Intelligence & Architecture Evolution
- **Code Time Machine**: Inspect repository graph and architecture states at any historical commit SHA.
- **Architecture Diff**: Compares Architecture A vs Architecture B diffing added/removed components, dependencies, boundary changes, and risk shifts.
- **Co-Change Intelligence**: Computes co-changing file pairs explicitly labeled as **"Historical co-change"**.
- **Architecture Drift & Trends**: Evaluates declared vs observed architecture and tracks drift trends (`NEW`, `STABLE`, `INCREASING`, `DECREASING`, `RESOLVED`).

### 3. Advanced Engineering Simulation Studio
- **Virtual Graph Engine**: Evaluates *"What happens if I make this change?"* over isolated in-memory graphs without modifying real repository code.
- **Projected Risk & Impact**: Compares $Current\ Risk \rightarrow Simulated\ Risk$ and surfaces breaking change risks.
- **Multi-Option Scenario Comparison**: Side-by-side comparison of Option A vs Option B vs Option C with explainable recommendations.
- **Non-Destructive Validation Checklist**: Provides recommended unit/integration test commands and migration checks.

### 4. Production Hardening, Observability & Security
- **Consistent Error Taxonomy**: 12 standard error codes without stack/secret leaks.
- **Production Hardening Middleware**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, and automated secret redaction.
- **Automated Smoke Testing & Scorecard**: `/api/v1/release/smoke-test` and `/api/v1/release/scorecard` endpoints.

---

## Migration & Deployment Guide

1. Pull images: `docker compose pull`
2. Run migrations: `alembic upgrade head`
3. Restart containers: `docker compose up -d`
4. Execute readiness probe: `curl http://localhost:8000/api/v1/release/health/readiness`
