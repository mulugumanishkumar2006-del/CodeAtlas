export type WorkflowStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'AWAITING_APPROVAL' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type AgentRole =
  | 'architecture_agent'
  | 'repository_agent'
  | 'documentation_agent'
  | 'security_agent'
  | 'performance_agent'
  | 'code_review_agent'
  | 'release_agent'
  | 'forecast_agent'
  | 'knowledge_graph_agent'
  | 'simulation_agent'
  | 'memory_agent';

export interface InterSystemLink {
  subsystem:
    | 'mission_control'
    | 'cto_workspace'
    | 'investigation_engine'
    | 'refactoring_planner'
    | 'doc_engineer'
    | 'code_review'
    | 'release_intelligence'
    | 'engineering_forecasting'
    | 'repository_explorer'
    | 'architecture_intelligence'
    | 'dependency_intelligence'
    | 'knowledge_graph'
    | 'simulation_studio'
    | 'monitoring'
    | 'software_memory'
    | 'copilot';
  label: string;
  url: string;
  badge?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: 'incident' | 'architecture' | 'security' | 'performance' | 'debt' | 'docs' | 'release' | 'onboarding';
  purpose: string;
  requiredInputs: string[];
  expectedOutputs: string[];
  estimatedDuration: string;
  requiredPermissions: string[];
  aiConfidencePct: number;
  tags: string[];
  assignedAgents: AgentRole[];
}

export interface ExecutionNode {
  id: string;
  stepNumber: number;
  label: string;
  agentRole: AgentRole;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'AWAITING_APPROVAL' | 'PENDING' | 'FAILED';
  duration: string;
  aiExplanation: string;
  evidenceArtifacts?: string[];
  requiresApproval?: boolean;
}

export interface AIAgentState {
  role: AgentRole;
  displayName: string;
  avatar: string;
  currentTask: string;
  status: 'WORKING' | 'IDLE' | 'AWAITING_HUMAN' | 'COMPLETED';
  progressPct: number;
  activeArtifact: string;
}

export interface AutonomousTaskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  requiresApproval: boolean;
  approvalState: 'AWAITING' | 'APPROVED' | 'REJECTED' | 'MERGED';
  reason?: string;
  filesAffected: string[];
  estimatedEffortHours: number;
  aiConfidencePct: number;
  prLink?: string;
}

export interface WorkflowHistoryRecord {
  id: string;
  workflowName: string;
  startTime: string;
  endTime: string;
  duration: string;
  agentsUsed: AgentRole[];
  repository: string;
  actionsCount: number;
  artifactsGenerated: string[];
  approvalStatus: 'APPROVED' | 'REJECTED' | 'AUTO_EXECUTED';
  status: 'COMPLETED' | 'FAILED';
}
