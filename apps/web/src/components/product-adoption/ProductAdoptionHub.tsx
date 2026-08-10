"use client";

import React, { useState } from "react";
import {
  Rocket,
  UserCheck,
  FileSpreadsheet,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Search,
  Download,
  Share2,
  PlayCircle,
  BarChart3,
  Users,
  FileText,
  HelpCircle,
  Award,
  Check
} from "lucide-react";

export function ProductAdoptionHub() {
  const [activeTab, setActiveTab] = useState<"onboarding" | "roles" | "explainable" | "demo" | "analytics">("onboarding");
  const [selectedRole, setSelectedRole] = useState("DEVELOPER");

  const onboardingStages = [
    { stage: 1, name: "Repository Discovered", status: "COMPLETED" },
    { stage: 2, name: "Files Indexed", status: "COMPLETED" },
    { stage: 3, name: "Dependencies Detected", status: "COMPLETED" },
    { stage: 4, name: "Architecture Reconstructed", status: "COMPLETED" },
    { stage: 5, name: "Knowledge Graph Generated", status: "COMPLETED" },
    { stage: 6, name: "AI Intelligence Enabled", status: "COMPLETED" }
  ];

  const rolePriorities: Record<string, string[]> = {
    DEVELOPER: ["My PRs & Code Changes", "Service Dependencies", "What will break if I edit X?"],
    SRE: ["Active Incidents & MTTR", "SLO Error Budgets", "1-Click Canary Rollbacks"],
    ARCHITECT: ["Architecture Drift (ADR-001)", "Technical Debt Compounding", "100x Scale Simulations"],
    SECURITY: ["Attack Path Visualization", "Vulnerabilities by System Impact", "Zero Trust Policy Audits"],
    MANAGER: ["Team Bottlenecks & Capacity", "Knowledge Concentration Risk", "Delivery Speed"],
    EXECUTIVE: ["Overall System Health (98.6)", "Business Risk & DR RTO", "Engineering ROI Analytics"]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v4.1 MARKET READY
            </span>
            <span className="text-slate-400 text-xs">Product Adoption & Developer Experience Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Product Adoption & Market Readiness Command <Rocket className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Understand your entire software system in under 2 minutes with interactive onboarding, role-aware navigation, explainable AI, and Sandboxed Demo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">ACTIVATION RATE</span>
            <span className="text-xl font-extrabold text-white">90.3% Active</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Time-to-First-Value</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">&lt; 90 Seconds</p>
          <span className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> 6-Stage Progress Active
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Role-Aware Navigation</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">7 Roles Tailored</p>
          <span className="text-slate-400 text-xs mt-1 block">Developer to Executive</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Explainable AI</span>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">98% High Confidence</p>
          <span className="text-slate-400 text-xs mt-1 block">AST & Telemetry Evidence Citing</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Sandboxed Demo</span>
            <PlayCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">Instant Access</p>
          <span className="text-slate-400 text-xs mt-1 block">2 Pre-Loaded Sample Repos</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("onboarding")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "onboarding" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          6-Stage Analysis Onboarding
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "roles" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Role-Aware Personalized Views
        </button>
        <button
          onClick={() => setActiveTab("explainable")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "explainable" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Explainable AI & Report Generator
        </button>
        <button
          onClick={() => setActiveTab("demo")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "demo" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Sandboxed Demo Workspace
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "analytics" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Product Analytics & Funnel
        </button>
      </div>

      {/* TAB: ONBOARDING */}
      {activeTab === "onboarding" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Repository Analysis Stage Progress</h2>
              <p className="text-xs text-slate-400">Clear stage visibility without generic loading spinners.</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              100% COMPLETE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {onboardingStages.map((s) => (
              <div key={s.stage} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    {s.stage}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{s.name}</span>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30 text-xs space-y-2">
            <h3 className="text-sm font-bold text-emerald-400">First Value Insight Delivered</h3>
            <p className="text-slate-300">"CodeAtlas reconstructed 28 microservices and detected 1 unpooled Redis connection bottleneck in payment-service."</p>
          </div>
        </div>
      )}

      {/* TAB: ROLES */}
      {activeTab === "roles" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Role-Aware Navigation & Priority Engine</h2>
              <p className="text-xs text-slate-400">Select a role to see how CodeAtlas customizes the home dashboard.</p>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-950 text-emerald-400 border border-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="DEVELOPER">Developer Role</option>
              <option value="SRE">SRE Role</option>
              <option value="ARCHITECT">Architect Role</option>
              <option value="SECURITY">Security Engineer Role</option>
              <option value="MANAGER">Engineering Manager Role</option>
              <option value="EXECUTIVE">Executive CTO Role</option>
            </select>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-indigo-400">{selectedRole} Home Custom Priorities</h3>
            <div className="space-y-2">
              {rolePriorities[selectedRole]?.map((priority, i) => (
                <div key={i} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
                  <span>{priority}</span>
                  <span className="text-xs bg-indigo-500/10 text-indigo-400 font-semibold px-2 py-0.5 rounded">Priority {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: DEMO */}
      {activeTab === "demo" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Sandboxed Demo Workspace</h2>
              <p className="text-xs text-slate-400">Evaluate CodeAtlas instantly using pre-populated sample repositories without git credentials.</p>
            </div>
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
              Initialize Demo Environment
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold">Sample Repo 1: demo-e-commerce-checkout</span>
              <p className="text-slate-400">TypeScript / Python microservices with simulated 100x traffic surge scenarios.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold">Sample Repo 2: demo-payment-gateway</span>
              <p className="text-slate-400">Go / Python API services with pre-configured attack paths and ADR decision records.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
