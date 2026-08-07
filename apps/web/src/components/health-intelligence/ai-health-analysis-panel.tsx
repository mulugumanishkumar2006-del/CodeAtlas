'use client';

import * as React from 'react';
import {
	Search,
	Filter,
	AlertOctagon,
	AlertTriangle,
	Info,
	CheckCircle,
	FileCode,
	Code2,
	Clock,
	Sparkles,
	ChevronRight,
	ExternalLink,
	Zap,
	Layers,
	ShieldAlert,
	ArrowRight,
	Copy,
	Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HealthIssue {
	id: string;
	title: string;
	category:
		| 'Architecture'
		| 'Circular Dependencies'
		| 'Code Duplication'
		| 'Dead Code'
		| 'Large Classes/Functions'
		| 'Security'
		| 'Performance'
		| 'Documentation'
		| 'CI/CD Readiness';
	severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
	businessImpact: string;
	technicalExplanation: string;
	evidenceFile: string;
	evidenceLines: string;
	evidenceSnippet: string;
	confidence: number; // 0..100
	suggestedFix: string;
	fixDiffSnippet?: string;
	estimatedEffort: string; // e.g., "2 hrs", "1.5 days"
	affectedModule: string;
}

const SAMPLE_ISSUES: HealthIssue[] = [
	{
		id: 'issue-101',
		title: 'Tight Circular Dependency Cycle in Payment Gateway Subsystem',
		category: 'Circular Dependencies',
		severity: 'CRITICAL',
		businessImpact: 'Prevents independent service deployment, creates high risk of cascading failures during runtime configuration updates.',
		technicalExplanation: 'PaymentProcessor imports CheckoutManager which directly depends on TransactionLogger and calls back into PaymentProcessor constructor during initialization.',
		evidenceFile: 'src/services/payment/processor.ts',
		evidenceLines: 'L45-L62',
		evidenceSnippet: `import { CheckoutManager } from '../checkout/manager';\nexport class PaymentProcessor {\n  private manager = new CheckoutManager(this);\n}`,
		confidence: 98,
		suggestedFix: 'Extract IPaymentContext interface into a shared domain contracts folder and introduce event-driven dependency injection.',
		fixDiffSnippet: `- import { CheckoutManager } from '../checkout/manager';\n+ import { IPaymentContext } from '@/domain/contracts/payment';`,
		estimatedEffort: '1.5 days',
		affectedModule: 'payment-subsystem',
	},
	{
		id: 'issue-102',
		title: 'God Class Anti-Pattern: OrderProcessingEngine Exceeds 1,850 LOC',
		category: 'Large Classes/Functions',
		severity: 'HIGH',
		businessImpact: 'High maintenance cost, extreme developer friction, and high probability of introducing regression bugs during feature releases.',
		technicalExplanation: 'OrderProcessingEngine violates Single Responsibility Principle by managing state, database persistence, invoice generation, and email notifications in a single class.',
		evidenceFile: 'src/core/order/engine.ts',
		evidenceLines: 'L1-L1850',
		evidenceSnippet: `export class OrderProcessingEngine {\n  // Contains 42 internal methods handling persistence, tax, PDF building, and webhook dispatches.\n}`,
		confidence: 95,
		suggestedFix: 'Decompose OrderProcessingEngine into distinct strategy services: OrderValidator, InvoiceBuilder, and NotificationDispatcher.',
		fixDiffSnippet: `- export class OrderProcessingEngine { ... }\n+ export class OrderValidator { ... }\n+ export class InvoiceBuilder { ... }`,
		estimatedEffort: '2.5 days',
		affectedModule: 'order-engine',
	},
	{
		id: 'issue-103',
		title: 'Unsanitized Dynamic Query Construction in Analytics Service',
		category: 'Security',
		severity: 'CRITICAL',
		businessImpact: 'Severe SQL injection vulnerability allowing unauthorized database read and write access.',
		technicalExplanation: 'Raw SQL string formatting is used with unescaped user filter parameters instead of parameterized queries or ORM query builders.',
		evidenceFile: 'src/db/queries/analytics_raw.py',
		evidenceLines: 'L112-L118',
		evidenceSnippet: `query = f"SELECT * FROM metrics WHERE tenant_id = '{user_tenant}' AND filter = '{user_filter}'"`,
		confidence: 100,
		suggestedFix: 'Replace string formatting with parameterized query bindings in SQLAlchemy or asyncpg.',
		fixDiffSnippet: `- query = f"SELECT * FROM metrics WHERE tenant_id = '{user_tenant}'"\n+ query = text("SELECT * FROM metrics WHERE tenant_id = :tenant").bindparams(tenant=user_tenant)`,
		estimatedEffort: '3 hrs',
		affectedModule: 'analytics-db',
	},
	{
		id: 'issue-104',
		title: 'Dead Code: Legacy Payment v1 Adapter Remains active in bundle',
		category: 'Dead Code',
		severity: 'MEDIUM',
		businessImpact: 'Increases client JS bundle size by 180KB and creates security audit noise.',
		technicalExplanation: 'LegacyV1PaymentAdapter is zero-referenced across the entire codebase but included in the main entry point build tree.',
		evidenceFile: 'src/legacy/v1_adapter.ts',
		evidenceLines: 'L1-L430',
		evidenceSnippet: `/** @deprecated */\nexport class LegacyV1PaymentAdapter { ... }`,
		confidence: 92,
		suggestedFix: 'Safely remove the file and update export index files to strip dead exports.',
		fixDiffSnippet: `- export { LegacyV1PaymentAdapter } from './v1_adapter';`,
		estimatedEffort: '1 hr',
		affectedModule: 'legacy-adapters',
	},
	{
		id: 'issue-105',
		title: 'Duplicate JWT Verification Logic Across 6 Microservices',
		category: 'Code Duplication',
		severity: 'HIGH',
		businessImpact: 'Inconsistent security enforcement across services and quadrupled maintenance overhead for key rotation.',
		technicalExplanation: 'Copy-pasted JWT parsing logic found in auth-service, user-service, billing-service, and reporting-service with subtle key validation differences.',
		evidenceFile: 'packages/auth-utils/src/jwt.ts',
		evidenceLines: 'L12-L89',
		evidenceSnippet: `// Duplicate implementation found in 6 distinct service paths`,
		confidence: 96,
		suggestedFix: 'Consolidate JWT verification into @codeatlas/auth-core shared package.',
		fixDiffSnippet: `+ import { verifyToken } from '@codeatlas/auth-core';`,
		estimatedEffort: '1 day',
		affectedModule: 'auth-vault',
	},
];

interface AIHealthAnalysisPanelProps {
	onInspectFile?: (filePath: string) => void;
}

export function AIHealthAnalysisPanel({ onInspectFile }: AIHealthAnalysisPanelProps) {
	const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
	const [selectedSeverity, setSelectedSeverity] = React.useState<string>('ALL');
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [expandedIssueId, setExpandedIssueId] = React.useState<string>('issue-101');
	const [copiedId, setCopiedId] = React.useState<string | null>(null);

	const categories = [
		'ALL',
		'Circular Dependencies',
		'Large Classes/Functions',
		'Security',
		'Dead Code',
		'Code Duplication',
		'Performance',
		'Documentation',
		'CI/CD Readiness',
	];

	const severities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

	const filteredIssues = SAMPLE_ISSUES.filter((issue) => {
		const matchCategory = selectedCategory === 'ALL' || issue.category === selectedCategory;
		const matchSeverity = selectedSeverity === 'ALL' || issue.severity === selectedSeverity;
		const matchSearch =
			searchQuery === '' ||
			issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			issue.evidenceFile.toLowerCase().includes(searchQuery.toLowerCase()) ||
			issue.technicalExplanation.toLowerCase().includes(searchQuery.toLowerCase());
		return matchCategory && matchSeverity && matchSearch;
	});

	const handleCopySnippet = (text: string, id: string) => {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	return (
		<div className="space-y-6 font-mono">
			{/* Top Filters & Search Control */}
			<div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
				<div className="flex-1 relative">
					<Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						placeholder="Filter AI health analysis issues by keyword, file, or pattern..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
					/>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
						<Filter className="w-3.5 h-3.5 text-cyan-400" />
						<span className="text-slate-400">Category:</span>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="bg-transparent text-white focus:outline-none cursor-pointer"
						>
							{categories.map((c) => (
								<option key={c} value={c} className="bg-slate-900 text-white">
									{c}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
						<span className="text-slate-400">Severity:</span>
						<select
							value={selectedSeverity}
							onChange={(e) => setSelectedSeverity(e.target.value)}
							className="bg-transparent text-white focus:outline-none cursor-pointer"
						>
							{severities.map((s) => (
								<option key={s} value={s} className="bg-slate-900 text-white">
									{s}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Main Split View: Issues List & Detailed Inspector */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Left Issues Feed (5 Cols) */}
				<div className="lg:col-span-5 space-y-3">
					<div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
						<span>Found {filteredIssues.length} AI Diagnostics</span>
						<span>Sorted by Severity</span>
					</div>

					<div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
						{filteredIssues.map((issue) => {
							const isSelected = expandedIssueId === issue.id;
							const isCritical = issue.severity === 'CRITICAL';
							const isHigh = issue.severity === 'HIGH';

							return (
								<button
									key={issue.id}
									onClick={() => setExpandedIssueId(issue.id)}
									className={cn(
										'w-full text-left p-4 rounded-2xl transition-all border shadow-md relative overflow-hidden group',
										isSelected
											? 'bg-slate-900 border-cyan-500/50 shadow-cyan-950/40 ring-1 ring-cyan-500/30'
											: 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
									)}
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2">
											<span
												className={cn(
													'px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider',
													isCritical && 'bg-rose-950/80 text-rose-300 border border-rose-500/40',
													isHigh && 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
													!isCritical && !isHigh && 'bg-slate-800 text-slate-300'
												)}
											>
												{issue.severity}
											</span>
											<span className="text-[10px] text-slate-500">{issue.category}</span>
										</div>

										<span className="text-[10px] font-bold text-cyan-400">
											{issue.confidence}% confidence
										</span>
									</div>

									<h4 className="text-xs font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
										{issue.title}
									</h4>

									<div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
										<span className="flex items-center gap-1 font-mono truncate max-w-[200px]">
											<FileCode className="w-3 h-3 text-slate-500 shrink-0" />
											{issue.evidenceFile}
										</span>
										<span className="flex items-center gap-1 text-slate-400">
											<Clock className="w-3 h-3 text-purple-400" />
											Effort: {issue.estimatedEffort}
										</span>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Right Issue Inspector Detail Panel (7 Cols) */}
				<div className="lg:col-span-7">
					{(() => {
						const issue = SAMPLE_ISSUES.find((i) => i.id === expandedIssueId) || SAMPLE_ISSUES[0];
						const isCritical = issue.severity === 'CRITICAL';
						const isHigh = issue.severity === 'HIGH';

						return (
							<div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
								<div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
									<Sparkles className="w-32 h-32 text-cyan-400" />
								</div>

								{/* Inspector Header */}
								<div>
									<div className="flex items-center gap-2 mb-2">
										<span
											className={cn(
												'px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider',
												isCritical && 'bg-rose-950 text-rose-300 border border-rose-500/40',
												isHigh && 'bg-amber-950 text-amber-300 border border-amber-500/40',
												!isCritical && !isHigh && 'bg-slate-800 text-slate-300'
											)}
										>
											{issue.severity} SEVERITY
										</span>
										<span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-bold">
											{issue.category}
										</span>
										<span className="text-xs text-purple-400 font-bold ml-auto flex items-center gap-1">
											<Clock className="w-3.5 h-3.5" /> Effort: {issue.estimatedEffort}
										</span>
									</div>

									<h3 className="text-lg font-black text-white">{issue.title}</h3>
								</div>

								{/* Business Impact Box */}
								<div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1">
									<div className="flex items-center gap-2 text-xs font-bold text-amber-400">
										<AlertTriangle className="w-4 h-4" /> Business & Engineering Impact
									</div>
									<p className="text-xs text-slate-300 leading-relaxed">
										{issue.businessImpact}
									</p>
								</div>

								{/* Technical Explanation */}
								<div className="space-y-1.5">
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
										Technical Deep Dive & Architecture Smell
									</h4>
									<p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
										{issue.technicalExplanation}
									</p>
								</div>

								{/* Code Evidence Snippet */}
								<div className="space-y-2">
									<div className="flex items-center justify-between text-xs font-bold text-slate-400">
										<span className="flex items-center gap-1.5">
											<FileCode className="w-4 h-4 text-cyan-400" /> Evidence: {issue.evidenceFile} ({issue.evidenceLines})
										</span>
										<button
											onClick={() => onInspectFile && onInspectFile(issue.evidenceFile)}
											className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
										>
											Open File <ExternalLink className="w-3 h-3" />
										</button>
									</div>
									<div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-cyan-200 overflow-x-auto">
										<button
											onClick={() => handleCopySnippet(issue.evidenceSnippet, 'evidence')}
											className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
										>
											{copiedId === 'evidence' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
										</button>
										<pre className="text-[11px] leading-relaxed">{issue.evidenceSnippet}</pre>
									</div>
								</div>

								{/* AI Suggested Fix & Diff */}
								<div className="space-y-2">
									<div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
										<Sparkles className="w-4 h-4" /> AI Suggested Refactoring Strategy
									</div>
									<p className="text-xs text-slate-300">{issue.suggestedFix}</p>

									{issue.fixDiffSnippet && (
										<div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
											<pre className="text-[11px] leading-relaxed text-slate-300">
												{issue.fixDiffSnippet.split('\n').map((line, idx) => (
													<div
														key={idx}
														className={cn(
															line.startsWith('+') && 'text-emerald-400 font-bold bg-emerald-950/30 px-1 rounded',
															line.startsWith('-') && 'text-rose-400 font-bold bg-rose-950/30 px-1 rounded'
														)}
													>
														{line}
													</div>
												))}
											</pre>
										</div>
									)}
								</div>

								{/* Action Buttons */}
								<div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
									<div className="flex items-center gap-2 text-xs text-slate-400">
										<span>AI Confidence: <strong className="text-cyan-400">{issue.confidence}%</strong></span>
									</div>
									<Button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs px-4 py-2 rounded-xl">
										<span>Apply AI Automated Fix</span>
										<ArrowRight className="w-3.5 h-3.5" />
									</Button>
								</div>
							</div>
						);
					})()}
				</div>
			</div>
		</div>
	);
}
