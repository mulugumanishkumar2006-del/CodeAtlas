'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CodeAtlas ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full p-8 flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-mono select-none">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-white tracking-tight">
                {this.props.fallbackTitle || 'Component Execution Error'}
              </h2>
              <p className="text-xs font-sans text-slate-400">
                CodeAtlas captured a rendering exception in this module. The rest of the application remains isolated and operational.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-rose-300 font-mono text-left overflow-x-auto truncate">
                {this.state.error.message || 'Unknown runtime exception'}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                onClick={this.handleReset}
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Retry Component
              </Button>
              <Button
                onClick={() => window.history.back()}
                size="sm"
                variant="outline"
                className="bg-slate-950 border-slate-800 text-slate-300 hover:text-white font-mono text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
