"use client";

import React, { useState } from "react";
import {
  Clock,
  GitCommit,
  GitBranch,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Activity,
  Search,
  Sparkles,
  Shield,
  FileCode,
  Zap,
} from "lucide-react";

export interface CommitItem {
  commit_sha: string;
  message: string;
  author_name: string;
  committed_at: string;
}

export interface ArchitectureEvent {
  event_id: string;
  commit_sha: string;
  timestamp: string;
  event_type: string;
  title: string;
  description: string;
  severity: string;
}

export interface ArchitectureDrift {
  finding_id: string;
  rule_name: string;
  declared_architecture: string;
  observed_architecture: string;
  severity: string;
  trend: "NEW" | "STABLE" | "INCREASING" | "DECREASING" | "RESOLVED";
  latest_seen_commit: string;
}

export interface CoChangeItem {
  component_a: string;
  component_b: string;
  co_change_frequency: number;
  strength_score: number;
  label: string;
}

export function CodeTimeMachine({ repositoryId = "demo-repo" }: { repositoryId?: string }) {
  const [selectedCommit, setSelectedCommit] = useState("d4e5f6");
  const [compareBase, setCompareBase] = useState("c1a2b3");
  const [activeTab, setActiveTab] = useState<"timeline" | "diff" | "cochange" | "drift" | "ai">("timeline");
  const [aiQuery, setAiQuery] = useState("When did the database dependency appear in user service?");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  const mockCommits: CommitItem[] = [
    { commit_sha: "c1a2b3", message: "Initial auth service setup", author_name: "Alice", committed_at: "2026-01-10" },
    { commit_sha: "d4e5f6", message: "Add DB coupling to user service", author_name: "Bob", committed_at: "2026-03-15" },
    { commit_sha: "e7f8g9", message: "Extract payment service boundary", author_name: "Charlie", committed_at: "2026-06-20" },
  ];

  const mockTimeline: ArchitectureEvent[] = [
    {
      event_id: "evt_1",
      commit_sha: "c1a2b3",
      timestamp: "2026-01-10",
      event_type: "SERVICE_INTRODUCED",
      title: "Auth Service Introduced",
      description: "Initial standalone AuthService component creation.",
      severity: "INFO",
    },
    {
      event_id: "evt_2",
      commit_sha: "d4e5f6",
      timestamp: "2026-03-15",
      event_type: "DEPENDENCY_ADDED",
      title: "Database Dependency Introduced",
      description: "Direct PostgreSQL coupling added to User Service.",
      severity: "WARNING",
    },
  ];

  const mockDrifts: ArchitectureDrift[] = [
    {
      finding_id: "d1",
      rule_name: "Layer Violation",
      declared_architecture: "API Router -> Service -> Model",
      observed_architecture: "API Router directly queries DB Model",
      severity: "HIGH",
      trend: "INCREASING",
      latest_seen_commit: "d4e5f6",
    },
  ];

  const mockCoChanges: CoChangeItem[] = [
    {
      component_a: "apps/backend/app/services/auth.py",
      component_b: "apps/backend/app/api/v1/auth.py",
      co_change_frequency: 8,
      strength_score: 0.88,
      label: "Historical co-change",
    },
  ];

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/temporal/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repository_id: repositoryId, query: aiQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data);
      } else {
        setAiResponse(getMockAiResponse(aiQuery));
      }
    } catch {
      setAiResponse(getMockAiResponse(aiQuery));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg">
            <Clock className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Code Time Machine &amp; Temporal Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Point-in-Time Snapshots &bull; Architecture Evolution &bull; Co-Change Intelligence &bull; Drift Trends
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Secret Scrubbed
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            v1.2 Temporal
          </span>
        </div>
      </div>

      {/* Timeline Controls / Commit Selector */}
      <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <GitCommit className="w-4 h-4 text-cyan-400" /> Historical Snapshot Selector
          </span>
          <span>Active Commit: <code className="text-cyan-400 font-mono">{selectedCommit}</code></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockCommits.map((c) => (
            <button
              key={c.commit_sha}
              onClick={() => setSelectedCommit(c.commit_sha)}
              className={`p-3 rounded-lg text-left transition border ${
                selectedCommit === c.commit_sha
                  ? "bg-slate-800 border-cyan-400 shadow-md"
                  : "bg-slate-950/50 border-slate-800 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-cyan-400 font-semibold">{c.commit_sha}</span>
                <span className="text-slate-500">{c.committed_at}</span>
              </div>
              <p className="text-xs text-slate-200 truncate">{c.message}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab("timeline")}
          className={`pb-2.5 font-medium transition border-b-2 ${
            activeTab === "timeline" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Architecture Timeline
        </button>
        <button
          onClick={() => setActiveTab("diff")}
          className={`pb-2.5 font-medium transition border-b-2 ${
            activeTab === "diff" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Architecture Diff ({compareBase} &rarr; {selectedCommit})
        </button>
        <button
          onClick={() => setActiveTab("cochange")}
          className={`pb-2.5 font-medium transition border-b-2 ${
            activeTab === "cochange" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Co-Change Intelligence
        </button>
        <button
          onClick={() => setActiveTab("drift")}
          className={`pb-2.5 font-medium transition border-b-2 ${
            activeTab === "drift" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Architecture Drift &amp; Trends
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-2.5 font-medium transition border-b-2 ${
            activeTab === "ai" ? "border-cyan-400 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          AI Temporal Reasoning
        </button>
      </div>

      {/* Tab 1: Timeline */}
      {activeTab === "timeline" && (
        <div className="space-y-3">
          {mockTimeline.map((evt) => (
            <div key={evt.event_id} className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {evt.event_type}
                  </span>
                  <span className="font-mono text-slate-400">{evt.commit_sha}</span>
                  <span className="text-slate-500">{evt.timestamp}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{evt.title}</h3>
                <p className="text-slate-300">{evt.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Architecture Diff */}
      {activeTab === "diff" && (
        <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-4 text-xs">
          <h3 className="font-semibold text-slate-200 uppercase tracking-wider">
            Architecture Diff ({compareBase} &rarr; {selectedCommit})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded space-y-1">
              <span className="font-bold text-emerald-400 uppercase">+ Added Components</span>
              <p className="text-slate-300 font-mono">payment_service</p>
            </div>
            <div className="p-3 bg-red-950/20 border border-red-900/30 rounded space-y-1">
              <span className="font-bold text-red-400 uppercase">- Removed Components</span>
              <p className="text-slate-400 italic">None</p>
            </div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
            <span className="font-bold text-amber-400 uppercase">Boundary Changes &amp; Risk Shifts</span>
            <p className="text-slate-300">Payment domain extracted into service boundary. Risk shift: payment_service &rarr; MEDIUM.</p>
          </div>
        </div>
      )}

      {/* Tab 3: Co-Change */}
      {activeTab === "cochange" && (
        <div className="space-y-3">
          {mockCoChanges.map((co, i) => (
            <div key={i} className="p-3.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {co.label}
                </span>
                <p className="font-mono text-slate-200 text-sm">{co.component_a} &amp; {co.component_b}</p>
                <p className="text-slate-400">Co-changed together in {co.co_change_frequency} commits.</p>
              </div>
              <span className="text-sm font-bold text-cyan-400">{(co.strength_score * 100).toFixed(0)}% Co-Change Strength</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Drift */}
      {activeTab === "drift" && (
        <div className="space-y-3">
          {mockDrifts.map((d) => (
            <div key={d.finding_id} className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> {d.rule_name}
                </span>
                <span className="px-2 py-0.5 rounded font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  Trend: {d.trend}
                </span>
              </div>
              <p className="text-slate-300"><strong>Declared:</strong> {d.declared_architecture}</p>
              <p className="text-slate-300"><strong>Observed:</strong> {d.observed_architecture}</p>
              <p className="text-slate-500">Latest seen in commit {d.latest_seen_commit}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: AI Reasoning */}
      {activeTab === "ai" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask a temporal question (e.g. When did dependency X appear?)..."
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm px-2"
              onKeyDown={(e) => e.key === "Enter" && handleAiQuery()}
            />
            <button
              onClick={handleAiQuery}
              disabled={aiLoading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-sm rounded-md transition disabled:opacity-50 flex items-center gap-2"
            >
              {aiLoading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Explain
            </button>
          </div>

          {aiResponse && (
            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3 text-xs">
              <h3 className="font-semibold text-cyan-400 uppercase tracking-wider">Historical AI Reasoning Output</h3>
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{aiResponse.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getMockAiResponse(q: string) {
  return {
    query: q,
    explanation:
      "HISTORICAL FACT: Commit d4e5f6 introduced direct database connection in User service on 2026-03-15.\n\n" +
      "OBSERVE: Prior to commit d4e5f6, User service accessed data via AuthService interface.\n\n" +
      "INFERENCE: Coupling between User service and database increased coupling score by +0.35.\n\n" +
      "PREDICTION: Modifying database schema will now impact User service directly.\n\n" +
      "RECOMMENDATION: Restore data access abstraction layer to prevent future drift.",
  };
}
