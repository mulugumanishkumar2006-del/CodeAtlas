"use client";

import React, { useState } from "react";
import {
  Bot,
  Shield,
  Activity,
  AlertOctagon,
  CheckCircle2,
  Lock,
  GitBranch,
  Terminal,
  Zap,
  Power,
  Users,
  Layers,
  Sparkles,
  FileCode,
  Flame,
  RotateCcw,
  Clock,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

export function AutonomousNetworkHub() {
  const [activeTab, setActiveTab] = useState<"agents" | "warroom" | "approvals" | "policy" | "killswitch">("agents");
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  const agents = [
    { id: "agent_inc", name: "Incident Agent", purpose: "Directs real-time incident investigation & postmortems", caps: ["READ", "ANALYZE", "RECOMMEND", "EXECUTE"], risk: "HIGH", status: "ACTIVE" },
    { id: "agent_sre", name: "SRE Agent", purpose: "Monitors SLIs/SLOs and coordinates system recovery", caps: ["READ", "ANALYZE", "RECOMMEND", "EXECUTE"], risk: "HIGH", status: "ACTIVE" },
    { id: "agent_code", name: "Code Agent", purpose: "Generates patches, refactors code, and runs tests", caps: ["READ", "ANALYZE", "RECOMMEND", "WRITE"], risk: "MEDIUM", status: "ACTIVE" },
    { id: "agent_sec", name: "Security Agent", purpose: "Investigates vulnerabilities, secrets, and SBOMs", caps: ["READ", "ANALYZE", "RECOMMEND", "WRITE"], risk: "MEDIUM", status: "ACTIVE" },
    { id: "agent_arch", name: "Architecture Agent", purpose: "Monitors service boundaries and ADR compliance", caps: ["READ", "ANALYZE", "RECOMMEND"], risk: "LOW", status: "ACTIVE" },
    { id: "agent_rel", name: "Release Agent", purpose: "Directs progressive delivery rollouts", caps: ["READ", "ANALYZE", "RECOMMEND", "EXECUTE"], risk: "HIGH", status: "ACTIVE" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-500/10 text-purple-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-500/20">
              CODEATLAS v3.5
            </span>
            <span className="text-slate-400 text-xs">Governed Autonomous Engineering Network</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Autonomous Network & Policy Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Scoped, visible, auditable, reversible, policy-controlled autonomous agents collaborating across the engineering lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setKillSwitchActive(!killSwitchActive)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all shadow-lg ${
              killSwitchActive
                ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse"
                : "bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-red-400"
            }`}
          >
            <Power className="w-4 h-4" />
            {killSwitchActive ? "EMERGENCY KILL SWITCH ACTIVE" : "EMERGENCY KILL SWITCH"}
          </button>
        </div>
      </div>

      {/* Emergency Banner if active */}
      {killSwitchActive && (
        <div className="bg-red-500/10 border-2 border-red-500/40 p-4 rounded-xl mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="font-bold text-red-400 text-sm">GLOBAL AGENT OPERATIONS PAUSED</h3>
              <p className="text-xs text-slate-300">All autonomous agent executions, webhooks, and tool writes are currently suspended by Administrator.</p>
            </div>
          </div>
          <button onClick={() => setKillSwitchActive(false)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
            Resume Agents
          </button>
        </div>
      )}

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Specialized Agents</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">14 Agents</p>
          <span className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Registered & Policy-Scoped
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Engineering Autonomy Score</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">88.4 / 100</p>
          <span className="text-slate-400 text-xs mt-1 block">74.2% Automation Rate</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Human Approvals</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">98.5% Rate</p>
          <span className="text-slate-400 text-xs mt-1 block">1 Pending Approval</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Monthly Engineering ROI</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">2,180 Saved Hrs</p>
          <span className="text-slate-400 text-xs mt-1 block">$480,000 Annualized Savings</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("agents")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "agents" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Specialized Agents (14)
        </button>
        <button
          onClick={() => setActiveTab("warroom")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "warroom" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Incident War Room & Hypotheses
        </button>
        <button
          onClick={() => setActiveTab("approvals")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "approvals" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Human Approval Console
        </button>
        <button
          onClick={() => setActiveTab("policy")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "policy" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Autonomy Policy Engine (L0-L5)
        </button>
      </div>

      {/* TAB: AGENTS */}
      {activeTab === "agents" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{agent.name}</h3>
                      <span className="text-xs font-mono text-slate-400">v3.5.0</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    agent.risk === "HIGH" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  }`}>
                    {agent.risk} RISK
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-4">{agent.purpose}</p>

                <div className="space-y-2 py-3 border-t border-b border-slate-800/80 my-3 text-xs">
                  <span className="text-slate-500 block">Declared Capabilities:</span>
                  <div className="flex flex-wrap gap-1">
                    {agent.caps.map((c) => (
                      <span key={c} className="bg-slate-950 text-purple-300 text-xs px-2 py-0.5 rounded border border-slate-800 font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Policy Authorized
                </span>
                <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">Configure Scopes</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: WAR ROOM */}
      {activeTab === "warroom" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-bold text-white">Incident War Room: INC-9941</h2>
              </div>
              <p className="text-xs text-slate-400">Real-time collaborative investigation space with Incident Commander AI.</p>
            </div>
            <span className="bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/20">
              SEV-1 IN PROGRESS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-purple-400">Competing Hypotheses Matrix</h3>
              <div className="space-y-3">
                <div className="bg-slate-900 p-3 rounded-lg border border-emerald-500/30 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>Hypothesis 1: Redis Pool Exhaustion</span>
                    <span className="text-emerald-400">85% Probability</span>
                  </div>
                  <p className="text-slate-400">Evidence: HTTP 500 error rate &gt; 5%, Datadog socket metric spike.</p>
                  <span className="text-emerald-400 font-semibold block pt-1">Status: VALIDATED ROOT CAUSE</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>Hypothesis 2: Aurora DB I/O Bottleneck</span>
                    <span className="text-slate-400">15% Probability</span>
                  </div>
                  <p className="text-slate-400">Contradictions: Aurora IOPS within normal operating thresholds.</p>
                  <span className="text-slate-500 block pt-1">Status: DISPROVED</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-purple-400">Recommended Recovery Sequence</h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="bg-purple-600 text-white font-bold px-2 py-0.5 rounded text-xs">1</span>
                  <span>Trigger Rollback of deployment dep_8812 to v3.2.0-stable</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="bg-purple-600 text-white font-bold px-2 py-0.5 rounded text-xs">2</span>
                  <span>Verify HTTP P99 latency drops below 100ms</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="bg-purple-600 text-white font-bold px-2 py-0.5 rounded text-xs">3</span>
                  <span>Re-scale Redis cluster nodes and connection limit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: APPROVALS */}
      {activeTab === "approvals" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Human Approval Console</h2>
            <span className="text-xs text-slate-400">1 Request Pending Authorization</span>
          </div>

          <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Autonomy Level: L3 Human Approval</span>
                <h3 className="text-base font-bold text-white">Rollback Deployment #8812 (Payment Service)</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Expires in 28 mins</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
              <div><span className="text-slate-500 block">Requesting Agent</span><strong>Incident Agent (agent_inc)</strong></div>
              <div><span className="text-slate-500 block">Risk Score</span><strong className="text-amber-400">7.8 / 10 (HIGH)</strong></div>
              <div><span className="text-slate-500 block">Target System</span><strong>payment-service (Production)</strong></div>
              <div><span className="text-slate-500 block">Rollback Strategy</span><strong>v3.2.0-stable (1-Click Revert)</strong></div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
              <strong>Evidence & Reason:</strong> PR #101 introduced unpooled Redis connections causing HTTP 500 error rate spike to 6.2%.
            </div>

            <div className="flex gap-3 pt-2">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-600/20">
                Authorize & Execute Action
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-lg text-xs font-medium">
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: POLICY */}
      {activeTab === "policy" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Autonomy Levels & Central Policy Engine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-purple-400">Autonomy Levels L0–L5</h3>
              <div className="space-y-1.5 text-slate-300">
                <p>• <strong>L0 Observe:</strong> Passive telemetry monitoring only</p>
                <p>• <strong>L1 Recommend:</strong> Generate suggestions without code changes</p>
                <p>• <strong>L2 Draft:</strong> Create draft PRs or patches for review</p>
                <p>• <strong>L3 Human Approval:</strong> Require explicit human signoff before execution</p>
                <p>• <strong>L4 Policy Autonomous:</strong> Execute automatically if within policy thresholds</p>
                <p>• <strong>L5 Restricted Autonomous:</strong> Restricted autonomous emergency operations</p>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-purple-400">Active Autonomy Policies</h3>
              <div className="space-y-2">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-bold text-white block">Production Actions Require L3 Approval</span>
                  <span className="text-slate-400">All executions targeting production environment require explicit human authorization.</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-bold text-white block">Critical Security Actions Require Dual Signoff</span>
                  <span className="text-slate-400">Security response actions with risk &gt; 8.0 require Security Lead approval.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
