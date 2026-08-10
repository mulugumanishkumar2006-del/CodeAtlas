"use client";

import React, { useState } from "react";
import {
  Cpu,
  Brain,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Layers,
  Sparkles,
  Search,
  Sliders,
  DollarSign,
  PlayCircle,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check
} from "lucide-react";

export function EngineeringOSHubV50() {
  const [activeTab, setActiveTab] = useState<"command" | "copilots" | "timetravel" | "tradeoffs" | "selfhealth">("command");
  const [selectedMode, setSelectedMode] = useState("EXECUTIVE");
  const [selectedCopilotRole, setSelectedCopilotRole] = useState("CTO");

  const commandModes = [
    "EXECUTIVE", "ARCHITECT", "DEVELOPER", "SRE", "SECURITY", "FINOPS", "AGENT", "DIGITAL_TWIN"
  ];

  const copilotResponses: Record<string, string> = {
    CTO: "Overall enterprise health is 98.6. System risk is LOW. Monthly cloud spend is $142,500.",
    ARCHITECT: "Architecture drift detected in payment-service (ADR-014 violation). Recommended refactoring Redis async pool.",
    SRE: "SLO Error Budget is 99.98% remaining. P99 latency is 42ms. 0 active production incidents.",
    SECURITY: "0 critical unpatched CVEs. 1 security policy exception active (Legacy auth buffer, expires in 24 days).",
    FINOPS: "Cloud spend attributed: Team-Payments ($68.2k), Team-Platform ($40.2k), Team-Auth ($34.1k)."
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v5.0 OS
            </span>
            <span className="text-slate-400 text-xs">The Engineering Intelligence OS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Engineering Intelligence OS <Cpu className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Observe → Understand → Reason → Simulate → Decide → Act → Verify → Learn → Update.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">FINAL STATUS</span>
            <span className="text-xl font-extrabold text-white">V5.0 OS READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Unified Graph & Memory</span>
            <Brain className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">84,200 Edges</p>
          <span className="text-slate-400 text-xs mt-1 block">Entity Resolved & Provenance Backed</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Role Copilots</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">5 Role Copilots</p>
          <span className="text-slate-400 text-xs mt-1 block">CTO, Architect, SRE, Security, FinOps</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Command Center</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">8 Modes</p>
          <span className="text-slate-400 text-xs mt-1 block">Includes Immersive Time Travel</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Self-Diagnostics</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">100% Healthy</p>
          <span className="text-slate-400 text-xs mt-1 block">28-Step Anomaly Scenario Passed</span>
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
          8-Mode Command Center
        </button>
        <button
          onClick={() => setActiveTab("copilots")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "copilots" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          5 Role-Based AI Copilots
        </button>
        <button
          onClick={() => setActiveTab("timetravel")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "timetravel" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Time Travel Architecture Reconstruct
        </button>
        <button
          onClick={() => setActiveTab("selfhealth")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "selfhealth" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Platform Self-Diagnostics & 28-Step Test
        </button>
      </div>

      {/* TAB: COMMAND */}
      {activeTab === "command" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Unified Engineering Command Center</h2>
              <p className="text-xs text-slate-400">Switch between 8 dedicated views tailored for every engineering stakeholder.</p>
            </div>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="bg-slate-950 text-emerald-400 border border-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none"
            >
              {commandModes.map((mode) => (
                <option key={mode} value={mode}>{mode} MODE</option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold text-emerald-400">{selectedMode} Mode Dashboard Summary</h3>
            <p className="text-slate-300">
              Displaying real-time telemetry, architecture graph, risk metrics, and governed agent controls for {selectedMode} mode.
            </p>
          </div>
        </div>
      )}

      {/* TAB: COPILOTS */}
      {activeTab === "copilots" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">5 Role-Based Conversational Copilots</h2>
              <p className="text-xs text-slate-400">Contextual evidence-backed responses for CTO, Architect, SRE, Security, and FinOps roles.</p>
            </div>
            <div className="flex gap-2">
              {["CTO", "ARCHITECT", "SRE", "SECURITY", "FINOPS"].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedCopilotRole(role)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedCopilotRole === role ? "bg-emerald-500 text-slate-950" : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <span className="text-indigo-400 font-bold">{selectedCopilotRole} Role Copilot Output</span>
            <p className="text-slate-200 text-sm leading-relaxed">{copilotResponses[selectedCopilotRole]}</p>
            <div className="pt-2 border-t border-slate-800 text-slate-400 flex items-center justify-between">
              <span>Evidence: Telemetry TSDB + AST Parser + ADR-014</span>
              <span className="text-emerald-400 font-bold">100% Actionable</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
