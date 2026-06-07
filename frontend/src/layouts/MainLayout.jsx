import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquarePlus, History, BarChart3, Brain } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Analyze', href: '/analyze', icon: MessageSquarePlus },
  { name: 'History', href: '/history', icon: History },
  { name: 'Evaluation', href: '/evaluation', icon: BarChart3 },
];

export default function MainLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-bg flex text-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-brand-border flex flex-col fixed h-full z-10">
        {/* Brand Logo Header */}
        <div className="h-20 flex items-center px-8 border-b border-brand-border gap-3">
          <div className="bg-brand-primary/10 p-2 rounded-medium text-brand-primary">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand-primary leading-none m-0">
              SentiLens
            </h1>
            <span className="text-[10px] text-brand-text-secondary font-medium tracking-wider uppercase">
              NLP Analysis
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-medium text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-card'
                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-brand-border text-center">
          <p className="text-xs text-[#64748B] font-medium">SentiLens v1.0.0</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">Turning Reviews into Insights</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-[280px] min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="h-20 border-b border-brand-border bg-white flex items-center justify-between px-10 sticky top-0 z-0">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {navigation.find((item) => item.href === location.pathname)?.name || 'SentiLens'}
          </h2>
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-positive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-positive"></span>
            </span>
            <span className="text-xs font-semibold text-[#64748B]">Model Online</span>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-10 flex-1 overflow-y-auto max-w-[1400px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
