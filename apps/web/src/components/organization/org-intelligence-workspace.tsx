"use client";

import React, { useState } from "react";
import {
  Globe2,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  PieChart,
  Bot,
  Send,
  Zap,
  Target,
  Sparkles,
  Activity,
  Layers,
  FileText,
  Compass,
} from "lucide-react";

export function OrgIntelligenceWorkspace({ organizationId = "acme-corp" }: { organizationId?: string }) {
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState<any>(null);
  const [briefing, setBriefing] = useState<any>(null);
  const [aiQuestion, setAiQuestion] = useState("What are our highest architectural risks and single points of failure?");
  const [aiResponse, setAiResponse] = useState<any>(null);

  const handleFetchOrgData = async () => {
    setLoading(true);
    try {
      const [sRes, bRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/org/snapshot/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/org/executive-briefing/${organizationId}`),
      ]);
      if (sRes.ok) setSnapshot(await sRes.json());
      else setSnapshot(getMockSnapshot(organizationId));

      if (bRes.ok) setBriefing(await bRes.json());
      else setBriefing(getMockBriefing(organizationId));
    } catch {
      setSnapshot(getMockSnapshot(organizationId));
      setBriefing(getMockBriefing(organizationId));
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/org/ai-architect/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: organizationId, question: aiQuestion }),
      });
      if (res.ok) {
        setAiResponse(await res.json());
      } else {
        setAiResponse(getMockAIResponse(organizationId, aiQuestion));
      }
    } catch {
      setAiResponse(getMockAIResponse(organizationId, aiQuestion));
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-600 rounded-lg shadow-lg">
            <Globe2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              v1.4 Organizational Intelligence Workspace
            </h2>
            <p className="text-xs text-slate-400">
              EVIDENCE-GROUNDED INSIGHT &rarr; 2x2 PRIORITY &rarr; DECISION &rarr; ACTION &rarr; OUTCOME
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchOrgData}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Load Organization Snapshot
        </button>
      </div>

      {snapshot ? (
        <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1 text-xs">
          {/* Executive Briefing Summary Card */}
          {briefing && (
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
              <h3 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> Executive Briefing Summary ({organizationId})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-amber-300 font-bold uppercase">What Changed & Improving</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {briefing.what_changed.map((c: string, idx: number) => <li key={idx}>{c}</li>)}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-rose-400 font-bold uppercase">What is at Risk</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {briefing.what_at_risk.map((r: string, idx: number) => <li key={idx}>{r}</li>)}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold uppercase">Recommended Next Steps</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {briefing.recommended_next_steps.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 7-Dimension Engineering Health Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Evidence-Based 7-Dimension Engineering Health ({snapshot.health.overall_score}/100)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                snapshot.health.architecture_health,
                snapshot.health.dependency_health,
                snapshot.health.change_risk_health,
                snapshot.health.tech_debt_health,
                snapshot.health.security_health,
                snapshot.health.reliability_health,
                snapshot.health.knowledge_health,
              ].map((dim: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold text-[11px] truncate">{dim.name}</span>
                    <span className="text-emerald-400 font-bold">{dim.current_score}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] italic line-clamp-2">"{dim.evidence_summary}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2x2 Priority Matrix Grid */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
            <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" /> 2x2 Impact vs Risk Priority Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
              {snapshot.priorities.map((prio: any, i: number) => (
                <div key={i} className="p-3.5 bg-slate-950 rounded border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-sm">{prio.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {prio.quadrant}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">Evidence: {prio.evidence_summary}</p>
                  <p className="text-emerald-400 font-semibold text-[11px]">Action: {prio.recommended_action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Organizational AI Architect RAG Chatbot */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
            <h3 className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" /> Organizational AI Architect RAG Assistant
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask organizational architecture questions..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none"
              />
              <button
                onClick={handleAskAI}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Ask AI Architect
              </button>
            </div>

            {aiResponse && (
              <div className="p-4 bg-slate-950 rounded border border-indigo-900/40 space-y-2 font-mono">
                <p className="text-slate-200 whitespace-pre-wrap">{aiResponse.answer}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Citations: {aiResponse.evidence_citations.join(" | ")}</span>
                  <span className="text-emerald-400 font-bold">Confidence: {(aiResponse.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Click "Load Organization Snapshot" to view 7-dimension engineering health scores, 2x2 priority matrix, and executive briefings.
        </div>
      )}
    </div>
  );
}

function getMockSnapshot(orgId: string) {
  return {
    snapshot_id: "snap_mock123",
    organization_id: orgId,
    health: {
      overall_score: 84.5,
      architecture_health: { name: "Architecture Integrity", current_score: 88.0, evidence_summary: "Cross-layer violations dropped by 34%." },
      dependency_health: { name: "Dependency Coupling", current_score: 76.0, evidence_summary: "2 central dependency bridges." },
      change_risk_health: { name: "Change Churn Risk", current_score: 82.0, evidence_summary: "Zero unexpected file changes in sandbox." },
      tech_debt_health: { name: "Technical Debt", current_score: 79.5, evidence_summary: "Complex AST functions reduced by 18." },
      security_health: { name: "Security Signals", current_score: 94.0, evidence_summary: "Zero unredacted secrets." },
      reliability_health: { name: "Service Reliability", current_score: 85.0, evidence_summary: "100% health probes passed." },
      knowledge_health: { name: "Knowledge Availability", current_score: 87.5, evidence_summary: "All decisions logged as ADRs." },
    },
    priorities: [
      {
        title: "Decouple Central Auth Provider Boundary",
        quadrant: "HIGH_IMPACT_HIGH_RISK",
        evidence_summary: "Highest cross-repo blast radius in Multi-Repo WSKG (27 dependent services).",
        recommended_action: "Execute Prevention Plan with 9-step interface breakdown.",
      },
    ],
  };
}

function getMockBriefing(orgId: string) {
  return {
    organization_id: orgId,
    what_changed: ["ADR-001 adopted across 3 core microservices"],
    what_at_risk: ["Central Auth Provider has 27 dependent callers"],
    recommended_next_steps: ["Execute Option B Interface Boundary Extraction under Autopilot control"],
  };
}

function getMockAIResponse(orgId: string, q: string) {
  return {
    organization_id: orgId,
    question: q,
    answer: "ORGANIZATIONAL AI ARCHITECT ANALYSIS:\nSingle Point of Failure identified on 'repo-auth:auth_service' (27 downstream callers, Risk Score 78.0).",
    evidence_citations: ["Multi-Repo WSKG Call Graph", "ADR-001 Standard Interface"],
    confidence: 0.96,
  };
}
