'use client';

import React from 'react';
import { ReleaseCommandCenter } from '@/components/release/release-command-center';

export default function ReleasePage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <ReleaseCommandCenter />
    </div>
  );
}
