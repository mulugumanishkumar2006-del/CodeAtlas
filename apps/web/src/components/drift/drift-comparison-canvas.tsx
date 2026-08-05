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

import { DriftNodeComponent } from './drift-custom-nodes';
import { AnimatedDriftEdge } from './drift-custom-edges';
import { DriftNodeData, DriftEdgeData } from './drift-mock-data';
import {
  Maximize2,
  FlaskConical,
  Zap,
  Flame,
  FileText
} from 'lucide-react';

const nodeTypes = {
  driftNode: DriftNodeComponent,
};

const edgeTypes = {
  animatedDriftEdge: AnimatedDriftEdge,
};

interface DriftComparisonCanvasProps {
  nodesData: DriftNodeData[];
  edgesData: DriftEdgeData[];
  selectedNodeId: string | null;
  onSelectNode: (node: DriftNodeData | null) => void;
  searchQuery: string;
  onSimulateFix: (nodeId: string) => void;
  onGenerateAdr: (nodeId: string) => void;
}

function DriftComparisonCanvasInner({
  nodesData,
  edgesData,
  selectedNodeId,
  onSelectNode,
  searchQuery,
  onSimulateFix,
  onGenerateAdr,
}: DriftComparisonCanvasProps) {
  const { fitView } = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: DriftNodeData | null;
  } | null>(null);

  // Compute Layout Positions
  const { initialNodes, initialEdges } = useMemo(() => {
    let filtered = nodesData;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((n) =>
        n.name.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q) ||
        n.layer.toLowerCase().includes(q)
      );
    }

    const filteredIds = new Set(filtered.map((n) => n.id));

    const layerOrder = ['Frontend', 'API Gateway', 'Domain Service', 'Data Store', 'Infrastructure'];
    const nodes: Node[] = filtered.map((node) => {
      const colIndex = Math.max(0, layerOrder.indexOf(node.layer));
      const rowIndex = filtered.filter((n) => n.layer === node.layer).findIndex((n) => n.id === node.id);
      const x = colIndex * 380 + 100;
      const y = rowIndex * 240 + 100;

      const isSelected = selectedNodeId === node.id;

      return {
        id: node.id,
        type: 'driftNode',
        position: { x, y },
        data: {
          node,
          isHighlighted: isSelected,
        },
      };
    });

    const edges: Edge[] = edgesData
      .filter((edge) => filteredIds.has(edge.source) && filteredIds.has(edge.target))
      .map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'animatedDriftEdge',
        selected: selectedNodeId === edge.source || selectedNodeId === edge.target,
        data: {
          changeStatus: edge.changeStatus,
          isViolation: edge.isViolation,
          type: edge.type,
        },
      }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [nodesData, edgesData, selectedNodeId, searchQuery]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = nodesData.find((n) => n.id === node.id) || null;
      onSelectNode(found);
    },
    [nodesData, onSelectNode]
  );

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
            const data = node.data?.node as DriftNodeData | undefined;
            if (data?.changeStatus === 'Drifted') return '#f59e0b';
            if (data?.changeStatus === 'Added') return '#10b981';
            if (data?.changeStatus === 'Removed') return '#f43f5e';
            return '#38bdf8';
          }}
          maskColor="rgba(2, 6, 23, 0.85)"
          className="!bg-slate-950 !border-slate-800 rounded-2xl shadow-2xl !bottom-4 !right-4"
        />

        <Panel position="top-right" className="flex items-center gap-2">
          <button
            onClick={() => fitView({ duration: 400 })}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md shadow-xl"
            title="Fit View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </Panel>
      </ReactFlow>

      {/* Context Menu */}
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
              if (contextMenu.node) onSimulateFix(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-purple-300 font-bold flex items-center gap-2"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" /> Simulate Remediation
          </button>
          <button
            onClick={() => {
              if (contextMenu.node) onGenerateAdr(contextMenu.node.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-cyan-300 font-bold flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Generate ADR Spec
          </button>
        </div>
      )}
    </div>
  );
}

export function DriftComparisonCanvas(props: DriftComparisonCanvasProps) {
  return (
    <ReactFlowProvider>
      <DriftComparisonCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
