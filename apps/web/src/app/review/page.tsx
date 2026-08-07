'use client';

import React from 'react';
import { CodeReviewWorkspace } from '@/components/review/code-review-workspace';

export default function CodeReviewPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <CodeReviewWorkspace />
    </div>
  );
}
