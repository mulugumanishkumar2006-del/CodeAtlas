'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  Brain,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  ChevronDown,
  Building2,
  RefreshCw,
  Play,
  ArrowRight,
  Flame,
  UserCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  selectedRepo: string;
  onRepoChange: (repoId: string) => void;
  onRunAudit: () => void;
}

const GREETINGS = [
  { title: "Good Morning, Alex.", subtitle: "3 repositories require immediate attention.", badge: "3 ATTENTION REQUIRED", type: "warning" },
  { title: "AI Mission Control Active.", subtitle: "AI completed 14 autonomous investigations overnight.", badge: "14 INVESTIGATIONS DONE", type: "success" },
  { title: "Architecture Posture Optimal.", subtitle: "Overall system health improved by +2.4% over 24 hours.", badge: "+2.4% HEALTH BOOST", type: "info" },
  { title: "Zero Critical Vulnerabilities.", subtitle: "SOC2 Type II compliance audit passed at 98.4%.", badge: "SOC2 VERIFIED", type: "purple" }
];

const WORKSPACES = [
  { id: 'ws-enterprise', name: 'CodeAtlas Enterprise Cluster', tier: 'PRO', reposCount: 14 },
  { id: 'ws-fintech', name: 'Payments & Fintech Core', tier: 'ENTERPRISE', reposCount: 6 },
  { id: 'ws-ai-labs', name: 'AI & Telemetry Pipelines', tier: 'LABS', reposCount: 8 }
];

const REPOSITORIES = [
  { id: 'repo-codeatlas', name: 'CodeAtlas Core Suite', lang: 'TypeScript / Python', health: 94.2, status: 'Healthy' },
  { id: 'repo-payment', name: 'Payment Processing Service', lang: 'Python FastAPI', health: 82.0, status: 'Attention Needed' },
  { id: 'repo-auth', name: 'Auth Gateway & Identity', lang: 'Go / Node.js', health: 91.5, status: 'Optimal' },
  { id: 'repo-analytics', name: 'Analytics Telemetry Pipeline', lang: 'Python / Kafka', health: 89.0, status: 'Stable' }
];

export function AiMissionControlHero({ selectedRepo, onRepoChange, onRunAudit }: HeroProps) {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [repoMenuOpen, setRepoMenuOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(WORKSPACES[0]);

  // Cycle greetings every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentGreeting = GREETINGS[greetingIndex];
  const activeRepo = REPOSITORIES.find((r) => r.id === selectedRepo) || REPOSITORIES[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 border border-slate-800/80 p-6 md:p-8 shadow-2xl font-sans select-none">
      {/* Animated Ambient Motion Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar inside Hero */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
        {/* Developer Profile & Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-950/50">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-cyan-300 text-lg">
                AM
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center" title="AI Copilot Online">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">Alex Mercer</h3>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                DISTINGUISHED ARCHITECT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span>SOC2 Type II Verified</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <ShieldCheck className="w-3 h-3" /> Security Clear
              </span>
            </p>
          </div>
        </div>

        {/* Workspace & Repository Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Workspace Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setWorkspaceMenuOpen((p) => !p);
                setRepoMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-200 transition-all shadow-inner"
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>{selectedWorkspace.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">{selectedWorkspace.tier}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {workspaceMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 font-mono text-xs space-y-1">
                <span className="px-2 py-1 text-[10px] text-slate-500 font-bold block">SWITCH WORKSPACE</span>
                {WORKSPACES.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      setWorkspaceMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      selectedWorkspace.id === ws.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span>{ws.name}</span>
                    <span className="text-[10px] text-slate-500">{ws.reposCount} Repos</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Repository Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setRepoMenuOpen((p) => !p);
                setWorkspaceMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-500/60 text-xs font-mono text-cyan-300 transition-all shadow-inner"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{activeRepo.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {repoMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 font-mono text-xs space-y-1">
                <span className="px-2 py-1 text-[10px] text-slate-500 font-bold block">ACTIVE REPOSITORY TOPOLOGY</span>
                {REPOSITORIES.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => {
                      onRepoChange(repo.id);
                      setRepoMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      selectedRepo === repo.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-left">{repo.name}</div>
                      <div className="text-[10px] text-slate-500 text-left">{repo.lang}</div>
                    </div>
                    <span className="text-emerald-400 font-bold">{repo.health}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Dynamic Greeting & AI Status Hero Body */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-3">
          {/* Animated Greeting Banner */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-extrabold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
              {currentGreeting.badge}
            </span>
            <span className="text-xs font-mono text-slate-500">Autonomous Reasoning Engine v4.2</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={greetingIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-2"
            >
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
                {currentGreeting.title}
              </h1>
              <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-2xl font-sans">
                {currentGreeting.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Quick AI Action Triggers */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={onRunAudit}
              className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/60 font-mono gap-2 rounded-xl px-4 py-2.5 h-auto cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              Trigger Real-Time Audit
            </Button>

            <Button
              variant="outline"
              onClick={onRunAudit}
              className="bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold gap-2 rounded-xl px-4 py-2.5 h-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              Re-Index Knowledge Graph
            </Button>
          </div>
        </div>

        {/* Right Status Badge HUD */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800/80 space-y-4 bg-slate-900/60 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400 animate-bounce" /> AI AGENT STATUS
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              AUTONOMOUS
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">AST Indexing Agent:</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> Active (100%)
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Drift Detection:</span>
              <span className="text-emerald-400 font-bold">Enforcing (24 Rules)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Simulation Engine:</span>
              <span className="text-indigo-300 font-bold">Ready for Scenario</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Overall System Health:</span>
            <span className="text-base font-black text-white">94.2 <span className="text-xs text-emerald-400 font-bold">A+</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
