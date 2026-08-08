"use client";

import React, { useState } from "react";

export default function CommandCenterPage() {
  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <div style={{ borderBottom: "1px solid #334155", paddingBottom: "16px", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CODEATLAS v2.0 — COMMAND CENTER
        </h1>
        <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
          Unified Operational Overview Across Repositories, Analysis, Risks, Agents, Deployments & Alerts
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 4px", color: "#94a3b8", fontSize: "13px" }}>Connected Repositories</h3>
          <p style={{ fontSize: "28px", fontWeight: "700", margin: 0, color: "#38bdf8" }}>6</p>
          <span style={{ fontSize: "12px", color: "#34d399" }}>100% Parsed & Indexed</span>
        </div>
        <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 4px", color: "#94a3b8", fontSize: "13px" }}>Architecture Health Score</h3>
          <p style={{ fontSize: "28px", fontWeight: "700", margin: 0, color: "#34d399" }}>94.5 / 100</p>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Low Coupling Index</span>
        </div>
        <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 4px", color: "#94a3b8", fontSize: "13px" }}>Active Autonomous Agents</h3>
          <p style={{ fontSize: "28px", fontWeight: "700", margin: 0, color: "#818cf8" }}>3</p>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Guarded by Control Plane</span>
        </div>
        <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 4px", color: "#94a3b8", fontSize: "13px" }}>Pending Approvals</h3>
          <p style={{ fontSize: "28px", fontWeight: "700", margin: 0, color: "#fbbf24" }}>1</p>
          <span style={{ fontSize: "12px", color: "#fbbf24" }}>Production Canary Gate</span>
        </div>
      </div>

      <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
        <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Recent Real-Time Alerts & System Events</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ padding: "14px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #f59e0b" }}>
            <span style={{ color: "#fbbf24", fontWeight: "700" }}>⚠️ RUNTIME DRIFT:</span> Staging auth_service pod image version mismatch detected.
          </div>
          <div style={{ padding: "14px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
            <span style={{ color: "#34d399", fontWeight: "700" }}>✅ DEPLOYMENT VERIFIED:</span> Staging auth_service v1.3.0-rc1 100% probes passed.
          </div>
        </div>
      </div>
    </div>
  );
}
