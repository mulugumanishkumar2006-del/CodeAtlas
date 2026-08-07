export type ScenarioId = 'scenario-a' | 'scenario-b' | 'scenario-c' | 'scenario-d' | 'scenario-e' | 'scenario-f';

export interface ArchitectureScenario {
  id: ScenarioId;
  name: string;
  category: 'Monolith' | 'Microservices' | 'Event-Driven' | 'Serverless' | 'Modular Monolith' | 'DDD';
  badge: string;
  description: string;
  healthScore: number;
  p95LatencyMs: number;
  monthlyCostUsd: number;
  techDebtHours: number;
  migrationEffortDays: number;
  incidentProbabilityPct: number;
  developerProductivityScore: number;
  aiRecommendationScore: number;
  aiReasoning: string;
}

export interface SimulationParameters {
  trafficQps: number;
  teamSizeEngineers: number;
  infraBudgetUsd: number;
  deploymentFrequencyPerDay: number;
  techDebtToleranceHours: number;
}

export interface AdvisorQA {
  id: string;
  question: string;
  recommendedScenarioId: ScenarioId;
  answerSummary: string;
  evidenceData: string;
  confidencePct: number;
}
