'use client';

import React, { useState } from 'react';
import {
  Network,
  X,
  Layers,
  Server,
  Database,
  ShieldAlert,
  Zap,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContextualGraphDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityId?: string;
  entityType?: string;
  entityName?: string;
}

export function ContextualGraphDrawer({
  isOpen,
  onClose,
  entityId = 'payment-processing-core',
  entityType = 'REPOSITORY',
  entityName = 'payment-processing-core',
}: ContextualGraphDrawerProps) {
  const [activeTab, setActiveTab] = useState<'focus' | 'path' | 'impact' | 'ai'>('focus');
  const [pathTarget, setPathTarget] = useState('executeIdempotentCharge()');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm font-sans select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl h-full bg-slate-950 border-l border-slate-800 flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between font-mono text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white uppercase tracking-wider">GRAPH CONTEXTUAL NEIGHBORHOOD</span>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Entity Banner */}
        <div className="px-5 py-3 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between font-mono text-xs shrink-0">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Selected Context Entity</span>
            <span className="text-sm font-black text-white">{entityName}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-[10px]">
            {entityType}
          </span>
        </div>

        {/* Tab Sub-Header */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950 flex items-center gap-2 font-mono text-xs shrink-0">
          {[
            { id: 'focus', label: 'Focus Neighborhood' },
            { id: 'path', label: 'Path Finder' },
            { id: 'impact', label: 'Impact Graph' },
            { id: 'ai', label: 'Ask Graph AI' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1 rounded-xl transition-all font-bold ${
                activeTab === t.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Dynamic Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs scrollbar-none">
          {activeTab === 'focus' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Direct Graph Neighbors (1-Hop Traversal)</span>

              <div className="space-y-2">
                {[
                  { name: 'AuthGatewayService', type: 'SERVICE', edge: 'DEPENDS_ON (HTTP_API)', confidence: 'HIGH', evidence: 'auth_client.go:L42' },
                  { name: 'BillingInvoiceEngine', type: 'SERVICE', edge: 'CONSUMED_BY (gRPC)', confidence: 'HIGH', evidence: 'Protobuf gRPC stub' },
                  { name: 'Core Postgres Cluster', type: 'DATABASE', edge: 'CONNECTS_TO (DATABASE)', confidence: 'HIGH', evidence: 'GORM DB connection string' },
                  { name: 'Outdated @acme/sec-vault', type: 'SECURITY_FINDING', edge: 'AFFECTS (VULNERABILITY)', confidence: 'HIGH', evidence: 'Package.json audit' },
                ].map((n) => (
                  <div key={n.name} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{n.name}</span>
                      <span className="text-[10px] text-cyan-400 font-bold">{n.type}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Relationship: {n.edge}</span>
                    <span className="text-[10px] text-slate-500 block">Evidence: {n.evidence}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'path' && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">Shortest Path Finder</span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-500 text-[10px]">Path from '{entityName}' to:</span>
                <input
                  type="text"
                  value={pathTarget}
                  onChange={(e) => setPathTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { step: '1', entity: entityName, type: 'REPOSITORY' },
                  { step: '2', entity: 'PaymentProcessingEngine', type: 'SERVICE' },
                  { step: '3', entity: 'POST /api/v1/payments/charge', type: 'API' },
                  { step: '4', entity: 'StripeIdempotencyConnector', type: 'COMPONENT' },
                  { step: '5', entity: pathTarget, type: 'FUNCTION' },
                ].map((p, idx) => (
                  <React.Fragment key={p.step}>
                    {idx > 0 && <div className="flex justify-center"><ArrowRight className="w-3.5 h-3.5 text-cyan-400 rotate-90" /></div>}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-white">{p.entity}</span>
                      <span className="text-[10px] text-cyan-400">{p.type}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-3 font-mono">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Graph Blast Radius</span>
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <span className="font-bold block">Overall Risk: HIGH (Confidence: 96%)</span>
                <span className="text-xs text-slate-300 font-sans block mt-1">4 Microservices and 3 Repositories will be affected by changes to this entity.</span>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-3 font-mono">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Grounded Graph AI</span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed font-sans text-xs">
                The Organization Knowledge Graph identifies <strong>{entityName}</strong> as a central repository in the Payments Platform. It is connected to 11 microservices and has 1 high-risk security vulnerability edge.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 font-mono text-xs flex items-center justify-between shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="bg-slate-900 border-slate-800 text-slate-300">
            Close Context
          </Button>
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
            Explore Full Studio
          </Button>
        </div>
      </div>
    </div>
  );
}
