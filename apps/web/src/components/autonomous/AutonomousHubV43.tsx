"use client";

import React, { useState } from "react";
import {
  Brain,
  ShieldCheck,
  Zap,
  AlertOctagon,
  CheckCircle2,
  Workflow,
  Sparkles,
  Layers,
  Lock,
  RefreshCw,
  Sliders,
  Terminal,
  Activity,
  Award,
  Flame,
  Check
} from "lucide-react";

export function AutonomousHubV43() {
  const [activeTab, setActiveTab] = useState<"registry" | "execution" | "consensus" | "canary" | "killswitch">("registry");
  const [killSwitchTriggered, setKillSwitchTriggered] = useState(false);

  const handleKillSwitch = () => {
    setKillSwitchTriggered(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v4.3 AUTONOMOUS 2.0
            </span>
            <span className="text-slate-400 text-xs">Safe, Governed, Verifiable Autonomous System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Autonomous Engineering 2.0 Command <Brain className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Observe → Reason → Investigate → Plan → Approve → Execute → Verify → Rollback → Learn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleKillSwitch}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 border shadow-lg transition-all ${
              killSwitchTriggered
                ? "bg-red-600 text-white border-red-500 shadow-red-600/30"
                : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-600 hover:text-white"
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            {killSwitchTriggered ? "GLOBAL KILL SWITCH ACTIVE (AGENTS HALTED)" : "EMERGENCY GLOBAL KILL SWITCH"}
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Governed Agents</span>
            <Brain className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">11 Domain Agents</p>
          <span className="text-slate-400 text-xs mt-1 block">L0 to L5 Autonomy Governed</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Transactional Execution</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">Atomic Commit</p>
          <span className="text-slate-400 text-xs mt-1 block">PREPARE → VERIFY → COMMIT</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">State Verification</span>
            <Workflow className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">100% Verified</p>
          <span className="text-slate-400 text-xs mt-1 block">Auto-Rollback on Anomaly</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Canary Rollout</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">5% → 100%</p>
          <span className="text-slate-400 text-xs mt-1 block">Auto-Stop on Latency Spikes</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("registry")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "registry" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Tool Risk & Agent Registry
        </button>
        <button
          onClick={() => setActiveTab("execution")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "execution" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Transactional Action & Verification
        </button>
        <button
          onClick={() => setActiveTab("consensus")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "consensus" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          11 Specialized Agents & Consensus
        </button>
        <button
          onClick={() => setActiveTab("canary")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "canary" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Progressive Canary Rollouts
        </button>
      </div>

      {/* TAB: REGISTRY */}
      {activeTab === "registry" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Tool Risk Classification Engine</h2>
              <p className="text-xs text-slate-400">Classified into READ, LOW_RISK_WRITE, HIGH_RISK_WRITE, and DESTRUCTIVE.</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              STRICT PRODUCTION SAFETY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold">READ TOOLS</span>
              <p className="text-slate-400">fetch_ast, query_telemetry, list_services</p>
              <span className="text-slate-500 block pt-1">Approval: Not Required</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold">HIGH_RISK_WRITE</span>
              <p className="text-slate-400">deploy_canary, restart_pod, scale_cluster</p>
              <span className="text-slate-500 block pt-1">Approval: SRE Approval Required</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-red-400 font-bold">DESTRUCTIVE</span>
              <p className="text-slate-400">delete_database_cluster, drop_table</p>
              <span className="text-slate-500 block pt-1">Approval: Multi-Person Exec Approval</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CANARY */}
      {activeTab === "canary" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Progressive Canary Rollout Engine</h2>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-emerald-400">Stage 1: 5% Traffic Rollout</span>
              <span className="text-emerald-400 font-bold">PASSED (P99 = 18.4ms)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-emerald-400">Stage 2: 25% Traffic Rollout</span>
              <span className="text-emerald-400 font-bold">PASSED (P99 = 19.1ms)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-emerald-400">Stage 3: 50% Traffic Rollout</span>
              <span className="text-emerald-400 font-bold">PASSED (P99 = 20.4ms)</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-emerald-400">Stage 4: 100% Full Production Rollout</span>
              <span className="text-emerald-400 font-bold">PASSED_HEALTH_CHECK</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
