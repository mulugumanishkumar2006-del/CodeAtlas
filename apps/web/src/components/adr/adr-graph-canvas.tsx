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

import { AdrNodeComponent } from './adr-custom-nodes';
import { AnimatedAdrEdge } from './adr-custom-edges';
import { AdrRecord } from './adr-mock-data';
import { Maximize2, FlaskConical, ThumbsUp } from 'lucide-react';

const nodeTypes = {
  adrNode: AdrNodeComponent,
};

const edgeTypes = {
  animatedAdrEdge: AnimatedAdrEdge,
};

interface AdrGraphCanvasProps {
  adrs: AdrRecord[];
  selectedAdrId: string | null;
  onSelectAdr: (adr: AdrRecord | null) => void;
  searchQuery: string;
  onSimulate: (adrId: string) => void;
  onApprove: (adrId: string) => void;
}

function AdrGraphCanvasInner({
  adrs,
  selectedAdrId,
  onSelectAdr,
  searchQuery,
  onSimulate,
  onApprove,
}: AdrGraphCanvasProps) {
  const { fitView } = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    adr: AdrRecord | null;
  } | null>(null);

  const { initialNodes, initialEdges } = useMemo(() => {
    let filtered = adrs;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.decisionId.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }

    const nodes: Node[] = filtered.map((adr, index) => {
      const x = (index % 2) * 380 + 100;
      const y = Math.floor(index / 2) * 240 + 100;

      const isSelected = selectedAdrId === adr.id;

      return {
        id: adr.id,
        type: 'adrNode',
        position: { x, y },
        data: {
          adr,
          isHighlighted: isSelected,
        },
      };
    });

    const edges: Edge[] = [];
    for (let i = 0; i < filtered.length - 1; i++) {
      edges.push({
        id: `adr-edge-${filtered[i].id}-${filtered[i + 1].id}`,
        source: filtered[i].id,
        target: filtered[i + 1].id,
        type: 'animatedAdrEdge',
        selected: selectedAdrId === filtered[i].id || selectedAdrId === filtered[i + 1].id,
        data: {
          relation: 'Precedes',
          isViolation: filtered[i + 1].status === 'Violated',
        },
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [adrs, selectedAdrId, searchQuery]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = adrs.find((a) => a.id === node.id) || null;
      onSelectAdr(found);
    },
    [adrs, onSelectAdr]
  );

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      const found = adrs.find((a) => a.id === node.id) || null;
      setContextMenu({
        mouseX: event.clientX,
        mouseY: event.clientY,
        adr: found,
      });
    },
    [adrs]
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
            const data = node.data?.adr as AdrRecord | undefined;
            if (data?.status === 'Violated') return '#f43f5e';
            if (data?.status === 'Approved') return '#10b981';
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
            {contextMenu.adr?.decisionId}: {contextMenu.adr?.title}
          </div>
          <button
            onClick={() => {
              if (contextMenu.adr) onSimulate(contextMenu.adr.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-purple-300 font-bold flex items-center gap-2"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" /> Simulate Spec
          </button>
          <button
            onClick={() => {
              if (contextMenu.adr) onApprove(contextMenu.adr.id);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-900 text-emerald-300 font-bold flex items-center gap-2"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Approve Decision
          </button>
        </div>
      )}
    </div>
  );
}

export function AdrGraphCanvas(props: AdrGraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <AdrGraphCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
