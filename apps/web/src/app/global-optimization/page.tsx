"use client";

import React, { useState } from "react";

export default function GlobalOptimizationPage() {
  const [activeTab, setActiveTab] = useState<"scorecard" | "opportunities" | "pareto" | "experiments" | "executive">("scorecard");

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #3b82f6, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v2.8 — GLOBAL ENGINEERING OPTIMIZATION
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Multi-Objective Engineering Optimization, Pareto Frontiers, Cost Rightsizing & A/B Experiments
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#1e293b", border: "1px solid #3b82f6", color: "#60a5fa", fontWeight: "600", fontSize: "13px" }}>
            CONTINUOUS OPTIMIZATION
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            CODEATLAS V2.8 READY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "scorecard", label: "Engineering Scorecard" },
          { id: "opportunities", label: "Top Opportunities" },
          { id: "pareto", label: "Pareto Frontier & Architecture" },
          { id: "experiments", label: "Active A/B Experiments" },
          { id: "executive", label: "Executive Summary" },
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

      {/* Engineering Scorecard Tab */}
      {activeTab === "scorecard" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>7-Dimension Engineering Scorecard</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
            {[
              { label: "Reliability", score: "98.8 / 100", color: "#34d399" },
              { label: "Performance", score: "96.5 / 100", color: "#60a5fa" },
              { label: "Cost Efficiency", score: "94.2 / 100", color: "#fbbf24" },
              { label: "Security", score: "99.0 / 100", color: "#a78bfa" },
              { label: "Architecture", score: "95.0 / 100", color: "#38bdf8" },
              { label: "Developer Experience", score: "92.4 / 100", color: "#f472b6" },
              { label: "Operations", score: "98.0 / 100", color: "#34d399" },
              { label: "Overall Score", score: "96.3 / 100", color: "#10b981" },
            ].map((metric, idx) => (
              <div key={idx} style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
                <span style={{ color: "#94a3b8", fontSize: "12px" }}>{metric.label}</span>
                <h3 style={{ fontSize: "20px", margin: "4px 0", color: metric.color }}>{metric.score}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === "opportunities" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Ranked Optimization Opportunities</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #fbbf24" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0 0 4px", color: "#fbbf24" }}>Rightsize EKS Staging Cluster &amp; Prune Idle Logs</h3>
                <span style={{ color: "#34d399", fontWeight: "700" }}>+$350.00 / mo</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#cbd5e1" }}>Category: COST | Target: production-eks-cluster-us-east-1</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Action: Scale staging nodes down to 2 instances during off-peak hours.</p>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #60a5fa" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0 0 4px", color: "#60a5fa" }}>Enable Gzip Compression &amp; Redis Pool Caching</h3>
                <span style={{ color: "#34d399", fontWeight: "700" }}>-21ms Latency</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#cbd5e1" }}>Category: PERFORMANCE | Target: auth_service</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Action: Enable Redis keepalive and Gzip middleware on FastAPI router.</p>
            </div>
          </div>
        </div>
      )}

      {/* Pareto Tab */}
      {activeTab === "pareto" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Pareto Frontier Architecture Comparison (auth_service)</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Strategy Tier</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Monthly Cost</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Reliability</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>p99 Latency</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Effort</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "12px" }}>Strategy A (Minimal Change)</td>
                <td style={{ padding: "12px" }}>$450.00</td>
                <td style={{ padding: "12px" }}>99.95%</td>
                <td style={{ padding: "12px" }}>45.0ms</td>
                <td style={{ padding: "12px" }}>1 Day</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #334155", backgroundColor: "#0f172a" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "#34d399" }}>Strategy B (Moderate Refactor) ★ RECOMMENDED</td>
                <td style={{ padding: "12px", color: "#34d399", fontWeight: "700" }}>$310.00 (-$140)</td>
                <td style={{ padding: "12px", color: "#34d399" }}>99.98%</td>
                <td style={{ padding: "12px", color: "#34d399" }}>24.0ms (-21ms)</td>
                <td style={{ padding: "12px" }}>3 Days</td>
              </tr>
              <tr style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "12px" }}>Strategy C (Major Migration)</td>
                <td style={{ padding: "12px" }}>$280.00</td>
                <td style={{ padding: "12px" }}>99.99%</td>
                <td style={{ padding: "12px" }}>18.0ms</td>
                <td style={{ padding: "12px" }}>14 Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Experiments Tab */}
      {activeTab === "experiments" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Active A/B Engineering Experiments</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
            <h3 style={{ margin: "0 0 4px", color: "#34d399" }}>EXP_901: Redis Connection Pooling &amp; Compression</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1" }}>
              Baseline Latency: 45.2ms $\rightarrow$ Treatment: 24.8ms (<strong>-45.1% Reduction</strong>) | Monthly Savings: <strong>$120.00</strong>
            </p>
          </div>
        </div>
      )}

      {/* Executive Tab */}
      {activeTab === "executive" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Executive Optimization Summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Total Monthly Savings Identified</span>
              <h3 style={{ fontSize: "24px", margin: "4px 0", color: "#34d399" }}>$4,850.00 / mo</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Developer Friction Saved</span>
              <h3 style={{ fontSize: "24px", margin: "4px 0", color: "#60a5fa" }}>124.0 Hours / wk</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Reliability Gain</span>
              <h3 style={{ fontSize: "24px", margin: "4px 0", color: "#a78bfa" }}>+0.40% SLO</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
