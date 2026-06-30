'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAuthPage = pathname?.startsWith('/login');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar Component */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold tracking-tight text-foreground lg:text-xl">
                Control Panel
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 border-r pr-4 mr-2">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="h-8 w-8 rounded-full border bg-muted"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full border bg-muted flex items-center justify-center">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-foreground">
                      {user.name || user.username}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">@{user.username}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    title="Log out"
                    className="h-8 w-8 ml-2 text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>

          {/* Dynamic Content */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
