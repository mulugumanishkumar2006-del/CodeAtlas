"use client";

import React, { useState } from "react";
import {
  Globe,
  Server,
  Activity,
  ShieldCheck,
  Zap,
  Power,
  Layers,
  Sparkles,
  Sun,
  Flame,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Clock,
  DollarSign
} from "lucide-react";

export function GlobalOperationsHub() {
  const [activeTab, setActiveTab] = useState<"topology" | "incidents" | "dr" | "dora" | "finops">("topology");
  const [globalKillSwitchActive, setGlobalKillSwitchActive] = useState(false);

  const regions = [
    { id: "reg_us_east", name: "US East (N. Virginia)", cloud: "AWS", geo: "North America", latency: "12.4ms", avail: "99.99%", status: "HEALTHY" },
    { id: "reg_eu_west", name: "EU West (Frankfurt)", cloud: "GCP", geo: "Europe (GDPR Vault)", latency: "48.2ms", avail: "99.98%", status: "HEALTHY" },
    { id: "reg_ap_south", name: "AP South (Mumbai)", cloud: "AZURE", geo: "Asia Pacific", latency: "84.1ms", avail: "99.95%", status: "HEALTHY" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20">
              CODEATLAS v3.6
            </span>
            <span className="text-slate-400 text-xs">Global Engineering Operations Control Plane</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Worldwide Operations & Multi-Region Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Global scale without loss of security, control, data isolation, performance, or governance across AWS, GCP & Azure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setGlobalKillSwitchActive(!globalKillSwitchActive)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-sm transition-all shadow-lg ${
              globalKillSwitchActive
                ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse"
                : "bg-slate-900 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-red-400"
            }`}
          >
            <Power className="w-4 h-4" />
            {globalKillSwitchActive ? "GLOBAL EMERGENCY KILL SWITCH ACTIVE" : "GLOBAL KILL SWITCH"}
          </button>
        </div>
      </div>

      {/* Emergency Banner */}
      {globalKillSwitchActive && (
        <div className="bg-red-500/10 border-2 border-red-500/40 p-4 rounded-xl mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="font-bold text-red-400 text-sm">GLOBAL WORKFLOWS & AGENTS SUSPENDED</h3>
              <p className="text-xs text-slate-300">All regional agents, CI/CD deployments, and automated runbooks globally paused by Administrator.</p>
            </div>
          </div>
          <button onClick={() => setGlobalKillSwitchActive(false)} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
            Resume Global Operations
          </button>
        </div>
      )}

      {/* Stats Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Multi-Region Control Plane</span>
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">3 Regions Active</p>
          <span className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> AWS, GCP & Azure Active-Active
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Engineering Ops Score</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">94.2 / 100</p>
          <span className="text-emerald-400 text-xs mt-1 block">DORA Rank: ELITE</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Follow-The-Sun On-Call</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">EMEA Shift</p>
          <span className="text-slate-400 text-xs mt-1 block">Emma Weber (Frankfurt)</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Active-Active RTO / RPO</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">RTO: 42s | RPO: 0s</p>
          <span className="text-slate-400 text-xs mt-1 block">Mission-Critical Ready</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-800 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("topology")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "topology" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Worldwide Topology & Regions
        </button>
        <button
          onClick={() => setActiveTab("incidents")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "incidents" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Follow-The-Sun Incident Command
        </button>
        <button
          onClick={() => setActiveTab("dr")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "dr" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Active-Active DR & Failover
        </button>
        <button
          onClick={() => setActiveTab("dora")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "dora" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          DORA Intelligence Metrics
        </button>
        <button
          onClick={() => setActiveTab("finops")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "finops" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Global FinOps & Cost Allocation
        </button>
      </div>

      {/* TAB: TOPOLOGY */}
      {activeTab === "topology" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((r) => (
              <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-white text-base">{r.name}</h3>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded font-bold border border-emerald-500/20">
                    {r.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <p><span className="text-slate-500">Cloud Provider:</span> <strong>{r.cloud}</strong></p>
                  <p><span className="text-slate-500">Geo & Policy:</span> <strong>{r.geo}</strong></p>
                  <p><span className="text-slate-500">Avg Latency:</span> <strong>{r.latency}</strong></p>
                  <p><span className="text-slate-500">Availability:</span> <strong className="text-emerald-400">{r.avail}</strong></p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex-1">
                    Drain Traffic
                  </button>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex-1">
                    Manage Topology
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-2">Cross-Region Dependency Risk Matrix</h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-300 font-bold">
                <span>payment-service (reg_eu_west) → Aurora DB Master (reg_us_east)</span>
                <span className="text-amber-400">105.4ms Cross-Region Latency</span>
              </div>
              <p className="text-slate-400">Recommendation: Migrate to Multi-Region Active-Active Aurora / GCP Spanner cluster to eliminate single-region DB bottleneck.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: INCIDENTS */}
      {activeTab === "incidents" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Follow-The-Sun Incident Command</h2>
              <p className="text-xs text-slate-400">Automatic time-zone-aware routing to active regional engineering teams.</p>
            </div>
            <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" /> ACTIVE SHIFT: EMEA (14:00 UTC)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-indigo-400">Active On-Call Assignment</h3>
              <div className="space-y-1 text-slate-300">
                <p><span className="text-slate-500">Service:</span> <strong>payment-service</strong></p>
                <p><span className="text-slate-500">Assigned Engineer:</span> <strong>Emma Weber (Principal SRE - Frankfurt)</strong></p>
                <p><span className="text-slate-500">Team:</span> <strong>Team-SRE-EMEA</strong></p>
                <p><span className="text-slate-500">Escalation Policy:</span> <strong>L1 Agent → L2 Regional On-Call → L3 Domain Lead</strong></p>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-indigo-400">Global Incident Deduplication & Correlation</h3>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Incident Master: INC-9941</span>
                  <span className="text-emerald-400">Deduplicated (2 Alerts Merged)</span>
                </div>
                <p className="text-slate-400">Correlated DB Lock Spike (reg_us_east) with Payment Latency Spike (reg_eu_west).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DR */}
      {activeTab === "dr" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Active-Active Disaster Recovery Console</h2>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              FAILOVER READY (RTO: 42s | RPO: 0s)
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-purple-400 font-bold uppercase tracking-wider block">System Classification: MISSION_CRITICAL</span>
                <h3 className="text-base font-bold text-white">payment-platform (Multi-Region Active-Active)</h3>
              </div>
              <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg transition-all">
                Simulate Regional Failover
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
              <div><span className="text-slate-500 block">Primary Region</span><strong>reg_us_east (AWS)</strong></div>
              <div><span className="text-slate-500 block">DR Standby Region</span><strong>reg_eu_west (GCP)</strong></div>
              <div><span className="text-slate-500 block">RTO Target / Achieved</span><strong>&lt; 5m / 42s</strong></div>
              <div><span className="text-slate-500 block">RPO Target / Achieved</span><strong className="text-emerald-400">0s (Zero Data Loss)</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DORA */}
      {activeTab === "dora" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Enterprise DORA Delivery Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-indigo-400">DORA Metric Breakdown</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span>Deployment Frequency</span>
                  <strong className="text-emerald-400">18.4 / day (ELITE)</strong>
                </div>
                <div className="flex justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span>Lead Time for Changes</span>
                  <strong className="text-emerald-400">1.2 hours (ELITE)</strong>
                </div>
                <div className="flex justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span>Change Failure Rate</span>
                  <strong className="text-indigo-400">1.8% (HIGH PERFORMANCE)</strong>
                </div>
                <div className="flex justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span>Mean Time to Recovery (MTTR)</span>
                  <strong className="text-emerald-400">14.5 mins (ELITE)</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-indigo-400">Platform Self-Healing & Self-Monitoring</h3>
              <div className="bg-slate-900 p-3 rounded-lg border border-emerald-500/30 space-y-2">
                <span className="text-emerald-400 font-bold block">CodeAtlas Self-Health: 100% HEALTHY</span>
                <p className="text-slate-300">Self-Diagnostics: 0 anomalies detected across control plane and data planes.</p>
                <span className="text-slate-400 block">Automated Action: Re-balanced regional agent worker queues.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
