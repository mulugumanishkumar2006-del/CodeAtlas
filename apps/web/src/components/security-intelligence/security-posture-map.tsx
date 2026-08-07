'use client';

import * as React from 'react';
import {
	Layers,
	Server,
	Globe,
	Database,
	Cloud,
	Boxes,
	Lock,
	ShieldAlert,
	ShieldCheck,
	CheckCircle,
	AlertTriangle,
	Search,
	Filter,
	Eye,
	X,
	ArrowRight,
	Sparkles,
	Bookmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SecurityMapNode {
	id: string;
	name: string;
	type:
		| 'Repository'
		| 'Service'
		| 'API'
		| 'Database'
		| 'Dependency'
		| 'Cloud Resource'
		| 'Container'
		| 'Auth Boundary'
		| 'Data Store';
	healthScore: number; // 0..100
	status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'HIGH_RISK';
	findingsCount: number;
	trustBoundary: string;
	sensitiveDataFlows: string[];
	dependencies: string[];
	aiRecommendation: string;
	isBookmarked?: boolean;
}

const SAMPLE_SECURITY_NODES: SecurityMapNode[] = [
	{
		id: 'node-auth-vault',
		name: 'auth-vault-service',
		type: 'Service',
		healthScore: 94,
		status: 'HEALTHY',
		findingsCount: 0,
		trustBoundary: 'Zero-Trust Internal VPC',
		sensitiveDataFlows: ['JWT Secrets', 'User Hash Passwords'],
		dependencies: ['postgres-db-1', 'redis-cache-1'],
		aiRecommendation: 'Auth vault is clean with zero active security findings.',
	},
	{
		id: 'node-payment-gateway',
		name: 'payment-gateway-api',
		type: 'API',
		healthScore: 58,
		status: 'CRITICAL',
		findingsCount: 3,
		trustBoundary: 'Public HTTPS Edge Gateway',
		sensitiveDataFlows: ['Credit Card Tokens', 'Stripe API Keys'],
		dependencies: ['stripe-v12-npm', 'auth-vault-service', 'postgres-db-1'],
		aiRecommendation: 'High critical risk! Dynamic SQL query formatting detected in analytics endpoint and circular import with checkout.',
	},
	{
		id: 'node-analytics-db',
		name: 'analytics-raw-queries',
		type: 'Database',
		healthScore: 62,
		status: 'HIGH_RISK',
		findingsCount: 1,
		trustBoundary: 'Internal Analytics DB Pool',
		sensitiveDataFlows: ['User Analytics Logs'],
		dependencies: ['postgres-db-1'],
		aiRecommendation: 'Unsanitized raw SQL parameter format vulnerability.',
	},
	{
		id: 'node-legacy-v1',
		name: 'legacy-v1-adapter',
		type: 'Dependency',
		healthScore: 40,
		status: 'CRITICAL',
		findingsCount: 2,
		trustBoundary: 'Legacy Public API Route',
		sensitiveDataFlows: ['Legacy Auth Tokens'],
		dependencies: [],
		aiRecommendation: 'Deprecated v1 API exports. Schedule removal to eliminate unmonitored attack surface.',
	},
	{
		id: 'node-cloud-s3',
		name: 'aws-s3-metrics-bucket',
		type: 'Cloud Resource',
		healthScore: 88,
		status: 'HEALTHY',
		findingsCount: 0,
		trustBoundary: 'AWS IAM Encrypted Private S3',
		sensitiveDataFlows: ['Exported Audit Logs'],
		dependencies: [],
		aiRecommendation: 'KMS encryption enabled with strict bucket policy.',
	},
];

export function SecurityPostureMap() {
	const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [selectedNodeId, setSelectedNodeId] = React.useState<string>('node-payment-gateway');
	const [hoveredNode, setHoveredNode] = React.useState<SecurityMapNode | null>(null);
	const [bookmarkedIds, setBookmarkedIds] = React.useState<string[]>(['node-payment-gateway']);

	const selectedNode = SAMPLE_SECURITY_NODES.find((n) => n.id === selectedNodeId) || SAMPLE_SECURITY_NODES[0];

	const toggleBookmark = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setBookmarkedIds((prev) =>
			prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
		);
	};

	const filteredNodes = SAMPLE_SECURITY_NODES.filter((node) => {
		const matchStatus = statusFilter === 'ALL' || node.status === statusFilter;
		const matchSearch =
			searchQuery === '' ||
			node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			node.type.toLowerCase().includes(searchQuery.toLowerCase());
		return matchStatus && matchSearch;
	});

	const getStatusColors = (status: SecurityMapNode['status']) => {
		switch (status) {
			case 'HEALTHY':
				return { bg: 'bg-emerald-950/80', border: 'border-emerald-500/60', text: 'text-emerald-400' };
			case 'WARNING':
				return { bg: 'bg-amber-950/80', border: 'border-amber-500/60', text: 'text-amber-400' };
			case 'CRITICAL':
				return { bg: 'bg-rose-950/80', border: 'border-rose-500/60', text: 'text-rose-400' };
			case 'HIGH_RISK':
				return { bg: 'bg-orange-950/80', border: 'border-orange-500/60', text: 'text-orange-400' };
		}
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Controls Header */}
			<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
				<div className="flex-1 relative">
					<Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						placeholder="Filter security posture map by service, API, database, or trust boundary..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					{['ALL', 'HEALTHY', 'WARNING', 'CRITICAL', 'HIGH_RISK'].map((st) => (
						<button
							key={st}
							onClick={() => setStatusFilter(st)}
							className={cn(
								'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
								statusFilter === st
									? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950'
									: 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
							)}
						>
							{st}
						</button>
					))}
				</div>
			</div>

			{/* Main Grid: Interactive Map Nodes (7 Cols) & Component Detail Inspector (5 Cols) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Nodes Topology Matrix Grid */}
				<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{filteredNodes.map((node) => {
						const colors = getStatusColors(node.status);
						const isSelected = selectedNodeId === node.id;
						const isBookmarked = bookmarkedIds.includes(node.id);

						return (
							<div
								key={node.id}
								onMouseEnter={() => setHoveredNode(node)}
								onMouseLeave={() => setHoveredNode(null)}
								onClick={() => setSelectedNodeId(node.id)}
								className={cn(
									'p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group space-y-3',
									colors.bg,
									colors.border,
									isSelected && 'scale-[1.02] shadow-2xl ring-2 ring-cyan-500/50'
								)}
							>
								{/* Header */}
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-2">
										<Server className="w-4 h-4 text-slate-300 shrink-0" />
										<span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
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

								{/* Type & Score */}
								<div className="flex items-baseline justify-between">
									<span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800 font-bold">
										{node.type}
									</span>
									<div className="flex items-baseline gap-1">
										<span className="text-2xl font-black text-white">{node.healthScore}</span>
										<span className="text-[10px] text-slate-400">/ 100</span>
									</div>
								</div>

								{/* Trust Boundary Badge */}
								<div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-300 flex items-center justify-between">
									<span className="truncate max-w-[180px]">Boundary: <strong className="text-slate-200">{node.trustBoundary}</strong></span>
									<span className={cn('font-bold', colors.text)}>{node.findingsCount} findings</span>
								</div>
							</div>
						);
					})}
				</div>

				{/* Component Deep Topology Inspector Panel */}
				<div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
					<div className="flex items-start justify-between border-b border-slate-800 pb-4">
						<div>
							<span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
								Topology Path Inspection
							</span>
							<h3 className="text-lg font-black text-white">{selectedNode.name}</h3>
							<p className="text-xs text-slate-400">Type: <strong className="text-cyan-300">{selectedNode.type}</strong></p>
						</div>
						<div className="px-3.5 py-1.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-black text-xl">
							{selectedNode.healthScore}
						</div>
					</div>

					{/* Sensitive Data Flow Path */}
					<div className="space-y-2">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Sensitive Data Flows Handled
						</span>
						<div className="flex flex-wrap items-center gap-2">
							{selectedNode.sensitiveDataFlows.map((flow, idx) => (
								<span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold">
									🔑 {flow}
								</span>
							))}
						</div>
					</div>

					{/* Connected Dependencies */}
					<div className="space-y-2">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Connected Dependencies & Services
						</span>
						<div className="flex flex-wrap items-center gap-1.5">
							{selectedNode.dependencies.map((dep, idx) => (
								<span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
									{dep}
								</span>
							))}
						</div>
					</div>

					{/* AI Posture Recommendation */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
							<Sparkles className="w-4 h-4" /> AI Posture Analysis
						</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							{selectedNode.aiRecommendation}
						</p>
					</div>

					<div className="flex items-center justify-end pt-2">
						<Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2">
							<span>Trace Complete Attack Path</span>
							<ArrowRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
