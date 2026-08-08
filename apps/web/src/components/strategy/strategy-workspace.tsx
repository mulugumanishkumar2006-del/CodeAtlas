"use client";

import React, { useState } from "react";
import {
  Compass,
  Layers,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  Bot,
  Send,
  Zap,
  Target,
  Sparkles,
  Activity,
  FileCheck2,
  Sliders,
  DollarSign,
  Briefcase,
} from "lucide-react";

export function StrategyWorkspace({ organizationId = "acme-corp" }: { organizationId?: string }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [leadershipBrief, setLeadershipBrief] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [aiQuestion, setAiQuestion] = useState("Where should engineering invest to achieve highest risk reduction?");
  const [aiResponse, setAiResponse] = useState<any>(null);

  const handleFetchStrategyData = async () => {
    setLoading(true);
    try {
      const [oRes, pRes, lRes, cRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/strategy/options/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/strategy/portfolio/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/strategy/leadership-brief/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/strategy/compare-scenarios?organization_id=${organizationId}`),
      ]);

      if (oRes.ok) setOptions(await oRes.json());
      else setOptions(getMockOptions());

      if (pRes.ok) setPortfolio(await pRes.json());
      else setPortfolio(getMockPortfolio());

      if (lRes.ok) setLeadershipBrief(await lRes.json());
      else setLeadershipBrief(getMockLeadershipBrief(organizationId));

      if (cRes.ok) setComparison(await cRes.json());
      else setComparison(getMockComparison());
    } catch {
      setOptions(getMockOptions());
      setPortfolio(getMockPortfolio());
      setLeadershipBrief(getMockLeadershipBrief(organizationId));
      setComparison(getMockComparison());
    } finally {
      setLoading(false);
    }
  };

  const handleAskAIStrategist = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/strategy/ai-strategist/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: organizationId, question: aiQuestion }),
      });
      if (res.ok) setAiResponse(await res.json());
      else setAiResponse(getMockAIResponse(organizationId, aiQuestion));
    } catch {
      setAiResponse(getMockAIResponse(organizationId, aiQuestion));
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 rounded-lg shadow-lg">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              v1.5 Engineering Strategy & Optimization Workspace
            </h2>
            <p className="text-xs text-slate-400">
              STRATEGIC DECISION SUPPORT &bull; MULTI-SCENARIO SIMULATION &bull; ROADMAP OPTIMIZATION
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchStrategyData}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Load Strategy Optimization
        </button>
      </div>

      {/* Main Workspace Grid */}
      {options.length > 0 ? (
        <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1 text-xs">
          {/* Leadership Brief Card */}
          {leadershipBrief && (
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
              <h3 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Strategic Leadership Briefing ({organizationId})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-emerald-300 font-bold uppercase">What Matters Most & Why</span>
                  <p className="text-slate-200">{leadershipBrief.what_matters_most.join(", ")}</p>
                  <p className="text-slate-400 italic">"{leadershipBrief.why}"</p>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold uppercase">What to Invest vs Defer</span>
                  <p className="text-emerald-400 font-bold">Invest: {leadershipBrief.what_to_invest.join(", ")}</p>
                  <p className="text-amber-400">Defer: {leadershipBrief.what_to_defer.join(", ")}</p>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-indigo-400 font-bold uppercase">Needed Decision</span>
                  <p className="text-slate-200 font-bold">{leadershipBrief.needed_decisions.join(", ")}</p>
                </div>
              </div>
            </div>
          )}

          {/* Candidate Options Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider">Candidate Strategic Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
              {options.map((opt: any, i: number) => (
                <div key={i} className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-400 text-[12px]">{opt.title}</span>
                    <p className="text-slate-300 text-[11px] font-sans line-clamp-2">{opt.description}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-emerald-400 font-bold">{opt.risk_delta} Pts Risk</span>
                      <span className="text-amber-300 font-bold">Effort: {opt.effort_level}</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800 text-[10px]">
                    <span className="text-slate-400 font-bold">Trade-offs:</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5 font-sans">
                      {opt.trade_offs.map((t: string, idx: number) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Scenario Simulation Comparison Viewer */}
          {comparison && (
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
              <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Multi-Scenario Simulation Comparison
              </h3>
              <p className="text-slate-300 font-mono text-[11px]">{comparison.trade_off_summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold uppercase">Better For:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {comparison.better_for.map((b: string, idx: number) => <li key={idx}>{b}</li>)}
                  </ul>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold uppercase">Worse For:</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {comparison.worse_for.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Relative Roadmap Sequence (NOW -> NEXT -> LATER) */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
            <h3 className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" /> Relative Strategic Roadmap Sequence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
              {portfolio.map((item: any, i: number) => (
                <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-bold">
                      {item.roadmap_phase}
                    </span>
                    <span className="text-emerald-400 font-bold">Score: {item.priority_score}</span>
                  </div>
                  <p className="font-bold text-slate-200 text-[11px]">{item.title}</p>
                  <span className="text-slate-400 text-[10px]">Owner: {item.owner}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Organizational AI Strategist Assistant */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
            <h3 className="font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-400" /> Organizational AI Strategist RAG Assistant
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask strategic investment questions..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none"
              />
              <button
                onClick={handleAskAIStrategist}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Ask AI Strategist
              </button>
            </div>

            {aiResponse && (
              <div className="p-4 bg-slate-950 rounded border border-teal-900/40 space-y-2 font-mono">
                <p className="text-slate-200 whitespace-pre-wrap">{aiResponse.recommendation}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Citations: {aiResponse.evidence.join(" | ")}</span>
                  <span className="text-emerald-400 font-bold">Confidence: {(aiResponse.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Click "Load Strategy Optimization" to view strategic candidate options, multi-scenario comparisons, and relative roadmaps.
        </div>
      )}
    </div>
  );
}

function getMockOptions() {
  return [
    {
      title: "Option B: Introduce Interface Abstraction & OAuth2",
      description: "Extract auth domain logic into standalone module with clean interface contract.",
      risk_delta: -50.5,
      effort_level: "MEDIUM",
      trade_offs: ["Reduces coupling by 72%", "Requires 3 caller contract updates"],
    },
    {
      title: "Option A: In-Place Method Refactoring",
      description: "Refactor internal helper functions without moving domain boundaries.",
      risk_delta: -15.0,
      effort_level: "LOW",
      trade_offs: ["Zero migration risk", "Does not eliminate DB coupling"],
    },
  ];
}

function getMockPortfolio() {
  return [
    { title: "Decouple Auth Provider Interface (Option B)", roadmap_phase: "NOW", priority_score: 94.5, owner: "VP of Engineering" },
    { title: "Remediate Gateway Direct Database Access", roadmap_phase: "NOW", priority_score: 88.0, owner: "Lead Security Architect" },
  ];
}

function getMockLeadershipBrief(orgId: string) {
  return {
    organization_id: orgId,
    what_matters_most: ["Decouple central auth provider (auth_service) to insulate 27 downstream services"],
    why: "Central Auth Provider accounts for 78% of cross-repo breaking change risk probability.",
    what_to_invest: ["Auth Provider Interface Extraction"],
    what_to_defer: ["Legacy Monolith Retirement"],
    needed_decisions: ["Approve Prevention Plan 'prev_plan_auth' for execution"],
  };
}

function getMockComparison() {
  return {
    trade_off_summary: "Option B (Interface Abstraction) provides 3.4x higher risk reduction with an acceptable 2-week implementation timeline.",
    better_for: ["Long-term risk reduction (50.5 pts vs 15.0 pts)", "Recurrence prevention"],
    worse_for: ["Requires 3 caller endpoint contract updates"],
  };
}

function getMockAIResponse(orgId: string, q: string) {
  return {
    organization_id: orgId,
    question: q,
    recommendation: "ORGANIZATIONAL AI STRATEGIST RECOMMENDATION:\nDecouple 'auth_service' via Option B (Interface Abstraction). Reduces risk score by 50.5 points.",
    evidence: ["Multi-Repo WSKG Call Graph", "Option B Simulation Result"],
    confidence: 0.96,
  };
}
