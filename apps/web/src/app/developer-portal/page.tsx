"use client";

import React, { useState } from "react";

export default function DeveloperPortalPage() {
  const [activeTab, setActiveTab] = useState<"keys" | "oauth" | "explorer" | "webhooks" | "agents" | "marketplace">("keys");
  const [explorerEndpoint, setExplorerEndpoint] = useState("/api/v1/developer-platform/scorecard/acme-corp");

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #38bdf8, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v2.2 — DEVELOPER PLATFORM & ECOSYSTEM
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Extensible API Platform, Scoped Keys, Webhooks, Custom Agents, Plugins, Workflows & Marketplace
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#1e293b", border: "1px solid #a855f7", color: "#c084fc", fontWeight: "600", fontSize: "13px" }}>
            ECOSYSTEM PLATFORM
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            CODEATLAS V2.2 READY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "keys", label: "API Keys" },
          { id: "oauth", label: "OAuth Apps" },
          { id: "explorer", label: "API Explorer" },
          { id: "webhooks", label: "Webhooks" },
          { id: "agents", label: "Agent & Tool Registry" },
          { id: "marketplace", label: "Marketplace" },
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
              backgroundColor: activeTab === tab.id ? "#7c3aed" : "#1e293b",
              color: activeTab === tab.id ? "#ffffff" : "#94a3b8",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* API Keys Tab */}
      {activeTab === "keys" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Scoped Personal & Service API Keys</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Name</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Key Prefix</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Scopes</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "12px", fontWeight: "600" }}>CI/CD Pipeline Service Key</td>
                <td style={{ padding: "12px", fontFamily: "monospace", color: "#38bdf8" }}>ca_sk_a9b3••••</td>
                <td style={{ padding: "12px", color: "#cbd5e1" }}>repository:read, agent:execute</td>
                <td style={{ padding: "12px", color: "#34d399", fontWeight: "600" }}>ACTIVE</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* OAuth Tab */}
      {activeTab === "oauth" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>OAuth 2.0 Applications</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 4px", color: "#38bdf8" }}>Slack CodeAtlas Bot</h3>
            <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#94a3b8" }}>Client ID: ca_cid_89f012a | Status: ACTIVE</p>
            <p style={{ margin: 0, fontSize: "13px", color: "#a855f7" }}>Scopes: repository:read, knowledge:read</p>
          </div>
        </div>
      )}

      {/* Explorer Tab */}
      {activeTab === "explorer" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Interactive API Explorer</h2>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <input
              type="text"
              value={explorerEndpoint}
              onChange={(e) => setExplorerEndpoint(e.target.value)}
              style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "monospace" }}
            />
            <button style={{ padding: "10px 20px", borderRadius: "6px", backgroundColor: "#10b981", border: "none", color: "#ffffff", fontWeight: "700", cursor: "pointer" }}>
              EXECUTE REQUEST
            </button>
          </div>
          <pre style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", fontSize: "13px", color: "#34d399", overflowX: "auto" }}>
{`{
  "organization_id": "acme-corp",
  "public_api_score": 99.0,
  "sdk_cli_score": 98.5,
  "webhook_platform_score": 99.5,
  "agent_tool_registry_score": 100.0,
  "plugin_sandbox_score": 98.0,
  "workflow_engine_score": 99.0,
  "marketplace_score": 97.5,
  "sandbox_developer_exp_score": 99.0,
  "ecosystem_status": "CODEATLAS V2.2 DEVELOPER PLATFORM READY"
}`}
          </pre>
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === "webhooks" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Webhook Delivery History</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
            <h3 style={{ margin: "0 0 4px", color: "#34d399" }}>HTTP 200 OK — architecture.updated</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Target: https://api.acme.com/webhooks/codeatlas | Attempts: 1</p>
          </div>
        </div>
      )}

      {/* Agents Tab */}
      {activeTab === "agents" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Agent & Tool Registries</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
              <h3 style={{ margin: "0 0 4px", color: "#38bdf8" }}>Security Auditor Agent</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>Capabilities: AST Vulnerability Inspection, Dependency CVE Check</p>
            </div>
          </div>
        </div>
      )}

      {/* Marketplace Tab */}
      {activeTab === "marketplace" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>CodeAtlas Marketplace</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
              <span style={{ fontSize: "12px", color: "#a855f7", fontWeight: "700" }}>VERIFIED AGENT</span>
              <h3 style={{ margin: "4px 0", color: "#f8fafc" }}>Enterprise Security Compliance Agent</h3>
              <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#94a3b8" }}>Autonomous security scanner validating SOC 2 and ISO 27001 rules.</p>
              <span style={{ color: "#fbbf24", fontWeight: "700", fontSize: "13px" }}>★ 4.9 (340 downloads)</span>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
              <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "700" }}>INTEGRATION</span>
              <h3 style={{ margin: "4px 0", color: "#f8fafc" }}>Slack Notification & Approval Bot</h3>
              <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#94a3b8" }}>Receive deployment alerts and approve agent tasks directly from Slack.</p>
              <span style={{ color: "#fbbf24", fontWeight: "700", fontSize: "13px" }}>★ 5.0 (890 downloads)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
