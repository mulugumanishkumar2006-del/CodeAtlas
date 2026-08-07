'use client';

import * as React from 'react';
import {
	Bot,
	Sparkles,
	Send,
	Clock,
	Play,
	Pause,
	BrainCircuit,
	ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PredictiveHorizonPoint {
	id: number;
	label: string;
	timeHorizonDays: number;
	projectedHealthScore: number;
	keyRiskSummary: string;
}

const HORIZON_POINTS: PredictiveHorizonPoint[] = [
	{ id: 1, label: 'Now (Baseline)', timeHorizonDays: 0, projectedHealthScore: 94, keyRiskSummary: 'Unindexed PostgreSQL query in analytics_raw.py' },
	{ id: 2, label: '7 Days', timeHorizonDays: 7, projectedHealthScore: 93, keyRiskSummary: 'Minor database table row count growth' },
	{ id: 3, label: '30 Days', timeHorizonDays: 30, projectedHealthScore: 91, keyRiskSummary: 'P99 query latency approaches 140ms' },
	{ id: 4, label: '90 Days', timeHorizonDays: 90, projectedHealthScore: 86, keyRiskSummary: 'PaymentProcessor circular import coupling accumulates debt' },
	{ id: 5, label: '6 Months', timeHorizonDays: 180, projectedHealthScore: 82, keyRiskSummary: 'Architecture drift requires dedicated refactoring' },
];

const PRESET_PREDICTIVE_QUESTIONS = [
	'What is likely to happen over the next 90 days?',
	'Why is technical debt growth accelerating?',
	'What can we do now to change that outcome?',
	'Simulate projected health if we create composite DB index.',
	'Show historical prediction accuracy rates.',
];

export function AIPredictiveAdvisorTimeline() {
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [chatMessages, setChatMessages] = React.useState<
		{ id: string; sender: 'user' | 'ai'; text: string; actionPlan?: string[] }[]
	>([
		{
			id: 'm-1',
			sender: 'ai',
			text: 'I am your AI Predictive Engineering Advisor. I continuously project repository health, technical debt growth, performance degradation, & architecture risks across CodeAtlas. How can I assist your future engineering decisions today?',
		},
	]);
	const [inputQuery, setInputQuery] = React.useState('');
	const [isReasoning, setIsReasoning] = React.useState(false);

	const activePoint = HORIZON_POINTS[currentIndex];

	// Auto play scrubber
	React.useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isPlaying) {
			timer = setInterval(() => {
				setCurrentIndex((prev) => {
					if (prev >= HORIZON_POINTS.length - 1) {
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

			if (query.includes('next 90 days') || query.includes('likely to happen')) {
				response = `Over the next 90 days, overall Engineering Health is projected to decline from 94 to 86 if current development pace continues without dedicated refactoring. The primary drivers are unindexed raw SQL query table scans (-8.0 pts) and PaymentProcessor circular import coupling (-4.1 pts).`;
				plan = ['Create composite index on metrics table (1 hr)', 'Extract IPaymentContext domain contract (1.5 days)'];
			} else if (query.includes('change that outcome')) {
				response = `Executing two targeted preventive interventions today will elevate your projected 90-day score from 86 to 97+ Zero-Trust excellence.`;
				plan = ['Apply PostgreSQL index fix (+8.0 pts gain)', 'Extract IPaymentContext contract (+4.1 pts gain)'];
			} else {
				response = `Based on 96.8% verified model accuracy, executing preventive refactorings now will permanently eliminate database table scan risks and module coupling drift.`;
				plan = ['Execute PostgreSQL index quick win (1 hr)'];
			}

			const aiMsg = { id: `a-${Date.now()}`, sender: 'ai' as const, text: response, actionPlan: plan };
			setChatMessages((prev) => [...prev, aiMsg]);
			setIsReasoning(false);
		}, 800);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Time Horizon Scrubber */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
							<Clock className="w-4 h-4 animate-spin" /> Time Horizon Forecast Scrubber
						</div>
						<h2 className="text-xl font-black text-white">Replay Future Forecast Horizons</h2>
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
						<span>{isPlaying ? 'Pause Scrubber' : 'Play Forecast Scrubber'}</span>
					</Button>
				</div>

				<input
					type="range"
					min="0"
					max={HORIZON_POINTS.length - 1}
					value={currentIndex}
					onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
					className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-slate-800"
				/>

				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
					<div className="flex items-center gap-2">
						<BrainCircuit className="w-4 h-4 text-cyan-400" />
						<span className="font-bold text-white">{activePoint.label}</span>
						<span className="text-slate-500">({activePoint.keyRiskSummary})</span>
					</div>
					<div className="text-cyan-300 font-black text-sm">{activePoint.projectedHealthScore} / 100 Projected Health</div>
				</div>
			</div>

			{/* AI Advisor Chat */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
					<Sparkles className="w-4 h-4" /> AI Predictive Advisor Prompts:
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{PRESET_PREDICTIVE_QUESTIONS.map((q, idx) => (
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
							<span>AI Predictive Advisor Synthesizing Forecast Telemetry...</span>
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
						placeholder="Ask AI Predictive Advisor..."
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
