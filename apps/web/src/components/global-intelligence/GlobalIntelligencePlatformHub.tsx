"use client";

import React, { useState } from "react";
import {
  Globe,
  Brain,
  Activity,
  Layers,
  Search,
  Sliders,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Workflow,
  Sparkles,
  Command,
  FileCode,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Lock,
  Terminal,
  Clock,
  Check
} from "lucide-react";

export function GlobalIntelligencePlatformHub() {
  const [activeTab, setActiveTab] = useState<"command" | "repo" | "simulation" | "ops" | "roi">("command");
  const [commandInput, setCommandInput] = useState("");
  const [commandOutput, setCommandOutput] = useState<string | null>(null);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput) return;
    setCommandOutput(`Parsed Command: "${commandInput}" -> Action: ANALYZE_REPOSITORY -> Plan: Execute multi-hop Knowledge Graph analysis.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v4.0 PLATFORM
            </span>
            <span className="text-slate-400 text-xs">Global Engineering Intelligence Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Global Engineering Command Center <Globe className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Google Maps for Software Systems + Engineering Copilot + Digital Twin + Autonomous Agent Network.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">UNIFIED WORKFLOW</span>
            <span className="text-sm font-extrabold text-white">CONNECT → ANALYZE → ACT → LEARN</span>
          </div>
        </div>
      </div>

      {/* Universal Command Palette (/cmd) */}
      <div className="mb-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-3">
          <Command className="w-5 h-5 text-emerald-400" />
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Type a universal command (e.g. /cmd analyze payment-service, /cmd why is latency spiking?)..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1"
          >
            Execute <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
        {commandOutput && (
          <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 font-mono">
            {commandOutput}
          </div>
        )}
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Platform Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">OPERATIONAL</p>
          <span className="text-slate-400 text-xs mt-1 block">28 Microservices Connected</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Reliability Health</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">99.8 / 100</p>
          <span className="text-slate-400 text-xs mt-1 block">0 Active SEV-1 Incidents</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Autonomous Agents</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">14 Collaborating</p>
          <span className="text-slate-400 text-xs mt-1 block">L0-L5 Governed Autonomy</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Engineering ROI</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">420 hrs/mo</p>
          <span className="text-slate-400 text-xs mt-1 block">68% MTTR Reduction</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("command")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "command" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Engineering Command Center
        </button>
        <button
          onClick={() => setActiveTab("repo")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "repo" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Repository & Architecture Intelligence
        </button>
        <button
          onClick={() => setActiveTab("simulation")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "simulation" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Simulation Studio (100x Scale)
        </button>
        <button
          onClick={() => setActiveTab("ops")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "ops" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Operations & 14-Agent Network
        </button>
        <button
          onClick={() => setActiveTab("roi")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "roi" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Engineering ROI Analytics
        </button>
      </div>

      {/* TAB: COMMAND CENTER */}
      {activeTab === "command" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">8-Dimension Engineering Health Score</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Architecture</span>
                <strong className="text-xl text-emerald-400">88.4 / 100</strong>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Reliability</span>
                <strong className="text-xl text-emerald-400">99.8 / 100</strong>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Security</span>
                <strong className="text-xl text-purple-400">94.2 / 100</strong>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Performance</span>
                <strong className="text-xl text-indigo-400">96.0 / 100</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <h3 className="font-bold text-emerald-400">System Answers</h3>
              <p><span className="text-slate-500">What is happening:</span> <strong>All 28 services operating normally under 18.4ms P99 latency.</strong></p>
              <p><span className="text-slate-500">What changed:</span> <strong>PR #101 merged 14 mins ago (Async Redis connection pool fix).</strong></p>
              <p><span className="text-slate-500">What is risky:</span> <strong className="text-amber-400">Single-person knowledge concentration on payment-crypto-signer.</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SIMULATION */}
      {activeTab === "simulation" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Simulation Studio — 100x Scale & DB Outage</h2>
              <p className="text-xs text-slate-400">Model future engineering outcomes and migration graphs before execution.</p>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 font-bold px-3 py-1 rounded-full border border-indigo-500/20">
              100x SURGE SIMULATION
            </span>
          </div>

          <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-5 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-indigo-400">Simulated Result: 100x Traffic Surge</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
              <div><span className="text-slate-500 block">Bottlenecks</span><strong className="text-amber-400">Redis Pool & Aurora IOPS</strong></div>
              <div><span className="text-slate-500 block">Projected Latency</span><strong className="text-amber-400">1,840 ms</strong></div>
              <div><span className="text-slate-500 block">Projected Error Rate</span><strong className="text-red-400">14.2%</strong></div>
              <div><span className="text-slate-500 block">Cost Surge</span><strong>+$24,000 / mo</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ROI */}
      {activeTab === "roi" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Engineering ROI & Impact Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-slate-400 block">Hours Saved Monthly</span>
              <p className="text-3xl font-extrabold text-emerald-400">420 hrs</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-slate-400 block">MTTR Reduction</span>
              <p className="text-3xl font-extrabold text-indigo-400">68%</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-1">
              <span className="text-slate-400 block">Incidents Prevented</span>
              <p className="text-3xl font-extrabold text-purple-400">14 / mo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
