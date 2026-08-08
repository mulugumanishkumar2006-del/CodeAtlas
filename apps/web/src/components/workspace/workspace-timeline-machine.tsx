'use client';

import React, { useState } from 'react';
import {
  Clock,
  GitBranch,
  Layers,
  ShieldCheck,
  Rocket,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceTimelineMachine() {
  const [selectedMilestone, setSelectedMilestone] = useState('m1');

  const timelineEvents = [
    {
      id: 'm1',
      date: 'Today, 09:30 UTC',
      repo: 'payment-processing-core',
      type: 'COMMIT',
      title: 'Refactored Stripe API connector idempotency key locking',
      author: 'Sarah Chen',
      details: 'Added Redis distributed lock for duplicate charge prevention.',
    },
    {
      id: 'm2',
      date: 'Yesterday, 16:45 UTC',
      repo: 'auth-gateway-service',
      type: 'ARCHITECTURE_SHIFT',
      title: 'Extracted Redis Session Cache cluster from monolithic DB',
      author: 'Architecture Council',
      details: 'Decoupled auth session tokens into dedicated Redis 7 cluster.',
    },
    {
      id: 'm3',
      date: '3 Days Ago',
      repo: 'billing-invoice-engine',
      type: 'RELEASE',
      title: 'v2.4.0 Release - Automated VAT Tax Calculation',
      author: 'Release Automation Bot',
      details: 'Deployed EU/US tax engine updates across billing services.',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto scrollbar-none space-y-6">
      <div className="pb-4 border-b border-slate-800/80 font-mono text-xs">
        <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>MULTI-REPOSITORY TIME MACHINE & ARCHITECTURE EVOLUTION</span>
        </h2>
        <p className="text-slate-400 font-sans text-xs">
          Scrub through time to trace commits, architectural shifts, releases, and security events across all connected workspace repositories.
        </p>
      </div>

      {/* Scrub Time Slider Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-bold">Timeline Scrub Control</span>
          <span className="text-cyan-400 font-bold">August 2026</span>
        </div>
        <input type="range" min="1" max="100" defaultValue="100" className="w-full accent-cyan-400 cursor-pointer" />
      </div>

      {/* Events Stream */}
      <div className="space-y-4 font-mono text-xs">
        {timelineEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => setSelectedMilestone(evt.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              evt.id === selectedMilestone
                ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px]">
                  {evt.type}
                </span>
                <span className="text-sm font-bold text-white">{evt.title}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{evt.date}</span>
            </div>

            <p className="text-xs font-sans text-slate-300 mt-1">{evt.details}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              <span>Repo: <strong className="text-cyan-300">{evt.repo}</strong></span>
              <span>Author: <strong>{evt.author}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
