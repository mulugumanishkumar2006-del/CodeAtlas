'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import { ArchitectureVisualizer } from '@/components/architecture-visualizer';
import { Button } from '@/components/ui/button';

import {
  Layers,
  Database,
  GitBranch,
  Network,
  Cpu,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  Code,
  FileCode,
  Play,
  Server,
  Terminal,
  Brain,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  ChevronRight,
  Check,
  Trash2,
  Plus,
  Info,
  Settings,
  X,
} from 'lucide-react';


interface Repository {
  id: string;
  name: string;
  full_name: string;
  clone_url: string;
  status: string;
}

export default function ArchitectureExplorerPage() {
  const { token } = useAuth();

  // State
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
  const [graphData, setGraphData] = React.useState<{ nodes: any[]; relationships: any[] }>({
    nodes: [],
    relationships: [],
  });
  const [domains, setDomains] = React.useState<any[]>([]);
  const [patterns, setPatterns] = React.useState<any[]>([]);
  const [statistics, setStatistics] = React.useState<Record<string, number>>({});

  // Drift and Compliance States
  const [activeTab, setActiveTab] = React.useState<'explorer' | 'compliance'>('explorer');
  const [driftReport, setDriftReport] = React.useState<any | null>(null);
  const [driftLoading, setDriftLoading] = React.useState<boolean>(false);
  const [rules, setRules] = React.useState<any | null>(null);
  const [rulesLoading, setRulesLoading] = React.useState<boolean>(false);
  const [savingRules, setSavingRules] = React.useState<boolean>(false);
  const [editingRules, setEditingRules] = React.useState<any | null>(null);
  
  // Custom form edit states
  const [activeRuleTab, setActiveRuleTab] = React.useState<'layers' | 'boundaries' | 'patterns' | 'custom_rules'>('layers');

  const fetchDriftReport = React.useCallback(async (repoId: string) => {
    if (!token || !repoId) return;
    setDriftLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/architecture/drift`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDriftReport(data);
      }
    } catch (err) {
      console.error("Failed to fetch drift report", err);
    } finally {
      setDriftLoading(false);
    }
  }, [token]);

  const fetchRules = React.useCallback(async (repoId: string) => {
    if (!token || !repoId) return;
    setRulesLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/architecture/rules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRules(data);
        setEditingRules(JSON.parse(JSON.stringify(data))); // deep copy
      }
    } catch (err) {
      console.error("Failed to fetch rules", err);
    } finally {
      setRulesLoading(false);
    }
  }, [token]);

  const saveRules = async (updatedRules: any) => {
    if (!token || !selectedRepoId) return;
    setSavingRules(true);
    try {
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}/architecture/rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRules),
      });
      if (res.ok) {
        const data = await res.json();
        setRules(data);
        setEditingRules(JSON.parse(JSON.stringify(data)));
        // Refresh drift report to recalculate scores with new rules
        fetchDriftReport(selectedRepoId);
      }
    } catch (err) {
      console.error("Failed to save rules", err);
    } finally {
      setSavingRules(false);
    }
  };


  const [loading, setLoading] = React.useState(true);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Selected Node detailed info panel state
  const [selectedNode, setSelectedNode] = React.useState<any | null>(null);
  const [nodeContext, setNodeContext] = React.useState<any | null>(null);
  const [nodeContextLoading, setNodeContextLoading] = React.useState<boolean>(false);

  // Fetch repositories on mount
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
          if (data.length > 0) {
            setSelectedRepoId(data[0].id);
          }
        }
      } catch (err) {
        setError('Failed to fetch repositories.');
      } finally {
        setLoading(false);
      }
    }
    fetchRepos();
  }, [token]);

  // Fetch Node Context when selection changes
  React.useEffect(() => {
    async function fetchNodeContext() {
      if (!token || !selectedRepoId || !selectedNode) {
        setNodeContext(null);
        return;
      }
      setNodeContextLoading(true);
      try {
        const res = await fetch(`/api/v1/repositories/${selectedRepoId}/graph/nodes/${encodeURIComponent(selectedNode.id)}/context`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNodeContext(data);
        }
      } catch (err) {
        console.error("Failed to fetch node context", err);
      } finally {
        setNodeContextLoading(false);
      }
    }
    fetchNodeContext();
  }, [token, selectedRepoId, selectedNode]);

  // Fetch all graph metadata for selected repository
  const fetchRepositoryArchitecture = React.useCallback(async (repoId: string) => {
    if (!token || !repoId) return;
    setDataLoading(true);
    setError(null);
    setSelectedNode(null);
    try {
      // 1. Fetch main graph nodes and edges
      const graphRes = await fetch(`/api/v1/repositories/${repoId}/knowledge`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let currentGraph = { nodes: [], relationships: [] };
      if (graphRes.ok) {
        currentGraph = await graphRes.json();
        setGraphData(currentGraph);
      } else {
        throw new Error('Failed to load repository graph data.');
      }

      // 2. Fetch business domains
      const domainsRes = await fetch(`/api/v1/repositories/${repoId}/knowledge/domains`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (domainsRes.ok) {
        const domainsData = await domainsRes.json();
        setDomains(domainsData.domains || []);
      }

      // 3. Fetch architecture patterns
      const patternsRes = await fetch(`/api/v1/repositories/${repoId}/knowledge/patterns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (patternsRes.ok) {
        const patternsData = await patternsRes.json();
        setPatterns(patternsData.patterns || []);
      }

      // 4. Fetch statistics
      const statsRes = await fetch(`/api/v1/repositories/${repoId}/knowledge/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStatistics(statsData.statistics || {});
      }

      // 5. Fetch architectural drift & rules
      fetchDriftReport(repoId);
      fetchRules(repoId);
    } catch (err: any) {
      setError(err.message || 'Error occurred while loading architecture data.');
    } finally {
      setDataLoading(false);
    }
  }, [token, fetchDriftReport, fetchRules]);


  React.useEffect(() => {
    if (selectedRepoId) {
      fetchRepositoryArchitecture(selectedRepoId);
    }
  }, [selectedRepoId, fetchRepositoryArchitecture]);

  const prevStatusRef = React.useRef<string | null>(null);

  // Poll repository analysis status automatically to reload graph when analysis completes
  React.useEffect(() => {
    if (!token || !selectedRepoId) return;

    const currentRepo = repos.find((r) => r.id === selectedRepoId);
    if (currentRepo) {
      prevStatusRef.current = currentRepo.status;
    }

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch('/api/v1/repositories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const repoList: Repository[] = await res.json();
          const freshRepo = repoList.find((r) => r.id === selectedRepoId);
          if (freshRepo) {
            const prevStatus = prevStatusRef.current;
            prevStatusRef.current = freshRepo.status;
            
            // Update repositories state to keep UI cards synchronized
            setRepos(repoList);

            // If it just transitioned to ready/analyzed/completed, or is ready and graph is empty, hot-reload!
            const wasBuilding = prevStatus && prevStatus !== 'analyzed' && prevStatus !== 'completed' && prevStatus !== 'ready';
            const isReady = freshRepo.status === 'analyzed' || freshRepo.status === 'completed' || freshRepo.status === 'ready';
            const isGraphEmpty = graphData.nodes.length === 0;

            if ((wasBuilding && isReady) || (isReady && isGraphEmpty)) {
              fetchRepositoryArchitecture(selectedRepoId);
            }
          }
        }
      } catch (err) {
        console.error('Error polling repo status:', err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [token, selectedRepoId, repos, graphData.nodes.length, fetchRepositoryArchitecture]);

  const activeRepo = repos.find((r) => r.id === selectedRepoId);

  // Compute incoming and outgoing edges for the selected node
  const nodeConnections = React.useMemo(() => {
    if (!selectedNode || !graphData.nodes.length) return { incoming: [], outgoing: [] };

    const incomingLinks: any[] = [];
    const outgoingLinks: any[] = [];

    graphData.relationships.forEach((rel) => {
      if (rel.source_id === selectedNode.id) {
        const targetNode = graphData.nodes.find((n) => n.id === rel.target_id);
        if (targetNode) {
          outgoingLinks.push({ node: targetNode, type: rel.type, label: rel.properties?.label });
        }
      } else if (rel.target_id === selectedNode.id) {
        const sourceNode = graphData.nodes.find((n) => n.id === rel.source_id);
        if (sourceNode) {
          incomingLinks.push({ node: sourceNode, type: rel.type, label: rel.properties?.label });
        }
      }
    });

    return { incoming: incomingLinks, outgoing: outgoingLinks };
  }, [selectedNode, graphData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <RefreshCw className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading workspace repositories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and repo selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Interactive Architecture Explorer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Navigate your repository hierarchically from Business Domains down to Classes and Methods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">Select Repository:</span>
          <select
            value={selectedRepoId}
            onChange={(e) => setSelectedRepoId(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
          >
            {repos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.full_name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchRepositoryArchitecture(selectedRepoId)}
            disabled={dataLoading}
            title="Refresh graph data"
          >
            <RefreshCw className={`h-4 w-4 ${dataLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Premium Tabs navigation */}
      <div className="flex border-b border-border/40 gap-6 mb-2">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`pb-3.5 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'explorer'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Network className="h-4 w-4" />
          Interactive Graph Explorer
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`pb-3.5 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'compliance'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Architectural Compliance & Drift
        </button>
      </div>

      {error && (
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-destructive">Load Error</p>
            <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            <Button size="xs" variant="outline" className="mt-2 text-xs" onClick={() => fetchRepositoryArchitecture(selectedRepoId)}>
              Retry Load
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'explorer' && (
        <>
          {dataLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <RefreshCw className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Rebuilding modular architecture graph layout...</p>
        </div>
      ) : graphData.nodes.length === 0 ? (
        <div className="p-12 border border-dashed rounded-2xl text-center space-y-4">
          <Cpu className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-lg">No Architecture Graph Built</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The knowledge graph for this repository has not been initialized. Rebuild it to enable architectural analysis.
          </p>
          <Button
            onClick={async () => {
              setDataLoading(true);
              try {
                await fetch(`/api/v1/repositories/${selectedRepoId}/knowledge/build`, {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` },
                });
                fetchRepositoryArchitecture(selectedRepoId);
              } catch (e) {
                setError('Failed to trigger builder.');
                setDataLoading(false);
              }
            }}
          >
            Build Knowledge Graph
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-12 items-start">
          {/* Main Visualizer Area */}
          <div className="xl:col-span-8 flex flex-col space-y-6">
            <ArchitectureVisualizer
              nodes={graphData.nodes}
              relationships={graphData.relationships}
              domains={domains}
              onSelectNode={setSelectedNode}
            />

            {/* Quick Architecture Summary Row */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              <div className="p-4 border rounded-xl bg-card shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold">Domains</span>
                  <Layers className="h-4 w-4 text-violet-500" />
                </div>
                <p className="text-2xl font-bold mt-1.5">{domains.length}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Clustered subdomains</p>
              </div>

              <div className="p-4 border rounded-xl bg-card shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold">APIs</span>
                  <Network className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold mt-1.5">{statistics['API Endpoint'] || statistics['API'] || 0}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">REST Endpoints exposes</p>
              </div>

              <div className="p-4 border rounded-xl bg-card shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold">Services</span>
                  <Zap className="h-4 w-4 text-teal-500" />
                </div>
                <p className="text-2xl font-bold mt-1.5">{statistics['Service'] || 0}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Core business logic</p>
              </div>

              <div className="p-4 border rounded-xl bg-card shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-semibold">Databases</span>
                  <Database className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold mt-1.5">{statistics['Database Table'] || 0}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Data schemas owned</p>
              </div>
            </div>
          </div>

          {/* Details Sidebar panel */}
          <div className="xl:col-span-4 space-y-6">
            {/* Active Selection Details Card */}
            <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  Hierarchy Component Inspector
                </h3>
              </div>

              {selectedNode ? (
                <div className="p-5 space-y-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">
                        {selectedNode.type}
                      </span>
                      {selectedNode.properties?.language && (
                        <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 bg-accent text-accent-foreground rounded border">
                          {selectedNode.properties.language}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground mt-2 break-all leading-tight">
                      {selectedNode.name}
                    </h2>
                    {selectedNode.properties?.path && (
                      <p className="text-[10px] text-muted-foreground font-mono bg-muted/40 p-2 rounded-lg mt-2 break-all border select-all">
                        {selectedNode.properties.path}
                      </p>
                    )}
                  </div>

                  {/* Premium Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 bg-muted/20 border border-border/50 rounded-xl p-3.5 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">Language</span>
                      <span className="font-bold text-foreground mt-0.5">
                        {selectedNode.properties?.language || 
                         (selectedNode.properties?.path?.endsWith('.py') ? 'Python' : 
                          selectedNode.properties?.path?.endsWith('.ts') || selectedNode.properties?.path?.endsWith('.tsx') ? 'TypeScript' : 
                          selectedNode.properties?.path?.endsWith('.js') || selectedNode.properties?.path?.endsWith('.jsx') ? 'JavaScript' : 'TypeScript')}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">Complexity</span>
                      <span className="font-bold mt-0.5 text-foreground">
                        {selectedNode.properties?.complexity || 
                         (selectedNode.properties?.cyclomatic_complexity ? 
                          (selectedNode.properties.cyclomatic_complexity > 20 ? 'High' : 
                           selectedNode.properties.cyclomatic_complexity > 10 ? 'Medium' : 'Low') : 'Medium')}
                      </span>
                    </div>
                    <div className="flex flex-col border-t border-border/40 pt-2.5 mt-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">Dependencies</span>
                      <span className="font-bold text-foreground mt-0.5">
                        {nodeConnections.outgoing.length}
                      </span>
                    </div>
                    <div className="flex flex-col border-t border-border/40 pt-2.5 mt-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">Dependents</span>
                      <span className="font-bold text-foreground mt-0.5">
                        {nodeConnections.incoming.length}
                      </span>
                    </div>
                    <div className="flex flex-col border-t border-border/40 pt-2.5 mt-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">Health Score</span>
                      <span className="font-bold text-emerald-500 mt-0.5">
                        {selectedNode.properties?.health || '92%'}
                      </span>
                    </div>
                    <div className="flex flex-col border-t border-border/40 pt-2.5 mt-1">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase">Files Impacted</span>
                      <span className="font-bold text-foreground mt-0.5">
                        {selectedNode.properties?.files_count || selectedNode.properties?.files || 
                         (selectedNode.type === 'Domain' ? selectedNode.properties?.components_count || 15 : 15)}
                      </span>
                    </div>
                  </div>

                  {/* AI Memory Node Context details */}
                  {nodeContextLoading ? (
                    <div className="py-6 flex flex-col items-center justify-center text-muted-foreground space-y-2 border-t pt-4">
                      <div className="h-4 w-4 animate-spin rounded-full border border-primary border-t-transparent" />
                      <p className="text-[10px] font-semibold animate-pulse">Loading AI node context...</p>
                    </div>
                  ) : (
                    nodeContext && (
                      <div className="border-t pt-4 space-y-4 text-xs animate-in fade-in-50 duration-200">
                        <div className="flex items-center gap-1.5 text-primary">
                          <Brain className="h-4 w-4" />
                          <h4 className="font-bold text-xs uppercase tracking-wider">AI Repository Context</h4>
                        </div>
                        
                        <div className="space-y-3.5">
                          {nodeContext.description && (
                            <div>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Description</span>
                              <p className="text-foreground leading-normal mt-0.5">{nodeContext.description}</p>
                            </div>
                          )}
                          {nodeContext.purpose && (
                            <div>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Purpose</span>
                              <p className="text-foreground leading-normal mt-0.5">{nodeContext.purpose}</p>
                            </div>
                          )}
                          {nodeContext.owner && (
                            <div>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase block">Owner</span>
                              <span className="font-mono bg-muted/60 text-[10px] text-foreground px-2 py-0.5 rounded border inline-block mt-0.5">{nodeContext.owner}</span>
                            </div>
                          )}
                          {nodeContext.history && nodeContext.history.length > 0 && (
                            <div>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Evolution History</span>
                              <ul className="list-disc pl-4 text-muted-foreground space-y-1 text-[11px]">
                                {nodeContext.history.map((h: string, idx: number) => (
                                  <li key={idx}>{h}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {nodeContext.related_documents && nodeContext.related_documents.length > 0 && (
                            <div>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Related Documents</span>
                              <div className="flex flex-wrap gap-1.5">
                                {nodeContext.related_documents.map((d: string, idx: number) => (
                                  <span key={idx} className="font-mono text-[9px] bg-blue-500/5 text-blue-600 border border-blue-500/10 px-1.5 py-0.5 rounded">{d}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {nodeContext.related_commits && nodeContext.related_commits.length > 0 && (
                            <div>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Related Commits</span>
                              <div className="space-y-1">
                                {nodeContext.related_commits.map((c: string, idx: number) => (
                                  <div key={idx} className="font-mono text-[9px] bg-purple-500/5 text-purple-600 border border-purple-500/10 p-1.5 rounded">{c}</div>
                                ))}
                              </div>
                            </div>
                          )}
                          {nodeContext.related_prs && nodeContext.related_prs.length > 0 && (
                            <div>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Related PRs</span>
                              <div className="flex flex-wrap gap-1.5">
                                {nodeContext.related_prs.map((p: string, idx: number) => (
                                  <span key={idx} className="font-mono text-[9px] bg-emerald-500/5 text-emerald-600 border border-emerald-500/10 px-1.5 py-0.5 rounded">{p}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {nodeContext.related_issues && nodeContext.related_issues.length > 0 && (
                            <div>
                              <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-1">Related Issues</span>
                              <div className="flex flex-wrap gap-1.5">
                                {nodeContext.related_issues.map((i: string, idx: number) => (
                                  <span key={idx} className="font-mono text-[9px] bg-rose-500/5 text-rose-600 border border-rose-500/10 px-1.5 py-0.5 rounded">{i}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}

                  {/* Properties table */}
                  {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Properties</h4>
                      <div className="border rounded-lg overflow-hidden text-xs">
                        <table className="w-full border-collapse">
                          <tbody>
                            {Object.entries(selectedNode.properties).map(([key, val]) => {
                              if (typeof val === 'object' || key === 'path' || key === 'full_name' || key === 'clone_url') return null;
                              return (
                                <tr key={key} className="border-b border-border/40 last:border-0 hover:bg-muted/10">
                                  <td className="p-2 font-medium text-muted-foreground/80 bg-muted/20 w-1/3 truncate">{key}</td>
                                  <td className="p-2 break-all font-mono text-[10px] text-foreground">{String(val)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Incoming Connections (Callers/Importers) */}
                  {nodeConnections.incoming.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Incoming Connections ({nodeConnections.incoming.length})
                      </h4>
                      <div className="max-h-40 overflow-y-auto border rounded-lg divide-y divide-border/40 bg-muted/10">
                        {nodeConnections.incoming.map((link, idx) => (
                          <div key={idx} className="p-2 flex items-center justify-between text-xs hover:bg-muted/30">
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="font-semibold truncate text-foreground">{link.node.name}</span>
                              <span className="text-[9px] text-muted-foreground uppercase font-semibold">{link.node.type}</span>
                            </div>
                            <span className="text-[9px] font-mono bg-primary/5 text-primary border px-1.5 py-0.5 rounded flex-shrink-0">
                              {link.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Outgoing Connections (Callees/Imports) */}
                  {nodeConnections.outgoing.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Outgoing Connections ({nodeConnections.outgoing.length})
                      </h4>
                      <div className="max-h-40 overflow-y-auto border rounded-lg divide-y divide-border/40 bg-muted/10">
                        {nodeConnections.outgoing.map((link, idx) => (
                          <div key={idx} className="p-2 flex items-center justify-between text-xs hover:bg-muted/30">
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="font-semibold truncate text-foreground">{link.node.name}</span>
                              <span className="text-[9px] text-muted-foreground uppercase font-semibold">{link.node.type}</span>
                            </div>
                            <span className="text-[9px] font-mono bg-primary/5 text-primary border px-1.5 py-0.5 rounded flex-shrink-0">
                              {link.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <HelpCircle className="h-8 w-8 text-muted-foreground/45 mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    Click any node in the architecture map to inspect its full properties, metrics, and incoming/outgoing call graphs.
                  </p>
                </div>
              )}
            </div>

            {/* Architecture Patterns Detected Card */}
            <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-violet-500" />
                  Architectural Patterns Detected
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {patterns.length > 0 ? (
                  patterns.map((pat, idx) => (
                    <div key={idx} className="p-3.5 border border-border/80 rounded-xl bg-muted/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          {pat.pattern}
                        </span>
                        <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                          Confidence: {Math.round(pat.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-normal">{pat.description}</p>
                      {pat.evidence && pat.evidence.length > 0 && (
                        <div className="border-t border-border/40 pt-2 mt-2">
                          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Evidence Discovered:</span>
                          <ul className="list-disc pl-3.5 text-[9px] text-muted-foreground mt-1 space-y-1 font-mono">
                            {pat.evidence.slice(0, 3).map((ev: string, evIdx: number) => (
                              <li key={evIdx} className="break-all">{ev}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No specific architecture patterns detected yet.</p>
                )}
            </div>
          </div>
        </div>
      </div>
    )}
  </>
)}

      {/* Tab Content: Compliance & Drift Dashboard */}
      {activeTab === 'compliance' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {driftLoading || rulesLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
              <RefreshCw className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground animate-pulse">Running architectural compliance engine...</p>
            </div>
          ) : !driftReport ? (
            <div className="p-12 border border-dashed rounded-2xl text-center space-y-4 text-muted-foreground bg-card">
              <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto" />
              <h3 className="font-bold text-sm">Failed to Run Compliance Engine</h3>
              <p className="text-xs">The drift detection service encountered an issue. Ensure your repository contains a valid build.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-12 items-start">
              {/* Left Column: Metrics & Active Violations */}
              <div className="xl:col-span-8 space-y-6">
                
                {/* Compliance score card */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-3 border rounded-2xl bg-card p-6 shadow-sm">
                  {/* Gauge */}
                  <div className="flex flex-col items-center justify-center space-y-3 border-b md:border-b-0 md:border-r pb-6 md:pb-0 pr-0 md:pr-6">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Compliance Score</span>
                    <div className="relative flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="48"
                          className="text-muted/10"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="48"
                          className={
                            driftReport.compliance_score >= 90
                              ? 'text-emerald-500'
                              : driftReport.compliance_score >= 70
                              ? 'text-yellow-500'
                              : 'text-rose-500'
                          }
                          strokeWidth="8"
                          strokeDasharray="301.6"
                          strokeDashoffset={301.6 - (301.6 * (driftReport.compliance_score ?? 100)) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-foreground">
                          {driftReport.compliance_score}%
                        </span>
                        <span className="text-[9px] font-bold uppercase text-muted-foreground mt-0.5">
                          {driftReport.compliance_score >= 90
                            ? 'Healthy'
                            : driftReport.compliance_score >= 70
                            ? 'Warning'
                            : 'Critical'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* High level stats metrics */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4 pl-0 md:pl-2">
                    <div className="p-4 border rounded-xl bg-muted/5 flex flex-col justify-between hover:bg-muted/10 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Critical Breaches</span>
                        <ShieldAlert className="h-4 w-4 text-rose-500" />
                      </div>
                      <p className="text-2xl font-black text-rose-500 mt-2">
                        {driftReport.violations.filter((v: any) => v.severity === 'critical').length}
                      </p>
                      <span className="text-[9px] text-muted-foreground mt-1">Requires hotfixes</span>
                    </div>

                    <div className="p-4 border rounded-xl bg-muted/5 flex flex-col justify-between hover:bg-muted/10 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Design Warnings</span>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-black text-yellow-500 mt-2">
                        {driftReport.violations.filter((v: any) => v.severity === 'warning').length}
                      </p>
                      <span className="text-[9px] text-muted-foreground mt-1">Diverging dependencies</span>
                    </div>

                    <div className="p-4 border rounded-xl bg-muted/5 flex flex-col justify-between hover:bg-muted/10 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Enforced Rules</span>
                        <Settings className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-2xl font-black text-foreground mt-2">
                        {(rules?.layers?.length ?? 0) + (rules?.boundaries?.length ?? 0) + (rules?.patterns?.length ?? 0)}
                      </p>
                      <span className="text-[9px] text-muted-foreground mt-1">Active guardrails</span>
                    </div>

                    <div className="p-4 border rounded-xl bg-muted/5 flex flex-col justify-between hover:bg-muted/10 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Architecture Grade</span>
                        <Award className="h-4 w-4 text-violet-500" />
                      </div>
                      <p className="text-2xl font-black text-foreground mt-2">
                        {driftReport.compliance_score >= 90 ? 'A+' : driftReport.compliance_score >= 80 ? 'B' : driftReport.compliance_score >= 70 ? 'C' : 'F'}
                      </p>
                      <span className="text-[9px] text-muted-foreground mt-1">Overall rating score</span>
                    </div>
                  </div>
                </div>

                {/* Governance Alert List */}
                {driftReport.alerts.length > 0 && (
                  <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-yellow-600">
                      <ShieldAlert className="h-4 w-4" />
                      <h3 className="font-bold text-xs uppercase tracking-wider">Governance Violations Alerts</h3>
                    </div>
                    <div className="divide-y divide-yellow-500/10">
                      {driftReport.alerts.map((alert: any, idx: number) => (
                        <div key={idx} className="py-2.5 flex items-start gap-2.5 text-xs text-yellow-800 last:pb-0">
                          <Info className="h-4 w-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                          <span>{alert.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Violations Details View */}
                <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
                  <div className="p-5 border-b bg-muted/20">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-500" />
                      Detected Architectural Drift Violations ({driftReport.violations.length})
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Active connections violating layer flow, domain boundary isolation, or design rules.
                    </p>
                  </div>

                  {driftReport.violations.length === 0 ? (
                    <div className="p-12 text-center space-y-3 text-muted-foreground">
                      <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto" />
                      <p className="text-sm font-bold text-foreground">Zero Architectural Drift Detected</p>
                      <p className="text-xs">Your repository is fully compliant with the intended layout.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[9px]">
                            <th className="p-4">Anomaly Details</th>
                            <th className="p-4">Violator Source</th>
                            <th className="p-4">Target Component</th>
                            <th className="p-4">Remediation Guide</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {driftReport.violations.map((v: any, idx: number) => (
                             <tr key={idx} className="hover:bg-muted/5 transition-all">
                               <td className="p-4 space-y-1.5 max-w-[280px]">
                                 <div className="flex items-center gap-1.5 flex-wrap">
                                   <span className={`px-2 py-0.5 text-[8px] uppercase font-bold rounded border ${
                                     v.severity === 'critical' 
                                       ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                                       : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                                   }`}>
                                     {v.severity}
                                   </span>
                                   {v.severity_score && (
                                     <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded border bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono">
                                       Score: {v.severity_score}
                                     </span>
                                   )}
                                   {v.type === 'boundary_violation' && v.severity === 'critical' && (
                                     <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded border bg-rose-600 text-white border-rose-700 animate-pulse font-mono">
                                       Leakage
                                     </span>
                                   )}
                                   <span className="text-[9px] font-bold text-muted-foreground uppercase font-mono">
                                     {v.type.replace(/_/g, ' ')}
                                   </span>
                                 </div>
                                 <p className="font-semibold text-foreground leading-normal">{v.message}</p>
                                 {v.affected_modules && v.affected_modules.length > 0 && (
                                   <div className="mt-2 flex flex-wrap items-center gap-1 bg-rose-500/5 border border-rose-500/15 p-2 rounded-xl text-[9px] font-mono">
                                     <span className="text-muted-foreground uppercase text-[8px] font-black mr-1 block w-full">Cycle Path:</span>
                                     {v.affected_modules.map((m: string, midx: number) => (
                                       <React.Fragment key={midx}>
                                         {midx > 0 && <span className="text-rose-400">➔</span>}
                                         <span className="bg-rose-500/10 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold max-w-[120px] truncate" title={m}>
                                           {m.split('/').pop()}
                                         </span>
                                       </React.Fragment>
                                     ))}
                                     <span className="text-rose-400">➔</span>
                                     <span className="bg-rose-500/10 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold max-w-[120px] truncate" title={v.affected_modules[0]}>
                                       {v.affected_modules[0].split('/').pop()}
                                     </span>
                                   </div>
                                 )}
                               </td>
                               <td className="p-4 max-w-[200px]">
                                 <p className="font-bold text-foreground truncate">{v.source_node?.name || 'N/A'}</p>
                                 {v.source_node?.file_path && (
                                   <p className="text-[9px] text-muted-foreground font-mono truncate">{v.source_node.file_path}</p>
                                 )}
                               </td>
                               <td className="p-4 max-w-[200px]">
                                 <p className="font-bold text-foreground truncate">{v.target_node?.name || 'N/A'}</p>
                                 {v.target_node?.file_path && (
                                   <p className="text-[9px] text-muted-foreground font-mono truncate">{v.target_node.file_path}</p>
                                 )}
                               </td>
                               <td className="p-4 max-w-[280px]">
                                 <div className="p-3 border rounded-xl bg-muted/20 text-muted-foreground leading-normal font-medium text-[11px] space-y-1">
                                   <p>{v.suggested_fix || (
                                     v.type === 'layer_violation' 
                                       ? `Direct connection between layers. Abstract dependencies or introduce a mediator/Service.` 
                                       : v.type === 'boundary_violation'
                                       ? `Cross-domain leakage. Decouple domain packages by introducing REST/gRPC or events.`
                                       : v.type === 'circular_dependency'
                                       ? `Cycle loop detected. Break loop by exposing helper classes or abstractions.`
                                       : `Clean interface violation. Enforce API routes to query service layers instead.`
                                   )}</p>
                                 </div>
                               </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Microservice Boundary Analysis Panel */}
                {driftReport.microservice_boundary_analysis && (
                  <div className="border rounded-2xl bg-card shadow-sm overflow-hidden space-y-6 p-6">
                    <div>
                      <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                        <Network className="h-5 w-5 text-indigo-500" />
                        Microservice Boundary Analysis
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Detect tight service coupling, shared database tables, direct synchronous runtime dependency links, and distributed monolith risk metrics.
                      </p>
                    </div>

                    {/* Distributed Monolith Smell indicator */}
                    {driftReport.microservice_boundary_analysis.distributed_monolith_indicators && (
                      <div className="border rounded-xl p-4 bg-muted/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-4 md:pb-0 pr-0 md:pr-4">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Distributed Monolith Risk</span>
                          <div className={`mt-2 px-3 py-1.5 rounded-full text-xs font-black uppercase border tracking-wider text-center w-full max-w-[150px] ${
                            driftReport.microservice_boundary_analysis.distributed_monolith_indicators.risk_level === 'high'
                              ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                              : driftReport.microservice_boundary_analysis.distributed_monolith_indicators.risk_level === 'medium'
                              ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          }`}>
                            {driftReport.microservice_boundary_analysis.distributed_monolith_indicators.risk_level} Risk
                          </div>
                          <span className="text-[9px] text-muted-foreground mt-1.5 font-bold">Smell Index: {driftReport.microservice_boundary_analysis.distributed_monolith_indicators.score}/100</span>
                        </div>
                        <div className="md:col-span-8 space-y-2">
                          <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-wider block">Smell Indicators Discovered:</span>
                          <ul className="space-y-1.5 text-xs text-muted-foreground font-medium pl-3.5 list-disc">
                            {driftReport.microservice_boundary_analysis.distributed_monolith_indicators.reasons.map((r: string, rIdx: number) => (
                              <li key={rIdx} className="leading-snug">{r}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                      {/* Shared Databases section */}
                      <div className="border rounded-xl p-4.5 bg-card space-y-3">
                        <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider border-b pb-2">
                          <Database className="h-4 w-4 text-yellow-500" />
                          Shared Databases ({driftReport.microservice_boundary_analysis.shared_databases.length})
                        </div>
                        {driftReport.microservice_boundary_analysis.shared_databases.length > 0 ? (
                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {driftReport.microservice_boundary_analysis.shared_databases.map((db: any, sIdx: number) => (
                              <div key={sIdx} className="p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-xl space-y-1.5">
                                <p className="font-bold text-foreground text-xs font-mono">{db.table_name}</p>
                                <div className="flex flex-wrap gap-1">
                                  <span className="text-[8px] font-black text-muted-foreground uppercase mr-1">Shared by:</span>
                                  {db.domains_accessing.map((dom: string) => (
                                    <span key={dom} className="px-1.5 py-0.5 text-[8px] font-extrabold bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/25 rounded-md uppercase font-mono">
                                      {dom}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-normal">{db.message}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-muted-foreground py-6 text-center">No shared database couplings detected. Database isolation matches microservice standards.</p>
                        )}
                      </div>

                      {/* Tight Coupling & Sync Calls section */}
                      <div className="border rounded-xl p-4.5 bg-card space-y-3">
                        <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider border-b pb-2">
                          <Cpu className="h-4 w-4 text-indigo-500" />
                          Tight Coupling & Sync Calls
                        </div>
                        <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                          {driftReport.microservice_boundary_analysis.tight_coupling.length > 0 || driftReport.microservice_boundary_analysis.excessive_sync_communication.length > 0 ? (
                            <>
                              {driftReport.microservice_boundary_analysis.tight_coupling.map((tc: any, tIdx: number) => (
                                <div key={`tc-${tIdx}`} className="p-3 border border-indigo-500/20 bg-indigo-500/5 rounded-xl space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-foreground text-xs uppercase font-mono">{tc.boundary}</span>
                                    <span className="text-[8px] font-black bg-indigo-500/10 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-500/20">Tight Coupling</span>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground leading-normal">{tc.message}</p>
                                </div>
                              ))}
                              {driftReport.microservice_boundary_analysis.excessive_sync_communication.map((sc: any, sIdx: number) => (
                                <div key={`sc-${sIdx}`} className="p-3 border border-pink-500/20 bg-pink-500/5 rounded-xl space-y-1">
                                  <div className="flex items-center justify-between text-[8px] font-black text-pink-600 uppercase">
                                    <span>Sync Call</span>
                                    <span>{sc.source_domain} ➔ {sc.target_domain}</span>
                                  </div>
                                  <p className="font-bold text-foreground text-[10px] font-mono leading-tight">{sc.source} ➔ {sc.target}</p>
                                  <p className="text-[9px] text-muted-foreground leading-normal">{sc.message}</p>
                                </div>
                              ))}
                            </>
                          ) : (
                            <p className="text-[11px] text-muted-foreground py-6 text-center">No tightly coupled cross-domain dependencies or runtime synchronous calls identified.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Rules Management panel */}
              <div className="xl:col-span-4 space-y-6">
                <div className="border rounded-2xl bg-card shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-muted/20">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-primary" />
                      Configure Intended Architecture
                    </h3>
                  </div>

                  <div className="flex border-b border-border/50 bg-muted/10 p-1 flex-wrap">
                    {['layers', 'boundaries', 'patterns', 'custom_rules'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setActiveRuleTab(t as any)}
                        className={`flex-1 py-1.5 text-[9px] uppercase tracking-wider font-bold rounded-lg transition-all px-2 ${
                          activeRuleTab === t
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t === 'custom_rules' ? 'custom rules' : t}
                      </button>
                    ))}
                  </div>

                  <div className="p-5 space-y-4">
                    {editingRules && (
                      <>
                        {/* Tab Content: Layers */}
                        {activeRuleTab === 'layers' && (
                          <div className="space-y-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Architectural Layer Definitions</span>
                            {editingRules.layers?.map((layer: any, index: number) => (
                              <div key={index} className="p-3.5 border rounded-xl bg-muted/10 space-y-3 relative group">
                                <button
                                  onClick={() => {
                                    const copy = { ...editingRules };
                                    copy.layers.splice(index, 1);
                                    setEditingRules(copy);
                                  }}
                                  className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                  title="Delete Layer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                
                                <div>
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase block">Layer Name</label>
                                  <input
                                    type="text"
                                    value={layer.name}
                                    onChange={(e) => {
                                      const copy = { ...editingRules };
                                      copy.layers[index].name = e.target.value;
                                      setEditingRules(copy);
                                    }}
                                    className="w-full bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase block">File Path Patterns</label>
                                  <input
                                    type="text"
                                    value={layer.matching_patterns.join(', ')}
                                    onChange={(e) => {
                                      const copy = { ...editingRules };
                                      copy.layers[index].matching_patterns = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                                      setEditingRules(copy);
                                    }}
                                    placeholder="e.g. *api*, *controller*"
                                    className="w-full bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1.5 font-mono">Allowed Dependencies</label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {editingRules.layers.map((other: any) => {
                                      if (other.name === layer.name) return null;
                                      const isChecked = layer.allowed_dependencies.includes(other.name);
                                      return (
                                        <button
                                          key={other.name}
                                          onClick={() => {
                                            const copy = { ...editingRules };
                                            const deps = copy.layers[index].allowed_dependencies;
                                            if (isChecked) {
                                              copy.layers[index].allowed_dependencies = deps.filter((d: string) => d !== other.name);
                                            } else {
                                              deps.push(other.name);
                                            }
                                            setEditingRules(copy);
                                          }}
                                          className={`px-2 py-1 text-[9px] font-bold border rounded-lg transition-all flex items-center gap-1 ${
                                            isChecked 
                                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' 
                                              : 'bg-background hover:bg-muted text-muted-foreground border-border'
                                          }`}
                                        >
                                          {isChecked && <Check className="h-2.5 w-2.5" />}
                                          {other.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <Button
                              variant="outline"
                              size="xs"
                              className="w-full border-dashed text-[10px] font-bold uppercase tracking-wider"
                              onClick={() => {
                                const copy = { ...editingRules };
                                copy.layers.push({
                                  name: `NewLayer_${copy.layers.length + 1}`,
                                  matching_patterns: [],
                                  allowed_dependencies: []
                                });
                                setEditingRules(copy);
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Layer Rule
                            </Button>
                          </div>
                        )}

                        {/* Tab Content: Boundaries */}
                        {activeRuleTab === 'boundaries' && (
                          <div className="space-y-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Define isolated domains to prevent cross-domain coupling</span>
                            {editingRules.boundaries?.map((boundary: any, index: number) => (
                              <div key={index} className="p-3.5 border rounded-xl bg-muted/10 space-y-3 relative group">
                                <button
                                  onClick={() => {
                                    const copy = { ...editingRules };
                                    copy.boundaries.splice(index, 1);
                                    setEditingRules(copy);
                                  }}
                                  className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                
                                <div>
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase block">Domain Name</label>
                                  <input
                                    type="text"
                                    value={boundary.name}
                                    onChange={(e) => {
                                      const copy = { ...editingRules };
                                      copy.boundaries[index].name = e.target.value;
                                      setEditingRules(copy);
                                    }}
                                    className="w-full bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase block">Path Patterns</label>
                                  <input
                                    type="text"
                                    value={boundary.matching_patterns.join(', ')}
                                    onChange={(e) => {
                                      const copy = { ...editingRules };
                                      copy.boundaries[index].matching_patterns = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
                                      setEditingRules(copy);
                                    }}
                                    placeholder="e.g. */auth/*, */billing/*"
                                    className="w-full bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Forbidden Domain Dependencies</label>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {editingRules.boundaries.map((other: any) => {
                                      if (other.name === boundary.name) return null;
                                      const isForbidden = (boundary.forbidden_dependencies || []).includes(other.name);
                                      return (
                                        <button
                                          key={other.name}
                                          type="button"
                                          onClick={() => {
                                            const copy = { ...editingRules };
                                            const currentForbidden = copy.boundaries[index].forbidden_dependencies || [];
                                            if (isForbidden) {
                                              copy.boundaries[index].forbidden_dependencies = currentForbidden.filter((n: string) => n !== other.name);
                                            } else {
                                              copy.boundaries[index].forbidden_dependencies = [...currentForbidden, other.name];
                                            }
                                            setEditingRules(copy);
                                          }}
                                          className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold transition-all ${
                                            isForbidden
                                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                              : 'bg-background hover:bg-muted text-muted-foreground border-border'
                                          }`}
                                        >
                                          {isForbidden && <X className="h-2.5 w-2.5" />}
                                          {other.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <Button
                              variant="outline"
                              size="xs"
                              className="w-full border-dashed text-[10px] font-bold uppercase tracking-wider"
                              onClick={() => {
                                const copy = { ...editingRules };
                                 copy.boundaries.push({
                                   name: `NewDomain_${copy.boundaries.length + 1}`,
                                   matching_patterns: [],
                                   forbidden_dependencies: []
                                 });
                                setEditingRules(copy);
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Domain Boundary
                            </Button>
                          </div>
                        )}

                        {/* Tab Content: Patterns */}
                        {activeRuleTab === 'patterns' && (
                          <div className="space-y-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Global design and architecture checks</span>
                            {editingRules.patterns?.map((pattern: any, index: number) => (
                              <div key={index} className="p-3.5 border rounded-xl bg-muted/10 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-foreground truncate uppercase font-mono">
                                    {pattern.type.replace(/_/g, ' ')}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Severity</label>
                                    <select
                                      value={pattern.severity}
                                      onChange={(e) => {
                                        const copy = { ...editingRules };
                                        copy.patterns[index].severity = e.target.value;
                                        setEditingRules(copy);
                                      }}
                                      className="w-full bg-background border rounded-lg px-2 py-1 text-[11px] font-semibold mt-1"
                                    >
                                      <option value="critical">Critical</option>
                                      <option value="warning">Warning</option>
                                      <option value="info">Info</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tab Content: Custom Rules */}
                        {activeRuleTab === 'custom_rules' && (
                          <div className="space-y-4">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Enforce bespoke dependency paths or exclusive architectural policies</span>
                            {editingRules.custom_rules?.map((rule: any, index: number) => (
                              <div key={index} className="p-3.5 border rounded-xl bg-muted/10 space-y-3 relative group">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const copy = { ...editingRules };
                                    copy.custom_rules.splice(index, 1);
                                    setEditingRules(copy);
                                  }}
                                  className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                  title="Delete Custom Rule"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                
                                <div>
                                  <label className="text-[9px] font-bold text-muted-foreground uppercase block">Rule Description</label>
                                  <input
                                    type="text"
                                    value={rule.name}
                                    onChange={(e) => {
                                      const copy = { ...editingRules };
                                      copy.custom_rules[index].name = e.target.value;
                                      setEditingRules(copy);
                                    }}
                                    className="w-full bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none"
                                    placeholder="e.g. UI cannot access Repository"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Rule Type</label>
                                    <select
                                      value={rule.type}
                                      onChange={(e) => {
                                        const copy = { ...editingRules };
                                        copy.custom_rules[index].type = e.target.value;
                                        if (e.target.value === 'only_allowed_from' && !rule.allowed_source_matcher) {
                                          copy.custom_rules[index].allowed_source_matcher = '';
                                        }
                                        setEditingRules(copy);
                                      }}
                                      className="w-full bg-background border rounded-lg px-2 py-1.5 text-[11px] font-semibold mt-1"
                                    >
                                      <option value="forbidden">Forbidden Connection</option>
                                      <option value="only_allowed_from">Only Allowed From</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Severity</label>
                                    <select
                                      value={rule.severity}
                                      onChange={(e) => {
                                        const copy = { ...editingRules };
                                        copy.custom_rules[index].severity = e.target.value;
                                        setEditingRules(copy);
                                      }}
                                      className="w-full bg-background border rounded-lg px-2 py-1.5 text-[11px] font-semibold mt-1"
                                    >
                                      <option value="critical">Critical</option>
                                      <option value="warning">Warning</option>
                                      <option value="info">Info</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Source Matcher</label>
                                    <input
                                      type="text"
                                      value={rule.source_matcher}
                                      onChange={(e) => {
                                        const copy = { ...editingRules };
                                        copy.custom_rules[index].source_matcher = e.target.value;
                                        setEditingRules(copy);
                                      }}
                                      className="w-full bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none"
                                      placeholder="e.g. *ui*"
                                      disabled={rule.type === 'only_allowed_from'}
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Target Matcher</label>
                                    <input
                                      type="text"
                                      value={rule.target_matcher}
                                      onChange={(e) => {
                                        const copy = { ...editingRules };
                                        copy.custom_rules[index].target_matcher = e.target.value;
                                        setEditingRules(copy);
                                      }}
                                      className="w-full bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none"
                                      placeholder="e.g. *repository*"
                                    />
                                  </div>
                                </div>

                                {rule.type === 'only_allowed_from' && (
                                  <div>
                                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Allowed Source Matcher</label>
                                    <input
                                      type="text"
                                      value={rule.allowed_source_matcher || ''}
                                      onChange={(e) => {
                                        const copy = { ...editingRules };
                                        copy.custom_rules[index].allowed_source_matcher = e.target.value;
                                        setEditingRules(copy);
                                      }}
                                      className="w-full bg-background border rounded-lg px-2.5 py-1.5 text-xs font-semibold mt-1 focus:outline-none"
                                      placeholder="e.g. *service*"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              className="w-full border-dashed text-[10px] font-bold uppercase tracking-wider"
                              onClick={() => {
                                const copy = { ...editingRules };
                                if (!copy.custom_rules) {
                                  copy.custom_rules = [];
                                }
                                copy.custom_rules.push({
                                  id: `custom_rule_${Date.now()}`,
                                  name: `New Custom Rule ${copy.custom_rules.length + 1}`,
                                  source_matcher: '',
                                  target_matcher: '',
                                  type: 'forbidden',
                                  severity: 'critical'
                                });
                                setEditingRules(copy);
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Custom Rule
                            </Button>
                          </div>
                        )}

                        {/* Save Buttons */}
                        <div className="border-t pt-4 flex gap-3">
                          <Button
                            size="sm"
                            className="flex-1 text-[10px] font-bold uppercase tracking-wider"
                            disabled={savingRules}
                            onClick={() => saveRules(editingRules)}
                          >
                            {savingRules ? 'Saving guardrails...' : 'Apply & Enforce Rules'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] font-bold uppercase tracking-wider"
                            onClick={() => setEditingRules(JSON.parse(JSON.stringify(rules)))}
                          >
                            Reset
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
