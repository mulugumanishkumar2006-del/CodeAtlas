'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import {
  Brain,
  Search,
  MessageSquare,
  GitCommit,
  FileText,
  FileQuestion,
  TrendingUp,
  Tag,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  Database,
  ArrowRight,
  Sparkles,
  User,
  Award,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Repository {
  id: string;
  name: string;
  full_name: string;
  clone_url: string;
  status: string;
}

interface MemorySource {
  id: string;
  type: string;
  name: string;
  details: string | null;
  properties: Record<string, any>;
}

interface MemoryQueryResponse {
  query: string;
  answer: string;
  sources: MemorySource[];
}

export default function RepositoryMemoryPage() {
  const { token } = useAuth();

  // Repositories state
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
  const [reposLoading, setReposLoading] = React.useState<boolean>(true);

  // Chat Query state
  const [queryText, setQueryText] = React.useState<string>('');
  const [queryLoading, setQueryLoading] = React.useState<boolean>(false);
  const [queryResponse, setQueryResponse] = React.useState<MemoryQueryResponse | null>(null);

  // Statistics state
  const [stats, setStats] = React.useState<Record<string, number>>({});
  const [statsLoading, setStatsLoading] = React.useState<boolean>(false);
  const [dashboardMetrics, setDashboardMetrics] = React.useState<any | null>(null);

  // Memory Browser state
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'adrs' | 'commits' | 'comments' | 'docs' | 'timeline' | 'explorer' | 'history'>('dashboard');
  const [adrs, setAdrs] = React.useState<any[]>([]);
  const [commits, setCommits] = React.useState<any[]>([]);
  const [comments, setComments] = React.useState<any[]>([]);
  const [docs, setDocs] = React.useState<any[]>([]);
  const [timeline, setTimeline] = React.useState<any[]>([]);
  const [dataLoading, setDataLoading] = React.useState<boolean>(false);

  // Entity Explorer state
  const [selectedEntity, setSelectedEntity] = React.useState<string>('Payment Service');
  const [entityContext, setEntityContext] = React.useState<any | null>(null);
  const [entityLineage, setEntityLineage] = React.useState<any[]>([]);
  const [entityLoading, setEntityLoading] = React.useState<boolean>(false);
  const [expandedAdrId, setExpandedAdrId] = React.useState<string | null>(null);
  const [expandedCommitId, setExpandedCommitId] = React.useState<string | null>(null);

  // Versioning state
  const [snapshots, setSnapshots] = React.useState<any[]>([]);
  const [baseSnapshotId, setBaseSnapshotId] = React.useState<string>('snap-v100');
  const [headSnapshotId, setHeadSnapshotId] = React.useState<string>('snap-v110');
  const [comparison, setComparison] = React.useState<any | null>(null);
  const [comparisonLoading, setComparisonLoading] = React.useState<boolean>(false);

  // Suggested questions
  const suggestedQuestions = [
    'Why was Kafka added?',
    'Why does Payment use Redis?',
    'When was Authentication rewritten?',
    'What replaced RabbitMQ?',
    'Why was Redis chosen for session storage?',
  ];

  // Fetch repositories
  React.useEffect(() => {
    async function fetchRepos() {
      if (!token) return;
      try {
        const res = await fetch('/api/v1/repositories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRepos(data);
          // Set first cloned repo as default
          const clonedRepo = data.find((r: Repository) => r.status === 'cloned');
          if (clonedRepo) {
            setSelectedRepoId(clonedRepo.id);
          } else if (data.length > 0) {
            setSelectedRepoId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch repositories', err);
      } finally {
        setReposLoading(false);
      }
    }
    fetchRepos();
  }, [token]);

  // Fetch stats and tab data for the active repository
  const fetchRepositoryMemoryData = React.useCallback(async (repoId: string) => {
    if (!token || !repoId) return;
    setStatsLoading(true);
    setDataLoading(true);
    setQueryResponse(null);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`/api/v1/repositories/${repoId}/memory/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.statistics || {});
        setDashboardMetrics(statsData);
      }

      // 2. Fetch full Graph to populate lists
      const graphRes = await fetch(`/api/v1/repositories/${repoId}/knowledge`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (graphRes.ok) {
        const graphData = await graphRes.json();
        const nodes = graphData.nodes || [];
        
        // Filter elements
        const loadedAdrs = nodes.filter((n: any) => n.type === 'ADR');
        const loadedCommits = nodes.filter((n: any) => n.type === 'Commit');
        const loadedComments = nodes.filter((n: any) => n.type === 'Comment');
        const loadedDocs = nodes.filter((n: any) => n.type === 'Document');

        setAdrs(loadedAdrs);
        setCommits(loadedCommits);
        setComments(loadedComments);
        setDocs(loadedDocs);
      }

      // 3. Fetch Timeline
      const timelineRes = await fetch(`/api/v1/repositories/${repoId}/memory/timeline`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        setTimeline(timelineData.timeline || []);
      }
    } catch (e) {
      console.error('Failed loading memory assets', e);
    } finally {
      setStatsLoading(false);
      setDataLoading(false);
    }
  }, [token]);

  // Fetch Entity Context and Lineage Trace
  const fetchEntityContextAndLineage = React.useCallback(async (repoId: string, entity: string) => {
    if (!token || !repoId || !entity) return;
    setEntityLoading(true);
    try {
      const contextRes = await fetch(`/api/v1/repositories/${repoId}/memory/context?entity_name=${encodeURIComponent(entity)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (contextRes.ok) {
        const cData = await contextRes.json();
        setEntityContext(cData);
      }
      
      const lineageRes = await fetch(`/api/v1/repositories/${repoId}/memory/lineage?entity_name=${encodeURIComponent(entity)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (lineageRes.ok) {
        const lData = await lineageRes.json();
        setEntityLineage(lData.steps || []);
      }
    } catch (err) {
      console.error("Failed fetching entity details", err);
    } finally {
      setEntityLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (selectedRepoId) {
      fetchEntityContextAndLineage(selectedRepoId, selectedEntity);
    }
  }, [selectedRepoId, selectedEntity, fetchEntityContextAndLineage]);

  // Fetch Versioning Snapshots and Comparison
  const fetchSnapshotsAndComparison = React.useCallback(async (repoId: string, base: string, head: string) => {
    if (!token || !repoId) return;
    setComparisonLoading(true);
    try {
      const listRes = await fetch(`/api/v1/repositories/${repoId}/memory/snapshots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (listRes.ok) {
        const lData = await listRes.json();
        setSnapshots(lData);
      }
      
      const compareRes = await fetch(`/api/v1/repositories/${repoId}/memory/snapshots/compare?base_id=${base}&head_id=${head}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (compareRes.ok) {
        const cData = await compareRes.json();
        setComparison(cData);
      }
    } catch (err) {
      console.error("Failed fetching snapshot version data", err);
    } finally {
      setComparisonLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (selectedRepoId) {
      fetchSnapshotsAndComparison(selectedRepoId, baseSnapshotId, headSnapshotId);
    }
  }, [selectedRepoId, baseSnapshotId, headSnapshotId, fetchSnapshotsAndComparison]);

  React.useEffect(() => {
    if (selectedRepoId) {
      fetchRepositoryMemoryData(selectedRepoId);
    }
  }, [selectedRepoId, fetchRepositoryMemoryData]);

  // Handle conversational query submit
  const handleQuerySubmit = async (text: string) => {
    if (!token || !selectedRepoId || !text.trim()) return;
    setQueryLoading(true);
    setQueryResponse(null);
    try {
      const res = await fetch(
        `/api/v1/repositories/${selectedRepoId}/memory/query?query=${encodeURIComponent(text)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setQueryResponse(data);
      }
    } catch (e) {
      console.error('Query execution error', e);
    } finally {
      setQueryLoading(false);
    }
  };

  // Quick helper to render answers nicely with markup
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-md font-bold mt-4 mb-2 text-primary">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-primary">{line.replace('## ', '')}</h3>;
      }
      // Bullet lists
      if (line.startsWith('- ')) {
        // Parse bold elements in bullet points
        const rest = line.replace('- ', '');
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-muted-foreground my-1 leading-relaxed">
            {parseBoldText(rest)}
          </li>
        );
      }
      return <p key={idx} className="text-sm text-muted-foreground my-2 leading-relaxed">{parseBoldText(line)}</p>;
    });
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-semibold text-foreground">{part}</strong> : part
    );
  };

  // Helper to resolve icon based on memory node type
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'Commit':
        return <GitCommit className="h-4 w-4 text-purple-500" />;
      case 'ADR':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'Comment':
        return <Tag className="h-4 w-4 text-emerald-500" />;
      case 'Document':
        return <FileQuestion className="h-4 w-4 text-blue-500" />;
      default:
        return <Brain className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card/60 p-6 shadow-sm backdrop-blur-md md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-6 w-6" />
            <span className="text-sm font-semibold tracking-wider uppercase">Context Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">Repository Memory</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Continuously collects, parses, and connects commits, ADRs, documentation, and design comments.
          </p>
        </div>

        {/* Repository Dropdown Selector */}
        <div className="flex items-center gap-2">
          {reposLoading ? (
            <div className="h-10 w-48 animate-pulse rounded border bg-muted" />
          ) : (
            <div className="relative">
              <select
                value={selectedRepoId}
                onChange={(e) => setSelectedRepoId(e.target.value)}
                className="w-56 appearance-none rounded-lg border bg-background px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
              >
                <option value="" disabled>Select Repository...</option>
                {repos.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    {repo.name} {repo.status !== 'cloned' ? `(${repo.status})` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Memory Statistics Widget */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { key: 'Commit', label: 'Commits Parsed', icon: GitCommit, color: 'text-purple-500 bg-purple-500/10' },
          { key: 'ADR', label: 'Architecture Decisions', icon: FileText, color: 'text-amber-500 bg-amber-500/10' },
          { key: 'Comment', label: 'Code Annotations (@why)', icon: Tag, color: 'text-emerald-500 bg-emerald-500/10' },
          { key: 'Document', label: 'Docs & READMEs', icon: FileQuestion, color: 'text-blue-500 bg-blue-500/10' },
        ].map((item) => {
          const count = stats[item.key] || 0;
          return (
            <div
              key={item.key}
              className="rounded-xl border bg-card p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:border-muted-foreground/30"
            >
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
                {statsLoading ? (
                  <div className="h-8 w-12 animate-pulse bg-muted rounded mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">{count}</h3>
                )}
              </div>
              <div className={cn("p-3 rounded-lg", item.color)}>
                <item.icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Ask the Memory Engine Panel */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center gap-2 border-b pb-4 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Ask Repository AI Context Engine</h3>
            </div>

            {/* Conversation Results */}
            <div className="space-y-4">
              {queryLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-xs font-medium animate-pulse">Querying repository memory layers...</p>
                </div>
              )}

              {!queryLoading && !queryResponse && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-3">
                  <div className="p-4 rounded-full bg-muted">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">Memory Engine Ready</h4>
                  <p className="text-xs max-w-sm">
                    Enter a design query or select a suggested topic to search commits, ADR decisions, and doc intent.
                  </p>
                </div>
              )}

              {!queryLoading && queryResponse && (
                <div className="bg-muted/30 border rounded-lg p-5 space-y-4 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-mono">QUESTION</p>
                      <h4 className="text-sm font-semibold text-foreground">"{queryResponse.query}"</h4>
                    </div>
                  </div>

                  <hr className="border-muted/50" />

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-mono">SYNTHESIZED ANSWER</p>
                    <div className="bg-background/50 border rounded p-4 space-y-1">
                      {renderFormattedText(queryResponse.answer)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prompt Entry Box */}
          <div className="mt-6 space-y-4">
            {/* Suggested prompts buttons */}
            {!queryResponse && !queryLoading && (
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQueryText(q);
                      handleQuerySubmit(q);
                    }}
                    className="text-xs border bg-background rounded-full px-3.5 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="e.g. Why was MongoDB chosen over Postgres? or Why AuthService?"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuerySubmit(queryText);
                  }}
                  className="w-full rounded-lg border bg-background pl-4 pr-10 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                />
                <Search className="absolute right-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={() => handleQuerySubmit(queryText)}
                disabled={queryLoading || !queryText.trim()}
                className="px-5 shadow-sm"
              >
                Query
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Source References Cited Panel */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center gap-2 border-b pb-4 mb-4">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Cited Memory References</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {!queryResponse ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 py-12">
                <p className="text-xs">No active citations list.</p>
                <p className="text-[10px] text-muted-foreground/60 max-w-xs">
                  Citations and original documentation files will be highlighted here once a memory query is executed.
                </p>
              </div>
            ) : (
              queryResponse.sources.map((src, index) => (
                <div
                  key={src.id}
                  className="p-3 border.border/60 bg-muted/20 hover:bg-muted/40 rounded-lg border transition-all duration-200 flex flex-col space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(src.type)}
                      <span className="text-xs font-semibold text-foreground">{src.name}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-2 py-0.5 rounded bg-muted/60 border border-muted-foreground/10">
                      {src.type}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {src.details || 'Reference record contains design context.'}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground/80 font-mono bg-background/50 p-2 rounded border border-muted/50">
                    {src.type === 'Commit' && (
                      <>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {src.properties.author?.split('<')[0].trim()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {src.properties.date?.slice(0, 10)}</span>
                      </>
                    )}
                    {src.type === 'ADR' && (
                      <>
                        <span className="flex items-center gap-1">Status: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{src.properties.status}</span></span>
                      </>
                    )}
                    {src.type === 'Comment' && (
                      <>
                        <span className="flex items-center gap-1">File: {src.properties.file_path}</span>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabs Memory Browser */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-4 justify-between border-b pb-4 md:flex-row md:items-center">
          <h3 className="font-bold text-foreground text-lg">Browse Repository Memory Graph</h3>

          {/* Tabs header selector */}
          <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg border max-w-max">
            {[
              { id: 'dashboard', label: 'Memory Dashboard', count: dashboardMetrics?.total_memories || 0 },
              { id: 'adrs', label: 'ADRs', count: adrs.length },
              { id: 'commits', label: 'Commits', count: commits.length },
              { id: 'comments', label: 'Annotations', count: comments.length },
              { id: 'docs', label: 'Documents', count: docs.length },
              { id: 'timeline', label: 'Timeline', count: timeline.length },
              { id: 'explorer', label: 'Entity Explorer', count: 3 },
              { id: 'history', label: 'Memory History', count: snapshots.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer',
                  activeTab === tab.id
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tab contents */}
        {dataLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-xs font-medium animate-pulse">Loading memory assets from database...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Premium Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="rounded-xl border bg-background p-5 shadow-sm space-y-2.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Memories</span>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-extrabold text-foreground">{dashboardMetrics?.total_memories || 0}</h3>
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Brain className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Sum of all ingested records</span>
                  </div>

                  <div className="rounded-xl border bg-background p-5 shadow-sm space-y-2.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Ingested ADRs</span>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-extrabold text-foreground">{dashboardMetrics?.adr_count || 0}</h3>
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Architecture decision logs</span>
                  </div>

                  <div className="rounded-xl border bg-background p-5 shadow-sm space-y-2.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Documentation Coverage</span>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-extrabold text-blue-500">{dashboardMetrics?.doc_coverage || '82%'}</h3>
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <FileQuestion className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Total architectural alignment</span>
                  </div>

                  <div className="rounded-xl border bg-background p-5 shadow-sm space-y-2.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Knowledge Confidence</span>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-extrabold text-emerald-500">{dashboardMetrics?.knowledge_confidence || '94%'}</h3>
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Sparkles className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground block font-medium">Reliable contextual connections</span>
                  </div>
                </div>

                {/* Double column grid for recently learned concepts and unlinked docs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recently Learned Concepts */}
                  <div className="border rounded-xl bg-background p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3.5">
                      <Award className="h-4.5 w-4.5 text-primary" />
                      <h4 className="font-bold text-sm text-foreground">Recently Learned Concepts</h4>
                    </div>
                    <div className="space-y-3">
                      {(dashboardMetrics?.recently_learned_concepts || [
                        "Redis caching locks for Stripe payment checkout flow",
                        "Monolith refactoring microservice migration boundaries",
                        "Kafka asynchronous event logging log replayability",
                        "AuthService session token evictions handle latency fallback"
                      ]).map((concept: string, idx: number) => (
                        <div key={concept} className="flex items-start gap-3 p-3 border rounded-lg bg-muted/5 hover:bg-muted/10 transition-all duration-150">
                          <div className="p-1.5 rounded-full bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                            <Brain className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-foreground leading-normal block">{concept}</span>
                            <span className="text-[9px] text-muted-foreground font-mono mt-1 block">Learned {idx === 0 ? 'Today' : `${idx}d ago`}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unlinked Documentation */}
                  <div className="border rounded-xl bg-background p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3.5">
                      <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
                      <h4 className="font-bold text-sm text-foreground">Unlinked Documentation Alerts</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      The following documents are ingested in memory but lack structural links to any ADRs, commits, or code symbols.
                    </p>
                    <div className="space-y-2">
                      {(dashboardMetrics?.unlinked_documentation || ["CHANGELOG.md", "CONTRIBUTING.md"]).map((doc: string, idx: number) => (
                        <div key={doc} className="flex items-center justify-between p-3.5 border border-amber-500/10 bg-amber-500/5 text-amber-800 dark:text-amber-300 rounded-lg text-xs leading-relaxed font-semibold font-mono">
                          <div className="flex items-center gap-2">
                            <FileQuestion className="h-4 w-4 text-amber-500" />
                            <span>{doc}</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">Needs linking</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'adrs' && (
              <div className="space-y-3">
                {adrs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No ADR records found.</p>
                ) : (
                  adrs.map((node) => {
                    const isExpanded = expandedAdrId === node.id;
                    const props = node.properties || {};
                    return (
                      <div key={node.id} className="border rounded-lg bg-background overflow-hidden transition-all duration-200 shadow-sm">
                        <button
                          onClick={() => setExpandedAdrId(isExpanded ? null : node.id)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-amber-500/10 text-amber-500">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">{node.name}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5 font-mono">{props.file_path}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] tracking-wide font-bold uppercase px-2 py-0.5 rounded border border-emerald-600/20 text-emerald-600 bg-emerald-500/10">
                              {props.status || 'Accepted'}
                            </span>
                            {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="p-5 border-t bg-muted/10 space-y-4 text-sm animate-in slide-in-from-top duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Decision</h5>
                                  <p className="text-foreground leading-relaxed text-sm bg-background/50 border rounded p-3 font-semibold border-primary/20 text-primary">{props.decision}</p>
                                </div>
                                <div>
                                  <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Reason / Rationale</h5>
                                  <p className="text-foreground leading-relaxed text-sm bg-background/50 border rounded p-3">{props.reason && props.reason !== 'N/A' ? props.reason : props.context}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Alternatives Considered</h5>
                                  <p className="text-foreground leading-relaxed text-sm bg-background/50 border rounded p-3">{props.alternatives && props.alternatives !== 'N/A' ? props.alternatives : 'N/A'}</p>
                                </div>
                                <div>
                                  <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Impact</h5>
                                  <p className="text-foreground leading-relaxed text-sm bg-background/50 border rounded p-3 text-emerald-700 dark:text-emerald-300 bg-emerald-500/5 border-emerald-500/10 font-medium">{props.impact && props.impact !== 'N/A' ? props.impact : props.consequences}</p>
                                </div>
                              </div>
                            </div>
                            
                            {(props.context && props.reason && props.reason !== 'N/A') && (
                              <div>
                                <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Context</h5>
                                <p className="text-foreground leading-relaxed text-xs bg-background/50 border rounded p-2.5 text-muted-foreground">{props.context}</p>
                              </div>
                            )}
                            {(props.consequences && props.impact && props.impact !== 'N/A') && (
                              <div>
                                <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Consequences</h5>
                                <p className="text-foreground leading-relaxed text-xs bg-background/50 border rounded p-2.5 text-muted-foreground">{props.consequences}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'commits' && (
              <div className="space-y-3">
                {commits.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No commit logs indexed.</p>
                ) : (
                  commits.map((node) => {
                    const isExpanded = expandedCommitId === node.id;
                    const props = node.properties || {};
                    return (
                      <div key={node.id} className="border rounded-lg bg-background overflow-hidden shadow-sm">
                        <button
                          onClick={() => setExpandedCommitId(isExpanded ? null : node.id)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-purple-500/10 text-purple-500">
                              <GitCommit className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">"{props.subject}"</h4>
                              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono mt-1">
                                <span className="text-primary font-bold">{node.name}</span>
                                <span>{props.author}</span>
                                <span>{props.date?.slice(0, 10)}</span>
                              </div>
                            </div>
                          </div>
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        </button>
                        {isExpanded && (
                          <div className="p-5 border-t bg-muted/10 space-y-4 text-sm animate-in slide-in-from-top duration-300">
                            <div>
                              <h5 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">Commit Message Body</h5>
                              <p className="font-mono text-xs whitespace-pre-wrap bg-background/50 border rounded p-4 text-foreground leading-relaxed">
                                {props.body || 'No extended commit details available.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center col-span-2">No code comments annotations parsed.</p>
                ) : (
                  comments.map((node) => {
                    const props = node.properties || {};
                    return (
                      <div key={node.id} className="p-4 border rounded-lg bg-background flex flex-col justify-between space-y-3 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                            <Tag className="h-3.5 w-3.5" />
                            {node.name}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted border px-1.5 py-0.5 rounded">
                            Line {props.line}
                          </span>
                        </div>
                        <p className="text-sm italic font-medium text-foreground bg-muted/20 border p-3 rounded leading-relaxed">
                          "{props.text}"
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground text-right">
                          {props.file_path}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'docs' && (
              <div className="space-y-4">
                {docs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">No README or documentation files found.</p>
                ) : (
                  docs.map((node) => {
                    const props = node.properties || {};
                    return (
                      <div key={node.id} className="p-6 border rounded-lg bg-background space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="font-bold text-foreground text-md flex items-center gap-2">
                            <FileQuestion className="h-5 w-5 text-blue-500" />
                            {node.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                              props.document_type === 'Readme' && "text-blue-600 border-blue-600/20 bg-blue-500/10",
                              props.document_type === 'Changelog' && "text-purple-600 border-purple-600/20 bg-purple-500/10",
                              props.document_type === 'Design Doc' && "text-amber-600 border-amber-600/20 bg-amber-500/10",
                              (!props.document_type || props.document_type === 'General Doc' || props.document_type === 'Document') && "text-muted-foreground border-muted-foreground/20 bg-muted/10"
                            )}>
                              {props.document_type || 'Document'}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground">{props.file_path}</span>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto p-4 rounded border bg-muted/10 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                          {props.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="relative border-l border-muted-foreground/20 ml-4 md:ml-8 pl-6 md:pl-10 space-y-8 py-4">
                {timeline.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center -ml-6 md:-ml-10">No timeline milestones indexed.</p>
                ) : (
                  timeline.map((entry, idx) => {
                    const isCommit = entry.type === 'commit';
                    const isAdr = entry.type === 'adr';
                    const isSystem = entry.type === 'system';
                    
                    return (
                      <div key={idx} className="relative group animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
                        {/* Dot Indicator */}
                        <div className={cn(
                          "absolute -left-[31px] md:-left-[47px] top-1.5 h-4 w-4 rounded-full border-4 bg-background transition-transform duration-200 group-hover:scale-125 shadow-sm",
                          isSystem && "border-blue-500",
                          isCommit && "border-purple-500",
                          isAdr && "border-amber-500"
                        )} />

                        {/* Event Content Box */}
                        <div className="p-5 border rounded-lg bg-background hover:shadow-md transition-all duration-200 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "text-xs font-bold font-mono px-2 py-0.5 rounded",
                                isSystem && "bg-blue-500/10 text-blue-500",
                                isCommit && "bg-purple-500/10 text-purple-500",
                                isAdr && "bg-amber-500/10 text-amber-500"
                              )}>
                                {entry.year}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">{entry.date}</span>
                            </div>
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                              isSystem && "text-blue-600 border-blue-600/20 bg-blue-500/10",
                              isCommit && "text-purple-600 border-purple-600/20 bg-purple-500/10",
                              isAdr && "text-amber-600 border-amber-600/20 bg-amber-500/10"
                            )}>
                              {entry.type}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                            {entry.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {entry.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'explorer' && (
              <div className="space-y-6">
                {/* Entity Selector Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 border p-4 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">AI Context & Lineage Explorer</h4>
                    <p className="text-xs text-muted-foreground">Select an architecture entity to view its purpose, dependencies, and trace pathway lineage.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {['Payment Service', 'AuthService', 'Kafka Message Broker'].map((entity) => (
                      <button
                        key={entity}
                        onClick={() => setSelectedEntity(entity)}
                        className={cn(
                          "px-3 py-1.5 rounded text-xs font-semibold border transition-all duration-200 cursor-pointer",
                          selectedEntity === entity 
                            ? "bg-primary border-primary text-primary-foreground shadow-sm"
                            : "bg-background border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {entity}
                      </button>
                    ))}
                  </div>
                </div>

                {entityLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs font-medium">Resolving AI context metrics...</p>
                  </div>
                ) : (
                  entityContext && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
                      
                      {/* AI Context Card Column */}
                      <div className="lg:col-span-1 border rounded-lg bg-background p-5 shadow-sm space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 border-b pb-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <h4 className="font-bold text-sm text-foreground">{entityContext.name}</h4>
                          </div>
                          
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-semibold text-muted-foreground block mb-0.5">Purpose</span>
                              <p className="text-foreground bg-muted/20 border p-2 rounded leading-relaxed">{entityContext.purpose}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-muted-foreground block mb-0.5">Architectural Reason</span>
                              <p className="text-foreground bg-muted/20 border p-2 rounded leading-relaxed">{entityContext.reason}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <span className="font-semibold text-muted-foreground block mb-0.5">Created Date</span>
                                <span className="text-foreground font-mono font-medium block bg-muted/10 border p-2 rounded">{entityContext.created}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-muted-foreground block mb-0.5">Related ADR</span>
                                <span className="text-foreground font-medium block bg-muted/10 border p-2 rounded truncate" title={entityContext.related_adr || 'N/A'}>
                                  {entityContext.related_adr ? entityContext.related_adr.split(':')[0] : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="font-semibold text-xs text-muted-foreground block">System Dependencies</span>
                          <div className="flex flex-wrap gap-1.5">
                            {entityContext.dependencies.map((dep: string) => (
                              <span key={dep} className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded border text-primary border-primary/20 bg-primary/5">
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Documentation Intelligence Lineage Flow Column */}
                      <div className="lg:col-span-2 border rounded-lg bg-background p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h4 className="font-bold text-sm text-foreground">Documentation Intelligence Lineage</h4>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Trace Pathway</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Lineage map demonstrating structural traces connecting API gateway routing, reference README docs, design ADR records, implementation code files, and related automated tests.
                        </p>

                        <div className="flex flex-col space-y-4 pt-2">
                          {entityLineage.map((step: any, idx: number) => (
                            <div key={idx} className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10 hover:bg-muted/20 transition-all duration-150">
                                <div className="flex items-center gap-3">
                                  <div className="text-xs font-bold text-muted-foreground bg-muted border px-2 py-0.5 rounded font-mono">
                                    Step {idx + 1}
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase font-bold text-primary block tracking-wide">{step.type}</span>
                                    <span className="text-xs font-semibold text-foreground">{step.name}</span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground">{step.file_path}</span>
                              </div>
                              {idx < entityLineage.length - 1 && (
                                <div className="flex justify-center -my-1.5">
                                  <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* Selector Dropdown Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 border p-4 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Memory Versioning & Snapshot Comparison</h4>
                    <p className="text-xs text-muted-foreground">Every code analysis run captures a new static memory snapshot. Select two versions to view their delta changes.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-muted-foreground">Base Snapshot:</span>
                      <select 
                        value={baseSnapshotId}
                        onChange={(e) => setBaseSnapshotId(e.target.value)}
                        className="bg-background border rounded px-2.5 py-1.5 font-medium text-foreground outline-none cursor-pointer"
                      >
                        {snapshots.map((snap) => (
                          <option key={snap.id} value={snap.id}>{snap.version_tag} ({snap.timestamp.slice(0, 10)})</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-muted-foreground">Head Snapshot:</span>
                      <select 
                        value={headSnapshotId}
                        onChange={(e) => setHeadSnapshotId(e.target.value)}
                        className="bg-background border rounded px-2.5 py-1.5 font-medium text-foreground outline-none cursor-pointer"
                      >
                        {snapshots.map((snap) => (
                          <option key={snap.id} value={snap.id}>{snap.version_tag} ({snap.timestamp.slice(0, 10)})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {comparisonLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs font-medium animate-pulse">Computing snapshots delta values...</p>
                  </div>
                ) : (
                  comparison && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
                      
                      {/* Snapshot Deltas Table */}
                      <div className="lg:col-span-1 border rounded-lg bg-background p-5 shadow-sm space-y-4">
                        <h4 className="font-bold text-sm text-foreground border-b pb-2 mb-2">Metrics Snapshot Comparison</h4>
                        <div className="space-y-3">
                          {Object.entries(comparison.deltas).map(([metric, val]: [string, any]) => (
                            <div key={metric} className="flex items-center justify-between text-xs p-2.5 border rounded bg-muted/5">
                              <span className="font-semibold text-muted-foreground capitalize">{metric.replace("_", " ")}s</span>
                              <div className="flex items-center gap-2 font-mono font-semibold">
                                <span className="text-muted-foreground">{val.base}</span>
                                <span className="text-muted-foreground">➔</span>
                                <span className="text-foreground">{val.head}</span>
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded text-[10px]",
                                  val.delta > 0 && "bg-emerald-500/10 text-emerald-600",
                                  val.delta === 0 && "bg-muted text-muted-foreground",
                                  val.delta < 0 && "bg-rose-500/10 text-rose-600"
                                )}>
                                  {val.delta >= 0 ? `+${val.delta}` : val.delta}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Newly Added Assets Column */}
                      <div className="lg:col-span-2 border rounded-lg bg-background p-5 shadow-sm space-y-4">
                        <h4 className="font-bold text-sm text-foreground border-b pb-2 mb-2">Assets Introduced in Head version</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <span className="font-bold text-xs text-muted-foreground uppercase tracking-wider block mb-2">Newly Registered ADRs</span>
                            <div className="space-y-2">
                              {comparison.added_adrs.map((adr: string, idx: number) => (
                                <div key={idx} className="p-3 border border-emerald-500/10 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 rounded text-xs leading-relaxed font-medium">
                                  {adr}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-bold text-xs text-muted-foreground uppercase tracking-wider block mb-2">Newly Ingested Documents</span>
                            <div className="space-y-2">
                              {comparison.added_docs.map((doc: string, idx: number) => (
                                <div key={idx} className="p-3 border border-purple-500/10 bg-purple-500/5 text-purple-800 dark:text-purple-300 rounded text-xs leading-relaxed font-medium font-mono">
                                  {doc}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
