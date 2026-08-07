export interface CloudCommandMetrics {
  clusterHealthPct: number;
  nodeUtilizationCpuPct: number;
  nodeUtilizationMemPct: number;
  runningPodsCount: number;
  crashLoopBackOffCount: number;
  serviceMeshMtlsStatus: string;
  gitOpsSyncStatus: string;
  monthlyCostUsd: number;
  availabilityPct: number;
  securityScore: number;
  sustainabilityScorePct: number;
  aiOptimizationScorePct: number;
}

export interface MultiCloudProviderProfile {
  provider: 'AWS EKS' | 'GCP GKE' | 'Azure AKS' | 'Hybrid Cloud (Anthos/EKS Anywhere)';
  monthlyCostEstimateUsd: number;
  p95LatencyMs: number;
  availabilitySla: string;
  operationalComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  securityComplianceScore: number;
  sustainabilityScorePct: number;
  aiRecommendationScore: number;
  keyBenefits: string;
}

export interface DeploymentSimulationScenario {
  id: string;
  title: string;
  strategy: 'Canary (10% -> 100%)' | 'Blue-Green Deployment' | 'Rolling Update' | 'HPA Auto Scaling' | 'K8s Version Upgrade (v1.27 -> v1.28)';
  downtimeEstimateMins: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  rollbackReadinessPct: number;
  expectedPerformanceP95: string;
  aiSummary: string;
}

export interface GitOpsDriftItem {
  id: string;
  resourceName: string;
  resourceType: 'Terraform State' | 'Helm Release' | 'K8s Deployment YAML' | 'ArgoCD Application';
  driftStatus: 'SYNCED' | 'DRIFTED' | 'SECURITY_WARNING';
  expectedState: string;
  actualState: string;
  aiRefactoringSuggestion: string;
}

export interface CloudArchitectQA {
  id: string;
  question: string;
  answerSummary: string;
  evidenceTelemetry: string;
  confidencePct: number;
}
