'use client';

import * as React from 'react';
import {
	Folder,
	FileCode,
	Code2,
	Layers,
	Search,
	Filter,
	Sparkles,
	ArrowRight,
	Bookmark,
	CheckCircle,
	AlertTriangle,
	Eye,
	GitBranch,
	GitCommit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QualityMapElement {
	id: string;
	name: string;
	level: 'Repository' | 'Directory' | 'Module' | 'File' | 'Class' | 'Function';
	qualityScore: number;
	cyclomaticComplexity: number;
	duplicationLines: number;
	testCoveragePercent: number;
	callersCount: number;
	consumersCount: number;
	recentCommitHash: string;
	status: 'HEALTHY' | 'WARNING' | 'HIGH_RISK';
	aiInsight: string;
	isBookmarked?: boolean;
}

const SAMPLE_MAP_ELEMENTS: QualityMapElement[] = [
	{
		id: 'map-payment-proc',
		name: 'PaymentProcessor.executeTransaction()',
		level: 'Function',
		qualityScore: 62,
		cyclomaticComplexity: 24,
		duplicationLines: 48,
		testCoveragePercent: 42,
		callersCount: 6,
		consumersCount: 4,
		recentCommitHash: 'c7f8a91',
		status: 'HIGH_RISK',
		aiInsight: 'High cyclomatic complexity (24) paired with 48 duplicated lines and low test coverage (42%). High priority refactoring win.',
	},
	{
		id: 'map-analytics-raw',
		name: 'analytics_raw.py',
		level: 'File',
		qualityScore: 68,
		cyclomaticComplexity: 18,
		duplicationLines: 12,
		testCoveragePercent: 65,
		callersCount: 8,
		consumersCount: 12,
		recentCommitHash: 'e3f4a5b',
		status: 'WARNING',
		aiInsight: 'Raw SQL string formatting detected. Recommend parameterizing queries in SQLAlchemy context.',
	},
	{
		id: 'map-auth-vault',
		name: 'auth-vault-service',
		level: 'Module',
		qualityScore: 95,
		cyclomaticComplexity: 4,
		duplicationLines: 0,
		testCoveragePercent: 98,
		callersCount: 14,
		consumersCount: 22,
		recentCommitHash: 'f6a7b8c',
		status: 'HEALTHY',
		aiInsight: 'Module is clean, well-tested, and operates with zero architectural drift.',
	},
];

export function CodeQualityMap() {
	const [selectedLevel, setSelectedLevel] = React.useState<string>('ALL');
	const [selectedNodeId, setSelectedNodeId] = React.useState<string>('map-payment-proc');
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [bookmarkedIds, setBookmarkedIds] = React.useState<string[]>(['map-payment-proc']);

	const selectedNode = SAMPLE_MAP_ELEMENTS.find((e) => e.id === selectedNodeId) || SAMPLE_MAP_ELEMENTS[0];

	const toggleBookmark = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setBookmarkedIds((prev) =>
			prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
		);
	};

	const filteredElements = SAMPLE_MAP_ELEMENTS.filter((node) => {
		const matchLevel = selectedLevel === 'ALL' || node.level === selectedLevel;
		const matchSearch =
			searchQuery === '' ||
			node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			node.level.toLowerCase().includes(searchQuery.toLowerCase());
		return matchLevel && matchSearch;
	});

	return (
		<div className="space-y-6 font-mono">
			{/* Controls Header */}
			<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
				<div className="flex-1 relative">
					<Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						placeholder="Search quality map by file, class, function, or module name..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					{['ALL', 'Module', 'File', 'Class', 'Function'].map((lvl) => (
						<button
							key={lvl}
							onClick={() => setSelectedLevel(lvl)}
							className={cn(
								'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
								selectedLevel === lvl
									? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950'
									: 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
							)}
						>
							{lvl}
						</button>
					))}
				</div>
			</div>

			{/* Main Grid: Quality Map Cards (7 Cols) & Component Deep Inspector (5 Cols) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Matrix Cards */}
				<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{filteredElements.map((node) => {
						const isSelected = selectedNodeId === node.id;
						const isHighRisk = node.status === 'HIGH_RISK';
						const isBookmarked = bookmarkedIds.includes(node.id);

						return (
							<div
								key={node.id}
								onClick={() => setSelectedNodeId(node.id)}
								className={cn(
									'p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group space-y-3',
									isHighRisk ? 'bg-rose-950/60 border-rose-500/60' : 'bg-slate-900/80 border-slate-800',
									isSelected && 'scale-[1.02] shadow-2xl ring-2 ring-cyan-500/50'
								)}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-2">
										<Code2 className="w-4 h-4 text-slate-300 shrink-0" />
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

								<div className="flex items-baseline justify-between">
									<span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800 font-bold">
										{node.level}
									</span>
									<div className="flex items-baseline gap-1">
										<span className="text-2xl font-black text-white">{node.qualityScore}</span>
										<span className="text-[10px] text-slate-400">/ 100</span>
									</div>
								</div>

								<div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-300 flex items-center justify-between">
									<span>Complexity: <strong className="text-cyan-300">{node.cyclomaticComplexity}</strong></span>
									<span>Coverage: <strong className="text-emerald-400">{node.testCoveragePercent}%</strong></span>
								</div>
							</div>
						);
					})}
				</div>

				{/* Component Deep Quality Inspector */}
				<div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
					<div className="flex items-start justify-between border-b border-slate-800 pb-4">
						<div>
							<span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
								Quality Hierarchy Inspection
							</span>
							<h3 className="text-lg font-black text-white">{selectedNode.name}</h3>
							<p className="text-xs text-slate-400">Level: <strong className="text-cyan-300">{selectedNode.level}</strong></p>
						</div>
						<div className="px-3.5 py-1.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-black text-xl">
							{selectedNode.qualityScore}
						</div>
					</div>

					{/* Metric Breakdown Chips */}
					<div className="grid grid-cols-2 gap-3 text-xs">
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Callers & Consumers</span>
							<div className="text-base font-black text-white">{selectedNode.callersCount} callers / {selectedNode.consumersCount} consumers</div>
						</div>
						<div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
							<span className="text-[10px] text-slate-400">Recent Churn</span>
							<div className="text-base font-black text-purple-300 flex items-center gap-1">
								<GitCommit className="w-3.5 h-3.5" /> {selectedNode.recentCommitHash}
							</div>
						</div>
					</div>

					{/* AI Quality Insight */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
						<div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
							<Sparkles className="w-4 h-4" /> AI Hierarchy Diagnostic
						</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							{selectedNode.aiInsight}
						</p>
					</div>

					<div className="flex items-center justify-end pt-2">
						<Button className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs px-4 py-2 rounded-xl flex items-center gap-2">
							<span>Inspect Code & Refactor</span>
							<ArrowRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
