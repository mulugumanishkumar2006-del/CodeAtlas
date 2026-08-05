'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Code2,
  Building2,
  Database,
  Layers,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  GitPullRequest,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RefactoringExecutionPlanData {
  planTitle: string;
  repository: string;
  confidenceScore: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedEffort: string;
  currentState: string;
  targetArchitecture: string;
  affectedFiles: { path: string; lines: string; action: 'MODIFY' | 'NEW' | 'DELETE' }[];
  affectedServices: string[];
  affectedApis: string[];
  affectedDatabases: string[];
  affectedTests: string[];
  businessImpact: string;
  rollbackStrategy: string[];
  validationSteps: string[];
  deploymentStrategy: string;
  successMetrics: string[];
  linkedPr?: string;
  linkedAdr?: string;
}

const DEFAULT_PLAN: RefactoringExecutionPlanData = {
  planTitle: 'PaymentService REST Router DAL Decoupling & Redis L2 Cache Plan',
  repository: 'codeatlas/payments-service',
  confidenceScore: '98.4%',
  riskRating: 'LOW',
  estimatedEffort: '2 Days (~14 files modified)',
  currentState: 'Direct inline raw SQL queries inside PaymentService/router.py HTTP route handlers bypass repository DAL abstraction, cause database connection locks under 50k QPS, and prevent Redis caching.',
  targetArchitecture: 'Decoupled Payments Data Access Layer (DAL) repository class app/payments/dal.py with Redis L2 write-through token validation cache pool and clean layer boundary enforcement.',
  affectedFiles: [
    { path: 'apps/backend/app/payments/router.py', lines: 'L142-L168', action: 'MODIFY' },
    { path: 'apps/backend/app/payments/dal.py', lines: 'NEW FILE', action: 'NEW' },
    { path: 'apps/backend/app/payments/service.py', lines: 'L40-L88', action: 'MODIFY' },
    { path: 'config/redis.yaml', lines: 'L12-L24', action: 'MODIFY' },
    { path: 'tests/test_payments_dal.py', lines: 'NEW FILE', action: 'NEW' }
  ],
  affectedServices: ['Payment Processing Service', 'Auth Gateway & Identity'],
  affectedApis: ['POST /v1/checkout/stripe-webhook', 'GET /v1/merchants/accounts'],
  affectedDatabases: ['PostgreSQL merchant_accounts table', 'Redis token_cache cluster'],
  affectedTests: ['tests/test_payments.py', 'tests/test_auth_gateway.py'],
  businessImpact: 'Recovers $18.5k/yr technical debt drag, eliminates DB connection locks under 50k QPS load, and ensures 99.99% checkout availability.',
  rollbackStrategy: [
    '1. Revert Git branch merge commit on PR #145',
    '2. Flush Redis L2 token cache keys',
    '3. Re-index Knowledge Graph to restore baseline state'
  ],
  validationSteps: [
    'Run AST boundary validation to verify 0 direct raw SQL executions in router.py',
    'Run 142 unit & integration test assertions with 100% pass rate',
    'Execute Digital Twin scenario load test simulation verifying P99 latency < 12ms'
  ],
  deploymentStrategy: 'Zero-downtime rolling update canary deployment with automatic rollback triggered if error rate > 0.01%.',
  successMetrics: [
    'P99 Latency < 12.0ms under 50,000 QPS burst traffic',
    'Zero database connection pool exhaustion events',
    'Architecture Health score increases from 82.0 to 94.2 (+12.2 points)'
  ],
  linkedPr: 'PR #145 (refactor/payments-dal-decoupling)',
  linkedAdr: 'ADR-042 (Decoupled Data Access Layer Standard)'
};

export function AiRefactoringExecutionPlan() {
  const [plan] = useState<RefactoringExecutionPlanData>(DEFAULT_PLAN);

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-6 font-sans select-none">
      {/* Plan Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5 font-mono">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase">
              AI EXECUTION PLAN SPECIFICATION
            </span>
            <span className="text-cyan-400 text-xs font-bold">{plan.repository}</span>
          </div>

          <h2 className="text-lg font-black text-white leading-snug">{plan.planTitle}</h2>
        </div>

        <div className="text-right shrink-0 font-mono">
          <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Confidence: {plan.confidenceScore}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Est. Effort: {plan.estimatedEffort}</span>
        </div>
      </div>

      {/* Current State vs Target Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
          <span className="font-extrabold text-rose-400 uppercase block">CURRENT STATE (BEFORE REFACTORING)</span>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">{plan.currentState}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
          <span className="font-extrabold text-emerald-400 uppercase block">TARGET ARCHITECTURE (AFTER REFACTORING)</span>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">{plan.targetArchitecture}</p>
        </div>
      </div>

      {/* Affected Code & Infrastructure Artifacts */}
      <div className="space-y-3 font-mono text-xs">
        <span className="text-[10px] text-slate-500 uppercase font-bold block flex items-center gap-1">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" /> AFFECTED FILES, SERVICES, APIS & DATABASES ({plan.affectedFiles.length} FILES):
        </span>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          {/* Files List */}
          <div className="space-y-1.5">
            {plan.affectedFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      file.action === 'MODIFY'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : file.action === 'NEW'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {file.action}
                  </span>
                  <span className="font-bold text-slate-200">{file.path}</span>
                </div>
                <span className="text-slate-500 text-[10px]">{file.lines}</span>
              </div>
            ))}
          </div>

          {/* Infrastructure Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-900">
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Affected Services:</span>
              <span className="text-cyan-300 font-bold">{plan.affectedServices.join(', ')}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Affected APIs:</span>
              <span className="text-purple-300 font-bold">{plan.affectedApis.join(', ')}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Affected Databases:</span>
              <span className="text-emerald-400 font-bold">{plan.affectedDatabases.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Steps & Rollback Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
          <span className="font-extrabold text-cyan-300 uppercase block flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> VALIDATION STEPS:
          </span>
          <ul className="space-y-1.5 text-slate-300 text-xs font-sans pl-2">
            {plan.validationSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
          <span className="font-extrabold text-rose-400 uppercase block flex items-center gap-1">
            <RotateCcw className="w-4 h-4 text-rose-400" /> ROLLBACK STRATEGY:
          </span>
          <ul className="space-y-1.5 text-slate-300 text-xs font-sans pl-2">
            {plan.rollbackStrategy.map((rb, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                <span>{rb}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Linked PRs & Governance Specs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-900 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <GitPullRequest className="w-4 h-4 text-purple-400" /> Linked Pull Request: <strong className="text-cyan-300">{plan.linkedPr}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <FileText className="w-4 h-4 text-indigo-400" /> Linked Spec: <strong className="text-indigo-300">{plan.linkedAdr}</strong>
          </span>
        </div>

        <Link href="/improve">
          <Button size="sm" className="h-8 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-1 cursor-pointer">
            Approve & Merge Refactoring PR &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
