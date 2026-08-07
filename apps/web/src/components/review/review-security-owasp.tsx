'use client';

import React from 'react';
import { SecurityOwaspItem } from './review-types';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Lock, FileCode2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewSecurityOwaspProps {
  items: SecurityOwaspItem[];
}

export function ReviewSecurityOwasp({ items }: ReviewSecurityOwaspProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 font-mono">
            Automated OWASP Security & Multi-Tenancy Policy Audit
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          OWASP Top 10 Active
        </span>
      </div>

      <div className="space-y-3 font-sans">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-rose-500/10 text-rose-300 border border-rose-500/30">
                  {item.riskLevel}
                </span>
                <span className="text-xs font-bold text-slate-200 font-mono">{item.owaspId}: {item.title}</span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                Line: {item.evidenceLine}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Fix Recommendation
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{item.fixRecommendation}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  Verification Checklist
                </span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {item.verificationChecklist.map((v, vIdx) => (
                    <li key={vIdx} className="flex items-center gap-1.5 font-mono">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
