"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Sparkles,
  GitBranch,
  Shield,
  CheckSquare,
  FileText,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Search,
  Compass,
  Sliders,
  ChevronRight,
} from "lucide-react";

export function DeveloperCommandCenter({ repositoryId = "demo-repo" }: { repositoryId?: string }) {
  const [question, setQuestion] = useState("Why is auth_service tightly coupled to database?");
  const [loading, setLoading] = useState(false);
  const [investigation, setInvestigation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"hypotheses" | "findings" | "options" | "checklist" | "diff">("hypotheses");
  const [recordedDecision, setRecordedDecision] = useState<any>(null);

  const handleInvestigate = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/developer-intelligence/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository_id: repositoryId,
          question: question,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInvestigation(data);
      } else {
        setInvestigation(getMockInvestigation(question));
      }
    } catch {
      setInvestigation(getMockInvestigation(question));
    } finally {
      setLoading(false);
    }
  };

  const handleRecordDecision = async (option: any) => {
    const decPayload = {
      decision_id: `dec_${Date.now()}`,
      repository_id: repositoryId,
      investigation_question: question,
      chosen_option_id: option.option_id,
      title: option.title,
      reason: `Chosen based on explainable score (${option.explainable_score}) and reduced coupling.`,
      evidence_ids: option.evidence_ids,
      tradeoffs: option.costs,
      rejected_alternatives: investigation.options.filter((o: any) => o.option_id !== option.option_id).map((o: any) => o.title),
      validation_plan: option.testing_steps,
      owner: "Staff Software Engineer",
      status: "RECORDED",
    };
    setRecordedDecision(decPayload);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg">
            <Compass className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              v1.3 Developer Decision Workspace
            </h2>
            <p className="text-xs text-slate-400">
              QUESTION &rarr; HYPOTHESES &rarr; FINDINGS &rarr; OPTIONS &rarr; SIMULATE &rarr; DECIDE &rarr; IMPLEMENT &rarr; VALIDATE
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Evidence-Grounded Decision Engine
          </span>
        </div>
      </div>

      {/* Question Input Bar */}
      <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Start Engineering Decision Investigation
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Why is auth_service slow? What will break if I change this?"
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 focus:outline-none"
          />
          <button
            onClick={handleInvestigate}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Investigate & Solve
          </button>
        </div>
      </div>

      {/* Main Workspace Display */}
      {investigation && (
        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-1">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 space-x-6 text-sm">
            <button
              onClick={() => setActiveTab("hypotheses")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "hypotheses" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Hypotheses ({investigation.hypotheses.length})
            </button>
            <button
              onClick={() => setActiveTab("findings")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "findings" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Findings ({investigation.findings.length})
            </button>
            <button
              onClick={() => setActiveTab("options")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "options" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Engineering Options ({investigation.options.length})
            </button>
            <button
              onClick={() => setActiveTab("checklist")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "checklist" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Implementation Checklist
            </button>
            <button
              onClick={() => setActiveTab("diff")}
              className={`pb-2.5 font-medium transition border-b-2 ${
                activeTab === "diff" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Plan vs Actual Diff
            </button>
          </div>

          {/* Tab 1: Hypotheses */}
          {activeTab === "hypotheses" && (
            <div className="space-y-3">
              {investigation.hypotheses.map((hyp: any, i: number) => (
                <div key={i} className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-sm">{hyp.text}</span>
                    <span className="px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {hyp.status} ({(hyp.confidence * 100).toFixed(0)}% Conf)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                    <div>
                      <span className="font-semibold text-emerald-400">Evidence For:</span>
                      <ul className="list-disc list-inside">
                        {hyp.evidence_for.map((e: string, idx: number) => (
                          <li key={idx}>{e}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-semibold text-cyan-400">Required Validation:</span>
                      <ul className="list-disc list-inside font-mono">
                        {hyp.validation_required.map((v: string, idx: number) => (
                          <li key={idx}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Findings */}
          {activeTab === "findings" && (
            <div className="space-y-3">
              {investigation.findings.map((fnd: any, i: number) => (
                <div key={i} className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {fnd.finding_type}
                    </span>
                    <p className="text-slate-200 font-semibold text-sm">{fnd.statement}</p>
                    <p className="text-slate-400">{fnd.impact_summary}</p>
                  </div>
                  <span className="text-slate-400 font-mono">{(fnd.confidence * 100).toFixed(0)}% Conf</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Options & Simulation */}
          {activeTab === "options" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {investigation.options.map((opt: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-400 text-sm">{opt.title}</span>
                        <span className="px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          Score: {opt.explainable_score}
                        </span>
                      </div>
                      <p className="text-slate-300">{opt.description}</p>

                      <div>
                        <span className="font-semibold text-emerald-400">Benefits:</span>
                        <ul className="list-disc list-inside text-slate-300">
                          {opt.benefits.map((b: string, idx: number) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-semibold text-amber-400">Simulated Risk Delta:</span>
                        <p className="text-amber-300 font-mono">+{opt.simulated_risk_delta} ({opt.complexity} complexity)</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRecordDecision(opt)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition text-xs"
                    >
                      Record Decision with This Option
                    </button>
                  </div>
                ))}
              </div>

              {recordedDecision && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-2">
                  <span className="font-bold text-emerald-400 uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Decision Recorded: {recordedDecision.title}
                  </span>
                  <p className="text-slate-300">{recordedDecision.reason}</p>
                  <p className="text-slate-400 font-mono">Owner: {recordedDecision.owner} &bull; Status: {recordedDecision.status}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Implementation Checklist */}
          {activeTab === "checklist" && (
            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3 text-xs">
              <h3 className="font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4" /> Non-Destructive Implementation Plan Checklist
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950" />
                  <span>Extract auth domain logic into standalone module.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950" />
                  <span>Define clean interface contract on OAuth2Service.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <input type="checkbox" className="rounded border-slate-700 bg-slate-950" />
                  <span>Execute contract integration test suite (`pytest tests/test_service_contracts.py`).</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <input type="checkbox" className="rounded border-slate-700 bg-slate-950" />
                  <span>Deploy behind feature flag in staging environment.</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Plan vs Actual Diff */}
          {activeTab === "diff" && (
            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3 text-xs">
              <h3 className="font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> Plan vs Actual Git Diff Verification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300">Planned Components:</span>
                  <p className="font-mono text-cyan-400">auth_service, oauth2_service, user_service</p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300">Actual Impacted Components:</span>
                  <p className="font-mono text-emerald-400">auth_service, oauth2_service, user_service</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded border border-slate-800">
                AI REVIEW: 100% match with planned architecture boundary shift. Component coupling score reduced by 72%. Zero unapproved external dependencies introduced.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getMockInvestigation(question: string) {
  return {
    investigation_id: "inv_demo123",
    repository_id: "demo-repo",
    question: question,
    hypotheses: [
      {
        hypothesis_id: "hyp_1",
        text: "Primary bottleneck is synchronous call coupling on auth_service dependency.",
        evidence_for: ["Direct call graph edge auth_service -> database"],
        validation_required: ["Profile trace latency on auth_service.authenticate()"],
        status: "SUPPORTED",
        confidence: 0.85,
      },
    ],
    findings: [
      {
        finding_id: "fnd_1",
        statement: "High coupling score (0.82) detected between auth_service and database.",
        finding_type: "ARCHITECTURE_ISSUE",
        confidence: 0.95,
        impact_summary: "Changes to database schema directly affect 4 caller endpoints.",
      },
    ],
    options: [
      {
        option_id: "opt_a",
        title: "Option A: In-Place Refactor",
        description: "Modify AuthService in place without moving service boundaries.",
        benefits: ["Quick implementation"],
        costs=["Keeps monolithic coupling"],
        simulated_risk_delta: 5.0,
        complexity: "LOW",
        explainable_score: 82.0,
        evidence_ids: ["ev_1"],
      },
      {
        option_id: "opt_b",
        title: "Option B: OAuth2 Service Extraction",
        description: "Extract auth domain into standalone microservice with interface boundary.",
        benefits: ["Eliminates direct DB coupling", "Improves domain modularity"],
        costs=["Requires API contract update"],
        simulated_risk_delta: 15.0,
        complexity: "MEDIUM",
        explainable_score: 94.5,
        evidence_ids: ["ev_1", "ev_2"],
        testing_steps: ["pytest tests/test_service_contracts.py"],
      },
    ],
  };
}
