export interface EnterpriseScenarioItem {
  id: string;
  name: string;
  category: string;
  technicalScore: number;
  businessScore: number;
  monthlyCostUsd: number;
  p95LatencyMs: number;
  techDebtHours: number;
  migrationEffortDays: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  roiMultiplier: number;
  description: string;
  aiRecommendationNote: string;
}

export interface AiBoardroomParticipant {
  role: 'AI CTO' | 'AI Security Architect' | 'AI Performance Engineer' | 'AI Platform Engineer' | 'AI FinOps Advisor' | 'AI SRE';
  agentName: string;
  avatarColor: string;
  statement: string;
  tradeOffSummary: string;
  riskWarning: string;
  verdict: 'APPROVE' | 'CAUTION' | 'REJECT';
}

export interface ExecutiveDecisionReport {
  reportId: string;
  title: string;
  executiveSummary: string;
  technicalAnalysis: string;
  businessImpactSummary: string;
  roiProjection: string;
  migrationRoadmapMilestones: { phase: string; title: string; durationWeeks: number }[];
  riskRegister: { risk: string; severity: string; mitigation: string }[];
}

export interface ScenarioAdvisorQA {
  id: string;
  question: string;
  answerSummary: string;
  evidenceTelemetry: string;
  confidencePct: number;
}
