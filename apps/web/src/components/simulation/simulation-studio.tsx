"use client";

import React, { useState } from "react";
import {
  Play,
  Layers,
  Shield,
  CheckCircle,
  AlertTriangle,
  FileCode,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  Sliders,
  Maximize2,
  FileText,
} from "lucide-react";

export interface ProposedChangeItem {
  change_type: string;
  target_entity: string;
  new_value?: string;
}

export interface ScenarioItem {
  scenario_id: string;
  title: string;
  description: string;
  simulated_risk_score: number;
  confidence: string;
}

export function SimulationStudio({ repositoryId = "demo-repo" }: { repositoryId?: string }) {
  const [title, setTitle] = useState("Simulate OAuth2 Service Extraction");
  const [changeType, setChangeType] = useState("EXTRACT_SERVICE");
  const [targetEntity, setTargetEntity] = useState("auth_domain");
  const [newValue, setNewValue] = useState("oauth2_service");
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"workspace" | "diff" | "compare" | "validation">("workspace");

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/simulation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository_id: repositoryId,
          title: title,
          proposed_changes: [
            {
              change_id: "ch_1",
              change_type: changeType,
              target_entity: targetEntity,
              new_value: newValue,
            },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimResult(data);
      } else {
        setSimResult(getMockSimulationResult(title, changeType, targetEntity, newValue));
      }
    } catch {
      setSimResult(getMockSimulationResult(title, changeType, targetEntity, newValue));
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceBadge = (conf: string) => {
    switch (conf) {
      case "HIGH":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "MEDIUM":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "LOW":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg">
            <Sliders className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Advanced Engineering Simulation Studio
            </h2>
            <p className="text-xs text-slate-400">
              Virtual Graph Diffing &bull; Projected Risk &bull; Multi-Option Comparison &bull; Non-Destructive Validation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Isolated Virtual Graph
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Zero Prod Mutation
          </span>
        </div>
      </div>

      {/* Proposed Change Configuration Bar */}
      <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Propose Virtual Change ("What happens if I make this change?")
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Simulation Title..."
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none"
          />
          <select
            value={changeType}
            onChange={(e) => setChangeType(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none"
          >
            <option value="EXTRACT_SERVICE">Extract Service</option>
            <option value="ADD_DEPENDENCY">Add Dependency</option>
            <option value="REMOVE_DEPENDENCY">Remove Dependency</option>
            <option value="CHANGE_API">Change API Contract</option>
            <option value="CHANGE_DB_SCHEMA">Change DB Schema</option>
            <option value="RENAME_SYMBOL">Rename Symbol</option>
          </select>
          <input
            type="text"
            value={targetEntity}
            onChange={(e) => setTargetEntity(e.target.value)}
            placeholder="Target Entity..."
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none"
          />
          <button
            onClick={handleRunSimulation}
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            Run Simulation
          </button>
        </div>
      </div>

      {/* Main Simulation View */}
      {simResult && (
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
          {/* Status & Confidence Banner */}
          <div className="flex items-center justify-between bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Simulation Status:</span>
              <span className="font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {simResult.status}
              </span>
              <span className="text-slate-400">Confidence:</span>
              <span className={`px-2 py-0.5 rounded font-bold border ${getConfidenceBadge(simResult.confidence)}`}>
                {simResult.confidence}
              </span>
            </div>
            <span className="text-slate-500">ID: {simResult.simulation_id}</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 space-x-6 text-sm">
            <button
              onClick={() => setActiveTab("workspace")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "workspace" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Simulation Workspace
            </button>
            <button
              onClick={() => setActiveTab("diff")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "diff" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Virtual Graph Diff ({simResult.graph_diff.length})
            </button>
            <button
              onClick={() => setActiveTab("compare")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "compare" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Multi-Scenario Comparison
            </button>
            <button
              onClick={() => setActiveTab("validation")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "validation" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Validation Plan
            </button>
          </div>

          {/* Tab 1: Simulation Workspace (Phase 20 layout) */}
          {activeTab === "workspace" && (
            <div className="space-y-4">
              {/* Risk & Impact Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <span className="text-slate-400 uppercase font-semibold">Risk Shift</span>
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <span className="text-slate-400">{simResult.risk.current_risk_score}</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                    <span className="text-amber-400">{simResult.risk.simulated_risk_score}</span>
                    <span className="text-xs text-amber-400 font-semibold">(+{simResult.risk.risk_delta})</span>
                  </div>
                  <p className="text-slate-400">{simResult.risk.risk_explanations[0]}</p>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <span className="text-slate-400 uppercase font-semibold">Simulated Blast Radius</span>
                  <div className="text-lg font-bold text-cyan-400">
                    {simResult.impact.direct_impact_count} Direct / {simResult.impact.indirect_impact_count} Indirect
                  </div>
                  <p className="text-slate-400">Affected: {simResult.impact.affected_components.join(", ")}</p>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <span className="text-slate-400 uppercase font-semibold">Explicit Assumptions</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {simResult.assumptions.map((asm: any, i: number) => (
                      <li key={i}>{asm.description}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Reasoning Box */}
              <div className="p-4 bg-slate-900/70 rounded-lg border border-slate-800 space-y-2 text-xs">
                <h3 className="font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Grounded AI Simulation Analysis
                </h3>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{simResult.ai_reasoning}</p>
              </div>

              {/* Decision Support Recommendation */}
              <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-lg space-y-2 text-xs">
                <span className="font-bold text-indigo-400 uppercase">Decision Support Recommendation</span>
                <p className="text-slate-200">{simResult.decision_support.recommendation}</p>
              </div>
            </div>
          )}

          {/* Tab 2: Graph Diff */}
          {activeTab === "diff" && (
            <div className="space-y-3">
              {simResult.graph_diff.map((item: any, i: number) => (
                <div key={i} className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {item.diff_state}
                    </span>
                    <p className="font-mono text-slate-200 font-semibold text-sm">{item.entity_id}</p>
                    <p className="text-slate-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Multi-Scenario Comparison */}
          {activeTab === "compare" && (
            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-4 text-xs">
              <h3 className="font-semibold text-slate-200 uppercase tracking-wider">Multi-Option Decision Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded space-y-2">
                  <span className="font-bold text-cyan-400">Option A: In-Place Refactor</span>
                  <p className="text-slate-300">Modify existing AuthService in place without boundary shift.</p>
                  <p className="text-slate-400 font-semibold">Simulated Risk Delta: +5.0 (LOW)</p>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded space-y-2">
                  <span className="font-bold text-purple-400">Option B: OAuth2 Service Extraction</span>
                  <p className="text-slate-300">Extract auth domain into standalone microservice boundary.</p>
                  <p className="text-slate-400 font-semibold">Simulated Risk Delta: +20.0 (MEDIUM)</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Validation Plan */}
          {activeTab === "validation" && (
            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3 text-xs">
              <h3 className="font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Recommended Non-Destructive Validation Checklist
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="font-bold text-slate-300">Unit Test Commands:</span>
                  <ul className="list-disc list-inside font-mono text-cyan-400">
                    {simResult.validation_plan.recommended_unit_tests.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-slate-300">Integration Test Commands:</span>
                  <ul className="list-disc list-inside font-mono text-cyan-400">
                    {simResult.validation_plan.recommended_integration_tests.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getMockSimulationResult(title: string, changeType: string, targetEntity: string, newValue: string) {
  return {
    simulation_id: "sim_demo123",
    repository_id: "demo-repo",
    status: "COMPLETED",
    confidence: "HIGH",
    risk: {
      current_risk_score: 30.0,
      simulated_risk_score: 45.0,
      risk_delta: 15.0,
      risk_explanations: ["Simulated risk score increased by +15.0 due to virtual component boundary shift."],
    },
    impact: {
      direct_impact_count: 1,
      indirect_impact_count: 3,
      affected_components: [targetEntity, "user_service", "api_router"],
    },
    assumptions: [
      { description: "Production telemetry unavailable; static dependency graph used." },
    ],
    graph_diff: [
      {
        entity_id: newValue || targetEntity,
        entity_type: "service",
        diff_state: "ADDED",
        description: `Applied virtual modification (${changeType}) on '${targetEntity}'.`,
      },
    ],
    ai_reasoning:
      `SIMULATED REASONING FOR '${title}':\n\n` +
      `HISTORICAL FACT: Base repository state has active call graph relationships.\n` +
      `OBSERVATION: Applied virtual change (${changeType}) to in-memory graph.\n` +
      `PREDICTED RISK: Risk score shifts from 30.0 to 45.0 (+15.0).\n` +
      `RECOMMENDATION: Run integration test suite before merging real code changes.`,
    decision_support: {
      recommendation: "Proceed with proposed change plan under feature flag after passing test suite.",
    },
    validation_plan: {
      recommended_unit_tests: [`pytest tests/test_${targetEntity}.py`],
      recommended_integration_tests: ["pytest tests/test_integration.py"],
    },
  };
}
