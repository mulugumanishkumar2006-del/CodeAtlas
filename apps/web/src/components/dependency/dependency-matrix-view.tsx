'use client';

import React from 'react';
import { DependencyNodeData, DependencyEdgeData } from './dependency-mock-data';
import { Grid, Activity, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface DependencyMatrixViewProps {
  nodes: DependencyNodeData[];
  edges: DependencyEdgeData[];
  onSelectNode: (nodeId: string) => void;
}

export function DependencyMatrixView({ nodes, edges, onSelectNode }: DependencyMatrixViewProps) {
  // Build adjacency matrix map
  const matrixMap: Record<string, Record<string, boolean>> = {};

  nodes.forEach((n1) => {
    matrixMap[n1.id] = {};
    nodes.forEach((n2) => {
      matrixMap[n1.id][n2.id] = false;
    });
  });

  edges.forEach((e) => {
    if (matrixMap[e.source] && matrixMap[e.source][e.target] !== undefined) {
      matrixMap[e.source][e.target] = true;
    }
  });

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-auto font-mono text-xs select-none">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Dependency Adjacency Matrix & Coupling Heatmap</h2>
              <p className="text-xs font-sans text-slate-400">
                Inspect structural row-to-column dependencies. Highlighted cells represent active call/import connections.
              </p>
            </div>
          </div>
        </div>

        {/* Matrix Grid Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-[10px] text-slate-500 font-bold uppercase border-b border-r border-slate-800">
                  Target (Row) ↓ / Source (Col) ➔
                </th>
                {nodes.map((node) => (
                  <th
                    key={node.id}
                    className="p-2 text-[10px] text-cyan-300 font-bold uppercase border-b border-slate-800 text-center min-w-[100px] truncate"
                    title={node.name}
                  >
                    {node.name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((rowNode) => (
                <tr key={rowNode.id} className="hover:bg-slate-800/40 transition-colors">
                  <td
                    onClick={() => onSelectNode(rowNode.id)}
                    className="p-2 font-bold text-white border-r border-b border-slate-800 cursor-pointer hover:text-cyan-400 truncate max-w-[180px]"
                    title={rowNode.name}
                  >
                    {rowNode.name}
                  </td>
                  {nodes.map((colNode) => {
                    const isConnected = matrixMap[rowNode.id]?.[colNode.id];
                    const isSelf = rowNode.id === colNode.id;

                    return (
                      <td
                        key={colNode.id}
                        className={`p-2 border-b border-slate-800/60 text-center transition-all ${
                          isSelf
                            ? 'bg-slate-950/80 text-slate-700'
                            : isConnected
                            ? 'bg-cyan-500/25 border border-cyan-500/50 text-cyan-300 font-black shadow-inner'
                            : 'text-slate-800'
                        }`}
                      >
                        {isSelf ? '—' : isConnected ? '●' : '·'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
