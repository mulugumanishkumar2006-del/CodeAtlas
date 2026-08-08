"use client";

import React, { useState } from "react";

export default function EngineeringControlPlanePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "environments" | "queue" | "drift" | "ai">("overview");
  const [aiQuestion, setAiQuestion] = useState("What is running in Staging and is there any drift?");
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const environments = [
    { name: "LOCAL", provider: "Docker Desktop", version: "v1.3.0-dev", risk: "LOW", status: "HEALTHY" },
    { name: "DEVELOPMENT", provider: "AWS EKS Dev", version: "v1.3.0-dev", risk: "LOW", status: "HEALTHY" },
    { name: "TEST", provider: "AWS EKS Test", version: "v1.3.0-rc0", risk: "LOW", status: "HEALTHY" },
    { name: "STAGING", provider: "AWS EKS Staging", version: "v1.3.0-rc1", risk: "MEDIUM", status: "HEALTHY" },
    { name: "PRODUCTION", provider: "AWS EKS Production", version: "v1.2.0", risk: "CRITICAL", status: "HEALTHY" },
  ];

  const queueItems = [
    { id: "op_canary1", action: "Canary Deployment to Staging", env: "STAGING", agent: "Autopilot Agent", status: "RUNNING", pos: 1 },
    { id: "op_prod_deploy", action: "Production Rollout v1.3.0", env: "PRODUCTION", agent: "Lead Architect", status: "WAITING_APPROVAL", pos: 2 },
  ];

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAi(true);
    setTimeout(() => {
      setAiResponse({
        answer: "OPERATIONS CONTROL PLANE STATUS FOR STAGING:\n1. CURRENT VERSION: auth_service v1.3.0-rc1 running on AWS EKS Staging Cluster.\n2. DRIFT ALERT DETECTED: Observed runtime pod image is v1.2.9-hotfix (Runtime Drift).\n3. HEALTH: 100% liveness/readiness probes passing. Zero error spikes recorded in last 30m.",
        confidence: 0.96,
        evidence: ["EKS Pod Ingestion Telemetry", "v1.8 Autopilot Log", "CI/CD Pipeline Run #409"],
        recommended: "Synchronize Staging deployment to v1.3.0-rc1 using Canary strategy."
      });
      setLoadingAi(false);
    }, 600);
  };

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v1.9 — ENGINEERING CONTROL PLANE
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Intelligence, Governance, Decision & Orchestration Layer Across Repositories, CI/CD, Cloud & Agents
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#1e293b", border: "1px solid #3b82f6", color: "#60a5fa", fontWeight: "600", fontSize: "13px" }}>
            CONTROL LOOP: ACTIVE
          </span>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            100% HEALTHY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "overview", label: "Control Overview" },
          { id: "environments", label: "Environment Matrix & Graph" },
          { id: "queue", label: "Operations Queue" },
          { id: "drift", label: "Drift Detection" },
          { id: "ai", label: "Operations AI Assistant" },
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 8px", color: "#94a3b8", fontSize: "14px" }}>Control Loop Status</h3>
            <p style={{ fontSize: "20px", fontWeight: "700", margin: "0", color: "#38bdf8" }}>PLAN → POLICY → EXECUTE → VERIFY</p>
            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "12px" }}>All 48 Engineering Control Plane phases active and verified.</p>
          </div>
          <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 8px", color: "#94a3b8", fontSize: "14px" }}>Active Environments</h3>
            <p style={{ fontSize: "32px", fontWeight: "700", margin: "0", color: "#f8fafc" }}>5</p>
            <p style={{ fontSize: "13px", color: "#34d399", marginTop: "8px" }}>Local, Dev, Test, Staging, Production</p>
          </div>
          <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 8px", color: "#94a3b8", fontSize: "14px" }}>Policy Guard Decision</h3>
            <p style={{ fontSize: "20px", fontWeight: "700", margin: "0", color: "#fbbf24" }}>REQUIRES_APPROVAL</p>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "8px" }}>Production Gate Enforced</p>
          </div>
        </div>
      )}

      {/* Environments Tab */}
      {activeTab === "environments" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Environment Matrix (WHAT RUNS WHERE)</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#f8fafc" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #334155", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Environment</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Provider</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Deployed Version</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Risk Level</th>
                <th style={{ padding: "12px", color: "#94a3b8" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {environments.map((env) => (
                <tr key={env.name} style={{ borderBottom: "1px solid #334155" }}>
                  <td style={{ padding: "12px", fontWeight: "600" }}>{env.name}</td>
                  <td style={{ padding: "12px", color: "#cbd5e1" }}>{env.provider}</td>
                  <td style={{ padding: "12px", color: "#38bdf8", fontFamily: "monospace" }}>{env.version}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", backgroundColor: env.risk === "CRITICAL" ? "#7f1d1d" : env.risk === "MEDIUM" ? "#78350f" : "#064e3b", color: env.risk === "CRITICAL" ? "#fca5a5" : env.risk === "MEDIUM" ? "#fde047" : "#6ee7b7" }}>
                      {env.risk}
                    </span>
                  </td>
                  <td style={{ padding: "12px", color: "#34d399", fontWeight: "600" }}>{env.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Queue Tab */}
      {activeTab === "queue" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Centralized Operations Queue</h2>
          {queueItems.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", marginBottom: "12px", border: "1px solid #334155" }}>
              <div>
                <span style={{ color: "#38bdf8", fontWeight: "700", marginRight: "12px" }}>#{item.pos} {item.id}</span>
                <span style={{ fontSize: "16px", fontWeight: "600" }}>{item.action}</span>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>Target: {item.env} | Initiator: {item.agent}</p>
              </div>
              <span style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "700", backgroundColor: item.status === "RUNNING" ? "#1e3a8a" : "#854d0e", color: item.status === "RUNNING" ? "#93c5fd" : "#fef08a" }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Drift Tab */}
      {activeTab === "drift" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Environment Drift Detector</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #f59e0b" }}>
            <h3 style={{ margin: "0 0 8px", color: "#fbbf24" }}>⚠️ RUNTIME DRIFT DETECTED IN STAGING</h3>
            <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#cbd5e1" }}>Service: <strong>auth_service</strong></p>
            <p style={{ margin: "0 0 4px", fontSize: "14px", color: "#cbd5e1" }}>Expected Version: <span style={{ color: "#38bdf8", fontFamily: "monospace" }}>v1.3.0-rc1</span></p>
            <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#cbd5e1" }}>Observed Pod Version: <span style={{ color: "#f43f5e", fontFamily: "monospace" }}>v1.2.9-hotfix</span></p>
            <p style={{ fontSize: "13px", color: "#94a3b8" }}>Drift Classification: <strong>RUNTIME</strong> | Risk Level: <strong>MEDIUM</strong></p>
          </div>
        </div>
      )}

      {/* Operations AI Tab */}
      {activeTab === "ai" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Operations AI Assistant</h2>
          <form onSubmit={handleAiSubmit} style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#ffffff", fontSize: "14px" }}
            />
            <button type="submit" style={{ padding: "12px 24px", borderRadius: "8px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", fontWeight: "700", cursor: "pointer" }}>
              {loadingAi ? "Analyzing..." : "Ask Operations AI"}
            </button>
          </form>

          {aiResponse && (
            <div style={{ backgroundColor: "#0f172a", padding: "20px", borderRadius: "8px", border: "1px solid #334155" }}>
              <pre style={{ whiteSpace: "pre-wrap", color: "#e2e8f0", fontFamily: "sans-serif", fontSize: "14px", margin: "0 0 16px" }}>{aiResponse.answer}</pre>
              <p style={{ fontSize: "13px", color: "#38bdf8", margin: "0 0 8px" }}><strong>Recommended Action:</strong> {aiResponse.recommended}</p>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Confidence: {(aiResponse.confidence * 100).toFixed(0)}% | Evidence: {aiResponse.evidence.join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
