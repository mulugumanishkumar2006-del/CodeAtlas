export type TwinNodeType =
  | 'repository'
  | 'microservice'
  | 'module'
  | 'package'
  | 'class'
  | 'function'
  | 'api'
  | 'database'
  | 'queue'
  | 'cache'
  | 'cloud_resource';

export type SimulationStage =
  | 'PREPARATION'
  | 'ANALYSIS'
  | 'PREDICTION'
  | 'IMPACT_CALCULATION'
  | 'RISK_EVALUATION'
  | 'VISUALIZATION'
  | 'RECOMMENDATION'
  | 'SUMMARY';

export interface DigitalTwinNode {
  id: string;
  name: string;
  nodeType: TwinNodeType;
  status: 'active' | 'added' | 'removed' | 'modified' | 'risk';
  healthScore: number;
  complexityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dependencies: string[];
  consumers: string[];
  techDebtUsd: number;
  p95LatencyMs: number;
  securityStatus: string;
  ownerTeam: string;
  aiSummary: string;
  x: number;
  y: number;
}

export interface SimulationResult {
  id: string;
  scenarioTitle: string;
  actionType: 'split' | 'replace_db' | 'add_cache' | 'remove_dep' | 'scale' | 'refactor';
  architectureComparison: {
    beforeState: string;
    afterState: string;
  };
  riskAnalysis: string;
  costEstimationUsd: number;
  performancePredictionP95: string;
  securityImpact: string;
  migrationEffortHours: number;
  rollbackStrategy: string;
  aiRecommendation: string;
  confidencePct: number;
}

export interface NaturalQueryExample {
  query: string;
  category: string;
  simulationId: string;
}
