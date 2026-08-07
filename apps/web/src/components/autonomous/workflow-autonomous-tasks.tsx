'use client';

import React, { useState } from 'react';
import { AutonomousTaskItem } from './workflow-types';
import { ShieldCheck, Lock, CheckCircle2, XCircle, ExternalLink, GitPullRequest, AlertTriangle, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowAutonomousTasksProps {
  tasks: AutonomousTaskItem[];
}

export function WorkflowAutonomousTasks({ tasks: initialTasks }: WorkflowAutonomousTasksProps) {
  const [tasks, setTasks] = useState<AutonomousTaskItem[]>(initialTasks);

  const handleApprove = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approvalState: 'APPROVED' } : t))
    );
  };

  const handleReject = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approvalState: 'REJECTED' } : t))
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Autonomous Tasks & Human-in-the-Loop Approval Gate
          </h3>
        </div>

        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>AI Never Pushes Directly to Production Without Human Signoff</span>
        </div>
      </div>

      <div className="space-y-3 font-sans">
        {tasks.map((task) => {
          const isAwaiting = task.approvalState === 'AWAITING';
          const isApproved = task.approvalState === 'APPROVED';
          const isRejected = task.approvalState === 'REJECTED';

          return (
            <div
              key={task.id}
              className={cn(
                'p-4 rounded-xl border transition-all space-y-3',
                isAwaiting
                  ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-950 border-slate-800/80'
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    {task.category}
                  </span>
                  <span className="font-bold text-slate-100">{task.title}</span>
                </div>

                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded text-[10px] font-black uppercase border',
                    isAwaiting && 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse',
                    isApproved && 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                    isRejected && 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  )}
                >
                  {task.approvalState}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{task.description}</p>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                <span className="text-[9px] font-bold uppercase text-slate-400 block">Affected Code Files:</span>
                <ul className="space-y-0.5 text-slate-300">
                  {task.filesAffected.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <code>{f}</code>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                {task.prLink ? (
                  <a
                    href={task.prLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span>View Generated PR #482</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400">Est. Effort: {task.estimatedEffortHours}h</span>
                )}

                {isAwaiting && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(task.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(task.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-extrabold shadow-md transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Approve Task Execution</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
