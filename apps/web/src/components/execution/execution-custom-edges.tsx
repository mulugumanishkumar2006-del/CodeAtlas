'use client';

import React from 'react';
import { getBezierPath, EdgeProps, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';

export function AnimatedExecutionEdge({
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

  const stepOrder = String(data?.stepOrder || '');

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={selected ? 5 : 3}
        strokeOpacity={selected ? 0.6 : 0.25}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: '#38bdf8',
          strokeWidth: selected ? 3 : 2,
        }}
      />

      {/* Wavefront Particle */}
      <circle r={4} fill="#38bdf8" className="animate-pulse">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>

      {/* Step Sequence Badge Label */}
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
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black shadow-lg border backdrop-blur-md transition-all ${
              selected
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 scale-110 shadow-cyan-500/50'
                : 'bg-slate-950 text-cyan-300 border-slate-800'
            }`}
          >
            STEP {stepOrder} ➔
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
