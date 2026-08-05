'use client';

import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ArchNodeComponent } from './custom-nodes';
import { AnimatedArchEdge } from './custom-edges';
import { ArchNodeData, ArchRelationship } from './architecture-mock-data';
import {
  Focus,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldAlert,
  FlaskConical,
  Zap,
  FileText,
  Copy,
  Bookmark
} from 'lucide-react';

const nodeTypes = {
  archNode: ArchNodeComponent,
};

const edgeTypes = {
  animatedArchEdge: AnimatedArchEdge,
};

interface ArchitectureCanvasProps {
  nodesData: ArchNodeData[];
  relationshipsData: ArchRelationship[];
  selectedNodeId: string | null;
  onSelectNode: (node: ArchNodeData | null) => void;
  selectedRelationshipId: string | null;
  onSelectRelationship: (rel: ArchRelationship | null) => void;
  currentMode: string;
  focusMode: boolean;
  onToggleFocusMode: () => void;
  layoutEngine: 'hierarchical' | 'layered' | 'circular' | 'force-directed';
  searchQuery: string;
  layerFilter: string;
  riskFilter: string;
  onInvestigate: (nodeId: string) => void;
  onSimulate: (nodeId: string) => void;
  onGenerateDocs: (nodeId: string) => void;
  expandedNodeIds: Set<string>;
  onToggleNodeExpand: (nodeId: string) => void;
}

function ArchitectureCanvasInner({
  nodesData,
  relationshipsData,
  selectedNodeId,
  onSelectNode,
  selectedRelationshipId,
  onSelectRelationship,
  currentMode,
  focusMode,
  layoutEngine,
  searchQuery,
  layerFilter,
  riskFilter,
  onInvestigate,
  onSimulate,
  onGenerateDocs,
  expandedNodeIds,
  onToggleNodeExpand,
}: ArchitectureCanvasProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: ArchNodeData | null;
  } | null>(null);

  // Compute Layout Positions
  const { initialNodes, initialEdges } = useMemo(() => {
    // Filter nodes based on mode, search, layer, and risk
    let filtered = nodesData.filter((n) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = n.name.toLowerCase().includes(q);
        const matchesTech = n.technology.toLowerCase().includes(q);
        const matchesType = n.type.toLowerCase().includes(q);
        const matchesOwner = n.owner.toLowerCase().includes(q);
        if (!matchesName && !matchesTech && !matchesType && !matchesOwner) return false;
      }

      if (layerFilter !== 'All' && n.layer !== layerFilter) return false;
      if (riskFilter !== 'All' && n.riskScore !== riskFilter) return false;

      // Mode Filtering logic
      if (currentMode === 'Service View') {
        return n.type === 'Microservice' || n.type === 'REST API' || n.type === 'GraphQL API' || n.type === 'Infrastructure';
      }
      if (currentMode === 'Database View') {
        return n.type === 'Database' || n.type === 'Cache' || n.type === 'Queue' || n.layer === 'Data Store';
      }
      if (currentMode === 'API View') {
        return n.type === 'REST API' || n.type === 'GraphQL API' || n.type === 'Application';
      }
      if (currentMode === 'Security View') {
        return n.domain.includes('Security') || n.type === 'Infrastructure' || n.id === 'svc-auth';
      }

      return true;
    });

    // Focus mode filter (isolate selected node & 1-degree connections)
    if (focusMode && selectedNodeId) {
      const connectedNodeIds = new Set<string>([selectedNodeId]);
      relationshipsData.forEach((rel) => {
        if (rel.source === selectedNodeId) connectedNodeIds.add(rel.target);
        if (rel.target === selectedNodeId) connectedNodeIds.add(rel.source);
      });
      filtered = filtered.filter((n) => connectedNodeIds.has(n.id));
    }

    const filteredIds = new Set(filtered.map((n) => n.id));

    // Layout computation algorithms
    const nodes: Node[] = filtered.map((node, index) => {
      let x = 100;
      let y = 100;

      if (layoutEngine === 'layered') {
        // Layered columns by architectural layer
        const layerOrder = ['Frontend', 'API Gateway', 'Microservice', 'Data Store', 'Messaging', 'Infrastructure'];
        const colIndex = Math.max(0, layerOrder.indexOf(node.layer));
        const rowIndex = filtered.filter((n) => n.layer === node.layer).findIndex((n) => n.id === node.id);
        x = colIndex * 360 + 80;
        y = rowIndex * 220 + 80;
      } else if (layoutEngine === 'circular') {
        const radius = 450;
        const angle = (index / Math.max(1, filtered.length)) * 2 * Math.PI;
        x = 600 + radius * Math.cos(angle);
        y = 400 + radius * Math.sin(angle);
      } else if (layoutEngine === 'force-directed') {
        const cols = Math.ceil(Math.sqrt(filtered.length));
        x = (index % cols) * 350 + 100 + (Math.random() * 40 - 20);
        y = Math.floor(index / cols) * 250 + 100 + (Math.random() * 40 - 20);
      } else {
        // Hierarchical default
        const layerOrder = ['Frontend', 'API Gateway', 'Microservice', 'Data Store', 'Messaging', 'Infrastructure'];
        const colIndex = Math.max(0, layerOrder.indexOf(node.layer));
        const rowIndex = filtered.filter((n) => n.layer === node.layer).findIndex((n) => n.id === node.id);
        x = colIndex * 380 + 100;
        y = rowIndex * 240 + 100;
      }

      const isSelected = selectedNodeId === node.id;
      const isExpanded = expandedNodeIds.has(node.id);

      return {
        id: node.id,
        type: 'archNode',
        position: { x, y },
        data: {
          node,
          isExpanded,
          onToggleExpand: onToggleNodeExpand,
          isHighlighted: isSelected,
        },
      };
    });

    const edges: Edge[] = relationshipsData
      .filter((rel) => filteredIds.has(rel.source) && filteredIds.has(rel.target))
      .map((rel) => ({
        id: rel.id,
        source: rel.source,
        target: rel.target,
        type: 'animatedArchEdge',
        selected: selectedRelationshipId === rel.id,
        data: { relationship: rel },
      }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [
    nodesData,
    relationshipsData,
    selectedNodeId,
    selectedRelationshipId,
    currentMode,
    focusMode,
    layoutEngine,
    searchQuery,
    layerFilter,
    riskFilter,
    expandedNodeIds,
    onToggleNodeExpand,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Node click handler
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = nodesData.find((n) => n.id === node.id) || null;
      onSelectNode(found);
      onSelectRelationship(null);
    },
    [nodesData, onSelectNode, onSelectRelationship]
  );

  // Edge click handler
  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const found = relationshipsData.find((r) => r.id === edge.id) || null;
      onSelectRelationship(found);
      onSelectNode(null);
    },
    [relationshipsData, onSelectRelationship, onSelectNode]
  );

  // Right-click context menu
  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      const found = nodesData.find((n) => n.id === node.id) || null;
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        node: found,
      });
    },
    [nodesData]
  );

  // Canvas click closes context menu
  const handlePaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden font-sans">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handlePaneClick}
        minZoom={0.2}
        maxZoom={2.5}
        defaultViewport={{ x: 50, y: 50, zoom: 0.85 }}
        fitView
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 rounded-2xl shadow-xl" />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data?.node as ArchNodeData | undefined;
            if (data?.status === 'Critical') return '#f43f5e';
            if (data?.status === 'Warning') return '#f59e0b';
            return '#38bdf8';
          }}
          maskColor="rgba(2, 6, 23, 0.85)"
          className="!bg-slate-950 !border-slate-800 rounded-2xl shadow-2xl !bottom-4 !right-4"
        />

        {/* Floating Quick Action Overlay Panel */}
        <Panel position="top-right" className="flex items-center gap-2">
          <button
            onClick={() => fitView({ duration: 400 })}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md shadow-xl"
            title="Fit Canvas to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </Panel>
      </ReactFlow>

      {/* Right Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
          className="fixed z-50 w-56 bg-slate-950/95 border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl font-mono text-xs space-y-1 animate-in fade-in duration-100"
        >
          <div className="px-3 py-1 text-[10px] font-bold text-cyan-400 border-b border-slate-800/80 truncate">
            {contextMenu.node?.name}
          </div>
          <button
            onClick={() => {
              onSelectNode(contextMenu.node);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <Focus className="w-3.5 h-3.5 text-cyan-400" /> Focus Node Details
          </button>
          <button
            onClick={() => {
              if (contextMenu.node) onInvestigate(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" /> Investigate Symbol
          </button>
          <button
            onClick={() => {
              if (contextMenu.node) onSimulate(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Simulate Failure
          </button>
          <button
            onClick={() => {
              if (contextMenu.node) onGenerateDocs(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-200 flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Generate Docs
          </button>
        </div>
      )}
    </div>
  );
}

export function ArchitectureCanvas(props: ArchitectureCanvasProps) {
  return (
    <ReactFlowProvider>
      <ArchitectureCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
