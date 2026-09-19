import React, { useState, useEffect, useCallback } from 'react';
import {
  EngineeringHealthResponse,
  EngineeringPrioritiesResponse,
  EngineeringRoadmapResponse,
  WhatShouldWeDoNextResponse,
  StrategyComparisonResponse,
  SimulateIgnoreResponse,
  EngineeringPlanListResponse,
  EngineeringPlanResponse,
} from '../types';
import { api } from '../services/api';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileCode2,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Calendar,
  History,
  ChevronRight,
  CheckSquare,
  AlertCircle,
  BarChart3,
  Sliders,
} from 'lucide-react';

interface EngineeringDashboardViewProps {
  repositoryId: string;
  onOpenFile?: (filePath: string, line?: number) => void;
  onOpenImpact?: (targetId: string, name?: string) => void;
}

export const EngineeringDashboardView: React.FC<EngineeringDashboardViewProps> = ({
  repositoryId,
  onOpenFile,
  onOpenImpact,
}) => {
  // Navigation within the AI CTO Dashboard
  const [subTab, setSubTab] = useState<'health' | 'priorities' | 'roadmap' | 'strategies' | 'plans'>('health');
  const [timeHorizon, setTimeHorizon] = useState<string>('1_month');

  // Core Data States
  const [health, setHealth] = useState<EngineeringHealthResponse | null>(null);
  const [priorities, setPriorities] = useState<EngineeringPrioritiesResponse | null>(null);
  const [roadmap, setRoadmap] = useState<EngineeringRoadmapResponse | null>(null);
  const [whatNext, setWhatNext] = useState<WhatShouldWeDoNextResponse | null>(null);
  const [plansList, setPlansList] = useState<EngineeringPlanListResponse | null>(null);
  const [activePlan, setActivePlan] = useState<EngineeringPlanResponse | null>(null);

  // Strategic Inquiries State
  const [selectedWorkItemId, setSelectedWorkItemId] = useState<string>('');
  const [strategyComparison, setStrategyComparison] = useState<StrategyComparisonResponse | null>(null);
  const [simulateIgnoreResult, setSimulateIgnoreResult] = useState<SimulateIgnoreResponse | null>(null);
  const [isSimulatingIgnore, setIsSimulatingIgnore] = useState(false);
  const [isComparingStrategies, setIsComparingStrategies] = useState(false);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial health and priorities
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [hData, pData, rData, nData, plansData] = await Promise.all([
        api.getEngineeringHealth(repositoryId),
        api.getEngineeringPriorities(repositoryId),
        api.getEngineeringRoadmap(repositoryId, timeHorizon),
        api.whatShouldWeDoNext(repositoryId),
        api.listEngineeringPlans(repositoryId),
      ]);
      setHealth(hData);
      setPriorities(pData);
      setRoadmap(rData);
      setWhatNext(nData);
      setPlansList(plansData);

      if (pData.priorities.length > 0) {
        setSelectedWorkItemId(pData.priorities[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load engineering dashboard data:', err);
      setError(err.message || 'Failed to fetch AI CTO planning data.');
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId, timeHorizon]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle Strategy Comparison
  const handleCompareStrategies = async (workItemId?: string) => {
    setIsComparingStrategies(true);
    try {
      const targetId = workItemId || selectedWorkItemId;
      const data = await api.compareEngineeringStrategies(repositoryId, targetId || undefined);
      setStrategyComparison(data);
    } catch (err: any) {
      console.error('Error comparing strategies:', err);
    } finally {
      setIsComparingStrategies(false);
    }
  };

  // Handle Simulate Ignore
  const handleSimulateIgnore = async (workItemId: string) => {
    setIsSimulatingIgnore(true);
    try {
      const data = await api.simulateIgnore(repositoryId, workItemId);
      setSimulateIgnoreResult(data);
    } catch (err: any) {
      console.error('Error simulating ignore:', err);
    } finally {
      setIsSimulatingIgnore(false);
    }
  };

  // Handle Autonomous Plan Generation (v1 -> v2)
  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const plan = await api.generateEngineeringPlan(repositoryId, {
        time_horizon: timeHorizon,
      });
      setActivePlan(plan);
      // Refresh list
      const plansData = await api.listEngineeringPlans(repositoryId);
      setPlansList(plansData);
      setSubTab('plans');
    } catch (err: any) {
      console.error('Error generating plan:', err);
      alert('Plan generation failed: ' + (err.message || err));
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'var(--accent-emerald, #10b981)';
      case 'MODERATE':
        return '#fbbf24';
      case 'DEGRADED':
        return '#f97316';
      case 'CRITICAL':
        return 'var(--accent-rose, #f43f5e)';
      default:
        return 'var(--text-muted, #94a3b8)';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'CRITICAL':
        return '#ef4444';
      case 'HIGH':
        return '#f97316';
      case 'MEDIUM':
        return '#eab308';
      case 'LOW':
        return '#10b981';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="engineering-dashboard-container" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Header & Executive Summary Bar */}
      <div
        className="dashboard-header-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid var(--border-color, #334155)',
          borderRadius: 14,
          padding: '22px 26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan, #38bdf8)',
            }}
          >
            <Compass size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--text-primary, #f8fafc)' }}>
                AI CTO & Engineering Planning
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-cyan, #38bdf8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                Autonomous Intelligence
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: 'var(--text-muted, #94a3b8)' }}>
              Evidence-grounded engineering health, priority roadmap, and strategic architectural foresight.
            </p>
          </div>
        </div>

        {/* Health Score Pill & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {health && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${getStatusColor(health.overall_status)}44`,
                padding: '8px 16px',
                borderRadius: 10,
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted, #94a3b8)' }}>
                  Health Score
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: getStatusColor(health.overall_status) }}>
                  {health.overall_score}/100 <span style={{ fontSize: '0.9rem' }}>({health.overall_grade})</span>
                </div>
              </div>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: getStatusColor(health.overall_status),
                  boxShadow: `0 0 10px ${getStatusColor(health.overall_status)}`,
                }}
              />
            </div>
          )}

          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan || isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: isGeneratingPlan ? 'not-allowed' : 'pointer',
              opacity: isGeneratingPlan ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            <Sparkles size={16} />
            <span>{isGeneratingPlan ? 'Generating Plan...' : 'Generate New Plan'}</span>
          </button>

          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            title="Refresh Intelligence Data"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color, #334155)',
              color: 'var(--text-primary, #f8fafc)',
              borderRadius: 8,
              padding: '10px 12px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} className={isLoading ? 'spin-animation' : ''} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 8,
            padding: '10px 16px',
            color: 'var(--accent-rose, #f43f5e)',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Top Action Banner ("What should we do next?") */}
      {whatNext?.top_action && (
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.06)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan, #38bdf8)',
              }}
            >
              <ArrowRight size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan, #38bdf8)', textTransform: 'uppercase' }}>
                  AI CTO Directive
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: 4,
                    background: getTierColor(whatNext.top_action.priority_tier),
                    color: '#fff',
                  }}
                >
                  {whatNext.top_action.priority_tier}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.96rem', color: 'var(--text-primary, #f8fafc)', marginTop: 2 }}>
                {whatNext.top_action.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)', marginTop: 2 }}>
                {whatNext.justification}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setSelectedWorkItemId(whatNext.top_action!.id);
                handleCompareStrategies(whatNext.top_action!.id);
                setSubTab('strategies');
              }}
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: 'var(--accent-cyan, #38bdf8)',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Compare Strategies
            </button>
            <button
              onClick={() => {
                handleSimulateIgnore(whatNext.top_action!.id);
                setSubTab('strategies');
              }}
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--accent-rose, #f43f5e)',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Simulate Ignoring
            </button>
          </div>
        </div>
      )}

      {/* 3. Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          borderBottom: '1px solid var(--border-color, #334155)',
          paddingBottom: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          className={`tab-button ${subTab === 'health' ? 'active' : ''}`}
          onClick={() => setSubTab('health')}
          style={{
            background: subTab === 'health' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            color: subTab === 'health' ? 'var(--accent-cyan, #38bdf8)' : 'var(--text-muted, #94a3b8)',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <BarChart3 size={15} />
          <span>Health Assessment</span>
        </button>

        <button
          className={`tab-button ${subTab === 'priorities' ? 'active' : ''}`}
          onClick={() => setSubTab('priorities')}
          style={{
            background: subTab === 'priorities' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            color: subTab === 'priorities' ? 'var(--accent-cyan, #38bdf8)' : 'var(--text-muted, #94a3b8)',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Flame size={15} />
          <span>Engineering Priorities ({priorities?.total_priorities || 0})</span>
        </button>

        <button
          className={`tab-button ${subTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setSubTab('roadmap')}
          style={{
            background: subTab === 'roadmap' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            color: subTab === 'roadmap' ? 'var(--accent-cyan, #38bdf8)' : 'var(--text-muted, #94a3b8)',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Calendar size={15} />
          <span>Roadmap (Now/Next/Later)</span>
        </button>

        <button
          className={`tab-button ${subTab === 'strategies' ? 'active' : ''}`}
          onClick={() => {
            setSubTab('strategies');
            if (!strategyComparison && selectedWorkItemId) {
              handleCompareStrategies();
            }
          }}
          style={{
            background: subTab === 'strategies' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            color: subTab === 'strategies' ? 'var(--accent-cyan, #38bdf8)' : 'var(--text-muted, #94a3b8)',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Sliders size={15} />
          <span>Strategic Decisions</span>
        </button>

        <button
          className={`tab-button ${subTab === 'plans' ? 'active' : ''}`}
          onClick={() => setSubTab('plans')}
          style={{
            background: subTab === 'plans' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            color: subTab === 'plans' ? 'var(--accent-cyan, #38bdf8)' : 'var(--text-muted, #94a3b8)',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <History size={15} />
          <span>Saved Plans ({plansList?.total_plans || 0})</span>
        </button>

        {/* Time Horizon Selector */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>Time Frame:</span>
          <select
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value)}
            style={{
              background: 'var(--bg-card, #1e293b)',
              color: 'var(--text-primary, #f8fafc)',
              border: '1px solid var(--border-color, #334155)',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <option value="1_week">1 Week (Sprint Focus)</option>
            <option value="1_month">1 Month (Balanced Horizon)</option>
            <option value="3_months">3 Months (Quarterly Plan)</option>
            <option value="long_term">Long Term (Architecture Vision)</option>
          </select>
        </div>
      </div>

      {/* 4. Tab Contents */}

      {/* --- SUBTAB: HEALTH ASSESSMENT --- */}
      {subTab === 'health' && health && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 16,
            }}
          >
            {health.dimensions.map((dim) => (
              <div
                key={dim.key}
                style={{
                  background: 'var(--bg-card, #1e293b)',
                  border: '1px solid var(--border-color, #334155)',
                  borderRadius: 12,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary, #f8fafc)' }}>
                    {dim.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: `${getStatusColor(dim.status)}22`,
                        color: getStatusColor(dim.status),
                      }}
                    >
                      {dim.status}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: getStatusColor(dim.status) }}>
                      {dim.score}
                    </span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
                  {dim.summary}
                </p>

                {dim.strengths.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--accent-emerald, #10b981)', marginBottom: 4 }}>
                      Strengths:
                    </div>
                    {dim.strengths.map((s, idx) => (
                      <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-primary, #f8fafc)', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <CheckCircle2 size={12} style={{ color: 'var(--accent-emerald, #10b981)', flexShrink: 0 }} />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {dim.concerns.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#f59e0b', marginBottom: 4 }}>
                      Key Concerns:
                    </div>
                    {dim.concerns.map((c, idx) => (
                      <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-primary, #f8fafc)', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <AlertTriangle size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB: ENGINEERING PRIORITIES --- */}
      {subTab === 'priorities' && priorities && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-muted, #94a3b8)' }}>
            {priorities.rationale}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {priorities.priorities.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card, #1e293b)',
                  border: '1px solid var(--border-color, #334155)',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan, #38bdf8)' }}>
                      #{idx + 1}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: getTierColor(item.priority_tier),
                        color: '#fff',
                      }}
                    >
                      {item.priority_tier}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-muted, #94a3b8)',
                      }}
                    >
                      {item.primary_category}
                    </span>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 600, margin: 0, color: 'var(--text-primary, #f8fafc)' }}>
                      {item.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
                      Score: <strong>{item.priority_score}</strong>/100
                    </span>
                    <button
                      onClick={() => {
                        setSelectedWorkItemId(item.id);
                        handleCompareStrategies(item.id);
                        setSubTab('strategies');
                      }}
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: 'var(--accent-cyan, #38bdf8)',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Compare Strategies
                    </button>
                  </div>
                </div>

                {/* Problem Statement */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary, #f8fafc)', lineHeight: 1.5 }}>
                  <strong>Problem:</strong> {item.problem_statement}
                </div>

                {/* Recommended Action */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderLeft: '3px solid var(--accent-cyan, #38bdf8)',
                    padding: '10px 14px',
                    borderRadius: 4,
                    fontSize: '0.84rem',
                    color: 'var(--text-primary, #f8fafc)',
                  }}
                >
                  <strong style={{ color: 'var(--accent-cyan, #38bdf8)' }}>Recommended Action:</strong>{' '}
                  {item.recommended_action}
                </div>

                {/* Validation Plan */}
                {item.validation_plan.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted, #94a3b8)', marginBottom: 4 }}>
                      Validation & Verification Plan:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {item.validation_plan.map((vp, vidx) => (
                        <div key={vidx} style={{ fontSize: '0.8rem', color: 'var(--text-muted, #cbd5e1)', display: 'flex', gap: 6, alignItems: 'center' }}>
                          <CheckSquare size={13} style={{ color: 'var(--accent-emerald, #10b981)', flexShrink: 0 }} />
                          <span>{vp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files & Prerequisites */}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>
                  {item.target_files.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <FileCode2 size={13} />
                      <span>Target:</span>
                      {item.target_files.map((tf, tfIdx) => (
                        <span
                          key={tfIdx}
                          onClick={() => {
                            if (onOpenFile) onOpenFile(tf);
                            else if (onOpenImpact) onOpenImpact(tf);
                          }}
                          style={{
                            cursor: (onOpenFile || onOpenImpact) ? 'pointer' : 'default',
                            textDecoration: (onOpenFile || onOpenImpact) ? 'underline' : 'none',
                            color: (onOpenFile || onOpenImpact) ? 'var(--accent-cyan, #38bdf8)' : 'inherit',
                          }}
                        >
                          {tf}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.prerequisite_item_ids.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b' }}>
                      <AlertCircle size={13} />
                      <span>Prerequisites: {item.prerequisite_item_ids.join(', ')}</span>
                    </div>
                  )}
                  <div>
                    <span>Effort: <em>{item.effort_estimate}</em></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB: ROADMAP (Now / Next / Later) --- */}
      {subTab === 'roadmap' && roadmap && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-muted, #94a3b8)' }}>
            {roadmap.executive_summary}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
              alignItems: 'flex-start',
            }}
          >
            {/* NOW Column */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent-rose, #f43f5e)', textTransform: 'uppercase' }}>
                  Now (Immediate)
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted, #94a3b8)' }}>
                  {roadmap.now.length} items
                </span>
              </div>
              {roadmap.now.map((item) => (
                <div
                  key={item.work_item_id}
                  style={{
                    background: 'var(--bg-card, #1e293b)',
                    border: '1px solid var(--border-color, #334155)',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary, #f8fafc)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>
                    {item.summary}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
                    <span style={{ color: getTierColor(item.priority) }}>{item.priority}</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* NEXT Column */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent-cyan, #38bdf8)', textTransform: 'uppercase' }}>
                  Next (Follow-ups)
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted, #94a3b8)' }}>
                  {roadmap.next.length} items
                </span>
              </div>
              {roadmap.next.map((item) => (
                <div
                  key={item.work_item_id}
                  style={{
                    background: 'var(--bg-card, #1e293b)',
                    border: '1px solid var(--border-color, #334155)',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary, #f8fafc)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>
                    {item.summary}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
                    <span style={{ color: getTierColor(item.priority) }}>{item.priority}</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* LATER Column */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase' }}>
                  Later (Future Vision)
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted, #94a3b8)' }}>
                  {roadmap.later.length} items
                </span>
              </div>
              {roadmap.later.map((item) => (
                <div
                  key={item.work_item_id}
                  style={{
                    background: 'var(--bg-card, #1e293b)',
                    border: '1px solid var(--border-color, #334155)',
                    borderRadius: 8,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary, #f8fafc)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>
                    {item.summary}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
                    <span style={{ color: getTierColor(item.priority) }}>{item.priority}</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB: STRATEGIC DECISIONS & SIMULATIONS --- */}
      {subTab === 'strategies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Work Item Selector */}
          <div
            style={{
              background: 'var(--bg-card, #1e293b)',
              border: '1px solid var(--border-color, #334155)',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary, #f8fafc)' }}>
              Select Focus Work Item:
            </div>
            <select
              value={selectedWorkItemId}
              onChange={(e) => {
                setSelectedWorkItemId(e.target.value);
                handleCompareStrategies(e.target.value);
              }}
              style={{
                flex: 1,
                minWidth: 260,
                background: 'rgba(15, 23, 42, 0.8)',
                color: 'var(--text-primary, #f8fafc)',
                border: '1px solid var(--border-color, #334155)',
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: '0.84rem',
              }}
            >
              {priorities?.priorities.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.priority_tier}] {item.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleCompareStrategies(selectedWorkItemId)}
              disabled={isComparingStrategies}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              {isComparingStrategies ? 'Evaluating...' : 'Compare 4 Strategies'}
            </button>

            <button
              onClick={() => handleSimulateIgnore(selectedWorkItemId)}
              disabled={isSimulatingIgnore}
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: 'var(--accent-rose, #f43f5e)',
                borderRadius: 6,
                padding: '8px 16px',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              {isSimulatingIgnore ? 'Simulating...' : 'Simulate What If Ignored'}
            </button>
          </div>

          {/* Simulate Ignore Warning Card */}
          {simulateIgnoreResult && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 12,
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-rose, #f43f5e)', fontWeight: 700 }}>
                <AlertTriangle size={18} />
                <span>Simulation: Consequences of Ignoring "{simulateIgnoreResult.title}"</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary, #f8fafc)', lineHeight: 1.5 }}>
                {simulateIgnoreResult.consequence_summary}
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', marginTop: 4 }}>
                <span>Compounded Risk Score: <strong style={{ color: 'var(--accent-rose, #f43f5e)' }}>{simulateIgnoreResult.accumulated_risk_score}/100</strong></span>
                <span>Affected Downstream Components: <strong>{simulateIgnoreResult.affected_components.length}</strong></span>
              </div>
            </div>
          )}

          {/* Strategy Comparison Cards */}
          {strategyComparison && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary, #f8fafc)',
                }}
              >
                <strong>AI CTO Synthesis:</strong> {strategyComparison.synthesis}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 16,
                }}
              >
                {strategyComparison.options.map((opt) => (
                  <div
                    key={opt.strategy_type}
                    style={{
                      background: 'var(--bg-card, #1e293b)',
                      border: opt.is_recommended ? '2px solid var(--accent-cyan, #38bdf8)' : '1px solid var(--border-color, #334155)',
                      borderRadius: 12,
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      position: 'relative',
                    }}
                  >
                    {opt.is_recommended && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -10,
                          right: 14,
                          background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                          color: '#fff',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        Recommended
                      </span>
                    )}

                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-cyan, #38bdf8)' }}>
                        {opt.strategy_type}
                      </span>
                      <h4 style={{ margin: '4px 0 0 0', fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
                        {opt.title}
                      </h4>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>
                      {opt.description}
                    </p>

                    {/* Pros */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-emerald, #10b981)', marginBottom: 2 }}>
                        Advantages:
                      </div>
                      {opt.pros.map((p, pidx) => (
                        <div key={pidx} style={{ fontSize: '0.76rem', color: 'var(--text-primary, #f8fafc)', display: 'flex', gap: 4 }}>
                          <span>+</span> <span>{p}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cons */}
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-rose, #f43f5e)', marginBottom: 2 }}>
                        Trade-offs:
                      </div>
                      {opt.cons.map((c, cidx) => (
                        <div key={cidx} style={{ fontSize: '0.76rem', color: 'var(--text-muted, #94a3b8)', display: 'flex', gap: 4 }}>
                          <span>-</span> <span>{c}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted, #94a3b8)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 8 }}>
                      <span>Blast Radius: <strong>{opt.blast_radius}</strong></span>
                      <span>Complexity: <strong>{opt.estimated_complexity}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SUBTAB: PERSISTED PLANS & VERSIONING --- */}
      {subTab === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted, #94a3b8)' }}>
              Historical and active engineering roadmaps generated for this repository.
            </span>
            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Generate Plan Revision
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plansList?.plans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted, #94a3b8)' }}>
                No engineering plans generated yet. Click "Generate Plan Revision" to create Plan v1.
              </div>
            ) : (
              plansList?.plans.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--bg-card, #1e293b)',
                    border: '1px solid var(--border-color, #334155)',
                    borderRadius: 10,
                    padding: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={async () => {
                    const fullPlan = await api.getEngineeringPlan(repositoryId, p.id);
                    setActivePlan(fullPlan);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: 'var(--accent-cyan, #38bdf8)',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                      }}
                    >
                      v{p.version}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--text-primary, #f8fafc)' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>
                        Horizon: {p.time_horizon.replace('_', ' ')} · Work items: {p.work_item_count} · Created: {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: p.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        color: p.status === 'active' ? 'var(--accent-emerald, #10b981)' : 'var(--text-muted, #94a3b8)',
                      }}
                    >
                      {p.status.toUpperCase()}
                    </span>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted, #94a3b8)' }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detailed Modal / Plan View */}
          {activePlan && (
            <div
              style={{
                marginTop: 20,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid var(--accent-cyan, #38bdf8)44',
                borderRadius: 12,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary, #f8fafc)' }}>
                  {activePlan.title}
                </h3>
                <button
                  onClick={() => setActivePlan(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted, #94a3b8)',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                  }}
                >
                  Close Plan
                </button>
              </div>

              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.5 }}>
                {activePlan.summary}
              </p>

              <div>
                <h4 style={{ margin: '8px 0', fontSize: '0.92rem', color: 'var(--accent-cyan, #38bdf8)' }}>
                  Work Items Included ({activePlan.work_items.length}):
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {activePlan.work_items.map((wi: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-card, #1e293b)',
                        border: '1px solid var(--border-color, #334155)',
                        borderRadius: 6,
                        padding: '8px 12px',
                        fontSize: '0.82rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
                        {wi.title}
                      </span>
                      <span style={{ color: getTierColor(wi.priority_tier) }}>
                        {wi.priority_tier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
