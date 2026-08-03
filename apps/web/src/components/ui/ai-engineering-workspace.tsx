'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
	Brain,
	Sparkles,
	Server,
	Code2,
	Layers,
	ShieldCheck,
	Flame,
	HeartPulse,
	Play,
	Copy,
	Check,
	ChevronDown,
	ExternalLink,
	FileText,
	Building2,
	Search,
	Activity,
	ArrowRight,
	AlertTriangle,
	CheckCircle2,
	Cpu,
	Database,
	Lock,
	Settings,
	HelpCircle,
	FileCode,
	Zap,
	Send,
	Bookmark,
	Share2,
	RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// AI Engineering Mode Options
type AIMode =
	| 'Architecture Mode'
	| 'Performance Mode'
	| 'Security Mode'
	| 'Technical Debt Mode'
	| 'Documentation Mode'
	| 'Testing Mode'
	| 'Migration Mode'
	| 'Simulation Mode'
	| 'Root Cause Analysis Mode'
	| 'AI CTO Mode';

// Preset Question Q&A Data Grounded in Evidence
interface PresetQA {
	question: string;
	mode: AIMode;
	executiveSummary: string;
	evidenceFile: string;
	evidenceSnippet: string;
	riskAssessment: string;
	techDebtDrag: string;
	estimatedEffort: string;
	confidence: string;
	recommendations: string[];
	suggestedActions: { label: string; href: string; icon: React.ElementType }[];
}

export function AIEngineeringWorkspace() {
	const [activeMode, setActiveMode] = useState<AIMode>('Performance Mode');
	const [selectedRepo, setSelectedRepo] = useState<string>('CodeAtlas Core Suite');
	const [userInput, setUserInput] = useState<string>('');
	const [copiedReport, setCopiedReport] = useState<boolean>(false);

	// Catalog of Preset Q&As
	const qaCatalog: Record<string, PresetQA> = {
		'payment-slow': {
			question: 'Why is PaymentService encountering database connection latency?',
			mode: 'Performance Mode',
			executiveSummary:
				'PaymentService experiences connection latency due to direct inline SQL execution inside route handlers without connection pooling. Under peak loads (>15k req/sec), database socket locks saturate, causing p95 latency to degrade by +45ms.',
			evidenceFile: 'PaymentService/router.py:L142',
			evidenceSnippet: `@router.post("/process_charge")\nasync def process_charge(payload: ChargeRequest):\n    # Direct DB execution without connection pool wrapper\n    db_cursor.execute("SELECT * FROM users WHERE id = %s", payload.user_id)`,
			riskAssessment: 'High Socket Lock Contention on PostgreSQL Primary Database Node',
			techDebtDrag: '$18.5k / year',
			estimatedEffort: '2 Hours (~14 files)',
			confidence: '98.4%',
			recommendations: [
				'Extract direct SQL queries into asynchronous UserRepositoryDAL repository handlers.',
				'Integrate PgBouncer connection pool wrapper to limit socket contention.',
				'Deploy Redis L2 write-through cache for user permissions.',
			],
			suggestedActions: [
				{ label: 'Run Simulation Studio', href: '/simulate', icon: Play },
				{ label: 'Auto Patch Code', href: '/improve', icon: Sparkles },
				{ label: 'Open 3D Topology', href: '/architecture', icon: Layers },
			],
		},
		'auth-arch': {
			question: 'Explain the authentication architecture and security posture.',
			mode: 'Architecture Mode',
			executiveSummary:
				'AuthGateway Controller operates as a modular monolith microservice isolating OAuth2 JWT token issuance and user session verification. Cryptographic key rotation relies on RS256 token signing with sub-12ms average latency.',
			evidenceFile: 'AuthGateway/controller.ts:L38',
			evidenceSnippet: `export class AuthGatewayController {\n  async verifyToken(jwtToken: string): Promise<UserSession> {\n    return await this.cryptoVault.verifyRS256(jwtToken);\n  }\n}`,
			riskAssessment: 'Low Risk — SOC2 Type II Certified with Zero Active Critical CVEs',
			techDebtDrag: '$2.1k / year',
			estimatedEffort: '1 Hour',
			confidence: '99.1%',
			recommendations: [
				'Deploy Redis cluster token cache to scale validation throughput beyond 50k req/sec.',
				'Enforce automated RS256 key rotation every 30 days.',
			],
			suggestedActions: [
				{ label: 'Investigate Auth Flow', href: '/investigate', icon: Brain },
				{ label: 'View Security Posture', href: '/security', icon: ShieldCheck },
			],
		},
		'tech-debt-summary': {
			question: 'Summarize technical debt drag across all repositories.',
			mode: 'Technical Debt Mode',
			executiveSummary:
				'Total system technical debt drag is estimated at $18.5k/year, primarily concentrated in PaymentService (72%) and legacy Pydantic v1 config objects (18%). Decoupling inline SQL and updating configs reduces debt by 90%.',
			evidenceFile: 'PaymentService/dal.py & app/config.py',
			evidenceSnippet: `# Deprecated Pydantic V1 Config\nclass Settings(BaseSettings):\n    db_url: str = "postgresql://user:pass@localhost/db"`,
			riskAssessment: 'Medium Debt Drag — Refactoring payback period estimated at 3.2 days',
			techDebtDrag: '$18.5k / year',
			estimatedEffort: '4 Hours Total',
			confidence: '96.5%',
			recommendations: [
				'Execute automated patch to upgrade Pydantic v1 BaseSettings to v2 SettingsConfigDict.',
				'Decouple REST router SQL handlers into clean repository layer pattern.',
			],
			suggestedActions: [
				{ label: 'Open Technical Debt Hub', href: '/tech-debt', icon: Flame },
				{ label: 'Auto Patch All Debt', href: '/improve', icon: Sparkles },
			],
		},
	};

	const [activeQAKey, setActiveQAKey] = useState<string>('payment-slow');
	const activeQA = qaCatalog[activeQAKey] || qaCatalog['payment-slow'];

	const handleCopyReport = () => {
		navigator.clipboard.writeText(
			`CodeAtlas Staff Engineer Technical Briefing\nQuestion: ${activeQA.question}\nExecutive Summary: ${activeQA.executiveSummary}\nConfidence: ${activeQA.confidence}`
		);
		setCopiedReport(true);
		setTimeout(() => setCopiedReport(false), 2000);
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userInput.trim()) return;
		const inputLower = userInput.toLowerCase();
		if (inputLower.includes('auth') || inputLower.includes('security')) {
			setActiveQAKey('auth-arch');
			setActiveMode('Architecture Mode');
		} else if (inputLower.includes('debt') || inputLower.includes('summary')) {
			setActiveQAKey('tech-debt-summary');
			setActiveMode('Technical Debt Mode');
		} else {
			setActiveQAKey('payment-slow');
			setActiveMode('Performance Mode');
		}
		setUserInput('');
	};

	return (
		<div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-950 text-white font-sans overflow-hidden rounded-2xl border border-slate-800/90 shadow-2xl relative select-none">
			{/* ========================================================================= */}
			{/* TOP BAR: REPOSITORY, CONVERSATION & MODE SELECTOR */}
			{/* ========================================================================= */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/80 font-mono text-xs gap-3 shrink-0">
				<div className="flex flex-wrap items-center gap-3">
					<div className="flex items-center gap-2">
						<div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
							<Brain className="w-4 h-4 animate-pulse" />
						</div>
						<span className="font-extrabold text-white text-sm">AI Engineering Workspace</span>
					</div>

					{/* Repository Selector */}
					<select
						value={selectedRepo}
						onChange={(e) => setSelectedRepo(e.target.value)}
						className="bg-slate-950 text-slate-200 font-bold border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
					>
						<option value="CodeAtlas Core Suite">Repo: CodeAtlas Core Suite</option>
						<option value="Payments Microservice">Repo: Payments Microservice</option>
						<option value="Auth Gateway Pod">Repo: Auth Gateway Pod</option>
					</select>

					{/* Mode Selector Dropdown */}
					<select
						value={activeMode}
						onChange={(e) => setActiveMode(e.target.value as AIMode)}
						className="bg-slate-950 text-cyan-300 font-bold border border-cyan-500/40 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
					>
						{[
							'Architecture Mode',
							'Performance Mode',
							'Security Mode',
							'Technical Debt Mode',
							'Documentation Mode',
							'Testing Mode',
							'Migration Mode',
							'Simulation Mode',
							'Root Cause Analysis Mode',
							'AI CTO Mode',
						].map((mode) => (
							<option key={mode} value={mode} className="bg-slate-900 text-white font-mono">
								⚡ {mode}
							</option>
						))}
					</select>
				</div>

				<div className="flex items-center gap-3 text-slate-400 text-[11px]">
					<span>Branch: <strong className="text-cyan-400 font-bold">main</strong></span>
					<span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
						EVIDENCE GROUNDED
					</span>
				</div>
			</div>

			{/* Proactive Staff Engineer Notification Banner */}
			<div className="bg-purple-950/20 border-b border-purple-500/30 px-6 py-2 flex items-center justify-between text-xs font-mono shrink-0">
				<div className="flex items-center gap-2">
					<Sparkles className="w-4 h-4 text-purple-400" />
					<span className="font-bold text-purple-300">Proactive Staff Engineer Alert:</span>
					<span className="text-slate-300">
						PaymentService direct SQL queries inside route handlers increased technical debt drag by 14%.
					</span>
				</div>
				<Link href="/simulate">
					<Button size="sm" className="h-6 text-[10px] font-bold bg-purple-600 hover:bg-purple-500 text-white">
						Simulate Split &rarr;
					</Button>
				</Link>
			</div>

			{/* ========================================================================= */}
			{/* MAIN 3-PANEL REGION WORKSPACE */}
			{/* ========================================================================= */}
			<div className="flex flex-1 overflow-hidden">
				{/* ------------------------------------------------------------------------- */}
				{/* LEFT PANEL: ENGINEERING CONTEXT */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-72 border-r border-slate-800/80 bg-slate-950/90 p-4 flex flex-col justify-between shrink-0 font-mono text-xs space-y-4 overflow-y-auto">
					<div className="space-y-3">
						<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
							Active Engineering Context
						</span>

						{/* Preset Question Triggers */}
						<div className="space-y-1">
							<span className="text-[9px] text-slate-500 font-bold uppercase block">Preset Investigations</span>
							<button
								onClick={() => {
									setActiveQAKey('payment-slow');
									setActiveMode('Performance Mode');
								}}
								className={`w-full text-left p-2 rounded-xl border text-[11px] font-bold transition-all ${
									activeQAKey === 'payment-slow'
										? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
										: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
								}`}
							>
								⚡ Why is PaymentService slow?
							</button>
							<button
								onClick={() => {
									setActiveQAKey('auth-arch');
									setActiveMode('Architecture Mode');
								}}
								className={`w-full text-left p-2 rounded-xl border text-[11px] font-bold transition-all ${
									activeQAKey === 'auth-arch'
										? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
										: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
								}`}
							>
								🔒 Explain Auth Gateway Arch
							</button>
							<button
								onClick={() => {
									setActiveQAKey('tech-debt-summary');
									setActiveMode('Technical Debt Mode');
								}}
								className={`w-full text-left p-2 rounded-xl border text-[11px] font-bold transition-all ${
									activeQAKey === 'tech-debt-summary'
										? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
										: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
								}`}
							>
								🔥 Summarize Technical Debt
							</button>
						</div>

						<div className="space-y-2 pt-2 border-t border-slate-800">
							<div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-500 uppercase block font-bold">Current Repository</span>
								<span className="font-bold text-white">{selectedRepo}</span>
							</div>

							<div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-500 uppercase block font-bold">Architecture Type</span>
								<span className="font-bold text-purple-300">Event-Driven Async Microservices</span>
							</div>

							<div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-500 uppercase block font-bold">Health Score</span>
								<span className="font-bold text-emerald-400">88.5 Grade A-</span>
							</div>
						</div>
					</div>

					<div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500">
						<span>Context Synced with AST Indexer</span>
					</div>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* CENTER PANEL: STRUCTURED AI CONVERSATION CANVAS */}
				{/* ------------------------------------------------------------------------- */}
				<div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
					{/* Scrollable Conversation Briefing */}
					<div className="flex-1 overflow-y-auto p-6 space-y-6">
						{/* User Question Bubble */}
						<div className="flex items-start gap-3 font-mono">
							<div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 text-cyan-400">
								DEV
							</div>
							<div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-bold text-white">
								{activeQA.question}
							</div>
						</div>

						{/* AI Staff Engineer Report Briefing */}
						<div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-slate-900/80 space-y-4 shadow-xl">
							<div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
								<div className="flex items-center gap-2">
									<Brain className="w-5 h-5 text-cyan-400" />
									<h2 className="text-base font-black text-white">Staff Engineer Technical Briefing</h2>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xs text-emerald-400 font-bold">CONFIDENCE: {activeQA.confidence}</span>
									<button
										onClick={handleCopyReport}
										className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center gap-1 font-mono"
									>
										{copiedReport ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy Report
									</button>
								</div>
							</div>

							{/* Executive Summary */}
							<div className="space-y-2">
								<h3 className="text-xs font-black uppercase text-cyan-300 font-mono tracking-wider">
									1. Executive Summary
								</h3>
								<p className="text-xs text-slate-300 font-sans leading-relaxed">
									{activeQA.executiveSummary}
								</p>
							</div>

							{/* Grounded Repository Evidence */}
							<div className="space-y-2 font-mono text-xs">
								<h3 className="text-xs font-black uppercase text-purple-300 tracking-wider">
									2. Grounded Repository Evidence
								</h3>
								<div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
									<p className="text-cyan-400 font-bold">{activeQA.evidenceFile}</p>
									<pre className="text-[11px] text-slate-300 font-mono overflow-x-auto p-2 bg-slate-900/60 rounded">
										{activeQA.evidenceSnippet}
									</pre>
								</div>
							</div>

							{/* Risk Assessment & Metrics */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
								<div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
									<span className="text-[9px] text-slate-500 uppercase block font-bold">Technical Debt Drag</span>
									<span className="text-base font-black text-amber-400">{activeQA.techDebtDrag}</span>
								</div>
								<div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
									<span className="text-[9px] text-slate-500 uppercase block font-bold">Estimated Effort</span>
									<span className="text-base font-black text-cyan-300">{activeQA.estimatedEffort}</span>
								</div>
							</div>

							{/* Recommendations */}
							<div className="space-y-2 font-sans text-xs">
								<h3 className="text-xs font-black uppercase text-emerald-400 font-mono tracking-wider">
									3. Staff Engineering Recommendations
								</h3>
								<ul className="space-y-1.5 text-slate-300">
									{activeQA.recommendations.map((rec, i) => (
										<li key={i} className="flex items-start gap-2">
											<CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
											<span>{rec}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					{/* Natural Language Prompt Input Bar */}
					<form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-800 bg-slate-900/90 font-mono">
						<div className="relative flex items-center">
							<input
								type="text"
								value={userInput}
								onChange={(e) => setUserInput(e.target.value)}
								placeholder="Ask Staff AI: 'Why is payment slow?', 'Generate ADR', 'Show architectural bottlenecks'..."
								className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
							/>
							<button
								type="submit"
								className="absolute right-2 p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
							>
								<Send className="w-4 h-4" />
							</button>
						</div>
					</form>
				</div>

				{/* ------------------------------------------------------------------------- */}
				{/* RIGHT PANEL: INTERACTIVE EVIDENCE INSPECTOR */}
				{/* ------------------------------------------------------------------------- */}
				<div className="w-80 border-l border-slate-800/80 bg-slate-950/90 p-4 flex flex-col justify-between shrink-0 font-mono text-xs space-y-4 overflow-y-auto">
					<div className="space-y-4">
						<div className="border-b border-slate-800 pb-3">
							<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
								Interactive Evidence Inspector
							</span>
							<span className="text-[10px] text-slate-500">GROUNDED CODE CITATIONS</span>
						</div>

						{/* Referenced Files */}
						<div className="space-y-2">
							<span className="text-[10px] text-slate-400 font-bold uppercase block">Referenced Files</span>
							<div className="space-y-1 text-[11px]">
								<div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 hover:border-cyan-500/40 cursor-pointer">
									📄 {activeQA.evidenceFile}
								</div>
							</div>
						</div>

						{/* Mode & Risk Level */}
						<div className="space-y-2">
							<span className="text-[10px] text-slate-400 font-bold uppercase block">Risk & Confidence</span>
							<div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
								<span className="text-[9px] text-slate-500 uppercase block font-bold">Risk Assessment</span>
								<p className="text-amber-400 font-bold text-[11px] leading-snug">{activeQA.riskAssessment}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* BOTTOM PANEL: EXECUTABLE SMART ACTION BAR */}
			{/* ========================================================================= */}
			<div className="h-14 border-t border-slate-800 bg-slate-900 font-mono text-xs flex items-center justify-between px-6 shrink-0 gap-4">
				<span className="text-slate-400 font-bold text-[11px] shrink-0">EXECUTABLE ACTIONS:</span>

				<div className="flex items-center gap-2 overflow-x-auto">
					{activeQA.suggestedActions.map((action, idx) => {
						const ActionIcon = action.icon;
						return (
							<Link key={idx} href={action.href}>
								<Button
									size="sm"
									className="h-8 text-[11px] font-bold gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/50"
								>
									<ActionIcon className="w-3.5 h-3.5" />
									{action.label}
								</Button>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
