"use client";

import React, { useState } from "react";
import {
  Bot,
  Play,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  DollarSign,
  Activity,
  FileCode,
  GitPullRequest,
  GitCommit,
  XCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export function AutopilotControlCenter({ repositoryId = "demo-repo" }: { repositoryId?: string }) {
  const [objective, setObjective] = useState("Reduce coupling in auth_service and extract OAuth2 capability");
  const [loading, setLoading] = useState(false);
  const [activeRun, setActiveRun] = useState<any>(null);
  const [approvalGranted, setApprovalGranted] = useState(false);

  const handleInitiateRun = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/autopilot/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository_id: repositoryId,
          objective: objective,
          trigger: "DEVELOPER_REQUEST",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveRun(data);
      } else {
        setActiveRun(getMockRun(repositoryId, objective));
      }
    } catch {
      setActiveRun(getMockRun(repositoryId, objective));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!activeRun) return;
    try {
      const res = await fetch("http://localhost:8000/api/v1/autopilot/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          run_id: activeRun.run_id,
          scopes_to_approve: ["CODE_MODIFICATION", "TESTING", "COMMIT", "PULL_REQUEST"],
          approved_by: "Lead Architect",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveRun(data);
        setApprovalGranted(true);
      }
    } catch {
      activeRun.status = "APPROVED";
      setApprovalGranted(true);
      setActiveRun({ ...activeRun });
    }
  };

  const handleExecuteNext = async () => {
    if (!activeRun) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/autopilot/execute-next?run_id=${activeRun.run_id}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setActiveRun(data);
      }
    } catch {
      activeRun.status = "COMPLETED";
      setActiveRun({ ...activeRun });
    }
  };

  const handleCancel = async () => {
    if (!activeRun) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/autopilot/cancel?run_id=${activeRun.run_id}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setActiveRun(data);
      }
    } catch {
      activeRun.status = "CANCELLED";
      setActiveRun({ ...activeRun });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 rounded-lg shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              v1.3 Engineering Autopilot Control Center
            </h2>
            <p className="text-xs text-slate-400">
              HUMAN-APPROVED CONTROLLED AUTOMATION &bull; SANDBOX EXECUTION &bull; SCOPE PROTECTION
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Human Approval Mandatory
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Budget Limit: $2.00
          </span>
        </div>
      </div>

      {/* Objective Input Form */}
      <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 text-xs">
        <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Specify Engineering Autopilot Objective
        </span>
        <div className="flex gap-3">
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="e.g. Reduce coupling in PaymentService. Fix architecture drift."
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none"
          />
          <button
            onClick={handleInitiateRun}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium rounded transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Initiate Autopilot Run
          </button>
        </div>
      </div>

      {/* Active Run Display & Human Approval Gate */}
      {activeRun && (
        <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1 text-xs">
          {/* Status Bar */}
          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-slate-400">Autopilot Run ID: <strong className="text-slate-200 font-mono">{activeRun.run_id}</strong></span>
              <p className="text-sm font-bold text-slate-100">{activeRun.objective}</p>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full font-bold uppercase text-xs border ${
                activeRun.status === "AWAITING_APPROVAL"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse"
                  : activeRun.status === "COMPLETED"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              }`}>
                State: {activeRun.status}
              </span>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-rose-900/40 hover:bg-rose-800/60 text-rose-300 rounded border border-rose-800 transition"
              >
                Cancel Run
              </button>
            </div>
          </div>

          {/* HUMAN APPROVAL GATE MODAL CARD */}
          {activeRun.status === "AWAITING_APPROVAL" && (
            <div className="p-5 bg-amber-950/30 border-2 border-amber-500/60 rounded-xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-sm uppercase flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" /> Human Approval Required Before Sandbox Execution
                </span>
                <span className="text-amber-400 font-mono">SCOPES REQUESTED: CODE_MODIFICATION, TESTING, PR</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-amber-900/40 space-y-2 text-slate-300">
                <p className="font-mono text-xs">{activeRun.plan_summary}</p>
                <p className="font-mono text-xs text-emerald-400">{activeRun.simulation_summary}</p>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded transition"
                >
                  [ REJECT ]
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded transition shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> [ APPROVE & GRANT PERMISSION ]
                </button>
              </div>
            </div>
          )}

          {/* Execution Controls after Approval */}
          {activeRun.status === "APPROVED" && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-lg flex items-center justify-between">
              <span className="font-bold text-emerald-400">Approval granted! Ready to execute isolated sandbox step.</span>
              <button
                onClick={handleExecuteNext}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Execute Sandbox Steps
              </button>
            </div>
          )}

          {/* Step Sequence Table */}
          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider">Step Execution Sequence</h4>
            <div className="space-y-2">
              {activeRun.steps.map((step: any, i: number) => (
                <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold font-mono text-cyan-400">#{step.step_number}</span>
                    <span className="font-semibold text-slate-200">{step.title}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {step.command && <span className="font-mono text-[11px] text-slate-400">`{step.command}`</span>}
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                      step.state === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
                    }`}>
                      {step.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log Inspector */}
          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider">Auditable Trail Log ({activeRun.audit_logs.length})</h4>
            <div className="space-y-1 font-mono text-[11px]">
              {activeRun.audit_logs.map((log: any, idx: number) => (
                <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between text-slate-300">
                  <span>[{log.timestamp}] <strong>{log.action}</strong> by {log.user}: {log.details}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getMockRun(repositoryId: string, objective: string) {
  return {
    run_id: "ap_run_demo123",
    repository_id: repositoryId,
    objective: objective,
    status: "AWAITING_APPROVAL",
    approved_scopes: ["ANALYSIS_ONLY"],
    plan_summary: `ENGINEERING AUTOPILOT PLAN:\nObjective: ${objective}\nAffected Files: 2 expected\nAffected Components: auth_service, oauth2_service`,
    simulation_summary: "SIMULATION RESULT: Risk score drops from 78.5 to 28.0 (-50.5 pts). Low regression probability.",
    steps: [
      { step_number: 1, title: "Context & Evidence Gathering", state: "COMPLETED" },
      { step_number: 2, title: "Engineering Implementation Plan Generation", state: "COMPLETED" },
      { step_number: 3, title: "Virtual Graph Simulation (v1.2 Studio)", state: "COMPLETED" },
      { step_number: 4, title: "Human Approval Gate", state: "AWAITING_APPROVAL" },
      { step_number: 5, title: "Isolated Sandbox Code Execution", state: "DETECTED" },
    ],
    audit_logs: [
      { timestamp: "2026-08-08T10:00:00Z", action: "INITIATE_RUN", user: "Staff Software Engineer", details: "Initiated run for objective." },
    ],
  };
}
