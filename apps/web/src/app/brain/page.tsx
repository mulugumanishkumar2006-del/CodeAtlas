// apps/web/src/app/brain/page.tsx
'use client';

import React, { useState } from 'react';
import {
  Brain,
  Search,
  BookOpen,
  GitBranch,
  GitCommit,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function EngineeringBrainPage() {
  const [queryInput, setQueryInput] = useState('Why did we choose Kafka instead of RabbitMQ?');
  const [selectedService, setSelectedService] = useState<'Authentication Service' | 'Payment Gateway'>('Authentication Service');
  const [activeQueryResult, setActiveQueryResult] = useState<{
    question: string;
    answer: string;
    sources: { type: string; title: string; date: string }[];
    confidence: number;
  } | null>({
    question: 'Why did we choose Kafka instead of RabbitMQ?',
    answer:
      'Kafka was chosen over RabbitMQ in ADR 004 (Nov 2025) because our event bus required strict log replayability for audit compliance and >100,000 QPS throughput during peak sales events, whereas RabbitMQ lacked native partition replay capabilities.',
    sources: [
      { type: 'ADR', title: 'ADR 004: Event Bus Architecture Selection', date: '2025-11-14' },
      { type: 'MEETING_NOTES', title: 'Architecture Guild Q4 Review', date: '2025-11-12' },
    ],
    confidence: 98.2,
  });

  const serviceBiographies: Record<string, { title: string; tagline: string; stages: { stage: number; title: string; detail: string; badge: string }[] }> = {
    'Authentication Service': {
      title: 'Authentication Service',
      tagline: 'The Identity & Security Guardian of CodeAtlas',
      stages: [
        { stage: 1, title: 'Created (Aug 2025)', detail: 'Monolithic auth module inside FastAPI baseline core.', badge: 'INCEPTION' },
        { stage: 2, title: 'Reason (Why it Exists)', detail: 'Centralized session verification & stateless JWT issuance.', badge: 'PURPOSE' },
        { stage: 3, title: 'First Deployment (Sept 2025)', detail: 'Deployed to AWS EKS cluster on single Postgres node.', badge: 'DEPLOY' },
        { stage: 4, title: 'Major Refactor (Jan 2026)', detail: 'PR #145 added Redis L2 cache, bypassing 14K DB queries/sec.', badge: 'REFACTOR' },
        { stage: 5, title: 'Incidents (Jan 2026)', detail: 'INC-741 Token Latency Spike (SEV-2) resolved in 12m.', badge: 'INCIDENT' },
        { stage: 6, title: 'Performance Changes', detail: 'p95 latency reduced from 140ms down to 18ms.', badge: 'PERFORMANCE' },
        { stage: 7, title: 'Security Updates (Feb 2026)', detail: 'Upgraded JWT signing keys to RS256 with automated rotation.', badge: 'SECURITY' },
        { stage: 8, title: 'Current Health', detail: '99.99% Uptime, 98.4/100 Health Score, 0 active CVE risks.', badge: 'HEALTH' },
        { stage: 9, title: 'Future Predictions', detail: 'Requires gRPC Token Vault decoupling within 12m for 45K QPS.', badge: 'FUTURE' },
      ],
    },
    'Payment Gateway': {
      title: 'Payment Gateway',
      tagline: 'Financial Transaction Processing Core',
      stages: [
        { stage: 1, title: 'Created (Sept 2025)', detail: 'Monolithic payment processor created for Stripe integration.', badge: 'INCEPTION' },
        { stage: 2, title: 'Reason (Why it Exists)', detail: 'Secure checkout transactions and multi-currency billing.', badge: 'PURPOSE' },
        { stage: 3, title: 'First Deployment (Oct 2025)', detail: 'Deployed on AWS EKS with single DB connection pool.', badge: 'DEPLOY' },
        { stage: 4, title: 'Major Refactor (Feb 2026)', detail: 'PR #182 split monolithic orders & payment schema.', badge: 'REFACTOR' },
        { stage: 5, title: 'Incidents (Feb 2026)', detail: 'INC-882 DB row lock lockout during 2.5x surge.', badge: 'INCIDENT' },
        { stage: 6, title: 'Performance Changes', detail: 'Throughput increased from 1,200 QPS to 8,500 QPS.', badge: 'PERFORMANCE' },
        { stage: 7, title: 'Security Updates (Mar 2026)', detail: 'PCI-DSS compliance audit passed with zero findings.', badge: 'SECURITY' },
        { stage: 8, title: 'Current Health', detail: '82.4/100 Saturation Score (Evolution Required).', badge: 'HEALTH' },
        { stage: 9, title: 'Future Predictions', detail: 'Must split into standalone microservice in Q3 2027.', badge: 'FUTURE' },
      ],
    },
  };


  const presetQuestions = [
    'Why did we choose Kafka instead of RabbitMQ?',
    'Why was Orders split into two services?',
    'Why did latency suddenly improve six months ago?',
  ];

  const handleAskQuestion = (qText: string) => {
    setQueryInput(qText);
    const qLower = qText.toLowerCase();

    if (qLower.includes('kafka') || qLower.includes('rabbitmq')) {
      setActiveQueryResult({
        question: qText,
        answer:
          'Kafka was chosen over RabbitMQ in ADR 004 (Nov 2025) because our event bus required strict log replayability for audit compliance and >100,000 QPS throughput during peak sales events, whereas RabbitMQ lacked native partition replay capabilities.',
        sources: [
          { type: 'ADR', title: 'ADR 004: Event Bus Architecture Selection', date: '2025-11-14' },
          { type: 'MEETING_NOTES', title: 'Architecture Guild Q4 Review', date: '2025-11-12' },
        ],
        confidence: 98.2,
      });
    } else if (qLower.includes('orders') || qLower.includes('split')) {
      setActiveQueryResult({
        question: qText,
        answer:
          'Orders was split into Orders-Router and Orders-Fulfillment in PR #182 (Feb 2026) to resolve database row lock contention on the primary Postgres cluster during peak order processing.',
        sources: [
          { type: 'PULL_REQUEST', title: 'PR #182: Microservice Extraction - Orders', date: '2026-02-10' },
          { type: 'INCIDENT', title: 'INC-882: Order DB Lock Timeout', date: '2026-02-04' },
        ],
        confidence: 96.5,
      });
    } else {
      setActiveQueryResult({
        question: qText,
        answer:
          'Latency suddenly improved by 65% in Jan 2026 due to PR #145 deploying a Redis L2 write-through cache for user permissions, bypassing 14,000 DB queries/sec.',
        sources: [
          { type: 'COMMIT', title: 'feat(cache): Redis L2 Permission Cache (a1b2c3d4)', date: '2026-01-18' },
          { type: 'METRICS', title: 'APM p95 Latency Reduction Benchmark', date: '2026-01-19' },
        ],
        confidence: 97.8,
      });
    }
  };

  const adrList = [
    {
      id: 'ADR-001',
      title: 'Adoption of FastAPI & Next.js Stack',
      status: 'ACCEPTED',
      date: '2025-08-01',
      rationale: 'High productivity, native async Python performance, and React Server Components.',
    },
    {
      id: 'ADR-004',
      title: 'Kafka Event Bus over RabbitMQ',
      status: 'ACCEPTED',
      date: '2025-11-14',
      rationale: 'Log replayability, 100K+ QPS throughput capability, and offset tracking.',
    },
    {
      id: 'ADR-009',
      title: 'Modular Monolith to Microservices Transition Strategy',
      status: 'ACCEPTED',
      date: '2026-03-02',
      rationale: 'Isolate high-frequency payment write IOPS into autonomous services.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/20">
                Phase 23 • Engineering Memory Graph
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                The Permanent Engineering Brain
              </h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-3xl">
            Preserves permanent institutional memory across commits, PRs, architecture decisions (ADRs), incidents, meeting notes, and metric milestones. Never lose context again.
          </p>
        </div>

      {/* WOW FEATURE: Interactive Engineering Brain - Biography of a Software System */}
      <div className="bg-gradient-to-br from-purple-950/90 via-slate-900 to-indigo-950/90 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-purple-500/20 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-extrabold text-[11px] border border-purple-500/30 uppercase tracking-widest">
                🌟 WOW Feature
              </span>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-400 animate-pulse" /> Biography of a Software System
              </h2>
            </div>
            <p className="text-slate-300 text-xs mt-1">
              Select any microservice to open its complete 9-stage lifecycle story across inception, rationale, refactors, incidents, health, and future predictions.
            </p>
          </div>

          {/* Service Selector */}
          <div className="flex gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            {(['Authentication Service', 'Payment Gateway'] as const).map((svc) => (
              <button
                key={svc}
                onClick={() => setSelectedService(svc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all border ${
                  selectedService === svc
                    ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/40 scale-105'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {svc}
              </button>
            ))}
          </div>
        </div>

        {/* 9-Stage Life Story Timeline */}
        <div className="bg-slate-950/90 rounded-xl border border-purple-500/30 p-6 space-y-4">
          <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white">{serviceBiographies[selectedService].title}</h3>
              <p className="text-purple-400 text-xs">{serviceBiographies[selectedService].tagline}</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              IMMUTABLE LIFE PROVENANCE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {serviceBiographies[selectedService].stages.map((stg) => (
              <div key={stg.stage} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5 hover:border-purple-500/40 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    STAGE {stg.stage} • {stg.badge}
                  </span>
                </div>
                <div className="font-extrabold text-white text-xs">{stg.title}</div>
                <p className="text-[11px] text-slate-300 leading-tight">{stg.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Interactive Q&A Search */}
      <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-extrabold text-purple-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400" /> Ask the Engineering Brain
          </label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(queryInput)}
                placeholder="Ask any historical decision or architecture question..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-100 text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => handleAskQuestion(queryInput)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <Sparkles className="w-4 h-4" /> Recall Memory
            </button>
          </div>
        </div>

        {/* Preset Sample Queries */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center font-bold">Sample Queries:</span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 px-3 py-1 rounded-lg text-xs transition-all font-medium"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Active Query Answer Card */}
        {activeQueryResult && (
          <div className="bg-slate-950/90 rounded-xl border border-purple-500/40 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" /> {activeQueryResult.question}
              </h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                {activeQueryResult.confidence}% CONFIDENCE
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
              {activeQueryResult.answer}
            </p>

            <div className="space-y-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Preserved Evidence Sources:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeQueryResult.sources.map((src, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-bold text-white text-[11px]">{src.title}</span>
                    <span className="text-[10px] text-slate-400">({src.date})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: ADRs & Memory Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ADR Explorer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> Architecture Decision Records (ADRs)
            </h2>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
              DECISION REPOSITORY
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {adrList.map((adr) => (
              <div key={adr.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-indigo-400 text-xs">{adr.id} • {adr.title}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {adr.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">{adr.rationale}</p>
                <div className="text-[10px] text-slate-500 text-right">Accepted: {adr.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Graph Entity Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" /> Indexed Memory Topology
            </h2>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded">
              5,840 EDGES
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <GitCommit className="w-4 h-4 text-emerald-400" /> Commits Indexed
              </div>
              <div className="text-xl font-extrabold text-white">840 Commits</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-indigo-400" /> Pull Requests
              </div>
              <div className="text-xl font-extrabold text-white">320 PRs</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" /> ADRs Preserved
              </div>
              <div className="text-xl font-extrabold text-white">45 ADRs</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-400" /> Incidents Linked
              </div>
              <div className="text-xl font-extrabold text-white">28 Incidents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: PR Intelligence & Incident Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PR Intelligence */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" /> Pull Request Intelligence
            </h2>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
              MERGED KNOWLEDGE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-indigo-400">PR #182 • Orders Monolith Split</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">HIGH IMPACT</span>
              </div>
              <p className="text-slate-300">Eliminated DB row lock contention on primary Postgres cluster.</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-indigo-400">PR #145 • Redis L2 Cache</span>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">MEDIUM IMPACT</span>
              </div>
              <p className="text-slate-300">Reduced DB query load by 14,000 req/sec, improving latency by 65%.</p>
            </div>
          </div>
        </div>

        {/* Incident Memory */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-400" /> Incident Memory & Lessons
            </h2>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded">
              POST-MORTEM BRAIN
            </span>
          </div>

      {/* Items 8, 10, 11: AI Engineering Historian & Onboarding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item 8: AI Engineering Historian */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> AI Engineering Historian
            </h2>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
              "WHY DOES AUTH LOOK LIKE THIS?"
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-extrabold text-white text-sm">Auth Subsystem Provenance</div>
            <p className="text-slate-300 leading-relaxed">
              Evolved from a monolithic session handler in 2025 into an autonomous gRPC Auth Token Vault in Q1 2026 following a 14,000 DB req/sec latency spike.
            </p>
            <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-2 text-[10px]">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">PR #145</span>
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">INC-741</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">ADR 002</span>
            </div>
          </div>
        </div>

        {/* Item 11: Developer Onboarding AI */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" /> Developer Onboarding AI Tutor
            </h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
              1.5 WEEKS TO AUTONOMY
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-extrabold text-white">Interactive History Curriculum</div>
            <p className="text-slate-300">Teaches new engineers project architecture, historical landmines, and design trade-offs in minutes using the graph.</p>
      {/* Items 13 & 19: AI Decision Comparator & Knowledge Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item 13: AI Decision Comparator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" /> AI Decision Comparator (ADR vs Reality)
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
              88% ALIGNMENT
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-extrabold text-white">ADR 004 vs Current Architecture</div>
            <p className="text-slate-300">Original Intent: Use Kafka for 100% of event streams across services.</p>
            <p className="text-amber-400">Current Reality: Kafka handles 92% of events; legacy RabbitMQ handles payment retry queue.</p>
            <div className="text-[11px] text-cyan-400 font-semibold border-t border-slate-800 pt-2">
              Recommendation: Migrate 8% payment retry queue off RabbitMQ to unify on Kafka.
            </div>
          </div>
        </div>

        {/* Item 19: Knowledge Heatmap */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-400" /> Documentation & Knowledge Heatmap
            </h2>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded">
              POORLY DOCUMENTED
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">legacy-payment-gateway/crypto_utils.py</div>
                <div className="text-[11px] text-rose-400">Documentation Coverage: 24% (Departed Contributor Risk)</div>
              </div>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">HIGH RISK</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-white">analytics-worker/batch_aggregator.py</div>
                <div className="text-[11px] text-amber-400">Documentation Coverage: 38.5%</div>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">MEDIUM RISK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



