'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Clock,
  History,
  Search,
  CheckCircle2,
  Bookmark,
  Layers,
  ShieldCheck,
  FileText,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface MemoryLogEntry {
  id: string;
  timestamp: string;
  category: 'Investigation' | 'Architecture Review' | 'Technical Decision' | 'Simulation' | 'Discussion';
  repository: string;
  title: string;
  summary: string;
  retainedContext: string;
}

const MEMORY_ENTRIES: MemoryLogEntry[] = [
  {
    id: 'mem-1',
    timestamp: '2 hours ago',
    category: 'Technical Decision',
    repository: 'codeatlas/payments-service',
    title: 'Decouple REST Router Raw SQL Queries into DAL',
    summary: 'Approved refactoring plan to extract raw SQL from router.py into PaymentsRepository class.',
    retainedContext: 'Preserved AST graph symbols & Redis write-through cache topology.'
  },
  {
    id: 'mem-2',
    timestamp: 'Yesterday',
    category: 'Simulation',
    repository: 'codeatlas/analytics-pipeline',
    title: 'Kafka Microservices Split Scenario Simulation Completed',
    summary: 'Split 1 monolithic consumer group into 3 decoupled pods. Confirmed 34% latency reduction.',
    retainedContext: 'K8s deployment manifest topology saved in software memory.'
  },
  {
    id: 'mem-3',
    timestamp: '3 days ago',
    category: 'Architecture Review',
    repository: 'codeatlas/auth-gateway',
    title: 'Auth Gateway JWT Token Validation Lock Analysis',
    summary: 'Identified database connection pool saturation under 50k QPS load.',
    retainedContext: 'Redis L2 cluster write-through caching design spec stored.'
  },
  {
    id: 'mem-4',
    timestamp: 'Last week',
    category: 'Investigation',
    repository: 'codeatlas/core-suite',
    title: 'SOC2 Type II Compliance Audit Posture Verification',
    summary: 'Verified 0 critical CVEs across all 14 monorepo packages.',
    retainedContext: 'SOC2 security clearance certificate hash stored.'
  }
];

export function AiCtoMemoryContext() {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEntries = MEMORY_ENTRIES.filter((entry) => {
    if (filterCategory !== 'ALL' && entry.category !== filterCategory) return false;
    if (searchQuery && !entry.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              AI Long-Term Memory & Context History
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Persistent organizational memory logging past investigations, technical decisions, reviews, and simulations.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Long-Term Context Active
        </span>
      </div>

      {/* Search & Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-slate-500 text-[10px] uppercase font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> CATEGORY:
          </span>
          {['ALL', 'Technical Decision', 'Simulation', 'Architecture Review', 'Investigation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search AI Memory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
      </div>

      {/* Memory Timeline Log */}
      <div className="space-y-3 font-mono text-xs">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                  {entry.category}
                </span>
                <span className="text-cyan-400 font-bold">{entry.repository}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{entry.timestamp}</span>
            </div>

            <h4 className="font-bold text-white text-sm leading-snug">{entry.title}</h4>
            <p className="text-slate-300 font-sans text-xs">{entry.summary}</p>

            <div className="p-2 bg-slate-900 rounded-lg text-[10px] text-cyan-300 border border-slate-800/60 flex items-center justify-between">
              <span>Memory Anchor: {entry.retainedContext}</span>
              <span className="text-emerald-400 font-bold">PERSISTED</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
