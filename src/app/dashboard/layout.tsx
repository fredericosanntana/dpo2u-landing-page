'use client';

/**
 * Dashboard Layout v2.0
 * Modern layout with collapsible sidebar, glassmorphism design and DPO2U branding
 */

import React, { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  Home,
  BarChart3,
  Users,
  Shield,
  Settings,
  Activity,
  Brain,
  Bell,
  Search,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Metadata is handled by the app-level layout for client components

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3, current: true },
  { name: 'Agentes', href: '/dashboard/agents', icon: Users, current: false },
  { name: 'Segurança', href: '/dashboard/security', icon: Shield, current: false },
  { name: 'Sistema', href: '/dashboard/system', icon: Activity, current: false },
  { name: 'Auto-Healing', href: '/dashboard/healing', icon: Zap, current: false },
  { name: 'Configurações', href: '/dashboard/settings', icon: Settings, current: false },
];

function DashboardSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <div className={`${
      collapsed ? 'w-16' : 'w-64'
    } bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/50 flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">DPO2U</h2>
              <p className="text-xs text-slate-400">Command Center</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* System Status */}
      {!collapsed && (
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Status do Sistema</span>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Online
            </Badge>
          </div>
          <div className="text-xs text-slate-500">
            <div>38 Agentes • 32 Ativos</div>
            <div>Saúde: 97.8%</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent'
                  } flex items-center px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 group`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                  {collapsed && (
                    <span className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700/50">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-slate-400 truncate">Sistema DPO2U</p>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center group relative">
              <User className="h-4 w-4 text-white" />
              <span className="absolute left-10 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                Admin
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden text-white hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar agentes, métricas..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-80"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 relative"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>
          
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">Sistema Online</p>
            <p className="text-xs text-slate-300">Última atualização: agora</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {/* Background with glassmorphism effect */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-screen">
          <DashboardSidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="w-64 p-0 bg-slate-900 border-slate-700">
              <DashboardSidebar collapsed={false} onToggle={() => {}} />
            </SheetContent>
          </Sheet>
          
          <main className="p-4">
            {children}
          </main>
        </div>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}