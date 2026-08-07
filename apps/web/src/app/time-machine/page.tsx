'use client';

import React from 'react';
import { TimeMachineWorkspaceContainer } from '@/components/time-machine/time-machine-workspace-container';

export default function TimeMachinePage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <TimeMachineWorkspaceContainer />
    </div>
  );
}
