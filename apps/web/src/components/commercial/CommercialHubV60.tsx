"use client";

import React, { useState } from "react";
import {
  Rocket,
  Shield,
  Bot,
  Sparkles,
  Sliders,
  DollarSign,
  Activity,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Cpu,
  Terminal,
  HelpCircle,
  TrendingUp,
  Power
} from "lucide-react";

export function CommercialHubV60() {
  const [activeTab, setActiveTab] = useState<"packaging" | "personas" | "autonomy" | "digitaltwin" | "loop14">("packaging");
  const [selectedPersona, setSelectedPersona] = useState("CTO");
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v6.0 COMMERCIAL GA
            </span>
            <span className="text-slate-400 text-xs">Commercial Autonomous Engineering Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Autonomous Engineering Intelligence Platform <Rocket className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Product Packaging (Free to Enterprise), 6 Persona Views, L0-L5 Autonomy Tiers, Digital Twin What-If, Engineering FinOps ROI, and 14-Step Autonomous Loop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">COMMERCIAL STATUS</span>
            <span className="text-xl font-extrabold text-white">V6.0 COMMERCIAL READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Product Tiers</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">4 Commercial Tiers</p>
          <span className="text-slate-400 text-xs mt-1 block">Free, Pro, Team & Enterprise</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Autonomy Levels</span>
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">L0 to L5 Autonomy</p>
          <span className="text-slate-400 text-xs mt-1 block">Governed AI Agents + Kill Switch</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">FinOps ROI</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">78% Investigation Reduced</p>
          <span className="text-slate-400 text-xs mt-1 block">340 Hours Saved Monthly</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Autonomous Loop</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">14-Step Verified</p>
          <span className="text-slate-400 text-xs mt-1 block">Problem → Learning Executed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("packaging")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "packaging" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Product Packaging & Metering
        </button>
        <button
          onClick={() => setActiveTab("personas")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "personas" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          6 Persona-Driven Views
        </button>
        <button
          onClick={() => setActiveTab("autonomy")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "autonomy" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          L0-L5 Autonomy & PR Generator
        </button>
        <button
          onClick={() => setActiveTab("digitaltwin")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "digitaltwin" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Digital Twin What-If & FinOps ROI
        </button>
        <button
          onClick={() => setActiveTab("loop14")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "loop14" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          14-Step Autonomous Engineering Loop
        </button>
      </div>

      {/* TAB: AUTONOMY */}
      {activeTab === "autonomy" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Safe Autonomy Levels & Autonomous PR Engine</h2>
              <p className="text-xs text-slate-400">Configure maximum autonomy policies (L0 to L5) and trigger instant administrative kill switch.</p>
            </div>
            <button
              onClick={() => setKillSwitchActive(!killSwitchActive)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all ${
                killSwitchActive
                  ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400"
              }`}
            >
              <Power className="w-4 h-4" /> {killSwitchActive ? "KILL SWITCH ACTIVE (HALTED)" : "KILL SWITCH READY"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm">Autonomous Pull Request #412</span>
              <p className="text-slate-300 font-medium">[CodeAtlas Agent Fix] ISSUE-992: Add composite database index for payment query</p>
              <p className="text-slate-400">Autonomy Tier: L3_EXECUTE_WITH_APPROVAL | Risk: LOW | Coverage: 100%</p>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300">
                Review Verdict: APPROVED_PASSING_POLICY_GATES (Clean Zero SAST Vulnerabilities)
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-indigo-400 text-sm">Specialized Multi-Agent Orchestration</span>
              <p className="text-slate-300">Architect, Developer, Security, SRE & Tester Agents</p>
              <p className="text-emerald-400 font-bold">Consensus: UNANIMOUS_CONSENSUS_REACHED</p>
              <p className="text-slate-500">All cross-agent delegation performed under strict policy gates.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LOOP14 */}
      {activeTab === "loop14" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">14-Step Autonomous Engineering Loop Execution</h2>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Autonomous Core Loop</span>
              <span className="text-emerald-400 font-bold">CONNECT → ANALYZE → UNDERSTAND → INVESTIGATE → SIMULATE → DECIDE → ACT → VERIFY → LEARN</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Problem Investigated</span>
              <span className="text-slate-200 font-bold">Service latency spike on checkout endpoint</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Loop Verdict</span>
              <span className="text-emerald-400 font-extrabold uppercase">CODEATLAS_AUTONOMOUS_ENGINEERING_LOOP_SUCCESSFUL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
