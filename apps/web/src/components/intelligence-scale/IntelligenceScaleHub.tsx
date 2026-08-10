"use client";

import React, { useState } from "react";
import {
  Brain,
  TrendingUp,
  Activity,
  Shield,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Target,
  Sparkles,
  BarChart3,
  Cpu,
  ArrowUpRight,
  Database,
  FileCheck
} from "lucide-react";

export function IntelligenceScaleHub() {
  const [activeTab, setActiveTab] = useState<"temporal" | "predictive" | "recommendations" | "simulation" | "copilot" | "eval">("predictive");
  const [nlQuery, setNlQuery] = useState("Why is checkout slow?");

  const recommendations = [
    {
      id: "rec_001",
      category: "PERFORMANCE",
      problem: "Unpooled Redis client in Payment Service causing latency spikes",
      score: 34.2,
      risk: 8.0,
      impact: 9.0,
      confidence: "95%",
      effort: "2 hrs",
      action: "Convert Redis client instantiation to singleton connection pool in app/core/redis.py",
      benefit: "Eliminates socket exhaustion and reduces P99 latency by 420ms"
    },
    {
      id: "rec_002",
      category: "SECURITY",
      problem: "Vulnerable library cryptography v41.0.1 in requirements.txt",
      score: 25.2,
      risk: 7.0,
      impact: 8.0,
      confidence: "90%",
      effort: "1 hr",
      action: "Upgrade cryptography to v42.0.0 in requirements.txt",
      benefit: "Fixes CVE-2026-1184 High Vulnerability"
    },
    {
      id: "rec_003",
      category: "ARCHITECTURE",
      problem: "Direct database query from API endpoint router in auth.py",
      score: 10.2,
      risk: 6.0,
      impact: 6.0,
      confidence: "85%",
      effort: "3 hrs",
      action: "Move query to AuthService layer to restore 100% ADR-002 compliance",
      benefit: "Eliminates architecture boundary violation"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
              CODEATLAS v3.4
            </span>
            <span className="text-slate-400 text-xs">Intelligence at Scale & Predictive Engineering</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Engineering Intelligence & Prediction Platform
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Understanding relationships, predicting outcomes, recommending prioritized actions, and continuously learning from outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Overall Health Score</span>
              <span className="text-xl font-black text-emerald-400">92.4 / 100</span>
            </div>
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Canonical Entities</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">23 Entity Types</p>
          <span className="text-slate-400 text-xs mt-1 block">Temporal Graph Active</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Incident Prediction</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">72% Probability</p>
          <span className="text-slate-400 text-xs mt-1 block">payment-service Latency Drift</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Top Priority Score</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">34.2 Score</p>
          <span className="text-slate-400 text-xs mt-1 block">Redis Connection Pooling Fix</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">AI Groundedness</span>
            <FileCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">98.8% Verified</p>
          <span className="text-emerald-400 text-xs mt-1 block">0 Hallucinations Detected</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("predictive")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "predictive" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Predictive Engineering
        </button>
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "recommendations" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Priority Score Recommendations
        </button>

        <button
          onClick={() => setActiveTab("simulation")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "simulation" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Simulation Studio
        </button>
        <button
          onClick={() => setActiveTab("copilot")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "copilot" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Engineering Copilot & Brief
        </button>
        <button
          onClick={() => setActiveTab("temporal")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "temporal" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Temporal Graph & Memory
        </button>
        <button
          onClick={() => setActiveTab("eval")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "eval" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          AI & Agent Eval
        </button>
      </div>

      {/* TAB: PREDICTIVE */}
      {activeTab === "predictive" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Incident Probability Forecast</h2>
              <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-500/20">
                HIGH RISK PREDICTION
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Target Service</span>
                <span className="text-white font-mono">payment-service</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Predicted Incident Probability</span>
                <span className="text-amber-400 font-bold text-base">72.0%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">Contributing Risk Factors:</span>
              <div className="flex justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                <span>High Commit Velocity (42 commits / 48h)</span>
                <span className="text-indigo-400 font-mono">Weight: 40%</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                <span>Telemetry Latency Drift (+420ms)</span>
                <span className="text-indigo-400 font-mono">Weight: 35%</span>
              </div>
              <div className="flex justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                <span>Historical Incident Overlap (INC-4102)</span>
                <span className="text-indigo-400 font-mono">Weight: 25%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Technical Debt & Capacity Trends</h2>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Projected Technical Debt Growth (30 Days)</span>
                <p className="text-2xl font-bold text-indigo-400">148 Hours (+23.3%)</p>
                <span className="text-slate-500 mt-1 block">Hotspot: services/payment_service.py</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Infrastructure Spend Forecast</span>
                <p className="text-2xl font-bold text-emerald-400">$46,500 / month (+10.7%)</p>
                <span className="text-slate-500 mt-1 block">AI Token Cost: $3,200 / month</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: RECOMMENDATIONS */}
      {activeTab === "recommendations" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white">Prioritized Recommendation Engine</h2>
            <p className="text-xs text-slate-400 mt-1">
              Transparent Priority Score Formula: <code className="text-indigo-300 font-mono">Priority = (Risk × Impact × Confidence) ÷ Effort</code>
            </p>
          </div>

          <div className="space-y-4">
            {recommendations.map((r, i) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg">
                      #{i + 1}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
                      {r.category}
                    </span>
                    <h3 className="font-bold text-white text-base">{r.problem}</h3>
                  </div>

                  <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
                    <span className="text-xs text-indigo-300 font-semibold">Priority Score:</span>
                    <span className="text-lg font-black text-indigo-400">{r.score}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 py-3 text-xs border-t border-b border-slate-800/80 my-3 text-slate-300">
                  <div><span className="text-slate-500 block">Risk</span> <strong>{r.risk} / 10</strong></div>
                  <div><span className="text-slate-500 block">Impact</span> <strong>{r.impact} / 10</strong></div>
                  <div><span className="text-slate-500 block">Confidence</span> <strong>{r.confidence}</strong></div>
                  <div><span className="text-slate-500 block">Est. Effort</span> <strong>{r.effort}</strong></div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <p className="text-slate-300"><strong>Action:</strong> {r.action}</p>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-all">
                    Execute Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SIMULATION */}
      {activeTab === "simulation" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Engineering Simulation Studio</h2>
          <p className="text-xs text-slate-400">Simulate changes, incident failures, or compare architecture models before rollout.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-indigo-400">Architecture Comparison: Monolith vs. Event-Driven</h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between"><span>Coupling Index:</span><span className="text-emerald-400 font-mono">0.84 → 0.22 (-73.8%)</span></div>
                <div className="flex justify-between"><span>P99 Latency:</span><span className="text-emerald-400 font-mono">840ms → 120ms (-85.7%)</span></div>
                <div className="flex justify-between"><span>Monthly Cost:</span><span className="text-emerald-400 font-mono">$42,000 → $38,500 (-8.3%)</span></div>
              </div>
              <div className="pt-2 text-xs">
                <span className="bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 block text-center">
                  PROCEED WITH PROPOSED EVENT-DRIVEN ARCHITECTURE
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-indigo-400">Incident Injection Simulation</h3>
              <p className="text-xs text-slate-300">Target: Redis Cluster Outage</p>
              <div className="text-xs space-y-1 text-slate-400">
                <p>• Affected Services: 3 (payment-service, order-service, auth-service)</p>
                <p>• Estimated Downtime: 0s (Fallback to memory cache active)</p>
                <p>• Safeguard Verified: Redis connection fallback gracefully handling drops</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: COPILOT */}
      {activeTab === "copilot" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Daily Engineering Brief & Proactive Feed</h2>
              <p className="text-xs text-slate-400 mt-1">Automated daily summary and real-time intelligence feed.</p>
            </div>
            <span className="text-xs text-slate-400">{new Date().toISOString().split("T")[0]}</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-indigo-400">Daily Operations Brief</h3>
            <p className="text-xs text-slate-300">
              Engineering operations stable across 12 microservices. 14 PRs merged, 1 SEV-1 incident automatically recovered, and 2 security patches applied today.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">Proactive Intelligence Stream</h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 text-xs">
              <span className="text-amber-400 font-bold block mb-1">Payment Service Risk Increased +23% This Week</span>
              <p className="text-slate-400">High commit velocity combined with unpooled Redis connections increased risk.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-xs">
              <span className="text-indigo-400 font-bold block mb-1">Architecture Drift Detected in Auth Router</span>
              <p className="text-slate-400">Direct DB access pattern introduced in auth.py violating ADR-002.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TEMPORAL */}
      {activeTab === "temporal" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Temporal Knowledge Graph & Memory Vault</h2>
          <p className="text-xs text-slate-400">Tracking relationships over time with state transitions: CREATED → DEPLOYED → FAILED → RECOVERED → DEPRECATED.</p>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-indigo-400">Past Incident Memory Match</h3>
            <div className="text-xs text-slate-300 space-y-1">
              <p>• <strong>Incident:</strong> Redis Client Socket Exhaustion (INC-101)</p>
              <p>• <strong>Symptoms:</strong> HTTP 500 error rate spike, Latency &gt; 1000ms</p>
              <p>• <strong>Successful Fix:</strong> Converted client to async connection pool wrapper</p>
              <p>• <strong>Failed Fix Attempts:</strong> Increased Redis timeout from 2s to 10s</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: EVAL */}
      {activeTab === "eval" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">AI Evaluation & Model Registry Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-indigo-400">AI Accuracy & Groundedness Metrics</h3>
              <div className="flex justify-between py-1 border-b border-slate-800"><span>Accuracy Score</span><strong className="text-emerald-400">96.4%</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span>Groundedness</span><strong className="text-emerald-400">98.8%</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span>Hallucination Rate</span><strong className="text-emerald-400">&lt; 0.2%</strong></div>
              <div className="flex justify-between py-1"><span>User Acceptance Rate</span><strong className="text-indigo-400">92.5%</strong></div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-indigo-400">Promoted Model Registry</h3>
              <div className="flex justify-between py-1 border-b border-slate-800"><span>Model</span><strong>Gemini 3.6 Flash</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span>Provider</span><strong>Google DeepMind</strong></div>
              <div className="flex justify-between py-1 border-b border-slate-800"><span>Cost per 1k tokens</span><strong>$0.0005</strong></div>
              <div className="flex justify-between py-1"><span>Status</span><span className="text-emerald-400 font-bold">PROMOTED_PRODUCTION</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
