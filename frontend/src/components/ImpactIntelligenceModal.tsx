import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  Zap, 
  Network, 
  FileCode, 
  AlertTriangle, 
  Loader2, 
  ExternalLink,
  Info,
  PhoneCall,
  PhoneOutgoing,
  Globe,
  FlaskConical,
  Layers,
  FileCheck,
  AlertOctagon,
  Code2
} from 'lucide-react';
import { ImpactAnalysisResponse, ImpactNodeItem } from '../types';
import { api } from '../services/api';

interface ImpactIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  repositoryId: string;
  repositoryName: string;
  targetId: string | null;
  onNavigateToSource?: (filePathOrId: string, line?: number) => void;
}

export const ImpactIntelligenceModal: React.FC<ImpactIntelligenceModalProps> = ({
  isOpen,
  onClose,
  repositoryId,
  repositoryName,
  targetId,
  onNavigateToSource,
}) => {
  const [data, setData] = useState<ImpactAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [direction, setDirection] = useState<'both' | 'downstream' | 'upstream'>('both');
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'callers' | 'affected' | 'boundaries' | 'evidence'>('overview');
  const [affectedSubTab, setAffectedSubTab] = useState<'apis' | 'tests' | 'files' | 'modules' | 'dependencies'>('apis');
  const [selectedNode, setSelectedNode] = useState<ImpactNodeItem | null>(null);

  useEffect(() => {
    if (!isOpen || !targetId) return;

    let isMounted = true;
    const fetchImpact = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setSelectedNode(null);

        const res = await api.getImpactAnalysis(
          repositoryId,
          targetId,
          direction,
          maxDepth,
          500
        );

        if (isMounted) {
          setData(res);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error fetching impact analysis:', err);
          setError(err.message || 'Failed to calculate impact analysis.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImpact();
    return () => {
      isMounted = false;
    };
  }, [isOpen, repositoryId, targetId, direction, maxDepth]);

  if (!isOpen || !targetId) return null;

  const target = data?.target;
  const metrics = data?.impact;

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'HIGH':
        return '#f43f5e';
      case 'MEDIUM':
        return '#fbbf24';
      default:
        return '#34d399';
    }
  };

  const getRiskBg = (risk?: string) => {
    switch (risk) {
      case 'HIGH':
        return 'rgba(244, 63, 94, 0.15)';
      case 'MEDIUM':
        return 'rgba(251, 191, 36, 0.15)';
      default:
        return 'rgba(52, 211, 153, 0.15)';
    }
  };

  return (
    <div className="impact-modal-overlay" onClick={onClose}>
      <div className="impact-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="impact-modal-header">
          <div className="impact-header-left">
            <div className="impact-icon-badge">
              <Zap size={18} />
            </div>
            <div>
              <div className="impact-header-title-row">
                <h3 className="impact-modal-title">Phase 19 Impact Analysis</h3>
                <span className="impact-repo-tag">{repositoryName}</span>
              </div>
              <p className="impact-modal-subtitle">
                Deterministic 12-dimension blast radius, call hierarchy, and architectural boundary analysis
              </p>
            </div>
          </div>

          <button className="impact-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="impact-toolbar">
          <div className="impact-filter-group">
            <span className="impact-filter-label">Traversal Direction:</span>
            <div className="impact-btn-toggle-group">
              <button
                className={`toggle-btn ${direction === 'both' ? 'active' : ''}`}
                onClick={() => setDirection('both')}
              >
                Bidirectional
              </button>
              <button
                className={`toggle-btn ${direction === 'downstream' ? 'active' : ''}`}
                onClick={() => setDirection('downstream')}
              >
                Downstream Impact
              </button>
              <button
                className={`toggle-btn ${direction === 'upstream' ? 'active' : ''}`}
                onClick={() => setDirection('upstream')}
              >
                Upstream Deps
              </button>
            </div>
          </div>

          <div className="impact-filter-group">
            <span className="impact-filter-label">Max Depth:</span>
            <div className="impact-btn-toggle-group">
              {[1, 2, 3, 5].map((d) => (
                <button
                  key={d}
                  className={`toggle-btn ${maxDepth === d ? 'active' : ''}`}
                  onClick={() => setMaxDepth(d)}
                >
                  {d} {d === 1 ? 'Hop' : 'Hops'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="impact-modal-body">
          {isLoading && (
            <div className="impact-loading-box">
              <Loader2 size={32} className="spin-animate" />
              <p>Calculating 12-dimension blast radius & call hierarchy...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="impact-error-box">
              <AlertTriangle size={24} style={{ color: '#f43f5e' }} />
              <div>
                <h4>Impact Analysis Failed</h4>
                <p>{error}</p>
              </div>
            </div>
          )}

          {data && !isLoading && (
            <div className="impact-content-grid">
              {/* Target Entity Card */}
              <div className="impact-target-card">
                <div className="target-header-row">
                  <div className="target-title-block">
                    <span className="target-type-pill">{target?.target_type}</span>
                    <h4 className="target-entity-name">{target?.name}</h4>
                  </div>
                  {metrics && (
                    <div 
                      className="target-risk-badge"
                      style={{ 
                        color: getRiskColor(metrics.risk),
                        background: getRiskBg(metrics.risk),
                        borderColor: getRiskColor(metrics.risk),
                      }}
                    >
                      {metrics.risk === 'HIGH' && <ShieldAlert size={14} />}
                      {metrics.risk === 'MEDIUM' && <Shield size={14} />}
                      {metrics.risk === 'LOW' && <ShieldCheck size={14} />}
                      <span>{metrics.risk} RISK (Score: {metrics.risk_score})</span>
                    </div>
                  )}
                </div>

                {target?.file_path && (
                  <div className="target-location-row">
                    <FileCode size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <span className="target-file-path">{target.file_path}</span>
                    {target.start_line && (
                      <span className="target-line-tag">Lines {target.start_line}–{target.end_line || target.start_line}</span>
                    )}
                    {onNavigateToSource && (
                      <button 
                        className="btn-jump-code"
                        onClick={() => {
                          onNavigateToSource(target.file_path!, target.start_line || undefined);
                          onClose();
                        }}
                        title="Jump to code location"
                      >
                        <ExternalLink size={12} />
                        <span>View Source</span>
                      </button>
                    )}
                  </div>
                )}

                {/* 12-Dimension Quick Metrics Grid */}
                {metrics && (
                  <div className="blast-radius-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                    <div className="blast-card">
                      <span className="blast-label">Direct Dependents</span>
                      <span className="blast-value" style={{ color: metrics.direct_dependents > 3 ? '#f43f5e' : 'var(--accent-cyan)' }}>
                        {metrics.direct_dependents}
                      </span>
                    </div>
                    <div className="blast-card">
                      <span className="blast-label">Indirect Dependents</span>
                      <span className="blast-value" style={{ color: 'var(--accent-indigo)' }}>
                        {metrics.indirect_dependents}
                      </span>
                    </div>
                    <div className="blast-card">
                      <span className="blast-label">Incoming Callers</span>
                      <span className="blast-value" style={{ color: '#38bdf8' }}>
                        {data.callers?.length || 0}
                      </span>
                    </div>
                    <div className="blast-card">
                      <span className="blast-label">Affected APIs</span>
                      <span className="blast-value" style={{ color: (data.affected_apis?.length || 0) > 0 ? '#fbbf24' : 'var(--text-muted)' }}>
                        {data.affected_apis?.length || 0}
                      </span>
                    </div>
                    <div className="blast-card">
                      <span className="blast-label">Affected Tests</span>
                      <span className="blast-value" style={{ color: (data.affected_tests?.length || 0) > 0 ? '#34d399' : '#f43f5e' }}>
                        {data.affected_tests?.length || 0}
                      </span>
                    </div>
                    <div className="blast-card">
                      <span className="blast-label">Boundaries Crossed</span>
                      <span className="blast-value" style={{ color: (data.boundaries_crossed?.length || 0) > 0 ? '#fb7185' : 'var(--text-muted)' }}>
                        {data.boundaries_crossed?.length || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* View Navigation Tabs */}
              <div className="impact-view-tabs">
                <button
                  className={`impact-view-tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <Info size={14} />
                  <span>Overview & Narrative</span>
                </button>
                <button
                  className={`impact-view-tab ${activeTab === 'graph' ? 'active' : ''}`}
                  onClick={() => setActiveTab('graph')}
                >
                  <Network size={14} />
                  <span>Impact Graph ({data.nodes.length})</span>
                </button>
                <button
                  className={`impact-view-tab ${activeTab === 'callers' ? 'active' : ''}`}
                  onClick={() => setActiveTab('callers')}
                >
                  <PhoneCall size={14} />
                  <span>Call Hierarchy ({data.callers?.length || 0} callers)</span>
                </button>
                <button
                  className={`impact-view-tab ${activeTab === 'affected' ? 'active' : ''}`}
                  onClick={() => setActiveTab('affected')}
                >
                  <Globe size={14} />
                  <span>Affected Entities ({data.affected_files?.length || 0} files)</span>
                </button>
                <button
                  className={`impact-view-tab ${activeTab === 'boundaries' ? 'active' : ''}`}
                  onClick={() => setActiveTab('boundaries')}
                >
                  <Layers size={14} />
                  <span>Architecture Boundaries ({data.boundaries_crossed?.length || 0})</span>
                </button>
                <button
                  className={`impact-view-tab ${activeTab === 'evidence' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evidence')}
                >
                  <FileCheck size={14} />
                  <span>Evidence & Uncertainty ({data.evidence?.length || 0})</span>
                </button>
              </div>

              {/* TAB 1: OVERVIEW & NARRATIVE EXPLANATION */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* AI Explanation Box */}
                  {data.explanation && (
                    <div className="risk-reasons-box" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-light)', padding: 16 }}>
                      <div className="reasons-header" style={{ marginBottom: 12, color: 'var(--accent-cyan)' }}>
                        <Zap size={14} />
                        <span style={{ fontWeight: 600 }}>Phase 19 Comprehensive Assessment</span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line', color: 'var(--text-secondary)' }}>
                        {data.explanation}
                      </div>
                    </div>
                  )}

                  {/* Cycle Warning */}
                  {data.cycles && data.cycles.length > 0 && (
                    <div className="cycle-alert-box">
                      <AlertTriangle size={14} />
                      <div>
                        <strong>Circular Dependency Detected:</strong> {data.cycles[0].join(' → ')}
                      </div>
                    </div>
                  )}

                  {/* Uncertainty Warnings */}
                  {data.uncertainty && data.uncertainty.length > 0 && (
                    <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 6, padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fbbf24', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                        <AlertOctagon size={14} />
                        <span>Static Analysis Uncertainty Factors ({data.uncertainty.length})</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)' }}>
                        {data.uncertainty.map((u, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            <strong style={{ color: u.severity === 'HIGH' ? '#f43f5e' : '#fbbf24' }}>[{u.category}]</strong> {u.description}
                            {u.file_path && <span style={{ color: 'var(--text-muted)' }}> — {u.file_path}:{u.line_number}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: INTERACTIVE GRAPH VIEW */}
              {activeTab === 'graph' && (
                <div className="impact-graph-pane">
                  <div className="impact-svg-container">
                    <svg className="impact-svg-canvas" viewBox="0 0 800 320">
                      <defs>
                        <marker
                          id="arrowhead-impact"
                          markerWidth="8"
                          markerHeight="6"
                          refX="7"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 8 3, 0 6" fill="var(--accent-cyan)" />
                        </marker>
                      </defs>

                      {/* Render Nodes in layers by depth */}
                      {(() => {
                        const targetNode = data.nodes.find(n => n.direction === 'target') || data.nodes[0];
                        const downNodes = data.nodes.filter(n => n.direction === 'downstream' || n.direction === 'both');
                        const upNodes = data.nodes.filter(n => n.direction === 'upstream');

                        const targetX = 400;
                        const targetY = 160;

                        return (
                          <g>
                            {/* Downstream Links */}
                            {downNodes.map((n, i) => {
                              const x = targetX + 180 + ((n.depth - 1) * 110);
                              const y = 60 + ((i % 5) * 50);
                              return (
                                <g key={`edge-down-${n.id}`}>
                                  <line
                                    x1={targetX + 60}
                                    y1={targetY}
                                    x2={x - 60}
                                    y2={y}
                                    stroke="rgba(244, 63, 94, 0.4)"
                                    strokeWidth={2}
                                    markerEnd="url(#arrowhead-impact)"
                                  />
                                </g>
                              );
                            })}

                            {/* Upstream Links */}
                            {upNodes.map((n, i) => {
                              const x = targetX - 180 - ((n.depth - 1) * 110);
                              const y = 60 + ((i % 5) * 50);
                              return (
                                <g key={`edge-up-${n.id}`}>
                                  <line
                                    x1={x + 60}
                                    y1={y}
                                    x2={targetX - 60}
                                    y2={targetY}
                                    stroke="rgba(52, 211, 153, 0.4)"
                                    strokeWidth={2}
                                    markerEnd="url(#arrowhead-impact)"
                                  />
                                </g>
                              );
                            })}

                            {/* Center Target Node */}
                            {targetNode && (
                              <g 
                                className="svg-node target-node"
                                transform={`translate(${targetX}, ${targetY})`}
                                onClick={() => setSelectedNode(targetNode)}
                              >
                                <rect
                                  x="-70"
                                  y="-24"
                                  width="140"
                                  height="48"
                                  rx="8"
                                  fill="rgba(56, 189, 248, 0.2)"
                                  stroke="var(--accent-cyan)"
                                  strokeWidth={2}
                                />
                                <text
                                  x="0"
                                  y="4"
                                  textAnchor="middle"
                                  fill="var(--text-primary)"
                                  fontSize="12"
                                  fontWeight="600"
                                >
                                  {targetNode.label.length > 18 ? targetNode.label.slice(0, 16) + '…' : targetNode.label}
                                </text>
                              </g>
                            )}

                            {/* Downstream Nodes */}
                            {downNodes.map((n, i) => {
                              const x = targetX + 180 + ((n.depth - 1) * 110);
                              const y = 60 + ((i % 5) * 50);
                              return (
                                <g
                                  key={`node-down-${n.id}`}
                                  className="svg-node dependent-node"
                                  transform={`translate(${x}, ${y})`}
                                  onClick={() => setSelectedNode(n)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <rect
                                    x="-55"
                                    y="-18"
                                    width="110"
                                    height="36"
                                    rx="6"
                                    fill="rgba(244, 63, 94, 0.15)"
                                    stroke="#f43f5e"
                                    strokeWidth={1}
                                  />
                                  <text
                                    x="0"
                                    y="4"
                                    textAnchor="middle"
                                    fill="var(--text-primary)"
                                    fontSize="11"
                                  >
                                    {n.label.length > 14 ? n.label.slice(0, 12) + '…' : n.label}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Upstream Nodes */}
                            {upNodes.map((n, i) => {
                              const x = targetX - 180 - ((n.depth - 1) * 110);
                              const y = 60 + ((i % 5) * 50);
                              return (
                                <g
                                  key={`node-up-${n.id}`}
                                  className="svg-node dependency-node"
                                  transform={`translate(${x}, ${y})`}
                                  onClick={() => setSelectedNode(n)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <rect
                                    x="-55"
                                    y="-18"
                                    width="110"
                                    height="36"
                                    rx="6"
                                    fill="rgba(52, 211, 153, 0.15)"
                                    stroke="#34d399"
                                    strokeWidth={1}
                                  />
                                  <text
                                    x="0"
                                    y="4"
                                    textAnchor="middle"
                                    fill="var(--text-primary)"
                                    fontSize="11"
                                  >
                                    {n.label.length > 14 ? n.label.slice(0, 12) + '…' : n.label}
                                  </text>
                                </g>
                              );
                            })}
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Node Inspector Drawer */}
                  {selectedNode && (
                    <div className="impact-inspector-drawer">
                      <div className="inspector-header">
                        <span className="inspector-badge">{selectedNode.direction}</span>
                        <h4>{selectedNode.label}</h4>
                        <button onClick={() => setSelectedNode(null)} className="btn-close-mini">×</button>
                      </div>
                      <div className="inspector-body">
                        <div className="inspector-prop">
                          <span className="prop-key">Path:</span>
                          <span className="prop-val">{selectedNode.file_path || 'N/A'}</span>
                        </div>
                        <div className="inspector-prop">
                          <span className="prop-key">Depth:</span>
                          <span className="prop-val">{selectedNode.depth} hops</span>
                        </div>
                        {selectedNode.file_path && onNavigateToSource && (
                          <button
                            className="btn-jump-code"
                            style={{ marginTop: 10 }}
                            onClick={() => {
                              onNavigateToSource(selectedNode.file_path!, selectedNode.start_line || undefined);
                              onClose();
                            }}
                          >
                            <ExternalLink size={12} />
                            <span>Jump to File</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CALL HIERARCHY (CALLERS & CALLEES) */}
              {activeTab === 'callers' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Incoming Callers */}
                  <div className="impact-list-pane" style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--accent-cyan)' }}>
                      <PhoneCall size={16} />
                      <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Incoming Callers ({data.callers?.length || 0})</h4>
                    </div>
                    {(!data.callers || data.callers.length === 0) ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 16, textAlign: 'center' }}>
                        No direct static callers detected.
                      </div>
                    ) : (
                      <div className="impact-items-scroll">
                        {data.callers.map((c, idx) => (
                          <div 
                            key={idx} 
                            className="impact-item-row"
                            onClick={() => {
                              if (c.file_path && onNavigateToSource) {
                                onNavigateToSource(c.file_path, c.line_number || undefined);
                                onClose();
                              }
                            }}
                          >
                            <Code2 size={13} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.file_path}:{c.line_number}</div>
                              {c.call_expression && (
                                <code style={{ fontSize: 10, background: 'rgba(255, 255, 255, 0.05)', padding: '2px 4px', borderRadius: 3, display: 'inline-block', marginTop: 3 }}>
                                  {c.call_expression}
                                </code>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Outgoing Callees */}
                  <div className="impact-list-pane" style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#38bdf8' }}>
                      <PhoneOutgoing size={16} />
                      <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Outgoing Calls ({data.callees?.length || 0})</h4>
                    </div>
                    {(!data.callees || data.callees.length === 0) ? (
                      <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 16, textAlign: 'center' }}>
                        No outgoing calls detected from target.
                      </div>
                    ) : (
                      <div className="impact-items-scroll">
                        {data.callees.map((c, idx) => (
                          <div key={idx} className="impact-item-row">
                            <Code2 size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}()</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Line {c.line_number}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: AFFECTED ENTITIES */}
              {activeTab === 'affected' && (
                <div>
                  <div className="impact-view-tabs" style={{ marginBottom: 12, borderBottom: '1px solid var(--border-light)' }}>
                    <button
                      className={`impact-view-tab ${affectedSubTab === 'apis' ? 'active' : ''}`}
                      onClick={() => setAffectedSubTab('apis')}
                    >
                      <Globe size={13} />
                      <span>Affected APIs ({data.affected_apis?.length || 0})</span>
                    </button>
                    <button
                      className={`impact-view-tab ${affectedSubTab === 'tests' ? 'active' : ''}`}
                      onClick={() => setAffectedSubTab('tests')}
                    >
                      <FlaskConical size={13} />
                      <span>Affected Tests ({data.affected_tests?.length || 0})</span>
                    </button>
                    <button
                      className={`impact-view-tab ${affectedSubTab === 'files' ? 'active' : ''}`}
                      onClick={() => setAffectedSubTab('files')}
                    >
                      <FileCode size={13} />
                      <span>Affected Files ({data.affected_files?.length || 0})</span>
                    </button>
                    <button
                      className={`impact-view-tab ${affectedSubTab === 'modules' ? 'active' : ''}`}
                      onClick={() => setAffectedSubTab('modules')}
                    >
                      <Layers size={13} />
                      <span>Affected Modules ({data.affected_modules?.length || 0})</span>
                    </button>
                  </div>

                  {affectedSubTab === 'apis' && (
                    <div className="impact-items-scroll">
                      {(!data.affected_apis || data.affected_apis.length === 0) ? (
                        <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 20, textAlign: 'center' }}>
                          No public API endpoints rely on this element.
                        </div>
                      ) : (
                        data.affected_apis.map((a, idx) => (
                          <div 
                            key={idx} 
                            className="impact-item-row"
                            onClick={() => {
                              if (a.file_path && onNavigateToSource) {
                                onNavigateToSource(a.file_path, a.line_number || undefined);
                                onClose();
                              }
                            }}
                          >
                            <span style={{ 
                              background: a.method === 'GET' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                              color: a.method === 'GET' ? '#34d399' : '#38bdf8',
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700
                            }}>
                              {a.method}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, fontWeight: 600 }}>{a.path}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.file_path}:{a.line_number} • Distance: {a.distance} hops</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {affectedSubTab === 'tests' && (
                    <div className="impact-items-scroll">
                      {(!data.affected_tests || data.affected_tests.length === 0) ? (
                        <div style={{ color: '#f43f5e', fontSize: 12, padding: 20, textAlign: 'center' }}>
                          ⚠️ No automated tests found covering this element's blast radius!
                        </div>
                      ) : (
                        data.affected_tests.map((t, idx) => (
                          <div 
                            key={idx} 
                            className="impact-item-row"
                            onClick={() => {
                              if (t.test_file && onNavigateToSource) {
                                onNavigateToSource(t.test_file);
                                onClose();
                              }
                            }}
                          >
                            <FlaskConical size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, fontWeight: 600 }}>{t.test_file}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.framework} {t.test_type} suite • Distance: {t.distance} hops</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {affectedSubTab === 'files' && (
                    <div className="impact-items-scroll">
                      {data.affected_files?.map((f, idx) => (
                        <div 
                          key={idx} 
                          className="impact-item-row"
                          onClick={() => {
                            if (onNavigateToSource) {
                              onNavigateToSource(f);
                              onClose();
                            }
                          }}
                        >
                          <FileCode size={13} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                          <div style={{ fontSize: 12 }}>{f}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {affectedSubTab === 'modules' && (
                    <div className="impact-items-scroll">
                      {data.affected_modules?.map((m, idx) => (
                        <div key={idx} className="impact-item-row">
                          <Layers size={13} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{m}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: ARCHITECTURE BOUNDARIES */}
              {activeTab === 'boundaries' && (
                <div className="impact-items-scroll">
                  {(!data.boundaries_crossed || data.boundaries_crossed.length === 0) ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 20, textAlign: 'center' }}>
                      No architectural layer boundaries are crossed (changes are contained within layer).
                    </div>
                  ) : (
                    data.boundaries_crossed.map((b, idx) => (
                      <div 
                        key={idx} 
                        className="impact-item-row"
                        style={{ borderLeft: b.violation_type ? '3px solid #f43f5e' : '3px solid var(--accent-cyan)' }}
                      >
                        <Layers size={14} style={{ color: b.violation_type ? '#f43f5e' : 'var(--accent-cyan)', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>
                            {b.source_layer} ➔ {b.target_layer}
                            {b.violation_type && (
                              <span style={{ marginLeft: 8, background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', fontSize: 10, padding: '1px 5px', borderRadius: 3 }}>
                                ⚠️ {b.violation_type}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{b.description}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 6: EVIDENCE & AUDIT */}
              {activeTab === 'evidence' && (
                <div className="impact-items-scroll">
                  {(!data.evidence || data.evidence.length === 0) ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 20, textAlign: 'center' }}>
                      No explicit evidence records logged.
                    </div>
                  ) : (
                    data.evidence.map((ev, idx) => (
                      <div key={idx} className="impact-item-row">
                        <span style={{ 
                          fontSize: 10, 
                          fontWeight: 700,
                          padding: '2px 5px', 
                          borderRadius: 3, 
                          background: ev.relationship === 'CALLS' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                          color: ev.relationship === 'CALLS' ? '#38bdf8' : 'var(--text-secondary)'
                        }}>
                          {ev.relationship}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                            <strong>{ev.source}</strong> ➔ <strong>{ev.target}</strong>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {ev.file_path}:{ev.start_line} • Confidence: {ev.confidence}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
