'use client';

import * as React from 'react';
import {
	Bot,
	Sparkles,
	Send,
	User,
	Clock,
	Play,
	Pause,
	TrendingUp,
	ArrowRight,
	GitCommit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BenchmarkTimelinePoint {
	id: number;
	date: string;
	commitHash: string;
	event: string;
	overallScore: number;
}

const HISTORICAL_POINTS: BenchmarkTimelinePoint[] = [
	{ id: 1, date: '2026-06-01', commitHash: 'a1b2c3d', event: 'Initial Domain Microservice Architecture', overallScore: 82 },
	{ id: 2, date: '2026-06-18', commitHash: 'c7f8a91', event: 'Fast Checkout PR #412 Added Unindexed Query', overallScore: 74 },
	{ id: 3, date: '2026-07-10', commitHash: 'd4e5f6a', event: 'Extracted PaymentContext Contract', overallScore: 88 },
	{ id: 4, date: '2026-07-28', commitHash: 'e3f4a5b', event: 'Zero-Trust Security & Quality Sweep', overallScore: 92 },
	{ id: 5, date: '2026-08-07', commitHash: 'f6a7b8c', event: 'v2.0 Production Release Ready', overallScore: 94 },
];

const PRESET_BENCHMARK_QUESTIONS = [
	'Why is our performance index below benchmark?',
	'Where are we stronger than peer repositories?',
	'What engineering patterns explain our security score?',
	'What should we improve first to close the gap?',
	'Simulate impact of fixing PostgreSQL unindexed query.',
];

export function AIBenchmarkingAdvisorTimeline() {
	const [currentIndex, setCurrentIndex] = React.useState(HISTORICAL_POINTS.length - 1);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [chatMessages, setChatMessages] = React.useState<
		{ id: string; sender: 'user' | 'ai'; text: string; actionPlan?: string[] }[]
	>([
		{
			id: 'm-1',
			sender: 'ai',
			text: 'I am your AI Benchmarking Advisor. I continuously evaluate contextual benchmark positions, underlying engineering patterns, and gap analysis across CodeAtlas. How can I assist your engineering comparisons today?',
		},
	]);
	const [inputQuery, setInputQuery] = React.useState('');
	const [isReasoning, setIsReasoning] = React.useState(false);

	const activePoint = HISTORICAL_POINTS[currentIndex];

	// Auto play scrubber
	React.useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isPlaying) {
			timer = setInterval(() => {
				setCurrentIndex((prev) => {
					if (prev >= HISTORICAL_POINTS.length - 1) {
						setIsPlaying(false);
						return prev;
					}
					return prev + 1;
				});
			}, 1200);
		}
		return () => clearInterval(timer);
	}, [isPlaying]);

	const handleAskAdvisor = (query: string) => {
		if (!query.trim()) return;

		const userMsg = { id: `u-${Date.now()}`, sender: 'user' as const, text: query };
		setChatMessages((prev) => [...prev, userMsg]);
		setInputQuery('');
		setIsReasoning(true);

		setTimeout(() => {
			let response = '';
			let plan: string[] = [];

			if (query.includes('performance index') || query.includes('below benchmark')) {
				response = `Your Performance Index (74) is 8 points below your microservice peer benchmark (82). The primary cause is an unindexed raw SQL query in analytics_raw.py dragging P99 database query latency to 180ms.`;
				plan = ['Create composite index on (tenant_id, filter) (+8.0 pts gain)', 'Batch N+1 order queries in payment/processor.ts'];
			} else if (query.includes('stronger')) {
				response = `You are significantly stronger in Architecture Health (92 vs 84 benchmark) and Security Posture (94 vs 87 benchmark) thanks to strict zero-trust JWT verification and hexagonal domain contract decoupling.`;
				plan = ['Maintain zero-trust domain contract boundaries'];
			} else {
				response = `Based on peer repository evidence, resolving the PostgreSQL index gap will elevate your overall benchmark position into the top 3% of microservice peer repositories.`;
				plan = ['Execute PostgreSQL index quick win (1 hr)'];
			}

			const aiMsg = { id: `a-${Date.now()}`, sender: 'ai' as const, text: response, actionPlan: plan };
			setChatMessages((prev) => [...prev, aiMsg]);
			setIsReasoning(false);
		}, 800);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Time Machine Scrubber */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
							<Clock className="w-4 h-4 animate-spin" /> Benchmark Position Time Machine
						</div>
						<h2 className="text-xl font-black text-white">Replay Benchmark History Timeline</h2>
					</div>

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
				</div>

				<input
					type="range"
					min="0"
					max={HISTORICAL_POINTS.length - 1}
					value={currentIndex}
					onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
					className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-slate-800"
				/>

				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
					<div className="flex items-center gap-2">
						<GitCommit className="w-4 h-4 text-cyan-400" />
						<span className="font-bold text-white">{activePoint.event}</span>
						<span className="text-slate-500">({activePoint.commitHash})</span>
					</div>
					<div className="text-cyan-300 font-black text-sm">{activePoint.overallScore} / 100 Score</div>
				</div>
			</div>

			{/* AI Advisor Chat */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
					<Sparkles className="w-4 h-4" /> AI Benchmarking Advisor Prompts:
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{PRESET_BENCHMARK_QUESTIONS.map((q, idx) => (
						<button
							key={idx}
							onClick={() => handleAskAdvisor(q)}
							className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 font-mono"
						>
							<span>{q}</span>
							<ArrowRight className="w-3 h-3 text-cyan-400" />
						</button>
					))}
				</div>

				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 h-[360px] overflow-y-auto space-y-3 scrollbar-thin">
					{chatMessages.map((msg) => (
						<div
							key={msg.id}
							className={cn(
								'p-3.5 rounded-2xl border text-xs max-w-2xl leading-relaxed space-y-2',
								msg.sender === 'ai'
									? 'bg-slate-900 border-slate-800 text-slate-200 self-start'
									: 'bg-indigo-950/40 border-indigo-500/30 text-white ml-auto'
							)}
						>
							<p>{msg.text}</p>
							{msg.actionPlan && (
								<ul className="space-y-1 text-slate-300 pt-2 border-t border-slate-800">
									{msg.actionPlan.map((step, idx) => (
										<li key={idx} className="flex items-center gap-2 text-[11px]">
											<span className="text-cyan-400 font-bold">•</span>
											<span>{step}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					))}

					{isReasoning && (
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold p-3 bg-slate-900 rounded-xl w-fit">
							<Bot className="w-4 h-4 animate-spin" />
							<span>AI Benchmarking Advisor Synthesizing Peer Telemetry...</span>
						</div>
					)}
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleAskAdvisor(inputQuery);
					}}
					className="flex items-center gap-3 pt-2"
				>
					<input
						type="text"
						placeholder="Ask AI Benchmarking Advisor..."
						value={inputQuery}
						onChange={(e) => setInputQuery(e.target.value)}
						className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
					/>
					<Button
						type="submit"
						disabled={!inputQuery.trim() || isReasoning}
						className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono px-5 py-3 rounded-2xl flex items-center gap-2"
					>
						<span>Ask AI</span>
						<Send className="w-3.5 h-3.5" />
					</Button>
				</form>
			</div>
		</div>
	);
}
