'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  Building2,
  Layers,
  ShieldCheck,
  Zap,
  Flame,
  Brain,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { ExecutiveViewMode } from '@/components/ui/ai-cto-executive-header';

interface HomeDashboardProps {
  currentMode: ExecutiveViewMode;
}

export function AiCtoHomeDashboard({ currentMode }: HomeDashboardProps) {
  // Dynamically tailor summary emphasis by Executive View Mode
  const getExecutiveSummary = () => {
    switch (currentMode) {
      case 'DEVELOPER':
        return 'Today\'s Focus: Decouple REST router raw SQL in PaymentService/router.py:L142 and upgrade legacy Pydantic v1 config objects in analytics worker.';
      case 'TECH_LEAD':
        return 'Team Velocity: 48 commits across 14 active repos today. 1 REST router SQL coupling drift alert requiring refactoring review.';
      case 'ENGINEERING_MANAGER':
        return 'Productivity Index: 92.4% velocity rating. Technical debt drag estimated at $18.5k/yr with 3.2 days payoff effort for current sprint.';
      case 'PRINCIPAL_ENGINEER':
        return 'System Topology: Clean clean-architecture isolation in Auth Gateway. Payment Processing domain requires DAL repository abstraction layer.';
      case 'CTO':
      default:
        return 'Executive Overview: SOC2 Type II posture verified at 98.4%. System stability grade A+ with zero critical security vulnerabilities across 14 enterprise repositories.';
    }
  };

  const METRICS = [
    {
      id: 'risks',
      label: 'Critical Risks',
      value: '2 Critical',
      subtext: 'Payment REST SQL + Auth DB Lock',
      color: 'rose',
      icon: AlertTriangle,
      trend: '-1 from yesterday'
    },
    {
      id: 'repos',
      label: 'Repos Requiring Attention',
      value: '3 Repos',
      subtext: 'Payments, Auth, Analytics',
      color: 'amber',
      icon: Building2,
      trend: '14 total tracked'
    },
    {
      id: 'drift',
      label: 'Architecture Drift',
      value: '96.8%',
      subtext: '1 Circular ref flagged',
      color: 'cyan',
      icon: Layers,
      trend: 'Zero layer breach'
    },
    {
      id: 'security',
      label: 'Security Alerts',
      value: '0 Critical',
      subtext: 'SOC2 Type II Pass',
      color: 'purple',
      icon: ShieldCheck,
      trend: '100% Audit Pass'
    },
    {
      id: 'performance',
      label: 'Performance Regression',
      value: '1 Spike',
      subtext: 'DB lock during 50k QPS burst',
      color: 'blue',
      icon: Zap,
      trend: 'P99 11.4ms avg'
    },
    {
      id: 'techdebt',
      label: 'Technical Debt Growth',
      value: '$18.5k/yr',
      subtext: '3.2 days payoff effort',
      color: 'amber',
      icon: Flame,
      trend: '-$4.2k sprint payoff'
    },
    {
      id: 'velocity',
      label: 'Engineering Velocity',
      value: '48 Commits',
      subtext: '14 PRs auto-analyzed',
      color: 'indigo',
      icon: TrendingUp,
      trend: '+12% weekly boost'
    },
    {
      id: 'productivity',
      label: 'Developer Productivity',
      value: '92.4%',
      subtext: '1.2h PR review cycle',
      color: 'emerald',
      icon: Users,
      trend: 'Optimal flow state'
    },
    {
      id: 'health',
      label: 'Architecture Health',
      value: '94.2%',
      subtext: '142,500 AST symbols clean',
      color: 'emerald',
      icon: Activity,
      trend: 'Grade A+ System'
    },
    {
      id: 'confidence',
      label: 'AI Confidence',
      value: '98.4%',
      subtext: 'AST validated ground truth',
      color: 'teal',
      icon: Brain,
      trend: '+0.6% precision'
    }
  ];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Today's Engineering Executive Summary Card */}
      <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-950 to-cyan-950/40 shadow-2xl space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            Today's Proactive Engineering Summary ({currentMode.replace('_', ' ')})
          </span>
          <span className="text-[10px] text-slate-500 font-bold">UPDATED JUST NOW</span>
        </div>

        <p className="text-sm text-slate-200 font-sans font-medium leading-relaxed">
          {getExecutiveSummary()}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-800/80 text-slate-400">
          <span>Active Repos: <strong className="text-cyan-300">14 Indexed</strong></span>
          <span>•</span>
          <span>Open Investigations: <strong className="text-purple-300">10 Active</strong></span>
          <span>•</span>
          <span>SOC2 Posture: <strong className="text-emerald-400">98.4% Compliant</strong></span>
        </div>
      </div>

      {/* 10 Live Continuous Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 font-mono">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                  {m.label}
                </span>
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-xl font-black text-white">{m.value}</div>
                <div className="text-[10px] text-slate-400 font-sans truncate mt-0.5">{m.subtext}</div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-emerald-400 font-bold">
                <span>{m.trend}</span>
                <ArrowUpRight className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
