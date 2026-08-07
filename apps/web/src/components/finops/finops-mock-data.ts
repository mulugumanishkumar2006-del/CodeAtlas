import {
  FinOpsCommandMetrics,
  WorkloadSimulationResult,
  CostCategoryBreakdown,
  FinOpsOptimizationRecommendation,
  WhatIfScenarioQA,
} from './finops-types';

export const MOCK_COMMAND_METRICS: FinOpsCommandMetrics = {
  overallPerformanceScore: 94,
  infrastructureHealthPct: 98.0,
  monthlyCostUsd: 12400,
  annualCostUsd: 148800,
  cpuUtilizationPct: 38,
  memoryUtilizationPct: 54,
  storageGrowthGbPerMonth: 420,
  networkTrafficTbPerMonth: 18.4,
  aiCostOptimizationScore: 92,
  sustainabilityScorePct: 95.0,
  aiConfidencePct: 98.4,
};

export const MOCK_WORKLOAD_SIMULATIONS: WorkloadSimulationResult[] = [
  {
    multiplierLabel: '1x Baseline',
    trafficQps: 50000,
    p95LatencyMs: 24.2,
    cpuPct: 38,
    memoryPct: 54,
    diskIops: 2400,
    networkMbps: 450,
    cacheEfficiencyPct: 94.2,
    autoscalingReplicas: 12,
    predictedMonthlyCostUsd: 12400,
  },
  {
    multiplierLabel: '2x Peak',
    trafficQps: 100000,
    p95LatencyMs: 28.0,
    cpuPct: 62,
    memoryPct: 68,
    diskIops: 4800,
    networkMbps: 900,
    cacheEfficiencyPct: 92.0,
    autoscalingReplicas: 24,
    predictedMonthlyCostUsd: 16800,
  },
  {
    multiplierLabel: '10x Surge',
    trafficQps: 500000,
    p95LatencyMs: 45.0,
    cpuPct: 84,
    memoryPct: 82,
    diskIops: 18000,
    networkMbps: 4200,
    cacheEfficiencyPct: 88.5,
    autoscalingReplicas: 80,
    predictedMonthlyCostUsd: 38500,
  },
  {
    multiplierLabel: '100x Global',
    trafficQps: 5000000,
    p95LatencyMs: 142.0,
    cpuPct: 95,
    memoryPct: 92,
    diskIops: 85000,
    networkMbps: 38000,
    cacheEfficiencyPct: 82.0,
    autoscalingReplicas: 450,
    predictedMonthlyCostUsd: 142000,
  },
];

export const MOCK_COST_BREAKDOWNS: CostCategoryBreakdown[] = [
  { category: 'Compute', monthlyCostUsd: 4800, percentageOfTotal: 38.7, recommendationNote: 'Switch Auth Router pods to ARM Graviton3 for 22% cost reduction.' },
  { category: 'Database', monthlyCostUsd: 3400, percentageOfTotal: 27.4, recommendationNote: 'Purchase 1-Year Aurora Reserved Capacity to save $1,200/mo.' },
  { category: 'Storage', monthlyCostUsd: 2100, percentageOfTotal: 16.9, recommendationNote: 'Migrate logs older than 30 days to AWS S3 Glacier Instant Retrieval.' },
  { category: 'CDN & Networking', monthlyCostUsd: 1300, percentageOfTotal: 10.5, recommendationNote: 'Enable CloudFront Brotli compression to drop egress bandwidth.' },
  { category: 'AI & Managed Services', monthlyCostUsd: 800, percentageOfTotal: 6.5, recommendationNote: 'Cache AI AST embedding vectors in Redis L2 memory.' },
];

export const MOCK_FINOPS_RECOMMENDATIONS: FinOpsOptimizationRecommendation[] = [
  {
    id: 'opt-1',
    title: 'Migrate EKS Worker Nodes to AWS Graviton3 (ARM64)',
    category: 'Compute Optimization',
    expectedMonthlySavingsUsd: 1850,
    migrationEffortHours: 12,
    riskLevel: 'LOW',
    roiMultiplier: 4.8,
    aiReasoning: 'ARM64 architecture delivers 22% lower cost with identical throughput for FastAPI/Node.js workloads.',
  },
  {
    id: 'opt-2',
    title: 'Purchase 1-Year RDS Aurora PostgreSQL Reserved Instance',
    category: 'Database Reserved Capacity',
    expectedMonthlySavingsUsd: 1200,
    migrationEffortHours: 1,
    riskLevel: 'LOW',
    roiMultiplier: 12.0,
    aiReasoning: 'Zero downtime billing commitment discount for baseline database instance.',
  },
  {
    id: 'opt-3',
    title: 'Purge Unattached EBS Volumes and Stale Snapshot Logs',
    category: 'Storage Hygiene',
    expectedMonthlySavingsUsd: 750,
    migrationEffortHours: 2,
    riskLevel: 'LOW',
    roiMultiplier: 8.5,
    aiReasoning: 'Identified 18 unattached EBS volumes older than 90 days across staging clusters.',
  },
];

export const MOCK_WHAT_IF_FINOPS: WhatIfScenarioQA[] = [
  {
    id: 'wif-1',
    question: 'What if traffic doubles to 100,000 QPS?',
    answerSummary: 'If traffic doubles, HPA scales Kubernetes pods from 12 to 24. P95 latency remains stable at 28ms, and monthly infrastructure cost increases by +$4,400/mo ($16,800/mo total).',
    costDeltaUsd: 4400,
    latencyDeltaMs: +3.8,
    confidencePct: 98.6,
  },
  {
    id: 'wif-2',
    question: 'What if we introduce a Redis write-behind cache layer?',
    answerSummary: 'Introducing Redis write-behind cache reduces PostgreSQL read IOPS by 84%. Monthly database cost drops by -$1,200/mo while P95 latency drops to 18ms.',
    costDeltaUsd: -1200,
    latencyDeltaMs: -6.2,
    confidencePct: 99.2,
  },
];
