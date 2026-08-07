'use client';

import React from 'react';
import { EvoWorkspaceContainer } from '@/components/evolution-simulator/evo-workspace-container';

export default function EvolutionSimulatorPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <EvoWorkspaceContainer />
    </div>
  );
}
