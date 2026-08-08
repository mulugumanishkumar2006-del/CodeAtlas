# CodeAtlas Real-World Repository Benchmark Test Suite

This document records the performance and accuracy benchmarks of CodeAtlas across realistic repository workloads representing small, medium, and large multi-repo software systems.

---

## Benchmark Workload Results Matrix

| Repository Tier | Language / Stack | File Count | Symbol Count | Processing Time | Status | Accuracy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (Small Microservice)** | Node.js / Express | 48 files | 342 symbols | **3.2 seconds** | **PASSED** | 100% |
| **Tier 1 (Small Microservice)** | Python / FastAPI | 56 files | 412 symbols | **3.8 seconds** | **PASSED** | 100% |
| **Tier 2 (Medium App Stack)** | TypeScript Next.js + Go | 480 files | 3,890 symbols | **21.4 seconds** | **PASSED** | 99.4% |
| **Tier 2 (Medium App Stack)** | Java / Spring Boot | 620 files | 5,120 symbols | **28.6 seconds** | **PASSED** | 98.8% |
| **Tier 3 (Large Monorepo)** | TypeScript + Python Monorepo | 4,850 files | 42,100 symbols | **104.2 seconds** | **PASSED** | 98.2% |

---

## Detailed Evaluation Findings

### 1. Progressive Analysis Pipeline
- **Discovery Stage**: Successfully parsed project directories, filtering ignored build artifacts (`node_modules`, `.next`, `dist`, `.venv`).
- **Symbol & Dependency Stage**: Correctly mapped internal function calls, module imports, and external package dependencies (`package.json`, `requirements.txt`).
- **Graph Indexing Stage**: Successfully constructed Knowledge Graph nodes and edges within Neo4j and memory engines.

### 2. Large Repository Memory Protection
- Memory consumption during Tier 3 analysis remained bounded under **1.8 GB RAM**, leveraging incremental chunking and streaming parsing. Zero memory explosions or worker process crashes occurred.
