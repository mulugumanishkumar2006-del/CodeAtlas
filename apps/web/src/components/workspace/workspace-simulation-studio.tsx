'use client';

import React, { useState } from 'react';
import {
  FlaskConical,
  Zap,
  Play,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  Server,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceSimulationStudio() {
  const [simType, setSimType] = useState('SHARED_LIB_UPDATE');
  const [targetRepo, setTargetRepo] = useState('payment-processing-core');
  const [proposedVersion, setProposedVersion] = useState('2.0.0-rc1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto scrollbar-none space-y-6">
      <div className="pb-4 border-b border-slate-800/80 font-mono text-xs">
        <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-cyan-400" />
          <span>CROSS-REPOSITORY CHANGE SIMULATION STUDIO</span>
        </h2>
        <p className="text-slate-400 font-sans text-xs">
          Simulate API updates, shared library upgrades, service extractions, and DB migrations before writing code.
        </p>
      </div>

      {/* Form Controls */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono text-xs">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">Simulation Parameters</span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-slate-400">Simulation Type</label>
            <select
              value={simType}
              onChange={(e) => setSimType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="SHARED_LIB_UPDATE">Shared Library Update</option>
              <option value="API_BREAKING_CHANGE">API Version / Breaking Change</option>
              <option value="SERVICE_EXTRACTION">Microservice Extraction</option>
              <option value="DB_SCHEMA_MIGRATION">Database Schema Migration</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Target Repository</label>
            <select
              value={targetRepo}
              onChange={(e) => setTargetRepo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="payment-processing-core">payment-processing-core</option>
              <option value="auth-gateway-service">auth-gateway-service</option>
              <option value="billing-invoice-engine">billing-invoice-engine</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Proposed Version / Spec</label>
            <input
              type="text"
              value={proposedVersion}
              onChange={(e) => setProposedVersion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>
        </div>

        <Button
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold"
        >
          <Play className="w-4 h-4 mr-2" />
          {isSimulating ? 'Executing Graph Dry-Run Simulation...' : 'Execute Dry-Run Simulation'}
        </Button>
      </div>

      {/* Simulation Results Display */}
      {hasRun && (
        <div className="space-y-4 font-mono text-xs animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white">SIMULATION RUN SUCCESSFUL (#sim-run-8821)</span>
            </div>
            <span className="text-emerald-400 font-bold">Risk Score: 0.42 (LOW)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Affected Repositories</span>
              <span className="text-sm font-bold text-white block">3 Connected Repos</span>
              <span className="text-[10px] text-cyan-400">billing-repo, checkout-repo, auth-repo</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Performance Delta</span>
              <span className="text-sm font-bold text-emerald-400 block">+4.2ms latency optimization</span>
              <span className="text-[10px] text-slate-400">Redis cache hit efficiency</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Security Delta</span>
              <span className="text-sm font-bold text-cyan-400 block">Resolves CVE-2026-4491</span>
              <span className="text-[10px] text-slate-400">Upgrades RSA vault keygen</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
