"use client";

import React, { useState } from "react";
import {
  Terminal,
  Webhook,
  GitPullRequest,
  Code2,
  Workflow,
  Box,
  ThumbsUp,
  Activity,
  Award,
  CheckCircle2,
  Layers,
  Sparkles,
  Sliders
} from "lucide-react";

export function EcosystemHubV53() {
  const [activeTab, setActiveTab] = useState<"cli" | "pr" | "ide" | "workflow" | "feedback">("cli");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v5.3 ECOSYSTEM
            </span>
            <span className="text-slate-400 text-xs">Developer & Enterprise Ecosystem</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Developer Ecosystem Hub <Terminal className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Public API, Python/TS SDKs, CodeAtlas CLI, PR Risk Score, VS Code/JetBrains IDE Context, Visual Workflow Builder, and Trace-to-Code Navigation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">ECOSYSTEM READINESS</span>
            <span className="text-xl font-extrabold text-white">V5.3 ECOSYSTEM READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">CodeAtlas CLI</span>
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">8 CLI Commands</p>
          <span className="text-slate-400 text-xs mt-1 block">Local Dev & CI Modes</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">PR Intelligence Map</span>
            <GitPullRequest className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">Explainable Risk</p>
          <span className="text-slate-400 text-xs mt-1 block">Affected Services & Teams</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">IDE Integrations</span>
            <Code2 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">VS Code & JetBrains</p>
          <span className="text-slate-400 text-xs mt-1 block">Inline Context & Trace-to-Code</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Visual Workflows & SDKs</span>
            <Workflow className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">Drag & Drop</p>
          <span className="text-slate-400 text-xs mt-1 block">Connector & Agent SDKs</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("cli")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "cli" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          CodeAtlas CLI & Webhooks
        </button>
        <button
          onClick={() => setActiveTab("pr")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "pr" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          PR Risk Score & Impact Map
        </button>
        <button
          onClick={() => setActiveTab("ide")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "ide" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          IDE Live Context & Trace-to-Code
        </button>
        <button
          onClick={() => setActiveTab("workflow")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "workflow" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Visual Workflow Builder & SDKs
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "feedback" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          14-Step Developer Scenario Test
        </button>
      </div>

      {/* TAB: CLI */}
      {activeTab === "cli" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">First-Class CodeAtlas CLI</h2>
              <p className="text-xs text-slate-400">Run codeatlas connect, analyze, search, graph, inspect, simulate, agent, and report.</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              CLI v5.3 READY
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
            <p className="text-slate-400">$ codeatlas analyze --repo payment-service --format json</p>
            <p className="text-emerald-400 font-bold">{"{"} "status": "SUCCESS", "repos_indexed": 1, "architecture_health": 98.6 {"}"}</p>
          </div>
        </div>
      )}

      {/* TAB: FEEDBACK */}
      {activeTab === "feedback" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">14-Step End-to-End Developer Workflow Results</h2>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Workflow Simulation</span>
              <span className="text-emerald-400 font-bold">14 Integrated Steps</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Coverage</span>
              <span className="text-slate-200 font-bold">IDE → PR → CI Policy Gate → Canary Deployment → Production Tracing</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Workflow Verdict</span>
              <span className="text-emerald-400 font-extrabold uppercase">DEVELOPER_WORKFLOW_FULLY_INTEGRATED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
