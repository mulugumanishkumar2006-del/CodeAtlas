import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArchitectureData, 
  ArchitectureGroup, 
  ArchitectureModuleItem,
  GraphLevel, 
  GraphData, 
  GraphNodeItem,
  AdvancedArchitectureIntelligence,
} from '../types';
import { api } from '../services/api';
import { ImpactIntelligenceModal } from './ImpactIntelligenceModal';
import { 
  FolderTree, 
  FileCode2, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Activity, 
  Zap, 
  Layers, 
  Boxes, 
  Compass, 
  Cpu, 
  Flame, 
  ExternalLink, 
  ShieldCheck,
  Workflow,
  ArrowRight,
} from 'lucide-react';

interface ArchitectureViewProps {
  repositoryId: string;
  repositoryName?: string;
  onNavigateToFile?: (fileId: string, line?: number) => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  repositoryId,
  repositoryName = 'Repository',
  onNavigateToFile,
}) => {
  const [archData, setArchData] = useState<ArchitectureData | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [advIntel, setAdvIntel] = useState<AdvancedArchitectureIntelligence | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'graph' | 'dataflows' | 'coupling' | 'patterns' | 'issues'>('overview');
  
  const [level, setLevel] = useState<GraphLevel>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection states
  const [selectedGroup, setSelectedGroup] = useState<ArchitectureGroup | null>(null);
  const [selectedModule, setSelectedModule] = useState<ArchitectureModuleItem | null>(null);
  const [impactTargetId, setImpactTargetId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNodeItem | null>(null);
  
  // Canvas viewport transform
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Fetch real architecture, graph, and advanced intelligence data on repository change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setSelectedGroup(null);
    setSelectedModule(null);
    setSelectedNode(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });

    const loadData = async () => {
      try {
        const [archRes, graphRes, intelRes] = await Promise.all([
          api.getRepositoryArchitecture(repositoryId),
          api.getRepositoryGraph(repositoryId, 'file'),
          api.getArchitectureIntelligence(repositoryId).catch(() => null),
        ]);

        if (isMounted) {
          setArchData(archRes);
          setGraphData(graphRes);
          setAdvIntel(intelRes);
          if (archRes.modules && archRes.modules.length > 0) {
            setSelectedModule(archRes.modules[0]);
          }
          if (graphRes?.nodes && graphRes.nodes.length <= 5) {
            setLevel('file');
          } else {
            setLevel('directory');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load repository architecture.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [repositoryId]);

  // Graph interaction handlers
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * zoomFactor)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedGroup(null);
    setSelectedNode(null);
  };

  // Pre-calculate node and edge layouts for directory and file graphs
  const layout = useMemo(() => {
    if (!archData && !graphData) return { nodes: [], edges: [] };

    if (level === 'directory' && archData?.groups) {
      let filteredGroups = archData.groups;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredGroups = filteredGroups.filter(g => 
          g.name.toLowerCase().includes(q) || g.files.some(f => f.path.toLowerCase().includes(q))
        );
      }

      const nodePositions: Record<string, { x: number; y: number; width: number; height: number }> = {};
      const nodeWidth = 220;
      const nodeHeight = 90;
      const cols = Math.max(1, Math.min(4, Math.ceil(Math.sqrt(filteredGroups.length))));

      filteredGroups.forEach((g, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = 50 + col * (nodeWidth + 70);
        const y = 50 + row * (nodeHeight + 60);
        nodePositions[g.name] = { x, y, width: nodeWidth, height: nodeHeight };
      });

      const edges = (archData.relationships || [])
        .filter(r => nodePositions[r.source] && nodePositions[r.target])
        .map(r => {
          const srcPos = nodePositions[r.source];
          const tgtPos = nodePositions[r.target];
          const x1 = srcPos.x + srcPos.width;
          const y1 = srcPos.y + srcPos.height / 2;
          const x2 = tgtPos.x;
          const y2 = tgtPos.y + tgtPos.height / 2;
          return {
            ...r,
            x1, y1, x2, y2,
          };
        });

      return {
        nodes: filteredGroups.map(g => ({
          ...g,
          pos: nodePositions[g.name] || { x: 50, y: 50, width: nodeWidth, height: nodeHeight },
        })),
        edges,
      };
    } else if (level === 'file' && graphData?.nodes) {
      const cycleFilePaths = new Set(graphData.cycles ? graphData.cycles.flat() : []);
      let fileNodes = graphData.nodes;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        fileNodes = fileNodes.filter(n => n.label.toLowerCase().includes(q));
      }

      const nodePositions: Record<string, { x: number; y: number; width: number; height: number }> = {};
      const nodeWidth = 240;
      const nodeHeight = 85;
      const cols = Math.max(1, Math.min(4, Math.ceil(Math.sqrt(fileNodes.length))));

      fileNodes.forEach((n, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = 50 + col * (nodeWidth + 60);
        const y = 50 + row * (nodeHeight + 50);
        nodePositions[n.label] = { x, y, width: nodeWidth, height: nodeHeight };
      });

      const edges = (graphData.edges || [])
        .filter(e => nodePositions[e.source_label] && nodePositions[e.target_label])
        .map(e => {
          const srcPos = nodePositions[e.source_label];
          const tgtPos = nodePositions[e.target_label];
          const x1 = srcPos.x + srcPos.width;
          const y1 = srcPos.y + srcPos.height / 2;
          const x2 = tgtPos.x;
          const y2 = tgtPos.y + tgtPos.height / 2;
          const isCyclic = cycleFilePaths.has(e.source_label) && cycleFilePaths.has(e.target_label);
          return {
            ...e,
            x1, y1, x2, y2,
            isCyclic,
          };
        });

      return {
        nodes: fileNodes.map(n => ({
          ...n,
          pos: nodePositions[n.label] || { x: 50, y: 50, width: nodeWidth, height: nodeHeight },
          isCyclic: cycleFilePaths.has(n.label),
        })),
        edges,
      };
    }

    return { nodes: [], edges: [] };
  }, [archData, graphData, level, searchQuery]);

  const frameworks = archData?.frameworks || [];
  const entryPoints = archData?.entry_points || [];
  const patterns = archData?.patterns || [];
  const modules = archData?.modules || [];
  const hotspots = archData?.hotspots || [];
  const violations = archData?.violations || [];
  const drift = archData?.drift || [];
  const health = archData?.health;

  return (
    <div className="architecture-explorer-container">
      {/* Top Banner: Architecture Overview Bar */}
      <div className="arch-top-summary-bar">
        <div className="summary-col">
          <span className="summary-k">Languages</span>
          <div className="summary-langs">
            {archData?.language_percentages && Object.keys(archData.language_percentages).length > 0 ? (
              Object.entries(archData.language_percentages).slice(0, 3).map(([lang, pct]) => (
                <span key={lang} className="lang-pct-tag">
                  {lang} <strong>{pct}%</strong>
                </span>
              ))
            ) : (
              <span className="text-muted">None</span>
            )}
          </div>
        </div>

        <div className="summary-col">
          <span className="summary-k">Frameworks</span>
          <div className="summary-fws">
            {frameworks.length > 0 ? (
              frameworks.map(fw => (
                <span key={fw.name} className="fw-badge" title={fw.description || fw.name}>
                  {fw.name}
                </span>
              ))
            ) : (
              <span className="fw-badge muted">Custom / Core</span>
            )}
          </div>
        </div>

        <div className="summary-col stat-mini">
          <span className="summary-k">Modules</span>
          <span className="stat-v" style={{ color: 'var(--accent-cyan)' }}>{modules.length}</span>
        </div>

        <div className="summary-col stat-mini">
          <span className="summary-k">Entry Points</span>
          <span className="stat-v" style={{ color: '#fbbf24' }}>{entryPoints.length}</span>
        </div>

        <div className="summary-col stat-mini">
          <span className="summary-k">Data Flows</span>
          <span className="stat-v" style={{ color: 'var(--accent-cyan)' }}>{advIntel?.data_flows?.length || 0}</span>
        </div>

        <div className="summary-col stat-mini">
          <span className="summary-k">Violations</span>
          <span className="stat-v" style={{ color: (advIntel?.violations?.length || 0) > 0 ? '#f43f5e' : 'var(--accent-emerald)' }}>
            {advIntel?.violations?.length || 0}
          </span>
        </div>

        <div className="summary-col stat-mini">
          <span className="summary-k">Health</span>
          <span className="stat-v" style={{ color: (health?.score || 100) >= 80 ? 'var(--accent-emerald)' : '#f43f5e' }}>
            {health?.score !== undefined ? `${health.score}/100` : 'N/A'}
          </span>
        </div>
      </div>

      {/* 7-Tab Navigation Toolbar */}
      <div className="arch-nav-toolbar">
        <div className="arch-tabs-group">
          <button 
            id="tab-arch-overview"
            className={`arch-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Compass size={14} />
            <span>Overview</span>
          </button>
          <button 
            id="tab-arch-modules"
            className={`arch-nav-tab ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            <Boxes size={14} />
            <span>Modules ({modules.length})</span>
          </button>
          <button 
            id="tab-arch-graph"
            className={`arch-nav-tab ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            <FolderTree size={14} />
            <span>Graph</span>
          </button>
          <button 
            id="tab-arch-dataflows"
            className={`arch-nav-tab ${activeTab === 'dataflows' ? 'active' : ''}`}
            onClick={() => setActiveTab('dataflows')}
          >
            <Workflow size={14} />
            <span>Data Flows ({advIntel?.data_flows?.length || 0})</span>
          </button>
          <button 
            id="tab-arch-coupling"
            className={`arch-nav-tab ${activeTab === 'coupling' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupling')}
          >
            <Cpu size={14} />
            <span>Coupling ({advIntel?.coupling?.module_metrics?.length || 0})</span>
          </button>
          <button 
            id="tab-arch-patterns"
            className={`arch-nav-tab ${activeTab === 'patterns' ? 'active' : ''}`}
            onClick={() => setActiveTab('patterns')}
          >
            <Layers size={14} />
            <span>Patterns ({patterns.length})</span>
          </button>
          <button 
            id="tab-arch-issues"
            className={`arch-nav-tab ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            <AlertTriangle size={14} style={{ color: (violations.length + drift.length + (advIntel?.violations?.length || 0)) > 0 ? '#f43f5e' : undefined }} />
            <span>Issues & Drift ({violations.length + drift.length + (advIntel?.violations?.length || 0) + (archData?.cycles?.length || 0)})</span>
          </button>
        </div>

        {/* Level toggle & quick search for Graph tab */}
        {activeTab === 'graph' && (
          <div className="arch-graph-controls">
            <div className="segmented-control">
              <button
                className={`segment-btn ${level === 'directory' ? 'active' : ''}`}
                onClick={() => { setLevel('directory'); resetView(); }}
              >
                Module Level
              </button>
              <button
                className={`segment-btn ${level === 'file' ? 'active' : ''}`}
                onClick={() => { setLevel('file'); resetView(); }}
              >
                File Level
              </button>
            </div>

            <div className="search-box-mini">
              <Search size={12} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-mini"
              />
            </div>

            <button className="canvas-tool-btn" onClick={() => setZoom(z => Math.min(3, z + 0.2))} title="Zoom in">
              <ZoomIn size={13} />
            </button>
            <button className="canvas-tool-btn" onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} title="Zoom out">
              <ZoomOut size={13} />
            </button>
            <button className="canvas-tool-btn" onClick={resetView} title="Reset view">
              <Maximize2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Main View Body */}
      <div className="arch-body-container">
        {isLoading && (
          <div className="arch-loading-state">
            <Activity size={24} className="spin-animation" style={{ color: 'var(--accent-cyan)' }} />
            <span>Discovering structural architecture & framework dependencies...</span>
          </div>
        )}

        {error && (
          <div className="arch-error-state">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!isLoading && archData && (
          <>
            {/* TAB 1: OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="arch-tab-pane overview-pane">
                {/* Summary narrative card */}
                {archData.explanation && (
                  <div className="arch-narrative-card">
                    <div className="narrative-header">
                      <Compass size={16} style={{ color: 'var(--accent-cyan)' }} />
                      <h5>Architecture Discovery Summary</h5>
                    </div>
                    <p className="narrative-text">{archData.explanation}</p>
                  </div>
                )}

                <div className="overview-cards-grid">
                  {/* Card: Execution Entry Points */}
                  <div className="overview-panel-card">
                    <div className="card-top-head">
                      <Cpu size={15} style={{ color: 'var(--accent-cyan)' }} />
                      <h6>Execution Entry Points ({entryPoints.length})</h6>
                    </div>
                    <div className="card-scroll-list">
                      {entryPoints.length === 0 ? (
                        <div className="empty-note">No standard server/client entry points identified.</div>
                      ) : (
                        entryPoints.map((ep, idx) => (
                          <div key={idx} className="entry-point-row">
                            <div className="ep-info">
                              <div className="ep-file-row">
                                <FileCode2 size={13} style={{ color: 'var(--accent-cyan)' }} />
                                <span className="ep-path">{ep.file_path}</span>
                                <span className="ep-line">L{ep.line}</span>
                                <span className="confidence-pill">{ep.confidence}</span>
                              </div>
                              <p className="ep-reason">{ep.reason}</p>
                            </div>
                            {onNavigateToFile && (
                              <button
                                className="btn-jump-mini"
                                onClick={() => onNavigateToFile(ep.file_id || ep.file_path, ep.line)}
                                title="Jump to entry point in Code Explorer"
                              >
                                <ExternalLink size={12} />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card: Detected Frameworks & Tech Stack */}
                  <div className="overview-panel-card">
                    <div className="card-top-head">
                      <Zap size={15} style={{ color: 'var(--accent-indigo)' }} />
                      <h6>Detected Frameworks & Libraries ({frameworks.length})</h6>
                    </div>
                    <div className="card-scroll-list">
                      {frameworks.length === 0 ? (
                        <div className="empty-note">No external web/ORM frameworks detected in imports.</div>
                      ) : (
                        frameworks.map((fw, idx) => (
                          <div key={idx} className="framework-detail-row">
                            <div className="fw-title-row">
                              <span className="fw-name">{fw.name}</span>
                              <span className="fw-cat">{fw.category}</span>
                              <span className="confidence-pill">{fw.confidence}</span>
                            </div>
                            <p className="fw-desc">{fw.description}</p>
                            {fw.evidence_imports && fw.evidence_imports.length > 0 && (
                              <div className="fw-evidence-tags">
                                <span className="evidence-lbl">Evidence imports:</span>
                                {fw.evidence_imports.map((imp, i) => (
                                  <code key={i} className="evidence-code-tag">{imp}</code>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card: Architectural Patterns */}
                  <div className="overview-panel-card">
                    <div className="card-top-head">
                      <Layers size={15} style={{ color: 'var(--accent-emerald)' }} />
                      <h6>Architectural Patterns ({patterns.length})</h6>
                    </div>
                    <div className="card-scroll-list">
                      {patterns.length === 0 ? (
                        <div className="empty-note">No dominant structural pattern detected.</div>
                      ) : (
                        patterns.map((pat, idx) => (
                          <div key={idx} className="pattern-detail-row">
                            <div className="pat-header">
                              <span className="pat-name">{pat.pattern}</span>
                              <span className="confidence-pill">{pat.confidence}</span>
                            </div>
                            <p className="pat-desc">{pat.description}</p>
                            <ul className="pat-evidence-list">
                              {pat.evidence.map((ev, i) => (
                                <li key={i}>{ev}</li>
                              ))}
                            </ul>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card: Explainable Architecture Health */}
                  <div className="overview-panel-card">
                    <div className="card-top-head">
                      <ShieldCheck size={15} style={{ color: (health?.score || 100) >= 80 ? 'var(--accent-emerald)' : '#f43f5e' }} />
                      <h6>Architecture Health Score ({health?.score}/100)</h6>
                    </div>
                    <div className="card-scroll-list">
                      <div className="health-grade-box">
                        <span className="grade-letter" style={{ color: (health?.score || 100) >= 80 ? 'var(--accent-emerald)' : '#fbbf24' }}>
                          {health?.grade}
                        </span>
                        <div>
                          <span className="grade-label">{health?.status_label}</span>
                          <span className="grade-sub">{health?.metrics?.total_modules} modules, {health?.metrics?.total_dependencies} internal dependencies</span>
                        </div>
                      </div>

                      {health?.deductions && health.deductions.length > 0 && (
                        <div className="deductions-box">
                          <span className="deductions-title">Deduction Factors:</span>
                          {health.deductions.map((d, idx) => (
                            <div key={idx} className="deduction-row">
                              <span className="deduction-pts">-{d.deduction} pts</span>
                              <div className="deduction-desc">
                                <strong>{d.category}:</strong> {d.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MODULES TAB */}
            {activeTab === 'modules' && (
              <div className="arch-tab-pane modules-pane">
                <div className="modules-split-view">
                  {/* Modules Grid / Left Column */}
                  <div className="modules-grid-list">
                    {modules.map((m) => {
                      const isSelected = selectedModule?.id === m.id;
                      return (
                        <div 
                          key={m.id} 
                          className={`module-card ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedModule(m)}
                        >
                          <div className="module-card-head">
                            <span className="module-layer-pill">{m.layer}</span>
                            <span className="module-coupling-tag">
                              Coupling: In {m.incoming_dependencies} / Out {m.outgoing_dependencies}
                            </span>
                          </div>
                          <h5 className="module-title">{m.name}</h5>
                          <div className="module-stats-row">
                            <span>{m.file_count} files</span>
                            <span>•</span>
                            <span>{m.symbol_count} symbols</span>
                            <span>•</span>
                            <span>{m.line_count} LOC</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Module Detail Inspector */}
                  <div className="module-detail-inspector">
                    {selectedModule ? (
                      <div className="mod-inspector-content">
                        <div className="mod-insp-header">
                          <span className="module-layer-pill">{selectedModule.layer}</span>
                          <h4>{selectedModule.name}</h4>
                          <p className="mod-desc">{selectedModule.description}</p>
                        </div>

                        <div className="mod-stats-grid">
                          <div className="mod-stat-box">
                            <span className="k">Files</span>
                            <span className="v">{selectedModule.file_count}</span>
                          </div>
                          <div className="mod-stat-box">
                            <span className="k">Symbols</span>
                            <span className="v">{selectedModule.symbol_count}</span>
                          </div>
                          <div className="mod-stat-box">
                            <span className="k">Incoming Callers</span>
                            <span className="v">{selectedModule.incoming_dependencies}</span>
                          </div>
                          <div className="mod-stat-box">
                            <span className="k">Outgoing Dependencies</span>
                            <span className="v">{selectedModule.outgoing_dependencies}</span>
                          </div>
                        </div>

                        <div className="mod-files-section">
                          <h6>Module Files ({selectedModule.files.length})</h6>
                          <div className="mod-files-scroll">
                            {selectedModule.files.map((f, i) => (
                              <div 
                                key={i} 
                                className="mod-file-item"
                                onClick={() => {
                                  if (onNavigateToFile && f.id) {
                                    onNavigateToFile(f.id);
                                  }
                                }}
                              >
                                <FileCode2 size={14} style={{ color: 'var(--accent-cyan)' }} />
                                <span className="f-path">{f.path}</span>
                                <span className="f-meta">{f.line_count} lines • {f.symbol_count} symbols</span>
                                {onNavigateToFile && <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-module-placeholder">
                        <Boxes size={24} style={{ color: 'var(--text-muted)' }} />
                        <p>Select a module on the left to inspect files and dependencies.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GRAPH TAB */}
            {activeTab === 'graph' && (
              <div className="arch-tab-pane graph-pane">
                <div className="canvas-wrapper">
                  <svg
                    ref={canvasRef}
                    className="architecture-svg-canvas"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <defs>
                      <marker
                        id="arrowhead-arch"
                        markerWidth="8"
                        markerHeight="6"
                        refX="7"
                        refY="3"
                        orient="auto"
                      >
                        <polygon points="0 0, 8 3, 0 6" fill="var(--accent-cyan)" />
                      </marker>
                    </defs>

                    <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                      {/* Render Directed Edges */}
                      {layout.edges.map((edge: any) => (
                        <g key={edge.id || `${edge.source}-${edge.target}`} className="arch-edge-g">
                          <line
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            stroke={edge.isCyclic ? '#f43f5e' : 'rgba(56, 189, 248, 0.4)'}
                            strokeWidth={Math.min(4, Math.max(1.5, (edge.dependency_count || 1) * 0.8))}
                            markerEnd="url(#arrowhead-arch)"
                          />
                        </g>
                      ))}

                      {/* Render Directory / Module Nodes */}
                      {level === 'directory' && layout.nodes.map((node: any) => {
                        const isSelected = selectedGroup?.name === node.name;
                        return (
                          <g
                            key={node.id}
                            className={`arch-node-g ${isSelected ? 'selected' : ''}`}
                            transform={`translate(${node.pos.x}, ${node.pos.y})`}
                            onClick={() => {
                              setSelectedGroup(node);
                              setSelectedNode(null);
                            }}
                          >
                            <rect
                              width={node.pos.width}
                              height={node.pos.height}
                              rx="8"
                              fill="#1e293b"
                              stroke={isSelected ? 'var(--accent-cyan)' : 'var(--border-color)'}
                              strokeWidth={isSelected ? 2 : 1}
                            />
                            <text x="14" y="24" fill="var(--accent-cyan)" fontSize="12" fontWeight="700">
                              {node.name.length > 20 ? node.name.slice(0, 18) + '...' : node.name}
                            </text>
                            <text x="14" y="44" fill="var(--text-secondary)" fontSize="10">
                              {node.file_count} files • {node.line_count} LOC
                            </text>
                            <text x="14" y="62" fill="var(--text-muted)" fontSize="9">
                              In: {node.incoming_dependencies} | Out: {node.outgoing_dependencies}
                            </text>
                          </g>
                        );
                      })}

                      {/* Render File Nodes */}
                      {level === 'file' && layout.nodes.map((node: any) => {
                        const isSelected = selectedNode?.label === node.label;
                        return (
                          <g
                            key={node.id}
                            className={`arch-node-g ${isSelected ? 'selected' : ''}`}
                            transform={`translate(${node.pos.x}, ${node.pos.y})`}
                            onClick={() => {
                              setSelectedNode(node);
                              setSelectedGroup(null);
                            }}
                          >
                            <rect
                              width={node.pos.width}
                              height={node.pos.height}
                              rx="6"
                              fill="#0f172a"
                              stroke={isSelected ? 'var(--accent-cyan)' : (node.isCyclic ? '#f43f5e' : 'var(--border-subtle)')}
                              strokeWidth={isSelected ? 2 : 1}
                            />
                            <text x="12" y="22" fill="#f8fafc" fontSize="11" fontWeight="600">
                              {node.label.length > 24 ? '...' + node.label.slice(-22) : node.label}
                            </text>
                            <text x="12" y="40" fill="var(--text-muted)" fontSize="9">
                              {node.properties?.line_count || 0} lines • {node.properties?.symbol_count || 0} symbols
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>

                {/* Graph Inspector Sidebar */}
                <div className="arch-graph-inspector">
                  {selectedNode && (
                    <div className="inspector-panel-card">
                      <div className="inspector-header">
                        <FileCode2 size={16} style={{ color: 'var(--accent-cyan)' }} />
                        <span className="inspector-title">{selectedNode.label}</span>
                      </div>
                      <div className="inspector-meta-grid">
                        <div><span className="meta-label">Lines:</span> {selectedNode.properties?.line_count || 0}</div>
                        <div><span className="meta-label">Symbols:</span> {selectedNode.properties?.symbol_count || 0}</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                        <button
                          id="btn-arch-analyze-impact"
                          className="open-explorer-btn"
                          onClick={() => setImpactTargetId(selectedNode.file_id || selectedNode.label)}
                          style={{ width: '100%', background: 'rgba(244, 63, 94, 0.15)', borderColor: '#f43f5e', color: '#f43f5e' }}
                          title="Analyze blast radius and downstream callers of this file"
                        >
                          <Zap size={14} />
                          <span>Analyze Impact</span>
                        </button>

                        {selectedNode.file_id && onNavigateToFile && (
                          <button 
                            className="open-explorer-btn"
                            onClick={() => onNavigateToFile(selectedNode.file_id!)}
                            style={{ width: '100%' }}
                          >
                            <FileCode2 size={14} />
                            <span>Open in Code Explorer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedGroup && (
                    <div className="inspector-panel-card">
                      <div className="inspector-header">
                        <Boxes size={16} style={{ color: 'var(--accent-cyan)' }} />
                        <span className="inspector-title">{selectedGroup.name}</span>
                      </div>
                      <div className="inspector-meta-grid">
                        <div><span className="meta-label">Files:</span> {selectedGroup.file_count}</div>
                        <div><span className="meta-label">Lines:</span> {selectedGroup.line_count}</div>
                        <div><span className="meta-label">Incoming:</span> {selectedGroup.incoming_dependencies}</div>
                        <div><span className="meta-label">Outgoing:</span> {selectedGroup.outgoing_dependencies}</div>
                      </div>
                      <div className="inspector-subhead" style={{ marginTop: 12 }}>Files</div>
                      <div className="inspector-sublist">
                        {selectedGroup.files.slice(0, 8).map((f, idx) => (
                          <div 
                            key={idx} 
                            className="inspector-sublist-row"
                            onClick={() => onNavigateToFile?.(f.id || f.path)}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="sublist-name">{f.path}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!selectedNode && !selectedGroup && (
                    <div className="inspector-panel-card placeholder">
                      <Info size={18} style={{ color: 'var(--text-muted)' }} />
                      <p>Click any node or group on the canvas to inspect properties and connections.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: DATA FLOWS TAB (PHASE 18) */}
            {activeTab === 'dataflows' && (
              <div className="arch-tab-pane dataflows-pane" style={{ padding: '16px', overflowY: 'auto' }}>
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                    <Workflow size={18} style={{ color: 'var(--accent-cyan)' }} />
                    Traced Repository Data Flows
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>
                    Deterministic end-to-end execution paths traced from presentation entry points to backend datastores.
                  </p>
                </div>

                {(!advIntel?.data_flows || advIntel.data_flows.length === 0) ? (
                  <div className="empty-patterns-box" style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <Workflow size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
                    <h5>No High-Confidence Multi-Tier Data Flows Discovered</h5>
                    <p>Repository entry points either do not persist to database repositories or use dynamic dispatch.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {advIntel.data_flows.map((df, idx) => (
                      <div 
                        key={idx} 
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 8,
                          padding: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{df.entry_point}</span>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
                              Entry: {df.entry_file}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                            Target: {df.target_datastore}
                          </span>
                        </div>

                        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{df.description}</p>

                        {/* Step Sequence Breadcrumb */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                          {df.flow_steps.map((step, sIdx) => (
                            <React.Fragment key={sIdx}>
                              <div style={{
                                padding: '4px 10px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 6,
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}>
                                <span style={{ color: 'var(--text-primary)' }}>{step}</span>
                                {df.layer_sequence[sIdx] && (
                                  <span style={{ fontSize: 10, color: 'var(--text-muted)', opacity: 0.8 }}>({df.layer_sequence[sIdx]})</span>
                                )}
                              </div>
                              {sIdx < df.flow_steps.length - 1 && (
                                <ArrowRight size={12} style={{ color: 'var(--accent-cyan)' }} />
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        {onNavigateToFile && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                            <button
                              className="btn-jump-issue"
                              onClick={() => onNavigateToFile(df.entry_file, 1)}
                              style={{ fontSize: 11 }}
                            >
                              <ExternalLink size={12} />
                              <span>View Entry File</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: COUPLING & STABILITY MATRIX (PHASE 18) */}
            {activeTab === 'coupling' && (
              <div className="arch-tab-pane coupling-pane" style={{ padding: '16px', overflowY: 'auto' }}>
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                    <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
                    Module Coupling & Martin's Instability Metric
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>
                    Evaluates Afferent Coupling (Ca), Efferent Coupling (Ce), and Instability index I = Ce / (Ca + Ce). Values near 0 represent stable core packages; values near 1 represent volatile modules prone to change propagation.
                  </p>
                </div>

                {/* Hubs and Isolated Modules Highlights */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 16 }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Architectural Hubs</span>
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {advIntel?.coupling?.architectural_hubs && advIntel.coupling.architectural_hubs.length > 0 ? (
                        advIntel.coupling.architectural_hubs.map((hub, hIdx) => (
                          <span key={hIdx} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                            {hub.module} (coupling: {hub.total_coupling})
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No high-centrality architectural hubs detected</span>
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Isolated / Orphan Modules</span>
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {advIntel?.coupling?.isolated_modules && advIntel.coupling.isolated_modules.length > 0 ? (
                        advIntel.coupling.isolated_modules.map((mod, mIdx) => (
                          <span key={mIdx} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
                            {mod}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>All discovered modules have active dependencies</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coupling Metrics Table */}
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.04)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '8px 12px' }}>Module</th>
                        <th style={{ padding: '8px 12px' }}>Afferent (Ca)</th>
                        <th style={{ padding: '8px 12px' }}>Efferent (Ce)</th>
                        <th style={{ padding: '8px 12px' }}>Instability (I)</th>
                        <th style={{ padding: '8px 12px' }}>Classification</th>
                        <th style={{ padding: '8px 12px' }}>Total Coupling</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advIntel?.coupling?.module_metrics && advIntel.coupling.module_metrics.length > 0 ? (
                        advIntel.coupling.module_metrics.map((m, mIdx) => {
                          const badgeColor = m.classification.includes('Stable') 
                            ? 'var(--accent-emerald)' 
                            : m.classification.includes('Volatile') 
                              ? '#fbbf24' 
                              : 'var(--accent-cyan)';
                          return (
                            <tr key={mIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                              <td style={{ padding: '8px 12px', fontWeight: 500, color: 'var(--text-primary)' }}>{m.module}</td>
                              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{m.afferent_coupling_ca}</td>
                              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{m.efferent_coupling_ce}</td>
                              <td style={{ padding: '8px 12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ width: 45, height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.round(m.instability * 100)}%`, height: '100%', background: badgeColor }} />
                                  </div>
                                  <span>{m.instability.toFixed(2)}</span>
                                </div>
                              </td>
                              <td style={{ padding: '8px 12px' }}>
                                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `rgba(255,255,255,0.06)`, color: badgeColor }}>
                                  {m.classification}
                                </span>
                              </td>
                              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{m.total_coupling}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No module coupling metrics available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: PATTERNS TAB */}
            {activeTab === 'patterns' && (
              <div className="arch-tab-pane patterns-pane">
                <div className="patterns-container">
                  {patterns.length === 0 ? (
                    <div className="empty-patterns-box">
                      <Layers size={32} style={{ color: 'var(--text-muted)' }} />
                      <h5>No Strong Architectural Pattern Detected</h5>
                      <p>The repository follows a standard modular organization without a strict layered or MVC design pattern.</p>
                    </div>
                  ) : (
                    patterns.map((pat, idx) => (
                      <div key={idx} className="full-pattern-card">
                        <div className="full-pat-top">
                          <div className="pat-title-block">
                            <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
                            <h4>{pat.pattern}</h4>
                          </div>
                          <span className="confidence-tag">{pat.confidence} CONFIDENCE</span>
                        </div>
                        <p className="full-pat-desc">{pat.description}</p>
                        <div className="pat-evidence-box">
                          <span className="ev-title">Structural Evidence:</span>
                          <ul>
                            {pat.evidence.map((ev, i) => (
                              <li key={i}>{ev}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: ISSUES & DRIFT TAB */}
            {activeTab === 'issues' && (
              <div className="arch-tab-pane issues-pane">
                <div className="issues-split-grid">
                  {/* Left Column: Violations & Drift */}
                  <div className="issues-col">
                    <div className="issues-header-row">
                      <AlertTriangle size={16} style={{ color: '#f43f5e' }} />
                      <h5>Architectural Violations & Drift ({violations.length + drift.length})</h5>
                    </div>

                    {violations.length === 0 && drift.length === 0 ? (
                      <div className="clean-issues-box">
                        <CheckCircle2 size={24} style={{ color: 'var(--accent-emerald)' }} />
                        <span>No layer violations or service bypass drift detected.</span>
                      </div>
                    ) : (
                      <div className="issues-list-scroll">
                        {violations.map((v, i) => (
                          <div key={i} className="issue-item-card violation">
                            <div className="issue-card-head">
                              <span className="issue-severity-tag high">{v.severity}</span>
                              <span className="issue-title">{v.title}</span>
                            </div>
                            <p className="issue-desc">{v.description}</p>
                            {v.evidence_file && onNavigateToFile && (
                              <button
                                className="btn-jump-issue"
                                onClick={() => onNavigateToFile(v.evidence_file!, v.evidence_line || undefined)}
                              >
                                <ExternalLink size={12} />
                                <span>{v.evidence_file}:{v.evidence_line || 1}</span>
                              </button>
                            )}
                          </div>
                        ))}

                        {drift.map((d, i) => (
                          <div key={i} className="issue-item-card drift">
                            <div className="issue-card-head">
                              <span className="issue-severity-tag med">{d.severity}</span>
                              <span className="issue-title">{d.title}</span>
                            </div>
                            <p className="issue-desc">{d.description}</p>
                            {d.evidence_file && onNavigateToFile && (
                              <button
                                className="btn-jump-issue"
                                onClick={() => onNavigateToFile(d.evidence_file!, d.evidence_line || undefined)}
                              >
                                <ExternalLink size={12} />
                                <span>{d.evidence_file}:{d.evidence_line || 1}</span>
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Phase 18 Architectural Violations (Service Bypass, Layer Inversion, Test Pollution) */}
                        {advIntel?.violations?.map((v, i) => (
                          <div key={`adv-viol-${i}`} className="issue-item-card violation" style={{ borderLeft: '3px solid #f43f5e' }}>
                            <div className="issue-card-head">
                              <span className="issue-severity-tag high">{v.severity}</span>
                              <span className="issue-title">[{v.violation_type}] {v.title}</span>
                            </div>
                            <p className="issue-desc">{v.description}</p>
                            {v.remediation && (
                              <div style={{ fontSize: 11, color: 'var(--accent-cyan)', marginTop: 4, background: 'rgba(56, 189, 248, 0.08)', padding: '4px 8px', borderRadius: 4 }}>
                                💡 Remediation: {v.remediation}
                              </div>
                            )}
                            {v.source_file && onNavigateToFile && (
                              <button
                                className="btn-jump-issue"
                                onClick={() => onNavigateToFile(v.source_file, v.line || 1)}
                                style={{ marginTop: 6 }}
                              >
                                <ExternalLink size={12} />
                                <span>{v.source_file}:{v.line || 1}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Hotspots & Cycles */}
                  <div className="issues-col">
                    <div className="issues-header-row">
                      <Flame size={16} style={{ color: '#fbbf24' }} />
                      <h5>Coupling Hotspots ({hotspots.length})</h5>
                    </div>

                    <div className="issues-list-scroll">
                      {hotspots.length === 0 ? (
                        <div className="clean-issues-box">
                          <CheckCircle2 size={24} style={{ color: 'var(--accent-emerald)' }} />
                          <span>No high-coupling hotspot bottlenecks detected.</span>
                        </div>
                      ) : (
                        hotspots.map((h, i) => (
                          <div key={i} className="hotspot-item-card">
                            <div className="hotspot-head">
                              <span className="hotspot-path">{h.file_path}</span>
                              <span className="hotspot-score-tag">Score: {h.hotspot_score}</span>
                            </div>
                            <div className="hotspot-metrics">
                              <span>In: {h.incoming_count}</span>
                              <span>•</span>
                              <span>Out: {h.outgoing_count}</span>
                              <span>•</span>
                              <span>{h.symbol_count} symbols</span>
                            </div>
                            <ul className="hotspot-reasons">
                              {h.reasons.map((r, ri) => (
                                <li key={ri}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        ))
                      )}

                      {/* Tarjan SCC Circular Dependencies */}
                      {advIntel?.cycles?.cycles && advIntel.cycles.cycles.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <div className="issues-header-row">
                            <AlertTriangle size={16} style={{ color: '#f43f5e' }} />
                            <h5>Tarjan Circular Dependency Cycles ({advIntel.cycles.cycles.length})</h5>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                            {advIntel.cycles.cycles.map((cyc, cIdx) => (
                              <div key={cIdx} style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: 6, padding: 10 }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#f43f5e' }}>Cycle #{cIdx + 1} ({cyc.length} files):</span>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, wordBreak: 'break-all' }}>
                                  {cyc.join(' ➔ ')} ➔ {cyc[0]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Phase 10 Impact Intelligence Modal */}
      <ImpactIntelligenceModal
        isOpen={!!impactTargetId}
        onClose={() => setImpactTargetId(null)}
        repositoryId={repositoryId}
        repositoryName={repositoryName}
        targetId={impactTargetId}
        onNavigateToSource={(p, l) => onNavigateToFile?.(p, l)}
      />
    </div>
  );
};
