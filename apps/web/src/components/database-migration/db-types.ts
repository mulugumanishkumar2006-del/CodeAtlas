export interface DatabaseCommandMetrics {
  schemaHealthPct: number;
  avgQueryLatencyMs: number;
  monthlyStorageGrowthGb: number;
  migrationReadinessScore: number;
  compatibilityScorePct: number;
  dataIntegrityScorePct: number;
  replicationStatus: string;
  backupHealthPct: number;
  recoveryReadinessMttrMins: number;
  aiModernizationScorePct: number;
}

export interface MigrationPathTemplate {
  id: string;
  title: string;
  sourceEngine: string;
  targetEngine: string;
  migrationType: 'Relational -> Relational' | 'Relational -> NoSQL' | 'Relational -> Graph' | 'Relational -> Vector' | 'Cloud Migration';
  compatibilityPct: number;
  downtimeEstimateMins: number;
  complexityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  aiRecommendationNote: string;
}

export interface SchemaImpactAnalysis {
  migrationId: string;
  affectedServices: string[];
  affectedApiRoutes: string[];
  brokenQueriesCount: number;
  ormCompatibilityStatus: string;
  dataLossRiskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  performanceImpactDeltaP95: string;
  downtimeStrategy: 'Zero Downtime Dual-Write' | 'Scheduled Maintenance Window';
  rollbackComplexity: string;
}

export interface MigrationExecutionPlan {
  planId: string;
  title: string;
  preMigrationChecklist: string[];
  schemaValidationSequence: string[];
  migrationRunbookSteps: { step: number; title: string; detail: string }[];
  rollbackStrategy: string;
  postMigrationValidation: string[];
}

export interface DatabaseAdvisorQA {
  id: string;
  question: string;
  answerSummary: string;
  evidenceTelemetry: string;
  confidencePct: number;
}
