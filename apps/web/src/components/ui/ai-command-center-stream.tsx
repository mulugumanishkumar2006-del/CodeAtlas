'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Play,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronRight,
  ChevronDown,
  Pause,
  Clock,
  ExternalLink,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Flame,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  repository: string;
  category: 'Repository Indexed' | 'Dependency Graph' | 'Architecture Drift' | 'Security Scan' | 'Simulation' | 'Technical Debt' | 'Knowledge Graph' | 'AI Recommendation';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  summary: string;
  evidence: {
    filePath: string;
    lineRange: string;
    astSymbol?: string;
    codeSnippet?: string;
  };
  suggestedActions: {
    label: string;
    actionType: 'investigate' | 'simulate' | 'patch' | 'view';
    targetUrl: string;
  }[];
}

const INITIAL_EVENTS: ActivityEvent[] = [
  {
    id: 'evt-1',
    timestamp: 'Just now',
    repository: 'codeatlas/payments-service',
    category: 'Architecture Drift',
    severity: 'HIGH',
    title: 'Direct REST Router SQL Execution Detected',
    summary: 'Direct inline raw SQL queries executed inside PaymentService handlers bypass architectural repository abstraction and prevent Redis cache usage.',
    evidence: {
      filePath: 'apps/backend/app/payments/router.py',
      lineRange: 'L142-L168',
      astSymbol: 'process_stripe_webhook_event()',
      codeSnippet: `cursor.execute("SELECT * FROM merchant_accounts WHERE stripe_id = %s", (stripe_id,))`
    },
    suggestedActions: [
      { label: 'Open Investigation', actionType: 'investigate', targetUrl: '/investigate' },
      { label: 'Simulate DAL Refactor', actionType: 'simulate', targetUrl: '/simulate' },
      { label: 'Auto Patch Code', actionType: 'patch', targetUrl: '/improve' }
    ]
  },
  {
    id: 'evt-2',
    timestamp: '2m ago',
    repository: 'codeatlas/auth-gateway',
    category: 'Security Scan',
    severity: 'CRITICAL',
    title: 'High Load Database Token Lock Contention',
    summary: 'Synchronous DB query for JWT token validation under 50k QPS load causes connection pool exhaustion and +45ms latency degradation.',
    evidence: {
      filePath: 'services/auth/jwt_validator.go',
      lineRange: 'L88-L104',
      astSymbol: 'ValidateJWTBearerToken()',
      codeSnippet: `err := db.QueryRowContext(ctx, "SELECT status FROM tokens WHERE id = $1", tokenId).Scan(&status)`
    },
    suggestedActions: [
      { label: 'Deploy Redis Auth Cache', actionType: 'patch', targetUrl: '/improve' },
      { label: 'Run QPS Simulation', actionType: 'simulate', targetUrl: '/simulate' }
    ]
  },
  {
    id: 'evt-3',
    timestamp: '5m ago',
    repository: 'codeatlas/analytics-pipeline',
    category: 'Simulation',
    severity: 'INFO',
    title: 'Kafka Microservices Split Scenario Completed',
    summary: 'Simulation engine successfully split monolithic stream consumers into 3 decoupled worker pods. Latency reduced by 34%.',
    evidence: {
      filePath: 'deployments/k8s/analytics-workers.yaml',
      lineRange: 'L12-L45',
      astSymbol: 'AnalyticsWorkerConsumerGroup',
      codeSnippet: `replicas: 3\nstrategy: RollingUpdate\nmaxSurge: 1`
    },
    suggestedActions: [
      { label: 'Review Simulation Results', actionType: 'view', targetUrl: '/simulate' }
    ]
  },
  {
    id: 'evt-4',
    timestamp: '12m ago',
    repository: 'codeatlas/core-suite',
    category: 'Knowledge Graph',
    severity: 'INFO',
    title: '142,500 AST Nodes Synchronized',
    summary: 'Full semantic parsing of TypeScript and Python codebase completed. Knowledge graph updated with 24 layer boundary rules.',
    evidence: {
      filePath: 'packages/core/ast_graph_builder.ts',
      lineRange: 'L1-L220',
      astSymbol: 'ASTGraphEngine',
      codeSnippet: `export class ASTGraphEngine { parseSymbols(files: string[]) { ... } }`
    },
    suggestedActions: [
      { label: 'Explore Knowledge Graph', actionType: 'view', targetUrl: '/architecture' }
    ]
  }
];

export function AiCommandCenterStream() {
  const [events, setEvents] = useState<ActivityEvent[]>(INITIAL_EVENTS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>('evt-1');

  // Simulated live streaming ticks every 10 seconds if streaming is active
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const liveEventsList: Array<Omit<ActivityEvent, 'id' | 'timestamp'>> = [
        {
          repository: 'codeatlas/payments-service',
          category: 'Dependency Graph',
          severity: 'MEDIUM',
          title: 'Dependency Graph Rebuilt for Payment Pod',
          summary: 'Package manager resolution updated. 28 packages verified with zero security advisories.',
          evidence: {
            filePath: 'apps/backend/pyproject.toml',
            lineRange: 'L15-L30',
            astSymbol: 'DependencyTree'
          },
          suggestedActions: [
            { label: 'View Graph', actionType: 'view', targetUrl: '/dependency-graph' }
          ]
        },
        {
          repository: 'codeatlas/auth-gateway',
          category: 'Technical Debt',
          severity: 'LOW',
          title: 'Unused Route Handler Identified',
          summary: 'Route handler /v1/auth/legacy-login received zero traffic over 90 days. Recommended for cleanup.',
          evidence: {
            filePath: 'services/auth/legacy_router.go',
            lineRange: 'L40-L65',
            astSymbol: 'HandleLegacyLogin()'
          },
          suggestedActions: [
            { label: 'Auto Remove Code', actionType: 'patch', targetUrl: '/improve' }
          ]
        }
      ];

      const randomEvt = liveEventsList[Math.floor(Math.random() * liveEventsList.length)];
      const newEvt: ActivityEvent = {
        ...randomEvt,
        id: `evt-${Date.now()}`,
        timestamp: 'Just now'
      };

      setEvents((prev) => [newEvt, ...prev.slice(0, 7)]);
    }, 12000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredEvents = events.filter((evt) => {
    if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;
    if (selectedSeverity !== 'ALL' && evt.severity !== selectedSeverity) return false;
    return true;
  });

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              Real-Time AI Activity Stream
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Continuous live telemetry feed of repository indexing, drift detection, and AI recommendations.
            </p>
          </div>
        </div>

        {/* Live Streaming Toggle & Stats */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            {isStreaming ? 'STREAMING LIVE' : 'STREAM PAUSED'}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsStreaming((p) => !p)}
            className="h-8 text-xs font-mono font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl gap-1.5 cursor-pointer"
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            {isStreaming ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Category & Severity Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> CATEGORY:
          </span>
          {['ALL', 'Architecture Drift', 'Security Scan', 'Simulation', 'Knowledge Graph'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[10px] uppercase font-bold">SEVERITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                selectedSeverity === sev
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Event Stream List */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {filteredEvents.map((evt) => {
            const isExpanded = expandedEventId === evt.id;

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-xl'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Collapsed Header Line */}
                <div
                  onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                  className="p-4 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full block ${
                          evt.severity === 'CRITICAL'
                            ? 'bg-rose-500 animate-ping'
                            : evt.severity === 'HIGH'
                            ? 'bg-amber-400'
                            : evt.severity === 'MEDIUM'
                            ? 'bg-cyan-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            evt.severity === 'CRITICAL'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : evt.severity === 'HIGH'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {evt.severity}
                        </span>
                        <span className="font-bold text-slate-300">{evt.category}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-cyan-400">{evt.repository}</span>
                      </div>

                      <h3 className="font-bold text-white text-sm leading-snug">{evt.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" /> {evt.timestamp}
                    </span>
                    <button className="text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 border-t border-slate-800/80 pt-3 space-y-3 font-sans text-xs"
                  >
                    <p className="text-slate-300 leading-relaxed font-sans">{evt.summary}</p>

                    {/* AST & File Evidence Card */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                          Evidence: <span className="text-cyan-300">{evt.evidence.filePath}#{evt.evidence.lineRange}</span>
                        </span>
                        {evt.evidence.astSymbol && (
                          <span className="text-purple-300 text-[10px] bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            Symbol: {evt.evidence.astSymbol}
                          </span>
                        )}
                      </div>

                      {evt.evidence.codeSnippet && (
                        <pre className="p-2.5 bg-slate-900 rounded-lg text-slate-300 text-[11px] overflow-x-auto border border-slate-800/60 font-mono">
                          <code>{evt.evidence.codeSnippet}</code>
                        </pre>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <span className="text-[10px] font-mono text-slate-500">Suggested Autonomous Workflows:</span>
                      <div className="flex items-center gap-2 font-mono">
                        {evt.suggestedActions.map((act, i) => (
                          <Link key={i} href={act.targetUrl}>
                            <Button
                              size="sm"
                              className={`h-7 px-3 text-[11px] font-bold rounded-xl gap-1 cursor-pointer ${
                                act.actionType === 'patch'
                                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md'
                                  : 'bg-slate-900 border border-slate-800 text-slate-200 hover:text-white'
                              }`}
                            >
                              {act.actionType === 'patch' && <Sparkles className="w-3 h-3 text-cyan-200" />}
                              {act.actionType === 'simulate' && <Play className="w-3 h-3 text-indigo-400" />}
                              {act.actionType === 'investigate' && <Brain className="w-3 h-3 text-purple-400" />}
                              {act.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
