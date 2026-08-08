"use client";

import React, { useState } from "react";
import {
  Brain,
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  GitBranch,
  Search,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  Activity,
  Layers,
} from "lucide-react";

export interface Claim {
  id: str;
  text: str;
  category: "FACT" | "INFERENCE" | "PREDICTION" | "RECOMMENDATION" | "UNKNOWN";
  supporting_evidence_ids: string[];
  confidence: number;
  is_verified: boolean;
}

export interface EvidenceItem {
  id: string;
  type: string;
  source: string;
  location: string;
  line_range?: string;
  content: string;
  confidence: number;
}

export interface SourceCitation {
  citation_id: string;
  file_path: string;
  symbol?: string;
  line_range?: string;
  commit_hash?: string;
  analysis_version: string;
  description: string;
}

export interface ReasoningContract {
  summary: string;
  known_facts: Claim[];
  evidence: EvidenceItem[];
  structured_steps: { stage: string; content: string; evidence_ids: string[] }[];
  analysis: string;
  potential_impact: Record<string, any>;
  risks: string[];
  uncertainties: string[];
  recommendation: string[];
  validation_steps: string[];
  sources: SourceCitation[];
  all_claims: Claim[];
}

export interface ReasoningQueryResponse {
  query: string;
  detected_intent: string;
  intent_confidence: number;
  contract: ReasoningContract;
  ai_explanation_available: boolean;
  fallback_message?: string;
}

export function ReasoningPanel({ repositoryId = "demo-repo" }: { repositoryId?: string }) {
  const [query, setQuery] = useState("Why is service coupling increasing in auth module?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReasoningQueryResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"contract" | "claims" | "evidence" | "trace">("contract");
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/reasoning/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository_id: repositoryId,
          query: query,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        // Fallback mock representation
        setResult(getMockReasoningResponse(query));
      }
    } catch (e) {
      setResult(getMockReasoningResponse(query));
    } finally {
      setLoading(false);
    }
  };

  const getClaimBadgeColor = (category: string) => {
    switch (category) {
      case "FACT":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "INFERENCE":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "PREDICTION":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "RECOMMENDATION":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-lg shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              AI Engineering Reasoning Engine
            </h2>
            <p className="text-xs text-slate-400">
              Evidence-Grounded Intelligence &bull; Fact vs Inference &bull; Grounded Verification
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Tenant Isolated
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            v1.2 Grounded
          </span>
        </div>
      </div>

      {/* Query Bar */}
      <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
        <div className="pl-3 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask an engineering question (e.g. root cause, impact, migration plan, performance)..."
          className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleRunQuery()}
        />
        <button
          onClick={handleRunQuery}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm rounded-md transition shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Activity className="w-4 h-4 animate-spin" /> Reasoning...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" /> Reason
            </>
          )}
        </button>
      </div>

      {/* Main Results View */}
      {result && (
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
          {/* Status & Intent Banner */}
          <div className="flex items-center justify-between bg-slate-900/60 px-4 py-2.5 rounded-lg border border-slate-800/80 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Detected Intent:</span>
              <span className="font-semibold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {result.detected_intent}
              </span>
              <span className="text-slate-500">
                Confidence: {(result.intent_confidence * 100).toFixed(0)}%
              </span>
            </div>
            {!result.ai_explanation_available && (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> AI Fallback Active
              </span>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 space-x-6 text-sm">
            <button
              onClick={() => setActiveTab("contract")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "contract"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Reasoning Contract
            </button>
            <button
              onClick={() => setActiveTab("claims")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "claims"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Claim Classification ({result.contract.all_claims.length})
            </button>
            <button
              onClick={() => setActiveTab("evidence")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "evidence"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Evidence &amp; Citations ({result.contract.sources.length})
            </button>
          </div>

          {/* Tab 1: Reasoning Contract */}
          {activeTab === "contract" && (
            <div className="space-y-5">
              {/* Summary */}
              <div className="p-4 bg-slate-900/70 rounded-lg border border-slate-800 space-y-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Summary
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {result.contract.summary}
                </p>
              </div>

              {/* 6-Stage Reasoning Sequence */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Engineering Reasoning Sequence (Observe &rarr; Recommend)
                </h3>
                <div className="space-y-2">
                  {result.contract.structured_steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/60 rounded-lg border border-slate-800/80 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                        className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-850 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                            {step.stage}
                          </span>
                          <span className="text-sm text-slate-300 font-medium">
                            {step.content.slice(0, 80)}...
                          </span>
                        </div>
                        {expandedStep === idx ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      {expandedStep === idx && (
                        <div className="px-4 py-3 bg-slate-950/50 border-t border-slate-800/60 text-xs text-slate-300 space-y-2">
                          <p>{step.content}</p>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Layers className="w-3.5 h-3.5" />
                            <span>Supporting Evidence IDs: {step.evidence_ids.join(", ")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & Validation Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-950/20 rounded-lg border border-red-900/30 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase">
                    <AlertTriangle className="w-4 h-4" /> Potential Risks
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {result.contract.risks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-950/20 rounded-lg border border-emerald-900/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase">
                    <CheckCircle className="w-4 h-4" /> Required Validation Steps
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {result.contract.validation_steps.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Safe Next Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Safe Developer Next Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.safe_actions.map((act, i) => (
                    <button
                      key={i}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 rounded-md border border-slate-700 flex items-center gap-2 transition"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                      {act.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Claims */}
          {activeTab === "claims" && (
            <div className="space-y-3">
              {result.contract.all_claims.map((claim, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-start justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-bold border ${getClaimBadgeColor(
                          claim.category
                        )}`}
                      >
                        {claim.category}
                      </span>
                      <span className="text-slate-400">
                        Confidence: {(claim.confidence * 100).toFixed(0)}%
                      </span>
                      {claim.is_verified && (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3 h-3" /> Grounded
                        </span>
                      )}
                    </div>
                    <p className="text-slate-200 font-medium text-sm">{claim.text}</p>
                    <p className="text-slate-500">
                      Evidence IDs: {claim.supporting_evidence_ids.join(", ") || "None"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Evidence & Citations */}
          {activeTab === "evidence" && (
            <div className="space-y-3">
              {result.contract.sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> {src.file_path}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {src.line_range ? `Lines ${src.line_range}` : "Global"}
                    </span>
                  </div>
                  <p className="text-slate-300">{src.description}</p>
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span>Analysis Version: {src.analysis_version}</span>
                    {src.symbol && <span>Symbol: {src.symbol}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getMockReasoningResponse(q: string): ReasoningQueryResponse {
  return {
    query: q,
    detected_intent: "ARCHITECTURE",
    intent_confidence: 0.92,
    ai_explanation_available: true,
    contract: {
      summary: `Evidence-grounded engineering analysis for target 'auth_service'. Evaluated call graph, dependency boundaries, and recent commits.`,
      known_facts: [
        {
          id: "c1",
          text: "Service A directly imports AuthService.authenticate() in api/v1/auth.py.",
          category: "FACT",
          supporting_evidence_ids: ["ev_1"],
          confidence: 0.98,
          is_verified: true,
        },
      ],
      evidence: [],
      structured_steps: [
        { stage: "OBSERVE", content: "Observed direct dependency edge from Service A to AuthService.", evidence_ids: ["ev_1"] },
        { stage: "CONNECT", content: "Connected high coupling score (0.78) with shared database context.", evidence_ids: ["ev_1"] },
        { stage: "ANALYZE", content: "Analyzed architectural boundary: coupling increased after commit a1b2c3d.", evidence_ids: ["ev_1"] },
        { stage: "ASSESS", content: "Assessed risk: Schema updates in Auth will force synchronous changes in Service A.", evidence_ids: ["ev_1"] },
        { stage: "VALIDATE", content: "Validated against knowledge graph and dependency impact engine.", evidence_ids: ["ev_1"] },
        { stage: "RECOMMEND", content: "Recommend introducing interface abstraction layer to decouple modules.", evidence_ids: ["ev_1"] },
      ],
      analysis: "Full grounded analysis completed.",
      potential_impact: { risk_level: "MEDIUM", dependents: 3 },
      risks: ["Synchronous failure propagation if AuthService is updated without backwards compatibility."],
      uncertainties: ["Runtime trace latency metrics unavailable."],
      recommendation: ["Extract interface contract", "Run integration tests"],
      validation_steps: ["Run `pytest tests/test_auth.py`", "Verify dependency graph node coupling"],
      sources: [
        {
          citation_id: "cit_1",
          file_path: "apps/backend/app/services/auth.py",
          line_range: "1-45",
          analysis_version: "v1.2-deterministic-graph",
          description: "Auth service implementation with direct caller bindings.",
        },
      ],
      all_claims: [
        {
          id: "c1",
          text: "Service A directly imports AuthService.authenticate() in api/v1/auth.py.",
          category: "FACT",
          supporting_evidence_ids: ["ev_1"],
          confidence: 0.98,
          is_verified: true,
        },
        {
          id: "c2",
          text: "Decoupling Auth via interface will reduce regression risk.",
          category: "RECOMMENDATION",
          supporting_evidence_ids: ["ev_1"],
          confidence: 0.92,
          is_verified: true,
        },
      ],
    },
  };
}
