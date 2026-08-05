'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Brain,
  GitCompare,
  Play,
  FileText,
  Layers,
  ShieldCheck,
  Bot,
  Zap,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  targetUrl: string;
  badge?: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'act-import',
    title: 'Import Repository',
    subtitle: 'Connect GitHub, GitLab, or local git tree',
    icon: Plus,
    color: 'cyan',
    targetUrl: '/repositories',
    badge: '1-CLICK'
  },
  {
    id: 'act-analysis',
    title: 'Run Analysis',
    subtitle: 'Trigger AST parsing & symbol graph build',
    icon: Search,
    color: 'indigo',
    targetUrl: '/analyze',
    badge: 'INSTANT'
  },
  {
    id: 'act-investigate',
    title: 'Investigate Issue',
    subtitle: 'Autonomous AI root-cause investigation',
    icon: Brain,
    color: 'purple',
    targetUrl: '/investigate',
    badge: 'AUTONOMOUS'
  },
  {
    id: 'act-compare',
    title: 'Compare Versions',
    subtitle: 'Diff architectural drift between releases',
    icon: GitCompare,
    color: 'blue',
    targetUrl: '/architecture',
    badge: 'DIFF'
  },
  {
    id: 'act-simulate',
    title: 'Start Simulation',
    subtitle: 'Run scenario load & microservice splits',
    icon: Play,
    color: 'rose',
    targetUrl: '/simulate',
    badge: 'DIGITAL TWIN'
  },
  {
    id: 'act-docs',
    title: 'Generate Documentation',
    subtitle: 'Auto-generate ADR & API specs from code',
    icon: FileText,
    color: 'emerald',
    targetUrl: '/knowledge',
    badge: 'AUTO-GEN'
  },
  {
    id: 'act-review',
    title: 'Review Architecture',
    subtitle: 'Enforce clean layer boundary rules',
    icon: Layers,
    color: 'amber',
    targetUrl: '/are',
    badge: 'ENFORCE'
  },
  {
    id: 'act-security',
    title: 'Run Security Scan',
    subtitle: 'Audit SOC2, dependencies & secret leaks',
    icon: ShieldCheck,
    color: 'teal',
    targetUrl: '/security',
    badge: 'SOC2 PASS'
  },
  {
    id: 'act-copilot',
    title: 'Open AI Copilot',
    subtitle: 'Context-aware interactive assistant',
    icon: Bot,
    color: 'purple',
    targetUrl: '/brain',
    badge: 'PERMANENT'
  }
];

export function QuickActionsGrid() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-4 font-sans select-none">
      <div className="flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-white">1-Click Quick Workflows</h2>
        </div>
        <span className="text-xs text-slate-400">9 Instant Operational Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.id} href={action.targetUrl}>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-200 group flex items-start justify-between gap-3 cursor-pointer">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                      {action.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-snug">{action.subtitle}</p>
                </div>

                {action.badge && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[9px] font-bold uppercase shrink-0">
                    {action.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
