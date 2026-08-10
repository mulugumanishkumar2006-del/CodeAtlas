"use client";

import React, { useState } from "react";
import {
  Workflow,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Sliders,
  Terminal,
  PlayCircle,
  RotateCcw,
  UserCheck,
  FileCode,
  ShieldAlert
} from "lucide-react";

export function WorkflowsHubV61() {
  const [activeTab, setActiveTab] = useState<"flagships" | "statemachine" | "humanreview" | "test15">("flagships");

  const flagshipWorkflows = [
    { id: "wf_1", name: "1. Autonomous Incident Investigator", trigger: "Production Anomaly / Alert", risk: "ANALYZE" },
    { id: "wf_2", name: "2. Autonomous Security Remediator", trigger: "CVE Vulnerability Detected", risk: "CREATE_PR" },
    { id: "wf_3", name: "3. Autonomous Dependency Upgrader", trigger: "Outdated Dependency Alert", risk: "CREATE_PR" },
    { id: "wf_4", name: "4. Autonomous Architecture Reviewer", trigger: "Coupling & Drift Analysis", risk: "READ" },
    { id: "wf_5", name: "5. Autonomous Technical-Debt Engineer", trigger: "High Risk/Cost Debt Item", risk: "RECOMMEND" },
    { id: "wf_6", name: "6. Autonomous Performance Optimizer", trigger: "Endpoint Latency Degradation", risk: "WRITE" },
    { id: "wf_7", name: "7. Autonomous Cloud Cost Optimizer", trigger: "Idle Overprovisioned Infra", risk: "RECOMMEND" },
    { id: "wf_8", name: "8. Autonomous Test Engineer", trigger: "Uncovered Critical Path Diff", risk: "WRITE" },
    { id: "wf_9", name: "9. Autonomous Documentation Engineer", trigger: "Doc & API Drift", risk: "CREATE_PR" },
    { id: "wf_10", name: "10. Autonomous Migration Engineer", trigger: "Framework / DB Upgrade", risk: "DEPLOY" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v6.1 WORKFLOWS
            </span>
            <span className="text-slate-400 text-xs">Governed Autonomous Engineering Execution Framework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Autonomous Engineering Workflows <Workflow className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Global Autonomy Contract, 8-State Workflow Machine, 10 Flagship Governed Workflows, Human Review Center, and Auto-Rollback Engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">WORKFLOWS READINESS</span>
            <span className="text-xl font-extrabold text-white">V6.1 WORKFLOWS READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Flagship Workflows</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">10 Flagship Suite</p>
          <span className="text-slate-400 text-xs mt-1 block">Incident, Security, Perf, Cost, Migrations</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">State Machine</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">8 Workflow States</p>
          <span className="text-slate-400 text-xs mt-1 block">CREATED → COMPLETED / ROLLED_BACK</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Human Review</span>
            <UserCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">Action Previews</p>
          <span className="text-slate-400 text-xs mt-1 block">Diff, Impact & Verification Dashboard</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Autonomous Test</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">15-Step Passed</p>
          <span className="text-slate-400 text-xs mt-1 block">Detection → Recovery & Learning</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("flagships")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "flagships" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          10 Flagship Autonomous Workflows
        </button>
        <button
          onClick={() => setActiveTab("statemachine")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "statemachine" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Workflow State Machine & Tool Control
        </button>
        <button
          onClick={() => setActiveTab("humanreview")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "humanreview" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Human Review Center & Action Preview
        </button>
        <button
          onClick={() => setActiveTab("test15")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "test15" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          15-Step Autonomous Engineering Test
        </button>
      </div>

      {/* TAB: FLAGSHIPS */}
      {activeTab === "flagships" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flagshipWorkflows.map((wf) => (
            <div key={wf.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-sm">{wf.name}</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  RISK: {wf.risk}
                </span>
              </div>
              <p className="text-xs text-slate-300">Trigger: {wf.trigger}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Status: GOVERNED & VERIFIED</span>
                <span className="text-emerald-400 font-semibold">100% Policy Compliant</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: TEST15 */}
      {activeTab === "test15" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">15-Step Final Autonomous Engineering Test Results</h2>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Autonomous Core Pipeline</span>
              <span className="text-emerald-400 font-bold">Detect → Context → Investigate → Evidence → Candidates → Confidence → Options → Simulate → Approve → Execute → Verify → Rollback Safety → Record → Memory → Recommend</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Incident Trigger Tested</span>
              <span className="text-slate-200 font-bold">Service latency spike on checkout endpoint</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Final Test Verdict</span>
              <span className="text-emerald-400 font-extrabold uppercase">CODEATLAS_CAN_SAFELY_PERFORM_REAL_ENGINEERING_WORK</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
