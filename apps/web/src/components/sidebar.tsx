'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
                        { name: 'Overview', href: '/', icon: LayoutDashboard },
                        { name: 'Architecture', href: '/architecture', icon: Layers },
                        { name: 'Knowledge', href: '/knowledge', icon: BookOpen },
                        { name: 'Time Machine', href: '/time-machine', icon: Clock },
                        { name: 'Technical Debt', href: '/tech-debt', icon: Flame },
                        {
                                                name: 'Governance',
                                                href: '/architecture?tab=governance',
                                                icon: ShieldAlert,
                        },
                        { name: 'Future Simulator', href: '/simulator', icon: Brain },
                        { name: 'Bug Forecast', href: '/reliability', icon: ShieldAlert },
                        { name: '⭐ AI Software Architect', href: '/architect', icon: Cpu },
                        {
                                                name: '  • Architecture Review',
                                                href: '/architect?tab=review',
                                                icon: Cpu,
                        },
                        { name: '  • Sprint Planner', href: '/architect?tab=sprints', icon: Cpu },
                        {
                                                name: '  • Recommendations',
                                                href: '/architect?tab=recommendations',
                                                icon: Cpu,
                        },
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

                                                                                                <nav className="flex-1 space-y-1 px-4 py-4">
                                                                                                                        {navigation.map(
                                                                                                                                                (
                                                                                                                                                                        item
                                                                                                                                                ) => {
                                                                                                                                                                        const isActive =
                                                                                                                                                                                                pathname ===
                                                                                                                                                                                                item.href;
                                                                                                                                                                        return (
                                                                                                                                                                                                <Link
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                item.name
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        href={
                                                                                                                                                                                                                                                item.href
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={cn(
                                                                                                                                                                                                                                                'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                                                                                                                                                                                                                                                isActive
                                                                                                                                                                                                                                                                        ? 'bg-primary text-primary-foreground'
                                                                                                                                                                                                                                                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                                                                                                                                                                                        )}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <item.icon
                                                                                                                                                                                                                                                className="mr-3 h-5 w-5 flex-shrink-0"
                                                                                                                                                                                                                                                aria-hidden="true"
                                                                                                                                                                                                                        />
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
