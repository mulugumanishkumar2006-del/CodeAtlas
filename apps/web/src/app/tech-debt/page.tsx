'use client';

import * as React from 'react';
import {
  Flame,
  AlertTriangle,
  RefreshCw,
  Clock,
  TrendingUp,
  FileCode,
  CheckCircle,
  ShieldAlert,
  Layers,
  X,
  Boxes,
  Activity,
  Sparkles,
  ArrowRight,
  BookOpen,
  Cpu,
  Gauge,
  Info,
  Calendar,
  AlertOctagon,
  LineChart,
  ArrowDown,
  Wrench,
  DollarSign,
  TrendingDown,
  Users,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types matching backend
interface HeatmapNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  value: number; // lines of code
  score: number; // risk score (0-100)
  complexity?: number;
  coupling?: number;
  coverage?: number;
  changes?: number;
  is_cyclic?: boolean;
  
  // Feature 1 Scanner Fields
  cognitive_complexity?: number;
  has_long_methods?: boolean;
  has_god_classes?: boolean;
  has_duplicate_code?: boolean;
  has_dead_code?: boolean;
  has_large_file?: boolean;
  has_deep_inheritance?: boolean;
  has_excessive_nesting?: boolean;
  has_high_coupling?: boolean;

  children?: HeatmapNode[];
}

interface RemediationPlan {
  file_path: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
  action: string;
  estimated_effort: string;
  expected_improvement: string;

  // Feature 4 — AI Debt Analyzer fields
  why_debt_exists: string;
  why_debt_increased: string;
  causing_dependencies: string[];
  how_to_reduce: string;
}

interface TechDebtSummary {
  average_debt_score: number;
  high_risk_components_count: number;
  circular_dependencies_count: number;
  average_doc_coverage: number;
}

// Feature 2 Scorecard
interface RiskScorecard {
  architecture: number;
  maintainability: number;
  security: number;
  testing: number;
  performance: number;
  documentation: number;
  technical_debt: number;
  overall_health: number;
}

// Feature 4 AI Debt Analyzer (Repository Level)
interface RepositoryAIDebtAnalysis {
  why_debt_exists: string;
  why_debt_increased: string;
  causing_dependencies: string[];
  how_to_reduce: string;
  expected_improvement: string;
}

// Feature 5 Timeline
interface TimelineSnapshot {
  year: string;
  score: number;
  status: 'HEALTHY' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
}

// Feature 6 Hotspots
interface HotspotsDetection {
  most_dangerous_file: string;
  most_dangerous_file_score: number;
  most_dangerous_module: string;
  most_dangerous_module_score: number;
  most_unstable_service: string;
  most_unstable_service_changes: number;
  fastest_growing_complexity: string;
  fastest_growing_complexity_value: number;
  most_modified_component: string;
  most_modified_component_changes: number;
}

// Feature 7 Refactoring Recommendations
interface RefactoringRecommendation {
  category: string;
  target: string;
  action: string;
  benefits: string;
  risks: string;
  estimated_effort: string;
  expected_improvement: string;
}

// Feature 8 Health Trends
interface HealthDashboardTrend {
  debt_score: number;
  health_score: number;
  risk_trend: number[];
  complexity_trend: number[];
  coverage_trend: number[];
  dependency_growth: number[];
  trend_labels: string[];
}

// Feature 9 Forecast
interface ForecastSnapshot {
  label: string;
  score: number;
  estimated_maintenance_cost: string;
}

// Feature 10 Explanations
interface RiskExplanation {
  module_name: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'WARNING' | 'HEALTHY';
  reasons: string[];
}

// Feature 11 Cost of Delay
interface CostOfDelay {
  time_lost_per_sprint: string;
  bug_probability: number;
  refactoring_effort: string;
  long_term_maintenance_cost: string;
}

// Feature 12 Executive Dashboard
interface ExecutiveDashboard {
  overall_health: number;
  top_risky_services: {
    file_path: string;
    risk_score: number;
    changes: number;
    complexity: number;
  }[];
  team_debt_distribution: Record<string, number>;
  sprint_debt_trend: number[];
  high_priority_fixes: {
    file_path: string;
    risk_level: string;
    action: string;
    expected_improvement: string;
  }[];
}

interface Repository {
  id: string;
  name: string;
  full_name: string;
  clone_url: string;
  status: string;
}

// ──────────────────────────────────────────────────────────────────────
const MOCK_REMEDIATIONS: RemediationPlan[] = [
  {
    file_path: "apps/backend/auth_service.py",
    risk_level: "CRITICAL",
    reasons: [
      "High total cyclomatic complexity (42)",
      "Low documentation coverage (32%)",
      "Part of circular dependency loop with payment.py"
    ],
    action: "Split auth_service.py into LoginService, SessionService, and TokenService.",
    estimated_effort: "4 days",
    expected_improvement: "+30%",
    why_debt_exists: "Repeated quick modifications without factoring in architectural boundaries.",
    why_debt_increased: "Hotspot churn during sprint integrations.",
    causing_dependencies: ["payment.py", "database.py"],
    how_to_reduce: "Break circular references by extracting common validation classes."
  },
  {
    file_path: "apps/backend/payment.py",
    risk_level: "HIGH",
    reasons: [
      "High coupling with outer modules",
      "File length exceeds 600 lines"
    ],
    action: "Extract secondary gateway helper functions into a payment sub-module.",
    estimated_effort: "3 days",
    expected_improvement: "+24%",
    why_debt_exists: "Gateway logic was appended inline over time.",
    why_debt_increased: "Added support for three new payment processors.",
    causing_dependencies: ["auth_service.py"],
    how_to_reduce: "Use dependency injection for gateway implementations."
  }
];

const MOCK_SUMMARY: TechDebtSummary = {
  average_debt_score: 54.2,
  high_risk_components_count: 3,
  circular_dependencies_count: 4,
  average_doc_coverage: 51.5
};

const MOCK_SCORECARD: RiskScorecard = {
  architecture: 92,
  maintainability: 84,
  security: 90,
  testing: 73,
  performance: 81,
  documentation: 77,
  technical_debt: 68,
  overall_health: 83
};

const MOCK_AI_ANALYSIS: RepositoryAIDebtAnalysis = {
  why_debt_exists: "The repository contains 3 high-risk components and 4 circular dependency loops. The average technical debt score is 54.2/100, driven by low documentation coverage (51.5%) and high complexity density in core paths.",
  why_debt_increased: "Frequent features integration without structural partitioning has led to active hotspots. The lack of strict layering allowed circular dependency cycles to form over recent commits.",
  causing_dependencies: ["apps/backend/auth_service.py", "apps/backend/payment.py", "packages/config/webpack.js"],
  how_to_reduce: "Enforce a maximum cyclomatic complexity limit of 12 per function in CI, break circular dependencies by introducing abstract interfaces, and configure a strict documentation check for pull requests.",
  expected_improvement: "Applying these remediation items is expected to improve Overall Health by +15%, raise Maintainability to >90, and reduce modification churn by 25%."
};

const MOCK_TIMELINE: TimelineSnapshot[] = [
  { year: "2024", score: 90, status: "HEALTHY" },
  { year: "2025", score: 72, status: "WARNING" },
  { year: "2026", score: 54.2, status: "HIGH_RISK" }
];

const MOCK_HOTSPOTS: HotspotsDetection = {
  most_dangerous_file: "apps/backend/auth_service.py",
  most_dangerous_file_score: 87.5,
  most_dangerous_module: "apps/backend",
  most_dangerous_module_score: 68.4,
  most_unstable_service: "apps/backend/auth_service.py",
  most_unstable_service_changes: 42,
  fastest_growing_complexity: "apps/backend/auth_service.py",
  fastest_growing_complexity_value: 42,
  most_modified_component: "apps/backend/auth_service.py",
  most_modified_component_changes: 42
};

const MOCK_RECOMMENDATIONS: RefactoringRecommendation[] = [
  {
    category: "Split service",
    target: "apps/backend/auth_service.py",
    action: "Split auth_service.py into LoginService, SessionService, and TokenService.",
    benefits: "Reduces cognitive complexity, simplifies unit test mocking, and isolates authentication concerns.",
    risks: "Requires updating import dependencies and local configuration endpoints.",
    estimated_effort: "3 days",
    expected_improvement: "+12% Health Score"
  },
  {
    category: "Extract module",
    target: "apps/backend/payment.py",
    action: "Extract secondary gateway helper functions into a payment sub-module.",
    benefits: "Shortens payment.py file length and reduces merge conflict collisions.",
    risks: "Overhead of path routing redirects inside configuration webpack configurations.",
    estimated_effort: "2 days",
    expected_improvement: "+15% Maintainability Score"
  },
  {
    category: "Introduce interface",
    target: "apps/backend/auth_service.py",
    action: "Introduce abstract interface classes (ABCs) to decouple databases references.",
    benefits: "Allows safe mocking of connection states and simplifies regression testing.",
    risks: "Slight initial configuration boilerplate increases.",
    estimated_effort: "2 days",
    expected_improvement: "+18% Testing Score"
  },
  {
    category: "Reduce coupling",
    target: "apps/backend/payment.py",
    action: "Introduce dependency injection contexts to decouple payment gateways.",
    benefits: "Breaks tight direct references and simplifies future library swaps.",
    risks: "Makes data flow structures slightly more abstract to navigate.",
    estimated_effort: "3 days",
    expected_improvement: "+20% Performance Index"
  },
  {
    category: "Remove dead code",
    target: "apps/backend/utils.py",
    action: "Audit utils.py and delete obsolete formatting functions.",
    benefits: "Reduces index bundle sizes and clean code footprint.",
    risks: "Requires thorough grep verification that no reflection calls lookup these functions.",
    estimated_effort: "0.5 days",
    expected_improvement: "+5% Cleanliness Index"
  },
  {
    category: "Simplify dependency chain",
    target: "apps/backend/auth_service.py",
    action: "Extract shared crypto logic to a common core package to resolve circular imports.",
    benefits: "Resolves startup sequence locks and prevents initialization cycle lockups.",
    risks: "Requires cautious import tree tracking to ensure backward compatibility.",
    estimated_effort: "2 days",
    expected_improvement: "+10% Reliability Score"
  }
];

const MOCK_DASHBOARD_TREND: HealthDashboardTrend = {
  debt_score: 54.2,
  health_score: 83.0,
  risk_trend: [30.0, 42.0, 50.0, 54.2],
  complexity_trend: [110, 140, 180, 205],
  coverage_trend: [35.0, 48.0, 60.0, 64.0],
  dependency_growth: [6, 12, 18, 25],
  trend_labels: ["Q2-25", "Q3-25", "Q4-25", "Q1-26"]
};

const MOCK_FORECAST: ForecastSnapshot[] = [
  { label: "Current", score: 54.2, estimated_maintenance_cost: "$43,360 / month" },
  { label: "30 days", score: 62.3, estimated_maintenance_cost: "$49,840 / month" },
  { label: "90 days", score: 78.5, estimated_maintenance_cost: "$62,800 / month" },
  { label: "180 days", score: 99.1, estimated_maintenance_cost: "$79,280 / month" }
];

const MOCK_RISK_EXPLANATIONS: RiskExplanation[] = [
  {
    module_name: "auth_service.py",
    risk_level: "CRITICAL",
    reasons: [
      "High dependency fan-out (18 direct imports)",
      "9 architecture violations (circular dependencies with payment.py)",
      "42% increase in cognitive complexity over recent commits",
      "Modified in 42 recent commits (highest churn hotspot)",
      "Test coverage below threshold (32% coverage)"
    ]
  },
  {
    module_name: "payment.py",
    risk_level: "HIGH",
    reasons: [
      "High dependency fan-out (14 direct imports)",
      "4 architecture violations (circular dependency loop detected)",
      "17% increase in complexity",
      "Modified in 28 recent commits",
      "Test coverage below threshold (48% coverage)"
    ]
  }
];

const MOCK_COST_OF_DELAY: CostOfDelay = {
  time_lost_per_sprint: "4.5 days / sprint",
  bug_probability: 82.0,
  refactoring_effort: "12 engineering days",
  long_term_maintenance_cost: "$3,610 / month"
};

const MOCK_EXECUTIVE_DASHBOARD: ExecutiveDashboard = {
  overall_health: 83.0,
  top_risky_services: [
    { file_path: "apps/backend/auth_service.py", risk_score: 87.5, changes: 42, complexity: 42 },
    { file_path: "apps/backend/payment.py", risk_score: 72.3, changes: 28, complexity: 27 },
    { file_path: "apps/web/login_page.tsx", risk_score: 61.5, changes: 19, complexity: 24 },
    { file_path: "packages/config/webpack.js", risk_score: 44.0, changes: 14, complexity: 21 },
    { file_path: "packages/core/errors.ts", risk_score: 37.5, changes: 12, complexity: 18 },
    { file_path: "apps/web/dashboard.tsx", risk_score: 37.3, changes: 7, complexity: 15 }
  ],
  team_debt_distribution: {
    "Backend Services": 68.4,
    "Frontend Client": 48.2,
    "Core Libraries": 32.4,
    "Infrastructure": 44.0
  },
  sprint_debt_trend: [72.0, 75.0, 78.0, 81.0, 83.0],
  high_priority_fixes: [
    {
      file_path: "apps/backend/auth_service.py",
      risk_level: "CRITICAL",
      action: "Split auth_service.py into LoginService, SessionService, and TokenService.",
      expected_improvement: "+24% Maintainability Index"
    },
    {
      file_path: "apps/backend/payment.py",
      risk_level: "HIGH",
      action: "Extract secondary gateway helper functions into a payment sub-module.",
      expected_improvement: "+18% Reliability Index"
    },
    {
      file_path: "apps/web/login_page.tsx",
      risk_level: "MEDIUM",
      action: "Introduce validation schemas (e.g. Zod/Yup) to modularize UI presentation forms.",
      expected_improvement: "+12% Testability Score"
    }
  ]
};

const MOCK_HEATMAP: HeatmapNode = {
  name: "root",
  path: "",
  type: "directory",
  value: 4650,
  score: 54.2,
  children: [
    {
      name: "apps",
      path: "apps",
      type: "directory",
      value: 3200,
      score: 62.1,
      children: [
        {
          name: "backend",
          path: "apps/backend",
          type: "directory",
          value: 2200,
          score: 68.4,
          children: [
            {
              name: "auth_service.py",
              path: "apps/backend/auth_service.py",
              type: "file",
              value: 850,
              score: 87.5,
              complexity: 42,
              coupling: 18,
              coverage: 32.0,
              changes: 42,
              is_cyclic: true,
              cognitive_complexity: 52,
              has_long_methods: true,
              has_god_classes: true,
              has_duplicate_code: false,
              has_dead_code: false,
              has_large_file: true,
              has_deep_inheritance: true,
              has_excessive_nesting: true,
              has_high_coupling: true
            },
            {
              name: "payment.py",
              path: "apps/backend/payment.py",
              type: "file",
              value: 650,
              score: 72.3,
              complexity: 27,
              coupling: 14,
              coverage: 48.0,
              changes: 28,
              is_cyclic: true,
              cognitive_complexity: 34,
              has_long_methods: true,
              has_god_classes: false,
              has_duplicate_code: true,
              has_dead_code: false,
              has_large_file: true,
              has_deep_inheritance: false,
              has_excessive_nesting: true,
              has_high_coupling: true
            },
            {
              name: "database.py",
              path: "apps/backend/database.py",
              type: "file",
              value: 400,
              score: 45.0,
              complexity: 12,
              coupling: 6,
              coverage: 85.0,
              changes: 8,
              is_cyclic: false,
              cognitive_complexity: 15,
              has_long_methods: false,
              has_god_classes: false,
              has_duplicate_code: false,
              has_dead_code: false,
              has_large_file: false,
              has_deep_inheritance: false,
              has_excessive_nesting: false,
              has_high_coupling: false
            },
            {
              name: "utils.py",
              path: "apps/backend/utils.py",
              type: "file",
              value: 300,
              score: 31.2,
              complexity: 8,
              coupling: 2,
              coverage: 95.0,
              changes: 5,
              is_cyclic: false,
              cognitive_complexity: 6,
              has_long_methods: false,
              has_god_classes: false,
              has_duplicate_code: false,
              has_dead_code: true,
              has_large_file: false,
              has_deep_inheritance: false,
              has_excessive_nesting: false,
              has_high_coupling: false
            }
          ]
        },
        {
          name: "web",
          path: "apps/web",
          type: "directory",
          value: 1000,
          score: 48.2,
          children: [
            {
              name: "login_page.tsx",
              path: "apps/web/login_page.tsx",
              type: "file",
              value: 450,
              score: 61.5,
              complexity: 24,
              coupling: 11,
              coverage: 40.0,
              changes: 19,
              is_cyclic: false,
              cognitive_complexity: 29,
              has_long_methods: true,
              has_god_classes: false,
              has_duplicate_code: false,
              has_dead_code: false,
              has_large_file: true,
              has_deep_inheritance: false,
              has_excessive_nesting: true,
              has_high_coupling: false
            },
            {
              name: "dashboard.tsx",
              path: "apps/web/dashboard.tsx",
              type: "file",
              value: 550,
              score: 37.3,
              complexity: 15,
              coupling: 5,
              coverage: 65.0,
              changes: 7,
              is_cyclic: false,
              cognitive_complexity: 12,
              has_long_methods: false,
              has_god_classes: false,
              has_duplicate_code: false,
              has_dead_code: false,
              has_large_file: false,
              has_deep_inheritance: false,
              has_excessive_nesting: false,
              has_high_coupling: false
            }
          ]
        }
      ]
    },
    {
      name: "packages",
      path: "packages",
      type: "directory",
      value: 1450,
      score: 36.8,
      children: [
        {
          name: "core",
          path: "packages/core",
          type: "directory",
          value: 900,
          score: 32.4,
          children: [
            {
              name: "index.ts",
              path: "packages/core/index.ts",
              type: "file",
              value: 350,
              score: 24.5,
              complexity: 5,
              coupling: 3,
              coverage: 98.0,
              changes: 3,
              is_cyclic: false,
              cognitive_complexity: 4,
              has_long_methods: false,
              has_god_classes: false,
              has_duplicate_code: false,
              has_dead_code: false,
              has_large_file: false,
              has_deep_inheritance: false,
              has_excessive_nesting: false,
              has_high_coupling: false
            },
            {
              name: "errors.ts",
              path: "packages/core/errors.ts",
              type: "file",
              value: 550,
              score: 37.5,
              complexity: 18,
              coupling: 8,
              coverage: 50.0,
              changes: 12,
              is_cyclic: false,
              cognitive_complexity: 14,
              has_long_methods: false,
              has_god_classes: false,
              has_duplicate_code: false,
              has_dead_code: false,
              has_large_file: false,
              has_deep_inheritance: false,
              has_excessive_nesting: false,
              has_high_coupling: false
            }
          ]
        },
        {
          name: "config",
          path: "packages/config",
          type: "directory",
          value: 550,
          score: 44.0,
          children: [
            {
              name: "webpack.js",
              path: "packages/config/webpack.js",
              type: "file",
              value: 550,
              score: 44.0,
              complexity: 21,
              coupling: 12,
              coverage: 0.0,
              changes: 14,
              is_cyclic: false,
              cognitive_complexity: 25,
              has_long_methods: true,
              has_god_classes: false,
              has_duplicate_code: false,
              has_dead_code: false,
              has_large_file: true,
              has_deep_inheritance: false,
              has_excessive_nesting: false,
              has_high_coupling: false
            }
          ]
        }
      ]
    }
  ]
};

// Feature 8 Sparkline Component
function Sparkline({ data, color = "#6366f1" }: { data: number[]; color?: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 110;
  const height = 30;
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible select-none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

interface LayoutRect {
  node: HeatmapNode;
  x: number;
  y: number;
  width: number;
  height: number;
}

function computeSliceAndDice(
  node: HeatmapNode,
  x: number,
  y: number,
  w: number,
  h: number,
  depth: number = 0
): LayoutRect[] {
  const result: LayoutRect[] = [{ node, x, y, width: w, height: h }];

  if (!node.children || node.children.length === 0) {
    return result;
  }

  const totalValue = node.children.reduce((acc, child) => acc + (child.value || 100), 0);
  if (totalValue === 0) return result;

  let currentOffset = 0;
  const vertical = depth % 2 === 0;

  for (const child of node.children) {
    const ratio = (child.value || 100) / totalValue;
    let cx = x;
    let cy = y;
    let cw = w;
    let ch = h;

    if (vertical) {
      cw = w * ratio;
      cx = x + currentOffset;
      currentOffset += cw;
    } else {
      ch = h * ratio;
      cy = y + currentOffset;
      currentOffset += ch;
    }

    const childRects = computeSliceAndDice(child, cx, cy, cw, ch, depth + 1);
    result.push(...childRects);
  }

  return result;
}

export default function TechnicalDebtPage() {
  const { token } = useAuth();

  // Navigation tab state
  const [activeView, setActiveView] = React.useState<'developer' | 'executive'>('developer');

  // Repositories list & Selection state
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = React.useState<string>('');
  
  // Engine metrics state
  const [summary, setSummary] = React.useState<TechDebtSummary>(MOCK_SUMMARY);
  const [scorecard, setScorecard] = React.useState<RiskScorecard>(MOCK_SCORECARD);
  const [heatmap, setHeatmap] = React.useState<HeatmapNode>(MOCK_HEATMAP);
  const [remediations, setRemediations] = React.useState<RemediationPlan[]>(MOCK_REMEDIATIONS);
  const [aiAnalysis, setAiAnalysis] = React.useState<RepositoryAIDebtAnalysis>(MOCK_AI_ANALYSIS);
  
  // Features 5, 6, 7 & 8 states
  const [timeline, setTimeline] = React.useState<TimelineSnapshot[]>(MOCK_TIMELINE);
  const [hotspots, setHotspots] = React.useState<HotspotsDetection>(MOCK_HOTSPOTS);
  const [recommendations, setRecommendations] = React.useState<RefactoringRecommendation[]>(MOCK_RECOMMENDATIONS);
  const [dashboardTrend, setDashboardTrend] = React.useState<HealthDashboardTrend>(MOCK_DASHBOARD_TREND);
  
  // Features 9 & 10 states
  const [forecast, setForecast] = React.useState<ForecastSnapshot[]>(MOCK_FORECAST);
  const [riskExplanations, setRiskExplanations] = React.useState<RiskExplanation[]>(MOCK_RISK_EXPLANATIONS);

  // Features 11 & 12 states
  const [costOfDelay, setCostOfDelay] = React.useState<CostOfDelay>(MOCK_COST_OF_DELAY);
  const [executiveDashboard, setExecutiveDashboard] = React.useState<ExecutiveDashboard>(MOCK_EXECUTIVE_DASHBOARD);

  // UI states
  const [loading, setLoading] = React.useState<boolean>(true);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [demoMode, setDemoMode] = React.useState<boolean>(false);
  
  // Selected Leaf Details state
  const [selectedNode, setSelectedNode] = React.useState<HeatmapNode | null>(null);
  const [selectedRemediation, setSelectedRemediation] = React.useState<RemediationPlan | null>(null);
  const [activeTabSide, setActiveTabSide] = React.useState<'checkpoints' | 'analyzer'>('checkpoints');

  // Fetch repositories
  const fetchRepos = React.useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/repositories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
        if (data.length > 0) {
          setSelectedRepoId(data[0].id);
        } else {
          setDemoMode(true);
        }
      } else {
        setDemoMode(true);
      }
    } catch (e) {
      console.error('Fetch repositories failed', e);
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch tech debt data
  const fetchTechDebtData = React.useCallback(async (repoId: string) => {
    if (!token || !repoId || demoMode) return;
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/repositories/${repoId}/tech-debt`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        setScorecard(data.scorecard);
        setHeatmap(data.heatmap);
        setRemediations(data.remediations);
        setAiAnalysis(data.ai_analysis || MOCK_AI_ANALYSIS);
        
        // Features 5, 6, 7, 8, 9, 10, 11 & 12 sets
        setTimeline(data.timeline || MOCK_TIMELINE);
        setHotspots(data.hotspots || MOCK_HOTSPOTS);
        setRecommendations(data.recommendations || MOCK_RECOMMENDATIONS);
        setDashboardTrend(data.dashboard_trend || MOCK_DASHBOARD_TREND);
        setForecast(data.forecast || MOCK_FORECAST);
        setRiskExplanations(data.risk_explanations || MOCK_RISK_EXPLANATIONS);
        setCostOfDelay(data.cost_of_delay || MOCK_COST_OF_DELAY);
        setExecutiveDashboard(data.executive_dashboard || MOCK_EXECUTIVE_DASHBOARD);
        
        // Reset selections
        setSelectedNode(null);
        setSelectedRemediation(null);
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Failed to fetch technical debt data');
        setSummary(MOCK_SUMMARY);
        setScorecard(MOCK_SCORECARD);
        setHeatmap(MOCK_HEATMAP);
        setRemediations(MOCK_REMEDIATIONS);
        setAiAnalysis(MOCK_AI_ANALYSIS);
        setTimeline(MOCK_TIMELINE);
        setHotspots(MOCK_HOTSPOTS);
        setRecommendations(MOCK_RECOMMENDATIONS);
        setDashboardTrend(MOCK_DASHBOARD_TREND);
        setForecast(MOCK_FORECAST);
        setRiskExplanations(MOCK_RISK_EXPLANATIONS);
        setCostOfDelay(MOCK_COST_OF_DELAY);
        setExecutiveDashboard(MOCK_EXECUTIVE_DASHBOARD);
      }
    } catch (e) {
      console.error('Fetch tech debt failed', e);
      setError('Network connection error. Displaying demo model.');
      setSummary(MOCK_SUMMARY);
      setScorecard(MOCK_SCORECARD);
      setHeatmap(MOCK_HEATMAP);
      setRemediations(MOCK_REMEDIATIONS);
      setAiAnalysis(MOCK_AI_ANALYSIS);
      setTimeline(MOCK_TIMELINE);
      setHotspots(MOCK_HOTSPOTS);
      setRecommendations(MOCK_RECOMMENDATIONS);
      setDashboardTrend(MOCK_DASHBOARD_TREND);
      setForecast(MOCK_FORECAST);
      setRiskExplanations(MOCK_RISK_EXPLANATIONS);
      setCostOfDelay(MOCK_COST_OF_DELAY);
      setExecutiveDashboard(MOCK_EXECUTIVE_DASHBOARD);
    } finally {
      setRefreshing(false);
    }
  }, [token, demoMode]);

  // Trigger repositories fetch on mount
  React.useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  // Trigger tech debt fetch when selected repo changes
  React.useEffect(() => {
    if (selectedRepoId) {
      fetchTechDebtData(selectedRepoId);
    }
  }, [selectedRepoId, fetchTechDebtData]);

  const handleSelectNode = (node: HeatmapNode) => {
    if (node.type !== 'file') return;
    setSelectedNode(node);
    const matchedPlan = remediations.find(r => r.file_path === node.path);
    if (matchedPlan) {
      setSelectedRemediation(matchedPlan);
    } else {
      setSelectedRemediation({
        file_path: node.path,
        risk_level: node.score > 80 ? 'CRITICAL' : node.score > 60 ? 'HIGH' : node.score > 35 ? 'MEDIUM' : 'LOW',
        reasons: [
          `Cyclomatic complexity metric: ${node.complexity || 0}`,
          `Cognitive complexity metric: ${node.cognitive_complexity || 0}`,
          node.has_long_methods ? "Contains long methods with excessive LOC" : "",
          node.has_god_classes ? "Identified as a God Class holding excessive responsibility" : "",
          node.is_cyclic ? "Involved in circular dependency loop" : ""
        ].filter(Boolean),
        action: `Review and refactor ${node.name} to decompose functions and decouple imports.`,
        estimated_effort: node.score > 60 ? "2 days" : "1 day",
        expected_improvement: "+15% Maintainability Index",
        why_debt_exists: `The module score of ${node.score}% is driven by high complexity density relative to LOC and missing type annotations.`,
        why_debt_increased: `Git modification log reveals ${node.changes || 0} changes in recent commits, pointing to high codebase edit activity.`,
        causing_dependencies: node.has_high_coupling ? ["Third-party Packages", "External Database Connections"] : ["Standard Python Imports"],
        how_to_reduce: `Encapsulate large branching operations, document class parameters, and add unit tests.`
      });
    }
  };

  const handleLocateTarget = (targetPath: string) => {
    const fileNode = rects.find((r: any) => r.node.path === targetPath || r.node.path.endsWith(targetPath))?.node;
    if (fileNode) {
      setActiveView('developer');
      handleSelectNode(fileNode);
    }
  };

  // Feature 3 — Heatmap Colors
  const getRiskColor = (score: number) => {
    if (score > 80) return 'bg-red-500/20 text-red-400 border-red-500/35 hover:bg-red-500/30';
    if (score > 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/35 hover:bg-orange-500/30';
    if (score > 35) return 'bg-amber-500/20 text-amber-400 border-amber-500/35 hover:bg-amber-500/30';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25';
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/15 text-red-400 border border-red-500/30';
      case 'HIGH': return 'bg-orange-500/15 text-orange-400 border border-orange-500/30';
      case 'MEDIUM': return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      default: return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-teal-400';
    if (score >= 70) return 'text-amber-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 80) return 'bg-teal-500/10 border-teal-500/20';
    if (score >= 70) return 'bg-amber-500/10 border-amber-500/20';
    if (score >= 60) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getEmojiColor = (score: number) => {
    if (score > 80) return '🔴 Critical';
    if (score > 60) return '🟠 High Risk';
    if (score > 35) return '🟡 Warning';
    return '🟢 Healthy';
  };

  const getTimelineEmoji = (status: string) => {
    switch (status) {
      case 'HEALTHY': return '🟢';
      case 'WARNING': return '🟡';
      case 'HIGH_RISK': return '🟠';
      default: return '🔴';
    }
  };

  const rects = React.useMemo(() => {
    if (!heatmap) return [];
    return computeSliceAndDice(heatmap, 0, 0, 1000, 500);
  }, [heatmap]);

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      {/* Upper Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground animate-in fade-in slide-in-from-left-1 duration-200">Risk Heatmap</h1>
            <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
              Technical Debt Engine
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            The Google Maps Traffic Layer for your codebase. Pinpoint files containing highest maintainability and outage risk.
          </p>
        </div>

        {/* Action controllers */}
        <div className="flex flex-wrap items-center gap-3">
          {repos.length > 0 && !demoMode && (
            <div className="relative inline-block text-left">
              <select
                value={selectedRepoId}
                onChange={(e) => setSelectedRepoId(e.target.value)}
                className="w-56 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none"
              >
                {repos.map((repo) => (
                  <option key={repo.id} value={repo.id}>
                    {repo.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedRepoId && !demoMode) {
                fetchTechDebtData(selectedRepoId);
              } else {
                fetchRepos();
              }
            }}
            disabled={refreshing || loading}
            className="h-10 gap-2 border-border/80 bg-background/50 backdrop-blur-sm"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            Analyze
          </Button>

          {demoMode ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setDemoMode(false);
                fetchRepos();
              }}
              className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Exit Demo Mode
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDemoMode(true);
                setSummary(MOCK_SUMMARY);
                setScorecard(MOCK_SCORECARD);
                setHeatmap(MOCK_HEATMAP);
                setRemediations(MOCK_REMEDIATIONS);
                setAiAnalysis(MOCK_AI_ANALYSIS);
                setTimeline(MOCK_TIMELINE);
                setHotspots(MOCK_HOTSPOTS);
                setRecommendations(MOCK_RECOMMENDATIONS);
                setDashboardTrend(MOCK_DASHBOARD_TREND);
                setForecast(MOCK_FORECAST);
                setRiskExplanations(MOCK_RISK_EXPLANATIONS);
                setCostOfDelay(MOCK_COST_OF_DELAY);
                setExecutiveDashboard(MOCK_EXECUTIVE_DASHBOARD);
              }}
              className="h-10 text-muted-foreground hover:text-foreground font-medium"
            >
              View Demo Playground
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold">Notice:</span> {error} (Displaying fallback sandbox model).
          </div>
        </div>
      )}

      {/* View Selector Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveView('developer')}
          className={cn(
            "text-sm font-bold pb-2.5 px-4 border-b-2 transition-all uppercase tracking-wider",
            activeView === 'developer' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Developer Heatmap
        </button>
        <button
          onClick={() => setActiveView('executive')}
          className={cn(
            "text-sm font-bold pb-2.5 px-4 border-b-2 transition-all uppercase tracking-wider flex items-center gap-2",
            activeView === 'executive' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="h-4 w-4 text-indigo-500" /> Executive Dashboard
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          DEVELOPER VIEW TABS
          ────────────────────────────────────────────────────────────────────── */}
      {activeView === 'developer' ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Trend & Overall health row */}
          <div className="grid gap-6 md:grid-cols-4">
            {/* Core Stats Overview */}
            <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-muted/20 p-5 shadow-sm border-border/70 backdrop-blur-sm flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Repository health overview</span>
                
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"><Gauge className="h-4 w-4 text-primary" /> Health Score:</span>
                  <span className="text-lg font-black text-foreground">{dashboardTrend.health_score}</span>
                </div>

                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"><Flame className="h-4 w-4 text-red-500" /> Debt Score:</span>
                  <span className="text-lg font-black text-foreground">{dashboardTrend.debt_score}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-indigo-400" /> Snapshot:</span>
                  <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wide">Q1 2026 Analysis</span>
                </div>
              </div>
              
              <p className="text-[10px] text-muted-foreground leading-normal mt-4">
                Dashboard aggregates static scanning metrics, git evolution logs, and ontology dependency links.
              </p>
            </div>

            {/* Sparkline historical trend micro-charts */}
            <div className="md:col-span-3 rounded-2xl border bg-background/40 p-5 shadow-sm border-border/70 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Historical Health Trends</span>
                <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground">
                  {dashboardTrend.trend_labels.map((lbl, i) => (
                    <span key={i}>{lbl}</span>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                {/* Risk Trend */}
                <div className="bg-card/40 border border-border/50 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Risk Trend</span>
                  <div className="flex justify-center py-2.5">
                    <Sparkline data={dashboardTrend.risk_trend} color="#f87171" />
                  </div>
                  <span className="text-[9px] font-bold text-red-400 flex items-center justify-between mt-1">
                    <span>Growth Factor</span>
                    <span className="flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +14.2%</span>
                  </span>
                </div>

                {/* Complexity Trend */}
                <div className="bg-card/40 border border-border/50 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Complexity Trend</span>
                  <div className="flex justify-center py-2.5">
                    <Sparkline data={dashboardTrend.complexity_trend} color="#f59e0b" />
                  </div>
                  <span className="text-[9px] font-bold text-amber-500 flex items-center justify-between mt-1">
                    <span>Code Spikes</span>
                    <span className="flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +45%</span>
                  </span>
                </div>

                {/* Test Coverage Trend */}
                <div className="bg-card/40 border border-border/50 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Test Coverage Trend</span>
                  <div className="flex justify-center py-2.5">
                    <Sparkline data={dashboardTrend.coverage_trend} color="#10b981" />
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center justify-between mt-1">
                    <span>Safety Buffer</span>
                    <span className="flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +29%</span>
                  </span>
                </div>

                {/* Dependency Growth */}
                <div className="bg-card/40 border border-border/50 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Dependency Growth</span>
                  <div className="flex justify-center py-2.5">
                    <Sparkline data={dashboardTrend.dependency_growth} color="#6366f1" />
                  </div>
                  <span className="text-[9px] font-bold text-indigo-400 flex items-center justify-between mt-1">
                    <span>Integration Count</span>
                    <span className="flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +19</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecasting and explanations */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column: Forecast */}
            <div className="rounded-2xl border bg-background/40 p-6 shadow-sm border-border/70 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 border-b border-border/55 pb-2.5 mb-4">
                  <LineChart className="h-4.5 w-4.5 text-indigo-500" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Technical Debt Forecast</h2>
                </div>
                
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  {forecast.map((snap, idx) => (
                    <React.Fragment key={snap.label}>
                      <div className="flex items-center justify-between bg-card/60 border rounded-xl px-5 py-2.5 w-full hover:bg-card transition-all">
                        <span className="text-xs font-extrabold text-foreground">{snap.label}</span>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-mono font-bold text-indigo-400">{Math.round(snap.score)}</span>
                            <span className="text-[9px] font-bold text-muted-foreground">Debt Score</span>
                          </div>
                          <div className="flex flex-col items-end border-l pl-3">
                            <span className="text-xs font-mono font-semibold text-foreground">{snap.estimated_maintenance_cost}</span>
                            <span className="text-[9px] font-bold text-muted-foreground">Maint. Cost</span>
                          </div>
                        </div>
                      </div>
                      {idx < forecast.length - 1 && (
                        <ArrowDown className="h-4 w-4 text-muted-foreground/60 animate-bounce-slow" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-3.5 flex items-center justify-between text-xs text-indigo-400">
                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Est. Future Maintenance Rate:</span>
                <span className="font-mono font-black">{forecast[forecast.length - 1]?.estimated_maintenance_cost || 'N/A'}</span>
              </div>
            </div>

            {/* Right Column: AI Risk Explanations */}
            <div className="rounded-2xl border bg-background/40 p-6 shadow-sm border-border/70 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b border-border/55 pb-2.5">
                <AlertOctagon className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">AI Risk Explanations</h2>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1">
                {riskExplanations.map((expl, idx) => (
                  <div key={idx} className="rounded-xl border border-red-500/15 bg-red-500/5 p-4 space-y-2 hover:bg-red-500/10 transition-colors">
                    <div className="flex items-center justify-between border-b border-red-500/10 pb-2">
                      <span 
                        className="text-xs font-black text-red-400 hover:underline cursor-pointer"
                        onClick={() => handleLocateTarget(expl.module_name)}
                      >
                        {expl.module_name}
                      </span>
                      <span className="rounded bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        {expl.risk_level}
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {expl.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 leading-normal">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Treemap visual section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Treemap Canvas */}
            <div className="rounded-2xl border bg-background/40 p-6 shadow-sm border-border/70 backdrop-blur-sm lg:col-span-2 relative">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">Codebase Risk Treemap</h2>
                  <p className="text-xs text-muted-foreground">
                    Sized by Code Lines (LOC) • Colored by Heatmap Risk Classification
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" /> 🟢 Healthy</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/40" /> 🟡 Warning</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-orange-500/20 border border-orange-500/40" /> 🟠 High Risk</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500/25 border border-red-500/45 animate-pulse" /> 🔴 Critical</span>
                </div>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/20 group/canvas transition-all duration-300">
                {refreshing && (
                  <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  </div>
                )}
                
                <svg viewBox="0 0 1000 500" width="100%" height="100%" className="select-none font-sans font-medium">
                  {rects.map(({ node, x, y, width, height }, idx) => {
                    if (node.type === 'directory') {
                      if (width < 30 || height < 30) return null;
                      return (
                        <g key={`folder-${node.path}-${idx}`} className="pointer-events-none">
                          <rect x={x} y={y} width={width} height={height} fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
                          <text x={x + 5} y={y + 15} fill="rgba(156, 163, 175, 0.4)" fontSize="10" className="font-bold tracking-wider">
                            {node.name.toUpperCase()}
                          </text>
                        </g>
                      );
                    }

                    const isSelected = selectedNode?.path === node.path;
                    const fillClass = getRiskColor(node.score);
                    
                    return (
                      <g key={`file-${node.path}-${idx}`} className="cursor-pointer" onClick={() => handleSelectNode(node)}>
                        <rect
                          x={x + 1}
                          y={y + 1}
                          width={Math.max(1, width - 2)}
                          height={Math.max(1, height - 2)}
                          rx="3"
                          className={cn(
                            "transition-all duration-200 border",
                            fillClass,
                            isSelected ? "stroke-foreground stroke-2 scale-[0.99] shadow-inner" : "stroke-transparent hover:brightness-110"
                          )}
                        />
                        {width > 60 && height > 30 && (
                          <foreignObject x={x + 4} y={y + 4} width={width - 8} height={height - 8} className="pointer-events-none overflow-hidden">
                            <div className="flex h-full flex-col justify-between p-0.5 text-left leading-none">
                              <span className="text-[10px] sm:text-xs font-bold truncate text-foreground/90">{node.name}</span>
                              <span className="text-[9px] font-semibold opacity-70">{node.score}% • {node.value} LOC</span>
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Sidebar drawer */}
            <div className="rounded-2xl border bg-background/40 p-6 shadow-sm border-border/70 backdrop-blur-sm flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold tracking-tight text-foreground">Module Intel Panel</h2>
                  {selectedNode && (
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedNode(null); setSelectedRemediation(null); }} className="h-8 w-8 hover:bg-muted">
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>

                {!selectedNode ? (
                  <div className="flex h-72 flex-col items-center justify-center text-center p-6 border-2 border-dashed border-muted rounded-xl">
                    <HelpCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
                    <p className="text-sm font-semibold text-foreground/80">Select a File Tile</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                      Click on any file rectangle in the treemap to scan its code checkpoint parameters and AI analysis explanations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[520px] pr-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileCode className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-extrabold text-sm truncate text-foreground">{selectedNode.name}</span>
                        </div>
                        <span className={cn("rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider", getRiskBadge(selectedRemediation?.risk_level || 'LOW'))}>
                          {getEmojiColor(selectedNode.score)}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground truncate">{selectedNode.path}</p>
                    </div>

                    <div className="flex border-b border-border pb-1 gap-2">
                      <button
                        onClick={() => setActiveTabSide('checkpoints')}
                        className={cn(
                          "text-xs font-bold pb-1.5 px-2 border-b-2 transition-all uppercase tracking-wider",
                          activeTabSide === 'checkpoints' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Checkpoints
                      </button>
                      <button
                        onClick={() => setActiveTabSide('analyzer')}
                        className={cn(
                          "text-xs font-bold pb-1.5 px-2 border-b-2 transition-all uppercase tracking-wider flex items-center gap-1",
                          activeTabSide === 'analyzer' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> AI Analyzer
                      </button>
                    </div>

                    {activeTabSide === 'checkpoints' ? (
                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-muted-foreground">Cyclomatic Complexity</span>
                          <span className="font-semibold text-foreground">{selectedNode.complexity || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-muted-foreground">Cognitive Complexity</span>
                          <span className="font-semibold text-foreground">{selectedNode.cognitive_complexity || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-muted-foreground">Long Methods</span>
                          <span className={cn("text-xs font-bold", selectedNode.has_long_methods ? "text-orange-400" : "text-emerald-400")}>
                            {selectedNode.has_long_methods ? "Warning" : "Pass"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-muted-foreground">God Classes</span>
                          <span className={cn("text-xs font-bold", selectedNode.has_god_classes ? "text-orange-400" : "text-emerald-400")}>
                            {selectedNode.has_god_classes ? "Warning" : "Pass"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-muted-foreground">Duplicate Code</span>
                          <span className={cn("text-xs font-bold", selectedNode.has_duplicate_code ? "text-orange-400" : "text-emerald-400")}>
                            {selectedNode.has_duplicate_code ? "Warning" : "Pass"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-muted-foreground">Dead Code</span>
                          <span className={cn("text-xs font-bold", selectedNode.has_dead_code ? "text-orange-400" : "text-emerald-400")}>
                            {selectedNode.has_dead_code ? "Warning" : "Pass"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <span className="text-muted-foreground">Large Files (&gt; 400 LOC)</span>
                          <span className={cn("text-xs font-bold", selectedNode.has_large_file ? "text-orange-400" : "text-emerald-400")}>
                            {selectedNode.has_large_file ? "Warning" : "Pass"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      selectedRemediation && (
                        <div className="space-y-3 text-xs animate-in fade-in duration-200">
                          <div className="space-y-1 border-l-2 border-indigo-500 pl-2.5">
                            <span className="font-bold text-indigo-500 uppercase tracking-wider text-[10px] block">Why Debt Exists</span>
                            <p className="text-foreground/80 leading-relaxed">{selectedRemediation.why_debt_exists}</p>
                          </div>
                          <div className="space-y-1 border-l-2 border-indigo-500 pl-2.5">
                            <span className="font-bold text-indigo-500 uppercase tracking-wider text-[10px] block">Why It Increased</span>
                            <p className="text-foreground/80 leading-relaxed">{selectedRemediation.why_debt_increased}</p>
                          </div>
                          <div className="space-y-1 border-l-2 border-indigo-500 pl-2.5">
                            <span className="font-bold text-indigo-500 uppercase tracking-wider text-[10px] block">Causing Dependencies</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedRemediation.causing_dependencies.map((dep, i) => (
                                <span key={i} className="inline-flex rounded px-1.5 py-0.5 font-mono text-[9px] font-bold bg-muted border text-muted-foreground">
                                  {dep}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1 border-l-2 border-indigo-500 pl-2.5">
                            <span className="font-bold text-indigo-500 uppercase tracking-wider text-[10px] block">How to Reduce</span>
                            <p className="text-foreground/80 leading-normal font-semibold">{selectedRemediation.how_to_reduce}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Refactoring recommendations */}
          <div className="rounded-2xl border bg-background/40 p-6 shadow-sm border-border/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
              <Wrench className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold tracking-tight text-foreground">Refactoring Recommendations</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex flex-col justify-between rounded-xl border bg-card/50 p-5 shadow-sm border-border/80">
                  <div>
                    <div className="flex items-start justify-between border-b pb-3 mb-3 border-border/60">
                      <div className="flex flex-col gap-0.5 max-w-[70%]">
                        <span className="text-xs font-black uppercase tracking-wider text-primary">{rec.category}</span>
                        <span className="text-[10px] font-mono text-muted-foreground truncate cursor-pointer hover:text-foreground" onClick={() => handleLocateTarget(rec.target)}>
                          Target: {rec.target.split('/').pop()}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        <TrendingUp className="h-3 w-3" /> {rec.expected_improvement}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs leading-normal">
                      <p className="text-foreground/90 font-medium">{rec.action}</p>
                      <p className="text-emerald-400/90 font-semibold">Benefits: {rec.benefits}</p>
                      <p className="text-amber-500/90 font-semibold">Risks: {rec.risks}</p>
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> Effort: <span className="text-foreground">{rec.estimated_effort}</span></span>
                    <span className="text-foreground/80 flex items-center gap-1 cursor-pointer" onClick={() => handleLocateTarget(rec.target)}>Locate File <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────────────────────
            EXECUTIVE DASHBOARD (FEATURE 11 & 12 MANAGER VIEW)
            ────────────────────────────────────────────────────────────────────── */
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: Executive Overview overall health gauge */}
            <div className="rounded-2xl border bg-background/40 p-5 shadow-sm border-border/70 backdrop-blur-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Overall Health Score</span>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative flex items-center justify-center">
                    <svg className="h-32 w-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        className="stroke-indigo-500 transition-all duration-500 ease-out"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={339}
                        strokeDashoffset={339 - (339 * executiveDashboard.overall_health) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center leading-none">
                      <span className="text-4xl font-black text-foreground">{executiveDashboard.overall_health}%</span>
                      <span className="text-[10px] font-bold text-muted-foreground mt-1">Repository Target</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground font-medium text-center flex items-center justify-center gap-1.5 border-t pt-3 border-border/40">
                <ShieldAlert className="h-4 w-4 text-indigo-500 animate-pulse" /> Engineering Manager Dashboard
              </div>
            </div>

            {/* Card 2: Cost of Delay Calculator (Feature 11) */}
            <div className="rounded-2xl border bg-gradient-to-br from-indigo-500/5 to-primary/5 p-6 shadow-sm border-indigo-500/10 backdrop-blur-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-1.5 border-b border-indigo-500/15 pb-2.5 mb-4">
                  <DollarSign className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Cost of Delay Calculator</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center border-b border-indigo-500/5 pb-2">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-indigo-400" /> Time Lost due to Debt:</span>
                    <span className="font-extrabold text-foreground">{costOfDelay.time_lost_per_sprint}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-indigo-500/5 pb-2">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5 text-red-400" /> Estimated Bug Probability:</span>
                    <span className="font-extrabold text-red-400">{costOfDelay.bug_probability}%</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-indigo-500/5 pb-2">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5"><Wrench className="h-3.5 w-3.5 text-indigo-400" /> Recommended Refactoring Effort:</span>
                    <span className="font-extrabold text-foreground">{costOfDelay.refactoring_effort}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Long-term Maintenance Cost:</span>
                    <span className="font-extrabold text-emerald-400">{costOfDelay.long_term_maintenance_cost}</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground leading-normal mt-4 border-t pt-2 border-indigo-500/10">
                Calculated dynamically based on codebase size and static complexity density.
              </p>
            </div>

            {/* Card 3: Team Debt Distribution Split */}
            <div className="rounded-2xl border bg-background/40 p-6 shadow-sm border-border/70 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b border-border/55 pb-2.5">
                <Users className="h-4.5 w-4.5 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Team Debt Distribution</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                {Object.entries(executiveDashboard.team_debt_distribution).map(([subsystem, val]) => (
                  <div key={subsystem} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground/80">{subsystem}</span>
                      <span className="font-mono font-bold text-indigo-400">{Math.round(val)}%</span>
                    </div>
                    {/* Visual Progress bar */}
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          val > 60 ? "bg-red-500/70" : val > 40 ? "bg-orange-500/70" : "bg-emerald-500/70"
                        )}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Top 10 Risky Services list table */}
            <div className="rounded-2xl border bg-background/40 p-6 shadow-sm border-border/70 backdrop-blur-sm lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-border/55 pb-2.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Top 10 Risky Services / Files</h3>
                <span className="text-[10px] font-bold text-red-500 animate-pulse uppercase tracking-wider">Critical list</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase tracking-wider font-bold text-[10px]">
                      <th className="py-2.5">Service File Path</th>
                      <th className="py-2.5 text-center">Risk Score</th>
                      <th className="py-2.5 text-center">Git Churn</th>
                      <th className="py-2.5 text-center">Complexity</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executiveDashboard.top_risky_services.map((srv, idx) => (
                      <tr key={idx} className="border-b border-border/40 hover:bg-card/40 transition-colors">
                        <td className="py-3 font-mono font-semibold max-w-[280px] truncate text-foreground/90">{srv.file_path}</td>
                        <td className="py-3 text-center">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", srv.risk_score > 80 ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20")}>
                            {srv.risk_score}%
                          </span>
                        </td>
                        <td className="py-3 text-center font-bold text-foreground/80">{srv.changes} commits</td>
                        <td className="py-3 text-center font-bold text-foreground/80">{srv.complexity}</td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleLocateTarget(srv.file_path)} className="h-7 w-7 hover:bg-muted text-primary">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* High Priority Fixes */}
            <div className="rounded-2xl border bg-background/40 p-6 shadow-sm border-border/70 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b border-border/55 pb-2.5">
                <AlertOctagon className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">High-Priority Fixes</h3>
              </div>

              <div className="space-y-4">
                {executiveDashboard.high_priority_fixes.map((fix, idx) => (
                  <div key={idx} className="rounded-xl border border-red-500/15 bg-red-500/5 p-4 space-y-2 hover:bg-red-500/10 transition-colors">
                    <div className="flex items-center justify-between border-b border-red-500/10 pb-2">
                      <span className="text-xs font-black text-red-400 hover:underline cursor-pointer" onClick={() => handleLocateTarget(fix.file_path)}>
                        {fix.file_path.split('/').pop()}
                      </span>
                      <span className="rounded bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        {fix.risk_level}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80 leading-normal">{fix.action}</p>
                    <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 pt-1 border-t border-red-500/5">
                      <TrendingUp className="h-3.5 w-3.5" /> Expected Improvement: {fix.expected_improvement}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
