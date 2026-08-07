export type KnowledgeNodeType =
  | 'repository'
  | 'service'
  | 'developer'
  | 'team'
  | 'module'
  | 'class'
  | 'function'
  | 'api'
  | 'database'
  | 'document'
  | 'incident'
  | 'adr'
  | 'risk'
  | 'technology';

export type KnowledgeEdgeType =
  | 'uses'
  | 'depends_on'
  | 'created_by'
  | 'modified_by'
  | 'reviewed_by'
  | 'related_to'
  | 'replaced_by'
  | 'affected_by';

export type WikiSectionType =
  | 'architecture'
  | 'repositories'
  | 'standards'
  | 'guidelines'
  | 'best_practices'
  | 'runbooks'
  | 'playbooks'
  | 'troubleshooting'
  | 'glossary'
  | 'policies';

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
    | 'autonomous_workflows'
    | 'repository_explorer'
    | 'architecture_intelligence'
    | 'dependency_intelligence'
    | 'monitoring'
    | 'simulation_studio'
    | 'software_memory'
    | 'copilot';
  label: string;
  url: string;
  badge?: string;
}

export interface HubNode {
  id: string;
  label: string;
  nodeType: KnowledgeNodeType;
  teamOwner: string;
  technology: string;
  description: string;
  contributors: string[];
  historyEventsCount: number;
  relatedDocIds: string[];
  relatedInvestigationIds: string[];
  aiRecommendation: string;
}

export interface HubEdge {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: KnowledgeEdgeType;
  label: string;
}

export interface EngineeringMemoryQA {
  id: string;
  question: string;
  category: 'architecture_decision' | 'dependency_origin' | 'incident_history' | 'code_evolution';
  answerSummary: string;
  reasoningChain: string[];
  sourceArtifacts: { type: string; title: string; link: string }[];
  keyContributors: string[];
  confidencePct: number;
}

export interface SmartSearchResult {
  id: string;
  conceptTitle: string;
  matchedCategory: string;
  aiSummary: string;
  relevanceScore: number;
  connectedNodes: string[];
  lastUpdated: string;
}

export interface WikiPage {
  id: string;
  section: WikiSectionType;
  title: string;
  aiGeneratedContent: string;
  lastUpdated: string;
  author: string;
  version: string;
  tags: string[];
  relatedNodeIds: string[];
}

export interface ProactiveRecommendation {
  id: string;
  title: string;
  type: 'investigation' | 'doc' | 'incident' | 'adr' | 'refactoring' | 'expert';
  summary: string;
  targetLink: string;
  relevancePct: number;
}
