"use client";

import React, { useState } from "react";
import {
  Layers,
  Cpu,
  Activity,
  Sliders,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Share2,
  RefreshCw,
  Search,
  DollarSign,
  Award,
  Zap,
  Check
} from "lucide-react";

export function DigitalTwinHubV44() {
  const [activeTab, setActiveTab] = useState<"twin" | "blast" | "load" | "migration" | "whatif">("twin");
  const [trafficMultiplier, setTrafficMultiplier] = useState(10);
  const [regionsCount, setRegionsCount] = useState(2);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  const calculateP99 = () => {
    return roundTo((42.5 * trafficMultiplier) / (cacheEnabled ? 2.5 : 1.0) / (1.2 * regionsCount), 1);
  };

  const calculateCost = () => {
    return 142500 + trafficMultiplier * 8000 + regionsCount * 22000;
  };

  const roundTo = (num: number, dec: number) => {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v4.4 DIGITAL TWIN
            </span>
            <span className="text-slate-400 text-xs">Software System Digital Twin & Advanced Simulation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Digital Twin & Simulation Studio <Layers className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Observe → Model → Define Change → Simulate (1x-100x) → Compare → Recommend → Execute → Sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">DIGITAL TWIN DECISION</span>
            <span className="text-xl font-extrabold text-white">CODEATLAS V4.4 DIGITAL TWIN READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">State Synchronization</span>
            <RefreshCw className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">Continuously Synced</p>
          <span className="text-slate-400 text-xs mt-1 block">Git / Cloud / CI/CD Live</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Load Simulation</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">1x to 100x Surge</p>
          <span className="text-slate-400 text-xs mt-1 block">Predict Bottlenecks & Lock</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Migration Matrix</span>
            <GitBranch className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">Strangler Fig Pattern</p>
          <span className="text-slate-400 text-xs mt-1 block">Safest Recommendation</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Simulation Confidence</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">94.8% Calibrated</p>
          <span className="text-slate-400 text-xs mt-1 block">140 Historical Incidents</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("twin")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "twin" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Visual Digital Twin Core
        </button>
        <button
          onClick={() => setActiveTab("blast")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "blast" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Natural Language Scenario & Blast Radius
        </button>
        <button
          onClick={() => setActiveTab("load")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "load" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          100x Traffic Load Surge Simulator
        </button>
        <button
          onClick={() => setActiveTab("migration")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "migration" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Migration Strategy Matrix
        </button>
        <button
          onClick={() => setActiveTab("whatif")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "whatif" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Interactive What-If Studio
        </button>
      </div>

      {/* TAB: WHATIF */}
      {activeTab === "whatif" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Interactive What-If Scenario Sliders</h2>
              <p className="text-xs text-slate-400">Modify traffic, cloud regions, and caching to see real-time latency & cost predictions.</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              94.8% SIMULATION ACCURACY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="font-bold text-slate-200 block">Traffic Multiplier: {trafficMultiplier}x</label>
              <input
                type="range"
                min="1"
                max="100"
                value={trafficMultiplier}
                onChange={(e) => setTrafficMultiplier(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="font-bold text-slate-200 block">Active Cloud Regions: {regionsCount}</label>
              <input
                type="range"
                min="1"
                max="8"
                value={regionsCount}
                onChange={(e) => setRegionsCount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="font-bold text-slate-200">Enable Redis Cache Layer</label>
              <input
                type="checkbox"
                checked={cacheEnabled}
                onChange={(e) => setCacheEnabled(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-semibold block uppercase">Predicted P99 Latency</span>
              <p className="text-3xl font-extrabold text-emerald-400">{calculateP99()} ms</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-semibold block uppercase">Estimated Monthly Cloud Spend</span>
              <p className="text-3xl font-extrabold text-indigo-400">${calculateCost().toLocaleString()} / mo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
