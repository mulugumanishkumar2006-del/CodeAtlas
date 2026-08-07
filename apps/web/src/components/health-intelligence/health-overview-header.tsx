'use client';

import * as React from 'react';
import {
	Activity,
	RefreshCw,
	Play,
	Share2,
	Download,
	Layers,
	ShieldCheck,
	Sparkles,
	Clock,
	CheckCircle2,
	AlertTriangle,
	Building2,
	ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HealthOverviewHeaderProps {
	repoId: string;
	onRepoChange: (repoId: string) => void;
	overallScore: number;
	grade: string;
	status: string;
	statusColor: string;
	isScanning: boolean;
	onTriggerScan: () => void;
	onOpenTimeMachine: () => void;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	lastScannedAt?: string;
}

const REPOSITORIES = [
	{ id: 'codeatlas-main', name: 'CodeAtlas / core-platform', branch: 'main', files: 1420, score: 87 },
	{ id: 'payment-service', name: 'CodeAtlas / payment-service', branch: 'main', files: 480, score: 74 },
	{ id: 'auth-vault', name: 'CodeAtlas / auth-vault', branch: 'production', files: 310, score: 92 },
	{ id: 'ai-engine', name: 'CodeAtlas / ai-reasoning-engine', branch: 'main', files: 890, score: 68 },
];

export function HealthOverviewHeader({
	repoId,
	onRepoChange,
	overallScore,
	grade,
	status,
	statusColor,
	isScanning,
	onTriggerScan,
	onOpenTimeMachine,
	activeTab,
	setActiveTab,
	lastScannedAt = '2 mins ago',
}: HealthOverviewHeaderProps) {
	const [repoDropdownOpen, setRepoDropdownOpen] = React.useState(false);
	const selectedRepo = REPOSITORIES.find((r) => r.id === repoId) || REPOSITORIES[0];

	const tabs = [
		{ id: 'overview', label: 'Unified Health' },
		{ id: 'analysis', label: 'AI Health Analysis' },
		{ id: 'map', label: 'Interactive Health Map' },
		{ id: 'timeline', label: 'Health Timeline & Time Machine' },
		{ id: 'advisor', label: 'AI Health Advisor' },
		{ id: 'actions', label: 'Action Center' },
	];

	return (
		<div className="flex flex-col gap-5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl relative overflow-hidden">
			{/* Subtle background glow */}
			<div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

			{/* Top Bar: Title & Primary Controls */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 z-10">
				{/* Left: Brand / Repo Selector */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-950">
							<Activity className="w-6 h-6 animate-pulse" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
									Repository Health Intelligence
								</h1>
								<span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-full uppercase">
									ENTERPRISE AGI
								</span>
							</div>
							<p className="text-xs text-slate-400 font-mono mt-0.5">
								Autonomous continuous health scoring, architectural risk diagnosis, and AI CTO recommendations.
							</p>
						</div>
					</div>

					{/* Target Repo Picker */}
					<div className="relative mt-2">
						<button
							onClick={() => setRepoDropdownOpen(!repoDropdownOpen)}
							className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-xs font-mono text-slate-200"
						>
							<Building2 className="w-3.5 h-3.5 text-cyan-400" />
							<span className="font-bold text-white">{selectedRepo.name}</span>
							<span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400 border border-slate-700">
								{selectedRepo.branch}
							</span>
							<span className="text-slate-500">({selectedRepo.files} files scanned)</span>
							<ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
						</button>

						{repoDropdownOpen && (
							<div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
								<div className="px-3 py-2 text-[10px] font-mono uppercase font-bold text-slate-400 border-b border-slate-800">
									Select Repository
								</div>
								{REPOSITORIES.map((repo) => (
									<button
										key={repo.id}
										onClick={() => {
											onRepoChange(repo.id);
											setRepoDropdownOpen(false);
										}}
										className={cn(
											'w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between font-mono text-xs my-0.5',
											repo.id === selectedRepo.id
												? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
												: 'hover:bg-slate-800/60 text-slate-300'
										)}
									>
										<div>
											<div className="font-bold text-white">{repo.name}</div>
											<div className="text-[10px] text-slate-400">Branch: {repo.branch}</div>
										</div>
										<div className="flex items-center gap-1.5">
											<span className="text-xs font-bold text-slate-300">{repo.score} pts</span>
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Right: Score Hero Pill & Primary Action Buttons */}
				<div className="flex flex-wrap items-center gap-3">
					{/* Live Score Pill */}
					<div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl font-mono">
						<div className="flex flex-col text-right">
							<span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
								Health Index
							</span>
							<span className="text-xs text-emerald-400 font-bold flex items-center justify-end gap-1">
								<CheckCircle2 className="w-3 h-3" /> {status}
							</span>
						</div>
						<div
							className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg border"
							style={{
								backgroundColor: `${statusColor}20`,
								borderColor: `${statusColor}60`,
								color: statusColor,
							}}
						>
							{overallScore}
						</div>
						<div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg font-black text-white">
							{grade}
						</div>
					</div>

					{/* Scan Trigger Button */}
					<Button
						onClick={onTriggerScan}
						disabled={isScanning}
						className={cn(
							'flex items-center gap-2 shadow-lg transition-all font-mono text-xs px-4 py-2.5 rounded-xl border',
							isScanning
								? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
								: 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white border-cyan-400/30'
						)}
					>
						<RefreshCw className={cn('w-4 h-4', isScanning && 'animate-spin text-amber-300')} />
						<span>{isScanning ? 'Scanning Repository...' : 'Continuous Health Scan'}</span>
					</Button>

					{/* Time Machine Button */}
					<Button
						onClick={onOpenTimeMachine}
						variant="outline"
						className="flex items-center gap-2 font-mono text-xs px-3.5 py-2.5 rounded-xl border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200"
					>
						<Clock className="w-4 h-4 text-purple-400" />
						<span>Time Machine</span>
					</Button>

					<div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
						<span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
						<span>Live Streamed</span>
					</div>
				</div>
			</div>

			{/* Sub Tabs Navigation */}
			<div className="flex items-center justify-between border-t border-slate-800/80 pt-4 z-10">
				<div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
					{tabs.map((t) => {
						const isActive = activeTab === t.id;
						return (
							<button
								key={t.id}
								onClick={() => setActiveTab(t.id)}
								className={cn(
									'px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap flex items-center gap-2',
									isActive
										? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950'
										: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
								)}
							>
								{isActive && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
								<span>{t.label}</span>
							</button>
						);
					})}
				</div>

				<div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-slate-400">
					<span>Last Analyzed: <strong className="text-slate-300">{lastScannedAt}</strong></span>
				</div>
			</div>
		</div>
	);
}
