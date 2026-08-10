"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  DollarSign,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
  PieChart,
  Brain,
  Award,
  GitPullRequest,
  Check
} from "lucide-react";

export function EnterpriseOSHub() {
  const [activeTab, setActiveTab] = useState<"org" | "tech" | "abac" | "finops" | "executive">("org");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v4.2 ENTERPRISE
            </span>
            <span className="text-slate-400 text-xs">Organizational Digital Twin & Engineering OS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Enterprise Engineering OS <Building2 className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Connect Organizations, Teams, Portfolios, Tech Lifecycles, ABAC Governance, and FinOps Cost Attribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">ENTERPRISE DECISION</span>
            <span className="text-xl font-extrabold text-white">V4.2 ENTERPRISE READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Organizational Twin</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">Acme Corp</p>
          <span className="text-slate-400 text-xs mt-1 block">142 Repositories | 28 Services</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Knowledge Bus Factor</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">Score: 1 (High Risk)</p>
          <span className="text-slate-400 text-xs mt-1 block">Alice Smith (payment-crypto)</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">ABAC Security Governance</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">Active Policy</p>
          <span className="text-slate-400 text-xs mt-1 block">Org / Team / Env / Risk Scoped</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">FinOps Cloud Cost</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">$142,500 / mo</p>
          <span className="text-slate-400 text-xs mt-1 block">100% Team Cost Attributed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("org")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "org" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Org Hierarchy & Bus Factor
        </button>
        <button
          onClick={() => setActiveTab("tech")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "tech" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Tech Stack Lifecycles
        </button>
        <button
          onClick={() => setActiveTab("abac")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "abac" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          ABAC Identity Governance
        </button>
        <button
          onClick={() => setActiveTab("finops")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "finops" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          FinOps Cloud Cost Attribution
        </button>
        <button
          onClick={() => setActiveTab("executive")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "executive" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Executive Engineering OS
        </button>
      </div>

      {/* TAB: ORG */}
      {activeTab === "org" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Organizational Hierarchy & Graph</h2>
              <p className="text-xs text-slate-400">Org -> Business Unit -> Department -> Team -> User</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              ACME ENTERPRISE CORP
            </span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs space-y-3">
            <h3 className="font-bold text-emerald-400">Connected Graph Path Example</h3>
            <p className="text-slate-300">Person: Alice Smith → Team: Team-Payments → Repository: payment-service → Service: payment-gateway-v2 → Deployment: dep_8814 → Incident: 0 Active Incidents.</p>
          </div>
        </div>
      )}

      {/* TAB: FINOPS */}
      {activeTab === "finops" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">FinOps Cloud Cost Attribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 block font-semibold">Team-Payments</span>
              <p className="text-2xl font-bold text-emerald-400">$68,200 / mo</p>
              <span className="text-slate-500">47.8% of Total Spend</span>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 block font-semibold">Team-Platform</span>
              <p className="text-2xl font-bold text-indigo-400">$40,200 / mo</p>
              <span className="text-slate-500">28.3% of Total Spend</span>
            </div>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 block font-semibold">Team-Auth</span>
              <p className="text-2xl font-bold text-purple-400">$34,100 / mo</p>
              <span className="text-slate-500">23.9% of Total Spend</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
