'use client';

import * as React from 'react';
import {
                        ReactFlow,
                        Background,
                        Controls,
                        MiniMap,
                        Handle,
                        Position,
                        useNodesState,
                        useEdgesState,
                        MarkerType,
                        Edge,
                        Node,
                        ReactFlowProvider,
                        useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
                        GitBranch,
                        Layers,
                        Zap,
                        FileCode,
                        Code,
                        Play,
                        Network,
                        Database,
                        Server,
                        Cpu,
                        Search,
                        Filter,
                        Eye,
                        EyeOff,
                        HelpCircle,
                        Maximize2,
                        RefreshCw,
                        ChevronRight,
                        PlayCircle,
} from 'lucide-react';
import { Button } from './ui/button';

// --- Icon & Color helper mapping ---
const getNodeIcon = (type: string) => {
                        switch (type) {
                                                case 'Repository':
                                                                        return (
                                                                                                <GitBranch className="h-4 w-4" />
                                                                        );
                                                case 'Domain':
                                                                        return (
                                                                                                <Layers className="h-4 w-4" />
                                                                        );
                                                case 'Service':
                                                                        return (
                                                                                                <Zap className="h-4 w-4" />
                                                                        );
                                                case 'Module':
                                                case 'File':
                                                                        return (
                                                                                                <FileCode className="h-4 w-4" />
                                                                        );
                                                case 'Class':
                                                case 'Interface':
                                                                        return (
                                                                                                <Code className="h-4 w-4" />
                                                                        );
                                                case 'Function':
                                                case 'Method':
                                                                        return (
                                                                                                <Play className="h-4 w-4" />
                                                                        );
                                                case 'API':
                                                case 'API Endpoint':
                                                                        return (
                                                                                                <Network className="h-4 w-4" />
                                                                        );
                                                case 'Database Table':
                                                                        return (
                                                                                                <Database className="h-4 w-4" />
                                                                        );
                                                case 'External Service':
                                                case 'Cache':
                                                case 'Cron Job':
                                                                        return (
                                                                                                <Server className="h-4 w-4" />
                                                                        );
                                                default:
                                                                        return (
                                                                                                <Cpu className="h-4 w-4" />
                                                                        );
                        }
};

const getNodeColorClass = (type: string) => {
                        switch (type) {
                                                case 'Repository':
                                                                        return 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/30';
                                                case 'Domain':
                                                                        return 'bg-violet-500/10 text-violet-500 dark:text-violet-400 border-violet-500/30';
                                                case 'API':
                                                case 'API Endpoint':
                                                                        return 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30';
                                                case 'Service':
                                                                        return 'bg-teal-500/10 text-teal-500 dark:text-teal-400 border-teal-500/30';
                                                case 'Module':
                                                case 'File':
                                                                        return 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30';
                                                case 'Class':
                                                case 'Interface':
                                                                        return 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30';
                                                case 'Function':
                                                case 'Method':
                                                                        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30';
                                                case 'Database Table':
                                                                        return 'bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 border-yellow-500/30';
                                                case 'External Service':
                                                case 'Cache':
                                                case 'Cron Job':
                                                                        return 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/30';
                                                default:
                                                                        return 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/30';
                        }
};

// --- Custom Node UI Component ---
const CustomArchitectureNode = ({ data, selected }: { data: any; selected: boolean }) => {
                        const isExpandable =
                                                data.hasChildren &&
                                                data.type !== 'Function' &&
                                                data.type !== 'Method';

                        // Colored left border class based on status
                        let borderLeftClass = '';
                        let dotClass = '';
                        if (data.statusColor === 'healthy') {
                                                borderLeftClass = 'border-l-4 border-l-emerald-500';
                                                dotClass = 'bg-emerald-500';
                        } else if (data.statusColor === 'moderate') {
                                                borderLeftClass = 'border-l-4 border-l-yellow-500';
                                                dotClass = 'bg-yellow-500';
                        } else if (data.statusColor === 'warning') {
                                                borderLeftClass = 'border-l-4 border-l-yellow-500';
                                                dotClass = 'bg-yellow-500';
                        } else if (data.statusColor === 'high') {
                                                borderLeftClass = 'border-l-4 border-l-orange-500';
                                                dotClass = 'bg-orange-500';
                        } else if (data.statusColor === 'critical') {
                                                borderLeftClass = 'border-l-4 border-l-red-500';
                                                dotClass = 'bg-red-500';
                        }

                        return (
                                                <div
                                                                        className={`relative flex flex-col min-w-[240px] max-w-[280px] bg-card/90 dark:bg-zinc-900/90 backdrop-blur-md border rounded-xl p-3.5 transition-all duration-200 shadow-sm hover:shadow-md ${borderLeftClass} ${
                                                                                                selected
                                                                                                                        ? 'ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/10'
                                                                                                                        : 'border-border/80 hover:border-primary/40'
                                                                        } ${data.isHighlighted ? 'opacity-100 scale-102 border-primary/60 shadow' : data.hasActiveSelection ? 'opacity-20' : 'opacity-100'}`}
                                                >
                                                                        {/* Input/Output Handles */}
                                                                        <Handle
                                                                                                type="target"
                                                                                                position={
                                                                                                                        Position.Left
                                                                                                }
                                                                                                id="target"
                                                                                                className="!w-2 !h-2 bg-muted-foreground/50 border border-background"
                                                                        />
                                                                        <Handle
                                                                                                type="source"
                                                                                                position={
                                                                                                                        Position.Right
                                                                                                }
                                                                                                id="source"
                                                                                                className="!w-2 !h-2 bg-muted-foreground/50 border border-background"
                                                                        />

                                                                        {/* Header */}
                                                                        <div className="flex items-center gap-2 mb-2 relative">
                                                                                                <span
                                                                                                                        className={`p-1.5 rounded-lg border ${getNodeColorClass(data.type)}`}
                                                                                                >
                                                                                                                        {getNodeIcon(
                                                                                                                                                data.type
                                                                                                                        )}
                                                                                                </span>
                                                                                                <div className="flex flex-col min-w-0 flex-1">
                                                                                                                        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/80 leading-none">
                                                                                                                                                {
                                                                                                                                                                        data.type
                                                                                                                                                }
                                                                                                                        </span>
                                                                                                                        <span
                                                                                                                                                className="text-xs font-semibold truncate text-foreground leading-tight mt-0.5"
                                                                                                                                                title={
                                                                                                                                                                        data.name
                                                                                                                                                }
                                                                                                                        >
                                                                                                                                                {
                                                                                                                                                                        data.name
                                                                                                                                                }
                                                                                                                        </span>
                                                                                                </div>

                                                                                                {/* Status Indicator Dot */}
                                                                                                {dotClass && (
                                                                                                                        <span
                                                                                                                                                className={`absolute top-0 right-0 w-2.5 h-2.5 rounded-full border border-background shadow ${dotClass}`}
                                                                                                                        />
                                                                                                )}
                                                                        </div>

                                                                        {/* Description */}
                                                                        {data.description && (
                                                                                                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 mb-2.5 font-normal">
                                                                                                                        {
                                                                                                                                                data.description
                                                                                                                        }
                                                                                                </p>
                                                                        )}

                                                                        {/* Footer */}
                                                                        <div className="flex items-center justify-between border-t border-border/40 pt-2 mt-1 text-[9px] font-mono text-muted-foreground">
                                                                                                <span>
                                                                                                                        {data.metricsSummary ||
                                                                                                                                                ''}
                                                                                                </span>
                                                                                                {isExpandable && (
                                                                                                                        <button
                                                                                                                                                onClick={(
                                                                                                                                                                        e
                                                                                                                                                ) => {
                                                                                                                                                                        e.stopPropagation();
                                                                                                                                                                        data.onToggleExpand();
                                                                                                                                                }}
                                                                                                                                                className="flex items-center gap-1 bg-accent hover:bg-accent/80 hover:text-accent-foreground px-2 py-0.5 rounded text-[10px] font-sans font-semibold transition-colors cursor-pointer"
                                                                                                                        >
                                                                                                                                                {data.isExpanded
                                                                                                                                                                        ? 'Collapse'
                                                                                                                                                                        : 'Expand'}
                                                                                                                        </button>
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
};

// --- Custom Header Node Component ---
const CustomHeaderNode = ({ data }: { data: any }) => {
                        return (
                                                <div className="flex flex-col items-center justify-center min-w-[240px] max-w-[280px] p-2.5 border-b-2 border-primary/50 bg-muted/10 text-center select-none rounded-t-lg">
                                                                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                                                                                {
                                                                                                                        data.label
                                                                                                }
                                                                        </span>
                                                </div>
                        );
};

// Node type registry
const nodeTypes = {
                        customArchitecture: CustomArchitectureNode,
                        customHeader: CustomHeaderNode,
};

interface ArchitectureVisualizerProps {
                        nodes: any[];
                        relationships: any[];
                        domains: any[];
                        onSelectNode: (node: any) => void;
}

function ArchitectureVisualizerInner({
                        nodes: initialNodes,
                        relationships: initialEdges,
                        domains,
                        onSelectNode,
}: ArchitectureVisualizerProps) {
                        // State for expanded parent nodes
                        const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
                                                new Set()
                        );
                        const [searchQuery, setSearchQuery] = React.useState('');

                        const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(
                                                null
                        );
                        const [layoutMode, setLayoutMode] = React.useState<
                                                | 'hierarchical'
                                                | 'layered'
                                                | 'circular'
                                                | 'force-directed'
                        >('hierarchical');
                        const [focusMode, setFocusMode] = React.useState<boolean>(false);
                        const [metricsOverlay, setMetricsOverlay] = React.useState<
                                                | 'none'
                                                | 'complexity'
                                                | 'coupling'
                                                | 'tech_debt'
                                                | 'coverage'
                        >('none');

                        // Reset focus mode if node deselected
                        React.useEffect(() => {
                                                if (!selectedNodeId) {
                                                                        setFocusMode(false);
                                                }
                        }, [selectedNodeId]);

                        // Layered layout column mapping:
                        const getLayeredLevel = (node: any): number => {
                                                const type = node.type;
                                                const nameLower = (node.name || '').toLowerCase();
                                                const path = (
                                                                        node.properties?.path ||
                                                                        node.properties
                                                                                                ?.file_path ||
                                                                        ''
                                                ).toLowerCase();

                                                if (type === 'API' || type === 'API Endpoint') {
                                                                        return 1;
                                                }
                                                if (
                                                                        type === 'Database Table' ||
                                                                        type ===
                                                                                                'External Service' ||
                                                                        type === 'Cache' ||
                                                                        type === 'Cron Job' ||
                                                                        type === 'Environment'
                                                ) {
                                                                        return 4;
                                                }
                                                if (
                                                                        nameLower.includes(
                                                                                                'repository'
                                                                        ) ||
                                                                        nameLower.includes('dao') ||
                                                                        path.includes(
                                                                                                'repository'
                                                                        ) ||
                                                                        path.includes('dao')
                                                ) {
                                                                        return 3;
                                                }
                                                if (
                                                                        path.includes('apps/web') ||
                                                                        path.includes('src/app') ||
                                                                        path.includes(
                                                                                                'src/components'
                                                                        )
                                                ) {
                                                                        return 0;
                                                }
                                                if (
                                                                        type === 'Service' ||
                                                                        nameLower.includes(
                                                                                                'service'
                                                                        ) ||
                                                                        path.includes('service')
                                                ) {
                                                                        return 2;
                                                }
                                                // Fallbacks
                                                if (type === 'Repository') return 0;
                                                if (type === 'Domain') return 1;
                                                if (type === 'Class' || type === 'Interface')
                                                                        return 3;
                                                return 2; // Default to Services
                        };

                        // Initialize nodes: By default expand Repository and first-level Domains
                        React.useEffect(() => {
                                                const defaultExpanded = new Set<string>();
                                                initialNodes.forEach((n) => {
                                                                        if (
                                                                                                n.type ===
                                                                                                'Repository'
                                                                        ) {
                                                                                                defaultExpanded.add(
                                                                                                                        n.id
                                                                                                );
                                                                        }
                                                });
                                                // Auto expand domains as well for quicker map views
                                                domains.forEach((d) => {
                                                                        // Dynamic domains created in memory can be default expanded
                                                                        defaultExpanded.add(
                                                                                                `domain::${d.name}`
                                                                        );
                                                });
                                                setExpandedNodes(defaultExpanded);
                        }, [initialNodes, domains]);

                        const toggleNodeExpand = (nodeId: string) => {
                                                setExpandedNodes((prev) => {
                                                                        const next = new Set(prev);
                                                                        if (next.has(nodeId)) {
                                                                                                next.delete(
                                                                                                                        nodeId
                                                                                                );
                                                                        } else {
                                                                                                next.add(
                                                                                                                        nodeId
                                                                                                );
                                                                        }
                                                                        return next;
                                                });
                        };

                        // Build the hierarchical relationships
                        // Lanes column mappings:
                        const levelMap: Record<string, number> = {
                                                Repository: 0,
                                                Domain: 1,
                                                Service: 2,
                                                API: 2,
                                                'API Endpoint': 2,
                                                Module: 2,
                                                File: 2,
                                                Class: 3,
                                                Interface: 3,
                                                Function: 4,
                                                Method: 4,
                                                'Database Table': 4,
                                                'External Service': 4,
                                                Cache: 4,
                                                'Cron Job': 4,
                                                Environment: 4,
                                                'Docker Service': 4,
                                                'GitHub Action': 4,
                        };

                        // Build unified nodes list
                        const nodesList = React.useMemo(() => {
                                                const list: any[] = [];

                                                // 1. Create Repository node
                                                const repoNode = initialNodes.find(
                                                                        (n) =>
                                                                                                n.type ===
                                                                                                'Repository'
                                                );
                                                if (repoNode) {
                                                                        list.push({
                                                                                                id: repoNode.id,
                                                                                                type: 'Repository',
                                                                                                name: repoNode.name,
                                                                                                description:
                                                                                                                        (
                                                                                                                                                repoNode.properties as any
                                                                                                                        )
                                                                                                                                                ?.full_name ||
                                                                                                                        'Code repository root',
                                                                                                metricsSummary: 'Source Root',
                                                                                                properties: repoNode.properties,
                                                                        });
                                                } else {
                                                                        list.push({
                                                                                                id: 'repo-root',
                                                                                                type: 'Repository',
                                                                                                name: 'Repository',
                                                                                                description: 'Code repository root',
                                                                                                metricsSummary: 'Root',
                                                                                                properties: {},
                                                                        });
                                                }

                                                // 2. Add domain nodes dynamically
                                                domains.forEach((d) => {
                                                                        list.push({
                                                                                                id: `domain::${d.name}`,
                                                                                                type: 'Domain',
                                                                                                name: d.name,
                                                                                                description: d.description,
                                                                                                metricsSummary: `${d.node_ids.length} Components`,
                                                                                                properties: {
                                                                                                                        description: d.description,
                                                                                                                        components_count: d
                                                                                                                                                .node_ids
                                                                                                                                                .length,
                                                                                                },
                                                                        });
                                                });

                                                // 3. Add other nodes
                                                initialNodes.forEach((node) => {
                                                                        if (
                                                                                                node.type !==
                                                                                                                        'Repository' &&
                                                                                                node.type !==
                                                                                                                        'Domain'
                                                                        ) {
                                                                                                list.push(
                                                                                                                        {
                                                                                                                                                id: node.id,
                                                                                                                                                type: node.type,
                                                                                                                                                name: node.name,
                                                                                                                                                description:
                                                                                                                                                                        (
                                                                                                                                                                                                node.properties as any
                                                                                                                                                                        )
                                                                                                                                                                                                ?.description ||
                                                                                                                                                                        '',
                                                                                                                                                metricsSummary:
                                                                                                                                                                        (
                                                                                                                                                                                                node.properties as any
                                                                                                                                                                        )
                                                                                                                                                                                                ?.layer ||
                                                                                                                                                                        (
                                                                                                                                                                                                node.properties as any
                                                                                                                                                                        )
                                                                                                                                                                                                ?.language ||
                                                                                                                                                                        '',
                                                                                                                                                properties: node.properties,
                                                                                                                        }
                                                                                                );
                                                                        }
                                                });

                                                return list;
                        }, [initialNodes, domains]);

                        // Available languages detection
                        const availableLanguages = React.useMemo(() => {
                                                const langs = new Set<string>();
                                                initialNodes.forEach((n) => {
                                                                        let lang = (
                                                                                                n.properties as any
                                                                        )?.language;
                                                                        if (!lang) {
                                                                                                const path =
                                                                                                                        (
                                                                                                                                                n.properties as any
                                                                                                                        )
                                                                                                                                                ?.path ||
                                                                                                                        (
                                                                                                                                                n.properties as any
                                                                                                                        )
                                                                                                                                                ?.file_path ||
                                                                                                                        '';
                                                                                                if (
                                                                                                                        path.endsWith(
                                                                                                                                                '.py'
                                                                                                                        )
                                                                                                )
                                                                                                                        lang =
                                                                                                                                                'Python';
                                                                                                else if (
                                                                                                                        path.endsWith(
                                                                                                                                                '.ts'
                                                                                                                        ) ||
                                                                                                                        path.endsWith(
                                                                                                                                                '.tsx'
                                                                                                                        )
                                                                                                )
                                                                                                                        lang =
                                                                                                                                                'TypeScript';
                                                                                                else if (
                                                                                                                        path.endsWith(
                                                                                                                                                '.js'
                                                                                                                        ) ||
                                                                                                                        path.endsWith(
                                                                                                                                                '.jsx'
                                                                                                                        )
                                                                                                )
                                                                                                                        lang =
                                                                                                                                                'JavaScript';
                                                                        }
                                                                        if (lang) {
                                                                                                langs.add(
                                                                                                                        lang
                                                                                                );
                                                                        }
                                                });
                                                return Array.from(langs);
                        }, [initialNodes]);

                        // Selected languages state
                        const [languageFilters, setLanguageFilters] = React.useState<
                                                Record<string, boolean>
                        >({});

                        // Set all to true initially
                        React.useEffect(() => {
                                                const initial: Record<string, boolean> = {};
                                                availableLanguages.forEach((l) => {
                                                                        initial[l] = true;
                                                });
                                                setLanguageFilters(initial);
                        }, [availableLanguages]);

                        // Unified filters state
                        const [unifiedFilters, setUnifiedFilters] = React.useState<
                                                Record<string, boolean>
                        >({
                                                Domain: true,
                                                Module: true,
                                                Service: true,
                                                API: true,
                                                Database: true,
                                                'External Library': true,
                        });

                        const matchesUnifiedFilter = (node: any): boolean => {
                                                const type = node.type;
                                                const nameLower = (node.name || '').toLowerCase();
                                                const path = (
                                                                        node.properties?.path ||
                                                                        node.properties
                                                                                                ?.file_path ||
                                                                        ''
                                                ).toLowerCase();

                                                if (type === 'Repository') return true;

                                                if (type === 'Domain') {
                                                                        return unifiedFilters[
                                                                                                'Domain'
                                                                        ];
                                                }
                                                if (type === 'API' || type === 'API Endpoint') {
                                                                        return unifiedFilters[
                                                                                                'API'
                                                                        ];
                                                }
                                                if (type === 'Database Table') {
                                                                        return unifiedFilters[
                                                                                                'Database'
                                                                        ];
                                                }
                                                if (
                                                                        type ===
                                                                                                'External Service' ||
                                                                        type === 'Cache' ||
                                                                        type === 'Cron Job' ||
                                                                        type === 'Environment'
                                                ) {
                                                                        return unifiedFilters[
                                                                                                'External Library'
                                                                        ];
                                                }
                                                if (
                                                                        nameLower.includes(
                                                                                                'repository'
                                                                        ) ||
                                                                        nameLower.includes('dao') ||
                                                                        path.includes(
                                                                                                'repository'
                                                                        ) ||
                                                                        path.includes('dao')
                                                ) {
                                                                        return unifiedFilters[
                                                                                                'Service'
                                                                        ];
                                                }
                                                if (type === 'Module' || type === 'File') {
                                                                        return unifiedFilters[
                                                                                                'Module'
                                                                        ];
                                                }
                                                if (
                                                                        type === 'Service' ||
                                                                        nameLower.includes(
                                                                                                'service'
                                                                        ) ||
                                                                        path.includes('service')
                                                ) {
                                                                        return unifiedFilters[
                                                                                                'Service'
                                                                        ];
                                                }
                                                return unifiedFilters['Service'];
                        };

                        const matchesLanguageFilter = (node: any): boolean => {
                                                if (
                                                                        node.type ===
                                                                                                'Repository' ||
                                                                        node.type === 'Domain'
                                                )
                                                                        return true;

                                                let lang = (node.properties as any)?.language;
                                                if (!lang) {
                                                                        const path =
                                                                                                (
                                                                                                                        node.properties as any
                                                                                                )
                                                                                                                        ?.path ||
                                                                                                (
                                                                                                                        node.properties as any
                                                                                                )
                                                                                                                        ?.file_path ||
                                                                                                '';
                                                                        if (path.endsWith('.py'))
                                                                                                lang =
                                                                                                                        'Python';
                                                                        else if (
                                                                                                path.endsWith(
                                                                                                                        '.ts'
                                                                                                ) ||
                                                                                                path.endsWith(
                                                                                                                        '.tsx'
                                                                                                )
                                                                        )
                                                                                                lang =
                                                                                                                        'TypeScript';
                                                                        else if (
                                                                                                path.endsWith(
                                                                                                                        '.js'
                                                                                                ) ||
                                                                                                path.endsWith(
                                                                                                                        '.jsx'
                                                                                                )
                                                                        )
                                                                                                lang =
                                                                                                                        'JavaScript';
                                                }
                                                if (!lang) return true;
                                                return languageFilters[lang] !== false;
                        };

                        // Smart Search Dropdown query results
                        const searchResults = React.useMemo(() => {
                                                if (!searchQuery.trim()) return null;
                                                const query = searchQuery.toLowerCase();

                                                const groups: Record<string, any[]> = {};
                                                nodesList.forEach((n) => {
                                                                        if (
                                                                                                n.name
                                                                                                                        .toLowerCase()
                                                                                                                        .includes(
                                                                                                                                                query
                                                                                                                        )
                                                                        ) {
                                                                                                let groupName =
                                                                                                                        'Others';
                                                                                                const type =
                                                                                                                        n.type;
                                                                                                if (
                                                                                                                        type ===
                                                                                                                                                'Function' ||
                                                                                                                        type ===
                                                                                                                                                'Method'
                                                                                                )
                                                                                                                        groupName =
                                                                                                                                                'Functions';
                                                                                                else if (
                                                                                                                        type ===
                                                                                                                                                'Class' ||
                                                                                                                        type ===
                                                                                                                                                'Interface'
                                                                                                )
                                                                                                                        groupName =
                                                                                                                                                'Classes';
                                                                                                else if (
                                                                                                                        type ===
                                                                                                                                                'Module' ||
                                                                                                                        type ===
                                                                                                                                                'File'
                                                                                                )
                                                                                                                        groupName =
                                                                                                                                                'Modules';
                                                                                                else if (
                                                                                                                        type ===
                                                                                                                                                'API' ||
                                                                                                                        type ===
                                                                                                                                                'API Endpoint'
                                                                                                )
                                                                                                                        groupName =
                                                                                                                                                'APIs';
                                                                                                else if (
                                                                                                                        type ===
                                                                                                                        'Database Table'
                                                                                                )
                                                                                                                        groupName =
                                                                                                                                                'Databases';
                                                                                                else if (
                                                                                                                        type ===
                                                                                                                        'Domain'
                                                                                                )
                                                                                                                        groupName =
                                                                                                                                                'Domains';
                                                                                                else if (
                                                                                                                        type ===
                                                                                                                        'Service'
                                                                                                )
                                                                                                                        groupName =
                                                                                                                                                'Services';

                                                                                                if (
                                                                                                                        !groups[
                                                                                                                                                groupName
                                                                                                                        ]
                                                                                                ) {
                                                                                                                        groups[
                                                                                                                                                groupName
                                                                                                                        ] =
                                                                                                                                                [];
                                                                                                }
                                                                                                groups[
                                                                                                                        groupName
                                                                                                ].push(
                                                                                                                        n
                                                                                                );
                                                                        }
                                                });
                                                return groups;
                        }, [searchQuery, nodesList]);

                        const { setCenter } = useReactFlow();

                        const handleSelectNodeFromSearch = (nodeId: string) => {
                                                const flowNode = flowNodes.find(
                                                                        (fn) => fn.id === nodeId
                                                );
                                                if (flowNode) {
                                                                        setSelectedNodeId(nodeId);
                                                                        const originalNode =
                                                                                                initialNodes.find(
                                                                                                                        (
                                                                                                                                                n
                                                                                                                        ) =>
                                                                                                                                                n.id ===
                                                                                                                                                nodeId
                                                                                                );
                                                                        if (originalNode) {
                                                                                                onSelectNode(
                                                                                                                        originalNode
                                                                                                );
                                                                        } else if (
                                                                                                nodeId.startsWith(
                                                                                                                        'domain::'
                                                                                                )
                                                                        ) {
                                                                                                const domainName =
                                                                                                                        nodeId.replace(
                                                                                                                                                'domain::',
                                                                                                                                                ''
                                                                                                                        );
                                                                                                const dom =
                                                                                                                        domains.find(
                                                                                                                                                (
                                                                                                                                                                        d
                                                                                                                                                ) =>
                                                                                                                                                                        d.name ===
                                                                                                                                                                        domainName
                                                                                                                        );
                                                                                                onSelectNode(
                                                                                                                        {
                                                                                                                                                id: nodeId,
                                                                                                                                                type: 'Domain',
                                                                                                                                                name: domainName,
                                                                                                                                                properties: {
                                                                                                                                                                        description:
                                                                                                                                                                                                dom?.description ||
                                                                                                                                                                                                '',
                                                                                                                                                                        components_count:
                                                                                                                                                                                                dom
                                                                                                                                                                                                                        ?.node_ids
                                                                                                                                                                                                                        .length ||
                                                                                                                                                                                                0,
                                                                                                                                                },
                                                                                                                        }
                                                                                                );
                                                                        }

                                                                        setCenter(
                                                                                                flowNode
                                                                                                                        .position
                                                                                                                        .x +
                                                                                                                        130,
                                                                                                flowNode
                                                                                                                        .position
                                                                                                                        .y +
                                                                                                                        60,
                                                                                                {
                                                                                                                        zoom: 1,
                                                                                                                        duration: 800,
                                                                                                }
                                                                        );
                                                                        setSearchQuery('');
                                                }
                        };

                        // Dynamic execution path solver (trace downstream calls from selectedNodeId)
                        const executionPath = React.useMemo(() => {
                                                if (!selectedNodeId) return [];

                                                // 1. Build adjacency list for downstream traversal
                                                const outgoing: Record<string, string[]> = {};
                                                initialEdges.forEach((edge) => {
                                                                        if (
                                                                                                edge.type ===
                                                                                                                        'OWNS' ||
                                                                                                edge.type ===
                                                                                                                        'BELONGS_TO'
                                                                        )
                                                                                                return;
                                                                        if (
                                                                                                !outgoing[
                                                                                                                        edge
                                                                                                                                                .source_id
                                                                                                ]
                                                                        )
                                                                                                outgoing[
                                                                                                                        edge.source_id
                                                                                                ] =
                                                                                                                        [];
                                                                        outgoing[
                                                                                                edge
                                                                                                                        .source_id
                                                                        ].push(edge.target_id);
                                                });

                                                // 2. Perform BFS to build path of unique nodes
                                                const pathNodes: any[] = [];
                                                const visited = new Set<string>([selectedNodeId]);
                                                const queue = [selectedNodeId];

                                                while (queue.length > 0) {
                                                                        const currId =
                                                                                                queue.shift()!;
                                                                        const n = nodesList.find(
                                                                                                (
                                                                                                                        node
                                                                                                ) =>
                                                                                                                        node.id ===
                                                                                                                        currId
                                                                        );
                                                                        if (
                                                                                                n &&
                                                                                                n.type !==
                                                                                                                        'Repository' &&
                                                                                                n.type !==
                                                                                                                        'Domain'
                                                                        ) {
                                                                                                pathNodes.push(
                                                                                                                        n
                                                                                                );
                                                                        }

                                                                        const targets =
                                                                                                outgoing[
                                                                                                                        currId
                                                                                                ] ||
                                                                                                [];
                                                                        targets.forEach(
                                                                                                (
                                                                                                                        targetId
                                                                                                ) => {
                                                                                                                        if (
                                                                                                                                                !visited.has(
                                                                                                                                                                        targetId
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                visited.add(
                                                                                                                                                                        targetId
                                                                                                                                                );
                                                                                                                                                queue.push(
                                                                                                                                                                        targetId
                                                                                                                                                );
                                                                                                                        }
                                                                                                }
                                                                        );
                                                }

                                                return pathNodes;
                        }, [selectedNodeId, initialEdges, nodesList]);

                        // Build structural links (which node parent-owns which child)
                        const parentMap = React.useMemo(() => {
                                                const parents: Record<string, string> = {};

                                                // 1. Establish parent map from OWNS / BELONGS_TO relationships
                                                initialEdges.forEach((edge) => {
                                                                        if (edge.type === 'OWNS') {
                                                                                                parents[
                                                                                                                        edge.target_id
                                                                                                ] =
                                                                                                                        edge.source_id;
                                                                        } else if (
                                                                                                edge.type ===
                                                                                                'BELONGS_TO'
                                                                        ) {
                                                                                                parents[
                                                                                                                        edge.source_id
                                                                                                ] =
                                                                                                                        edge.target_id;
                                                                        }
                                                });

                                                // 2. Map file symbols to their modules (files)
                                                initialNodes.forEach((node) => {
                                                                        const parts =
                                                                                                node.id.split(
                                                                                                                        '::'
                                                                                                );
                                                                        if (
                                                                                                node.type ===
                                                                                                                        'Class' ||
                                                                                                node.type ===
                                                                                                                        'Function' ||
                                                                                                node.type ===
                                                                                                                        'Method'
                                                                        ) {
                                                                                                if (
                                                                                                                        parts.length >
                                                                                                                        1
                                                                                                ) {
                                                                                                                        const filePath =
                                                                                                                                                parts[1];
                                                                                                                        const fileId = `file::${filePath}`;
                                                                                                                        if (
                                                                                                                                                !parents[
                                                                                                                                                                        node
                                                                                                                                                                                                .id
                                                                                                                                                ]
                                                                                                                        ) {
                                                                                                                                                parents[
                                                                                                                                                                        node.id
                                                                                                                                                ] =
                                                                                                                                                                        fileId;
                                                                                                                        }
                                                                                                }
                                                                        }
                                                });

                                                // 3. Bind nodes to domains using /knowledge/domains mapping
                                                domains.forEach((d) => {
                                                                        const domainId = `domain::${d.name}`;
                                                                        d.node_ids.forEach(
                                                                                                (
                                                                                                                        nid: string
                                                                                                ) => {
                                                                                                                        // If a node is an API, service or file module, bind to Domain
                                                                                                                        const node =
                                                                                                                                                initialNodes.find(
                                                                                                                                                                        (
                                                                                                                                                                                                n
                                                                                                                                                                        ) =>
                                                                                                                                                                                                n.id ===
                                                                                                                                                                                                nid
                                                                                                                                                );
                                                                                                                        if (
                                                                                                                                                node &&
                                                                                                                                                (node.type ===
                                                                                                                                                                        'Service' ||
                                                                                                                                                                        node.type ===
                                                                                                                                                                                                'Module' ||
                                                                                                                                                                        node.type ===
                                                                                                                                                                                                'File' ||
                                                                                                                                                                        node.type ===
                                                                                                                                                                                                'API Endpoint')
                                                                                                                        ) {
                                                                                                                                                if (
                                                                                                                                                                        !parents[
                                                                                                                                                                                                nid
                                                                                                                                                                        ] ||
                                                                                                                                                                        parents[
                                                                                                                                                                                                nid
                                                                                                                                                                        ].startsWith(
                                                                                                                                                                                                'file::'
                                                                                                                                                                        )
                                                                                                                                                ) {
                                                                                                                                                                        parents[
                                                                                                                                                                                                nid
                                                                                                                                                                        ] =
                                                                                                                                                                                                domainId;
                                                                                                                                                }
                                                                                                                        }
                                                                                                }
                                                                        );
                                                });

                                                // 4. Connect domain nodes to Repository root
                                                const repoNode = initialNodes.find(
                                                                        (n) =>
                                                                                                n.type ===
                                                                                                'Repository'
                                                );
                                                if (repoNode) {
                                                                        initialNodes.forEach(
                                                                                                (
                                                                                                                        node
                                                                                                ) => {
                                                                                                                        if (
                                                                                                                                                node.type ===
                                                                                                                                                                        'Domain' ||
                                                                                                                                                node.id.startsWith(
                                                                                                                                                                        'domain::'
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                parents[
                                                                                                                                                                        node.id
                                                                                                                                                ] =
                                                                                                                                                                        repoNode.id;
                                                                                                                        }
                                                                                                }
                                                                        );
                                                                        // Fallback: If a node has no parent, set parent to repository root
                                                                        initialNodes.forEach(
                                                                                                (
                                                                                                                        node
                                                                                                ) => {
                                                                                                                        if (
                                                                                                                                                node.id !==
                                                                                                                                                                        repoNode.id &&
                                                                                                                                                !parents[
                                                                                                                                                                        node
                                                                                                                                                                                                .id
                                                                                                                                                ]
                                                                                                                        ) {
                                                                                                                                                parents[
                                                                                                                                                                        node.id
                                                                                                                                                ] =
                                                                                                                                                                        repoNode.id;
                                                                                                                        }
                                                                                                }
                                                                        );
                                                }

                                                return parents;
                        }, [initialNodes, initialEdges, domains]);

                        // Compute children map
                        const childrenMap = React.useMemo(() => {
                                                const children: Record<string, string[]> = {};
                                                Object.entries(parentMap).forEach(
                                                                        ([childId, parentId]) => {
                                                                                                if (
                                                                                                                        !children[
                                                                                                                                                parentId
                                                                                                                        ]
                                                                                                ) {
                                                                                                                        children[
                                                                                                                                                parentId
                                                                                                                        ] =
                                                                                                                                                [];
                                                                                                }
                                                                                                children[
                                                                                                                        parentId
                                                                                                ].push(
                                                                                                                        childId
                                                                                                );
                                                                        }
                                                );
                                                return children;
                        }, [parentMap]);

                        // Calculate dependency path highlighting
                        const highlightedElements = React.useMemo(() => {
                                                const highlightedNodes = new Set<string>();
                                                const highlightedEdges = new Set<string>();

                                                if (!selectedNodeId)
                                                                        return {
                                                                                                nodes: highlightedNodes,
                                                                                                edges: highlightedEdges,
                                                                        };

                                                highlightedNodes.add(selectedNodeId);

                                                // Dynamic BFS path tracing (upstream and downstream dependencies)
                                                // Build adjacency list for queries
                                                const outgoing: Record<
                                                                        string,
                                                                        {
                                                                                                target: string;
                                                                                                edgeId: string;
                                                                        }[]
                                                > = {};
                                                const incoming: Record<
                                                                        string,
                                                                        {
                                                                                                source: string;
                                                                                                edgeId: string;
                                                                        }[]
                                                > = {};

                                                initialEdges.forEach((edge) => {
                                                                        if (
                                                                                                !outgoing[
                                                                                                                        edge
                                                                                                                                                .source_id
                                                                                                ]
                                                                        )
                                                                                                outgoing[
                                                                                                                        edge.source_id
                                                                                                ] =
                                                                                                                        [];
                                                                        if (
                                                                                                !incoming[
                                                                                                                        edge
                                                                                                                                                .target_id
                                                                                                ]
                                                                        )
                                                                                                incoming[
                                                                                                                        edge.target_id
                                                                                                ] =
                                                                                                                        [];

                                                                        outgoing[
                                                                                                edge
                                                                                                                        .source_id
                                                                        ].push({
                                                                                                target: edge.target_id,
                                                                                                edgeId: edge.id,
                                                                        });
                                                                        incoming[
                                                                                                edge
                                                                                                                        .target_id
                                                                        ].push({
                                                                                                source: edge.source_id,
                                                                                                edgeId: edge.id,
                                                                        });
                                                });

                                                // Downstream BFS
                                                const downQueue = [selectedNodeId];
                                                const downVisited = new Set([selectedNodeId]);
                                                while (downQueue.length > 0) {
                                                                        const curr =
                                                                                                downQueue.shift()!;
                                                                        (
                                                                                                outgoing[
                                                                                                                        curr
                                                                                                ] ||
                                                                                                []
                                                                        ).forEach(
                                                                                                ({
                                                                                                                        target,
                                                                                                                        edgeId,
                                                                                                }) => {
                                                                                                                        if (
                                                                                                                                                !downVisited.has(
                                                                                                                                                                        target
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                downVisited.add(
                                                                                                                                                                        target
                                                                                                                                                );
                                                                                                                                                highlightedNodes.add(
                                                                                                                                                                        target
                                                                                                                                                );
                                                                                                                                                highlightedEdges.add(
                                                                                                                                                                        edgeId
                                                                                                                                                );
                                                                                                                                                downQueue.push(
                                                                                                                                                                        target
                                                                                                                                                );
                                                                                                                        }
                                                                                                }
                                                                        );
                                                }

                                                // Upstream BFS
                                                const upQueue = [selectedNodeId];
                                                const upVisited = new Set([selectedNodeId]);
                                                while (upQueue.length > 0) {
                                                                        const curr =
                                                                                                upQueue.shift()!;
                                                                        (
                                                                                                incoming[
                                                                                                                        curr
                                                                                                ] ||
                                                                                                []
                                                                        ).forEach(
                                                                                                ({
                                                                                                                        source,
                                                                                                                        edgeId,
                                                                                                }) => {
                                                                                                                        if (
                                                                                                                                                !upVisited.has(
                                                                                                                                                                        source
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                upVisited.add(
                                                                                                                                                                        source
                                                                                                                                                );
                                                                                                                                                highlightedNodes.add(
                                                                                                                                                                        source
                                                                                                                                                );
                                                                                                                                                highlightedEdges.add(
                                                                                                                                                                        edgeId
                                                                                                                                                );
                                                                                                                                                upQueue.push(
                                                                                                                                                                        source
                                                                                                                                                );
                                                                                                                        }
                                                                                                }
                                                                        );
                                                }

                                                return {
                                                                        nodes: highlightedNodes,
                                                                        edges: highlightedEdges,
                                                };
                        }, [selectedNodeId, initialEdges]);

                        // Generate dynamic nodes and positions
                        const { flowNodes, flowEdges } = React.useMemo(() => {
                                                const getStatusColor = (
                                                                        node: any
                                                ): 'healthy' | 'warning' | 'critical' | null => {
                                                                        if (
                                                                                                metricsOverlay ===
                                                                                                'none'
                                                                        )
                                                                                                return null;

                                                                        const couplingCount =
                                                                                                initialEdges.filter(
                                                                                                                        (
                                                                                                                                                e
                                                                                                                        ) =>
                                                                                                                                                (e.source_id ===
                                                                                                                                                                        node.id ||
                                                                                                                                                                        e.target_id ===
                                                                                                                                                                                                node.id) &&
                                                                                                                                                e.type !==
                                                                                                                                                                        'OWNS' &&
                                                                                                                                                e.type !==
                                                                                                                                                                        'BELONGS_TO'
                                                                                                ).length;

                                                                        const loc = parseInt(
                                                                                                (
                                                                                                                        node.properties as any
                                                                                                )
                                                                                                                        ?.loc ||
                                                                                                                        (
                                                                                                                                                node.properties as any
                                                                                                                        )
                                                                                                                                                ?.lines_of_code ||
                                                                                                                        '150'
                                                                        );
                                                                        const cc = parseInt(
                                                                                                (
                                                                                                                        node.properties as any
                                                                                                )
                                                                                                                        ?.cyclomatic_complexity ||
                                                                                                                        (
                                                                                                                                                node.properties as any
                                                                                                                        )
                                                                                                                                                ?.complexity ||
                                                                                                                        '5'
                                                                        );
                                                                        const cov = parseFloat(
                                                                                                (
                                                                                                                        node.properties as any
                                                                                                )
                                                                                                                        ?.coverage ||
                                                                                                                        (
                                                                                                                                                node.properties as any
                                                                                                                        )
                                                                                                                                                ?.test_coverage ||
                                                                                                                        '0.85'
                                                                        );

                                                                        switch (metricsOverlay) {
                                                                                                case 'reliability': {
                                                                                                                        const pathStr =
                                                                                                                                                node
                                                                                                                                                                        .properties
                                                                                                                                                                        ?.path ||
                                                                                                                                                node
                                                                                                                                                                        .properties
                                                                                                                                                                        ?.file_path ||
                                                                                                                                                node.name ||
                                                                                                                                                '';
                                                                                                                        let failProb = 0.25;
                                                                                                                        if (
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'payment_service'
                                                                                                                                                ) ||
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'payment'
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                failProb = 0.93;
                                                                                                                        } else if (
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'auth'
                                                                                                                                                ) ||
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'session'
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                failProb = 0.82;
                                                                                                                        } else if (
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'user_service'
                                                                                                                                                ) ||
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'user'
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                failProb = 0.78;
                                                                                                                        } else if (
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'notification_service'
                                                                                                                                                ) ||
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'notification'
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                failProb = 0.68;
                                                                                                                        } else if (
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'reporting'
                                                                                                                                                ) ||
                                                                                                                                                pathStr.includes(
                                                                                                                                                                        'report'
                                                                                                                                                )
                                                                                                                        ) {
                                                                                                                                                failProb = 0.52;
                                                                                                                        } else if (
                                                                                                                                                cc >
                                                                                                                                                                        15 ||
                                                                                                                                                loc >
                                                                                                                                                                        500
                                                                                                                        ) {
                                                                                                                                                failProb = 0.72;
                                                                                                                        } else if (
                                                                                                                                                cc >
                                                                                                                                                                        8 ||
                                                                                                                                                loc >
                                                                                                                                                                        250
                                                                                                                        ) {
                                                                                                                                                failProb = 0.45;
                                                                                                                        }

                                                                                                                        if (
                                                                                                                                                failProb >
                                                                                                                                                0.8
                                                                                                                        )
                                                                                                                                                return 'critical';
                                                                                                                        if (
                                                                                                                                                failProb >
                                                                                                                                                0.6
                                                                                                                        )
                                                                                                                                                return 'high';
                                                                                                                        if (
                                                                                                                                                failProb >
                                                                                                                                                0.4
                                                                                                                        )
                                                                                                                                                return 'moderate';
                                                                                                                        return 'healthy';
                                                                                                }
                                                                                                case 'complexity':
                                                                                                                        if (
                                                                                                                                                cc >
                                                                                                                                                20
                                                                                                                        )
                                                                                                                                                return 'critical';
                                                                                                                        if (
                                                                                                                                                cc >
                                                                                                                                                10
                                                                                                                        )
                                                                                                                                                return 'warning';
                                                                                                                        return 'healthy';
                                                                                                case 'coupling':
                                                                                                                        if (
                                                                                                                                                couplingCount >
                                                                                                                                                12
                                                                                                                        )
                                                                                                                                                return 'critical';
                                                                                                                        if (
                                                                                                                                                couplingCount >
                                                                                                                                                5
                                                                                                                        )
                                                                                                                                                return 'warning';
                                                                                                                        return 'healthy';
                                                                                                case 'tech_debt':
                                                                                                                        if (
                                                                                                                                                loc >
                                                                                                                                                800
                                                                                                                        )
                                                                                                                                                return 'critical';
                                                                                                                        if (
                                                                                                                                                loc >
                                                                                                                                                250
                                                                                                                        )
                                                                                                                                                return 'warning';
                                                                                                                        return 'healthy';
                                                                                                case 'coverage':
                                                                                                                        if (
                                                                                                                                                cov <
                                                                                                                                                0.4
                                                                                                                        )
                                                                                                                                                return 'critical';
                                                                                                                        if (
                                                                                                                                                cov <
                                                                                                                                                0.8
                                                                                                                        )
                                                                                                                                                return 'warning';
                                                                                                                        return 'healthy';
                                                                                                default:
                                                                                                                        return null;
                                                                        }
                                                };

                                                const visibleNodeIds = new Set<string>();

                                                const repoNode = initialNodes.find(
                                                                        (n) =>
                                                                                                n.type ===
                                                                                                'Repository'
                                                );
                                                const rootId = repoNode ? repoNode.id : 'repo-root';

                                                // Filter nodesList by current active filters
                                                const filteredNodes = nodesList.filter(
                                                                        (n) =>
                                                                                                matchesUnifiedFilter(
                                                                                                                        n
                                                                                                ) &&
                                                                                                matchesLanguageFilter(
                                                                                                                        n
                                                                                                )
                                                );
                                                filteredNodes.forEach((n) =>
                                                                        visibleNodeIds.add(n.id)
                                                );

                                                // 4. Traverse tree hierarchy and filter by expansion state
                                                const finalVisibleIds = new Set<string>();

                                                const isNodeVisible = (nodeId: string): boolean => {
                                                                        if (
                                                                                                nodeId ===
                                                                                                                        rootId ||
                                                                                                nodeId.startsWith(
                                                                                                                        'domain::'
                                                                                                )
                                                                        ) {
                                                                                                return true;
                                                                        }
                                                                        const parentId =
                                                                                                parentMap[
                                                                                                                        nodeId
                                                                                                ];
                                                                        if (!parentId) return true;
                                                                        if (
                                                                                                !expandedNodes.has(
                                                                                                                        parentId
                                                                                                )
                                                                        )
                                                                                                return false;
                                                                        return isNodeVisible(
                                                                                                parentId
                                                                        );
                                                };

                                                filteredNodes.forEach((n) => {
                                                                        if (isNodeVisible(n.id)) {
                                                                                                finalVisibleIds.add(
                                                                                                                        n.id
                                                                                                );
                                                                        }
                                                });

                                                // Match query strings (for highlighting and forcing parents visibility)
                                                if (searchQuery.trim()) {
                                                                        const query =
                                                                                                searchQuery.toLowerCase();
                                                                        filteredNodes.forEach(
                                                                                                (
                                                                                                                        n
                                                                                                ) => {
                                                                                                                        if (
                                                                                                                                                n.name
                                                                                                                                                                        .toLowerCase()
                                                                                                                                                                        .includes(
                                                                                                                                                                                                query
                                                                                                                                                                        )
                                                                                                                        ) {
                                                                                                                                                finalVisibleIds.add(
                                                                                                                                                                        n.id
                                                                                                                                                );
                                                                                                                                                n.searchMatch = true;
                                                                                                                                                let parent =
                                                                                                                                                                        parentMap[
                                                                                                                                                                                                n
                                                                                                                                                                                                                        .id
                                                                                                                                                                        ];
                                                                                                                                                while (
                                                                                                                                                                        parent
                                                                                                                                                ) {
                                                                                                                                                                        finalVisibleIds.add(
                                                                                                                                                                                                parent
                                                                                                                                                                        );
                                                                                                                                                                        parent =
                                                                                                                                                                                                parentMap[
                                                                                                                                                                                                                        parent
                                                                                                                                                                                                ];
                                                                                                                                                }
                                                                                                                        }
                                                                                                }
                                                                        );
                                                }

                                                // 5. Compute coordinates by Column (Level index)
                                                let visibleNodesList = nodesList.filter((n) =>
                                                                        finalVisibleIds.has(n.id)
                                                );

                                                // Focus Mode filtering
                                                if (focusMode && selectedNodeId) {
                                                                        visibleNodesList =
                                                                                                visibleNodesList.filter(
                                                                                                                        (
                                                                                                                                                n
                                                                                                                        ) =>
                                                                                                                                                highlightedElements.nodes.has(
                                                                                                                                                                        n.id
                                                                                                                                                ) ||
                                                                                                                                                n.id ===
                                                                                                                                                                        selectedNodeId
                                                                                                );
                                                }

                                                const finalNodes: Node[] = [];

                                                // Inject column level headers
                                                if (
                                                                        layoutMode ===
                                                                                                'hierarchical' ||
                                                                        layoutMode === 'layered'
                                                ) {
                                                                        const headerLabels =
                                                                                                layoutMode ===
                                                                                                'hierarchical'
                                                                                                                        ? [
                                                                                                                                                  'Level 1: Entire Repository',
                                                                                                                                                  'Level 2: Business Domains',
                                                                                                                                                  'Level 3: Services & Modules',
                                                                                                                                                  'Level 4: Classes',
                                                                                                                                                  'Level 5: Methods & External',
                                                                                                                          ]
                                                                                                                        : [
                                                                                                                                                  'Level 1: Frontend Client',
                                                                                                                                                  'Level 2: API Gateway Routing',
                                                                                                                                                  'Level 3: Business Services',
                                                                                                                                                  'Level 4: Repositories & DAOs',
                                                                                                                                                  'Level 5: Database & Infrastructure',
                                                                                                                          ];

                                                                        for (
                                                                                                let i = 0;
                                                                                                i <
                                                                                                5;
                                                                                                i++
                                                                        ) {
                                                                                                finalNodes.push(
                                                                                                                        {
                                                                                                                                                id: `header-lvl-${i}`,
                                                                                                                                                type: 'customHeader',
                                                                                                                                                data: {
                                                                                                                                                                        label: headerLabels[
                                                                                                                                                                                                i
                                                                                                                                                                        ],
                                                                                                                                                },
                                                                                                                                                position: {
                                                                                                                                                                        x:
                                                                                                                                                                                                i *
                                                                                                                                                                                                                        340 +
                                                                                                                                                                                                80,
                                                                                                                                                                        y: -20,
                                                                                                                                                },
                                                                                                                                                draggable: false,
                                                                                                                                                selectable: false,
                                                                                                                        }
                                                                                                );
                                                                        }
                                                }

                                                if (layoutMode === 'circular') {
                                                                        const R = Math.max(
                                                                                                250,
                                                                                                visibleNodesList.length *
                                                                                                                        18
                                                                        );
                                                                        visibleNodesList.forEach(
                                                                                                (
                                                                                                                        node,
                                                                                                                        index
                                                                                                ) => {
                                                                                                                        const angle =
                                                                                                                                                (index /
                                                                                                                                                                        Math.max(
                                                                                                                                                                                                1,
                                                                                                                                                                                                visibleNodesList.length
                                                                                                                                                                        )) *
                                                                                                                                                2 *
                                                                                                                                                Math.PI;
                                                                                                                        const x =
                                                                                                                                                R *
                                                                                                                                                                        Math.cos(
                                                                                                                                                                                                angle
                                                                                                                                                                        ) +
                                                                                                                                                R +
                                                                                                                                                100;
                                                                                                                        const y =
                                                                                                                                                R *
                                                                                                                                                                        Math.sin(
                                                                                                                                                                                                angle
                                                                                                                                                                        ) +
                                                                                                                                                R +
                                                                                                                                                100;

                                                                                                                        const hasChildren =
                                                                                                                                                (
                                                                                                                                                                        childrenMap[
                                                                                                                                                                                                node
                                                                                                                                                                                                                        .id
                                                                                                                                                                        ] ||
                                                                                                                                                                        []
                                                                                                                                                )
                                                                                                                                                                        .length >
                                                                                                                                                0;
                                                                                                                        const isExpanded =
                                                                                                                                                expandedNodes.has(
                                                                                                                                                                        node.id
                                                                                                                                                );
                                                                                                                        const isHighlighted =
                                                                                                                                                highlightedElements.nodes.has(
                                                                                                                                                                        node.id
                                                                                                                                                );

                                                                                                                        finalNodes.push(
                                                                                                                                                {
                                                                                                                                                                        id: node.id,
                                                                                                                                                                        type: 'customArchitecture',
                                                                                                                                                                        data: {
                                                                                                                                                                                                name: node.name,
                                                                                                                                                                                                type: node.type,
                                                                                                                                                                                                description: node.description,
                                                                                                                                                                                                metricsSummary: node.metricsSummary,
                                                                                                                                                                                                hasChildren,
                                                                                                                                                                                                isExpanded,
                                                                                                                                                                                                isHighlighted,
                                                                                                                                                                                                hasActiveSelection: !!selectedNodeId,
                                                                                                                                                                                                onToggleExpand: () =>
                                                                                                                                                                                                                        toggleNodeExpand(
                                                                                                                                                                                                                                                node.id
                                                                                                                                                                                                                        ),
                                                                                                                                                                                                statusColor: getStatusColor(
                                                                                                                                                                                                                        node
                                                                                                                                                                                                ),
                                                                                                                                                                        },
                                                                                                                                                                        position: {
                                                                                                                                                                                                x,
                                                                                                                                                                                                y,
                                                                                                                                                                        },
                                                                                                                                                }
                                                                                                                        );
                                                                                                }
                                                                        );
                                                } else if (layoutMode === 'force-directed') {
                                                                        // Initialize coordinates in a circle
                                                                        const initialCoords =
                                                                                                visibleNodesList.map(
                                                                                                                        (
                                                                                                                                                n,
                                                                                                                                                idx
                                                                                                                        ) => {
                                                                                                                                                const angle =
                                                                                                                                                                        (idx /
                                                                                                                                                                                                Math.max(
                                                                                                                                                                                                                        1,
                                                                                                                                                                                                                        visibleNodesList.length
                                                                                                                                                                                                )) *
                                                                                                                                                                        2 *
                                                                                                                                                                        Math.PI;
                                                                                                                                                return {
                                                                                                                                                                        id: n.id,
                                                                                                                                                                        x:
                                                                                                                                                                                                Math.cos(
                                                                                                                                                                                                                        angle
                                                                                                                                                                                                ) *
                                                                                                                                                                                                                        300 +
                                                                                                                                                                                                400,
                                                                                                                                                                        y:
                                                                                                                                                                                                Math.sin(
                                                                                                                                                                                                                        angle
                                                                                                                                                                                                ) *
                                                                                                                                                                                                                        300 +
                                                                                                                                                                                                300,
                                                                                                                                                };
                                                                                                                        }
                                                                                                );

                                                                        // Filter active edges for force simulation
                                                                        const activeEdges =
                                                                                                initialEdges.filter(
                                                                                                                        (
                                                                                                                                                e
                                                                                                                        ) =>
                                                                                                                                                finalVisibleIds.has(
                                                                                                                                                                        e.source_id
                                                                                                                                                ) &&
                                                                                                                                                finalVisibleIds.has(
                                                                                                                                                                        e.target_id
                                                                                                                                                )
                                                                                                );

                                                                        const k = Math.sqrt(
                                                                                                (800 *
                                                                                                                        600) /
                                                                                                                        Math.max(
                                                                                                                                                1,
                                                                                                                                                visibleNodesList.length
                                                                                                                        )
                                                                        );
                                                                        let temp = 50;

                                                                        for (
                                                                                                let iter = 0;
                                                                                                iter <
                                                                                                60;
                                                                                                iter++
                                                                        ) {
                                                                                                // Repulsion forces
                                                                                                const repForces =
                                                                                                                        visibleNodesList.map(
                                                                                                                                                () => ({
                                                                                                                                                                        x: 0,
                                                                                                                                                                        y: 0,
                                                                                                                                                })
                                                                                                                        );
                                                                                                for (
                                                                                                                        let i = 0;
                                                                                                                        i <
                                                                                                                        visibleNodesList.length;
                                                                                                                        i++
                                                                                                ) {
                                                                                                                        for (
                                                                                                                                                let j = 0;
                                                                                                                                                j <
                                                                                                                                                visibleNodesList.length;
                                                                                                                                                j++
                                                                                                                        ) {
                                                                                                                                                if (
                                                                                                                                                                        i ===
                                                                                                                                                                        j
                                                                                                                                                )
                                                                                                                                                                        continue;
                                                                                                                                                const dx =
                                                                                                                                                                        initialCoords[
                                                                                                                                                                                                i
                                                                                                                                                                        ]
                                                                                                                                                                                                .x -
                                                                                                                                                                        initialCoords[
                                                                                                                                                                                                j
                                                                                                                                                                        ]
                                                                                                                                                                                                .x;
                                                                                                                                                const dy =
                                                                                                                                                                        initialCoords[
                                                                                                                                                                                                i
                                                                                                                                                                        ]
                                                                                                                                                                                                .y -
                                                                                                                                                                        initialCoords[
                                                                                                                                                                                                j
                                                                                                                                                                        ]
                                                                                                                                                                                                .y;
                                                                                                                                                const dist =
                                                                                                                                                                        Math.sqrt(
                                                                                                                                                                                                dx *
                                                                                                                                                                                                                        dx +
                                                                                                                                                                                                                        dy *
                                                                                                                                                                                                                                                dy
                                                                                                                                                                        ) ||
                                                                                                                                                                        1;
                                                                                                                                                if (
                                                                                                                                                                        dist <
                                                                                                                                                                        400
                                                                                                                                                ) {
                                                                                                                                                                        const force =
                                                                                                                                                                                                (k *
                                                                                                                                                                                                                        k) /
                                                                                                                                                                                                dist;
                                                                                                                                                                        repForces[
                                                                                                                                                                                                i
                                                                                                                                                                        ].x +=
                                                                                                                                                                                                (dx /
                                                                                                                                                                                                                        dist) *
                                                                                                                                                                                                force;
                                                                                                                                                                        repForces[
                                                                                                                                                                                                i
                                                                                                                                                                        ].y +=
                                                                                                                                                                                                (dy /
                                                                                                                                                                                                                        dist) *
                                                                                                                                                                                                force;
                                                                                                                                                }
                                                                                                                        }
                                                                                                }

                                                                                                // Attraction forces
                                                                                                const attForces =
                                                                                                                        visibleNodesList.map(
                                                                                                                                                () => ({
                                                                                                                                                                        x: 0,
                                                                                                                                                                        y: 0,
                                                                                                                                                })
                                                                                                                        );
                                                                                                activeEdges.forEach(
                                                                                                                        (
                                                                                                                                                edge
                                                                                                                        ) => {
                                                                                                                                                const sourceIdx =
                                                                                                                                                                        visibleNodesList.findIndex(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        n
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        n.id ===
                                                                                                                                                                                                                        edge.source_id
                                                                                                                                                                        );
                                                                                                                                                const targetIdx =
                                                                                                                                                                        visibleNodesList.findIndex(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        n
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        n.id ===
                                                                                                                                                                                                                        edge.target_id
                                                                                                                                                                        );
                                                                                                                                                if (
                                                                                                                                                                        sourceIdx !==
                                                                                                                                                                                                -1 &&
                                                                                                                                                                        targetIdx !==
                                                                                                                                                                                                -1
                                                                                                                                                ) {
                                                                                                                                                                        const dx =
                                                                                                                                                                                                initialCoords[
                                                                                                                                                                                                                        sourceIdx
                                                                                                                                                                                                ]
                                                                                                                                                                                                                        .x -
                                                                                                                                                                                                initialCoords[
                                                                                                                                                                                                                        targetIdx
                                                                                                                                                                                                ]
                                                                                                                                                                                                                        .x;
                                                                                                                                                                        const dy =
                                                                                                                                                                                                initialCoords[
                                                                                                                                                                                                                        sourceIdx
                                                                                                                                                                                                ]
                                                                                                                                                                                                                        .y -
                                                                                                                                                                                                initialCoords[
                                                                                                                                                                                                                        targetIdx
                                                                                                                                                                                                ]
                                                                                                                                                                                                                        .y;
                                                                                                                                                                        const dist =
                                                                                                                                                                                                Math.sqrt(
                                                                                                                                                                                                                        dx *
                                                                                                                                                                                                                                                dx +
                                                                                                                                                                                                                                                dy *
                                                                                                                                                                                                                                                                        dy
                                                                                                                                                                                                ) ||
                                                                                                                                                                                                1;
                                                                                                                                                                        const force =
                                                                                                                                                                                                (dist *
                                                                                                                                                                                                                        dist) /
                                                                                                                                                                                                k;
                                                                                                                                                                        attForces[
                                                                                                                                                                                                sourceIdx
                                                                                                                                                                        ].x -=
                                                                                                                                                                                                (dx /
                                                                                                                                                                                                                        dist) *
                                                                                                                                                                                                force;
                                                                                                                                                                        attForces[
                                                                                                                                                                                                sourceIdx
                                                                                                                                                                        ].y -=
                                                                                                                                                                                                (dy /
                                                                                                                                                                                                                        dist) *
                                                                                                                                                                                                force;
                                                                                                                                                                        attForces[
                                                                                                                                                                                                targetIdx
                                                                                                                                                                        ].x +=
                                                                                                                                                                                                (dx /
                                                                                                                                                                                                                        dist) *
                                                                                                                                                                                                force;
                                                                                                                                                                        attForces[
                                                                                                                                                                                                targetIdx
                                                                                                                                                                        ].y +=
                                                                                                                                                                                                (dy /
                                                                                                                                                                                                                        dist) *
                                                                                                                                                                                                force;
                                                                                                                                                }
                                                                                                                        }
                                                                                                );

                                                                                                // Update positions
                                                                                                for (
                                                                                                                        let i = 0;
                                                                                                                        i <
                                                                                                                        visibleNodesList.length;
                                                                                                                        i++
                                                                                                ) {
                                                                                                                        const fx =
                                                                                                                                                repForces[
                                                                                                                                                                        i
                                                                                                                                                ]
                                                                                                                                                                        .x +
                                                                                                                                                attForces[
                                                                                                                                                                        i
                                                                                                                                                ]
                                                                                                                                                                        .x;
                                                                                                                        const fy =
                                                                                                                                                repForces[
                                                                                                                                                                        i
                                                                                                                                                ]
                                                                                                                                                                        .y +
                                                                                                                                                attForces[
                                                                                                                                                                        i
                                                                                                                                                ]
                                                                                                                                                                        .y;
                                                                                                                        const fDist =
                                                                                                                                                Math.sqrt(
                                                                                                                                                                        fx *
                                                                                                                                                                                                fx +
                                                                                                                                                                                                fy *
                                                                                                                                                                                                                        fy
                                                                                                                                                ) ||
                                                                                                                                                1;
                                                                                                                        const forceClamped =
                                                                                                                                                Math.min(
                                                                                                                                                                        fDist,
                                                                                                                                                                        temp
                                                                                                                                                );
                                                                                                                        initialCoords[
                                                                                                                                                i
                                                                                                                        ].x +=
                                                                                                                                                (fx /
                                                                                                                                                                        fDist) *
                                                                                                                                                forceClamped;
                                                                                                                        initialCoords[
                                                                                                                                                i
                                                                                                                        ].y +=
                                                                                                                                                (fy /
                                                                                                                                                                        fDist) *
                                                                                                                                                forceClamped;
                                                                                                }

                                                                                                temp *= 0.95;
                                                                        }

                                                                        let minX = Infinity,
                                                                                                minY =
                                                                                                                        Infinity;
                                                                        initialCoords.forEach(
                                                                                                (
                                                                                                                        c
                                                                                                ) => {
                                                                                                                        minX =
                                                                                                                                                Math.min(
                                                                                                                                                                        minX,
                                                                                                                                                                        c.x
                                                                                                                                                );
                                                                                                                        minY =
                                                                                                                                                Math.min(
                                                                                                                                                                        minY,
                                                                                                                                                                        c.y
                                                                                                                                                );
                                                                                                }
                                                                        );

                                                                        visibleNodesList.forEach(
                                                                                                (
                                                                                                                        node,
                                                                                                                        index
                                                                                                ) => {
                                                                                                                        const c =
                                                                                                                                                initialCoords[
                                                                                                                                                                        index
                                                                                                                                                ];
                                                                                                                        const x =
                                                                                                                                                c.x -
                                                                                                                                                minX +
                                                                                                                                                50;
                                                                                                                        const y =
                                                                                                                                                c.y -
                                                                                                                                                minY +
                                                                                                                                                50;

                                                                                                                        const hasChildren =
                                                                                                                                                (
                                                                                                                                                                        childrenMap[
                                                                                                                                                                                                node
                                                                                                                                                                                                                        .id
                                                                                                                                                                        ] ||
                                                                                                                                                                        []
                                                                                                                                                )
                                                                                                                                                                        .length >
                                                                                                                                                0;
                                                                                                                        const isExpanded =
                                                                                                                                                expandedNodes.has(
                                                                                                                                                                        node.id
                                                                                                                                                );
                                                                                                                        const isHighlighted =
                                                                                                                                                highlightedElements.nodes.has(
                                                                                                                                                                        node.id
                                                                                                                                                );

                                                                                                                        finalNodes.push(
                                                                                                                                                {
                                                                                                                                                                        id: node.id,
                                                                                                                                                                        type: 'customArchitecture',
                                                                                                                                                                        data: {
                                                                                                                                                                                                name: node.name,
                                                                                                                                                                                                type: node.type,
                                                                                                                                                                                                description: node.description,
                                                                                                                                                                                                metricsSummary: node.metricsSummary,
                                                                                                                                                                                                hasChildren,
                                                                                                                                                                                                isExpanded,
                                                                                                                                                                                                isHighlighted,
                                                                                                                                                                                                hasActiveSelection: !!selectedNodeId,
                                                                                                                                                                                                onToggleExpand: () =>
                                                                                                                                                                                                                        toggleNodeExpand(
                                                                                                                                                                                                                                                node.id
                                                                                                                                                                                                                        ),
                                                                                                                                                                                                statusColor: getStatusColor(
                                                                                                                                                                                                                        node
                                                                                                                                                                                                ),
                                                                                                                                                                        },
                                                                                                                                                                        position: {
                                                                                                                                                                                                x,
                                                                                                                                                                                                y,
                                                                                                                                                                        },
                                                                                                                                                }
                                                                                                                        );
                                                                                                }
                                                                        );
                                                } else {
                                                                        // Column grid for Hierarchical and Layered layouts
                                                                        const columns: Record<
                                                                                                number,
                                                                                                any[]
                                                                        > = {};
                                                                        visibleNodesList.forEach(
                                                                                                (
                                                                                                                        n
                                                                                                ) => {
                                                                                                                        const colVal =
                                                                                                                                                layoutMode ===
                                                                                                                                                'hierarchical'
                                                                                                                                                                        ? levelMap[
                                                                                                                                                                                                  n
                                                                                                                                                                                                                          .type
                                                                                                                                                                          ] !==
                                                                                                                                                                          undefined
                                                                                                                                                                                                ? levelMap[
                                                                                                                                                                                                                          n
                                                                                                                                                                                                                                                  .type
                                                                                                                                                                                                  ]
                                                                                                                                                                                                : 2
                                                                                                                                                                        : getLayeredLevel(
                                                                                                                                                                                                  n
                                                                                                                                                                          );

                                                                                                                        if (
                                                                                                                                                !columns[
                                                                                                                                                                        colVal
                                                                                                                                                ]
                                                                                                                        ) {
                                                                                                                                                columns[
                                                                                                                                                                        colVal
                                                                                                                                                ] =
                                                                                                                                                                        [];
                                                                                                                        }
                                                                                                                        columns[
                                                                                                                                                colVal
                                                                                                                        ].push(
                                                                                                                                                n
                                                                                                                        );
                                                                                                }
                                                                        );

                                                                        Object.entries(
                                                                                                columns
                                                                        ).forEach(
                                                                                                ([
                                                                                                                        lvlStr,
                                                                                                                        colNodes,
                                                                                                ]) => {
                                                                                                                        const colIndex =
                                                                                                                                                parseInt(
                                                                                                                                                                        lvlStr
                                                                                                                                                );
                                                                                                                        const x =
                                                                                                                                                colIndex *
                                                                                                                                                                        340 +
                                                                                                                                                80;

                                                                                                                        colNodes.forEach(
                                                                                                                                                (
                                                                                                                                                                        node,
                                                                                                                                                                        index
                                                                                                                                                ) => {
                                                                                                                                                                        const y =
                                                                                                                                                                                                index *
                                                                                                                                                                                                                        140 +
                                                                                                                                                                                                50;

                                                                                                                                                                        const hasChildren =
                                                                                                                                                                                                (
                                                                                                                                                                                                                        childrenMap[
                                                                                                                                                                                                                                                node
                                                                                                                                                                                                                                                                        .id
                                                                                                                                                                                                                        ] ||
                                                                                                                                                                                                                        []
                                                                                                                                                                                                )
                                                                                                                                                                                                                        .length >
                                                                                                                                                                                                0;
                                                                                                                                                                        const isExpanded =
                                                                                                                                                                                                expandedNodes.has(
                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                );
                                                                                                                                                                        const isHighlighted =
                                                                                                                                                                                                highlightedElements.nodes.has(
                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                );

                                                                                                                                                                        finalNodes.push(
                                                                                                                                                                                                {
                                                                                                                                                                                                                        id: node.id,
                                                                                                                                                                                                                        type: 'customArchitecture',
                                                                                                                                                                                                                        data: {
                                                                                                                                                                                                                                                name: node.name,
                                                                                                                                                                                                                                                type: node.type,
                                                                                                                                                                                                                                                description: node.description,
                                                                                                                                                                                                                                                metricsSummary: node.metricsSummary,
                                                                                                                                                                                                                                                hasChildren,
                                                                                                                                                                                                                                                isExpanded,
                                                                                                                                                                                                                                                isHighlighted,
                                                                                                                                                                                                                                                hasActiveSelection: !!selectedNodeId,
                                                                                                                                                                                                                                                onToggleExpand: () =>
                                                                                                                                                                                                                                                                        toggleNodeExpand(
                                                                                                                                                                                                                                                                                                node.id
                                                                                                                                                                                                                                                                        ),
                                                                                                                                                                                                                                                statusColor: getStatusColor(
                                                                                                                                                                                                                                                                        node
                                                                                                                                                                                                                                                ),
                                                                                                                                                                                                                        },
                                                                                                                                                                                                                        position: {
                                                                                                                                                                                                                                                x,
                                                                                                                                                                                                                                                y,
                                                                                                                                                                                                                        },
                                                                                                                                                                                                }
                                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                        );
                                                                                                }
                                                                        );
                                                }

                                                // 6. Connect visible nodes with Edges
                                                const finalEdges: Edge[] = [];
                                                const finalVisibleSet = new Set(
                                                                        finalNodes.map((n) => n.id)
                                                );

                                                // Structural parent-child ownership edges (rendered differently: dotted/subtle)
                                                finalNodes.forEach((node) => {
                                                                        const parentId =
                                                                                                parentMap[
                                                                                                                        node
                                                                                                                                                .id
                                                                                                ];
                                                                        if (
                                                                                                parentId &&
                                                                                                finalVisibleSet.has(
                                                                                                                        parentId
                                                                                                )
                                                                        ) {
                                                                                                const isHighlighted =
                                                                                                                        highlightedElements.edges.has(
                                                                                                                                                `parent-${parentId}-${node.id}`
                                                                                                                        ) ||
                                                                                                                        (highlightedElements.nodes.has(
                                                                                                                                                parentId
                                                                                                                        ) &&
                                                                                                                                                highlightedElements.nodes.has(
                                                                                                                                                                        node.id
                                                                                                                                                ));

                                                                                                finalEdges.push(
                                                                                                                        {
                                                                                                                                                id: `parent-${parentId}-${node.id}`,
                                                                                                                                                source: parentId,
                                                                                                                                                target: node.id,
                                                                                                                                                type: 'smoothstep',
                                                                                                                                                style: {
                                                                                                                                                                        stroke: isHighlighted
                                                                                                                                                                                                ? 'var(--primary)'
                                                                                                                                                                                                : 'currentColor',
                                                                                                                                                                        strokeWidth: isHighlighted
                                                                                                                                                                                                ? 2.5
                                                                                                                                                                                                : 1,
                                                                                                                                                                        strokeDasharray: '4 4',
                                                                                                                                                                        opacity: isHighlighted
                                                                                                                                                                                                ? 1
                                                                                                                                                                                                : selectedNodeId
                                                                                                                                                                                                  ? 0.05
                                                                                                                                                                                                  : 0.35,
                                                                                                                                                },
                                                                                                                                                animated: isHighlighted,
                                                                                                                        }
                                                                                                );
                                                                        }
                                                });

                                                // Behavioral functional edges (calls, imports, queries)
                                                initialEdges.forEach((edge) => {
                                                                        if (
                                                                                                finalVisibleSet.has(
                                                                                                                        edge.source_id
                                                                                                ) &&
                                                                                                finalVisibleSet.has(
                                                                                                                        edge.target_id
                                                                                                )
                                                                        ) {
                                                                                                // Exclude parent ownership connections already drawn
                                                                                                if (
                                                                                                                        edge.type ===
                                                                                                                                                'OWNS' ||
                                                                                                                        edge.type ===
                                                                                                                                                'BELONGS_TO'
                                                                                                )
                                                                                                                        return;

                                                                                                const isHighlighted =
                                                                                                                        highlightedElements.edges.has(
                                                                                                                                                edge.id
                                                                                                                        );

                                                                                                finalEdges.push(
                                                                                                                        {
                                                                                                                                                id: edge.id,
                                                                                                                                                source: edge.source_id,
                                                                                                                                                target: edge.target_id,
                                                                                                                                                label:
                                                                                                                                                                        (
                                                                                                                                                                                                edge.properties as any
                                                                                                                                                                        )
                                                                                                                                                                                                ?.label ||
                                                                                                                                                                        edge.type,
                                                                                                                                                labelStyle: {
                                                                                                                                                                        fill: 'var(--muted-foreground)',
                                                                                                                                                                        fontSize: 8,
                                                                                                                                                                        fontStyle: 'italic',
                                                                                                                                                },
                                                                                                                                                type: 'default',
                                                                                                                                                style: {
                                                                                                                                                                        stroke: isHighlighted
                                                                                                                                                                                                ? 'var(--primary)'
                                                                                                                                                                                                : 'currentColor',
                                                                                                                                                                        strokeWidth: isHighlighted
                                                                                                                                                                                                ? 2.5
                                                                                                                                                                                                : 1.25,
                                                                                                                                                                        opacity: isHighlighted
                                                                                                                                                                                                ? 1
                                                                                                                                                                                                : selectedNodeId
                                                                                                                                                                                                  ? 0.08
                                                                                                                                                                                                  : 0.4,
                                                                                                                                                },
                                                                                                                                                markerEnd: {
                                                                                                                                                                        type: MarkerType.ArrowClosed,
                                                                                                                                                                        width: 12,
                                                                                                                                                                        height: 12,
                                                                                                                                                                        color: isHighlighted
                                                                                                                                                                                                ? 'var(--primary)'
                                                                                                                                                                                                : 'currentColor',
                                                                                                                                                },
                                                                                                                                                animated: isHighlighted,
                                                                                                                        }
                                                                                                );
                                                                        }
                                                });

                                                return {
                                                                        flowNodes: finalNodes,
                                                                        flowEdges: finalEdges,
                                                };
                        }, [
                                                initialNodes,
                                                initialEdges,
                                                domains,
                                                expandedNodes,
                                                searchQuery,
                                                selectedNodeId,
                                                highlightedElements,
                                                layoutMode,
                                                focusMode,
                                                nodesList,
                                                unifiedFilters,
                                                languageFilters,
                                                metricsOverlay,
                        ]);

                        // Handle clicking on flow node
                        const onNodeClick = (_: any, node: Node) => {
                                                setSelectedNodeId(node.id);
                                                const originalNode = initialNodes.find(
                                                                        (n) => n.id === node.id
                                                );
                                                if (originalNode) {
                                                                        onSelectNode(originalNode);
                                                } else if (node.id.startsWith('domain::')) {
                                                                        const domainName =
                                                                                                node.id.replace(
                                                                                                                        'domain::',
                                                                                                                        ''
                                                                                                );
                                                                        const dom = domains.find(
                                                                                                (
                                                                                                                        d
                                                                                                ) =>
                                                                                                                        d.name ===
                                                                                                                        domainName
                                                                        );
                                                                        onSelectNode({
                                                                                                id: node.id,
                                                                                                type: 'Domain',
                                                                                                name: domainName,
                                                                                                properties: {
                                                                                                                        description:
                                                                                                                                                dom?.description ||
                                                                                                                                                '',
                                                                                                                        components_count:
                                                                                                                                                dom
                                                                                                                                                                        ?.node_ids
                                                                                                                                                                        .length ||
                                                                                                                                                0,
                                                                                                },
                                                                        });
                                                }
                        };

                        const onPaneClick = () => {
                                                setSelectedNodeId(null);
                                                onSelectNode(null as any);
                        };

                        return (
                                                <div className="flex flex-col h-[calc(100vh-250px)] relative border border-border/80 rounded-2xl overflow-hidden bg-card/50 backdrop-blur shadow-sm">
                                                                        {/* Control panel header */}
                                                                        <div className="flex flex-wrap items-center justify-between p-4 border-b border-border bg-muted/20 gap-4">
                                                                                                {/* Search Input & Smart Dropdown overlay */}
                                                                                                <div className="relative max-w-xs w-full">
                                                                                                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                                                                        <input
                                                                                                                                                type="text"
                                                                                                                                                placeholder="Search login, database, API..."
                                                                                                                                                value={
                                                                                                                                                                        searchQuery
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setSearchQuery(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="w-full pl-9 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm"
                                                                                                                        />

                                                                                                                        {/* Smart Search Dropdown overlay */}
                                                                                                                        {searchResults &&
                                                                                                                                                Object.keys(
                                                                                                                                                                        searchResults
                                                                                                                                                )
                                                                                                                                                                        .length >
                                                                                                                                                                        0 && (
                                                                                                                                                                        <div className="absolute left-0 right-0 mt-1.5 max-h-80 overflow-y-auto bg-popover text-popover-foreground border rounded-xl shadow-xl z-50 p-2 divide-y divide-border/50 animate-in fade-in slide-in-from-top-1 duration-100 backdrop-blur-md">
                                                                                                                                                                                                {Object.entries(
                                                                                                                                                                                                                        searchResults
                                                                                                                                                                                                ).map(
                                                                                                                                                                                                                        ([
                                                                                                                                                                                                                                                groupName,
                                                                                                                                                                                                                                                items,
                                                                                                                                                                                                                        ]) => (
                                                                                                                                                                                                                                                <div
                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                groupName
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        className="py-1.5 first:pt-0 last:pb-0"
                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                        <div className="px-2 py-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        groupName
                                                                                                                                                                                                                                                                                                }{' '}
                                                                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                        items.length
                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                        <div className="space-y-0.5 mt-1">
                                                                                                                                                                                                                                                                                                {items.map(
                                                                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                                                                item
                                                                                                                                                                                                                                                                                                                        ) => (
                                                                                                                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                                                                                                                                                                item.id
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                                                                                                                handleSelectNodeFromSearch(
                                                                                                                                                                                                                                                                                                                                                                                                                        item.id
                                                                                                                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-between font-medium cursor-pointer"
                                                                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                                                                        <span className="truncate pr-2">
                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                        item.name
                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                                        <span className="text-[9px] font-mono text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded">
                                                                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                                                                        item.type
                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                        )
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                                        {searchResults &&
                                                                                                                                                Object.keys(
                                                                                                                                                                        searchResults
                                                                                                                                                )
                                                                                                                                                                        .length ===
                                                                                                                                                                        0 && (
                                                                                                                                                                        <div className="absolute left-0 right-0 mt-1.5 p-3 text-center text-xs text-muted-foreground bg-popover border rounded-xl shadow-xl z-50">
                                                                                                                                                                                                No
                                                                                                                                                                                                components
                                                                                                                                                                                                matching
                                                                                                                                                                                                "
                                                                                                                                                                                                {
                                                                                                                                                                                                                        searchQuery
                                                                                                                                                                                                }

                                                                                                                                                                                                "
                                                                                                                                                                        </div>
                                                                                                                                                )}
                                                                                                </div>

                                                                                                {/* View filters */}
                                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                                                        {/* Unified Category Filters */}
                                                                                                                        {Object.entries(
                                                                                                                                                unifiedFilters
                                                                                                                        ).map(
                                                                                                                                                ([
                                                                                                                                                                        type,
                                                                                                                                                                        enabled,
                                                                                                                                                ]) => (
                                                                                                                                                                        <button
                                                                                                                                                                                                key={
                                                                                                                                                                                                                        type
                                                                                                                                                                                                }
                                                                                                                                                                                                onClick={() =>
                                                                                                                                                                                                                        setUnifiedFilters(
                                                                                                                                                                                                                                                (
                                                                                                                                                                                                                                                                        prev
                                                                                                                                                                                                                                                ) => ({
                                                                                                                                                                                                                                                                        ...prev,
                                                                                                                                                                                                                                                                        [type]: !prev[
                                                                                                                                                                                                                                                                                                type
                                                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                                })
                                                                                                                                                                                                                        )
                                                                                                                                                                                                }
                                                                                                                                                                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer select-none transition-all ${
                                                                                                                                                                                                                        enabled
                                                                                                                                                                                                                                                ? 'bg-primary text-primary-foreground border-primary shadow'
                                                                                                                                                                                                                                                : 'bg-background hover:bg-muted text-muted-foreground border-border'
                                                                                                                                                                                                }`}
                                                                                                                                                                        >
                                                                                                                                                                                                {enabled ? (
                                                                                                                                                                                                                        <Eye className="h-3 w-3" />
                                                                                                                                                                                                ) : (
                                                                                                                                                                                                                        <EyeOff className="h-3 w-3" />
                                                                                                                                                                                                )}
                                                                                                                                                                                                {
                                                                                                                                                                                                                        type
                                                                                                                                                                                                }
                                                                                                                                                                        </button>
                                                                                                                                                )
                                                                                                                        )}

                                                                                                                        {/* Dynamic Language Filters */}
                                                                                                                        {availableLanguages.map(
                                                                                                                                                (
                                                                                                                                                                        lang
                                                                                                                                                ) => {
                                                                                                                                                                        const enabled =
                                                                                                                                                                                                languageFilters[
                                                                                                                                                                                                                        lang
                                                                                                                                                                                                ] !==
                                                                                                                                                                                                false;
                                                                                                                                                                        return (
                                                                                                                                                                                                <button
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                lang
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setLanguageFilters(
                                                                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                                                                prev
                                                                                                                                                                                                                                                                        ) => ({
                                                                                                                                                                                                                                                                                                ...prev,
                                                                                                                                                                                                                                                                                                [lang]: !prev[
                                                                                                                                                                                                                                                                                                                        lang
                                                                                                                                                                                                                                                                                                ],
                                                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer select-none transition-all ${
                                                                                                                                                                                                                                                enabled
                                                                                                                                                                                                                                                                        ? 'bg-violet-600 text-white border-violet-600 shadow'
                                                                                                                                                                                                                                                                        : 'bg-background hover:bg-muted text-muted-foreground border-border'
                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        <Code className="h-3 w-3" />
                                                                                                                                                                                                                        {
                                                                                                                                                                                                                                                lang
                                                                                                                                                                                                                        }
                                                                                                                                                                                                </button>
                                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                        )}

                                                                                                                        <Button
                                                                                                                                                variant="outline"
                                                                                                                                                size="xs"
                                                                                                                                                onClick={() => {
                                                                                                                                                                        const allExpanded =
                                                                                                                                                                                                new Set<string>();
                                                                                                                                                                        initialNodes.forEach(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        n
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        allExpanded.add(
                                                                                                                                                                                                                                                n.id
                                                                                                                                                                                                                        )
                                                                                                                                                                        );
                                                                                                                                                                        domains.forEach(
                                                                                                                                                                                                (
                                                                                                                                                                                                                        d
                                                                                                                                                                                                ) =>
                                                                                                                                                                                                                        allExpanded.add(
                                                                                                                                                                                                                                                `domain::${d.name}`
                                                                                                                                                                                                                        )
                                                                                                                                                                        );
                                                                                                                                                                        setExpandedNodes(
                                                                                                                                                                                                allExpanded
                                                                                                                                                                        );
                                                                                                                                                }}
                                                                                                                                                className="text-xs h-9 px-3 rounded-lg"
                                                                                                                        >
                                                                                                                                                Expand
                                                                                                                                                All
                                                                                                                        </Button>

                                                                                                                        <Button
                                                                                                                                                variant="outline"
                                                                                                                                                size="xs"
                                                                                                                                                onClick={() => {
                                                                                                                                                                        const repo =
                                                                                                                                                                                                initialNodes.find(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                n
                                                                                                                                                                                                                        ) =>
                                                                                                                                                                                                                                                n.type ===
                                                                                                                                                                                                                                                'Repository'
                                                                                                                                                                                                );
                                                                                                                                                                        const collapsed =
                                                                                                                                                                                                new Set<string>();
                                                                                                                                                                        if (
                                                                                                                                                                                                repo
                                                                                                                                                                        )
                                                                                                                                                                                                collapsed.add(
                                                                                                                                                                                                                        repo.id
                                                                                                                                                                                                );
                                                                                                                                                                        setExpandedNodes(
                                                                                                                                                                                                collapsed
                                                                                                                                                                        );
                                                                                                                                                                        setSelectedNodeId(
                                                                                                                                                                                                null
                                                                                                                                                                        );
                                                                                                                                                }}
                                                                                                                                                className="text-xs h-9 px-3 rounded-lg"
                                                                                                                        >
                                                                                                                                                Collapse
                                                                                                                                                All
                                                                                                                        </Button>
                                                                                                </div>
                                                                        </div>

                                                                        {/* Layout & Focus Mode Controls Subheader */}
                                                                        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-border bg-card/60 gap-4">
                                                                                                {/* Layout Modes */}
                                                                                                <div className="flex items-center gap-2">
                                                                                                                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                                                                                                                                <Layers className="h-3.5 w-3.5" />
                                                                                                                                                Layout:
                                                                                                                        </span>
                                                                                                                        <div className="inline-flex rounded-lg border bg-background p-0.5 gap-0.5 shadow-sm">
                                                                                                                                                {(
                                                                                                                                                                        [
                                                                                                                                                                                                'hierarchical',
                                                                                                                                                                                                'layered',
                                                                                                                                                                                                'circular',
                                                                                                                                                                                                'force-directed',
                                                                                                                                                                        ] as const
                                                                                                                                                ).map(
                                                                                                                                                                        (
                                                                                                                                                                                                mode
                                                                                                                                                                        ) => (
                                                                                                                                                                                                <button
                                                                                                                                                                                                                        key={
                                                                                                                                                                                                                                                mode
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                setLayoutMode(
                                                                                                                                                                                                                                                                        mode
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold select-none cursor-pointer transition-all ${
                                                                                                                                                                                                                                                layoutMode ===
                                                                                                                                                                                                                                                mode
                                                                                                                                                                                                                                                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                                                                                                                                                                                                                                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                >
                                                                                                                                                                                                                        {mode
                                                                                                                                                                                                                                                .charAt(
                                                                                                                                                                                                                                                                        0
                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                .toUpperCase() +
                                                                                                                                                                                                                                                mode
                                                                                                                                                                                                                                                                        .slice(
                                                                                                                                                                                                                                                                                                1
                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                        .replace(
                                                                                                                                                                                                                                                                                                '-',
                                                                                                                                                                                                                                                                                                ' '
                                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                </button>
                                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                        </div>
                                                                                                </div>

                                                                                                {/* Metrics Overlay Selector */}
                                                                                                <div className="flex items-center gap-2 border-l border-border/60 pl-4">
                                                                                                                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                                                                                                                                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                                                                                                                                                Metrics:
                                                                                                                        </span>
                                                                                                                        <select
                                                                                                                                                value={
                                                                                                                                                                        metricsOverlay
                                                                                                                                                }
                                                                                                                                                onChange={(
                                                                                                                                                                        e
                                                                                                                                                ) =>
                                                                                                                                                                        setMetricsOverlay(
                                                                                                                                                                                                e
                                                                                                                                                                                                                        .target
                                                                                                                                                                                                                        .value as any
                                                                                                                                                                        )
                                                                                                                                                }
                                                                                                                                                className="px-2 py-1 border rounded-lg bg-background text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
                                                                                                                        >
                                                                                                                                                <option value="none">
                                                                                                                                                                        None
                                                                                                                                                                        (Standard)
                                                                                                                                                </option>
                                                                                                                                                <option value="complexity">
                                                                                                                                                                        Complexity
                                                                                                                                                                        (Cyclomatic)
                                                                                                                                                </option>
                                                                                                                                                <option value="coupling">
                                                                                                                                                                        Coupling
                                                                                                                                                                        (Connections)
                                                                                                                                                </option>
                                                                                                                                                <option value="tech_debt">
                                                                                                                                                                        Technical
                                                                                                                                                                        Debt
                                                                                                                                                                        (LOC)
                                                                                                                                                </option>
                                                                                                                                                <option value="coverage">
                                                                                                                                                                        <option value="reliability">
                                                                                                                                                                                                Reliability
                                                                                                                                                                                                Hotspot
                                                                                                                                                                                                (Heatmap)
                                                                                                                                                                        </option>
                                                                                                                                                                        Test
                                                                                                                                                                        Coverage
                                                                                                                                                                        (%)
                                                                                                                                                </option>
                                                                                                                        </select>
                                                                                                </div>

                                                                                                {/* Focus Mode */}
                                                                                                <div className="flex items-center gap-3">
                                                                                                                        <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground cursor-pointer select-none">
                                                                                                                                                <input
                                                                                                                                                                        type="checkbox"
                                                                                                                                                                        checked={
                                                                                                                                                                                                focusMode
                                                                                                                                                                        }
                                                                                                                                                                        disabled={
                                                                                                                                                                                                !selectedNodeId
                                                                                                                                                                        }
                                                                                                                                                                        onChange={(
                                                                                                                                                                                                e
                                                                                                                                                                        ) =>
                                                                                                                                                                                                setFocusMode(
                                                                                                                                                                                                                        e
                                                                                                                                                                                                                                                .target
                                                                                                                                                                                                                                                .checked
                                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                        className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-1 focus:ring-primary shadow-sm disabled:opacity-40"
                                                                                                                                                />
                                                                                                                                                <span
                                                                                                                                                                        className={
                                                                                                                                                                                                selectedNodeId
                                                                                                                                                                                                                        ? 'text-foreground'
                                                                                                                                                                                                                        : 'text-muted-foreground opacity-50'
                                                                                                                                                                        }
                                                                                                                                                >
                                                                                                                                                                        Focus
                                                                                                                                                                        Connected
                                                                                                                                                                        Components
                                                                                                                                                </span>
                                                                                                                        </label>
                                                                                                                        {!selectedNodeId && (
                                                                                                                                                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded italic">
                                                                                                                                                                        Select
                                                                                                                                                                        node
                                                                                                                                                                        to
                                                                                                                                                                        activate
                                                                                                                                                                        Focus
                                                                                                                                                                        Mode
                                                                                                                                                </span>
                                                                                                                        )}
                                                                                                </div>
                                                                        </div>

                                                                        {/* React Flow Viewport */}
                                                                        <div className="flex-1 w-full h-full relative bg-muted/5 select-none">
                                                                                                <ReactFlow
                                                                                                                        nodes={
                                                                                                                                                flowNodes
                                                                                                                        }
                                                                                                                        edges={
                                                                                                                                                flowEdges
                                                                                                                        }
                                                                                                                        nodeTypes={
                                                                                                                                                nodeTypes
                                                                                                                        }
                                                                                                                        onNodeClick={
                                                                                                                                                onNodeClick
                                                                                                                        }
                                                                                                                        onPaneClick={
                                                                                                                                                onPaneClick
                                                                                                                        }
                                                                                                                        fitView
                                                                                                                        minZoom={
                                                                                                                                                0.1
                                                                                                                        }
                                                                                                                        maxZoom={
                                                                                                                                                1.5
                                                                                                                        }
                                                                                                >
                                                                                                                        <Background
                                                                                                                                                color="var(--border)"
                                                                                                                                                gap={
                                                                                                                                                                        20
                                                                                                                                                }
                                                                                                                                                size={
                                                                                                                                                                        1
                                                                                                                                                }
                                                                                                                        />
                                                                                                                        <Controls className="!bg-background !border-border !shadow-md !rounded-lg text-foreground [&>button]:!border-border hover:[&>button]:!bg-accent" />
                                                                                                                        <MiniMap
                                                                                                                                                nodeStrokeColor={() =>
                                                                                                                                                                        'var(--border)'
                                                                                                                                                }
                                                                                                                                                nodeColor={(
                                                                                                                                                                        node
                                                                                                                                                ) => {
                                                                                                                                                                        const type =
                                                                                                                                                                                                node
                                                                                                                                                                                                                        .data
                                                                                                                                                                                                                        ?.type;
                                                                                                                                                                        if (
                                                                                                                                                                                                type ===
                                                                                                                                                                                                'Repository'
                                                                                                                                                                        )
                                                                                                                                                                                                return 'rgba(59, 130, 246, 0.2)';
                                                                                                                                                                        if (
                                                                                                                                                                                                type ===
                                                                                                                                                                                                'Domain'
                                                                                                                                                                        )
                                                                                                                                                                                                return 'rgba(139, 92, 246, 0.2)';
                                                                                                                                                                        if (
                                                                                                                                                                                                type ===
                                                                                                                                                                                                'API'
                                                                                                                                                                        )
                                                                                                                                                                                                return 'rgba(16, 185, 129, 0.2)';
                                                                                                                                                                        if (
                                                                                                                                                                                                type ===
                                                                                                                                                                                                'Service'
                                                                                                                                                                        )
                                                                                                                                                                                                return 'rgba(20, 184, 166, 0.2)';
                                                                                                                                                                        if (
                                                                                                                                                                                                type ===
                                                                                                                                                                                                'Module'
                                                                                                                                                                        )
                                                                                                                                                                                                return 'rgba(245, 158, 11, 0.2)';
                                                                                                                                                                        return 'rgba(200, 200, 200, 0.1)';
                                                                                                                                                }}
                                                                                                                                                maskColor="rgba(0, 0, 0, 0.1)"
                                                                                                                                                className="!border-border !bg-background !shadow-md !rounded-lg"
                                                                                                                        />
                                                                                                </ReactFlow>

                                                                                                {/* Dynamic Execution Path Viewer overlay */}
                                                                                                {selectedNodeId &&
                                                                                                                        executionPath.length >
                                                                                                                                                1 && (
                                                                                                                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90%] md:max-w-2xl bg-background/95 dark:bg-zinc-950/95 border border-primary/30 shadow-xl rounded-xl px-4 py-3 z-30 flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-200">
                                                                                                                                                                        <div className="flex items-center gap-2 border-b border-border/40 pb-1.5">
                                                                                                                                                                                                <span className="relative flex h-2 w-2">
                                                                                                                                                                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                                                                                                                                                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                                                                                                                                                                        Execution
                                                                                                                                                                                                                        Request
                                                                                                                                                                                                                        Flow
                                                                                                                                                                                                                        Path
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin select-none flex-nowrap pr-2">
                                                                                                                                                                                                {executionPath.map(
                                                                                                                                                                                                                        (
                                                                                                                                                                                                                                                node,
                                                                                                                                                                                                                                                index
                                                                                                                                                                                                                        ) => {
                                                                                                                                                                                                                                                const isLast =
                                                                                                                                                                                                                                                                        index ===
                                                                                                                                                                                                                                                                        executionPath.length -
                                                                                                                                                                                                                                                                                                1;
                                                                                                                                                                                                                                                return (
                                                                                                                                                                                                                                                                        <React.Fragment
                                                                                                                                                                                                                                                                                                key={
                                                                                                                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                                                                        onClick={() =>
                                                                                                                                                                                                                                                                                                                                                handleSelectNodeFromSearch(
                                                                                                                                                                                                                                                                                                                                                                        node.id
                                                                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all flex-shrink-0 ${
                                                                                                                                                                                                                                                                                                                                                selectedNodeId ===
                                                                                                                                                                                                                                                                                                                                                node.id
                                                                                                                                                                                                                                                                                                                                                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                                                                                                                                                                                                                                                                                                                                        : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                                                                                                                                                                                                                                                                                                                        }`}
                                                                                                                                                                                                                                                                                                >
                                                                                                                                                                                                                                                                                                                        <span className="truncate max-w-[120px]">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        node.name
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                                        <span className="text-[8px] font-mono text-muted-foreground uppercase bg-muted/65 px-1 py-0.25 rounded">
                                                                                                                                                                                                                                                                                                                                                {
                                                                                                                                                                                                                                                                                                                                                                        node.type
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                {!isLast && (
                                                                                                                                                                                                                                                                                                                        <ChevronRight className="h-4 w-4 text-muted-foreground/60 flex-shrink-0 animate-pulse" />
                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                        </React.Fragment>
                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                        }
                                                                                                                                                                                                )}
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        )}

                                                                                                {/* Metrics Overlay Legend */}
                                                                                                {metricsOverlay !==
                                                                                                                        'none' && (
                                                                                                                        <div className="absolute top-4 left-4 bg-background/95 dark:bg-zinc-950/95 border rounded-xl p-3 shadow-lg z-30 flex flex-col gap-1.5 animate-in fade-in duration-200">
                                                                                                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                'complexity' &&
                                                                                                                                                                                                'Overlay: Cyclomatic Complexity'}
                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                'coupling' &&
                                                                                                                                                                                                'Overlay: Coupling Density'}
                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                'tech_debt' &&
                                                                                                                                                                                                'Overlay: Technical Debt (LOC)'}
                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                'coverage' &&
                                                                                                                                                                                                'Overlay: Test Coverage'}
                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                'reliability' &&
                                                                                                                                                                                                'Overlay: Reliability Hotspot (Heatmap)'}
                                                                                                                                                </span>
                                                                                                                                                <div className="flex flex-col gap-1 text-[10px] font-medium text-foreground mt-1">
                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-background shadow" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                        'reliability'
                                                                                                                                                                                                                                                ? 'Low Risk'
                                                                                                                                                                                                                                                : 'Healthy'}
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-muted-foreground italic ml-auto pl-2">
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'complexity' &&
                                                                                                                                                                                                                                                '≤ 10 CC'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'coupling' &&
                                                                                                                                                                                                                                                '≤ 6 calls'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'tech_debt' &&
                                                                                                                                                                                                                                                '≤ 250 LOC'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'coverage' &&
                                                                                                                                                                                                                                                '≥ 80%'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'reliability' &&
                                                                                                                                                                                                                                                '< 40% Probability'}
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-background shadow" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                        'reliability'
                                                                                                                                                                                                                                                ? 'Moderate Risk'
                                                                                                                                                                                                                                                : 'Warning'}
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-muted-foreground italic ml-auto pl-2">
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'complexity' &&
                                                                                                                                                                                                                                                '11 - 20 CC'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'coupling' &&
                                                                                                                                                                                                                                                '7 - 12 calls'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'tech_debt' &&
                                                                                                                                                                                                                                                '251 - 800 LOC'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'coverage' &&
                                                                                                                                                                                                                                                '40% - 79%'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'reliability' &&
                                                                                                                                                                                                                                                '40% - 60% Probability'}
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                'reliability' && (
                                                                                                                                                                                                <div className="flex items-center gap-2">
                                                                                                                                                                                                                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-background shadow" />
                                                                                                                                                                                                                        <span>
                                                                                                                                                                                                                                                High
                                                                                                                                                                                                                                                Risk
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                                        <span className="text-muted-foreground italic ml-auto pl-2">
                                                                                                                                                                                                                                                60%
                                                                                                                                                                                                                                                -
                                                                                                                                                                                                                                                80%
                                                                                                                                                                                                                                                Probability
                                                                                                                                                                                                                        </span>
                                                                                                                                                                                                </div>
                                                                                                                                                                        )}
                                                                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                                                                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-background shadow" />
                                                                                                                                                                                                <span>
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                        'reliability'
                                                                                                                                                                                                                                                ? 'Critical Risk'
                                                                                                                                                                                                                                                : 'Critical'}
                                                                                                                                                                                                </span>
                                                                                                                                                                                                <span className="text-muted-foreground italic ml-auto pl-2">
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'complexity' &&
                                                                                                                                                                                                                                                '> 20 CC'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'coupling' &&
                                                                                                                                                                                                                                                '> 12 calls'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'tech_debt' &&
                                                                                                                                                                                                                                                '> 800 LOC'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'coverage' &&
                                                                                                                                                                                                                                                '< 40%'}
                                                                                                                                                                                                                        {metricsOverlay ===
                                                                                                                                                                                                                                                'reliability' &&
                                                                                                                                                                                                                                                '> 80% Probability'}
                                                                                                                                                                                                </span>
                                                                                                                                                                        </div>
                                                                                                                                                </div>
                                                                                                                        </div>
                                                                                                )}

                                                                                                {/* Path Legend floating badge */}
                                                                                                {selectedNodeId && (
                                                                                                                        <div className="absolute top-4 right-4 bg-background/90 dark:bg-zinc-950/90 border border-primary/30 text-primary font-medium text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                                                                                                                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                                                                                                                                <span>
                                                                                                                                                                        Showing
                                                                                                                                                                        active
                                                                                                                                                                        call
                                                                                                                                                                        &
                                                                                                                                                                        dependency
                                                                                                                                                                        paths
                                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                )}
                                                                        </div>
                                                </div>
                        );
}

export function ArchitectureVisualizer(props: ArchitectureVisualizerProps) {
                        return (
                                                <ReactFlowProvider>
                                                                        <ArchitectureVisualizerInner
                                                                                                {...props}
                                                                        />
                                                </ReactFlowProvider>
                        );
}
