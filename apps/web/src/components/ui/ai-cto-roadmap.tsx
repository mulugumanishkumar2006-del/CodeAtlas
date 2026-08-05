'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  ShieldCheck,
  TrendingUp,
  Play,
  ArrowRight,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RoadmapWeekItem {
  id: string;
  weekNumber: number;
  title: string;
  repository: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  progressPercent: number;
  businessValue: string;
  riskReduction: string;
  estimatedHours: number;
  dependencies: string[];
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
}

const ROADMAP_WEEKS: RoadmapWeekItem[] = [
  {
    id: 'week-1',
    weekNumber: 1,
    title: 'Reduce Payment Service REST SQL Coupling',
    repository: 'codeatlas/payments-service',
    priority: 'CRITICAL',
    progressPercent: 65,
    businessValue: '$18.5k/yr Tech Debt Payoff',
    riskReduction: '-45% Ingress Fragility',
    estimatedHours: 16,
    dependencies: ['Auth Gateway Token API'],
    description: 'Extract raw inline SQL queries from HTTP router handlers into dedicated Payments Data Access Layer (DAL).',
    status: 'IN_PROGRESS'
  },
  {
    id: 'week-2',
    weekNumber: 2,
    title: 'Deploy Redis L2 Auth Cache & SOC2 Audit Pass',
    repository: 'codeatlas/auth-gateway',
    priority: 'HIGH',
    progressPercent: 30,
    businessValue: '+350% Ingress Throughput',
    riskReduction: 'Zero Critical CVEs',
    estimatedHours: 24,
    dependencies: ['Week 1 DAL Refactor'],
    description: 'Deploy Redis cluster write-through caching for JWT token verification to eliminate database lock contention.',
    status: 'SCHEDULED'
  },
  {
    id: 'week-3',
    weekNumber: 3,
    title: 'Split Kafka Stream Consumers into Microservices Pods',
    repository: 'codeatlas/analytics-pipeline',
    priority: 'HIGH',
    progressPercent: 0,
    businessValue: '34% Latency Reduction',
    riskReduction: '-60% Queue Bottleneck',
    estimatedHours: 32,
    dependencies: ['Week 2 Redis Cache'],
    description: 'Split monolithic analytics consumer into 3 decoupled Kubernetes worker pods.',
    status: 'SCHEDULED'
  },
  {
    id: 'week-4',
    weekNumber: 4,
    title: 'Increase Test & AST Symbol Coverage to 95%',
    repository: 'Monorepo Cluster',
    priority: 'MEDIUM',
    progressPercent: 0,
    businessValue: 'High Release Velocity',
    riskReduction: '-80% Regression Risk',
    estimatedHours: 20,
    dependencies: ['Week 3 Consumer Split'],
    description: 'Add automated unit tests and AST boundary enforcement rules across core microservice packages.',
    status: 'SCHEDULED'
  },
  {
    id: 'week-5',
    weekNumber: 5,
    title: 'Auto-Generate ADR Specs & API Documentation',
    repository: 'Monorepo Cluster',
    priority: 'MEDIUM',
    progressPercent: 0,
    businessValue: '40% Faster Onboarding',
    riskReduction: '-50% Knowledge Loss',
    estimatedHours: 12,
    dependencies: ['Week 4 AST Coverage'],
    description: 'Generate architectural decision records (ADR) and OpenAPI specifications for all 14 repositories.',
    status: 'SCHEDULED'
  },
  {
    id: 'week-6',
    weekNumber: 6,
    title: 'Optimize Database Connection Pools & Cache TTL',
    repository: 'codeatlas/payments-service',
    priority: 'LOW',
    progressPercent: 0,
    businessValue: 'Sub-10ms P99 Latency',
    riskReduction: 'Zero Connection Exhaustion',
    estimatedHours: 16,
    dependencies: ['Week 5 ADR Specs'],
    description: 'Fine-tune PostgreSQL connection pool sizes and Redis cluster eviction policies.',
    status: 'SCHEDULED'
  }
];

export function AiCtoRoadmap() {
  const [activeWeekId, setActiveWeekId] = useState<string>('week-1');

  const selectedWeek = ROADMAP_WEEKS.find((w) => w.id === activeWeekId) || ROADMAP_WEEKS[0];

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              AI Strategic Engineering Roadmap
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              6-week autonomous engineering plan prioritized by risk reduction, technical payoff, and business value.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          6 Weeks Planned
        </span>
      </div>

      {/* Week Timeline Scrubber Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-mono text-xs">
        {ROADMAP_WEEKS.map((item) => {
          const isActive = item.id === activeWeekId;
          return (
            <button
              key={item.id}
              onClick={() => setActiveWeekId(item.id)}
              className={`p-3 rounded-2xl border transition-all duration-200 text-left space-y-1 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/20 border-cyan-500/50 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold uppercase text-cyan-400">WEEK {item.weekNumber}</span>
                {item.status === 'IN_PROGRESS' && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
              <div className="font-bold text-xs truncate">{item.title}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Week Deep Dive Card */}
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px] uppercase">
                WEEK {selectedWeek.weekNumber} MILESTONE
              </span>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                  selectedWeek.priority === 'CRITICAL'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {selectedWeek.priority} PRIORITY
              </span>
            </div>

            <h3 className="text-lg font-black text-white">{selectedWeek.title}</h3>
            <p className="text-xs text-slate-400 font-sans">{selectedWeek.repository}</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-black text-emerald-400 block">{selectedWeek.businessValue}</span>
            <span className="text-[10px] text-slate-500">Estimated Effort: {selectedWeek.estimatedHours} Hours</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">{selectedWeek.description}</p>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Milestone Progress:</span>
            <span className="text-cyan-300 font-bold">{selectedWeek.progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              style={{ width: `${selectedWeek.progressPercent}%` }}
              className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Key Metrics & Dependencies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">RISK REDUCTION TARGET</span>
            <span className="font-bold text-emerald-400 text-sm">{selectedWeek.riskReduction}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">DEPENDENCIES</span>
            <div className="flex items-center gap-1.5 mt-1">
              {selectedWeek.dependencies.map((dep, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 text-[10px] border border-slate-800 font-bold">
                  {dep}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Link href="/simulate">
            <Button size="sm" variant="outline" className="h-8 text-xs font-bold bg-slate-900 border-slate-800 text-slate-200 hover:text-white rounded-xl gap-1 cursor-pointer">
              <Play className="w-3.5 h-3.5 text-indigo-400" /> Simulate Week Scenario
            </Button>
          </Link>
          <Link href="/improve">
            <Button size="sm" className="h-8 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-1 cursor-pointer shadow-md">
              <Sparkles className="w-3.5 h-3.5" /> Launch Refactoring Sprint
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
