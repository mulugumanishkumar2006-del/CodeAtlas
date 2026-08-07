'use client';

import React, { useState } from 'react';
import { ForecastReport } from './forecast-types';
import { FileText, Download, Sparkles, CheckCircle2, Calendar, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastReportsStudioProps {
  reports: ForecastReport[];
}

export function ForecastReportsStudio({ reports }: ForecastReportsStudioProps) {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleExport = () => {
    if (!activeReport) return;
    const text = `# ${activeReport.title}\nPeriod: ${activeReport.period}\n\n## Executive Summary\n${activeReport.executiveSummary}\n\n## Risk Highlights\n${activeReport.keyRiskHighlights.map((r) => `- ${r}`).join('\n')}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-report-${activeReport.reportType}.md`;
    a.click();
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 font-sans shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">
            Automated AI Forecast Reports & Executive Outlook Studio
          </h3>
        </div>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Markdown Report</span>
        </button>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {reports.map((rep) => (
          <button
            key={rep.id}
            onClick={() => setSelectedReportId(rep.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl border transition-all text-xs',
              selectedReportId === rep.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            )}
          >
            {rep.title}
          </button>
        ))}
      </div>

      {/* Active Report Document Card */}
      {activeReport && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono border-b border-slate-900 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-100">{activeReport.title}</h4>
              <span className="text-[10px] text-slate-400">Period: {activeReport.period} • Generated: {activeReport.createdAt}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold uppercase">
              {activeReport.reportType.replace('_', ' ')}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Executive Summary:
            </span>
            <p className="text-slate-200 leading-relaxed font-sans text-xs">{activeReport.executiveSummary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                Key Risk Highlights:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {activeReport.keyRiskHighlights.map((r, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Strategic Action Items:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {activeReport.strategicActionItems.map((st, sIdx) => (
                  <li key={sIdx} className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{st.task}</span>
                    <span className="text-slate-400 text-[10px]">[{st.owner}]</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
