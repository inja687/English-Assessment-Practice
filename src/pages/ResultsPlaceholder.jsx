import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';
import RecentAttempts from '../components/RecentAttempts';
import { getAttempts, clearAttempts } from '../utils/storage';

export default function ResultsPlaceholder() {
  const [attempts, setAttempts] = useState(() => getAttempts());

  const handleClear = () => {
    if (window.confirm('Clear all stored test results?')) {
      clearAttempts();
      setAttempts([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-slate-700">
          Performance Records
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Diagnostic Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Assessment Results & Practice Logs
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Track your voice clarity scores, timing efficiency across Sections A through E, and observe progress toward your target score over time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
            >
              <span>Take Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Scoring Matrix Preview */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Voice Evaluation Competency Matrix (Planned Assessment Metrics)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Oral Fluency', weight: '25%', desc: 'Smooth rhythm & minimal pausing' },
              { label: 'Pronunciation', weight: '25%', desc: 'Clear vowel & consonant articulation' },
              { label: 'Sentence Recall', weight: '20%', desc: 'Exact wording in Section B' },
              { label: 'Grammar & Syntax', weight: '15%', desc: 'Correct structural word order' },
              { label: 'Passage Synthesis', weight: '15%', desc: 'Coherent storytelling & logic' },
            ].map((metric, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">{metric.label}</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {metric.weight}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{metric.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attempts List or Honest Empty State */}
      <RecentAttempts attempts={attempts} onClear={handleClear} />
    </div>
  );
}
