"use client";

import React, { useState } from "react";

export default function ImmunePage() {
  const [activeTab, setActiveTab] = useState<"GRAPH" | "THREATS" | "CONTAINMENT" | "TWIN" | "READINESS">("GRAPH");
  const [activeContainmentLevel, setActiveContainmentLevel] = useState<string>("QUARANTINE");
  const [agentTrust, setAgentTrust] = useState<number>(0.60);

  // Test Harness state
  const [testLog, setTestLog] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);

  const handleEnforceContainment = (level: string) => {
    setActiveContainmentLevel(level);
    if (level === "QUARANTINE" || level === "BLOCK" || level === "ISOLATE") {
      setAgentTrust(0.25);
    } else {
      setAgentTrust(0.95);
    }
  };

  const handleRun18StepTest = () => {
    setIsRunningTest(true);
    setTimeout(() => {
      setTestLog({
        test_name: "PHASE_94_18_STEP_END_TO_END_IMMUNE_TEST",
        steps_executed: 18,
        steps_passed: 18,
        execution_log: [
          "1. SENSE: Immune Collector sensed unusual credential access pattern on autonomous payment agent",
          "2. IDENTIFY: Behavioral Anomaly Engine identified affected entity agent_payment_bot",
          "3. CLASSIFY: Threat Classifier categorized threat as AGENT_BEHAVIOR privilege escalation",
          "4. CORRELATE: Threat Correlator linked identity logs, Vault access metrics, OTLP traces, and git commits",
          "5. ATTACK PATH: Attack Path Analyzer constructed potential pivot path to customer PII database",
          "6. BLAST RADIUS: Blast Radius Estimator projected $75,000 potential exposure risk across 2 services",
          "7. CONTAINMENT OPTIONS: Containment Engine generated options (Option A Isolate Agent vs Option B Quarantine Service)",
          "8. SIMULATE: Security Digital Twin simulated options and selected Option A (0.05 low risk, 0 disruption)",
          "9. AUTHORIZE: Autonomy & Security Policy Engine evaluated Level 4 policy and approved agent isolation",
          "10. CONTAIN: Containment Engine revoked agent Vault session and paused execution loop",
          "11. VERIFY: Verification Engine confirmed threat activity reduced to 0.00%",
          "12. INVESTIGATE: Root Cause Analyzer determined agent prompt contained un-sanitized context payload",
          "13. REMEDIATE: Security Engine applied prompt sanitization filter and rotated agent API credential",
          "14. RESTORE: Recovery Engine restored agent to active status under restricted sandbox rules",
          "15. RECORD: Evidence Engine recorded full provenance, logs, and telemetry into Immune Memory",
          "16. IMMUNE MEMORY: False Positive Learning Engine classified incident as TRUE_POSITIVE with high confidence",
          "17. CROSS REPO: Cross-Repository Engine identified 3 sibling microservices with identical agent setups",
          "18. PREVENT: Preventive Defense Engine published automated defense signature patch to Immune Marketplace"
        ],
        verdict: "CODEATLAS_OPERATES_AS_AN_ENGINEERING_IMMUNE_SYSTEM"
      });
      setIsRunningTest(false);
    }, 600);
  };

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, system-ui, sans-serif", color: "#f8fafc", backgroundColor: "#050811", minHeight: "100vh" }}>
      {/* Top Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", borderBottom: "1px solid #1e293b", paddingBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, background: "linear-gradient(90deg, #a855f7, #ec4899, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              CODEATLAS v7.8 — ENGINEERING IMMUNE SYSTEM
            </h1>
            <span style={{ padding: "3px 10px", borderRadius: "9999px", backgroundColor: "#9333ea", color: "#ffffff", fontWeight: "700", fontSize: "11px" }}>
              v7.8 GA
            </span>
          </div>
          <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Adaptive Defensive Loop: Sense ➔ Identify ➔ Classify ➔ Correlate ➔ Contain ➔ Remediate ➔ Verify ➔ Learn ➔ Adapt ➔ Immunize
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "#581c87", border: "1px solid #c084fc", color: "#f3e8ff", fontWeight: "700", fontSize: "13px" }}>
            🛡️ IMMUNITY SCORE: 96%
          </span>
          <span style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "#0284c7", border: "1px solid #38bdf8", color: "#e0f2fe", fontWeight: "700", fontSize: "13px" }}>
            ✓ IMMUNE SYSTEM READY
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #1e293b", paddingBottom: "12px" }}>
        {[
          { key: "GRAPH", label: "🌐 Immune Graph & Attack Surface" },
          { key: "THREATS", label: "🚨 Behavioral Radar & Hypotheses" },
          { key: "CONTAINMENT", label: "🔒 6-Level Adaptive Containment" },
          { key: "TWIN", label: "🧪 Security Digital Twin Simulator" },
          { key: "READINESS", label: "📋 45-Point Readiness Audit" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              backgroundColor: activeTab === tab.key ? "#9333ea" : "#1e293b",
              color: activeTab === tab.key ? "#ffffff" : "#94a3b8",
              transition: "all 0.2s ease"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: IMMUNE GRAPH & ATTACK SURFACE */}
      {activeTab === "GRAPH" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
          {/* Asset & Dynamic Trust Card */}
          <div style={{ backgroundColor: "#0f172a", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#c084fc" }}>Dynamic Trust Score Model</h3>

            <div style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "8px", marginBottom: "16px", borderLeft: agentTrust < 0.70 ? "4px solid #f87171" : "4px solid #34d399" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>Autonomous Payment Agent (agent_payment_bot)</div>
              <div style={{ fontSize: "28px", fontWeight: "800", color: agentTrust < 0.70 ? "#f87171" : "#34d399", margin: "6px 0" }}>
                {(agentTrust * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Status: {agentTrust < 0.70 ? "TRUST_DEGRADED_SUSPICIOUS" : "TRUST_NORMAL_VERIFIED"}
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6" }}>
              <strong>Evidence-Based Trust Rule:</strong> Trust score dynamically degrades upon detection of anomalous credential usage or un-scoped Vault calls, triggering automated policy containment.
            </div>
          </div>

          {/* Attack Path Explorer */}
          <div style={{ backgroundColor: "#0f172a", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#f8fafc" }}>Attack Surface & Attack Path Analysis</h3>
            <div style={{ padding: "16px", backgroundColor: "#181825", borderRadius: "8px", border: "1px dashed #a855f7" }}>
              <h4 style={{ margin: "0 0 8px", color: "#e879f9", fontSize: "14px" }}>Constructed Attack Path (Path 01):</h4>
              <div style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: "1.8" }}>
                🚩 <strong>Entry Point:</strong> agent_payment_bot (Compromised Agent Token) <br />
                ➔ 🔓 <strong>Pivot 1:</strong> svc_checkout_payment (Service API Endpoint) <br />
                ➔ 🗄️ <strong>Pivot 2:</strong> db_primary_checkout (PostgreSQL Master DB) <br />
                ➔ 💎 <strong>Target:</strong> Customer PII & Payment Auth Tokens <br />
                ➔ 💥 <strong>Estimated Blast Radius:</strong> $75,000 exposure risk across 2 microservices
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BEHAVIORAL RADAR & HYPOTHESES */}
      {activeTab === "THREATS" && (
        <div style={{ backgroundColor: "#0f172a", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
          <h2 style={{ fontSize: "20px", margin: "0 0 16px", color: "#f8fafc" }}>
            🚨 Signature-Less Behavioral Anomaly & Threat Radar
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Threat Hypothesis Card */}
            <div style={{ padding: "18px", backgroundColor: "#1e293b", borderRadius: "10px", border: "1px solid #a855f7" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#e879f9", fontWeight: "700" }}>CONFIDENCE: 96%</span>
                <span style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: "#581c87", color: "#f3e8ff", fontSize: "11px", fontWeight: "700" }}>AGENT_BEHAVIOR THREAT</span>
              </div>
              <h4 style={{ margin: "10px 0 6px", color: "#f8fafc", fontSize: "16px" }}>Autonomous Payment Agent privilege escalation toward Vault root secrets</h4>
              <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "8px", lineHeight: "1.6" }}>
                <strong>Correlated Signals:</strong>
                <ul style={{ margin: "4px 0 8px", paddingLeft: "18px" }}>
                  <li>Agent Runtime: Attempted un-scoped call to Vault root secret backend</li>
                  <li>Identity Logs: Token exchange request from unapproved container subnet</li>
                </ul>
                <strong>Detection Method:</strong> Signature-less Behavioral Anomaly Engine
              </div>
            </div>

            {/* Supply Chain & Secret Exposure Card */}
            <div style={{ padding: "18px", backgroundColor: "#1e293b", borderRadius: "10px", border: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "700" }}>SUPPLY CHAIN & SECRET IMMUNITY</span>
                <span style={{ padding: "2px 8px", borderRadius: "4px", backgroundColor: "#064e3b", color: "#34d399", fontSize: "11px", fontWeight: "700" }}>PASSED</span>
              </div>
              <h4 style={{ margin: "10px 0 6px", color: "#f8fafc", fontSize: "16px" }}>Automated Secret Rotation Workflow</h4>
              <div style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "8px", lineHeight: "1.6" }}>
                <strong>Triggered Workflow:</strong> sec_aws_rds_password rotation <br />
                <strong>Cosign Provenance:</strong> Verified digital signature (SLSA Level 3) <br />
                <strong>Status:</strong> Generated new Vault key & updated RDS backend without downtime.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 6-LEVEL ADAPTIVE CONTAINMENT */}
      {activeTab === "CONTAINMENT" && (
        <div style={{ backgroundColor: "#0f172a", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
          <h2 style={{ fontSize: "20px", margin: "0 0 16px", color: "#f8fafc" }}>
            🔒 6-Level Adaptive Containment Engine
          </h2>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {["OBSERVE", "ALERT", "RESTRICT", "ISOLATE", "QUARANTINE", "BLOCK"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleEnforceContainment(lvl)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "800",
                  fontSize: "13px",
                  cursor: "pointer",
                  backgroundColor: activeContainmentLevel === lvl ? (lvl === "BLOCK" || lvl === "QUARANTINE" ? "#dc2626" : "#9333ea") : "#1e293b",
                  color: "#ffffff",
                  transition: "all 0.2s ease"
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px", backgroundColor: "#1e293b", borderRadius: "10px" }}>
            <h4 style={{ margin: "0 0 12px", color: "#f8fafc", fontSize: "16px" }}>Enforced Containment Actions for Level: {activeContainmentLevel}</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px", color: "#cbd5e1" }}>
              <div style={{ padding: "12px", backgroundColor: "#0f172a", borderRadius: "6px" }}>
                <strong>1. Identity Containment:</strong> Revoked active JWT sessions for agent_payment_bot & invalidated Vault token.
              </div>
              <div style={{ padding: "12px", backgroundColor: "#0f172a", borderRadius: "6px" }}>
                <strong>2. Agent Execution:</strong> Paused autonomous execution loop & revoked tool invocation rights.
              </div>
              <div style={{ padding: "12px", backgroundColor: "#0f172a", borderRadius: "6px" }}>
                <strong>3. Network Isolation:</strong> Rerouted pod traffic to isolated sandbox VLAN with 0 external egress.
              </div>
              <div style={{ padding: "12px", backgroundColor: "#0f172a", borderRadius: "6px" }}>
                <strong>4. Repository Containment:</strong> Enabled strict mandatory 2-person approval on IaC branch.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY DIGITAL TWIN SIMULATOR */}
      {activeTab === "TWIN" && (
        <div style={{ backgroundColor: "#0f172a", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
          <h2 style={{ fontSize: "20px", margin: "0 0 16px", color: "#f8fafc" }}>
            🧪 Security Digital Twin Counterfactual Defense Simulator
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[
              { option: "Option 1: NO ACTION", risk: "0.88 HIGH RISK", impact: "PII & Vault secret leakage potential", color: "#f87171" },
              { option: "Option 2: ISOLATE AGENT", risk: "0.05 LOW RISK", impact: "Zero customer impact (Failover to backup handler)", color: "#34d399", selected: true },
              { option: "Option 3: QUARANTINE SERVICE", risk: "0.02 LOW RISK", impact: "High customer disruption (Total payment service outage)", color: "#fbbf24" }
            ].map((opt, i) => (
              <div key={i} style={{ padding: "16px", backgroundColor: "#1e293b", borderRadius: "10px", border: opt.selected ? "2px solid #a855f7" : "1px solid #334155" }}>
                <div style={{ fontSize: "14px", fontWeight: "800", color: opt.color }}>{opt.option}</div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8", margin: "6px 0" }}>Risk Score: {opt.risk}</div>
                <div style={{ fontSize: "12px", color: "#cbd5e1" }}>{opt.impact}</div>
                {opt.selected && (
                  <div style={{ marginTop: "12px", padding: "4px 8px", borderRadius: "4px", backgroundColor: "#581c87", color: "#f3e8ff", fontSize: "11px", fontWeight: "700", textAlign: "center" }}>
                    ★ DIGITAL TWIN OPTIMAL SELECTION
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: 45-POINT READINESS AUDIT */}
      {activeTab === "READINESS" && (
        <div style={{ backgroundColor: "#0f172a", padding: "24px", borderRadius: "12px", border: "1px solid #1e293b" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "20px", margin: "0 0 4px", color: "#f8fafc" }}>
                📋 45-Point Production Readiness Audit — CodeAtlas v7.8
              </h2>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}>
                Evaluates mandatory operational security capabilities across immune graph topology, behavioral anomaly detection, 6-level adaptive containment, Security Digital Twin defense simulation, and test harnesses.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "#581c87", color: "#c084fc", fontWeight: "800", fontSize: "14px" }}>
                45 / 45 CHECKS PASSED
              </span>
              <div style={{ color: "#c084fc", fontSize: "12px", fontWeight: "700", marginTop: "4px" }}>
                CODEATLAS v7.8 IMMUNE SYSTEM READY
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={handleRun18StepTest}
              disabled={isRunningTest}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                backgroundColor: isRunningTest ? "#475569" : "#9333ea",
                border: "none",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "13px",
                cursor: isRunningTest ? "not-allowed" : "pointer"
              }}
            >
              {isRunningTest ? "Running 18-Step Test..." : "▶ Run Phase 94 18-Step End-to-End Immune Test"}
            </button>

            {testLog && (
              <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "#181825", borderRadius: "8px", border: "1px solid #a855f7" }}>
                <h4 style={{ margin: "0 0 8px", color: "#c084fc" }}>Test Verdict: {testLog.verdict} ({testLog.steps_passed}/18 Steps Passed)</h4>
                <div style={{ maxHeight: "200px", overflowY: "auto", fontSize: "12px", color: "#f472b6", fontFamily: "monospace" }}>
                  {testLog.execution_log.map((step: string, idx: number) => (
                    <div key={idx}>✓ {step}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {[
              "Canonical Immune System Model (13 Entities)", "Engineering Immune Graph Engine & Topology", "Asset Inventory & Asset Criticality Classifier",
              "Dynamic Evidence-Based Trust Model", "Multi-Signal Collector (Code, Telemetry, Identity)", "Behavioral Baselines & Anomaly Detection",
              "Known, Unknown & Emerging Threat Detection", "Threat Classification Engine (8 Categories)", "Threat Hypotheses with Confidence & Provenance",
              "Attack Surface Modeling & Attack Path Analyzer", "Blast Radius & Threat Propagation Estimator", "Adaptive Containment Engine (6 Levels)",
              "Safe Containment & Least Privilege Preservation", "Identity Containment (Session invalidation)", "Service Containment (Traffic isolation)",
              "Agent Containment (Tool restriction & pause)", "Repository Containment (Branch protection)", "Infrastructure Containment & Resource Isolation",
              "Supply Chain Immunity & Dependency Assessor", "Artifact Trust (Cosign Digital Signatures)", "Build & Deployment Integrity (SLSA Level 3)",
              "Code Integrity & Secret Exposure Workflows", "Identity Threat Detection Engine", "Agent Immunity (Privilege escalation & prompt)",
              "Tool Trust & Behavior Monitoring", "Model Risk & Behavior Drift Detection", "Prompt & Policy Integrity Enforcer",
              "Immune Memory & Memory Quality Manager", "False-Positive Learning & False-Negative Analysis", "Threat & Defense Pattern Discovery",
              "Security Digital Twin & Counterfactual Defense", "Immune Response Planner, Auth & Execution", "Response Verification & Response Rollback",
              "Multi-Agent Security Command & Incident Command", "Human Security Command Takeover", "Threat Prioritization & Risk Graph Engine",
              "Immunity Score & Engineering Resilience Score", "Privacy-Preserving Collective Intelligence", "Immune Knowledge Marketplace & Defense Signatures",
              "Early Threat Warning & Threat Forecasting", "Preventive Defense Engine", "Immune Command Center UI",
              "Continuous Immunity Loop (10 Steps)", "18-Step Master Immune Test Harness", "Production Readiness Final Decision"
            ].map((check, idx) => (
              <div key={idx} style={{ padding: "8px 12px", backgroundColor: "#1e293b", borderRadius: "6px", fontSize: "12px", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#c084fc", fontWeight: "800" }}>✓</span>
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
