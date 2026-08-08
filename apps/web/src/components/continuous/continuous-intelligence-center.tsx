"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Clock,
  Radio,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Play,
  Calendar,
  Layers,
  Sparkles,
  Activity,
  ShieldAlert,
  GitCommit,
} from "lucide-react";

export function ContinuousIntelligenceCenter({
  organizationId = "acme-corp",
  repositoryId = "demo-repo",
}: {
  organizationId?: string;
  repositoryId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [freshness, setFreshness] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [dailyBrief, setDailyBrief] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("Architect");
  const [replayMsg, setReplayMsg] = useState<string | null>(null);

  const handleFetchContinuousData = async () => {
    setLoading(true);
    setReplayMsg(null);
    try {
      const [fRes, tRes, dRes, nRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/continuous/freshness/${repositoryId}`),
        fetch(`http://localhost:8000/api/v1/continuous/timeline/${repositoryId}`),
        fetch(`http://localhost:8000/api/v1/continuous/daily-brief/${organizationId}`),
        fetch(`http://localhost:8000/api/v1/continuous/notifications/${selectedRole}`),
      ]);

      if (fRes.ok) setFreshness(await fRes.json());
      else setFreshness(getMockFreshness(repositoryId));

      if (tRes.ok) setTimeline(await tRes.json());
      else setTimeline(getMockTimeline(repositoryId));

      if (dRes.ok) setDailyBrief(await dRes.json());
      else setDailyBrief(getMockDailyBrief(organizationId));

      if (nRes.ok) setNotifications(await nRes.json());
      else setNotifications(getMockNotifications(selectedRole));
    } catch {
      setFreshness(getMockFreshness(repositoryId));
      setTimeline(getMockTimeline(repositoryId));
      setDailyBrief(getMockDailyBrief(organizationId));
      setNotifications(getMockNotifications(selectedRole));
    } finally {
      setLoading(false);
    }
  };

  const handleReplayEvents = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/continuous/event-replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: organizationId, repository_id: repositoryId, event_ids: ["evt_1", "evt_2"], dry_run: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setReplayMsg(data.summary);
      } else {
        setReplayMsg("Event replay simulation complete (0 mutations).");
      }
    } catch {
      setReplayMsg("Event replay simulation complete (0 mutations).");
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-600 rounded-lg shadow-lg">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              v1.6 Continuous Intelligence Center
            </h2>
            <p className="text-xs text-slate-400">
              CHANGE &rarr; DETECT &rarr; INCREMENTAL ANALYSIS &rarr; GRAPH SYNC &rarr; DEDUPLICATED ALERT &rarr; LEARN
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {freshness && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> {freshness.status}: {freshness.graph_freshness}
            </span>
          )}

          <button
            onClick={handleFetchContinuousData}
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Refresh Continuous Pipeline
          </button>
        </div>
      </div>

      {timeline ? (
        <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1 text-xs">
          {/* Daily Engineering Intelligence Brief Card */}
          {dailyBrief && (
            <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
              <h3 className="font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Daily Engineering Intelligence Brief ({dailyBrief.date})
              </h3>
              <p className="text-slate-200 font-mono text-[11px] font-bold">{dailyBrief.summary_headline}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-cyan-300 font-bold uppercase">Architecture & Risk Changes</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {dailyBrief.architecture_changes.map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold uppercase">Security & Risk Status</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {dailyBrief.risk_changes.map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold uppercase">Recommended Action</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {dailyBrief.recommended_investigations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Role-Based Intelligent Notification Digest */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4" /> Role-Targeted Deduplicated Notification Digest
              </h3>

              <div className="flex space-x-1.5 font-mono text-[11px]">
                {["Developer", "Architect", "Security Reviewer", "Executive"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1 rounded transition ${
                      selectedRole === role
                        ? "bg-cyan-600 text-white font-bold"
                        : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 font-mono">
              {notifications.map((n: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-300 text-xs">{n.title}</span>
                    <p className="text-slate-300 text-[11px] font-sans">{n.body}</p>
                    <span className="text-slate-400 text-[10px]">Evidence: {n.evidence}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                    {n.deduplicated_event_count} Events Deduplicated
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Continuous Engineering Event Timeline */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <GitCommit className="w-4 h-4" /> Continuous Engineering Event Timeline ({repositoryId})
              </h3>
              <button
                onClick={handleReplayEvents}
                className="px-3 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 rounded font-mono text-[11px] flex items-center gap-1.5 transition"
              >
                <Play className="w-3 h-3" /> Replay Event Stream
              </button>
            </div>

            {replayMsg && (
              <div className="p-3 bg-indigo-950/60 border border-indigo-800 rounded font-mono text-[11px] text-indigo-200">
                {replayMsg}
              </div>
            )}

            <div className="space-y-2 font-mono">
              {timeline.events.map((evt: any, i: number) => (
                <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">{evt.event_type} &bull; {evt.change_category}</span>
                    <span className="text-slate-400 text-[10px]">{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-200 text-[11px] font-sans">{evt.summary}</p>
                  <p className="text-slate-400 text-[10px]">Affected: {evt.affected_components.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Click "Refresh Continuous Pipeline" to view real-time event streams, data freshness badges, and deduplicated notification digests.
        </div>
      )}
    </div>
  );
}

function getMockFreshness(repoId: string) {
  return {
    repository_id: repoId,
    status: "FRESH",
    graph_freshness: "UP_TO_DATE (0s sync delay)",
    prediction_freshness: "UP_TO_DATE",
  };
}

function getMockTimeline(repoId: string) {
  return {
    timeline_id: `tl_${repoId}`,
    repository_id: repoId,
    events: [
      {
        event_type: "ARCHITECTURE_DRIFT",
        change_category: "ARCHITECTURAL",
        summary: "ADR-001 boundary violation resolved via interface abstraction",
        affected_components: ["auth_service.py", "gateway_router.py"],
        timestamp: "2026-08-08 10:39:00",
      },
    ],
  };
}

function getMockDailyBrief(orgId: string) {
  return {
    date: "2026-08-08",
    organization_id: orgId,
    summary_headline: "Continuous Intelligence: 5 meaningful events processed; Architecture risk decreased by 15.5 Pts.",
    architecture_changes: ["Decoupled auth_service interface contract across 3 dependent callers"],
    risk_changes: ["Single Point of Failure risk score dropped from 78.5 to 28.0"],
    recommended_investigations: ["Verify staging load concurrency behavior for OAuth2 provider"],
  };
}

function getMockNotifications(role: string) {
  return [
    {
      title: `Architecture Boundary Change in repo-auth (${role})`,
      body: "Commit 'Decouple OAuth2 interface' modified boundary contracts across 3 microservices.",
      evidence: "Multi-Repo WSKG Incremental Graph Sync",
      deduplicated_event_count: 5,
    },
  ];
}
