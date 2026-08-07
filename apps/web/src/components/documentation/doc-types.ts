export type DocTypeCategory =
  | 'overview'
  | 'architecture'
  | 'code_reference'
  | 'system_apis'
  | 'infrastructure'
  | 'guides'
  | 'governance'
  | 'changelog_handbook';

export type DocTypeId =
  | 'repository-overview'
  | 'architecture-overview'
  | 'module-doc'
  | 'folder-doc'
  | 'class-doc'
  | 'function-doc'
  | 'api-doc'
  | 'database-doc'
  | 'infrastructure-doc'
  | 'deployment-guide'
  | 'developer-guide'
  | 'getting-started'
  | 'contribution-guide'
  | 'adr'
  | 'dependency-guide'
  | 'testing-guide'
  | 'security-guide'
  | 'performance-guide'
  | 'troubleshooting-guide'
  | 'faq'
  | 'glossary'
  | 'release-notes'
  | 'migration-guides'
  | 'changelog'
  | 'engineering-handbook';

export type LiveTriggerType =
  | 'file_change'
  | 'architecture_change'
  | 'dependency_change'
  | 'api_change'
  | 'database_change'
  | 'config_change'
  | 'security_alert'
  | 'performance_optimization'
  | 'drift_detected'
  | 'simulation_completed'
  | 'ai_recommendation_accepted';

export type ExplanationLevel = 'beginner' | 'intermediate' | 'expert';

export type ApprovalStatus = 'draft' | 'in_review' | 'approved' | 'live';

export type GitHubAlertType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

export interface InterSystemLink {
  system:
    | 'repository_explorer'
    | 'architecture_graph'
    | 'knowledge_graph'
    | 'dependency_graph'
    | 'call_flow'
    | 'simulation'
    | 'ai_investigation'
    | 'technical_debt'
    | 'monitoring'
    | 'security'
    | 'performance';
  label: string;
  url: string;
  description: string;
  badge?: string;
}

export interface CodeExample {
  id: string;
  title: string;
  language: 'typescript' | 'python' | 'bash' | 'sql' | 'yaml' | 'json';
  code: string;
  explanation: string;
  outputSnippet?: string;
  isExecutable?: boolean;
}

export interface DocAlert {
  type: GitHubAlertType;
  title: string;
  content: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  type: 'service' | 'database' | 'queue' | 'cache' | 'gateway' | 'worker';
  subtext?: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface DocDiagram {
  id: string;
  title: string;
  type: 'architecture' | 'sequence' | 'dependency' | 'dataflow';
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  mermaidCode?: string;
}

export interface DocComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  timestamp: string;
  content: string;
  resolved: boolean;
  selectedText?: string;
  replies?: DocComment[];
}

export interface DocVersion {
  version: string;
  updatedAt: string;
  author: string;
  commitHash: string;
  triggerEvent?: LiveTriggerType;
  triggerType?: LiveTriggerType;
  summaryOfChanges: string;
  diffAddedLines: number;
  diffRemovedLines: number;
  contentSnapshot?: string;
}

export interface AIExplanation {
  topic: string;
  targetId: string;
  targetType: 'repository' | 'service' | 'api' | 'database' | 'auth' | 'architecture' | 'deployment' | 'dependency' | 'class' | 'function' | 'workflow' | 'domain' | 'diagram';
  level: ExplanationLevel;
  content: string;
  keyTakeaways: string[];
  suggestedQuestions: string[];
}

export interface DocPage {
  id: string;
  typeId: DocTypeId;
  category: DocTypeCategory;
  title: string;
  subtitle: string;
  icon: string;
  slug: string;
  
  // Quality & Quality Criteria
  summary: string;
  purpose: string;
  businessContext: string;
  technicalContext: string;
  
  // Sections
  architectureSummary: string;
  diagrams: DocDiagram[];
  dependenciesSummary: string;
  dependenciesList: { name: string; version: string; type: 'direct' | 'peer' | 'dev'; reason: string }[];
  relatedComponents: { name: string; path: string; description: string; link: string }[];
  codeExamples: CodeExample[];
  alerts: DocAlert[];
  bestPractices: string[];
  commonMistakes: string[];
  relatedDocIds: string[];
  
  // Live Sync & Quality Flags
  aiConfidence: number; // e.g. 98.6
  confidenceModel: string; // e.g. "CodeAtlas-Synthesizer-v4"
  lastUpdated: string;
  lastCommitHash: string;
  lastTrigger: LiveTriggerType;
  isStale: boolean;
  approvalStatus: ApprovalStatus;
  
  // Collaboration & Inter-connectivity
  author: string;
  reviewers: string[];
  interSystemLinks: InterSystemLink[];
  comments: DocComment[];
  versions: DocVersion[];
  
  // Presentation
  presentationSlides?: { title: string; bulletPoints: string[]; visualType: 'code' | 'diagram' | 'metrics' }[];
  
  isBookmarked?: boolean;
  isFavorite?: boolean;
}

export interface LiveSyncEvent {
  id: string;
  timestamp: string;
  triggerType: LiveTriggerType;
  source: string; // e.g. "git push main", "AEO Drift Engine", "PostgreSQL Schema Migration"
  affectedDocsCount: number;
  docIds: string[];
  description: string;
  status: 'synced' | 'processing' | 'queued';
}
