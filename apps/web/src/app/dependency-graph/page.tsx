'use client';

import React from 'react';
import { DependencyIntelligenceStudio } from '@/components/dependency/dependency-intelligence-studio';

export default function DependencyGraphPage() {
  return (
    <div className="-m-6 h-[calc(100vh-4rem)] overflow-hidden">
      <DependencyIntelligenceStudio />
    </div>
  );
}
