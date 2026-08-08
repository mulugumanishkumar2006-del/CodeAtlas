"use client";

import React, { useState } from "react";

export default function GlobalCommandCenterPage() {
  const [activeTab, setActiveTab] = useState<"twin" | "cloud" | "incidents" | "timemachine" | "resilience">("twin");

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #10b981, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v2.4 — GLOBAL ENGINEERING COMMAND CENTER
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Continuously Updated Living Digital Twin of Code, Microservices, Infrastructure, Telemetry & Incidents
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#1e293b", border: "1px solid #10b981", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            LIVING DIGITAL TWIN
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            CODEATLAS V2.4 READY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "twin", label: "Living Digital Twin" },
          { id: "cloud", label: "Cloud & Infrastructure" },
          { id: "incidents", label: "Incidents & AI Copilot" },
          { id: "timemachine", label: "Engineering Time Machine" },
          { id: "resilience", label: "Resilience Scorecard" },
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
              backgroundColor: activeTab === tab.id ? "#059669" : "#1e293b",
              color: activeTab === tab.id ? "#ffffff" : "#94a3b8",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Living Digital Twin Tab */}
      {activeTab === "twin" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Static Code + Runtime Service Topology</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", fontFamily: "monospace", fontSize: "14px", color: "#38bdf8" }}>
            [Code: repo-gateway] → api_gateway_router (HTTP/gRPC, 890 rps) [DRIFT: EXPECTED]<br />
            │<br />
            ├── [Code: repo-auth] → auth_service (Python FastAPI) [HEALTH: 99.98% SLO]<br />
            │   └── [AWS Cloud: res_rds_auth_01] PostgreSQL Primary ($280/mo)<br />
            │<br />
            └── [Code: repo-payment] → checkout_service [HEALTH: 99.95% SLO]
          </div>
        </div>
      )}

      {/* Cloud & Infrastructure Tab */}
      {activeTab === "cloud" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Discovered Cloud & Infrastructure Graph</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Resource Name</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Type</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Region</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Cost / mo</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Health</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "12px", fontWeight: "600" }}>production-eks-cluster-us-east-1</td>
                <td style={{ padding: "12px", color: "#38bdf8" }}>KUBERNETES</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>us-east-1</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>$450.00</td>
                <td style={{ padding: "12px", color: "#34d399", fontWeight: "600" }}>HEALTHY</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Incidents & Copilot Tab */}
      {activeTab === "incidents" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Automated Incident Timeline & AI Copilot</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #10b981", marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 4px", color: "#34d399" }}>AI Grounded Diagnosis (CONFIRMED)</h3>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#cbd5e1" }}>
              Transient p99 latency spike caused by database connection pool parameter omission in commit a9b3c4d.
            </p>
            <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "700" }}>Citations: Log L402, PostgreSQL Active Connections Metric</span>
          </div>
        </div>
      )}

      {/* Time Machine Tab */}
      {activeTab === "timemachine" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Engineering Time Machine</h2>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>Inspect system state snapshot before, during, and after incidents:</p>
          <div style={{ padding: "12px", backgroundColor: "#0f172a", borderRadius: "6px", fontFamily: "monospace", color: "#34d399" }}>
            TIMESTAMP: 2026-08-08T16:24:00Z | Active Services: 6 | Health Score: 98.5 / 100 [STABLE]
          </div>
        </div>
      )}

      {/* Resilience Tab */}
      {activeTab === "resilience" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Resilience Scorecard</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Overall Resilience</span>
              <h3 style={{ fontSize: "24px", margin: "4px 0", color: "#34d399" }}>98.5 / 100</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Single Points of Failure</span>
              <h3 style={{ fontSize: "24px", margin: "4px 0", color: "#38bdf8" }}>0 Critical</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
