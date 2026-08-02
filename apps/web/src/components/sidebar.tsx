'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
                        LayoutDashboard,
                        BookOpen,
                        Search,
                        Layers,
                        FlaskConical,
                        Zap,
                        Sparkles,
                        ShieldAlert,
                        Compass,
                        Settings,
                        Orbit,
                        Cpu,
                        Building2,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface NavigationItem {
                        name: string;
                        href: string;
                        icon: React.ComponentType<any>;
                        isHeader?: boolean;
}

const navigation: NavigationItem[] = [
                        {
                                                name: 'Developer Workflows',
                                                href: '#',
                                                icon: LayoutDashboard,
                                                isHeader: true,
                        },
                        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
                        { name: 'Repositories', href: '/repositories', icon: BookOpen },
                        { name: 'Analyze', href: '/analyze', icon: Search },
                        { name: 'Architecture', href: '/architecture', icon: Layers },
                        { name: 'Investigate', href: '/investigate', icon: FlaskConical },
                        { name: 'Simulate', href: '/simulate', icon: Zap },
                        { name: 'Improve', href: '/improve', icon: Sparkles },
                        { name: 'Monitor', href: '/monitor', icon: ShieldAlert },
                        { name: 'Search', href: '/search', icon: Compass },
                        { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
                        isOpen: boolean;
                        setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
                        const pathname = usePathname();

                        return (
                                                <>
                                                                        {/* Mobile Backdrop */}
                                                                        {isOpen && (
                                                                                                <div
                                                                                                                        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                                                                                                                        onClick={() =>
                                                                                                                                                setIsOpen(
                                                                                                                                                                        false
                                                                                                                                                )
                                                                                                                        }
                                                                                                />
                                                                        )}

                                                                        {/* Sidebar container */}
                                                                        <div
                                                                                                className={cn(
                                                                                                                        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
                                                                                                                        isOpen
                                                                                                                                                ? 'translate-x-0'
                                                                                                                                                : '-translate-x-full'
                                                                                                )}
                                                                        >
                                                                                                {/* Logo Header */}
                                                                                                <div className="flex h-16 items-center border-b px-6 justify-between">
                                                                                                                        <Link
                                                                                                                                                href="/"
                                                                                                                                                className="flex items-center gap-2 font-semibold"
                                                                                                                        >
                                                                                                                                                <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                                                                                                                                                        CodeAtlas
                                                                                                                                                </span>
                                                                                                                        </Link>
                                                                                                                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                                                                                                                PLATFORM
                                                                                                                        </span>
                                                                                                </div>

                                                                                                {/* Nav Links */}
                                                                                                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                                                                                                                        {navigation.map(
                                                                                                                                                (
                                                                                                                                                                        item,
                                                                                                                                                                        idx
                                                                                                                                                ) => {
                                                                                                                                                                        if (
                                                                                                                                                                                                item.isHeader
                                                                                                                                                                        ) {
                                                                                                                                                                                                return (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        idx
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="pt-4 pb-1 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        item.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                );
                                                                                                                                                                        }

                                                                                                                                                                        const isActive =
                                                                                                                                                                                                pathname ===
                                                                                                                                                                                                                        item.href ||
                                                                                                                                                                                                (item.href !==
                                                                                                                                                                                                                        '/' &&
                                                                                                                                                                                                                        pathname?.startsWith(
                                                                                                                                                                                                                                                item.href
                                                                                                                                                                                                                        ));

                                                                                                                                                                        return (
                                                                                                                                                                                                <Link
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                item.name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        href={
                                                                                                                                                                                                                                                item.href
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setIsOpen(
                                                                                                                                                                                                                                                                        false
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={cn(
                                                                                                                                                                                                                                                'flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all',
                                                                                                                                                                                                                                                isActive
                                                                                                                                                                                                                                                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                                                                                                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <item.icon
                                                                                                                                                                                                                                                className={cn(
                                                                                                                                                                                                                                                                        'h-4 w-4',
                                                                                                                                                                                                                                                                        isActive
                                                                                                                                                                                                                                                                                                ? 'text-primary'
                                                                                                                                                                                                                                                                                                : 'text-muted-foreground'
                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                        />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        item.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </Link>
                                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                        )}
                                                                                                </div>

                                                                                                {/* Footer */}
                                                                                                <div className="border-t p-4 text-[11px] text-muted-foreground flex justify-between items-center">
                                                                                                                        <span>
                                                                                                                                                Software
                                                                                                                                                Intelligence
                                                                                                                        </span>
                                                                                                                        <span
                                                                                                                                                className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                                                                                                                                title="System Online"
                                                                                                                        />
                                                                                                </div>
                                                                        </div>
                                                </>
                        );
}
