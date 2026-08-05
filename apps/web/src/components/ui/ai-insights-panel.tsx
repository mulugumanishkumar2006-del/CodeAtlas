'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  Search,
  ArrowUpRight,
  Code2,
  FileText,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  XCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProactiveInsight {
  id: string;
  title: string;
  repository: string;
  type: 'WARNING' | 'IMPROVEMENT' | 'CRITICAL';
  confidence: string;
  evidence: string;
  impact: string;
  explanation: string;
  quickFixUrl: string;
  investigateUrl: string;
}

const INSIGHTS: ProactiveInsight[] = [
  {
    id: 'ins-1',
    title: 'Payment Service Coupling Increased 18%',
    repository: 'codeatlas/payments-service',
    type: 'CRITICAL',
    confidence: '98.4%',
    evidence: 'PaymentService/router.py depends directly on UserRepository internal tables',
    impact: '+18% Architecture Coupling',
    explanation: 'Direct inline raw SQL queries inside HTTP handlers introduce tight coupling between Payments and Identity domains. This prevents independent DB schema migrations and breaks Redis L2 cache layer isolation.',
    quickFixUrl: '/improve',
    investigateUrl: '/investigate'
  },
  {
    id: 'ins-2',
    title: 'Authentication Module Has No Documentation Coverage',
    repository: 'codeatlas/auth-gateway',
    type: 'WARNING',
    confidence: '95.2%',
    evidence: 'services/auth/jwt_validator.go contains 0 godoc comments on exported structs',
    impact: 'Maintainability Risk',
    explanation: 'Exported structs and authentication error handlers lack docstrings. New engineers onboarding onto the identity module have no reference documentation for JWT token rotation.',
    quickFixUrl: '/knowledge',
    investigateUrl: '/investigate'
  },
  {
    id: 'ins-3',
    title: 'Checkout Ingress Latency Increased (+45ms)',
    repository: 'codeatlas/payments-service',
    type: 'WARNING',
    confidence: '99.1%',
    evidence: 'Stripe webhook ingestion handler duration increased from 12ms to 57ms',
    impact: 'P99 Latency Degradation',
    explanation: 'Synchronous lock contention on the database connection pool during peak traffic bursts forces HTTP handler threads to wait in queue before acquiring DB connections.',
    quickFixUrl: '/simulate',
    investigateUrl: '/analytics'
  },
  {
    id: 'ins-4',
    title: 'Three Repositories Require Architectural Drift Review',
    repository: 'Monorepo Cluster',
    type: 'WARNING',
    confidence: '96.8%',
    evidence: '24 architectural layer boundary rules checked; 3 rule breaches found',
    impact: 'Systemic Health',
    explanation: 'Cross-boundary module imports violate the defined clean architecture isolation contracts in Payments, Auth Gateway, and Analytics Pipeline.',
    quickFixUrl: '/architecture',
    investigateUrl: '/analyze'
  },
  {
    id: 'ins-5',
    title: 'Overall Architecture Drift Is Decreasing System-Wide',
    repository: 'Enterprise Cluster',
    type: 'IMPROVEMENT',
    confidence: '99.5%',
    evidence: 'Total active drift alerts dropped from 12 to 3 over 7 days',
    impact: '+2.4% Health Score',
    explanation: 'Automated refactoring patches and developer enforcement reduced layer violations significantly across microservice boundaries.',
    quickFixUrl: '/monitor',
    investigateUrl: '/analyze'
  },
  {
    id: 'ins-6',
    title: 'Redis Cache Efficiency Improved (+350% QPS)',
    repository: 'codeatlas/auth-gateway',
    type: 'IMPROVEMENT',
    confidence: '99.9%',
    evidence: 'Cache hit ratio increased to 98.4% under 50k req/sec load tests',
    impact: 'Optimal Ingress',
    explanation: 'Deploying Redis write-through token cache eliminated 98.4% of repetitive SQL queries during user token verification.',
    quickFixUrl: '/analytics',
    investigateUrl: '/analytics'
  }
];

export function AiInsightsPanel() {
  const [selectedExplainInsight, setSelectedExplainInsight] = useState<ProactiveInsight | null>(null);

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none relative">
      {/* Header */}
      <div className="flex items-center justify-between font-mono border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Brain className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              Proactive AI Insights Panel
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Autonomous system discoveries, predictive architectural risks, and performance recommendations.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          6 Active Discoveries
        </span>
      </div>

      {/* Grid of Proactive Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INSIGHTS.map((insight) => (
          <div
            key={insight.id}
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 font-mono ${
              insight.type === 'CRITICAL'
                ? 'bg-slate-900/90 border-rose-500/40 hover:border-rose-500'
                : insight.type === 'WARNING'
                ? 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    insight.type === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : insight.type === 'WARNING'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {insight.type}
                </span>
                <span className="text-xs text-emerald-400 font-bold">{insight.impact}</span>
              </div>

              <h3 className="font-bold text-white text-sm mt-2 leading-snug">{insight.title}</h3>
              <p className="text-[11px] text-slate-400 font-sans mt-1">{insight.repository}</p>

              {/* Evidence Code Snippet Box */}
              <div className="mt-3 p-2.5 bg-slate-950 rounded-xl border border-slate-900 text-[11px] text-cyan-300 font-mono leading-relaxed truncate">
                Evidence: {insight.evidence}
              </div>
            </div>

            {/* Footer & Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">
                Confidence: <strong className="text-cyan-300">{insight.confidence}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedExplainInsight(insight)}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-purple-400" /> Explain
                </button>

                <Link href={insight.quickFixUrl}>
                  <Button
                    size="sm"
                    className="h-7 px-2.5 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-1 cursor-pointer"
                  >
                    Quick Fix <Sparkles className="w-3 h-3 text-cyan-200" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* "Explain" Modal Drawer */}
      <AnimatePresence>
        {selectedExplainInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 font-mono"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="font-extrabold text-white text-base">AI Root-Cause Explanation</h3>
                </div>
                <button
                  onClick={() => setSelectedExplainInsight(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm">{selectedExplainInsight.title}</h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedExplainInsight.explanation}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs">
                <span className="text-slate-500 font-bold block text-[10px]">EMPIRICAL AST EVIDENCE:</span>
                <span className="text-cyan-400 font-mono text-[11px]">{selectedExplainInsight.evidence}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedExplainInsight(null)}
                  className="text-xs font-mono font-bold bg-slate-950 border-slate-800 text-slate-300"
                >
                  Close
                </Button>
                <Link href={selectedExplainInsight.investigateUrl}>
                  <Button className="text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white gap-1">
                    Deep Dive Investigation &rarr;
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
