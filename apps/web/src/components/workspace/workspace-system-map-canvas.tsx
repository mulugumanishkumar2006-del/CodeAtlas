'use client';

import React, { useState, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Filter,
  Layers,
  Server,
  Database,
  Radio,
  Cpu,
  Bookmark,
  Share2,
  ExternalLink,
  Flame,
  ShieldCheck,
  Zap,
  ChevronRight,
  GitBranch,
  FileCode,
  HardDrive,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SystemNode {
  id: string;
  name: string;
  type: 'REPOSITORY' | 'SERVICE' | 'APPLICATION' | 'DATABASE' | 'API' | 'EXTERNAL_DEPENDENCY' | 'INFRASTRUCTURE' | 'MESSAGE_QUEUE' | 'CACHE';
  category: 'services' | 'databases' | 'apis' | 'libraries' | 'infra';
  health: number;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ready' | 'analyzing' | 'needs_attention' | 'paused';
  techStack: string[];
  owner: string;
  consumerCount: number;
  providerCount: number;
  x: number;
  y: number;
  aiDescription: string;
}

interface SystemEdge {
  id: string;
  source: string;
  target: string;
  type: 'HTTP_API' | 'GRPC' | 'SHARED_LIB' | 'KAFKA_TOPIC' | 'DATABASE' | 'MESSAGE_QUEUE';
  label: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

const INITIAL_NODES: SystemNode[] = [
  {
    id: 'node-auth-repo',
    name: 'AuthGatewayService',
    type: 'SERVICE',
    category: 'services',
    health: 94.5,
    criticality: 'CRITICAL',
    status: 'ready',
    techStack: ['TypeScript', 'NestJS', 'OAuth2'],
    owner: 'Security Core Team',
    consumerCount: 11,
    providerCount: 2,
    x: 120,
    y: 100,
    aiDescription: 'Central OAuth2 authentication gateway validating bearer JWT tokens with sub-12ms response latency.',
  },
  {
    id: 'node-payment-repo',
    name: 'PaymentProcessingEngine',
    type: 'SERVICE',
    category: 'services',
    health: 88.0,
    criticality: 'CRITICAL',
    status: 'ready',
    techStack: ['Go', 'gRPC', 'Stripe API'],
    owner: 'Payments Platform Team',
    consumerCount: 8,
    providerCount: 4,
    x: 420,
    y: 180,
    aiDescription: 'Core credit card charge executor with idempotency lock keys and Stripe vault integration.',
  },
  {
    id: 'node-billing-repo',
    name: 'BillingInvoiceEngine',
    type: 'SERVICE',
    category: 'services',
    health: 91.2,
    criticality: 'HIGH',
    status: 'analyzing',
    techStack: ['Python', 'FastAPI', 'PDFGen'],
    owner: 'Billing & Subscriptions',
    consumerCount: 4,
    providerCount: 3,
    x: 720,
    y: 100,
    aiDescription: 'Generates monthly enterprise invoices, tax reports, and syncs recurring subscription plans.',
  },
  {
    id: 'node-db-primary',
    name: 'Core Postgres Cluster',
    type: 'DATABASE',
    category: 'databases',
    health: 99.0,
    criticality: 'CRITICAL',
    status: 'ready',
    techStack: ['PostgreSQL 16', 'PgBouncer'],
    owner: 'Database Reliability Ops',
    consumerCount: 6,
    providerCount: 0,
    x: 420,
    y: 400,
    aiDescription: 'ACID-compliant primary database cluster handling ledger transactions and audit logs.',
  },
  {
    id: 'node-redis-cache',
    name: 'Session Lock Redis',
    type: 'CACHE',
    category: 'infra',
    health: 98.5,
    criticality: 'HIGH',
    status: 'ready',
    techStack: ['Redis 7 Cluster'],
    owner: 'Platform Infra Ops',
    consumerCount: 5,
    providerCount: 0,
    x: 120,
    y: 350,
    aiDescription: 'High-throughput in-memory cache for auth session tokens and rate-limiting counters.',
  },
  {
    id: 'node-kafka-bus',
    name: 'Event Stream Kafka',
    type: 'MESSAGE_QUEUE',
    category: 'infra',
    health: 96.0,
    criticality: 'HIGH',
    status: 'ready',
    techStack: ['Apache Kafka 3.6', 'Avro'],
    owner: 'Event Platform Team',
    consumerCount: 9,
    providerCount: 5,
    x: 720,
    y: 350,
    aiDescription: 'Distributed event bus streaming payment.success, invoice.issued, and audit log events.',
  },
  {
    id: 'node-shared-crypto',
    name: '@acme/sec-vault',
    type: 'EXTERNAL_DEPENDENCY',
    category: 'libraries',
    health: 82.0,
    criticality: 'HIGH',
    status: 'needs_attention',
    techStack: ['TypeScript', 'RSA-4096'],
    owner: 'SecOps Guild',
    consumerCount: 4,
    providerCount: 0,
    x: 270,
    y: 250,
    aiDescription: 'Shared security vault package. Outdated version v1.2.0 requires patch for CVE-2026-4491.',
  },
];

const INITIAL_EDGES: SystemEdge[] = [
  { id: 'e1', source: 'node-payment-repo', target: 'node-auth-repo', type: 'HTTP_API', label: 'Validate OAuth Token', criticality: 'HIGH' },
  { id: 'e2', source: 'node-billing-repo', target: 'node-payment-repo', type: 'GRPC', label: 'Execute Charge API', criticality: 'CRITICAL' },
  { id: 'e3', source: 'node-auth-repo', target: 'node-redis-cache', type: 'DATABASE', label: 'Store Bearer Session', criticality: 'HIGH' },
  { id: 'e4', source: 'node-payment-repo', target: 'node-db-primary', type: 'DATABASE', label: 'Ledger Tx Writes', criticality: 'CRITICAL' },
  { id: 'e5', source: 'node-payment-repo', target: 'node-kafka-bus', type: 'MESSAGE_QUEUE', label: 'Publish payment.success', criticality: 'MEDIUM' },
  { id: 'e6', source: 'node-payment-repo', target: 'node-shared-crypto', type: 'SHARED_LIB', label: 'Import SecVault RSA', criticality: 'HIGH' },
];

export function WorkspaceSystemMapCanvas() {
  const [nodes, setNodes] = useState<SystemNode[]>(INITIAL_NODES);
  const [edges] = useState<SystemEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-payment-repo');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [focusedTraceNodeId, setFocusedTraceNodeId] = useState<string | null>(null);
  const [bookmarkedNodes, setBookmarkedNodes] = useState<string[]>(['node-payment-repo']);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId]
  );

  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchesSearch = n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || n.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [nodes, searchQuery, filterCategory]);

  const toggleBookmark = (id: string) => {
    setBookmarkedNodes((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const getNodeIcon = (type: SystemNode['type']) => {
    switch (type) {
      case 'SERVICE':
        return Server;
      case 'DATABASE':
        return Database;
      case 'CACHE':
        return Cpu;
      case 'MESSAGE_QUEUE':
        return Radio;
      case 'EXTERNAL_DEPENDENCY':
        return HardDrive;
      default:
        return Layers;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden relative">
      {/* Ecosystem Map Controls Toolbar */}
      <div className="h-12 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 font-mono text-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>GLOBAL SOFTWARE ECOSYSTEM MAP</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Filter Categories */}
          <div className="flex items-center gap-1">
            {['all', 'services', 'databases', 'infra', 'libraries'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  filterCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Canvas Zoom Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Filter node or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800/80 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40 w-44 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800/80 rounded-xl p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] text-cyan-400 font-bold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas + Right Inspector Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Graph Canvas Grid Area */}
        <div className="flex-1 relative bg-slate-950 overflow-auto scrollbar-none flex items-center justify-center p-8">
          {/* Subtle Grid Background Overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
          >
            {/* SVG Relationship Edge Connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-700/60 stroke-2">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const srcNode = nodes.find((n) => n.id === edge.source);
                const tgtNode = nodes.find((n) => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const isHighlighted =
                  focusedTraceNodeId === edge.source || focusedTraceNodeId === edge.target || selectedNodeId === edge.source || selectedNodeId === edge.target;

                return (
                  <g key={edge.id}>
                    <line
                      x1={srcNode.x + 100}
                      y1={srcNode.y + 40}
                      x2={tgtNode.x + 100}
                      y2={tgtNode.y + 40}
                      className={`transition-all duration-300 ${
                        isHighlighted ? 'stroke-cyan-400 stroke-[3px] opacity-100' : 'stroke-slate-800 opacity-60'
                      }`}
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={(srcNode.x + tgtNode.x) / 2 + 100}
                      y={(srcNode.y + tgtNode.y) / 2 + 35}
                      fill={isHighlighted ? '#38bdf8' : '#64748b'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="bg-slate-950 px-1 rounded"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Virtualized Interactive Node Cards */}
            {filteredNodes.map((node) => {
              const NodeIcon = getNodeIcon(node.type);
              const isSelected = selectedNodeId === node.id;
              const isBookmarked = bookmarkedNodes.includes(node.id);

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    setFocusedTraceNodeId(node.id);
                  }}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className={`absolute w-56 p-3 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-200 shadow-xl group ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-cyan-500/20 ring-2 ring-cyan-500/30 scale-105 z-20'
                      : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 z-10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 group-hover:border-cyan-500/40">
                        <NodeIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-mono text-white truncate max-w-[110px]">
                        {node.name}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(node.id);
                      }}
                      className="p-1 text-slate-500 hover:text-amber-400"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {node.type}
                    </span>
                    <span
                      className={`font-bold ${
                        node.health >= 90
                          ? 'text-emerald-400'
                          : node.health >= 80
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {node.health}% Health
                    </span>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {node.techStack.map((tech) => (
                      <span key={tech} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Detail Inspector Drawer Sidebar */}
        <div className="w-80 border-l border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl p-4 flex flex-col justify-between shrink-0 font-sans z-20">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Node Intelligence</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                {selectedNode.criticality}
              </span>
            </div>

            {/* Selected Node Overview */}
            <div className="space-y-2">
              <h3 className="text-base font-black text-white font-mono">{selectedNode.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{selectedNode.aiDescription}</p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Health Score</span>
                <span className="text-sm font-bold text-emerald-400">{selectedNode.health}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Owner Team</span>
                <span className="text-xs font-bold text-slate-200 truncate block">{selectedNode.owner}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Consumers</span>
                <span className="text-xs font-bold text-cyan-400">{selectedNode.consumerCount} Services</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Providers</span>
                <span className="text-xs font-bold text-indigo-400">{selectedNode.providerCount} Services</span>
              </div>
            </div>

            {/* Dependency Flow Trace */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Active Direct Edges</span>
                <span className="text-[10px] text-cyan-400">Flow Trace</span>
              </h4>
              <div className="space-y-1.5 font-mono text-xs">
                {edges
                  .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map((e) => (
                    <div key={e.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] font-bold text-cyan-400">{e.type}</span>
                        <span className="truncate">{e.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-mono text-xs"
            >
              <Zap className="w-3.5 h-3.5 mr-2 text-cyan-400" />
              Trace Multi-Repo Impact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
