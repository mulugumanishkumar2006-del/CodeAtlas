'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
                        Activity,
                        LayoutDashboard,
                        BarChart3,
                        Settings,
                        ShieldAlert,
                        HeartPulse,
                        Layers,
                        Brain,
                        Flame,
                        BookOpen,
                        Clock,
                        Cpu,
                        Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
                        name: string;
                        href: string;
                        icon: React.ComponentType<any>;
                        isHeader?: boolean;
                        isSub?: boolean;
}

const navigation: NavigationItem[] = [
                        {
                                                name: '🏥 Health Intelligence',
                                                href: '/health-intelligence',
                                                icon: Activity,
                                                isHeader: true,
                        },
                        { name: 'Overview', href: '/', icon: LayoutDashboard },
                        { name: 'Software City', href: '/software-city', icon: Map },
                        { name: 'Architecture', href: '/architecture', icon: Layers },
                        { name: 'Knowledge', href: '/knowledge', icon: BookOpen },
                        { name: 'Reliability', href: '/reliability', icon: HeartPulse },
                        { name: 'Technical Debt', href: '/tech-debt', icon: Flame },
                        {
                                                name: 'Governance',
                                                href: '/architecture?tab=governance',
                                                icon: ShieldAlert,
                        },
                        { name: 'AI Architect', href: '/architect', icon: Cpu },
                        {
                                                name: '⭐ Health Diagnostics',
                                                href: '/health-intelligence',
                                                icon: Activity,
                                                isHeader: true,
                        },
                        { name: 'Health ⭐', href: '/health-intelligence', icon: Activity },
                        {
                                                name: 'Executive Dashboard',
                                                href: '/health-intelligence?tab=executive',
                                                icon: LayoutDashboard,
                        },
                        {
                                                name: 'CTO Dashboard',
                                                href: '/health-intelligence?tab=cto',
                                                icon: BarChart3,
                        },
];

interface SidebarProps {
                        isOpen: boolean;
                        setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
                        const pathname = usePathname();
                        const searchParams = useSearchParams();
                        const currentTab = searchParams?.get('tab');

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
                                                                                                <div className="flex h-16 items-center border-b px-6">
                                                                                                                        <Link
                                                                                                                                                href="/"
                                                                                                                                                className="flex items-center gap-2 font-semibold"
                                                                                                                        >
                                                                                                                                                <span className="text-xl font-bold tracking-tight text-primary">
                                                                                                                                                                        CodeAtlas
                                                                                                                                                </span>
                                                                                                                        </Link>
                                                                                                </div>

                                                                                                <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
                                                                                                                        {navigation.map(
                                                                                                                                                (
                                                                                                                                                                        item
                                                                                                                                                ) => {
                                                                                                                                                                        if (
                                                                                                                                                                                                item.isHeader
                                                                                                                                                                        ) {
                                                                                                                                                                                                return (
                                                                                                                                                                                                                        <div
                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                        item.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                className="px-3 pt-5 pb-2 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-2 border-t border-white/5 mt-4 first:mt-0 first:border-0"
                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                <item.icon className="h-3.5 w-3.5 text-primary/70" />
                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                        item.name
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                );
                                                                                                                                                                        }

                                                                                                                                                                        // Calculate active state by route path and tab query parameter
                                                                                                                                                                        const isRouteMatch =
                                                                                                                                                                                                pathname ===
                                                                                                                                                                                                item.href.split(
                                                                                                                                                                                                                        '?'
                                                                                                                                                                                                )[0];
                                                                                                                                                                        const queryParamsStr =
                                                                                                                                                                                                item.href.split(
                                                                                                                                                                                                                        '?'
                                                                                                                                                                                                )[1] ||
                                                                                                                                                                                                '';
                                                                                                                                                                        const queryTab =
                                                                                                                                                                                                new URLSearchParams(
                                                                                                                                                                                                                        queryParamsStr
                                                                                                                                                                                                ).get(
                                                                                                                                                                                                                        'tab'
                                                                                                                                                                                                );

                                                                                                                                                                        const isActive =
                                                                                                                                                                                                isRouteMatch &&
                                                                                                                                                                                                (queryTab
                                                                                                                                                                                                                        ? currentTab ===
                                                                                                                                                                                                                          queryTab
                                                                                                                                                                                                                        : !currentTab);

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
                                                                                                                                                                                                                                                'group flex items-center rounded-md transition-all duration-150',
                                                                                                                                                                                                                                                item.isSub
                                                                                                                                                                                                                                                                        ? 'pl-8 py-2 text-xs font-semibold'
                                                                                                                                                                                                                                                                        : 'px-3 py-2.5 text-sm font-semibold',
                                                                                                                                                                                                                                                isActive
                                                                                                                                                                                                                                                                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                                                                                                                                                                                                                                                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {!item.isSub && (
                                                                                                                                                                                                                                                <item.icon
                                                                                                                                                                                                                                                                        className="mr-3 h-5 w-5 flex-shrink-0"
                                                                                                                                                                                                                                                                        aria-hidden="true"
                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                item.name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </Link>
                                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                        )}
                                                                                                </nav>
                                                                        </div>
                                                </>
                        );
}
