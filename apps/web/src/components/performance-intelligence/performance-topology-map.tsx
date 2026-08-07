'use client';

import * as React from 'react';
import {
	Server,
	Globe,
	Database,
	Zap,
	Layers,
	Activity,
	Cloud,
	Boxes,
	Search,
	Filter,
	Sparkles,
	ArrowRight,
	Bookmark,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PerformanceTopologyNode {
	id: string;
	name: string;
	type: 'Service' | 'API' | 'Function' | 'Database' | 'Cache' | 'Queue' | 'External API';
	p99LatencyMs: number;
	throughputRps: number;
	errorRatePercent: number;
	latencyContributionPercent: number;
	dependentServicesCount: number;
	status: 'HEALTHY' | 'WARNING' | 'BOTTLENECK';
	aiBottleneckExplanation: string;
	isBookmarked?: boolean;
}

const SAMPLE_TOPOLOGY_NODES: PerformanceTopologyNode[] = [
	{
		id: 'top-api-checkout',
		name: 'POST /api/v1/checkout',
		type: 'API',
		p99LatencyMs: 318,
		throughputRps: 1250,
		errorRatePercent: 0.02,
		latencyContributionPercent: 100,
		dependentServicesCount: 4,
		status: 'BOTTLENECK',
		aiBottleneckExplanation: 'Checkout API is experiencing P99 latency bloat due to downstream database query lock contention.',
	},
	{
		id: 'top-svc-payment',
		name: 'PaymentProcessor.executeTransaction()',
		type: 'Function',
		p99LatencyMs: 245,
		throughputRps: 1250,
		errorRatePercent: 0.0,
		latencyContributionPercent: 77,
		dependentServicesCount: 3,
		status: 'BOTTLENECK',
		aiBottleneckExplanation: 'Dominant bottleneck! 180ms spent waiting for raw SQL analytics query execution.',
	},
	{
		id: 'top-db-postgres',
		name: 'PostgreSQL analytics_raw Query Pool',
		type: 'Database',
		p99LatencyMs: 180,
		throughputRps: 3400,
		errorRatePercent: 0.0,
		latencyContributionPercent: 56,
		dependentServicesCount: 6,
		status: 'BOTTLENECK',
		aiBottleneckExplanation: 'Unindexed tenant_id scan performing full table scans across 4.2M rows.',
	},
	{
		id: 'top-cache-redis',
		name: 'Redis Cache Cluster',
		type: 'Cache',
		p99LatencyMs: 1.8,
		throughputRps: 8900,
		errorRatePercent: 0.0,
		latencyContributionPercent: 1,
		dependentServicesCount: 8,
		status: 'HEALTHY',
		aiBottleneckExplanation: 'Redis cluster operating with 98.4% hit rate and sub-2ms latency.',
	},
];

export function PerformanceTopologyMap() {
	const [selectedNodeId, setSelectedNodeId] = React.useState<string>('top-svc-payment');
	const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [bookmarkedIds, setBookmarkedIds] = React.useState<string[]>(['top-svc-payment']);

	const selectedNode = SAMPLE_TOPOLOGY_NODES.find((n) => n.id === selectedNodeId) || SAMPLE_TOPOLOGY_NODES[1];

	const toggleBookmark = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setBookmarkedIds((prev) =>
			prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
		);
	};

	const filteredNodes = SAMPLE_TOPOLOGY_NODES.filter((node) => {
		const matchStatus = statusFilter === 'ALL' || node.status === statusFilter;
		const matchSearch =
			searchQuery === '' ||
			node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			node.type.toLowerCase().includes(searchQuery.toLowerCase());
		return matchStatus && matchSearch;
	});

	return (
		<div className="space-y-6 font-mono">
			{/* Search & Filter Header */}
			<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
				<div className="flex-1 relative">
					<Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						placeholder="Search topology nodes by name, API, database, or bottleneck type..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all font-mono"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					{['ALL', 'HEALTHY', 'WARNING', 'BOTTLENECK'].map((st) => (
						<button
							key={st}
							onClick={() => setStatusFilter(st)}
							className={cn(
								'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
								statusFilter === st
									? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-md shadow-orange-950'
									: 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
							)}
						>
							{st}
						</button>
					))}
				</div>
			</div>

			{/* Main Grid: Topology Nodes (7 Cols) & Deep Node Inspector (5 Cols) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Nodes Grid */}
				<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{filteredNodes.map((node) => {
						const isSelected = selectedNodeId === node.id;
						const isBottleneck = node.status === 'BOTTLENECK';
						const isBookmarked = bookmarkedIds.includes(node.id);

						return (
							<div
								key={node.id}
								onClick={() => setSelectedNodeId(node.id)}
								className={cn(
									'p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group space-y-3',
									isBottleneck ? 'bg-rose-950/60 border-rose-500/60' : 'bg-slate-900/80 border-slate-800',
									isSelected && 'scale-[1.02] shadow-2xl ring-2 ring-orange-500/50'
								)}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-2">
										<Server className="w-4 h-4 text-slate-300 shrink-0" />
										<span className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors truncate">
											{node.name}
										</span>
									</div>
									<button
										onClick={(e) => toggleBookmark(node.id, e)}
										className="p-1 rounded text-slate-400 hover:text-amber-400"
									>
										<Bookmark className={cn('w-3.5 h-3.5', isBookmarked && 'fill-amber-400 text-amber-400')} />
									</button>
								</div>

								<div className="flex items-baseline justify-between">
									<span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800 font-bold">
										{node.type}
									</span>
									<div className="text-right">
										<span className="text-xl font-black text-white">{node.p99LatencyMs}ms</span>
										<span className="text-[9px] text-slate-500 block">P99 Latency</span>
									</div>
								</div>

								<div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-300 flex items-center justify-between">
									<span>Contribution: <strong className="text-orange-400">{node.latencyContributionPercent}%</strong></span>
									<span>{node.throughputRps} rps</span>
								</div>
							</div>
						);
					})}
				</div>

				{/* Deep Node Inspector */}
				<div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 font-mono">
					<div className="flex items-start justify-between border-b border-slate-800 pb-4">
						<div>
							<span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
								Topology Path Inspection
							</span>
							<h3 className="text-lg font-black text-white">{selectedNode.name}</h3>
							<p className="text-xs text-slate-400">Type: <strong className="text-orange-300">{selectedNode.type}</strong></p>
						</div>
						<div className="px-3.5 py-1.5 rounded-2xl bg-orange-950 border border-orange-500/40 text-orange-300 font-black text-xl">
							{selectedNode.p99LatencyMs}ms
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3 text-xs">
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Throughput</span>
							<div className="text-lg font-black text-white">{selectedNode.throughputRps} rps</div>
						</div>
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Latency Share</span>
							<div className="text-lg font-black text-orange-400">{selectedNode.latencyContributionPercent}%</div>
						</div>
					</div>

					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<div className="flex items-center gap-2 text-xs font-bold text-orange-400">
							<Sparkles className="w-4 h-4" /> AI Bottleneck Reasoning
						</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							{selectedNode.aiBottleneckExplanation}
						</p>
					</div>

					<div className="flex items-center justify-end pt-2">
						<Button className="bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2">
							<span>Open Code Trace & Hotspot</span>
							<ArrowRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
