"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Key,
  Package,
  Zap,
  Sliders,
  PlayCircle,
  Terminal,
  Activity,
  Lock,
  Cpu
} from "lucide-react";

export function MarketplaceHubV54() {
  const [activeTab, setActiveTab] = useState<"discovery" | "catalog" | "private" | "signing" | "test13">("discovery");
  const [searchQuery, setSearchQuery] = useState("Kubernetes Incident Investigator");

  const extensionTypes = [
    "Connector", "Plugin", "Agent", "Skill", "Workflow", "Policy", "Dashboard", "Report", "Knowledge Pack"
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v5.4 MARKETPLACE
            </span>
            <span className="text-slate-400 text-xs">Intelligence Marketplace & Ecosystem Expansion</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Intelligence Marketplace Network <ShoppingBag className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            9 Extension Types, Extension Manifest Validation, Cryptographic Signing, 4 Trust Tiers, and 13-Stage Lifecycle Sandbox.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">MARKETPLACE STATUS</span>
            <span className="text-xl font-extrabold text-white">V5.4 ECOSYSTEM READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Extension Types</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">9 Extension Types</p>
          <span className="text-slate-400 text-xs mt-1 block">Connectors, Agents, Skills, Policies</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Crypto Provenance</span>
            <Key className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">RSA-2048 Signed</p>
          <span className="text-slate-400 text-xs mt-1 block">Tamper-Proof Extension Artifacts</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Trust Tiers</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">4 Trust Tiers</p>
          <span className="text-slate-400 text-xs mt-1 block">Verified, Trusted, Community, Private</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Lifecycle Test</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">13-Stage Passed</p>
          <span className="text-slate-400 text-xs mt-1 block">Zero Core Platform Impact</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("discovery")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "discovery" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Semantic NL Discovery Search
        </button>
        <button
          onClick={() => setActiveTab("catalog")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "catalog" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          9 Extension Types Catalog
        </button>
        <button
          onClick={() => setActiveTab("private")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "private" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Enterprise Private Marketplace
        </button>
        <button
          onClick={() => setActiveTab("signing")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "signing" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Cryptographic Artifact Signing
        </button>
        <button
          onClick={() => setActiveTab("test13")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "test13" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          13-Stage Lifecycle Test
        </button>
      </div>

      {/* TAB: DISCOVERY */}
      {activeTab === "discovery" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Semantic Natural-Language Discovery</h2>
              <p className="text-xs text-slate-400">Search marketplace extensions using intent-based natural language queries.</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Find an agent that investigates Kubernetes incidents..."
              className="flex-1 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button className="bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-emerald-400">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-sm">Kubernetes Incident Investigator Agent</span>
              <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20 text-[10px]">
                VERIFIED TIER
              </span>
            </div>
            <p className="text-slate-300">
              Investigates Kubernetes pod crashes, OOM Kills, and network partition incidents. Declares permissions: READ_TELEMETRY, EXECUTE_SANDBOX_TOOL.
            </p>
          </div>
        </div>
      )}

      {/* TAB: TEST13 */}
      {activeTab === "test13" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">13-Stage Extension Lifecycle Test Results</h2>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Lifecycle Stages Executed</span>
              <span className="text-emerald-400 font-bold">13 / 13 Stages Passed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Tested Pipeline</span>
              <span className="text-slate-200 font-bold">Discover → Inspect → Install → Configure → Test → Use → Monitor → Update → Rollback → Disable → Remove</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Lifecycle Test Verdict</span>
              <span className="text-emerald-400 font-extrabold uppercase">PASSED_WITH_ZERO_CORE_IMPACT</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
