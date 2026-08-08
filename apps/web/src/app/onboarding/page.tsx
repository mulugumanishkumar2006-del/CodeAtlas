"use client";

import React, { useState } from "react";

export default function OnboardingPage() {
  const [completed, setCompleted] = useState(false);

  return (
    <div style={{ padding: "48px", fontFamily: "Inter, sans-serif", color: "#f8fafc", backgroundColor: "#0f172a", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "#1e293b", padding: "36px", borderRadius: "16px", border: "1px solid #334155", maxWidth: "540px", width: "100%" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 8px", color: "#38bdf8" }}>WELCOME TO CODEATLAS v2.0</h1>
        <p style={{ margin: "0 0 24px", color: "#94a3b8", fontSize: "14px" }}>Fast Onboarding: Connect repository and extract architectural insights instantly.</p>

        {!completed ? (
          <form onSubmit={(e) => { e.preventDefault(); setCompleted(true); }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#cbd5e1" }}>Organization Name</label>
              <input type="text" defaultValue="Acme Corp" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#ffffff" }} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#cbd5e1" }}>GitHub Repository URL</label>
              <input type="text" defaultValue="https://github.com/acme/demo-repo" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#ffffff" }} />
            </div>
            <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#2563eb", color: "#ffffff", border: "none", fontWeight: "700", cursor: "pointer" }}>
              Analyze & Launch Control Plane
            </button>
          </form>
        ) : (
          <div style={{ backgroundColor: "#0f172a", padding: "20px", borderRadius: "8px", border: "1px solid #10b981" }}>
            <h3 style={{ margin: "0 0 8px", color: "#34d399" }}>🎉 ONBOARDING COMPLETE</h3>
            <p style={{ margin: "0 0 8px", fontSize: "14px" }}>Repository connected and analyzed in 1.4s.</p>
            <p style={{ fontSize: "13px", color: "#38bdf8", margin: 0 }}><strong>First Insight:</strong> Zero breaking coupling detected in main branch.</p>
          </div>
        )}
      </div>
    </div>
  );
}
