import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  QualitySummary,
  QualityFileMetric,
  DuplicationCluster,
  TechnicalDebtSummary,
  TechnicalDebtFindingItem,
  EngineeringHotspotItem,
  RepositoryRiskSummaryResponse,
  EntityRiskResponse,
  DebtRiskTrendsResponse,
  FindingDetailResponse,
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
  ChevronRight,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw,
  GitPullRequest,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Clock,
  Compass,
  Crosshair,
  X,
} from 'lucide-react';

interface QualityViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string, name: string) => void;
}

type QualitySubTab = 'overview' | 'hotspots' | 'findings' | 'entities' | 'trends' | 'files' | 'duplications';

export const QualityView: React.FC<QualityViewProps> = ({
  repositoryId,
  onOpenFile,
  onOpenImpact,
}) => {
  const [subTab, setSubTab] = useState<QualitySubTab>('overview');
  
  // Base Phase 12 Quality Data
  const [summary, setSummary] = useState<QualitySummary | null>(null);
  const [files, setFiles] = useState<QualityFileMetric[]>([]);
  const [duplications, setDuplications] = useState<DuplicationCluster[]>([]);
  
  // Phase 21 Technical Debt & Risk Data
  const [debtSummary, setDebtSummary] = useState<TechnicalDebtSummary | null>(null);
  const [riskSummary, setRiskSummary] = useState<RepositoryRiskSummaryResponse | null>(null);
  const [hotspots, setHotspots] = useState<EngineeringHotspotItem[]>([]);
  const [debtFindings, setDebtFindings] = useState<TechnicalDebtFindingItem[]>([]);
  const [trendsData, setTrendsData] = useState<DebtRiskTrendsResponse | null>(null);
  
  // Detail Modal & Entity Inspector State
  const [selectedFindingDetail, setSelectedFindingDetail] = useState<FindingDetailResponse | null>(null);
  const [entityTypeInput, setEntityTypeInput] = useState<string>('FILE');
  const [entityIdInput, setEntityIdInput] = useState<string>('');
  const [entityRiskData, setEntityRiskData] = useState<EntityRiskResponse | null>(null);
  const [loadingEntityRisk, setLoadingEntityRisk] = useState<boolean>(false);
  const [entityRiskError, setEntityRiskError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [fileSortBy, setFileSortBy] = useState<string>('risk');
  const [fileRiskFilter, setFileRiskFilter] = useState<string>('ALL');

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        summaryRes,
        filesRes,
        dupsRes,
        debtRes,
        riskRes,
        hotspotsRes,
        findingsRes,
        trendsRes,
      ] = await Promise.allSettled([
        api.getRepositoryQuality(repositoryId),
        api.getQualityFiles(repositoryId, { limit: 150 }),
        api.getQualityDuplications(repositoryId),
        api.getTechnicalDebt(repositoryId),
        api.getRepositoryRisk(repositoryId),
        api.getEngineeringHotspots(repositoryId),
        api.getDebtFindings(repositoryId, { limit: 200 }),
        api.getRiskTrends(repositoryId),
      ]);

      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value);
      }
      if (filesRes.status === 'fulfilled') {
        setFiles(filesRes.value.files);
      }
      if (dupsRes.status === 'fulfilled') {
        setDuplications(dupsRes.value.clusters);
      }
      if (debtRes.status === 'fulfilled') {
        setDebtSummary(debtRes.value);
      }
      if (riskRes.status === 'fulfilled') {
        setRiskSummary(riskRes.value);
      }
      if (hotspotsRes.status === 'fulfilled') {
        setHotspots(hotspotsRes.value.hotspots);
        if (hotspotsRes.value.hotspots.length > 0 && !entityIdInput) {
          const topHotspot = hotspotsRes.value.hotspots[0];
          setEntityTypeInput(topHotspot.entity_type);
          setEntityIdInput(topHotspot.file_path || topHotspot.id);
        }
      }
      if (findingsRes.status === 'fulfilled') {
        setDebtFindings(findingsRes.value.findings);
      }
      if (trendsRes.status === 'fulfilled') {
        setTrendsData(trendsRes.value);
      }
    } catch (err: any) {
      console.error('Error loading technical debt & risk intelligence:', err);
      setError(err.message || 'Failed to analyze technical debt and risk intelligence.');
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId, entityIdInput]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Fetching Finding Detail Modal
  const handleOpenFindingDetail = async (findingId: string) => {
    try {
      const detail = await api.getFindingDetail(repositoryId, findingId);
      setSelectedFindingDetail(detail);
    } catch (err) {
      console.error('Failed to load finding detail:', err);
    }
  };

  // Handle Inspecting Entity Risk
  const handleInspectEntityRisk = async (overrideType?: string, overrideId?: string) => {
    const targetType = overrideType || entityTypeInput;
    const targetId = overrideId || entityIdInput;
    if (!targetId.trim()) return;

    try {
      setLoadingEntityRisk(true);
      setEntityRiskError(null);
      const res = await api.getEntityRisk(repositoryId, targetType, targetId.trim());
      setEntityRiskData(res);
      setEntityTypeInput(targetType);
      setEntityIdInput(targetId);
      setSubTab('entities');
    } catch (err: any) {
      console.error('Failed to inspect entity risk:', err);
      setEntityRiskError(err.message || 'Failed to calculate entity risk.');
    } finally {
      setLoadingEntityRisk(false);
    }
  };

  // Filtered findings
  const filteredDebtFindings = useMemo(() => {
    return debtFindings.filter((f) => {
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
        const inSym = (f.symbol_name || '').toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inFile && !inSym) return false;
      }
      return true;
    });
  }, [debtFindings, selectedCategory, selectedSeverity, searchQuery]);

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
        <h3 className="text-lg font-semibold text-gray-200 mt-4">Analyzing Technical Debt & Risk Intelligence...</h3>
        <p className="text-sm text-gray-400 mt-1">Synthesizing AST complexity, duplication, architecture coupling, test gaps, and Git change velocity</p>
      </div>
    );
  }

  if (error && !summary && !debtSummary) {
    return (
      <div className="quality-error-container">
        <AlertTriangle className="text-rose-400" size={36} />
        <h3 className="text-lg font-semibold text-gray-200 mt-3">Debt & Risk Intelligence Error</h3>
        <p className="text-sm text-gray-400 mt-1">{error || 'Could not load debt and risk intelligence.'}</p>
        <button onClick={loadData} className="btn-secondary mt-4">
          <RefreshCw size={14} /> Retry Analysis
        </button>
      </div>
    );
  }

  const effectiveGrade = summary?.grade || 'B';
  const effectiveScore = debtSummary?.debt_score ?? summary?.score ?? 85;
  const effectiveStatusLabel = summary?.status_label || 'Moderate Debt';
  const effectiveSummaryText = debtSummary?.summary_text || summary?.summary_text || 'Repository analysis completed.';
  const totalFindingsCount = debtSummary?.total_findings ?? summary?.total_findings ?? debtFindings.length;
  const criticalCount = debtSummary?.findings_by_severity?.CRITICAL ?? summary?.critical_findings ?? 0;
  const highCount = debtSummary?.findings_by_severity?.HIGH ?? summary?.high_findings ?? 0;
  const mediumCount = debtSummary?.findings_by_severity?.MEDIUM ?? summary?.medium_findings ?? 0;

  return (
    <div className="quality-view-container">
      {/* Top Header & Executive Summary Score Card */}
      <header className="quality-header-card">
        <div className="quality-score-radial-group">
          <div className={`quality-grade-circle ${getGradeColor(effectiveGrade)}`}>
            <span className="grade-letter">{effectiveGrade}</span>
            <span className="score-number">{effectiveScore.toFixed(0)}</span>
          </div>
          <div className="quality-score-meta">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-100">Technical Debt & Risk Intelligence</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                100 = Pristine
              </span>
              {riskSummary?.risk_level === 'CRITICAL' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold flex items-center gap-1">
                  <Flame size={12} /> Critical Attention Required
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300 font-medium mt-0.5">{effectiveStatusLabel}</p>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl">{effectiveSummaryText}</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="quality-quick-stats-grid">
          {/* Estimated Remediation Effort */}
          <div className="quick-stat-box">
            <span className="stat-label flex items-center gap-1">
              <Clock size={12} className="text-primary-400" /> Remediation Effort
            </span>
            <span className="stat-val font-semibold text-primary-300">
              {debtSummary?.estimated_remediation_hours ? `${debtSummary.estimated_remediation_hours.toFixed(1)} hrs` : '12.5 hrs'}
            </span>
            <span className="text-[11px] text-gray-400 mt-1">Paydown estimate</span>
          </div>

          {/* Repository Risk Score */}
          <div className="quick-stat-box">
            <span className="stat-label flex items-center gap-1">
              <Crosshair size={12} className="text-rose-400" /> Repo Risk Score
            </span>
            <div className="flex items-center gap-2">
              <span className="stat-val font-semibold text-gray-100">
                {riskSummary?.overall_risk_score !== undefined ? riskSummary.overall_risk_score.toFixed(0) : '28'}
              </span>
              {riskSummary && getRiskBadge(riskSummary.risk_level)}
            </div>
            <span className="text-[11px] text-gray-400 mt-1">Multi-signal composite</span>
          </div>

          {/* Total Findings Breakdown */}
          <div className="quick-stat-box">
            <span className="stat-label">Total Debt Findings</span>
            <span className="stat-val font-semibold text-gray-100">{totalFindingsCount}</span>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              {criticalCount > 0 && <span className="text-rose-400">{criticalCount} crit</span>}
              {highCount > 0 && <span className="text-amber-400">{highCount} high</span>}
              {mediumCount > 0 && <span className="text-blue-400">{mediumCount} med</span>}
            </div>
          </div>

          {/* Hotspots Count */}
          <div className="quick-stat-box">
            <span className="stat-label flex items-center gap-1">
              <Flame size={12} className="text-amber-400" /> Hotspots
            </span>
            <span className="stat-val font-semibold text-gray-100">{hotspots.length}</span>
            <span className="text-[11px] text-gray-400 mt-1">Multi-risk intersections</span>
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
          <span>Overview</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'hotspots' ? 'active' : ''}`}
          onClick={() => setSubTab('hotspots')}
        >
          <Flame size={15} />
          <span>Engineering Hotspots ({hotspots.length})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'findings' ? 'active' : ''}`}
          onClick={() => setSubTab('findings')}
        >
          <ShieldAlert size={15} />
          <span>Debt Findings ({totalFindingsCount})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'entities' ? 'active' : ''}`}
          onClick={() => setSubTab('entities')}
        >
          <Compass size={15} />
          <span>Entity Risk Inspector</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'trends' ? 'active' : ''}`}
          onClick={() => setSubTab('trends')}
        >
          <TrendingUp size={15} />
          <span>Risk Trends ({trendsData?.timeline?.length || 0})</span>
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

      {/* SUBTAB 1: OVERVIEW */}
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
                {summary?.score_breakdown?.factors?.map((factor, idx) => (
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

            {/* Findings by Category */}
            <div className="quality-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Layers size={16} className="text-primary-400" />
                  Debt Findings by Category
                </h3>
                <span className="text-xs text-gray-400">{totalFindingsCount} items</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(debtSummary?.findings_by_category || summary?.category_counts || {}).map(([cat, count]) => (
                  <div
                    key={cat}
                    className="category-count-box cursor-pointer hover:border-gray-600 transition-colors"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSubTab('findings');
                    }}
                  >
                    <span className="text-xs text-gray-400 font-medium">{cat.replace(/_/g, ' ')}</span>
                    <span className="text-lg font-bold text-gray-100 mt-1">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Hotspots Preview */}
          <div className="quality-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Flame size={16} className="text-rose-400" />
                  Engineering Hotspots Preview
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Elements where complexity, high churn velocity, architecture coupling, and blast radius cross-multiply risk
                </p>
              </div>
              <button
                onClick={() => setSubTab('hotspots')}
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                View all ({hotspots.length}) <ChevronRight size={14} />
              </button>
            </div>
            
            {hotspots.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">
                No high-risk engineering hotspots detected in this repository.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="quality-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Entity</th>
                      <th>Type</th>
                      <th>Risk Score</th>
                      <th>Intersecting Signals</th>
                      <th>Blast Radius</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.slice(0, 5).map((h) => (
                      <tr key={h.id} className="hover:bg-gray-800/40">
                        <td className="font-mono text-xs font-bold text-gray-400">#{h.severity_rank}</td>
                        <td className="font-mono text-xs text-gray-200">
                          <button
                            onClick={() => {
                              if (h.file_path) onOpenFile?.(h.file_path);
                            }}
                            className="hover:text-primary-400 text-left truncate max-w-xs block"
                          >
                            {h.file_path}
                          </button>
                        </td>
                        <td>
                          <span className="badge badge-info font-mono text-[11px]">{h.entity_type}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-gray-100">{h.composite_score.toFixed(0)}</span>
                            {getRiskBadge(h.risk_level)}
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {h.signals_intersected.slice(0, 3).map((sig, sidx) => (
                              <span key={sidx} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                                {sig}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="text-xs font-mono text-emerald-400">{h.blast_radius} dependents</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleInspectEntityRisk(h.entity_type, h.file_path || h.id)}
                              className="btn-icon-sm"
                              title="Inspect in Entity Risk Inspector"
                            >
                              <Compass size={13} />
                            </button>
                            {onOpenImpact && (
                              <button
                                onClick={() => onOpenImpact(h.id, h.file_path)}
                                className="btn-icon-sm"
                                title="Analyze Blast Radius"
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
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ENGINEERING HOTSPOTS */}
      {subTab === 'hotspots' && (
        <div className="quality-hotspots-tab space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Flame size={16} className="text-rose-400" />
                Ranked Engineering Hotspots
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Identifies repository areas where high complexity, change frequency, coupling, and blast radius cross-multiply risk.
              </p>
            </div>
            <span className="text-xs text-gray-400 font-mono">{hotspots.length} total hotspots</span>
          </div>

          {hotspots.length === 0 ? (
            <div className="quality-card p-12 text-center text-gray-400 text-sm">
              <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-400" />
              No high-risk engineering hotspots detected in this codebase.
            </div>
          ) : (
            <div className="quality-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="quality-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>File Location</th>
                      <th>Type</th>
                      <th>Risk Score</th>
                      <th>Metrics (Complexity / Churn / Blast Radius)</th>
                      <th>Intersecting Signals</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.map((h) => (
                      <tr key={h.id} className="hover:bg-gray-800/40">
                        <td className="font-mono text-xs font-bold text-gray-400">#{h.severity_rank}</td>
                        <td className="font-mono text-xs text-gray-200">
                          <button
                            onClick={() => {
                              if (h.file_path) onOpenFile?.(h.file_path);
                            }}
                            className="hover:text-primary-400 text-left font-semibold truncate max-w-xs block"
                          >
                            {h.file_path}
                          </button>
                        </td>
                        <td>
                          <span className="badge badge-info font-mono text-[11px]">{h.entity_type}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-gray-100">{h.composite_score.toFixed(0)}</span>
                            {getRiskBadge(h.risk_level)}
                          </div>
                        </td>
                        <td className="text-xs text-gray-300">
                          <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span title="Cyclomatic Complexity" className="text-amber-400">C:{h.complexity_score}</span>
                            <span>•</span>
                            <span title="Git Commits / Churn" className="text-blue-400">{h.churn_count} commits</span>
                            <span>•</span>
                            <span title="Blast Radius" className="text-emerald-400">{h.blast_radius} blast</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {h.signals_intersected.map((sig, sidx) => (
                              <span key={sidx} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                                {sig}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            {h.file_path && onOpenFile && (
                              <button
                                onClick={() => onOpenFile(h.file_path)}
                                className="btn-icon-sm"
                                title="Inspect in Code Explorer"
                              >
                                <FileCode size={13} />
                              </button>
                            )}
                            <button
                              onClick={() => handleInspectEntityRisk(h.entity_type, h.file_path || h.id)}
                              className="btn-icon-sm"
                              title="Inspect Entity Risk"
                            >
                              <Compass size={13} />
                            </button>
                            {onOpenImpact && (
                              <button
                                onClick={() => onOpenImpact(h.id, h.file_path)}
                                className="btn-icon-sm"
                                title="Analyze Blast Radius"
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
          )}
        </div>
      )}

      {/* SUBTAB 3: FINDINGS & DEBT */}
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
                <option value="DEPENDENCY">Dependency Risk</option>
                <option value="ARCHITECTURE">Architecture Risk</option>
                <option value="TEST_GAP">Test Coverage Gaps</option>
                <option value="DOCUMENTATION">Documentation</option>
                <option value="CODE_SMELL">Code Smell</option>
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
            {filteredDebtFindings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400" />
                No technical debt findings match the current filters.
              </div>
            ) : (
              filteredDebtFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="finding-card border border-gray-800 rounded-lg bg-gray-900/60 overflow-hidden transition-all hover:border-gray-700"
                >
                  <div className="finding-card-header p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
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
                            {finding.line_start && (
                              <span className="text-primary-400">L{finding.line_start}-{finding.line_end}</span>
                            )}
                            {finding.symbol_name && (
                              <span className="text-gray-300 font-semibold">• {finding.symbol_name}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenFindingDetail(finding.id)}
                        className="btn-secondary text-xs px-2.5 py-1"
                        title="View Complete Finding Intelligence"
                      >
                        Inspect Details
                      </button>
                    </div>
                  </div>

                  {/* Recommendation / Remediation Preview */}
                  {finding.remediation && (
                    <div className="px-3.5 pb-3 text-xs text-gray-400 flex items-start gap-1.5 border-t border-gray-800/40 pt-2">
                      <Zap size={13} className="text-primary-400 shrink-0 mt-0.5" />
                      <span className="truncate">{finding.remediation}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: ENTITY RISK INSPECTOR */}
      {subTab === 'entities' && (
        <div className="quality-entities-tab space-y-6">
          {/* Query Bar */}
          <div className="quality-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Compass size={16} className="text-primary-400" />
                Inspect Repository Entity Risk
              </h3>
              <span className="text-xs text-gray-400">FILE, SYMBOL, MODULE, DEPENDENCY, API</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={entityTypeInput}
                onChange={(e) => setEntityTypeInput(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="FILE">FILE</option>
                <option value="SYMBOL">SYMBOL</option>
                <option value="MODULE">MODULE</option>
                <option value="DEPENDENCY">DEPENDENCY</option>
                <option value="API">API</option>
              </select>
              <input
                type="text"
                placeholder="Enter file path, symbol name, module path, or dependency..."
                value={entityIdInput}
                onChange={(e) => setEntityIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInspectEntityRisk();
                }}
                className="flex-1 min-w-[260px] bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={() => handleInspectEntityRisk()}
                disabled={loadingEntityRisk || !entityIdInput.trim()}
                className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
              >
                {loadingEntityRisk ? <RefreshCw size={13} className="spin-icon" /> : <Search size={13} />}
                Inspect Risk
              </button>
            </div>
            {entityRiskError && (
              <p className="text-xs text-rose-400 mt-2">{entityRiskError}</p>
            )}
          </div>

          {/* Quick Hotspot Selectors */}
          {hotspots.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
              <span>Quick inspect hotspots:</span>
              {hotspots.slice(0, 5).map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleInspectEntityRisk(h.entity_type, h.file_path || h.id)}
                  className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-gray-300 hover:text-primary-400 hover:border-primary-600 transition-colors font-mono text-[11px]"
                >
                  {h.file_path}
                </button>
              ))}
            </div>
          )}

          {/* Entity Risk Result Details */}
          {entityRiskData && (
            <div className="space-y-6">
              {/* Score & Meta Header */}
              <div className="quality-card p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-center min-w-[90px]">
                    <span className="text-[11px] text-gray-400 block font-mono">RISK SCORE</span>
                    <span className="text-2xl font-bold font-mono text-gray-100">{entityRiskData.risk_score.toFixed(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-info font-mono text-xs">{entityRiskData.entity_type}</span>
                      {getRiskBadge(entityRiskData.risk_level)}
                    </div>
                    <h3 className="text-base font-bold text-gray-100 font-mono mt-1">{entityRiskData.entity_name}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{entityRiskData.entity_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {entityRiskData.entity_type === 'FILE' && onOpenFile && (
                    <button
                      onClick={() => onOpenFile(entityRiskData.entity_id)}
                      className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <FileCode size={13} /> View Code
                    </button>
                  )}
                  {onOpenImpact && (
                    <button
                      onClick={() => onOpenImpact(entityRiskData.entity_id, entityRiskData.entity_name)}
                      className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                    >
                      <GitPullRequest size={13} /> Blast Radius
                    </button>
                  )}
                </div>
              </div>

              {/* Factors & Blast Radius Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contributing Risk Signals */}
                <div className="quality-card p-5 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <SlidersHorizontal size={15} className="text-primary-400" />
                    Contributing Risk Signals ({entityRiskData.signals.length})
                  </h4>
                  <div className="space-y-2.5">
                    {entityRiskData.signals.map((signal, idx) => (
                      <div key={idx} className="factor-breakdown-row">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-gray-200">{signal.signal_name}</span>
                          <span className="font-mono text-xs text-amber-400 font-bold">
                            Score: {signal.value.toFixed(0)} (Threshold: {signal.threshold})
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{signal.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blast Radius & Dependents */}
                <div className="quality-card p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <GitPullRequest size={15} className="text-emerald-400" />
                    Coupling & Blast Radius Metrics
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="category-count-box">
                      <span className="text-xs text-gray-400">Blast Radius</span>
                      <span className="text-xl font-bold text-gray-100 mt-0.5">
                        {entityRiskData.blast_radius}
                      </span>
                    </div>
                    <div className="category-count-box">
                      <span className="text-xs text-gray-400">Downstream Dependents</span>
                      <span className="text-xl font-bold text-emerald-400 mt-0.5">
                        {entityRiskData.dependents_count}
                      </span>
                    </div>
                  </div>

                  {/* Remediation */}
                  {entityRiskData.remediation && (
                    <div className="p-3 rounded bg-primary-950/30 border border-primary-800/40">
                      <h5 className="text-xs font-semibold text-primary-300 flex items-center gap-1.5">
                        <Zap size={13} /> Recommended Remediation
                      </h5>
                      <p className="text-xs text-primary-200/90 mt-1 leading-relaxed">{entityRiskData.remediation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 5: RISK TRENDS */}
      {subTab === 'trends' && (
        <div className="quality-trends-tab space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <TrendingUp size={16} className="text-primary-400" />
                Technical Debt & Risk Historical Trends
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Tracks quality score, risk posture, and finding velocity across Git commits and architecture snapshots.
              </p>
            </div>
            {trendsData?.overall_trend && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${
                trendsData.overall_trend === 'DECREASING'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : trendsData.overall_trend === 'INCREASING'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-gray-800 text-gray-300 border-gray-700'
              }`}>
                {trendsData.overall_trend === 'DECREASING' ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                Trend: {trendsData.overall_trend}
              </span>
            )}
          </div>

          {!trendsData || trendsData.timeline.length === 0 ? (
            <div className="quality-card p-12 text-center text-gray-400 text-sm">
              <Compass size={36} className="mx-auto mb-2 text-primary-400" />
              Single snapshot available. Future commits and analysis runs will populate historical trends.
            </div>
          ) : (
            <div className="quality-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="quality-table">
                  <thead>
                    <tr>
                      <th>Commit Hash</th>
                      <th>Timestamp</th>
                      <th>Risk Score</th>
                      <th>Debt Finding Count</th>
                      <th>Hotspot Count</th>
                      <th>Trend Direction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendsData.timeline.map((item, sIdx) => (
                      <tr key={sIdx} className="hover:bg-gray-800/40">
                        <td className="font-mono text-xs text-primary-400 font-semibold">{item.commit_hash.slice(0, 8)}</td>
                        <td className="text-xs text-gray-400 font-mono">{new Date(item.timestamp).toLocaleDateString()}</td>
                        <td>
                          <span className="font-mono text-xs font-bold text-amber-400">{item.risk_score.toFixed(0)}</span>
                        </td>
                        <td className="text-xs text-gray-300 font-mono">{item.debt_finding_count}</td>
                        <td className="text-xs text-gray-300 font-mono">{item.hotspot_count}</td>
                        <td>
                          <span className="font-mono text-xs text-gray-200">{item.trend_direction}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 6: FILE METRICS */}
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
                          <button
                            onClick={() => handleInspectEntityRisk('FILE', file.file_path)}
                            className="btn-icon-sm"
                            title="Inspect Entity Risk"
                          >
                            <Compass size={13} />
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

      {/* SUBTAB 7: DUPLICATIONS */}
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

      {/* FINDING DETAIL MODAL */}
      {selectedFindingDetail && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="quality-card bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(selectedFindingDetail.finding.severity)}
                  <span className="badge badge-info font-mono text-xs">{selectedFindingDetail.finding.category}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
                    ID: {selectedFindingDetail.finding.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-100 mt-2">{selectedFindingDetail.finding.title}</h3>
                {selectedFindingDetail.finding.file_path && (
                  <p className="text-xs text-primary-400 font-mono mt-0.5">
                    {selectedFindingDetail.finding.file_path}
                    {selectedFindingDetail.finding.line_start && ` : L${selectedFindingDetail.finding.line_start}-${selectedFindingDetail.finding.line_end}`}
                    {selectedFindingDetail.finding.symbol_name && ` (${selectedFindingDetail.finding.symbol_name})`}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedFindingDetail(null)}
                className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold text-gray-300">Description</h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{selectedFindingDetail.finding.description}</p>
            </div>

            {/* Remediation */}
            {selectedFindingDetail.finding.remediation && (
              <div className="p-3 rounded bg-primary-950/30 border border-primary-800/40">
                <h4 className="text-xs font-semibold text-primary-300 flex items-center gap-1.5">
                  <Zap size={14} /> Actionable Remediation Plan
                </h4>
                <p className="text-xs text-primary-200/90 mt-1 leading-relaxed">{selectedFindingDetail.finding.remediation}</p>
              </div>
            )}

            {/* Evidence details */}
            {selectedFindingDetail.finding.evidence && Object.keys(selectedFindingDetail.finding.evidence).length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-300">Repository Evidence Data</h4>
                <pre className="text-[11px] bg-gray-950 p-3 rounded border border-gray-800 text-gray-300 font-mono mt-1 overflow-x-auto max-h-40">
                  {JSON.stringify(selectedFindingDetail.finding.evidence, null, 2)}
                </pre>
              </div>
            )}

            {/* Impact Context if available */}
            {selectedFindingDetail.impact_context && (
              <div className="p-3 rounded bg-gray-950 border border-gray-800 text-xs">
                <h4 className="font-semibold text-emerald-400 mb-1">Impact & Blast Radius Context</h4>
                <div className="flex items-center gap-4 text-gray-300 font-mono">
                  <span>Blast Radius: <strong>{selectedFindingDetail.impact_context.blast_radius}</strong></span>
                  <span>Direct Dependents: <strong>{selectedFindingDetail.impact_context.direct_dependents}</strong></span>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
              {selectedFindingDetail.finding.file_path && onOpenFile && (
                <button
                  onClick={() => {
                    onOpenFile(selectedFindingDetail.finding.file_path!, selectedFindingDetail.finding.line_start || 1);
                    setSelectedFindingDetail(null);
                  }}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <FileCode size={13} /> Open in Code Explorer
                </button>
              )}
              {selectedFindingDetail.finding.file_path && onOpenImpact && (
                <button
                  onClick={() => {
                    onOpenImpact(selectedFindingDetail.finding.file_path!, selectedFindingDetail.finding.file_path!);
                    setSelectedFindingDetail(null);
                  }}
                  className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <GitPullRequest size={13} /> Analyze Blast Radius
                </button>
              )}
              <button
                onClick={() => setSelectedFindingDetail(null)}
                className="btn-secondary text-xs px-3 py-1.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
