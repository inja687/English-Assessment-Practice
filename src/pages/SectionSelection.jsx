import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layers, 
  ArrowLeft,
  Lock
} from 'lucide-react';
import SectionCard from '../components/SectionCard';
import { ASSESSMENT_SECTIONS, ASSESSMENT_SUMMARY } from '../data/sections';

export default function SectionSelection() {
  const [filter, setFilter] = useState('all');
  const location = useLocation();
  const lockedNotice = location.state?.lockedMessage;

  const filteredSections = ASSESSMENT_SECTIONS.filter((section) => {
    if (filter === 'all') return true;
    if (filter === 'short') return section.questionCount <= 10;
    if (filter === 'long') return section.questionCount > 10;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Locked Section Notice Banner */}
      {lockedNotice && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block font-bold">Sequential Assessment Access Notice</strong>
            <span>{lockedNotice}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-slate-700">
          Module Practice
        </span>
      </div>

      {/* Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Modular Training Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Practice Individual Sections
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Target individual skills to strengthen specific weak points before attempting the complete 55-minute assessment. Each module reproduces the exact question cadence and timing of that section.
            </p>
          </div>

          {/* Quick stats badge */}
          <div className="flex items-center justify-around sm:justify-center gap-2 sm:gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 w-full md:w-auto shrink-0">
            <div className="text-center px-1 sm:px-2">
              <span className="block text-2xl font-black text-slate-900">{ASSESSMENT_SUMMARY.totalSections}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sections</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-blue-600">{ASSESSMENT_SUMMARY.totalQuestions}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Questions</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-indigo-600">{ASSESSMENT_SUMMARY.totalMinutes}m</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Duration</span>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Filter by:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Sections (5)
            </button>
            <button
              onClick={() => setFilter('short')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'short'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Short Drills (≤ 10 Questions)
            </button>
            <button
              onClick={() => setFilter('long')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === 'long'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Extended Drills (&gt; 10 Questions)
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredSections.length} of {ASSESSMENT_SECTIONS.length} sections
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
