import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', badge }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50/80',
      text: 'text-blue-600',
      border: 'border-blue-100',
      gradient: 'from-blue-500/10 to-indigo-500/5',
      indicator: 'bg-blue-500',
    },
    emerald: {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      gradient: 'from-emerald-500/10 to-teal-500/5',
      indicator: 'bg-emerald-500',
    },
    indigo: {
      bg: 'bg-indigo-50/80',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      gradient: 'from-indigo-500/10 to-purple-500/5',
      indicator: 'bg-indigo-500',
    },
    amber: {
      bg: 'bg-amber-50/80',
      text: 'text-amber-600',
      border: 'border-amber-100',
      gradient: 'from-amber-500/10 to-orange-500/5',
      indicator: 'bg-amber-500',
    },
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between group`}>
      {/* Subtle background glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>

      <div className="relative z-10 flex-1 min-w-0 pr-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.indicator}`}></span>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
        </div>

        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {value}
          </span>
          {badge && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 font-medium truncate">
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`relative z-10 p-3 rounded-xl ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} border shadow-2xs group-hover:scale-105 transition-transform duration-300 shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
