'use client';

import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  GitBranch,
  CheckCircle2,
  Database,
  Lock,
  Radio,
  HardDrive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CrossRepoRiskMatrix() {
  const risks = [
    {
      id: 'r1',
      category: 'Shared Vulnerable Package',
      title: 'Vulnerable RSA SecVault Library across 4 Repositories',
      severity: 'HIGH',
      description: 'Outdated @acme/sec-vault v1.2.0 is vulnerable to JWT forgery (CVE-2026-4491).',
      affected: ['auth-gateway-service', 'payment-processing-core', 'billing-invoice-engine', 'user-profile-repo'],
      fix: 'Run automated lockfile upgrade PR to update to @acme/sec-vault@2.1.0.',
    },
    {
      id: 'r2',
      category: 'API Contract Drift',
      title: 'Payment Gateway / Billing Engine API Schema Mismatch',
      severity: 'HIGH',
      description: 'Billing Engine expects v1 JSON schema, but Payment Core exposes v2 gRPC fields.',
      affected: ['billing-invoice-engine', 'payment-processing-core'],
      fix: 'Apply Proto contract compatibility adapter.',
    },
    {
      id: 'r3',
      category: 'Database Coupling',
      title: 'Direct Database Access from Analytics Pipeline',
      severity: 'MEDIUM',
      description: 'Analytics Pipeline directly queries PostgreSQL primary replica bypassing service layer.',
      affected: ['analytics-pipeline-repo', 'payment-processing-core'],
      fix: 'Migrate queries to Analytics GraphQL Ingress.',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto scrollbar-none space-y-6">
      <div className="pb-4 border-b border-slate-800/80 font-mono text-xs">
        <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>CROSS-REPOSITORY RISK RADAR & MATRIX</span>
        </h2>
        <p className="text-slate-400 font-sans text-xs">
          Detect and resolve architectural coupling, shared package vulnerabilities, and cross-repo API contract drift.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 font-mono text-xs">
        {risks.map((r) => (
          <div key={r.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold text-[10px]">
                  {r.category}
                </span>
                <h3 className="text-sm font-bold text-white">{r.title}</h3>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                {r.severity} SEVERITY
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans">{r.description}</p>

            <div className="flex items-center gap-2 flex-wrap text-[10px]">
              <span className="text-slate-500">Affected Repositories:</span>
              {r.affected.map((repo) => (
                <span key={repo} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                  {repo}
                </span>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-sans">
              💡 <b>Recommended Action:</b> {r.fix}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
