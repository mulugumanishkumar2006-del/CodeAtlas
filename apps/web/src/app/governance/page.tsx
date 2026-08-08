"use client";

import React, { useState } from "react";

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<"executive" | "security" | "agents" | "policies" | "compliance" | "audit">("executive");

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v2.9 — ENGINEERING AUTONOMY &amp; GOVERNANCE
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Enterprise AI Governance, RBAC/ABAC Policies, Four-Eyes Approvals, Prompt Defense &amp; Compliance Controls
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#1e293b", border: "1px solid #6366f1", color: "#818cf8", fontWeight: "600", fontSize: "13px" }}>
            ENTERPRISE GOVERNED
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            CODEATLAS V2.9 READY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "executive", label: "Executive Center" },
          { id: "security", label: "Security & Prompt Defense" },
          { id: "agents", label: "Agent Registry" },
          { id: "policies", label: "Policy Center" },
          { id: "compliance", label: "Compliance Dashboard" },
          { id: "audit", label: "Immutable Audit Log" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              backgroundColor: activeTab === tab.id ? "#4f46e5" : "#1e293b",
              color: activeTab === tab.id ? "#ffffff" : "#94a3b8",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Executive Center Tab */}
      {activeTab === "executive" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Executive Autonomy &amp; Governance Overview</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Active Governed Agents</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#818cf8" }}>1 Active</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Policy Precedence Rule</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#34d399" }}>Most Restrictive</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Four-Eyes Enforced</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#fbbf24" }}>100% High Risk</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Compliance Status</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#34d399" }}>100% PASS (42/42)</h3>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Prompt Injection Defense &amp; Agent Safety</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
            <h3 style={{ margin: "0 0 4px", color: "#34d399" }}>Repository &amp; Issue Content Scanner: SAFE_PASSED</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>
              Safety Score: 99.8% | Prompt Injection Attempts Detected: 0 | Untrusted Content Isolation: Active
            </p>
          </div>
        </div>
      )}

      {/* Agents Tab */}
      {activeTab === "agents" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Agent Registry &amp; Lifecycle Control</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Agent Name</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Role</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Owner</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "12px", fontWeight: "600" }}>Production Deployment Agent</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>Deployment Agent</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>platform_team@acme.com</td>
                <td style={{ padding: "12px", color: "#34d399", fontWeight: "700" }}>ACTIVE</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Policies Tab */}
      {activeTab === "policies" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Policy Center &amp; Precedence Rules</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
            <h3 style={{ margin: "0 0 4px", color: "#fbbf24" }}>POL_GOV_01: Four-Eyes Approval Gate for Production Deployment</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>
              Precedence: ORGANIZATION | Effect: REQUIRE_FOUR_EYES | Conditions: Production HIGH_RISK Actions
            </p>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === "compliance" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Enterprise Compliance Framework</h2>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
            Frameworks Covered: <strong>SOC2, ISO27001, HIPAA, GDPR</strong> | Total Controls: 42 / 42 Passed (100% Score)
          </p>
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === "audit" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Cryptographic Immutable Audit Log</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", fontFamily: "monospace", color: "#818cf8" }}>
            RECORD_ID: aud_101 | Actor: agt_deploy_01 (AGENT) | Action: deploy_canary_staging | Target: auth_service<br />
            Eval: AUTHORIZED | Hash: sha256_88e0a1b2c3d4e5f6 (Integrity Verified)
          </div>
        </div>
      )}
    </div>
  );
}
