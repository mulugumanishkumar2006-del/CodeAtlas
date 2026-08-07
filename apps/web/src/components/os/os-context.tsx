'use client';

import React, { createContext, useContext, useState } from 'react';

export interface GlobalCodeAtlasState {
  currentRepo: string;
  currentBranch: string;
  currentInvestigationId: string | null;
  activeSwarmAgent: string;
  swarmTask: string;
  swarmProgressPct: number;
  swarmConfidencePct: number;
  architectureHealthPct: number;
  securityReadinessPct: number;
  performanceP95Ms: number;
  techDebtHours: number;
  releaseReadinessScore: number;
  forecastHealthScore: number;
  activeWorkflowName: string | null;
}

interface CodeAtlasOSContextType {
  state: GlobalCodeAtlasState;
  setRepo: (repo: string) => void;
  setBranch: (branch: string) => void;
  setInvestigation: (id: string | null) => void;
  setSwarmState: (agent: string, task: string, progress: number, confidence: number) => void;
}

const defaultState: GlobalCodeAtlasState = {
  currentRepo: 'CodeAtlas / Monorepo',
  currentBranch: 'release/v4.8.0',
  currentInvestigationId: 'inv-9821',
  activeSwarmAgent: 'Security Agent',
  swarmTask: 'OWASP SAST Audit & SQL Injection Patching',
  swarmProgressPct: 92,
  swarmConfidencePct: 98.4,
  architectureHealthPct: 94,
  securityReadinessPct: 100,
  performanceP95Ms: 24.2,
  techDebtHours: 34,
  releaseReadinessScore: 96,
  forecastHealthScore: 92,
  activeWorkflowName: 'Investigate Production Incident (SEV-1)',
};

const CodeAtlasOSContext = createContext<CodeAtlasOSContextType>({
  state: defaultState,
  setRepo: () => {},
  setBranch: () => {},
  setInvestigation: () => {},
  setSwarmState: () => {},
});

export const CodeAtlasOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalCodeAtlasState>(defaultState);

  const setRepo = (repo: string) => setState((prev) => ({ ...prev, currentRepo: repo }));
  const setBranch = (branch: string) => setState((prev) => ({ ...prev, currentBranch: branch }));
  const setInvestigation = (id: string | null) => setState((prev) => ({ ...prev, currentInvestigationId: id }));
  const setSwarmState = (agent: string, task: string, progress: number, confidence: number) =>
    setState((prev) => ({
      ...prev,
      activeSwarmAgent: agent,
      swarmTask: task,
      swarmProgressPct: progress,
      swarmConfidencePct: confidence,
    }));

  return (
    <CodeAtlasOSContext.Provider value={{ state, setRepo, setBranch, setInvestigation, setSwarmState }}>
      {children}
    </CodeAtlasOSContext.Provider>
  );
};

export const useCodeAtlasOS = () => useContext(CodeAtlasOSContext);
