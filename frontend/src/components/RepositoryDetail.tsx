import React, { useState, useEffect } from 'react';
import { Repository, AnalysisProgress, FileItem, SymbolItem, DependencyItem, GraphData, GraphNodeItem, WorkspaceTab, UniversalProfile } from '../types';
import { api } from '../services/api';
import { ArchitectureView } from './ArchitectureView';
import { QualityView } from './QualityView';
import { SecurityReliabilityView } from './SecurityReliabilityView';
import { HistoryView } from './HistoryView';
import { DependenciesView } from './DependenciesView';
import { CodeExplorer } from './CodeExplorer';
import { ChatAssistantView } from './ChatAssistantView';
import { SearchIntelligenceModal } from './SearchIntelligenceModal';
import { ImpactIntelligenceModal } from './ImpactIntelligenceModal';
import { UniversalRepositoryOverview } from './UniversalRepositoryOverview';
import { SimulationView } from './SimulationView';
import { 
  ExternalLink, 
  GitBranch, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Loader2, 
  FileCode2,
  Boxes,
  Layers,
  Search,
  Code2,
  Play,
  RotateCcw,
  FileText,
  Network,
  ArrowRightLeft,
  MessageSquareCode,
  PlayCircle,
} from 'lucide-react';

interface RepositoryDetailProps {
  repository: Repository;
  onDelete: (id: string) => Promise<void>;
  onClone: (id: string) => Promise<void>;
  onSync: (id: string) => Promise<void>;
  onIndex: (id: string) => Promise<void>;
  currentTab?: WorkspaceTab;
  onTabChange?: (tab: WorkspaceTab) => void;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
}

export const RepositoryDetail: React.FC<RepositoryDetailProps> = ({
  repository,
  onDelete,
  onClone,
  onSync,
  onIndex,
  currentTab = 'overview',
  onTabChange,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  
  // Real Files, Symbols, Dependencies & Graph Exploration
  const [files, setFiles] = useState<FileItem[]>([]);
  const [symbols, setSymbols] = useState<SymbolItem[]>([]);
  const [dependencies, setDependencies] = useState<DependencyItem[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNodeItem | null>(null);
  const [profile, setProfile] = useState<UniversalProfile | null>(null);

  const [activeTab, setActiveTab] = useState<WorkspaceTab>(currentTab);
  const [explorerTargetFileId, setExplorerTargetFileId] = useState<string | null>(null);
  const [explorerTargetLine, setExplorerTargetLine] = useState<number | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [impactTargetId, setImpactTargetId] = useState<string | null>(null);
  const [symbolSearch, setSymbolSearch] = useState('');

  useEffect(() => {
    if (currentTab) {
      setActiveTab(currentTab);
    }
  }, [currentTab]);

  const handleTabSelect = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const navigateToSource = (fileIdOrPath: string, line?: number) => {
    const matched = files.find(f => f.path === fileIdOrPath || f.id === fileIdOrPath);
    setExplorerTargetFileId(matched ? matched.id : fileIdOrPath);
    setExplorerTargetLine(line || null);
    handleTabSelect('files');
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const acquisitionStatus = repository.acquisition_status || 'NOT_CLONED';
  const isAnalyzing = repository.analysis_status === 'running' || analysisProgress?.status === 'running' || analysisProgress?.status === 'DISCOVERING_FILES' || analysisProgress?.status === 'STORING_FILES' || analysisProgress?.status === 'PARSING_METADATA' || analysisProgress?.status === 'PARSING' || analysisProgress?.status === 'BUILDING_GRAPH' || analysisProgress?.status === 'ANALYZING';
  const isFailed = repository.analysis_status === 'failed' || analysisProgress?.status === 'FAILED';
  const isOperating = acquisitionStatus === 'CLONING' || acquisitionStatus === 'SYNCING' || isAnalyzing || isActionLoading;

  // Poll analysis progress if running
  useEffect(() => {
    let interval: any = null;

    const fetchAnalysis = async () => {
      try {
        const progress = await api.getAnalysisStatus(repository.id);
        setAnalysisProgress(progress);
      } catch (err) {
        console.error('Error fetching analysis progress:', err);
      }
    };

    fetchAnalysis();

    if (isAnalyzing || repository.analysis_status === 'pending') {
      interval = setInterval(fetchAnalysis, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [repository.id, isAnalyzing, repository.analysis_status]);

  // Load files, symbols, dependencies, graph and universal profile when analysis is completed or partial
  useEffect(() => {
    const isFinished = 
      repository.analysis_status === 'completed' || 
      repository.analysis_status === 'partial' || 
      analysisProgress?.status === 'COMPLETED' || 
      analysisProgress?.status === 'PARTIAL' || 
      analysisProgress?.status === 'completed' || 
      analysisProgress?.status === 'partial';

    const loadCodeData = async () => {
      if (isFinished) {
        try {
          const [filesData, symbolsData, depsData, gData, profData] = await Promise.all([
            api.getRepositoryFiles(repository.id),
            api.getRepositorySymbols(repository.id),
            api.getRepositoryDependencies(repository.id),
            api.getRepositoryGraph(repository.id),
            api.getRepositoryProfile(repository.id).catch(() => null),
          ]);
          setFiles(filesData);
          setSymbols(symbolsData);
          setDependencies(depsData);
          setGraphData(gData);
          if (profData) {
            setProfile(profData);
          }
          if (gData?.nodes?.length > 0 && !selectedNode) {
            setSelectedNode(gData.nodes[0]);
          }
        } catch (err) {
          console.error('Error loading repository code intelligence:', err);
        }
      }
    };

    loadCodeData();
  }, [repository.id, repository.analysis_status, analysisProgress?.status]);


  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${repository.name} from CodeAtlas? Local source files will be cleaned up. Your GitHub repository will remain untouched.`)) {
      try {
        setIsDeleting(true);
        await onDelete(repository.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCloneClick = async () => {
    try {
      setIsActionLoading(true);
      await onClone(repository.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSyncClick = async () => {
    try {
      setIsActionLoading(true);
      await onSync(repository.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleIndexClick = async () => {
    try {
      setIsActionLoading(true);
      await onIndex(repository.id);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formattedCreatedDate = new Date(repository.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const metadata: any = repository.metadata_json || {};
  const analysisSummary: any = metadata.analysis_summary || {};
  const languages: any[] = metadata.languages || [];
  const largestFiles: any[] = analysisSummary.largest_files || [];
  const fileCount = metadata.file_count ?? files.length;
  const symbolCount = metadata.symbol_count ?? symbols.length;
  const lineCount = metadata.line_count ?? 0;
  const codeLines = metadata.code_lines ?? analysisSummary.total_code_lines ?? lineCount;
  const blankLines = metadata.blank_lines ?? analysisSummary.total_blank_lines ?? 0;
  const commentLines = metadata.comment_lines ?? analysisSummary.total_comment_lines ?? 0;

  const filteredSymbols = symbols.filter(s => 
    s.name.toLowerCase().includes(symbolSearch.toLowerCase()) ||
    s.symbol_type.toLowerCase().includes(symbolSearch.toLowerCase()) ||
    s.qualified_name.toLowerCase().includes(symbolSearch.toLowerCase())
  );

  const discoveredCount = analysisProgress?.files_discovered || fileCount || 0;
  const processedCount = analysisProgress?.files_processed || files.length || 0;

  return (
    <div className="repo-view-container">
      {/* Repository Main Info Header */}
      <div className="repo-meta-card">
        <div className="repo-meta-header">
          <div>
            <h2 className="repo-meta-title">{repository.name}</h2>
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-meta-url"
            >
              <span>{repository.url}</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {acquisitionStatus === 'READY' && (
              <>
                <button
                  id="btn-sync-repository"
                  className="btn-secondary"
                  onClick={handleSyncClick}
                  disabled={isOperating}
                  title="Pull latest remote changes"
                >
                  <RefreshCw size={13} className={isActionLoading ? 'spin-animation' : ''} />
                  <span>Sync</span>
                </button>

                <button
                  id="btn-trigger-index"
                  className="btn-primary"
                  onClick={handleIndexClick}
                  disabled={isOperating}
                  title="Run AST parser & code symbol extraction"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={14} className="spin-animation" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Play size={13} />
                      <span>{repository.analysis_status === 'completed' ? 'Re-index' : 'Analyze'}</span>
                    </>
                  )}
                </button>
              </>
            )}

            <button
              id="btn-delete-repository"
              className="btn-secondary"
              style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
              onClick={handleDelete}
              disabled={isDeleting || isOperating}
              title="Remove repository and clean up local source storage"
            >
              <Trash2 size={14} />
              <span>{isDeleting ? 'Removing...' : 'Remove'}</span>
            </button>
          </div>
        </div>

        {repository.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
            {repository.description}
          </p>
        )}

        <div className="repo-meta-grid">
          <div>
            <div className="repo-meta-item-label">Default Branch</div>
            <div className="repo-meta-item-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <GitBranch size={13} style={{ color: 'var(--accent-cyan)' }} />
              {repository.default_branch || 'main'}
            </div>
          </div>

          <div>
            <div className="repo-meta-item-label">Acquisition Status</div>
            <div 
              className="repo-meta-item-value" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                color: acquisitionStatus === 'READY' 
                  ? 'var(--accent-emerald)' 
                  : acquisitionStatus === 'ERROR'
                  ? 'var(--accent-rose)'
                  : 'var(--accent-cyan)'
              }}
            >
              {acquisitionStatus === 'READY' && <CheckCircle2 size={13} />}
              {acquisitionStatus === 'ERROR' && <AlertTriangle size={13} />}
              <span>{acquisitionStatus}</span>
            </div>
          </div>

          <div>
            <div className="repo-meta-item-label">Analysis Status</div>
            <div 
              className="repo-meta-item-value" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                color: repository.analysis_status === 'completed' 
                  ? 'var(--accent-emerald)' 
                  : repository.analysis_status === 'partial'
                  ? '#fbbf24'
                  : isAnalyzing
                  ? 'var(--accent-cyan)'
                  : isFailed
                  ? 'var(--accent-rose)'
                  : 'var(--text-muted)'
              }}
            >
              {repository.analysis_status === 'completed' && <CheckCircle2 size={13} />}
              {repository.analysis_status === 'partial' && <AlertTriangle size={13} />}
              {isAnalyzing && <Loader2 size={13} className="spin-animation" />}
              {isFailed && <AlertTriangle size={13} />}
              <span>{isAnalyzing ? 'Analyzing...' : isFailed ? 'Failed' : repository.analysis_status === 'partial' ? 'Partial Analysis' : (repository.analysis_status || 'Pending')}</span>
            </div>
          </div>

          <div>
            <div className="repo-meta-item-label">Connected On</div>
            <div className="repo-meta-item-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
              {formattedCreatedDate}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Running Progress Checklist & Counters */}
      {isAnalyzing && (
        <div className="acquisition-card loading-state">
          <div className="acquisition-card-header">
            <div className="acquisition-card-icon loading">
              <Loader2 size={24} className="spin-animation" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="acquisition-card-title">
                {repository.name} — Indexing repository...
              </h3>
              <p className="acquisition-card-subtitle">
                {analysisProgress?.stage || 'Discovering files, detecting languages, and indexing source files.'}
              </p>
              
              <div className="acquisition-pulse-container" style={{ height: 6, marginTop: 10, marginBottom: 12 }}>
                <div 
                  className="acquisition-pulse-bar" 
                  style={{ 
                    width: `${analysisProgress?.progress_percent || 30}%`,
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>

              {/* Progress Checklist */}
              <div className="indexing-checklist" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--accent-emerald)' }}>
                  <CheckCircle2 size={14} />
                  <span>Repository connected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: discoveredCount > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                  {discoveredCount > 0 ? <CheckCircle2 size={14} /> : <span style={{ width: 14, textAlign: 'center' }}>○</span>}
                  <span>Files discovered ({discoveredCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: isAnalyzing ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                  <Loader2 size={14} className="spin-animation" />
                  <span>Processing source files & AST structures</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span style={{ width: 14, textAlign: 'center' }}>○</span>
                  <span>Building repository metadata</span>
                </div>
              </div>

              {/* Real Counters */}
              <div className="indexing-counters-row" style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                <span>Files discovered: <strong style={{ color: 'var(--text-primary)' }}>{discoveredCount}</strong></span>
                <span>Files indexed: <strong style={{ color: 'var(--text-primary)' }}>{processedCount}</strong></span>
                <span>Symbols: <strong style={{ color: 'var(--accent-indigo)' }}>{analysisProgress?.symbols_extracted || 0}</strong></span>
                <span>Progress: <strong style={{ color: 'var(--accent-cyan)' }}>{analysisProgress?.progress_percent || 0}%</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failure State & Retry Banner */}
      {isFailed && !isAnalyzing && (
        <div className="acquisition-card error-state">
          <div className="acquisition-card-header">
            <div className="acquisition-card-icon error">
              <AlertTriangle size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="acquisition-card-title">Repository could not be indexed</h3>
              <p className="acquisition-card-subtitle" style={{ color: 'var(--accent-rose)' }}>
                Reason: {analysisProgress?.error || repository.acquisition_error || 'An unexpected error occurred during repository ingestion.'}
              </p>
            </div>
          </div>
          <div className="acquisition-card-actions">
            <button
              id="btn-retry-index"
              className="btn-primary"
              onClick={handleIndexClick}
              disabled={isOperating}
            >
              <RotateCcw size={14} />
              <span>Retry Indexing</span>
            </button>
          </div>
        </div>
      )}

      {/* Ingestion Not Started Banner */}
      {acquisitionStatus === 'NOT_CLONED' && !isAnalyzing && !isFailed && (
        <div className="acquisition-card unacquired-state">
          <div className="acquisition-card-header">
            <div className="acquisition-card-icon not-cloned">
              <Download size={22} />
            </div>
            <div>
              <h3 className="acquisition-card-title">Repository Connected</h3>
              <p className="acquisition-card-subtitle">
                Source code has not been acquired yet. Click below to fetch the working tree and analyze code.
              </p>
            </div>
          </div>

          <div className="acquisition-card-actions">
            <button
              id="btn-get-repository"
              className="btn-primary"
              onClick={handleCloneClick}
              disabled={isOperating}
            >
              <Download size={15} />
              <span>Get & Analyze Repository</span>
            </button>
          </div>
        </div>
      )}

      {/* Code Intelligence Dashboard (When Analysis Completed) */}
      {repository.analysis_status === 'completed' && !isAnalyzing && (
        <div className="code-intelligence-container">
          {/* Metrics summary cards */}
          <div className="stats-metric-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ color: 'var(--accent-cyan)' }}>
                <FileCode2 size={20} />
              </div>
              <div className="stat-number">{fileCount}</div>
              <div className="stat-label">Source Files</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: 'var(--accent-indigo)' }}>
                <Boxes size={20} />
              </div>
              <div className="stat-number">{symbolCount}</div>
              <div className="stat-label">AST Symbols</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: 'var(--accent-emerald)' }}>
                <Layers size={20} />
              </div>
              <div className="stat-number">{lineCount.toLocaleString()}</div>
              <div className="stat-label">Total Lines ({codeLines.toLocaleString()} Code)</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ color: 'var(--accent-cyan)' }}>
                <Code2 size={20} />
              </div>
              <div className="stat-number" style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>
                {metadata.primary_language || 'Polyglot'}
              </div>
              <div className="stat-label">Primary Language</div>
            </div>
          </div>

          {/* Language Breakdown */}
          {languages.length > 0 && (
            <div className="language-breakdown-card">
              <h4 className="section-title">Languages & Line Distribution</h4>
              <div className="language-bar-multi">
                {languages.map((l: any, i: number) => {
                  const colors = ['#38bdf8', '#818cf8', '#34d399', '#f43f5e', '#fbbf24', '#a855f7'];
                  const color = colors[i % colors.length];
                  return (
                    <div 
                      key={l.language} 
                      className="language-bar-segment"
                      style={{ 
                        width: `${Math.max(l.percentage, 2)}%`, 
                        backgroundColor: color 
                      }}
                      title={`${l.language}: ${l.percentage}% (${(l.line_count || 0).toLocaleString()} lines)`}
                    />
                  );
                })}
              </div>

              <div className="language-pills-list">
                {languages.map((l: any, i: number) => {
                  const colors = ['#38bdf8', '#818cf8', '#34d399', '#f43f5e', '#fbbf24', '#a855f7'];
                  const color = colors[i % colors.length];
                  return (
                    <div key={l.language} className="lang-pill">
                      <span className="lang-dot" style={{ backgroundColor: color }} />
                      <span className="lang-name">{l.language}</span>
                      <span className="lang-percent">{(l.line_count || 0).toLocaleString()} lines</span>
                      <span className="lang-count">({l.percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Exploration Tabs Container */}
          <div className="explorer-tabs-card" style={{ marginTop: 20, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden' }}>
            <div className="explorer-tabs-header">
              <button 
                className={`explorer-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => handleTabSelect('overview')}
              >
                <Layers size={14} />
                <span>Overview</span>
              </button>
              <button 
                id="btn-tab-chat"
                className={`explorer-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => handleTabSelect('chat')}
              >
                <MessageSquareCode size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span>Assistant / Q&A</span>
              </button>
              <button 
                className={`explorer-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
                onClick={() => handleTabSelect('architecture')}
              >
                <Network size={14} />
                <span>Architecture Graph ({graphData?.edges?.length || 0})</span>
              </button>
              <button 
                className={`explorer-tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
                onClick={() => handleTabSelect('simulation')}
              >
                <PlayCircle size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span>Future Simulator</span>
              </button>
              <button 
                className={`explorer-tab-btn ${activeTab === 'dependencies' ? 'active' : ''}`}
                onClick={() => handleTabSelect('dependencies')}
              >
                <ArrowRightLeft size={14} />
                <span>Dependencies ({dependencies.length})</span>
              </button>
              <button 
                className={`explorer-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
                onClick={() => handleTabSelect('files')}
              >
                <FileCode2 size={14} />
                <span>Files ({files.length})</span>
              </button>
              <button 
                className={`explorer-tab-btn ${activeTab === 'symbols' ? 'active' : ''}`}
                onClick={() => setActiveTab('symbols')}
              >
                <Boxes size={14} />
                <span>Symbols ({symbols.length})</span>
              </button>

              <button
                className="explorer-tab-btn search-trigger-tab-btn"
                onClick={() => setIsSearchModalOpen(true)}
                title="Search repository code & symbols (Ctrl+K)"
                style={{ marginLeft: 'auto', background: 'rgba(56, 189, 248, 0.08)', color: 'var(--accent-cyan)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
              >
                <Search size={14} />
                <span>Search Intelligence</span>
                <span className="kbd-pill">Ctrl+K</span>
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-panel-body">
                {/* Line breakdown details */}
                <div className="acquisition-details-grid" style={{ marginBottom: 20 }}>
                  <div className="acquisition-detail-box">
                    <span className="detail-label">Total Lines</span>
                    <span className="detail-value">{lineCount.toLocaleString()}</span>
                  </div>
                  <div className="acquisition-detail-box">
                    <span className="detail-label">Code Lines</span>
                    <span className="detail-value" style={{ color: 'var(--accent-emerald)' }}>{codeLines.toLocaleString()}</span>
                  </div>
                  <div className="acquisition-detail-box">
                    <span className="detail-label">Blank Lines</span>
                    <span className="detail-value" style={{ color: 'var(--text-muted)' }}>{blankLines.toLocaleString()}</span>
                  </div>
                  <div className="acquisition-detail-box">
                    <span className="detail-label">Comment Lines</span>
                    <span className="detail-value" style={{ color: 'var(--accent-cyan)' }}>{commentLines.toLocaleString()}</span>
                  </div>
                </div>

                {/* Real AST Symbol Metrics Breakdown */}
                {analysisSummary.symbol_metrics && (
                  <div style={{ marginTop: 20 }}>
                    <h5 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                      AST Symbol Structure Metrics
                    </h5>
                    <div className="acquisition-details-grid">
                      <div className="acquisition-detail-box">
                        <span className="detail-label">Functions</span>
                        <span className="detail-value" style={{ color: 'var(--accent-cyan)' }}>
                          {analysisSummary.symbol_metrics.functions || 0}
                        </span>
                      </div>
                      <div className="acquisition-detail-box">
                        <span className="detail-label">Classes</span>
                        <span className="detail-value" style={{ color: 'var(--accent-indigo)' }}>
                          {analysisSummary.symbol_metrics.classes || 0}
                        </span>
                      </div>
                      <div className="acquisition-detail-box">
                        <span className="detail-label">Methods</span>
                        <span className="detail-value" style={{ color: 'var(--accent-emerald)' }}>
                          {analysisSummary.symbol_metrics.methods || 0}
                        </span>
                      </div>
                      <div className="acquisition-detail-box">
                        <span className="detail-label">Interfaces</span>
                        <span className="detail-value" style={{ color: '#fbbf24' }}>
                          {analysisSummary.symbol_metrics.interfaces || 0}
                        </span>
                      </div>
                      <div className="acquisition-detail-box">
                        <span className="detail-label">React Components</span>
                        <span className="detail-value" style={{ color: '#a855f7' }}>
                          {analysisSummary.symbol_metrics.components || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Largest Files Table */}
                {largestFiles.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <h5 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                      Largest Files in Repository
                    </h5>
                    <div className="explorer-list" style={{ maxHeight: 220 }}>
                      {largestFiles.map((lf: any) => (
                        <div key={lf.path} className="explorer-item-row">
                          <FileText size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                          <span className="item-path">{lf.path}</span>
                          <span className="item-badge lang">{lf.language || 'Unknown'}</span>
                          <span className="item-meta">{lf.line_count} lines</span>
                          <span className="item-meta">{(lf.size_bytes / 1024).toFixed(1)} KB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phase 17: Universal Repository Analyzer Profile */}
                <div style={{ marginTop: 24 }}>
                  <UniversalRepositoryOverview
                    profile={profile || metadata.profile || null}
                    analysisProgress={analysisProgress}
                    onNavigateToFile={navigateToSource}
                  />
                </div>
              </div>
            )}

            {/* Assistant / Q&A Tab */}
            {activeTab === 'chat' && (
              <div className="tab-panel-body" style={{ padding: 0 }}>
                <ChatAssistantView
                  repository={repository}
                  onNavigateToFile={navigateToSource}
                  initialQuestion={initialQuestion}
                  onClearInitialQuestion={onClearInitialQuestion}
                />
              </div>
            )}

            {/* Architecture Graph Tab */}
            {activeTab === 'architecture' && (
              <div className="tab-panel-body" style={{ padding: 0 }}>
                <ArchitectureView 
                  repositoryId={repository.id} 
                  repositoryName={repository.name} 
                  onNavigateToFile={navigateToSource}
                />
              </div>
            )}

            {/* Phase 22: Future Impact Simulator Tab */}
            {activeTab === 'simulation' && (
              <div className="tab-panel-body" style={{ padding: 0 }}>
                <SimulationView 
                  repositoryId={repository.id} 
                  onOpenFile={(filePath, line) => {
                    const targetFile = files.find(f => f.path === filePath);
                    if (targetFile) {
                      navigateToSource(targetFile.id, line);
                    }
                  }}
                  onOpenImpact={(targetId) => {
                    setImpactTargetId(targetId);
                  }}
                />
              </div>
            )}

            {/* Phase 12: Code Quality & Technical Debt Tab */}
            {activeTab === 'quality' && (
              <div className="tab-panel-body" style={{ padding: 0 }}>
                <QualityView 
                  repositoryId={repository.id} 
                  onOpenFile={(filePath, line) => {
                    // Find file item by path to navigate
                    const targetFile = files.find(f => f.path === filePath);
                    if (targetFile) {
                      navigateToSource(targetFile.id, line);
                    }
                  }}
                  onOpenImpact={(targetId) => {
                    setImpactTargetId(targetId);
                  }}
                />
              </div>
            )}

            {/* Phase 13: Security & Reliability Tab */}
            {activeTab === 'security' && (
              <div className="tab-panel-body" style={{ padding: 0 }}>
                <SecurityReliabilityView 
                  repositoryId={repository.id} 
                  onOpenFile={(filePath, line) => {
                    const targetFile = files.find(f => f.path === filePath);
                    if (targetFile) {
                      navigateToSource(targetFile.id, line);
                    }
                  }}
                  onOpenImpact={(targetId) => {
                    setImpactTargetId(targetId);
                  }}
                />
              </div>
            )}

            {/* Phase 14: Git History & Evolution Tab */}
            {activeTab === 'history' && (
              <div className="tab-panel-body" style={{ padding: 0 }}>
                <HistoryView 
                  repositoryId={repository.id} 
                  onOpenFile={(filePath, line) => {
                    const targetFile = files.find(f => f.path === filePath);
                    if (targetFile) {
                      navigateToSource(targetFile.id, line);
                    }
                  }}
                  onOpenImpact={(targetId) => {
                    setImpactTargetId(targetId);
                  }}
                />
              </div>
            )}

            {/* Phase 15: Dependencies & Supply-Chain Tab */}
            {activeTab === 'dependencies' && (
              <div className="tab-panel-body" style={{ padding: 0 }}>
                <DependenciesView 
                  repositoryId={repository.id} 
                  onOpenFile={(filePath, line) => {
                    const targetFile = files.find(f => f.path === filePath);
                    if (targetFile) {
                      navigateToSource(targetFile.id, line);
                    }
                  }}
                  onOpenImpact={(targetId) => {
                    setImpactTargetId(targetId);
                  }}
                />
              </div>
            )}

            {/* Files / Code Explorer Tab */}
            {activeTab === 'files' && (
              <div className="tab-panel-body" style={{ padding: 0 }}>
                <CodeExplorer 
                  repositoryId={repository.id}
                  repositoryName={repository.name}
                  initialFileId={explorerTargetFileId}
                  initialLine={explorerTargetLine}
                  onNavigateToFile={navigateToSource}
                />
              </div>
            )}

            {/* Symbols Tab */}
            {activeTab === 'symbols' && (
              <div className="tab-panel-body">
                <div className="search-bar-inner" style={{ marginBottom: 12 }}>
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search classes, functions, methods, structs..." 
                    value={symbolSearch}
                    onChange={(e) => setSymbolSearch(e.target.value)}
                    className="inner-search-input"
                  />
                </div>

                <div className="explorer-list">
                  {filteredSymbols.length === 0 ? (
                    <div className="empty-list-note">No symbols found matching "{symbolSearch}"</div>
                  ) : (
                    filteredSymbols.slice(0, 100).map(sym => (
                      <div 
                        key={sym.id} 
                        className="explorer-item-row"
                        onClick={() => navigateToSource(sym.file_id, sym.start_line)}
                      >
                        <Code2 size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                        <span className="item-name">{sym.name}</span>
                        <span className="item-badge type">{sym.symbol_type}</span>
                        <span className="item-badge lang">{sym.qualified_name || sym.name}</span>
                        <span className="item-meta">Lines {sym.start_line}–{sym.end_line}</span>
                      </div>
                    ))
                  )}
                  {filteredSymbols.length > 100 && (
                    <div className="list-overflow-note">Showing first 100 of {filteredSymbols.length} symbols</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Repository Search Intelligence Modal */}
      <SearchIntelligenceModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        repositoryId={repository.id}
        repositoryName={repository.name}
        onNavigateToSource={navigateToSource}
      />

      {/* Phase 10 Impact Intelligence Modal */}
      <ImpactIntelligenceModal
        isOpen={!!impactTargetId}
        onClose={() => setImpactTargetId(null)}
        repositoryId={repository.id}
        repositoryName={repository.name}
        targetId={impactTargetId}
        onNavigateToSource={navigateToSource}
      />
    </div>
  );
};
