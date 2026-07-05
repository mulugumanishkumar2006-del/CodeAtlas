'use client';

import * as React from 'react';
import {
  Folder,
  FolderOpen,
  FileCode,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Play,
  RefreshCw,
  Search,
  Database,
  Code,
  GitBranch,
  File,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileText,
  Network,
  Eye,
  Layers,
  Cpu,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Interfaces mapping to backend types
interface FileMetrics {
  complexity_total: number;
  complexity_average: number;
  complexity_max: number;
  complexity_max_function: string | null;
  documentation_symbols: number;
  total_documentable: number;
  coverage_percent: number;
}

interface ImportItem {
  module: string;
  names: string[];
  line: number;
}

interface FileData {
  id: string;
  file_path: string;
  language: string;
  size_bytes: number;
  code_lines: number;
  comment_lines: number;
  blank_lines: number;
  total_lines: number;
  metrics: FileMetrics | null;
  imports: ImportItem[] | null;
}

interface SymbolItem {
  id: string;
  name: string;
  kind: string;
  file_path: string;
  start_line: number;
  start_column: number;
  end_line: number;
  end_column: number;
  parent_name: string | null;
  docstring: string | null;
  is_async: boolean;
  is_exported: boolean;
}

interface Repository {
  id: string;
  name: string;
  full_name: string;
  clone_url: string;
  status: string; // pending, cloning, cloned, failed
}

interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: TreeNode[];
  fileData?: FileData;
}

export default function Home() {
  const { token, user } = useAuth();
  
  // Repositories state
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
  
  // Data for the active repository
  const [files, setFiles] = React.useState<FileData[]>([]);
  const [symbols, setSymbols] = React.useState<SymbolItem[]>([]);
  
  // Active states
  const [activeFile, setActiveFile] = React.useState<FileData | null>(null);
  const [activeTab, setActiveTab] = React.useState<'metrics' | 'classes' | 'functions' | 'imports' | 'ast'>('metrics');

  const [workspaceView, setWorkspaceView] = React.useState<'overview' | 'explorer' | 'symbols' | 'relationships' | 'graph' | 'architecture' | 'query'>('overview');
  const [repoStats, setRepoStats] = React.useState<any | null>(null);
  const [graphNodes, setGraphNodes] = React.useState<any[]>([]);
  const [graphEdges, setGraphEdges] = React.useState<any[]>([]);
  const [layoutNodes, setLayoutNodes] = React.useState<any[]>([]);
  const [selectedGraphNode, setSelectedGraphNode] = React.useState<any | null>(null);
  const [graphSearchQuery, setGraphSearchQuery] = React.useState<string>('');
  
  // Semantic Query Playground State
  const [semanticQuery, setSemanticQuery] = React.useState<string>('');
  const [semanticQueryResponse, setSemanticQueryResponse] = React.useState<any | null>(null);
  const [semanticQueryLoading, setSemanticQueryLoading] = React.useState<boolean>(false);

  const handleSemanticQuerySubmit = async (queryText: string) => {
    if (!token || !selectedRepoId || !queryText.trim()) return;
    setSemanticQueryLoading(true);
    setSemanticQueryResponse(null);
    try {
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}/query/semantic?query=${encodeURIComponent(queryText)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSemanticQueryResponse(data);
      }
    } catch (e) {
      console.error('Semantic query error', e);
    } finally {
      setSemanticQueryLoading(false);
    }
  };

  // Architecture Patterns State
  const [archPatterns, setArchPatterns] = React.useState<any[]>([]);
  const [archLoading, setArchLoading] = React.useState<boolean>(false);

  const fetchPatterns = React.useCallback(async () => {
    if (!token || !selectedRepoId) return;
    setArchLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}/knowledge/patterns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setArchPatterns(data.patterns || []);
      }
    } catch (e) {
      console.error('Failed to fetch patterns', e);
    } finally {
      setArchLoading(false);
    }
  }, [token, selectedRepoId]);

  React.useEffect(() => {
    if (workspaceView === 'architecture' && selectedRepoId) {
      fetchPatterns();
    }
  }, [workspaceView, selectedRepoId, fetchPatterns]);

  // Semantic Search Engine UI State
  const [semanticSearchActive, setSemanticSearchActive] = React.useState<boolean>(false);
  const [semanticSearchLoading, setSemanticSearchLoading] = React.useState<boolean>(false);
  const [collapseClusters, setCollapseClusters] = React.useState<boolean>(false);

  const triggerSemanticSearch = async (queryText: string) => {
    if (!token || !selectedRepoId || !queryText.trim()) {
      setHighlightedNodes(new Set());
      return;
    }
    setSemanticSearchLoading(true);
    try {
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}/knowledge/search?query=${encodeURIComponent(queryText)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const nodeIds = new Set<string>(data.map((n: any) => n.id));
        setHighlightedNodes(nodeIds);
      }
    } catch (e) {
      console.error('Semantic search error', e);
    } finally {
      setSemanticSearchLoading(false);
    }
  };

  const [graphTypeFilter, setGraphTypeFilter] = React.useState<string>('all');
  const [graphViewMode, setGraphViewMode] = React.useState<'all' | 'layers' | 'circular' | 'orphans' | 'domains'>('all');
  const [domainClusters, setDomainClusters] = React.useState<any[]>([]);
  const [highlightedNodes, setHighlightedNodes] = React.useState<Set<string>>(new Set());
  const [highlightedEdges, setHighlightedEdges] = React.useState<Set<string>>(new Set());
  const [graphLoading, setGraphLoading] = React.useState<boolean>(false);
  const [graphErrorMessage, setGraphErrorMessage] = React.useState<string | null>(null);

  // Relationship Search State
  const [relQuery, setRelQuery] = React.useState<string>('');
  const [relType, setRelType] = React.useState<string>('all');
  const [relSrcType, setRelSrcType] = React.useState<string>('all');
  const [relTgtType, setRelTgtType] = React.useState<string>('all');
  const [relationshipsResults, setRelationshipsResults] = React.useState<any[]>([]);
  const [relLoading, setRelLoading] = React.useState<boolean>(false);
  const [relErrorMessage, setRelErrorMessage] = React.useState<string | null>(null);

  // Zoom / Pan
  const [zoom, setZoom] = React.useState<number>(1);
  const [pan, setPan] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState<boolean>(false);
  const [panStart, setPanStart] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Shortest Path Solver (BFS on undirected connection graph)
  const findShortestPath = (nodesList: any[], edgesList: any[], startId: string, endId: string) => {
    if (startId === endId) return [startId];
    
    const adj: Record<string, string[]> = {};
    nodesList.forEach(n => { adj[n.id] = []; });
    edgesList.forEach(e => {
      if (adj[e.source_id] && adj[e.target_id]) {
        adj[e.source_id].push(e.target_id);
        adj[e.target_id].push(e.source_id);
      }
    });
    
    const queue: string[][] = [[startId]];
    const visited = new Set<string>([startId]);
    
    while (queue.length > 0) {
      const path = queue.shift()!;
      const node = path[path.length - 1];
      
      if (node === endId) return path;
      
      const neighbors = adj[node] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }
    return null;
  };

  const fetchStats = React.useCallback(async () => {
    if (!token || !selectedRepoId) return;
    try {
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}/knowledge/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRepoStats(data.statistics || {});
      }
    } catch (e) {
      console.error('Failed to fetch statistics', e);
    }
  }, [token, selectedRepoId]);

  React.useEffect(() => {
    if (selectedRepoId) {
      fetchStats();
    }
  }, [selectedRepoId, fetchStats]);

  const fetchGraphData = React.useCallback(async () => {
    if (!token || !selectedRepoId) return;
    setGraphLoading(true);
    setGraphErrorMessage(null);
    try {
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}/knowledge`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGraphNodes(data.nodes);
        setGraphEdges(data.relationships);
        
        // Compute force layout positions
        const nodes = data.nodes.map((n: any, idx: number) => {
          const angle = (idx / (data.nodes.length || 1)) * 2 * Math.PI;
          const radius = 180 + Math.random() * 60;
          return {
            ...n,
            x: 400 + Math.cos(angle) * radius,
            y: 300 + Math.sin(angle) * radius,
            vx: 0,
            vy: 0
          };
        });

        const edges = data.relationships;
        const width = 800;
        const height = 600;
        const repulsion = 12000;
        const attraction = 0.04;

        // Run force simulation ticks
        for (let tick = 0; tick < 90; tick++) {
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              const dx = nodes[i].x - nodes[j].x;
              const dy = nodes[i].y - nodes[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
              if (dist < 350) {
                const force = repulsion / (dist * dist);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                nodes[i].vx += fx;
                nodes[i].vy += fy;
                nodes[j].vx -= fx;
                nodes[j].vy -= fy;
              }
            }
          }

          for (const edge of edges) {
            const source = nodes.find((n: any) => n.id === edge.source_id);
            const target = nodes.find((n: any) => n.id === edge.target_id);
            if (source && target) {
              const dx = target.x - source.x;
              const dy = target.y - source.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1.0;
              const force = attraction * dist;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              source.vx += fx;
              source.vy += fy;
              target.vx -= fx;
              target.vy -= fy;
            }
          }

          for (const node of nodes) {
            // gravity force to center
            const gc_x = 400 - node.x;
            const gc_y = 300 - node.y;
            node.vx += gc_x * 0.005;
            node.vy += gc_y * 0.005;

            node.x += node.vx;
            node.y += node.vy;
            node.vx *= 0.65;
            node.vy *= 0.65;

            node.x = Math.max(40, Math.min(width - 40, node.x));
            node.y = Math.max(40, Math.min(height - 40, node.y));
          }
        }
        setLayoutNodes(nodes);
      } else {
        setGraphErrorMessage("Failed to retrieve universal graph payload.");
      }
    } catch (e) {
      console.error(e);
      setGraphErrorMessage("Failed to fetch graph payload.");
    } finally {
      setGraphLoading(false);
    }
  }, [token, selectedRepoId]);

  React.useEffect(() => {
    if (workspaceView === 'graph' && selectedRepoId) {
      fetchGraphData();
    }
    // Clear selections and highlights on change
    setSelectedGraphNode(null);
    setHighlightedNodes(new Set());
    setHighlightedEdges(new Set());
    setGraphViewMode('all');
  }, [workspaceView, selectedRepoId, fetchGraphData]);

  const fetchRelationshipsSearch = React.useCallback(async () => {
    if (!token || !selectedRepoId) return;
    setRelLoading(true);
    setRelErrorMessage(null);
    try {
      const params = new URLSearchParams();
      if (relQuery) params.append('query', relQuery);
      if (relType && relType !== 'all') params.append('type', relType);
      if (relSrcType && relSrcType !== 'all') params.append('source_type', relSrcType);
      if (relTgtType && relTgtType !== 'all') params.append('target_type', relTgtType);
      
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}/relationships/search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRelationshipsResults(data);
      } else {
        setRelErrorMessage('Failed to search relationships.');
      }
    } catch (err) {
      console.error(err);
      setRelErrorMessage('Error fetching relationships search.');
    } finally {
      setRelLoading(false);
    }
  }, [token, selectedRepoId, relQuery, relType, relSrcType, relTgtType]);

  React.useEffect(() => {
    if (workspaceView === 'relationships' && selectedRepoId) {
      fetchRelationshipsSearch();
    }
  }, [workspaceView, selectedRepoId, fetchRelationshipsSearch]);

  const handleViewInGraph = (sourceId: string, targetId: string, type: string) => {
    // Make sure graph data is loaded
    if (graphNodes.length === 0) {
      fetchGraphData().then(() => {
        const tgtNode = graphNodes.find(n => n.id === targetId) || graphNodes.find(n => n.id === sourceId);
        if (tgtNode) {
          setSelectedGraphNode(tgtNode);
        }
        setHighlightedNodes(new Set([sourceId, targetId]));
        const matchingEdge = graphEdges.find(e => e.source_id === sourceId && e.target_id === targetId && e.type === type);
        if (matchingEdge) {
          setHighlightedEdges(new Set([matchingEdge.id]));
        } else {
          setHighlightedEdges(new Set());
        }
        setWorkspaceView('graph');
      });
    } else {
      const tgtNode = graphNodes.find(n => n.id === targetId) || graphNodes.find(n => n.id === sourceId);
      if (tgtNode) {
        setSelectedGraphNode(tgtNode);
      }
      setHighlightedNodes(new Set([sourceId, targetId]));
      const matchingEdge = graphEdges.find(e => e.source_id === sourceId && e.target_id === targetId && e.type === type);
      if (matchingEdge) {
        setHighlightedEdges(new Set([matchingEdge.id]));
      } else {
        setHighlightedEdges(new Set());
      }
      setWorkspaceView('graph');
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((z) => Math.max(0.2, Math.min(4, z * zoomFactor)));
  };
  
  // Folder expansion state in tree explorer
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());
  
  // Modal / Add Repo Form state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newRepoName, setNewRepoName] = React.useState('');
  const [newRepoFullName, setNewRepoFullName] = React.useState('');
  const [newRepoCloneUrl, setNewRepoCloneUrl] = React.useState('');
  
  // UI states
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const [isParseLoading, setIsParseLoading] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const selectedRepo = repos.find((r) => r.id === selectedRepoId);

  // 1. Fetch repositories on load or when token changes
  const fetchRepositories = React.useCallback(async (selectFirst = false) => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/repositories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
        if (data.length > 0 && (selectFirst || !selectedRepoId)) {
          setSelectedRepoId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load repositories', e);
    }
  }, [token, selectedRepoId]);

  React.useEffect(() => {
    fetchRepositories(true);
  }, [token]);

  // 2. Fetch structural details for the selected repository
  const fetchRepoData = React.useCallback(async () => {
    if (!token || !selectedRepoId) return;
    setIsRefreshing(true);
    setErrorMessage(null);
    try {
      // Fetch files
      const filesRes = await fetch(`/api/v1/repositories/${selectedRepoId}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Fetch symbols
      const symbolsRes = await fetch(`/api/v1/repositories/${selectedRepoId}/symbols`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (filesRes.ok && symbolsRes.ok) {
        const filesData = await filesRes.json();
        const symbolsData = await symbolsRes.json();
        
        setFiles(filesData);
        setSymbols(symbolsData);
        
        // Auto-select first file if no file is currently selected
        if (filesData.length > 0) {
          setActiveFile(filesData[0]);
          
          // Expand all folders by default on initial parse/load
          const folders = new Set<string>();
          filesData.forEach((f: FileData) => {
            const parts = f.file_path.split('/');
            for (let i = 0; i < parts.length - 1; i++) {
              folders.add(parts.slice(0, i + 1).join('/'));
            }
          });
          setExpandedFolders(folders);
        } else {
          setActiveFile(null);
        }
      }
    } catch (e) {
      console.error('Failed to fetch repository structural details', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [token, selectedRepoId]);

  React.useEffect(() => {
    if (selectedRepoId) {
      fetchRepoData();
    } else {
      setFiles([]);
      setSymbols([]);
      setActiveFile(null);
    }
  }, [selectedRepoId]);

  // 3. Folder expand / collapse toggler
  const toggleFolder = (folderPath: string) => {
    const next = new Set(expandedFolders);
    if (next.has(folderPath)) {
      next.delete(folderPath);
    } else {
      next.add(folderPath);
    }
    setExpandedFolders(next);
  };

  // 4. Trigger parsing workflow
  const handleParse = async () => {
    if (!token || !selectedRepoId) return;
    setIsParseLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}/parse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchRepoData();
      } else {
        const detail = await res.json();
        setErrorMessage(detail.detail || 'Failed to parse repository');
      }
    } catch (e) {
      setErrorMessage('Failed to trigger repository parsing engine');
    } finally {
      setIsParseLoading(false);
    }
  };

  // 5. Add new repository
  const handleAddRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newRepoName || !newRepoCloneUrl || !newRepoFullName) return;
    setIsSubmitLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/v1/repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRepoName,
          full_name: newRepoFullName,
          clone_url: newRepoCloneUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRepos((prev) => [...prev, data]);
        setSelectedRepoId(data.id);
        setShowAddModal(false);
        setNewRepoName('');
        setNewRepoFullName('');
        setNewRepoCloneUrl('');
      } else {
        setErrorMessage('Failed to register repository');
      }
    } catch (err) {
      setErrorMessage('Network error occurred while adding repository');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // 6. Delete repository
  const handleDeleteRepository = async () => {
    if (!token || !selectedRepoId) return;
    if (!confirm('Are you sure you want to delete this repository and purge all cloned files?')) return;
    try {
      const res = await fetch(`/api/v1/repositories/${selectedRepoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const nextRepos = repos.filter((r) => r.id !== selectedRepoId);
        setRepos(nextRepos);
        setSelectedRepoId(nextRepos.length > 0 ? nextRepos[0].id : '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Build the directory tree structure
  const fileTreeRoot = React.useMemo(() => {
    const root: TreeNode = { name: 'root', path: '', isFolder: true, children: [] };
    for (const file of files) {
      const parts = file.file_path.split('/');
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');

        let child = current.children?.find((c) => c.name === part);
        if (!child) {
          child = {
            name: part,
            path: currentPath,
            isFolder: !isLast,
            children: isLast ? undefined : [],
            fileData: isLast ? file : undefined,
          };
          current.children?.push(child);
        }
        current = child;
      }
    }

    function sortTree(node: TreeNode) {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.isFolder && !b.isFolder) return -1;
          if (!a.isFolder && b.isFolder) return 1;
          return a.name.localeCompare(b.name);
        });
        node.children.forEach(sortTree);
      }
    }
    sortTree(root);
    return root;
  }, [files]);

  // Recursively render directory items
  function renderTreeNodes(node: TreeNode, level = 0) {
    if (!node.children) return null;
    return node.children.map((child) => (
      <FileTreeItem
        key={child.path}
        node={child}
        level={level}
        onSelectFile={setActiveFile}
        activeFilePath={activeFile?.file_path || null}
        expandedFolders={expandedFolders}
        toggleFolder={toggleFolder}
      />
    ));
  }

  // Filter symbols based on active file
  const activeFileSymbols = React.useMemo(() => {
    if (!activeFile) return [];
    return symbols.filter((s) => s.file_path === activeFile.file_path);
  }, [activeFile, symbols]);

  // Derived symbols lists
  const activeFileClasses = React.useMemo(() => {
    return activeFileSymbols.filter((s) => s.kind === 'class');
  }, [activeFileSymbols]);

  const activeFileFunctions = React.useMemo(() => {
    return activeFileSymbols.filter((s) => s.kind === 'function' || s.kind === 'method');
  }, [activeFileSymbols]);

  const { displayNodes, displayEdges } = React.useMemo(() => {
    if (!collapseClusters || domainClusters.length === 0) {
      return { displayNodes: layoutNodes, displayEdges: graphEdges };
    }

    const collapsedNodes: any[] = [];
    const collapsedNodeIds = new Set<string>();

    domainClusters.forEach((cluster) => {
      const contained = layoutNodes.filter((n: any) => cluster.node_ids.includes(n.id));
      if (contained.length > 0) {
        const avgX = contained.reduce((sum: number, n: any) => sum + (n.x || 0), 0) / contained.length;
        const avgY = contained.reduce((sum: number, n: any) => sum + (n.y || 0), 0) / contained.length;
        collapsedNodes.push({
          id: `cluster::${cluster.name}`,
          name: cluster.name,
          type: 'DomainCluster',
          x: avgX,
          y: avgY,
          isClusterNode: true,
          containedNodeIds: cluster.node_ids,
          properties: { description: cluster.description }
        });
        cluster.node_ids.forEach((id: string) => collapsedNodeIds.add(id));
      }
    });

    // Add remaining nodes
    layoutNodes.forEach((n: any) => {
      if (!collapsedNodeIds.has(n.id)) {
        collapsedNodes.push(n);
      }
    });

    // Map edges
    const edgeMap = new Map<string, any>();
    graphEdges.forEach((e: any) => {
      let sourceId = e.source_id;
      let targetId = e.target_id;

      const srcCluster = domainClusters.find((c: any) => c.node_ids.includes(sourceId));
      const tgtCluster = domainClusters.find((c: any) => c.node_ids.includes(targetId));

      if (srcCluster) sourceId = `cluster::${srcCluster.name}`;
      if (tgtCluster) targetId = `cluster::${tgtCluster.name}`;

      if (sourceId === targetId) return; // internal connection, hide

      const key = `${sourceId}->${targetId}`;
      if (!edgeMap.has(key)) {
        edgeMap.set(key, {
          id: `collapsed-edge::${key}`,
          source_id: sourceId,
          target_id: targetId,
          type: e.type
        });
      }
    });

    return { displayNodes: collapsedNodes, displayEdges: Array.from(edgeMap.values()) };
  }, [layoutNodes, graphEdges, domainClusters, collapseClusters]);

  const metrics = React.useMemo(() => {
    if (files.length === 0) return null;
    let complexity_total = 0;
    let complexity_max = 0;
    let complexity_max_function = "None";
    let file_count_with_metrics = 0;
    files.forEach((f) => {
      if (f.metrics) {
        complexity_total += f.metrics.complexity_total || 0;
        if ((f.metrics.complexity_max || 0) > complexity_max) {
          complexity_max = f.metrics.complexity_max;
          complexity_max_function = f.metrics.complexity_max_function || "None";
        }
        file_count_with_metrics++;
      }
    });
    const complexity_average = file_count_with_metrics > 0 ? Math.round(complexity_total / file_count_with_metrics) : 0;
    return {
      complexity_total,
      complexity_average,
      complexity_max,
      complexity_max_function
    };
  }, [files]);

  return (
    <div className="space-y-6">
      {/* Top Header bar with selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Repository Explorer
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse directory structures, inspect trees, analyze AST details and calculate cyclomatic complexity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedRepo?.status === 'cloned' && files.length > 0 && (
            <div className="flex items-center rounded-lg border bg-muted/30 p-1 mr-2 shadow-inner">
              <button
                onClick={() => setWorkspaceView('overview')}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-all",
                  workspaceView === 'overview' 
                    ? "bg-background text-foreground shadow border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setWorkspaceView('explorer')}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-all",
                  workspaceView === 'explorer' 
                    ? "bg-background text-foreground shadow border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Files
              </button>
              <button
                onClick={() => setWorkspaceView('symbols')}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-all",
                  workspaceView === 'symbols' 
                    ? "bg-background text-foreground shadow border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Symbols
              </button>
              <button
                onClick={() => setWorkspaceView('relationships')}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-all",
                  workspaceView === 'relationships' 
                    ? "bg-background text-foreground shadow border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Dependencies
              </button>
              <button
                onClick={() => setWorkspaceView('graph')}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-all",
                  workspaceView === 'graph' 
                    ? "bg-background text-foreground shadow border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Knowledge Graph ⭐
              </button>
              <button
                onClick={() => setWorkspaceView('architecture')}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-all",
                  workspaceView === 'architecture' 
                    ? "bg-background text-foreground shadow border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Architecture
              </button>
              <button
                onClick={() => setWorkspaceView('query')}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-all",
                  workspaceView === 'query' 
                    ? "bg-background text-foreground shadow border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Search
              </button>
            </div>
          )}
          {repos.length > 0 ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedRepoId}
                onChange={(e) => setSelectedRepoId(e.target.value)}
                className="rounded-lg border bg-background px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                {repos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.full_name} ({r.status})
                  </option>
                ))}
              </select>
              
              {selectedRepo?.status === 'cloned' && (
                <Button
                  onClick={handleParse}
                  disabled={isParseLoading}
                  className="flex items-center gap-1.5 shadow-sm"
                  variant="default"
                  size="sm"
                >
                  <Play className={cn("h-4 w-4 fill-current", isParseLoading && "animate-spin")} />
                  {files.length > 0 ? 'Reparse' : 'Parse Repository'}
                </Button>
              )}

              {selectedRepo?.status !== 'cloned' && (
                <Button
                  onClick={() => fetchRepositories(false)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Status
                </Button>
              )}

              <Button
                onClick={handleDeleteRepository}
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                title="Delete Repository"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </Button>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground mr-2 font-mono">No repositories registered yet.</span>
          )}

          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 shadow-sm"
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Repo
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Content Workspace Layout */}
      {repos.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed rounded-2xl p-16 text-center bg-card shadow-sm space-y-4">
          <div className="rounded-2xl p-4 bg-primary/5 text-primary">
            <GitBranch className="h-10 w-10" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-xl font-bold tracking-tight">No Repository Registered</h3>
            <p className="text-muted-foreground text-sm">
              Connect a GitHub repository to fetch source code structure, run structural analyses, extract AST symbols, and track codebase complexity.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} size="lg" className="mt-4 shadow-md">
            Register First Repository
          </Button>
        </div>
      ) : selectedRepo?.status === 'pending' || selectedRepo?.status === 'cloning' ? (
        <div className="flex flex-col items-center justify-center border rounded-2xl p-16 bg-card shadow-sm space-y-4">
          <div className="rounded-full p-4 bg-amber-500/10 text-amber-500 animate-pulse">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold">Cloning Repository...</h3>
            <p className="text-muted-foreground text-sm">
              Git clone operations are running in the background. Please wait.
            </p>
          </div>
          <Button onClick={() => fetchRepositories(false)} variant="outline" size="sm" className="mt-2">
            Refresh Status
          </Button>
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-2xl p-16 bg-card shadow-sm space-y-4">
          <div className="rounded-full p-4 bg-primary/10 text-primary">
            <Code className="h-8 w-8" />
          </div>
          <div className="text-center space-y-1 max-w-sm">
            <h3 className="text-lg font-semibold">Repository Cloned Successfully</h3>
            <p className="text-muted-foreground text-sm">
              The git clone operation completed successfully, but the codebase has not been analyzed yet.
            </p>
          </div>
          <Button onClick={handleParse} disabled={isParseLoading} className="mt-2 shadow-md">
            {isParseLoading ? 'Parsing...' : 'Trigger Parsing Engine'}
          </Button>
        </div>
      ) : workspaceView === 'overview' ? (
        <div className="grid gap-6 md:grid-cols-12 items-start h-[calc(100vh-230px)] overflow-y-auto">
          {/* Main repo info metrics cards (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                📂 Repository Knowledge Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                Repository statistics, metrics, and entity distributions loaded in the local Neo4j/PostgreSQL graph databases.
              </p>
              
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                <div className="border rounded-xl p-4 bg-muted/10 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Complexity Total</span>
                  <p className="text-xl font-bold font-mono mt-1 text-primary">{metrics?.complexity_total || 0}</p>
                </div>
                <div className="border rounded-xl p-4 bg-muted/10 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Complexity Average</span>
                  <p className="text-xl font-bold font-mono mt-1 text-teal-400">{metrics?.complexity_average || 0}</p>
                </div>
                <div className="border rounded-xl p-4 bg-muted/10 text-left">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Complexity Max</span>
                  <p className="text-xl font-bold font-mono mt-1 text-amber-500">{metrics?.complexity_max || 0}</p>
                </div>
              </div>
            </div>

            {/* Entity distribution stats card */}
            <div className="border rounded-2xl bg-card p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Knowledge Graph Entity Count</h4>
              {repoStats && Object.keys(repoStats).length > 0 ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                  {Object.entries(repoStats).map(([type, count]: any) => (
                    <div key={type} className="border rounded-xl p-4 bg-muted/10 text-left hover:scale-[1.01] transition-transform">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{type}s</span>
                      <p className="text-xl font-bold font-mono mt-1 text-foreground">{count}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No entities statistics available. Parse the codebase to populate.
                </div>
              )}
            </div>
          </div>

          {/* Quick links & summary details panel (4 cols) */}
          <div className="md:col-span-4 border rounded-2xl bg-card p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Repository Metadata</h4>
            <div className="divide-y space-y-2 text-xs">
              <div className="flex justify-between py-2 font-mono">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-bold text-foreground">{selectedRepo?.name}</span>
              </div>
              <div className="flex justify-between py-2 font-mono">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-bold text-teal-400 capitalize">{selectedRepo?.status}</span>
              </div>
              <div className="flex justify-between py-2 font-mono">
                <span className="text-muted-foreground">Path:</span>
                <span className="font-bold text-foreground truncate max-w-[200px]" title={selectedRepo?.clone_url}>{selectedRepo?.clone_url}</span>
              </div>
              <div className="flex justify-between py-2 font-mono">
                <span className="text-muted-foreground">Max Complexity:</span>
                <span className="font-bold text-foreground truncate max-w-[200px]" title={metrics?.complexity_max_function || ''}>{metrics?.complexity_max_function || 'None'}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t flex flex-col gap-2">
              <Button onClick={() => setWorkspaceView('explorer')} className="w-full text-xs font-semibold">
                Explore Files
              </Button>
              <Button onClick={() => setWorkspaceView('graph')} variant="outline" className="w-full text-xs font-semibold">
                View Knowledge Graph
              </Button>
            </div>
          </div>
        </div>
      ) : workspaceView === 'symbols' ? (
        <div className="flex flex-col border rounded-2xl bg-card shadow-sm h-[calc(100vh-230px)] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-primary animate-pulse" />
              Repository Flat Symbols List
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {symbols.length} Symbol(s) Extracted
            </span>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6">
            {symbols.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground text-xs">
                No symbols extracted yet. Parse the codebase.
              </div>
            ) : (
              <div className="border rounded-xl bg-card overflow-hidden">
                <table className="min-w-full divide-y divide-border/60">
                  <thead className="bg-muted/30">
                    <tr className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="py-3 px-4">Symbol Name</th>
                      <th className="py-3 px-4">Kind</th>
                      <th className="py-3 px-4">File Path</th>
                      <th className="py-3 px-4">Complexity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-xs">
                    {symbols.map((sym: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground break-all">{sym.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            {sym.kind}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground truncate max-w-[240px]" title={sym.file_path}>
                          {sym.file_path}
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">{sym.complexity || 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : workspaceView === 'architecture' ? (
        <div className="flex flex-col border rounded-2xl bg-card shadow-sm h-[calc(100vh-230px)] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-primary animate-pulse" />
              Architectural Pattern Analytics
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {archLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                <span className="text-sm font-semibold text-muted-foreground font-mono">Running architecture inference...</span>
              </div>
            ) : archPatterns && Object.keys(archPatterns).length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(archPatterns).map(([patternName, pattern]: any) => (
                  <div key={patternName} className="border rounded-2xl p-5 bg-card/60 hover:shadow-md transition-all space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-foreground">{patternName}</h4>
                      <span className="text-xs font-mono font-bold bg-primary/10 border text-primary px-2.5 py-0.5 rounded-full">
                        Score: {Math.round(pattern.confidence * 100)}%
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pattern.description}
                    </p>

                    <div className="w-full bg-muted/20 rounded-full h-2 shadow-inner">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pattern.confidence * 100}%` }}
                      />
                    </div>

                    {pattern.evidence && pattern.evidence.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Structural Evidence</span>
                        <ul className="text-[11px] font-mono text-muted-foreground list-disc pl-4 space-y-1">
                          {pattern.evidence.map((ev: string, idx: number) => (
                            <li key={idx} className="break-all">{ev}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground text-xs">
                No architectural patterns detected.
              </div>
            )}
          </div>
        </div>
      ) : workspaceView === 'query' ? (
        <div className="flex flex-col border rounded-2xl bg-card shadow-sm h-[calc(100vh-230px)] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary animate-pulse" />
              Knowledge Query Engine
            </span>
            <span className="text-[10px] bg-accent px-2 py-0.5 rounded font-mono font-bold text-muted-foreground uppercase">
              Semantic Search
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden items-stretch">
            {/* Left query entry column (4 cols) */}
            <div className="lg:col-span-4 border-r p-6 space-y-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-foreground uppercase tracking-wide">Enter Question</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Ask questions about codebase ownership, configurations, data writes, or endpoints.</p>
                </div>
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSemanticQuerySubmit(semanticQuery);
                  }}
                  className="space-y-2"
                >
                  <textarea
                    value={semanticQuery}
                    onChange={(e) => setSemanticQuery(e.target.value)}
                    placeholder="e.g. Which modules interact with Redis?"
                    className="w-full h-24 rounded-lg border bg-background px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-inner resize-none text-foreground placeholder-muted-foreground/60"
                  />
                  <Button
                    type="submit"
                    disabled={semanticQueryLoading || !semanticQuery.trim()}
                    className="w-full flex items-center justify-center gap-1.5 shadow-md h-8 text-xs font-bold"
                  >
                    {semanticQueryLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                    Analyze Query
                  </Button>
                </form>
                
                {/* Example queries checklist */}
                <div className="space-y-2 pt-4 border-t">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Example Templates</span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      "Which services own this API?",
                      "Which modules interact with Redis?",
                      "Which functions write to the database?",
                      "Which services expose public endpoints?",
                      "Which modules belong to Authentication?",
                      "Which APIs use JWT?"
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSemanticQuery(q);
                          handleSemanticQuerySubmit(q);
                        }}
                        className="text-[11px] font-semibold text-foreground text-left py-1.5 px-2.5 rounded border bg-muted/30 hover:bg-primary/5 hover:border-primary/40 transition-colors w-full break-words"
                      >
                        💡 {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right query results column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col overflow-hidden bg-muted/5">
              {semanticQueryLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  <span className="text-sm font-semibold text-muted-foreground font-mono">Parsing semantic patterns...</span>
                </div>
              ) : semanticQueryResponse ? (
                <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
                  {/* Intent header */}
                  <div className="p-4 border rounded-xl bg-primary/5 border-primary/20 space-y-1">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Inferred Intent</span>
                    <h4 className="text-xs font-bold text-foreground">
                      {semanticQueryResponse.inferred_intent}
                    </h4>
                  </div>

                  {/* Results list */}
                  <div className="flex-1 border rounded-xl bg-card overflow-hidden flex flex-col shadow-sm">
                    <div className="p-3 border-b bg-muted/20 flex items-center justify-between text-xs font-bold text-muted-foreground">
                      <span>Query Results</span>
                      <span className="font-mono">{semanticQueryResponse.results.length} matched</span>
                    </div>

                    {semanticQueryResponse.results.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        <h4 className="text-xs font-bold text-foreground">No matches found in repository graph</h4>
                        <p className="text-[11px] text-muted-foreground max-w-xs">
                          Try adjusting keywords or selecting an alternative query template.
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto divide-y">
                        {semanticQueryResponse.results.map((res: any, idx: number) => (
                          <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                            <div className="space-y-1 text-left flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-foreground font-mono truncate">{res.name}</span>
                                <span className="text-[9px] px-1.5 py-0.5 border rounded-full font-bold uppercase tracking-wider text-muted-foreground">
                                  {res.type}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-normal break-words">{res.details}</p>
                            </div>
                            
                            <Button
                              onClick={() => {
                                setWorkspaceView('graph');
                                setSelectedGraphNode({ id: res.id, name: res.name, type: res.type });
                                setHighlightedNodes(new Set([res.id, ...(res.target ? [res.target] : [])]));
                              }}
                              variant="outline"
                              size="xs"
                              className="flex items-center gap-1 font-bold text-[10px] hover:border-primary hover:text-primary transition-all flex-shrink-0"
                            >
                              <Eye className="h-3 w-3" /> View in Graph
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center p-8 space-y-2">
                  <Cpu className="h-10 w-10 text-muted-foreground/20 animate-pulse" />
                  <h4 className="text-xs font-bold text-foreground">Playground Idle</h4>
                  <p className="text-[11px] max-w-xs">
                    Choose one of the query templates on the left or type your own question to start querying.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : workspaceView === 'relationships' ? (
        <div className="flex flex-col border rounded-2xl bg-card shadow-sm h-[calc(100vh-230px)] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
              <Network className="h-4.5 w-4.5 text-primary animate-pulse" />
              Semantic Relationship Query Dashboard
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {relationshipsResults.length} Relationship(s) Found
            </span>
          </div>

          {/* Search Panel */}
          <div className="p-4 border-b bg-muted/5 grid gap-4 grid-cols-1 md:grid-cols-12 items-end">
            <div className="md:col-span-4 space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Keyword Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Match source, target, path..."
                  value={relQuery}
                  onChange={(e) => setRelQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  onKeyDown={(e) => e.key === 'Enter' && fetchRelationshipsSearch()}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Relationship Type</label>
              <select
                value={relType}
                onChange={(e) => setRelType(e.target.value)}
                className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm font-medium"
              >
                <option value="all">All Types</option>
                <option value="IMPORTS">IMPORTS</option>
                <option value="CALLS">CALLS</option>
                <option value="OWNS">OWNS</option>
                <option value="IMPLEMENTS">IMPLEMENTS</option>
                <option value="INHERITS">INHERITS</option>
                <option value="DEPENDS_ON">DEPENDS_ON</option>
                <option value="USES">USES</option>
                <option value="CONNECTS_TO">CONNECTS_TO</option>
                <option value="READS">READS</option>
                <option value="WRITES">WRITES</option>
                <option value="EXPOSES">EXPOSES</option>
                <option value="QUERIES">QUERIES</option>
                <option value="CONSUMES">CONSUMES</option>
                <option value="PRODUCES">PRODUCES</option>
                <option value="BELONGS_TO">BELONGS_TO</option>
                <option value="DEPLOYS_TO">DEPLOYS_TO</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Source Type</label>
              <select
                value={relSrcType}
                onChange={(e) => setRelSrcType(e.target.value)}
                className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm font-medium"
              >
                <option value="all">All Sources</option>
                <option value="Repository">Repository</option>
                <option value="Folder">Folder</option>
                <option value="File">File</option>
                <option value="Module">Module</option>
                <option value="Class">Class</option>
                <option value="Interface">Interface</option>
                <option value="Function">Function</option>
                <option value="Method">Method</option>
                <option value="API Endpoint">API Endpoint</option>
                <option value="Database Table">Database Table</option>
                <option value="External Service">External Service</option>
                <option value="Environment">Environment</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Target Type</label>
              <select
                value={relTgtType}
                onChange={(e) => setRelTgtType(e.target.value)}
                className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm font-medium"
              >
                <option value="all">All Targets</option>
                <option value="Repository">Repository</option>
                <option value="Folder">Folder</option>
                <option value="File">File</option>
                <option value="Module">Module</option>
                <option value="Class">Class</option>
                <option value="Interface">Interface</option>
                <option value="Function">Function</option>
                <option value="Method">Method</option>
                <option value="API Endpoint">API Endpoint</option>
                <option value="Database Table">Database Table</option>
                <option value="External Service">External Service</option>
                <option value="Environment">Environment</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button onClick={fetchRelationshipsSearch} disabled={relLoading} className="flex-1 shadow-sm font-bold text-xs h-[38px]">
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRelQuery('');
                  setRelType('all');
                  setRelSrcType('all');
                  setRelTgtType('all');
                  setTimeout(() => fetchRelationshipsSearch(), 0);
                }}
                className="shadow-sm font-bold text-xs h-[38px]"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto">
            {relLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-2 py-16">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground">Searching relationship schema index...</span>
              </div>
            ) : relErrorMessage ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-2 h-full">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm font-semibold">{relErrorMessage}</p>
                <Button size="sm" onClick={fetchRelationshipsSearch}>Retry</Button>
              </div>
            ) : relationshipsResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-xs h-full space-y-2">
                <Network className="h-8 w-8 text-muted-foreground/30" />
                <p>No semantic relationships found matching the criteria.</p>
              </div>
            ) : (
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b text-muted-foreground font-mono uppercase text-[9px] tracking-wider bg-muted/10">
                      <th className="py-2.5 px-4 font-bold">Source Node</th>
                      <th className="py-2.5 px-4 font-bold text-center">Relationship Type</th>
                      <th className="py-2.5 px-4 font-bold">Target Node</th>
                      <th className="py-2.5 px-4 font-bold">Context / Location</th>
                      <th className="py-2.5 px-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relationshipsResults.map((rel: any) => {
                      // Color mapping helper for Relationship Types
                      const typeColors: Record<string, string> = {
                        IMPORTS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                        CALLS: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                        OWNS: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                        IMPLEMENTS: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
                        INHERITS: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                        DEPENDS_ON: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
                        USES: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                        CONNECTS_TO: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
                        READS: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
                        WRITES: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
                        EXPOSES: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20',
                        QUERIES: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                        CONSUMES: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
                        PRODUCES: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
                        BELONGS_TO: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
                        DEPLOYS_TO: 'bg-lime-500/10 text-lime-500 border-lime-500/20',
                      };

                      // Icon helper for node types
                      const getNodeIcon = (type: string) => {
                        switch (type) {
                          case 'Folder': return '📂';
                          case 'File': return '📄';
                          case 'Module': return '📦';
                          case 'Class': return '🏛️';
                          case 'Interface': return '⚙️';
                          case 'Function': return '⚡';
                          case 'Method': return '🔧';
                          case 'API Endpoint': return '🌐';
                          case 'Database Table': return '🗄️';
                          case 'External Service': return '☁️';
                          case 'Environment': return '🌍';
                          case 'Repository': return '📦';
                          default: return '🔹';
                        }
                      };

                      const sourcePath = rel.source.properties?.path || rel.source.properties?.file_path || '';
                      const targetPath = rel.target.properties?.path || rel.target.properties?.file_path || '';

                      return (
                        <tr key={rel.id} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                          <td className="py-3 px-4 font-mono">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground flex items-center gap-1.5">
                                <span className="text-sm" title={rel.source.type}>{getNodeIcon(rel.source.type)}</span>
                                {rel.source.name}
                              </span>
                              {sourcePath && <span className="text-[10px] text-muted-foreground truncate max-w-[200px]" title={sourcePath}>{sourcePath}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={cn(
                              "inline-block text-[9px] font-bold px-2 py-0.5 border rounded-full font-mono uppercase tracking-wider",
                              typeColors[rel.type] || 'bg-muted text-muted-foreground border-border/60'
                            )}>
                              {rel.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground flex items-center gap-1.5">
                                <span className="text-sm" title={rel.target.type}>{getNodeIcon(rel.target.type)}</span>
                                {rel.target.name}
                              </span>
                              {targetPath && <span className="text-[10px] text-muted-foreground truncate max-w-[200px]" title={targetPath}>{targetPath}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-mono">
                            <div className="flex flex-col gap-0.5">
                              {rel.properties?.file_path && (
                                <span className="text-[10px] truncate max-w-[220px]" title={rel.properties.file_path}>
                                  📍 {rel.properties.file_path}
                                </span>
                              )}
                              {rel.properties?.line && (
                                <span className="text-[10px]">
                                  🔢 Line {rel.properties.line}
                                </span>
                              )}
                              {rel.properties?.label && (
                                <span className="text-[10px] text-foreground font-sans font-medium italic">
                                  {rel.properties.label}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              onClick={() => handleViewInGraph(rel.source.id, rel.target.id, rel.type)}
                              variant="outline"
                              size="xs"
                              className="font-bold text-[10px] gap-1 hover:border-primary hover:text-primary transition-all shadow-sm"
                            >
                              <Eye className="h-3 w-3" /> View in Graph
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : workspaceView === 'graph' ? (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-start h-[calc(100vh-230px)] overflow-hidden border rounded-2xl bg-card shadow-sm">
          {/* Main Visualizer Canvas Area (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden border-r relative select-none">
            {/* Visualizer header & control options */}
            <div className="p-4 border-b flex flex-wrap items-center justify-between bg-muted/20 gap-3">
              <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
                <Network className="h-4.5 w-4.5 text-primary animate-pulse" />
                Interactive Workspace Dependency Graph
              </span>

              {/* View options */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={semanticSearchActive ? "Concept (Enter)..." : "Search node..."}
                      value={graphSearchQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setGraphSearchQuery(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && semanticSearchActive) {
                          triggerSemanticSearch(graphSearchQuery);
                        }
                      }}
                      className="pl-8 pr-3 py-1 rounded-md border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary w-32"
                    />
                  </div>
                  <label className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={semanticSearchActive}
                      onChange={(e) => {
                        const active = e.target.checked;
                        setSemanticSearchActive(active);
                        if (active) {
                          triggerSemanticSearch(graphSearchQuery);
                        } else {
                          setHighlightedNodes(new Set());
                        }
                      }}
                      className="rounded border bg-background text-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                    <span>Semantic</span>
                  </label>
                  {semanticSearchLoading && <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />}
                </div>

                {/* Filter Type */}
                <select
                  value={graphTypeFilter}
                  onChange={(e) => setGraphTypeFilter(e.target.value)}
                  className="rounded-md border bg-background px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                >
                  <option value="all">All Types</option>
                  <option value="Repository">Repository</option>
                  <option value="Domain">Domain (Folder)</option>
                  <option value="Module">Module (File)</option>
                  <option value="Service">Service</option>
                  <option value="API">API (Endpoint)</option>
                  <option value="Function">Function / Method</option>
                  <option value="Docker Service">Docker Service</option>
                  <option value="GitHub Action">GitHub Action</option>
                  <option value="Cron Job">Cron Job</option>
                  <option value="Environment">Environment</option>
                  <option value="Cache">Cache (Redis)</option>
                  <option value="Database Table">Database Table</option>
                  <option value="External Service">External Service</option>
                </select>

                {/* View Mode / Quick Query selectors */}
                <select
                  value={graphViewMode}
                  onChange={async (e) => {
                    const val = e.target.value as any;
                    setGraphViewMode(val);
                    setSelectedGraphNode(null);
                    setHighlightedNodes(new Set());
                    setHighlightedEdges(new Set());
                    
                    if (val === 'circular') {
                      try {
                        const res = await fetch(`/api/v1/repositories/${selectedRepoId}/analysis/circular`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          const data = await res.json();
                          const nodesSet = new Set<string>();
                          const edgesSet = new Set<string>();
                          data.cycles.forEach((cycleReport: any) => {
                            cycleReport.cycle.forEach((nid: string) => nodesSet.add(nid));
                          });
                          graphEdges.forEach((e: any) => {
                            if (nodesSet.has(e.source_id) && nodesSet.has(e.target_id)) {
                              edgesSet.add(e.id);
                            }
                          });
                          setHighlightedNodes(nodesSet);
                          setHighlightedEdges(edgesSet);
                        }
                      } catch (err) { console.error(err); }
                    } else if (val === 'orphans') {
                      try {
                        const res = await fetch(`/api/v1/repositories/${selectedRepoId}/query/orphans`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          const data = await res.json();
                          const nodesSet = new Set<string>(data.orphans.map((o: any) => o.id));
                          setHighlightedNodes(nodesSet);
                          setHighlightedEdges(new Set());
                        }
                      } catch (err) { console.error(err); }
                    } else if (val === 'domains') {
                      try {
                        const res = await fetch(`/api/v1/repositories/${selectedRepoId}/knowledge/domains`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setDomainClusters(data.domains || []);
                          const allDomainNodeIds = new Set<string>();
                          data.domains.forEach((d: any) => {
                            d.node_ids.forEach((id: string) => allDomainNodeIds.add(id));
                          });
                          setHighlightedNodes(allDomainNodeIds);
                          setHighlightedEdges(new Set());
                        }
                      } catch (err) { console.error(err); }
                    }
                  }}
                  className="rounded-md border bg-background px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary shadow-sm text-primary"
                >
                  <option value="all">View Mode: Default</option>
                  <option value="circular">Highlight Cycles</option>
                  <option value="orphans">Highlight Orphans</option>
                  <option value="domains">Highlight Domains</option>
                </select>

                {/* Collapse Clusters toggle */}
                <label className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={collapseClusters}
                    onChange={async (e) => {
                      const active = e.target.checked;
                      setCollapseClusters(active);
                      setSelectedGraphNode(null);
                      setHighlightedNodes(new Set());
                      setHighlightedEdges(new Set());
                      
                      if (active && domainClusters.length === 0) {
                        try {
                          const res = await fetch(`/api/v1/repositories/${selectedRepoId}/knowledge/domains`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setDomainClusters(data.domains || []);
                          }
                        } catch (err) { console.error(err); }
                      }
                    }}
                    className="rounded border bg-background text-primary focus:ring-1 focus:ring-primary shadow-sm"
                  />
                  <span>Collapse Domains</span>
                </label>

                {/* Reset button */}
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                    setSelectedGraphNode(null);
                    setHighlightedNodes(new Set());
                    setHighlightedEdges(new Set());
                    setGraphSearchQuery('');
                    setGraphTypeFilter('all');
                    setGraphViewMode('all');
                  }}
                  className="text-xs h-7 px-2.5 rounded-md"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Canvas Area */}
            {graphLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground">Running force simulation layout...</span>
              </div>
            ) : graphErrorMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm font-semibold">{graphErrorMessage}</p>
                <Button size="sm" onClick={fetchGraphData}>Retry</Button>
              </div>
            ) : (
              <div className="flex-1 relative bg-muted/5 overflow-hidden">
                <svg
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                >
                  <defs>
                    <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted/10" />
                    </pattern>
                    <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-muted-foreground/30" />
                    </marker>
                    <marker id="arrow-highlight" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                    </marker>
                  </defs>
                  
                  <rect width="100%" height="100%" fill="url(#graph-grid)" />

                  <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                    {/* Render Relationships (Edges) */}
                    {displayEdges
                      .filter((e: any) => {
                        const srcNode = displayNodes.find(n => n.id === e.source_id);
                        const tgtNode = displayNodes.find(n => n.id === e.target_id);
                        if (!srcNode || !tgtNode) return false;
                        if (graphTypeFilter !== 'all') {
                          if (srcNode.type !== graphTypeFilter && tgtNode.type !== graphTypeFilter) return false;
                        }
                        return true;
                      })
                      .map((edge: any) => {
                        const source = displayNodes.find(n => n.id === edge.source_id);
                        const target = displayNodes.find(n => n.id === edge.target_id);
                        if (!source || !target) return null;

                        const isHighlighted = highlightedEdges.has(edge.id);
                        const isNodeHighlighted = highlightedNodes.size > 0 && highlightedNodes.has(edge.source_id) && highlightedNodes.has(edge.target_id);
                        const isFaded = highlightedNodes.size > 0 && (!highlightedNodes.has(edge.source_id) || !highlightedNodes.has(edge.target_id));
                        
                        let strokeColor = "stroke-muted-foreground/30";
                        if (isHighlighted || isNodeHighlighted) {
                          strokeColor = "stroke-rose-500 stroke-[2.5px]";
                        } else if (edge.type === "IMPORTS") {
                          strokeColor = "stroke-blue-500/50";
                        } else if (edge.type === "CALLS") {
                          strokeColor = "stroke-purple-500/50";
                        } else if (edge.type === "INHERITS") {
                          strokeColor = "stroke-amber-500/50";
                        } else if (edge.type === "DEPENDS_ON") {
                          strokeColor = "stroke-emerald-500/50";
                        }

                        return (
                          <g key={edge.id}>
                            <line
                              x1={source.x}
                              y1={source.y}
                              x2={target.x}
                              y2={target.y}
                              className={cn(
                                "transition-all duration-300",
                                strokeColor,
                                isFaded ? "opacity-5" : "opacity-80"
                              )}
                              markerEnd={isHighlighted || isNodeHighlighted ? "url(#arrow-highlight)" : "url(#arrow)"}
                            />
                            {(isHighlighted || isNodeHighlighted) && (
                              <text
                                x={(source.x + target.x) / 2}
                                y={(source.y + target.y) / 2 - 5}
                                className="fill-rose-400 text-[8px] font-bold font-mono text-center select-none"
                              >
                                {edge.type}
                              </text>
                            )}
                          </g>
                        );
                      })}

                    {displayNodes
                      .filter((n: any) => {
                        if (graphTypeFilter !== 'all' && n.type !== graphTypeFilter) return false;
                        if (graphSearchQuery && !semanticSearchActive && !n.name.toLowerCase().includes(graphSearchQuery.toLowerCase())) return false;
                        return true;
                      })
                      .map((node: any) => {
                        const isSelected = selectedGraphNode?.id === node.id;
                        const isHighlighted = highlightedNodes.has(node.id);
                        const isFaded = highlightedNodes.size > 0 && !highlightedNodes.has(node.id);

                        let colorClass = "fill-muted border bg-muted/10";
                        let borderStroke = "stroke-muted-foreground/40";
                        
                        const domainColors: Record<string, { fill: string, stroke: string }> = {
                          "Authentication & Security": { fill: "fill-purple-500/15", stroke: "stroke-purple-500" },
                          "Billing & Payment": { fill: "fill-emerald-500/15", stroke: "stroke-emerald-500" },
                          "Database & Storage": { fill: "fill-blue-500/15", stroke: "stroke-blue-500" },
                          "Analytics & Monitoring": { fill: "fill-amber-500/15", stroke: "stroke-amber-500" },
                          "Notifications & Messaging": { fill: "fill-red-500/15", stroke: "stroke-red-500" },
                          "Background Tasks & Queues": { fill: "fill-pink-500/15", stroke: "stroke-pink-500" },
                          "Core System": { fill: "fill-slate-500/15", stroke: "stroke-slate-500" }
                        };

                        let domainColor = null;
                        if (graphViewMode === 'domains' && domainClusters.length > 0) {
                          const foundCluster = domainClusters.find((d: any) => d.node_ids.includes(node.id));
                          if (foundCluster) {
                            domainColor = domainColors[foundCluster.name];
                          }
                        }

                        if (node.isClusterNode || node.type === "DomainCluster") {
                          colorClass = "fill-indigo-500/25";
                          borderStroke = "stroke-indigo-500 stroke-[2.5px] stroke-dasharray-[2,2]";
                        } else if (domainColor) {
                          colorClass = domainColor.fill;
                          borderStroke = domainColor.stroke;
                        } else if (node.type === "Folder" || node.type === "Domain") {
                          colorClass = "fill-yellow-500/10";
                          borderStroke = "stroke-yellow-500";
                        } else if (node.type === "File" || node.type === "Module") {
                          colorClass = "fill-blue-500/10";
                          borderStroke = "stroke-blue-500";
                        } else if (node.type === "Class" || node.type === "Service") {
                          colorClass = "fill-teal-500/10";
                          borderStroke = "stroke-teal-500";
                        } else if (node.type === "API Endpoint" || node.type === "API") {
                          colorClass = "fill-emerald-500/10";
                          borderStroke = "stroke-emerald-500";
                        } else if (node.type === "Function" || node.type === "Method") {
                          colorClass = "fill-purple-500/10";
                          borderStroke = "stroke-purple-500";
                        } else if (node.type === "Docker Service") {
                          colorClass = "fill-sky-500/10";
                          borderStroke = "stroke-sky-500";
                        } else if (node.type === "GitHub Action") {
                          colorClass = "fill-orange-500/10";
                          borderStroke = "stroke-orange-500";
                        } else if (node.type === "Cron Job") {
                          colorClass = "fill-red-500/10";
                          borderStroke = "stroke-red-500";
                        } else if (node.type === "Environment") {
                          colorClass = "fill-lime-500/10";
                          borderStroke = "stroke-lime-500";
                        } else if (node.type === "Cache") {
                          colorClass = "fill-pink-500/10";
                          borderStroke = "stroke-pink-500";
                        } else if (node.type === "Database Table") {
                          colorClass = "fill-indigo-500/10";
                          borderStroke = "stroke-indigo-500";
                        } else if (node.type === "External Service") {
                          colorClass = "fill-fuchsia-500/10";
                          borderStroke = "stroke-fuchsia-500";
                        } else if (node.type === "Repository") {
                          colorClass = "fill-slate-500/10";
                          borderStroke = "stroke-slate-500";
                        }

                        return (
                          <g
                            key={node.id}
                            transform={`translate(${node.x}, ${node.y})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGraphNode(node);
                              const relatedNodes = new Set<string>([node.id]);
                              const relatedEdges = new Set<string>();
                              graphEdges.forEach((edge: any) => {
                                if (edge.source_id === node.id) {
                                  relatedNodes.add(edge.target_id);
                                  relatedEdges.add(edge.id);
                                } else if (edge.target_id === node.id) {
                                  relatedNodes.add(edge.source_id);
                                  relatedEdges.add(edge.id);
                                }
                              });
                              setHighlightedNodes(relatedNodes);
                              setHighlightedEdges(relatedEdges);
                            }}
                            className="cursor-pointer group"
                          >
                            {(isSelected || isHighlighted) && (
                              <circle
                                r={node.isClusterNode ? "32" : "22"}
                                className="fill-rose-500/20 animate-ping opacity-75"
                              />
                            )}
                            
                            <circle
                              r={node.isClusterNode ? "24" : isSelected ? "18" : "14"}
                              className={cn(
                                "transition-all duration-300 stroke-[1.5px]",
                                colorClass,
                                borderStroke,
                                isSelected && "stroke-rose-500 stroke-2",
                                isFaded ? "opacity-15" : "opacity-100 hover:scale-110"
                              )}
                            />

                            <text
                              textAnchor="middle"
                              dy=".3em"
                              className={cn(
                                "font-mono font-black text-[9px]",
                                isFaded ? "fill-muted-foreground/15" : "fill-foreground",
                                isSelected ? "fill-rose-400" : "",
                                node.isClusterNode && "text-[12px] font-sans fill-indigo-400 font-extrabold"
                              )}
                            >
                              {node.isClusterNode ? "🏰" : node.type.substring(0, 2).toUpperCase()}
                            </text>

                            <text
                              textAnchor="middle"
                              y={node.isClusterNode ? "38" : isSelected ? "32" : "26"}
                              className={cn(
                                "text-[9px] font-bold select-none truncate max-w-[80px]",
                                isFaded ? "fill-muted-foreground/10" : "fill-foreground",
                                node.isClusterNode ? "block fill-indigo-400 text-[10px]" : isSelected ? "fill-rose-400 text-[10px]" : "hidden group-hover:block"
                              )}
                            >
                              {node.name}
                            </text>
                          </g>
                        );
                      })}
                  </g>
                </svg>

                <div className="absolute bottom-4 left-4 p-3 border rounded-xl bg-background/80 backdrop-blur-md text-[10px] text-muted-foreground font-mono space-y-1 shadow">
                  <p>🖱️ Drag canvas to PAN</p>
                  <p>📜 Scroll wheel to ZOOM</p>
                  <p>🎯 Click node to inspect details</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Selected node metadata details and analysis controllers */}
          <div className="lg:col-span-4 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b bg-muted/20">
              <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-muted-foreground" />
                Query Inspector Panel
              </span>
            </div>

            {selectedGraphNode ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <span className="text-[10px] px-2 py-0.5 border rounded-full font-bold uppercase tracking-wider text-primary bg-primary/5">
                    {selectedGraphNode.type}
                  </span>
                  <h3 className="font-bold text-lg text-foreground font-mono mt-2 break-all">
                    {selectedGraphNode.name}
                  </h3>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1 break-all select-all">
                    ID: {selectedGraphNode.id}
                  </p>
                </div>

                {selectedGraphNode.isClusterNode ? (
                  <div className="border rounded-xl p-4 bg-muted/10 space-y-2 text-xs">
                    <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Contained Modules</span>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {(selectedGraphNode.containedNodeIds || []).map((nid: string) => {
                        const name = nid.split('::').pop();
                        return (
                          <div key={nid} className="border-b border-border/40 py-1.5 flex items-center justify-between text-[11px]">
                            <span className="font-mono text-foreground font-bold truncate max-w-[180px]" title={nid}>{name}</span>
                            <Button
                              onClick={() => {
                                setCollapseClusters(false);
                                setSelectedGraphNode({ id: nid, name, type: 'Module' });
                                setHighlightedNodes(new Set([nid]));
                              }}
                              variant="ghost"
                              size="xs"
                              className="text-[9px] hover:text-primary p-1 h-5"
                            >
                              Expand
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-xl p-4 bg-muted/10 space-y-2 text-xs">
                    <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Properties</span>
                    <div className="space-y-1 font-mono text-foreground break-all max-h-36 overflow-y-auto">
                      {Object.entries(selectedGraphNode.properties || {}).map(([k, v]: any) => (
                        <div key={k} className="flex justify-between border-b border-border/40 py-1">
                          <span className="text-muted-foreground">{k}:</span>
                          <span>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Dependency Queries</span>

                  <Button
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/v1/repositories/${selectedRepoId}/query/dependencies?node_id=${selectedGraphNode.id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          const data = await res.json();
                          const nodesSet = new Set<string>([selectedGraphNode.id]);
                          const edgesSet = new Set<string>();
                          data.dependencies.forEach((d: any) => {
                            nodesSet.add(d.target.id);
                            edgesSet.add(d.relationship_id);
                          });
                          setHighlightedNodes(nodesSet);
                          setHighlightedEdges(edgesSet);
                        }
                      } catch (err) { console.error(err); }
                    }}
                    variant="outline"
                    className="w-full justify-start text-xs font-semibold"
                  >
                    🔍 Show Direct Dependencies
                  </Button>

                  <Button
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/v1/repositories/${selectedRepoId}/query/callers?symbol_name=${selectedGraphNode.name}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          const data = await res.json();
                          const nodesSet = new Set<string>([selectedGraphNode.id]);
                          const edgesSet = new Set<string>();
                          data.callers.forEach((c: any) => {
                            nodesSet.add(c.caller.id);
                            edgesSet.add(c.relationship_id);
                          });
                          setHighlightedNodes(nodesSet);
                          setHighlightedEdges(edgesSet);
                        }
                      } catch (err) { console.error(err); }
                    }}
                    variant="outline"
                    className="w-full justify-start text-xs font-semibold"
                  >
                    📞 Show Callers of Function
                  </Button>

                  <Button
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/v1/repositories/${selectedRepoId}/query/imports?node_id=${selectedGraphNode.id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          const data = await res.json();
                          const nodesSet = new Set<string>(data.nodes.map((n: any) => n.id));
                          const edgesSet = new Set<string>(data.edges.map((e: any) => e.id));
                          setHighlightedNodes(nodesSet);
                          setHighlightedEdges(edgesSet);
                        }
                      } catch (err) { console.error(err); }
                    }}
                    variant="outline"
                    className="w-full justify-start text-xs font-semibold"
                  >
                    🌳 Show Import Dependency Tree
                  </Button>

                  <Button
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/v1/repositories/${selectedRepoId}/query/downstream?node_id=${selectedGraphNode.id}`, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        if (res.ok) {
                          const data = await res.json();
                          const nodesSet = new Set<string>(data.nodes.map((n: any) => n.id));
                          const edgesSet = new Set<string>(data.edges.map((e: any) => e.id));
                          setHighlightedNodes(nodesSet);
                          setHighlightedEdges(edgesSet);
                        }
                      } catch (err) { console.error(err); }
                    }}
                    variant="outline"
                    className="w-full justify-start text-xs font-semibold text-rose-500"
                  >
                    💥 Show Downstream Blast Radius
                  </Button>
                </div>

                {/* Shortest Path Finder Widget */}
                <div className="border rounded-xl p-4 bg-muted/10 space-y-2.5 text-xs">
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
                    🎯 Shortest Path Finder
                  </span>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Find the shortest path of relationships from this node to another target node.
                  </p>
                  <div className="flex gap-1.5">
                    <select
                      id="shortest-path-target"
                      className="flex-1 rounded-md border bg-background px-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    >
                      <option value="">Select target node...</option>
                      {displayNodes
                        .filter((n: any) => n.id !== selectedGraphNode.id)
                        .map((n: any) => (
                          <option key={n.id} value={n.id}>{n.name} ({n.type})</option>
                        ))
                      }
                    </select>
                    <Button
                      onClick={() => {
                        const targetSelect = document.getElementById("shortest-path-target") as HTMLSelectElement;
                        if (targetSelect && targetSelect.value) {
                          const path = findShortestPath(displayNodes, displayEdges, selectedGraphNode.id, targetSelect.value);
                          if (path) {
                            setHighlightedNodes(new Set(path));
                            // highlight edges
                            const edgesSet = new Set<string>();
                            for (let i = 0; i < path.length - 1; i++) {
                              const edge = displayEdges.find((e: any) => 
                                (e.source_id === path[i] && e.target_id === path[i+1]) ||
                                (e.source_id === path[i+1] && e.target_id === path[i])
                              );
                              if (edge) edgesSet.add(edge.id);
                            }
                            setHighlightedEdges(edgesSet);
                          } else {
                            alert("No relationship path found between these nodes.");
                          }
                        }
                      }}
                      variant="default"
                      size="xs"
                      className="font-bold"
                    >
                      Find
                    </Button>
                  </div>
                </div>
              </div>
            ) : graphViewMode === 'domains' && domainClusters.length > 0 ? (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-primary animate-pulse" />
                    Business Domains Clustered
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Click a business subdomain in the list to highlight its specific modules and database items.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {domainClusters.map((cluster) => {
                    const colors: Record<string, string> = {
                      "Authentication & Security": "border-l-4 border-l-purple-500 bg-purple-500/5",
                      "Billing & Payment": "border-l-4 border-l-emerald-500 bg-emerald-500/5",
                      "Database & Storage": "border-l-4 border-l-blue-500 bg-blue-500/5",
                      "Analytics & Monitoring": "border-l-4 border-l-amber-500 bg-amber-500/5",
                      "Notifications & Messaging": "border-l-4 border-l-red-500 bg-red-500/5",
                      "Background Tasks & Queues": "border-l-4 border-l-pink-500 bg-pink-500/5",
                      "Core System": "border-l-4 border-l-slate-500 bg-slate-500/5",
                    };
                    const borderClass = colors[cluster.name] || "border-l-4 border-l-primary bg-primary/5";
                    
                    return (
                      <div
                        key={cluster.name}
                        onClick={() => {
                          const nodesSet = new Set<string>(cluster.node_ids);
                          setHighlightedNodes(nodesSet);
                          setHighlightedEdges(new Set());
                        }}
                        className={cn(
                          "p-3 rounded-lg border text-left cursor-pointer hover:shadow-sm transition-all duration-200 hover:scale-[1.01]",
                          borderClass
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-foreground">{cluster.name}</h4>
                          <span className="text-[10px] font-mono font-bold bg-background border px-1.5 py-0.5 rounded text-muted-foreground">
                            {cluster.node_ids.length} nodes
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                          {cluster.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <Button
                  onClick={() => {
                    const allNodeIds = new Set<string>();
                    domainClusters.forEach((d: any) => d.node_ids.forEach((id: string) => allNodeIds.add(id)));
                    setHighlightedNodes(allNodeIds);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold"
                >
                  ✨ Show All Domains
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground text-xs space-y-2">
                <Network className="h-8 w-8 text-muted-foreground/30 animate-pulse" />
                <p>Click on any node in the visualizer graph to inspect properties and execute dependency analysis query flows.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 items-start h-[calc(100vh-230px)] overflow-hidden">
          
          {/* 1. Left Panel: Collapsible Directory Tree Explorer (4 cols) */}
          <div className="lg:col-span-4 border rounded-2xl bg-card shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
              <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
                <Folder className="h-4.5 w-4.5 text-muted-foreground" />
                Repository Tree
              </span>
              <span className="text-[10px] bg-accent px-2 py-0.5 rounded font-mono font-bold text-muted-foreground uppercase">
                {selectedRepo?.name}
              </span>
            </div>

            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-full pl-9 pr-4 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  onChange={(e) => {
                    const query = e.target.value.toLowerCase();
                    const filtered = files.filter(f => f.file_path.toLowerCase().includes(query));
                    // Simple search implementation
                    if (query) {
                      setFiles(filtered);
                    } else {
                      fetchRepoData();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-0.5">
              {renderTreeNodes(fileTreeRoot)}
            </div>
          </div>

          {/* 2. Middle Panel: Source Code & Line Breakdown (4 cols) */}
          <div className="lg:col-span-4 border rounded-2xl bg-card shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
              <span className="font-semibold text-sm tracking-tight flex items-center gap-2">
                <FileCode className="h-4.5 w-4.5 text-muted-foreground" />
                File Metadata
              </span>
              <span className="text-xs text-muted-foreground font-mono">{activeFile?.language}</span>
            </div>

            {activeFile ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground font-mono truncate">{activeFile.file_path.split('/').pop()}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{activeFile.file_path}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-xl p-4 bg-muted/10 space-y-1">
                    <span className="text-xs text-muted-foreground font-medium">Lines of Code</span>
                    <p className="text-2xl font-black text-foreground font-mono">{activeFile.code_lines}</p>
                  </div>
                  <div className="border rounded-xl p-4 bg-muted/10 space-y-1">
                    <span className="text-xs text-muted-foreground font-medium">Total Lines</span>
                    <p className="text-2xl font-black text-foreground font-mono">{activeFile.total_lines}</p>
                  </div>
                </div>

                {/* Line Breakdown Progress Bar visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground font-mono">
                    <span>Lines breakdown</span>
                    <span>{activeFile.total_lines} total</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-accent overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${(activeFile.code_lines / activeFile.total_lines) * 100}%` }}
                      className="bg-primary h-full transition-all duration-500"
                      title={`Code Lines: ${activeFile.code_lines}`}
                    />
                    <div
                      style={{ width: `${(activeFile.comment_lines / activeFile.total_lines) * 100}%` }}
                      className="bg-emerald-500 h-full transition-all duration-500"
                      title={`Comment Lines: ${activeFile.comment_lines}`}
                    />
                    <div
                      style={{ width: `${(activeFile.blank_lines / activeFile.total_lines) * 100}%` }}
                      className="bg-muted-foreground/30 h-full transition-all duration-500"
                      title={`Blank Lines: ${activeFile.blank_lines}`}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span>Code: {activeFile.code_lines}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Comment: {activeFile.comment_lines}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                      <span>Blank: {activeFile.blank_lines}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-4 bg-muted/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">Complexity Score</h4>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      Total CC = {activeFile.metrics?.complexity_total || 0}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-muted-foreground">
                    <div className="flex justify-between py-1 border-b">
                      <span>Average CC/function</span>
                      <span className="text-foreground font-semibold">{activeFile.metrics?.complexity_average.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span>Maximum function CC</span>
                      <span className="text-foreground font-semibold">{activeFile.metrics?.complexity_max || 0}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Most complex function</span>
                      <span className="text-foreground font-semibold max-w-[150px] truncate" title={activeFile.metrics?.complexity_max_function || 'None'}>
                        {activeFile.metrics?.complexity_max_function || 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-4 bg-muted/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">Documentation Coverage</h4>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {activeFile.metrics?.coverage_percent.toFixed(0) || '0'}%
                    </span>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-muted-foreground">
                    <div className="flex justify-between py-1 border-b">
                      <span>Documented Symbols</span>
                      <span className="text-foreground font-semibold">{activeFile.metrics?.documentation_symbols || 0}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Total Documentable</span>
                      <span className="text-foreground font-semibold">{activeFile.metrics?.total_documentable || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-2">
                <File className="h-8 w-8 text-muted-foreground/50 animate-pulse" />
                <span className="text-sm font-mono">Select a file to inspect details</span>
              </div>
            )}
          </div>

          {/* 3. Right Panel: Dynamic Details Tabs (4 cols) */}
          <div className="lg:col-span-4 border rounded-2xl bg-card shadow-sm flex flex-col h-full overflow-hidden">
            <div className="border-b bg-muted/15">
              {/* Tab selector menu */}
              <div className="flex overflow-x-auto divide-x border-b text-xs font-semibold text-muted-foreground scrollbar-none">
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={cn(
                    'flex-1 py-3 px-1 text-center truncate transition-colors border-b-2',
                    activeTab === 'metrics'
                      ? 'border-primary text-foreground bg-background'
                      : 'border-transparent hover:text-foreground hover:bg-muted/10'
                  )}
                >
                  Metrics
                </button>
                <button
                  onClick={() => setActiveTab('classes')}
                  className={cn(
                    'flex-1 py-3 px-1 text-center truncate transition-colors border-b-2',
                    activeTab === 'classes'
                      ? 'border-primary text-foreground bg-background'
                      : 'border-transparent hover:text-foreground hover:bg-muted/10'
                  )}
                >
                  Classes
                </button>
                <button
                  onClick={() => setActiveTab('functions')}
                  className={cn(
                    'flex-1 py-3 px-1 text-center truncate transition-colors border-b-2',
                    activeTab === 'functions'
                      ? 'border-primary text-foreground bg-background'
                      : 'border-transparent hover:text-foreground hover:bg-muted/10'
                  )}
                >
                  Funcs
                </button>
                <button
                  onClick={() => setActiveTab('imports')}
                  className={cn(
                    'flex-1 py-3 px-1 text-center truncate transition-colors border-b-2',
                    activeTab === 'imports'
                      ? 'border-primary text-foreground bg-background'
                      : 'border-transparent hover:text-foreground hover:bg-muted/10'
                  )}
                >
                  Imports
                </button>
                <button
                  onClick={() => setActiveTab('ast')}
                  className={cn(
                    'flex-1 py-3 px-1 text-center truncate transition-colors border-b-2',
                    activeTab === 'ast'
                      ? 'border-primary text-foreground bg-background'
                      : 'border-transparent hover:text-foreground hover:bg-muted/10'
                  )}
                >
                  AST Nodes
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeFile ? (
                <div>
                  {/* TAB: Metrics */}
                  {activeTab === 'metrics' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-foreground">File Metric Breakdown</h4>
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 border rounded-xl bg-muted/5 flex items-center justify-between">
                          <span className="text-muted-foreground">Language</span>
                          <span className="font-bold text-foreground bg-accent px-2 py-0.5 rounded">{activeFile.language}</span>
                        </div>
                        <div className="p-3 border rounded-xl bg-muted/5 flex items-center justify-between">
                          <span className="text-muted-foreground">File Size</span>
                          <span className="font-bold text-foreground font-mono">{(activeFile.size_bytes / 1024).toFixed(1)} KB</span>
                        </div>
                        <div className="p-3 border rounded-xl bg-muted/5 flex items-center justify-between">
                          <span className="text-muted-foreground">Total Complexity</span>
                          <span className="font-bold text-foreground">{activeFile.metrics?.complexity_total || 0}</span>
                        </div>
                        <div className="p-3 border rounded-xl bg-muted/5 flex items-center justify-between">
                          <span className="text-muted-foreground">Average Complexity</span>
                          <span className="font-bold text-foreground">{activeFile.metrics?.complexity_average || '0.0'}</span>
                        </div>
                        <div className="p-3 border rounded-xl bg-muted/5 flex items-center justify-between">
                          <span className="text-muted-foreground">Docstrings Coverage</span>
                          <span className="font-bold text-foreground">{activeFile.metrics?.coverage_percent || 0}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: Classes */}
                  {activeTab === 'classes' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-foreground">Extracted Classes ({activeFileClasses.length})</h4>
                      {activeFileClasses.length > 0 ? (
                        activeFileClasses.map((cls) => (
                          <div key={cls.id} className="border rounded-xl p-3 bg-muted/5 space-y-2">
                            <div className="flex items-center justify-between font-mono">
                              <span className="font-bold text-sm text-foreground truncate">{cls.name}</span>
                              <span className="text-[10px] text-muted-foreground">Lines: {cls.start_line}-{cls.end_line}</span>
                            </div>
                            {cls.docstring && (
                              <p className="text-xs text-muted-foreground bg-accent p-2 rounded italic truncate">
                                "{cls.docstring.trim()}"
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-xs text-muted-foreground p-6 border rounded-xl border-dashed">
                          No classes detected in this source file.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: Functions */}
                  {activeTab === 'functions' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-foreground">Functions & Methods ({activeFileFunctions.length})</h4>
                      {activeFileFunctions.length > 0 ? (
                        activeFileFunctions.map((fn) => (
                          <div key={fn.id} className="border rounded-xl p-3 bg-muted/5 space-y-2">
                            <div className="flex items-center justify-between font-mono">
                              <span className="font-bold text-sm text-foreground truncate flex items-center gap-1">
                                {fn.is_async && <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />}
                                {fn.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">Lines: {fn.start_line}-{fn.end_line}</span>
                            </div>
                            {fn.parent_name && (
                              <p className="text-[10px] text-muted-foreground font-mono">
                                Member of: <span className="text-foreground font-semibold">{fn.parent_name}</span>
                              </p>
                            )}
                            {fn.docstring && (
                              <p className="text-xs text-muted-foreground bg-accent p-2 rounded italic truncate">
                                "{fn.docstring.trim()}"
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-xs text-muted-foreground p-6 border rounded-xl border-dashed">
                          No functions detected in this source file.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: Imports */}
                  {activeTab === 'imports' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-foreground">Imports Detected</h4>
                      {activeFile.imports && activeFile.imports.length > 0 ? (
                        activeFile.imports.map((imp, idx) => (
                          <div key={idx} className="border rounded-xl p-3 bg-muted/5 space-y-1.5">
                            <div className="flex items-center justify-between font-mono">
                              <span className="font-bold text-xs text-foreground truncate" title={imp.module}>
                                {imp.module}
                              </span>
                              <span className="text-[10px] text-muted-foreground">Line {imp.line}</span>
                            </div>
                            {imp.names && imp.names.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {imp.names.map((name, nIdx) => (
                                  <span key={nIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-foreground">
                                    {name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-xs text-muted-foreground p-6 border rounded-xl border-dashed">
                          No imports found in this source file.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: AST Nodes */}
                  {activeTab === 'ast' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-foreground">Semantic AST Nodes</h4>
                      {activeFileSymbols.length > 0 ? (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {activeFileSymbols.map((sym) => (
                            <div key={sym.id} className="border rounded-xl p-3 bg-muted/5 font-mono text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground truncate">{sym.name}</span>
                                <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded font-bold">
                                  {sym.kind}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground pt-1 border-t mt-1">
                                <div>
                                  Range: {sym.start_line}-{sym.end_line}
                                </div>
                                <div className="text-right">
                                  Visibility: {sym.is_exported ? 'exported' : 'internal'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-xs text-muted-foreground p-6 border rounded-xl border-dashed">
                          No AST syntax symbols found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground p-6 border rounded-xl border-dashed">
                  Select a file to inspect dynamic details.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Add Repository Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight">Add Git Repository</h3>
              <p className="text-xs text-muted-foreground">
                Provide cloning parameters for git background sync logic.
              </p>
            </div>
            
            <form onSubmit={handleAddRepository} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Repository Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. my-project"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newRepoName}
                  onChange={(e) => {
                    setNewRepoName(e.target.value);
                    if (!newRepoFullName && user) {
                      setNewRepoFullName(`${user.username}/${e.target.value}`);
                    }
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name (owner/repo)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. octocat/Spoon-Knife"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  value={newRepoFullName}
                  onChange={(e) => setNewRepoFullName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Clone URL (HTTPS)</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/octocat/Spoon-Knife.git"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  value={newRepoCloneUrl}
                  onChange={(e) => {
                    setNewRepoCloneUrl(e.target.value);
                    // Autofill if empty
                    if (e.target.value.endsWith('.git')) {
                      const parts = e.target.value.replace('.git', '').split('/');
                      const repoName = parts[parts.length - 1];
                      const owner = parts[parts.length - 2];
                      if (repoName && !newRepoName) {
                        setNewRepoName(repoName);
                      }
                      if (owner && repoName && !newRepoFullName) {
                        setNewRepoFullName(`${owner}/${repoName}`);
                      }
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} size="sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitLoading} size="sm" className="shadow-md">
                  {isSubmitLoading ? 'Registering...' : 'Register'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Tree view helper item component
function FileTreeItem({ node, level, onSelectFile, activeFilePath, expandedFolders, toggleFolder }: any) {
  const isExpanded = expandedFolders.has(node.path);
  const paddingLeft = `${level * 12 + 8}px`;

  if (node.isFolder) {
    return (
      <div>
        <button
          onClick={() => toggleFolder(node.path)}
          style={{ paddingLeft }}
          className="w-full flex items-center gap-2 py-1.5 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg text-left transition-colors font-medium"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4.5 w-4.5 shrink-0 text-amber-500 fill-amber-500/10" />
          ) : (
            <Folder className="h-4.5 w-4.5 shrink-0 text-amber-500 fill-amber-500/10" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div className="space-y-0.5 mt-0.5">
            {node.children.map((child: any) => (
              <FileTreeItem
                key={child.path}
                node={child}
                level={level + 1}
                onSelectFile={onSelectFile}
                activeFilePath={activeFilePath}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    const isActive = activeFilePath === node.path;
    return (
      <button
        onClick={() => onSelectFile(node.fileData)}
        style={{ paddingLeft: `${level * 12 + 24}px` }}
        className={cn(
          'w-full flex items-center gap-2 py-1.5 text-sm rounded-lg text-left transition-colors font-mono',
          isActive
            ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
            : 'text-foreground/75 hover:text-foreground hover:bg-muted/50'
        )}
      >
        <FileCode className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-primary-foreground' : 'text-blue-500')} />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }
}
