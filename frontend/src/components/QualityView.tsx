import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  QualitySummary,
  QualityFinding,
  QualityFileMetric,
  DuplicationCluster,
} from '../types';
import { api } from '../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Copy,
  Layers,
  FileCode,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw,
  GitPullRequest,
  SlidersHorizontal,
} from 'lucide-react';

interface QualityViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string, name: string) => void;
}

type QualitySubTab = 'overview' | 'findings' | 'files' | 'duplications';

export const QualityView: React.FC<QualityViewProps> = ({
  repositoryId,
  onOpenFile,
  onOpenImpact,
}) => {
  const [subTab, setSubTab] = useState<QualitySubTab>('overview');
  const [summary, setSummary] = useState<QualitySummary | null>(null);
  const [findings, setFindings] = useState<QualityFinding[]>([]);
  const [files, setFiles] = useState<QualityFileMetric[]>([]);
  const [duplications, setDuplications] = useState<DuplicationCluster[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);
  const [fileSortBy, setFileSortBy] = useState<string>('risk');
  const [fileRiskFilter, setFileRiskFilter] = useState<string>('ALL');

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryRes, findingsRes, filesRes, dupsRes] = await Promise.allSettled([
        api.getRepositoryQuality(repositoryId),
        api.getQualityFindings(repositoryId, { limit: 150 }),
        api.getQualityFiles(repositoryId, { limit: 150 }),
        api.getQualityDuplications(repositoryId),
      ]);

      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value);
      } else {
        throw new Error('Failed to load quality summary.');
      }

      if (findingsRes.status === 'fulfilled') {
        setFindings(findingsRes.value.findings);
      }

      if (filesRes.status === 'fulfilled') {
        setFiles(filesRes.value.files);
      }

      if (dupsRes.status === 'fulfilled') {
        setDuplications(dupsRes.value.clusters);
      }
    } catch (err: any) {
      console.error('Error loading quality intelligence:', err);
      setError(err.message || 'Failed to analyze code quality and technical debt.');
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered findings
  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      if (selectedCategory !== 'ALL' && f.category.toUpperCase() !== selectedCategory.toUpperCase()) {
        return false;
      }
      if (selectedSeverity !== 'ALL' && f.severity.toUpperCase() !== selectedSeverity.toUpperCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = f.title.toLowerCase().includes(q);
        const inDesc = f.description.toLowerCase().includes(q);
        const inFile = (f.file_path || '').toLowerCase().includes(q);
        const inSym = (f.symbol || '').toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inFile && !inSym) return false;
      }
      return true;
    });
  }, [findings, selectedCategory, selectedSeverity, searchQuery]);

  // Filtered & sorted files
  const filteredFiles = useMemo(() => {
    let result = files.filter((f) => {
      if (fileRiskFilter !== 'ALL' && f.risk_level.toUpperCase() !== fileRiskFilter.toUpperCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return f.file_path.toLowerCase().includes(q) || f.language.toLowerCase().includes(q);
      }
      return true;
    });

    result.sort((a, b) => {
      if (fileSortBy === 'complexity') return b.complexity - a.complexity;
      if (fileSortBy === 'loc') return b.lines_of_code - a.lines_of_code;
      if (fileSortBy === 'duplication') return b.duplication_percentage - a.duplication_percentage;
      if (fileSortBy === 'coupling') return (b.incoming_dependencies + b.outgoing_dependencies) - (a.incoming_dependencies + a.outgoing_dependencies);
      if (fileSortBy === 'findings') return b.findings_count - a.findings_count;
      // Default: Risk order
      const riskWeight: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (riskWeight[b.risk_level] || 0) - (riskWeight[a.risk_level] || 0);
    });

    return result;
  }, [files, fileRiskFilter, fileSortBy, searchQuery]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'B': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'C': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'D': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'F': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return <span className="badge badge-critical font-mono text-xs">CRITICAL</span>;
      case 'HIGH':
        return <span className="badge badge-high font-mono text-xs">HIGH</span>;
      case 'MEDIUM':
        return <span className="badge badge-medium font-mono text-xs">MEDIUM</span>;
      case 'LOW':
        return <span className="badge badge-low font-mono text-xs">LOW</span>;
      default:
        return <span className="badge badge-info font-mono text-xs">{severity}</span>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'CRITICAL':
        return <span className="risk-pill critical">CRITICAL</span>;
      case 'HIGH':
        return <span className="risk-pill high">HIGH</span>;
      case 'MEDIUM':
        return <span className="risk-pill medium">MEDIUM</span>;
      default:
        return <span className="risk-pill low">LOW</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="quality-loading-container">
        <RefreshCw className="spin-icon text-primary-400" size={32} />
        <h3 className="text-lg font-semibold text-gray-200 mt-4">Analyzing Repository Code Quality...</h3>
        <p className="text-sm text-gray-400 mt-1">Calculating AST cyclomatic complexity, duplication clusters, and technical debt score</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="quality-error-container">
        <AlertTriangle className="text-rose-400" size={36} />
        <h3 className="text-lg font-semibold text-gray-200 mt-3">Quality Analysis Error</h3>
        <p className="text-sm text-gray-400 mt-1">{error || 'Could not load quality intelligence.'}</p>
        <button onClick={loadData} className="btn-secondary mt-4">
          <RefreshCw size={14} /> Retry Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="quality-view-container">
      {/* Top Header & Executive Summary Score Card */}
      <header className="quality-header-card">
        <div className="quality-score-radial-group">
          <div className={`quality-grade-circle ${getGradeColor(summary.grade)}`}>
            <span className="grade-letter">{summary.grade}</span>
            <span className="score-number">{summary.score.toFixed(0)}</span>
          </div>
          <div className="quality-score-meta">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-100">Technical Debt Score</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                100 = Pristine
              </span>
            </div>
            <p className="text-sm text-gray-300 font-medium mt-0.5">{summary.status_label}</p>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl">{summary.summary_text}</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="quality-quick-stats-grid">
          <div className="quick-stat-box">
            <span className="stat-label">Total Findings</span>
            <span className="stat-val font-semibold text-gray-100">{summary.total_findings}</span>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              {summary.critical_findings > 0 && <span className="text-rose-400">{summary.critical_findings} crit</span>}
              {summary.high_findings > 0 && <span className="text-amber-400">{summary.high_findings} high</span>}
              {summary.medium_findings > 0 && <span className="text-blue-400">{summary.medium_findings} med</span>}
            </div>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">Duplication Clusters</span>
            <span className="stat-val font-semibold text-gray-100">{summary.duplication_clusters_count}</span>
            <span className="text-[11px] text-gray-400 mt-1">Exact & near blocks</span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">Dead Code Candidates</span>
            <span className="stat-val font-semibold text-gray-100">{summary.dead_code_candidates_count}</span>
            <span className="text-[11px] text-gray-400 mt-1">0 incoming callers</span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">Files Analyzed</span>
            <span className="stat-val font-semibold text-gray-100">{summary.total_files}</span>
            <span className="text-[11px] text-gray-400 mt-1">{summary.total_lines.toLocaleString()} total LOC</span>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="quality-subtabs-bar">
        <button
          className={`quality-subtab-btn ${subTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSubTab('overview')}
        >
          <Activity size={15} />
          <span>Overview & Hotspots</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'findings' ? 'active' : ''}`}
          onClick={() => setSubTab('findings')}
        >
          <ShieldAlert size={15} />
          <span>Findings & Debt ({summary.total_findings})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'files' ? 'active' : ''}`}
          onClick={() => setSubTab('files')}
        >
          <FileCode size={15} />
          <span>File Metrics ({files.length})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'duplications' ? 'active' : ''}`}
          onClick={() => setSubTab('duplications')}
        >
          <Copy size={15} />
          <span>Duplications ({duplications.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {subTab === 'overview' && (
        <div className="quality-overview-tab space-y-6">
          {/* Factor Breakdown & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Factor Deductions */}
            <div className="quality-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-primary-400" />
                  Technical Debt Factor Breakdown
                </h3>
                <span className="text-xs text-gray-400">Score Impact</span>
              </div>
              <div className="space-y-3">
                {summary.score_breakdown.factors.map((factor, idx) => (
                  <div key={idx} className="factor-breakdown-row">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-300">{factor.factor}</span>
                      <span className={factor.deduction > 0 ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>
                        {factor.deduction > 0 ? `-${factor.deduction.toFixed(1)} pts` : '0 pts'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          factor.deduction > 15
                            ? 'bg-rose-500'
                            : factor.deduction > 8
                            ? 'bg-amber-500'
                            : factor.deduction > 0
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min((factor.deduction / factor.weight) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="quality-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Layers size={16} className="text-primary-400" />
                  Findings by Category
                </h3>
                <span className="text-xs text-gray-400">{summary.total_findings} items</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(summary.category_counts).map(([cat, count]) => (
                  <div
                    key={cat}
                    className="category-count-box cursor-pointer hover:border-gray-600 transition-colors"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSubTab('findings');
                    }}
                  >
                    <span className="text-xs text-gray-400 font-medium">{cat.replace('_', ' ')}</span>
                    <span className="text-lg font-bold text-gray-100 mt-1">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Maintainability Hotspots */}
          <div className="quality-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Flame size={16} className="text-rose-400" />
                  Top Maintainability & Change-Risk Hotspots
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Files combining high cyclomatic complexity, incoming/outgoing coupling, and size
                </p>
              </div>
              <button
                onClick={() => setSubTab('files')}
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                View all files <ChevronRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="quality-table">
                <thead>
                  <tr>
                    <th>File Path</th>
                    <th>Complexity</th>
                    <th>LOC</th>
                    <th>Coupling (In/Out)</th>
                    <th>Risk</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.top_hotspots.map((f, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40">
                      <td className="font-mono text-xs text-gray-200">
                        <button
                          onClick={() => onOpenFile?.(f.file_path)}
                          className="hover:text-primary-400 text-left truncate max-w-md block"
                        >
                          {f.file_path}
                        </button>
                      </td>
                      <td>
                        <span
                          className={`complexity-badge ${
                            f.complexity >= 21
                              ? 'comp-very-high'
                              : f.complexity >= 11
                              ? 'comp-high'
                              : f.complexity >= 6
                              ? 'comp-mod'
                              : 'comp-low'
                          }`}
                        >
                          {f.complexity} ({f.complexity_level})
                        </span>
                      </td>
                      <td className="text-xs text-gray-300">{f.lines_of_code}</td>
                      <td className="text-xs text-gray-300">
                        <span className="text-emerald-400">{f.incoming_dependencies} in</span> /{' '}
                        <span className="text-blue-400">{f.outgoing_dependencies} out</span>
                      </td>
                      <td>{getRiskBadge(f.risk_level)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenFile?.(f.file_path)}
                            className="btn-icon-sm"
                            title="Inspect in Code Explorer"
                          >
                            <FileCode size={13} />
                          </button>
                          {onOpenImpact && (
                            <button
                              onClick={() => onOpenImpact(f.file_id || f.file_path, f.file_path)}
                              className="btn-icon-sm"
                              title="Analyze Impact Graph"
                            >
                              <GitPullRequest size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINDINGS */}
      {subTab === 'findings' && (
        <div className="quality-findings-tab space-y-4">
          {/* Controls Bar */}
          <div className="findings-filter-bar flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                placeholder="Search findings by symbol, description, or file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="COMPLEXITY">Complexity</option>
                <option value="DUPLICATION">Duplication</option>
                <option value="SIZE">Size & Oversized</option>
                <option value="MAINTAINABILITY">Maintainability & God Classes</option>
                <option value="DEAD_CODE">Dead Code Candidates</option>
                <option value="UNUSED_IMPORT">Unused Imports</option>
                <option value="ARCHITECTURE_DRIFT">Architecture Drift</option>
              </select>

              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-3">
            {filteredFindings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400" />
                No findings match the current filters.
              </div>
            ) : (
              filteredFindings.map((finding) => {
                const isExpanded = expandedFindingId === finding.id;
                return (
                  <div
                    key={finding.id}
                    className="finding-card border border-gray-800 rounded-lg bg-gray-900/60 overflow-hidden transition-all hover:border-gray-700"
                  >
                    <div
                      className="finding-card-header p-3.5 flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedFindingId(isExpanded ? null : finding.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-gray-500 hover:text-gray-300">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            {getSeverityBadge(finding.severity)}
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700 font-mono">
                              {finding.category}
                            </span>
                            <span className="text-xs font-semibold text-gray-200">{finding.title}</span>
                          </div>
                          {finding.file_path && (
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-mono">
                              <span>{finding.file_path}</span>
                              {finding.start_line && (
                                <span className="text-primary-400">L{finding.start_line}-{finding.end_line}</span>
                              )}
                              {finding.symbol && (
                                <span className="text-gray-300 font-semibold">• {finding.symbol}()</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {finding.metric_value !== null && finding.metric_value !== undefined && (
                          <div className="text-right text-xs">
                            <span className="text-gray-400">Value: </span>
                            <span className="font-mono text-gray-200 font-bold">{finding.metric_value}</span>
                            {finding.threshold && (
                              <span className="text-gray-500"> / {finding.threshold}</span>
                            )}
                          </div>
                        )}
                        {finding.file_path && onOpenFile && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenFile(finding.file_path!, finding.start_line || 1);
                            }}
                            className="btn-icon-sm"
                            title="Open in Code Explorer"
                          >
                            <ExternalLink size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="finding-card-body p-4 border-t border-gray-800/80 bg-black/20 space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-300">Description</h4>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{finding.description}</p>
                        </div>

                        {finding.recommendation && (
                          <div className="p-3 rounded bg-primary-950/20 border border-primary-800/30">
                            <h4 className="text-xs font-semibold text-primary-300 flex items-center gap-1.5">
                              <Zap size={14} /> Refactoring Recommendation
                            </h4>
                            <p className="text-xs text-primary-200/90 mt-1 leading-relaxed">{finding.recommendation}</p>
                          </div>
                        )}

                        {finding.evidence && Object.keys(finding.evidence).length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-300">Evidence Details</h4>
                            <pre className="text-[11px] bg-gray-950 p-2.5 rounded border border-gray-800 text-gray-300 font-mono mt-1 overflow-x-auto">
                              {JSON.stringify(finding.evidence, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FILE METRICS */}
      {subTab === 'files' && (
        <div className="quality-files-tab space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                placeholder="Filter files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <ArrowUpDown size={14} />
                <span>Sort by:</span>
                <select
                  value={fileSortBy}
                  onChange={(e) => setFileSortBy(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
                >
                  <option value="risk">Risk Level</option>
                  <option value="complexity">Cyclomatic Complexity</option>
                  <option value="loc">Lines of Code</option>
                  <option value="coupling">Coupling (In + Out)</option>
                  <option value="findings">Findings Count</option>
                </select>
              </div>

              <select
                value={fileRiskFilter}
                onChange={(e) => setFileRiskFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>
          </div>

          <div className="quality-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="quality-table">
                <thead>
                  <tr>
                    <th>File Path</th>
                    <th>Language</th>
                    <th>Lines (Code / Total)</th>
                    <th>Symbols</th>
                    <th>Max Complexity</th>
                    <th>Coupling</th>
                    <th>Findings</th>
                    <th>Risk</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40">
                      <td className="font-mono text-xs text-gray-200">
                        <button
                          onClick={() => onOpenFile?.(file.file_path)}
                          className="hover:text-primary-400 text-left truncate max-w-xs block"
                        >
                          {file.file_path}
                        </button>
                      </td>
                      <td className="text-xs text-gray-400">{file.language}</td>
                      <td className="text-xs text-gray-300">
                        <span className="font-semibold text-gray-100">{file.code_lines}</span> / {file.lines_of_code}
                      </td>
                      <td className="text-xs text-gray-300">
                        {file.symbol_count} ({file.function_count} fn, {file.class_count} cls)
                      </td>
                      <td>
                        <span
                          className={`complexity-badge ${
                            file.complexity >= 21
                              ? 'comp-very-high'
                              : file.complexity >= 11
                              ? 'comp-high'
                              : file.complexity >= 6
                              ? 'comp-mod'
                              : 'comp-low'
                          }`}
                        >
                          {file.complexity} ({file.complexity_level})
                        </span>
                      </td>
                      <td className="text-xs text-gray-300">
                        <span className="text-emerald-400">{file.incoming_dependencies} in</span> /{' '}
                        <span className="text-blue-400">{file.outgoing_dependencies} out</span>
                      </td>
                      <td className="text-xs font-semibold text-gray-200">{file.findings_count}</td>
                      <td>{getRiskBadge(file.risk_level)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenFile?.(file.file_path)}
                            className="btn-icon-sm"
                            title="Inspect in Code Explorer"
                          >
                            <FileCode size={13} />
                          </button>
                          {onOpenImpact && (
                            <button
                              onClick={() => onOpenImpact(file.file_id || file.file_path, file.file_path)}
                              className="btn-icon-sm"
                              title="Analyze Impact Graph"
                            >
                              <GitPullRequest size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DUPLICATIONS */}
      {subTab === 'duplications' && (
        <div className="quality-duplications-tab space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Copy size={16} className="text-primary-400" />
              Detected Code Duplication Clusters
            </h3>
            <span className="text-xs text-gray-400">{duplications.length} clusters found</span>
          </div>

          {duplications.length === 0 ? (
            <div className="quality-card p-12 text-center text-gray-400 text-sm">
              <ShieldCheck size={36} className="mx-auto mb-2 text-emerald-400" />
              No significant code duplication clusters detected. The codebase is well modularized!
            </div>
          ) : (
            <div className="space-y-4">
              {duplications.map((dup) => (
                <div key={dup.id} className="duplication-card quality-card p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-medium font-mono">
                        {dup.similarity_percentage.toFixed(0)}% Similarity
                      </span>
                      <span className="text-gray-400">{dup.line_count} identical normalized lines</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-gray-950 border border-gray-800">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono text-gray-300 truncate">{dup.source_file}</span>
                        <button
                          onClick={() => onOpenFile?.(dup.source_file, dup.source_start_line)}
                          className="text-primary-400 hover:text-primary-300 font-mono text-[11px]"
                        >
                          L{dup.source_start_line}-{dup.source_end_line}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded bg-gray-950 border border-gray-800">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono text-gray-300 truncate">{dup.target_file}</span>
                        <button
                          onClick={() => onOpenFile?.(dup.target_file, dup.target_start_line)}
                          className="text-primary-400 hover:text-primary-300 font-mono text-[11px]"
                        >
                          L{dup.target_start_line}-{dup.target_end_line}
                        </button>
                      </div>
                    </div>
                  </div>

                  {dup.snippet_preview && (
                    <div className="text-[11px] bg-black/40 p-2.5 rounded border border-gray-800/80 font-mono text-gray-300 overflow-x-auto">
                      <pre>{dup.snippet_preview}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
