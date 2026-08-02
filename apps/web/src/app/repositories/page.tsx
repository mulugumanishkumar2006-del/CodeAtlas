'use client';

import * as React from 'react';
import Link from 'next/link';
import {
                        BookOpen,
                        GitBranch,
                        Plus,
                        RefreshCw,
                        CheckCircle2,
                        Clock,
                        Layers,
                        FileCode,
                        ChevronRight,
                        ExternalLink,
                        ShieldCheck,
                        Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { IndexingProgress } from '@/components/ui/indexing-progress';

export default function RepositoriesWorkflowPage() {
                        const { token } = useAuth();
                        const [repositories, setRepositories] = React.useState<any[]>([]);
                        const [selectedRepo, setSelectedRepo] = React.useState<any>(null);
                        const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
                        const [isIndexing, setIsIndexing] = React.useState<boolean>(false);
                        const [newRepoName, setNewRepoName] = React.useState<string>('');
                        const [newFullName, setNewFullName] = React.useState<string>('');

                        const mockRepos = [
                                                {
                                                                        id: 'repo-1',
                                                                        name: 'CodeAtlas Core Engine',
                                                                        full_name: 'codeatlas/core-engine',
                                                                        language: 'Python / TypeScript',
                                                                        files: 142,
                                                                        loc: 24500,
                                                                        health: '88.5 / 100',
                                                                        status: 'INDEXED',
                                                                        last_scan: '10 mins ago',
                                                                        branch: 'main',
                                                },
                                                {
                                                                        id: 'repo-2',
                                                                        name: 'Auth Gateway Pod',
                                                                        full_name: 'codeatlas/auth-gateway',
                                                                        language: 'TypeScript / Go',
                                                                        files: 68,
                                                                        loc: 9200,
                                                                        health: '94.0 / 100',
                                                                        status: 'INDEXED',
                                                                        last_scan: '1 hour ago',
                                                                        branch: 'main',
                                                },
                                                {
                                                                        id: 'repo-3',
                                                                        name: 'Payments Microservice',
                                                                        full_name: 'codeatlas/payments-service',
                                                                        language: 'Python / SQL',
                                                                        files: 85,
                                                                        loc: 14100,
                                                                        health: '91.2 / 100',
                                                                        status: 'INDEXED',
                                                                        last_scan: '3 hours ago',
                                                                        branch: 'main',
                                                },
                        ];

                        React.useEffect(() => {
                                                if (!token) return;
                                                fetch('/api/v1/repositories', {
                                                                        headers: {
                                                                                                Authorization: `Bearer ${token}`,
                                                                        },
                                                })
                                                                        .then((res) => res.json())
                                                                        .then((data) => {
                                                                                                const repos =
                                                                                                                        Array.isArray(
                                                                                                                                                data
                                                                                                                        )
                                                                                                                                                ? data
                                                                                                                                                : data.items ||
                                                                                                                                                  [];
                                                                                                if (
                                                                                                                        repos.length >
                                                                                                                        0
                                                                                                ) {
                                                                                                                        setRepositories(
                                                                                                                                                repos
                                                                                                                        );
                                                                                                                        setSelectedRepo(
                                                                                                                                                repos[0]
                                                                                                                        );
                                                                                                } else {
                                                                                                                        setRepositories(
                                                                                                                                                mockRepos
                                                                                                                        );
                                                                                                                        setSelectedRepo(
                                                                                                                                                mockRepos[0]
                                                                                                                        );
                                                                                                }
                                                                        })
                                                                        .catch(() => {
                                                                                                setRepositories(
                                                                                                                        mockRepos
                                                                                                );
                                                                                                setSelectedRepo(
                                                                                                                        mockRepos[0]
                                                                                                );
                                                                        });
                        }, [token]);

                        const handleRegisterSubmit = (e: React.FormEvent) => {
                                                e.preventDefault();
                                                setIsRegistering(false);
                                                setIsIndexing(true);
                        };

                        return (
                                                <div className="min-h-screen bg-background text-foreground p-8 space-y-8 max-w-7xl mx-auto">
                                                                        {/* Top Header */}
                                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                                                                                                <div className="space-y-1">
                                                                                                                        <div className="flex items-center gap-3">
                                                                                                                                                <h1 className="text-3xl font-black tracking-tight text-foreground">
                                                                                                                                                                        📚
                                                                                                                                                                        Repositories
                                                                                                                                                                        Workflow
                                                                                                                                                </h1>
                                                                                                                                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                        PORTFOLIO
                                                                                                                                                                        MANAGEMENT
                                                                                                                                                                        &
                                                                                                                                                                        DNA
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                                                Unified
                                                                                                                                                repository
                                                                                                                                                management,
                                                                                                                                                continuous
                                                                                                                                                AST
                                                                                                                                                index
                                                                                                                                                status,
                                                                                                                                                and
                                                                                                                                                repository
                                                                                                                                                structural
                                                                                                                                                profiling.
                                                                                                                        </p>
                                                                                                </div>

                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <Button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setIsIndexing(
                                                                                                                                                                                                true
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                variant="outline"
                                                                                                                                                className="text-xs font-bold gap-1.5"
                                                                                                                        >
                                                                                                                                                <RefreshCw className="h-3.5 w-3.5" />{' '}
                                                                                                                                                Re-index
                                                                                                                                                All
                                                                                                                        </Button>
                                                                                                                        <Button
                                                                                                                                                onClick={() =>
                                                                                                                                                                        setIsRegistering(
                                                                                                                                                                                                true
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow hover:opacity-90 transition-all flex items-center gap-2"
                                                                                                                        >
                                                                                                                                                <Plus className="h-4 w-4" />{' '}
                                                                                                                                                Add
                                                                                                                                                Repository
                                                                                                                        </Button>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Indexing Progress Modal */}
                                                                        {isIndexing && (
                                                                                                <IndexingProgress
                                                                                                                        repoName={
                                                                                                                                                newRepoName ||
                                                                                                                                                'CodeAtlas Core'
                                                                                                                        }
                                                                                                                        onComplete={() =>
                                                                                                                                                setIsIndexing(
                                                                                                                                                                        false
                                                                                                                                                )
                                                                                                                        }
                                                                                                />
                                                                        )}

                                                                        {/* Register Repo Modal */}
                                                                        {isRegistering && (
                                                                                                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                                                                                                                        <div className="bg-card border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                                                                                                                                                <h3 className="text-lg font-black text-foreground">
                                                                                                                                                                        Register
                                                                                                                                                                        Repository
                                                                                                                                                </h3>
                                                                                                                                                <form
                                                                                                                                                                        onSubmit={
                                                                                                                                                                                                handleRegisterSubmit
                                                                                                                                                                        }
                                                                                                                                                                        className="space-y-3 text-xs"
                                                                                                                                                >
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="font-bold text-muted-foreground block mb-1">
                                                                                                                                                                                                                        Repository
                                                                                                                                                                                                                        Name
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="text"
                                                                                                                                                                                                                        required
                                                                                                                                                                                                                        placeholder="e.g. CodeAtlas Core Engine"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                newRepoName
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setNewRepoName(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full px-3 py-2 border rounded-xl bg-muted/20 text-foreground outline-none focus:ring-2 focus:ring-primary"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>
                                                                                                                                                                                                <label className="font-bold text-muted-foreground block mb-1">
                                                                                                                                                                                                                        Full
                                                                                                                                                                                                                        Name
                                                                                                                                                                                                                        (owner/repo)
                                                                                                                                                                                                </label>
                                                                                                                                                                                                <input
                                                                                                                                                                                                                        type="text"
                                                                                                                                                                                                                        required
                                                                                                                                                                                                                        placeholder="e.g. codeatlas/core-engine"
                                                                                                                                                                                                                        value={
                                                                                                                                                                                                                                                newFullName
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onChange={(
                                                                                                                                                                                                                                                e
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                setNewFullName(
                                                                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                                                                .value
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className="w-full px-3 py-2 border rounded-xl bg-muted/20 text-foreground outline-none focus:ring-2 focus:ring-primary"
                                                                                                                                                                                                />
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex justify-end gap-2 pt-2">
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        type="button"
                                                                                                                                                                                                                        variant="outline"
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setIsRegistering(
                                                                                                                                                                                                                                                                        false
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Cancel
                                                                                                                                                                                                </Button>
                                                                                                                                                                                                <Button
                                                                                                                                                                                                                        type="submit"
                                                                                                                                                                                                                        className="bg-primary text-primary-foreground font-bold"
                                                                                                                                                                                                >
                                                                                                                                                                                                                        Start
                                                                                                                                                                                                                        Analysis
                                                                                                                                                                                                </Button>
                                                                                                                                                                        </div>
                                                                                                                                                </form>
                                                                                                                        </div>
                                                                                                </div>
                                                                        )}

                                                                        {/* Repositories List & DNA Quick Link Grid */}
                                                                        <div className="grid gap-6 md:grid-cols-3">
                                                                                                <div className="md:col-span-2 space-y-4">
                                                                                                                        <div className="flex justify-between items-center">
                                                                                                                                                <h3 className="text-lg font-black text-foreground">
                                                                                                                                                                        Active
                                                                                                                                                                        Repositories
                                                                                                                                                                        (
                                                                                                                                                                        {
                                                                                                                                                                                                repositories.length
                                                                                                                                                                        }

                                                                                                                                                                        )
                                                                                                                                                </h3>
                                                                                                                                                <Link
                                                                                                                                                                        href="/repository-dna"
                                                                                                                                                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                                                                                                                                >
                                                                                                                                                                        Full
                                                                                                                                                                        Repository
                                                                                                                                                                        DNA
                                                                                                                                                                        Profile{' '}
                                                                                                                                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                                                                                                                </Link>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-3">
                                                                                                                                                {repositories.map(
                                                                                                                                                                        (
                                                                                                                                                                                                repo,
                                                                                                                                                                                                idx
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <div
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                repo.id ||
                                                                                                                                                                                                                                                idx
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setSelectedRepo(
                                                                                                                                                                                                                                                                        repo
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`border rounded-2xl p-5 bg-card hover:border-primary/50 transition-all cursor-pointer space-y-3 ${
                                                                                                                                                                                                                                                selectedRepo?.id ===
                                                                                                                                                                                                                                                repo.id
                                                                                                                                                                                                                                                                        ? 'ring-2 ring-primary/40 border-primary/50'
                                                                                                                                                                                                                                                                        : ''
                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <div className="flex justify-between items-start">
                                                                                                                                                                                                                                                <div className="space-y-1">
                                                                                                                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                                                                                                                <BookOpen className="h-4 w-4 text-indigo-400" />
                                                                                                                                                                                                                                                                                                <h4 className="text-base font-extrabold text-foreground">
                                                                                                                                                                                                                                                                                                                        {repo.name ||
                                                                                                                                                                                                                                                                                                                                                repo.full_name}
                                                                                                                                                                                                                                                                                                </h4>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <p className="text-xs font-mono text-muted-foreground">
                                                                                                                                                                                                                                                                                                {repo.full_name ||
                                                                                                                                                                                                                                                                                                                        repo.clone_url}
                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase tracking-wider">
                                                                                                                                                                                                                                                                        {repo.status ||
                                                                                                                                                                                                                                                                                                'INDEXED'}
                                                                                                                                                                                                                                                </span>
                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                        <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t text-muted-foreground">
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="block text-[10px] uppercase font-bold text-muted-foreground/70">
                                                                                                                                                                                                                                                                                                Language
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                                                                                                                {repo.language ||
                                                                                                                                                                                                                                                                                                                        'Python'}
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="block text-[10px] uppercase font-bold text-muted-foreground/70">
                                                                                                                                                                                                                                                                                                Files
                                                                                                                                                                                                                                                                                                /
                                                                                                                                                                                                                                                                                                LOC
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <strong className="text-foreground">
                                                                                                                                                                                                                                                                                                {repo.files ||
                                                                                                                                                                                                                                                                                                                        142}{' '}
                                                                                                                                                                                                                                                                                                files
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                {repo.loc ||
                                                                                                                                                                                                                                                                                                                        '24.5k'}{' '}
                                                                                                                                                                                                                                                                                                LOC)
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                <div>
                                                                                                                                                                                                                                                                        <span className="block text-[10px] uppercase font-bold text-muted-foreground/70">
                                                                                                                                                                                                                                                                                                Health
                                                                                                                                                                                                                                                                                                Grade
                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                        <strong className="text-emerald-400">
                                                                                                                                                                                                                                                                                                {repo.health ||
                                                                                                                                                                                                                                                                                                                        '88.5'}
                                                                                                                                                                                                                                                                        </strong>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Repository Overview Sidebar Card */}
                                                                                                <div className="border rounded-2xl bg-card p-6 space-y-6 shadow-sm h-fit">
                                                                                                                        <div className="space-y-2 border-b pb-4">
                                                                                                                                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                                                                                                                                                                        SELECTED
                                                                                                                                                                        REPOSITORY
                                                                                                                                                </span>
                                                                                                                                                <h3 className="text-xl font-black text-foreground">
                                                                                                                                                                        {selectedRepo?.name ||
                                                                                                                                                                                                'CodeAtlas Core Engine'}
                                                                                                                                                </h3>
                                                                                                                                                <p className="text-xs font-mono text-muted-foreground">
                                                                                                                                                                        {selectedRepo?.full_name ||
                                                                                                                                                                                                'codeatlas/core-engine'}
                                                                                                                                                </p>
                                                                                                                        </div>

                                                                                                                        <div className="space-y-4 text-xs">
                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                Continuous
                                                                                                                                                                                                AST
                                                                                                                                                                                                Sync
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                                                                                                                                                                                                <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                                                                                                                                                                                                Sub-120ms
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                Active
                                                                                                                                                                                                Branch
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="font-bold text-foreground flex items-center gap-1 font-mono">
                                                                                                                                                                                                <GitBranch className="h-3.5 w-3.5 text-indigo-400" />{' '}
                                                                                                                                                                                                {selectedRepo?.branch ||
                                                                                                                                                                                                                        'main'}
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                                                <div className="flex justify-between items-center">
                                                                                                                                                                        <span className="text-muted-foreground">
                                                                                                                                                                                                Last
                                                                                                                                                                                                Complete
                                                                                                                                                                                                Scan
                                                                                                                                                                        </span>
                                                                                                                                                                        <span className="font-bold text-foreground">
                                                                                                                                                                                                {selectedRepo?.last_scan ||
                                                                                                                                                                                                                        '10 mins ago'}
                                                                                                                                                                        </span>
                                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        <div className="pt-2 space-y-2">
                                                                                                                                                <Link
                                                                                                                                                                        href="/repository-dna"
                                                                                                                                                                        className="w-full block"
                                                                                                                                                >
                                                                                                                                                                        <Button className="w-full bg-primary text-primary-foreground font-bold text-xs gap-2">
                                                                                                                                                                                                <Sparkles className="h-4 w-4" />{' '}
                                                                                                                                                                                                Inspect
                                                                                                                                                                                                Repository
                                                                                                                                                                                                DNA
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                                                <Link
                                                                                                                                                                        href="/analyze"
                                                                                                                                                                        className="w-full block"
                                                                                                                                                >
                                                                                                                                                                        <Button
                                                                                                                                                                                                variant="outline"
                                                                                                                                                                                                className="w-full text-xs font-bold gap-2"
                                                                                                                                                                        >
                                                                                                                                                                                                <Layers className="h-4 w-4" />{' '}
                                                                                                                                                                                                Run
                                                                                                                                                                                                AST
                                                                                                                                                                                                Code
                                                                                                                                                                                                Analysis
                                                                                                                                                                        </Button>
                                                                                                                                                </Link>
                                                                                                                        </div>
                                                                                                </div>
                                                                        </div>
                                                </div>
                        );
}
