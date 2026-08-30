import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  Zap, 
  Network, 
  ArrowRightLeft, 
  FileCode, 
  AlertTriangle, 
  Loader2, 
  ExternalLink,
  Info,
  GitFork
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
  const [activeTab, setActiveTab] = useState<'graph' | 'dependents' | 'dependencies'>('graph');
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
                <h3 className="impact-modal-title">Dependency & Impact Intelligence</h3>
                <span className="impact-repo-tag">{repositoryName}</span>
              </div>
              <p className="impact-modal-subtitle">
                Deterministic blast radius, downstream impact, and upstream dependency propagation
              </p>
            </div>
          </div>
          <button className="impact-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Controls Toolbar */}
        <div className="impact-toolbar">
          <div className="impact-filter-group">
            <span className="toolbar-label">Direction:</span>
            <div className="segmented-control">
              <button 
                className={`segment-btn ${direction === 'both' ? 'active' : ''}`}
                onClick={() => setDirection('both')}
              >
                Both
              </button>
              <button 
                className={`segment-btn ${direction === 'downstream' ? 'active' : ''}`}
                onClick={() => setDirection('downstream')}
              >
                Downstream (Impact)
              </button>
              <button 
                className={`segment-btn ${direction === 'upstream' ? 'active' : ''}`}
                onClick={() => setDirection('upstream')}
              >
                Upstream (Deps)
              </button>
            </div>
          </div>

          <div className="impact-filter-group">
            <span className="toolbar-label">Max Depth:</span>
            <div className="depth-selector-group">
              {[1, 2, 3, 5].map((d) => (
                <button
                  key={d}
                  className={`depth-btn ${maxDepth === d ? 'active' : ''}`}
                  onClick={() => setMaxDepth(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="impact-modal-body">
          {isLoading && (
            <div className="impact-loading-box">
              <Loader2 size={24} className="spinner-icon" />
              <span>Traversing dependency graph & calculating blast radius...</span>
            </div>
          )}

          {error && (
            <div className="impact-error-box">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && data && (
            <div className="impact-content-grid">
              {/* Target Overview Card */}
              <div className="impact-target-card">
                <div className="target-card-top">
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
                      <span>{metrics.risk} RISK</span>
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

                {/* Blast Radius Metrics Grid */}
                {metrics && (
                  <div className="blast-radius-grid">
                    <div className="blast-card">
                      <span className="blast-label">Affected Files</span>
                      <span className="blast-value" style={{ color: 'var(--accent-cyan)' }}>
                        {metrics.affected_files}
                      </span>
                    </div>
                    <div className="blast-card">
                      <span className="blast-label">Affected Symbols</span>
                      <span className="blast-value" style={{ color: 'var(--accent-indigo)' }}>
                        {metrics.affected_symbols}
                      </span>
                    </div>
                    <div className="blast-card">
                      <span className="blast-label">Max Depth</span>
                      <span className="blast-value" style={{ color: '#fbbf24' }}>
                        {metrics.max_depth}
                      </span>
                    </div>
                    <div className="blast-card">
                      <span className="blast-label">Direct Callers / Dependents</span>
                      <span className="blast-value" style={{ color: metrics.direct_dependents > 3 ? '#f43f5e' : 'var(--text-primary)' }}>
                        {metrics.direct_dependents}
                      </span>
                    </div>
                  </div>
                )}

                {/* Deterministic Risk Explanations */}
                {metrics && metrics.risk_reasons && metrics.risk_reasons.length > 0 && (
                  <div className="risk-reasons-box">
                    <div className="reasons-header">
                      <Info size={13} />
                      <span>Why is the risk assessed as {metrics.risk}?</span>
                    </div>
                    <ul className="reasons-list">
                      {metrics.risk_reasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
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
              </div>

              {/* View Navigation Tabs */}
              <div className="impact-view-tabs">
                <button
                  className={`impact-view-tab ${activeTab === 'graph' ? 'active' : ''}`}
                  onClick={() => setActiveTab('graph')}
                >
                  <Network size={14} />
                  <span>Impact Graph ({data.nodes.length} nodes)</span>
                </button>
                <button
                  className={`impact-view-tab ${activeTab === 'dependents' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dependents')}
                >
                  <GitFork size={14} />
                  <span>Downstream Dependents ({data.direct_dependents.length + data.transitive_dependents.length})</span>
                </button>
                <button
                  className={`impact-view-tab ${activeTab === 'dependencies' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dependencies')}
                >
                  <ArrowRightLeft size={14} />
                  <span>Upstream Dependencies ({data.direct_dependencies.length + data.transitive_dependencies.length})</span>
                </button>
              </div>

              {/* TAB 1: INTERACTIVE GRAPH VIEW */}
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
                            {/* Target Node Center */}
                            {targetNode && (
                              <g 
                                className="graph-node-g target-node" 
                                transform={`translate(${targetX}, ${targetY})`}
                                onClick={() => setSelectedNode(targetNode)}
                              >
                                <circle r="26" fill="rgba(56, 189, 248, 0.2)" stroke="var(--accent-cyan)" strokeWidth="2.5" />
                                <text textAnchor="middle" dy="4" fill="var(--accent-cyan)" fontSize="10" fontWeight="bold">
                                  {targetNode.label.length > 14 ? targetNode.label.slice(0, 12) + '...' : targetNode.label}
                                </text>
                              </g>
                            )}

                            {/* Downstream Nodes (Right side) */}
                            {downNodes.map((node, i) => {
                              const total = Math.max(downNodes.length, 1);
                              const angle = ((i / total) - 0.5) * Math.PI * 0.8;
                              const x = targetX + Math.cos(angle) * (180 + node.depth * 25);
                              const y = targetY + Math.sin(angle) * (120 + node.depth * 20);

                              return (
                                <g key={node.id}>
                                  <line
                                    x1={targetX + 26}
                                    y1={targetY}
                                    x2={x - 20}
                                    y2={y}
                                    stroke="rgba(244, 63, 94, 0.4)"
                                    strokeWidth="1.5"
                                    markerEnd="url(#arrowhead-impact)"
                                  />
                                  <g 
                                    className="graph-node-g down-node" 
                                    transform={`translate(${x}, ${y})`}
                                    onClick={() => setSelectedNode(node)}
                                  >
                                    <rect x="-60" y="-14" width="120" height="28" rx="6" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.2" />
                                    <text textAnchor="middle" dy="3" fill="#f8fafc" fontSize="9" fontWeight="500">
                                      {node.label.length > 18 ? '...' + node.label.slice(-16) : node.label}
                                    </text>
                                  </g>
                                </g>
                              );
                            })}

                            {/* Upstream Nodes (Left side) */}
                            {upNodes.map((node, i) => {
                              const total = Math.max(upNodes.length, 1);
                              const angle = Math.PI + ((i / total) - 0.5) * Math.PI * 0.8;
                              const x = targetX + Math.cos(angle) * (180 + node.depth * 25);
                              const y = targetY + Math.sin(angle) * (120 + node.depth * 20);

                              return (
                                <g key={node.id}>
                                  <line
                                    x1={x + 20}
                                    y1={y}
                                    x2={targetX - 26}
                                    y2={targetY}
                                    stroke="rgba(99, 102, 241, 0.4)"
                                    strokeWidth="1.5"
                                    markerEnd="url(#arrowhead-impact)"
                                  />
                                  <g 
                                    className="graph-node-g up-node" 
                                    transform={`translate(${x}, ${y})`}
                                    onClick={() => setSelectedNode(node)}
                                  >
                                    <rect x="-60" y="-14" width="120" height="28" rx="6" fill="#1e293b" stroke="#818cf8" strokeWidth="1.2" />
                                    <text textAnchor="middle" dy="3" fill="#f8fafc" fontSize="9" fontWeight="500">
                                      {node.label.length > 18 ? '...' + node.label.slice(-16) : node.label}
                                    </text>
                                  </g>
                                </g>
                              );
                            })}
                          </g>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* Selected Node / Edge Details Drawer */}
                  {selectedNode && (
                    <div className="impact-inspector-drawer">
                      <div className="inspector-title-row">
                        <span className="drawer-tag">{selectedNode.direction.toUpperCase()} NODE</span>
                        <button className="drawer-close-btn" onClick={() => setSelectedNode(null)}>
                          <X size={14} />
                        </button>
                      </div>
                      <h5 className="drawer-node-label">{selectedNode.label}</h5>
                      <div className="drawer-meta-grid">
                        <div>
                          <span className="meta-k">Depth:</span>
                          <span className="meta-v">Level {selectedNode.depth}</span>
                        </div>
                        <div>
                          <span className="meta-k">Type:</span>
                          <span className="meta-v">{selectedNode.node_type}</span>
                        </div>
                      </div>
                      {onNavigateToSource && selectedNode.file_path && (
                        <button
                          className="btn-drawer-jump"
                          onClick={() => {
                            onNavigateToSource(selectedNode.file_path!, selectedNode.start_line || undefined);
                            onClose();
                          }}
                        >
                          <ExternalLink size={12} />
                          <span>Open in Code Explorer</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DOWNSTREAM DEPENDENTS LIST */}
              {activeTab === 'dependents' && (
                <div className="impact-list-pane">
                  <div className="list-section-header">
                    <h6>Direct Dependents (Depth 1)</h6>
                    <span className="count-pill">{data.direct_dependents.length}</span>
                  </div>
                  <div className="impact-items-scroll">
                    {data.direct_dependents.length === 0 ? (
                      <div className="empty-section-note">No direct callers or importing components found.</div>
                    ) : (
                      data.direct_dependents.map((item) => (
                        <div 
                          key={item.id} 
                          className="impact-item-row"
                          onClick={() => {
                            if (onNavigateToSource && item.file_path) {
                              onNavigateToSource(item.file_path, item.start_line || undefined);
                              onClose();
                            }
                          }}
                        >
                          <FileCode size={15} style={{ color: '#f43f5e', flexShrink: 0 }} />
                          <span className="item-label">{item.label}</span>
                          <span className="depth-badge">Depth 1</span>
                          {onNavigateToSource && <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />}
                        </div>
                      ))
                    )}
                  </div>

                  {data.transitive_dependents.length > 0 && (
                    <>
                      <div className="list-section-header" style={{ marginTop: 14 }}>
                        <h6>Transitive Dependents (Depth 2+)</h6>
                        <span className="count-pill">{data.transitive_dependents.length}</span>
                      </div>
                      <div className="impact-items-scroll">
                        {data.transitive_dependents.map((item) => (
                          <div 
                            key={item.id} 
                            className="impact-item-row"
                            onClick={() => {
                              if (onNavigateToSource && item.file_path) {
                                onNavigateToSource(item.file_path, item.start_line || undefined);
                                onClose();
                              }
                            }}
                          >
                            <FileCode size={15} style={{ color: '#fbbf24', flexShrink: 0 }} />
                            <span className="item-label">{item.label}</span>
                            <span className="depth-badge">Depth {item.depth}</span>
                            {onNavigateToSource && <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: UPSTREAM DEPENDENCIES LIST */}
              {activeTab === 'dependencies' && (
                <div className="impact-list-pane">
                  <div className="list-section-header">
                    <h6>Direct Outgoing Dependencies (Depth 1)</h6>
                    <span className="count-pill">{data.direct_dependencies.length}</span>
                  </div>
                  <div className="impact-items-scroll">
                    {data.direct_dependencies.length === 0 ? (
                      <div className="empty-section-note">No outgoing dependencies found.</div>
                    ) : (
                      data.direct_dependencies.map((item) => (
                        <div 
                          key={item.id} 
                          className="impact-item-row"
                          onClick={() => {
                            if (onNavigateToSource && item.file_path) {
                              onNavigateToSource(item.file_path, item.start_line || undefined);
                              onClose();
                            }
                          }}
                        >
                          <FileCode size={15} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                          <span className="item-label">{item.label}</span>
                          <span className="depth-badge">Depth 1</span>
                          {onNavigateToSource && <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />}
                        </div>
                      ))
                    )}
                  </div>

                  {data.transitive_dependencies.length > 0 && (
                    <>
                      <div className="list-section-header" style={{ marginTop: 14 }}>
                        <h6>Transitive Dependencies (Depth 2+)</h6>
                        <span className="count-pill">{data.transitive_dependencies.length}</span>
                      </div>
                      <div className="impact-items-scroll">
                        {data.transitive_dependencies.map((item) => (
                          <div 
                            key={item.id} 
                            className="impact-item-row"
                            onClick={() => {
                              if (onNavigateToSource && item.file_path) {
                                onNavigateToSource(item.file_path, item.start_line || undefined);
                                onClose();
                              }
                            }}
                          >
                            <FileCode size={15} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />
                            <span className="item-label">{item.label}</span>
                            <span className="depth-badge">Depth {item.depth}</span>
                            {onNavigateToSource && <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} />}
                          </div>
                        ))}
                      </div>
                    </>
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
