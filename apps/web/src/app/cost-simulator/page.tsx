'use client';

import React from 'react';
import { FinOpsWorkspaceContainer } from '@/components/finops/finops-workspace-container';

export default function CostSimulatorPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <FinOpsWorkspaceContainer />
    </div>
  );
}
