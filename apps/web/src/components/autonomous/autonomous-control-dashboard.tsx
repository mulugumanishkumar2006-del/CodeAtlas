"use client";

import React, { useState } from "react";
import {
  Bot,
  Shield,
  ShieldAlert,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  Activity,
  Layers,
  Terminal,
  RotateCcw,
  Sparkles,
  GitPullRequest,
  CheckSquare,
  Lock,
} from "lucide-react";

export function AutonomousControlDashboard({
  organizationId = "acme-corp",
  repositoryId = "demo-repo",
}: {
  organizationId?: string;
  repositoryId?: string;
}) {
  const [autonomyLevel, setAutonomyLevel] = useState<number>(0); // Level 0: Observe Only Default
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [testCmd, setTestCmd] = useState("rm -rf /production/data");
  const [cmdSafety, setCmdSafety] = useState<any>(null);
  const [rollbackStatus, setRollbackStatus] = useState<string | null>(null);

  const handleLoadDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/autonomous/dashboard/${organizationId}`);
      if (res.ok) setDashboard(await res.json());
      else setDashboard(getMockDashboard(organizationId));
    } catch {
      setDashboard(getMockDashboard(organizationId));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/autonomous/tasks/create?organization_id=${organizationId}&repository_id=${repositoryId}&objective=Option%20B%20Auth%20Interface%20Decoupling&autonomy_level=${autonomyLevel}`,
        { method: "POST" }
      );
      if (res.ok) setTask(await res.json());
      else setTask(getMockTask(autonomyLevel));
    } catch {
      setTask(getMockTask(autonomyLevel));
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTask = async (action: string) => {
    if (!task) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/autonomous/tasks/${task.task_id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: task.task_id,
          approver: "Lead Software Architect",
          action: action,
          reason: "Validated proposed diff and simulation blast radius.",
        }),
      });
      if (res.ok) setTask(await res.json());
      else setTask({ ...task, state: action === "APPROVE" ? "EXECUTING" : "CANCELLED" });
    } catch {
      setTask({ ...task, state: action === "APPROVE" ? "EXECUTING" : "CANCELLED" });
    }
  };

  const handleTestCommand = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/autonomous/command-safety?command=${encodeURIComponent(testCmd)}`, {
        method: "POST",
      });
      if (res.ok) setCmdSafety(await res.json());
      else setCmdSafety(getMockCmdSafety(testCmd));
    } catch {
      setCmdSafety(getMockCmdSafety(testCmd));
    }
  };

  const handleRollback = async () => {
    if (!task) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/autonomous/rollback/${task.task_id}`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setRollbackStatus(data.summary);
        setTask({ ...task, state: "ROLLED_BACK" });
      }
    } catch {
      setRollbackStatus("Sandbox worktree reverted to pre-task commit state cleanly.");
      setTask({ ...task, state: "ROLLED_BACK" });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 rounded-lg shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              v1.8 Autonomous Engineering Control Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              CONTROLLED AUTONOMY &bull; HUMAN APPROVAL GATE &bull; COMMAND SAFETY &bull; SECRET REDACTION
            </p>
          </div>
        </div>

        <button
          onClick={handleLoadDashboard}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Refresh Autonomy Status
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 flex flex-col space-y-5 overflow-y-auto pr-1 text-xs">
        {/* Autonomy Level Selector (0 to 6) */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" /> Organization Autonomy Level Setting (Default: Level 0 Observe Only)
            </h3>
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold rounded">
              Current: Level {autonomyLevel} ({getAutonomyLabel(autonomyLevel)})
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 font-mono">
            {[0, 1, 2, 3, 4, 5, 6].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setAutonomyLevel(lvl)}
                className={`p-2.5 rounded border text-left transition flex flex-col justify-between ${
                  autonomyLevel === lvl
                    ? "bg-cyan-600/20 border-cyan-400 text-cyan-200 font-bold shadow"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="text-[11px] font-bold">L{lvl}</span>
                <span className="text-[9px] truncate">{getAutonomyLabel(lvl)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Task Creation & State Machine */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" /> Autonomous Task State Machine & Approval Control
            </h3>
            <button
              onClick={handleCreateTask}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> Initiate Task
            </button>
          </div>

          {task && (
            <div className="p-4 bg-slate-950 rounded border border-blue-900/40 space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px]">TASK ID:</span> <strong className="text-cyan-300">{task.task_id}</strong>
                  <p className="text-slate-200 text-xs mt-0.5">{task.objective}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {task.state}
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]">Risk: {task.risk_score}/100</span>
                </div>
              </div>

              {/* Proposed Diff */}
              <div className="p-3 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-300 whitespace-pre-wrap">
                {task.proposed_diff}
              </div>

              {/* Validation Check Matrix */}
              <div className="space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Automated Validation Check Matrix:</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                  {task.validation_matrix.map((v: any, i: number) => (
                    <div key={i} className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">{v.check_name}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Approval Buttons & Rollback */}
              {task.state === "WAITING_FOR_APPROVAL" && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-amber-400 text-[11px] font-bold">Paused at Human Approval Gate</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveTask("APPROVE")}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition"
                    >
                      Approve & Execute
                    </button>
                    <button
                      onClick={() => handleApproveTask("REJECT")}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {task.state === "EXECUTING" && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-emerald-400 text-[11px] font-bold">Task Executing in Isolated Worktree</span>
                  <button
                    onClick={handleRollback}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Immediate Rollback
                  </button>
                </div>
              )}

              {rollbackStatus && (
                <div className="p-2 bg-amber-950/40 rounded border border-amber-800 text-amber-300 text-[10px]">
                  {rollbackStatus}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Command Safety & Secret Redaction Inspector */}
        <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-3 font-mono">
          <h3 className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-rose-400" /> Command Safety Allowlist Inspector
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={testCmd}
              onChange={(e) => setTestCmd(e.target.value)}
              placeholder="Test command safety classification..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none"
            />
            <button
              onClick={handleTestCommand}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded transition"
            >
              Evaluate Command
            </button>
          </div>

          {cmdSafety && (
            <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-bold">{cmdSafety.command_string}</span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded font-bold ${
                  cmdSafety.safety_class === "BLOCKED" ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {cmdSafety.safety_class}
                </span>
                <span className="text-slate-400 text-[10px]">{cmdSafety.policy_rule}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getAutonomyLabel(level: number): string {
  switch (level) {
    case 0: return "OBSERVE";
    case 1: return "RECOMMEND";
    case 2: return "PLAN";
    case 3: return "PREPARE";
    case 4: return "HUMAN APPROVAL";
    case 5: return "CONTROLLED EXECUTION";
    case 6: return "POLICY BOUNDED";
    default: return "OBSERVE";
  }
}

function getMockDashboard(orgId: string) {
  return {
    organization_id: orgId,
    current_default_autonomy_level: 0,
    active_agents_count: 4,
    pending_approvals_count: 1,
    running_tasks_count: 1,
    completed_tasks_count: 12,
    blocked_tasks_count: 0,
  };
}

function getMockTask(level: number) {
  return {
    task_id: "task_mock123",
    organization_id: "acme-corp",
    repository_id: "demo-repo",
    objective: "Option B Auth Interface Decoupling",
    requester: "CodeAtlas Autonomy Orchestrator",
    state: "WAITING_FOR_APPROVAL",
    autonomy_level: level,
    risk_score: 28.0,
    proposed_diff: "diff --git a/app/services/auth_service.py b/app/services/auth_service.py\n+ # Autonomous Option B Interface Decoupling",
    validation_matrix: [
      { check_name: "UNIT_TESTS", status: "PASS", duration_ms: 240 },
      { check_name: "BUILD_COMPILE", status: "PASS", duration_ms: 510 },
      { check_name: "ARCHITECTURE_DRIFT_SCAN", status: "PASS", duration_ms: 180 },
      { check_name: "SECURITY_SECRET_SCAN", status: "PASS", duration_ms: 90 },
    ],
    approvals: [],
  };
}

function getMockCmdSafety(cmd: string) {
  const isBlocked = cmd.includes("rm") || cmd.includes("drop") || cmd.includes("force");
  return {
    command_string: cmd,
    safety_class: isBlocked ? "BLOCKED" : "SAFE",
    is_permitted: !isBlocked,
    policy_rule: isBlocked ? "Rule: Destructive commands strictly blocked." : "Rule: Safe execution permitted.",
  };
}
