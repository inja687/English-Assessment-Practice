import React from 'react';
import { ShieldCheck, Headphones, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-500 text-xs py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-700">English Assessment Practice</span>
            <span className="text-slate-400">|</span>
            <span>Personal Mock Test Portal</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-slate-500">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/90 font-medium text-xs shadow-2xs">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Developed By <strong className="font-bold text-blue-900">Injamamul</strong></span>
            </div>

            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Independent Practice Tool (Offline Storage)</span>
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-400">
          <span>This portal is designed for personal speaking practice and voice assessment preparation. All data is stored locally in your browser.</span>
          <span className="font-medium text-slate-600 shrink-0">
            Developed By <span className="font-bold text-slate-800">Injamamul</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
