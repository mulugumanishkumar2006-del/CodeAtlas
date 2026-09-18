export type AcquisitionStatus = 'NOT_CLONED' | 'CLONING' | 'READY' | 'SYNCING' | 'ERROR';
export type AnalysisStatus = 'pending' | 'running' | 'completed' | 'partial' | 'failed';
export type WorkspaceTab = 'overview' | 'chat' | 'architecture' | 'quality' | 'security' | 'history' | 'files' | 'symbols' | 'dependencies' | 'settings';

export interface LanguageStat {
  language: string;
  file_count: number;
  line_count: number;
  size_bytes: number;
  percentage: number;
  is_supported?: boolean;
}

export interface RepositoryMetadata {
  file_count?: number;
  line_count?: number;
  symbol_count?: number;
  primary_language?: string;
  languages?: LanguageStat[];
  profile?: UniversalProfile;
  analysis_summary?: {
    total_files: number;
    total_lines: number;
    total_symbols: number;
    primary_language: string;
    languages: LanguageStat[];
    profile?: UniversalProfile;
    partial_errors?: Array<{ file: string; language: string; error: string; stage: string }>;
    duration_seconds: number;
  };
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  default_branch: string;
  description: string | null;
  status: string;
  acquisition_status: AcquisitionStatus;
  acquisition_error: string | null;
  analysis_status?: AnalysisStatus;
  current_commit_sha: string | null;
  last_synced_at: string | null;
  metadata_json?: RepositoryMetadata | null;
  created_at: string;
  updated_at: string;
}

export interface RepositoryCreateInput {
  name: string;
  url: string;
  default_branch?: string;
  description?: string;
}

export interface RepositoryStatus {
  repository_id: string;
  status: AcquisitionStatus;
  branch?: string;
  commit_sha?: string;
  last_synced_at?: string;
  error?: string | null;
}

export interface AnalysisProgress {
  repository_id: string;
  status: AnalysisStatus | string;
  stage: string;
  files_discovered: number;
  files_processed: number;
  symbols_extracted: number;
  progress_percent: number;
  error?: string | null;
  partial_errors?: Array<{ file: string; language: string; error: string; stage: string }>;
  unsupported_languages?: Array<{ language: string; file_count: number; percentage: number }>;
  updated_at?: string | null;
}

export interface FrameworkEvidence {
  name: string;
  category: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence_files: string[];
  evidence_imports: string[];
  description: string;
}

export interface PackageManagerItem {
  id: string;
  name: string;
  evidence_files: string[];
  confidence: string;
}

export interface EntryPointItem {
  file_path: string;
  symbol?: string | null;
  line: number;
  reason: string;
  framework?: string | null;
  file_id?: string | null;
}

export interface ApiEndpointItem {
  method: string;
  route: string;
  file_path: string;
  line: number;
  framework: string;
  file_id?: string | null;
}

export interface DatabaseEvidenceItem {
  name: string;
  category: string;
  description: string;
  evidence_imports: string[];
  evidence_files: string[];
  confidence: string;
}

export interface EnvironmentVariableItem {
  name: string;
  value: string;
  source_file: string;
}

export interface ConfigurationItem {
  file_path: string;
  filename: string;
  category: string;
  is_env_file: boolean;
}

export interface InfrastructureItem {
  type: string;
  file_path: string;
  description: string;
}

export interface UniversalProfile {
  repository_id: string;
  commit_sha?: string | null;
  analyzed_at: string;
  languages: {
    primary_language: string;
    total_files: number;
    total_lines: number;
    total_code_lines: number;
    total_blank_lines: number;
    total_comment_lines: number;
    distribution: LanguageStat[];
    supported_languages: LanguageStat[];
    unsupported_languages: LanguageStat[];
  };
  frameworks: FrameworkEvidence[];
  package_managers: PackageManagerItem[];
  monorepo: {
    is_monorepo: boolean;
    workspace_type?: string | null;
    evidence: string[];
    packages: string[];
  };
  entry_points: EntryPointItem[];
  api_endpoints: ApiEndpointItem[];
  databases: DatabaseEvidenceItem[];
  configurations: {
    config_files: ConfigurationItem[];
    environment_variables: EnvironmentVariableItem[];
  };
  tests: {
    test_file_count: number;
    test_files: string[];
    test_frameworks: string[];
    test_ratio_percent: number;
  };
  documentation: Array<{
    file_path: string;
    title: string;
    type: string;
    line_count: number;
  }>;
  infrastructure: InfrastructureItem[];
  modules: Array<{
    name: string;
    file_count: number;
  }>;
  services: Array<{
    name: string;
    service_path: string;
    type: string;
  }>;
  architecture_tree: Record<string, any>;
}

export interface AnalysisSnapshot {
  repository_id: string;
  commit_sha: string;
  snapshot_timestamp: string;
  profile: UniversalProfile;
  statistics: Record<string, any>;
}

export interface FileItem {
  id: string;
  repository_id: string;
  analysis_id?: string | null;
  path: string;
  language?: string | null;
  size_bytes: number;
  line_count: number;
  symbol_count?: number;
  created_at: string;
}

export interface FileDetail extends FileItem {
  source: string;
  is_binary: boolean;
  is_missing: boolean;
  is_truncated: boolean;
  commit_sha?: string | null;
  branch?: string | null;
  symbols: SymbolItem[];
  dependencies: DependencyItem[];
  dependents: DependencyItem[];
}

export interface ContextSnippetLine {
  line_number: number;
  content: string;
  is_target: boolean;
}

export interface CodeSearchMatch {
  file_id: string;
  file_path: string;
  line_number: number;
  line_content: string;
  match_start: number;
  match_end: number;
  context_snippet?: ContextSnippetLine[];
  match_reason?: string | null;
}

export interface SymbolSearchMatch {
  id: string;
  name: string;
  symbol_type: string;
  qualified_name: string;
  file_id: string;
  file_path: string;
  start_line: number;
  end_line: number;
  language?: string | null;
  docstring?: string | null;
  score?: number;
  match_reason?: string | null;
  repository_id?: string;
  relevance?: number;
}

export interface FileSearchMatch {
  id: string;
  path: string;
  language?: string | null;
  line_count?: number;
  size_bytes?: number;
  score?: number;
  match_reason?: string | null;
  repository_id?: string;
  relevance?: number;
}

export interface DirectorySearchMatch {
  directory: string;
  file_count: number;
  line_count: number;
  symbol_count: number;
  match_reason?: string | null;
  repository_id?: string;
}

export interface DependencySearchMatch {
  id: string;
  dependency_type: string;
  name: string;
  source_file_id?: string | null;
  source_path?: string | null;
  target_file_id?: string | null;
  target_path?: string | null;
  line?: number | null;
  resolved: boolean;
  relationship_type: string;
  match_reason?: string | null;
  repository_id?: string;
  relevance?: number;
}

export interface ArchitectureSearchMatch {
  id: string;
  name: string;
  node_type: string; // module, layer, entry_point, pattern, group
  description?: string | null;
  file_count?: number;
  score?: number;
  match_reason?: string | null;
  repository_id?: string;
  relevance?: number;
}

export interface RepositorySearchResponse {
  repository_id: string;
  query: string;
  intent: string;
  explanation?: string | null;
  total_matches: number;
  symbols: SymbolSearchMatch[];
  symbol_matches?: SymbolSearchMatch[];
  files: FileSearchMatch[];
  code_matches: CodeSearchMatch[];
  dependencies: DependencySearchMatch[];
  directories: DirectorySearchMatch[];
  architecture?: ArchitectureSearchMatch[];
  architecture_matches?: ArchitectureSearchMatch[];
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface SymbolItem {
  id: string;
  repository_id: string;
  file_id: string;
  name: string;
  symbol_type: string;
  qualified_name: string;
  start_line: number;
  end_line: number;
  start_column?: number | null;
  end_column?: number | null;
  docstring?: string | null;
  ast_metadata?: Record<string, any> | null;
  created_at: string;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  environment: string;
  database: 'connected' | 'disconnected';
  redis: 'connected' | 'disconnected';
  timestamp: string;
}

export interface DependencyItem {
  id: string;
  repository_id: string;
  analysis_id?: string | null;
  name: string;
  dependency_type: string;
  source_file_id?: string | null;
  target_file_id?: string | null;
  source_path?: string | null;
  target_path?: string | null;
  resolved: boolean;
  line?: number | null;
  metadata_json?: Record<string, any> | null;
  created_at: string;
}

export interface GraphNodeItem {
  id: string;
  key: string;
  label: string;
  type: string;
  file_id?: string | null;
  properties?: {
    path?: string;
    filename?: string;
    language?: string;
    line_count?: number;
    size_bytes?: number;
    symbol_count?: number;
    [key: string]: any;
  };
}

export interface GraphEdgeItem {
  id: string;
  source: string;
  target: string;
  source_label: string;
  target_label: string;
  type: string;
  weight?: number;
  properties?: {
    import_name?: string;
    dependency_type?: string;
    start_line?: number;
    end_line?: number;
    [key: string]: any;
  };
}

export interface GraphData {
  repository_id: string;
  nodes: GraphNodeItem[];
  edges: GraphEdgeItem[];
  metrics: {
    total_nodes: number;
    total_edges: number;
    connected_components: number;
    has_cycles: boolean;
    cycle_count: number;
    cycles: string[][];
    most_depended_on?: Array<{ path: string; count: number }>;
    most_dependencies?: Array<{ path: string; count: number }>;
    in_degrees?: Record<string, number>;
    out_degrees?: Record<string, number>;
  };
  cycles: string[][];
}

export type GraphLevel = 'directory' | 'file';

export interface ArchitectureGroupFile {
  id: string;
  path: string;
  language: string;
  line_count: number;
  symbol_count: number;
}

export interface ArchitectureGroup {
  id: string;
  repository_id: string;
  name: string;
  file_count: number;
  line_count: number;
  code_lines: number;
  symbol_count: number;
  incoming_dependencies: number;
  outgoing_dependencies: number;
  internal_coupling: number;
  languages: Record<string, number>;
  files: ArchitectureGroupFile[];
}

export interface ArchitectureRelationshipSample {
  source_file: string;
  target_file: string;
  dependency_type: string;
  start_line?: number;
}

export interface ArchitectureRelationship {
  id: string;
  repository_id: string;
  source: string;
  target: string;
  source_group_id: string;
  target_group_id: string;
  dependency_count: number;
  dependencies: ArchitectureRelationshipSample[];
}

export interface ArchitectureHealthDeduction {
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  deduction: number;
  description: string;
  affected_entities: string[];
}

export interface ArchitectureHealth {
  score: number;
  max_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  status_label: string;
  deductions: ArchitectureHealthDeduction[];
  metrics: {
    circular_cycles: number;
    bidirectional_couplings: number;
    total_modules: number;
    total_dependencies: number;
  };
}

export interface FrameworkEvidenceItem {
  name: string;
  category: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence_files: string[];
  evidence_imports: string[];
  description?: string | null;
}

export interface EntryPointItem {
  file_path: string;
  symbol?: string | null;
  line: number;
  reason: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  framework?: string | null;
  file_id?: string | null;
}

export interface ArchitectureLayerItem {
  name: string;
  category: string;
  file_count: number;
  symbol_count: number;
  files: string[];
  description: string;
}

export interface ArchitectureModuleItem {
  id: string;
  name: string;
  layer: string;
  file_count: number;
  symbol_count: number;
  line_count: number;
  incoming_dependencies: number;
  outgoing_dependencies: number;
  internal_coupling: number;
  languages: Record<string, number>;
  files: Array<{
    id?: string | null;
    path: string;
    language: string;
    line_count: number;
    symbol_count: number;
    layer?: string;
  }>;
  description: string;
}

export interface ArchitecturePatternItem {
  pattern: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence: string[];
  description: string;
}

export interface ArchitectureViolationItem {
  violation_type: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  source_entity: string;
  target_entity: string;
  evidence_file?: string | null;
  evidence_line?: number | null;
}

export interface ArchitectureHotspotItem {
  file_path: string;
  symbol_count: number;
  line_count: number;
  incoming_count: number;
  outgoing_count: number;
  hotspot_score: number;
  reasons: string[];
}

export interface ArchitectureOverview {
  repository_id: string;
  languages: Record<string, number>;
  language_percentages: Record<string, number>;
  frameworks: FrameworkEvidenceItem[];
  module_count: number;
  file_count: number;
  symbol_count: number;
  entry_points: EntryPointItem[];
  patterns: ArchitecturePatternItem[];
  summary_text: string;
}

export interface ArchitectureData {
  repository_id: string;
  overview?: ArchitectureOverview;
  languages?: Record<string, number>;
  language_percentages?: Record<string, number>;
  frameworks?: FrameworkEvidenceItem[];
  entry_points?: EntryPointItem[];
  layers?: ArchitectureLayerItem[];
  modules?: ArchitectureModuleItem[];
  patterns?: ArchitecturePatternItem[];
  hotspots?: ArchitectureHotspotItem[];
  violations?: ArchitectureViolationItem[];
  drift?: ArchitectureViolationItem[];
  groups: ArchitectureGroup[];
  relationships: ArchitectureRelationship[];
  health: ArchitectureHealth;
  summary: {
    total_directories: number;
    total_files: number;
    total_symbols: number;
    total_dependencies: number;
    total_cycles: number;
  };
  highlights: {
    most_depended_on_groups: Array<{ name: string; incoming: number }>;
    most_dependency_heavy_groups: Array<{ name: string; outgoing: number }>;
  };
  cycles: string[][];
  explanation?: string;
}


// =========================================================================
// Phase 9: Evidence-Grounded Repository Q&A / RAG Types
// =========================================================================

export interface SourceCitationItem {
  file_id: string;
  path: string;
  file_path?: string;
  start_line: number;
  end_line: number;
  symbol_id?: string | null;
  symbol?: string | null;
  relevance: number;
  repository_id?: string;
}

export interface RepositoryQueryRequest {
  question: string;
  conversation_id?: string | null;
}

export interface RepositoryQueryResponse {
  repository_id: string;
  question: string;
  answer: string;
  intent?: string;
  evidence?: SourceCitationItem[];
  sources: SourceCitationItem[];
  related_symbols?: string[];
  related_files?: string[];
  related_dependencies?: string[];
  conversation_id?: string | null;
  duration_ms?: number;
  latency_breakdown?: Record<string, number>;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: string;
  evidence?: SourceCitationItem[];
  sources?: SourceCitationItem[];
  related_symbols?: string[];
  related_files?: string[];
  related_dependencies?: string[];
  duration_ms?: number;
  latency_breakdown?: Record<string, number>;
  created_at?: string;
}

export interface ConversationResponse {
  id: string;
  repository_id?: string | null;
  title: string;
  context_type: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ConversationListResponse {
  repository_id: string;
  conversations: ConversationResponse[];
}

// =========================================================================
// Phase 10: Dependency & Impact Intelligence Types
// =========================================================================

export interface ImpactTargetItem {
  id: string;
  name: string;
  target_type: string; // file, symbol, class, function, method, graph_node
  file_id?: string | null;
  file_path?: string | null;
  qualified_name?: string | null;
  start_line?: number | null;
  end_line?: number | null;
  symbol_count: number;
  direct_dependencies_count: number;
  direct_dependents_count: number;
}

export interface ImpactEvidenceItem {
  source: string;
  target: string;
  relationship: string; // IMPORTS, CALLS, DEPENDS_ON, CONTAINS, REFERENCES
  file_path: string;
  file_id?: string | null;
  start_line: number;
  end_line: number;
  import_name?: string | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ImpactNodeItem {
  id: string;
  label: string;
  node_type: string; // file, symbol, class, function, method, module
  depth: number;
  direction: 'target' | 'upstream' | 'downstream' | 'both';
  file_path?: string | null;
  file_id?: string | null;
  start_line?: number | null;
  end_line?: number | null;
  properties?: Record<string, any> | null;
}

export interface ImpactEdgeItem {
  source: string;
  target: string;
  relationship: string;
  depth: number;
  evidence?: ImpactEvidenceItem | null;
}

export interface ImpactMetrics {
  affected_files: number;
  affected_symbols: number;
  max_depth: number;
  direct_dependents: number;
  indirect_dependents: number;
  direct_dependencies: number;
  indirect_dependencies: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  risk_reasons: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ImpactAnalysisResponse {
  repository_id: string;
  target: ImpactTargetItem;
  direction: 'upstream' | 'downstream' | 'both';
  max_depth: number;
  nodes: ImpactNodeItem[];
  edges: ImpactEdgeItem[];
  direct_dependencies: ImpactNodeItem[];
  direct_dependents: ImpactNodeItem[];
  transitive_dependencies: ImpactNodeItem[];
  transitive_dependents: ImpactNodeItem[];
  impact: ImpactMetrics;
  cycles: string[][];
  is_truncated: boolean;
  total_nodes_found: number;
}

export interface TargetDependencyItem {
  id: string;
  name: string;
  target_type: string;
  file_path?: string | null;
  depth: number;
  relationship_type: string;
  evidence?: ImpactEvidenceItem | null;
}

export interface TargetDependencyResponse {
  repository_id: string;
  target: ImpactTargetItem;
  direct_dependencies: TargetDependencyItem[];
  direct_dependents: TargetDependencyItem[];
  transitive_dependencies: TargetDependencyItem[];
  transitive_dependents: TargetDependencyItem[];
}

// =========================================================================
// Phase 12: Code Quality & Technical Debt Types
// =========================================================================

export type QualityCategory =
  | 'COMPLEXITY'
  | 'DUPLICATION'
  | 'COUPLING'
  | 'SIZE'
  | 'DEAD_CODE'
  | 'UNUSED_IMPORT'
  | 'ARCHITECTURE_DRIFT'
  | 'CYCLE'
  | 'MAINTAINABILITY'
  | 'CODE_SMELL';

export type QualitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface QualityFinding {
  id: string;
  repository_id: string;
  category: QualityCategory | string;
  severity: QualitySeverity;
  title: string;
  description: string;
  file_path?: string | null;
  file_id?: string | null;
  symbol?: string | null;
  symbol_id?: string | null;
  start_line?: number | null;
  end_line?: number | null;
  metric_value?: number | null;
  threshold?: number | null;
  evidence?: Record<string, any> | null;
  recommendation?: string | null;
  created_at?: string | null;
}

export interface QualityFileMetric {
  file_id?: string | null;
  file_path: string;
  language: string;
  lines_of_code: number;
  code_lines: number;
  blank_lines: number;
  comment_lines: number;
  symbol_count: number;
  function_count: number;
  class_count: number;
  complexity: number;
  complexity_level: 'Low' | 'Moderate' | 'High' | 'Very High' | string;
  duplication_percentage: number;
  incoming_dependencies: number;
  outgoing_dependencies: number;
  findings_count: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  is_test_file: boolean;
  is_generated: boolean;
}

export interface DuplicationCluster {
  id: string;
  similarity_percentage: number;
  token_count: number;
  line_count: number;
  source_file: string;
  source_file_id?: string | null;
  source_start_line: number;
  source_end_line: number;
  target_file: string;
  target_file_id?: string | null;
  target_start_line: number;
  target_end_line: number;
  snippet_preview?: string | null;
}

export interface QualityScoreFactor {
  factor: string;
  weight: number;
  deduction: number;
  score_impact: number;
  description: string;
}

export interface QualityScoreBreakdown {
  score: number;
  max_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | string;
  status_label: string;
  complexity_deduction: number;
  duplication_deduction: number;
  coupling_deduction: number;
  cycles_deduction: number;
  size_deduction: number;
  dead_code_deduction: number;
  factors: QualityScoreFactor[];
}

export interface QualitySummary {
  repository_id: string;
  score: number;
  grade: string;
  status_label: string;
  score_breakdown: QualityScoreBreakdown;
  total_files: number;
  total_lines: number;
  total_findings: number;
  critical_findings: number;
  high_findings: number;
  medium_findings: number;
  low_findings: number;
  category_counts: Record<string, number>;
  duplication_clusters_count: number;
  dead_code_candidates_count: number;
  top_findings: QualityFinding[];
  top_hotspots: QualityFileMetric[];
  summary_text: string;
}

export interface QualityFindingsResponse {
  repository_id: string;
  total: number;
  findings: QualityFinding[];
  limit: number;
  offset: number;
}

export interface QualityFilesResponse {
  repository_id: string;
  total: number;
  files: QualityFileMetric[];
  limit: number;
  offset: number;
}

export interface QualityDuplicationsResponse {
  repository_id: string;
  total: number;
  clusters: DuplicationCluster[];
}

// =========================================================================
// Phase 13: Security & Reliability Intelligence Types
// =========================================================================

export type SecurityFindingType = 'SECURITY' | 'RELIABILITY';

export interface SecurityFinding {
  id: string;
  repository_id: string;
  finding_type: SecurityFindingType;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  file_path?: string | null;
  file_id?: string | null;
  symbol?: string | null;
  symbol_id?: string | null;
  start_line?: number | null;
  end_line?: number | null;
  evidence_snippet?: string | null; // Always redacted
  evidence_details?: Record<string, any> | null;
  recommendation?: string | null;
  cwe_id?: string | null;
  created_at?: string | null;
}

export interface DependencyManifest {
  id: string;
  package_name: string;
  version?: string | null;
  ecosystem: string;
  manifest_file: string;
  is_pinned: boolean;
  is_dev: boolean;
  risk_status: string;
  notes?: string | null;
}

export interface ReliabilityHotspot {
  file_path: string;
  file_id?: string | null;
  risk_score: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  incoming_dependents: number;
  outgoing_dependencies: number;
  missing_timeouts_count: number;
  unhandled_exceptions_count: number;
  unclosed_resources_count: number;
  is_spof: boolean;
  signals: string[];
  recommendation: string;
}

export interface ScoreFactor {
  factor: string;
  weight: number;
  deduction: number;
  impact: number;
  description: string;
}

export interface ScoreBreakdown {
  score: number;
  grade: string;
  status_label: string;
  factors: ScoreFactor[];
}

export interface SecuritySummary {
  repository_id: string;
  security_score: number;
  security_grade: string;
  security_status_label: string;
  security_breakdown: ScoreBreakdown;
  reliability_score: number;
  reliability_grade: string;
  reliability_status_label: string;
  reliability_breakdown: ScoreBreakdown;
  total_security_findings: number;
  total_reliability_findings: number;
  secrets_count: number;
  injections_count: number;
  missing_timeouts_count: number;
  spof_count: number;
  total_dependencies: number;
  external_services: string[];
  category_counts: Record<string, number>;
  severity_counts: Record<string, number>;
  top_security_findings: SecurityFinding[];
  top_reliability_findings: SecurityFinding[];
  top_hotspots: ReliabilityHotspot[];
  summary_text: string;
}

export interface SecurityFindingsResponse {
  repository_id: string;
  total: number;
  findings: SecurityFinding[];
  limit: number;
  offset: number;
}

export interface SecurityDependenciesResponse {
  repository_id: string;
  total: number;
  dependencies: DependencyManifest[];
}

export interface SecurityHotspotsResponse {
  repository_id: string;
  total: number;
  hotspots: ReliabilityHotspot[];
}

// =========================================================================
// Phase 14: Git History & Evolution Intelligence Types
// =========================================================================

export interface CommitFileChange {
  file_path: string;
  change_type: string;
  additions: number;
  deletions: number;
  net_lines: number;
}

export interface CommitItem {
  id: string;
  repository_id: string;
  commit_sha: string;
  author_name?: string | null;
  author_email?: string | null;
  message: string;
  committed_at: string;
  parent_shas: string[];
  category: string;
  is_source_and_test: boolean;
  files_changed_count: number;
  total_additions: number;
  total_deletions: number;
  file_changes: CommitFileChange[];
}

export interface FileAuthorOwnership {
  author_name: string;
  author_email?: string | null;
  commits_count: number;
  additions: number;
  deletions: number;
  ownership_percentage: number;
}

export interface FileEvolutionMetric {
  file_path: string;
  file_id?: string | null;
  total_commits: number;
  first_commit_date?: string | null;
  last_commit_date?: string | null;
  age_days: number;
  inactivity_days: number;
  activity_status: 'ACTIVE' | 'LOW_ACTIVITY' | 'INACTIVE';
  total_additions: number;
  total_deletions: number;
  total_churn: number;
  recent_churn_30d: number;
  change_frequency: number;
  unique_authors_count: number;
  primary_author?: string | null;
  primary_author_ownership: number;
  knowledge_concentration: 'HIGH' | 'MEDIUM' | 'BALANCED';
  authors: FileAuthorOwnership[];
  complexity?: number | null;
  is_high_evolution_risk: boolean;
}

export interface EvolutionHotspot {
  file_path: string;
  file_id?: string | null;
  hotspot_type: string;
  score: number;
  total_commits: number;
  total_churn: number;
  recent_churn_30d: number;
  complexity?: number | null;
  primary_author?: string | null;
  ownership_percentage: number;
  signals: string[];
  explanation: string;
}

export interface ContributorSummary {
  author_name: string;
  author_email?: string | null;
  total_commits: number;
  files_touched_count: number;
  total_additions: number;
  total_deletions: number;
  primary_owned_files_count: number;
  first_commit_date?: string | null;
  last_commit_date?: string | null;
}

export interface GitHistorySummary {
  repository_id: string;
  total_commits: number;
  total_contributors: number;
  is_shallow: boolean;
  status_message: string;
  first_commit_date?: string | null;
  last_commit_date?: string | null;
  total_churn: number;
  recent_churn_30d: number;
  weekly_velocity: number;
  category_counts: Record<string, number>;
  top_churn_files: FileEvolutionMetric[];
  top_hotspots: EvolutionHotspot[];
  top_contributors: ContributorSummary[];
  inactive_files_count: number;
  branches_count: number;
  tags_count: number;
  summary_text: string;
}

export interface CommitListResponse {
  repository_id: string;
  total: number;
  commits: CommitItem[];
  limit: number;
  offset: number;
}

export interface CommitDetailResponse {
  repository_id: string;
  commit: CommitItem;
}

export interface FileEvolutionListResponse {
  repository_id: string;
  total: number;
  files: FileEvolutionMetric[];
  limit: number;
  offset: number;
}

export interface FileEvolutionDetailResponse {
  repository_id: string;
  metric: FileEvolutionMetric;
  commits: CommitItem[];
}

// =========================================================================
// Phase 15: Dependency Intelligence & Supply-Chain Types
// =========================================================================

export interface DependencyUsageFile {
  file_path: string;
  file_id?: string | null;
  import_statement: string;
  imported_symbols: string[];
  line_number?: number | null;
}

export interface DependencyIntelligence {
  id: string;
  repository_id: string;
  name: string;
  ecosystem: string;
  declared_version?: string | null;
  resolved_version?: string | null;
  pinning_status: 'PINNED' | 'CONSTRAINED' | 'UNCONSTRAINED';
  dependency_type: 'DIRECT' | 'TRANSITIVE' | 'DEV' | 'PEER';
  package_source: 'registry' | 'vcs' | 'local' | 'unknown';
  manifest_file: string;
  lock_file?: string | null;
  usage_count: number;
  file_count: number;
  symbol_count: number;
  centrality: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNUSED';
  is_high_impact: boolean;
  is_potentially_unused: boolean;
  is_potentially_undeclared: boolean;
  has_version_drift: boolean;
  vcs_url?: string | null;
  importing_files: DependencyUsageFile[];
  affected_architecture_nodes: string[];
  risk_status: string;
  notes?: string | null;
}

export interface DependencySummary {
  repository_id: string;
  total_dependencies: number;
  direct_dependencies: number;
  transitive_dependencies: number;
  dev_dependencies: number;
  unpinned_dependencies: number;
  potentially_unused_dependencies: number;
  potentially_undeclared_dependencies: number;
  high_impact_dependencies: number;
  lockfiles_detected: string[];
  ecosystems_detected: string[];
  top_central_dependencies: DependencyIntelligence[];
  high_impact_list: DependencyIntelligence[];
  summary_text: string;
}

export interface DependencyImpact {
  repository_id: string;
  dependency_id: string;
  dependency_name: string;
  affected_files: string[];
  affected_symbols: string[];
  affected_architecture_nodes: string[];
  affected_test_files: string[];
  total_affected_files: number;
  centrality: string;
  explanation: string;
}

export type RepositoryProfile = UniversalProfile;

// =========================================================================
// Phase 18: Advanced Architecture Intelligence Types
// =========================================================================

export interface ArchitectureGraphNode {
  id: string;
  repository_id: string;
  node_type: string;
  name: string;
  label: string;
  source_reference?: string | null;
  properties: Record<string, any>;
}

export interface ArchitectureGraphEdge {
  source: string;
  target: string;
  relationship_type: string;
  weight: number;
  evidence: Record<string, any>;
}

export interface ArchitectureComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
  files_count: number;
  code_lines: number;
  symbol_count: number;
  files: string[];
  incoming_coupling: number;
  outgoing_coupling: number;
}

export interface ArchitectureDataFlowPath {
  entry_point: string;
  entry_file: string;
  flow_steps: string[];
  layer_sequence: string[];
  target_datastore: string;
  description: string;
}

export interface CouplingMetricItem {
  module: string;
  afferent_coupling_ca: number;
  efferent_coupling_ce: number;
  instability: number;
  total_coupling: number;
  classification: string;
  dependents: string[];
  dependencies: string[];
}

export interface ArchitectureViolation {
  violation_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  source_file: string;
  target_file: string;
  line: number;
  remediation?: string | null;
}

export interface ArchitectureSnapshotDiff {
  base_commit: string;
  current_commit: string;
  added_modules: Array<Record<string, any>>;
  removed_modules: Array<Record<string, any>>;
  added_services: Array<Record<string, any>>;
  removed_services: Array<Record<string, any>>;
  added_api_endpoints: Array<Record<string, any>>;
  removed_api_endpoints: Array<Record<string, any>>;
  net_module_delta: number;
  net_api_delta: number;
}

export interface AdvancedArchitectureIntelligence {
  repository_id: string;
  repository_name: string;
  analyzed_at: string;
  graph: {
    nodes: ArchitectureGraphNode[];
    edges: ArchitectureGraphEdge[];
    total_nodes: number;
    total_edges: number;
    node_types: string[];
    edge_types: string[];
  };
  components: ArchitectureComponentItem[];
  data_flows: ArchitectureDataFlowPath[];
  coupling: {
    module_metrics: CouplingMetricItem[];
    isolated_modules: string[];
    architectural_hubs: CouplingMetricItem[];
  };
  cycles: {
    has_cycles: boolean;
    cycle_count: number;
    cycles: string[][];
  };
  violations: ArchitectureViolation[];
  summary: {
    total_components: number;
    total_graph_nodes: number;
    total_graph_edges: number;
    total_data_flows: number;
    total_violations: number;
    has_circular_dependencies: boolean;
    isolated_modules_count: number;
  };
}





