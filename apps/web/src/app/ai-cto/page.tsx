'use client';

import React, { useState } from 'react';
import { AiCtoExecutiveHeader, ExecutiveViewMode } from '@/components/ui/ai-cto-executive-header';
import { AiCtoHomeDashboard } from '@/components/ui/ai-cto-home-dashboard';
import { AiCtoProactiveInsights } from '@/components/ui/ai-cto-proactive-insights';
import { AiCtoEngineeringAdvisor } from '@/components/ui/ai-cto-engineering-advisor';
import { AiCtoRoadmap } from '@/components/ui/ai-cto-roadmap';
import { AiCtoDecisionSupport } from '@/components/ui/ai-cto-decision-support';
import { AiCtoMemoryContext } from '@/components/ui/ai-cto-memory-context';

export default function AiCtoPage() {
  const [currentViewMode, setCurrentViewMode] = useState<ExecutiveViewMode>('CTO');
  const [selectedRepo, setSelectedRepo] = useState<string>('codeatlas/payments-service');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 font-sans select-none">
      {/* 1. EXECUTIVE HEADER & VIEW MODE SWITCHER */}
      <AiCtoExecutiveHeader
        currentMode={currentViewMode}
        onModeChange={setCurrentViewMode}
        activeRepo={selectedRepo}
        systemHealth={94.2}
      />

      {/* 2. AI CTO HOME TELEMETRY DASHBOARD */}
      <AiCtoHomeDashboard currentMode={currentViewMode} />

      {/* 3. PROACTIVE AI RECOMMENDATIONS & GUIDANCE */}
      <AiCtoProactiveInsights />

      {/* 4. INTERACTIVE ENGINEERING ADVISOR */}
      <AiCtoEngineeringAdvisor />

      {/* 5. AI STRATEGIC ENGINEERING ROADMAP */}
      <AiCtoRoadmap />

      {/* 6. STRATEGIC ARCHITECTURAL DECISION SUPPORT */}
      <AiCtoDecisionSupport />

      {/* 7. AI LONG-TERM MEMORY & CONTEXT HISTORY */}
      <AiCtoMemoryContext />
    </div>
  );
}
