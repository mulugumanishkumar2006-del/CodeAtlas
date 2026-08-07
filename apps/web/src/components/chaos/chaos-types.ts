export type ChaosCategory =
  | 'Database'
  | 'Cache'
  | 'Queue'
  | 'Compute'
  | 'Network'
  | 'Kubernetes'
  | 'Cloud';

export interface ChaosFailureTemplate {
  id: string;
  title: string;
  category: ChaosCategory;
  targetService: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedMttrMinutes: number;
}

export interface ResilienceScorecard {
  systemResilienceScorePct: number;
  availabilityPct: number;
  recoveryReadinessMttrMins: number;
  criticalServicesCount: number;
  activeExperimentsCount: number;
}

export interface RecoveryPlaybook {
  incidentId: string;
  title: string;
  timestamp: string;
  rootCauseAnalysis: string;
  rollbackStrategy: string;
  recoveryTimeline: { time: string; action: string }[];
  verificationChecklist: string[];
  postmortemSummary: string;
  preventionPlan: string;
}

export interface AiSreQA {
  id: string;
  question: string;
  answerSummary: string;
  evidenceTelemetry: string;
  confidencePct: number;
}
