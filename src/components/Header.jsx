import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  BarChart3, 
  Settings as SettingsIcon, 
  Menu, 
  X, 
  Headphones,
  Code2
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/sections', label: 'Practice Sections', icon: Layers },
    { to: '/results', label: 'Results', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Subtitle */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 transition"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-400/30 group-hover:from-blue-500 group-hover:to-indigo-600 transition">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-blue-200 transition">
                  English Assessment Practice
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Personal Mock Test Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || 
                (item.to === '/sections' && location.pathname.startsWith('/practice'));

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 border border-slate-700/80 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Status Badge & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 bg-slate-800/90 border border-slate-700/80 shadow-2xs">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Developed By <strong className="text-white font-semibold">Injamamul</strong></span>
            </div>

            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 shadow-sm"
              title="Autonomous Practice Mode - Offline Local Session"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Practice Mode</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="sm:hidden inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Practice</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to ||
              (item.to === '/sections' && location.pathname.startsWith('/practice'));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-slate-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          
          <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between px-3 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Developed By Injamamul</span>
            <span className="text-emerald-400 font-medium">Practice Mode Active</span>
          </div>
        </div>
      )}
    </header>
  );
}
