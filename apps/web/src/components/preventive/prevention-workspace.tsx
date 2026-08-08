"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Activity,
  Layers,
  HelpCircle,
  FileCheck,
  CheckSquare,
  Sparkles,
  RefreshCw,
  GitBranch,
  Award,
} from "lucide-react";

export function PreventionWorkspace({ repositoryId = "demo-repo" }: { repositoryId?: string }) {
  const [loading, setLoading] = useState(false);
  const [pipelineData, setPipelineData] = useState<any>(null);
  const [createdPlan, setCreatedPlan] = useState<any>(null);

  const handleRunPipeline = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/preventive/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prediction_id: "pred_hotspot_1",
          repository_id: repositoryId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPipelineData(data);
      } else {
        setPipelineData(getMockPipeline(repositoryId));
      }
    } catch {
      setPipelineData(getMockPipeline(repositoryId));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (optionId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/preventive/create-plan?prediction_id=pred_hotspot_1&repository_id=${repositoryId}&chosen_option_id=${optionId}`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        setCreatedPlan(data);
      } else {
        setCreatedPlan(getMockPlan(optionId, repositoryId));
      }
    } catch {
      setCreatedPlan(getMockPlan(optionId, repositoryId));
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 rounded-lg shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              v1.3 Preventive Engineering Workspace
            </h2>
            <p className="text-xs text-slate-400">
              PREDICT &rarr; RISK &rarr; CANDIDATE INTERVENTIONS &rarr; SIMULATE &rarr; SAFEST OPTION &rarr; PREVENT &rarr; LEARN
            </p>
          </div>
        </div>

        <button
          onClick={handleRunPipeline}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Run Preventive Pipeline
        </button>
      </div>

      {/* Main Grid Workspace */}
      {pipelineData ? (
        <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1">
          {/* Section 1: Risk & Recurrence Warning Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
            <div className="md:col-span-8 p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Predicted Risk Signal: {pipelineData.target_entity}
              </span>
              <p className="text-slate-200 text-sm font-semibold">{pipelineData.risk_summary}</p>
              <p className="text-slate-400 italic">"{pipelineData.recommendation}"</p>
            </div>

            {pipelineData.recurrence && (
              <div className="md:col-span-4 p-4 bg-amber-950/20 rounded-lg border border-amber-900/40 space-y-2">
                <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4" /> Recurrence Warning
                </span>
                <p className="text-slate-300">
                  Target component occurred <strong>{pipelineData.recurrence.occurrence_count} times</strong> in past git history.
                </p>
                <p className="text-amber-300 font-mono text-[11px]">
                  Action: {pipelineData.recurrence.recommended_action}
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Before vs After Comparison Card */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 text-xs">
            <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingDown className="w-4 h-4" /> Before vs Proposed State Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Current Risk Score:</span>
                <p className="text-rose-400 text-lg font-bold">{pipelineData.before_after.current_risk_score} / 100</p>
                <span className="text-slate-400">Coupling Score: {pipelineData.before_after.current_coupling_score}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex flex-col justify-center items-center">
                <span className="text-emerald-400 text-base font-bold">
                  {pipelineData.before_after.risk_delta} Pts Risk Delta
                </span>
                <span className="text-slate-400 text-[11px]">Simulated via v1.2 Engine</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Proposed Risk Score:</span>
                <p className="text-emerald-400 text-lg font-bold">{pipelineData.before_after.proposed_risk_score} / 100</p>
                <span className="text-slate-400">Proposed Coupling: {pipelineData.before_after.proposed_coupling_score}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Candidate Interventions Grid with Safest Option Classifier */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider">Candidate Interventions & Safest Option Classifier</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pipelineData.interventions.map((opt: any, i: number) => (
                <div key={i} className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-sm">{opt.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                        <Award className="w-3 h-3" /> {opt.rank}
                      </span>
                    </div>
                    <p className="text-slate-300">{opt.description}</p>

                    <div>
                      <span className="font-semibold text-slate-400">Why Proposed:</span>
                      <p className="text-slate-300 italic">"{opt.evidence.why_proposed}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400">Risk Reduction:</span>
                        <p className="text-emerald-400 font-bold">-{opt.risk_reduction_percentage}%</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Effort:</span>
                        <p className="text-amber-300">{opt.implementation_effort}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCreatePlan(opt.option_id)}
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded transition text-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> Generate Non-Destructive Prevention Plan
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Generated Prevention Plan & Task Breakdown */}
          {createdPlan && (
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-4 text-xs">
              <h3 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4" /> Non-Destructive Prevention Plan: {createdPlan.plan_id}
              </h3>
              <p className="text-slate-300"><strong>Objective:</strong> {createdPlan.objective}</p>

              <div className="space-y-2">
                <span className="font-semibold text-slate-300">9-Step Implementation Task Breakdown:</span>
                <div className="space-y-1.5">
                  {createdPlan.task_breakdown.map((t: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-mono text-cyan-400">#{t.step_number}</span>
                        <span className="text-slate-200">{t.title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                        {t.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Click "Run Preventive Pipeline" to connect predictions with candidate interventions and virtual graph simulations.
        </div>
      )}
    </div>
  );
}

function getMockPipeline(repositoryId: string) {
  return {
    pipeline_id: "prev_pipe_demo123",
    repository_id: repositoryId,
    target_entity: "auth_service",
    risk_summary: "High coupling (0.82) and hotspot risk predicted on 'auth_service'.",
    recommendation: "Execute Option B (Interface Boundary Extraction) to reduce predicted risk score by 50.5 points.",
    before_after: {
      target_entity: "auth_service",
      current_risk_score: 78.5,
      proposed_risk_score: 28.0,
      risk_delta: -50.5,
      current_coupling_score: 0.82,
      proposed_coupling_score: 0.15,
      affected_components_count: 3,
    },
    interventions: [
      {
        option_id: "opt_b_interface",
        title: "Introduce Clean Interface Boundary & Extract OAuth2 Service",
        description: "Decouple auth domain into standalone service with explicit interface contract.",
        category: "INTRODUCE_INTERFACE",
        rank: "BEST_OPTION",
        explainable_score: 94.5,
        risk_reduction_percentage: 72.0,
        implementation_effort: "MEDIUM",
        blast_radius_score: 15.0,
        simulated_risk_delta: -20.0,
        evidence: {
          why_proposed: "Eliminates direct caller coupling score (0.82) and insulates database layer.",
          affected_components: ["auth_service", "oauth2_service", "user_service"],
        },
      },
    ],
    recurrence: {
      occurrence_count: 3,
      recommended_action: "Execute permanent structural separation (Option B) to prevent recurrent coupling drift.",
    },
  };
}

function getMockPlan(optionId: string, repositoryId: string) {
  return {
    plan_id: "prev_plan_demo123",
    prediction_id: "pred_hotspot_1",
    repository_id: repositoryId,
    objective: "Prevent predicted coupling and hotspot risk on auth_service.",
    task_breakdown: [
      { step_number: 1, title: "Introduce clean interface contract on OAuth2Service.", category: "API" },
      { step_number: 2, title: "Extract auth domain logic into standalone module.", category: "CODE" },
      { step_number: 3, title: "Update downstream caller import references.", category: "CODE" },
      { step_number: 4, title: "Execute Alembic dry-run schema validation.", category: "DB" },
      { step_number: 5, title: "Run contract integration test suite (`pytest tests/test_service_contracts.py`).", category: "TEST" },
    ],
  };
}
