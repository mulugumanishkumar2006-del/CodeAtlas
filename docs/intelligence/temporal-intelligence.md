# CodeAtlas v1.2 — Temporal Software Intelligence & Architecture Evolution

## Overview

The **CodeAtlas v1.2 Temporal Software Intelligence Engine** adds the dimension of **TIME** to repository software graph intelligence.

While previous versions answered:
- *"What is the system current state?"*
- *"What depends on component X?"*

CodeAtlas v1.2 Temporal Intelligence answers:
- *"HOW DID IT BECOME THIS WAY?"*
- *"WHAT CHANGED?"*
- *"WHEN DID IT CHANGE?"*
- *"WHERE IS ARCHITECTURE DRIFTING?"*
- *"WHICH AREAS ARE BECOMING RISKIER?"*

---

## Core Temporal Pipeline Architecture

```
REPOSITORY
    ↓
GIT HISTORY INGESTION (Privacy-preserving commit ingestion & secret scrubbing)
    ↓
COMMIT MODEL & HISTORICAL SNAPSHOTS ("System state at commit X")
    ↓
GRAPH EVOLUTION & ARCHITECTURE TIMELINE (Service introduced, module split, coupling shift)
    ↓
CODE TIME MACHINE & ARCHITECTURE DIFF (Compare Commit A vs Commit B)
    ↓
CO-CHANGE INTELLIGENCE ("Historical co-change" frequency & strength)
    ↓
ARCHITECTURE DRIFT & DRIFT TREND (Declared vs Observed, NEW / INCREASING / RESOLVED)
    ↓
RISK EVOLUTION & HOTSPOTS (Risk trajectories: LOW → MEDIUM → HIGH)
    ↓
TEMPORAL IMPACT & HISTORICAL SEARCH ("Blast radius evolution over time")
    ↓
HISTORICAL AI REASONING ("Why architecture changed & when dependencies appeared")
```

---

## Core Concepts & Features

### 1. Git History Ingestion & Privacy Preservation (Phases 1 & 25)
- Ingests Commit SHA, parent SHA, author metadata, timestamp, branch, commit message, changed files, added/removed lines, renames, changed symbols, changed dependencies, and configuration.
- **Secret Scrubbing**: Automatically redacts API keys, credentials, JWT tokens, and bearer tokens from historical commit diffs and commit messages (`[REDACTED_SECRET]`).
- **Privacy Preservation**: Avoids storing sensitive author PII beyond necessary git log metadata.

### 2. Historical Snapshots & Code Time Machine (Phases 3, 7 & 8)
- Generates point-in-time software graph snapshots (`/api/v1/temporal/snapshot/{repo_id}/{commit_sha}`).
- **Architecture Diff**: Compares Architecture A vs Architecture B (`/api/v1/temporal/diff`), highlighting added/removed components, boundary shifts, risk changes, and supporting evidence.

### 3. Architecture Timeline & High-Level Events (Phase 6)
Filters out commit noise and surfaces meaningful architectural events:
- `SERVICE_INTRODUCED`
- `MODULE_SPLIT`
- `SERVICE_REMOVED`
- `DEPENDENCY_ADDED`
- `API_INTRODUCED`
- `DB_DEP_CHANGED`
- `QUEUE_INTRODUCED`
- `COUPLING_CHANGED`

### 4. Co-Change Intelligence (Phase 10)
Analyzes components that repeatedly change together across commits.
- Calculates co-change frequency, shared commit lists, and strength scores.
- **Explicit Labeling**: Always explicitly labeled as **"Historical co-change"** (never confused with guaranteed structural dependencies).

### 5. Architecture Drift & Trend Tracking (Phases 11 & 12)
Compares declared architecture against observed implementation.
- Detects layer violations, unexpected couplings, circular dependencies, and boundary erosion.
- **Drift Trends**: Tracks drift state evolution (`NEW`, `STABLE`, `INCREASING`, `DECREASING`, `RESOLVED`, `UNKNOWN`).

### 6. Risk Trajectories & Change Hotspots (Phases 14 & 15)
- **Risk Trajectory**: Maps risk progression (`LOW` &rarr; `MEDIUM` &rarr; `HIGH`) based on dependency growth, coupling spikes, and drift findings.
- **Hotspots**: Highlights components with high change frequency + high dependency centrality + high risk.

### 7. Historical AI Reasoning (Phase 16)
Interprets temporal questions with strict claim separation:
- `HISTORICAL FACT`
- `OBSERVATION`
- `INFERENCE`
- `PREDICTION`
- `RECOMMENDATION`

---

## Security & Data Retention (Phases 25 & 26)

- **Tenant & Repository Isolation**: All historical snapshots and drift records are strictly isolated by Tenant ID and Repository ID.
- **Secret Protection**: Legacy credentials in past commits are never exposed.
- **Retention Lifecycle**: Follows repository disconnect and deletion lifecycle rules.
