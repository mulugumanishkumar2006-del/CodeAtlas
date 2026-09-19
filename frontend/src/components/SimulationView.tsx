import React, { useState, useEffect, useCallback } from 'react';
import {
  SimulationDetailResponse,
  SimulationListItem,
} from '../types';
import { api } from '../services/api';
import {
  PlayCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  GitBranch,
  Layers,
  ShieldAlert,
  FileCode,
  Boxes,
  History,
  Trash2,
  RefreshCw,
  Clock,
  ChevronRight,
  CheckSquare,
  Square,
  Network,
} from 'lucide-react';

interface SimulationViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string, name?: string) => void;
}

const SAMPLE_PROPOSALS = [
  'What happens if I remove backend/app/services/database.py?',
  'Rename AuthService to AccountService',
  'Change signature of calculate_impact to accept options dict',
  'Replace requests with httpx across the repository',
  'Split universal_analyzer_service into parser and ast_extractor',
];

export const SimulationView: React.FC<SimulationViewProps> = ({
  repositoryId,
  onOpenFile,
  onOpenImpact,
}) => {
  const [proposedChange, setProposedChange] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('AUTO');
  const [explicitTarget, setExplicitTarget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Simulation Result
  const [currentSimulation, setCurrentSimulation] = useState<SimulationDetailResponse | null>(null);

  // History Drawer & Past Simulations
  const [historyList, setHistoryList] = useState<SimulationListItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Active Tab within Simulation Result
  const [activeTab, setActiveTab] = useState<'consequences' | 'before_after' | 'impact_breakdown' | 'validation'>('consequences');

  // Interactive Validation Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await api.listSimulations(repositoryId);
      setHistoryList(res.simulations || []);
    } catch (err: any) {
      console.error('Failed to load simulation history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRunSimulation = async (persist: boolean = true) => {
    if (!proposedChange.trim()) {
      setError('Please specify a proposed change or question.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      proposed_change: proposedChange.trim(),
      operation: selectedOperation !== 'AUTO' ? selectedOperation : undefined,
      target_id: explicitTarget.trim() ? explicitTarget.trim() : undefined,
    };

    try {
      let result: SimulationDetailResponse;
      if (persist) {
        result = await api.createSimulation(repositoryId, payload);
        // refresh history
        loadHistory();
      } else {
        result = await api.simulateTarget(repositoryId, payload);
      }
      setCurrentSimulation(result);
      setCheckedItems({});
    } catch (err: any) {
      setError(err.message || 'Failed to simulate proposed change.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = async (simId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getSimulation(repositoryId, simId);
      setCurrentSimulation(result);
      setProposedChange(result.proposed_change);
      setSelectedOperation(result.operation || 'AUTO');
      setShowHistory(false);
      setCheckedItems({});
    } catch (err: any) {
      setError(err.message || 'Failed to load past simulation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistoryItem = async (e: React.MouseEvent, simId: string) => {
    e.stopPropagation();
    try {
      await api.deleteSimulation(repositoryId, simId);
      setHistoryList(prev => prev.filter(item => item.id !== simId));
      if (currentSimulation?.id === simId) {
        setCurrentSimulation(null);
      }
    } catch (err: any) {
      console.error('Failed to delete simulation:', err);
    }
  };

  const toggleCheckItem = (itemText: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  return (
    <div className="simulation-view-container" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <PlayCircle size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Future Impact Simulator
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Ask "What happens if I change this?" — Grounded static reasoning with Epistemic Triad analysis.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="tab-button"
            onClick={() => setShowHistory(prev => !prev)}
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: showHistory ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-secondary)',
              borderColor: showHistory ? 'var(--accent-cyan)' : 'var(--border-color)',
            }}
          >
            <History size={15} />
            <span>Past Simulations ({historyList.length})</span>
          </button>
        </div>
      </div>

      {/* Change Proposal Form Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>Proposed Change or What-If Question:</span>
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              placeholder="e.g. What happens if I remove database_service.py? Or rename UserService to AccountService"
              value={proposedChange}
              onChange={e => setProposedChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRunSimulation(true);
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                outline: 'none',
              }}
            />

            <button
              className="btn btn-primary"
              onClick={() => handleRunSimulation(true)}
              disabled={isLoading || !proposedChange.trim()}
              style={{
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 600,
                minWidth: 160,
                justifyContent: 'center',
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <PlayCircle size={16} />
                  <span>Simulate Change</span>
                </>
              )}
            </button>
          </div>

          {/* Quick sample proposal chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Try:</span>
            {SAMPLE_PROPOSALS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setProposedChange(sample)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 14,
                  padding: '3px 10px',
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Optional Advanced Filter Toggle */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Explicit Operation:</span>
              <select
                value={selectedOperation}
                onChange={e => setSelectedOperation(e.target.value)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              >
                <option value="AUTO">Auto Detect</option>
                <option value="REMOVE">REMOVE</option>
                <option value="RENAME">RENAME</option>
                <option value="SIGNATURE_CHANGE">SIGNATURE_CHANGE</option>
                <option value="MOVE">MOVE</option>
                <option value="DEPENDENCY_REMOVE">DEPENDENCY_REMOVE</option>
                <option value="DEPENDENCY_REPLACE">DEPENDENCY_REPLACE</option>
                <option value="API_CHANGE">API_CHANGE</option>
                <option value="MODULE_SPLIT">MODULE_SPLIT</option>
                <option value="MODULE_MERGE">MODULE_MERGE</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target (Optional):</span>
              <input
                type="text"
                placeholder="e.g. backend/app/services/db.py"
                value={explicitTarget}
                onChange={e => setExplicitTarget(e.target.value)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  width: 220,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          color: '#ef4444',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* History Drawer / Modal */}
      {showHistory && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <History size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span>Saved Simulation History for Repository</span>
            </h4>
            <button
              className="btn btn-ghost"
              onClick={() => setShowHistory(false)}
              style={{ fontSize: '0.8rem', padding: '2px 8px' }}
            >
              Close
            </button>
          </div>

          {isLoadingHistory ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Loading history...</div>
          ) : historyList.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              No past simulations recorded for this repository yet. Run your first simulation above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
              {historyList.map(sim => (
                <div
                  key={sim.id}
                  onClick={() => handleSelectHistoryItem(sim.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: currentSimulation?.id === sim.id ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-secondary)',
                    border: currentSimulation?.id === sim.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--accent-cyan)',
                    }}>
                      {sim.simulation_type}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {sim.proposed_change || sim.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                        {sim.target_name && <span>Target: {sim.target_name}</span>}
                        <span>{sim.affected_files_count} files affected</span>
                        {sim.created_at && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={11} />
                            {new Date(sim.created_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={(e) => handleDeleteHistoryItem(e, sim.id)}
                      title="Delete simulation record"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 6,
                        borderRadius: 4,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Trash2 size={15} />
                    </button>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Simulation Results */}
      {currentSimulation && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Simulation Header Summary Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 12,
            padding: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 6,
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: 'var(--accent-cyan)',
                    letterSpacing: '0.04em',
                  }}>
                    {currentSimulation.operation}
                  </span>
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 6,
                    background: currentSimulation.confidence === 'HIGH' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                    color: currentSimulation.confidence === 'HIGH' ? 'var(--accent-emerald)' : '#fbbf24',
                  }}>
                    {currentSimulation.confidence} CONFIDENCE
                  </span>
                </div>

                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentSimulation.name}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  Proposed Change: "{currentSimulation.proposed_change}"
                </p>
                {currentSimulation.target && onOpenImpact && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => onOpenImpact(currentSimulation.target!.id, currentSimulation.target!.name)}
                    style={{ fontSize: '0.76rem', padding: '2px 8px', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent-cyan)' }}
                  >
                    <Layers size={13} />
                    <span>View Phase 19 Impact Analysis</span>
                  </button>
                )}
              </div>

              {/* Quick Metrics Chips */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {currentSimulation.direct_impact?.callers_count ?? 0}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Callers
                  </div>
                </div>

                <div style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>
                    {currentSimulation.direct_impact?.affected_files_count ?? 0}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Affected Files
                  </div>
                </div>

                <div style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fbbf24' }}>
                    {currentSimulation.test_impact?.affected_test_count ?? 0}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Tests Touched
                  </div>
                </div>

                <div style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ef4444' }}>
                    {currentSimulation.direct_impact?.blast_radius ?? 0}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Blast Radius
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Tabs Navigation */}
          <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>
            <button
              className={`tab-button ${activeTab === 'consequences' ? 'active' : ''}`}
              onClick={() => setActiveTab('consequences')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}
            >
              <Sparkles size={15} />
              <span>Epistemic Triad (Known / Predicted / Unknown)</span>
            </button>

            <button
              className={`tab-button ${activeTab === 'before_after' ? 'active' : ''}`}
              onClick={() => setActiveTab('before_after')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}
            >
              <GitBranch size={15} />
              <span>Before / After Diff</span>
            </button>

            <button
              className={`tab-button ${activeTab === 'impact_breakdown' ? 'active' : ''}`}
              onClick={() => setActiveTab('impact_breakdown')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}
            >
              <Layers size={15} />
              <span>Affected Tests & APIs</span>
            </button>

            <button
              className={`tab-button ${activeTab === 'validation' ? 'active' : ''}`}
              onClick={() => setActiveTab('validation')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px' }}
            >
              <CheckSquare size={15} />
              <span>Validation Checklist ({currentSimulation.recommended_validation?.length || 0})</span>
            </button>
          </div>

          {/* Tab 1: Epistemic Triad (Known, Predicted, Unknown) */}
          {activeTab === 'consequences' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {/* Known Consequences Card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                borderRadius: 12,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-emerald)' }}>
                  <CheckCircle2 size={18} />
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700 }}>
                    Known Consequences (Direct Evidence)
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Directly verified by repository AST, imports, and call graphs.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  {currentSimulation.consequences.known.length === 0 ? (
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No direct breaking changes verified.</div>
                  ) : (
                    currentSimulation.consequences.known.map((k, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'rgba(52, 211, 153, 0.08)',
                          borderLeft: '3px solid var(--accent-emerald)',
                          fontSize: '0.84rem',
                          color: 'var(--text-primary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {k}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Predicted Consequences Card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: 12,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fbbf24' }}>
                  <AlertTriangle size={18} />
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700 }}>
                    Predicted Consequences (Inferred)
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Inferred from graph coupling, architecture layers, and historical churn.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  {currentSimulation.consequences.predicted.length === 0 ? (
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No indirect consequences predicted.</div>
                  ) : (
                    currentSimulation.consequences.predicted.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'rgba(251, 191, 36, 0.08)',
                          borderLeft: '3px solid #fbbf24',
                          fontSize: '0.84rem',
                          color: 'var(--text-primary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {p}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Unknown Consequences Card */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 12,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f43f5e' }}>
                  <HelpCircle size={18} />
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700 }}>
                    Unknown Consequences (Runtime Blind Spots)
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Consequences that cannot be determined statically without runtime execution.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  {currentSimulation.consequences.unknown.length === 0 ? (
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No runtime blind spots detected.</div>
                  ) : (
                    currentSimulation.consequences.unknown.map((u, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'rgba(244, 63, 94, 0.08)',
                          borderLeft: '3px solid #f43f5e',
                          fontSize: '0.84rem',
                          color: 'var(--text-primary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {u}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Before / After Structural Model */}
          {activeTab === 'before_after' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Structural Diff Summary */}
              {currentSimulation.before_after?.structural_diff_summary && (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: 'monospace',
                  fontSize: '0.86rem',
                  whiteSpace: 'pre-wrap',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                }}>
                  {currentSimulation.before_after.structural_diff_summary}
                </div>
              )}

              {/* Side by side comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Current Model */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: 16,
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Boxes size={15} />
                    <span>Current Repository State</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto' }}>
                    {(currentSimulation.before_after?.current_nodes || []).map(node => (
                      <div
                        key={node.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'var(--bg-secondary)',
                          fontSize: '0.84rem',
                        }}
                      >
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{node.label}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {node.node_type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Model */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12,
                  padding: 16,
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.94rem', fontWeight: 600, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={15} />
                    <span>Simulated State (Hypothetical)</span>
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto' }}>
                    {(currentSimulation.before_after?.simulated_nodes || []).map(node => {
                      const isRemoved = node.status === 'REMOVED';
                      const isModified = node.status === 'MODIFIED';
                      return (
                        <div
                          key={node.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            borderRadius: 6,
                            background: isRemoved ? 'rgba(239, 68, 68, 0.1)' : isModified ? 'rgba(251, 191, 36, 0.1)' : 'var(--bg-secondary)',
                            border: isRemoved ? '1px solid rgba(239, 68, 68, 0.3)' : isModified ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid var(--border-color)',
                            fontSize: '0.84rem',
                          }}
                        >
                          <span style={{
                            color: isRemoved ? '#ef4444' : isModified ? '#fbbf24' : 'var(--text-primary)',
                            fontWeight: 500,
                            textDecoration: isRemoved ? 'line-through' : 'none',
                          }}>
                            {node.label}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: isRemoved ? 'rgba(239, 68, 68, 0.2)' : isModified ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)',
                            color: isRemoved ? '#ef4444' : isModified ? '#fbbf24' : 'var(--text-muted)',
                          }}>
                            {node.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Affected Tests & APIs & Architecture */}
          {activeTab === 'impact_breakdown' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {/* Affected Tests */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 12,
                padding: 16,
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileCode size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Affected Tests ({currentSimulation.test_impact?.affected_test_count || 0})</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(currentSimulation.test_impact?.affected_test_files || []).length === 0 ? (
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No test files directly touch this target.</div>
                  ) : (
                    (currentSimulation.test_impact.affected_test_files as string[]).map((tf, idx) => (
                      <div
                        key={idx}
                        onClick={() => onOpenFile?.(tf)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'var(--bg-secondary)',
                          fontSize: '0.84rem',
                          color: 'var(--accent-cyan)',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>{tf}</span>
                        <ChevronRight size={14} />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Affected APIs */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 12,
                padding: 16,
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Network size={16} style={{ color: 'var(--accent-emerald)' }} />
                  <span>Affected APIs ({currentSimulation.direct_impact?.affected_apis_count || 0})</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {((currentSimulation.direct_impact?.affected_apis as any[]) || []).length === 0 ? (
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>No public API endpoints exposed by this target.</div>
                  ) : (
                    (currentSimulation.direct_impact.affected_apis as any[]).map((api, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          background: 'var(--bg-secondary)',
                          fontSize: '0.84rem',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span style={{
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: 'rgba(52, 211, 153, 0.15)',
                          color: 'var(--accent-emerald)',
                        }}>
                          {api.method}
                        </span>
                        <span>{api.path}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Architecture & Risk */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 12,
                padding: 16,
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldAlert size={16} style={{ color: '#fbbf24' }} />
                  <span>Risk & Architecture Context</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Touches Risk Hotspot: <strong style={{ color: currentSimulation.risk_impact?.touches_hotspot ? '#ef4444' : 'var(--accent-emerald)' }}>
                      {currentSimulation.risk_impact?.touches_hotspot ? 'YES' : 'NO'}
                    </strong>
                  </div>

                  {currentSimulation.risk_impact?.hotspot_details && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      fontSize: '0.8rem',
                      color: '#ef4444',
                    }}>
                      {currentSimulation.risk_impact.hotspot_details.explanation}
                    </div>
                  )}

                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    Historical Churn: <strong>{currentSimulation.historical_evidence?.churn || 0} lines</strong> across {currentSimulation.historical_evidence?.commit_count || 0} commits
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Recommended Validation Checklist */}
          {activeTab === 'validation' && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              padding: 20,
            }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckSquare size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Deterministic Validation Checklist for this Change</span>
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Follow these recommended steps before landing this proposed change in production:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(currentSimulation.recommended_validation || []).map((step, idx) => {
                  const isChecked = !!checkedItems[step];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheckItem(step)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: isChecked ? 'rgba(52, 211, 153, 0.08)' : 'var(--bg-secondary)',
                        border: isChecked ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isChecked ? (
                        <CheckSquare size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                      ) : (
                        <Square size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      )}
                      <span style={{
                        fontSize: '0.88rem',
                        color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        lineHeight: 1.4,
                      }}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
