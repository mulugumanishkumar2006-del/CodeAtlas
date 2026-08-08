'use client';

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Users,
  Clock,
  FileText,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceAuditAccessPanel() {
  const members = [
    { name: 'Sarah Chen', role: 'Architect', email: 'sarah.chen@acme.corp', status: 'ACTIVE' },
    { name: 'Alex Rivera', role: 'Maintainer', email: 'alex.rivera@acme.corp', status: 'ACTIVE' },
    { name: 'Elena Rostova', role: 'Developer', email: 'elena.rostova@acme.corp', status: 'ACTIVE' },
    { name: 'SecOps Automated Bot', role: 'Administrator', email: 'secops-bot@acme.corp', status: 'ACTIVE' },
  ];

  const auditLogs = [
    {
      id: 'a1',
      action: 'REPOSITORY_CONNECTED',
      by: 'Sarah Chen (Architect)',
      date: 'Today, 10:15 UTC',
      details: "Connected 'https://github.com/acme-org/payment-processing-core' to FinTech Workspace.",
    },
    {
      id: 'a2',
      action: 'SIMULATION_CREATED',
      by: 'Alex Rivera (Maintainer)',
      date: 'Today, 09:00 UTC',
      details: "Ran API blast-radius simulation for proposed Payment Gateway v2 refactor.",
    },
    {
      id: 'a3',
      action: 'WORKSPACE_CONFIG_CHANGED',
      by: 'SecOps Automated Bot',
      date: 'Yesterday, 18:30 UTC',
      details: "Updated workspace security governance threshold from 85.0 to 88.0.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto scrollbar-none space-y-6">
      <div className="pb-4 border-b border-slate-800/80 font-mono text-xs">
        <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>MULTI-TENANT GOVERNANCE, RBAC & IMMUTABLE AUDIT LOG</span>
        </h2>
        <p className="text-slate-400 font-sans text-xs">
          Manage workspace permissions, multi-tenant organization isolation, and inspect security audit streams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workspace Members & RBAC Roles */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Workspace RBAC Members</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
              Isolated Tenant
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {members.map((m) => (
              <div key={m.email} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">{m.name}</span>
                  <span className="text-[10px] text-slate-500 block">{m.email}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold text-[10px]">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Immutable Workspace Audit Stream */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Audit Event Stream</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              SOC2 Compliant
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-[10px]">{log.action}</span>
                  <span className="text-[10px] text-slate-500">{log.date}</span>
                </div>
                <p className="text-slate-300 text-xs font-sans">{log.details}</p>
                <span className="text-[10px] text-slate-500 block">By: {log.by}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
