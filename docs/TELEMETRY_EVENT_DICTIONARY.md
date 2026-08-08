# CodeAtlas Privacy-Safe Product Telemetry Event Dictionary

This document defines the 20 structured, privacy-safe product telemetry events tracked in CodeAtlas v1.1.0 to measure developer onboarding, feature engagement, and activation.

---

## 1. Privacy & Data Protection Rules

> [!CAUTION]
> **STRICT PRIVACY GUARANTEE**
> - **ZERO SECRETS**: Never log passwords, tokens, API keys, credentials, or environment secrets.
> - **ZERO SOURCE CODE EXPOSURE**: Never log raw source code content, private commit messages, or confidential file contents.
> - **ANONYMIZED IDS**: All workspace and user identifiers are hashed using salt-hashed UUIDs.

---

## 2. Telemetry Event Dictionary (20 Events)

| Event Name | Category | Event Description | Payload Metadata Fields |
| :--- | :--- | :--- | :--- |
| **`signup_completed`** | Onboarding | User completes signup | `timestamp`, `session_id`, `org_id_hash` |
| **`login_completed`** | Onboarding | User authenticates | `timestamp`, `session_id`, `auth_method` |
| **`repository_connect_started`** | Workflow | Connect repo initiated | `timestamp`, `session_id`, `provider_type` |
| **`repository_connect_completed`**| Workflow | Repo connection successful | `timestamp`, `session_id`, `file_count_bucket` |
| **`analysis_started`** | Pipeline | Repo analysis queued | `timestamp`, `session_id`, `repo_id_hash` |
| **`analysis_completed`** | Pipeline | Analysis finishes successfully| `timestamp`, `session_id`, `duration_seconds` |
| **`analysis_failed`** | Pipeline | Analysis fails | `timestamp`, `session_id`, `error_category` |
| **`first_insight_viewed`** | **Activation** | User views initial insight | `timestamp`, `session_id`, `insight_type` |
| **`architecture_opened`** | Engagement | Opens architecture graph | `timestamp`, `session_id`, `node_count_bucket` |
| **`dependency_explored`** | Engagement | Expands dependency node | `timestamp`, `session_id`, `dependency_type` |
| **`search_used`** | Workflow | Executes symbol/file search | `timestamp`, `session_id`, `query_type` |
| **`investigation_started`** | Workflow | Traces execution call flow | `timestamp`, `session_id`, `call_depth` |
| **`investigation_completed`** | Workflow | Call flow trace finished | `timestamp`, `session_id`, `duration_ms` |
| **`ai_question_submitted`** | AI CTO | User asks AI CTO Advisor | `timestamp`, `session_id`, `prompt_length_bucket` |
| **`ai_answer_viewed`** | AI CTO | User reads AI CTO answer | `timestamp`, `session_id`, `evidence_links_count` |
| **`evidence_opened`** | AI CTO | User clicks source link | `timestamp`, `session_id`, `symbol_type` |
| **`simulation_started`** | Simulation | Creates hypothetical scenario| `timestamp`, `session_id`, `scenario_type` |
| **`simulation_completed`** | Simulation | Scenario diff generated | `timestamp`, `session_id`, `impact_score` |
| **`recommendation_viewed`**| Optimization| Views Level 4 proposal | `timestamp`, `session_id`, `autonomy_level` |
| **`user_returned`** | Retention | Existing user returns | `timestamp`, `session_id`, `days_since_last_visit` |
