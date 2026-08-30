import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GitHistorySummary,
  CommitItem,
  FileEvolutionMetric,
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
} from 'lucide-react';

interface HistoryViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string, name: string) => void;
}

type HistorySubTab = 'overview' | 'timeline' | 'files' | 'contributors';

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
    </div>
  );
};
