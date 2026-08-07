'use client';

import React from 'react';
import { SchemaImpactAnalysis, MigrationExecutionPlan } from './db-types';
import { Sparkles, Layers, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface DbImpactAnalysisProps {
  impact: SchemaImpactAnalysis;
  plan: MigrationExecutionPlan;
}

export function DbImpactAnalysis({ impact, plan }: DbImpactAnalysisProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">
            AI Schema Impact Analysis & Zero-Downtime Migration Runbook
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
          Zero Data Loss Strategy
        </span>
      </div>

      {/* Impact Telemetry Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
            Affected Microservices & DAL Components:
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px] font-sans">
            {impact.affectedServices.map((svc, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{svc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
            Affected Ingress API Endpoints:
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px] font-sans">
            {impact.affectedApiRoutes.map((route, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>{route}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Migration Runbook Sequence */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2 font-mono">
          <span className="font-bold text-slate-100 text-xs">{plan.title}</span>
          <span className="text-emerald-400 font-bold text-[10px]">{impact.downtimeStrategy}</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {plan.migrationRunbookSteps.map((step) => (
            <div key={step.step} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-[10px]">
                  {step.step}
                </span>
                <span className="font-bold text-slate-100 text-xs">{step.title}</span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] pl-7 leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
