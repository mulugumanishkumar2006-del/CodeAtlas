"use client";

import React, { useState } from "react";
import {
  Brain,
  Search,
  BookOpen,
  GitBranch,
  AlertOctagon,
  Sparkles,
  Bot,
  Send,
  HelpCircle,
  Activity,
  Layers,
  FileText,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export function KnowledgeFabricExplorer({
  organizationId = "acme-corp",
  entityId = "ent_auth_service",
}: {
  organizationId?: string;
  entityId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [whyQuestion, setWhyQuestion] = useState("Why was auth_service created?");
  const [whyResult, setWhyResult] = useState<any>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [graph, setGraph] = useState<any>(null);
  const [aiQuestion, setAiQuestion] = useState("What did previous investigations conclude about Gateway DB access?");
  const [aiResponse, setAiResponse] = useState<any>(null);

  const handleFetchKnowledgeData = async () => {
    setLoading(true);
    try {
      const [cRes, lRes, gRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/knowledge-fabric/conflicts/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/knowledge-fabric/lessons/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/knowledge-fabric/explorer/${entityId}`),
      ]);

      if (cRes.ok) setConflicts(await cRes.json());
      else setConflicts(getMockConflicts());

      if (lRes.ok) setLessons(await lRes.json());
      else setLessons(getMockLessons(organizationId));

      if (gRes.ok) setGraph(await gRes.json());
      else setGraph(getMockGraph(entityId));
    } catch {
      setConflicts(getMockConflicts());
      setLessons(getMockLessons(organizationId));
      setGraph(getMockGraph(entityId));
    } finally {
      setLoading(false);
    }
  };

  const handleAskWhyHistory = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/knowledge-fabric/why-history?question=${encodeURIComponent(whyQuestion)}`);
      if (res.ok) setWhyResult(await res.json());
      else setWhyResult(getMockWhyResult(whyQuestion));
    } catch {
      setWhyResult(getMockWhyResult(whyQuestion));
    }
  };

  const handleAskKnowledgeAI = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/knowledge-fabric/ai-query", {
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
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-600 rounded-lg shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-300 to-rose-400 bg-clip-text text-transparent">
              v1.7 Engineering Knowledge Fabric Explorer
            </h2>
            <p className="text-xs text-slate-400">
              LIVING ENGINEERING MEMORY &bull; DECISION RATIONALE &bull; CONFLICT RESOLUTION &bull; PROVENANCE
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchKnowledgeData}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Load Knowledge Fabric
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1 text-xs">
        {/* "Why History" RAG Query Box */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
          <h3 className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400" /> "Why History" RAG Rationale Search
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={whyQuestion}
              onChange={(e) => setWhyQuestion(e.target.value)}
              placeholder="Ask why architecture, services, decisions or dependencies exist..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none"
            />
            <button
              onClick={handleAskWhyHistory}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Explain Rationale
            </button>
          </div>

          {whyResult && (
            <div className="p-4 bg-slate-950 rounded border border-purple-900/40 space-y-2 font-mono">
              <p className="text-slate-200 whitespace-pre-wrap">{whyResult.answer}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Decision Citations: {whyResult.decision_citations.join(" | ")}</span>
                <span className="text-emerald-400 font-bold">Confidence: {(whyResult.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Knowledge Explorer Living Memory Graph & Conflicts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Living Memory Graph Nodes */}
          {graph && (
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 font-mono">
              <h3 className="font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> Living Memory Node Graph ({graph.root_entity_id})
              </h3>
              <div className="space-y-2">
                {graph.nodes.map((node: any, i: number) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-200 font-bold">{node.label}</span>
                    <div className="flex gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">{node.type}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">{node.freshness}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Conflict Alert Panel */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 font-mono">
            <h3 className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" /> Code vs Doc Knowledge Mismatch Conflicts
            </h3>
            <div className="space-y-2">
              {conflicts.map((conf: any, i: number) => (
                <div key={i} className="p-3 bg-slate-950 rounded border border-rose-900/30 space-y-1.5">
                  <span className="font-bold text-amber-300 text-[11px]">{conf.entity_name}</span>
                  <p className="text-slate-300 text-[10px]"><strong className="text-rose-400">Doc Claim:</strong> {conf.statement_a}</p>
                  <p className="text-slate-300 text-[10px]"><strong className="text-cyan-400">Code AST Evidence:</strong> {conf.statement_b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engineering Lessons Learned */}
        {lessons.length > 0 && (
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
            <h3 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" /> Engineering Lessons Learned & Provenance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
              {lessons.map((less: any, i: number) => (
                <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-300 text-[11px]">Lesson: {less.lesson_text}</span>
                  <p className="text-slate-300 text-[10px]">Context: {less.context}</p>
                  <p className="text-cyan-400 text-[10px]">Outcome: {less.observed_outcome}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Knowledge-Aware AI Chatbot */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
          <h3 className="font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-pink-400" /> Knowledge-Aware AI Assistant with Internal Citations
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask historical knowledge questions..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none"
            />
            <button
              onClick={handleAskKnowledgeAI}
              className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-medium rounded transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Ask Living Memory
            </button>
          </div>

          {aiResponse && (
            <div className="p-4 bg-slate-950 rounded border border-pink-900/40 space-y-2 font-mono">
              <p className="text-slate-200 whitespace-pre-wrap">{aiResponse.answer}</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Internal Citations: {aiResponse.evidence_citations.join(" | ")}</span>
                <span className="text-emerald-400 font-bold">Confidence: {(aiResponse.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getMockConflicts() {
  return [
    {
      entity_name: "repo-gateway -> auth_db",
      statement_a: "Documentation states repo-gateway access to auth_db is a temporary 30-day bridge.",
      statement_b: "Codebase AST evidence shows active long-term gRPC direct database queries.",
    },
  ];
}

function getMockLessons(orgId: string) {
  return [
    {
      context: "Microservice direct database access under high concurrency traffic.",
      lesson_text: "Interface abstraction boundaries prevent cross-service database coupling far more effectively than in-place helper refactoring.",
      observed_outcome: "Cross-repo blast radius reduced by 72%; zero recurring drift recorded in 60d.",
    },
  ];
}

function getMockGraph(entityId: string) {
  return {
    root_entity_id: entityId,
    nodes: [
      { id: entityId, label: "auth_service", type: "SERVICE", freshness: "FRESH" },
      { id: "node_adr1", label: "ADR-001 (Auth Decoupling)", type: "DECISION", freshness: "FRESH" },
      { id: "node_gateway", label: "repo-gateway", type: "SERVICE", freshness: "FRESH" },
    ],
  };
}

function getMockWhyResult(q: string) {
  return {
    question: q,
    answer: "WHY 'auth_service' WAS CREATED:\n1. ORIGINAL DECISION (ADR-001): Extracted from legacy monolith to insulate microservices.\n2. EVOLUTION: Superseded in 2026 by Standalone OAuth2 capability.",
    decision_citations: ["ADR-001: Standalone Auth Capability", "ADR-004: OAuth2 Standardization"],
    confidence: 0.96,
  };
}

function getMockAIResponse(orgId: string, q: string) {
  return {
    organization_id: orgId,
    question: q,
    answer: "LIVING KNOWLEDGE FABRIC ANALYSIS:\n'auth_service' was created under ADR-001 (2024). Superseded in 2026 by Option B Interface Abstraction following Inv-042 coupling investigation.",
    evidence_citations: ["ADR-001", "ADR-004", "Inv-042 Report"],
    confidence: 0.97,
  };
}
