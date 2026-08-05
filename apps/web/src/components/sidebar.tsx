'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	LayoutDashboard,
	BookOpen,
	Search,
	Layers,
	Network,
	FlaskConical,
	Zap,
	Sparkles,
	ShieldAlert,
	Compass,
	FileText,
	Settings,
	ChevronDown,
	Building2,
	ChevronLeft,
	ChevronRight,
	Star,
	Clock,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface NavigationItem {
	name: string;
	href: string;
	icon: React.ComponentType<any>;
	shortcut: string;
	isHeader?: boolean;
}

const navigation: NavigationItem[] = [
	{ name: 'WORKSPACE', href: '#', icon: LayoutDashboard, shortcut: '', isHeader: true },
	{ name: 'Dashboard', href: '/', icon: LayoutDashboard, shortcut: '⌘1' },
	{ name: 'Repositories', href: '/repositories', icon: BookOpen, shortcut: '⌘2' },
	{ name: 'Analyze', href: '/analyze', icon: Search, shortcut: '⌘3' },
	{ name: 'Architecture', href: '/architecture', icon: Layers, shortcut: '⌘4' },
	{ name: 'Dependency Graph', href: '/dependency-graph', icon: Network, shortcut: '⌘G' },
	{ name: 'Investigate', href: '/investigate', icon: FlaskConical, shortcut: '⌘5' },
	{ name: 'Simulation', href: '/simulate', icon: Zap, shortcut: '⌘6' },
	{ name: 'Improve', href: '/improve', icon: Sparkles, shortcut: '⌘7' },
	{ name: 'Monitor', href: '/monitor', icon: ShieldAlert, shortcut: '⌘8' },
	{ name: 'Search', href: '/search', icon: Compass, shortcut: '⌘9' },
	{ name: 'Documentation', href: '/knowledge', icon: FileText, shortcut: '⌘D' },
	{ name: 'Settings', href: '/settings', icon: Settings, shortcut: '⌘S' },
];

interface SidebarProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);

	return (
		<>
			{/* Mobile Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar container */}
			<div
				className={cn(
					'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 font-sans select-none',
					isCollapsed ? 'w-20' : 'w-64',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				{/* Logo Header */}
				<div className="flex h-16 items-center border-b border-slate-800/80 px-4 justify-between shrink-0">
					<Link href="/" className="flex items-center gap-3 group">
						<div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
							<div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
								<Sparkles className="w-4 h-4 text-cyan-400" />
							</div>
						</div>
						{!isCollapsed && (
							<div className="flex flex-col">
								<span className="text-base font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
									CodeAtlas
								</span>
								<span className="text-[9px] font-bold text-slate-500 tracking-wider font-mono">
									INTEL PLATFORM
								</span>
							</div>
						)}
					</Link>

					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
						title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
					>
						{isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
					</button>
				</div>

				{/* Workspace Switcher */}
				{!isCollapsed && (
					<div className="px-3 pt-3 shrink-0">
						<div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800/90 bg-slate-900/50 hover:bg-slate-900 transition-colors cursor-pointer group font-mono">
							<div className="flex items-center gap-2.5">
								<div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
									<Building2 className="w-3.5 h-3.5 text-indigo-400" />
								</div>
								<div className="flex flex-col">
									<span className="text-xs font-bold text-white leading-none">CodeAtlas Prod</span>
									<span className="text-[10px] text-slate-500 leading-tight">Primary Workspace</span>
								</div>
							</div>
							<ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
						</div>
					</div>
				)}

				{/* Navigation Links */}
				<div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-none font-mono">
					{navigation.map((item, idx) => {
						if (item.isHeader) {
							if (isCollapsed) return null;
							return (
								<div
									key={idx}
									className="pt-3 pb-1 px-3 text-[10px] font-black uppercase tracking-widest text-slate-500"
								>
									{item.name}
								</div>
							);
						}

						const isActive =
							pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

						return (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className={cn(
									'flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all group relative',
									isActive
										? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-200 border border-cyan-500/30 shadow-md shadow-cyan-950/50 font-bold'
										: 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
								)}
								title={isCollapsed ? item.name : undefined}
							>
								{isActive && (
									<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-lg shadow-cyan-400/50" />
								)}
								<div className="flex items-center gap-3">
									<item.icon
										className={cn(
											'h-4 w-4 transition-colors shrink-0',
											isActive
												? 'text-cyan-400'
												: 'text-slate-500 group-hover:text-slate-300'
										)}
									/>
									{!isCollapsed && <span>{item.name}</span>}
								</div>
								{!isCollapsed && item.shortcut && (
									<kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-500 bg-slate-900/80 border border-slate-800 rounded group-hover:text-slate-400 transition-colors">
										{item.shortcut}
									</kbd>
								)}
							</Link>
						);
					})}
				</div>

				{/* Pinned Favorites Quick Access */}
				{!isCollapsed && (
					<div className="px-3 py-2 border-t border-slate-800/80 space-y-1 font-mono shrink-0">
						<span className="px-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
							<Star className="w-3 h-3 text-amber-400" /> Favorites
						</span>
						<Link
							href="/investigate"
							className="flex items-center gap-2 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> PaymentService Trace
						</Link>
						<Link
							href="/simulate"
							className="flex items-center gap-2 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Kafka Microservices Sim
						</Link>
					</div>
				)}

				{/* Footer Live Status */}
				<div className="border-t border-slate-800/80 p-3 text-[11px] text-slate-400 flex justify-between items-center bg-slate-950/80 shrink-0 font-mono">
					<div className="flex items-center gap-2">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						</span>
						{!isCollapsed && <span className="font-semibold text-slate-300">Live AI Engine</span>}
					</div>
					{!isCollapsed && <span className="font-mono text-[10px] text-emerald-400 font-bold">READY</span>}
				</div>
			</div>
		</>
	);
}
