"use client"

import React, { useState } from "react"
import { Shield, Zap, AlertTriangle, GitBranch, Layers, CheckCircle2, ChevronRight, Search, FileCode } from "lucide-react"

interface ImpactPath {
  depth: number
  path: string
  relationship: string
  category: string
}

interface EvidencePayload {
  what: string
  where: string
  why: string
  source: string
  confidence: number
}

interface AIReasoning {
  fact: string
  inference: string
  prediction: string
  recommendation: string
}

export function ImpactIntelligenceEngine() {
  const [targetId, setTargetId] = useState("services/auth_service.py")
  const [changeType, setChangeType] = useState("SIGNATURE_MODIFY")
  const [maxDepth, setMaxDepth] = useState(3)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<"paths" | "evidence" | "reasoning">("paths")

  const samplePaths: ImpactPath[] = [
    { depth: 1, path: "services/auth_service.py -> services/user_service.py", relationship: "CALLS", category: "DIRECT" },
    { depth: 2, path: "services/auth_service.py -> services/user_service.py -> api/v1/routes.py", relationship: "EXPOSES", category: "INDIRECT" },
    { depth: 3, path: "services/auth_service.py -> services/user_service.py -> api/v1/routes.py -> PostgreSQL.users", relationship: "MUTATES", category: "ARCHITECTURAL" },
  ]

  const sampleEvidence: EvidencePayload = {
    what: "Signature modification on AuthService.authenticate_user()",
    where: "services/auth_service.py:L45-L62",
    why: "Alters parameter order required by 3 calling microservices",
    source: "git://github.com/codeatlas/enterprise-api.git",
    confidence: 0.96,
  }

  const sampleReasoning: AIReasoning = {
    fact: "Direct call dependency from user_service.py and api/v1/routes.py.",
    inference: "Potential breaking change on external HTTP REST endpoints.",
    prediction: "High likelihood of integration test failure on authentication flows.",
    recommendation: "Run test suite pytest tests/unit/test_auth.py before deployment.",
  }

  const handleRunAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 400)
  }

  return (
    <div className="w-full bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Impact Intelligence Engine</h2>
            <p className="text-xs text-slate-400">Predictive change blast radius analysis & 3-level graph path traversal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded-full border border-slate-700">
            v1.2 Engine Ready
          </span>
        </div>
      </div>

      {/* Target Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Target Entity / Symbol</label>
          <div className="relative">
            <input
              type="text"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded px-3 py-2 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Proposed Change Type</label>
          <select
            value={changeType}
            onChange={(e) => setChangeType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="SIGNATURE_MODIFY">MODIFY SIGNATURE</option>
            <option value="DELETE_SYMBOL">DELETE SYMBOL</option>
            <option value="RENAME_SYMBOL">RENAME SYMBOL</option>
            <option value="SCHEMA_CHANGE">SCHEMA MUTATION</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1">Max Graph Depth: {maxDepth}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={maxDepth}
            onChange={(e) => setMaxDepth(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500 mt-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-4 rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            {isAnalyzing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze Change Impact
          </button>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Blast Radius Risk</span>
            <span className="text-2xl font-bold text-red-400 font-mono">HIGH (7.8 / 10)</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400/80" />
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Affected Callers</span>
            <span className="text-2xl font-bold text-amber-400 font-mono">3 Services</span>
          </div>
          <GitBranch className="w-8 h-8 text-amber-400/80" />
        </div>

        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Evidence Grounding</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">96.0% Confidence</span>
          </div>
          <Shield className="w-8 h-8 text-emerald-400/80" />
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("paths")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${activeTab === "paths" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          3-Level Impact Paths ({samplePaths.length})
        </button>
        <button
          onClick={() => setActiveTab("evidence")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${activeTab === "evidence" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          Evidence Panel
        </button>
        <button
          onClick={() => setActiveTab("reasoning")}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${activeTab === "reasoning" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}
        >
          AI CTO Impact Reasoning
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "paths" && (
        <div className="space-y-3">
          {samplePaths.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs font-mono rounded">Depth {item.depth}</span>
                <span className="text-xs font-mono text-slate-200">{item.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded border border-emerald-500/20">{item.relationship}</span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "evidence" && (
        <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
          <div><span className="text-slate-500">WHAT:</span> {sampleEvidence.what}</div>
          <div><span className="text-slate-500">WHERE:</span> <span className="text-emerald-400">{sampleEvidence.where}</span></div>
          <div><span className="text-slate-500">WHY:</span> {sampleEvidence.why}</div>
          <div><span className="text-slate-500">SOURCE:</span> {sampleEvidence.source}</div>
          <div><span className="text-slate-500">CONFIDENCE:</span> <span className="text-emerald-400">{(sampleEvidence.confidence * 100).toFixed(1)}%</span></div>
        </div>
      )}

      {activeTab === "reasoning" && (
        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">FACT (Knowledge Graph):</span>
            <p className="text-slate-300">{sampleReasoning.fact}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">INFERENCE:</span>
            <p className="text-slate-300">{sampleReasoning.inference}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-blue-400 font-bold block mb-1">PREDICTION:</span>
            <p className="text-slate-300">{sampleReasoning.prediction}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">RECOMMENDATION:</span>
            <p className="text-slate-300">{sampleReasoning.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  )
}
