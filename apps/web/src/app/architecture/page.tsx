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
    } catch (err: any) {
      setError(err.message || 'Error occurred while loading architecture data.');
    } finally {
      setDataLoading(false);
    }
  }, [token]);

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
    </div>
  );
}
