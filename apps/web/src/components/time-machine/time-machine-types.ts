export interface CheckpointSnapshot {
  id: string;
  commitSha: string;
  versionTag: string;
  timestamp: string;
  authorName: string;
  message: string;
  totalLines: number;
  cyclomaticComplexity: number;
  techDebtHours: number;
  p95LatencyMs: number;
  securityScore: number;
  healthScore: number;
  nodeCount: number;
  edgeCount: number;
  eventCategory: 'release' | 'adr' | 'incident' | 'refactor' | 'migration' | 'commit';
}

export interface SideBySideDiff {
  baseSha: string;
  headSha: string;
  baseVersion: string;
  headVersion: string;
  addedServices: string[];
  removedServices: string[];
  modifiedRelationships: string[];
  techDebtDeltaHours: number;
  latencyDeltaMs: number;
  securityDeltaRating: string;
  aiComparisonSummary: string;
}

export interface EngineeringStoryCard {
  id: string;
  date: string;
  milestoneTitle: string;
  category: 'architecture' | 'cache' | 'performance' | 'microservice' | 'tech_debt';
  summary: string;
  impactMetrics: string;
  sourceCommitSha: string;
}

export interface EvolutionQA {
  id: string;
  question: string;
  answerSummary: string;
  targetTimestamp: string;
  evidenceSha: string;
  confidencePct: number;
}
