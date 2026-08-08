"use client";

import React, { useState } from "react";

export default function EnterpriseScalePage() {
  const [activeTab, setActiveTab] = useState<"hierarchy" | "repos" | "services" | "governance" | "releasetrain" | "finops">("hierarchy");

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v2.1 — ENTERPRISE SCALE PLATFORM
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Scalable Workspace Hierarchy, Catalogs, Policy-as-Code Governance, Security Center & Release Trains
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#1e293b", border: "1px solid #3b82f6", color: "#60a5fa", fontWeight: "600", fontSize: "13px" }}>
            ENTERPRISE TIER
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            CODEATLAS V2.1 READY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "hierarchy", label: "Enterprise Hierarchy" },
          { id: "repos", label: "Repository Catalog" },
          { id: "services", label: "Service Catalog" },
          { id: "governance", label: "Policy as Code" },
          { id: "releasetrain", label: "Release Train" },
          { id: "finops", label: "FinOps Cost Anomalies" },
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
              backgroundColor: activeTab === tab.id ? "#2563eb" : "#1e293b",
              color: activeTab === tab.id ? "#ffffff" : "#94a3b8",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hierarchy Tab */}
      {activeTab === "hierarchy" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Organization Workspace Hierarchy</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", fontFamily: "monospace", fontSize: "14px", color: "#38bdf8" }}>
            Organization: Acme Corp (Enterprise)<br />
            ├── Business Unit: Core Engineering & Infrastructure<br />
            │   └── Department: Platform Architecture & SRE<br />
            │       └── Team: Platform Architecture Team<br />
            │           └── Workspace: Production Control Plane<br />
            │               ├── Repository: CodeAtlas Main Monorepo<br />
            │               └── Service: auth_service, api_gateway_router<br />
            └── Business Unit: Product & Growth Engineering
          </div>
        </div>
      )}

      {/* Repos Tab */}
      {activeTab === "repos" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Enterprise Repository Catalog</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Repository</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Owner Team</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Stack</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Health Score</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "12px", fontWeight: "600" }}>demo-repo</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>Platform Architecture Team</td>
                <td style={{ padding: "12px", color: "#38bdf8" }}>Python / Next.js</td>
                <td style={{ padding: "12px", color: "#34d399", fontWeight: "700" }}>95.0 / 100</td>
                <td style={{ padding: "12px", color: "#34d399" }}>HEALTHY</td>
              </tr>
              <tr>
                <td style={{ padding: "12px", fontWeight: "600" }}>repo-auth</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>Security Engineering Team</td>
                <td style={{ padding: "12px", color: "#38bdf8" }}>Python FastAPI</td>
                <td style={{ padding: "12px", color: "#34d399", fontWeight: "700" }}>98.0 / 100</td>
                <td style={{ padding: "12px", color: "#34d399" }}>HEALTHY</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Enterprise Service Catalog</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
              <h3 style={{ margin: "0 0 4px", color: "#38bdf8" }}>auth_service</h3>
              <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#94a3b8" }}>Repository: repo-auth | Environment: PRODUCTION | SLO Target: 99.99%</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#34d399" }}>Dependencies: postgres_db, redis_session_cache</p>
            </div>
          </div>
        </div>
      )}

      {/* Governance Tab */}
      {activeTab === "governance" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Policy as Code Engine</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
            <h3 style={{ margin: "0 0 4px", color: "#34d399" }}>✅ PASS: Mandatory Team Ownership Assigned</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Repository demo-repo has valid team owner assigned.</p>
          </div>
        </div>
      )}

      {/* Release Train Tab */}
      {activeTab === "releasetrain" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Coordinated Enterprise Release Train</h2>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>Safe Calculated Dependency Order:</p>
          <p style={{ fontSize: "16px", fontFamily: "monospace", color: "#38bdf8", fontWeight: "700" }}>
            1. auth_service → 2. billing_service → 3. api_gateway_router
          </p>
        </div>
      )}

      {/* FinOps Tab */}
      {activeTab === "finops" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>FinOps Cost Anomaly Detector</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
            <h3 style={{ margin: "0 0 4px", color: "#34d399" }}>✅ OPTIMAL COST USAGE</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>Zero cost anomalies detected across compute, storage, and AI token budgets.</p>
          </div>
        </div>
      )}
    </div>
  );
}
