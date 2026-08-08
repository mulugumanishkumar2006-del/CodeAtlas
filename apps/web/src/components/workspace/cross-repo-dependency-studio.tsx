'use client';

import React, { useState } from 'react';
import {
  Network,
  ArrowRight,
  ShieldCheck,
  Zap,
  Server,
  Database,
  Radio,
  HardDrive,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DependencyRelationship {
  id: string;
  sourceRepo: string;
  sourceSymbol: string;
  targetRepo: string;
  targetSymbol: string;
  type: 'HTTP_API' | 'GRPC' | 'SHARED_LIB' | 'KAFKA_TOPIC' | 'DATABASE' | 'PACKAGE';
  direction: 'OUTBOUND' | 'INBOUND';
  version: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  changeRisk: number;
  consumersCount: number;
  providersCount: number;
}

const INITIAL_DEPENDENCIES: DependencyRelationship[] = [
  {
    id: 'dep-1',
    sourceRepo: 'payment-processing-core',
    sourceSymbol: 'PaymentProcessor.validateBearerToken()',
    targetRepo: 'auth-gateway-service',
    targetSymbol: 'POST /api/v1/auth/introspect',
    type: 'HTTP_API',
    direction: 'OUTBOUND',
    version: 'v2.1.0',
    criticality: 'CRITICAL',
    confidence: 0.98,
    changeRisk: 0.85,
    consumersCount: 11,
    providersCount: 1,
  },
  {
    id: 'dep-2',
    sourceRepo: 'billing-invoice-engine',
    sourceSymbol: 'InvoiceGenerator.chargeCustomer()',
    targetRepo: 'payment-processing-core',
    targetSymbol: 'gRPC ExecuteIdempotentCharge()',
    type: 'GRPC',
    direction: 'OUTBOUND',
    version: 'v1.4.0',
    criticality: 'CRITICAL',
    confidence: 0.95,
    changeRisk: 0.78,
    consumersCount: 4,
    providersCount: 1,
  },
  {
    id: 'dep-3',
    sourceRepo: 'payment-processing-core',
    sourceSymbol: 'SecVaultProvider.verifyRS256()',
    targetRepo: 'enterprise-common-utils',
    targetSymbol: '@acme/sec-vault package',
    type: 'SHARED_LIB',
    direction: 'OUTBOUND',
    version: 'v1.2.0 (Outdated)',
    criticality: 'HIGH',
    confidence: 0.99,
    changeRisk: 0.92,
    consumersCount: 4,
    providersCount: 1,
  },
  {
    id: 'dep-4',
    sourceRepo: 'payment-processing-core',
    sourceSymbol: 'LedgerRepository.persistTx()',
    targetRepo: 'core-postgres-db',
    targetSymbol: 'TABLE public.ledger_entries',
    type: 'DATABASE',
    direction: 'OUTBOUND',
    version: 'PostgreSQL 16',
    criticality: 'CRITICAL',
    confidence: 0.99,
    changeRisk: 0.95,
    consumersCount: 6,
    providersCount: 1,
  },
  {
    id: 'dep-5',
    sourceRepo: 'payment-processing-core',
    sourceSymbol: 'EventPublisher.publishPaymentSuccess()',
    targetRepo: 'event-kafka-bus',
    targetSymbol: 'TOPIC payment.events.v1',
    type: 'KAFKA_TOPIC',
    direction: 'OUTBOUND',
    version: 'Kafka 3.6',
    criticality: 'MEDIUM',
    confidence: 0.92,
    changeRisk: 0.35,
    consumersCount: 9,
    providersCount: 1,
  },
];

export function CrossRepoDependencyStudio() {
  const [dependencies] = useState<DependencyRelationship[]>(INITIAL_DEPENDENCIES);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDepId, setSelectedDepId] = useState<string>('dep-1');

  const filteredDeps = dependencies.filter((d) => {
    const matchesSearch =
      d.sourceRepo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.targetRepo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sourceSymbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  const selectedDep = dependencies.find((d) => d.id === selectedDepId) || dependencies[0];

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 shrink-0 font-mono text-xs">
        <div>
          <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>CROSS-REPOSITORY DEPENDENCY INTELLIGENCE</span>
          </h2>
          <p className="text-slate-400 font-sans text-xs">
            Inspect inter-repository API contracts, shared libraries, DB connections, and Kafka message flows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search symbol or repo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40 w-52"
            />
          </div>

          <div className="flex items-center gap-1">
            {['all', 'HTTP_API', 'GRPC', 'SHARED_LIB', 'DATABASE', 'KAFKA_TOPIC'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-xl capitalize transition-all ${
                  filterType === t
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio View: Table + Inspector Split Panel */}
      <div className="flex-1 flex gap-6 pt-6 overflow-hidden">
        {/* Dependencies High-Density Table */}
        <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-y-auto scrollbar-none">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] sticky top-0 z-10 backdrop-blur-xl">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Source Repository</th>
                <th className="p-3">Target Repository</th>
                <th className="p-3">Spec Version</th>
                <th className="p-3">Criticality</th>
                <th className="p-3">Risk Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDeps.map((dep) => {
                const isSelected = dep.id === selectedDepId;
                return (
                  <tr
                    key={dep.id}
                    onClick={() => setSelectedDepId(dep.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 text-white font-bold border-l-4 border-l-cyan-400'
                        : 'hover:bg-slate-900/90 text-slate-300'
                    }`}
                  >
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold text-[10px]">
                        {dep.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">{dep.sourceRepo}</span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[180px]">{dep.sourceSymbol}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="text-cyan-300 font-bold">{dep.targetRepo}</span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[180px]">{dep.targetSymbol}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-400">{dep.version}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          dep.criticality === 'CRITICAL'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {dep.criticality}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-400">{(dep.changeRisk * 100).toFixed(0)}% Risk</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Dependency Inspector Card */}
        <div className="w-80 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shrink-0 font-sans">
          <div className="space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Dependency Details</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                {selectedDep.type}
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Source Consumer</span>
                <span className="text-xs font-bold text-white block">{selectedDep.sourceRepo}</span>
                <span className="text-[10px] text-cyan-400 block truncate">{selectedDep.sourceSymbol}</span>
              </div>

              <div className="flex justify-center my-1">
                <ArrowRight className="w-4 h-4 text-cyan-400 rotate-90" />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Target Provider</span>
                <span className="text-xs font-bold text-indigo-300 block">{selectedDep.targetRepo}</span>
                <span className="text-[10px] text-cyan-400 block truncate">{selectedDep.targetSymbol}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Confidence</span>
                <span className="text-xs font-bold text-emerald-400">{(selectedDep.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Change Risk</span>
                <span className="text-xs font-bold text-amber-400">{(selectedDep.changeRisk * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Consumer Base</span>
              <span className="text-slate-300 block">Used by {selectedDep.consumersCount} services in workspace</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-mono text-xs"
          >
            <Zap className="w-3.5 h-3.5 mr-2 text-cyan-400" />
            Simulate Version Change
          </Button>
        </div>
      </div>
    </div>
  );
}
