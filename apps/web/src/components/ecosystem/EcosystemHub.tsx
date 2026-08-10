"use client";

import React, { useState } from "react";
import {
  Layers,
  Link,
  GitBranch,
  Shield,
  Activity,
  Terminal,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Zap,
  Users,
  Box,
  FileCode,
  Lock,
  ArrowRight,
  TrendingUp,
  Server
} from "lucide-react";

export function EcosystemHub() {
  const [activeTab, setActiveTab] = useState<"catalog" | "graph" | "ai" | "workflows" | "analytics">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("developer");

  const integrations = [
    { id: "github", name: "GitHub Enterprise", category: "Source Control", status: "HEALTHY", icon: GitBranch, sync: "2 mins ago", events: 1420 },
    { id: "jira", name: "Jira Software", category: "Issue Tracking", status: "HEALTHY", icon: Layers, sync: "5 mins ago", events: 890 },
    { id: "pagerduty", name: "PagerDuty Incident Command", category: "Incident Management", status: "HEALTHY", icon: AlertTriangle, sync: "Just now", events: 140 },
    { id: "datadog", name: "Datadog Observability", category: "Observability", status: "HEALTHY", icon: Activity, sync: "1 min ago", events: 4500 },
    { id: "slack", name: "Slack Engineering Ops", category: "ChatOps", status: "HEALTHY", icon: Terminal, sync: "3 mins ago", events: 620 },
    { id: "aws", name: "AWS Cloud Inventory", category: "Cloud", status: "HEALTHY", icon: Server, sync: "10 mins ago", events: 310 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-[#6366f1] items-center gap-2 mb-2">
            <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
              CODEATLAS v3.3
            </span>
            <span className="text-slate-400 text-xs">Engineering Control Plane & Ecosystem</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Engineering Ecosystem & Integrations
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Connect CodeAtlas to your tools across SCM, CI/CD, Issue Trackers, Incidents, ChatOps, Cloud, Observability & Security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-lg shadow-indigo-600/20">
            <Link className="w-4 h-4" />
            Connect New Tool
          </button>
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg font-medium text-sm transition-all">
            <RefreshCw className="w-4 h-4 text-slate-400" />
            Sync All
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Connected Tools</span>
            <Box className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">6 Active</p>
          <span className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Operational Health
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Event Stream Rate</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">7,880 / min</p>
          <span className="text-slate-400 text-xs mt-1 block">Normalized Across Providers</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Cross-Tool AI Actions</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">1,420 Saved Hrs</p>
          <span className="text-emerald-400 text-xs mt-1 block">+64% Faster Incident Resolution</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Graph Nodes</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">14,250 Unified</p>
          <span className="text-slate-400 text-xs mt-1 block">Devs, Commits, PRs, Services & Incidents</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "catalog"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Integration Catalog
        </button>
        <button
          onClick={() => setActiveTab("graph")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "graph"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Engineering Graph & Search
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "ai"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Cross-Tool AI & Safety Engine
        </button>
        <button
          onClick={() => setActiveTab("workflows")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "workflows"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Role-Based Workflows
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "analytics"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Analytics & ROI
        </button>
      </div>

      {/* TAB CONTENT: CATALOG */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search integrations by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-400">Showing {integrations.length} active connectors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div key={tool.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">{tool.name}</h3>
                          <span className="text-xs text-slate-400">{tool.category}</span>
                        </div>
                      </div>
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
                        {tool.status}
                      </span>
                    </div>

                    <div className="space-y-2 py-3 border-t border-b border-slate-800/80 my-4 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Last Sync</span>
                        <span>{tool.sync}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Events Processed</span>
                        <span>{tool.events.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Permissions</span>
                        <span className="text-indigo-400 font-mono">Granted (Read/Write)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Configure Settings</button>
                    <button className="text-xs text-slate-400 hover:text-slate-300">Rotate Credentials</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: GRAPH & SEARCH */}
      {activeTab === "graph" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Universal Command Palette & Search</h2>
            <p className="text-xs text-slate-400">Search across Code, PRs, Issues, Incidents, Deployments, Services, and Knowledge Base.</p>
          </div>

          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="e.g. /codeatlas investigate INC-9941 or search 'payment-service'"
              className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 shadow-lg shadow-indigo-500/10"
            />
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Unified Graph Node Topology</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Developer</span>
                <span className="text-white font-bold text-sm">Alice Smith</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Repository</span>
                <span className="text-white font-bold text-sm">payment-service</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Active Incident</span>
                <span className="text-amber-400 font-bold text-sm">INC-9941 (SEV-1)</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">Governing ADR</span>
                <span className="text-indigo-400 font-bold text-sm">ADR-001 (Async Redis)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CROSS-TOOL AI */}
      {activeTab === "ai" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Cross-Tool AI Reasoning & Safety Lifecycle</h2>
              <p className="text-xs text-slate-400 mt-1">Multi-system action execution model: PLAN → AUTHORIZE → EXECUTE → VERIFY → AUDIT</p>
            </div>
            <span className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1 rounded-full font-semibold border border-purple-500/20">
              Multi-Agent Safety Guard On
            </span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-indigo-400">Incident Correlation Synthesis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Production incident <strong className="text-amber-400">INC-9941</strong> (Payment API Latency Spike) was caused by PR #101 (commit <code className="text-indigo-300">a1b2c3d4</code>) merged 15 minutes ago.
              The commit added Redis caching without connection pool reuse, causing socket exhaustion recorded in Datadog metrics."
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-slate-500">Correlated Sources:</span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded">GitHub</span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded">Datadog</span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded">PagerDuty</span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded">Jira</span>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-indigo-500/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">Proposed Action: Automated Rollback of Deployment #8812</h4>
              <span className="text-amber-400 text-xs font-semibold">Requires Human Approval</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Target Systems: GitHub Actions, PagerDuty, Datadog</p>
            <div className="flex gap-3">
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all">
                Approve & Execute Rollback
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-medium">
                Reject Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: WORKFLOWS */}
      {activeTab === "workflows" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Role-Specific Workflow Views</h2>
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {["developer", "sre", "architect", "security", "em", "cto"].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedPersona(role)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase transition-all ${
                    selectedPersona === role ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
            <h3 className="text-base font-bold text-indigo-400 mb-2 capitalize">{selectedPersona} Workflow Hub</h3>
            <p className="text-xs text-slate-400 mb-4">Automated contextual flow tailored specifically for {selectedPersona} responsibilities.</p>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
              Code → Commit → PR → Review → CI → Deploy → Observe → Incident → Investigate → Recover
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white mb-2">Ecosystem Analytics & ROI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs">MTTR Reduction</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2">64% Faster</p>
              <p className="text-xs text-slate-500 mt-1">Mean Time to Recover reduced from 22m to 8m</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs">Developer Hours Saved</span>
              <p className="text-3xl font-extrabold text-indigo-400 mt-2">1,420 hrs / mo</p>
              <p className="text-xs text-slate-500 mt-1">Manual context-switching eliminated</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs">Estimated Annual ROI</span>
              <p className="text-3xl font-extrabold text-purple-400 mt-2">$340,000</p>
              <p className="text-xs text-slate-500 mt-1">Direct efficiency & outage cost savings</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
