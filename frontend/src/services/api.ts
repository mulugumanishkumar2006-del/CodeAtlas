import { 
  Repository, 
  RepositoryCreateInput, 
  HealthStatus, 
  RepositoryStatus, 
  AnalysisProgress,
  FileItem,
  SymbolItem,
  RepositoryQueryResponse,
  ConversationListResponse,
  ConversationResponse,
  ImpactAnalysisResponse,
  TargetDependencyResponse,
  QualitySummary,
  QualityFindingsResponse,
  QualityFilesResponse,
  QualityDuplicationsResponse,
  SecuritySummary,
  SecurityFindingsResponse,
  SecurityDependenciesResponse,
  SecurityHotspotsResponse,
  GitHistorySummary,
  CommitListResponse,
  CommitDetailResponse,
  FileEvolutionListResponse,
  FileEvolutionDetailResponse,
  DependencyIntelligence,
  DependencySummary,
  DependencyImpact,
  UniversalProfile,
  AnalysisSnapshot,
  AdvancedArchitectureIntelligence,
  ArchitectureGraphNode,
  ArchitectureGraphEdge,
  ArchitectureDataFlowPath,
  CouplingMetricItem,
  ArchitectureSnapshotDiff,
  HistoricalSnapshotListResponse,
  FileEvolutionHistoryResponse,
  CommitDetailPhase20Response,
  CommitCompareRequest,
  CommitCompareResponse,
  TechnicalDebtSummary,
  TechnicalDebtFindingItem,
  HotspotsListResponse,
  RepositoryRiskSummaryResponse,
  EntityRiskResponse,
  DebtRiskTrendsResponse,
  FindingDetailResponse,
  SimulationCreateRequest,
  SimulationDetailResponse,
  SimulationListResponse,
  EngineeringHealthResponse,
  EngineeringPrioritiesResponse,
  EngineeringRoadmapResponse,
  WhatShouldWeDoNextResponse,
  StrategyComparisonResponse,
  SimulateIgnoreResponse,
  EngineeringPlanListResponse,
  EngineeringPlanResponse,
  PullRequestReviewCreateInput,
  PullRequestReviewDetail,
  PullRequestReviewListResponse,
  PullRequestReviewDiffResponse,
  PullRequestReviewFindingsResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  async getRepositories(): Promise<Repository[]> {
    return this.request<Repository[]>('/repositories');
  }

  async getRepository(id: string): Promise<Repository> {
    return this.request<Repository>(`/repositories/${id}`);
  }

  async getRepositoryStatus(id: string): Promise<RepositoryStatus> {
    return this.request<RepositoryStatus>(`/repositories/${id}/status`);
  }

  async cloneRepository(id: string): Promise<RepositoryStatus> {
    return this.request<RepositoryStatus>(`/repositories/${id}/clone`, {
      method: 'POST',
    });
  }

  async syncRepository(id: string): Promise<RepositoryStatus> {
    return this.request<RepositoryStatus>(`/repositories/${id}/sync`, {
      method: 'POST',
    });
  }

  async indexRepository(id: string): Promise<AnalysisProgress> {
    return this.request<AnalysisProgress>(`/repositories/${id}/index`, {
      method: 'POST',
    });
  }

  async getAnalysisStatus(id: string): Promise<AnalysisProgress> {
    return this.request<AnalysisProgress>(`/repositories/${id}/analysis`);
  }

  async getRepositoryProfile(id: string): Promise<UniversalProfile> {
    return this.request<UniversalProfile>(`/repositories/${id}/profile`);
  }

  async getRepositorySnapshot(id: string): Promise<AnalysisSnapshot> {
    return this.request<AnalysisSnapshot>(`/repositories/${id}/snapshot`);
  }

  async getRepositoryFiles(id: string, language?: string): Promise<FileItem[]> {
    const query = language ? `?language=${encodeURIComponent(language)}` : '';
    return this.request<FileItem[]>(`/repositories/${id}/files${query}`);
  }

  async getRepositorySymbols(id: string, query?: string, symbolType?: string): Promise<SymbolItem[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (symbolType) params.append('symbol_type', symbolType);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<SymbolItem[]>(`/repositories/${id}/symbols${qs}`);
  }

  async getRepositoryDependencies(
    id: string,
    filters?: { source_file?: string; target_file?: string; dependency_type?: string; resolved?: boolean }
  ): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.source_file) params.append('source_file', filters.source_file);
    if (filters?.target_file) params.append('target_file', filters.target_file);
    if (filters?.dependency_type) params.append('dependency_type', filters.dependency_type);
    if (filters?.resolved !== undefined) params.append('resolved', String(filters.resolved));
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<any[]>(`/repositories/${id}/dependencies${qs}`);
  }

  async getRepositoryGraph(id: string, level?: string): Promise<any> {
    const qs = level ? `?level=${level}` : '';
    return this.request<any>(`/repositories/${id}/graph${qs}`);
  }

  async getFileDetail(repositoryId: string, fileId: string): Promise<any> {
    return this.request<any>(`/repositories/${repositoryId}/files/${fileId}`);
  }

  async searchRepository(
    repositoryId: string,
    query: string,
    options?: {
      type?: 'all' | 'code' | 'symbol' | 'file' | 'directory' | 'dependency' | 'architecture' | 'query';
      path?: string;
      language?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<any> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (options?.type) params.append('type', options.type);
    if (options?.path) params.append('path', options.path);
    if (options?.language) params.append('language', options.language);
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.offset) params.append('offset', String(options.offset));

    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request<any>(`/repositories/${repositoryId}/search${qs}`);
  }

  async getRepositoryArchitecture(id: string): Promise<any> {
    return this.request<any>(`/repositories/${id}/architecture`);
  }

  async getArchitectureModules(id: string): Promise<any> {
    return this.request<any>(`/repositories/${id}/architecture/modules`);
  }

  async getArchitectureModuleDetail(id: string, moduleId: string): Promise<any> {
    return this.request<any>(`/repositories/${id}/architecture/modules/${encodeURIComponent(moduleId)}`);
  }

  async createRepository(input: RepositoryCreateInput): Promise<Repository> {
    return this.request<Repository>('/repositories', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async deleteRepository(id: string): Promise<void> {
    return this.request<void>(`/repositories/${id}`, {
      method: 'DELETE',
    });
  }

  // =========================================================================
  // Phase 9: Evidence-Grounded Repository Q&A / RAG
  // =========================================================================

  async queryRepository(
    repositoryId: string,
    question: string,
    conversationId?: string | null,
  ): Promise<RepositoryQueryResponse> {
    return this.request<RepositoryQueryResponse>(`/repositories/${repositoryId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        question,
        conversation_id: conversationId || undefined,
      }),
    });
  }

  async getConversations(repositoryId: string): Promise<ConversationListResponse> {
    return this.request<ConversationListResponse>(`/repositories/${repositoryId}/conversations`);
  }

  async createConversation(repositoryId: string, title?: string): Promise<ConversationResponse> {
    return this.request<ConversationResponse>(`/repositories/${repositoryId}/conversations`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async getConversation(repositoryId: string, conversationId: string): Promise<ConversationResponse> {
    return this.request<ConversationResponse>(`/repositories/${repositoryId}/conversations/${conversationId}`);
  }

  async deleteConversation(repositoryId: string, conversationId: string): Promise<void> {
    return this.request<void>(`/repositories/${repositoryId}/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  }

  // =========================================================================
  // Phase 10: Dependency & Impact Intelligence API Methods
  // =========================================================================

  async getImpactAnalysis(
    repositoryId: string,
    targetId: string,
    direction: 'upstream' | 'downstream' | 'both' = 'both',
    maxDepth: number = 3,
    limit: number = 500
  ): Promise<ImpactAnalysisResponse> {
    const params = new URLSearchParams({
      direction,
      max_depth: maxDepth.toString(),
      limit: limit.toString(),
    });
    return this.request<ImpactAnalysisResponse>(
      `/repositories/${repositoryId}/impact/${encodeURIComponent(targetId)}?${params.toString()}`
    );
  }

  async getTargetDependencies(
    repositoryId: string,
    targetId: string
  ): Promise<TargetDependencyResponse> {
    return this.request<TargetDependencyResponse>(
      `/repositories/${repositoryId}/dependencies/${encodeURIComponent(targetId)}`
    );
  }

  // =========================================================================
  // Phase 12: Code Quality & Technical Debt API Methods
  // =========================================================================

  async getRepositoryQuality(repositoryId: string): Promise<QualitySummary> {
    return this.request<QualitySummary>(`/repositories/${repositoryId}/quality`);
  }

  async getQualityFindings(
    repositoryId: string,
    params?: {
      category?: string;
      severity?: string;
      file_path?: string;
      symbol?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<QualityFindingsResponse> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.severity) query.set('severity', params.severity);
    if (params?.file_path) query.set('file_path', params.file_path);
    if (params?.symbol) query.set('symbol', params.symbol);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<QualityFindingsResponse>(`/repositories/${repositoryId}/quality/findings${qs}`);
  }

  async getQualityFiles(
    repositoryId: string,
    params?: {
      risk_level?: string;
      sort_by?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<QualityFilesResponse> {
    const query = new URLSearchParams();
    if (params?.risk_level) query.set('risk_level', params.risk_level);
    if (params?.sort_by) query.set('sort_by', params.sort_by);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<QualityFilesResponse>(`/repositories/${repositoryId}/quality/files${qs}`);
  }

  async getQualityDuplications(repositoryId: string): Promise<QualityDuplicationsResponse> {
    return this.request<QualityDuplicationsResponse>(`/repositories/${repositoryId}/quality/duplications`);
  }

  // =========================================================================
  // Phase 13: Security & Reliability API Methods
  // =========================================================================

  async getRepositorySecurity(repositoryId: string): Promise<SecuritySummary> {
    return this.request<SecuritySummary>(`/repositories/${repositoryId}/security`);
  }

  async getSecurityFindings(
    repositoryId: string,
    params?: {
      finding_type?: string;
      category?: string;
      severity?: string;
      confidence?: string;
      file_path?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<SecurityFindingsResponse> {
    const query = new URLSearchParams();
    if (params?.finding_type) query.set('finding_type', params.finding_type);
    if (params?.category) query.set('category', params.category);
    if (params?.severity) query.set('severity', params.severity);
    if (params?.confidence) query.set('confidence', params.confidence);
    if (params?.file_path) query.set('file_path', params.file_path);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<SecurityFindingsResponse>(`/repositories/${repositoryId}/security/findings${qs}`);
  }

  async getSecurityDependencies(repositoryId: string): Promise<SecurityDependenciesResponse> {
    return this.request<SecurityDependenciesResponse>(`/repositories/${repositoryId}/security/dependencies`);
  }

  async getSecurityHotspots(repositoryId: string): Promise<SecurityHotspotsResponse> {
    return this.request<SecurityHotspotsResponse>(`/repositories/${repositoryId}/security/hotspots`);
  }

  // =========================================================================
  // Phase 14: Git History & Evolution API Methods
  // =========================================================================

  async getHistorySummary(repositoryId: string): Promise<GitHistorySummary> {
    return this.request<GitHistorySummary>(`/repositories/${repositoryId}/history/summary`);
  }

  async getFileEvolutionList(
    repositoryId: string,
    params?: {
      sort_by?: string;
      activity_status?: string;
      knowledge_concentration?: string;
      high_risk_only?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<FileEvolutionListResponse> {
    const query = new URLSearchParams();
    if (params?.sort_by) query.set('sort_by', params.sort_by);
    if (params?.activity_status) query.set('activity_status', params.activity_status);
    if (params?.knowledge_concentration) query.set('knowledge_concentration', params.knowledge_concentration);
    if (params?.high_risk_only) query.set('high_risk_only', 'true');
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<FileEvolutionListResponse>(`/repositories/${repositoryId}/history/files${qs}`);
  }

  async getCommits(
    repositoryId: string,
    params?: {
      author?: string;
      category?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<CommitListResponse> {
    const query = new URLSearchParams();
    if (params?.author) query.set('author', params.author);
    if (params?.category) query.set('category', params.category);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<CommitListResponse>(`/repositories/${repositoryId}/commits${qs}`);
  }

  async getCommitDetail(repositoryId: string, commitSha: string): Promise<CommitDetailResponse> {
    return this.request<CommitDetailResponse>(`/repositories/${repositoryId}/commits/${encodeURIComponent(commitSha)}`);
  }

  async getFileHistory(repositoryId: string, fileId: string): Promise<FileEvolutionDetailResponse> {
    return this.request<FileEvolutionDetailResponse>(`/repositories/${repositoryId}/files/${encodeURIComponent(fileId)}/history`);
  }

  // =========================================================================
  // Phase 15: Dependency Intelligence & Supply-Chain API Methods
  // =========================================================================

  async getDependencySummary(repositoryId: string): Promise<DependencySummary> {
    return this.request<DependencySummary>(`/repositories/${repositoryId}/dependencies/summary`);
  }

  async getDependenciesIntelligence(
    repositoryId: string,
    params?: {
      ecosystem?: string;
      dependency_type?: string;
      centrality?: string;
      pinning_status?: string;
      search?: string;
      unused_only?: boolean;
      undeclared_only?: boolean;
      high_impact_only?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<DependencyIntelligence[]> {
    const query = new URLSearchParams();
    if (params?.ecosystem) query.set('ecosystem', params.ecosystem);
    if (params?.dependency_type) query.set('dependency_type', params.dependency_type);
    if (params?.centrality) query.set('centrality', params.centrality);
    if (params?.pinning_status) query.set('pinning_status', params.pinning_status);
    if (params?.search) query.set('search', params.search);
    if (params?.unused_only) query.set('unused_only', 'true');
    if (params?.undeclared_only) query.set('undeclared_only', 'true');
    if (params?.high_impact_only) query.set('high_impact_only', 'true');
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<DependencyIntelligence[]>(`/repositories/${repositoryId}/dependencies${qs}`);
  }

  async getDependencyDetail(
    repositoryId: string,
    dependencyId: string
  ): Promise<{ repository_id: string; dependency: DependencyIntelligence }> {
    return this.request<{ repository_id: string; dependency: DependencyIntelligence }>(
      `/repositories/${repositoryId}/dependencies/${encodeURIComponent(dependencyId)}`
    );
  }

  async getDependencyImpact(repositoryId: string, dependencyId: string): Promise<DependencyImpact> {
    return this.request<DependencyImpact>(
      `/repositories/${repositoryId}/dependencies/${encodeURIComponent(dependencyId)}/impact`
    );
  }

  // Phase 18: Advanced Architecture Intelligence
  async getArchitectureIntelligence(repositoryId: string): Promise<AdvancedArchitectureIntelligence> {
    return this.request<AdvancedArchitectureIntelligence>(`/repositories/${repositoryId}/architecture/intelligence`);
  }

  async getArchitectureGraph(
    repositoryId: string,
    params?: { node_type?: string; edge_type?: string }
  ): Promise<{
    repository_id: string;
    nodes: ArchitectureGraphNode[];
    edges: ArchitectureGraphEdge[];
    total_nodes: number;
    total_edges: number;
    node_types: string[];
    edge_types: string[];
  }> {
    const query = new URLSearchParams();
    if (params?.node_type) query.set('node_type', params.node_type);
    if (params?.edge_type) query.set('edge_type', params.edge_type);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/repositories/${repositoryId}/architecture/graph${qs}`);
  }

  async getArchitectureDataFlows(
    repositoryId: string
  ): Promise<{ repository_id: string; data_flows: ArchitectureDataFlowPath[]; total_data_flows: number }> {
    return this.request(`/repositories/${repositoryId}/architecture/data-flows`);
  }

  async getArchitectureCoupling(
    repositoryId: string
  ): Promise<{
    repository_id: string;
    module_metrics: CouplingMetricItem[];
    isolated_modules: string[];
    architectural_hubs: CouplingMetricItem[];
  }> {
    return this.request(`/repositories/${repositoryId}/architecture/coupling`);
  }

  async getArchitectureDiff(
    repositoryId: string,
    baseCommit?: string
  ): Promise<ArchitectureSnapshotDiff> {
    const query = baseCommit ? `?base_commit=${encodeURIComponent(baseCommit)}` : '';
    return this.request<ArchitectureSnapshotDiff>(`/repositories/${repositoryId}/architecture/diff${query}`);
  }

  // =========================================================================
  // Phase 20: Code Time Machine API Methods
  // =========================================================================

  async getHistoricalSnapshots(repositoryId: string): Promise<HistoricalSnapshotListResponse> {
    return this.request<HistoricalSnapshotListResponse>(`/repositories/${repositoryId}/history/snapshots`);
  }

  async getFileEvolutionHistory(repositoryId: string, fileIdOrPath: string): Promise<FileEvolutionHistoryResponse> {
    return this.request<FileEvolutionHistoryResponse>(`/repositories/${repositoryId}/history/files/${encodeURIComponent(fileIdOrPath)}`);
  }

  async getCommitDetailPhase20(repositoryId: string, commitHash: string): Promise<CommitDetailPhase20Response> {
    return this.request<CommitDetailPhase20Response>(`/repositories/${repositoryId}/history/commits/${encodeURIComponent(commitHash)}`);
  }

  async compareCommits(repositoryId: string, request: CommitCompareRequest): Promise<CommitCompareResponse> {
    return this.request<CommitCompareResponse>(`/repositories/${repositoryId}/history/compare`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // =========================================================================
  // Phase 21: Technical Debt & Risk Intelligence API Methods
  // =========================================================================

  async getTechnicalDebt(repositoryId: string): Promise<TechnicalDebtSummary> {
    return this.request<TechnicalDebtSummary>(`/repositories/${repositoryId}/debt`);
  }

  async getRepositoryRisk(repositoryId: string): Promise<RepositoryRiskSummaryResponse> {
    return this.request<RepositoryRiskSummaryResponse>(`/repositories/${repositoryId}/risk`);
  }

  async getDebtFindings(
    repositoryId: string,
    params?: { category?: string; severity?: string; status?: string; limit?: number; offset?: number }
  ): Promise<{ repository_id: string; total_findings: number; findings: TechnicalDebtFindingItem[] }> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.severity) searchParams.append('severity', params.severity);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit !== undefined) searchParams.append('limit', String(params.limit));
    if (params?.offset !== undefined) searchParams.append('offset', String(params.offset));
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/repositories/${repositoryId}/findings${qs}`);
  }

  async getFindingDetail(repositoryId: string, findingId: string): Promise<FindingDetailResponse> {
    return this.request<FindingDetailResponse>(`/repositories/${repositoryId}/findings/${encodeURIComponent(findingId)}`);
  }

  async getEngineeringHotspots(repositoryId: string): Promise<HotspotsListResponse> {
    return this.request<HotspotsListResponse>(`/repositories/${repositoryId}/hotspots`);
  }

  async getEntityRisk(repositoryId: string, entityType: string, entityId: string): Promise<EntityRiskResponse> {
    return this.request<EntityRiskResponse>(`/repositories/${repositoryId}/risk/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`);
  }

  async getRiskTrends(repositoryId: string): Promise<DebtRiskTrendsResponse> {
    return this.request<DebtRiskTrendsResponse>(`/repositories/${repositoryId}/risk/trends`);
  }

  // =========================================================================
  // Phase 22: Future Impact Simulator API Methods
  // =========================================================================

  async createSimulation(repositoryId: string, payload: SimulationCreateRequest): Promise<SimulationDetailResponse> {
    return this.request<SimulationDetailResponse>(`/repositories/${repositoryId}/simulations`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async listSimulations(repositoryId: string): Promise<SimulationListResponse> {
    return this.request<SimulationListResponse>(`/repositories/${repositoryId}/simulations`);
  }

  async getSimulation(repositoryId: string, simulationId: string): Promise<SimulationDetailResponse> {
    return this.request<SimulationDetailResponse>(`/repositories/${repositoryId}/simulations/${encodeURIComponent(simulationId)}`);
  }

  async deleteSimulation(repositoryId: string, simulationId: string): Promise<void> {
    return this.request<void>(`/repositories/${repositoryId}/simulations/${encodeURIComponent(simulationId)}`, {
      method: 'DELETE',
    });
  }

  async simulateTarget(repositoryId: string, payload: SimulationCreateRequest): Promise<SimulationDetailResponse> {
    return this.request<SimulationDetailResponse>(`/repositories/${repositoryId}/simulations/target`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // =========================================================================
  // Phase 23: AI CTO / Engineering Planning API Methods
  // =========================================================================

  async getEngineeringHealth(repositoryId: string): Promise<EngineeringHealthResponse> {
    return this.request<EngineeringHealthResponse>(`/repositories/${repositoryId}/engineering/health`);
  }

  async getEngineeringPriorities(repositoryId: string): Promise<EngineeringPrioritiesResponse> {
    return this.request<EngineeringPrioritiesResponse>(`/repositories/${repositoryId}/engineering/priorities`);
  }

  async getEngineeringRoadmap(repositoryId: string, timeFrame: string = '1_month'): Promise<EngineeringRoadmapResponse> {
    return this.request<EngineeringRoadmapResponse>(`/repositories/${repositoryId}/engineering/roadmap?time_frame=${encodeURIComponent(timeFrame)}`);
  }

  async whatShouldWeDoNext(repositoryId: string): Promise<WhatShouldWeDoNextResponse> {
    return this.request<WhatShouldWeDoNextResponse>(`/repositories/${repositoryId}/engineering/next`);
  }

  async compareEngineeringStrategies(
    repositoryId: string,
    workItemId?: string,
    topic?: string
  ): Promise<StrategyComparisonResponse> {
    const params = new URLSearchParams();
    if (workItemId) params.append('work_item_id', workItemId);
    if (topic) params.append('topic', topic);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<StrategyComparisonResponse>(`/repositories/${repositoryId}/engineering/strategies${query}`);
  }

  async simulateIgnore(repositoryId: string, workItemId: string): Promise<SimulateIgnoreResponse> {
    return this.request<SimulateIgnoreResponse>(
      `/repositories/${repositoryId}/engineering/simulate-ignore?work_item_id=${encodeURIComponent(workItemId)}`,
      { method: 'POST' }
    );
  }

  async listEngineeringPlans(repositoryId: string): Promise<EngineeringPlanListResponse> {
    return this.request<EngineeringPlanListResponse>(`/repositories/${repositoryId}/engineering/plans`);
  }

  async generateEngineeringPlan(
    repositoryId: string,
    payload: { title?: string; time_horizon?: string; focus_areas?: string[] }
  ): Promise<EngineeringPlanResponse> {
    return this.request<EngineeringPlanResponse>(`/repositories/${repositoryId}/engineering/plans/generate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createCustomEngineeringPlan(
    repositoryId: string,
    payload: { title: string; time_horizon?: string; summary?: string; work_items?: any[]; roadmaps?: any }
  ): Promise<EngineeringPlanResponse> {
    return this.request<EngineeringPlanResponse>(`/repositories/${repositoryId}/engineering/plans`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getEngineeringPlan(repositoryId: string, planId: string): Promise<EngineeringPlanResponse> {
    return this.request<EngineeringPlanResponse>(`/repositories/${repositoryId}/engineering/plans/${encodeURIComponent(planId)}`);
  }

  async updateEngineeringPlanStatus(
    repositoryId: string,
    planId: string,
    newStatus: string
  ): Promise<EngineeringPlanResponse> {
    return this.request<EngineeringPlanResponse>(
      `/repositories/${repositoryId}/engineering/plans/${encodeURIComponent(planId)}?new_status=${encodeURIComponent(newStatus)}`,
      { method: 'PATCH' }
    );
  }

  // =========================================================================
  // Phase 24: CI/CD & Automated Pull Request Reviewer API Methods
  // =========================================================================

  async createPullRequestReview(
    repositoryId: string,
    input: PullRequestReviewCreateInput
  ): Promise<PullRequestReviewDetail> {
    return this.request<PullRequestReviewDetail>(`/repositories/${repositoryId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getPullRequestReviews(
    repositoryId: string,
    statusFilter?: string
  ): Promise<PullRequestReviewListResponse> {
    const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    return this.request<PullRequestReviewListResponse>(`/repositories/${repositoryId}/reviews${qs}`);
  }

  async getPullRequestReview(
    repositoryId: string,
    reviewId: string
  ): Promise<PullRequestReviewDetail> {
    return this.request<PullRequestReviewDetail>(
      `/repositories/${repositoryId}/reviews/${encodeURIComponent(reviewId)}`
    );
  }

  async getPullRequestReviewDiff(
    repositoryId: string,
    reviewId: string
  ): Promise<PullRequestReviewDiffResponse> {
    return this.request<PullRequestReviewDiffResponse>(
      `/repositories/${repositoryId}/reviews/${encodeURIComponent(reviewId)}/diff`
    );
  }

  async getPullRequestReviewFindings(
    repositoryId: string,
    reviewId: string,
    severity?: string
  ): Promise<PullRequestReviewFindingsResponse> {
    const qs = severity ? `?severity=${encodeURIComponent(severity)}` : '';
    return this.request<PullRequestReviewFindingsResponse>(
      `/repositories/${repositoryId}/reviews/${encodeURIComponent(reviewId)}/findings${qs}`
    );
  }

  async getPullRequestReviewStatus(
    repositoryId: string,
    reviewId: string
  ): Promise<{ review_id: string; repository_id: string; status: string; review_gate_status: string; progress_percent: number; stage: string }> {
    return this.request(`/repositories/${repositoryId}/reviews/${encodeURIComponent(reviewId)}/status`);
  }

  async getPullRequestReviewConfig(
    repositoryId: string
  ): Promise<{ repository_id: string; config: Record<string, any> }> {
    return this.request(`/repositories/${repositoryId}/reviews/config`);
  }
}

export const api = new ApiClient();




