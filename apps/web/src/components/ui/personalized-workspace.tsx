'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
	Sliders,
	Building2,
	Palette,
	Keyboard,
	Bookmark,
	Star,
	LayoutDashboard,
	RotateCcw,
	Download,
	Upload,
	Check,
	Sparkles,
	Brain,
	Play,
	Layers,
	Search,
	ShieldCheck,
	Flame,
	HeartPulse,
	Clock,
	Settings,
	Plus,
	X,
	CheckCircle2,
	Eye,
	Command,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dashboard Preset Options
type DashboardPreset =
	| 'My Daily Work'
	| 'Architecture Review'
	| 'Security Center'
	| 'Performance Dashboard'
	| 'Technical Debt Dashboard'
	| 'AI Workspace'
	| 'Executive View'
	| 'Monitoring Center';

// Theme Options
type ThemeName = 'Dark' | 'Midnight' | 'Graphite' | 'Ocean' | 'Emerald' | 'Light';
type AccentColor = 'Cyan' | 'Indigo' | 'Purple' | 'Emerald' | 'Amber';

// Bookmark Schema
interface BookmarkItem {
	id: string;
	title: string;
	category: string;
	repo: string;
	tags: string[];
	timestamp: string;
}

// Custom Shortcut Schema
interface CustomShortcut {
	id: string;
	action: string;
	keys: string;
}

export function PersonalizedWorkspace() {
	// Active Dashboard Preset
	const [activePreset, setActivePreset] = useState<DashboardPreset>('My Daily Work');
	const [activeWorkspace, setActiveWorkspace] = useState<string>('Company Production');
	const [activeTheme, setActiveTheme] = useState<ThemeName>('Dark');
	const [activeAccent, setActiveAccent] = useState<AccentColor>('Cyan');
	const [exportedJSON, setExportedJSON] = useState<boolean>(false);

	// Bookmarks Data
	const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
		{
			id: 'bm-1',
			title: 'PaymentService Inline SQL Direct Execution Trace',
			category: 'Architecture',
			repo: 'codeatlas/payments-service',
			tags: ['SQL', 'Refactor', 'High Debt'],
			timestamp: '2 hours ago',
		},
		{
			id: 'bm-2',
			title: 'AuthGateway RS256 Key Rotation Security Audit',
			category: 'Security',
			repo: 'codeatlas/auth-gateway',
			tags: ['JWT', 'RS256', 'SOC2'],
			timestamp: '1 day ago',
		},
		{
			id: 'bm-3',
			title: 'Kafka Microservices Split Simulation Baseline',
			category: 'Simulation',
			repo: 'codeatlas/core-engine',
			tags: ['Kafka', 'Microservices', 'Event Bus'],
			timestamp: '3 days ago',
		},
	]);

	const [newBookmarkTitle, setNewBookmarkTitle] = useState<string>('');
	const [bookmarkSearch, setBookmarkSearch] = useState<string>('');

	// Custom Keyboard Shortcuts
	const [shortcuts, setShortcuts] = useState<CustomShortcut[]>([
		{ id: 'sc-1', action: 'Analyze Repository', keys: 'Ctrl + Shift + A' },
		{ id: 'sc-2', action: 'Open AI Investigation', keys: 'Ctrl + Shift + I' },
		{ id: 'sc-3', action: 'Launch Simulation Studio', keys: 'Ctrl + Shift + S' },
		{ id: 'sc-4', action: 'Open Monitoring Center', keys: 'Ctrl + Shift + M' },
		{ id: 'sc-5', action: 'View Repository Health', keys: 'Ctrl + Shift + H' },
	]);

	// Auto-save to localStorage
	useEffect(() => {
		const savedData = localStorage.getItem('codeatlas_personalized_config');
		if (savedData) {
			try {
				const parsed = JSON.parse(savedData);
				if (parsed.preset) setActivePreset(parsed.preset);
				if (parsed.theme) setActiveTheme(parsed.theme);
				if (parsed.accent) setActiveAccent(parsed.accent);
			} catch (e) {
				console.error(e);
			}
		}
	}, []);

	const handleSaveConfig = () => {
		localStorage.setItem(
			'codeatlas_personalized_config',
			JSON.stringify({
				preset: activePreset,
				workspace: activeWorkspace,
				theme: activeTheme,
				accent: activeAccent,
				bookmarks,
				shortcuts,
			})
		);
		setExportedJSON(true);
		setTimeout(() => setExportedJSON(false), 2000);
	};

	const handleAddBookmark = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newBookmarkTitle.trim()) return;
		setBookmarks((prev) => [
			{
				id: `bm-${Date.now()}`,
				title: newBookmarkTitle,
				category: 'Custom',
				repo: 'CodeAtlas Core Suite',
				tags: ['Personal'],
				timestamp: 'Just now',
			},
			...prev,
		]);
		setNewBookmarkTitle('');
	};

	const filteredBookmarks = bookmarks.filter(
		(bm) =>
			bm.title.toLowerCase().includes(bookmarkSearch.toLowerCase()) ||
			bm.tags.some((t) => t.toLowerCase().includes(bookmarkSearch.toLowerCase()))
	);

	return (
		<div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans select-none">
			{/* Top Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800/80 pb-5 font-mono">
				<div>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
							<Sliders className="w-5 h-5" />
						</div>
						<h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
							Personalized Developer Workspace & Preferences
						</h1>
					</div>
					<p className="text-xs text-slate-400 mt-1 font-sans">
						Custom engineering operating system remembering layouts, widgets, themes, keyboard shortcuts, favorites, and memory across sessions.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<Button
						onClick={handleSaveConfig}
						className="text-xs font-bold gap-2 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-950/50"
					>
						{exportedJSON ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
						{exportedJSON ? 'Layout Saved' : 'Save & Export Layout'}
					</Button>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* WORKSPACE MEMORY: CONTINUE WORKING BAR */}
			{/* ========================================================================= */}
			<div className="glass-card rounded-2xl p-4 border border-cyan-500/30 bg-slate-900/80 space-y-2 font-mono text-xs shadow-xl">
				<div className="flex items-center justify-between border-b border-slate-800 pb-2">
					<span className="font-extrabold text-cyan-300 flex items-center gap-2">
						<Clock className="w-4 h-4 text-cyan-400" /> Resume Previous Workspace Session
					</span>
					<span className="text-[10px] text-emerald-400 font-bold">AUTO RESTORED</span>
				</div>

				<div className="flex flex-wrap items-center justify-between text-slate-300 text-xs font-sans gap-2 pt-1">
					<div className="flex flex-wrap items-center gap-4 text-xs font-mono">
						<span>Last Repo: <strong className="text-white">CodeAtlas Core</strong></span>
						<span>Last File: <strong className="text-cyan-400">payment_router.py:L142</strong></span>
						<span>Active AI Investigation: <strong className="text-purple-300">Payment Bottleneck</strong></span>
					</div>

					<Link href="/investigate">
						<Button size="sm" className="h-7 text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white">
							Continue Working &rarr;
						</Button>
					</Link>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* MULTI-WORKSPACE SWITCHER & DASHBOARD PRESET SELECTOR */}
			{/* ========================================================================= */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
				{/* Multi-Workspace Selector */}
				<div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
					<span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block flex items-center gap-2">
						<Building2 className="w-4 h-4 text-cyan-400" /> Active Workspace Profile
					</span>

					<div className="grid grid-cols-2 gap-2 text-xs">
						{['Personal Workspace', 'Company Production', 'Open Source Guild', 'Research Lab'].map((ws) => (
							<button
								key={ws}
								onClick={() => setActiveWorkspace(ws)}
								className={`p-3 rounded-xl border font-bold text-left transition-all ${
									activeWorkspace === ws
										? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
										: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
								}`}
							>
								{ws}
							</button>
						))}
					</div>
				</div>

				{/* Custom Dashboard Preset Selector */}
				<div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
					<span className="text-[10px] font-black uppercase text-purple-400 tracking-wider block flex items-center gap-2">
						<LayoutDashboard className="w-4 h-4 text-purple-400" /> Custom Dashboard Preset
					</span>

					<div className="grid grid-cols-2 gap-2 text-xs">
						{[
							'My Daily Work',
							'Architecture Review',
							'Security Center',
							'Performance Dashboard',
							'Technical Debt Dashboard',
							'AI Workspace',
						].map((preset) => (
							<button
								key={preset}
								onClick={() => setActivePreset(preset as DashboardPreset)}
								className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
									activePreset === preset
										? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
										: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
								}`}
							>
								{preset}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* THEMES & ACCENT COLOR CUSTOMIZER */}
			{/* ========================================================================= */}
			<div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 font-mono">
				<span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block flex items-center gap-2">
					<Palette className="w-4 h-4 text-amber-400" /> Professional Themes & Accent Color System
				</span>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
					{/* Theme Picker */}
					<div className="space-y-2">
						<span className="text-slate-400 font-bold block">Theme Palette</span>
						<div className="flex flex-wrap gap-2">
							{['Dark', 'Midnight', 'Graphite', 'Ocean', 'Emerald', 'Light'].map((theme) => (
								<button
									key={theme}
									onClick={() => setActiveTheme(theme as ThemeName)}
									className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
										activeTheme === theme
											? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
											: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
									}`}
								>
									{theme}
								</button>
							))}
						</div>
					</div>

					{/* Accent Color Picker */}
					<div className="space-y-2">
						<span className="text-slate-400 font-bold block">Accent Highlight Color</span>
						<div className="flex flex-wrap gap-2">
							{['Cyan', 'Indigo', 'Purple', 'Emerald', 'Amber'].map((color) => (
								<button
									key={color}
									onClick={() => setActiveAccent(color as AccentColor)}
									className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
										activeAccent === color
											? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
											: 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
									}`}
								>
									{color}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* BOOKMARKS MANAGER & CUSTOM KEYBOARD SHORTCUTS */}
			{/* ========================================================================= */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
				{/* Searchable Bookmarks Manager */}
				<div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-2">
							<Bookmark className="w-4 h-4 text-cyan-400" /> Searchable Bookmarks Manager
						</span>
						<span className="text-[10px] text-slate-500">{bookmarks.length} Bookmarks</span>
					</div>

					{/* Add & Filter Bookmarks */}
					<form onSubmit={handleAddBookmark} className="relative flex items-center">
						<input
							type="text"
							value={newBookmarkTitle}
							onChange={(e) => setNewBookmarkTitle(e.target.value)}
							placeholder="Add new bookmark title..."
							className="w-full pl-3 pr-20 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
						/>
						<button
							type="submit"
							className="absolute right-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg"
						>
							Add
						</button>
					</form>

					<div className="relative">
						<Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
						<input
							type="text"
							value={bookmarkSearch}
							onChange={(e) => setBookmarkSearch(e.target.value)}
							placeholder="Search saved bookmarks..."
							className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
						/>
					</div>

					{/* Bookmarks List */}
					<div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
						{filteredBookmarks.map((bm) => (
							<div
								key={bm.id}
								className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 hover:border-cyan-500/40 transition-all"
							>
								<div className="flex items-center justify-between">
									<h4 className="font-bold text-white text-xs">{bm.title}</h4>
									<button
										onClick={() => setBookmarks((prev) => prev.filter((item) => item.id !== bm.id))}
										className="text-slate-500 hover:text-rose-400"
									>
										<X className="w-3.5 h-3.5" />
									</button>
								</div>
								<div className="flex items-center justify-between text-[10px] text-slate-400">
									<span>{bm.repo}</span>
									<span>{bm.timestamp}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Custom Keyboard Shortcuts Manager */}
				<div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
					<div className="flex items-center justify-between border-b border-slate-800 pb-3">
						<span className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-2">
							<Keyboard className="w-4 h-4 text-purple-400" /> Editable Keyboard Shortcuts Manager
						</span>
						<span className="text-[10px] text-slate-500">5 Active Hotkeys</span>
					</div>

					<div className="space-y-2 text-xs">
						{shortcuts.map((sc) => (
							<div
								key={sc.id}
								className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl"
							>
								<span className="font-bold text-slate-200">{sc.action}</span>
								<kbd className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-cyan-300 font-bold text-[11px]">
									{sc.keys}
								</kbd>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
