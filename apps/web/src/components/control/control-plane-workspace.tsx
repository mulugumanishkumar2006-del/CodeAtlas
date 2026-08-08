"use client";

import React, { useState } from "react";
import {
  Server,
  Activity,
  Layers,
  Shield,
  AlertTriangle,
  Play,
  CheckCircle2,
  Bot,
  Send,
  Sparkles,
  GitCommit,
  RefreshCw,
  Sliders,
  Cpu,
} from "lucide-react";

export function ControlPlaneWorkspace({
  organizationId = "acme-corp",
  repositoryId = "demo-repo",
}: {
  organizationId?: string;
  repositoryId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [drifts, setDrifts] = useState<any[]>([]);
  const [targetEnv, setTargetEnv] = useState("STAGING");
  const [planResult, setPlanResult] = useState<any>(null);
  const [aiQuestion, setAiQuestion] = useState("What is currently running in Staging and is there any drift?");
  const [aiResponse, setAiResponse] = useState<any>(null);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const [eRes, qRes, dRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/control-plane/environments/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/control-plane/queue/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/control-plane/drift/${organizationId}`),
      ]);

      if (eRes.ok) setEnvironments(await eRes.json());
      else setEnvironments(getMockEnvironments(organizationId));

      if (qRes.ok) setQueue(await qRes.json());
      else setQueue(getMockQueue(organizationId));

      if (dRes.ok) setDrifts(await dRes.json());
      else setDrifts(getMockDrifts());
    } catch {
      setEnvironments(getMockEnvironments(organizationId));
      setQueue(getMockQueue(organizationId));
      setDrifts(getMockDrifts());
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/control-plane/deployments/plan?organization_id=${organizationId}&repository_id=${repositoryId}&target_environment=${targetEnv}&target_version=v1.3.0-rc1&strategy=CANARY`,
        { method: "POST" }
      );
      if (res.ok) setPlanResult(await res.json());
      else setPlanResult(getMockPlanResult(targetEnv));
    } catch {
      setPlanResult(getMockPlanResult(targetEnv));
    }
  };

  const handleAskOpsAI = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/control-plane/ai-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: organizationId, question: aiQuestion }),
      });
      if (res.ok) setAiResponse(await res.json());
      else setAiResponse(getMockOpsAI(organizationId, aiQuestion));
    } catch {
      setAiResponse(getMockOpsAI(organizationId, aiQuestion));
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 rounded-lg shadow-lg">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              v1.9 Engineering Control Plane Workspace
            </h2>
            <p className="text-xs text-slate-400">
              ORCHESTRATION &bull; MULTI-ENVIRONMENT GRAPH &bull; POLICY GUARD GATES &bull; DRIFT DETECTION
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchData}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Load Control Plane Matrix
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1 text-xs">
        {/* Environment Matrix & Graph */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 font-mono">
          <h3 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" /> Multi-Environment Matrix (What Runs Where)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {environments.map((env: any, i: number) => (
              <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-[11px]">{env.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[9px]">
                    {env.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px]">Provider: {env.provider}</p>
                <p className="text-cyan-300 font-bold text-[10px]">Active Version: {env.current_version}</p>
                <div className="pt-1 flex gap-1 text-[9px]">
                  {env.allowed_operations?.map((op: string, j: number) => (
                    <span key={j} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {op}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Planning & Policy Risk Guard */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-400" /> Deployment Planning & Policy Risk Guard Gate
            </h3>
            <div className="flex gap-2">
              <select
                value={targetEnv}
                onChange={(e) => setTargetEnv(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200"
              >
                <option value="STAGING">STAGING</option>
                <option value="PRODUCTION">PRODUCTION</option>
                <option value="DEVELOPMENT">DEVELOPMENT</option>
              </select>
              <button
                onClick={handleCreatePlan}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded transition flex items-center gap-1.5 text-xs"
              >
                <Play className="w-3.5 h-3.5" /> Plan Deployment
              </button>
            </div>
          </div>

          {planResult && (
            <div className="p-3 bg-slate-950 rounded border border-teal-900/40 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-400">Target Env:</span> <strong className="text-cyan-300">{planResult.target_environment}</strong>
                <span className="ml-3 text-slate-400">Target Version:</span> <strong className="text-emerald-300">{planResult.target_version}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">{planResult.strategy}</span>
                <span className={`px-2.5 py-0.5 rounded font-bold ${
                  planResult.policy_result === "ALLOWED" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                }`}>
                  {planResult.policy_result}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Queue & Drift Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Operations Queue */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 font-mono">
            <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Centralized Operations Queue
            </h3>
            <div className="space-y-2">
              {queue.map((item: any, i: number) => (
                <div key={i} className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 text-[11px]">{item.action}</span>
                    <p className="text-slate-400 text-[9px]">Requested by: {item.agent_or_user}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[9px]">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Drift Alerts */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 font-mono">
            <h3 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Runtime Environment Drift Alerts
            </h3>
            <div className="space-y-2">
              {drifts.map((drift: any, i: number) => (
                <div key={i} className="p-2.5 bg-slate-950 rounded border border-amber-900/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-300 text-[11px]">{drift.service_name} ({drift.environment_name})</span>
                    <p className="text-slate-400 text-[9px]">Expected: {drift.expected_version} | Observed: {drift.observed_version}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">{drift.drift_type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operations AI Chatbot */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
          <h3 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-400" /> Operations AI Assistant (Evidence Grounded RAG)
          </h3>
          <div className="flex gap-2 text-xs">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask operational questions..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none"
            />
            <button
              onClick={handleAskOpsAI}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Ask Control Plane
            </button>
          </div>

          {aiResponse && (
            <div className="p-4 bg-slate-950 rounded border border-emerald-900/40 space-y-2 font-mono text-xs">
              <p className="text-slate-200 whitespace-pre-wrap">{aiResponse.answer}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Evidence: {aiResponse.evidence_citations.join(" | ")}</span>
                <span className="text-emerald-400 font-bold">Confidence: {(aiResponse.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getMockEnvironments(orgId: string) {
  return [
    {
      name: "DEVELOPMENT",
      provider: "AWS EKS / K8s",
      current_version: "v1.3.0-dev",
      allowed_operations: ["DEPLOY", "CANARY_TEST"],
      status: "HEALTHY",
    },
    {
      name: "STAGING",
      provider: "AWS EKS / K8s",
      current_version: "v1.3.0-rc1",
      allowed_operations: ["DEPLOY", "SIMULATION_TEST"],
      status: "HEALTHY",
    },
    {
      name: "PRODUCTION",
      provider: "AWS EKS Multi-Region",
      current_version: "v1.2.0",
      allowed_operations: ["POLICY_APPROVED_DEPLOY"],
      status: "HEALTHY",
    },
  ];
}

function getMockQueue(orgId: string) {
  return [
    {
      action: "Option B Canary Deployment to Staging",
      agent_or_user: "Autonomy Agent & Lead Architect",
      status: "RUNNING",
    },
  ];
}

function getMockDrifts() {
  return [
    {
      environment_name: "STAGING",
      service_name: "auth_service",
      expected_version: "v1.3.0-rc1",
      observed_version: "v1.2.9-hotfix",
      drift_type: "RUNTIME",
    },
  ];
}

function getMockPlanResult(targetEnv: string) {
  return {
    target_environment: targetEnv,
    target_version: "v1.3.0-rc1",
    strategy: "CANARY",
    policy_result: targetEnv === "PRODUCTION" ? "REQUIRES_APPROVAL" : "ALLOWED",
  };
}

function getMockOpsAI(orgId: string, q: string) {
  return {
    organization_id: orgId,
    question: q,
    answer: "OPERATIONS CONTROL PLANE STATUS FOR STAGING:\n1. CURRENT VERSION: auth_service v1.3.0-rc1 on AWS EKS.\n2. DRIFT DETECTED: Observed runtime image is v1.2.9-hotfix.\n3. HEALTH: 100% liveness probes passing.",
    evidence_citations: ["EKS Pod Telemetry", "CI/CD Run #409"],
    confidence: 0.96,
  };
}
