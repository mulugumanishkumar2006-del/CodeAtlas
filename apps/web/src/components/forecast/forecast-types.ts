export type RiskImpactLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RadarCategory =
  | 'architecture'
  | 'security'
  | 'performance'
  | 'scalability'
  | 'maintainability'
  | 'tech_debt'
  | 'infrastructure'
  | 'developer_productivity'
  | 'repository_health'
  | 'business_continuity';

export type ForecastReportType =
  | 'weekly_engineering'
  | 'monthly_architecture'
  | 'quarterly_tech_debt'
  | 'release_success'
  | 'infrastructure_forecast'
  | 'executive_outlook'
  | 'repository_growth'
  | 'technology_adoption';

export interface InterSystemLink {
  subsystem:
    | 'mission_control'
    | 'cto_workspace'
    | 'investigation_engine'
    | 'refactoring_planner'
    | 'doc_engineer'
    | 'code_review'
    | 'release_intelligence'
    | 'repository_explorer'
    | 'architecture_intelligence'
    | 'knowledge_graph'
    | 'simulation_studio'
    | 'monitoring'
    | 'security'
    | 'tech_debt'
    | 'performance'
    | 'software_memory';
  label: string;
  url: string;
  badge?: string;
}

export interface ForecastScorecard {
  engineeringHealthScore: number; // e.g. 92% -> projected 88%
  architectureStabilityScore: number; // e.g. 94%
  techDebtAccumulationHours: number; // e.g. +34h predicted
  repositoryGrowthLoc: number; // e.g. +42,000 LOC
  securityRiskCount: number; // e.g. 2 CVE risks
  performanceP95Ms: number; // e.g. 24.2ms -> 68ms
  deploymentSuccessPct: number; // e.g. 98.2%
  developerProductivityGainPct: number; // e.g. +15%
  maintenanceCostMonthlyUsd: number; // e.g. $12,400
  repositoryComplexityScore: number; // e.g. 14.2
}

export interface RiskRadarItem {
  id: string;
  category: RadarCategory;
  title: string;
  probabilityPct: number; // e.g. 84.2%
  confidencePct: number; // e.g. 96.0%
  impactLevel: RiskImpactLevel;
  estimatedTimelineDays: number; // e.g. 30 days
  evidence: string;
  businessImpact: string;
  engineeringImpact: string;
  recommendedAction: string;
  alternativeStrategies: string[];
  estimatedCostUsd: number;
  estimatedEffortHours: number;
  simulationLink: string;
}

export interface WhatIfScenarioOption {
  id: string;
  question: string;
  category: 'architecture' | 'database' | 'scaling' | 'infrastructure' | 'dependency';
  sideBySideOutcome: {
    metric: string;
    currentBaseline: string;
    simulatedFuture: string;
    impactDelta: string;
    isPositive: boolean;
  }[];
  aiRecommendation: string;
  confidencePct: number;
}

export interface ForecastReport {
  id: string;
  reportType: ForecastReportType;
  title: string;
  period: string;
  createdAt: string;
  executiveSummary: string;
  keyRiskHighlights: string[];
  strategicActionItems: { task: string; owner: string; deadline: string }[];
  projectedMetrics: { metric: string; value: string; trend: string }[];
}

export interface PredictiveTrendPoint {
  timeHorizon: 'Today' | '1 Month' | '3 Months' | '6 Months' | '1 Year' | '3 Years' | '5 Years';
  healthScore: number;
  cloudCostUsd: number;
  techDebtHours: number;
  qpsCapacity: number;
  microservicesCount: number;
}
