'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  HeartPulse,
  Layers,
  ShieldCheck,
  Zap,
  Flame,
  Activity,
  Brain,
  Play,
  TrendingUp,
  Search,
  ArrowUpRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScorecardData {
  id: string;
  label: string;
  score: number;
  unit?: string;
  grade?: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  color: string;
  ringColor: string;
  icon: React.ElementType;
  aiSummary: string;
  investigateUrl: string;
  hoverInsight: {
    title: string;
    details: string[];
    recommendation: string;
  };
  sparklineData: number[];
}

const SCORECARDS: ScorecardData[] = [
  {
    id: 'health',
    label: 'Overall Engineering Health',
    score: 94.2,
    unit: '%',
    grade: 'A+',
    trend: '+2.4% over 24h',
    trendDirection: 'up',
    color: 'emerald',
    ringColor: '#10b981',
    icon: HeartPulse,
    aiSummary: '142,500 AST symbol nodes clean. Zero layer boundary violations in core runtime.',
    investigateUrl: '/analyze',
    sparklineData: [88, 89, 91, 90, 93, 94.2],
    hoverInsight: {
      title: 'System Health Breakdown',
      details: ['AST Coverage: 98.2%', 'Cyclomatic Complexity: 4.1 avg', 'Zero dead code branches'],
      recommendation: 'Maintain current linting and AST boundary validation rules.'
    }
  },
  {
    id: 'architecture',
    label: 'Architecture Stability',
    score: 96.8,
    unit: '%',
    grade: 'Zero Drift',
    trend: 'Enforced',
    trendDirection: 'up',
    color: 'cyan',
    ringColor: '#06b6d4',
    icon: Layers,
    aiSummary: '24 layer coupling rules strictly checked. Payment service circular dependency identified for refactoring.',
    investigateUrl: '/architecture',
    sparklineData: [92, 94, 93, 95, 96, 96.8],
    hoverInsight: {
      title: 'Architectural Layer Analysis',
      details: ['Domain Boundaries: 100% clean', 'Module Isolation: 94%', '1 Circular ref detected in PaymentService'],
      recommendation: 'Decouple REST router SQL queries using data repository layer.'
    }
  },
  {
    id: 'security',
    label: 'Security Confidence',
    score: 100,
    unit: '%',
    grade: 'SOC2 Verified',
    trend: '0 Critical CVEs',
    trendDirection: 'up',
    color: 'purple',
    ringColor: '#a855f7',
    icon: ShieldCheck,
    aiSummary: '100% dependency vulnerability scan pass. JWT token auth gateway operating with zero security flaws.',
    investigateUrl: '/security',
    sparklineData: [100, 100, 100, 100, 100, 100],
    hoverInsight: {
      title: 'Security Posture Audit',
      details: ['CVE Vulnerabilities: 0 Critical', 'SOC2 Type II: Compliant', 'Secrets Scan: Clean'],
      recommendation: 'Rotate API access tokens every 90 days as scheduled.'
    }
  },
  {
    id: 'performance',
    label: 'Performance Readiness',
    score: 91.5,
    unit: '%',
    grade: 'Sub-12ms',
    trend: '+350% Ingress QPS',
    trendDirection: 'up',
    color: 'blue',
    ringColor: '#3b82f6',
    icon: Zap,
    aiSummary: 'Redis L2 write-through cache deployment reduced P99 latency by 45ms under burst load.',
    investigateUrl: '/analytics',
    sparklineData: [82, 85, 87, 88, 90, 91.5],
    hoverInsight: {
      title: 'Latency & Throughput Metrics',
      details: ['P99 Latency: 11.4ms', 'Peak Throughput: 50,000 req/sec', 'DB Connection Saturation: 24%'],
      recommendation: 'Expand Redis cluster cache pools for auth gateway token checks.'
    }
  },
  {
    id: 'techdebt',
    label: 'Technical Debt Trend',
    score: 18.5,
    unit: 'k/yr',
    grade: '3.2 Days Effort',
    trend: '-$4.2k Payoff',
    trendDirection: 'down',
    color: 'amber',
    ringColor: '#f59e0b',
    icon: Flame,
    aiSummary: 'Mainly inline SQL queries in Payment processing and legacy Pydantic v1 configs in analytics worker.',
    investigateUrl: '/tech-debt',
    sparklineData: [28, 25, 24, 21, 20, 18.5],
    hoverInsight: {
      title: 'Technical Debt Payoff Breakdown',
      details: ['Direct SQL inside Handlers: $12k/yr drag', 'Deprecated Pydantic v1: $4.5k/yr', 'Unused Code: $2k/yr'],
      recommendation: 'Run 1-click AI Refactoring script on PaymentService/router.py.'
    }
  },
  {
    id: 'activity',
    label: 'Repository Activity',
    score: 48,
    unit: 'commits',
    grade: '14 Active Repos',
    trend: 'High Velocity',
    trendDirection: 'up',
    color: 'indigo',
    ringColor: '#6366f1',
    icon: Activity,
    aiSummary: '48 commits across 14 repositories today. 3 PRs auto-analyzed with zero regressions detected.',
    investigateUrl: '/repositories',
    sparklineData: [30, 35, 40, 42, 45, 48],
    hoverInsight: {
      title: 'Development Ingress & Velocity',
      details: ['Active Contributors: 12 engineers', 'Pull Requests Analyzed: 14 PRs', 'Build Pass Rate: 99.1%'],
      recommendation: 'All active PRs are verified by AI AST static analysis.'
    }
  },
  {
    id: 'aiconfidence',
    label: 'AI Confidence',
    score: 98.4,
    unit: '%',
    grade: 'High Precision',
    trend: '+0.6% Accuracy',
    trendDirection: 'up',
    color: 'teal',
    ringColor: '#14b8a6',
    icon: Brain,
    aiSummary: 'Autonomous reasoning model validated against AST ground truth with 98.4% precision rating.',
    investigateUrl: '/investigate',
    sparklineData: [95, 96, 97, 97.5, 98, 98.4],
    hoverInsight: {
      title: 'AI Reasoning Telemetry',
      details: ['CodeAtlas LLM Model: GPT-4o / Claude 3.5 Sonnet', 'AST Validation Score: 99.2%', 'Hallucination Rate: <0.1%'],
      recommendation: 'AI recommendation auto-patching safety threshold set to 95%.'
    }
  },
  {
    id: 'simulation',
    label: 'Simulation Readiness',
    score: 95.0,
    unit: '%',
    grade: 'Scenario Ready',
    trend: '100% Mock Topology',
    trendDirection: 'up',
    color: 'rose',
    ringColor: '#f43f5e',
    icon: Play,
    aiSummary: 'Ready to execute Kafka Microservices Split & Payment Pod Load Stress tests.',
    investigateUrl: '/simulate',
    sparklineData: [88, 90, 92, 93, 94, 95],
    hoverInsight: {
      title: 'Digital Twin Simulation Engine',
      details: ['Topology Digital Twin: Live Sync', 'Scenario Load Tests: Ready', 'Failure Blast Radius: Calculated'],
      recommendation: 'Run Microservice Split simulation on Analytics Telemetry Pipeline.'
    }
  }
];

export function EngineeringScorecards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="space-y-4 font-sans select-none">
      <div className="flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-white">Intelligent Engineering Scorecards</h2>
        </div>
        <span className="text-xs text-slate-400">8 Real-Time Operational Gauges</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SCORECARDS.map((card) => {
          const Icon = card.icon;
          const isHovered = hoveredCard === card.id;

          // SVG Progress Ring Calculations
          const radius = 28;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (card.score / 100) * circumference;

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-cyan-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Score & Animated SVG Ring */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className="text-3xl font-black text-white">{card.score}</span>
                      {card.unit && <span className="text-sm font-bold text-slate-400">{card.unit}</span>}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="font-bold text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> {card.trend}
                      </span>
                      {card.grade && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold">
                          {card.grade}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Animated SVG Circle Ring */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="#1e293b"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke={card.ringColor}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute font-mono text-[10px] font-bold text-slate-300">
                      {Math.round(card.score)}%
                    </span>
                  </div>
                </div>

                {/* AI Summary snippet */}
                <p className="mt-3 text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                  {card.aiSummary}
                </p>
              </div>

              {/* Action Link & Sparkline */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {/* Mini Sparkline Visualization */}
                <div className="flex items-end gap-1 h-5 w-20">
                  {card.sparklineData.map((val, idx) => {
                    const heightPercent = Math.max(20, (val / 100) * 100);
                    return (
                      <div
                        key={idx}
                        style={{ height: `${heightPercent}%`, backgroundColor: card.ringColor }}
                        className="w-2 rounded-t-sm opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    );
                  })}
                </div>

                <Link href={card.investigateUrl}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-[10px] font-mono font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 gap-1 rounded-xl"
                  >
                    Investigate <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                  </Button>
                </Link>
              </div>

              {/* Hover Insight Drawer / Modal Card */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 right-0 -bottom-2 translate-y-full z-30 p-4 bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl backdrop-blur-xl font-mono text-xs space-y-2 pointer-events-none"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-cyan-400" /> {card.hoverInsight.title}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">LIVE AI TELEMETRY</span>
                    </div>

                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {card.hoverInsight.details.map((d, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-sans">
                      <strong className="text-cyan-400 font-mono">Recommendation:</strong> {card.hoverInsight.recommendation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
