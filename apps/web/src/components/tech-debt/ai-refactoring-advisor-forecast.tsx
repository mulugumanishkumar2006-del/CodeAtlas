'use client';

import * as React from 'react';
import {
	Bot,
	Sparkles,
	Send,
	User,
	TrendingUp,
	TrendingDown,
	LineChart,
	ArrowRight,
	HelpCircle,
	CheckCircle,
	ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ForecastScenario {
	id: string;
	name: string;
	trajectory: 'CURRENT' | 'IMPROVEMENT' | 'ACCELERATED' | 'REFACTORING_INVESTMENT';
	predictedDebtScores: { month: string; score: number; uncertaintyBand: [number, number] }[];
	monthlyCost30Days: number;
	monthlyCost90Days: number;
	monthlyCost180Days: number;
	description: string;
}

const FORECAST_SCENARIOS: ForecastScenario[] = [
	{
		id: 'scen-1',
		name: 'Current Trajectory (Baseline)',
		trajectory: 'CURRENT',
		predictedDebtScores: [
			{ month: 'Now', score: 54.2, uncertaintyBand: [54, 55] },
			{ month: '+30 Days', score: 62.3, uncertaintyBand: [58, 66] },
			{ month: '+90 Days', score: 78.5, uncertaintyBand: [70, 84] },
			{ month: '+180 Days', score: 91.0, uncertaintyBand: [82, 98] },
		],
		monthlyCost30Days: 16800,
		monthlyCost90Days: 22400,
		monthlyCost180Days: 31000,
		description: 'Debt grows exponentially if unrefactored PR additions continue at the current +1.2%/wk rate.',
	},
	{
		id: 'scen-2',
		name: 'Refactoring Investment (Recommended)',
		trajectory: 'REFACTORING_INVESTMENT',
		predictedDebtScores: [
			{ month: 'Now', score: 54.2, uncertaintyBand: [54, 55] },
			{ month: '+30 Days', score: 38.0, uncertaintyBand: [35, 42] },
			{ month: '+90 Days', score: 24.5, uncertaintyBand: [20, 28] },
			{ month: '+180 Days', score: 14.0, uncertaintyBand: [10, 18] },
		],
		monthlyCost30Days: 9200,
		monthlyCost90Days: 5100,
		monthlyCost180Days: 2800,
		description: 'Allocating 15% engineering capacity to remediation reduces debt index down to 14/100.',
	},
];

const PRESET_ADVISOR_QUESTIONS = [
	'How should I reduce this debt?',
	'Why is payment_processor difficult to maintain?',
	'What is the safest refactoring strategy?',
	'Which debt should we fix before next release?',
	'What happens if we ignore this debt for six months?',
	'Show smallest change producing biggest improvement.',
];

export function AIRefactoringAdvisorForecast() {
	const [activeScenarioId, setActiveScenarioId] = React.useState<string>('scen-2');
	const [chatMessages, setChatMessages] = React.useState<
		{ id: string; sender: 'user' | 'ai'; text: string; actionPlan?: string[] }[]
	>([
		{
			id: 'm-1',
			sender: 'ai',
			text: 'I am your AI Refactoring Advisor. Ask me how to optimize your technical debt, evaluate refactoring trade-offs, or forecast long-term engineering velocity.',
		},
	]);
	const [inputQuery, setInputQuery] = React.useState('');
	const [isReasoning, setIsReasoning] = React.useState(false);

	const activeScenario = FORECAST_SCENARIOS.find((s) => s.id === activeScenarioId) || FORECAST_SCENARIOS[1];

	const handleAskAdvisor = (query: string) => {
		if (!query.trim()) return;

		const userMsg = { id: `u-${Date.now()}`, sender: 'user' as const, text: query };
		setChatMessages((prev) => [...prev, userMsg]);
		setInputQuery('');
		setIsReasoning(true);

		setTimeout(() => {
			let response = '';
			let plan: string[] = [];

			if (query.includes('six months') || query.includes('ignore')) {
				response = `If ignored for 6 months, technical debt will compound from 54.2 to 91.0/100. Monthly maintenance friction will increase from $14,200/mo to $31,000/mo, and release iteration friction will grow from +4.5 days to +11 days per deployment.`;
				plan = [
					'Fix critical SQL parameterization immediately (2 hrs)',
					'Schedule payment processor decoupling before next major release (1.5 days)',
				];
			} else if (query.includes('smallest change') || query.includes('biggest improvement')) {
				response = `The smallest change producing the highest immediate score improvement (+4.8 pts in 2 hrs) is parameterizing the dynamic raw SQL query in analytics_raw.py.`;
				plan = [
					'Replace string formatting in analytics_raw.py with parameterized bindings',
					'Enforce dynamic query AST linting in pull request CI gate',
				];
			} else {
				response = `Based on CodeAtlas AST graph analysis, the safest refactoring path is to fix upstream dependency injection boundaries before modifying downstream service handlers.`;
				plan = [
					'Extract interface contract IPaymentContext',
					'Inject CheckoutManager via constructor injection',
				];
			}

			const aiMsg = { id: `a-${Date.now()}`, sender: 'ai' as const, text: response, actionPlan: plan };
			setChatMessages((prev) => [...prev, aiMsg]);
			setIsReasoning(false);
		}, 800);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Forecast Scenario Simulator Header */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">
							<LineChart className="w-4 h-4" /> Predictive Velocity Modeling
						</div>
						<h2 className="text-xl font-black text-white">Technical Debt Forecast & Trajectory</h2>
						<p className="text-xs text-slate-400">
							Predicts future debt growth and maintenance burden under different engineering scenarios.
						</p>
					</div>

					<div className="flex items-center gap-2">
						{FORECAST_SCENARIOS.map((s) => (
							<button
								key={s.id}
								onClick={() => setActiveScenarioId(s.id)}
								className={cn(
									'px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all border',
									s.id === activeScenario.id
										? 'bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-lg shadow-purple-950'
										: 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
								)}
							>
								{s.name}
							</button>
						))}
					</div>
				</div>

				{/* Forecast Progression Display */}
				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
					<p className="text-xs text-slate-300">{activeScenario.description}</p>

					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
						{activeScenario.predictedDebtScores.map((point, idx) => (
							<div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
								<span className="text-[10px] text-slate-400 uppercase font-bold">{point.month}</span>
								<div
									className={cn(
										'text-2xl font-black',
										point.score > 60 ? 'text-rose-400' : 'text-emerald-400'
									)}
								>
									{point.score} pts
								</div>
								<div className="text-[10px] text-slate-500 font-mono">
									± [{point.uncertaintyBand[0]}–{point.uncertaintyBand[1]}] confidence
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* AI Refactoring Advisor Q&A Interface */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
				<div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
					<Sparkles className="w-4 h-4" /> AI Refactoring Advisor Preset Queries:
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{PRESET_ADVISOR_QUESTIONS.map((q, idx) => (
						<button
							key={idx}
							onClick={() => handleAskAdvisor(q)}
							className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-300 hover:text-white transition-all flex items-center gap-1.5"
						>
							<span>{q}</span>
							<ArrowRight className="w-3 h-3 text-cyan-400" />
						</button>
					))}
				</div>

				{/* Chat Box */}
				<div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 h-[380px] overflow-y-auto space-y-3 scrollbar-thin">
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
							<span>Reasoning with CodeAtlas AST model...</span>
						</div>
					)}
				</div>

				{/* Input */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleAskAdvisor(inputQuery);
					}}
					className="flex items-center gap-3 pt-2"
				>
					<input
						type="text"
						placeholder="Ask AI Refactoring Advisor..."
						value={inputQuery}
						onChange={(e) => setInputQuery(e.target.value)}
						className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
					/>
					<Button
						type="submit"
						disabled={!inputQuery.trim() || isReasoning}
						className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono px-5 py-3 rounded-2xl flex items-center gap-2"
					>
						<span>Ask</span>
						<Send className="w-3.5 h-3.5" />
					</Button>
				</form>
			</div>
		</div>
	);
}
