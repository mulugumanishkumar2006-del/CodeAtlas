"use client";

import React, { useState } from "react";

export default function MarketplaceIntelligencePage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #ec4899, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v2.3 — INTELLIGENCE MARKETPLACE
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Discover, Evaluate, Approve & Monetize Autonomous Agents, Tools, Plugins, Workflows & Integrations
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#1e293b", border: "1px solid #ec4899", color: "#f472b6", fontWeight: "600", fontSize: "13px" }}>
            INTELLIGENCE ECOSYSTEM
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            CODEATLAS V2.3 READY
          </span>
        </div>
      </div>

      {/* Categories Filter */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {["ALL", "AGENT", "TOOL", "PLUGIN", "WORKFLOW", "INTEGRATION"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              backgroundColor: categoryFilter === cat ? "#ec4899" : "#1e293b",
              color: categoryFilter === cat ? "#ffffff" : "#94a3b8",
            }}
          >
            {cat} Marketplace
          </button>
        ))}
      </div>

      {/* Grid of Listings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Item 1 */}
        <div style={{ padding: "20px", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "#ec4899", fontWeight: "700" }}>VERIFIED AGENT</span>
            <span style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: "#064e3b", color: "#34d399", fontSize: "12px", fontWeight: "700" }}>🔒 VERIFIED PASSED</span>
          </div>
          <h2 style={{ fontSize: "18px", margin: "0 0 6px", color: "#f8fafc" }}>Enterprise Security Compliance Agent</h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 12px" }}>
            Autonomous security scanner validating SOC 2, ISO 27001, and GDPR rules across repositories.
          </p>
          <div style={{ padding: "10px", backgroundColor: "#0f172a", borderRadius: "6px", fontSize: "13px", color: "#cbd5e1", marginBottom: "12px" }}>
            Benchmark Grade: <strong style={{ color: "#34d399" }}>A+</strong> | Safety Score: 99.0% | Grounding: 98.5%
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fbbf24", fontWeight: "700" }}>★ 4.9 (340 installs)</span>
            <button style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#3b82f6", border: "none", color: "#ffffff", fontWeight: "600", cursor: "pointer" }}>
              ORG ADMIN APPROVE
            </button>
          </div>
        </div>

        {/* Item 2 */}
        <div style={{ padding: "20px", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "#a855f7", fontWeight: "700" }}>PAID TOOL</span>
            <span style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: "#064e3b", color: "#34d399", fontSize: "12px", fontWeight: "700" }}>🔒 VERIFIED PASSED</span>
          </div>
          <h2 style={{ fontSize: "18px", margin: "0 0 6px", color: "#f8fafc" }}>Jira & Confluence Inspector Tool</h2>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 12px" }}>
            Fetches live ticket status, epic links, and architecture decision logs directly for AI agents.
          </p>
          <div style={{ padding: "10px", backgroundColor: "#0f172a", borderRadius: "6px", fontSize: "13px", color: "#cbd5e1", marginBottom: "12px" }}>
            Pricing: <strong style={{ color: "#a855f7" }}>$0.01 / execution</strong> | Avg Latency: 14.5ms
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#fbbf24", fontWeight: "700" }}>★ 5.0 (890 installs)</span>
            <button style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#3b82f6", border: "none", color: "#ffffff", fontWeight: "600", cursor: "pointer" }}>
              ORG ADMIN APPROVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
