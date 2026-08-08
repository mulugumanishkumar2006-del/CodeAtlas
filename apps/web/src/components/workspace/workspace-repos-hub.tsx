'use client';

import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  RefreshCw,
  Pause,
  Play,
  Trash2,
  Edit2,
  Star,
  Archive,
  Tag,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  MoreVertical,
  X,
  Server,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RepositoryItem {
  id: string;
  name: string;
  url: string;
  provider: 'github' | 'gitlab' | 'bitbucket' | 'azure';
  branch: string;
  group: string;
  status: 'ready' | 'analyzing' | 'queued' | 'partially_analyzed' | 'needs_attention' | 'failed' | 'paused';
  health: number;
  language: string;
  isFavorite: boolean;
  isArchived: boolean;
  lastUpdated: string;
  tags: string[];
}

const INITIAL_REPOS: RepositoryItem[] = [
  {
    id: 'repo-auth-gateway',
    name: 'auth-gateway-service',
    url: 'https://github.com/acme-org/auth-gateway-service',
    provider: 'github',
    branch: 'main',
    group: 'Security & Identity',
    status: 'ready',
    health: 94.5,
    language: 'TypeScript',
    isFavorite: true,
    isArchived: false,
    lastUpdated: '10 minutes ago',
    tags: ['OAuth2', 'NestJS', 'SessionCache'],
  },
  {
    id: 'repo-payment-core',
    name: 'payment-processing-core',
    url: 'https://github.com/acme-org/payment-processing-core',
    provider: 'github',
    branch: 'main',
    group: 'Payments Platform',
    status: 'ready',
    health: 88.0,
    language: 'Go',
    isFavorite: true,
    isArchived: false,
    lastUpdated: '25 minutes ago',
    tags: ['gRPC', 'Stripe', 'LedgerTx'],
  },
  {
    id: 'repo-billing-engine',
    name: 'billing-invoice-engine',
    url: 'https://github.com/acme-org/billing-invoice-engine',
    provider: 'github',
    branch: 'main',
    group: 'Payments Platform',
    status: 'analyzing',
    health: 91.2,
    language: 'Python',
    isFavorite: false,
    isArchived: false,
    lastUpdated: 'Just now',
    tags: ['FastAPI', 'PDFGen', 'Subscriptions'],
  },
  {
    id: 'repo-shared-libs',
    name: 'enterprise-common-utils',
    url: 'https://github.com/acme-org/enterprise-common-utils',
    provider: 'github',
    branch: 'main',
    group: 'Shared Infrastructure',
    status: 'needs_attention',
    health: 82.0,
    language: 'TypeScript',
    isFavorite: false,
    isArchived: false,
    lastUpdated: '1 hour ago',
    tags: ['SharedLib', 'SecVault', 'Logger'],
  },
];

export function WorkspaceReposHub() {
  const [repos, setRepos] = useState<RepositoryItem[]>(INITIAL_REPOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding repo
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newRepoProvider, setNewRepoProvider] = useState<'github' | 'gitlab' | 'bitbucket' | 'azure'>('github');
  const [newRepoBranch, setNewRepoBranch] = useState('main');
  const [newRepoGroup, setNewRepoGroup] = useState('Core Services');

  const handleAddRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl) return;

    const repoName = newRepoUrl.replace(/\/$/, '').split('/').pop() || 'new-connected-repo';
    const newRepo: RepositoryItem = {
      id: `repo-custom-${Date.now()}`,
      name: repoName,
      url: newRepoUrl,
      provider: newRepoProvider,
      branch: newRepoBranch,
      group: newRepoGroup,
      status: 'queued',
      health: 90.0,
      language: 'TypeScript',
      isFavorite: false,
      isArchived: false,
      lastUpdated: 'Just now',
      tags: ['NewConnector'],
    };

    setRepos((prev) => [newRepo, ...prev]);
    setNewRepoUrl('');
    setIsAddModalOpen(false);
  };

  const toggleFavorite = (id: string) => {
    setRepos((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const toggleArchive = (id: string) => {
    setRepos((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isArchived: !r.isArchived } : r))
    );
  };

  const togglePauseAnalysis = (id: string) => {
    setRepos((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'paused' ? 'ready' : 'paused' }
          : r
      )
    );
  };

  const removeRepo = (id: string) => {
    setRepos((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredRepos = repos.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = selectedGroup === 'all' || r.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getStatusBadge = (status: RepositoryItem['status']) => {
    switch (status) {
      case 'ready':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">Ready</span>;
      case 'analyzing':
        return <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold animate-pulse">Analyzing AST...</span>;
      case 'queued':
        return <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">Queued</span>;
      case 'needs_attention':
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">Needs Attention</span>;
      case 'paused':
        return <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-bold">Analysis Paused</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">Connected</span>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans p-6 overflow-y-auto scrollbar-none space-y-6">
      {/* Header Controls & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-black font-mono text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <span>CONNECTED WORKSPACE REPOSITORIES</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage repository integrations, pause/resume background analysis, group repos, and edit metadata.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Repository
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4 font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search repository name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Payments Platform', 'Security & Identity', 'Shared Infrastructure'].map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1 rounded-xl transition-all ${
                selectedGroup === grp
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Repository Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className={`p-5 rounded-2xl bg-slate-900/80 border transition-all duration-200 space-y-3 font-mono ${
              repo.isFavorite ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/10' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleFavorite(repo.id)} className="text-slate-500 hover:text-amber-400">
                    <Star className={`w-4 h-4 ${repo.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                  <h3 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">{repo.name}</h3>
                </div>
                <span className="text-[10px] text-slate-400 block">{repo.group} • Branch: {repo.branch}</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px]">
                {getStatusBadge(repo.status)}
              </div>
            </div>

            {/* Health & Tags */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[10px]">Health:</span>
                <span className={`font-bold ${repo.health >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {repo.health}/100
                </span>
              </div>

              <div className="flex items-center gap-1">
                {repo.tags.map((tag) => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Contextual Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePauseAnalysis(repo.id)}
                  className="h-7 px-2.5 bg-slate-950 border-slate-800 text-slate-300 hover:text-white text-[11px]"
                >
                  {repo.status === 'paused' ? <Play className="w-3 h-3 mr-1 text-emerald-400" /> : <Pause className="w-3 h-3 mr-1 text-amber-400" />}
                  {repo.status === 'paused' ? 'Resume' : 'Pause'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 bg-slate-950 border-slate-800 text-slate-300 hover:text-white text-[11px]"
                >
                  <RefreshCw className="w-3 h-3 mr-1 text-cyan-400" />
                  Refresh
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleArchive(repo.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800"
                  title="Archive Repository"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeRepo(repo.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  title="Remove Repository"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Repository Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 font-mono">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Connect Repository</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRepo} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">Repository Clone URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/org/repo-name"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Provider</label>
                  <select
                    value={newRepoProvider}
                    onChange={(e: any) => setNewRepoProvider(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                    <option value="bitbucket">Bitbucket</option>
                    <option value="azure">Azure DevOps</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400">Target Branch</label>
                  <input
                    type="text"
                    value={newRepoBranch}
                    onChange={(e) => setNewRepoBranch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">Workspace Group Tag</label>
                <input
                  type="text"
                  value={newRepoGroup}
                  onChange={(e) => setNewRepoGroup(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Connect & Ingest
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
