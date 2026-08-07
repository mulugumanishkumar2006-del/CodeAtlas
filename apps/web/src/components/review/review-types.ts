export type ReviewSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ReviewCategory =
  | 'architecture'
  | 'security'
  | 'performance'
  | 'correctness'
  | 'clean_code'
  | 'tech_debt'
  | 'testing'
  | 'documentation';

export type ReviewTargetType =
  | 'pr'
  | 'commit'
  | 'branch'
  | 'file'
  | 'class'
  | 'function'
  | 'module'
  | 'service'
  | 'api'
  | 'db_migration'
  | 'config'
  | 'infra'
  | 'arch'
  | 'release_candidate';

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'IN_REVIEW';

export interface InterEngineLink {
  engine:
    | 'doc_engineer'
    | 'architecture_intelligence'
    | 'ai_investigation'
    | 'simulation_studio'
    | 'knowledge_graph'
    | 'tech_debt'
    | 'security'
    | 'performance';
  label: string;
  url: string;
  badge?: string;
}

export interface SmartFixSuggestion {
  explanation: string;
  targetFile: string;
  startLine: number;
  endLine: number;
  originalCodeSnippet: string;
  fixedCodeSnippet: string;
  applyable: boolean;
}

export interface DesignAlternative {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  complexity: 'Low' | 'Medium' | 'High';
  effortHours: number;
}

export interface SmartReviewComment {
  id: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  title: string;
  category: ReviewCategory;
  severity: ReviewSeverity;
  aiConfidence: number; // e.g. 98.4
  
  problemDescription: string;
  evidenceSnippet: string;
  affectedFiles: string[];
  
  architectureContext: string;
  businessImpact: string;
  engineeringImpact: string;
  
  suggestedFix?: SmartFixSuggestion;
  alternativeSolutions?: DesignAlternative[];
  
  relatedDocLink?: InterEngineLink;
  relatedAdrLink?: InterEngineLink;
  relatedInvestigationLink?: InterEngineLink;
  relatedSimulationLink?: InterEngineLink;
  
  resolved: boolean;
  pinned?: boolean;
  author: {
    name: string;
    avatar: string;
    role: string;
    isAI: boolean;
  };
  createdAt: string;
}

export interface CodeDiffFile {
  id: string;
  oldPath: string;
  newPath: string;
  status: 'modified' | 'added' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  diffHunks: {
    header: string;
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    lines: {
      type: 'add' | 'delete' | 'context';
      oldLineNumber?: number;
      newLineNumber?: number;
      content: string;
    }[];
  }[];
}

export interface PerformancePrediction {
  metric: string;
  beforeValue: string;
  afterValue: string;
  unit: string;
  changePct: number;
  isImprovement: boolean;
  explanation: string;
}

export interface SecurityOwaspItem {
  owaspId: string;
  title: string;
  riskLevel: ReviewSeverity;
  evidenceLine: string;
  fixRecommendation: string;
  verificationChecklist: string[];
}

export interface PreApprovalSimulation {
  architectureImpactScore: number; // e.g. 96/100
  performanceImpactScore: number; // e.g. 92/100
  securityImpactScore: number; // e.g. 98/100
  dependencyRiskScore: number; // e.g. 15/100 (lower is better)
  techDebtDeltaHours: number; // e.g. -12h (negative means debt reduced)
  deploymentRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  sideBySideComparison: {
    dimension: string;
    beforeState: string;
    afterState: string;
    status: 'improved' | 'degraded' | 'neutral';
  }[];
}

export interface ReviewScorecard {
  overallScore: number; // e.g. 94
  architectureScore: number; // e.g. 92
  securityScore: number; // e.g. 98
  performanceScore: number; // e.g. 88
  maintainabilityScore: number; // e.g. 95
  documentationScore: number; // e.g. 90
  testQualityScore: number; // e.g. 91
  techDebtImpactHours: number; // e.g. -8
  deploymentReadiness: 'READY' | 'NEEDS_REVISION' | 'BLOCKED';
}

export interface CodeReviewTarget {
  id: string;
  title: string;
  description: string;
  targetType: ReviewTargetType;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  branch: string;
  baseBranch: string;
  commitHash: string;
  createdAt: string;
  status: ReviewStatus;
  scorecard: ReviewScorecard;
  files: CodeDiffFile[];
  comments: SmartReviewComment[];
  performancePredictions: PerformancePrediction[];
  securityOwaspItems: SecurityOwaspItem[];
  preApprovalSimulation: PreApprovalSimulation;
  assignedReviewers: { name: string; avatar: string; role: string; approved: boolean }[];
}

export type ReviewRolePerspective = 'Developer' | 'Tech Lead' | 'Staff Engineer' | 'Principal Engineer' | 'Engineering Manager' | 'Director' | 'CTO';

export type ReviewModeType =
  | 'Overall Architecture'
  | 'Scalability'
  | 'Performance'
  | 'Security'
  | 'Reliability'
  | 'Maintainability'
  | 'Developer Experience'
  | 'Cloud Readiness'
  | 'Microservices'
  | 'Event Driven'
  | 'Domain Driven Design'
  | 'Clean Architecture'
  | 'Hexagonal Architecture'
  | 'CQRS'
  | 'Event Sourcing'
  | 'Layered Architecture'
  | 'Monolith'
  | 'Modular Monolith'
  | 'Serverless'
  | 'Kubernetes'
  | 'Platform Engineering'
  | 'Repository Organization'
  | 'API Design'
  | 'Database Design';

export interface ScorecardDimension {
  name: string;
  scorePct: number;
  previousScorePct: number;
  status: 'Excellent' | 'Good' | 'Warning' | 'Critical';
  analysis: string;
  frameworkPillar: string;
}

export interface DesignOption {
  optionName: string;
  title: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  complexity: 'Low' | 'Medium' | 'High';
  estimatedCost: string;
  effortHours: number;
  riskReductionPct: number;
  scalabilityRating: 'Good' | 'Excellent' | 'Fair';
}

export interface ReviewFinding {
  id: string;
  title: string;
  category: 'Architecture Smell' | 'Layer Violation' | 'Bottleneck' | 'Security Risk';
  severity: 'Critical' | 'High' | 'Medium';
  affectedComponent: string;
  evidence: string;
  frameworkMapping: string;
  businessImpact: string;
  designOptions: DesignOption[];
}
