'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  HeartPulse,
  Flame,
  ShieldCheck,
  Zap,
  Layers,
  Brain,
  Play,
  Search,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  User,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RepositoryDigitalTwin {
  id: string;
  name: string;
  language: string;
  architectureType: string;
  healthScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  techDebtDrag: string;
  dependenciesCount: number;
  aiConfidence: string;
  performanceQps: string;
  latencyP99: string;
  securityStatus: string;
  openInvestigations: number;
  simulationStatus: string;
  owner: { name: string; avatar: string; role: string };
  lastAnalysisTime: string;
  aiSummary: string;
  topologyNodes: { id: string; name: string; type: 'api' | 'db' | 'cache' | 'worker'; status: 'healthy' | 'warning' | 'drift' }[];
}

const DIGITAL_TWINS: RepositoryDigitalTwin[] = [
  {
    id: 'repo-codeatlas',
    name: 'CodeAtlas Core Suite',
    language: 'TypeScript / Python',
    architectureType: 'Event-Driven Async Microservices',
    healthScore: 94.2,
    riskLevel: 'LOW',
    techDebtDrag: '$4.2k/yr',
    dependenciesCount: 42,
    aiConfidence: '99.2%',
    performanceQps: '12,500 QPS',
    latencyP99: '8.4ms',
    securityStatus: 'SOC2 Pass (0 CVEs)',
    openInvestigations: 2,
    simulationStatus: 'Async Scenario Ready',
    owner: { name: 'Alex Mercer', avatar: 'AM', role: 'Principal Architect' },
    lastAnalysisTime: '10 mins ago',
    aiSummary: 'Decoupled async event router with sub-10ms response time and zero critical vulnerabilities.',
    topologyNodes: [
      { id: 'node-1', name: 'GraphQL API', type: 'api', status: 'healthy' },
      { id: 'node-2', name: 'AST Router', type: 'worker', status: 'healthy' },
      { id: 'node-3', name: 'Neo4j Graph', type: 'db', status: 'healthy' }
    ]
  },
  {
    id: 'repo-payment',
    name: 'Payment Processing Service',
    language: 'Python FastAPI',
    architectureType: 'Monolithic Express + REST Router',
    healthScore: 82.0,
    riskLevel: 'HIGH',
    techDebtDrag: '$18.5k/yr',
    dependenciesCount: 28,
    aiConfidence: '95.8%',
    performanceQps: '8,200 QPS',
    latencyP99: '42.0ms',
    securityStatus: 'PCI-DSS Compliant',
    openInvestigations: 4,
    simulationStatus: 'Refactor Required',
    owner: { name: 'Sarah Chen', avatar: 'SC', role: 'Staff Backend Lead' },
    lastAnalysisTime: '1 hour ago',
    aiSummary: 'High database connection lock contention. Direct inline REST SQL queries require repository DAL refactoring.',
    topologyNodes: [
      { id: 'node-4', name: 'REST Handlers', type: 'api', status: 'drift' },
      { id: 'node-5', name: 'PostgreSQL DB', type: 'db', status: 'warning' }
    ]
  },
  {
    id: 'repo-auth',
    name: 'Auth Gateway & Identity',
    language: 'TypeScript / Go',
    architectureType: 'Modular Monolith + Redis Cluster',
    healthScore: 91.5,
    riskLevel: 'LOW',
    techDebtDrag: '$2.1k/yr',
    dependenciesCount: 19,
    aiConfidence: '98.9%',
    performanceQps: '50,000 QPS',
    latencyP99: '11.2ms',
    securityStatus: 'ISO27001 Verified',
    openInvestigations: 1,
    simulationStatus: 'Optimal',
    owner: { name: 'DevOps Agent', avatar: 'DA', role: 'Autonomous Agent' },
    lastAnalysisTime: '3 hours ago',
    aiSummary: 'Redis write-through caching integrated for JWT token validation. Low latency and stable state.',
    topologyNodes: [
      { id: 'node-6', name: 'Auth Gateway', type: 'api', status: 'healthy' },
      { id: 'node-7', name: 'Redis Cache', type: 'cache', status: 'healthy' }
    ]
  },
  {
    id: 'repo-analytics',
    name: 'Analytics Telemetry Pipeline',
    language: 'Python / Kafka',
    architectureType: 'Event Stream Worker Pool',
    healthScore: 89.0,
    riskLevel: 'MEDIUM',
    techDebtDrag: '$6.8k/yr',
    dependenciesCount: 34,
    aiConfidence: '96.5%',
    performanceQps: '35,000 QPS',
    latencyP99: '14.8ms',
    securityStatus: 'SOC2 Pass',
    openInvestigations: 3,
    simulationStatus: 'Microservice Split Scenario',
    owner: { name: 'Alex Mercer', avatar: 'AM', role: 'Principal Architect' },
    lastAnalysisTime: 'Yesterday',
    aiSummary: 'Worker pool processing 35k events/sec. Pydantic v1 deprecation warning detected in startup config.',
    topologyNodes: [
      { id: 'node-8', name: 'Kafka Ingress', type: 'worker', status: 'healthy' },
      { id: 'node-9', name: 'ClickHouse TS', type: 'db', status: 'healthy' }
    ]
  }
];

export function RepositoryDigitalTwins() {
  const [selectedTwin, setSelectedTwin] = useState<string | null>(null);

  return (
    <div className="space-y-4 font-sans select-none">
      {/* Section Title */}
      <div className="flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Building2 className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-white">Live Repository Digital Twins</h2>
        </div>
        <Link href="/repositories" className="text-xs font-bold text-cyan-400 hover:underline">
          View All Digital Twins &rarr;
        </Link>
      </div>

      {/* Grid of Living Repository Twins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {DIGITAL_TWINS.map((twin) => (
          <motion.div
            key={twin.id}
            whileHover={{ y: -4 }}
            className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 space-y-4 shadow-xl relative group overflow-hidden"
          >
            {/* Ambient Twin Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />

            {/* Header & Health Rating */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors">
                    {twin.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                    {twin.language}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans mt-0.5">{twin.architectureType}</p>
              </div>

              <div className="text-right font-mono">
                <div className="flex items-center gap-1 text-sm font-black text-emerald-400">
                  <HeartPulse className="w-4 h-4 text-emerald-400" />
                  {twin.healthScore}
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded block mt-0.5 ${
                    twin.riskLevel === 'HIGH'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {twin.riskLevel} RISK
                </span>
              </div>
            </div>

            {/* AI Summary Banner */}
            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
              {twin.aiSummary}
            </p>

            {/* Mini Architecture Topology Canvas / Visualizer Representation */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block flex items-center justify-between">
                <span>MINI ARCHITECTURE TOPOLOGY</span>
                <span className="text-cyan-400">{twin.topologyNodes.length} Active Nodes</span>
              </span>

              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {twin.topologyNodes.map((node) => (
                  <div
                    key={node.id}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 shrink-0 ${
                      node.status === 'drift'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : node.status === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>{node.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Tech Debt</span>
                <span className="font-bold text-amber-400">{twin.techDebtDrag}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">QPS / Latency</span>
                <span className="font-bold text-cyan-300">{twin.latencyP99}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">AI Confidence</span>
                <span className="font-bold text-teal-300">{twin.aiConfidence}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Investigations</span>
                <span className="font-bold text-purple-300">{twin.openInvestigations} Active</span>
              </div>
            </div>

            {/* Card Action Controls */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <Link href="/analyze" className="flex-1">
                <Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl gap-1 cursor-pointer">
                  <Search className="w-3.5 h-3.5 text-cyan-400" /> Analyze
                </Button>
              </Link>
              <Link href="/investigate" className="flex-1">
                <Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl gap-1 cursor-pointer">
                  <Brain className="w-3.5 h-3.5 text-purple-400" /> Investigate
                </Button>
              </Link>
              <Link href="/simulate" className="flex-1">
                <Button variant="outline" className="w-full h-8 text-[11px] font-bold bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl gap-1 cursor-pointer">
                  <Play className="w-3.5 h-3.5 text-indigo-400" /> Simulate
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
