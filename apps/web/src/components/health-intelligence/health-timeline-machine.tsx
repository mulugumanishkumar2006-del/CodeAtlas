'use client';

import * as React from 'react';
import {
	Clock,
	Play,
	Pause,
	RotateCcw,
	SkipBack,
	SkipForward,
	TrendingUp,
	TrendingDown,
	Zap,
	Shield,
	Flame,
	Layers,
	Sparkles,
	GitCommit,
	Tag,
	Wrench,
	Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HealthSnapshot {
	id: number;
	date: string;
	commitHash: string;
	commitMsg: string;
	overallScore: number;
	techDebtHours: number;
	complexityIndex: number;
	securityScore: number;
	performanceScore: number;
	eventTag?: 'Major Release' | 'Architecture Refactor' | 'Security Hardening' | 'Initial Commit';
	tagColor?: string;
}

const HISTORICAL_SNAPSHOTS: HealthSnapshot[] = [
	{
		id: 1,
		date: '2026-06-01',
		commitHash: 'a1b2c3d',
		commitMsg: 'Initial Architecture Setup v1.0',
		overallScore: 65,
		techDebtHours: 420,
		complexityIndex: 78,
		securityScore: 60,
		performanceScore: 68,
		eventTag: 'Initial Commit',
		tagColor: '#6366f1',
	},
	{
		id: 2,
		date: '2026-06-15',
		commitHash: 'b4c5d6e',
		commitMsg: 'Add Payment Subsystem & Auth Vault',
		overallScore: 68,
		techDebtHours: 450,
		complexityIndex: 82,
		securityScore: 65,
		performanceScore: 70,
	},
	{
		id: 3,
		date: '2026-07-01',
		commitHash: 'c7d8e9f',
		commitMsg: 'v1.5 Major Release - Enterprise Multitenancy',
		overallScore: 72,
		techDebtHours: 390,
		complexityIndex: 80,
		securityScore: 74,
		performanceScore: 72,
		eventTag: 'Major Release',
		tagColor: '#3b82f6',
	},
	{
		id: 4,
		date: '2026-07-15',
		commitHash: 'd0e1f2a',
		commitMsg: 'Refactor Coupling in PaymentGateway & Graph DB',
		overallScore: 81,
		techDebtHours: 280,
		complexityIndex: 65,
		securityScore: 82,
		performanceScore: 80,
		eventTag: 'Architecture Refactor',
		tagColor: '#10b981',
	},
	{
		id: 5,
		date: '2026-07-28',
		commitHash: 'e3f4a5b',
		commitMsg: 'Zero-Trust Security Hardening & Secret Rotation',
		overallScore: 84,
		techDebtHours: 240,
		complexityIndex: 60,
		securityScore: 92,
		performanceScore: 83,
		eventTag: 'Security Hardening',
		tagColor: '#8b5cf6',
	},
	{
		id: 6,
		date: '2026-08-07',
		commitHash: 'f6a7b8c',
		commitMsg: 'v2.0 Production Ready Release & AI Integration',
		overallScore: 87,
		techDebtHours: 195,
		complexityIndex: 54,
		securityScore: 94,
		performanceScore: 88,
		eventTag: 'Major Release',
		tagColor: '#ec4899',
	},
];

interface HealthTimelineMachineProps {
	onTimeMachineSelect?: (snapshot: HealthSnapshot) => void;
}

export function HealthTimelineMachine({ onTimeMachineSelect }: HealthTimelineMachineProps) {
	const [currentIndex, setCurrentIndex] = React.useState<number>(HISTORICAL_SNAPSHOTS.length - 1);
	const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
	const [playbackSpeed, setPlaybackSpeed] = React.useState<number>(1000); // ms per step

	const activeSnapshot = HISTORICAL_SNAPSHOTS[currentIndex];

	// Auto-play timer for Time Machine scrubber
	React.useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isPlaying) {
			timer = setInterval(() => {
				setCurrentIndex((prev) => {
					if (prev >= HISTORICAL_SNAPSHOTS.length - 1) {
						setIsPlaying(false);
						return prev;
					}
					return prev + 1;
				});
			}, playbackSpeed);
		}
		return () => clearInterval(timer);
	}, [isPlaying, playbackSpeed]);

	const handleScrub = (idx: number) => {
		setCurrentIndex(idx);
		if (onTimeMachineSelect) {
			onTimeMachineSelect(HISTORICAL_SNAPSHOTS[idx]);
		}
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Time Machine Interactive Scrubber Player Bar */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
							<Clock className="w-4 h-4 animate-spin" /> Repository Time Machine Replay
						</div>
						<h2 className="text-xl font-black text-white flex items-center gap-2">
							Replay Repository Health Evolution
						</h2>
						<p className="text-xs text-slate-400">
							Scrub through historical commits, releases, and refactors to observe how health metrics evolved.
						</p>
					</div>

					{/* Time Machine Play Controls */}
					<div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
						<button
							onClick={() => handleScrub(0)}
							className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
							title="Jump to Start"
						>
							<SkipBack className="w-4 h-4" />
						</button>

						<button
							onClick={() => handleScrub(Math.max(0, currentIndex - 1))}
							className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
							title="Previous Snapshot"
						>
							<RotateCcw className="w-4 h-4" />
						</button>

						<Button
							onClick={() => setIsPlaying(!isPlaying)}
							className={cn(
								'flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-xl shadow-lg border transition-all',
								isPlaying
									? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
									: 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400/30'
							)}
						>
							{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
							<span>{isPlaying ? 'Pause Replay' : 'Play Timeline'}</span>
						</Button>

						<button
							onClick={() => handleScrub(Math.min(HISTORICAL_SNAPSHOTS.length - 1, currentIndex + 1))}
							className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
							title="Next Snapshot"
						>
							<SkipForward className="w-4 h-4" />
						</button>
					</div>
				</div>

				{/* Timeline Slider Track */}
				<div className="space-y-2 pt-4">
					<div className="relative flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
						<span>June 2026</span>
						<span className="text-cyan-400">
							Active Snapshot: {activeSnapshot.date} ({activeSnapshot.commitHash})
						</span>
						<span>August 2026</span>
					</div>

					<input
						type="range"
						min="0"
						max={HISTORICAL_SNAPSHOTS.length - 1}
						value={currentIndex}
						onChange={(e) => handleScrub(parseInt(e.target.value))}
						className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-slate-800"
					/>

					{/* Timeline Milestones Markers */}
					<div className="grid grid-cols-6 gap-2 pt-2">
						{HISTORICAL_SNAPSHOTS.map((snap, idx) => (
							<button
								key={snap.id}
								onClick={() => handleScrub(idx)}
								className={cn(
									'p-2 rounded-xl text-left border transition-all text-xs font-mono',
									idx === currentIndex
										? 'bg-purple-950/60 border-purple-500/60 text-purple-200 shadow-lg shadow-purple-950'
										: 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
								)}
							>
								<div className="flex items-center justify-between text-[10px]">
									<span className="font-bold">{snap.date.slice(5)}</span>
									{snap.eventTag && (
										<span
											className="w-2 h-2 rounded-full"
											style={{ backgroundColor: snap.tagColor }}
										/>
									)}
								</div>
								<div className="text-sm font-black text-white mt-1">{snap.overallScore} pts</div>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Active Snapshot Metrics Display Card */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
					<div className="flex items-center gap-3">
						<div className="p-3 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-400 font-mono text-xl font-black">
							{activeSnapshot.overallScore}
						</div>
						<div>
							<div className="flex items-center gap-2">
								<GitCommit className="w-4 h-4 text-cyan-400" />
								<span className="text-sm font-bold text-white">{activeSnapshot.commitMsg}</span>
								<span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">
									{activeSnapshot.commitHash}
								</span>
							</div>
							<p className="text-xs text-slate-400 mt-0.5">Recorded on {activeSnapshot.date}</p>
						</div>
					</div>

					{activeSnapshot.eventTag && (
						<div
							className="px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-2 self-start md:self-auto"
							style={{
								backgroundColor: `${activeSnapshot.tagColor}20`,
								borderColor: `${activeSnapshot.tagColor}60`,
								color: activeSnapshot.tagColor,
							}}
						>
							<Tag className="w-3.5 h-3.5" />
							<span>{activeSnapshot.eventTag}</span>
						</div>
					)}
				</div>

				{/* 4 Historical Trend Comparison Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Score */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<span className="text-xs font-bold text-slate-400">Health Score</span>
						<div className="text-3xl font-black text-white">{activeSnapshot.overallScore} / 100</div>
						<div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
							<TrendingUp className="w-3.5 h-3.5" /> Improved +22 pts total
						</div>
					</div>

					{/* Technical Debt */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<span className="text-xs font-bold text-slate-400">Technical Debt</span>
						<div className="text-3xl font-black text-amber-400">{activeSnapshot.techDebtHours} hrs</div>
						<div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
							<TrendingDown className="w-3.5 h-3.5" /> Reduced by 225 hrs
						</div>
					</div>

					{/* Complexity Index */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<span className="text-xs font-bold text-slate-400">Complexity Score</span>
						<div className="text-3xl font-black text-indigo-400">{activeSnapshot.complexityIndex} index</div>
						<div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
							<TrendingDown className="w-3.5 h-3.5" /> Cyclomatic complexity dropped
						</div>
					</div>

					{/* Security Score */}
					<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
						<span className="text-xs font-bold text-slate-400">Security Rating</span>
						<div className="text-3xl font-black text-emerald-400">{activeSnapshot.securityScore} / 100</div>
						<div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
							<Shield className="w-3.5 h-3.5" /> Zero-Trust Verified
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
