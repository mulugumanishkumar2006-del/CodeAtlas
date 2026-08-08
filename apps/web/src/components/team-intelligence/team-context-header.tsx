'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  GitBranch,
  Server,
  Code2,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Zap,
  Lock,
  Layers,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HierarchyLevel {
  label: string;
  type: 'Organization' | 'Team' | 'Repository' | 'Service' | 'Component' | 'Code';
  icon: React.ElementType;
  value: string;
  options: string[];
}

interface TeamContextHeaderProps {
  organizationName?: string;
  teamName?: string;
  onSelectLevel?: (type: string, value: string) => void;
  onOpenCommandPalette?: () => void;
}

export function TeamContextHeader({
  organizationName = 'Acme Enterprise',
  teamName = 'Payments Platform Team',
  onSelectLevel,
  onOpenCommandPalette,
}: TeamContextHeaderProps) {
  const [activeOrg, setActiveOrg] = useState(organizationName);
  const [activeTeam, setActiveTeam] = useState(teamName);
  const [activeRepo, setActiveRepo] = useState('payment-processing-core');
  const [activeService, setActiveService] = useState('PaymentProcessingEngine');
  const [activeComponent, setActiveComponent] = useState('StripeIdempotencyConnector');
  const [activeCode, setActiveCode] = useState('stripe_client.go');

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const hierarchy: HierarchyLevel[] = [
    {
      label: 'Organization',
      type: 'Organization',
      icon: Building2,
      value: activeOrg,
      options: ['Acme Enterprise', 'Global Financial Systems', 'Core Bank Tech'],
    },
    {
      label: 'Team',
      type: 'Team',
      icon: Users,
      value: activeTeam,
      options: ['Payments Platform Team', 'Platform Security Team', 'Billing Subscriptions Team', 'Frontend Experience Team'],
    },
    {
      label: 'Repository',
      type: 'Repository',
      icon: GitBranch,
      value: activeRepo,
      options: ['payment-processing-core', 'auth-gateway-service', 'billing-invoice-engine', 'enterprise-common-utils'],
    },
    {
      label: 'Service',
      type: 'Service',
      icon: Server,
      value: activeService,
      options: ['PaymentProcessingEngine', 'AuthGatewayService', 'BillingInvoiceEngine', 'TokenVaultService'],
    },
    {
      label: 'Component',
      type: 'Component',
      icon: Layers,
      value: activeComponent,
      options: ['StripeIdempotencyConnector', 'OAuthTokenValidator', 'TaxInvoicePdfGenerator', 'SecVaultClient'],
    },
    {
      label: 'Code',
      type: 'Code',
      icon: Code2,
      value: activeCode,
      options: ['stripe_client.go', 'oauth_guard.ts', 'pdf_generator.py', 'vault_crypto.ts'],
    },
  ];

  const handleSelect = (type: string, option: string) => {
    if (type === 'Organization') setActiveOrg(option);
    if (type === 'Team') setActiveTeam(option);
    if (type === 'Repository') setActiveRepo(option);
    if (type === 'Service') setActiveService(option);
    if (type === 'Component') setActiveComponent(option);
    if (type === 'Code') setActiveCode(option);

    setOpenDropdown(null);
    if (onSelectLevel) onSelectLevel(type, option);
  };

  return (
    <div className="w-full bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between font-sans shrink-0 backdrop-blur-xl z-20">
      {/* Breadcrumb Hierarchy Context Path */}
      <div className="flex items-center flex-wrap gap-1 text-xs">
        {hierarchy.map((item, idx) => {
          const Icon = item.icon;
          const isOpen = openDropdown === item.type;

          return (
            <React.Fragment key={item.type}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}

              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : item.type)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all font-mono group"
                  title={`Switch ${item.label}`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold tracking-wider hidden md:inline">
                    {item.label}:
                  </span>
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-200">{item.value}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </button>

                {/* Dropdown Options Menu */}
                {isOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-60 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 p-1 space-y-0.5 animate-in fade-in duration-100 font-mono text-xs">
                    <div className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b border-slate-800/80 flex items-center justify-between">
                      <span>Select {item.label}</span>
                      <span className="text-[9px] text-cyan-400">Context Switch</span>
                    </div>
                    {item.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelect(item.type, option)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                          item.value === option
                            ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{option}</span>
                        {item.value === option && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right Controls: Strict Privacy Mandate Badge & Command Palette */}
      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40 text-xs transition-all font-mono"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cmd+K Team Actions</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>System & Team Flow Only • Zero Employee Rankings</span>
        </div>
      </div>
    </div>
  );
}
