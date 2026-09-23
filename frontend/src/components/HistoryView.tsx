import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GitHistorySummary,
  CommitItem,
  FileEvolutionMetric,
  HistoricalSnapshotItem,
  FileEvolutionHistoryResponse,
  CommitCompareResponse,
  CommitDetailPhase20Response,
} from '../types';
import { api } from '../services/api';
import {
  History,
  GitCommit,
  GitPullRequest,
  Users,
  Flame,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Activity,
  CheckCircle2,
  RefreshCw,
  User,
  Calendar,
  AlertCircle,
  FileCode,
  Clock,
  GitCompare,
  ArrowRight,
  Layers,
  Package,
  HelpCircle,
} from 'lucide-react';

interface HistoryViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string, name: string) => void;
}

type HistorySubTab = 'overview' | 'timeline' | 'files' | 'contributors' | 'time-machine';


export const HistoryView: React.FC<HistoryViewProps> = ({
  repositoryId,
  onOpenFile,
  onOpenImpact,
}) => {
  const [subTab, setSubTab] = useState<HistorySubTab>('overview');
  const [summary, setSummary] = useState<GitHistorySummary | null>(null);
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [filesMetrics, setFilesMetrics] = useState<FileEvolutionMetric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('churn');
  const [highRiskOnly, setHighRiskOnly] = useState<boolean>(false);
  const [expandedCommitSha, setExpandedCommitSha] = useState<string | null>(null);

  // Phase 20: Code Time Machine State
  const [snapshots, setSnapshots] = useState<HistoricalSnapshotItem[]>([]);
  const [selectedFromCommit, setSelectedFromCommit] = useState<string>('');
  const [selectedToCommit, setSelectedToCommit] = useState<string>('');
  const [compareResult, setCompareResult] = useState<CommitCompareResponse | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [compareError, setCompareError] = useState<string | null>(null);

  const [fileHistoryInput, setFileHistoryInput] = useState<string>('');
  const [fileEvolution, setFileEvolution] = useState<FileEvolutionHistoryResponse | null>(null);
  const [isLoadingFileHistory, setIsLoadingFileHistory] = useState<boolean>(false);
  const [fileHistoryError, setFileHistoryError] = useState<string | null>(null);

  const [selectedCommitHash, setSelectedCommitHash] = useState<string | null>(null);
  const [commitDetail, setCommitDetail] = useState<CommitDetailPhase20Response | null>(null);
  const [isLoadingCommitDetail, setIsLoadingCommitDetail] = useState<boolean>(false);
  const [activeTimeMachineSubSection, setActiveTimeMachineSubSection] = useState<'compare' | 'file-history' | 'snapshots'>('compare');

  // Reset git history & time machine state when repositoryId changes
  useEffect(() => {
    setSummary(null);
    setCommits([]);
    setFilesMetrics([]);
    setSnapshots([]);
    setSelectedFromCommit('');
    setSelectedToCommit('');
    setCompareResult(null);
    setCompareError(null);
    setFileEvolution(null);
    setFileHistoryError(null);
    setSelectedCommitHash(null);
    setCommitDetail(null);
  }, [repositoryId]);

  const loadSnapshots = useCallback(async () => {
    try {
      const res = await api.getHistoricalSnapshots(repositoryId);
      setSnapshots(res.snapshots);
      if (res.snapshots.length >= 2) {
        if (!selectedFromCommit) setSelectedFromCommit(res.snapshots[1].commit_hash);
        if (!selectedToCommit) setSelectedToCommit(res.snapshots[0].commit_hash);
      } else if (res.snapshots.length === 1) {
        if (!selectedToCommit) setSelectedToCommit(res.snapshots[0].commit_hash);
      }
    } catch (err: any) {
      console.error('Failed to load snapshots:', err);
    }
  }, [repositoryId, selectedFromCommit, selectedToCommit]);

  const handleCompareCommits = async () => {
    if (!selectedFromCommit.trim() || !selectedToCommit.trim()) return;
    setIsComparing(true);
    setCompareError(null);
    try {
      const res = await api.compareCommits(repositoryId, {
        from_commit: selectedFromCommit.trim(),
        to_commit: selectedToCommit.trim(),
      });
      setCompareResult(res);
    } catch (err: any) {
      setCompareError(err.message || 'Failed to compare commits');
    } finally {
      setIsComparing(false);
    }
  };

  const handleInspectFileHistory = async (path: string) => {
    if (!path.trim()) return;
    setIsLoadingFileHistory(true);
    setFileHistoryError(null);
    setFileHistoryInput(path);
    try {
      const res = await api.getFileEvolutionHistory(repositoryId, path.trim());
      setFileEvolution(res);
      setActiveTimeMachineSubSection('file-history');
    } catch (err: any) {
      setFileHistoryError(err.message || 'Failed to fetch file evolution history');
    } finally {
      setIsLoadingFileHistory(false);
    }
  };

  const handleInspectCommitDetail = async (hash: string) => {
    if (!hash.trim()) return;
    setIsLoadingCommitDetail(true);
    setSelectedCommitHash(hash.trim());
    try {
      const res = await api.getCommitDetailPhase20(repositoryId, hash.trim());
      setCommitDetail(res);
    } catch (err: any) {
      console.error('Failed to fetch commit detail:', err);
    } finally {
      setIsLoadingCommitDetail(false);
    }
  };


  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [sumRes, comRes, fileRes] = await Promise.allSettled([
        api.getHistorySummary(repositoryId),
        api.getCommits(repositoryId, { limit: 100 }),
        api.getFileEvolutionList(repositoryId, { limit: 150 }),
      ]);

      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
      } else {
        throw new Error('Failed to load Git evolution summary.');
      }

      if (comRes.status === 'fulfilled') {
        setCommits(comRes.value.commits);
      }

      if (fileRes.status === 'fulfilled') {
        setFilesMetrics(fileRes.value.files);
      }
    } catch (err: any) {
      console.error('Error loading Git history intelligence:', err);
      setError(err.message || 'Failed to analyze repository Git evolution.');
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered commits
  const filteredCommits = useMemo(() => {
    return commits.filter((c) => {
      if (selectedCategory !== 'ALL' && c.category.toUpperCase() !== selectedCategory.toUpperCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inMsg = c.message.toLowerCase().includes(q);
        const inAuth = (c.author_name || '').toLowerCase().includes(q);
        const inSha = c.commit_sha.toLowerCase().includes(q);
        if (!inMsg && !inAuth && !inSha) return false;
      }
      return true;
    });
  }, [commits, selectedCategory, searchQuery]);

  // Filtered & sorted files metrics
  const filteredFiles = useMemo(() => {
    const list = filesMetrics.filter((fm) => {
      if (highRiskOnly && !fm.is_high_evolution_risk) return false;
      if (selectedStatus !== 'ALL' && fm.activity_status.toUpperCase() !== selectedStatus.toUpperCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inPath = fm.file_path.toLowerCase().includes(q);
        const inAuth = (fm.primary_author || '').toLowerCase().includes(q);
        if (!inPath && !inAuth) return false;
      }
      return true;
    });

    if (sortBy === 'commits') {
      list.sort((a, b) => b.total_commits - a.total_commits);
    } else if (sortBy === 'recent_churn') {
      list.sort((a, b) => b.recent_churn_30d - a.recent_churn_30d);
    } else if (sortBy === 'inactivity') {
      list.sort((a, b) => b.inactivity_days - a.inactivity_days);
    } else if (sortBy === 'ownership') {
      list.sort((a, b) => b.primary_author_ownership - a.primary_author_ownership);
    } else {
      list.sort((a, b) => b.total_churn - a.total_churn);
    }

    return list;
  }, [filesMetrics, highRiskOnly, selectedStatus, sortBy, searchQuery]);

  const getCategoryBadge = (category: string) => {
    switch (category.toUpperCase()) {
      case 'FEATURE':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 font-mono">FEAT</span>;
      case 'FIX':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/40 font-mono">FIX</span>;
      case 'REFACTOR':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/70 text-blue-300 border border-blue-800/40 font-mono">REFACTOR</span>;
      case 'TEST':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40 font-mono">TEST</span>;
      case 'DOCS':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/40 font-mono">DOCS</span>;
      case 'SECURITY':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono">SEC</span>;
      case 'PERFORMANCE':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/40 font-mono">PERF</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700 font-mono">{category}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/30">Active</span>;
      case 'LOW_ACTIVITY':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/30">Low Activity</span>;
      case 'INACTIVE':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">Inactive</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="quality-loading-container">
        <RefreshCw className="spin-icon text-primary-400" size={32} />
        <h3 className="text-lg font-semibold text-gray-200 mt-4">Analyzing Repository Evolution & History...</h3>
        <p className="text-sm text-gray-400 mt-1">Extracting commit logs, author ownership, code churn, and architectural evolution</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="quality-error-container">
        <AlertCircle className="text-rose-400" size={36} />
        <h3 className="text-lg font-semibold text-gray-200 mt-3">Git History Unavailable</h3>
        <p className="text-sm text-gray-400 mt-1">{error || 'No historical Git data could be retrieved.'}</p>
        <button onClick={loadData} className="btn-secondary mt-4">
          <RefreshCw size={14} /> Retry History Audit
        </button>
      </div>
    );
  }

  return (
    <div className="quality-view-container">
      {/* Top Header Card */}
      <header className="quality-header-card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-950/60 border border-primary-800/40 flex items-center justify-center text-primary-400">
            <History size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-gray-100">Repository Evolution Intelligence</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-950 text-primary-300 border border-primary-800/40 font-mono">
                {summary.total_commits} commits
              </span>
              {summary.is_shallow && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-medium">
                  Shallow Clone
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{summary.summary_text}</p>
          </div>
        </div>

        {/* Quick Metric Stats */}
        <div className="quality-quick-stats-grid">
          <div className="quick-stat-box">
            <span className="stat-label">Contributors</span>
            <span className="stat-val flex items-center gap-1.5 text-primary-400">
              <Users size={16} /> {summary.total_contributors}
            </span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">Total Churn</span>
            <span className="stat-val text-amber-400 font-mono">
              {summary.total_churn.toLocaleString()}
            </span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">30-Day Churn</span>
            <span className="stat-val text-emerald-400 font-mono">
              {summary.recent_churn_30d.toLocaleString()}
            </span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">Velocity</span>
            <span className="stat-val text-gray-200 font-mono text-xs mt-1">
              {summary.weekly_velocity} commits/wk
            </span>
          </div>
        </div>
      </header>

      {/* Sub-Tabs Bar */}
      <div className="quality-subtabs-bar">
        <button
          className={`quality-subtab-btn ${subTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSubTab('overview')}
        >
          <Activity size={15} />
          <span>Overview</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setSubTab('timeline')}
        >
          <GitCommit size={15} />
          <span>Commit Timeline ({summary.total_commits})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'files' ? 'active' : ''}`}
          onClick={() => setSubTab('files')}
        >
          <Flame size={15} />
          <span>File Evolution & Hotspots ({filesMetrics.length})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'contributors' ? 'active' : ''}`}
          onClick={() => setSubTab('contributors')}
        >
          <Users size={15} />
          <span>Contributors ({summary.total_contributors})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'time-machine' ? 'active' : ''}`}
          onClick={() => {
            setSubTab('time-machine');
            if (snapshots.length === 0) loadSnapshots();
          }}
        >
          <Clock size={15} />
          <span>Code Time Machine</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Row: Categories & Top Hotspots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Commit Categories Distribution */}
            <div className="quality-card p-5">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <GitCommit size={16} className="text-primary-400" />
                Commit Classification Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(summary.category_counts).map(([cat, count]) => (
                  <div key={cat} className="category-count-box">
                    <span className="text-[11px] text-gray-400 font-mono uppercase">{cat}</span>
                    <span className="text-base font-bold text-gray-100 font-mono mt-0.5">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Evolution Hotspots */}
            <div className="quality-card p-5">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Flame size={16} className="text-amber-400" />
                Top Evolution & Churn Hotspots
              </h3>
              {summary.top_hotspots.length === 0 ? (
                <p className="text-xs text-gray-400">No high churn hotspots detected.</p>
              ) : (
                <div className="space-y-2.5">
                  {summary.top_hotspots.slice(0, 4).map((h, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-primary-400">{h.file_path}</span>
                          {h.hotspot_type === 'COMPLEXITY_AND_CHURN' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">
                              High Evolution Risk
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {h.total_commits} commits • {h.total_churn.toLocaleString()} churn • Owner: {h.primary_author || 'Unknown'} ({h.ownership_percentage}%)
                        </p>
                      </div>
                      {onOpenFile && (
                        <button
                          onClick={() => onOpenFile(h.file_path, 1)}
                          className="btn-icon-sm"
                          title="Inspect in Code Explorer"
                        >
                          <ExternalLink size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMIT TIMELINE */}
      {subTab === 'timeline' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="findings-filter-bar flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                placeholder="Search commit message, author, or SHA..."
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
                <option value="FEATURE">Feature</option>
                <option value="FIX">Fix</option>
                <option value="REFACTOR">Refactor</option>
                <option value="TEST">Test</option>
                <option value="DOCS">Docs</option>
                <option value="BUILD">Build</option>
                <option value="PERFORMANCE">Performance</option>
                <option value="SECURITY">Security</option>
                <option value="CHORE">Chore</option>
              </select>
            </div>
          </div>

          {/* Timeline List */}
          <div className="space-y-3">
            {filteredCommits.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400" />
                No commits match the current filter.
              </div>
            ) : (
              filteredCommits.map((c) => {
                const isExpanded = expandedCommitSha === c.commit_sha;
                return (
                  <div
                    key={c.commit_sha}
                    className="finding-card border border-gray-800 rounded-lg bg-gray-900/60 overflow-hidden transition-all hover:border-gray-700"
                  >
                    <div
                      className="finding-card-header p-3.5 flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedCommitSha(isExpanded ? null : c.commit_sha)}
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-gray-500 hover:text-gray-300">
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(c.category)}
                            <span className="font-mono text-xs font-bold text-primary-400">
                              {c.commit_sha.substring(0, 7)}
                            </span>
                            <span className="text-xs font-semibold text-gray-200">{c.message}</span>
                            {c.is_source_and_test && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                                Source + Test
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1"><User size={11} /> {c.author_name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(c.committed_at)}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-mono">+{c.total_additions}</span>
                            <span className="text-rose-400 font-mono">-{c.total_deletions}</span>
                            <span>({c.files_changed_count} files)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="finding-card-body p-4 border-t border-gray-800/80 bg-black/20 space-y-3">
                        <h4 className="text-xs font-semibold text-gray-300">Changed Files ({c.file_changes.length})</h4>
                        <div className="space-y-1.5">
                          {c.file_changes.map((fc, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded bg-gray-950/70 border border-gray-800 font-mono">
                              <div className="flex items-center gap-2">
                                <FileCode size={13} className="text-gray-500" />
                                <span className="text-gray-300">{fc.file_path}</span>
                                <span className="text-[10px] text-gray-500">({fc.change_type})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400">+{fc.additions}</span>
                                <span className="text-rose-400">-{fc.deletions}</span>
                                {onOpenFile && (
                                  <button
                                    onClick={() => onOpenFile(fc.file_path, 1)}
                                    className="text-primary-400 hover:underline text-[11px] ml-2"
                                  >
                                    View
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FILE EVOLUTION & HOTSPOTS */}
      {subTab === 'files' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="findings-filter-bar flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                placeholder="Search files or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="churn">Sort by Total Churn</option>
                <option value="commits">Sort by Commits</option>
                <option value="recent_churn">Sort by 30d Churn</option>
                <option value="inactivity">Sort by Inactivity</option>
                <option value="ownership">Sort by Owner Share</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Activity</option>
                <option value="ACTIVE">Active</option>
                <option value="LOW_ACTIVITY">Low Activity</option>
                <option value="INACTIVE">Inactive (&gt;90d)</option>
              </select>

              <button
                onClick={() => setHighRiskOnly(!highRiskOnly)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  highRiskOnly ? 'bg-rose-950 text-rose-300 border-rose-800 font-medium' : 'bg-gray-900 text-gray-300 border-gray-700'
                }`}
              >
                High Evolution Risk
              </button>
            </div>
          </div>

          {/* Files Table */}
          <div className="quality-card overflow-hidden">
            <table className="quality-table">
              <thead>
                <tr>
                  <th>File Path</th>
                  <th>Commits</th>
                  <th>Total Churn</th>
                  <th>30d Churn</th>
                  <th>Primary Owner</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((fm, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="font-mono text-xs font-semibold text-gray-200">
                      <div className="flex items-center gap-1.5">
                        <span>{fm.file_path}</span>
                        {fm.is_high_evolution_risk && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            Risk
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="font-mono text-xs text-gray-300">{fm.total_commits}</td>
                    <td className="font-mono text-xs text-amber-400">{fm.total_churn.toLocaleString()}</td>
                    <td className="font-mono text-xs text-emerald-400">{fm.recent_churn_30d.toLocaleString()}</td>
                    <td className="text-xs text-gray-300">
                      {fm.primary_author ? (
                        <span>
                          {fm.primary_author} <span className="text-gray-500 font-mono">({fm.primary_author_ownership}%)</span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{getStatusBadge(fm.activity_status)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {onOpenFile && (
                          <button
                            onClick={() => onOpenFile(fm.file_path, 1)}
                            className="btn-icon-sm"
                            title="Open in Code Explorer"
                          >
                            <ExternalLink size={12} />
                          </button>
                        )}
                        {fm.is_high_evolution_risk && onOpenImpact && (
                          <button
                            onClick={() => onOpenImpact(fm.file_id || fm.file_path, fm.file_path)}
                            className="btn-secondary text-[10px] py-0.5 px-1.5 flex items-center gap-1"
                            title="Analyze architectural impact"
                          >
                            <GitPullRequest size={10} /> Impact
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

      {/* TAB 4: CONTRIBUTORS */}
      {subTab === 'contributors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Users size={16} className="text-primary-400" />
              Repository Contributors & Ownership Shares
            </h3>
            <span className="text-xs text-gray-400">{summary.top_contributors.length} contributors</span>
          </div>

          <div className="quality-card overflow-hidden">
            <table className="quality-table">
              <thead>
                <tr>
                  <th>Contributor</th>
                  <th>Commits</th>
                  <th>Files Touched</th>
                  <th>Lines Added</th>
                  <th>Lines Deleted</th>
                  <th>Primary Owned Files</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {summary.top_contributors.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="text-xs font-semibold text-gray-200 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-950 text-primary-300 border border-primary-800/40 flex items-center justify-center text-[10px] font-mono">
                        {c.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div>{c.author_name}</div>
                        {c.author_email && <div className="text-[10px] text-gray-500 font-mono">{c.author_email}</div>}
                      </div>
                    </td>
                    <td className="font-mono text-xs text-gray-300">{c.total_commits}</td>
                    <td className="font-mono text-xs text-gray-400">{c.files_touched_count}</td>
                    <td className="font-mono text-xs text-emerald-400">+{c.total_additions.toLocaleString()}</td>
                    <td className="font-mono text-xs text-rose-400">-{c.total_deletions.toLocaleString()}</td>
                    <td className="font-mono text-xs text-primary-400">{c.primary_owned_files_count}</td>
                    <td className="text-xs text-gray-400">{formatDate(c.last_commit_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CODE TIME MACHINE */}
      {subTab === 'time-machine' && (
        <div className="space-y-6">
          {/* Sub-navigation inside Time Machine */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  activeTimeMachineSubSection === 'compare'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTimeMachineSubSection('compare')}
              >
                <GitCompare size={14} />
                <span>Commit Comparison & Diff</span>
              </button>
              <button
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  activeTimeMachineSubSection === 'file-history'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTimeMachineSubSection('file-history')}
              >
                <FileCode size={14} />
                <span>File Evolution & Renames</span>
              </button>
              <button
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  activeTimeMachineSubSection === 'snapshots'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-800/60 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
                onClick={() => {
                  setActiveTimeMachineSubSection('snapshots');
                  if (snapshots.length === 0) loadSnapshots();
                }}
              >
                <Clock size={14} />
                <span>Historical Snapshots</span>
              </button>
            </div>
          </div>

          {/* SECTION 1: COMMIT COMPARISON */}
          {activeTimeMachineSubSection === 'compare' && (
            <div className="space-y-6">
              {/* Compare Control Card */}
              <div className="quality-card p-5">
                <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <GitCompare size={16} className="text-primary-400" />
                  Compare Two Commits Across Repository History
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Derives real Git unified diffs, line coordinates, AST symbol changes, dependency manifest deltas, and architectural layer impacts directly from the Git object store.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[220px]">
                    <label className="text-[11px] text-gray-400 font-mono mb-1 block">From Commit (Base / Older)</label>
                    <input
                      type="text"
                      placeholder="e.g. HEAD~1 or commit SHA"
                      value={selectedFromCommit}
                      onChange={(e) => setSelectedFromCommit(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-xs text-gray-200 font-mono focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="text-gray-500 pt-5">
                    <ArrowRight size={16} />
                  </div>
                  <div className="flex-1 min-w-[220px]">
                    <label className="text-[11px] text-gray-400 font-mono mb-1 block">To Commit (Target / Newer)</label>
                    <input
                      type="text"
                      placeholder="e.g. HEAD or commit SHA"
                      value={selectedToCommit}
                      onChange={(e) => setSelectedToCommit(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-xs text-gray-200 font-mono focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="pt-5">
                    <button
                      onClick={handleCompareCommits}
                      disabled={isComparing || !selectedFromCommit || !selectedToCommit}
                      className="px-4 py-1.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-xs font-semibold rounded shadow transition-colors flex items-center gap-1.5"
                    >
                      {isComparing ? <RefreshCw size={14} className="animate-spin" /> : <GitCompare size={14} />}
                      Compare Commits
                    </button>
                  </div>
                </div>

                {/* Quick Commit Selection helper */}
                {commits.length >= 2 && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800/60">
                    <span className="text-[11px] text-gray-500">Quick Select:</span>
                    <button
                      className="text-[11px] text-primary-400 hover:text-primary-300 font-mono underline"
                      onClick={() => {
                        setSelectedFromCommit(commits[1].commit_sha.slice(0, 8));
                        setSelectedToCommit(commits[0].commit_sha.slice(0, 8));
                      }}
                    >
                      Latest 2 Commits ({commits[1].commit_sha.slice(0, 7)} &rarr; {commits[0].commit_sha.slice(0, 7)})
                    </button>
                    {commits.length > 2 && (
                      <>
                        <span className="text-gray-600">|</span>
                        <button
                          className="text-[11px] text-primary-400 hover:text-primary-300 font-mono underline"
                          onClick={() => {
                            setSelectedFromCommit(commits[commits.length - 1].commit_sha.slice(0, 8));
                            setSelectedToCommit(commits[0].commit_sha.slice(0, 8));
                          }}
                        >
                          Initial vs HEAD
                        </button>
                      </>
                    )}
                  </div>
                )}

                {compareError && (
                  <div className="mt-3 p-2.5 rounded bg-rose-950/60 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle size={14} />
                    {compareError}
                  </div>
                )}
              </div>

              {/* Commit Detail Inspector */}
              {isLoadingCommitDetail && (
                <div className="quality-card p-4 flex items-center justify-center gap-2 text-xs text-primary-400">
                  <RefreshCw size={14} className="animate-spin" /> Loading commit details for {selectedCommitHash?.slice(0, 8)}...
                </div>
              )}

              {commitDetail && !isLoadingCommitDetail && (
                <div className="quality-card p-5 border-primary-800/40 bg-gray-950/80">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <GitCommit size={16} className="text-primary-400" />
                      <span className="font-bold text-gray-100 font-mono text-sm">{commitDetail.commit_hash.slice(0, 10)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                        {commitDetail.branch || 'main'}
                      </span>
                    </div>
                    <button
                      onClick={() => setCommitDetail(null)}
                      className="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 bg-gray-800 rounded"
                    >
                      Close Inspector
                    </button>
                  </div>
                  <div className="text-xs text-gray-200 font-medium mb-2">{commitDetail.message}</div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-4 mb-4 font-mono">
                    <span>Author: {commitDetail.author}</span>
                    <span>Date: {formatDate(commitDetail.timestamp)}</span>
                    <span className="text-emerald-400">+{commitDetail.insertions}</span>
                    <span className="text-rose-400">-{commitDetail.deletions}</span>
                    <span>Files: {commitDetail.files_changed_count}</span>
                  </div>

                  {commitDetail.architecture_changes.length > 0 && (
                    <div className="mb-3 p-3 rounded bg-cyan-950/20 border border-cyan-800/30 text-xs">
                      <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                        <Layers size={13} /> Architecture Layer Impacts:
                      </div>
                      <div className="space-y-1 font-mono text-[11px] text-gray-300">
                        {commitDetail.architecture_changes.map((ac, acIdx) => (
                          <div key={acIdx}>&bull; {ac}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {commitDetail.symbol_changes.length > 0 && (
                    <div className="p-3 rounded bg-gray-900/60 border border-gray-800 text-xs">
                      <div className="font-semibold text-primary-300 mb-1 flex items-center gap-1.5">
                        <FileCode size={13} /> AST Symbol Changes in Commit:
                      </div>
                      <div className="space-y-1 font-mono text-[11px] text-gray-300">
                        {commitDetail.symbol_changes.map((sc, scIdx) => (
                          <div key={scIdx} className="flex items-center justify-between">
                            <span>
                              [{sc.change_type}] {sc.symbol_name} ({sc.symbol_type}) in {sc.file_path}
                            </span>
                            {sc.is_uncertain && (
                              <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded">
                                Uncertain
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Compare Results Display */}
              {compareResult && (
                <div className="space-y-6">
                  {/* Delta Metrics Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    <div className="quick-stat-box">
                      <span className="stat-label">Files Added</span>
                      <span className="stat-val text-emerald-400 font-mono">+{compareResult.added_files.length}</span>
                    </div>
                    <div className="quick-stat-box">
                      <span className="stat-label">Files Deleted</span>
                      <span className="stat-val text-rose-400 font-mono">-{compareResult.deleted_files.length}</span>
                    </div>
                    <div className="quick-stat-box">
                      <span className="stat-label">Files Modified</span>
                      <span className="stat-val text-amber-400 font-mono">{compareResult.modified_files.length}</span>
                    </div>
                    <div className="quick-stat-box">
                      <span className="stat-label">Lines Delta</span>
                      <span className="stat-val font-mono text-xs mt-1">
                        <span className="text-emerald-400">+{compareResult.metrics_changes.total_lines_added || 0}</span> /{' '}
                        <span className="text-rose-400">-{compareResult.metrics_changes.total_lines_deleted || 0}</span>
                      </span>
                    </div>
                    <div className="quick-stat-box">
                      <span className="stat-label">Symbols Delta</span>
                      <span className="stat-val text-primary-400 font-mono">
                        +{compareResult.added_symbols.length} / -{compareResult.deleted_symbols.length}
                      </span>
                    </div>
                    <div className="quick-stat-box">
                      <span className="stat-label">Arch Layers</span>
                      <span className="stat-val text-cyan-400 font-mono">{compareResult.architecture_changes.length}</span>
                    </div>
                  </div>

                  {/* Renamed Files Notice */}
                  {compareResult.renamed_files.length > 0 && (
                    <div className="quality-card p-4 bg-blue-950/30 border-blue-800/40">
                      <h4 className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-1.5">
                        <ArrowRight size={14} /> Detectable File Renames ({compareResult.renamed_files.length})
                      </h4>
                      <div className="space-y-1.5 font-mono text-xs">
                        {compareResult.renamed_files.map((rf, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-gray-300">
                            <span className="text-gray-400 line-through">{rf.from}</span>
                            <ArrowRight size={12} className="text-blue-400" />
                            <span className="text-blue-300 font-semibold">{rf.to}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AST Symbol Changes */}
                  {(compareResult.added_symbols.length > 0 ||
                    compareResult.deleted_symbols.length > 0 ||
                    compareResult.modified_symbols.length > 0) && (
                    <div className="quality-card p-5">
                      <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <FileCode size={16} className="text-primary-400" />
                        AST Symbol Evolution
                      </h4>
                      <div className="space-y-2">
                        {[
                          ...compareResult.added_symbols,
                          ...compareResult.modified_symbols,
                          ...compareResult.deleted_symbols,
                        ].map((sc, idx) => (
                          <div key={idx} className="p-2.5 rounded bg-gray-900/60 border border-gray-800 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                                    sc.change_type === 'CREATED'
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : sc.change_type === 'DELETED'
                                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  {sc.change_type}
                                </span>
                                <span className="font-semibold text-gray-200 font-mono">{sc.symbol_name}</span>
                                <span className="text-gray-500 text-[11px]">({sc.symbol_type})</span>
                                <span className="text-gray-400 text-[11px] font-mono">{sc.file_path}</span>
                              </div>
                              {sc.is_uncertain && (
                                <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                                  <HelpCircle size={10} /> Uncertain AST Mapping
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-[11px] text-gray-400">{sc.evidence}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Architecture & Dependency Impacts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Architecture Changes */}
                    <div className="quality-card p-5">
                      <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <Layers size={16} className="text-cyan-400" />
                        Architectural Boundary Shifts
                      </h4>
                      {compareResult.architecture_changes.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No architectural boundary changes detected.</p>
                      ) : (
                        <div className="space-y-2">
                          {compareResult.architecture_changes.map((ac, idx) => (
                            <div key={idx} className="p-2.5 rounded bg-cyan-950/20 border border-cyan-800/30 text-xs">
                              <div className="font-semibold text-cyan-300">{ac.layer} ({ac.category})</div>
                              <div className="text-[11px] text-gray-400 mt-0.5">{ac.description}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dependency Manifest Changes */}
                    <div className="quality-card p-5">
                      <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <Package size={16} className="text-amber-400" />
                        Dependency Manifest Changes
                      </h4>
                      {compareResult.dependency_changes.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No dependency manifest files were modified.</p>
                      ) : (
                        <div className="space-y-2">
                          {compareResult.dependency_changes.map((dc, idx) => (
                            <div key={idx} className="p-2.5 rounded bg-gray-900/60 border border-gray-800 text-xs">
                              <div className="font-semibold text-amber-300 font-mono">{dc.manifest_file}</div>
                              {dc.added_entries?.length > 0 && (
                                <div className="mt-1 text-[11px] text-emerald-400 font-mono">
                                  + {dc.added_entries.join(', ')}
                                </div>
                              )}
                              {dc.removed_entries?.length > 0 && (
                                <div className="mt-0.5 text-[11px] text-rose-400 font-mono">
                                  - {dc.removed_entries.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Real Unified File Diffs */}
                  <div className="quality-card p-5">
                    <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <FileCode size={16} className="text-emerald-400" />
                      Unified File Diffs & Hunks ({compareResult.file_diffs.length})
                    </h4>
                    <div className="space-y-4">
                      {compareResult.file_diffs.map((fd, idx) => (
                        <div key={idx} className="rounded border border-gray-800 overflow-hidden bg-gray-950">
                          <div className="px-3 py-2 bg-gray-900 flex items-center justify-between border-b border-gray-800">
                            <div className="flex items-center gap-2 font-mono text-xs text-gray-200">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  fd.change_type === 'ADDED'
                                    ? 'bg-emerald-950 text-emerald-300'
                                    : fd.change_type === 'DELETED'
                                    ? 'bg-rose-950 text-rose-300'
                                    : 'bg-amber-950 text-amber-300'
                                }`}
                              >
                                {fd.change_type}
                              </span>
                              <span>{fd.new_path || fd.old_path}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="text-emerald-400">+{fd.additions}</span>
                              <span className="text-rose-400">-{fd.deletions}</span>
                            </div>
                          </div>
                          {fd.hunks.map((h, hIdx) => (
                            <div key={hIdx} className="p-2 border-b border-gray-900/60 last:border-b-0 font-mono text-[11px]">
                              <div className="text-cyan-400/80 bg-gray-900/40 px-2 py-0.5 rounded mb-1">
                                @@ -{h.old_start},{h.old_lines} +{h.new_start},{h.new_lines} @@ {h.heading || ''}
                              </div>
                              <div className="overflow-x-auto space-y-0.5 pl-2">
                                {h.lines.slice(0, 30).map((l, lIdx) => (
                                  <div
                                    key={lIdx}
                                    className={`whitespace-pre ${
                                      l.startsWith('+')
                                        ? 'text-emerald-300 bg-emerald-950/20'
                                        : l.startsWith('-')
                                        ? 'text-rose-300 bg-rose-950/20'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {l}
                                  </div>
                                ))}
                                {h.lines.length > 30 && (
                                  <div className="text-gray-500 italic text-[10px]">
                                    ... ({h.lines.length - 30} more lines truncated in preview)
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: FILE EVOLUTION & RENAMES */}
          {activeTimeMachineSubSection === 'file-history' && (
            <div className="space-y-6">
              <div className="quality-card p-5">
                <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <FileCode size={16} className="text-primary-400" />
                  Track Individual File Evolution Across Commits
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Traces a file backward through Git history via <code>git log --follow</code>, detecting historical renames, creator commit, last modifications, and churn statistics.
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter file path (e.g. backend/app/main.py or src/service.ts)"
                      value={fileHistoryInput}
                      onChange={(e) => setFileHistoryInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInspectFileHistory(fileHistoryInput)}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-xs text-gray-200 font-mono focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleInspectFileHistory(fileHistoryInput)}
                    disabled={isLoadingFileHistory || !fileHistoryInput}
                    className="px-4 py-1.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white text-xs font-semibold rounded shadow transition-colors flex items-center gap-1.5"
                  >
                    {isLoadingFileHistory ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                    Inspect File
                  </button>
                </div>

                {fileHistoryError && (
                  <div className="mt-3 p-2.5 rounded bg-rose-950/60 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle size={14} />
                    {fileHistoryError}
                  </div>
                )}
              </div>

              {/* File Evolution Details */}
              {fileEvolution && (
                <div className="space-y-6">
                  {/* File Stats Summary Card */}
                  <div className="quality-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-base font-bold text-gray-100 font-mono">{fileEvolution.file_path}</h4>
                        <span className="text-xs text-gray-400 mt-1 block">
                          Appeared in {fileEvolution.commit_count} commits across repository lifetime
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {onOpenFile && (
                          <button
                            onClick={() => onOpenFile(fileEvolution.file_path)}
                            className="btn-secondary text-xs"
                          >
                            <ExternalLink size={13} /> Open Code
                          </button>
                        )}
                        {onOpenImpact && (
                          <button
                            onClick={() => onOpenImpact(fileEvolution.file_id || fileEvolution.file_path, fileEvolution.file_path)}
                            className="btn-primary text-xs"
                          >
                            <Activity size={13} /> Impact Analysis
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="quick-stat-box">
                        <span className="stat-label">First Appearance</span>
                        <span className="stat-val font-mono text-xs mt-1 text-gray-200">
                          {formatDate(fileEvolution.created_at)}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                          {fileEvolution.first_commit_hash?.slice(0, 8) || 'N/A'}
                        </span>
                      </div>
                      <div className="quick-stat-box">
                        <span className="stat-label">Last Modified</span>
                        <span className="stat-val font-mono text-xs mt-1 text-gray-200">
                          {formatDate(fileEvolution.last_modified_at)}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                          {fileEvolution.last_commit_hash?.slice(0, 8) || 'N/A'}
                        </span>
                      </div>
                      <div className="quick-stat-box">
                        <span className="stat-label">Total Churn</span>
                        <span className="stat-val text-amber-400 font-mono">{fileEvolution.churn.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                          +{fileEvolution.total_additions} / -{fileEvolution.total_deletions}
                        </span>
                      </div>
                      <div className="quick-stat-box">
                        <span className="stat-label">Unique Authors</span>
                        <span className="stat-val text-primary-400 font-mono">{fileEvolution.authors.length}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                          {fileEvolution.authors.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rename History Section */}
                  {fileEvolution.rename_history.length > 0 && (
                    <div className="quality-card p-4 bg-blue-950/30 border-blue-800/40">
                      <h4 className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-1.5">
                        <ArrowRight size={14} /> Rename Lineage ({fileEvolution.rename_history.length})
                      </h4>
                      <div className="space-y-2 font-mono text-xs">
                        {fileEvolution.rename_history.map((rn, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-900/60 border border-gray-800">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 line-through">{rn.from_path}</span>
                              <ArrowRight size={12} className="text-blue-400" />
                              <span className="text-blue-300 font-bold">{rn.to_path}</span>
                            </div>
                            <div className="text-gray-500 text-[11px]">
                              Commit {rn.commit_hash.slice(0, 8)} ({formatDate(rn.timestamp)})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commits Timeline for this file */}
                  <div className="quality-card p-5">
                    <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <GitCommit size={16} className="text-primary-400" />
                      Commit History for File ({fileEvolution.commits.length})
                    </h4>
                    <div className="space-y-2">
                      {fileEvolution.commits.map((fc, idx) => (
                        <div key={idx} className="p-3 rounded bg-gray-900/60 border border-gray-800 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-primary-400 font-bold">{fc.commit_hash.slice(0, 8)}</span>
                              <span className="text-gray-200 font-medium">{fc.message}</span>
                              {fc.is_rename && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                                  RENAMED from {fc.old_path}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-1">
                              By <span className="text-gray-400 font-medium">{fc.author}</span> on {formatDate(fc.timestamp)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 font-mono">
                            <span className="text-emerald-400">+{fc.additions}</span>
                            <span className="text-rose-400">-{fc.deletions}</span>
                            <button
                              onClick={() => {
                                handleInspectCommitDetail(fc.commit_hash);
                                setActiveTimeMachineSubSection('compare');
                                setSelectedFromCommit(fc.commit_hash + '~1');
                                setSelectedToCommit(fc.commit_hash);
                              }}
                              className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[11px] font-sans"
                            >
                              Diff
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: HISTORICAL SNAPSHOTS */}
          {activeTimeMachineSubSection === 'snapshots' && (
            <div className="space-y-6">
              <div className="quality-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Clock size={16} className="text-primary-400" />
                    Historical Repository Snapshots ({snapshots.length})
                  </h3>
                  <button onClick={loadSnapshots} className="btn-secondary text-xs">
                    <RefreshCw size={13} /> Refresh Snapshots
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Each snapshot represents the repository state at a specific Git commit, tracking branch, analysis version, and architectural summaries.
                </p>

                {snapshots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    No snapshots recorded yet. Run an analysis or explore git commits.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {snapshots.map((s) => (
                      <div
                        key={s.snapshot_id}
                        className="p-3.5 rounded-lg bg-gray-900/60 border border-gray-800 flex items-center justify-between text-xs hover:border-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-950/80 border border-primary-800/40 flex items-center justify-center text-primary-400 font-mono font-bold text-xs">
                            {s.commit_hash.slice(0, 4)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-gray-200 font-bold">{s.commit_hash.slice(0, 10)}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                                {s.branch || 'main'}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-primary-950 text-primary-300 border border-primary-800/40 font-mono">
                                v{s.analysis_version}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                                {s.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-3">
                              <span>Recorded: {formatDate(s.created_at)}</span>
                              {s.summary.message && (
                                <span className="text-gray-500 italic truncate max-w-md">&quot;{s.summary.message}&quot;</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedFromCommit(s.commit_hash + '~1');
                              setSelectedToCommit(s.commit_hash);
                              setActiveTimeMachineSubSection('compare');
                              handleCompareCommits();
                            }}
                            className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors"
                          >
                            Inspect Commit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFromCommit(s.commit_hash);
                              setSelectedToCommit('HEAD');
                              setActiveTimeMachineSubSection('compare');
                            }}
                            className="px-2.5 py-1 bg-primary-950 hover:bg-primary-900 text-primary-300 border border-primary-800/40 rounded text-xs transition-colors"
                          >
                            Compare with HEAD
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

