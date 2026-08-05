'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Search,
  Building2,
  Layers,
  ShieldCheck,
  Zap,
  Flame,
  Brain,
  Play,
  Activity,
  ArrowUpRight,
  Code2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Network,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface InvestigationReportData {
  title: string;
  repository: string;
  confidenceScore: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  executiveSummary: string;
  affectedComponents: { name: string; type: string; healthScore: number }[];
  evidenceList: {
    filePath: string;
    lineRange: string;
    description: string;
    codeSnippet: string;
  }[];
  timeline: { time: string; event: string }[];
  rootCauses: string[];
  secondaryCauses: string[];
  businessImpact: string;
  engineeringImpact: string;
  suggestedFixes: { title: string; effort: string; impact: string; fixUrl: string }[];
  alternativeSolutions: string[];
  simulationResults: { scenario: string; latencyBefore: string; latencyAfter: string; qpsCapacity: string };
  estimatedEffort: string;
  migrationPlan: string[];
  rollbackPlan: string[];
}

const DEFAULT_REPORT: InvestigationReportData = {
  title: 'Root-Cause Investigation: Stripe Ingress Latency & DB Lock Contention',
  repository: 'codeatlas/payments-service',
  confidenceScore: '98.4%',
  severity: 'CRITICAL',
  executiveSummary: 'Payment Processing Service experienced a P99 latency spike (+45ms) during 50,000 QPS burst traffic due to direct inline raw SQL queries inside route handlers bypassing repository DAL and preventing Redis L2 caching.',
  affectedComponents: [
    { name: 'PaymentService REST Router', type: 'API Ingress', healthScore: 78 },
    { name: 'PostgreSQL Connection Pool', type: 'Database', healthScore: 65 },
    { name: 'Auth Gateway Token Validator', type: 'Identity Service', healthScore: 91 }
  ],
  evidenceList: [
    {
      filePath: 'apps/backend/app/payments/router.py',
      lineRange: 'L142-L168',
      description: 'Raw SQL query executed directly inside HTTP handler function bypassing DAL repository abstraction',
      codeSnippet: `cursor.execute("SELECT * FROM merchant_accounts WHERE stripe_id = %s", (stripe_id,))`
    },
    {
      filePath: 'services/auth/jwt_validator.go',
      lineRange: 'L88-L104',
      description: 'Synchronous DB query for JWT token verification during 50k QPS ingress load',
      codeSnippet: `err := db.QueryRowContext(ctx, "SELECT status FROM tokens WHERE id = $1", tokenId).Scan(&status)`
    }
  ],
  timeline: [
    { time: '10:00 AM', event: '50,000 QPS burst traffic initiated in load test environment' },
    { time: '10:02 AM', event: 'PostgreSQL connection pool saturation reached 94% threshold' },
    { time: '10:05 AM', event: 'Stripe webhook ingestion handler latency degraded from 12ms to 57ms' },
    { time: '10:08 AM', event: 'AI Investigation Engine auto-indexed AST call tree and traced root cause' }
  ],
  rootCauses: [
    'Direct inline raw SQL queries in route handlers break clean architecture DAL isolation.',
    'Synchronous DB token validation causes connection pool locks under high QPS load.'
  ],
  secondaryCauses: [
    'Missing Redis write-through cache pool allocation for token verification.',
    'Legacy Pydantic v1 config object deprecation warnings in analytics worker.'
  ],
  businessImpact: '$18.5k/yr Technical Debt Drag & Risk of Checkout Ingress Downtime',
  engineeringImpact: 'High Coupling, DB Lock Spikes, and Reduced Development Velocity',
  suggestedFixes: [
    {
      title: 'Extract Payments DAL Repository & Deploy Redis Write-Through Cache',
      effort: '2 Days (~14 files)',
      impact: 'Eliminates DB Lock Contention & Boosts Ingress QPS by +350%',
      fixUrl: '/improve'
    }
  ],
  alternativeSolutions: [
    'Option B: Increase PostgreSQL max_connections pool size (Temporary Band-aid, does not resolve architectural drift)',
    'Option C: Deploy gRPC inter-service RPC for auth token verification'
  ],
  simulationResults: {
    scenario: 'Redis L2 Write-Through Cache Load Test',
    latencyBefore: '57.0ms',
    latencyAfter: '11.4ms',
    qpsCapacity: '50,000 QPS'
  },
  estimatedEffort: '2 Days Engineering Effort (~14 files modified)',
  migrationPlan: [
    'Phase 1: Create PaymentsRepository class in app/payments/dal.py',
    'Phase 2: Wrap raw SQL queries in parameterized methods with Redis write-through cache',
    'Phase 3: Refactor router.py to call PaymentsRepository methods',
    'Phase 4: Run Digital Twin load test simulation to verify sub-12ms P99 latency'
  ],
  rollbackPlan: [
    '1. Revert Git PR branch commit',
    '2. Reset Redis cluster cache pool keys',
    '3. Re-index Knowledge Graph to restore baseline state'
  ]
};

export function AiInvestigationReport() {
  const [report] = useState<InvestigationReportData>(DEFAULT_REPORT);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EVIDENCE' | 'MIGRATION' | 'SIMULATION'>('OVERVIEW');

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-6 font-sans select-none">
      {/* Report Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5 font-mono">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase">
              {report.severity} INCIDENT REPORT
            </span>
            <span className="text-cyan-400 text-xs font-bold">{report.repository}</span>
          </div>

          <h2 className="text-xl font-black text-white leading-snug">{report.title}</h2>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            AI Confidence: {report.confidenceScore}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Generated by CodeAtlas AI</span>
        </div>
      </div>

      {/* Subsystem Direct Navigation Bar */}
      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-900 font-mono text-xs space-y-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold block flex items-center gap-1">
          <ExternalLink className="w-3 h-3 text-cyan-400" /> NAVIGATE DIRECTLY FROM EVIDENCE TO CODEATLAS TOOLS:
        </span>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <Link href="/repositories">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <Building2 className="w-3 h-3 text-cyan-400" /> Repositories
            </span>
          </Link>
          <Link href="/architecture">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <Layers className="w-3 h-3 text-indigo-400" /> Architecture Graph
            </span>
          </Link>
          <Link href="/knowledge">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <FileText className="w-3 h-3 text-purple-400" /> Knowledge Graph
            </span>
          </Link>
          <Link href="/analyze">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Call Graph Analysis
            </span>
          </Link>
          <Link href="/simulate">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <Play className="w-3 h-3 text-rose-400" /> Simulation Studio
            </span>
          </Link>
          <Link href="/dependency-graph">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <Network className="w-3 h-3 text-blue-400" /> Dependency Graph
            </span>
          </Link>
          <Link href="/security">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <ShieldCheck className="w-3 h-3 text-teal-400" /> Security Report
            </span>
          </Link>
          <Link href="/tech-debt">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <Flame className="w-3 h-3 text-amber-400" /> Technical Debt
            </span>
          </Link>
          <Link href="/monitor">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 flex items-center gap-1 cursor-pointer">
              <Activity className="w-3 h-3 text-cyan-400" /> Monitoring
            </span>
          </Link>
        </div>
      </div>

      {/* Report Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
        {['OVERVIEW', 'EVIDENCE', 'MIGRATION', 'SIMULATION'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 font-sans">
          {/* Executive Summary */}
          <div className="space-y-2 font-mono">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">EXECUTIVE SUMMARY:</span>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-2xl border border-slate-900">
              {report.executiveSummary}
            </p>
          </div>

          {/* Root Causes vs Impacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <span className="font-black text-rose-400 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Root Causes Discovered
              </span>
              <ul className="space-y-1 text-slate-300 text-xs font-sans pl-2">
                {report.rootCauses.map((rc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{rc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-black text-amber-400 uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> Business & Engineering Impact
              </span>
              <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold">Business Impact:</span>
                  <span className="text-emerald-400 font-mono font-bold">{report.businessImpact}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold">Engineering Impact:</span>
                  <span className="text-slate-300 font-sans">{report.engineeringImpact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline of Findings */}
          <div className="space-y-2 font-mono text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">INVESTIGATION TIMELINE LOG:</span>
            <div className="space-y-2 pl-4 border-l border-slate-800">
              {report.timeline.map((t, i) => (
                <div key={i} className="relative pl-4 space-y-0.5 font-mono">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <div className="text-[10px] text-slate-500">{t.time}</div>
                  <div className="text-slate-200 font-sans text-xs">{t.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EVIDENCE' && (
        <div className="space-y-4 font-mono text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">EMPIRICAL AST CODE EVIDENCE:</span>
          {report.evidenceList.map((ev, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-cyan-400" /> {ev.filePath}#{ev.lineRange}
                </span>
                <Link href="/analyze">
                  <Button size="sm" variant="outline" className="h-6 px-2 text-[10px] bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-lg">
                    Inspect AST Node <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                  </Button>
                </Link>
              </div>

              <p className="text-slate-400 font-sans text-xs">{ev.description}</p>

              <pre className="p-3 bg-slate-900 rounded-xl text-slate-300 text-xs overflow-x-auto border border-slate-800 font-mono">
                <code>{ev.codeSnippet}</code>
              </pre>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'MIGRATION' && (
        <div className="space-y-4 font-sans text-xs">
          <div className="space-y-2 font-mono">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">RECOMMENDED MIGRATION PLAN:</span>
            <div className="space-y-2 font-sans">
              {report.migrationPlan.map((step, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-900 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-slate-200 text-xs">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 font-mono pt-3 border-t border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">ROLLBACK PLAN:</span>
            <ul className="space-y-1 text-slate-400 text-xs font-sans pl-2">
              {report.rollbackPlan.map((rb, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>{rb}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'SIMULATION' && (
        <div className="space-y-4 font-mono text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">DIGITAL TWIN SIMULATION RESULTS:</span>
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <h4 className="font-extrabold text-cyan-300 text-sm">{report.simulationResults.scenario}</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">P99 Before</span>
                <span className="font-bold text-rose-400 text-base">{report.simulationResults.latencyBefore}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">P99 After Fix</span>
                <span className="font-bold text-emerald-400 text-base">{report.simulationResults.latencyAfter}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block font-bold">QPS Capacity</span>
                <span className="font-bold text-cyan-300 text-base">{report.simulationResults.qpsCapacity}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link href="/simulate">
                <Button size="sm" className="h-8 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-1 cursor-pointer">
                  <Play className="w-3.5 h-3.5" /> Re-Run Simulation Scenario
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
