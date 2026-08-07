'use client';

import React from 'react';
import { HubWorkspaceContainer } from '@/components/knowledge/hub-workspace-container';

export default function HubPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <HubWorkspaceContainer />
    </div>
  );
}
