"use client";

import React, { useState } from "react";
import {
  Network,
  Share2,
  ShieldAlert,
  Search,
  Users,
  Activity,
  Award,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Sliders,
  Terminal,
  Zap
} from "lucide-react";

export function FederationHubV55() {
  const [activeTab, setActiveTab] = useState<"contracts" | "search" | "incidents" | "systemic" | "scenario10">("contracts");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v5.5 FEDERATION NETWORK
            </span>
            <span className="text-slate-400 text-xs">Intelligence Network & Cross-Organization Collaboration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Federated Intelligence Network <Network className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Private by default, shared by explicit consent via Sharing Contracts, Federated Search/Graph, Shared Incident Rooms, and Governed Multi-Org Agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">FEDERATION READINESS</span>
            <span className="text-xl font-extrabold text-white">V5.5 NETWORK READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Sharing Contracts</span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">Explicit Consent</p>
          <span className="text-slate-400 text-xs mt-1 block">Instant Propagation Revocation</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Federated Search</span>
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">Private vs Shared</p>
          <span className="text-slate-400 text-xs mt-1 block">Zero Cross-Tenant Data Leakage</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Shared Incident Rooms</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">Multi-Org Rooms</p>
          <span className="text-slate-400 text-xs mt-1 block">Coordinated Patch & Verification</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Multi-Org Test</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">10-Step Passed</p>
          <span className="text-slate-400 text-xs mt-1 block">Remediated & Access Revoked</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("contracts")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "contracts" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Sharing Contracts & Revocation
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "search" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Federated Search Engine
        </button>
        <button
          onClick={() => setActiveTab("incidents")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "incidents" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Shared Incident Collaboration Rooms
        </button>
        <button
          onClick={() => setActiveTab("systemic")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "systemic" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Systemic Ecosystem Failure Simulator
        </button>
        <button
          onClick={() => setActiveTab("scenario10")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "scenario10" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          10-Step Multi-Org Scenario Test
        </button>
      </div>

      {/* TAB: CONTRACTS */}
      {activeTab === "contracts" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Explicit Cross-Organization Sharing Contracts</h2>
              <p className="text-xs text-slate-400">Govern cross-organization data exchange with explicit duration, purpose, and instant revocation.</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              STRICT POLICY GOVERNED
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">Contract ID: cntr_acme_glob_001</span>
              <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">APPROVED ACTIVE</span>
            </div>
            <p className="text-slate-300">Provider: org_acme_corp | Consumer: org_globex_cloud | Type: API_CONTRACTS | Duration: 90 Days</p>
            <p className="text-slate-500">Data Minimization: ENFORCED_ANONYMIZED</p>
          </div>
        </div>
      )}

      {/* TAB: SCENARIO10 */}
      {activeTab === "scenario10" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">10-Step Multi-Organization Remediation Scenario</h2>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Participating Organizations</span>
              <span className="text-emerald-400 font-bold">Org A (Payments), Org B (Retail), Org C (Cloud Infra)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Vulnerability Trigger</span>
              <span className="text-slate-200 font-bold">Infrastructure Vulnerability in Org C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Scenario Verdict</span>
              <span className="text-emerald-400 font-extrabold uppercase">SUCCESSFULLY_COORDINATED_REMEDIATED_AND_REVOKED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
