'use client';

import * as React from 'react';
import {
	Bot,
	Sparkles,
	Send,
	User,
	ArrowRight,
	HelpCircle,
	CheckCircle,
	Flame,
	Shield,
	TrendingUp,
	FileText,
	Copy,
	Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessage {
	id: string;
	sender: 'user' | 'ai';
	text: string;
	timestamp: string;
	evidenceLinks?: { label: string; href: string }[];
	actionPlan?: string[];
}

const PRESET_QUESTIONS = [
	'Why is repository health only 74?',
	'Which modules need attention first?',
	'Show the highest-risk files.',
	'Predict health next month.',
	'How can we reach 95+?',
	'Generate a prioritized improvement roadmap.',
];

const INITIAL_MESSAGES: ChatMessage[] = [
	{
		id: 'msg-1',
		sender: 'ai',
		text: 'Hello! I am your AI Repository Health Advisor. I continuously analyze code structure, technical debt, circular dependencies, and security vulnerabilities across CodeAtlas. How can I help optimize your repository health today?',
		timestamp: 'Just now',
	},
];

export function AIHealthAdvisor() {
	const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES);
	const [inputQuery, setInputQuery] = React.useState('');
	const [isTyping, setIsTyping] = React.useState(false);
	const chatEndRef = React.useRef<HTMLDivElement>(null);

	const handleAskQuestion = (questionText: string) => {
		if (!questionText.trim()) return;

		const userMsg: ChatMessage = {
			id: `user-${Date.now()}`,
			sender: 'user',
			text: questionText,
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
		};

		setMessages((prev) => [...prev, userMsg]);
		setInputQuery('');
		setIsTyping(true);

		// Simulate AI Streaming Response based on prompt query
		setTimeout(() => {
			let responseText = '';
			let links: { label: string; href: string }[] = [];
			let plan: string[] = [];

			if (questionText.includes('74') || questionText.includes('Why is repository health')) {
				responseText = `Your current Repository Health Index is 74/100 (Grade C - Warning state). The primary factors dragging the score down are:

1. High Technical Debt Ratio (145 hours estimated in payment-processor)
2. Tight Circular Dependency Cycle between PaymentProcessor and CheckoutManager
3. SQL String Formatting in analytics_raw.py
4. Low Test Coverage (48%) in order-processing subsystem`;
				links = [
					{ label: 'Payment Subsystem Analysis', href: '/health-intelligence?tab=analysis' },
					{ label: 'Security Vulnerability Trace', href: '/security' },
				];
				plan = [
					'Fix unsanitized dynamic SQL query in analytics-db (Gain +4 pts)',
					'Break circular import in payment-processor using dependency inversion (Gain +6 pts)',
					'Decompose God Class OrderProcessingEngine into 3 focused services (Gain +5 pts)',
				];
			} else if (questionText.includes('highest-risk files') || questionText.includes('risk')) {
				responseText = `Based on cyclomatic complexity, circular dependencies, and recent commit churn, here are the top 3 highest-risk files in your repository:

1. \`apps/backend/app/payment/processor.ts\` (Cyclomatic Complexity: 42, 4 Circular Imports)
2. \`apps/backend/app/order/engine.ts\` (LOC: 1,850, Tech Debt: 68 hrs)
3. \`apps/backend/app/db/queries/analytics_raw.py\` (High Severity SQL Injection Vulnerability)`;
				links = [
					{ label: 'Inspect payment/processor.ts', href: '/architecture' },
					{ label: 'Inspect order/engine.ts', href: '/tech-debt' },
				];
				plan = [
					'Refactor processor.ts to extract interfaces',
					'Enforce strict SQL parameterization in analytics_raw.py',
				];
			} else if (questionText.includes('95+') || questionText.includes('roadmap')) {
				responseText = `To achieve a 95+ Enterprise Grade A+ Repository Health score, complete the following 4-stage refactoring roadmap:`;
				links = [{ label: 'View Action Center Tasks', href: '/health-intelligence?tab=actions' }];
				plan = [
					'Sprint 1 (Days 1-3): Fix Critical Security SQL Injection & Secret Hardening (+8 pts)',
					'Sprint 2 (Days 4-7): Refactor Payment Subsystem Circular Dependencies (+6 pts)',
					'Sprint 3 (Days 8-12): Split Order Processing God Class & Add 25 Unit Tests (+5 pts)',
					'Sprint 4 (Days 13-14): Remove Legacy V1 Deprecated Code & Enable CI Coverage Gate (+4 pts)',
				];
			} else {
				responseText = `I have analyzed your query against the CodeAtlas Knowledge Graph and Repository Health models. The core codebase is generally maintainable, but targeted refactoring in payment-processor and order-engine will yield immediate health improvements.`;
				plan = ['Run automated tech debt sprint', 'Review security advisory logs'];
			}

			const aiMsg: ChatMessage = {
				id: `ai-${Date.now()}`,
				sender: 'ai',
				text: responseText,
				timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
				evidenceLinks: links,
				actionPlan: plan,
			};

			setMessages((prev) => [...prev, aiMsg]);
			setIsTyping(false);
		}, 800);
	};

	React.useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isTyping]);

	return (
		<div className="space-y-6 font-mono">
			{/* Preset Question Chips Header */}
			<div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
				<div className="flex items-center gap-2 text-xs font-bold text-slate-400">
					<Sparkles className="w-4 h-4 text-cyan-400" /> Instant AI Health Advisor Prompts:
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{PRESET_QUESTIONS.map((q, idx) => (
						<button
							key={idx}
							onClick={() => handleAskQuestion(q)}
							className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-300 hover:text-white transition-all shadow-sm flex items-center gap-1.5"
						>
							<span>{q}</span>
							<ArrowRight className="w-3 h-3 text-cyan-400" />
						</button>
					))}
				</div>
			</div>

			{/* Chat Messages Container */}
			<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col h-[550px] relative">
				<div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
					{messages.map((msg) => {
						const isAi = msg.sender === 'ai';
						return (
							<div
								key={msg.id}
								className={cn(
									'flex gap-3 max-w-3xl text-xs leading-relaxed',
									isAi ? 'self-start' : 'self-end flex-row-reverse'
								)}
							>
								<div
									className={cn(
										'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-lg font-bold',
										isAi
											? 'bg-cyan-950 border-cyan-500/40 text-cyan-400'
											: 'bg-indigo-950 border-indigo-500/40 text-indigo-400'
									)}
								>
									{isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
								</div>

								<div
									className={cn(
										'p-4 rounded-2xl border space-y-3 shadow-md',
										isAi
											? 'bg-slate-950 border-slate-800 text-slate-200'
											: 'bg-indigo-950/40 border-indigo-500/30 text-white'
									)}
								>
									<p className="whitespace-pre-line">{msg.text}</p>

									{/* Action Plan Bullets */}
									{msg.actionPlan && msg.actionPlan.length > 0 && (
										<div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 mt-2">
											<div className="font-bold text-cyan-400 flex items-center gap-1.5">
												<CheckCircle className="w-3.5 h-3.5" /> Recommended Resolution Steps:
											</div>
											<ul className="space-y-1 text-slate-300">
												{msg.actionPlan.map((step, idx) => (
													<li key={idx} className="flex items-start gap-2">
														<span className="text-cyan-400 font-bold">{idx + 1}.</span>
														<span>{step}</span>
													</li>
												))}
											</ul>
										</div>
									)}

									{/* Evidence Links */}
									{msg.evidenceLinks && msg.evidenceLinks.length > 0 && (
										<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
											{msg.evidenceLinks.map((link, idx) => (
												<a
													key={idx}
													href={link.href}
													className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:underline text-[11px] font-bold"
												>
													{link.label} →
												</a>
											))}
										</div>
									)}

									<div className="text-[10px] text-slate-500 text-right">{msg.timestamp}</div>
								</div>
							</div>
						);
					})}

					{isTyping && (
						<div className="flex items-center gap-2 text-xs text-cyan-400 font-bold p-3 bg-slate-950 rounded-2xl border border-slate-800 w-fit">
							<Bot className="w-4 h-4 animate-spin" />
							<span>AI CTO Reasoning & Synthesizing Code Signals...</span>
						</div>
					)}
					<div ref={chatEndRef} />
				</div>

				{/* Chat Input Bar */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleAskQuestion(inputQuery);
					}}
					className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3"
				>
					<input
						type="text"
						placeholder="Ask AI Health Advisor (e.g. How can we reach 95+ score?)..."
						value={inputQuery}
						onChange={(e) => setInputQuery(e.target.value)}
						className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
					/>
					<Button
						type="submit"
						disabled={!inputQuery.trim() || isTyping}
						className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs px-5 py-3 rounded-2xl flex items-center gap-2"
					>
						<span>Ask AI</span>
						<Send className="w-3.5 h-3.5" />
					</Button>
				</form>
			</div>
		</div>
	);
}
