'use client';

import React from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  LineChart,
  Flame,
  ArrowUpRight,
  GitBranch,
  ShieldCheck,
  Cpu,
  Info,
  Clock,
  Sparkles,
  Server,
  Database,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceOverviewTab() {
  const metrics = [
    { label: 'Overall Workspace Health', score: 93.4, delta: '+1.8%', color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'Architecture Health', score: 95.0, delta: '+2.4%', color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'Security Intelligence', score: 88.5, delta: '-0.5%', color: 'text-amber-400', border: 'border-amber-500/30' },
    { label: 'Performance & Latency', score: 94.2, delta: '+0.9%', color: 'text-sky-400', border: 'border-sky-500/30' },
    { label: 'Technical Debt Control', score: 84.0, delta: '+3.1%', color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { label: 'Code Quality Rating', score: 91.8, delta: '+1.2%', color: 'text-teal-400', border: 'border-teal-500/30' },
  ];

  const criticalSystems = [
    {
      id: 'sys-auth-gateway',
      name: 'AuthGatewayService',
      repo: 'auth-gateway-service',
      criticality: 'CRITICAL',
      centrality: 0.96,
      consumers: 11,
      providers: 2,
      evidence: [
        'Inbound HTTP API dependency from 11 connected microservices',
        'Single OAuth2 JWT issuer for public ingress routers',
        'Direct connection to Session Lock Redis Cluster & User DB',
      ],
    },
    {
      id: 'sys-payment-core',
      name: 'PaymentProcessingEngine',
      repo: 'payment-processing-core',
      criticality: 'CRITICAL',
      centrality: 0.92,
      consumers: 8,
      providers: 4,
      evidence: [
        'Direct Stripe API & ACID ledger transactional locks',
        'Consumes AuthGateway token verification service',
        'Produces audit Kafka events to LedgerService & Analytics',
      ],
    },
  ];

  const activeRisks = [
    {
      id: 'risk-1',
      severity: 'HIGH',
      title: 'Shared Vulnerable Dependency across 4 Repositories',
      affectedRepos: ['auth-gateway-service', 'billing-invoice-engine', 'checkout-service', 'user-profile-repo'],
      impact: 'JWT verification potential signature forgery vulnerability (CVE-2026-4491)',
      recommendation: 'Upgrade @acme/sec-vault package from v1.2.0 to v2.1.0 in lockfiles.',
    },
    {
      id: 'risk-2',
      severity: 'MEDIUM',
      title: 'Tight Architectural Coupling: Payment Engine -> Analytics DB',
      affectedRepos: ['payment-processing-core', 'analytics-db-repo'],
      impact: 'Direct DB table read bypasses Analytics API abstraction layer.',
      recommendation: 'Refactor query to consume Analytics GraphQL Ingress instead of raw DB connection.',
    },
  ];

  const recentChanges = [
    {
      id: 'c1',
      time: '12 minutes ago',
      repo: 'payment-processing-core',
      author: 'Sarah Chen',
      summary: 'feat: add Idempotency-Key header support to /v1/charge API',
      risk: 'LOW',
    },
    {
      id: 'c2',
      time: '45 minutes ago',
      repo: 'auth-gateway-service',
      author: 'Alex Rivera',
      summary: 'refactor: rotate OAuth RS256 keypair cache timeout interval',
      risk: 'LOW',
    },
    {
      id: 'c3',
      time: '2 hours ago',
      repo: 'billing-invoice-engine',
      author: 'Elena Rostova',
      summary: 'fix: recalculate EU VAT tax rates for enterprise annual plans',
      risk: 'MEDIUM',
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-100 font-sans scrollbar-none">
      {/* Weighted Multi-Repo Health Metrics Cards Grid */}
      <div>
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>WORKSPACE WEIGHTED INTELLIGENCE METRICS</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          {metrics.map((m) => (
            <div key={m.label} className={`p-4 rounded-2xl bg-slate-900/80 border ${m.border} flex flex-col justify-between shadow-lg`}>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider truncate">{m.label}</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`text-2xl font-black ${m.color}`}>{m.score}</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  {m.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Systemically Important Systems & Active Cross-Repo Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Systemically Important System Detection */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Critical System Detection</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Evidence-Based
            </span>
          </div>

          <div className="space-y-4">
            {criticalSystems.map((sys) => (
              <div key={sys.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">{sys.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {sys.criticality} (Centrality: {sys.centrality})
                  </span>
                </div>

                <p className="text-xs font-mono text-slate-400">
                  Repo: <span className="text-cyan-300">{sys.repo}</span> • Consumers: <span className="text-emerald-400">{sys.consumers} microservices</span>
                </p>

                <div className="space-y-1 pt-1 font-sans text-xs">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Detection Evidence:</span>
                  {sys.evidence.map((ev, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Cross-Repository Risks */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cross-Repository Risks</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Active Radar
            </span>
          </div>

          <div className="space-y-4">
            {activeRisks.map((risk) => (
              <div key={risk.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-xs font-bold text-amber-300">{risk.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {risk.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-400">{risk.impact}</p>

                <div className="flex items-center gap-1.5 flex-wrap pt-1 font-mono text-[10px]">
                  <span className="text-slate-500">Affected Repos:</span>
                  {risk.affectedRepos.map((repo) => (
                    <span key={repo} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                      {repo}
                    </span>
                  ))}
                </div>

                <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-200">
                  💡 <b>AI Recommendation:</b> {risk.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Workspace Changes Feed */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Cross-Repository Commit & Change Feed</span>
        </h3>

        <div className="space-y-2 font-mono text-xs">
          {recentChanges.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GitBranch className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{c.summary}</span>
                    <span className="text-[10px] text-slate-500">by {c.author}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">{c.repo}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-slate-500">{c.time}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Risk: {c.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
