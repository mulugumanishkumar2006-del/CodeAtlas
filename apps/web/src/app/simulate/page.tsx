'use client';

import React from 'react';
import { TwinWorkspaceContainer } from '@/components/simulation/twin-workspace-container';

export default function SimulatePage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <TwinWorkspaceContainer />
    </div>
  );
}
