'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Search,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  Zap,
  CheckCircle2,
  DollarSign,
  Clock,
  TrendingUp,
  HelpCircle,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AdvisorQueryResult {
  question: string;
  summary: string;
  evidence: string;
  architectureGraphNodes: { id: string; name: string; type: string; status: string }[];
  metrics: { label: string; val: string }[];
  repositoryContext: string;
  migrationPlan: string[];
  estimatedCost: string;
  businessImpact: string;
  confidence: string;
}

const PRESET_QUESTIONS: { question: string; answer: AdvisorQueryResult }[] = [
  {
    question: 'What should I work on today?',
    answer: {
      question: 'What should I work on today?',
      summary: 'Priority 1: Decouple direct raw REST router SQL queries in Payment Processing Service. Payoff effort is 2 hours and recovers $18.5k/yr in technical debt drag.',
      evidence: 'PaymentService/router.py:L142 direct raw SQL execution inside route handler bypasses repository DAL',
      architectureGraphNodes: [
        { id: '1', name: 'REST Router', type: 'api', status: 'drift' },
        { id: '2', name: 'Payments DAL', type: 'service', status: 'healthy' },
        { id: '3', name: 'PostgreSQL DB', type: 'db', status: 'warning' }
      ],
      metrics: [
        { label: 'Debt Payoff', val: '$18.5k/yr' },
        { label: 'Est. Effort', val: '2 Hours' },
        { label: 'Risk Score', val: 'Low Risk' }
      ],
      repositoryContext: 'codeatlas/payments-service (Python FastAPI / Monolithic Express)',
      migrationPlan: [
        '1. Create PaymentsRepository class in app/payments/dal.py',
        '2. Wrap raw SQL queries in parameterized methods with Redis L2 write-through cache',
        '3. Refactor router.py to invoke PaymentsRepository instance methods'
      ],
      estimatedCost: '2 Engineering Hours (~14 files modified)',
      businessImpact: 'Recovers $18.5k/yr debt drag and enables Redis L2 caching across checkout API handlers.',
      confidence: '98.4%'
    }
  },
  {
    question: 'Which repository is most risky?',
    answer: {
      question: 'Which repository is most risky?',
      summary: 'Payment Processing Service (FastAPI) carries the highest risk profile due to raw REST router SQL queries, DB lock contention under 50k QPS, and high architecture coupling.',
      evidence: 'High DB lock contention during load tests + 4 open investigations',
      architectureGraphNodes: [
        { id: '1', name: 'Payment API', type: 'api', status: 'drift' },
        { id: '2', name: 'User Store', type: 'db', status: 'warning' }
      ],
      metrics: [
        { label: 'Risk Rating', val: 'HIGH RISK' },
        { label: 'Health Score', val: '82.0 / 100' },
        { label: 'Open Investigations', val: '4 Active' }
      ],
      repositoryContext: 'codeatlas/payments-service',
      migrationPlan: [
        '1. Isolate database connections into a dedicated connection pool',
        '2. Deploy Redis L2 write-through caching layer',
        '3. Enforce clean layer boundaries between Payments and Identity domains'
      ],
      estimatedCost: '3-4 Days Engineering Effort',
      businessImpact: 'Prevents database connection pool exhaustion during peak traffic bursts.',
      confidence: '99.1%'
    }
  },
  {
    question: 'Which architecture needs improvement?',
    answer: {
      question: 'Which architecture needs improvement?',
      summary: 'Authentication Gateway & Payments service integration needs structural decoupling. Auth token verification database queries under load trigger +45ms ingress latency spikes.',
      evidence: 'services/auth/jwt_validator.go:L88 executes direct SQL token verification on every request',
      architectureGraphNodes: [
        { id: '1', name: 'Auth Gateway', type: 'api', status: 'warning' },
        { id: '2', name: 'Redis Cache Pool', type: 'cache', status: 'healthy' }
      ],
      metrics: [
        { label: 'P99 Latency', val: '42.0ms' },
        { label: 'Ingress Throughput', val: '50,000 QPS' },
        { label: 'Cache Hit Ratio', val: '78.2%' }
      ],
      repositoryContext: 'codeatlas/auth-gateway',
      migrationPlan: [
        '1. Deploy Redis L2 cluster for write-through token validation',
        '2. Increase cache TTL from 5 mins to 15 mins with pub/sub token invalidation',
        '3. Benchmark throughput under 50,000 QPS load test simulation'
      ],
      estimatedCost: '4 Hours Engineering Effort',
      businessImpact: 'Boosts ingress throughput by +350% and reduces P99 latency to sub-12ms.',
      confidence: '98.9%'
    }
  },
  {
    question: 'What is slowing the team?',
    answer: {
      question: 'What is slowing the team?',
      summary: 'Lack of automated ADR specs in Payments and deprecated Pydantic v1 configs in Analytics Pipeline cause manual code review friction and deprecation warning logs.',
      evidence: '0 godoc/docstring comments on exported PaymentService structs',
      architectureGraphNodes: [
        { id: '1', name: 'Analytics Worker', type: 'worker', status: 'warning' }
      ],
      metrics: [
        { label: 'PR Review Time', val: '3.4 Hours avg' },
        { label: 'Doc Coverage', val: '78.4%' },
        { label: 'Deprecation Warnings', val: '14 Active' }
      ],
      repositoryContext: 'codeatlas/analytics-pipeline',
      migrationPlan: [
        '1. Auto-generate docstrings using AI Knowledge Builder',
        '2. Upgrade pydantic v1 BaseSettings to pydantic-settings v2',
        '3. Enforce pre-commit AST linting rules'
      ],
      estimatedCost: '1.5 Hours Engineering Effort',
      businessImpact: 'Accelerates developer PR cycle time by 40% and eliminates all startup deprecation warnings.',
      confidence: '96.8%'
    }
  },
  {
    question: 'What technical debt has the highest ROI?',
    answer: {
      question: 'What technical debt has the highest ROI?',
      summary: 'Decoupling raw SQL inside Payments route handlers yields an estimated +18 Health Points and recovers $18.5k/yr in debt drag with only 2 days of refactoring effort.',
      evidence: 'Direct SQL execution inside HTTP route handlers in PaymentService',
      architectureGraphNodes: [
        { id: '1', name: 'Route Handlers', type: 'api', status: 'drift' },
        { id: '2', name: 'DAL Repository', type: 'service', status: 'healthy' }
      ],
      metrics: [
        { label: 'ROI Drag Payoff', val: '$18.5k / year' },
        { label: 'Health Boost', val: '+18 Points' },
        { label: 'Refactoring Effort', val: '2 Days' }
      ],
      repositoryContext: 'codeatlas/payments-service',
      migrationPlan: [
        '1. Extract raw SQL handlers into DAL repository methods',
        '2. Integrate Redis write-through cache',
        '3. Run AST boundary validation tests'
      ],
      estimatedCost: '2 Days (~14 files modified)',
      businessImpact: 'Highest ROI refactoring target in the monorepo cluster.',
      confidence: '99.5%'
    }
  }
];

export function AiCtoEngineeringAdvisor() {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(PRESET_QUESTIONS[0].question);
  const [customInput, setCustomInput] = useState<string>('');

  const currentResult =
    PRESET_QUESTIONS.find((q) => q.question === selectedQuestion)?.answer || PRESET_QUESTIONS[0].answer;

  const handleQuerySubmit = (qText: string) => {
    setSelectedQuestion(qText);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800/80 shadow-2xl space-y-5 font-sans select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              Interactive Engineering Advisor
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Ask strategic questions about architecture, technical debt ROI, scaling risks, and refactoring priorities.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          Principal AI Reasoning Engine
        </span>
      </div>

      {/* Preset Question Pills */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-slate-500 text-[10px] uppercase font-bold block">FREQUENT ADVISORY QUERIES:</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUESTIONS.map((item) => (
            <button
              key={item.question}
              onClick={() => handleQuerySubmit(item.question)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedQuestion === item.question
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              ⚡ {item.question}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (customInput.trim()) {
            handleQuerySubmit(customInput);
            setCustomInput('');
          }
        }}
        className="flex items-center gap-2 font-mono"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Ask AI CTO anything (e.g., How can we improve scalability?)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>
        <Button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono px-4 h-9 rounded-xl cursor-pointer"
        >
          Ask AI CTO
        </Button>
      </form>

      {/* AI Answer & Telemetry Response Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentResult.question}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/40 space-y-4 font-mono text-xs"
        >
          {/* Answer Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="font-extrabold text-cyan-300 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" /> AI CTO Advisory Analysis
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Confidence: {currentResult.confidence}
            </span>
          </div>

          {/* Answer Executive Summary */}
          <p className="text-sm font-sans font-medium text-slate-200 leading-relaxed">
            {currentResult.summary}
          </p>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {currentResult.metrics.map((m, i) => (
              <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/80">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">{m.label}</span>
                <span className="font-bold text-cyan-300 text-sm">{m.val}</span>
              </div>
            ))}
          </div>

          {/* Mini Architecture Topology Graph Snippet */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">AFFECTED ARCHITECTURE NODES:</span>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {currentResult.architectureGraphNodes.map((n) => (
                <div
                  key={n.id}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                    n.status === 'drift'
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                      : n.status === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span>{n.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Migration Plan */}
          <div className="space-y-1.5 font-sans">
            <span className="text-slate-400 font-mono text-[10px] font-bold uppercase block">RECOMMENDED MIGRATION PLAN:</span>
            <ul className="space-y-1 text-slate-300 text-xs pl-2">
              {currentResult.migrationPlan.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Impact & Cost Footer */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 block">Business Impact:</span>
              <span className="text-emerald-400 font-bold">{currentResult.businessImpact}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/simulate">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-bold bg-slate-900 border-slate-800 text-slate-200 hover:text-white rounded-xl gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-400" /> Simulate Fix
                </Button>
              </Link>
              <Link href="/improve">
                <Button size="sm" className="h-8 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-1 cursor-pointer shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Execute Refactoring
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
