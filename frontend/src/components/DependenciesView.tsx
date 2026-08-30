import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DependencySummary,
  DependencyIntelligence,
  DependencyImpact,
} from '../types';
import { api } from '../services/api';
import {
  Blocks,
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  FileCode,
  Package,
  Activity,
  AlertCircle,
  X,
} from 'lucide-react';

interface DependenciesViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string, name: string) => void;
}

type DepSubTab = 'overview' | 'inventory' | 'usage' | 'supply_chain';

export const DependenciesView: React.FC<DependenciesViewProps> = ({
  repositoryId,
  onOpenFile,
  onOpenImpact,
}) => {
  const [subTab, setSubTab] = useState<DepSubTab>('overview');
  const [summary, setSummary] = useState<DependencySummary | null>(null);
  const [dependencies, setDependencies] = useState<DependencyIntelligence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedCentrality, setSelectedCentrality] = useState<string>('ALL');
  const [selectedPinning, setSelectedPinning] = useState<string>('ALL');
  const [unusedOnly, setUnusedOnly] = useState<boolean>(false);
  const [undeclaredOnly, setUndeclaredOnly] = useState<boolean>(false);
  const [highImpactOnly, setHighImpactOnly] = useState<boolean>(false);

  // Impact Drawer
  const [selectedImpact, setSelectedImpact] = useState<DependencyImpact | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [sumRes, depRes] = await Promise.allSettled([
        api.getDependencySummary(repositoryId),
        api.getDependenciesIntelligence(repositoryId, { limit: 200 }),
      ]);

      if (sumRes.status === 'fulfilled') {
        setSummary(sumRes.value);
      } else {
        throw new Error('Failed to load dependency summary.');
      }

      if (depRes.status === 'fulfilled') {
        setDependencies(depRes.value);
      }
    } catch (err: any) {
      console.error('Error loading dependency intelligence:', err);
      setError(err.message || 'Failed to analyze repository dependencies.');
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered dependencies
  const filteredDependencies = useMemo(() => {
    return dependencies.filter((d) => {
      if (selectedEcosystem !== 'ALL' && d.ecosystem.toUpperCase() !== selectedEcosystem.toUpperCase()) {
        return false;
      }
      if (selectedType !== 'ALL' && d.dependency_type.toUpperCase() !== selectedType.toUpperCase()) {
        return false;
      }
      if (selectedCentrality !== 'ALL' && d.centrality.toUpperCase() !== selectedCentrality.toUpperCase()) {
        return false;
      }
      if (selectedPinning !== 'ALL' && d.pinning_status.toUpperCase() !== selectedPinning.toUpperCase()) {
        return false;
      }
      if (unusedOnly && !d.is_potentially_unused) return false;
      if (undeclaredOnly && !d.is_potentially_undeclared) return false;
      if (highImpactOnly && !d.is_high_impact) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = d.name.toLowerCase().includes(q);
        const inManifest = d.manifest_file.toLowerCase().includes(q);
        if (!inName && !inManifest) return false;
      }
      return true;
    });
  }, [
    dependencies,
    selectedEcosystem,
    selectedType,
    selectedCentrality,
    selectedPinning,
    unusedOnly,
    undeclaredOnly,
    highImpactOnly,
    searchQuery,
  ]);

  const openImpactDrawer = async (dependency: DependencyIntelligence) => {
    if (onOpenImpact) {
      onOpenImpact(dependency.id, dependency.name);
      return;
    }
    try {
      const imp = await api.getDependencyImpact(repositoryId, dependency.id);
      setSelectedImpact(imp);
    } catch (err) {
      console.error('Error loading dependency impact:', err);
    }
  };

  const getPinningBadge = (status: string) => {
    switch (status) {
      case 'PINNED':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 font-mono">PINNED</span>;
      case 'CONSTRAINED':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/40 font-mono">CONSTRAINED</span>;
      case 'UNCONSTRAINED':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono">UNPINNED</span>;
      default:
        return null;
    }
  };

  const getCentralityBadge = (centrality: string) => {
    switch (centrality) {
      case 'HIGH':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">HIGH</span>;
      case 'MEDIUM':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">MEDIUM</span>;
      case 'LOW':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">LOW</span>;
      case 'UNUSED':
        return <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">UNUSED</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="quality-loading-container">
        <RefreshCw className="spin-icon text-primary-400" size={32} />
        <h3 className="text-lg font-semibold text-gray-200 mt-4">Analyzing Supply-Chain & Dependencies...</h3>
        <p className="text-sm text-gray-400 mt-1">Extracting manifests, parsing lockfiles, mapping AST imports, and computing centrality</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="quality-error-container">
        <AlertCircle className="text-rose-400" size={36} />
        <h3 className="text-lg font-semibold text-gray-200 mt-3">Dependency Intelligence Unavailable</h3>
        <p className="text-sm text-gray-400 mt-1">{error || 'No dependency metadata could be retrieved.'}</p>
        <button onClick={loadData} className="btn-secondary mt-4">
          <RefreshCw size={14} /> Retry Dependency Audit
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
            <Blocks size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-gray-100">Dependency & Supply-Chain Intelligence</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-950 text-primary-300 border border-primary-800/40 font-mono">
                {summary.total_dependencies} packages
              </span>
              {summary.unpinned_dependencies > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-medium">
                  {summary.unpinned_dependencies} unpinned
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{summary.summary_text}</p>
          </div>
        </div>

        {/* Quick Metric Stats */}
        <div className="quality-quick-stats-grid">
          <div className="quick-stat-box">
            <span className="stat-label">Direct</span>
            <span className="stat-val text-primary-400 font-mono">{summary.direct_dependencies}</span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">Transitive</span>
            <span className="stat-val text-gray-300 font-mono">{summary.transitive_dependencies}</span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">High-Impact</span>
            <span className="stat-val text-purple-400 font-mono">{summary.high_impact_dependencies}</span>
          </div>
          <div className="quick-stat-box">
            <span className="stat-label">Potential Issues</span>
            <span className="stat-val text-amber-400 font-mono">
              {summary.potentially_unused_dependencies + summary.potentially_undeclared_dependencies}
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
          className={`quality-subtab-btn ${subTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setSubTab('inventory')}
        >
          <Package size={15} />
          <span>Inventory & Manifests ({dependencies.length})</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'usage' ? 'active' : ''}`}
          onClick={() => setSubTab('usage')}
        >
          <Layers size={15} />
          <span>Usage & Centrality Map</span>
        </button>
        <button
          className={`quality-subtab-btn ${subTab === 'supply_chain' ? 'active' : ''}`}
          onClick={() => setSubTab('supply_chain')}
        >
          <ShieldAlert size={15} />
          <span>Supply Chain & Risks</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Central Dependencies */}
            <div className="quality-card p-5">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Layers size={16} className="text-primary-400" />
                Top Central & Heavily-Used Dependencies
              </h3>
              <div className="space-y-2.5">
                {summary.top_central_dependencies.slice(0, 5).map((d) => (
                  <div key={d.id} className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-100">{d.name}</span>
                        {getCentralityBadge(d.centrality)}
                        {getPinningBadge(d.pinning_status)}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                        {d.ecosystem} • {d.declared_version || 'unversioned'} • Imported in {d.file_count} file(s)
                      </p>
                    </div>
                    <button
                      onClick={() => openImpactDrawer(d)}
                      className="btn-secondary text-[11px] py-1 px-2 flex items-center gap-1"
                    >
                      <GitPullRequest size={12} /> Impact
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* High Impact Packages */}
            <div className="quality-card p-5">
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-purple-400" />
                High-Impact Packages (Broad Change Surface)
              </h3>
              {summary.high_impact_list.length === 0 ? (
                <p className="text-xs text-gray-400">No high-impact packages detected across multiple architecture layers.</p>
              ) : (
                <div className="space-y-2.5">
                  {summary.high_impact_list.slice(0, 5).map((d) => (
                    <div key={d.id} className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary-400">{d.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                            {d.file_count} files
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Layers: {d.affected_architecture_nodes.join(', ') || 'Application Core'}
                        </p>
                      </div>
                      <button
                        onClick={() => openImpactDrawer(d)}
                        className="btn-secondary text-[11px] py-1 px-2 flex items-center gap-1"
                      >
                        <GitPullRequest size={12} /> Impact
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & MANIFESTS */}
      {subTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="findings-filter-bar flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                placeholder="Search package name or manifest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={selectedEcosystem}
                onChange={(e) => setSelectedEcosystem(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Ecosystems</option>
                <option value="PYPI">PyPI (Python)</option>
                <option value="NPM">npm (JS/TS)</option>
                <option value="GO">Go</option>
                <option value="MAVEN">Maven (Java)</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Types</option>
                <option value="DIRECT">Direct</option>
                <option value="DEV">Dev</option>
                <option value="TRANSITIVE">Transitive</option>
              </select>

              <select
                value={selectedPinning}
                onChange={(e) => setSelectedPinning(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Pinning</option>
                <option value="PINNED">Pinned</option>
                <option value="CONSTRAINED">Constrained</option>
                <option value="UNCONSTRAINED">Unpinned</option>
              </select>

              <select
                value={selectedCentrality}
                onChange={(e) => setSelectedCentrality(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
              >
                <option value="ALL">All Centrality</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="UNUSED">Unused</option>
              </select>

              <button
                onClick={() => setHighImpactOnly(!highImpactOnly)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                  highImpactOnly ? 'bg-purple-950 text-purple-300 border-purple-800 font-medium' : 'bg-gray-900 text-gray-300 border-gray-700'
                }`}
              >
                High Impact
              </button>

              <button
                onClick={() => setUnusedOnly(!unusedOnly)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                  unusedOnly ? 'bg-amber-950 text-amber-300 border-amber-800 font-medium' : 'bg-gray-900 text-gray-300 border-gray-700'
                }`}
              >
                Unused
              </button>

              <button
                onClick={() => setUndeclaredOnly(!undeclaredOnly)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                  undeclaredOnly ? 'bg-rose-950 text-rose-300 border-rose-800 font-medium' : 'bg-gray-900 text-gray-300 border-gray-700'
                }`}
              >
                Undeclared
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="quality-card overflow-hidden">
            <table className="quality-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Ecosystem</th>
                  <th>Declared</th>
                  <th>Resolved</th>
                  <th>Type</th>
                  <th>Centrality</th>
                  <th>Usage</th>
                  <th>Pinning</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDependencies.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-400 text-xs">
                      No dependencies match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredDependencies.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-800/40">
                      <td className="font-mono text-xs font-bold text-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span>{d.name}</span>
                          {d.is_potentially_undeclared && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                              Undeclared
                            </span>
                          )}
                          {d.is_potentially_unused && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-gray-800 text-gray-400 border border-gray-700">
                              Unused
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-xs text-gray-300 font-mono">{d.ecosystem}</td>
                      <td className="font-mono text-xs text-gray-300">{d.declared_version || '—'}</td>
                      <td className="font-mono text-xs text-emerald-400">{d.resolved_version || '—'}</td>
                      <td className="text-xs text-gray-400 font-mono">{d.dependency_type}</td>
                      <td>{getCentralityBadge(d.centrality)}</td>
                      <td className="font-mono text-xs text-gray-300">{d.file_count} files</td>
                      <td>{getPinningBadge(d.pinning_status)}</td>
                      <td>
                        <button
                          onClick={() => openImpactDrawer(d)}
                          className="btn-secondary text-[10px] py-0.5 px-2 flex items-center gap-1"
                          title="Analyze Impact Surface"
                        >
                          <GitPullRequest size={11} /> Impact
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USAGE & CENTRALITY MAP */}
      {subTab === 'usage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Layers size={16} className="text-primary-400" />
              Source Imports & Architecture Mapping
            </h3>
            <span className="text-xs text-gray-400">Showing packages with active source imports</span>
          </div>

          <div className="space-y-3">
            {dependencies
              .filter((d) => d.file_count > 0)
              .map((d) => (
                <div key={d.id} className="quality-card p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-sm text-primary-400">{d.name}</span>
                      {getCentralityBadge(d.centrality)}
                      <span className="text-xs text-gray-400 font-mono">
                        ({d.file_count} files, {d.symbol_count} symbols)
                      </span>
                    </div>
                    <button
                      onClick={() => openImpactDrawer(d)}
                      className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
                    >
                      <GitPullRequest size={12} /> Impact Analysis
                    </button>
                  </div>

                  {/* Importing Files List */}
                  <div className="space-y-1.5 pt-1">
                    {d.importing_files.map((imp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2 rounded bg-gray-950/70 border border-gray-800/80 font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <FileCode size={13} className="text-gray-500" />
                          <span className="text-gray-200">{imp.file_path}</span>
                          {imp.line_number && <span className="text-[10px] text-gray-500">:{imp.line_number}</span>}
                          <span className="text-gray-500 text-[11px]">({imp.import_statement})</span>
                        </div>
                        {onOpenFile && (
                          <button
                            onClick={() => onOpenFile(imp.file_path, imp.line_number || 1)}
                            className="text-primary-400 hover:underline text-[11px] flex items-center gap-1"
                          >
                            <ExternalLink size={11} /> Open
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPLY CHAIN & RISKS */}
      {subTab === 'supply_chain' && (
        <div className="space-y-6">
          {/* Unpinned Dependencies */}
          <div className="quality-card p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Unpinned Dependencies ({summary.unpinned_dependencies})
            </h3>
            {summary.unpinned_dependencies === 0 ? (
              <p className="text-xs text-gray-400">All direct dependencies declare exact or constrained version specifications.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dependencies
                  .filter((d) => d.pinning_status === 'UNCONSTRAINED' && !d.is_potentially_undeclared)
                  .map((d) => (
                    <div key={d.id} className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-gray-100">{d.name}</span>
                        {getPinningBadge(d.pinning_status)}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 font-mono">
                        Manifest: {d.manifest_file} • Declared: {d.declared_version || 'None'}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Potentially Undeclared Imports */}
          <div className="quality-card p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-400" />
              Potentially Undeclared Dependencies ({summary.potentially_undeclared_dependencies})
            </h3>
            {summary.potentially_undeclared_dependencies === 0 ? (
              <p className="text-xs text-gray-400">All imported packages have corresponding manifest declarations.</p>
            ) : (
              <div className="space-y-2.5">
                {dependencies
                  .filter((d) => d.is_potentially_undeclared)
                  .map((d) => (
                    <div key={d.id} className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-amber-300">{d.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                          Missing Manifest Entry
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Imported in {d.file_count} file(s): {d.importing_files.map((f) => f.file_path).join(', ')}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Potentially Unused Dependencies */}
          <div className="quality-card p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-gray-400" />
              Potentially Unused Dependencies ({summary.potentially_unused_dependencies})
            </h3>
            {summary.potentially_unused_dependencies === 0 ? (
              <p className="text-xs text-gray-400">No unused declared packages detected.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dependencies
                  .filter((d) => d.is_potentially_unused)
                  .map((d) => (
                    <div key={d.id} className="p-3 rounded-lg bg-gray-900/60 border border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-gray-300">{d.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                          0 source imports
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 font-mono">
                        {d.ecosystem} • {d.manifest_file} (may be used via CLI, plugin, or runtime dynamic loading)
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Impact Drawer Modal */}
      {selectedImpact && (
        <div className="modal-backdrop" onClick={() => setSelectedImpact(null)}>
          <div className="modal-content max-w-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GitPullRequest className="text-primary-400" size={20} />
                <h3 className="text-base font-bold text-gray-100">
                  Dependency Impact Surface: {selectedImpact.dependency_name}
                </h3>
              </div>
              <button onClick={() => setSelectedImpact(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-300 mb-4 leading-relaxed">{selectedImpact.explanation}</p>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 mb-1.5">
                  Affected Repository Files ({selectedImpact.total_affected_files})
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {selectedImpact.affected_files.map((f, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono p-1.5 rounded bg-gray-950/80 border border-gray-800 flex items-center justify-between"
                    >
                      <span className="text-gray-300">{f}</span>
                      {onOpenFile && (
                        <button
                          onClick={() => {
                            setSelectedImpact(null);
                            onOpenFile(f, 1);
                          }}
                          className="text-primary-400 hover:underline text-[11px]"
                        >
                          View
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedImpact.affected_symbols.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-1.5">
                    Imported Symbols ({selectedImpact.affected_symbols.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedImpact.affected_symbols.map((sym, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-gray-900 text-primary-300 border border-gray-700 font-mono"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedImpact(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
