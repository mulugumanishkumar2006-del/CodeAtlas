export interface FinOpsCommandMetrics {
  overallPerformanceScore: number;
  infrastructureHealthPct: number;
  monthlyCostUsd: number;
  annualCostUsd: number;
  cpuUtilizationPct: number;
  memoryUtilizationPct: number;
  storageGrowthGbPerMonth: number;
  networkTrafficTbPerMonth: number;
  aiCostOptimizationScore: number;
  sustainabilityScorePct: number;
  aiConfidencePct: number;
}

export interface WorkloadSimulationResult {
  multiplierLabel: '1x Baseline' | '2x Peak' | '10x Surge' | '100x Global';
  trafficQps: number;
  p95LatencyMs: number;
  cpuPct: number;
  memoryPct: number;
  diskIops: number;
  networkMbps: number;
  cacheEfficiencyPct: number;
  autoscalingReplicas: number;
  predictedMonthlyCostUsd: number;
}

export interface CostCategoryBreakdown {
  category: 'Compute' | 'Database' | 'Storage' | 'CDN & Networking' | 'AI & Managed Services';
  monthlyCostUsd: number;
  percentageOfTotal: number;
  recommendationNote: string;
}

export interface FinOpsOptimizationRecommendation {
  id: string;
  title: string;
  category: string;
  expectedMonthlySavingsUsd: number;
  migrationEffortHours: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  roiMultiplier: number;
  aiReasoning: string;
}

export interface WhatIfScenarioQA {
  id: string;
  question: string;
  answerSummary: string;
  costDeltaUsd: number;
  latencyDeltaMs: number;
  confidencePct: number;
}
