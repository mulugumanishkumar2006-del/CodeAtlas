"use client";

import React, { useState } from "react";

export default function EnterpriseExpansionV32Page() {
  const [activeTab, setActiveTab] = useState<"cto" | "hierarchy" | "sso" | "siem" | "catalog" | "policy" | "roi">("cto");

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v3.2 — ENTERPRISE EXPANSION ADMIN CONSOLE
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            6-Level Organization Hierarchy, SSO/SCIM Directory Sync, SIEM Audit Streaming &amp; Policy as Code
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#1e293b", border: "1px solid #a855f7", color: "#c084fc", fontWeight: "600", fontSize: "13px" }}>
            GLOBAL ENTERPRISE
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            CODEATLAS V3.2 READY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "cto", label: "Executive CTO View" },
          { id: "hierarchy", label: "6-Level Hierarchy" },
          { id: "sso", label: "SSO & SCIM Sync" },
          { id: "siem", label: "SIEM Audit Stream" },
          { id: "catalog", label: "Enterprise Catalog" },
          { id: "policy", label: "Policy as Code" },
          { id: "roi", label: "Engineering ROI" },
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
              backgroundColor: activeTab === tab.id ? "#9333ea" : "#1e293b",
              color: activeTab === tab.id ? "#ffffff" : "#94a3b8",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CTO Tab */}
      {activeTab === "cto" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Executive CTO / VP Engineering Center</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Overall Health Score</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#34d399" }}>98.6 / 100</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Monthly FinOps Savings</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#c084fc" }}>$3,500.00 / mo</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Autonomy Adoption</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#38bdf8" }}>85.0% Adopted</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>MTTR Reduction</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#34d399" }}>45.2% Faster</h3>
            </div>
          </div>
        </div>
      )}

      {/* Hierarchy Tab */}
      {activeTab === "hierarchy" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>6-Level Enterprise Hierarchy</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", fontFamily: "monospace", color: "#c084fc" }}>
            Acme Global (Org)<br />
            &nbsp;&nbsp;&#9492;&#9472;&#9472; Core Infrastructure (Business Unit)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9492;&#9472;&#9472; Cloud Platform (Department)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9492;&#9472;&#9472; Identity &amp; Security (Team)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9492;&#9472;&#9472; Auth Workspace (Workspace)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9492;&#9472;&#9472; auth_service_repo (Repository)
          </div>
        </div>
      )}

      {/* SSO Tab */}
      {activeTab === "sso" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>SSO &amp; SCIM Directory Provisioning</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#cbd5e1" }}>
              Identity Provider: <strong>Okta SAML 2.0 / OIDC</strong> (Domain Verified &amp; Enforced)
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#34d399" }}>
              SCIM Provisioning: <strong>ACTIVE</strong> | Synced Users: <strong>450</strong> | Synced Groups: <strong>18</strong>
            </p>
          </div>
        </div>
      )}

      {/* SIEM Tab */}
      {activeTab === "siem" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>SIEM Real-Time Audit Event Stream</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#cbd5e1" }}>
              Target SIEM: <strong>Splunk / Datadog SIEM</strong> | Audit Stream Status: <strong>FORWARDING_ACTIVE</strong>
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#c084fc" }}>
              Events Forwarded (24h): <strong>14,250 Events</strong>
            </p>
          </div>
        </div>
      )}

      {/* Catalog Tab */}
      {activeTab === "catalog" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Enterprise Service Catalog</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Service Name</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Owner Team</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Criticality</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>SLO Met</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "12px", fontWeight: "600" }}>auth_service</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>Identity &amp; Security Team</td>
                <td style={{ padding: "12px", color: "#f87171", fontWeight: "700" }}>CRITICAL</td>
                <td style={{ padding: "12px", color: "#34d399" }}>99.98%</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "12px", fontWeight: "600" }}>billing_service</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>FinOps Platform Team</td>
                <td style={{ padding: "12px", color: "#fbbf24", fontWeight: "700" }}>HIGH</td>
                <td style={{ padding: "12px", color: "#34d399" }}>99.95%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Policy Tab */}
      {activeTab === "policy" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Engineering Policy as Code (OPA / Rego)</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
            <h3 style={{ margin: "0 0 4px", color: "#34d399" }}>Require Test Coverage &gt;= 80% &amp; Layer Isolation</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>Evaluations Run: 145 | Violations Found: 0 (Status: PASSED)</p>
          </div>
        </div>
      )}

      {/* ROI Tab */}
      {activeTab === "roi" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Organizational Engineering ROI</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Developer Time Saved</span>
              <h3 style={{ fontSize: "24px", margin: "4px 0", color: "#c084fc" }}>520.0 Hours / mo</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Estimated Annual Savings</span>
              <h3 style={{ fontSize: "24px", margin: "4px 0", color: "#34d399" }}>$145,000.00 / yr</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>ROI Multiplier</span>
              <h3 style={{ fontSize: "24px", margin: "4px 0", color: "#38bdf8" }}>8.5x ROI</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
