'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Bot,
  User,
  Users,
  Briefcase,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ChevronDown,
  Building2,
  Lock,
  Clock,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ExecutiveViewMode = 
  | 'DEVELOPER'
  | 'TECH_LEAD'
  | 'ENGINEERING_MANAGER'
  | 'PRINCIPAL_ENGINEER'
  | 'CTO';

interface ExecutiveHeaderProps {
  currentMode: ExecutiveViewMode;
  onModeChange: (mode: ExecutiveViewMode) => void;
  activeRepo: string;
  systemHealth: number;
}

const VIEW_MODES: { id: ExecutiveViewMode; label: string; description: string; icon: React.ElementType; color: string }[] = [
  {
    id: 'DEVELOPER',
    label: 'Developer View',
    description: 'Code-level AST analysis, line diffs, functions & local dependencies',
    icon: User,
    color: 'cyan'
  },
  {
    id: 'TECH_LEAD',
    label: 'Tech Lead View',
    description: 'Module coupling, PR review velocity, sprint backlog & layer boundaries',
    icon: Users,
    color: 'indigo'
  },
  {
    id: 'ENGINEERING_MANAGER',
    label: 'Engineering Manager View',
    description: 'Team productivity, feature velocity, tech debt drag & delivery timelines',
    icon: Briefcase,
    color: 'purple'
  },
  {
    id: 'PRINCIPAL_ENGINEER',
    label: 'Principal Engineer View',
    description: 'System architecture, domain boundaries, refactoring paths & ADRs',
    icon: Compass,
    color: 'amber'
  },
  {
    id: 'CTO',
    label: 'CTO Executive View',
    description: 'Strategic risk, infrastructure cost, security posture & business value ROI',
    icon: Bot,
    color: 'emerald'
  }
];

export function AiCtoExecutiveHeader({
  currentMode,
  onModeChange,
  activeRepo,
  systemHealth
}: ExecutiveHeaderProps) {
  const activeModeObj = VIEW_MODES.find((m) => m.id === currentMode) || VIEW_MODES[4];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/70 border border-slate-800/80 p-6 shadow-2xl font-sans select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top Title & AI CTO Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 p-0.5 shadow-lg shadow-purple-950/60">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">AI CTO Workspace</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> PROACTIVE AUTONOMOUS GUIDANCE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Continuous organizational intelligence guiding developers, technical leads, and engineering executives.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> AI MEMORY SYNCED
            </span>
            <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-full">
              System Health: <strong className="text-emerald-400 font-mono">{systemHealth}%</strong>
            </span>
          </div>
        </div>

        {/* Executive View Switcher Bar */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Executive View Mode Abstraction Level
            </span>
            <span className="text-[10px] text-slate-500 font-sans">
              Currently displaying: <strong className="text-cyan-300">{activeModeObj.label}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {VIEW_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = currentMode === mode.id;

              return (
                <button
                  key={mode.id}
                  onClick={() => onModeChange(mode.id)}
                  className={`p-3 rounded-2xl border transition-all duration-200 text-left flex flex-col justify-between space-y-2 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-b from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-white shadow-lg'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 rounded-xl ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-950 text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  <div>
                    <div className="font-extrabold text-xs leading-snug">{mode.label}</div>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-1">
                      {mode.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
