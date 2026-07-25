// apps/web/src/app/future/page.tsx
'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  Users,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export default function FutureIntelligencePage() {
  const [activeHorizon, setActiveHorizon] = useState<string>('6m');
  const [analyzing, setAnalyzing] = useState(false);

  const futureTimeline = [
    {
      horizon: '6m',
      title: '6 Months (Q1 2027)',
      status: 'IMMINENT_ACTION_REQUIRED',
      events: [
        'DB Connection Pool Exhaustion risk on legacy-payment-gateway (84.2% failure probability).',
        'PyYAML CVE vulnerability exploitation window opens.',
        'Cloud spending increases from $4,820/mo to $5,800/mo.',
      ],
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    },
    {
      horizon: '12m',
      title: '12 Months (Q3 2027)',
      status: 'PLANNED_REWRITE_RECOMMENDED',
      events: [
        'Maintainability index of legacy-payment-service drops below critical threshold (22.5 score).',
        'Checkout API hits 45K QPS scalability ceiling.',
        'Developer onboarding friction reaches peak (3.5 months to autonomy).',
      ],
      color: 'border-orange-500/50 bg-orange-500/10 text-orange-400',
    },
    {
      horizon: '18m',
      title: '18 Months (Q1 2028)',
      status: 'ARCHITECTURAL_TRANSFORMATION',
      events: [
        'Monolithic Postgres DB requires sharding or distributed database migration.',
        'Cloud spending reaches $10,500/mo without Spot instance optimization.',
      ],
      color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400',
    },
    {
      horizon: '24m',
      title: '24 Months (Q3 2028)',
      status: 'TARGET_FUTURE_STATE',
      events: [
        'Full 5-year technology stack review and legacy cache deprecation complete.',
        'Overall architecture viability reaches target 95.0% stability score.',
      ],
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    },
  ];

  const failureOrderPrediction = [
    { rank: 1, service: 'legacy-payment-gateway', probability: '84.2%', cause: 'DB Connection Pool Exhaustion', impact: '$140K / hr' },
    { rank: 2, service: 'redis-l2-cache-cluster', probability: '45.0%', cause: 'Memory Pressure Saturation (88%)', impact: '$45K / hr' },
    { rank: 3, service: 'analytics-ingestion-worker', probability: '28.5%', cause: 'Kafka Consumer Lag Backlog', impact: '$12K / hr' },
  ];

  const techDebtUnmaintainable = [
    { repo: 'legacy-payment-service', currentScore: 42.0, projected12m: 22.5, status: 'CRITICAL_REWRITE_NEEDED', timeline: 'Within 4 months' },
    { repo: 'analytics-batch-worker', currentScore: 58.4, projected12m: 41.0, status: 'MODERATE_DEBT', timeline: 'Within 10 months' },
  ];

  const growthCostTrajectory = [
    { period: 'Current', cost: '$4,820 / mo', drivers: 'EKS Worker Nodes + Provisioned RDS' },
    { period: '12 Months', cost: '$8,450 / mo', drivers: 'Auto-scaled Compute & Storage Expansion' },
    { period: '24 Months', cost: '$14,200 / mo', drivers: 'Multi-region Redundancy & Traffic Surges' },
  ];

  const repoFutureHorizons = [
    { period: '6 Months', forecast: '+12.4% LOC', warning: 'Auth Vault token validation throughput saturation at 15K QPS' },
    { period: '1 Year', forecast: '+28.5% LOC', warning: 'Legacy Payment Gateway DB pool exhaustion under 2x surge' },
    { period: '3 Years', forecast: '+84.0% LOC', warning: 'Monolithic relational DB schema write IOPS saturation requiring sharding' },
    { period: '5 Years', forecast: '+185.0% LOC', warning: 'Core monolith architecture exceeds maintainability SLA thresholds' },
  ];

  const techDebtSimulationTrajectory = [
    { label: 'Current', debt: 18, color: 'bg-emerald-500' },
    { label: '6 Months', debt: 31, color: 'bg-amber-500' },
    { label: '1 Year', debt: 52, color: 'bg-orange-500' },
    { label: '3 Years', debt: 74, color: 'bg-rose-500' },
    { label: '5 Years', debt: 88, color: 'bg-rose-700' },
  ];

  const teamGrowthPlannerData = {
    total: 18,
    roles: [
      { role: 'Software Engineers', count: 8, icon: 'Devs' },
      { role: 'SRE Engineers', count: 4, icon: 'SRE' },
      { role: 'QA Automation', count: 3, icon: 'QA' },
      { role: 'Platform Team', count: 3, icon: 'Platform' },
    ],
  };

  const perfPredictions = {
    latency: '42ms ➔ 480ms p95',
    dbStorage: '412 GB ➔ 1.45 TB (24m)',
    cachePressure: '88.1% ➔ 98.5% (Eviction Alert)',
    queueLag: '1,420 ➔ 18,400 msg backlog',
  };

  const failureChainSteps = [
    { step: 1, svc: 'Postgres Primary DB', impact: 'Connection Pool Saturation (100%)', time: '0s' },
    { step: 2, svc: 'legacy-payment-gateway', impact: 'Thread Exhaustion (1800ms p95)', time: '+4s' },
    { step: 3, svc: 'checkout-api', impact: 'HTTP 504 Timeout & Circuit Trip', time: '+12s' },
    { step: 4, svc: 'AWS ALB Ingress', impact: '14.2% HTTP 5xx Error Surge', time: '+25s' },
  ];

  const techObsolescenceItems = [
    { tech: 'Python 3.8 / FastAPI v0.68', status: 'EOL October 2026', action: 'Migrate to Python 3.12 + FastAPI 0.110+' },
    { tech: 'PyYAML v5.3.1', status: 'Critical CVE Vulnerability', action: 'Upgrade to PyYAML >= 6.0 immediately' },
  ];

  const refactoringDeadlines = [
    { module: 'legacy-payment-service', deadline: 'Q4 2026 (4 Months left)', urgency: 'CRITICAL', score: 42.0 },
    { module: 'analytics-batch-worker', deadline: 'Q2 2027 (10 Months left)', urgency: 'MEDIUM', score: 58.4 },
  ];

  const handleRunFutureAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 500);
  };



  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                Phase 22 • Engineering Prediction Engine (Future Intelligence)
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Predictive Software Engineering Command Center
              </h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm max-w-3xl">
            Proactively foresees architectural viability, failure orders, technical debt accumulation, rewrite timelines, team bottlenecks, and cost trajectories 2 years into the future.
          </p>
        </div>

        <button
          onClick={handleRunFutureAnalysis}
          disabled={analyzing}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
          Run 2-Year Predictive Simulation
        </button>
      </div>

      {/* 2-Year Future Engineering Timeline */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> Future Engineering Timeline Roadmap (2-Year Horizon)
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Click any time horizon to inspect projected system evolutions and preventative action plans.
            </p>
          </div>
          <div className="flex gap-2">
            {futureTimeline.map((item) => (
              <button
                key={item.horizon}
                onClick={() => setActiveHorizon(item.horizon)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeHorizon === item.horizon
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {futureTimeline.map((item) => (
            <div
              key={item.horizon}
              onClick={() => setActiveHorizon(item.horizon)}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                activeHorizon === item.horizon
                  ? `${item.color} shadow-lg ring-1 ring-indigo-500/50`
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-extrabold text-sm text-white">{item.title}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-3 ${item.color}`}>
                {item.status}
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {item.events.map((evt, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 text-sm leading-none">•</span>
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of 4 Prediction AI Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track 1: Incident AI — Failure Order Prediction */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> Incident AI: Predictive Failure Order
            </h2>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded">
              WHICH SERVICE WILL FAIL FIRST?
            </span>
          </div>

          <div className="space-y-3">
            {failureOrderPrediction.map((item) => (
              <div key={item.rank} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold text-xs flex items-center justify-center">
                      #{item.rank}
                    </span>
                    <span className="font-bold text-white text-sm">{item.service}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Cause: {item.cause}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {item.probability} Fail Risk
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">Impact: {item.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 2: Technical Debt AI — Unmaintainable Repos & Rewrite Advisor */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Technical Debt AI: Rewrite Advisor
            </h2>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
              WHEN TO REWRITE
            </span>
          </div>

          <div className="space-y-3">
            {techDebtUnmaintainable.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-white text-sm">{item.repo}</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {item.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>Current Score: <strong className="text-white">{item.currentScore}</strong></div>
                  <div>12m Projected Score: <strong className="text-rose-400">{item.projected12m}</strong></div>
                </div>
                <div className="text-xs text-emerald-400 font-bold border-t border-slate-800/80 pt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Rewrite Window: {item.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 3: Architecture Forecast AI */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Architecture Forecast AI (24-Month Viability)
            </h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
              72.4 / 100 VIABILITY
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Scalability & Coupling Projections</div>
              <p>Annual inter-service coupling growth rate: <strong className="text-amber-400">+18.4% / year</strong></p>
              <p>Modular decay index: <strong className="text-cyan-400">0.34 (MODERATE_DEGRADATION)</strong></p>
              <div className="border-t border-slate-800/80 pt-2 text-slate-400">
                Primary Recommendation: Decouple monolithic SQL query dependencies into asynchronous event queues before Q3 2027.
              </div>
            </div>
          </div>
        </div>

        {/* Track 4: Growth AI & Team Planner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Team Growth Planner (18 Headcount Needed)
            </h2>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
              HIRING TRAJECTORY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {teamGrowthPlannerData.roles.map((r, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-medium">{r.role}</span>
                <span className="font-extrabold text-indigo-400 text-sm">+{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item 6 & Item 11: Performance Prediction & Failure Chain Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Prediction */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Performance Projections (API, DB, Cache, Queue)
            </h2>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
              REALTIME METRICS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">API Latency p95</span>
              <span className="font-extrabold text-amber-400">{perfPredictions.latency}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Database Storage</span>
              <span className="font-extrabold text-cyan-400">{perfPredictions.dbStorage}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Cache Pressure</span>
              <span className="font-extrabold text-rose-400">{perfPredictions.cachePressure}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Queue Congestion</span>
              <span className="font-extrabold text-orange-400">{perfPredictions.queueLag}</span>
            </div>
          </div>
        </div>

        {/* Item 11: Failure Chain Simulator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Failure Chain Simulator (Cascading Outage)
            </h2>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded">
              CASCADING RISK
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {failureChainSteps.map((step) => (
              <div key={step.step} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                  <span className="font-bold text-white">{step.svc}</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  {step.impact} <strong className="text-amber-400">({step.time})</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Item 9 & 13: Tech Obsolescence & Refactoring Deadline Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item 9: Technology Obsolescence Detector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" /> Technology Obsolescence & EOL Detector
            </h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">
              SUPPORT SUNSET
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {techObsolescenceItems.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{item.tech}</span>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">{item.status}</span>
                </div>
                <div className="text-[11px] text-emerald-400">Recommended Action: {item.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Item 13: Refactoring Deadline Predictor */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Refactoring Deadline Predictor
            </h2>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
              OPTIMAL REFACTOR WINDOW
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {refactoringDeadlines.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">{item.module}</div>
                  <div className="text-[11px] text-slate-400">Current Maintainability: {item.score}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-rose-400 block">{item.deadline}</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded inline-block mt-0.5">
                    {item.urgency} URGENCY
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


