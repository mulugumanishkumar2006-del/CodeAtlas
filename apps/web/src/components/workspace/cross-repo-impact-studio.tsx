'use client';

import React, { useState } from 'react';
import {
  Flame,
  Zap,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Server,
  GitBranch,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CrossRepoImpactStudio() {
  const [selectedChangeRepo, setSelectedChangeRepo] = useState('payment-processing-core');
  const [selectedApi, setSelectedApi] = useState('POST /api/v1/payments/charge');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateImpact = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 400);
  };

  const directDependencies = [
    { service: 'CheckoutService', repo: 'checkout-service', coupling: 'HTTP_API_CALL', risk: 'HIGH', confidence: '98%' },
    { service: 'BillingEngine', repo: 'billing-invoice-engine', coupling: 'gRPC_EXECUTE_CHARGE', risk: 'HIGH', confidence: '96%' },
  ];

  const indirectDependencies = [
    { service: 'MobileBackendBFF', repo: 'mobile-bff-repo', via: 'CheckoutService', risk: 'MEDIUM', confidence: '90%' },
    { service: 'ReportingPipeline', repo: 'reporting-analytics-repo', via: 'Kafka payment.success Topic', risk: 'LOW', confidence: '85%' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto scrollbar-none space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/80 font-mono text-xs">
        <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span>CROSS-REPOSITORY BLAST-RADIUS IMPACT CALCULATOR</span>
        </h2>
        <p className="text-slate-400 font-sans text-xs">
          Select a proposed code or API change to calculate potential cascading impact and affected microservices across your workspace graph.
        </p>
      </div>

      {/* Target Change Selection Box */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono text-xs">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">Target Change Selector</span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-slate-400">Target Repository</label>
            <select
              value={selectedChangeRepo}
              onChange={(e) => setSelectedChangeRepo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="payment-processing-core">payment-processing-core</option>
              <option value="auth-gateway-service">auth-gateway-service</option>
              <option value="billing-invoice-engine">billing-invoice-engine</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Target API / Symbol</label>
            <select
              value={selectedApi}
              onChange={(e) => setSelectedApi(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="POST /api/v1/payments/charge">POST /api/v1/payments/charge</option>
              <option value="gRPC ExecuteIdempotentCharge()">gRPC ExecuteIdempotentCharge()</option>
              <option value="POST /api/v1/auth/introspect">POST /api/v1/auth/introspect</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={calculateImpact}
              disabled={isCalculating}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold"
            >
              {isCalculating ? 'Calculating Graph Blast Radius...' : 'Recalculate Workspace Impact'}
            </Button>
          </div>
        </div>
      </div>

      {/* Impact Calculation Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-[10px] text-rose-300 uppercase block font-bold">Overall Risk Score</span>
          <span className="text-2xl font-black text-rose-400">HIGH (0.88)</span>
        </div>
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-[10px] text-cyan-300 uppercase block font-bold">Graph Confidence</span>
          <span className="text-2xl font-black text-cyan-400">96.4%</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] text-amber-300 uppercase block font-bold">Affected Microservices</span>
          <span className="text-2xl font-black text-amber-400">4 Services</span>
        </div>
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-[10px] text-indigo-300 uppercase block font-bold">Affected Repositories</span>
          <span className="text-2xl font-black text-indigo-400">3 Repos</span>
        </div>
      </div>

      {/* Direct vs Indirect Dependencies Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direct Dependencies */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Direct Affected Dependencies</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
              Immediate Consumers
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {directDependencies.map((dep) => (
              <div key={dep.service} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{dep.service}</span>
                  <span className="text-[10px] text-rose-400 font-bold">Risk: {dep.risk}</span>
                </div>
                <span className="text-[10px] text-cyan-400 block">Repo: {dep.repo}</span>
                <span className="text-[10px] text-slate-500 block">Coupling: {dep.coupling} • Confidence: {dep.confidence}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Indirect Dependencies */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Indirect Transitive Dependencies</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              Downstream Consumers
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {indirectDependencies.map((dep) => (
              <div key={dep.service} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{dep.service}</span>
                  <span className="text-[10px] text-amber-400 font-bold">Risk: {dep.risk}</span>
                </div>
                <span className="text-[10px] text-cyan-400 block">Repo: {dep.repo}</span>
                <span className="text-[10px] text-slate-500 block">Cascading via: {dep.via}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
