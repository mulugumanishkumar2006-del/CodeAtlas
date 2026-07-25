'use client';

import React, { useState } from 'react';
import { Network, Globe, Cpu, Layers, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Zap, Database, Search } from 'lucide-react';

export default function IntelligenceNetworkPage() {
  const [selectedIssue, setSelectedIssue] = useState('DB lock contention on checkout');
  const [searchQuery, setSearchQuery] = useState('DB lock contention on checkout');

  const globalBenchmark = {
    sampleSize: '12,450 Repositories',
    insight: 'Across 12,450 similar repositories facing high-throughput checkout lock contention, 78.4% of teams solved this problem using Event-Driven Architecture, CQRS, and Redis L2 caching.',
    confidence: 98.6,
    options: [
      {
        name: 'Option A: Monolith + Read Replicas',
        adoption: '21.6% Adoption',
        verdict: 'Viable short-term fix (<500K users), low cost ($12K), but scaling bottleneck persists.',
        status: 'VIABLE_SHORT_TERM',
      },
      {
        name: 'Option B: Event-Driven Microservices + CQRS + Redis (RECOMMENDED)',
        adoption: '78.4% Adoption',
        verdict: 'Best long-term trade-off for scale >1M users. Eliminates row locks, sub-18ms latency.',
        status: 'RECOMMENDED',
      },
    ],
  };

  const topGlobalPatterns = [
    { name: 'Event-Driven Architecture (EDA)', adoption: '64.2%', tech: 'Kafka + Redis + gRPC', tradeOff: 'Decoupled writes, requires async monitoring.' },
    { name: 'Command Query Responsibility Segregation (CQRS)', adoption: '48.5%', tech: 'Postgres Replicas + ES', tradeOff: 'Sub-10ms reads, eventual consistency.' },
    { name: 'L2 Distributed Cache Layer', adoption: '82.1%', tech: 'Redis write-through cache', tradeOff: 'Bypasses 85% DB load, requires TTL handling.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-cyan-600/20 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Network className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                Phase 24 — The Software Internet
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-1">
                Engineering Intelligence Network
              </h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-3xl">
            Synthesizes architectural patterns across 12,000+ public and enterprise repositories to provide cross-repository comparative intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
          <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-slate-300 font-bold">12,450 Repositories Indexed</span>
        </div>
      </div>

      {/* Global Recommendation Card (The Core Mission) */}
      <div className="bg-gradient-to-br from-cyan-950/90 via-slate-900 to-indigo-950/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-extrabold text-[11px] border border-cyan-500/30 uppercase tracking-widest">
              Global Pattern Benchmark
            </span>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
              <Sparkles className="w-6 h-6 text-cyan-400" /> Cross-Repository Intelligence Engine
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-xs">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-bold">Confidence Rating: {globalBenchmark.confidence}%</span>
          </div>
        </div>

        {/* Issue Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query global benchmark across 12,000 repos..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setSelectedIssue(searchQuery)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/30"
          >
            Query Network
          </button>
        </div>

        {/* Benchmark Verdict Box */}
        <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 space-y-3">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-extrabold flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" /> Global Synthesis Verdict ({globalBenchmark.sampleSize})
          </div>
          <p className="text-slate-100 text-sm font-medium leading-relaxed bg-slate-900/80 p-4 rounded-lg border border-slate-800">
            "{globalBenchmark.insight}"
          </p>

          {/* Options Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {globalBenchmark.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2 transition-all ${
                  opt.status === 'RECOMMENDED'
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs">{opt.name}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      opt.status === 'RECOMMENDED'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {opt.adoption}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{opt.verdict}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern AI & Trend AI Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {topGlobalPatterns.map((pat, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> {pat.name}
              </h3>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
                {pat.adoption}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Standard Tech Stack: <span className="text-white font-bold">{pat.tech}</span></div>
              <div className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {pat.tradeOff}
              </div>
            </div>
          </div>
        ))}
      {/* Items 2 & 3: Architecture Pattern Detector & Repository Similarity Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item 2: Architecture Pattern Detector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" /> Architecture Pattern Detector
            </h3>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
              4 ACTIVE PATTERNS DETECTED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white">Event Driven Architecture (EDA)</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">98.4% CONFIDENCE</span>
              </div>
              <p className="text-slate-400">Kafka message consumers in orders-fulfillment service and auth audit streams.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white">Clean Architecture / Hexagonal</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">96.5% CONFIDENCE</span>
              </div>
              <p className="text-slate-400">Strict isolation of domain entities, ports, and adapters across app layers.</p>
            </div>
          </div>
        </div>

        {/* Item 3: Repository Similarity Engine */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" /> Repository Similarity Engine
            </h3>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
              TOP 2 MATCHES
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white">uber/order-gateway-service</span>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">96.4% MATCH</span>
              </div>
              <p className="text-slate-300">Takeaway: Scaled this topology to 120,000 QPS adding gRPC connection pooling.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white">stripe/billing-ledger-core</span>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">94.1% MATCH</span>
              </div>
              <p className="text-slate-300">Takeaway: Uses partition-based idempotency keys to guarantee zero duplicate charges.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

