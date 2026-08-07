import {
  DatabaseCommandMetrics,
  MigrationPathTemplate,
  SchemaImpactAnalysis,
  MigrationExecutionPlan,
  DatabaseAdvisorQA,
} from './db-types';

export const MOCK_DB_COMMAND_METRICS: DatabaseCommandMetrics = {
  schemaHealthPct: 96.5,
  avgQueryLatencyMs: 18.0,
  monthlyStorageGrowthGb: 420,
  migrationReadinessScore: 94,
  compatibilityScorePct: 98.0,
  dataIntegrityScorePct: 100.0,
  replicationStatus: 'Active (3 Read Replicas Healthy)',
  backupHealthPct: 100.0,
  recoveryReadinessMttrMins: 1.8,
  aiModernizationScorePct: 95.0,
};

export const MOCK_MIGRATION_TEMPLATES: MigrationPathTemplate[] = [
  {
    id: 'mig-ora-pg',
    title: 'Oracle Database -> AWS Aurora PostgreSQL',
    sourceEngine: 'Oracle 19c PL/SQL',
    targetEngine: 'AWS Aurora PostgreSQL 15.4',
    migrationType: 'Relational -> Relational',
    compatibilityPct: 96.0,
    downtimeEstimateMins: 0,
    complexityLevel: 'MEDIUM',
    description: 'Convert PL/SQL stored procedures and triggers to PostgreSQL PL/pgSQL with AWS SCT.',
    aiRecommendationNote: 'RECOMMENDED. Cuts annual database licensing costs by 78% with identical ACID guarantees.',
  },
  {
    id: 'mig-my-pg',
    title: 'MySQL 8.0 -> PostgreSQL 15.4',
    sourceEngine: 'MySQL 8.0 InnoDB',
    targetEngine: 'PostgreSQL 15.4',
    migrationType: 'Relational -> Relational',
    compatibilityPct: 98.5,
    downtimeEstimateMins: 0,
    complexityLevel: 'LOW',
    description: 'Migrate MySQL schema, indexes, and JSON column types to PostgreSQL with pgloader.',
    aiRecommendationNote: 'HIGHLY RECOMMENDED for rich JSONB indexing and async SQLAlchemy 2.0 ORM.',
  },
  {
    id: 'mig-rel-vector',
    title: 'Relational Schema -> PostgreSQL pgvector (Vector AI)',
    sourceEngine: 'PostgreSQL Text Queries',
    targetEngine: 'PostgreSQL + pgvector extension',
    migrationType: 'Relational -> Vector',
    compatibilityPct: 100.0,
    downtimeEstimateMins: 0,
    complexityLevel: 'LOW',
    description: 'Add vector embeddings (1536-dim) to support AI semantic code search in CodeAtlas.',
    aiRecommendationNote: 'ESSENTIAL FOR AI COPILOT. 100% backward compatible extension in same database.',
  },
  {
    id: 'mig-rel-graph',
    title: 'Relational Foreign Keys -> Neo4j Cypher Graph',
    sourceEngine: 'PostgreSQL Relational FKs',
    targetEngine: 'Neo4j Graph Database v5',
    migrationType: 'Relational -> Graph',
    compatibilityPct: 94.0,
    downtimeEstimateMins: 0,
    complexityLevel: 'MEDIUM',
    description: 'Export relational foreign key dependency trees into Neo4j Cypher dependency graph.',
    aiRecommendationNote: 'AUTHORIZATION: ADR-0042 approved hybrid graph storage model for topology queries.',
  },
];

export const MOCK_IMPACT_ANALYSIS: SchemaImpactAnalysis = {
  migrationId: 'mig-ora-pg',
  affectedServices: ['svc-payment-core', 'svc-auth-router', 'UserRepositoryDAL'],
  affectedApiRoutes: ['/api/v1/checkout', '/api/v1/users/lookup', '/api/v1/billing/ledger'],
  brokenQueriesCount: 0,
  ormCompatibilityStatus: '100% SQLAlchemy 2.0 & Prisma ORM Compatible',
  dataLossRiskLevel: 'NONE',
  performanceImpactDeltaP95: '180ms -> 24.2ms P95 latency drop (86% speedup)',
  downtimeStrategy: 'Zero Downtime Dual-Write',
  rollbackComplexity: 'Instantaneous (Istio canary VirtualService traffic drain)',
};

export const MOCK_EXECUTION_PLAN: MigrationExecutionPlan = {
  planId: 'plan-db-482',
  title: 'Oracle -> AWS Aurora PostgreSQL Zero-Downtime Migration Plan',
  preMigrationChecklist: [
    'Verify AWS Schema Conversion Tool (SCT) PL/pgSQL stored procedure mappings',
    'Provision AWS Aurora PostgreSQL 15.4 multi-AZ primary cluster',
    'Enable AWS Database Migration Service (DMS) CDC continuous replication',
    'Execute shadow read benchmarking on staging environment',
  ],
  schemaValidationSequence: [
    'Validate 100% table DDL definitions and composite indexes',
    'Verify foreign key cascade constraints',
    'Audit JSONB column GIN index performance',
  ],
  migrationRunbookSteps: [
    { step: 1, title: 'Deploy Dual-Write Adapter', detail: 'Deploy PaymentService dual-write proxy routing writes to both Oracle and Aurora PostgreSQL.' },
    { step: 2, title: 'CDC Replication Catchup', detail: 'Verify AWS DMS CDC replication lag is < 50ms.' },
    { step: 3, title: 'Switch Shadow Reads', detail: 'Route 10% of read traffic to Aurora PostgreSQL via Istio VirtualService.' },
    { step: 4, title: 'Promote PostgreSQL Primary', detail: 'Switch 100% read/write traffic to Aurora PostgreSQL. Decommission Oracle master.' },
  ],
  rollbackStrategy: 'If DMS replication lag exceeds 5,000ms or P95 latency spikes above 100ms, revert Istio VirtualService route target to Oracle master within 10 seconds.',
  postMigrationValidation: [
    'Audit row count checksums across all 48 database tables',
    'Verify zero unhandled SQL exceptions in Prometheus telemetry logs',
    'Confirm P95 response latency is < 25ms on /api/v1/checkout',
  ],
};

export const MOCK_DB_ADVISOR_QA: DatabaseAdvisorQA[] = [
  {
    id: 'dba-1',
    question: 'Should we migrate Oracle PL/SQL to AWS Aurora PostgreSQL?',
    answerSummary: 'Yes. AWS Aurora PostgreSQL (Scenario B) delivers 96% schema compatibility, reduces annual database licensing costs by 78%, and drops checkout P95 latency from 180ms to 24.2ms.',
    evidenceTelemetry: 'AWS SCT schema validation confirmed 0 broken ORM queries across 48 relational tables.',
    confidencePct: 98.4,
  },
  {
    id: 'dba-2',
    question: 'Will this database migration require any production downtime?',
    answerSummary: 'Zero downtime. By utilizing AWS DMS CDC continuous replication and Istio VirtualService canary traffic draining, the migration completes with 0.0 minutes of downtime.',
    evidenceTelemetry: 'Dual-write proxy simulation verified zero data loss during shadow replication.',
    confidencePct: 99.2,
  },
];
