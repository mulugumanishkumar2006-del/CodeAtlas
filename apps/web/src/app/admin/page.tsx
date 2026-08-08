"use client";

import React from "react";

export default function AdminConsolePage() {
  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      <div style={{ borderBottom: "1px solid #334155", paddingBottom: "16px", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          CODEATLAS v2.0 — ORGANIZATION ADMIN CONSOLE
        </h1>
        <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
          Team Management, Quotas, Usage, Security Policies & Audit Logs
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Subscription & Usage Quotas</h2>
          <p style={{ margin: "0 0 8px" }}>Tier: <strong style={{ color: "#38bdf8" }}>ENTERPRISE</strong></p>
          <p style={{ margin: "0 0 8px" }}>AI Usage: <strong>$14.50 / $500.00 USD Cap</strong></p>
          <p style={{ margin: "0 0 8px" }}>Token Consumption: <strong>1,450,000 Tokens</strong></p>
          <p style={{ margin: 0 }}>Repositories: <strong>6 / 50 Connected</strong></p>
        </div>

        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Security & Compliance Status</h2>
          <p style={{ margin: "0 0 8px", color: "#34d399" }}>✅ Multi-Tenant Isolation: ENFORCED</p>
          <p style={{ margin: "0 0 8px", color: "#34d399" }}>✅ RBAC Authorization: ENFORCED</p>
          <p style={{ margin: "0 0 8px", color: "#34d399" }}>✅ Audit Logging: ACTIVE</p>
          <p style={{ margin: 0, color: "#34d399" }}>✅ Rate Limiting: 1,000 req/min</p>
        </div>
      </div>
    </div>
  );
}
