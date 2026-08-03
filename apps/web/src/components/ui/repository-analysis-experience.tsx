'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
	GitBranch,
	FolderGit2,
	Server,
	HardDrive,
	Sparkles,
	CheckCircle2,
	Clock,
	FileCode,
	Cpu,
	Layers,
	Code2,
	Database,
	Network,
	Activity,
	Shield,
	Flame,
	ArrowRight,
	Star,
	ExternalLink,
	Eye,
	Building2,
	Zap,
	ShieldCheck,
	Terminal,
	AlertTriangle,
	Play,
	RefreshCw,
	ChevronRight,
	X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface RepositoryAnalysisExperienceProps {
	onClose?: () => void;
	onComplete?: (repoData: any) => void;
	initialRepoName?: string;
	mode?: 'modal' | 'embedded';
}

type ProviderType = 'github' | 'gitlab' | 'azure' | 'local';

interface RepoMetadata {
	name: string;
	owner: string;
	language: string;
	stars: string;
	branches: number;
	size: string;
	estimatedScanTime: string;
	pathOrUrl: string;
}

export function RepositoryAnalysisExperience({
	onClose,
	onComplete,
	initialRepoName = 'CodeAtlas Core Engine',
	mode = 'modal',
}: RepositoryAnalysisExperienceProps) {
	// Step state: 'import' -> 'analyzing' -> 'completed'
	const [step, setStep] = useState<'import' | 'analyzing' | 'completed'>('import');
	const [provider, setProvider] = useState<ProviderType>('github');

	// Step 1: Repository metadata form state
	const [selectedPreset, setSelectedPreset] = useState<string>('codeatlas/core-engine');
	const [repoUrlInput, setRepoUrlInput] = useState<string>('https://github.com/codeatlas/core-engine');
	const [localPathInput, setLocalPathInput] = useState<string>('C:/Projects/CodeAtlas');

	// Dynamic Metadata Preview State
	const [metadata, setMetadata] = useState<RepoMetadata>({
		name: 'CodeAtlas Core Engine',
		owner: 'codeatlas',
		language: 'TypeScript / Python',
		stars: '1.4k',
		branches: 18,
		size: '24.8 MB',
		estimatedScanTime: '~12 seconds',
		pathOrUrl: 'codeatlas/core-engine',
	});

	// Step 2 & 3: Timeline & Live Counters State
	const [timelineIndex, setTimelineIndex] = useState<number>(0);
	const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

	// 12 Live Animated Stat Counters
	const [stats, setStats] = useState({
		files: 0,
		classes: 0,
		functions: 0,
		modules: 0,
		services: 0,
		dependencies: 0,
		restApis: 0,
		graphqlApis: 0,
		databases: 0,
		configFiles: 0,
		tests: 0,
		docsFiles: 0,
	});

	// Step 4: AI Thinking Panel Feed
	const [aiFeed, setAiFeed] = useState<string[]>([]);
	const aiFeedEndRef = useRef<HTMLDivElement>(null);

	// Target stats to count up to
	const targetStats = {
		files: 284,
		classes: 142,
		functions: 890,
		modules: 36,
		services: 12,
		dependencies: 348,
		restApis: 42,
		graphqlApis: 18,
		databases: 5,
		configFiles: 24,
		tests: 118,
		docsFiles: 15,
	};

	// 14 Pipeline Steps
	const timelineSteps = [
		{ id: 'step-1', label: 'Repository Connected', icon: GitBranch },
		{ id: 'step-2', label: 'Repository Cloned', icon: Database },
		{ id: 'step-3', label: 'Languages Detected', icon: Code2 },
		{ id: 'step-4', label: 'Parsing Source Code', icon: FileCode },
		{ id: 'step-5', label: 'Building AST', icon: Cpu },
		{ id: 'step-6', label: 'Discovering APIs', icon: Server },
		{ id: 'step-7', label: 'Discovering Services', icon: Layers },
		{ id: 'step-8', label: 'Finding Databases', icon: Database },
		{ id: 'step-9', label: 'Creating Dependency Graph', icon: Network },
		{ id: 'step-10', label: 'Building Knowledge Graph', icon: Activity },
		{ id: 'step-11', label: 'Running AI', icon: Sparkles },
		{ id: 'step-12', label: 'Detecting Technical Debt', icon: Flame },
		{ id: 'step-13', label: 'Calculating Repository Health', icon: ShieldCheck },
		{ id: 'step-14', label: 'Generating Recommendations', icon: Zap },
	];

	// Continuous AI Agent Activities
	const aiActivities = [
		'Connecting to remote repository worker & loading git tree...',
		'Detecting multi-language source AST structures...',
		'Analyzing authentication flow & JWT validation gateways...',
		'Finding architecture boundaries across modular packages...',
		'Calculating cyclomatic complexity & maintainability index...',
		'Searching for duplicated code patterns across service layers...',
		'Building software knowledge graph & AST edge embeddings...',
		'Detecting risky dependencies & open vulnerabilities...',
		'Evaluating database connection pools & ORM query isolation...',
		'Synthesizing architectural debt drag & priority refactoring map...',
		'Generating AI architecture summary & automated action items...',
	];

	// Update metadata preview when provider or inputs change
	useEffect(() => {
		if (provider === 'github') {
			setMetadata({
				name: selectedPreset.split('/')[1] || 'core-engine',
				owner: selectedPreset.split('/')[0] || 'codeatlas',
				language: selectedPreset.includes('auth') ? 'TypeScript / Go' : selectedPreset.includes('payments') ? 'Python / SQL' : 'TypeScript / Python',
				stars: selectedPreset.includes('core') ? '1.4k' : selectedPreset.includes('auth') ? '890' : '450',
				branches: selectedPreset.includes('core') ? 18 : 6,
				size: selectedPreset.includes('core') ? '24.8 MB' : '9.4 MB',
				estimatedScanTime: '~10 - 12 seconds',
				pathOrUrl: repoUrlInput || `https://github.com/${selectedPreset}`,
			});
		} else if (provider === 'gitlab') {
			setMetadata({
				name: 'gitlab-enterprise-suite',
				owner: 'atlas-org',
				language: 'Rust / TypeScript',
				stars: '620',
				branches: 12,
				size: '31.2 MB',
				estimatedScanTime: '~14 seconds',
				pathOrUrl: 'https://gitlab.com/atlas-org/gitlab-enterprise-suite',
			});
		} else if (provider === 'azure') {
			setMetadata({
				name: 'azure-cloud-infra',
				owner: 'enterprise-team',
				language: 'C# / Bicep / TS',
				stars: 'N/A (Private)',
				branches: 24,
				size: '42.1 MB',
				estimatedScanTime: '~15 seconds',
				pathOrUrl: 'https://dev.azure.com/enterprise-team/azure-cloud-infra',
			});
		} else {
			setMetadata({
				name: localPathInput.split('/').pop() || 'Local Repository',
				owner: 'Local Workstation',
				language: 'Multi-language (Auto-detect)',
				stars: 'Local',
				branches: 4,
				size: '18.5 MB',
				estimatedScanTime: '~8 seconds',
				pathOrUrl: localPathInput,
			});
		}
	}, [provider, selectedPreset, repoUrlInput, localPathInput]);

	// Start analysis workflow simulation
	const startAnalysis = () => {
		setStep('analyzing');
		setTimelineIndex(0);
		setElapsedSeconds(0);
		setAiFeed([aiActivities[0]]);

		// Reset stats
		setStats({
			files: 0,
			classes: 0,
			functions: 0,
			modules: 0,
			services: 0,
			dependencies: 0,
			restApis: 0,
			graphqlApis: 0,
			databases: 0,
			configFiles: 0,
			tests: 0,
			docsFiles: 0,
		});
	};

	// Timer ticker during analysis
	useEffect(() => {
		if (step !== 'analyzing') return;

		// Timer for elapsed seconds
		const timer = setInterval(() => {
			setElapsedSeconds((prev) => +(prev + 0.1).toFixed(1));
		}, 100);

		// Step timeline progress interval
		const stepTimer = setInterval(() => {
			setTimelineIndex((prev) => {
				const next = prev + 1;
				if (next < timelineSteps.length) {
					// Add AI activity feed entry periodically
					const aiMsgIndex = Math.min(next, aiActivities.length - 1);
					setAiFeed((feed) => [...feed, aiActivities[aiMsgIndex]]);
					return next;
				} else {
					clearInterval(stepTimer);
					// Transition to completion after step finishes
					setTimeout(() => {
						setStep('completed');
						if (onComplete) {
							onComplete(metadata);
						}
					}, 800);
					return prev;
				}
			});
		}, 650);

		// Increment stat counters dynamically
		const statTimer = setInterval(() => {
			setStats((current) => ({
				files: Math.min(targetStats.files, current.files + Math.floor(Math.random() * 22 + 10)),
				classes: Math.min(targetStats.classes, current.classes + Math.floor(Math.random() * 12 + 5)),
				functions: Math.min(targetStats.functions, current.functions + Math.floor(Math.random() * 60 + 25)),
				modules: Math.min(targetStats.modules, current.modules + Math.floor(Math.random() * 4 + 2)),
				services: Math.min(targetStats.services, current.services + Math.floor(Math.random() * 2 + 1)),
				dependencies: Math.min(targetStats.dependencies, current.dependencies + Math.floor(Math.random() * 28 + 12)),
				restApis: Math.min(targetStats.restApis, current.restApis + Math.floor(Math.random() * 4 + 2)),
				graphqlApis: Math.min(targetStats.graphqlApis, current.graphqlApis + Math.floor(Math.random() * 2 + 1)),
				databases: Math.min(targetStats.databases, current.databases + (current.databases < targetStats.databases ? 1 : 0)),
				configFiles: Math.min(targetStats.configFiles, current.configFiles + Math.floor(Math.random() * 3 + 1)),
				tests: Math.min(targetStats.tests, current.tests + Math.floor(Math.random() * 10 + 4)),
				docsFiles: Math.min(targetStats.docsFiles, current.docsFiles + Math.floor(Math.random() * 2 + 1)),
			}));
		}, 250);

		return () => {
			clearInterval(timer);
			clearInterval(stepTimer);
			clearInterval(statTimer);
		};
	}, [step]);

	// Auto-scroll AI Feed
	useEffect(() => {
		aiFeedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [aiFeed]);

	const percentComplete = Math.round(((timelineIndex + 1) / timelineSteps.length) * 100);

	return (
		<div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-slate-800/90 bg-slate-950/95 backdrop-blur-2xl text-white shadow-2xl overflow-hidden font-sans">
			{/* Top Modal Header */}
			<div className="flex items-center justify-between px-7 py-5 border-b border-slate-800/80 bg-slate-900/40">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
						<Sparkles className="w-5 h-5 animate-pulse" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h2 className="text-lg font-black tracking-tight text-white">
								CodeAtlas Deep Repository Analysis
							</h2>
							<span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
								INTELLIGENT AST PIPELINE
							</span>
						</div>
						<p className="text-xs text-slate-400 mt-0.5">
							{step === 'import' && 'Connect a repository source to extract structural DNA & architecture graphs.'}
							{step === 'analyzing' && 'Live continuous parsing of classes, dependencies, APIs, and microservices.'}
							{step === 'completed' && 'Analysis complete! Architectural insight model generated successfully.'}
						</p>
					</div>
				</div>

				{onClose && (
					<button
						onClick={onClose}
						className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
						title="Close workflow"
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>

			{/* ========================================================================= */}
			{/* STEP 1: REPOSITORY IMPORT ONBOARDING EXPERIENCE */}
			{/* ========================================================================= */}
			{step === 'import' && (
				<div className="p-7 space-y-8 animate-fadeIn">
					{/* Onboarding Provider Selector Tabs */}
					<div className="space-y-3">
						<label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider block">
							Select Repository Provider
						</label>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							<button
								type="button"
								onClick={() => setProvider('github')}
								className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-xs font-bold transition-all ${
									provider === 'github'
										? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/40'
										: 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-white'
								}`}
							>
								<FolderGit2 className="w-5 h-5 text-cyan-400" /> GitHub
							</button>

							<button
								type="button"
								onClick={() => setProvider('gitlab')}
								className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-xs font-bold transition-all ${
									provider === 'gitlab'
										? 'bg-orange-500/15 border-orange-400 text-orange-200 shadow-lg shadow-orange-950/50 ring-1 ring-orange-400/40'
										: 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-white'
								}`}
							>
								<FolderGit2 className="w-5 h-5 text-orange-400" /> GitLab
							</button>

							<button
								type="button"
								onClick={() => setProvider('azure')}
								className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-xs font-bold transition-all ${
									provider === 'azure'
										? 'bg-blue-500/15 border-blue-400 text-blue-200 shadow-lg shadow-blue-950/50 ring-1 ring-blue-400/40'
										: 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-white'
								}`}
							>
								<Server className="w-5 h-5 text-blue-400" /> Azure DevOps
							</button>

							<button
								type="button"
								onClick={() => setProvider('local')}
								className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-xs font-bold transition-all ${
									provider === 'local'
										? 'bg-emerald-500/15 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/40'
										: 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-white'
								}`}
							>
								<HardDrive className="w-5 h-5 text-emerald-400" /> Local Repository
							</button>
						</div>
					</div>

					{/* Repository Selection Inputs */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Left Column: Repository Selection Controls */}
						<div className="space-y-5">
							{provider === 'github' && (
								<div className="space-y-4">
									<div>
										<label className="text-xs font-bold text-slate-300 block mb-1.5">
											Select Existing Workspace Repository
										</label>
										<select
											value={selectedPreset}
											onChange={(e) => {
												setSelectedPreset(e.target.value);
												setRepoUrlInput(`https://github.com/${e.target.value}`);
											}}
											className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
										>
											<option value="codeatlas/core-engine">codeatlas/core-engine (TypeScript / Python)</option>
											<option value="codeatlas/auth-gateway">codeatlas/auth-gateway (TypeScript / Go)</option>
											<option value="codeatlas/payments-service">codeatlas/payments-service (Python / SQL)</option>
										</select>
									</div>

									<div>
										<label className="text-xs font-bold text-slate-300 block mb-1.5">
											Or Connect GitHub Repository URL
										</label>
										<input
											type="text"
											value={repoUrlInput}
											onChange={(e) => setRepoUrlInput(e.target.value)}
											placeholder="https://github.com/owner/repository"
											className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
										/>
									</div>
								</div>
							)}

							{provider === 'gitlab' && (
								<div className="space-y-4">
									<div>
										<label className="text-xs font-bold text-slate-300 block mb-1.5">
											GitLab Repository Path or URL
										</label>
										<input
											type="text"
											value={repoUrlInput}
											onChange={(e) => setRepoUrlInput(e.target.value)}
											placeholder="https://gitlab.com/group/project"
											className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
										/>
									</div>
									<div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-300 flex items-center gap-2">
										<CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
										Connected to GitLab Enterprise OAuth Integration
									</div>
								</div>
							)}

							{provider === 'azure' && (
								<div className="space-y-4">
									<div>
										<label className="text-xs font-bold text-slate-300 block mb-1.5">
											Azure DevOps Repo URL
										</label>
										<input
											type="text"
											value={repoUrlInput}
											onChange={(e) => setRepoUrlInput(e.target.value)}
											placeholder="https://dev.azure.com/org/project/_git/repo"
											className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
										/>
									</div>
									<div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 flex items-center gap-2">
										<CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
										Azure DevOps Personal Access Token (PAT) Validated
									</div>
								</div>
							)}

							{provider === 'local' && (
								<div className="space-y-4">
									<div>
										<label className="text-xs font-bold text-slate-300 block mb-1.5">
											Local Workspace File Path
										</label>
										<input
											type="text"
											value={localPathInput}
											onChange={(e) => setLocalPathInput(e.target.value)}
											placeholder="C:/Users/name/Projects/my-app"
											className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
										/>
									</div>
									<div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
										<HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
										Direct local filesystem indexer initialized
									</div>
								</div>
							)}
						</div>

						{/* Right Column: Live Repository Metadata Preview Card */}
						<div className="glass-card rounded-2xl p-5 space-y-4 border border-cyan-500/30 bg-slate-900/60 relative">
							<div className="flex items-center justify-between border-b border-slate-800 pb-3">
								<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider font-mono">
									Instant Metadata Preview
								</span>
								<span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> READY
								</span>
							</div>

							<div className="space-y-3 font-mono">
								<div className="flex justify-between items-baseline">
									<span className="text-xs text-slate-400">Repository Name:</span>
									<span className="text-sm font-black text-white">{metadata.name}</span>
								</div>
								<div className="flex justify-between items-baseline">
									<span className="text-xs text-slate-400">Owner / Org:</span>
									<span className="text-xs font-bold text-cyan-300">{metadata.owner}</span>
								</div>
								<div className="flex justify-between items-baseline">
									<span className="text-xs text-slate-400">Primary Language:</span>
									<span className="text-xs font-bold text-indigo-300">{metadata.language}</span>
								</div>
								<div className="flex justify-between items-baseline">
									<span className="text-xs text-slate-400">Stars:</span>
									<span className="text-xs font-bold text-amber-300 flex items-center gap-1">
										<Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {metadata.stars}
									</span>
								</div>
								<div className="flex justify-between items-baseline">
									<span className="text-xs text-slate-400">Active Branches:</span>
									<span className="text-xs font-bold text-purple-300">{metadata.branches} branches</span>
								</div>
								<div className="flex justify-between items-baseline">
									<span className="text-xs text-slate-400">Repository Size:</span>
									<span className="text-xs font-bold text-emerald-300">{metadata.size}</span>
								</div>
								<div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
									<span className="text-xs text-slate-400">Estimated Scan Time:</span>
									<span className="text-xs font-black text-cyan-400">{metadata.estimatedScanTime}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Step 1 Action Bar */}
					<div className="flex justify-end pt-4 border-t border-slate-800/80">
						<Button
							onClick={startAnalysis}
							className="px-8 py-3 text-sm font-bold bg-gradient-to-r from-cyan-600 via-indigo-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-xl shadow-xl shadow-cyan-950/60 gap-2.5 transition-all"
						>
							<Sparkles className="w-4 h-4" /> Start Deep Architecture Analysis <ArrowRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			)}

			{/* ========================================================================= */}
			{/* STEP 2, 3, 4: INTERACTIVE ANALYSIS TIMELINE, LIVE COUNTERS & AI THINKING */}
			{/* ========================================================================= */}
			{step === 'analyzing' && (
				<div className="p-7 space-y-7 animate-fadeIn">
					{/* Progress Overview Bar */}
					<div className="glass-card rounded-2xl p-5 border border-cyan-500/40 bg-slate-900/70 space-y-4">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
							<div>
								<span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 font-mono">
									Stage {timelineIndex + 1} of {timelineSteps.length}
								</span>
								<h3 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
									Analyzing <span className="text-cyan-300 font-mono">{metadata.name}</span>
								</h3>
							</div>

							<div className="flex items-center gap-4 font-mono">
								<div className="text-right">
									<span className="text-xs text-slate-400 block">Elapsed Time</span>
									<span className="text-base font-black text-cyan-300">{elapsedSeconds}s</span>
								</div>
								<div className="text-right">
									<span className="text-xs text-slate-400 block">Completion</span>
									<span className="text-base font-black text-emerald-400">{percentComplete}%</span>
								</div>
							</div>
						</div>

						{/* Animated Gradient Shimmer Progress Bar */}
						<div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800 relative">
							<div
								className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full transition-all duration-300 ease-out relative"
								style={{ width: `${percentComplete}%` }}
							>
								<div className="absolute inset-0 bg-white/20 animate-shimmer" />
							</div>
						</div>
					</div>

					{/* Main Grid: Interactive Analysis Timeline (Left 2 Cols) + AI Thinking Panel (Right 1 Col) */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* STEP 2: Live Timeline Grid (2 Cols) */}
						<div className="lg:col-span-2 space-y-3">
							<span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono block">
								Live Analysis Timeline
							</span>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
								{timelineSteps.map((s, idx) => {
									const isCompleted = idx < timelineIndex;
									const isCurrent = idx === timelineIndex;

									return (
										<div
											key={s.id}
											className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${
												isCompleted
													? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 shadow-sm'
													: isCurrent
														? 'bg-cyan-950/50 border-cyan-400/80 text-cyan-200 shadow-lg shadow-cyan-950/80 animate-pulse-glow ring-1 ring-cyan-400/50'
														: 'bg-slate-900/40 border-slate-800/60 text-slate-500'
											}`}
										>
											{isCompleted ? (
												<CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
											) : isCurrent ? (
												<RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
											) : (
												<s.icon className="w-4 h-4 text-slate-600 shrink-0" />
											)}
											<span className="truncate">{s.label}</span>
										</div>
									);
								})}
							</div>
						</div>

						{/* STEP 4: AI Thinking Panel (1 Col) */}
						<div className="glass-card rounded-2xl p-4 border border-indigo-500/30 bg-slate-900/80 flex flex-col justify-between space-y-3 min-h-[300px]">
							<div className="flex items-center justify-between border-b border-slate-800 pb-2">
								<span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider font-mono flex items-center gap-1.5">
									<Terminal className="w-3.5 h-3.5 text-indigo-400" /> AI Thinking Panel
								</span>
								<span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
							</div>

							<div className="space-y-2 overflow-y-auto max-h-[220px] font-mono text-[11px] text-slate-300 pr-1">
								{aiFeed.map((msg, i) => (
									<div key={i} className="flex items-start gap-2 leading-relaxed">
										<span className="text-cyan-400 font-bold shrink-0">&gt;</span>
										<span className="text-slate-300">{msg}</span>
									</div>
								))}
								<div ref={aiFeedEndRef} />
							</div>

							<div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
								<span>Model: CodeAtlas-AGI-7B</span>
								<span className="text-emerald-400">STATUS: ACTIVE</span>
							</div>
						</div>
					</div>

					{/* STEP 3: 12 LIVE COUNTERS GRID */}
					<div className="space-y-3">
						<span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono block">
							Live Entity Discovery Counters
						</span>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Files</span>
								<span className="text-xl font-black text-cyan-300 font-mono">{stats.files}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Classes</span>
								<span className="text-xl font-black text-indigo-300 font-mono">{stats.classes}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Functions</span>
								<span className="text-xl font-black text-purple-300 font-mono">{stats.functions}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Modules</span>
								<span className="text-xl font-black text-blue-300 font-mono">{stats.modules}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Services</span>
								<span className="text-xl font-black text-emerald-300 font-mono">{stats.services}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Dependencies</span>
								<span className="text-xl font-black text-pink-300 font-mono">{stats.dependencies}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">REST APIs</span>
								<span className="text-xl font-black text-teal-300 font-mono">{stats.restApis}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">GraphQL APIs</span>
								<span className="text-xl font-black text-violet-300 font-mono">{stats.graphqlApis}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Databases</span>
								<span className="text-xl font-black text-amber-300 font-mono">{stats.databases}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Config Files</span>
								<span className="text-xl font-black text-sky-300 font-mono">{stats.configFiles}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Tests</span>
								<span className="text-xl font-black text-rose-300 font-mono">{stats.tests}</span>
							</div>
							<div className="glass-card rounded-2xl p-3 border border-slate-800 text-center space-y-1">
								<span className="text-[9px] font-mono font-bold text-slate-400 uppercase block truncate">Docs Files</span>
								<span className="text-xl font-black text-lime-300 font-mono">{stats.docsFiles}</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* ========================================================================= */}
			{/* STEP 5: BEAUTIFUL COMPLETION SCREEN */}
			{/* ========================================================================= */}
			{step === 'completed' && (
				<div className="p-7 space-y-8 animate-fadeIn">
					{/* Celebration Header */}
					<div className="glass-card rounded-2xl p-6 border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-cyan-950/40 space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
									<CheckCircle2 className="w-7 h-7" />
								</div>
								<div>
									<h3 className="text-2xl font-black text-white">Repository Successfully Analyzed</h3>
									<p className="text-xs text-slate-300 font-mono mt-0.5">
										Target: <strong className="text-cyan-300">{metadata.name}</strong> • Completed in{' '}
										<strong className="text-emerald-400">{elapsedSeconds}s</strong>
									</p>
								</div>
							</div>
							<span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
								100% KNOWLEDGE INDEXED
							</span>
						</div>
					</div>

					{/* 5-Metric Highlights HUD Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
						<div className="glass-card rounded-2xl p-4 border border-emerald-500/30 text-center space-y-1">
							<span className="text-[9px] font-bold text-slate-400 uppercase block">Repository Health</span>
							<span className="text-2xl font-black text-emerald-400">92/100</span>
							<span className="text-[10px] text-emerald-300 block font-bold">Grade A</span>
						</div>

						<div className="glass-card rounded-2xl p-4 border border-cyan-500/30 text-center space-y-1">
							<span className="text-[9px] font-bold text-slate-400 uppercase block">Architecture Type</span>
							<span className="text-sm font-black text-cyan-300 block truncate">Modular Monolith</span>
							<span className="text-[10px] text-cyan-400 block">High Cohesion</span>
						</div>

						<div className="glass-card rounded-2xl p-4 border border-indigo-500/30 text-center space-y-1">
							<span className="text-[9px] font-bold text-slate-400 uppercase block">Risk Level</span>
							<span className="text-sm font-black text-emerald-400 block">LOW</span>
							<span className="text-[10px] text-slate-400 block">0 Critical CVEs</span>
						</div>

						<div className="glass-card rounded-2xl p-4 border border-amber-500/30 text-center space-y-1">
							<span className="text-[9px] font-bold text-slate-400 uppercase block">Technical Debt</span>
							<span className="text-xl font-black text-amber-400">$14.2k</span>
							<span className="text-[10px] text-slate-400 block">/ year drag</span>
						</div>

						<div className="glass-card rounded-2xl p-4 border border-purple-500/30 text-center space-y-1">
							<span className="text-[9px] font-bold text-slate-400 uppercase block">Dependencies</span>
							<span className="text-xl font-black text-purple-300">348</span>
							<span className="text-[10px] text-purple-400 block">Cataloged</span>
						</div>
					</div>

					{/* AI Architecture Summary Box */}
					<div className="glass-card rounded-2xl p-5 border border-indigo-500/30 bg-slate-900/60 space-y-2">
						<div className="flex items-center gap-2">
							<Sparkles className="w-4 h-4 text-indigo-400" />
							<h4 className="text-xs font-black uppercase text-indigo-300 font-mono tracking-wider">
								AI Architecture Summary
							</h4>
						</div>
						<p className="text-xs text-slate-300 leading-relaxed">
							CodeAtlas verified robust architectural boundaries with isolated REST gateways and AST entities. Direct database call isolation is strong, with mild recommendation to migrate legacy Pydantic v1 config objects.
						</p>
					</div>

					{/* Top Prioritized Recommendations */}
					<div className="space-y-3">
						<span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono block">
							Top Recommendations
						</span>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
								<div className="flex items-center justify-between">
									<span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-mono font-bold border border-amber-500/20">
										HIGH PRIORITY
									</span>
									<span className="text-xs font-mono text-emerald-400 font-bold">-$8.4k/yr Debt</span>
								</div>
								<h5 className="text-xs font-bold text-white">Decouple REST Router SQL Queries in Payment Gateway</h5>
								<p className="text-[11px] text-slate-400 leading-snug">
									Move inline SQL queries to data access repository services to increase test coverage.
								</p>
							</div>

							<div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2">
								<div className="flex items-center justify-between">
									<span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px] font-mono font-bold border border-cyan-500/20">
										PERFORMANCE
									</span>
									<span className="text-xs font-mono text-cyan-300 font-bold">+350% Throughput</span>
								</div>
								<h5 className="text-xs font-bold text-white">Deploy Redis Cluster for Auth JWT Validation Caching</h5>
								<p className="text-[11px] text-slate-400 leading-snug">
									Eliminate database lock contention during 50k req/sec peak loads.
								</p>
							</div>
						</div>
					</div>

					{/* Required Completion Navigation Buttons */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
						<Link href="/architecture" className="w-full">
							<Button className="w-full h-11 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl gap-2 shadow-lg shadow-cyan-950/50">
								<Building2 className="w-4 h-4" /> Explore Architecture
							</Button>
						</Link>

						<Link href="/repositories" className="w-full">
							<Button className="w-full h-11 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl gap-2 shadow-lg shadow-indigo-950/50">
								<FolderGit2 className="w-4 h-4" /> View Repository
							</Button>
						</Link>

						<Link href="/investigate" className="w-full">
							<Button className="w-full h-11 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-2 shadow-lg shadow-emerald-950/50">
								<Zap className="w-4 h-4" /> Start Investigation
							</Button>
						</Link>

						<Link href="/dependency-graph" className="w-full">
							<Button className="w-full h-11 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl gap-2 shadow-lg shadow-purple-950/50">
								<Network className="w-4 h-4" /> Open Knowledge Graph
							</Button>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
