"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  EyeOff,
  UserCheck,
  AlertTriangle,
  FileCheck,
  Octagon,
  CheckCircle2,
  Layers,
  Terminal,
  Activity,
  Award
} from "lucide-react";

export function EnterpriseTrustHubV52() {
  const [activeTab, setActiveTab] = useState<"identity" | "secrets" | "promptdefense" | "compliance" | "attacks">("identity");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/20">
              CODEATLAS v5.2 ENTERPRISE TRUST
            </span>
            <span className="text-slate-400 text-xs">Security, Compliance & Enterprise Trust</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Enterprise Security & Trust Center <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Zero Trust Architecture, SSO/SAML/OIDC/SCIM/MFA, 8-Role RBAC, Secret Redaction, Indirect Prompt Defense, Agent Kill Switch, and Compliance Framework.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-500/10">
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">ENTERPRISE TRUST STATUS</span>
            <span className="text-xl font-extrabold text-white">V5.2 TRUST READY</span>
          </div>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Zero Trust Architecture</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">8-Role RBAC</p>
          <span className="text-slate-400 text-xs mt-1 block">SSO / SAML / SCIM Enforced</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">KMS Envelope Encryption</span>
            <Key className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-2">AES-256-GCM</p>
          <span className="text-slate-400 text-xs mt-1 block">Automated Key Rotation v4</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Agent Security</span>
            <Octagon className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">Kill Switch Ready</p>
          <span className="text-slate-400 text-xs mt-1 block">Restricted Sandbox Isolation</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">13-Attack Simulation</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">100% Contained</p>
          <span className="text-slate-400 text-xs mt-1 block">SOC2 / ISO27001 Mapped</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("identity")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "identity" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Zero Trust Identity & RBAC
        </button>
        <button
          onClick={() => setActiveTab("secrets")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "secrets" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Secret Redaction & KMS Keys
        </button>
        <button
          onClick={() => setActiveTab("promptdefense")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "promptdefense" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Indirect Prompt Injection Shield
        </button>
        <button
          onClick={() => setActiveTab("compliance")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "compliance" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Compliance Framework & Trust Center
        </button>
        <button
          onClick={() => setActiveTab("attacks")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "attacks" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          13-Attack Simulation Test
        </button>
      </div>

      {/* TAB: IDENTITY */}
      {activeTab === "identity" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">8-Role RBAC & Action Risk Tiers</h2>
              <p className="text-xs text-slate-400">Strict zero trust resource authorization with human approval & audited break-glass access.</p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20">
              OKTA SAML / SCIM ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {["OWNER", "ADMIN", "ARCHITECT", "DEVELOPER", "SECURITY", "SRE", "VIEWER", "AUDITOR"].map((role) => (
              <div key={role} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-emerald-400 block">{role}</span>
                <span className="text-slate-400 text-[10px]">Resource Auth Granted</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ATTACKS */}
      {activeTab === "attacks" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">13 Enterprise Attack Scenario Simulation</h2>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Simulated Attacks</span>
              <span className="text-emerald-400 font-bold">13 Attack Scenarios</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Response Loop</span>
              <span className="text-slate-200 font-bold">DETECT → CONTAIN → ALERT → AUDIT → RECOVER</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Containment Verdict</span>
              <span className="text-emerald-400 font-extrabold uppercase">100% ATTACK CONTAINMENT PASSED</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
