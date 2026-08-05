'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  Play,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ArchitecturalDecision {
  id: string;
  question: string;
  verdict: 'RECOMMENDED' | 'NEEDS_CAUTION' | 'NOT_RECOMMENDED';
  pros: string[];
  cons: string[];
  tradeoffs: string;
  riskLevel: string;
  migrationCost: string;
  businessValue: string;
  architectureImpact: string;
  confidence: string;
}

const DECISIONS: ArchitecturalDecision[] = [
  {
    id: 'dec-microservices',
    title: 'Should we migrate to microservices?',
    question: 'Should we split Payment Processing Service into decoupled microservices pods?',
    verdict: 'RECOMMENDED',
    pros: [
      'Eliminates database connection lock contention under 50k QPS load',
      'Enables independent scaling of checkout ingress vs webhook processors',
      'Allows team autonomy across Payments and Identity pods'
    ],
    cons: [
      'Increases DevOps deployment complexity and k8s configuration overhead',
      'Requires eventual consistency event handling across service boundaries'
    ],
    tradeoffs: 'Higher operational DevOps complexity in exchange for zero database lock contention and independent scaling.',
    riskLevel: 'Low Operational Risk (Digital Twin Verified)',
    migrationCost: '$12k / 3 Days Engineering',
    businessValue: '+350% Ingress Throughput & 99.99% Uptime SLA',
    architectureImpact: 'Decouples Payments domain into 3 independent worker pods.',
    confidence: '98.4%'
  },
  {
    id: 'dec-kafka',
    title: 'Should we use Kafka?',
    question: 'Should we adopt Kafka event streams for Analytics Telemetry Pipeline?',
    verdict: 'RECOMMENDED',
    pros: [
      'Supports high-throughput event streaming up to 100,000 events/sec',
      'Provides persistent event log playback for historical data replay',
      'Decouples telemetry ingestion from database persistence workers'
    ],
    cons: [
      'Requires managing Zookeeper/KRaft state cluster and topic partitioning'
    ],
    tradeoffs: 'Cluster infrastructure overhead traded for massive throughput and asynchronous fault tolerance.',
    riskLevel: 'Low Risk',
    migrationCost: '$8k / 2 Days Engineering',
    businessValue: '34% Latency Reduction across 50k req/sec ingress',
    architectureImpact: 'Asynchronous event-driven architecture.',
    confidence: '99.1%'
  },
  {
    id: 'dec-replace-rest',
    title: 'Should we replace REST with gRPC / GraphQL?',
    question: 'Should we migrate internal inter-service REST APIs to gRPC Protocol Buffers?',
    verdict: 'RECOMMENDED',
    pros: [
      'Strict HTTP/2 multiplexing reduces internal network latency by 60%',
      'Strong protobuf contract generation eliminates manual API schema drift',
      'Sub-millisecond serialization speeds up worker RPC calls'
    ],
    cons: [
      'Requires updating internal HTTP client SDKs across all 14 repos'
    ],
    tradeoffs: 'Internal protocol migration effort for sub-millisecond RPC performance and strict typing.',
    riskLevel: 'Medium Risk',
    migrationCost: '$15k / 5 Days Engineering',
    businessValue: 'Reduces internal RPC latency from 18ms to 2.4ms',
    architectureImpact: 'Replaces JSON/REST with binary Protocol Buffers.',
    confidence: '95.8%'
  },
  {
    id: 'dec-split-repos',
    title: 'Should we split repositories?',
    question: 'Should we split the enterprise monorepo into polyrepos?',
    verdict: 'NOT_RECOMMENDED',
    pros: [
      'Granular git commit access control per repository'
    ],
    cons: [
      'Introduces cross-repo dependency version fragmentation and lockstep PRs',
      'Slower cross-cutting refactoring across core AST symbol packages',
      'Loss of central AI Mission Control unified indexing'
    ],
    tradeoffs: 'Polyrepos fragment cross-package AST knowledge without providing architectural isolation benefits.',
    riskLevel: 'High Architectural Drag Risk',
    migrationCost: '$25k / 2 Weeks Engineering',
    businessValue: 'Negative ROI (-20% Developer Velocity)',
    architectureImpact: 'Fragmented repository topology.',
    confidence: '99.5%'
  },
  {
    id: 'dec-migrate-db',
    title: 'Should we migrate databases?',
    question: 'Should we migrate analytics telemetry storage from PostgreSQL to ClickHouse?',
    verdict: 'RECOMMENDED',
    pros: [
      'Columnar ClickHouse engine speeds up analytical aggregation queries by 100x',
      'Compresses telemetry time-series storage size by 75%',
      'Eliminates analytical query locks on operational transactional tables'
    ],
    cons: [
      'Requires setting up a dual-write sync pipeline during migration'
    ],
    tradeoffs: 'Dual-write pipeline setup for 100x faster analytical query performance.',
    riskLevel: 'Low Risk (Staged Sync)',
    migrationCost: '$10k / 3 Days Engineering',
    businessValue: '$24k/yr Storage & Compute Infrastructure Savings',
    architectureImpact: 'Separates OLTP (Postgres) and OLAP (ClickHouse).',
    confidence: '97.8%'
  },
  {
    id: 'dec-kubernetes',
    title: 'Should we adopt Kubernetes?',
    question: 'Should we adopt Kubernetes operator architecture across all staging/prod clusters?',
    verdict: 'RECOMMENDED',
    pros: [
      'Automated horizontal pod autoscaling based on QPS and CPU saturation',
      'Self-healing container replacement and zero-downtime rolling updates',
      'Unified infrastructure-as-code manifests'
    ],
    cons: [
      'Requires cloud k8s cluster management and ingress controller setup'
    ],
    tradeoffs: 'Container orchestration learning curve for automated self-healing and zero downtime.',
    riskLevel: 'Low Risk',
    migrationCost: '$18k / 4 Days Engineering',
    businessValue: '99.99% Availability & Auto-scaling',
    architectureImpact: 'Cloud-native containerized architecture.',
    confidence: '98.9%'
  }
];

export function AiCtoDecisionSupport() {
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>('dec-microservices');

  const selectedDecision =
    DECISIONS.find((d) => d.id === selectedDecisionId) || DECISIONS[0];

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              Strategic Architectural Decision Support
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              AI-evaluated trade-offs, pros & cons, migration costs, and ROI analysis for core architectural questions.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          6 Strategic Evaluations
        </span>
      </div>

      {/* Decision Question Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-mono text-xs">
        {DECISIONS.map((item) => {
          const isActive = item.id === selectedDecisionId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedDecisionId(item.id)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 text-left space-y-1 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border-amber-500/50 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    item.verdict === 'RECOMMENDED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {item.verdict.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-cyan-300 font-bold">{item.confidence}</span>
              </div>
              <div className="font-bold text-xs leading-snug">{item.title}</div>
            </button>
          );
        })}
      </div>

      {/* Detailed Decision Evaluation Breakdown Card */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-amber-500/40 space-y-5 font-mono text-xs">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">DECISION EVALUATION:</span>
            <h3 className="text-base font-black text-white">{selectedDecision.question}</h3>
          </div>

          <div className="text-right">
            <span
              className={`text-xs font-black px-3 py-1 rounded-full border inline-block ${
                selectedDecision.verdict === 'RECOMMENDED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              VERDICT: {selectedDecision.verdict.replace('_', ' ')}
            </span>
            <span className="block text-[10px] text-slate-500 mt-1">AI Confidence: {selectedDecision.confidence}</span>
          </div>
        </div>

        {/* Pros vs Cons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
          {/* Pros */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <span className="font-mono text-xs font-extrabold text-emerald-400 uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Architectural Advantages (Pros)
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {selectedDecision.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
            <span className="font-mono text-xs font-extrabold text-rose-400 uppercase flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" /> Operational Drawbacks (Cons)
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {selectedDecision.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">-</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trade-offs summary */}
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-sans">
          <strong className="text-amber-400 font-mono">Core Trade-off Analysis:</strong> {selectedDecision.tradeoffs}
        </div>

        {/* Evaluation Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Migration Cost</span>
            <span className="font-bold text-cyan-300 text-xs">{selectedDecision.migrationCost}</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Business Value ROI</span>
            <span className="font-bold text-emerald-400 text-xs">{selectedDecision.businessValue}</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Risk Level</span>
            <span className="font-bold text-amber-400 text-xs">{selectedDecision.riskLevel}</span>
          </div>
          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Topology Impact</span>
            <span className="font-bold text-purple-300 text-xs truncate block">{selectedDecision.architectureImpact}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Link href="/simulate">
            <Button size="sm" variant="outline" className="h-8 text-xs font-bold bg-slate-900 border-slate-800 text-slate-200 hover:text-white rounded-xl gap-1 cursor-pointer">
              <Play className="w-3.5 h-3.5 text-indigo-400" /> Run Decision Simulation
            </Button>
          </Link>
          <Link href="/architecture">
            <Button size="sm" className="h-8 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl gap-1 cursor-pointer shadow-md">
              <Sparkles className="w-3.5 h-3.5" /> View Architecture Graph
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
