import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SecuritySummary,
  SecurityFinding,
  DependencyManifest,
  ReliabilityHotspot,
} from '../types';
import { api } from '../services/api';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw,
  GitPullRequest,
  Lock,
  Server,
  Package,
  Clock,
  Key,
} from 'lucide-react';

interface SecurityReliabilityViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string, name: string) => void;
}

type SecSubTab = 'overview' | 'security' | 'reliability' | 'dependencies';

export const SecurityReliabilityView: React.FC<SecurityReliabilityViewProps> = ({
  repositoryId,
  onOpenFile,
  onOpenImpact,
}) => {
  const [subTab, setSubTab] = useState<SecSubTab>('overview');
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [dependencies, setDependencies] = useState<DependencyManifest[]>([]);
  const [hotspots, setHotspots] = useState<ReliabilityHotspot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('ALL');
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [sumRes, findRes, depRes, hotRes] = await Promise.allSettled([
        api.getRepositorySecurity(repositoryId),
        api.getSecurityFindings(repositoryId, { limit: 150 }),
        api.getSecurityDependencies(repositoryId),
        api.getSecurityHotspots(repositoryId),
      ]);

      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
      } else {
        throw new Error('Failed to load security & reliability summary.');
      }

      if (findRes.status === 'fulfilled') {
        setFindings(findRes.value.findings);
      }

      if (depRes.status === 'fulfilled') {
        setDependencies(depRes.value.dependencies);
      }

      if (hotRes.status === 'fulfilled') {
        setHotspots(hotRes.value.hotspots);
      }
    } catch (err: any) {
      console.error('Error loading security & reliability intelligence:', err);
      setError(err.message || 'Failed to analyze security & reliability.');
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered security & reliability findings
  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      if (subTab === 'security' && f.finding_type !== 'SECURITY') return false;
      if (subTab === 'reliability' && f.finding_type !== 'RELIABILITY') return false;

      if (selectedCategory !== 'ALL' && f.category.toUpperCase() !== selectedCategory.toUpperCase()) {
        return false;
      }
      if (selectedSeverity !== 'ALL' && f.severity.toUpperCase() !== selectedSeverity.toUpperCase()) {
        return false;
      }
      if (selectedConfidence !== 'ALL' && f.confidence.toUpperCase() !== selectedConfidence.toUpperCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = f.title.toLowerCase().includes(q);
        const inDesc = f.description.toLowerCase().includes(q);
        const inFile = (f.file_path || '').toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inFile) return false;
      }
      return true;
    });
  }, [findings, subTab, selectedCategory, selectedSeverity, selectedConfidence, searchQuery]);

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

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence.toUpperCase()) {
      case 'HIGH':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">High Conf.</span>;
      case 'MEDIUM':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">Med Conf.</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">Low Conf.</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="quality-loading-container">
        <RefreshCw className="spin-icon text-primary-400" size={32} />
        <h3 className="text-lg font-semibold text-gray-200 mt-4">Auditing Security & Reliability Intelligence...</h3>
        <p className="text-sm text-gray-400 mt-1">Scanning secrets with redaction, injection patterns, missing timeouts, and dependency manifests</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="quality-error-container">
        <AlertTriangle className="text-rose-400" size={36} />
        <h3 className="text-lg font-semibold text-gray-200 mt-3">Security Analysis Error</h3>
        <p className="text-sm text-gray-400 mt-1">{error || 'Could not load security intelligence.'}</p>
        <button onClick={loadData} className="btn-secondary mt-4">
          <RefreshCw size={14} /> Retry Audit
        </button>
      </div>
    );
  }

  return (
    <div className="quality-view-container">
      {/* Top Header & Dual Executive Score Cards */}
      <header className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Security Score Card */}
        <div className="quality-header-card flex-1">
          <div className="quality-score-radial-group">
            <div className={`quality-grade-circle ${getGradeColor(summary.security_grade)}`}>
              <span className="grade-letter">{summary.security_grade}</span>
              <span className="score-number">{summary.security_score.toFixed(0)}</span>
            </div>
            <div className="quality-score-meta">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-100 flex items-center gap-1.5">
                  <Lock size={18} className="text-primary-400" />
                  Security Score
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                  {summary.total_security_findings} findings
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium mt-0.5">{summary.security_status_label}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Key size={12} className="text-amber-400" /> {summary.secrets_count} Secrets</span>
                <span>•</span>
                <span className="flex items-center gap-1"><ShieldAlert size={12} className="text-rose-400" /> {summary.injections_count} Injections</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reliability Score Card */}
        <div className="quality-header-card flex-1">
          <div className="quality-score-radial-group">
            <div className={`quality-grade-circle ${getGradeColor(summary.reliability_grade)}`}>
              <span className="grade-letter">{summary.reliability_grade}</span>
              <span className="score-number">{summary.reliability_score.toFixed(0)}</span>
            </div>
            <div className="quality-score-meta">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-100 flex items-center gap-1.5">
                  <Activity size={18} className="text-emerald-400" />
                  Reliability Score
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                  {summary.total_reliability_findings} findings
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium mt-0.5">{summary.reliability_status_label}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock size={12} className="text-amber-400" /> {summary.missing_timeouts_count} Missing Timeouts</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Server size={12} className="text-blue-400" /> {summary.spof_count} SPOF Modules</span>
              </div>
            </div>
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
          className={`quality-subtab-btn ${subTab === 'security' ? 'active' : ''}`}
          onClick={() => setSubTab('security')}
        >
          <Lock size={15} />
          <span>Security & Secrets ({summary.total_security_findings})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'reliability' ? 'active' : ''}`}
          onClick={() => setSubTab('reliability')}
        >
          <Flame size={15} />
          <span>Reliability & Hotspots ({summary.total_reliability_findings})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'dependencies' ? 'active' : ''}`}
          onClick={() => setSubTab('dependencies')}
        >
          <Package size={15} />
          <span>Dependencies ({summary.total_dependencies})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* Deductions & External Services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Factor Deductions */}
            <div className="quality-card p-5">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Lock size={15} className="text-primary-400" />
                Security Factor Breakdown
              </h3>
              <div className="space-y-3">
                {summary.security_breakdown.factors.map((f, idx) => (
                  <div key={idx} className="factor-breakdown-row">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-300">{f.factor}</span>
                      <span className={f.deduction > 0 ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>
                        {f.deduction > 0 ? `-${f.deduction.toFixed(1)} pts` : '0 pts'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${f.deduction > 15 ? 'bg-rose-500' : f.deduction > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min((f.deduction / f.weight) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* External Services & Reliability Factors */}
            <div className="space-y-6">
              <div className="quality-card p-5">
                <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Server size={15} className="text-primary-400" />
                  Detected External Services & Integrations
                </h3>
                {summary.external_services.length === 0 ? (
                  <p className="text-xs text-gray-400">No external cloud services or third-party APIs detected in source manifests.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {summary.external_services.map((svc, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 font-medium">
                        {svc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="quality-card p-5">
                <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Activity size={15} className="text-emerald-400" />
                  Reliability Factor Breakdown
                </h3>
                <div className="space-y-3">
                  {summary.reliability_breakdown.factors.map((f, idx) => (
                    <div key={idx} className="factor-breakdown-row">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-300">{f.factor}</span>
                        <span className={f.deduction > 0 ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>
                          {f.deduction > 0 ? `-${f.deduction.toFixed(1)} pts` : '0 pts'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${f.deduction > 10 ? 'bg-rose-500' : f.deduction > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((f.deduction / f.weight) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{f.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 & 3: FINDINGS (SECURITY / RELIABILITY) */}
      {(subTab === 'security' || subTab === 'reliability') && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="findings-filter-bar flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                placeholder="Search by title, description, or file..."
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
                <option value="SECRET_EXPOSURE">Secret Exposure</option>
                <option value="INJECTION">Injection</option>
                <option value="AUTHENTICATION">Authentication</option>
                <option value="COMMAND_EXECUTION">Command Execution</option>
                <option value="CONFIGURATION">Configuration & Debug</option>
                <option value="TIMEOUT">Missing Timeouts</option>
                <option value="RESOURCE_MANAGEMENT">Resource Management</option>
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

              <select
                value={selectedConfidence}
                onChange={(e) => setSelectedConfidence(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Confidence</option>
                <option value="HIGH">High Confidence</option>
                <option value="MEDIUM">Medium Confidence</option>
                <option value="LOW">Low Confidence</option>
              </select>
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-3">
            {filteredFindings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400" />
                No {subTab} findings match the current filter criteria.
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
                            {getConfidenceBadge(finding.confidence)}
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700 font-mono">
                              {finding.category}
                            </span>
                            {finding.cwe_id && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-950 text-primary-300 border border-primary-800/40 font-mono">
                                {finding.cwe_id}
                              </span>
                            )}
                            <span className="text-xs font-semibold text-gray-200">{finding.title}</span>
                          </div>
                          {finding.file_path && (
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-mono">
                              <span>{finding.file_path}</span>
                              {finding.start_line && (
                                <span className="text-primary-400">L{finding.start_line}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {finding.file_path && onOpenFile && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenFile(finding.file_path!, finding.start_line || 1);
                            }}
                            className="btn-icon-sm"
                            title="Inspect in Code Explorer"
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

                        {finding.evidence_snippet && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-300">Redacted Source Evidence</h4>
                            <pre className="text-[11px] bg-gray-950 p-2.5 rounded border border-gray-800 text-amber-300 font-mono mt-1 overflow-x-auto">
                              {finding.evidence_snippet}
                            </pre>
                          </div>
                        )}

                        {finding.recommendation && (
                          <div className="p-3 rounded bg-primary-950/20 border border-primary-800/30">
                            <h4 className="text-xs font-semibold text-primary-300 flex items-center gap-1.5">
                              <Zap size={14} /> Remediation & Hardening Recommendation
                            </h4>
                            <p className="text-xs text-primary-200/90 mt-1 leading-relaxed">{finding.recommendation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* SPOF & Reliability Bottlenecks Table */}
          {subTab === 'reliability' && hotspots.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Flame size={16} className="text-amber-400" />
                Architectural Bottlenecks & Single Points of Failure ({hotspots.length})
              </h3>
              <div className="quality-card overflow-hidden">
                <table className="quality-table">
                  <thead>
                    <tr>
                      <th>Module / File</th>
                      <th>Risk Level</th>
                      <th>In / Out Coupling</th>
                      <th>Issues Detected</th>
                      <th>Impact Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.map((h, idx) => (
                      <tr key={idx} className="hover:bg-gray-800/40">
                        <td className="font-mono text-xs font-semibold text-gray-200">
                          <button
                            onClick={() => onOpenFile && onOpenFile(h.file_path, 1)}
                            className="text-left text-primary-400 hover:underline flex items-center gap-1.5"
                          >
                            {h.file_path}
                            <ExternalLink size={11} />
                          </button>
                        </td>
                        <td>
                          {getSeverityBadge(h.risk_level)}
                        </td>
                        <td className="text-xs text-gray-300 font-mono">
                          {h.incoming_dependents} in / {h.outgoing_dependencies} out
                        </td>
                        <td>
                          <div className="flex flex-col gap-1">
                            {h.signals.map((sig, sIdx) => (
                              <span key={sIdx} className="text-[11px] text-gray-400">
                                • {sig}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          {onOpenImpact && (
                            <button
                              onClick={() => onOpenImpact(h.file_id || h.file_path, h.file_path)}
                              className="btn-secondary text-[11px] py-1 px-2 flex items-center gap-1"
                            >
                              <GitPullRequest size={12} /> Analyze Impact
                            </button>
                          )}
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

      {/* TAB 4: DEPENDENCIES */}
      {subTab === 'dependencies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Package size={16} className="text-primary-400" />
              Extracted Dependency Manifest Inventory
            </h3>
            <span className="text-xs text-gray-400">{dependencies.length} packages parsed</span>
          </div>

          <div className="quality-card overflow-hidden">
            <table className="quality-table">
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Version</th>
                  <th>Ecosystem</th>
                  <th>Manifest Source</th>
                  <th>Pinned</th>
                  <th>Vulnerability Status</th>
                </tr>
              </thead>
              <tbody>
                {dependencies.map((dep) => (
                  <tr key={dep.id} className="hover:bg-gray-800/40">
                    <td className="font-mono text-xs font-semibold text-gray-200">{dep.package_name}</td>
                    <td className="font-mono text-xs text-gray-300">{dep.version || '<unversioned>'}</td>
                    <td>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 font-mono">
                        {dep.ecosystem}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-gray-400">{dep.manifest_file}</td>
                    <td>
                      {dep.is_pinned ? (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Pinned
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                          <AlertTriangle size={12} /> Unpinned Range
                        </span>
                      )}
                    </td>
                    <td className="text-xs text-gray-400">{dep.risk_status}</td>
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
