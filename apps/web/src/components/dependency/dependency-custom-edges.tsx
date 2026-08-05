'use client';

import React from 'react';
import { getBezierPath, EdgeProps, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';
import { DependencyEdgeData } from './dependency-mock-data';

export function AnimatedDependencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edge = (data?.edge || {}) as Partial<DependencyEdgeData>;
  const type = edge.type || 'Depends On';
  const status = edge.status || 'Active';

  let strokeColor = '#38bdf8'; // Cyan
  let strokeDash = 'none';

  if (status === 'Violating') {
    strokeColor = '#f43f5e';
    strokeDash = '6 6';
  } else if (status === 'Degraded') {
    strokeColor = '#f59e0b';
    strokeDash = '4 4';
  } else if (type === 'Reads' || type === 'Writes') {
    strokeColor = '#eab308';
  } else if (type === 'Publishes' || type === 'Subscribes') {
    strokeColor = '#c084fc';
  }

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={selected ? 5 : 3}
        strokeOpacity={selected ? 0.6 : 0.2}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: strokeDash,
        }}
      />

      <circle r={3} fill={strokeColor} className="animate-pulse">
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
      </circle>

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-lg border backdrop-blur-md transition-all cursor-pointer ${
              selected
                ? 'bg-slate-900 text-cyan-300 border-cyan-400 scale-105 shadow-cyan-950/50'
                : 'bg-slate-950/90 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {type}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
