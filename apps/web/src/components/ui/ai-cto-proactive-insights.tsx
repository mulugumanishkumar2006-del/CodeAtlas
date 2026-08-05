'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Clock,
  Layers,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Filter,
  XCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProactiveCtoRecommendation {
  id: string;
  title: string;
  repository: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: string;
  businessImpact: string;
  engineeringImpact: string;
  estimatedEffort: string;
  evidence: {
    filePath: string;
    lineRange: string;
    snippet: string;
  };
  suggestedFix: string;
  simulationShortcutUrl: string;
  fixActionUrl: string;
}

const RECOMMENDATIONS: ProactiveCtoRecommendation[] = [
  {
    id: 'rec-god-service',
    title: 'Payment Service Is Becoming a God Service',
    repository: 'codeatlas/payments-service',
    category: 'Architecture Drift',
    priority: 'CRITICAL',
    confidence: '98.4%',
    businessImpact: '$18.5k/yr Tech Debt Drag',
    engineeringImpact: 'High Coupling & Fragile Deployments',
    estimatedEffort: '2 Days (~14 files)',
    evidence: {
      filePath: 'apps/backend/app/payments/router.py',
      lineRange: 'L142-L168',
      snippet: `cursor.execute("SELECT * FROM merchant_accounts WHERE stripe_id = %s", (stripe_id,))`
    },
    suggestedFix: 'Extract raw SQL route handlers into dedicated Payments Data Access Repository (DAL).',
    simulationShortcutUrl: '/simulate',
    fixActionUrl: '/improve'
  },
  {
    id: 'rec-auth-coupling',
    title: 'Authentication Module Has Increasing Coupling',
    repository: 'codeatlas/auth-gateway',
    category: 'Module Isolation',
    priority: 'HIGH',
    confidence: '96.5%',
    businessImpact: '+45ms Ingress Latency',
    engineeringImpact: 'Synchronous DB Connection Contention',
    estimatedEffort: '4 Hours',
    evidence: {
      filePath: 'services/auth/jwt_validator.go',
      lineRange: 'L88-L104',
      snippet: `err := db.QueryRowContext(ctx, "SELECT status FROM tokens WHERE id = $1", tokenId).Scan(&status)`
    },
    suggestedFix: 'Deploy Redis L2 write-through token validation cache.',
    simulationShortcutUrl: '/simulate',
    fixActionUrl: '/improve'
  },
  {
    id: 'rec-redis-cache',
    title: 'Redis Cache Hit Ratio Decreased (-18%)',
    repository: 'codeatlas/auth-gateway',
    category: 'Performance Regression',
    priority: 'HIGH',
    confidence: '99.1%',
    businessImpact: '35% DB Saturation Risk',
    engineeringImpact: 'Increased DB Load Under 50k QPS',
    estimatedEffort: '1 Hour',
    evidence: {
      filePath: 'config/redis.yaml',
      lineRange: 'L12-L24',
      snippet: `maxmemory-policy: volatile-lru\nttl_seconds: 300`
    },
    suggestedFix: 'Expand Redis cluster cache TTL and memory pool allocation.',
    simulationShortcutUrl: '/simulate',
    fixActionUrl: '/analytics'
  },
  {
    id: 'rec-release18-drift',
    title: 'Architecture Drift Increased After Release 18',
    repository: 'codeatlas/analytics-pipeline',
    category: 'Architecture Drift',
    priority: 'HIGH',
    confidence: '95.2%',
    businessImpact: 'Maintainability Drag',
    engineeringImpact: 'Cross-Layer Package Imports',
    estimatedEffort: '3 Hours',
    evidence: {
      filePath: 'apps/backend/app/analytics/worker.py',
      lineRange: 'L30-L45',
      snippet: `from app.payments.router import process_stripe_webhook_event`
    },
    suggestedFix: 'Re-establish event bus subscriber interface to eliminate direct router import.',
    simulationShortcutUrl: '/simulate',
    fixActionUrl: '/architecture'
  },
  {
    id: 'rec-doc-coverage',
    title: 'Documentation Coverage Dropped Below 85%',
    repository: 'codeatlas/payments-service',
    category: 'Documentation',
    priority: 'MEDIUM',
    confidence: '94.0%',
    businessImpact: 'Slower Onboarding',
    engineeringImpact: 'Missing ADR Spec & API Docstrings',
    estimatedEffort: '45 Mins',
    evidence: {
      filePath: 'apps/backend/app/payments/service.py',
      lineRange: 'L1-L120',
      snippet: `class PaymentService: # missing docstring`
    },
    suggestedFix: 'Auto-generate ADR documentation & API schema docstrings using AI Knowledge Builder.',
    simulationShortcutUrl: '/knowledge',
    fixActionUrl: '/knowledge'
  },
  {
    id: 'rec-dependency-risk',
    title: 'Dependency Risk Detected in Worker Ingress',
    repository: 'codeatlas/analytics-pipeline',
    category: 'Security & Dependency',
    priority: 'MEDIUM',
    confidence: '99.5%',
    businessImpact: 'SOC2 Compliance Warning',
    engineeringImpact: 'Deprecated Package Version',
    estimatedEffort: '1 Hour',
    evidence: {
      filePath: 'pyproject.toml',
      lineRange: 'L22-L28',
      snippet: `pydantic = "^1.10.0"`
    },
    suggestedFix: 'Upgrade Pydantic v1 configs to Pydantic v2 Settings objects.',
    simulationShortcutUrl: '/simulate',
    fixActionUrl: '/improve'
  },
  {
    id: 'rec-simulation-scaling',
    title: 'Digital Twin Simulation Predicts Ingress Scaling Bottleneck',
    repository: 'codeatlas/analytics-pipeline',
    category: 'Scaling Bottleneck',
    priority: 'HIGH',
    confidence: '97.4%',
    businessImpact: 'Traffic Spikes Drop Events',
    engineeringImpact: 'Monolithic Kafka Worker Queue Saturation',
    estimatedEffort: '3 Hours',
    evidence: {
      filePath: 'deployments/k8s/analytics-workers.yaml',
      lineRange: 'L10-L32',
      snippet: `replicas: 1\nconsumer_group: legacy-analytics`
    },
    suggestedFix: 'Split monolithic consumer into 3 decoupled microservice worker pods.',
    simulationShortcutUrl: '/simulate',
    fixActionUrl: '/simulate'
  },
  {
    id: 'rec-health-improved',
    title: 'Core Suite Repository Health Improved (+2.4%)',
    repository: 'codeatlas/core-suite',
    category: 'System Health Boost',
    priority: 'LOW',
    confidence: '99.9%',
    businessImpact: 'Zero Downtime',
    engineeringImpact: '142,500 AST Symbols Synchronized',
    estimatedEffort: '0 Mins (Verified)',
    evidence: {
      filePath: 'packages/core/ast_graph.ts',
      lineRange: 'L1-L200',
      snippet: `export class CleanArchitectureValidator { ... }`
    },
    suggestedFix: 'Maintain current linting and AST layer boundary enforcement rules.',
    simulationShortcutUrl: '/analyze',
    fixActionUrl: '/analyze'
  }
];

export function AiCtoProactiveInsights() {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const filteredRecs = RECOMMENDATIONS.filter((rec) => {
    if (dismissedIds.includes(rec.id)) return false;
    if (selectedFilter !== 'ALL' && !rec.priority.includes(selectedFilter) && !rec.category.includes(selectedFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Brain className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              Proactive AI CTO Guidance & Recommendations
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Autonomous engineering notifications with empirical AST evidence, trade-offs, and simulation shortcuts.
            </p>
          </div>
        </div>

        <span className="text-xs text-purple-300 font-mono font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          {filteredRecs.length} Actionable Recommendations
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 font-mono text-xs">
        <span className="text-slate-500 text-[10px] uppercase font-bold mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-cyan-400" /> FILTER:
        </span>
        {['ALL', 'CRITICAL', 'HIGH', 'Architecture Drift', 'Performance', 'Scaling Bottleneck'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
              selectedFilter === cat
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List of Proactive Recommendations */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredRecs.map((rec) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`p-5 rounded-2xl border transition-all duration-200 space-y-3 font-mono ${
                rec.priority === 'CRITICAL'
                  ? 'bg-slate-900/90 border-rose-500/40 hover:border-rose-500'
                  : rec.priority === 'HIGH'
                  ? 'bg-slate-900/60 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {/* Header Line */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        rec.priority === 'CRITICAL'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : rec.priority === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {rec.priority}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{rec.category}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400 text-xs">{rec.repository}</span>
                  </div>

                  <h3 className="font-extrabold text-white text-base leading-snug">{rec.title}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-400 block">{rec.businessImpact}</span>
                  <span className="text-[10px] text-slate-500">Effort: {rec.estimatedEffort}</span>
                </div>
              </div>

              {/* Suggested Fix */}
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-cyan-400 font-mono">Suggested Fix:</strong> {rec.suggestedFix}
              </p>

              {/* AST Code Evidence */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    Evidence: <span className="text-cyan-300">{rec.evidence.filePath}#{rec.evidence.lineRange}</span>
                  </span>
                  <span className="text-purple-300 text-[10px]">Confidence: {rec.confidence}</span>
                </div>
                <pre className="p-2 bg-slate-900 rounded-lg text-slate-300 text-[11px] overflow-x-auto border border-slate-800/60 font-mono">
                  <code>{rec.evidence.snippet}</code>
                </pre>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Engineering Impact: <strong className="text-slate-200">{rec.engineeringImpact}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={rec.simulationShortcutUrl}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-200 hover:text-white rounded-xl gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-400" /> Simulate Scenario
                    </Button>
                  </Link>

                  <Link href={rec.fixActionUrl}>
                    <Button
                      size="sm"
                      className="h-7 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-1 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-200" /> Apply Fix
                    </Button>
                  </Link>

                  <button
                    onClick={() => setDismissedIds((p) => [...p, rec.id])}
                    className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                    title="Dismiss Notification"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
