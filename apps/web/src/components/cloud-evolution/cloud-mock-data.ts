import {
  CloudCommandMetrics,
  MultiCloudProviderProfile,
  DeploymentSimulationScenario,
  GitOpsDriftItem,
  CloudArchitectQA,
} from './cloud-types';

export const MOCK_CLOUD_COMMAND_METRICS: CloudCommandMetrics = {
  clusterHealthPct: 98.2,
  nodeUtilizationCpuPct: 38,
  nodeUtilizationMemPct: 54,
  runningPodsCount: 142,
  crashLoopBackOffCount: 0,
  serviceMeshMtlsStatus: '100% Istio mTLS STRICT Enforced',
  gitOpsSyncStatus: 'ArgoCD Synced (Commit b7a92c)',
  monthlyCostUsd: 12400,
  availabilityPct: 99.99,
  securityScore: 96,
  sustainabilityScorePct: 95.0,
  aiOptimizationScorePct: 94.0,
};

export const MOCK_MULTI_CLOUD_PROFILES: MultiCloudProviderProfile[] = [
  {
    provider: 'AWS EKS',
    monthlyCostEstimateUsd: 12400,
    p95LatencyMs: 24.2,
    availabilitySla: '99.99%',
    operationalComplexity: 'LOW',
    securityComplianceScore: 98,
    sustainabilityScorePct: 95.0,
    aiRecommendationScore: 98,
    keyBenefits: 'Native integration with Aurora PostgreSQL RDS, S3 Glacier, and Karpenter node autoscaling.',
  },
  {
    provider: 'GCP GKE',
    monthlyCostEstimateUsd: 11800,
    p95LatencyMs: 22.0,
    availabilitySla: '99.99%',
    operationalComplexity: 'LOW',
    securityComplianceScore: 96,
    sustainabilityScorePct: 98.0,
    aiRecommendationScore: 94,
    keyBenefits: 'Superior GKE Autopilot node management and BigQuery AI vector analytics.',
  },
  {
    provider: 'Azure AKS',
    monthlyCostEstimateUsd: 13100,
    p95LatencyMs: 26.5,
    availabilitySla: '99.95%',
    operationalComplexity: 'MEDIUM',
    securityComplianceScore: 94,
    sustainabilityScorePct: 92.0,
    aiRecommendationScore: 90,
    keyBenefits: 'Seamless Entra ID (Azure AD) identity integration and Azure Cosmos DB multi-region sync.',
  },
  {
    provider: 'Hybrid Cloud (Anthos/EKS Anywhere)',
    monthlyCostEstimateUsd: 15800,
    p95LatencyMs: 18.0,
    availabilitySla: '99.999%',
    operationalComplexity: 'HIGH',
    securityComplianceScore: 99,
    sustainabilityScorePct: 90.0,
    aiRecommendationScore: 88,
    keyBenefits: 'Zero-trust on-premise data residency compliance with cloud fallback bursting.',
  },
];

export const MOCK_DEPLOYMENT_SCENARIOS: DeploymentSimulationScenario[] = [
  {
    id: 'scen-canary',
    title: 'Canary Deployment (10% -> 50% -> 100% Traffic Shift)',
    strategy: 'Canary (10% -> 100%)',
    downtimeEstimateMins: 0,
    riskLevel: 'LOW',
    rollbackReadinessPct: 100,
    expectedPerformanceP95: '24.2ms P95 latency baseline maintained during canary step.',
    aiSummary: 'RECOMMENDED. Istio VirtualService automatically rolls back if HTTP 5xx error rate exceeds 0.05%.',
  },
  {
    id: 'scen-bg',
    title: 'Blue-Green Immutable Deployment Switch',
    strategy: 'Blue-Green Deployment',
    downtimeEstimateMins: 0,
    riskLevel: 'LOW',
    rollbackReadinessPct: 100,
    expectedPerformanceP95: 'Instantaneous DNS/Ingress cutover with zero connection dropping.',
    aiSummary: 'Instant rollback capability by keeping Blue environment active for 30 minutes post-cutover.',
  },
  {
    id: 'scen-k8s-upg',
    title: 'Kubernetes Version Upgrade (v1.27 -> v1.28)',
    strategy: 'K8s Version Upgrade (v1.27 -> v1.28)',
    downtimeEstimateMins: 0,
    riskLevel: 'MEDIUM',
    rollbackReadinessPct: 95,
    expectedPerformanceP95: 'Rolling node drain ensures pod eviction without request interruption.',
    aiSummary: 'All API deprecations (autoscaling/v2beta2) verified clean across Helm manifests.',
  },
];

export const MOCK_GITOPS_DRIFT_ITEMS: GitOpsDriftItem[] = [
  {
    id: 'drift-1',
    resourceName: 'ingress-gw-hpa (HorizontalPodAutoscaler)',
    resourceType: 'ArgoCD Application',
    driftStatus: 'DRIFTED',
    expectedState: 'maxReplicas: 30 (git repository target)',
    actualState: 'maxReplicas: 50 (manual kubectl edit in staging cluster)',
    aiRefactoringSuggestion: 'Commit maxReplicas: 50 to git repository main branch to restore GitOps sync.',
  },
  {
    id: 'drift-2',
    resourceName: 'db-primary-secret (Kubernetes Secret)',
    resourceType: 'K8s Deployment YAML',
    driftStatus: 'SECURITY_WARNING',
    expectedState: 'AWS Secrets Manager CSI Driver dynamic mounting',
    actualState: 'Hardcoded base64 secret key in deployment manifest',
    aiRefactoringSuggestion: 'Replace base64 static secret with ExternalSecrets Operator binding.',
  },
];

export const MOCK_CLOUD_ARCHITECT_QA: CloudArchitectQA[] = [
  {
    id: 'caq-1',
    question: 'Should we migrate our microservices to Kubernetes (AWS EKS)?',
    answerSummary: 'Yes. AWS EKS (Scenario A) provides 98.2% cluster health, supports Karpenter autoscaling for 22% cost savings, and guarantees 99.99% availability with zero downtime canary deployments.',
    evidenceTelemetry: 'ArgoCD GitOps telemetry confirmed 100% manifest synchronization across all 142 pods.',
    confidencePct: 98.6,
  },
  {
    id: 'caq-2',
    question: 'How many nodes are required for 100,000 QPS peak traffic?',
    answerSummary: 'Karpenter autoscaler provisions 24 AWS m6i.2xlarge nodes (192 vCPUs, 768GB RAM) to maintain P95 response latency < 28ms during 100k QPS peak load.',
    evidenceTelemetry: 'HPA load testing benchmark verified zero CPU throttling across all 142 running pods.',
    confidencePct: 99.2,
  },
];
