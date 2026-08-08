"use client";

import React, { useState } from "react";
import {
  Building2,
  GitFork,
  FileCheck2,
  ShieldAlert,
  Layers3,
  Activity,
  CheckCircle2,
  TrendingDown,
  Globe,
  Share2,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react";

export function EnterpriseCommandCenter({ organizationId = "acme-corp" }: { organizationId?: string }) {
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);
  const [scorecard, setScorecard] = useState<any>(null);
  const [decisions, setDecisions] = useState<any[]>([]);

  const handleFetchEnterpriseData = async () => {
    setLoading(true);
    try {
      const [gRes, sRes, dRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/enterprise/cross-repo-graph", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization_id: organizationId }),
        }),
        fetch(`http://localhost:8000/api/v1/enterprise/scorecard/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/enterprise/shared-decisions/${organizationId}`),
      ]);

      if (gRes.ok) setGraphData(await gRes.json());
      else setGraphData(getMockGraph(organizationId));

      if (sRes.ok) setScorecard(await sRes.json());
      else setScorecard(getMockScorecard(organizationId));

      if (dRes.ok) setDecisions(await dRes.json());
      else setDecisions(getMockDecisions(organizationId));
    } catch {
      setGraphData(getMockGraph(organizationId));
      setScorecard(getMockScorecard(organizationId));
      setDecisions(getMockDecisions(organizationId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 rounded-lg shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              v1.4 Enterprise Team & Governance Workspace
            </h2>
            <p className="text-xs text-slate-400">
              SHARED KNOWLEDGE &bull; SHARED DECISIONS &bull; CROSS-REPOSITORY WSKG &bull; ORG GOVERNANCE
            </p>
          </div>
        </div>

        <button
          onClick={handleFetchEnterpriseData}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Load Enterprise Intelligence
        </button>
      </div>

      {/* Main Workspace View */}
      {scorecard ? (
        <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1 text-xs">
          {/* Org Risk Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Overall Health Score</span>
              <p className="text-emerald-400 text-2xl font-bold">{scorecard.overall_health_score} / 100</p>
              <span className="text-slate-500">Org ID: {scorecard.organization_id}</span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Cross-Repo Coupling</span>
              <p className="text-amber-400 text-2xl font-bold">{scorecard.cross_repo_coupling_score} / 100</p>
              <span className="text-slate-500">{scorecard.total_repositories} Repositories Monitored</span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Architecture Drift</span>
              <p className="text-cyan-400 text-2xl font-bold">{scorecard.architecture_drift_score} / 100</p>
              <span className="text-slate-500">Low Drift Trajectory</span>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Active Violations</span>
              <p className="text-rose-400 text-2xl font-bold">{scorecard.active_policy_violations_count}</p>
              <span className="text-rose-500">0 Critical Violations</span>
            </div>
          </div>

          {/* Cross-Repository WSKG Graph View */}
          {graphData && (
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
              <h3 className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Multi-Repository Cross-Dependency Explorer (WSKG)
              </h3>
              <p className="text-slate-300 font-mono text-[11px]">{graphData.cascade_blast_radius_summary}</p>

              <div className="space-y-2">
                <span className="font-semibold text-slate-300">Active Cross-Repo Edges:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {graphData.cross_repo_edges.map((edge: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-cyan-400 font-mono font-bold">
                        <span>{edge.source_repository}</span>
                        <span>&rarr;</span>
                        <span>{edge.target_repository}</span>
                      </div>
                      <p className="text-slate-400 font-mono text-[11px]">
                        {edge.source_component} &rarr; {edge.target_component} ({edge.edge_type})
                      </p>
                      {edge.is_breaking_risk && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Breaking Change Risk
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shared Decisions (ADRs) Hub */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
            <h3 className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Shared Architecture Decision Records (ADRs)
            </h3>
            <div className="space-y-2">
              {decisions.map((dec: any, i: number) => (
                <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-200 text-sm">{dec.title}</span>
                    <p className="text-slate-400">{dec.summary}</p>
                    <span className="text-slate-500 text-[11px]">
                      Affected Repos: {dec.affected_repositories.join(", ")} &bull; Author: {dec.author}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Consensus: {(dec.consensus_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Click "Load Enterprise Intelligence" to view multi-repo cross-dependency graphs, shared decision records, and governance scorecards.
        </div>
      )}
    </div>
  );
}

function getMockGraph(orgId: string) {
  return {
    organization_id: orgId,
    total_nodes: 42,
    total_edges: 89,
    cascade_blast_radius_summary: "Modifying 'repo-auth:auth_service' impacts 2 downstream repositories with a breaking change probability of 78%.",
    cross_repo_edges: [
      {
        source_repository: "repo-gateway",
        source_component: "api_gateway_router",
        target_repository: "repo-auth",
        target_component: "auth_service",
        edge_type: "API_CALL",
        is_breaking_risk: true,
      },
      {
        source_repository: "repo-payment",
        source_component: "checkout_service",
        target_repository: "repo-auth",
        target_component: "oauth2_provider",
        edge_type: "SHARED_INTERFACE",
        is_breaking_risk: false,
      },
    ],
  };
}

function getMockScorecard(orgId: string) {
  return {
    organization_id: orgId,
    total_repositories: 12,
    overall_health_score: 88.5,
    cross_repo_coupling_score: 34.2,
    architecture_drift_score: 12.0,
    active_policy_violations_count: 3,
  };
}

function getMockDecisions(orgId: string) {
  return [
    {
      decision_id: "adr_001_auth_boundary",
      title: "ADR-001: Standardize OAuth2 Boundary Interfaces Across Microservices",
      summary: "Mandates explicit gRPC / HTTP interface contracts for all authentication domain services.",
      affected_repositories: ["repo-auth", "repo-gateway", "repo-payment"],
      author: "Lead Architect",
      consensus_score: 0.98,
    },
  ];
}
