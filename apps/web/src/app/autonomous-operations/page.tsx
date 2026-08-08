"use client";

import React, { useState } from "react";

export default function AutonomousOperationsPage() {
  const [activeTab, setActiveTab] = useState<"operations" | "approvals" | "policies" | "agents" | "emergencystop">("operations");
  const [emergencyStopActive, setEmergencyStopActive] = useState<boolean>(false);

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, #ef4444, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            CODEATLAS v2.6 — AUTONOMOUS ENGINEERING OPERATIONS
          </h1>
          <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Policy-Controlled, Human-Gated Autonomous Remediation, Verification & Multi-Agent Orchestration
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setEmergencyStopActive(!emergencyStopActive)}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "13px",
              backgroundColor: emergencyStopActive ? "#dc2626" : "#7f1d1d",
              color: "#ffffff",
              boxShadow: emergencyStopActive ? "0 0 12px #ef4444" : "none",
            }}
          >
            {emergencyStopActive ? "GLOBAL KILL SWITCH ACTIVE" : "EMERGENCY STOP (KILL SWITCH)"}
          </button>
          <span style={{ padding: "6px 14px", borderRadius: "9999px", backgroundColor: "#064e3b", color: "#34d399", fontWeight: "600", fontSize: "13px" }}>
            CODEATLAS V2.6 READY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "operations", label: "Active Operations" },
          { id: "approvals", label: "Approval Center (1 Pending)" },
          { id: "policies", label: "Autonomy Policy Center" },
          { id: "agents", label: "Multi-Agent Supervision" },
          { id: "emergencystop", label: "Safety & Emergency Stop" },
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

      {/* Active Operations Tab */}
      {activeTab === "operations" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Autonomous Operations Queue</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", borderLeft: "4px solid #8b5cf6" }}>
            <h3 style={{ margin: "0 0 4px", color: "#c084fc" }}>PLAN_89102: Apply connection pool fix canary in staging</h3>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#cbd5e1" }}>
              Target: <strong>auth_service</strong> | Risk Level: <span style={{ color: "#fbbf24", fontWeight: "700" }}>MEDIUM_RISK</span> | Autonomy Level: <strong>LEVEL 3</strong>
            </p>
            <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#94a3b8" }}>
              Rollback Strategy: Automated canary rollback to v2.1.3 | Verification: Latency &lt; 50ms &amp; 0 Error Budget Burn
            </p>
            <span style={{ fontSize: "12px", color: "#34d399", fontWeight: "600" }}>
              Status: SIMULATION VERIFIED — WAITING FOR HUMAN APPROVAL
            </span>
          </div>
        </div>
      )}

      {/* Approvals Tab */}
      {activeTab === "approvals" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Human Approval Center</h2>
          <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 4px", color: "#f8fafc" }}>Approval Request for PLAN_89102</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>Requester: Deployment Agent | Required Role: Platform Lead</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#059669", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer" }}>
                  APPROVE &amp; EXECUTE
                </button>
                <button style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#dc2626", color: "#fff", border: "none", fontWeight: "600", cursor: "pointer" }}>
                  REJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policies Tab */}
      {activeTab === "policies" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Organization Autonomy Policy</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Max Allowed Autonomy Level</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#c084fc" }}>LEVEL 3 (APPROVAL REQUIRED)</h3>
            </div>
            <div style={{ padding: "16px", backgroundColor: "#0f172a", borderRadius: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px" }}>Max Execution Budget</span>
              <h3 style={{ fontSize: "20px", margin: "4px 0", color: "#34d399" }}>$50.00 / operation</h3>
            </div>
          </div>
        </div>
      )}

      {/* Agents Tab */}
      {activeTab === "agents" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Multi-Agent Orchestration &amp; Supervision</h2>
          <ul style={{ color: "#cbd5e1", lineHeight: "1.8", fontSize: "14px" }}>
            <li><strong>Investigator Agent</strong>: Active (Telemetry &amp; Log Analysis)</li>
            <li><strong>Planner Agent</strong>: Active (Plan Generation &amp; Sandbox Simulation)</li>
            <li><strong>Security Agent</strong>: Active (RBAC &amp; Policy Guardrails Check)</li>
            <li><strong>Deployment Agent</strong>: Standby (Awaiting Human Approval)</li>
            <li><strong>Verifier Agent</strong>: Standby (Post-action Monitoring)</li>
          </ul>
        </div>
      )}

      {/* Emergency Stop Tab */}
      {activeTab === "emergencystop" && (
        <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "12px", border: "1px solid #334155" }}>
          <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>Global Kill Switch &amp; Emergency Stop</h2>
          <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
            Status: <strong>{emergencyStopActive ? "EMERGENCY STOP ACTIVE (ALL AUTONOMY BLOCKED)" : "NORMAL OPERATIONS (KILL SWITCH DISENGAGED)"}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
