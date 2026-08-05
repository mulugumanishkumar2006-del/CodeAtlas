'use client';

import React from 'react';
import { getBezierPath, EdgeProps, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';

export function AnimatedAdrEdge({
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

  const relation = String(data?.relation || 'Governs');
  const isViolation = Boolean(data?.isViolation);

  let strokeColor = '#38bdf8'; // Cyan
  if (isViolation) strokeColor = '#f43f5e'; // Red

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={selected ? 5 : 3}
        strokeOpacity={selected ? 0.6 : 0.25}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 3 : 2,
        }}
      />

      <circle r={3.5} fill={strokeColor} className="animate-pulse">
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
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-lg border backdrop-blur-md transition-all ${
              selected
                ? 'bg-slate-900 text-cyan-300 border-cyan-400 scale-105'
                : 'bg-slate-950/90 text-slate-300 border-slate-800'
            }`}
          >
            {relation} {isViolation ? '⚠️ VIOLATED' : ''}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
