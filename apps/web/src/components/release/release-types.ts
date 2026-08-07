export type DeploymentRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReleaseStageId =
  | 'planning'
  | 'development'
  | 'review'
  | 'testing'
  | 'simulation'
  | 'approval'
  | 'deployment'
  | 'monitoring'
  | 'validation'
  | 'rollback';

export type StageStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'WARNING' | 'FAILED';

export interface InterSystemLink {
  subsystem:
    | 'mission_control'
    | 'cto_workspace'
    | 'investigation_engine'
    | 'refactoring_planner'
    | 'doc_engineer'
    | 'code_review'
    | 'repository_explorer'
    | 'architecture_intelligence'
    | 'knowledge_graph'
    | 'dependency_intelligence'
    | 'monitoring'
    | 'tech_debt'
    | 'performance'
    | 'security'
    | 'simulation_studio'
    | 'copilot';
  label: string;
  url: string;
  badge?: string;
}

export interface ReleaseScorecard {
  readinessScore: number; // e.g. 96/100
  deploymentRisk: DeploymentRiskLevel;
  architectureHealthPct: number; // e.g. 94%
  performancePredictionMs: number; // e.g. 24.2ms
  securityReadinessPct: number; // e.g. 100%
  techDebtDeltaHours: number; // e.g. -18h
  breakingChangeRiskCount: number; // e.g. 0
  repositoryHealthPct: number; // e.g. 98%
  rollbackConfidencePct: number; // e.g. 99.2%
  overallAiConfidencePct: number; // e.g. 99.6%
}

export interface TimelineStage {
  id: ReleaseStageId;
  name: string;
  description: string;
  status: StageStatus;
  startedAt: string;
  completedAt?: string;
  duration: string;
  aiRecommendation: string;
  evidenceItems: string[];
}

export interface ServiceRiskNode {
  serviceId: string;
  serviceName: string;
  tier: 'tier-1' | 'tier-2' | 'tier-3';
  riskScore: number; // e.g. 12 (lower is better)
  riskLevel: DeploymentRiskLevel;
  failurePropagationImpact: string;
  dependencies: string[];
  status: 'HEALTHY' | 'STRESS_TESTED' | 'REQUIRES_MONITORING';
}

export interface PreDeploymentDelta {
  category: string;
  beforeState: string;
  afterState: string;
  riskAssessment: string;
  impactLevel: 'SAFE' | 'LOW_RISK' | 'NEEDS_VERIFICATION' | 'HIGH_RISK';
}

export interface RollbackStep {
  stepNumber: number;
  action: string;
  targetService: string;
  commandSnippet: string;
  estimatedDurationSec: number;
  automated: boolean;
}

export interface RollbackIntelligencePlan {
  planId: string;
  rollbackOrder: RollbackStep[];
  affectedServices: string[];
  estimatedRecoveryTimeMinutes: number; // e.g. 1.8 mins
  riskAnalysis: string;
  alternativeRecoveryOptions: {
    strategyName: string;
    description: string;
    recoveryTimeMin: number;
    dataLossRisk: string;
  }[];
  postmortemTemplate: {
    incidentTitle: string;
    rootCauseCategory: string;
    severity: string;
    mitigationSummary: string;
    preventativeActions: string[];
  };
  recoveryChecklist: { task: string; verified: boolean }[];
}

export interface AIDeploymentAdvice {
  question: string;
  verdict: 'DEPLOY_NOW' | 'PROCEED_WITH_CAUTION' | 'POSTPONE_RELEASE';
  deploymentRecommendation: string;
  keyEvidence: string[];
  biggestRiskFactor: string;
  highestRiskService: string;
  aiConfidencePct: number;
}

export interface ReleaseCandidate {
  id: string; // e.g. "v4.8.0-rc2"
  name: string;
  version: string;
  targetEnvironment: 'production' | 'staging' | 'canary';
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  gitBranch: string;
  commitHash: string;
  createdAt: string;
  
  scorecard: ReleaseScorecard;
  timelineStages: TimelineStage[];
  serviceRiskNodes: ServiceRiskNode[];
  preDeploymentDeltas: PreDeploymentDelta[];
  rollbackPlan: RollbackIntelligencePlan;
  deploymentAdvice: AIDeploymentAdvice;
  interSystemLinks: InterSystemLink[];
}
