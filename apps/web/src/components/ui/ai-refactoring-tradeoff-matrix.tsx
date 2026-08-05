'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Flame,
  DollarSign,
  Play,
  Sparkles,
  ArrowRight,
  GitCompare,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AlternativeStrategy {
  id: string;
  name: string;
  verdict: 'RECOMMENDED' | 'VIABLE_ALTERNATIVE' | 'HIGH_RISK';
  summary: string;
  benefits: string[];
  risks: string[];
  complexity: string;
  migrationCost: string;
  performanceImpact: string;
  securityImpact: string;
  developerExperience: string;
  maintainability: string;
  scalability: string;
  businessValue: string;
  confidence: string;
  simulationBeforeAfter: {
    latencyBefore: string;
    latencyAfter: string;
    qpsCapacityBefore: string;
    qpsCapacityAfter: string;
    healthScoreBefore: number;
    healthScoreAfter: number;
    debtDragBefore: string;
    debtDragAfter: string;
  };
}

const ALTERNATIVE_STRATEGIES: AlternativeStrategy[] = [
  {
    id: 'strategy-a',
    name: 'Option A: Extract DAL Repository & Deploy Redis L2 Cache',
    verdict: 'RECOMMENDED',
    summary: 'Refactor REST router handlers into dedicated PaymentsRepository class and deploy Redis write-through token validation cache.',
    benefits: [
      'Eliminates DB connection pool lock spikes under 50,000 QPS load',
      'Reduces P99 checkout ingress latency from 57ms to 11.4ms',
      'Recovers $18.5k/yr technical debt drag with zero downtime'
    ],
    risks: [
      'Requires updating 14 files across PaymentService router handlers'
    ],
    complexity: 'Low to Medium Complexity',
    migrationCost: '$12k / 2 Days Engineering',
    performanceImpact: 'Sub-12ms P99 Latency (+350% QPS Ingress)',
    securityImpact: 'SOC2 Type II Posture Verified (100% Audit Pass)',
    developerExperience: 'Clean DAL Abstraction & 40% Faster Onboarding',
    maintainability: 'Grade A+ Clean Architecture Enforced',
    scalability: 'Horizontal Redis Cluster Auto-scaling',
    businessValue: 'High ROI ($18.5k/yr Payoff + 99.99% SLA)',
    confidence: '98.4%',
    simulationBeforeAfter: {
      latencyBefore: '57.0ms',
      latencyAfter: '11.4ms',
      qpsCapacityBefore: '12,500 QPS',
      qpsCapacityAfter: '50,000 QPS',
      healthScoreBefore: 82.0,
      healthScoreAfter: 94.2,
      debtDragBefore: '$18.5k/yr',
      debtDragAfter: '$2.1k/yr'
    }
  },
  {
    id: 'strategy-b',
    name: 'Option B: Split Payment Processing Service into 3 Microservice Pods',
    verdict: 'VIABLE_ALTERNATIVE',
    summary: 'Decouple PaymentService into Stripe Ingress Pod, Webhook Processor Pod, and Merchant Account Pod.',
    benefits: [
      'Complete domain process boundary isolation',
      'Independent pod deployment scaling and fault isolation'
    ],
    risks: [
      'Higher Kubernetes deployment complexity and event bus overhead'
    ],
    complexity: 'High Complexity',
    migrationCost: '$25k / 5 Days Engineering',
    performanceImpact: '14.2ms P99 Latency (Network Hop Overhead)',
    securityImpact: 'mTLS Identity Pod Verification Required',
    developerExperience: 'Requires Multi-repo / K8s Manifest Management',
    maintainability: 'Decoupled Service Boundaries',
    scalability: 'Independent Pod Scaling',
    businessValue: 'Medium ROI (High Initial Migration Cost)',
    confidence: '94.2%',
    simulationBeforeAfter: {
      latencyBefore: '57.0ms',
      latencyAfter: '14.2ms',
      qpsCapacityBefore: '12,500 QPS',
      qpsCapacityAfter: '45,000 QPS',
      healthScoreBefore: 82.0,
      healthScoreAfter: 91.5,
      debtDragBefore: '$18.5k/yr',
      debtDragAfter: '$4.5k/yr'
    }
  },
  {
    id: 'strategy-c',
    name: 'Option C: Expand PostgreSQL Connection Pool (Band-aid)',
    verdict: 'HIGH_RISK',
    summary: 'Increase PostgreSQL max_connections setting from 100 to 500 without refactoring raw SQL router handlers.',
    benefits: [
      'Zero immediate code changes required'
    ],
    risks: [
      'Does not resolve raw SQL architecture drift or layer coupling',
      'DB memory exhaustion risk under sustained 50k QPS spikes'
    ],
    complexity: 'Zero Code Complexity',
    migrationCost: '$0 / 15 Mins Config',
    performanceImpact: '42.0ms P99 Latency (High DB Memory Saturation)',
    securityImpact: 'Unchanged Vulnerability Posture',
    developerExperience: 'Preserves Fragile Codebase Smells',
    maintainability: 'Technical Debt Drag Continues to Accumulate',
    scalability: 'Vertical DB Scaling Ceiling Reached Quickly',
    businessValue: 'Negative ROI ($18.5k/yr Debt Drag Persists)',
    confidence: '99.5%',
    simulationBeforeAfter: {
      latencyBefore: '57.0ms',
      latencyAfter: '42.0ms',
      qpsCapacityBefore: '12,500 QPS',
      qpsCapacityAfter: '18,000 QPS',
      healthScoreBefore: 82.0,
      healthScoreAfter: 82.0,
      debtDragBefore: '$18.5k/yr',
      debtDragAfter: '$18.5k/yr'
    }
  }
];

export function AiRefactoringTradeoffMatrix() {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('strategy-a');

  const selectedStrategy =
    ALTERNATIVE_STRATEGIES.find((s) => s.id === selectedStrategyId) || ALTERNATIVE_STRATEGIES[0];

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <GitCompare className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              AI Trade-Off Analysis & Digital Twin Simulation Comparison
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Compare alternative refactoring strategies with side-by-side Digital Twin latency, throughput, and health predictions.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          3 Alternative Strategies Evaluated
        </span>
      </div>

      {/* Alternative Strategy Pills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {ALTERNATIVE_STRATEGIES.map((strat) => {
          const isActive = strat.id === selectedStrategyId;
          return (
            <button
              key={strat.id}
              onClick={() => setSelectedStrategyId(strat.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 text-left space-y-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-cyan-500/50 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    strat.verdict === 'RECOMMENDED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : strat.verdict === 'VIABLE_ALTERNATIVE'
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {strat.verdict.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-cyan-300 font-bold">{strat.confidence}</span>
              </div>
              <div className="font-bold text-xs leading-snug">{strat.name}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Strategy Deep-Dive Trade-Off Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-5 font-mono text-xs">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">SELECTED REFACTORING STRATEGY:</span>
            <h3 className="text-base font-black text-white">{selectedStrategy.name}</h3>
            <p className="text-xs text-slate-400 font-sans">{selectedStrategy.summary}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-black text-emerald-400 block">{selectedStrategy.businessValue}</span>
            <span className="text-[10px] text-slate-500">Migration Cost: {selectedStrategy.migrationCost}</span>
          </div>
        </div>

        {/* Side-by-Side Digital Twin Simulation Comparison */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-500 uppercase font-bold block flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> DIGITAL TWIN SIMULATION COMPARISON (BEFORE vs AFTER):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">P99 Ingress Latency</span>
              <div className="flex items-center justify-center gap-1 font-bold text-xs">
                <span className="text-rose-400 line-through">{selectedStrategy.simulationBeforeAfter.latencyBefore}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span className="text-emerald-400 text-sm">{selectedStrategy.simulationBeforeAfter.latencyAfter}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">QPS Ingress Capacity</span>
              <div className="flex items-center justify-center gap-1 font-bold text-xs">
                <span className="text-slate-400">{selectedStrategy.simulationBeforeAfter.qpsCapacityBefore}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-300 text-sm">{selectedStrategy.simulationBeforeAfter.qpsCapacityAfter}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">System Health Score</span>
              <div className="flex items-center justify-center gap-1 font-bold text-xs">
                <span className="text-amber-400">{selectedStrategy.simulationBeforeAfter.healthScoreBefore}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span className="text-emerald-400 text-sm">{selectedStrategy.simulationBeforeAfter.healthScoreAfter} Health</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Tech Debt Drag</span>
              <div className="flex items-center justify-center gap-1 font-bold text-xs">
                <span className="text-rose-400">{selectedStrategy.simulationBeforeAfter.debtDragBefore}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span className="text-emerald-400 text-sm">{selectedStrategy.simulationBeforeAfter.debtDragAfter}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits vs Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <span className="font-mono text-xs font-extrabold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Benefits & Advantages
            </span>
            <ul className="space-y-1 text-slate-300">
              {selectedStrategy.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">+</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
            <span className="font-mono text-xs font-extrabold text-rose-400 uppercase flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" /> Operational Risks
            </span>
            <ul className="space-y-1 text-slate-300">
              {selectedStrategy.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">-</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Impact Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Performance Impact</span>
            <span className="font-bold text-cyan-300 text-[11px] truncate block">{selectedStrategy.performanceImpact}</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Security Posture</span>
            <span className="font-bold text-emerald-400 text-[11px] truncate block">{selectedStrategy.securityImpact}</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Developer Experience</span>
            <span className="font-bold text-indigo-300 text-[11px] truncate block">{selectedStrategy.developerExperience}</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Scalability Rating</span>
            <span className="font-bold text-purple-300 text-[11px] truncate block">{selectedStrategy.scalability}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Link href="/simulate">
            <Button size="sm" variant="outline" className="h-8 text-xs font-bold bg-slate-900 border-slate-800 text-slate-200 hover:text-white rounded-xl gap-1 cursor-pointer">
              <Play className="w-3.5 h-3.5 text-indigo-400" /> Run Full Simulation
            </Button>
          </Link>
          <Link href="/improve">
            <Button size="sm" className="h-8 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-1 cursor-pointer shadow-md">
              <Sparkles className="w-3.5 h-3.5" /> Execute Recommended Strategy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
