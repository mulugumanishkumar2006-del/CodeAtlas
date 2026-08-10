"use client";

import React, { useState } from "react";
import {
  Globe,
  Share2,
  ShieldCheck,
  Search,
  Layers,
  GitBranch,
  Lock,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Check
} from "lucide-react";

export function NetworkExplorerHubV45() {
  const [activeTab, setActiveTab] = useState<"graph" | "provenance" | "vuln" | "lockin" | "query">("graph");
  const [queryText, setQueryText] = useState("Which systems depend on openssl?");

  const tenLayers = [
    { level: 1, name: "Code", count: "14,200 Files" },
    { level: 2, name: "Repositories", count: "142 Repos" },
    { level: 3, name: "Dependencies", count: "840 Packages" },
    { level: 4, name: "Services", count: "28 Services" },
    { level: 5, name: "Applications", count: "4 Products" },
    { level: 6, name: "Infrastructure", count: "96 Cloud Nodes" },
    { level: 7, name: "Organizations", count: "12 Teams" },
    { level: 8, name: "External Ecosystem", count: "48 Providers" },
    { level: 9, name: "Engineering Knowledge", count: "310 ADRs" },
    { level: 10, name: "AI Systems", count: "14 Agents" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v4.5 GLOBAL NETWORK
            </span>
            <span className="text-slate-400 text-xs">Global Engineering Network & Supply Chain Provenance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Global Network Explorer <Globe className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Connect and reason across Code, Repos, Dependencies, Services, Cloud, Orgs, SaaS, ADRs, and Autonomous AI Agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">NETWORK DECISION</span>
            <span className="text-xl font-extrabold text-white">V4.5 GLOBAL NETWORK READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">10-Layer Network</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">84,200 Graph Edges</p>
          <span className="text-slate-400 text-xs mt-1 block">Cross-Org & Cross-Repo Unified</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Build Provenance</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">100% Verified</p>
          <span className="text-slate-400 text-xs mt-1 block">Commit → Container → Deployment</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Data Residency</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">GDPR Compliant</p>
          <span className="text-slate-400 text-xs mt-1 block">EU Local Storage Enforced</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Privacy Isolation</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">Tenant Isolated</p>
          <span className="text-slate-400 text-xs mt-1 block">Strict Consent & Boundaries</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("graph")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "graph" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          10-Layer Taxonomy Graph
        </button>
        <button
          onClick={() => setActiveTab("provenance")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "provenance" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Build & Deployment Provenance
        </button>
        <button
          onClick={() => setActiveTab("vuln")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "vuln" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Vulnerability Propagation Traversal
        </button>
        <button
          onClick={() => setActiveTab("query")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "query" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Natural Language Graph Query Engine
        </button>
      </div>

      {/* TAB: GRAPH */}
      {activeTab === "graph" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">10-Layer Engineering Network Taxonomy</h2>
              <p className="text-xs text-slate-400">Unified graph mapping from source code to multi-cloud infrastructure and autonomous AI agents.</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              84,200 CONNECTED EDGES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {tenLayers.map((layer) => (
              <div key={layer.level} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 inline-flex items-center justify-center font-bold text-[10px] mr-2">
                  L{layer.level}
                </span>
                <span className="font-bold text-slate-200">{layer.name}</span>
                <p className="text-slate-400 pt-1">{layer.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PROVENANCE */}
      {activeTab === "provenance" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Artifact Build & Deployment Provenance</h2>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Deployment ID</span>
              <span className="text-emerald-400 font-bold">dep_8814 (US-East Production)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Source Commit SHA</span>
              <span className="text-slate-200 font-mono">sha256:9f81a2489c (head/main)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Build Artifact Digest</span>
              <span className="text-slate-200 font-mono">sha256:e3b0c44298fc1c149afbf4c...</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Container Image</span>
              <span className="text-indigo-400 font-bold">docker.io/acme/payment-service:v4.5.0-GA</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
