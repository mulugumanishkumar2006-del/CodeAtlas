'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Search,
  Code2,
  Play,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Brain,
  CheckCircle2,
  Layers,
  Zap,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ReasoningTreeNode {
  id: string;
  stage: 'OBSERVED' | 'DETECTED' | 'EVIDENCE' | 'SIMULATION' | 'RECOMMENDATION';
  title: string;
  summary: string;
  details: string;
  confidence: string;
  codeSnippet?: string;
  filePath?: string;
}

const DEFAULT_REASONING_NODES: ReasoningTreeNode[] = [
  {
    id: 'node-obs',
    stage: 'OBSERVED',
    title: 'Checkout Ingress Latency Increased (+45ms)',
    summary: 'Monitoring telemetry detected P99 latency degradation during peak 50,000 QPS traffic load.',
    details: 'Stripe webhook ingestion handler duration spiked from 12ms to 57ms on Payment Processing Service.',
    confidence: '99.9%'
  },
  {
    id: 'node-det',
    stage: 'DETECTED',
    title: 'PaymentService Coupling & DB Lock Contention Identified',
    summary: 'Static AST analysis traced direct raw SQL queries inside route handler bypassing repository abstraction.',
    details: 'Database connection pool locks up because HTTP handlers perform synchronous raw SQL SELECT queries without Redis caching.',
    confidence: '98.4%',
    filePath: 'apps/backend/app/payments/router.py',
    codeSnippet: `cursor.execute("SELECT * FROM merchant_accounts WHERE stripe_id = %s", (stripe_id,))`
  },
  {
    id: 'node-evi',
    stage: 'EVIDENCE',
    title: 'Three Synchronous API Calls Bypass DAL Layer',
    summary: 'AST call graph inspection confirmed L142-L168 in router.py directly dereferences raw DB connection.',
    details: 'PaymentService/router.py relies on direct inline cursor execution instead of PaymentsRepository class.',
    confidence: '99.2%',
    filePath: 'apps/backend/app/payments/router.py#L142-L168'
  },
  {
    id: 'node-sim',
    stage: 'SIMULATION',
    title: 'Digital Twin Predicts 34% Latency Reduction',
    summary: 'Digital twin load test simulation confirmed Redis L2 write-through cache eliminates DB connection lock spikes.',
    details: 'Simulated 50,000 QPS burst traffic test with Redis cache enabled; P99 latency dropped from 57ms back to 11.4ms.',
    confidence: '97.8%'
  },
  {
    id: 'node-rec',
    stage: 'RECOMMENDATION',
    title: 'Extract DAL Repository & Deploy Redis Write-Through Cache',
    summary: 'Refactor router.py to invoke PaymentsRepository class and deploy Redis write-through token validation cache.',
    details: '1-click automated patch script available to refactor 14 files and enforce clean architectural layer boundaries.',
    confidence: '99.5%'
  }
];

export function AiInvestigationReasoningTree() {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['node-obs', 'node-det', 'node-rec']);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between font-mono border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              Transparent AI Chain-of-Thought Reasoning Tree
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Step-by-step root cause derivation linking telemetry observation to AST code evidence and recommendation.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          5 Reasoning Stages
        </span>
      </div>

      {/* Reasoning Tree Nodes */}
      <div className="space-y-4 font-mono">
        {DEFAULT_REASONING_NODES.map((node, index) => {
          const isExpanded = expandedNodes.includes(node.id);

          return (
            <div key={node.id} className="relative">
              {/* Connector Line */}
              {index < DEFAULT_REASONING_NODES.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-800 z-0" />
              )}

              <div
                className={`relative z-10 rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-xl'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Node Header */}
                <div
                  onClick={() => toggleNode(node.id)}
                  className="p-4 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            node.stage === 'OBSERVED'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : node.stage === 'DETECTED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : node.stage === 'EVIDENCE'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : node.stage === 'SIMULATION'
                              ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {node.stage}
                        </span>
                        <span className="text-slate-400 text-[10px]">Confidence: {node.confidence}</span>
                      </div>

                      <h4 className="font-bold text-white text-sm leading-snug">{node.title}</h4>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>

                {/* Node Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-800/80 pt-3 space-y-3 font-sans text-xs">
                    <p className="text-slate-300 leading-relaxed">{node.summary}</p>
                    <p className="text-slate-400 leading-relaxed">{node.details}</p>

                    {node.filePath && (
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono space-y-1.5">
                        <div className="text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                          File Evidence: <span>{node.filePath}</span>
                        </div>
                        {node.codeSnippet && (
                          <pre className="p-2 bg-slate-900 rounded-lg text-slate-300 text-[11px] overflow-x-auto border border-slate-800 font-mono">
                            <code>{node.codeSnippet}</code>
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
