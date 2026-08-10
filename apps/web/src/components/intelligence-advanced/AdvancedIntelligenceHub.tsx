"use client";

import React, { useState } from "react";
import {
  Brain,
  History,
  GitCommit,
  TrendingUp,
  Sliders,
  Sparkles,
  Layers,
  Network,
  Share2,
  Workflow,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileCode2,
  Cpu,
  Flame,
  ArrowRight
} from "lucide-react";

export function AdvancedIntelligenceHub() {
  const [activeTab, setActiveTab] = useState<"timemachine" | "whatif" | "kg2" | "reasoning" | "debt">("timemachine");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"today" | "last_month" | "last_year">("today");

  const snapshots = {
    today: { tag: "TODAY PRESENT", services: 28, coupling: "0.42 (Decoupled)", arch: "Distributed Microservices + GraphQL Gateway" },
    last_month: { tag: "LAST MONTH", services: 24, coupling: "0.58 (Moderate)", arch: "Hybrid Monolith + 4 Microservices" },
    last_year: { tag: "LAST YEAR", services: 1, coupling: "0.95 (High Coupling)", arch: "Single Monolithic Django Backend" }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v3.7
            </span>
            <span className="text-slate-400 text-xs">Software Evolution Intelligence System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Advanced Engineering Intelligence & Time Machine
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Understand how software evolves, why systems become complex, forecast architectural drift, and simulate strategic decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-slate-900 border border-slate-700 text-purple-400 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
            <Brain className="w-4 h-4" /> 5-STAGE AI REASONING ACTIVE
          </span>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Architecture Time Machine</span>
            <History className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">3 Snapshots</p>
          <span className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Today vs Last Month vs Last Year
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">What-If Simulator</span>
            <Sliders className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">10x Surge Ready</p>
          <span className="text-slate-400 text-xs mt-1 block">Trade-off & Futures Modeling</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Knowledge Graph 2.0</span>
            <Network className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">Multi-Hop Causal</p>
          <span className="text-slate-400 text-xs mt-1 block">Counterfactual Reasoning</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Platform Self-Evolution</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">100% Self-Optimized</p>
          <span className="text-slate-400 text-xs mt-1 block">Continuous Self-Analysis</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("timemachine")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "timemachine" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Architecture Time Machine
        </button>
        <button
          onClick={() => setActiveTab("whatif")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "whatif" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          What-If Simulator & Trade-Offs
        </button>
        <button
          onClick={() => setActiveTab("kg2")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "kg2" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Knowledge Graph 2.0 & Causal Chain
        </button>
        <button
          onClick={() => setActiveTab("reasoning")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "reasoning" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          5-Stage AI Reasoning & Evidence
        </button>
        <button
          onClick={() => setActiveTab("debt")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "debt" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          5-D Complexity & Debt Compounding
        </button>
      </div>

      {/* TAB: TIME MACHINE */}
      {activeTab === "timemachine" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-xl border border-slate-800 w-fit text-xs font-semibold">
            <button
              onClick={() => setSelectedTimeframe("today")}
              className={`px-4 py-1.5 rounded-lg transition-all ${selectedTimeframe === "today" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Today (Present)
            </button>
            <button
              onClick={() => setSelectedTimeframe("last_month")}
              className={`px-4 py-1.5 rounded-lg transition-all ${selectedTimeframe === "last_month" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Last Month
            </button>
            <button
              onClick={() => setSelectedTimeframe("last_year")}
              className={`px-4 py-1.5 rounded-lg transition-all ${selectedTimeframe === "last_year" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Last Year
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">{snapshots[selectedTimeframe].tag}</span>
                <h2 className="text-xl font-bold text-white">{snapshots[selectedTimeframe].arch}</h2>
              </div>
              <span className="text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-slate-300">
                {snapshots[selectedTimeframe].services} Services Total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-emerald-400">Evolution Metric Snapshot</h3>
                <p><span className="text-slate-500">Monolith Coupling Score:</span> <strong>{snapshots[selectedTimeframe].coupling}</strong></p>
                <p><span className="text-slate-500">Architecture Pressure:</span> <strong className="text-emerald-400">38.4 / 100 (NORMAL)</strong></p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-emerald-400">Change Narrative Generator</h3>
                <p className="text-slate-300">"Extracted payment-processing module from core monolith into standalone Python FastAPI microservice."</p>
                <span className="text-slate-500 block pt-1">Outcome: Payment P99 latency decreased from 320ms to 42ms.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: WHAT-IF SIMULATOR */}
      {activeTab === "whatif" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">What-If Future Impact Simulator</h2>
              <p className="text-xs text-slate-400">Simulate 10x traffic surges, service removals, or DB failures before execution.</p>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 font-bold px-3 py-1 rounded-full border border-indigo-500/20">
              SIMULATED FUTURE: STRESSED
            </span>
          </div>

          <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-5 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-indigo-400">Scenario: 10x Traffic Surge on payment-service</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
              <div><span className="text-slate-500 block">Predicted Bottleneck</span><strong className="text-amber-400">Redis Pool & Aurora IOPS Spikes</strong></div>
              <div><span className="text-slate-500 block">P99 Latency Projection</span><strong className="text-amber-400">1,840 ms (+4,200%)</strong></div>
              <div><span className="text-slate-500 block">Error Rate Projection</span><strong className="text-red-400">14.2% HTTP 500</strong></div>
              <div><span className="text-slate-500 block">Monthly Surge Cost</span><strong>+$18,400 / mo</strong></div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
              <strong>Recommended Safeguard:</strong> Pre-scale Redis connection pool to 200 and enable Spanner read replicas.
            </div>
          </div>
        </div>
      )}

      {/* TAB: REASONING */}
      {activeTab === "reasoning" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">5-Stage AI Reasoning Layer & Evidence Graph</h2>
              <p className="text-xs text-slate-400">Transparent reasoning linked with empirical telemetry, commits & AST diffs.</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono">CONFIDENCE: 98.4%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold">STAGE 1: OBSERVATION</span>
              <p className="text-slate-300">Payment API HTTP 500 error rate spiked to 6.2% following PR #101 merge.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold">STAGE 2: INFERENCE</span>
              <p className="text-slate-300">PR #101 modified app/core/redis.py to create raw unpooled sockets under high concurrent load.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-purple-400 font-bold">STAGE 3: HYPOTHESIS</span>
              <p className="text-slate-300">Redis socket pool exhaustion causes thread lock during peak checkout requests.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold">STAGE 4: RECOMMENDATION</span>
              <p className="text-slate-300">Rollback deployment dep_8812 and replace unpooled socket logic with async connection pool.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold">STAGE 5: ACTION</span>
              <p className="text-slate-300">Generate patch ptch_001 and request L3 human approval.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
