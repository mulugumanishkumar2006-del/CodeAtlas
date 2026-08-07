'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FlaskConical,
  Zap,
  FileText,
  ShieldCheck,
  Sparkles,
  Rocket,
  LineChart,
  Bot,
  Brain,
  Compass,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function OSActionDock() {
  const pathname = usePathname();

  const dockActions = [
    { label: 'Investigate', href: '/investigate', icon: FlaskConical, badge: 'Root Cause' },
    { label: 'Simulate', href: '/simulate', icon: Zap, badge: 'Monte Carlo' },
    { label: 'Document', href: '/docs', icon: FileText, badge: 'Living Docs' },
    { label: 'Code Review', href: '/review', icon: ShieldCheck, badge: 'OWASP' },
    { label: 'Refactor', href: '/improve', icon: Sparkles, badge: 'AST' },
    { label: 'Release Gate', href: '/release', icon: Rocket, badge: 'Canary' },
    { label: 'Forecast', href: '/forecast', icon: LineChart, badge: 'Predictive' },
    { label: 'Workflows', href: '/workflows', icon: Bot, badge: 'Swarm' },
    { label: 'Memory Hub', href: '/knowledge', icon: Brain, badge: 'Graph' },
    { label: 'AI Copilot', href: '/search', icon: Compass, badge: 'Copilot' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex items-center gap-1.5 font-mono select-none">
      <div className="flex items-center gap-1 border-r border-slate-800 pr-2 mr-1">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-black text-cyan-300 uppercase">CodeAtlas OS</span>
      </div>

      <div className="flex items-center gap-1">
        {dockActions.map((act) => {
          const Icon = act.icon;
          const isActive = pathname === act.href;

          return (
            <Link
              key={act.href}
              href={act.href}
              className={cn(
                'px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/10 text-cyan-200 border-cyan-500/40 font-bold shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              )}
              title={`${act.label} (${act.badge})`}
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden md:inline text-[11px]">{act.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
