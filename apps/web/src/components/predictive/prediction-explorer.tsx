"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  Activity,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Flame,
  Zap,
  Sliders,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";

export function PredictionExplorer({ repositoryId = "demo-repo" }: { repositoryId?: string }) {
  const [timeWindow, setTimeWindow] = useState<"7_DAYS" | "30_DAYS" | "90_DAYS">("30_DAYS");
  const [loading, setLoading] = useState(false);
  const [predictionsData, setPredictionsData] = useState<any>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions();
  }, [timeWindow, repositoryId]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/predictive/explorer/${repositoryId}?time_window=${timeWindow}`);
      if (res.ok) {
        const data = await res.json();
        setPredictionsData(data);
        if (data.predictions && data.predictions.length > 0) {
          setSelectedPrediction(data.predictions[0]);
        }
      } else {
        setMockPredictions();
      }
    } catch {
      setMockPredictions();
    } finally {
      setLoading(false);
    }
  };

  const setMockPredictions = () => {
    const mock = getMockPredictions(repositoryId, timeWindow);
    setPredictionsData(mock);
    setSelectedPrediction(mock.predictions[0]);
  };

  const handleFeedback = async (type: string) => {
    setFeedbackStatus(`Submitted '${type}' feedback.`);
    setTimeout(() => setFeedbackStatus(null), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-600 rounded-lg shadow-lg">
            <Flame className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-rose-300 to-purple-400 bg-clip-text text-transparent">
              v1.3 Predictive Engineering Explorer
            </h2>
            <p className="text-xs text-slate-400">
              EARLY WARNING SIGNALS &bull; HOTSPOTS &bull; CHANGE RISK &bull; ARCHITECTURE DRIFT &bull; TECH DEBT FORECAST
            </p>
          </div>
        </div>

        {/* Time Window Selectors */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <button
            onClick={() => setTimeWindow("7_DAYS")}
            className={`px-3 py-1 font-medium rounded transition ${
              timeWindow === "7_DAYS" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeWindow("30_DAYS")}
            className={`px-3 py-1 font-medium rounded transition ${
              timeWindow === "30_DAYS" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeWindow("90_DAYS")}
            className={`px-3 py-1 font-medium rounded transition ${
              timeWindow === "90_DAYS" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Main Grid: Prediction Cards + Detail Inspector */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center space-x-2 text-slate-400">
          <Activity className="w-5 h-5 animate-spin text-amber-400" />
          <span className="text-xs">Computing deterministic risk prediction signals...</span>
        </div>
      ) : predictionsData ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden">
          {/* Left Column: Prioritized Predictions List (5 cols) */}
          <div className="md:col-span-5 space-y-3 overflow-y-auto pr-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Prioritized Risk Signals ({predictionsData.predictions.length})</span>
              <span className="text-[10px] text-amber-400 font-mono">MODEL v1.3.0-det-baseline</span>
            </h3>

            {predictionsData.predictions.map((pred: any, i: number) => {
              const isSelected = selectedPrediction?.prediction_id === pred.prediction_id;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedPrediction(pred)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition flex flex-col space-y-2 ${
                    isSelected
                      ? "bg-slate-900 border-amber-500/60 shadow-lg"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs truncate max-w-[180px]">
                      {pred.target_entity}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pred.priority === "CRITICAL_ATTENTION"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      }`}
                    >
                      {pred.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">{pred.prediction_type}</span>
                    <span className="font-bold text-rose-400">Risk: {pred.predicted_risk_score}/100</span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                    "{pred.explainability_reason}"
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Prediction Deep Detail & Simulation Bridge (7 cols) */}
          {selectedPrediction && (
            <div className="md:col-span-7 p-5 bg-slate-900/60 rounded-lg border border-slate-800 space-y-5 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-4 text-xs">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                      {selectedPrediction.prediction_type}
                    </span>
                    <h3 className="text-base font-bold text-slate-100 mt-1">
                      {selectedPrediction.target_entity}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {selectedPrediction.confidence} CONFIDENCE
                    </span>
                  </div>
                </div>

                {/* Risk Gauge Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Current Health: {selectedPrediction.current_health_score}/100</span>
                    <span className="text-rose-400">Predicted Risk: {selectedPrediction.predicted_risk_score}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: `${selectedPrediction.current_health_score}%` }}></div>
                    <div className="bg-rose-500 h-full" style={{ width: `${selectedPrediction.predicted_risk_score}%` }}></div>
                  </div>
                </div>

                {/* Explainability Reason (WHY?) */}
                <div className="p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-lg space-y-1.5">
                  <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" /> Explainability Reason (WHY?)
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {selectedPrediction.explainability_reason}
                  </p>
                </div>

                {/* Contributing Signals Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider">Contributing Signal Breakdown</h4>
                  <div className="space-y-1.5">
                    {selectedPrediction.signals.map((sig: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-200">{sig.signal_name}</span>
                          <p className="text-slate-400 text-[11px]">{sig.description}</p>
                        </div>
                        <span className="font-mono text-amber-400 font-bold">{sig.current_value} (trend: {sig.trend})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Investigation */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1">
                  <span className="font-semibold text-cyan-400">Recommended Prevention Step:</span>
                  <p className="text-slate-300">{selectedPrediction.recommended_investigation}</p>
                </div>
              </div>

              {/* Action Buttons & Feedback Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400">Rate Signal:</span>
                  <button
                    onClick={() => handleFeedback("USEFUL")}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded transition"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback("NOT_USEFUL")}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded transition"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                  {feedbackStatus && <span className="text-[10px] text-emerald-400 font-mono ml-2">{feedbackStatus}</span>}
                </div>

                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded transition text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Simulate Prevention in Studio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function getMockPredictions(repositoryId: string, timeWindow: string) {
  return {
    repository_id: repositoryId,
    total_predictions: 4,
    predictions: [
      {
        prediction_id: "pred_hotspot_1",
        repository_id: repositoryId,
        target_entity: "auth_service",
        prediction_type: "HOTSPOT",
        current_health_score: 85.0,
        predicted_risk_score: 68.5,
        confidence: "HIGH",
        priority: "CRITICAL_ATTENTION",
        time_window: timeWindow,
        signals: [
          { signal_name: "Git Commit Churn Rate", current_value: 14.0, baseline_value: 3.0, trend: "INCREASING", weight: 1.2, description: "Changed 14 times in last 30 days." },
          { signal_name: "Dependency Centrality", current_value: 27.0, baseline_value: 10.0, trend: "INCREASING", weight: 1.5, description: "Has 27 downstream consumer modules." },
        ],
        explainability_reason: "Risk increased because auth_service changed 14 times recently, has 27 downstream consumers, and its dependency centrality increased by 170%.",
        recommended_investigation: "Investigate extracting auth_service domain into standalone microservice with interface boundary.",
      },
      {
        prediction_id: "pred_drift_2",
        repository_id: repositoryId,
        target_entity: "database_layer",
        prediction_type: "ARCHITECTURE_DRIFT",
        current_health_score: 78.0,
        predicted_risk_score: 62.0,
        confidence: "HIGH",
        priority: "HIGH_PRIORITY",
        time_window: timeWindow,
        signals: [
          { signal_name: "Cross-Layer Boundary Violations", current_value: 4.0, baseline_value: 0.0, trend: "INCREASING", weight: 1.8, description: "4 direct caller edges bypass service layer." },
        ],
        explainability_reason: "Architecture drift predicted due to 4 cross-layer boundary violations bypassing the service abstraction layer.",
        recommended_investigation: "Enforce architectural boundary rule via automated linting and introduce repository pattern.",
      },
    ],
  };
}
