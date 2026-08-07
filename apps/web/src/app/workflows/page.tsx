'use client';

import React from 'react';
import { WorkflowWorkspaceContainer } from '@/components/autonomous/workflow-workspace-container';

export default function WorkflowsPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <WorkflowWorkspaceContainer />
    </div>
  );
}
