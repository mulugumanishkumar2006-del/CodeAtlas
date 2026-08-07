'use client';

import * as React from 'react';
import {
	Bot,
	Sparkles,
	Send,
	Clock,
	Play,
	Pause,
	CheckCircle2,
	ArrowRight,
	GitCommit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AutonomousLoopStage {
	id: number;
	stageName: string;
	status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
	description: string;
}

const LOOP_STAGES: AutonomousLoopStage[] = [
	{ id: 1, stageName: '1. Detect Signal', status: 'COMPLETED', description: 'Detected unindexed PostgreSQL raw SQL query in analytics_raw.py' },
	{ id: 2, stageName: '2. Understand Context', status: 'COMPLETED', description: 'Identified P99 query latency bloat under 3,400 rps load' },
	{ id: 3, stageName: '3. Explain Rationale', status: 'COMPLETED', description: 'Table scans drag performance index by -8.0 pts' },
	{ id: 4, stageName: '4. Prioritize Category', status: 'COMPLETED', description: 'Categorized as Quick Win (+8.0 pts gain / 1 hr effort)' },
	{ id: 5, stageName: '5. Plan Execution', status: 'COMPLETED', description: 'Generated 8-step refactoring & regression test plan' },
	{ id: 6, stageName: '6. Simulate Outcome', status: 'COMPLETED', description: 'Simulated sub-20ms DB latency gain' },
	{ id: 7, stageName: '7. Prepare Isolated Patch', status: 'COMPLETED', description: 'Generated parameterized SQL binding patch in workspace' },
	{ id: 8, stageName: '8. Validate Suite', status: 'COMPLETED', description: 'Passed 94/94 tests and security check' },
	{ id: 9, stageName: '9. Developer Approval', status: 'ACTIVE', description: 'Awaiting developer approval click' },
	{ id: 10, stageName: '10. Apply & Monitor', status: 'PENDING', description: 'Post-apply telemetry regression watcher' },
];

const PRESET_STAFF_QUESTIONS = [
	'What should we improve today?',
	'What is the highest-value optimization?',
	'Find safe quick wins ready for implementation.',
	'Prepare remediation plan for PaymentProcessor circular import.',
	'Show me the safest optimization with low risk.',
];

export function AIStaffEngineerTimeline() {
	const [currentIndex, setCurrentIndex] = React.useState(8);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [chatMessages, setChatMessages] = React.useState<
		{ id: string; sender: 'user' | 'ai'; text: string; actionPlan?: string[] }[]
	>([
		{
			id: 'm-1',
			sender: 'ai',
			text: 'I am your AI Staff Engineer Assistant. I continuously orchestrate the controlled autonomous optimization loop across CodeAtlas while keeping you in full control. How can I assist your engineering optimizations today?',
		},
	]);
	const [inputQuery, setInputQuery] = React.useState('');
	const [isReasoning, setIsReasoning] = React.useState(false);

	const activeStage = LOOP_STAGES[currentIndex];

	// Auto play scrubber
	React.useEffect(() => {
		let timer: NodeJS.Timeout;
		if (isPlaying) {
			timer = setInterval(() => {
				setCurrentIndex((prev) => {
					if (prev >= LOOP_STAGES.length - 1) {
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

			if (query.includes('improve today') || query.includes('quick wins')) {
				response = `Your highest-value Quick Win today is parameterizing the raw SQL query in analytics_raw.py (+8.0 pts Performance Index gain, 1 hr effort). The patch has passed all 94 unit tests and is ready for your approval.`;
				plan = ['Approve analytics_raw.py patch via L4 Validation Pipeline', 'Extract IPaymentContext interface (+4.1 pts gain)'];
			} else if (query.includes('PaymentProcessor')) {
				response = `I have generated an 8-step remediation plan to break the circular import between PaymentProcessor and CheckoutManager.`;
				plan = ['Introduce IPaymentContext domain contract', 'Move concrete implementation to payment/vault.ts', 'Run architecture validation suite'];
			} else {
				response = `Based on your Level 4 autonomy setting, the PostgreSQL query parameterization patch is fully validated and ready for your single-click approval.`;
				plan = ['Approve patch in Isolated Workspace'];
			}

			const aiMsg = { id: `a-${Date.now()}`, sender: 'ai' as const, text: response, actionPlan: plan };
			setChatMessages((prev) => [...prev, aiMsg]);
			setIsReasoning(false);
		}, 800);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Loop Stage Execution Scrubber */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
							<Clock className="w-4 h-4 animate-spin" /> Autonomous Engineering Loop Scrubber
						</div>
						<h2 className="text-xl font-black text-white">Replay Autonomous Loop Stages</h2>
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
						<span>{isPlaying ? 'Pause Scrubber' : 'Play Loop Scrubber'}</span>
					</Button>
				</div>

				<input
					type="range"
					min="0"
					max={LOOP_STAGES.length - 1}
					value={currentIndex}
					onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
					className="w-full h-3 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-slate-800"
				/>

				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
					<div className="flex items-center gap-2">
						<CheckCircle2 className="w-4 h-4 text-cyan-400" />
						<span className="font-bold text-white">{activeStage.stageName}</span>
						<span className="text-slate-500">({activeStage.description})</span>
					</div>
					<div className="text-cyan-300 font-black text-sm">{activeStage.status}</div>
				</div>
			</div>

			{/* AI Staff Engineer Chat */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
					<Sparkles className="w-4 h-4" /> AI Staff Engineer Prompts:
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{PRESET_STAFF_QUESTIONS.map((q, idx) => (
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
							<span>AI Staff Engineer Orchestrating Autonomous Loop...</span>
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
						placeholder="Ask AI Staff Engineer..."
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
