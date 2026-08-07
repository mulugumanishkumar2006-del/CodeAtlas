'use client';

import React from 'react';
import { ChaosWorkspaceContainer } from '@/components/chaos/chaos-workspace-container';

export default function ChaosPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <ChaosWorkspaceContainer />
    </div>
  );
}
