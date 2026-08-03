'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { ProtectedRoute } from './protected-route';
import { useAuth } from '@/context/auth-context';
import { useTour } from '@/context/tour-context';
import { Button } from '@/components/ui/button';
import {
	Menu,
	Search,
	Bell,
	Sparkles,
	LogOut,
	User,
	Command,
	Activity,
	GitBranch,
	ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useAuth();

	const isAuthPage = pathname?.startsWith('/login');

	const getTitle = () => {
		if (!pathname || pathname === '/') return 'Dashboard Workflow';
		if (pathname.startsWith('/repositories')) return 'Repositories Workflow';
		if (pathname.startsWith('/analyze')) return 'Analyze Workflow';
		if (pathname.startsWith('/architecture')) return 'Architecture Workflow';
		if (pathname.startsWith('/investigate')) return 'Investigate Workflow';
		if (pathname.startsWith('/simulate')) return 'Simulate Workflow';
		if (pathname.startsWith('/improve')) return 'Improve Workflow';
		if (pathname.startsWith('/monitor')) return 'Monitor Workflow';
		if (pathname.startsWith('/search')) return 'Search Workflow';
		if (pathname.startsWith('/settings')) return 'Platform Settings';
		return 'Software Intelligence Platform';
	};

	if (isAuthPage) {
		return <>{children}</>;
	}

	return (
		<ProtectedRoute>
			<div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
				{/* Sidebar Component */}
				<Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

				{/* Main Content Area */}
				<div className="flex flex-1 flex-col overflow-hidden relative">
					{/* Top Header */}
					<header className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 z-30">
						{/* Left Title & Mobile Menu */}
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="icon"
								className="lg:hidden bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
								onClick={() => setSidebarOpen(true)}
								title="Open sidebar"
							>
								<Menu className="h-5 w-5" />
							</Button>
							<div>
								<div className="flex items-center gap-2">
									<h1 className="text-base font-black tracking-tight text-white">{getTitle()}</h1>
									<span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
										<ShieldCheck className="w-3 h-3" /> SOC2 Verified
									</span>
								</div>
							</div>
						</div>

						{/* Center Search Command Palette Trigger */}
						<div className="hidden md:flex items-center flex-1 max-w-md mx-6">
							<button
								onClick={() => router.push('/search')}
								className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs hover:border-cyan-500/40 hover:text-slate-200 transition-all shadow-inner"
							>
								<div className="flex items-center gap-2">
									<Search className="w-3.5 h-3.5 text-cyan-400" />
									<span>Search AST symbols, repos, analysis...</span>
								</div>
								<kbd className="flex items-center gap-0.5 text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
									<Command className="w-3 h-3" /> K
								</kbd>
							</button>
						</div>

						{/* Right Actions & Profile */}
						<div className="flex items-center gap-3">
							<Link
								href="/search"
								className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
							>
								<Search className="w-4 h-4 text-cyan-400" />
							</Link>

							<button
								onClick={() => router.push('/monitor')}
								className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
								title="Notifications"
							>
								<Bell className="w-4 h-4 text-slate-300" />
								<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
								<span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
							</button>

							{user && (
								<div className="flex items-center gap-3 border-l border-slate-800/80 pl-3">
									<div className="flex items-center gap-2.5">
										{user.avatar_url ? (
											<img
												src={user.avatar_url}
												alt={user.username || 'User'}
												className="h-8 w-8 rounded-xl object-cover ring-1 ring-cyan-500/30"
											/>
										) : (
											<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-xs font-black text-white shadow-md shadow-cyan-500/20">
												{user.username?.charAt(0).toUpperCase() || 'U'}
											</div>
										)}
										<div className="hidden xl:flex flex-col">
											<span className="text-xs font-bold text-white leading-none">
												{user.username || 'Engineer'}
											</span>
											<span className="text-[10px] text-cyan-400 font-mono leading-tight">
												Lead Staff
											</span>
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={logout}
										className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
										title="Sign out"
									>
										<LogOut className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>
					</header>

					{/* Viewport Content */}
					<main className="flex-1 overflow-y-auto p-6 bg-slate-950">{children}</main>
				</div>
			</div>
		</ProtectedRoute>
	);
}
