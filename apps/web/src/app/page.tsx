import * as React from 'react';
import { Activity, ShieldCheck, CheckCircle, Server, AlertTriangle } from 'lucide-react';

export default function Home() {
  const stats = [
    {
      name: 'API Gateway',
      value: 'Healthy',
      description: 'Response time: 14ms',
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      name: 'Database Cluster',
      value: 'Connected',
      description: 'Active pool: 12 nodes',
      icon: Server,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      name: 'Security Checks',
      value: 'Passing',
      description: '0 vulnerable points detected',
      icon: ShieldCheck,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      name: 'System Uptime',
      value: '99.98%',
      description: 'No outages in 30 days',
      icon: CheckCircle,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  const recentIncidents = [
    {
      id: 'INC-9382',
      title: 'API Rate limiting trigger',
      status: 'Resolved',
      severity: 'Low',
      time: '2 hours ago',
    },
    {
      id: 'INC-9379',
      title: 'Database index maintenance',
      status: 'Completed',
      severity: 'Info',
      time: '5 hours ago',
    },
    {
      id: 'INC-9372',
      title: 'SSL Certificate auto-renewal',
      status: 'Completed',
      severity: 'Info',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Overview</h2>
        <p className="text-muted-foreground mt-1">
          Monitor your microservices, database clusters, and system integrity in real-time.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.name}</span>
              <div className={`rounded-lg p-2 ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Details Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Operations Logs */}
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground">Recent Maintenance & Events</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Historical log of recent automated tasks and incidents.
          </p>

          <div className="mt-6 divide-y">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-muted-foreground bg-accent px-2 py-0.5 rounded">
                      {incident.id}
                    </span>
                    <span className="text-sm font-medium text-foreground">{incident.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{incident.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      incident.severity === 'Low'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-blue-500/10 text-blue-500'
                    }`}
                  >
                    {incident.severity}
                  </span>
                  <span className="text-sm font-semibold text-emerald-500">{incident.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Card */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Operational Status</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Current workspace environment details.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Environment:</span>
                <span className="font-medium text-foreground font-mono">local</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Region:</span>
                <span className="font-medium text-foreground font-mono">localhost</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Core Services:</span>
                <span className="font-semibold text-emerald-500">Online</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>All backend instances running on local ports.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
